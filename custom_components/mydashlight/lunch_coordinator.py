"""Reads each kid's calendar for school days off and lunch picks, and saves picks.

The kids' calendars are read from the first of this month to the end of next month, so the
Lunch tab can show both months and the chore engine knows the school days it plans for.
"""

from __future__ import annotations

import asyncio
from collections.abc import Awaitable, Callable, Iterable
from datetime import date, datetime, time, timedelta
import logging
from typing import TYPE_CHECKING, Any

from aiohttp import ClientError, ClientSession, ClientTimeout
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .chore_rules import next_month
from .const import DOMAIN, LUNCH_UPDATE_SECONDS
from .google import (
    CalendarEvent,
    GoogleApiDisabled,
    GoogleAuthError,
    GoogleCalendarApi,
    GoogleCalendarUnavailable,
    GoogleConflict,
    GoogleError,
)
from .menu_feed import FeedMenu, feed_changes, feed_menus, read_feed, webcal_to_https
from .school import (
    MENU_FROM_FEED,
    MENU_MARK,
    Lunch,
    MenuChange,
    SchoolCalendar,
    fold_old_picks,
    lunch_payload,
    menu_changes,
    pick_changes,
    read_school,
)
from .settings import HubSettings

if TYPE_CHECKING:
    from . import MyDashLightConfigEntry

_LOGGER = logging.getLogger(__name__)

_FEED_TIMEOUT = ClientTimeout(total=30)
_FEED_MAX_BYTES = 2_000_000


class MenuFeedError(Exception):
    """A menu feed couldn't be read, or isn't a calendar."""


async def async_read_menu_feed(session: ClientSession, url: str) -> dict[date, FeedMenu]:
    """Each day's lunch in the menu feed at ``url``. Raises :class:`MenuFeedError`."""
    try:
        async with session.get(webcal_to_https(url), timeout=_FEED_TIMEOUT) as resp:
            if resp.status >= 400:
                raise MenuFeedError(f"The feed answered with HTTP {resp.status}")
            # The whole feed, as it arrives in pieces: one read gets only what has come so far.
            raw = bytearray()
            async for chunk in resp.content.iter_chunked(64 * 1024):
                raw += chunk
                if len(raw) > _FEED_MAX_BYTES:
                    raise MenuFeedError("The feed is too big to be a menu")
    except (ClientError, TimeoutError, ValueError) as err:
        raise MenuFeedError(f"The feed couldn't be read: {err}") from err
    text = raw.decode("utf-8", errors="replace")
    if "BEGIN:VCALENDAR" not in text:
        raise MenuFeedError("That address isn't a calendar feed")
    # A feed cut short would drop the days after the cut, so it isn't used.
    if "END:VCALENDAR" not in text:
        raise MenuFeedError("The feed was cut short")
    return feed_menus(read_feed(text))


def lunch_window(today: date) -> tuple[date, date]:
    """The first and last day read: the 1st of this month to the end of next month."""
    first = date(today.year, today.month, 1)
    return first, next_month(next_month(first)) - timedelta(days=1)


