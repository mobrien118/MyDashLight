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
_TIMEOUT: Final = ClientTimeout(total=20)
KEEP_DAYS: Final = 30
"""How long a drive time is trusted before it's looked up again."""
RETRY_DAYS: Final = 1
"""How long to wait before trying a trip Google found no route for again."""
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


class RoutesApi:
    def __init__(self, websession: ClientSession, api_key: str) -> None:
        self._session = websession
        self._key = api_key

    async def async_drive_minutes(self, origin: Place, destination: Place, depart: datetime) -> float | None:
        """Minutes to drive, with the usual traffic at ``depart``. None when there's no route."""
        body = {
            "origin": origin.waypoint(),
            "destination": destination.waypoint(),
            "travelMode": "DRIVE",
            "routingPreference": "TRAFFIC_AWARE",
            "departureTime": depart.astimezone(UTC).strftime("%Y-%m-%dT%H:%M:%SZ"),
        }
        headers = {"X-Goog-Api-Key": self._key, "X-Goog-FieldMask": "routes.duration"}
        try:
            async with self._session.post(ROUTES_URL, json=body, headers=headers, timeout=_TIMEOUT) as resp:
                try:
                    reply = await resp.json(content_type=None)
                except ValueError:
                    reply = None
                if resp.status < 400:
                    return _minutes(reply)
                raise _error_for(resp.status, reply)
        except (ClientError, TimeoutError) as err:
            raise RoutesError(f"Couldn't reach Google Routes: {err}") from err


def _minutes(reply: object) -> float | None:
    routes = reply.get("routes") if isinstance(reply, dict) else None
    if not routes or not isinstance(routes[0], dict):
        return None
    match = _DURATION.match(str(routes[0].get("duration", "")))
    if match is None:
        return None
    return round(float(match.group(1)) / 60, 1)


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

    def as_dict(self) -> dict[str, Any]:
        return {
            "day": self.day,
            "calls": self.calls,
            "entries": {k: [e.minutes, e.fetched] for k, e in self.entries.items()},
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
        calls = data.get("calls")
        return cls(entries, str(data.get("day") or ""), calls if isinstance(calls, int) else 0)


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
