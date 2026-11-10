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
    travel = make_travel(w.travel_overrides, 15)
    days = plan_week(w, lambda _day: travel, PlannerSettings(), ("mom", "dad"))

    assert [d["date"] for d in days] == ["2026-11-03", "2026-11-04"]
    tue = days[0]
    assert "along" not in tue
    assert [e["id"] for e in tue["events"]] == ["piano", "soccer", "dance"]
    piano = tue["events"][0]
    assert piano["place_name"] == SCHOOL
    assert piano["short_place"] == "Lincoln Elementary"
    assert piano["calendar_id"] == AVA
    assert piano["lines"]["drop"]["tone"] in ("normal", "problem")
    robin = tue["drivers"]["mom"]
    assert robin["name"] == "Robin"
    assert robin["busy"] == [{"start": 480, "end": 955, "title": "Work", "event": None}]
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
    [dentist] = tue.events
    assert dentist.kid == "mom"
    assert dentist.own == "mom"
    assert (dentist.drop, dentist.pick, dentist.stay) == ("mom", "mom", True)
    assert dentist.along == (BEN,)
    assert dentist.parents == ("dad",)
    assert (dentist.start, dentist.end, dentist.loc) == (840, 900, "smile dental, 5 elm st, springfield")
    assert tue.refs["dentist"] == EventRef(ROBIN, "dentist", "", None, ("drop", "pick"))
    assert w.labels.short_places[dentist.loc] == "Smile Dental"
    assert w.travel_overrides == {dentist.loc: 25}
    # Online, at home, overnight and all day are only busy time, as before.
    assert tue.busy["mom"] == [BusyBlock(540, 600, "Call"), BusyBlock(600, 660, "Chores")]
    assert w.days[1].busy["mom"] == [BusyBlock(1320, 1800, "Night shift")]
    assert w.days[3].busy["mom"] == [BusyBlock(0, 1440, "Denver")]
    assert all(not d.events for d in w.days[1:])


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
    assert e["lines"]["drop"] == {"text": "Leaves 1:38", "tone": "normal"}
    assert e["lines"]["pick"] == {"text": "Home 3:15", "tone": "normal"}
    robin, sam = tue["drivers"]["mom"], tue["drivers"]["dad"]
    assert robin["busy"] == [{"start": 840, "end": 900, "title": "Dentist", "event": "dentist"}]
    # Sam rides along, so Sam is busy for the whole trip.
    assert sam["busy"] == [{"start": 818, "end": 915, "title": "Dentist", "event": None}]
    [outing] = robin["outings"]
    assert outing["title"] == "Dentist at Smile Dental"
    assert outing["first_drop"] is None
    assert outing["parents"] == {"dad": "Leave home at 1:38 PM with Robin"}
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
    # Robin stops at the gym on the way to pick Ava up at 5, so Ava doesn't wait in the car.
    [outing] = robin["outings"]
    assert outing["title"] == "Jersey pick-up at Middle school gym, pick up Ava at Lincoln Elementary"
    assert outing["lines"] == [
        "4:44  Middle school gym, Jersey pick-up",
        "5:00  Lincoln Elementary, pick up Ava",
        "5:15  Home",
    ]
    assert not outing["solo"]
    e = next(e for e in tue["events"] if e["id"] == "jersey")
    assert (e["takes"], e["planned"]) == (10, 1004)
    assert e["lines"]["drop"] == {"text": "Stop at 4:44", "tone": "normal"}
    assert robin["busy"] == [{"start": 1004, "end": 1014, "title": "Jersey pick-up", "event": "jersey"}]
    assert tue["issues"] == []


def test_an_errand_goes_on_a_parents_calendar() -> None:
    w = week({AVA: [timed("jersey", "Jersey", at(3, "14:30"), at(3, "17:30"), location=GYM, description="Takes: 10")]})
    [e] = w.days[0].events
    assert e.takes is None
    assert w.days[0].problems["jersey"] == ("Takes: errands go on a parent’s own calendar",)
