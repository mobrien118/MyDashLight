"""Is the driver where the plan expects? Worked out from where their phone says they are.

Two checks for each drive, sent only to the driver:

* **At the leave reminder.** When the driver isn't at the drive's starting point and is
  farther from the first stop than the starting point is, the reminder says when to leave
  from where they really are.
* **Not left yet.** The arrive-early margin after leave time, a driver still at the starting
  point is told. A driver who has left but is farther from the first stop than the starting
  point is told if they'll now be late.

Distances are straight lines on the map, so they cost nothing. Google is asked for a drive
time only when the straight lines say the driver is somewhere unexpected.

Pure module, no Home Assistant imports.
"""

from __future__ import annotations

from collections.abc import Collection, Iterable, Mapping, Sequence
from dataclasses import dataclass
from datetime import date, datetime, timedelta, tzinfo
import math
from typing import Any, Final

from .planner import fmt12
from .reminders import at_minutes, driver_outings
from .routes import Spot

EARTH_M: Final = 6_371_000
AT_PLACE_M: Final = 150
"""How close counts as being at a place, before the phone's own accuracy is added."""
LATE_AFTER: Final = 1
"""Minutes late worth telling the driver about."""
EARLIER_BY: Final = 2
"""Minutes earlier than planned a new leave time has to be to be worth saying."""


def crow_m(a: Spot, b: Spot) -> float:
    """The straight-line distance between two points, in meters, allowing for the Earth's curve."""
    lat1, lon1, lat2, lon2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    h = math.sin((lat2 - lat1) / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin((lon2 - lon1) / 2) ** 2
    return 2 * EARTH_M * math.asin(min(1.0, math.sqrt(h)))


@dataclass(frozen=True, slots=True)
class Position:
    """Where someone's phone says they are."""

    spot: Spot | None
    accuracy: float
    """Meters, as the phone reports it."""
    zone: str
    """The person's state: "home", "not_home", or a zone's name."""


def slack_m(pos: Position) -> float:
    return AT_PLACE_M + max(pos.accuracy, 0)


def at_start(pos: Position, start: Spot | None, from_home: bool) -> bool | None:
    """Whether the driver is still where the drive starts. None when there's no telling."""
    if from_home and pos.zone == "home":
        return True
    if pos.spot is None or start is None:
        return None
    return crow_m(pos.spot, start) <= slack_m(pos)


def off_course(pos: Position, start: Spot, target: Spot) -> bool:
    """Whether the driver is farther from the first stop than the starting point is."""
    if pos.spot is None:
        return False
    return crow_m(pos.spot, target) > crow_m(start, target) + slack_m(pos)


@dataclass(frozen=True, slots=True)
class Going:
    """One drive's first stretch, as the checks see it."""

    key: str
    """The same as the driver's leave reminder for this drive."""
    driver: str
    title: str
    leave: datetime
    due: datetime
    from_loc: str
    from_name: str
    to_loc: str
    to_name: str
    via_home: bool


def goings(
    days: Iterable[Mapping[str, Any]], drivers: Sequence[str], people: Collection[str], tz: tzinfo
) -> list[Going]:
    """The drives to check, for the drivers in ``people``."""
    out: list[Going] = []
    for day in days:
        d = date.fromisoformat(day["date"])
        for driver in drivers:
            if driver not in people:
                continue
            for key, o in driver_outings(day, driver):
                go = o.get("go")
                if not go or o.get("solo"):
                    continue
                out.append(
                    Going(
                        key=key,
                        driver=driver,
                        title=o.get("title") or "Drive",
                        leave=at_minutes(d, o["start"], tz),
                        due=at_minutes(d, go["due"], tz),
                        from_loc=go["from"],
                        from_name=go["from_name"],
                        to_loc=go["to"],
                        to_name=go["to_name"],
                        via_home=bool(go["via_home"]),
                    )
                )
    return out


def wall(t: datetime, tz: tzinfo) -> str:
    local = t.astimezone(tz)
    return fmt12(local.hour * 60 + local.minute)


def _whole(minutes: float) -> int:
    return math.floor(minutes + 0.5)


def reminder_from_here(g: Going, minutes: float, now: datetime, tz: tzinfo) -> tuple[str, str] | None:
    """A new title and first line for the leave reminder, when the driver isn't where the
    drive starts and has to leave earlier from where they are. None when the plan still works."""
    drive = _whole(minutes)
    leave_by = g.due - timedelta(minutes=drive)
    if leave_by > g.leave - timedelta(minutes=EARLIER_BY):
        return None
    if leave_by <= now:
        late = _whole((now - leave_by).total_seconds() / 60)
        line = f"From where you are, it's {drive} min to {g.to_name}"
        line += f", so you'll be about {late} min late." if late >= LATE_AFTER else "."
        return f"Leave now: {g.title}", line
    return (
        f"Leave by {wall(leave_by, tz)}: {g.title}",
        f"You're not at {g.from_name}. From where you are, it's {drive} min to {g.to_name}.",
    )


def not_left(g: Going, tz: tzinfo) -> tuple[str, str]:
    """The title and text telling a driver they haven't left yet."""
    return (
        f"Time to go: {g.title}",
        f"You were due to leave {g.from_name} at {wall(g.leave, tz)} to be at {g.to_name} by {wall(g.due, tz)}.",
    )


def running_late(g: Going, minutes: float, now: datetime, tz: tzinfo) -> tuple[str, str] | None:
    """The title and text telling a driver who went another way that they'll be late. None
    when they'll still make it."""
    drive = _whole(minutes)
    eta = now + timedelta(minutes=drive)
    late = _whole((eta - g.due).total_seconds() / 60)
    if late < LATE_AFTER:
        return None
    return (
        f"Running late: {g.title}",
        f"From where you are, it's {drive} min to {g.to_name}, so you'll get there about "
        f"{wall(eta, tz)}, {late} min late.",
    )
