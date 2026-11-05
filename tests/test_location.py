"""Checking a driver is on their way: straight-line distances and what the driver is told."""

from __future__ import annotations

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pytest

from custom_components.mydashlight.location import (
    Going,
    Position,
    at_start,
    crow_m,
    goings,
    not_left,
    off_course,
    reminder_from_here,
    running_late,
)

TZ = ZoneInfo("America/Chicago")
HOME = (40.0, -86.9)
SCHOOL = (40.02, -86.88)
"""About 2.8 km north-east of home."""
WORK = (39.95, -86.95)
"""About 7 km south-west of home: farther from school than home is."""
ON_THE_WAY = (40.012, -86.89)


def going() -> Going:
    return Going(
        key="2026-11-03|mom|piano|0",
        driver="mom",
        title="Drive Ava to Piano",
        leave=datetime(2026, 11, 3, 15, 38, tzinfo=TZ),
        due=datetime(2026, 11, 3, 16, 0, tzinfo=TZ),
        from_loc="home",
        from_name="home",
        to_loc="piano",
        to_name="Piano studio",
        via_home=False,
    )


def test_crow_flies_distance() -> None:
    assert crow_m(HOME, HOME) == 0
    # A degree of latitude is about 111 km anywhere.
    assert crow_m((40.0, -86.9), (41.0, -86.9)) == pytest.approx(111_195, rel=1e-3)
    # A degree of longitude is shorter this far north: about three quarters of that.
    assert crow_m((40.0, -86.9), (40.0, -85.9)) == pytest.approx(85_180, rel=1e-3)


def test_at_start() -> None:
    def pos(spot: tuple[float, float] | None, zone: str = "not_home", accuracy: float = 10) -> Position:
        return Position(spot, accuracy, zone)

    # Home Assistant already knows they're home.
    assert at_start(pos(None, "home"), None, from_home=True) is True
    assert at_start(pos(HOME), HOME, from_home=False) is True
    # 100 m away counts as there; 300 m doesn't, unless the phone is that unsure.
    assert at_start(pos((40.0009, -86.9)), HOME, from_home=True) is True
    assert at_start(pos((40.0027, -86.9)), HOME, from_home=True) is False
    assert at_start(pos((40.0027, -86.9), accuracy=200), HOME, from_home=True) is True
    # No position, or no idea where the drive starts: no telling.
    assert at_start(pos(None), HOME, from_home=True) is None
    assert at_start(pos(WORK), None, from_home=False) is None


def test_off_course() -> None:
    assert off_course(Position(WORK, 10, "not_home"), HOME, SCHOOL) is True
    assert off_course(Position(ON_THE_WAY, 10, "not_home"), HOME, SCHOOL) is False
    assert off_course(Position(None, 10, "not_home"), HOME, SCHOOL) is False


def test_reminder_from_here() -> None:
    g = going()
    at = datetime(2026, 11, 3, 15, 23, tzinfo=TZ)
    # 30 minutes from work: leave by 3:30 instead of 3:38.
    assert reminder_from_here(g, 30, at, TZ) == (
        "Leave by 3:30 PM: Drive Ava to Piano",
        "You're not at home. From where you are, it's 30 min to Piano studio.",
    )
    # 45 minutes away: it's already too late to be on time.
    assert reminder_from_here(g, 45, at, TZ) == (
        "Leave now: Drive Ava to Piano",
        "From where you are, it's 45 min to Piano studio, so you'll be about 8 min late.",
    )
    # Exactly on time if they leave now.
    assert reminder_from_here(g, 37, at, TZ) == (
        "Leave now: Drive Ava to Piano",
        "From where you are, it's 37 min to Piano studio.",
    )
    # Close enough that the plan still works.
    assert reminder_from_here(g, 21, at, TZ) is None


def test_not_left_and_running_late() -> None:
    g = going()
    assert not_left(g, TZ) == (
        "Time to go: Drive Ava to Piano",
        "You were due to leave home at 3:38 PM to be at Piano studio by 4:00 PM.",
    )
    at = datetime(2026, 11, 3, 15, 43, tzinfo=TZ)
    assert running_late(g, 30, at, TZ) == (
        "Running late: Drive Ava to Piano",
        "From where you are, it's 30 min to Piano studio, so you'll get there about 4:13 PM, 13 min late.",
    )
    assert running_late(g, 17, at, TZ) is None


def test_goings_only_for_tracked_drivers() -> None:
    outing = {
        "start": 938,
        "title": "Drive Ava to Piano",
        "target": "piano",
        "go": {
            "from": "home",
            "from_name": "home",
            "to": "piano",
            "to_name": "Piano studio",
            "due": 960,
            "via_home": False,
        },
    }
    days = [
        {
            "date": "2026-11-03",
            "drivers": {"mom": {"outings": [outing, {**outing, "go": None}]}, "dad": {"outings": [outing]}},
        }
    ]
    found = goings(days, ("mom", "dad"), {"mom"}, TZ)
    assert found == [going()]
    assert found[0].leave - timedelta(minutes=15) == datetime(2026, 11, 3, 15, 23, tzinfo=TZ)
