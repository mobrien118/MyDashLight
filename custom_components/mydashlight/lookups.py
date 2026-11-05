"""Looks up the drive times a plan needs from Google Routes, within the daily limit."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
from datetime import datetime
import logging
import time
from typing import Any, Literal

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DOMAIN, ROUTES_AT_ONCE, ROUTES_PER_UPDATE
from .planner import HOME
from .routes import (
    CACHE_VERSION,
    Place,
    Route,
    RoutesApi,
    RoutesError,
    RoutesKeyError,
    RoutesNoRoute,
    RoutesQuotaError,
    Spot,
    TravelCache,
    next_departure,
)
from .travel import DriveTimes, Leg

_LOGGER = logging.getLogger(__name__)

Status = Literal["off", "no_home", "ok", "key_rejected", "daily_limit"]
"""Where drive times come from right now.

off: no Routes key, so every drive is estimated. no_home: Home Assistant has no home location.
ok: looked up. key_rejected: Google turned the key down. daily_limit: today's lookups are used up.
"""


@dataclass(slots=True)
class LookupResult:
    added: int
    """New drive times, which make a replan worthwhile."""


class RoutesLookups:
    """The Routes client, its saved cache, and what stops lookups for now."""

    def __init__(self, hass: HomeAssistant, api: RoutesApi | None, daily_limit: int) -> None:
        self.hass = hass
        self.api = api
        self.daily_limit = daily_limit
        self.cache = TravelCache()
        self._store: Store[dict[str, Any]] = Store(hass, CACHE_VERSION, f"{DOMAIN}.drive_times")
        self._blocked: Status | None = None
        self._limit_day = ""

    async def async_load(self) -> None:
        self.cache = TravelCache.from_dict(await self._store.async_load())
        self.cache.prune(time.time())

    async def async_remove(self) -> None:
        await self._store.async_remove()

    @property
    def home(self) -> Place | None:
        lat, lon = self.hass.config.latitude, self.hass.config.longitude
        if not lat and not lon:
            return None
        return Place(lat=lat, lon=lon)

    def status(self, now: datetime) -> Status:
        if self.api is None:
            return "off"
        if self.home is None:
            return "no_home"
        if self._blocked == "key_rejected":
            return "key_rejected"
        if self._limit_day == now.date().isoformat() or not self.cache.calls_left(now.date(), self.daily_limit):
            return "daily_limit"
        return "ok"

    async def async_fill(self, drive: DriveTimes, now: datetime) -> LookupResult:
        """Look up as many of the plan's unknown drive times as today's limit allows."""
        home = self.home
        if self.status(now) != "ok" or self.api is None or home is None or not drive.misses:
            return LookupResult(0)
        api = self.api
        today = now.date()
        room = min(self.cache.calls_left(today, self.daily_limit), ROUTES_PER_UPDATE)
        legs: list[tuple[Leg, Place, Place]] = []
        for leg in drive.misses:
            origin, destination = drive.place(leg.origin, home), drive.place(leg.destination, home)
            if origin is not None and destination is not None:
                legs.append((leg, origin, destination))
            if len(legs) == room:
                break
        gate = asyncio.Semaphore(ROUTES_AT_ONCE)
        stop: list[RoutesError] = []

        async def one(leg: Leg, origin: Place, destination: Place) -> bool:
            async with gate:
                if stop:
                    return False
                self.cache.count_call(today)
                try:
                    route = await api.async_route(origin, destination, next_departure(leg.day, leg.hour, now))
                except RoutesNoRoute as err:
                    _LOGGER.debug("No route for %s: %s", leg.key, err)
                    route = Route(None)
                except (RoutesKeyError, RoutesQuotaError) as err:
                    stop.append(err)
                    return False
                except RoutesError as err:
                    _LOGGER.debug("Drive time lookup failed for %s: %s", leg.key, err)
                    return False
                self._keep(leg.key, leg.origin, leg.destination, route)
                return route.minutes is not None

        results = await asyncio.gather(*(one(*leg) for leg in legs))
        for err in stop[:1]:
            self._stopped(err, today.isoformat())
        self._store.async_delay_save(self.cache.as_dict, 10)
        return LookupResult(sum(results))

    def spot(self, key: str) -> Spot | None:
        """Where a place key is on the map, if known. Home is Home Assistant's home location."""
        if key == HOME:
            home = self.home
            return None if home is None or home.lat is None or home.lon is None else (home.lat, home.lon)
        return self.cache.spot(key, time.time())

    async def async_locate(self, key: str, place: Place, now: datetime) -> Spot | None:
        """Where a place is on the map, asking Google with a drive from home if it isn't known.

        The drive time that comes back is kept too, so the lookup isn't wasted.
        """
        if (found := self.spot(key)) is not None:
            return found
        home = self.home
        if self.status(now) != "ok" or self.api is None or home is None:
            return None
        hour = now.hour
        route = await self._async_call(home, place, next_departure(now.date(), hour, now), now)
        if route is not None:
            self._keep(TravelCache.key(HOME, key, now.weekday(), hour), HOME, key, route)
        return self.cache.spot(key, time.time())

    async def async_drive_from(self, start: Spot, key: str, place: Place, now: datetime) -> float | None:
        """Minutes to drive from a point to a place, in traffic right now. Not kept: the point
        is wherever someone happens to be."""
        if self.status(now) != "ok" or self.api is None:
            return None
        route = await self._async_call(Place(lat=start[0], lon=start[1]), place, None, now)
        if route is None:
            return None
        self.cache.put_spot(key, route.end, time.time())
        self._store.async_delay_save(self.cache.as_dict, 10)
        return route.minutes

    async def _async_call(
        self, origin: Place, destination: Place, depart: datetime | None, now: datetime
    ) -> Route | None:
        assert self.api is not None
        self.cache.count_call(now.date())
        try:
            return await self.api.async_route(origin, destination, depart)
        except RoutesNoRoute:
            return Route(None)
        except (RoutesKeyError, RoutesQuotaError) as err:
            self._stopped(err, now.date().isoformat())
        except RoutesError as err:
            _LOGGER.debug("Drive time lookup failed: %s", err)
        return None

    def _keep(self, key: str, origin: str, destination: str, route: Route) -> None:
        stamp = time.time()
        self.cache.put(key, route.minutes, stamp)
        if origin != HOME:
            self.cache.put_spot(origin, route.start, stamp)
        if destination != HOME:
            self.cache.put_spot(destination, route.end, stamp)
        self._store.async_delay_save(self.cache.as_dict, 10)

    def _stopped(self, err: RoutesError, today: str) -> None:
        if isinstance(err, RoutesKeyError):
            if self._blocked != "key_rejected":
                _LOGGER.warning(
                    "Google turned down the Routes key, so drive times are estimated: %s. "
                    "Check the key in the MyDashLight options",
                    err,
                )
            self._blocked = "key_rejected"
        elif self._limit_day != today:
            _LOGGER.info("Google's Routes quota for today is used up, so new drive times wait until tomorrow")
            self._limit_day = today
