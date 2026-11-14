"""Sorting the shared family calendar into each person's events."""

from __future__ import annotations

from dataclasses import replace
from datetime import date, datetime
from zoneinfo import ZoneInfo

from custom_components.mydashlight.google import CalendarEvent
from custom_components.mydashlight.school import is_no_school
from custom_components.mydashlight.shared import in_window, school_lanes, split_events
from custom_components.mydashlight.who import People

TZ = ZoneInfo("America/Chicago")
FAMILY = "family@group.calendar.google.com"
LUNCH = "lunch@group.calendar.google.com"
PEOPLE = People(
    kids={"ava": "Ava", "ben": "Ben", "cleo": "Cleo"},
    parents={"mom": "Robin", "dad": "Sam"},
    aliases={"mom": ["Mom"], "dad": ["Dad"]},
)


def timed(event_id: str, title: str, start: str, end: str, cal: str = FAMILY, **extra: object) -> CalendarEvent:
    return CalendarEvent(
        calendar_id=cal,
        id=event_id,
        etag='"1"',
        title=title,
        location="",
        description="",
        start=datetime.fromisoformat(start).replace(tzinfo=TZ),
        end=datetime.fromisoformat(end).replace(tzinfo=TZ),
        busy=True,
        **extra,  # type: ignore[arg-type]
    )


def all_day(event_id: str, title: str, start: str, end: str, cal: str = FAMILY) -> CalendarEvent:
    return CalendarEvent(
        calendar_id=cal,
        id=event_id,
        etag='"1"',
        title=title,
        location="",
        description="",
        start=date.fromisoformat(start),
        end=date.fromisoformat(end),
        busy=False,
    )


def test_lanes() -> None:
    split = split_events(
        [
            timed("ballet", "Ava Ballet", "2026-11-03T18:00", "2026-11-03T19:00"),
            timed("dentist", "Ben & Cleo Dentist", "2026-11-03T10:00", "2026-11-03T11:00"),
            timed("donuts", "Dad, Ben & Cleo Donuts", "2026-11-04T08:00", "2026-11-04T09:00"),
            timed("rounds", "Robin Grand Rounds", "2026-11-04T07:00", "2026-11-04T08:00"),
            timed("trip", "Robin Indianapolis", "2026-11-10T07:00", "2026-11-13T19:00"),
            timed("golf", "NO Ava Golf", "2026-11-05T14:00", "2026-11-05T16:00"),
            timed("declined", "Ava Party", "2026-11-05T14:00", "2026-11-05T16:00", declined=True),
        ],
        PEOPLE,
        TZ,
    )
    titles = {pid: [(e.id, e.title) for e in evs] for pid, evs in split.lanes.items()}
    assert titles == {
        # The names go without saying in a lane. A NO still means they aren't going.
        "ava": [("ballet", "Ballet"), ("golf", "NO Golf")],
        "ben": [("dentist", "Dentist"), ("donuts", "Donuts")],
        "cleo": [("dentist", "Dentist"), ("donuts", "Donuts")],
        "mom": [("rounds", "Grand Rounds"), ("trip", "Indianapolis")],
        "dad": [("donuts", "Donuts")],
    }
    assert split.unplaced == []
    assert split.day_items == []
    # Dad goes with the kids, so he takes them unless the notes say otherwise.
    assert split.escorts == {"donuts": ("dad",)}


def test_all_day_events_go_across_the_top() -> None:
    split = split_events(
        [
            all_day("trash", "Trash & Recycling Day", "2026-11-06", "2026-11-07"),
            all_day("jersey", "Ben wear the black jersey", "2026-11-06", "2026-11-07"),
            all_day("break", "Winter Break", "2026-12-23", "2027-01-05"),
            all_day("away", "Robin Indianapolis", "2026-11-10", "2026-11-14"),
        ],
        PEOPLE,
        TZ,
    )
    # Nobody's, whoever they name, and they never stop anyone driving.
    assert all(not evs for evs in split.lanes.values())
    assert [(i.id, i.people, i.first, i.last) for i in split.day_items] == [
        ("trash", (), date(2026, 11, 6), date(2026, 11, 6)),
        ("jersey", ("ben",), date(2026, 11, 6), date(2026, 11, 6)),
        ("break", (), date(2026, 12, 23), date(2027, 1, 4)),
        ("away", ("mom",), date(2026, 11, 10), date(2026, 11, 13)),
    ]
    days = in_window(split, [date(2026, 11, 6), date(2026, 11, 11)])
    assert [i["id"] for i in days["2026-11-06"]["all_day"]] == ["trash", "jersey"]
    (away,) = days["2026-11-11"]["all_day"]
    assert (away["title"], away["day_number"], away["days"]) == ("Robin Indianapolis", 2, 4)


