"""Each day's drive times: cached, estimated, and which trips to look up."""

from __future__ import annotations

from datetime import date
from typing import Any
from zoneinfo import ZoneInfo

from custom_components.mydashlight.google import parse_event
from custom_components.mydashlight.notes import DriverDirectory
from custom_components.mydashlight.planner import HOME, RideEvent
from custom_components.mydashlight.routes import Place, TravelCache
from custom_components.mydashlight.travel import DriveTimes
from custom_components.mydashlight.week import CalendarRoles, DayInput, KidCalendar, build_week, leg_hour

from .common import AVA, timed

TZ = ZoneInfo("America/Chicago")
TUESDAY = date(2026, 11, 3)
NOW = 1_793_718_000.0


def week(*items: dict[str, Any]) -> Any:
    events = [e for e in (parse_event(item, AVA) for item in items) if e is not None]
    roles = CalendarRoles(kids=(KidCalendar(AVA, "Ava"),))
    return build_week({AVA: events}, roles, DriverDirectory(names={"mom": "Robin", "dad": "Sam"}), TUESDAY, 2, TZ)


def test_leg_hour() -> None:
    day = DayInput(
        TUESDAY,
        events=[
            RideEvent("a", AVA, "School", "school", 480, 900),
            RideEvent("b", AVA, "Piano", "piano", 1020, 1080),
            RideEvent("c", AVA, "Party", "late", 1400, 1500),
        ],
    )
    assert leg_hour(day, HOME, "school") == 7  # leave around 7:30 for 8:00
    assert leg_hour(day, "school", HOME) == 15
    assert leg_hour(day, "school", "piano") == 16
    assert leg_hour(day, "late", HOME) == 23  # past midnight counts as the last hour
    assert leg_hour(day, HOME, HOME) == 12


def test_without_a_cache_everything_is_estimated() -> None:
    w = week(timed("a", "Piano", "2026-11-03T16:00:00-06:00", "2026-11-03T17:00:00-06:00", location="Piano, 1 Elm"))
    drive = DriveTimes(w, None, 15, NOW)
    travel = drive.travel_for(w.days[0])
    assert travel(HOME, "piano, 1 elm") == 15
    assert drive.misses == []


def test_cache_hits_and_misses() -> None:
    w = week(
        timed("a", "Piano", "2026-11-03T16:00:00-06:00", "2026-11-03T17:00:00-06:00", location="Piano, 1 Elm"),
        timed("b", "Art", "2026-11-03T18:00:00-06:00", "2026-11-03T19:00:00-06:00"),
    )
    cache = TravelCache()
    cache.put(TravelCache.key(HOME, "piano, 1 elm", 1, 15), 11.0, NOW)
    cache.put(TravelCache.key("piano, 1 elm", HOME, 1, 17), None, NOW)
    drive = DriveTimes(w, cache, 15, NOW)
    travel = drive.travel_for(w.days[0])

    assert travel(HOME, "piano, 1 elm") == 11
    assert travel("piano, 1 elm", HOME) == 15  # Google had no route, so it's estimated
    assert travel(HOME, "?b") == 15  # no address, never looked up
    assert travel("piano, 1 elm", "?b") == 15
    travel(HOME, "piano, 1 elm")
    assert drive.used == 2
    assert drive.misses == []

    other = DriveTimes(w, cache, 15, NOW + 40 * 86400)
    other.travel_for(w.days[0])(HOME, "piano, 1 elm")
    other.travel_for(w.days[0])(HOME, "piano, 1 elm")
    (leg,) = other.misses
    assert (leg.origin, leg.destination, leg.day, leg.hour) == (HOME, "piano, 1 elm", TUESDAY, 15)


def test_place() -> None:
    w = week(timed("a", "Piano", "2026-11-03T16:00:00-06:00", "2026-11-03T17:00:00-06:00", location="Piano,  1 Elm"))
    drive = DriveTimes(w, TravelCache(), 15, NOW)
    home = Place(lat=1, lon=2)
    assert drive.place(HOME, home) is home
    assert drive.place("piano, 1 elm", home) == Place(address="Piano, 1 Elm")
    assert drive.place("?a", home) is None
