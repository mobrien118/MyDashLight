"""Each day's drive times: from the cache when known, otherwise an estimate and a note to look it up.

Planning with the cache tells us exactly which trips the plan needs, so only those are looked
up, in the order the planner first asked for them, today first. Pure module, no Home
Assistant imports.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date

from .planner import HOME, TravelFn
from .routes import MISSING, Place, TravelCache
from .week import NO_ADDRESS, DayInput, WeekInput, leg_hour, make_travel


@dataclass(frozen=True, slots=True)
class Leg:
    """A trip whose drive time isn't known yet."""

    key: str
    origin: str
    destination: str
    day: date
    hour: int


@dataclass(slots=True)
class DriveTimes:
    """Hands the planner each day's travel function and notes what it couldn't answer."""

    week: WeekInput
    cache: TravelCache | None
    """None when drive times aren't looked up (no Routes key)."""
    default: float
    now: float
    """The current Unix time, for judging how old a cached time is."""
    misses: list[Leg] = field(default_factory=list)
    used: int = 0
    """How many trips were answered from the cache."""
    _seen: set[str] = field(default_factory=set)

    def travel_for(self, day: DayInput) -> TravelFn:
        if self.cache is None:
            return make_travel(self.week.travel_overrides, self.default)
        cache = self.cache

        def lookup(a: str, b: str) -> float | None:
            hour = leg_hour(day, a, b)
            key = TravelCache.key(a, b, day.day.weekday(), hour)
            found = cache.get(key, self.now)
            if found is MISSING:
                if key not in self._seen:
                    self._seen.add(key)
                    self.misses.append(Leg(key, a, b, day.day, hour))
                return None
            if key not in self._seen:
                self._seen.add(key)
                self.used += 1
            return found if isinstance(found, (int, float)) else None

        return make_travel(self.week.travel_overrides, self.default, lookup)

    def place(self, key: str, home: Place) -> Place | None:
        """Where a place key is, for asking Google. None for a place with no address."""
        if key == HOME:
            return home
        if key.startswith(NO_ADDRESS):
            return None
        return Place(address=self.week.labels.place(key))
