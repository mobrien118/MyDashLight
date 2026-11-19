"""Sorting calendar events into each day's planner input, and the plan written for the app."""

from __future__ import annotations

from datetime import date, datetime
import math
from typing import Any
from zoneinfo import ZoneInfo

from custom_components.mydashlight.google import CalendarEvent, parse_event
from custom_components.mydashlight.notes import DriverDirectory
from custom_components.mydashlight.payload import plan_week
from custom_components.mydashlight.planner import HOME, NOT_NEEDED, UNASSIGNED, BusyBlock, PlannerSettings
from custom_components.mydashlight.routes import Place
from custom_components.mydashlight.shared import Stay
from custom_components.mydashlight.travel import place_for
from custom_components.mydashlight.week import (
    CalendarRoles,
    EventRef,
    KidCalendar,
    WeekInput,
    addresses,
    build_week,
    make_travel,
    where,
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


HOME_ADDRESS = "12 Oak Street, Springfield, IL 62701"


def week(events: dict[str, list[dict[str, Any]]], days: int = 7, home_address: str = "") -> WeekInput:
    return build_week(
        {cal: [ev(cal, item) for item in items] for cal, items in events.items()},
        ROLES,
        DIRECTORY,
        TODAY,
        days,
        TZ,
        home_address,
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
    assert tue.refs["piano"] == EventRef(AVA, "piano", '"7"', "piano-series", ("drop", "pick"), notes="Bring music.")
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
    travel = make_travel(w.travel_overrides, 15)
    days = plan_week(w, lambda _day: travel, PlannerSettings(), ("mom", "dad"))

    assert [d["date"] for d in days] == ["2026-11-03", "2026-11-04"]
    tue = days[0]
    assert "along" not in tue
    assert [e["id"] for e in tue["events"]] == ["work", "piano", "soccer", "dance"]
    piano = tue["events"][1]
    assert piano["place_name"] == SCHOOL
    assert piano["short_place"] == "Lincoln Elementary"
    assert piano["calendar_id"] == AVA
    assert piano["lines"]["drop"]["tone"] in ("normal", "problem")
    robin = tue["drivers"]["mom"]
    assert robin["name"] == "Robin"
    assert robin["busy"] == [{"start": 480, "end": 955, "title": "Work", "event": "work"}]
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


def test_where() -> None:
    assert where("12 Oak St", HOME_ADDRESS) == "home"
    assert where("12 oak st., Springfield", HOME_ADDRESS) == "home"
    assert where("  Home ", HOME_ADDRESS) == "home"
    assert where("Home", "") == "home"
    assert where("12 Oak St", "") == "place"
    assert where("14 Oak St", HOME_ADDRESS) == "place"
    assert where("Noah's house", HOME_ADDRESS) == "place"
    assert where("", HOME_ADDRESS) == "anywhere"
    assert where("https://us02web.zoom.us/j/123", HOME_ADDRESS) == "anywhere"
    assert where("Meeting at meet.google.com/abc-defg-hij", HOME_ADDRESS) == "anywhere"
    assert where("Online", HOME_ADDRESS) == "anywhere"


def test_events_at_home_need_no_ride() -> None:
    w = week(
        {
            AVA: [
                timed(
                    "tutor",
                    "Tutor",
                    at(3, "16:00"),
                    at(3, "17:00"),
                    location="12 Oak St, Springfield",
                    # Whatever the notes say, home needs no ride.
                    description="Drop-off: Robin\nTravel: 30 min",
                )
            ],
            BEN: [timed("lego", "Lego club", at(3, "18:00"), at(3, "19:00"), location="Home")],
        },
        days=1,
        home_address=HOME_ADDRESS,
    )
    tutor, lego = w.days[0].events
    assert (tutor.loc, tutor.drop, tutor.pick) == (HOME, NOT_NEEDED, NOT_NEEDED)
    assert (lego.loc, lego.drop, lego.pick) == (HOME, NOT_NEEDED, NOT_NEEDED)
    assert w.travel_overrides == {}
    assert addresses(w) == []
    assert w.labels.place(HOME) == "Home"


def test_events_with_no_address_need_no_ride_unless_the_notes_name_a_driver() -> None:
    w = week(
        {
            AVA: [
                timed("call", "Call with Grandma", at(3, "16:00"), at(3, "16:30")),
                timed("class", "Coding class", at(3, "17:00"), at(3, "18:00"), location="https://zoom.us/j/1"),
                timed("party", "Party", at(3, "18:00"), at(3, "20:00"), description="Pick-up: Sam"),
            ]
        },
        days=1,
    )
    call, coding, party = w.days[0].events
    assert (call.drop, call.pick) == (NOT_NEEDED, NOT_NEEDED)
    assert (coding.drop, coding.pick, coding.loc) == (NOT_NEEDED, NOT_NEEDED, "?class")
    assert w.labels.place("?class") == "Coding class"
    # Naming a driver plans the ride after all, so the drop-off still needs one.
    assert (party.drop, party.pick) == (UNASSIGNED, "dad")
    # The board shows the no-address default as nothing picked yet, so it can be changed.
    refs = w.days[0].refs
    assert [refs[e].no_ride_unless_named for e in ("call", "class", "party")] == [True, True, False]


def test_home_and_anywhere_on_the_board() -> None:
    w = week(
        {
            AVA: [
                timed(
                    "soccer",
                    "Soccer",
                    at(3, "14:30"),
                    at(3, "15:45"),
                    location="Park",
                    description="Drop-off: Robin\nPick-up: Robin",
                ),
                # Robin can't get Ava home from soccer before the tutor comes.
                timed("tutor", "Tutor", at(3, "15:50"), at(3, "17:00"), location="Home"),
            ],
            BEN: [
                timed(
                    "swim",
                    "Swim",
                    at(3, "15:00"),
                    at(3, "16:00"),
                    location="Pool",
                    description="Drop-off: Sam\nPick-up: Sam",
                ),
                # A call during the drive home is fine.
                timed("call", "Call with Grandma", at(3, "16:00"), at(3, "16:30")),
            ],
        },
        days=1,
    )
    travel = make_travel(w.travel_overrides, 15)
    (tue,) = plan_week(w, lambda _day: travel, PlannerSettings(), ("mom", "dad"))
    events = {e["id"]: e for e in tue["events"]}
    assert events["tutor"]["where"] == "home"
    assert events["tutor"]["short_place"] == "Home"
    assert events["tutor"]["lines"] == {"drop": {"text": "At home", "tone": "muted"}, "pick": None}
    assert events["call"]["where"] == "anywhere"
    assert events["call"]["lines"]["drop"] == {"text": "No ride needed", "tone": "muted"}
    assert events["call"]["no_ride_unless_named"] is True
    assert events["soccer"]["no_ride_unless_named"] is False
    assert events["soccer"]["where"] == "place"
    assert [(c["kid"], c["a"]["event"], c["b"]["type"]) for c in tue["clashes"]] == [(AVA, "tutor", "ride")]
    assert not any(x["kind"] == "unassigned" for x in tue["issues"])


def test_events_not_attended() -> None:
    w = week(
        {
            AVA: [
                timed(
                    "hiphop",
                    "NO - Hip Hop",
                    at(3, "18:00"),
                    at(3, "18:45"),
                    location="Dance studio",
                    description="Drop-off: Robin\nPick-up: Robin",
                ),
                timed("tap", "Tap", at(3, "18:15"), at(3, "19:00"), location="Dance studio"),
                timed(
                    "piano",
                    "Piano",
                    at(3, "16:00"),
                    at(3, "17:00"),
                    location=SCHOOL,
                    description="--- Rides ---\nAttending: no\nDrop-off: Sam",
                ),
            ]
        },
        days=1,
    )
    travel = make_travel(w.travel_overrides, 15)
    (tue,) = plan_week(w, lambda _day: travel, PlannerSettings(), ("mom", "dad"))
    events = {e["id"]: e for e in tue["events"]}
    hiphop, piano = events["hiphop"], events["piano"]
    assert (hiphop["title"], hiphop["attending"], hiphop["drop"], hiphop["pick"]) == ("Hip Hop", False, "none", "none")
    assert hiphop["lines"] == {"drop": {"text": "Not attending", "tone": "muted"}, "pick": None}
    assert (piano["attending"], piano["drop"]) == (False, "none")
    assert events["tap"]["attending"] is True
    # Hip hop and tap overlap, but Ava isn't going to hip hop: no clash, and only tap needs rides.
    assert tue["clashes"] == []
    assert {(x["kind"], x["event"]) for x in tue["issues"]} == {("unassigned", "tap")}
    assert tue["drivers"]["mom"]["segments"] == []
    assert tue["drivers"]["dad"]["segments"] == []


DENTIST = "Smile Dental, 5 Elm St, Springfield"


def test_parents_own_events_get_rides() -> None:
    w = week(
        {
            ROBIN: [
                timed(
                    "dentist",
                    "Dentist",
                    at(3, "14:00"),
                    at(3, "15:00"),
                    location=DENTIST,
                    description="Take along: Ben, Sam\nTravel: 25 min",
                ),
                timed("call", "Call", at(3, "09:00"), at(3, "10:00"), location="Zoom"),
                timed("chores", "Chores", at(3, "10:00"), at(3, "11:00"), location="Home"),
                timed("shift", "Night shift", at(4, "22:00"), at(5, "07:00"), location="Hospital"),
                all_day("trip", "Denver", "2026-11-06", "2026-11-07", location="Denver", transparency="opaque"),
            ],
        }
    )
    tue = w.days[0]
    call, chores, dentist = tue.events
    assert dentist.kid == "mom"
    assert dentist.own == "mom"
    assert (dentist.drop, dentist.pick, dentist.stay) == ("mom", "mom", True)
    assert dentist.along == (BEN,)
    assert dentist.parents == ("dad",)
    assert (dentist.start, dentist.end, dentist.loc) == (840, 900, "smile dental, 5 elm st, springfield")
    assert tue.refs["dentist"] == EventRef(ROBIN, "dentist", "", None, ("drop", "pick"))
    assert w.labels.short_places[dentist.loc] == "Smile Dental"
    assert w.travel_overrides == {dentist.loc: 25}
    # Online, at home, overnight and all day are only busy time, as before. The timed ones
    # are also cards on the board, never driven to, so they can be marked not going.
    assert tue.busy["mom"] == [BusyBlock(540, 600, "Call"), BusyBlock(600, 660, "Chores")]
    assert [(e.id, e.own, e.drop, e.pick, e.attending) for e in (call, chores)] == [
        ("call", "mom", "none", "none", True),
        ("chores", "mom", "none", "none", True),
    ]
    assert (tue.refs["call"].busy_only, tue.refs["chores"].busy_only) == ("anywhere", "home")
    assert not tue.refs["dentist"].busy_only
    assert w.days[1].busy["mom"] == [BusyBlock(1320, 1800, "Night shift")]
    assert [(e.id, e.start, e.end) for e in w.days[1].events] == [("shift", 1320, 1800)]
    assert w.days[1].refs["shift"].busy_only == "days"
    assert w.days[3].busy["mom"] == [BusyBlock(0, 1440, "Denver")]
    assert w.days[3].events == []


def test_an_event_on_both_parents_calendars_is_one_trip() -> None:
    game = timed("game", "Soccer game", at(3, "18:00"), at(3, "20:00"), location="City park")
    w = week({ROBIN: [game], SAM: [game]})
    [e] = w.days[0].events
    assert (e.own, e.parents) == ("mom", ("dad",))
    assert w.days[0].busy == {}


def test_a_parents_event_not_attended() -> None:
    w = week(
        {
            ROBIN: [
                timed("gym", "NO: Gym", at(3, "06:00"), at(3, "07:00"), location="Gym", description="Take along: Sam"),
                timed(
                    "book", "Book club", at(3, "19:00"), at(3, "21:00"), location="Library", description="Attending: no"
                ),
            ],
            SAM: [timed("gym", "NO: Gym", at(3, "06:00"), at(3, "07:00"), location="Gym")],
        }
    )
    gym, book = w.days[0].events
    assert gym.title == "Gym"
    for e in (gym, book):
        assert (e.attending, e.drop, e.pick, e.stay, e.along, e.parents) == (
            False,
            NOT_NEEDED,
            NOT_NEEDED,
            False,
            (),
            (),
        )
    # Not going, so not busy either.
    assert w.days[0].busy == {}


def test_a_kids_event_on_a_parents_calendar_stays_busy_time() -> None:
    piano = timed("piano", "Piano", at(3, "16:00"), at(3, "17:00"), location=SCHOOL)
    w = week({AVA: [piano], ROBIN: [piano]})
    [e] = w.days[0].events
    assert (e.kid, e.own) == (AVA, None)
    assert w.days[0].busy["mom"] == [BusyBlock(960, 1020, "Piano")]


def test_riders_on_the_drop_off_and_pick_up_lines() -> None:
    w = week(
        {
            AVA: [
                timed(
                    "piano",
                    "Piano",
                    at(3, "16:00"),
                    at(3, "17:00"),
                    location=SCHOOL,
                    description="Drop-off: Robin, Ben, Sam\nPick-up: Sam, Ben",
                ),
                timed(
                    "art",
                    "Art",
                    at(4, "16:00"),
                    at(4, "17:00"),
                    location=SCHOOL,
                    description="Take along: Ben, Sam\nDrop-off: Robin",
                ),
            ]
        }
    )
    [piano] = w.days[0].events
    assert (piano.drop, piano.along, piano.parents) == ("mom", (BEN,), ("dad",))
    # Sam drives the pick-up, so only Ben rides along on it.
    assert (piano.pick, piano.pick_along, piano.pick_parents) == ("dad", (BEN,), ())
    assert "piano" not in w.days[0].problems
    # An old Take along line still counts, as riders on the drop-off, a parent too.
    [art] = w.days[1].events
    assert (art.along, art.parents, art.pick_along) == ((BEN,), ("dad",), ())


def test_riders_when_the_driver_stays() -> None:
    w = week(
        {
            AVA: [
                timed(
                    "golf",
                    "Golf",
                    at(3, "14:00"),
                    at(3, "16:00"),
                    location=SCHOOL,
                    description="Drop-off: Robin, Ben\nPick-up: Robin\nStay: yes",
                ),
                timed(
                    "game",
                    "Game",
                    at(4, "14:00"),
                    at(4, "16:00"),
                    location=SCHOOL,
                    description="Drop-off: Robin, Ben\nPick-up: Robin, Sam\nStay: yes",
                ),
            ]
        }
    )
    # Everyone stays: riders named on the drop-off ride home too.
    [golf] = w.days[0].events
    assert (golf.along, golf.pick_along) == ((BEN,), (BEN,))
    assert "golf" not in w.days[0].problems
    # Different riders on each line is a conflict to fix. Meanwhile everyone goes both ways.
    [game] = w.days[1].events
    assert (game.along, game.parents, game.pick_along, game.pick_parents) == ((BEN,), ("dad",), (BEN,), ("dad",))
    assert w.days[1].problems["game"] == (
        "Stay: everyone stays, so the Drop-off and Pick-up should name the same riders",
    )


def test_own_event_payload() -> None:
    w = week(
        {
            ROBIN: [
                timed(
                    "dentist",
                    "Dentist",
                    at(3, "14:00"),
                    at(3, "15:00"),
                    location=DENTIST,
                    description="Take along: Ben, Sam",
                )
            ]
        },
        days=1,
    )
    [tue] = plan_week(w, lambda _day: make_travel({}, 15), PlannerSettings(), ("mom", "dad"))
    [e] = tue["events"]
    assert (e["own"], e["kid"], e["along"]) == ("mom", "mom", [BEN, "dad"])
    assert e["lines"]["drop"] == {"text": "Leaves 1:39", "tone": "normal"}
    assert e["lines"]["pick"] == {"text": "Home 3:15", "tone": "normal"}
    robin, sam = tue["drivers"]["mom"], tue["drivers"]["dad"]
    assert robin["busy"] == [{"start": 840, "end": 900, "title": "Dentist", "event": "dentist"}]
    # Sam rides along, so Sam is busy for the whole trip.
    assert sam["busy"] == [{"start": 819, "end": 915, "title": "Dentist", "event": None}]
    [outing] = robin["outings"]
    assert outing["title"] == "Dentist at Smile Dental"
    assert outing["first_drop"] is None
    assert outing["parents"] == {"dad": "Leave home at 1:39 PM with Robin"}
    assert not outing["solo"]
    assert tue["kids"][BEN]["items"]
    assert tue["issues"] == []


def test_a_trip_alone_to_a_parents_own_event_is_solo() -> None:
    w = week({ROBIN: [timed("dentist", "Dentist", at(3, "14:00"), at(3, "15:00"), location=DENTIST)]}, days=1)
    [tue] = plan_week(w, lambda _day: make_travel({}, 15), PlannerSettings(), ("mom", "dad"))
    [outing] = tue["drivers"]["mom"]["outings"]
    assert outing["solo"]
    assert (outing["kids"], outing["parents"], outing["riders"]) == ([], {}, {})
    assert tue["drivers"]["dad"]["busy"] == []


GYM = "Middle school gym, 15 School Ln"


def test_an_errand_fits_into_another_trip() -> None:
    w = week(
        {
            ROBIN: [
                # Marked Free, since it only takes a few minutes of the time.
                timed(
                    "jersey",
                    "Jersey pick-up",
                    at(3, "14:30"),
                    at(3, "17:30"),
                    location=GYM,
                    description="Takes: 10 min\nTake along: Ben",
                    transparency="transparent",
                ),
                timed("free", "Coffee", at(3, "09:00"), at(3, "10:00"), location="Cafe", transparency="transparent"),
            ],
            AVA: [
                timed(
                    "piano",
                    "Piano",
                    at(3, "16:00"),
                    at(3, "17:00"),
                    location=SCHOOL,
                    description="Pick-up: Robin\nDrop-off: Not needed",
                )
            ],
        },
        days=1,
    )
    jersey = next(e for e in w.days[0].events if e.id == "jersey")
    assert (jersey.takes, jersey.start, jersey.end, jersey.along) == (10, 870, 1050, ())
    assert [e.id for e in w.days[0].events] == ["jersey", "piano"]

    def base(a: str, b: str) -> float | None:
        return (
            6 if {a, b} == {"lincoln elementary, 100 main st, springfield", "middle school gym, 15 school ln"} else None
        )

    [tue] = plan_week(w, lambda _day: make_travel({}, 15, base), PlannerSettings(), ("mom", "dad"))
    robin = tue["drivers"]["mom"]
    # Robin picks Ava up at 5 and stops at the gym on the way home.
    [outing] = robin["outings"]
    assert outing["title"] == "Pick up Ava at Lincoln Elementary, Jersey pick-up at Middle school gym"
    assert outing["lines"] == [
        "5:00  Lincoln Elementary, pick up Ava",
        "5:06  Middle school gym, Jersey pick-up",
        "5:31  Home",
    ]
    assert not outing["solo"]
    e = next(e for e in tue["events"] if e["id"] == "jersey")
    assert (e["takes"], e["planned"]) == (10, 1026)
    assert e["lines"]["drop"] == {"text": "Stop at 5:06", "tone": "normal"}
    assert robin["busy"] == [{"start": 1026, "end": 1036, "title": "Jersey pick-up", "event": "jersey"}]
    assert tue["issues"] == []


def test_an_errand_goes_on_a_parents_calendar() -> None:
    w = week({AVA: [timed("jersey", "Jersey", at(3, "14:30"), at(3, "17:30"), location=GYM, description="Takes: 10")]})
    [e] = w.days[0].events
    assert e.takes is None
    assert w.days[0].problems["jersey"] == ("Takes: errands go on a parent’s own calendar",)


def test_a_stay_away_is_home_for_its_parents_rides() -> None:
    # Marty, 2026-11-18: on a trip, rides start and end at the hotel, and a place given only by
    # name is the one near the hotel, not the one near home.
    hotel = "Marriott, 1401 W 22nd St, Oak Brook, IL 60523"
    stay = Stay("trip", ("mom", AVA), "Marriott Chicago", hotel, date(2026, 11, 3), date(2026, 11, 3))
    w = build_week(
        {
            AVA: [
                ev(
                    AVA,
                    timed(
                        "game",
                        "Volleyball",
                        at(3, "16:00"),
                        at(3, "17:00"),
                        location="Lifetime Fitness",
                        description="Drop-off: Robin\nPick-up: Robin",
                    ),
                ),
                ev(AVA, timed("wed", "Volleyball", at(4, "16:00"), at(4, "17:00"), location="Lifetime Fitness")),
            ],
            BEN: [ev(BEN, timed("soccer", "Soccer", at(3, "16:00"), at(3, "17:00"), location="Park"))],
        },
        ROLES,
        DIRECTORY,
        TODAY,
        2,
        TZ,
        HOME_ADDRESS,
        stays=[stay],
    )
    tue, wed = w.days
    key = "marriott, 1401 w 22nd st, oak brook, il 60523"
    assert tue.homes == {"mom": key}
    assert wed.homes == {}
    # Ava is on the trip, so her game is at the Lifetime Fitness near the hotel; Ben isn't.
    game, soccer = (next(e for e in tue.events if e.id == i) for i in ("game", "soccer"))
    assert game.loc == "lifetime fitness, oak brook, il 60523"
    assert soccer.loc == "park"
    assert next(e for e in wed.events if e.id == "wed").loc == "lifetime fitness"
    home = Place(address=HOME_ADDRESS)
    assert place_for(w, key, home) == Place(address=hotel)
    assert place_for(w, game.loc, home) == Place(address="Lifetime Fitness, Oak Brook, IL 60523")
    assert w.labels.short_place(key) == "Marriott Chicago"

    asked: set[tuple[str, str]] = set()

    def drive(a: str, b: str) -> float:
        asked.add((a, b))
        return 10

    days = plan_week(w, lambda _day: drive, PlannerSettings(), ("mom", "dad"))
    robin = days[0]["drivers"]["mom"]
    assert robin["home"] == {"place": key, "name": "Marriott Chicago"}
    assert days[0]["drivers"]["dad"]["home"] is None
    assert (key, game.loc) in asked
    assert (HOME, game.loc) not in asked
    out = robin["outings"][0]
    assert out["home"] == "Marriott Chicago"
    assert out["lines"][-1].endswith("  Marriott Chicago")
    assert out["riders"][AVA].startswith("Leave Marriott Chicago at ")
    assert out["go"]["from"] == key
    assert out["go"]["from_name"] == "Marriott Chicago"


def test_a_timed_stay_plans_the_drive_there_and_back() -> None:
    # Marty, 2026-11-18: a stay from 12:30 on its first day to 1:00 on its last plans the drive
    # to the hotel (there by 12:30, with the arrive-early margin) and the drive home after.
    hotel = "Marriott, 1401 W 22nd St, Oak Brook, IL 60523"
    key = "marriott, 1401 w 22nd st, oak brook, il 60523"
    dentist = "Smile Dental, 5 Elm St, Springfield, IL 62701"
    stay = Stay(
        "trip",
        ("mom", "dad", AVA, BEN),
        "Marriott Chicago",
        hotel,
        date(2026, 11, 3),
        date(2026, 11, 5),
        arrive=750,
        leave=780,
        # Sam is there already, so only Robin and the kids drive up. Nothing says who drives
        # back, so Robin does, with everyone else on the stay along.
        description="--- Rides ---\nDrop-off: Robin, Ava, Ben",
    )
    w = build_week(
        {
            AVA: [
                ev(
                    AVA,
                    timed(
                        "teeth",
                        "Dentist",
                        at(3, "06:00"),
                        at(3, "06:20"),
                        location=dentist,
                        description="Drop-off: Robin\nPick-up: Robin",
                    ),
                ),
                ev(
                    AVA,
                    timed(
                        "pool",
                        "Swim",
                        at(3, "17:00"),
                        at(3, "18:00"),
                        location="Pool, 9 Lake St, Oak Brook, IL 60523",
                        description="Drop-off: Robin\nPick-up: Robin",
                    ),
                ),
            ],
        },
        ROLES,
        DIRECTORY,
        TODAY,
        3,
        TZ,
        HOME_ADDRESS,
        stays=[stay],
    )
    tue, wed, thu = w.days
    assert [(t.driver, t.due, t.there, t.riders) for t in tue.trips] == [("mom", 750, True, (AVA, BEN))]
    assert wed.trips == []
    assert [(t.driver, t.due, t.there, t.riders) for t in thu.trips] == [("mom", 780, False, ("dad", AVA, BEN))]
    assert tue.homes == wed.homes == thu.homes == {"mom": key, "dad": key}

    def drive(a: str, b: str) -> float:
        return 300 if {a, b} == {HOME, key} else 10

    days = plan_week(w, lambda _day: drive, PlannerSettings(), ("mom", "dad"))
    robin = days[0]["drivers"]["mom"]
    teeth, trip, pool, _ = robin["outings"]
    # The dentist in the morning is from home, before the drive up.
    assert teeth["home"] == "Home"
    assert teeth["lines"][-1].endswith("  Home")
    # 5 hours away aims to be there 30 minutes early: leave at 7:00, there at 12:00.
    assert (trip["start"], trip["end"]) == (420, 720)
    assert trip["lead"] == "Leave 7:00"
    assert trip["title"] == "Drive Ava and Ben to Marriott Chicago"
    assert trip["lines"] == ["12:00  Marriott Chicago, there by 12:30"]
    assert trip["riders"] == {AVA: "Leave home at 7:00 AM with Robin", BEN: "Leave home at 7:00 AM with Robin"}
    assert trip["parents"] == {}
    assert trip["go"]["to"] == key
    # Swim in the evening is from the hotel.
    assert pool["home"] == "Marriott Chicago"
    assert pool["riders"][AVA].startswith("Leave Marriott Chicago at ")
    # Ben is in the car for the drive, so it's in his column.
    ben = days[0]["kids"][BEN]["items"]
    assert [(i["type"], i["start"], i["end"]) for i in ben] == [("ride", 420, 720)]
    assert days[0]["issues"] == []
    # Sam isn't in the car: no drive, and the hotel is home all day.
    assert days[0]["drivers"]["dad"]["outings"] == []

    back = days[2]["drivers"]["mom"]["outings"]
    assert [(o["lead"], o["title"], o["lines"]) for o in back] == [
        ("Leave 1:00", "Drive Ava and Ben home from Marriott Chicago", ["6:00  Home"])
    ]
    assert back[0]["parents"] == {"dad": "Leave Marriott Chicago at 1:00 PM with Robin"}


def test_one_stay_ending_as_the_next_begins_drives_hotel_to_hotel() -> None:
    # Marty, 2026-11-19: Sam is away at a loft until 12:30, when the family's stay at the
    # Marriott starts. Sam drives from the loft to the Marriott, not home and back up, and the
    # evening is planned from the Marriott.
    loft = "Loft, 1 State St, Chicago, IL 60601"
    loft_key = "loft, 1 state st, chicago, il 60601"
    hotel = "Marriott, 1401 W 22nd St, Oak Brook, IL 60523"
    key = "marriott, 1401 w 22nd st, oak brook, il 60523"
    away = Stay("loft", ("dad",), "Loft", loft, date(2026, 11, 1), date(2026, 11, 3), arrive=600, leave=750)
    stay = Stay(
        "trip",
        ("mom", "dad", AVA, BEN),
        "Marriott Chicago",
        hotel,
        date(2026, 11, 3),
        date(2026, 11, 5),
        arrive=750,
        leave=780,
        description="--- Rides ---\nDrop-off: Robin, Ava, Ben",
    )
    pool = timed(
        "pool",
        "Swim",
        at(3, "17:00"),
        at(3, "18:00"),
        location="Pool, 9 Lake St, Oak Brook, IL 60523",
        description="Drop-off: Sam\nPick-up: Sam",
    )
    w = build_week({AVA: [ev(AVA, pool)]}, ROLES, DIRECTORY, TODAY, 3, TZ, HOME_ADDRESS, stays=[away, stay])
    tue = w.days[0]
    trips = [(t.driver, t.place, t.due, t.there, t.other) for t in tue.trips]
    assert trips == [("dad", loft_key, 750, False, key), ("mom", key, 750, True, HOME)]
    assert tue.spans["dad"] == [(-math.inf, 750, loft_key), (750, math.inf, key)]
    assert tue.homes == {"mom": key, "dad": key}

    def drive(a: str, b: str) -> float:
        return 300 if HOME in (a, b) and a != b else 0 if a == b else 20

    days = plan_week(w, lambda _day: drive, PlannerSettings(), ("mom", "dad"))
    sam = days[0]["drivers"]["dad"]["outings"]
    trip, drop, pick = sam
    assert (trip["start"], trip["end"]) == (750, 770)
    assert trip["title"] == "Drive from Loft to Marriott Chicago"
    assert trip["lines"] == ["12:50  Marriott Chicago"]
    # The swim is 20 minutes from the Marriott, not 5 hours from home.
    assert drop["home"] == pick["home"] == "Marriott Chicago"
    assert drop["lead"] == "Leave 4:33"
    assert drop["lines"] == ["4:53  Pool, drop off Ava", "5:13  Marriott Chicago"]


def test_the_drive_to_a_stay_starts_from_another_one_still_going() -> None:
    # Sam's loft runs all week, and Sam drives to the Marriott from there.
    loft_key = "loft, 1 state st, chicago, il 60601"
    key = "marriott, 1401 w 22nd st, oak brook, il 60523"
    away = Stay("loft", ("dad",), "Loft", "Loft, 1 State St, Chicago, IL 60601", date(2026, 11, 1), date(2026, 11, 9))
    stay = Stay(
        "trip",
        ("dad",),
        "Marriott Chicago",
        "Marriott, 1401 W 22nd St, Oak Brook, IL 60523",
        date(2026, 11, 3),
        date(2026, 11, 5),
        arrive=750,
        leave=780,
    )
    w = build_week({}, ROLES, DIRECTORY, TODAY, 3, TZ, HOME_ADDRESS, stays=[away, stay])
    tue, _, thu = w.days
    assert [(t.there, t.other, t.title) for t in tue.trips] == [(True, loft_key, "Drive from Loft to Marriott Chicago")]
    assert [(t.there, t.other, t.title) for t in thu.trips] == [
        (False, loft_key, "Drive from Marriott Chicago to Loft")
    ]
    assert tue.homes == {"dad": key}


def test_a_ride_during_the_drive_up_is_a_problem() -> None:
    hotel = "Marriott, 1401 W 22nd St, Oak Brook, IL 60523"
    key = "marriott, 1401 w 22nd st, oak brook, il 60523"
    stay = Stay(
        "trip", ("mom",), "Marriott Chicago", hotel, date(2026, 11, 3), date(2026, 11, 4), arrive=750, leave=600
    )
    w = build_week(
        {
            AVA: [
                ev(
                    AVA,
                    timed(
                        "piano",
                        "Piano",
                        at(3, "09:00"),
                        at(3, "10:00"),
                        location=SCHOOL,
                        description="Drop-off: Robin\nPick-up: Robin",
                    ),
                )
            ]
        },
        ROLES,
        DIRECTORY,
        TODAY,
        2,
        TZ,
        HOME_ADDRESS,
        stays=[stay],
    )

    def drive(a: str, b: str) -> float:
        return 300 if {a, b} == {HOME, key} else 10

    days = plan_week(w, lambda _day: drive, PlannerSettings(), ("mom", "dad"))
    assert [(x["kind"], x["driver"]) for x in days[0]["issues"]] == [("busy", "mom")]
    assert "Drive to Marriott Chicago" in days[0]["issues"][0]["title"]
