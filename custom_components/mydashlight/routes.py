"""Drive times from the Google Routes API, and the cache that keeps the calls down.

A drive time is looked up for a departure at a given hour of a given weekday, with traffic,
and kept for :data:`KEEP_DAYS`. A weekly activity therefore costs a lookup once a month, not
every week. Pure module, no Home Assistant imports.
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass, field
from datetime import UTC, date, datetime, timedelta
import logging
import re
from typing import Any, Final

from aiohttp import ClientError, ClientSession, ClientTimeout

_LOGGER = logging.getLogger(__name__)

ROUTES_URL: Final = "https://routes.googleapis.com/directions/v2:computeRoutes"
FIELD_MASK: Final = "routes.duration,routes.legs.startLocation,routes.legs.endLocation"
_TIMEOUT: Final = ClientTimeout(total=20)
KEEP_DAYS: Final = 30
"""How long a drive time is trusted before it's looked up again."""
RETRY_DAYS: Final = 1
"""How long to wait before trying a trip Google found no route for again."""
SPOT_KEEP_DAYS: Final = 90
"""How long a place's point on the map is trusted. Addresses rarely move."""
CACHE_VERSION: Final = 1
_KEY_REASONS: Final = frozenset({"API_KEY_INVALID", "API_KEY_SERVICE_BLOCKED", "SERVICE_DISABLED"})
_DURATION: Final = re.compile(r"^(\d+(?:\.\d+)?)s$")


class RoutesError(Exception):
    """Google Routes couldn't answer just now. Try again on a later update."""


class RoutesKeyError(RoutesError):
    """Google turned down the API key, or the Routes API is off for its project."""


class RoutesQuotaError(RoutesError):
    """The day's Routes quota is used up."""


class RoutesNoRoute(RoutesError):
    """Google turned the trip down, usually because it can't find an address."""


@dataclass(frozen=True, slots=True)
class Place:
    """A route end: a typed address, or a point (used for home)."""

    address: str | None = None
    lat: float | None = None
    lon: float | None = None

    def waypoint(self) -> dict[str, Any]:
        if self.address is not None:
            return {"address": self.address}
        return {"location": {"latLng": {"latitude": self.lat, "longitude": self.lon}}}


Spot = tuple[float, float]
"""A point on the map: latitude and longitude."""


@dataclass(frozen=True, slots=True)
class Route:
    """A looked-up drive: how long it takes, and where Google put each end."""

    minutes: float | None
    """None when there's no route."""
    start: Spot | None = None
    end: Spot | None = None


