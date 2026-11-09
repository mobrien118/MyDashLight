"""Writes a week of sample ride plans in the shape ``mydashlight.get_plan`` returns.

The app's tests, its screenshots and the offline preview all draw this week. It runs the real
planner (``payload.plan_day``), so the sample can't drift from what the backend sends.

    python frontend/scripts/sample_plan.py > frontend/test/fixtures/week.json

Names default to the made-up ones the repo's tests use. ``--names`` swaps in others for a
private preview, as ``kid1,kid2,kid3,driver1,driver2``; that output is never committed.
"""

from __future__ import annotations

import argparse
from datetime import date, datetime, timedelta
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from custom_components.mydashlight.payload import plan_day
from custom_components.mydashlight.planner import (
    HOME,
    BusyBlock,
    Labels,
    PlannerSettings,
    RideEvent,
)
from custom_components.mydashlight.shared import DayItem, Unplaced
from custom_components.mydashlight.week import DayInput, EventRef, make_travel

FIRST_DAY = date(2026, 11, 5)  # a Thursday
UPDATED = "2026-11-05T22:10:00+00:00"
KIDS = ("kid-a@group.calendar.google.com", "kid-b@group.calendar.google.com", "kid-c@group.calendar.google.com")
DRIVERS = ("mom", "dad")

PLACES = {
    "piano": ("Piano studio, 410 Elm St", "Piano studio"),
    "soccer": ("Soccer fields, 2200 Park Rd", "Soccer fields"),
    "football": ("Football field, 90 Stadium Dr", "Football field"),
    "gym": ("Middle school gym, 15 School Ln", "Middle school gym"),
    "church": ("Church, 7 Chapel Way", "Church"),
    "party": ("Liam's house, 31 Oak Ct", "Liam's house"),
    "dance": ("Dance studio, 88 Main St", "Dance studio"),
    "nextdoor": ("Next door, 12 Maple Ave", "Next door"),
    "golf": ("Golf course, 500 Fairway Dr", "Golf course"),
    "library": ("Library, 3 Book Ln", "Library"),
    "cleaners": ("Dry cleaners, 40 Main St", "Dry cleaners"),
}
DRIVE = {
    "home|piano": 10,
    "home|soccer": 15,
    "home|football": 20,
    "home|gym": 8,
    "piano|soccer": 12,
    "piano|football": 18,
    "piano|gym": 10,
    "soccer|football": 10,
    "soccer|gym": 14,
    "football|gym": 16,
    "home|church": 12,
    "home|party": 9,
    "home|dance": 11,
    "dance|football": 14,
    "dance|soccer": 9,
    "home|golf": 18,
    "football|golf": 12,
    "home|library": 10,
    "home|cleaners": 7,
    "cleaners|football": 9,
}

