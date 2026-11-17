"""Each day's drive times: from the cache when known, otherwise an estimate and a note to look it up.

Planning with the cache tells us exactly which trips the plan needs, so only those are looked
up, in the order the planner first asked for them, today first. Pure module, no Home
Assistant imports.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from typing import Final

from .planner import HOME, TravelFn
from .routes import MISSING, Place, TravelCache, vague_address
from .week import NO_ADDRESS, DayInput, WeekInput, leg_hour, make_travel

FAR_MINUTES: Final = 180
"""A place given only by name that Google puts further than this from home is taken to be the
wrong match, such as a school of the same name in another state: its drive time is a guess."""


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
            if not isinstance(found, (int, float)):
                return None
            if found > FAR_MINUTES and (far := [p for p in (a, b) if self._vague(p)]):
                self._too_far(day, far, found)
                return None
            return found

        return make_travel(self.week.travel_overrides, self.default, lookup)

    def _vague(self, key: str) -> bool:
        return key != HOME and not key.startswith(NO_ADDRESS) and vague_address(self.week.labels.place(key))

    def _too_far(self, day: DayInput, places: list[str], minutes: float) -> None:
        """Say so on each event there, once: the drive time is a guess until it has an address."""
        hours = round(minutes / 60)
        for e in day.events:
            if e.loc not in places:
                continue
            text = (
                f"Google Maps finds “{self.week.labels.place(e.loc)}” about {hours} hours from home, so the "
                "drive time is a guess. Add the full address to the event in Google Calendar."
            )
            if text not in day.problems.get(e.id, ()):
                day.problems[e.id] = (*day.problems.get(e.id, ()), text)

    def place(self, key: str, home: Place) -> Place | None:
        """Where a place key is, for asking Google. None for a place with no address."""
        return place_for(self.week, key, home)


def place_for(week: WeekInput, key: str, home: Place) -> Place | None:
    """Where a place key is, for asking Google. None for a place with no address."""
    if key == HOME:
        return home
    if key.startswith(NO_ADDRESS):
        return None
    return Place(address=near_home(week.labels.place(key), week.home_address))


def near_home(address: str, home_address: str) -> str:
    """A place given only by name, with home's town added so Google finds the one nearby:
    "chesterfield elementary" near "12 Oak St, Chesterfield, MO 63017" is looked up as
    "chesterfield elementary, Chesterfield, MO 63017". A full address is left as it is."""
    town = home_address.split(",", 1)[1].strip() if "," in home_address else ""
    return f"{address}, {town}" if town and vague_address(address) else address
