"""Sends each parent's reminders to their phone through the notify service picked for them.

A leave reminder goes to the driver a set time before each drive leaves, and to each kid in
the car who has a phone set up, saying when they leave or get picked up. An alert about rides
nobody is driving yet, in the next few hours (six by default), goes to both parents. What has been sent is
kept, so a restart doesn't send it again. A reminder that came due while Home Assistant was
off is still sent if the drive hasn't left yet.
"""

from __future__ import annotations

import asyncio
from collections.abc import Callable, Mapping, Sequence
from datetime import datetime, timedelta
import logging
from typing import Any, Final

from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.event import async_track_point_in_time
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .const import DOMAIN, DRIVERS
from .google import GoogleCalendarApi, GoogleConflict, GoogleError
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
from .settings import ReminderSettings
from .week import DayInput

_LOGGER = logging.getLogger(__name__)

STORE_VERSION: Final = 1
SAVE_DELAY: Final = 10
MOVED_EARLIER: Final = timedelta(minutes=5)
"""A drive that now leaves at least this much earlier than it did is reminded again."""
NOTIFY: Final = "notify"


class Notifier:
    """Works out which reminders are due whenever the plan changes, and sends them."""

    def __init__(self, hass: HomeAssistant, settings: ReminderSettings) -> None:
        self.hass = hass
        self.settings = settings
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
        self._sent_leave = {str(k): str(v) for k, v in leave.items()} if isinstance(leave, dict) else {}
        self._sent_missing = {str(k) for k in missing} if isinstance(missing, list) else set()

    @callback
    def async_plan_updated(self, days: Sequence[Mapping[str, Any]]) -> None:
        """Take a new plan, send whatever is due now, and wait for the next one."""
        if not self.active:
            return
        tz = dt_util.get_default_time_zone()
        self._reminders = leave_reminders(days, DRIVERS, self.settings.notify, self.settings.before, tz)
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
                self._send(r.who, r.title, r.message, f"{DOMAIN}-{r.key}")
        new = [m for m in self._missing if m.key not in self._sent_missing and m.when > now]
        if new:
            self._sent_missing.update(m.key for m in new)
            title, message = missing_message(new)
            for driver in DRIVERS:
                if driver in self.settings.notify:
                    self._send(driver, title, message, f"{DOMAIN}-no-driver")
        upcoming = [r.at for r in self._reminders if r.at > now and not self._reminded(r)]
        self.async_stop()
        if upcoming:
            self._timer = async_track_point_in_time(self.hass, self._check, min(upcoming))
        self._forget_old(now)
        self._store.async_delay_save(self._data, SAVE_DELAY)

    def _reminded(self, r: LeaveReminder) -> bool:
        sent = self._sent_leave.get(r.key)
        return sent is not None and r.leave > datetime.fromisoformat(sent) - MOVED_EARLIER

    def _forget_old(self, now: datetime) -> None:
        today = now.date().isoformat()
        self._sent_leave = {k: v for k, v in self._sent_leave.items() if k[:10] >= today}
        self._sent_missing = {k for k in self._sent_missing if k[:10] >= today}

    def _data(self) -> dict[str, Any]:
        return {"leave": dict(self._sent_leave), "missing": sorted(self._sent_missing)}

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
