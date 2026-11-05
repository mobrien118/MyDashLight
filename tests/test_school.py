"""School days and lunches: reading them from the kids' calendars, the changes a pick makes,
and school-days chores."""

from __future__ import annotations

from datetime import date, datetime, timedelta, timezone

from custom_components.mydashlight.chore_rules import occurrences, parse_template, template_notes
from custom_components.mydashlight.chores import (
    Make,
    Remove,
    TaskItem,
    board_items,
    chore_notes,
    plan_changes,
    read_chore,
)
from custom_components.mydashlight.google import CalendarEvent
from custom_components.mydashlight.school import (
    SchoolCalendar,
    is_no_school,
    lunch_changes,
    lunch_of,
    lunch_payload,
    read_school,
)

KIDS = {"ava": "Ava", "ben": "Ben"}
LISTS = {"ava": "list-ava", "ben": "list-ben"}
CENTRAL = timezone(timedelta(hours=-6))
# Wednesday 4 November 2026.
TODAY = date(2026, 11, 4)
FIRST = date(2026, 11, 1)
LAST = date(2026, 12, 31)


def day(event_id: str, title: str, first: str, last: str | None = None) -> CalendarEvent:
    start = date.fromisoformat(first)
    end = date.fromisoformat(last or first) + timedelta(days=1)
    return CalendarEvent("cal", event_id, f'"{event_id}"', title, "", "", start, end, busy=False)


def school(**events: list[CalendarEvent]) -> SchoolCalendar:
    return read_school(events, {"ava": "buy", "ben": "bring"}, FIRST, LAST)


def test_titles() -> None:
    assert lunch_of("Bring Lunch") == "bring"
    assert lunch_of("  buy   lunch ") == "buy"
    assert lunch_of("🥪 Bring lunch") == "bring"
    assert lunch_of("Bringing lunch") == "bring"
    assert lunch_of("Lunch with Grandma") is None
    assert lunch_of("Buy lunch money") is None
    assert is_no_school("No School – Thanksgiving Break")
    assert is_no_school("NO-SCHOOL (PD day)")
    assert not is_no_school("School play")


def test_reads_days_off_and_picks() -> None:
    timed = CalendarEvent(
        "cal",
        "t",
        '"t"',
        "No school meeting",
        "",
        "",
        datetime(2026, 11, 9, 18, tzinfo=CENTRAL),
        datetime(2026, 11, 9, 19, tzinfo=CENTRAL),
        busy=True,
    )
    s = school(
        ava=[
            day("off", "No School – Thanksgiving", "2026-11-25", "2026-11-27"),
            day("b1", "Bring Lunch", "2026-11-05"),
        ],
        ben=[day("art", "Art day", "2026-11-06"), timed],
    )
    assert s.is_school_day("ava", date(2026, 11, 24))
    assert not s.is_school_day("ava", date(2026, 11, 25))
    assert not s.is_school_day("ava", date(2026, 11, 27))
    assert not s.is_school_day("ava", date(2026, 11, 28))  # Saturday
    assert s.is_school_day("ben", date(2026, 11, 25))  # each kid has their own days off
    assert s.is_school_day("ben", date(2026, 11, 9))  # a timed event never means a day off
    assert s.lunch("ava", date(2026, 11, 5)) == "bring"
    assert s.lunch("ava", date(2026, 11, 6)) == "buy"  # Ava's default
    assert s.lunch("ben", date(2026, 11, 6)) == "bring"  # Ben's default
    assert s.lunch("ava", date(2026, 11, 26)) is None
    assert s.lunch("ava", date(2026, 11, 7)) is None
    # Outside what was read, a weekday is a school day.
    assert s.is_school_day("ava", date(2027, 1, 4))