# day, kid (0-2), id, title, place, start, end, drop, pick, stay, arrive_by, along, recurring
WEEK: list[tuple[int, int, str, str, str, str, str, str, str, bool, str | None, tuple[int, ...], bool]] = [
    (0, 0, "piano", "Piano", "piano", "3:45 PM", "4:30 PM", "mom", "mom", True, None, (), True),
    (0, 2, "soccer", "Soccer", "soccer", "5:00 PM", "6:30 PM", "dad", "mom", False, None, (), True),
    (0, 1, "football", "Football", "football", "5:30 PM", "7:00 PM", "dad", "dad", False, "5:15 PM", (), True),
    (0, 0, "volley", "Volleyball", "gym", "6:15 PM", "8:00 PM", "Dustin", "", False, None, (), False),
    (0, 1, "tutor", "Math tutor", "home", "4:00 PM", "4:45 PM", "none", "none", False, None, (), True),
    (1, 2, "fri-soccer", "Soccer practice", "soccer", "5:00 PM", "6:00 PM", "mom", "mom", False, None, (), False),
    (1, 1, "fri-party", "Birthday party", "party", "6:00 PM", "8:30 PM", "dad", "dad", False, None, (), False),
    (1, 0, "fri-sit", "Babysitting", "nextdoor", "6:30 PM", "9:30 PM", "none", "none", False, None, (), False),
    (
        2,
        0,
        "sat-tourney",
        "Volleyball tournament",
        "gym",
        "8:00 AM",
        "3:00 PM",
        "the Cunninghams",
        "dad",
        False,
        "7:45 AM",
        (),
        False,
    ),
    (2, 2, "sat-soccer", "Soccer game", "soccer", "9:00 AM", "10:15 AM", "dad", "dad", True, "8:45 AM", (), False),
    (
        2,
        1,
        "sat-football",
        "Football game",
        "football",
        "11:00 AM",
        "1:00 PM",
        "mom",
        "mom",
        True,
        "10:40 AM",
        (),
        False,
    ),
    (3, 0, "sun-youth", "Youth group", "church", "6:00 PM", "7:30 PM", "mom", "", False, None, (), True),
    (4, 0, "mon-piano", "Piano", "piano", "3:45 PM", "4:30 PM", "mom", "mom", False, None, (1,), True),
    (4, 1, "mon-football", "Football", "football", "5:30 PM", "7:00 PM", "mom", "dad", False, None, (), True),
    (5, 2, "tue-soccer", "Soccer", "soccer", "5:00 PM", "6:30 PM", "mom", "dad", False, None, (), True),
    (5, 2, "tue-art", "Art class", "dance", "6:00 PM", "7:00 PM", "dad", "dad", False, None, (), False),
    (5, 0, "tue-volley", "Volleyball", "gym", "6:15 PM", "8:00 PM", "the Smiths", "mom", False, None, (), False),
    (6, 2, "wed-dance", "Dance", "dance", "4:00 PM", "5:00 PM", "mom", "mom", False, None, (), True),
    (6, 1, "wed-football", "Football", "football", "5:30 PM", "7:00 PM", "dad", "dad", False, None, (), True),
]
# A parent's own events at a place: they drive themselves, maybe with kids (0-2) or the other
# parent along. With takes it's an errand: that many minutes any time in the window.
# day, driver, id, title, place, start, end, kids along, parents along, takes
OWN: list[tuple[int, str, str, str, str, str, str, tuple[int, ...], tuple[str, ...], int | None]] = [
    (3, "dad", "sun-golf", "Golf", "golf", "1:00 PM", "4:00 PM", (1,), ("mom",), None),
    (5, "mom", "tue-book", "Book club", "library", "10:00 AM", "11:30 AM", (), (), None),
    (4, "dad", "mon-cleaners", "Pick up dry cleaning", "cleaners", "5:00 PM", "7:30 PM", (), (), 10),
]
# Each driver's own calendar, by day.
BUSY: dict[int, dict[str, list[tuple[str, str, str]]]] = {
    0: {"dad": [("1:00 PM", "4:40 PM", "Work")]},
    1: {"dad": [("9:00 AM", "4:00 PM", "Work")]},
    4: {"dad": [("9:00 AM", "5:00 PM", "Work")]},
    5: {"dad": [("9:00 AM", "5:00 PM", "Work")]},
    6: {"dad": [("9:00 AM", "5:00 PM", "Work")], "mom": [("12:00 PM", "1:00 PM", "Dentist")]},
}

# All-day events across the top of each day they cover: first day, last day, id, title, and who
# the title names (kid indexes or driver ids), only for the colour.
ALL_DAY: list[tuple[int, int, str, str, tuple[int | str, ...]]] = [
    (1, 1, "trash", "Trash & Recycling Day", ()),
    (1, 1, "jersey", "Wear the black jersey", (1,)),
    (3, 5, "trip", "Indianapolis", ("mom",)),
]
# Timed events whose titles don't say who they're for: day, id, title, start, end.
UNPLACED: list[tuple[int, str, str, str, str]] = [
    (1, "bid", "Garage floor bid", "4:00 PM", "5:00 PM"),
]


def minutes(text: str) -> int:
    clock, half = text.split()
    h, m = (int(x) for x in clock.split(":"))
    return (h % 12 + (12 if half == "PM" else 0)) * 60 + m


