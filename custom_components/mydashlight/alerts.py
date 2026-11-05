"""Sends each parent's reminders to their phone through the notify service picked for them.

A leave reminder goes to the driver a set time before each drive leaves, and to each kid in
the car who has a phone set up, saying when they leave or get picked up. An alert about rides
nobody is driving yet, in the next few hours (six by default), goes to both parents. What has been sent is
kept, so a restart doesn't send it again. A reminder that came due while Home Assistant was
off is still sent if the drive hasn't left yet.

When a parent's person is picked in the options, their phone's location is checked too (see
:mod:`.location`), and only that parent is told what it shows.
"""

from __future__ import annotations

import asyncio
from collections.abc import Callable, Mapping, Sequence
from datetime import datetime, timedelta
import logging
from typing import Any, Final

from homeassistant.const import ATTR_GPS_ACCURACY, ATTR_LATITUDE, ATTR_LONGITUDE, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.event import async_track_point_in_time
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .const import DOMAIN, DRIVERS
from .google import GoogleCalendarApi, GoogleConflict, GoogleError
from .location import Going, Position, at_start, goings, not_left, off_course, reminder_from_here, running_late
from .lookups import RoutesLookups
from .planner import HOME
from .reminders import (
    LeaveReminder,
    MissingRide,
    ReminderWrite,
    calendar_reminders,
    leave_reminders,
    missing_message,
    missing_rides,
    reminder_writes,
)
from .routes import Place, Spot
from .settings import ReminderSettings
from .travel import place_for
from .week import DayInput, WeekInput

_LOGGER = logging.getLogger(__name__)

STORE_VERSION: Final = 1
SAVE_DELAY: Final = 10
MOVED_EARLIER: Final = timedelta(minutes=5)
"""A drive that now leaves at least this much earlier than it did is reminded again."""
NOTIFY: Final = "notify"