def test_payload() -> None:
    s = school(
        ava=[day("off", "No School", "2026-11-25", "2026-11-27"), day("b1", "Bring Lunch", "2026-11-05")],
        ben=[day("b2", "Buy Lunch", "2026-11-25")],
    )
    payload = lunch_payload(s, KIDS, TODAY)
    assert payload["first"] == "2026-11-01"
    assert payload["last"] == "2026-12-31"
    ava, ben = payload["kids"]
    assert ava == {
        "id": "ava",
        "name": "Ava",
        "default": "buy",
        "picks": {"2026-11-05": "bring"},
        "days_off": [{"first": "2026-11-25", "last": "2026-11-27", "title": "No School"}],
    }
    assert ben["default"] == "bring"
    assert ben["picks"] == {"2026-11-25": "buy"}


def test_lunch_changes() -> None:
    s = school(
        ava=[
            day("off", "No School", "2026-11-25", "2026-11-27"),
            day("b1", "Bring Lunch", "2026-11-05"),
            day("b2", "Buy Lunch", "2026-11-06"),
            day("dup1", "Buy Lunch", "2026-11-09"),
            day("dup2", "Bring Lunch", "2026-11-09"),
        ]
    )
    days = [date(2026, 11, d) for d in (5, 6, 9, 10, 25)]
    changes = lunch_changes(s, "ava", days, "bring")
    assert [(c.day.day, c.make, c.retitle, c.remove) for c in changes] == [
        (6, None, ("b2", '"b2"', "bring"), None),
        (9, None, None, ("dup2", '"dup2"')),
        (9, None, ("dup1", '"dup1"', "bring"), None),
        (10, "bring", None, None),
    ]
    # Back to the default takes the picks away.
    changes = lunch_changes(s, "ava", [date(2026, 11, 5), date(2026, 11, 10)], None)
    assert [(c.day.day, c.remove) for c in changes] == [(5, ("b1", '"b1"'))]


def test_a_pick_over_several_days_is_removed_once() -> None:
    s = school(ava=[day("week", "Buy Lunch", "2026-11-09", "2026-11-13")])
    changes = lunch_changes(s, "ava", [date(2026, 11, 9), date(2026, 11, 10)], None)
    assert [c.remove for c in changes] == [("week", '"week"')]


# School-days chores


def template(rules: str, *, tid: str = "t1", title: str = "Pack lunch"):  # type: ignore[no-untyped-def]
    notes = f"--- Chore ---\nId: {tid}\nStarts: 2026-11-01\n{rules}"
    return parse_template(f"task-{tid}", "school", title, notes, completed=False, kids=KIDS)


def test_school_template_lines() -> None:
    t = template("Who: Ava\nWhen: Night before\nOnly: Bring lunch days\nDays: Mon-Fri")
    assert t.problems == ()
    assert t.night_before
    assert t.bring_only
    assert t.days.weekdays == frozenset()  # every school day
    assert "When: Night before\nOnly: Bring lunch days" in template_notes(t, KIDS)
    assert "Days:" not in template_notes(t, KIDS)
    morning = template("Who: Ava\nWhen: Morning\nDays: Mon, Wed")
    assert not morning.night_before
    assert not morning.bring_only
    assert sorted(morning.days.weekdays) == [0, 2]
    assert "When" not in template_notes(morning, KIDS)
    assert template("Who: Ava\nWhen: Lunchtime").problems == ("when:Lunchtime",)
    assert template("Who: Ava\nOnly: Fridays").problems == ("only:Fridays",)
    assert template("Who: Ava\nDays: Sat").problems == ("days:Sat",)
    # The lines mean nothing on the other lists.
    daily = parse_template(
        "x", "daily", "Feed the dog", "--- Chore ---\nWho: Ava\nWhen: Night before", completed=False, kids=KIDS
    )
    assert not daily.night_before


def test_school_days_skip_days_off_and_weekends() -> None:
    s = school(ava=[day("off", "No School", "2026-11-25", "2026-11-27")])
    t = template("Who: Ava, Ben")
    got = [(o.kid, o.due.isoformat()) for o in occurrences(t, date(2026, 11, 24), date(2026, 11, 30), s)]
    assert got == [
        ("ava", "2026-11-24"),
        ("ben", "2026-11-24"),
        ("ben", "2026-11-25"),
        ("ben", "2026-11-26"),
        ("ben", "2026-11-27"),
        ("ava", "2026-11-30"),
        ("ben", "2026-11-30"),
    ]
    # Without the calendars, nothing is made.
    assert occurrences(t, date(2026, 11, 24), date(2026, 11, 30)) == []