class RoutesApi:
    def __init__(self, websession: ClientSession, api_key: str) -> None:
        self._session = websession
        self._key = api_key

    async def async_drive_minutes(self, origin: Place, destination: Place, depart: datetime) -> float | None:
        """Minutes to drive, with the usual traffic at ``depart``. None when there's no route."""
        return (await self.async_route(origin, destination, depart)).minutes

    async def async_route(self, origin: Place, destination: Place, depart: datetime | None) -> Route:
        """The drive with the usual traffic at ``depart``, or with today's traffic when None.

        The ends' points come back in the same reply at no extra cost: the traffic-aware
        request is what sets the price, not the fields asked for.
        """
        body: dict[str, Any] = {
            "origin": origin.waypoint(),
            "destination": destination.waypoint(),
            "travelMode": "DRIVE",
            "routingPreference": "TRAFFIC_AWARE",
        }
        if depart is not None:
            body["departureTime"] = depart.astimezone(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")
        headers = {"X-Goog-Api-Key": self._key, "X-Goog-FieldMask": FIELD_MASK}
        try:
            async with self._session.post(ROUTES_URL, json=body, headers=headers, timeout=_TIMEOUT) as resp:
                try:
                    reply = await resp.json(content_type=None)
                except ValueError:
                    reply = None
                if resp.status < 400:
                    return _route(reply)
                raise _error_for(resp.status, reply)
        except (ClientError, TimeoutError) as err:
            raise RoutesError(f"Couldn't reach Google Routes: {err}") from err


def _route(reply: object) -> Route:
    routes = reply.get("routes") if isinstance(reply, dict) else None
    if not routes or not isinstance(routes[0], dict):
        return Route(None)
    match = _DURATION.match(str(routes[0].get("duration", "")))
    if match is None:
        return Route(None)
    legs = routes[0].get("legs")
    legs = [g for g in legs if isinstance(g, dict)] if isinstance(legs, list) else []
    return Route(
        round(float(match.group(1)) / 60, 1),
        _spot(legs[0].get("startLocation")) if legs else None,
        _spot(legs[-1].get("endLocation")) if legs else None,
    )


def _spot(location: object) -> Spot | None:
    point = location.get("latLng") if isinstance(location, dict) else None
    if not isinstance(point, dict):
        return None
    lat, lon = point.get("latitude"), point.get("longitude")
    if not isinstance(lat, (int, float)) or not isinstance(lon, (int, float)):
        return None
    if isinstance(lat, bool) or isinstance(lon, bool) or not (-90 <= lat <= 90 and -180 <= lon <= 180):
        return None
    return (float(lat), float(lon))


def _error_for(status: int, reply: object) -> RoutesError:
    error = reply.get("error") if isinstance(reply, dict) else None
    error = error if isinstance(error, dict) else {}
    message = str(error.get("message") or f"HTTP {status}")
    reasons = {str(d.get("reason")) for d in error.get("details") or [] if isinstance(d, dict) and d.get("reason")}
    if status in (401, 403) or reasons & _KEY_REASONS:
        return RoutesKeyError(message)
    if status == 429:
        return RoutesQuotaError(message)
    if status == 400:
        return RoutesNoRoute(message)
    return RoutesError(f"Google Routes error {status}: {message}")


@dataclass(slots=True)
class _Entry:
    minutes: float | None
    fetched: float
    """When it was looked up, as a Unix timestamp."""


MISSING: Final = object()
""":meth:`TravelCache.get` found nothing usable."""


@dataclass(slots=True)
class TravelCache:
    """Drive times by trip and hour of the week, plus how many lookups were made today."""

    entries: dict[str, _Entry] = field(default_factory=dict)
    day: str = ""
    calls: int = 0
    """Lookups made on ``day``, a local ISO date."""
    spots: dict[str, tuple[float, float, float]] = field(default_factory=dict)
    """Each place's point on the map and when Google gave it, by place key."""

    @staticmethod
    def key(origin: str, destination: str, weekday: int, hour: int) -> str:
        return f"{origin}|{destination}|{weekday}|{hour}"

    def get(self, key: str, now: float) -> float | object | None:
        entry = self.entries.get(key)
        if entry is None:
            return MISSING
        keep = KEEP_DAYS if entry.minutes is not None else RETRY_DAYS
        if now - entry.fetched > keep * 86400:
            return MISSING
        return entry.minutes

    def put(self, key: str, minutes: float | None, now: float) -> None:
        self.entries[key] = _Entry(minutes, now)

    def spot(self, place: str, now: float) -> Spot | None:
        found = self.spots.get(place)
        if found is None or now - found[2] > SPOT_KEEP_DAYS * 86400:
            return None
        return (found[0], found[1])

    def put_spot(self, place: str, spot: Spot | None, now: float) -> None:
        if spot is not None:
            self.spots[place] = (spot[0], spot[1], now)

    def calls_left(self, today: date, limit: int) -> int:
        if self.day != today.isoformat():
            self.day, self.calls = today.isoformat(), 0
        return max(limit - self.calls, 0)

    def count_call(self, today: date) -> None:
        self.calls_left(today, 0)
        self.calls += 1

    def prune(self, now: float) -> None:
        """Drop entries too old to use."""
        self.entries = {k: e for k, e in self.entries.items() if self.get(k, now) is not MISSING}
        self.spots = {k: v for k, v in self.spots.items() if self.spot(k, now) is not None}

    def as_dict(self) -> dict[str, Any]:
        return {
            "day": self.day,
            "calls": self.calls,
            "entries": {k: [e.minutes, e.fetched] for k, e in self.entries.items()},
            "spots": {k: list(v) for k, v in self.spots.items()},
        }

    @classmethod
    def from_dict(cls, data: Mapping[str, Any] | None) -> TravelCache:
        if not isinstance(data, Mapping):
            return cls()
        entries: dict[str, _Entry] = {}
        raw = data.get("entries")
        for k, v in (raw if isinstance(raw, Mapping) else {}).items():
            if isinstance(v, (list, tuple)) and len(v) == 2 and isinstance(v[1], (int, float)):
                minutes = v[0] if isinstance(v[0], (int, float)) else None
                entries[str(k)] = _Entry(minutes, float(v[1]))
        spots: dict[str, tuple[float, float, float]] = {}
        raw = data.get("spots")
        for k, v in (raw if isinstance(raw, Mapping) else {}).items():
            if isinstance(v, (list, tuple)) and len(v) == 3 and all(isinstance(x, (int, float)) for x in v):
                spots[str(k)] = (float(v[0]), float(v[1]), float(v[2]))
        calls = data.get("calls")
        return cls(entries, str(data.get("day") or ""), calls if isinstance(calls, int) else 0, spots)


def next_departure(day: date, hour: int, now: datetime) -> datetime:
    """``hour`` o'clock on ``day`` in ``now``'s time zone, moved a week on until it's ahead.

    Google only takes departure times in the future. The same hour a week later has the same
    usual traffic.
    """
    assert now.tzinfo is not None
    depart = datetime(day.year, day.month, day.day, hour, tzinfo=now.tzinfo)
    while depart <= now:
        depart += timedelta(days=7)
    return depart
