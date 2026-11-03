"""Sorting calendar events into each day's planner input, and the plan written for the app."""

from __future__ import annotations

from datetime import date, datetime
from typing import Any
from zoneinfo import ZoneInfo

from custom_components.mydashlight.google import CalendarEvent, parse_event
from custom_components.mydashlight.notes import DriverDirectory
from custom_components.mydashlight.payload import plan_week
from custom_components.mydashlight.planner import HOME, NOT_NEEDED, UNASSIGNED, BusyBlock, PlannerSettings
from custom_components.mydashlight.week import (
    CalendarRoles,
    EventRef,
    KidCalendar,
    WeekInput,
    addresses,
    build_week,
    make_travel,
    window,
)

from .common import AVA, BEN, ROBIN, SAM, all_day, timed

TZ = ZoneInfo("America/Chicago")
TODAY = date(2026, 11, 3)  # a Tuesday
ROLES = CalendarRoles(
    kids=(KidCalendar(AVA, "Ava"), KidCalendar(BEN, "Ben")),
    busy={"mom": (ROBIN,), "dad": (SAM,)},
)
DIRECTORY = DriverDirectory(names={"mom": "Robin", "dad": "Sam"}, carpools=["the Parkers"])
SCHOOL = "Lincoln Elementary, 100 Main St, Springfield"


def ev(calendar_id: str, item: dict[str, Any]) -> CalendarEvent:
    parsed = parse_event(item, calendar_id)
    assert parsed is not None
    return parsed


def at(day: int, clock: str) -> str:
    """An ISO time on a November 2026 day, in Central time."""
    return datetime.fromisoformat(f"2026-11-{day:02d}T{clock}").replace(tzinfo=TZ).isoformat()


def week(events: dict[str, list[dict[str, Any]]], days: int = 7) -> WeekInput:
    return build_week(
        {cal: [ev(cal, item) for item in items] for cal, items in events.items()}, ROLES, DIRECTORY, TODAY, days, TZ
    )


def test_window_covers_the_morning_after_the_last_day() -> None:
    start, end = window(TODAY, 7, TZ)
    assert start == datetime(2026, 11, 3, tzinfo=TZ)
    assert end == datetime(2026, 11, 10, 6, tzinfo=TZ)


def test_roles_list_each_calendar_once() -> None:
    roles = CalendarRoles(kids=(KidCalendar(AVA, "Ava"),), busy={"mom": (ROBIN, SAM), "dad": (SAM,)})
    assert roles.calendar_ids == (AVA, ROBIN, SAM)


def test_kid_events_become_ride_events() -> None:
    w = week(
        {
            AVA: [
                timed(
                    "piano",
                    "Piano",
                    at(3, "16:00"),
                    at(3, "17:00"),
                    location=SCHOOL,
                    description="Bring music.\n\n--- Rides ---\nDrop-off: Robin\nPick-up: the parkers\nArrive by: 3:50",
                    recurringEventId="piano-series",
                    etag='"7"',
                ),
                timed("dance", "Dance", at(4, "18:00"), at(4, "19:30"), description="Drop-off: Jamie\nArrive by: soon"),
                all_day("off", "No school", "2026-11-05", "2026-11-06"),
                timed(
                    "skip",
                    "Declined",
                    at(3, "09:00"),
                    at(3, "10:00"),
                    attendees=[{"self": True, "responseStatus": "declined"}],
                ),
            ]
        }
    )

    assert [d.day for d in w.days] == [date(2026, 11, d) for d in range(3, 10)]
    tue, wed = w.days[0], w.days[1]
    (piano,) = tue.events
    assert piano.kid == AVA
    assert (piano.start, piano.end) == (960, 1020)
    assert (piano.drop, piano.pick, piano.arrive_by) == ("mom", "the Parkers", 950)
    assert piano.loc == "lincoln elementary, 100 main st, springfield"
    assert tue.refs["piano"] == EventRef(AVA, "piano", '"7"', "piano-series", ("drop", "pick"))
    assert w.labels.place(piano.loc) == SCHOOL
    assert w.labels.short_place(piano.loc) == "Lincoln Elementary"
    assert w.labels.kid(AVA) == "Ava"
    assert w.labels.driver("dad") == "Sam"
    assert w.kids == (AVA, BEN)

    (dance,) = wed.events
    assert dance.drop == "Jamie"
    assert dance.pick == UNASSIGNED
    assert dance.loc == "?dance"
    assert w.labels.place("?dance") == "Dance"
    assert wed.problems["dance"]
    assert addresses(w) == [piano.loc]