def test_night_before_is_due_the_evening_before() -> None:
    s = school(ava=[day("off", "No School", "2026-11-25", "2026-11-27")])
    t = template("Who: Ava\nWhen: Night before")
    got = [o.due.isoformat() for o in occurrences(t, date(2026, 11, 20), date(2026, 11, 30), s)]
    # Sunday for Monday; nothing the nights before days off; Sunday the 29th for Monday the 30th.
    assert got == ["2026-11-22", "2026-11-23", "2026-11-29", "2026-11-30"]


def test_bring_lunch_days_only() -> None:
    s = school(
        ava=[day("b", "Bring Lunch", "2026-11-05"), day("x", "Buy Lunch", "2026-11-06")],
        ben=[day("y", "Buy Lunch", "2026-11-05")],
    )
    t = template("Who: Ava, Ben\nWhen: Night before\nOnly: Bring lunch days")
    got = [(o.kid, o.due.isoformat()) for o in occurrences(t, date(2026, 11, 4), date(2026, 11, 8), s)]
    # Ava buys by default, Ben brings by default.
    assert got == [("ava", "2026-11-04"), ("ben", "2026-11-05"), ("ben", "2026-11-08")]


def test_turns_count_weekdays_so_a_day_off_changes_nothing_else() -> None:
    t = template("Who: Ava, Ben\nTake turns: yes")
    plain = school()
    off = school(ava=[day("off", "No School", "2026-11-03")], ben=[day("off2", "No School", "2026-11-03")])
    before = [(o.kid, o.due.day) for o in occurrences(t, date(2026, 11, 2), date(2026, 11, 6), plain)]
    after = [(o.kid, o.due.day) for o in occurrences(t, date(2026, 11, 2), date(2026, 11, 6), off)]
    assert before == [("ava", 2), ("ben", 3), ("ava", 4), ("ben", 5), ("ava", 6)]
    assert after == [("ava", 2), ("ava", 4), ("ben", 5), ("ava", 6)]


def test_plan_follows_lunch_picks_and_holds_without_calendars() -> None:
    t = template("Who: Ava\nWhen: Night before\nOnly: Bring lunch days")
    bring = school(ava=[day("b", "Bring Lunch", "2026-11-05")])
    changes = plan_changes([t], [], LISTS, TODAY, 3, bring).changes
    assert [(c.list_id, c.due.isoformat()) for c in changes if isinstance(c, Make)] == [("list-ava", "2026-11-04")]

    made = read_chore(TaskItem("c1", "Pack lunch", chore_notes("", "t1", TODAY, None), TODAY), "ava", "list-ava")
    # Switched to Buy: the chore goes.
    buy = school(ava=[day("b", "Buy Lunch", "2026-11-05")])
    assert plan_changes([t], [made], LISTS, TODAY, 3, buy).changes == [Remove("list-ava", "c1")]
    # Calendars not read: left alone, nothing made.
    assert plan_changes([t], [made], LISTS, TODAY, 3, None).changes == []


def test_board_says_which_school_day_a_night_before_chore_is_for() -> None:
    t = template("Who: Ava\nWhen: Night before")
    thursday = date(2026, 11, 5)
    sunday = date(2026, 11, 8)
    chores = [
        read_chore(TaskItem(f"c{d.day}", "Pack lunch", chore_notes("", "t1", d, None), d), "ava", "list-ava")
        for d in (thursday, sunday)
    ]
    items = board_items(chores, [t], ["ava"], thursday, 4, CENTRAL, None, school())
    assert [(i["due"], i["for_day"]) for i in items] == [("2026-11-05", "2026-11-06"), ("2026-11-08", "2026-11-09")]
