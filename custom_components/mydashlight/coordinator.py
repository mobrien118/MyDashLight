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

from .const import DOMAIN, DRIVERS, PLAN_DAYS, UPDATE_SECONDS
from .google import (
    CalendarEvent,
    GoogleApiDisabled,
    GoogleAuthError,
    GoogleCalendarApi,
    GoogleCalendarUnavailable,
    GoogleError,
)
from .payload import plan_week
from .settings import HubSettings
from .week import WeekInput, build_week, make_travel, window

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


class MyDashLightCoordinator(DataUpdateCoordinator[PlanData]):
    config_entry: MyDashLightConfigEntry

    def __init__(
        self,
        hass: HomeAssistant,
        entry: MyDashLightConfigEntry,
        api: GoogleCalendarApi,
        settings: HubSettings,
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

        week = build_week(events, self.settings.roles, self.settings.directory, today, PLAN_DAYS, tz)
        travel = make_travel(week.travel_overrides, self.settings.no_address_travel)
        # Suggested fixes replan the day many times over, so keep that off the event loop.
        days = await self.hass.async_add_executor_job(plan_week, week, travel, self.settings.planner, DRIVERS)
        return PlanData(
            updated=dt_util.utcnow(),
            time_zone=str(tz),
            days=days,
            week=week,
            unavailable=unavailable,
            event_counts={cal_id: len(evs) for cal_id, evs in events.items()},
        )

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