def key(place: str) -> str:
    if place == "home":
        return HOME
    return " ".join(PLACES[place][0].split()).casefold()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--names", default="Ava,Ben,Cleo,Robin,Sam")
    args = parser.parse_args()
    names = [n.strip() for n in args.names.split(",")]
    if len(names) != 5:
        parser.error("--names takes three kids and two drivers")

    labels = Labels(
        kids=dict(zip(KIDS, names[:3], strict=True)),
        drivers=dict(zip(DRIVERS, names[3:], strict=True)),
        places={HOME: "Home", **{key(p): full for p, (full, _) in PLACES.items()}},
        short_places={HOME: "Home", **{key(p): short for p, (_, short) in PLACES.items()}},
    )
    by_key = {key(p): p for p in PLACES}
    table = {}
    for pair, mins in DRIVE.items():
        a, b = pair.split("|")
        ka = HOME if a == "home" else key(a)
        kb = HOME if b == "home" else key(b)
        table[(ka, kb)] = table[(kb, ka)] = mins

    def base(a: str, b: str) -> float | None:
        assert a in by_key or a == HOME, a
        return table.get((a, b))

    travel = make_travel({}, 15, base)
    # A fixed 5 minutes early, so the sample week (and the app tests built on it) keep the times
    # they were written for. Real plans grow the margin with the drive.
    settings = PlannerSettings(arrive_early_per=0)

    days = []
    for offset in range(7):
        day = DayInput(FIRST_DAY + timedelta(days=offset))
        for d, kid, ev_id, title, place, start, end, drop, pick, stay, arrive, along, recurring in WEEK:
            if d != offset:
                continue
            day.events.append(
                RideEvent(
                    id=ev_id,
                    kid=KIDS[kid],
                    title=title,
                    loc=key(place),
                    start=minutes(start),
                    end=minutes(end),
                    drop=drop,
                    pick=pick,
                    stay=stay,
                    arrive_by=minutes(arrive) if arrive else None,
                    along=tuple(KIDS[k] for k in along),
                )
            )
            day.refs[ev_id] = EventRef(
                KIDS[kid], f"{ev_id}-google", "etag", f"{ev_id}-series" if recurring else None, ("drop", "pick")
            )
        for d, driver, ev_id, title, place, start, end, kids, parents, takes in OWN:
            if d != offset:
                continue
            day.events.append(
                RideEvent(
                    id=ev_id,
                    kid=driver,
                    title=title,
                    loc=key(place),
                    start=minutes(start),
                    end=minutes(end),
                    drop=driver,
                    pick=driver,
                    stay=True,
                    along=tuple(KIDS[k] for k in kids),
                    own=driver,
                    parents=parents,
                    takes=takes,
                )
            )
            day.refs[ev_id] = EventRef(f"{driver}-calendar", f"{ev_id}-google", "etag", None, ("drop", "pick"))
        for driver, blocks in BUSY.get(offset, {}).items():
            day.busy[driver] = [BusyBlock(minutes(s), minutes(e), t) for s, e, t in blocks]
        for first, last, ev_id, title, people in ALL_DAY:
            if first <= offset <= last:
                item = DayItem(
                    ev_id,
                    title,
                    tuple(KIDS[p] if isinstance(p, int) else p for p in people),
                    FIRST_DAY + timedelta(days=first),
                    FIRST_DAY + timedelta(days=last),
                )
                day.all_day.append(item.as_dict(day.day))
        for d, ev_id, title, start, end in UNPLACED:
            if d == offset:
                at = datetime.combine(day.day, datetime.strptime(start, "%I:%M %p").time())
                until = datetime.combine(day.day, datetime.strptime(end, "%I:%M %p").time())
                day.unplaced.append(Unplaced(ev_id, title, day.day, at, until, "nobody", at=minutes(start)).as_dict())
        days.append(plan_day(day, labels, KIDS, travel, settings, DRIVERS))

    json.dump(
        {
            "updated": UPDATED,
            "time_zone": "America/Chicago",
            "unavailable_calendars": [],
            "drive_times": {
                "source": "routes",
                "looked_up": 21,
                "estimated": 0,
                "lookups_today": 3,
                "daily_limit": 150,
            },
            "needs_setup": None,
            "days": days,
            "people": {
                "drivers": [{"id": d, "name": labels.driver(d)} for d in DRIVERS],
                "kids": [{"id": k, "name": labels.kid(k)} for k in KIDS],
                "carpools": ["Dustin", "the Cunninghams", "the Smiths"],
            },
            "status": {"ok": True, "error": None},
        },
        sys.stdout,
        indent=1,
        ensure_ascii=False,
    )
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