class LunchCoordinator(DataUpdateCoordinator[SchoolCalendar]):
    config_entry: MyDashLightConfigEntry

    def __init__(
        self,
        hass: HomeAssistant,
        entry: MyDashLightConfigEntry,
        api: GoogleCalendarApi,
        settings: HubSettings,
        write_lock: asyncio.Lock,
        session: ClientSession | None = None,
    ) -> None:
        super().__init__(
            hass,
            _LOGGER,
            config_entry=entry,
            name=f"{DOMAIN}_lunch",
            update_interval=timedelta(seconds=LUNCH_UPDATE_SECONDS),
        )
        self.api = api
        self.settings = settings
        self.write_lock = write_lock
        self.session = session
        self.feed_errors: dict[str, str | None] = {}
        """Each kid with a menu feed: why it couldn't be read last time, or None."""

    @property
    def kids(self) -> dict[str, str]:
        return {k.calendar_id: k.name for k in self.settings.roles.kids}

    def school(self) -> SchoolCalendar | None:
        """The school days and lunches, or None when the calendars couldn't be read lately."""
        return self.data if self.data is not None and self.last_update_success else None

    async def _async_update_data(self) -> SchoolCalendar:
        tz = dt_util.get_default_time_zone()
        first, last = lunch_window(dt_util.now(tz).date())
        start = datetime.combine(first, time.min, tz)
        end = datetime.combine(last + timedelta(days=1), time.min, tz)
        kids = list(self.kids)
        results = await asyncio.gather(
            *(self.api.async_list_events(kid, start, end) for kid in kids), return_exceptions=True
        )
        events: dict[str, list[CalendarEvent]] = {}
        for kid, result in zip(kids, results, strict=True):
            if isinstance(result, GoogleAuthError):
                raise ConfigEntryAuthFailed(translation_domain=DOMAIN, translation_key="auth_failed") from result
            if isinstance(result, GoogleCalendarUnavailable):
                # The rides board already says this calendar can't be read; no school info for it.
                events[kid] = []
                continue
            if isinstance(result, GoogleApiDisabled):
                raise UpdateFailed(translation_domain=DOMAIN, translation_key="api_disabled") from result
            if isinstance(result, GoogleError):
                raise UpdateFailed(
                    translation_domain=DOMAIN,
                    translation_key="google_error",
                    translation_placeholders={"error": str(result)},
                ) from result
            if isinstance(result, BaseException):
                raise result
            events[kid] = result
        return read_school(events, self.settings.lunch_defaults, first, last)  # type: ignore[arg-type]

    def payload(self) -> dict[str, Any] | None:
        """The lunches for the app and ``get_lunches``."""
        data = self.data
        if data is None:
            return None
        error = None if self.last_update_success or self.last_exception is None else str(self.last_exception)
        out = lunch_payload(data, self.kids, dt_util.now().date())
        for kid in out["kids"]:
            if kid["id"] in self.settings.lunch_feeds:
                feed_error = self.feed_errors.get(kid["id"])
                kid["menu_feed"] = {"ok": feed_error is None, "error": feed_error}
        return {**out, "status": {"ok": self.last_update_success, "error": error}}

    async def async_set_lunch(self, kid: str, days: Iterable[date], lunch: Lunch | None) -> None:
        """Save ``kid``'s lunch on each of ``days``, or take the picks away when None.

        Changes are made one at a time against what was last read. An event someone changed
        in Google meanwhile is read again and tried once more.
        """
        days = list(days)

        async def apply(school: SchoolCalendar) -> None:
            await self._async_menu_changes(kid, pick_changes(school, kid, days, lunch))

        await self._async_write(apply)

    async def async_fold_old_picks(self) -> None:
        """Move "Bring Lunch" and "Buy Lunch" events (how picks were saved before 0.16) onto
        each day's lunch event."""
        school = self.data
        if school is None or not any(school.old_picks.values()):
            return

        async def apply(school: SchoolCalendar) -> None:
            for kid, changes in fold_old_picks(school).items():
                await self._async_menu_changes(kid, changes)

        try:
            await self._async_write(apply)
        except GoogleError as err:
            _LOGGER.warning("Couldn't move the lunch picks onto the lunch events: %s", err)

    async def async_set_menu(self, kids: Iterable[str], day: date, dish: str, details: str = "") -> None:
        """Save the menu on ``day`` for each of ``kids``: a "Lunch: <dish>" event on the kid's
        calendar, with ``details`` in its notes. An empty ``dish`` removes it."""
        kids = list(dict.fromkeys(kids))

        async def apply(school: SchoolCalendar) -> None:
            for kid in kids:
                await self._async_menu_changes(kid, menu_changes(school, kid, day, dish, details))

        await self._async_write(apply)

    async def _async_menu_changes(self, kid: str, changes: list[MenuChange]) -> None:
        for change in changes:
            # A menu changed by hand stops following the feed; a pick leaves that as it is.
            private = None if change.from_feed is None else {MENU_MARK: MENU_FROM_FEED if change.from_feed else ""}
            if change.make:
                title, notes = change.make
                await self.api.async_add_all_day(kid, change.day, title, notes, private if change.from_feed else None)
            elif change.update:
                event_id, etag, title, notes = change.update
                await self.api.async_set_notes(kid, event_id, etag, notes, title, private)
            elif change.remove:
                event_id, etag = change.remove
                await self.api.async_delete_event(kid, event_id, etag)

    async def async_sync_feeds(self) -> None:
        """Read each kid's menu feed and copy its lunches from today on onto their calendar."""
        feeds = dict(self.settings.lunch_feeds)
        if not feeds or self.session is None:
            return
        menus: dict[str, dict[date, FeedMenu]] = {}
        read: dict[str, dict[date, FeedMenu] | MenuFeedError] = {}
        for url in dict.fromkeys(feeds.values()):
            try:
                read[url] = await async_read_menu_feed(self.session, url)
            except MenuFeedError as err:
                _LOGGER.warning("Couldn't read the menu feed %s: %s", url, err)
                read[url] = err
        for kid, url in feeds.items():
            result = read[url]
            if isinstance(result, MenuFeedError):
                self.feed_errors[kid] = str(result)
            else:
                self.feed_errors[kid] = None
                menus[kid] = result
        if not menus:
            self.async_update_listeners()
            return
        today = dt_util.now().date()

        async def apply(school: SchoolCalendar) -> None:
            for kid, kid_menus in menus.items():
                await self._async_menu_changes(kid, feed_changes(school, kid, kid_menus, today, school.last))

        try:
            await self._async_write(apply)
        except GoogleError as err:
            _LOGGER.warning("Couldn't copy the menu feeds onto the kids' calendars: %s", err)
            for kid in menus:
                self.feed_errors[kid] = f"Couldn't save the menus to the calendar: {err}"
            self.async_update_listeners()

    async def _async_write(self, apply: Callable[[SchoolCalendar], Awaitable[None]]) -> None:
        """Work out and make changes against what was last read, then read again.

        An event someone changed in Google meanwhile is read again and tried once more.
        """
        # Holding the lock through the read after keeps a second quick tap from working out
        # its changes from the calendars as they were before this one.
        async with self.write_lock:
            for attempt in range(2):
                school = self.data
                if school is None or not self.last_update_success:
                    await self.async_refresh()
                    school = self.data
                    if school is None or not self.last_update_success:
                        raise GoogleError("The kids' calendars couldn't be read")
                try:
                    await apply(school)
                except GoogleConflict:
                    await self.async_refresh()
                    if attempt:
                        raise
                    continue
                break
            await self.async_refresh()