def test_events_for_nobody_are_flagged() -> None:
    split = split_events(
        [
            timed("bid", "Garage floor 2nd bid", "2026-11-03T16:00", "2026-11-03T17:00"),
            timed("happy", "Happy Hour Robin", "2026-11-03T17:00", "2026-11-03T18:00"),
            timed("sleepover", "Ava & Zoe Sleepover", "2026-11-04T18:00", "2026-11-05T09:00"),
        ],
        PEOPLE,
        TZ,
    )
    assert [(u.id, u.reason, u.word, u.day) for u in split.unplaced] == [
        ("bid", "nobody", None, date(2026, 11, 3)),
        ("happy", "nobody", None, date(2026, 11, 3)),
        # Ava's lane has it, but a misspelt kid would be missed, so it's flagged too.
        ("sleepover", "unknown", "Zoe", date(2026, 11, 4)),
    ]
    assert [e.title for e in split.lanes["ava"]] == ["Zoe Sleepover"]
    days = in_window(split, [date(2026, 11, 3)])
    assert [u["id"] for u in days["2026-11-03"]["unplaced"]] == ["bid", "happy"]


def test_the_for_line_in_the_notes_wins_over_the_title() -> None:
    def noted(event_id: str, title: str, names: str) -> CalendarEvent:
        ev = timed(event_id, title, "2026-11-14T12:45", "2026-11-14T14:45")
        return replace(ev, description=f"At the gym.\n\n--- Rides ---\nFor: {names}")

    split = split_events(
        [
            noted("party", "Patrick's 5th Birthday Party", "Ava & Ben"),
            noted("piano", "Ava Piano", "Ava & Cleo"),
            noted("golf", "Sam Golf", "Cleo"),
            noted("sleepover", "Ava & Zoe Sleepover", "Ava"),
            noted("typo", "Bid", "Ava, Zoey"),
            noted("ghost", "Ghost tour", "Zoe"),
            replace(
                all_day("jersey", "Wear the black jersey", "2026-11-14", "2026-11-15"),
                description="--- Rides ---\nFor: Ben",
            ),
        ],
        PEOPLE,
        TZ,
    )
    titles = {pid: [(e.id, e.title) for e in evs] for pid, evs in split.lanes.items()}
    assert titles == {
        "ava": [
            ("party", "Patrick's 5th Birthday Party"),
            ("piano", "Piano"),
            ("sleepover", "Zoe Sleepover"),
            ("typo", "Bid"),
        ],
        "ben": [("party", "Patrick's 5th Birthday Party")],
        # The title's names stay on only when the For line doesn't name them all.
        "cleo": [("piano", "Piano"), ("golf", "Sam Golf")],
        "mom": [],
        "dad": [],
    }
    # A name in the For line that isn't anyone is flagged, the same as one in a title.
    assert [(u.id, u.reason, u.word, u.people, u.from_notes) for u in split.unplaced] == [
        ("typo", "unknown", "Zoey", ("ava",), True),
        ("ghost", "unknown", "Zoe", (), True),
    ]
    assert [(i.id, i.people) for i in split.day_items] == [("jersey", ("ben",))]


def test_unplaced_says_where_to_save() -> None:
    split = split_events(
        [timed("bid_1", "Garage floor bid", "2026-11-14T16:00", "2026-11-14T17:00", recurring_id="bid")], PEOPLE, TZ
    )
    (bid,) = split.unplaced
    assert (bid.calendar_id, bid.recurring_id, bid.from_notes) == (FAMILY, "bid", False)
    assert bid.as_dict()["recurring"] is True


def test_school_lanes() -> None:
    lanes = school_lanes(
        [
            all_day("l1", "Ava Lunch: Pizza", "2026-11-09", "2026-11-10", cal=LUNCH),
            all_day("l2", "Ben Lunch", "2026-11-09", "2026-11-10", cal=LUNCH),
            all_day("l3", "Ben & Cleo Lunch: Tacos", "2026-11-10", "2026-11-11", cal=LUNCH),
            all_day("l4", "Lunch: Soup", "2026-11-10", "2026-11-11", cal=LUNCH),
        ],
        [
            all_day("off", "No School - Thanksgiving", "2026-11-25", "2026-11-28"),
            all_day("cleo-off", "Cleo No School (field day)", "2026-11-12", "2026-11-13"),
            all_day("trash", "Trash & Recycling Day", "2026-11-06", "2026-11-07"),
            timed("lunch", "Robin Lunch: with Sam", "2026-11-09T12:00", "2026-11-09T13:00"),
        ],
        PEOPLE,
        is_no_school,
    )
    titles = {kid: [(e.id, e.title, e.calendar_id) for e in evs] for kid, evs in lanes.items()}
    # A lunch names one kid; a day off with no name is everyone's.
    assert titles == {
        "ava": [("l1", "Lunch: Pizza", LUNCH), ("off", "No School - Thanksgiving", FAMILY)],
        "ben": [("l2", "Lunch", LUNCH), ("off", "No School - Thanksgiving", FAMILY)],
        "cleo": [("off", "No School - Thanksgiving", FAMILY), ("cleo-off", "No School (field day)", FAMILY)],
    }