class Notifier:
    """Works out which reminders are due whenever the plan changes, and sends them."""

    def __init__(
        self, hass: HomeAssistant, settings: ReminderSettings, lookups: RoutesLookups | None = None, grace: int = 5
    ) -> None:
        self.hass = hass
        self.settings = settings
        self.lookups = lookups
        self.grace = timedelta(minutes=grace)
        """How long after leave time a driver still at the start is told: the arrive-early margin."""
        self._goings: dict[str, Going] = {}
        """The drives whose driver's location is checked, by their leave reminder's key."""
        self._sent_going: dict[str, str] = {}
        """When each checked drive was to leave, by key."""
        self._week: WeekInput | None = None
        self._store: Store[dict[str, Any]] = Store(hass, STORE_VERSION, f"{DOMAIN}.reminders")
        self._sent_leave: dict[str, str] = {}
        """When each reminded drive was to leave, by reminder key."""
        self._sent_missing: set[str] = set()
        self._reminders: list[LeaveReminder] = []
        self._missing: list[MissingRide] = []
        self._timer: Callable[[], None] | None = None
        self._warned: set[str] = set()

    @property
    def active(self) -> bool:
        return bool(self.settings.notify)

    async def async_load(self) -> None:
        data = await self._store.async_load() or {}
        leave = data.get("leave")
        missing = data.get("missing")
        going = data.get("going")
        self._sent_leave = {str(k): str(v) for k, v in leave.items()} if isinstance(leave, dict) else {}
        self._sent_going = {str(k): str(v) for k, v in going.items()} if isinstance(going, dict) else {}
        self._sent_missing = {str(k) for k in missing} if isinstance(missing, list) else set()

    @callback
    def async_plan_updated(self, days: Sequence[Mapping[str, Any]], week: WeekInput | None = None) -> None:
        """Take a new plan, send whatever is due now, and wait for the next one."""
        if not self.active:
            return
        tz = dt_util.get_default_time_zone()
        self._reminders = leave_reminders(days, DRIVERS, self.settings.notify, self.settings.before, tz)
        self._week = week
        tracked = [d for d in self.settings.people if d in self.settings.notify]
        located = self.lookups is not None and week is not None
        self._goings = {g.key: g for g in goings(days, DRIVERS, tracked, tz)} if located else {}
        ahead = timedelta(hours=self.settings.no_driver_hours)
        self._missing = missing_rides(days, dt_util.now(tz), tz, ahead) if self.settings.no_driver_alerts else []
        self._check()

    @callback
    def async_stop(self) -> None:
        if self._timer is not None:
            self._timer()
            self._timer = None

    @callback
    def _check(self, _now: datetime | None = None) -> None:
        self._timer = None
        now = dt_util.now()
        for r in self._reminders:
            if r.at <= now < r.leave and not self._reminded(r):
                self._sent_leave[r.key] = r.leave.isoformat()
                going = self._goings.get(r.key) if r.who in DRIVERS else None
                if going is None:
                    self._send(r.who, r.title, r.message, f"{DOMAIN}-{r.key}")
                else:
                    self.hass.async_create_task(self._async_remind(r, going), eager_start=True)
        for g in self._goings.values():
            if g.leave + self.grace <= now < g.due and not self._went(g):
                self._sent_going[g.key] = g.leave.isoformat()
                self.hass.async_create_task(self._async_check_going(g), eager_start=True)
        new = [m for m in self._missing if m.key not in self._sent_missing and m.when > now]
        if new:
            self._sent_missing.update(m.key for m in new)
            title, message = missing_message(new)
            for driver in DRIVERS:
                if driver in self.settings.notify:
                    self._send(driver, title, message, f"{DOMAIN}-no-driver")
        upcoming = [r.at for r in self._reminders if r.at > now and not self._reminded(r)]
        upcoming += [g.leave + self.grace for g in self._goings.values() if g.leave + self.grace > now]
        self.async_stop()
        if upcoming:
            self._timer = async_track_point_in_time(self.hass, self._check, min(upcoming))
        self._forget_old(now)
        self._store.async_delay_save(self._data, SAVE_DELAY)

    def _reminded(self, r: LeaveReminder) -> bool:
        sent = self._sent_leave.get(r.key)
        return sent is not None and r.leave > datetime.fromisoformat(sent) - MOVED_EARLIER

    def _went(self, g: Going) -> bool:
        """Whether this drive was checked already. A drive that moves is checked again."""
        sent = self._sent_going.get(g.key)
        return sent is not None and abs(g.leave - datetime.fromisoformat(sent)) < MOVED_EARLIER

    def _forget_old(self, now: datetime) -> None:
        today = now.date().isoformat()
        self._sent_leave = {k: v for k, v in self._sent_leave.items() if k[:10] >= today}
        self._sent_going = {k: v for k, v in self._sent_going.items() if k[:10] >= today}
        self._sent_missing = {k for k in self._sent_missing if k[:10] >= today}

    def _data(self) -> dict[str, Any]:
        return {"leave": dict(self._sent_leave), "going": dict(self._sent_going), "missing": sorted(self._sent_missing)}

    async def _async_remind(self, r: LeaveReminder, g: Going) -> None:
        """The leave reminder, saying when to leave from where the driver really is."""
        title, message = r.title, r.message
        now = dt_util.now()
        minutes = await self._async_minutes_off_course(g, now)
        if minutes is not None:
            better = reminder_from_here(g, minutes, now, dt_util.get_default_time_zone())
            if better is not None:
                title, message = better[0], f"{better[1]}\n{message}"
        self._send(r.who, title, message, f"{DOMAIN}-{r.key}")

    async def _async_check_going(self, g: Going) -> None:
        """The arrive-early margin after leave time: tell a driver who hasn't left, or who went
        another way and will now be late."""
        tz = dt_util.get_default_time_zone()
        now = dt_util.now()
        pos = self._position(g.driver)
        if pos is None:
            return
        start = await self._async_spot(g.from_loc, now)
        here = at_start(pos, start, g.from_loc == HOME)
        if here:
            title, message = not_left(g, tz)
            self._send(g.driver, title, message, f"{DOMAIN}-{g.key}-going")
            return
        if here is None:
            return
        minutes = await self._async_minutes_off_course(g, now, pos, start)
        late = running_late(g, minutes, now, tz) if minutes is not None else None
        if late is not None:
            self._send(g.driver, late[0], late[1], f"{DOMAIN}-{g.key}-going")

    async def _async_minutes_off_course(
        self, g: Going, now: datetime, pos: Position | None = None, start: Spot | None = None
    ) -> float | None:
        """Minutes to drive to the first stop from where the driver is, when that's farther
        from it than the drive's start. None when they're where the plan expects, or there's
        no telling. Only then is Google asked."""
        if g.via_home or self.lookups is None:
            return None
        pos = pos or self._position(g.driver)
        if pos is None or pos.spot is None:
            return None
        start = start or await self._async_spot(g.from_loc, now)
        if start is None or at_start(pos, start, g.from_loc == HOME):
            return None
        target = await self._async_spot(g.to_loc, now)
        place = self._place(g.to_loc)
        if target is None or place is None or not off_course(pos, start, target):
            return None
        return await self.lookups.async_drive_from(pos.spot, g.to_loc, place, now)

    def _position(self, driver: str) -> Position | None:
        entity = self.settings.people.get(driver)
        state = self.hass.states.get(entity) if entity else None
        if state is None or state.state in (STATE_UNKNOWN, STATE_UNAVAILABLE):
            return None
        lat, lon = state.attributes.get(ATTR_LATITUDE), state.attributes.get(ATTR_LONGITUDE)
        spot = (float(lat), float(lon)) if isinstance(lat, (int, float)) and isinstance(lon, (int, float)) else None
        accuracy = state.attributes.get(ATTR_GPS_ACCURACY)
        return Position(
            spot=spot,
            accuracy=float(accuracy) if isinstance(accuracy, (int, float)) else 0.0,
            zone=state.state,
        )

    def _place(self, key: str) -> Place | None:
        if self._week is None or self.lookups is None:
            return None
        home = self.lookups.home
        return place_for(self._week, key, home) if home is not None else None

    async def _async_spot(self, key: str, now: datetime) -> Spot | None:
        if self.lookups is None:
            return None
        if (found := self.lookups.spot(key)) is not None:
            return found
        place = self._place(key)
        return await self.lookups.async_locate(key, place, now) if place is not None else None

    @callback
    def _send(self, who: str, title: str, message: str, tag: str) -> None:
        service = self.settings.notify[who]
        if not self.hass.services.has_service(NOTIFY, service):
            if service not in self._warned:
                self._warned.add(service)
                _LOGGER.warning(
                    "The notify service notify.%s doesn't exist, so a MyDashLight reminder wasn't sent. "
                    "Pick another one in the MyDashLight options under Reminders",
                    service,
                )
            return
        self._warned.discard(service)
        data: dict[str, Any] = {"title": title, "message": message}
        if service.startswith("mobile_app_"):
            # The same tag replaces the last notification instead of stacking another.
            data["data"] = {"tag": tag, "group": DOMAIN}
        self.hass.async_create_task(self._async_call(service, data), eager_start=True)

    async def _async_call(self, service: str, data: dict[str, Any]) -> None:
        try:
            await self.hass.services.async_call(NOTIFY, service, data, blocking=True)
        except (HomeAssistantError, vol.Invalid) as err:
            _LOGGER.warning("Couldn't send a MyDashLight reminder with notify.%s: %s", service, err)