def test_same_event_on_two_kids_calendars() -> None:
    item = timed("party", "Party", at(7, "14:00"), at(7, "16:00"), location="Noah's house")
    w = week({AVA: [item], BEN: [item]})
    sat = w.days[4]
    assert [(e.id, e.kid) for e in sat.events] == [("party", AVA), ("party~2", BEN)]
    assert sat.refs["party~2"].event_id == "party"
    assert sat.refs["party~2"].calendar_id == BEN
    assert sat.events[0].loc == sat.events[1].loc


def test_late_event_stays_on_its_day_and_long_one_is_split() -> None:
    w = week(
        {
            AVA: [timed("late", "Concert", at(6, "21:00"), at(7, "00:30"))],
            BEN: [
                timed(
                    "trip",
                    "Camp",
                    at(6, "17:00"),
                    at(8, "15:00"),
                    location="Camp Lake",
                    description="Drop-off: Robin\nPick-up: Sam\nStay: yes",
                )
            ],
        }
    )
    fri, sat, sun = w.days[3], w.days[4], w.days[5]
    late = next(e for e in fri.events if e.id == "late")
    assert (late.start, late.end) == (1260, 1470)
    camp_drop = next(e for e in fri.events if e.id == "trip")
    assert (camp_drop.start, camp_drop.end, camp_drop.drop, camp_drop.pick, camp_drop.stay) == (
        1020,
        1440,
        "mom",
        NOT_NEEDED,
        False,
    )
    assert fri.refs["trip"].sides == ("drop",)
    assert sat.events == []
    (camp_pick,) = sun.events
    assert (camp_pick.start, camp_pick.end, camp_pick.drop, camp_pick.pick) == (0, 900, NOT_NEEDED, "dad")
    assert sun.refs["trip"].sides == ("pick",)


def test_split_event_that_started_before_today() -> None:
    w = week({AVA: [timed("trip", "Trip", at(1, "09:00"), at(3, "18:00"), description="Pick-up: Sam")]})
    (pick,) = w.days[0].events
    assert (pick.start, pick.end, pick.drop, pick.pick) == (0, 1080, NOT_NEEDED, "dad")


def test_busy_blocks() -> None:
    w = week(
        {
            ROBIN: [
                timed("work", "Work", at(3, "08:00"), at(3, "17:00")),
                timed("free", "Lunch?", at(3, "12:00"), at(3, "13:00"), transparency="transparent"),
                timed(
                    "no",
                    "Meeting",
                    at(3, "15:00"),
                    at(3, "16:00"),
                    attendees=[{"self": True, "responseStatus": "declined"}],
                ),
                timed("shift", "Night shift", at(4, "22:00"), at(5, "07:00")),
                all_day("trip", "Denver", "2026-11-06", "2026-11-08"),
                all_day("off", "Day off", "2026-11-09", "2026-11-10", transparency="transparent"),
            ],
            SAM: [timed("", "", at(3, "18:00"), at(3, "19:00"))],
        }
    )
    busy = [d.busy.get("mom", []) for d in w.days]
    assert busy[0] == [BusyBlock(480, 1020, "Work")]
    # The night shift ends after 6 AM, so Wednesday's span stops at 6 AM and Thursday has the rest.
    assert busy[1] == [BusyBlock(1320, 1800, "Night shift")]
    assert busy[2] == [BusyBlock(0, 420, "Night shift")]
    assert busy[3] == [BusyBlock(0, 1440, "Denver")]
    assert busy[4] == [BusyBlock(0, 1440, "Denver")]
    assert busy[5] == []
    assert busy[6] == []
    assert w.days[0].busy["dad"] == [BusyBlock(1080, 1140, "Busy")]


