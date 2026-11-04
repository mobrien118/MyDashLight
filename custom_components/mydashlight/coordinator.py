"""Reads the calendars every minute and plans the week's rides."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .changes import Target
from .const import DOMAIN, DRIVERS, PLAN_DAYS, UPDATE_SECONDS
from .google import (
    CalendarEvent,
    GoogleApiDisabled,
    GoogleAuthError,
    GoogleCalendarApi,
    GoogleCalendarUnavailable,
    GoogleError,
)
from .lookups import RoutesLookups, Status
from .payload import plan_week
from .planner import RideEvent
from .settings import HubSettings
from .travel import DriveTimes
from .week import DayInput, EventRef, WeekInput, build_week, window

if TYPE_CHECKING:
    from . import MyDashLightConfigEntry

_LOGGER = logging.getLogger(__name__)


@dataclass(slots=True)
class PlanData:
    updated: datetime
    time_zone: str
    days: list[dict[str, Any]]
    week: WeekInput
    unavailable: list[str] = field(default_factory=list)
    """Calendars that couldn't be read this time."""
    event_counts: dict[str, int] = field(default_factory=dict)
    drive_times: dict[str, Any] = field(default_factory=dict)
    """Where the drive times came from: see :data:`~.lookups.Status`."""

    def as_dict(self, days: list[dict[str, Any]] | None = None) -> dict[str, Any]:
        """The plan as the app and ``get_plan`` see it: every day, or just ``days``."""
        return {
            "updated": self.updated.isoformat(),
            "time_zone": self.time_zone,
            "unavailable_calendars": list(self.unavailable),
            "drive_times": dict(self.drive_times),
            "days": self.days if days is None else days,
        }


class MyDashLightCoordinator(DataUpdateCoordinator[PlanData]):
    config_entry: MyDashLightConfigEntry

    def __init__(
        self,
        hass: HomeAssistant,
        entry: MyDashLightConfigEntry,
        api: GoogleCalendarApi,
        settings: HubSettings,
        lookups: RoutesLookups,
    ) -> None:
        super().__init__(
            hass,
            _LOGGER,
            config_entry=entry,
            name=DOMAIN,
            update_interval=timedelta(seconds=UPDATE_SECONDS),
        )
        self.api = api
        self.settings = settings
        self.lookups = lookups
        self._unavailable: set[str] = set()

    async def _async_update_data(self) -> PlanData:
        tz = dt_util.get_default_time_zone()
        today = dt_util.now(tz).date()
        start, end = window(today, PLAN_DAYS, tz)
        ids = self.settings.roles.calendar_ids
        results = await asyncio.gather(
            *(self.api.async_list_events(cal_id, start, end) for cal_id in ids), return_exceptions=True
        )

        events: dict[str, list[CalendarEvent]] = {}
        unavailable: list[str] = []
        for cal_id, result in zip(ids, results, strict=True):
            if isinstance(result, GoogleAuthError):
                raise ConfigEntryAuthFailed(translation_domain=DOMAIN, translation_key="auth_failed") from result
            if isinstance(result, GoogleApiDisabled):
                raise UpdateFailed(translation_domain=DOMAIN, translation_key="api_disabled") from result
            if isinstance(result, GoogleCalendarUnavailable):
                unavailable.append(cal_id)
                continue
            if isinstance(result, GoogleError):
                raise UpdateFailed(
                    translation_domain=DOMAIN,
                    translation_key="google_error",
                    translation_placeholders={"error": str(result)},
                ) from result
            if isinstance(result, BaseException):
                raise result
            events[cal_id] = result
        self._note_unavailable(unavailable)

        week = build_week(
            events, self.settings.roles, self.settings.directory, today, PLAN_DAYS, tz, self.settings.home_address
        )
        now = dt_util.now(tz)
        days, drive = await self._async_plan(week, now)
        # Planning showed which trips it needs. Look those up, then plan again with them.
        if (await self.lookups.async_fill(drive, now)).added:
            days, drive = await self._async_plan(week, now)
        status: Status = self.lookups.status(now)
        return PlanData(
            updated=dt_util.utcnow(),
            time_zone=str(tz),
            days=days,
            week=week,
            unavailable=unavailable,
            event_counts={cal_id: len(evs) for cal_id, evs in events.items()},
            drive_times={
                "source": status,
                "looked_up": drive.used,
                "estimated": len(drive.misses),
                "lookups_today": self.lookups.cache.calls if self.lookups.cache.day == today.isoformat() else 0,
                "daily_limit": self.lookups.daily_limit,
            },
        )

    async def _async_plan(self, week: WeekInput, now: datetime) -> tuple[list[dict[str, Any]], DriveTimes]:
        cache = self.lookups.cache if self.lookups.status(now) not in ("off", "no_home") else None
        drive = DriveTimes(week, cache, self.settings.no_address_travel, now.timestamp())
        # Suggested fixes replan the day many times over, so keep that off the event loop.
        days = await self.hass.async_add_executor_job(plan_week, week, drive.travel_for, self.settings.planner, DRIVERS)
        return days, drive

    def payload(self, days: list[dict[str, Any]] | None = None) -> dict[str, Any] | None:
        """The plan for the app and ``get_plan``, with who's who and whether it's up to date."""
        if self.data is None:
            return None
        out = self.data.as_dict(days)
        directory = self.settings.directory
        out["people"] = {
            "drivers": [{"id": d, "name": directory.display(d)} for d in DRIVERS],
            "kids": [{"id": k.calendar_id, "name": k.name} for k in self.settings.roles.kids],
            "carpools": list(directory.carpools),
        }
        error = None if self.last_update_success or self.last_exception is None else str(self.last_exception)
        out["status"] = {"ok": self.last_update_success, "error": error}
        return out

    def find(self, ride_id: str, day: str | None = None) -> tuple[DayInput, RideEvent, EventRef] | None:
        """A planned event by its id in the plan, preferring the day it's dropped off.

        An event that runs over several days is planned on each of them under the same id.
        ``day`` (an ISO date) looks only on that day.
        """
        found: list[tuple[DayInput, RideEvent, EventRef]] = [
            (d, e, d.refs[e.id])
            for d in (self.data.week.days if self.data else [])
            if day is None or d.day.isoformat() == day
            for e in d.events
            if e.id == ride_id
        ]
        return next((f for f in found if "drop" in f[2].sides), found[0] if found else None)

    def occurrences(self, calendar_id: str, series: str) -> list[Target]:
        """The planned occurrences of a repeating event."""
        out: dict[str, Target] = {}
        for d in self.data.week.days if self.data else []:
            for e in d.events:
                ref = d.refs[e.id]
                if ref.calendar_id == calendar_id and ref.recurring_id == series and ref.event_id not in out:
                    out[ref.event_id] = target_for(e, ref)
        return list(out.values())

    def _note_unavailable(self, unavailable: list[str]) -> None:
        now = set(unavailable)
        for cal_id in sorted(now - self._unavailable):
            _LOGGER.warning(
                "Can't read the calendar %s. It may have been deleted or unshared. "
                "Pick the calendars again in the MyDashLight options",
                cal_id,
            )
        for cal_id in sorted(self._unavailable - now):
            _LOGGER.info("The calendar %s can be read again", cal_id)
        self._unavailable = now


def target_for(event: RideEvent, ref: EventRef) -> Target:
    """Where to save a change to a planned event. Its start reads times like "15 min early"."""
    return Target(ref.calendar_id, ref.event_id, event.start if "drop" in ref.sides else None)