class CalendarReminders:
    """Keeps a Google Calendar reminder on the first drop-off of each drive.

    It goes off the same time before the drive leaves as the phone reminder. The reminder
    is the signed-in Google account's, since Google keeps reminders per person. Pick-ups get
    none, because Google only reminds before an event starts.
    """

    def __init__(self, hass: HomeAssistant, api: GoogleCalendarApi, lock: asyncio.Lock, settings: ReminderSettings):
        self.hass = hass
        self.api = api
        self.lock = lock
        self.settings = settings
        self._written: dict[tuple[str, str], tuple[int | None, str]] = {}
        """What was last saved on each event, and its etag after, so an update that read the
        calendars before the save landed doesn't save it again."""
        self._task: asyncio.Task[None] | None = None
        self._failing: set[str] = set()

    @callback
    def async_plan_updated(self, days: Sequence[Mapping[str, Any]], week: Sequence[DayInput]) -> None:
        if self._task is not None and not self._task.done():
            return  # The next update catches anything this one would have.
        tz = dt_util.get_default_time_zone()
        wanted = calendar_reminders(days, DRIVERS, self.settings.before) if self.settings.calendar else {}
        writes = [
            w
            for w in reminder_writes(week, wanted, dt_util.now(tz), tz)
            if self._written.get((w.calendar_id, w.event_id)) != (w.minutes, w.etag)
        ]
        if writes:
            self._task = self.hass.async_create_background_task(self._async_save(writes), f"{DOMAIN} reminders")

    @callback
    def async_stop(self) -> None:
        if self._task is not None:
            self._task.cancel()

    async def _async_save(self, writes: list[ReminderWrite]) -> None:
        async with self.lock:
            for w in writes:
                try:
                    etag = await self.api.async_set_reminder(w.calendar_id, w.event_id, w.etag, w.minutes, w.private)
                except GoogleConflict:
                    continue  # Changed since it was read. The next update reads it again.
                except GoogleError as err:
                    if w.calendar_id not in self._failing:
                        self._failing.add(w.calendar_id)
                        _LOGGER.warning("Couldn't save a ride reminder in Google Calendar: %s", err)
                    continue
                self._failing.discard(w.calendar_id)
                self._written[(w.calendar_id, w.event_id)] = (w.minutes, etag)


async def async_remove_sent(hass: HomeAssistant) -> None:
    """Forget which reminders were sent, when MyDashLight is removed."""
    await Store[dict[str, Any]](hass, STORE_VERSION, f"{DOMAIN}.reminders").async_remove()


def notify_services(hass: HomeAssistant) -> list[str]:
    """The notify services a reminder can go to, such as each phone with the companion app."""
    return sorted(s for s in hass.services.async_services_for_domain(NOTIFY) if s != "send_message")