def test_wall_clock_minutes_across_the_time_change() -> None:
    roles = CalendarRoles(kids=(KidCalendar(AVA, "Ava"),))
    nov1 = date(2026, 11, 1)  # clocks fall back at 2 AM
    item = timed("a", "Church", "2026-11-01T10:00:00-06:00", "2026-11-01T11:00:00-06:00")
    w = build_week({AVA: [ev(AVA, item)]}, roles, DIRECTORY, nov1, 1, TZ)
    assert (w.days[0].events[0].start, w.days[0].events[0].end) == (600, 660)


def test_travel() -> None:
    travel = make_travel({"far": 40, "?x": 5}, 15)
    assert travel("a", "a") == 0
    assert travel(HOME, "far") == 40
    assert travel("far", HOME) == 40
    assert travel("far", "?x") == 5
    assert travel(HOME, "near") == 15

    def routes(a: str, b: str) -> float | None:
        return {("home", "near"): 9, ("far", "near"): 30}.get((a, b))

    travel = make_travel({"far": 40}, 15, routes)
    assert travel(HOME, "near") == 9
    assert travel("far", "near") == 30
    assert travel("near", "far") == 40
    assert travel("near", HOME) == 15


def test_travel_override_from_notes() -> None:
    w = week(
        {
            AVA: [
                timed("a", "Game", at(3, "16:00"), at(3, "17:00"), location="Away field", description="Travel: 35 min")
            ],
            BEN: [
                timed("b", "Game", at(3, "18:00"), at(3, "19:00"), location="away  FIELD", description="Travel: 20 min")
            ],
        }
    )
    assert w.travel_overrides == {"away field": 35}


def test_plan_payload() -> None:
    w = week(
        {
            AVA: [
                timed(
                    "piano",
                    "Piano",
                    at(3, "16:00"),
                    at(3, "17:00"),
                    location=SCHOOL,
                    description="Drop-off: Robin\nPick-up: Robin",
                ),
                timed("dance", "Dance", at(3, "16:30"), at(3, "17:30"), location="Dance studio"),
            ],
            BEN: [
                timed(
                    "soccer", "Soccer", at(3, "16:00"), at(3, "17:00"), location="Park", description="Drop-off: Robin"
                )
            ],
            ROBIN: [timed("work", "Work", at(3, "08:00"), at(3, "15:55"))],
        },
        days=2,
    )
    days = plan_week(w, make_travel(w.travel_overrides, 15), PlannerSettings(), ("mom", "dad"))

    assert [d["date"] for d in days] == ["2026-11-03", "2026-11-04"]
    tue = days[0]
    assert tue["along"] == {"mom": False, "dad": False}
    assert [e["id"] for e in tue["events"]] == ["piano", "soccer", "dance"]
    piano = tue["events"][0]
    assert piano["place_name"] == SCHOOL
    assert piano["short_place"] == "Lincoln Elementary"
    assert piano["calendar_id"] == AVA
    assert piano["lines"]["drop"]["tone"] in ("normal", "problem")
    robin = tue["drivers"]["mom"]
    assert robin["name"] == "Robin"
    assert robin["busy"] == [{"start": 480, "end": 955, "title": "Work"}]
    assert robin["segments"]
    assert robin["outings"][0]["lead"].startswith("Leave ")
    kinds = {(x["level"], x["kind"]) for x in tue["issues"]}
    assert ("problem", "unassigned") in kinds
    # Ava is double-booked: piano and dance overlap.
    assert any(c["kid"] == AVA for c in tue["clashes"])
    unassigned = next(x for x in tue["issues"] if x["kind"] == "unassigned" and x["event"] == "dance")
    assert unassigned["title"]
    assert unassigned["suggestions"]
    assert unassigned["suggestions"][0]["change"]["id"] == "dance"
    assert tue["kids"][AVA]["name"] == "Ava"
    assert days[1]["events"] == []
    assert days[1]["issues"] == []
