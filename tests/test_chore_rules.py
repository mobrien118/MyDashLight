"""Chore templates: reading and writing their notes, and the days they make chores for."""

from __future__ import annotations

from dataclasses import replace
from datetime import date

import pytest

from custom_components.mydashlight.chore_rules import (
    Days,
    DaysError,
    MonthDay,
    Template,
    occurrences,
    parse_days,
    parse_repeats,
    parse_template,
    read_block,
    repeats_label,
    split_icon,
    template_notes,
    weekdays_label,
)

KIDS = {"ava": "Ava", "ben": "Ben", "cleo": "Cleo"}
# Wednesday 4 November 2026.
TODAY = date(2026, 11, 4)


def template(repeats: str = "weekly", notes: str = "", *, completed: bool = False, title: str = "Vacuum") -> Template:
    return parse_template("task-1", repeats, title, notes, completed=completed, kids=KIDS)  # type: ignore[arg-type]


def due_days(t: Template, first: date = TODAY, last: date = date(2026, 11, 17)) -> list[tuple[str, str]]:
    return [(o.kid, o.due.isoformat()) for o in occurrences(t, first, last)]


def test_read_block_splits_details_from_lines() -> None:
    block = read_block(
        "Bins at the curb.\nUse the blue bags.\n\n--- Chore ---\nWho: Ava\ntake turns : yes\nNot a line\n"
        "Missed: 2026-11-01\nMissed: 2026-11-08\nColor: red"
    )
    assert block.details == "Bins at the curb.\nUse the blue bags."
    assert block.first("who") == "Ava"
    assert block.first("turns") == "yes"
    assert block.every("missed") == ["2026-11-01", "2026-11-08"]
    assert block.has_block


def test_notes_without_a_block_are_all_details() -> None:
    block = read_block("Who: Ava\nJust notes")
    assert block.details == "Who: Ava\nJust notes"
    assert block.lines == ()
    assert not block.has_block


def test_split_icon() -> None:
    assert split_icon("🧹 Vacuum the stairs") == ("🧹", "Vacuum the stairs")
    assert split_icon("🗑️  Take out  the trash") == ("🗑️", "Take out the trash")
    assert split_icon("👩‍👧 Call Grandma") == ("👩‍👧", "Call Grandma")
    assert split_icon("Feed the cat") == (None, "Feed the cat")
    assert split_icon("🧹") == (None, "🧹")


@pytest.mark.parametrize(
    ("repeats", "text", "expected"),
    [
        ("daily", "", Days()),
        ("daily", "every day", Days()),
        ("daily", "Mon-Fri", Days(weekdays=frozenset(range(5)))),
        ("daily", "weekdays", Days(weekdays=frozenset(range(5)))),
        ("daily", "Sat, Sun", Days(weekdays=frozenset({5, 6}))),
        ("daily", "Fri-Mon", Days(weekdays=frozenset({4, 5, 6, 0}))),
        ("weekly", "Thu", Days(weekdays=frozenset({3}))),
        ("weekly", "Thursdays", Days(weekdays=frozenset({3}))),
        ("weekly", "mon and wednesday", Days(weekdays=frozenset({0, 2}))),
        ("weekly", "Any", Days(any=True)),
        ("weekly", "", Days(any=True)),
        ("monthly", "15", Days(month_days=(MonthDay(day=15),))),
        ("monthly", "1st, 15th", Days(month_days=(MonthDay(day=1), MonthDay(day=15)))),
        ("monthly", "1st Sat", Days(month_days=(MonthDay(nth=1, weekday=5),))),
        ("monthly", "last Friday", Days(month_days=(MonthDay(nth=-1, weekday=4),))),
        ("monthly", "last", Days(month_days=(MonthDay(day=31),))),
        ("monthly", "any", Days(any=True)),
    ],
)
def test_parse_days(repeats: str, text: str, expected: Days) -> None:
    assert parse_days(text, repeats) == expected  # type: ignore[arg-type]


@pytest.mark.parametrize(
    ("repeats", "text"), [("weekly", "Funday"), ("monthly", "32"), ("monthly", "9th Mon"), ("daily", ",")]
)
def test_parse_days_rejects(repeats: str, text: str) -> None:
    with pytest.raises(DaysError):
        parse_days(text, repeats)  # type: ignore[arg-type]


def test_weekdays_label() -> None:
    assert weekdays_label(range(5)) == "Mon-Fri"
    assert weekdays_label({5, 6}) == "Sat, Sun"
    assert weekdays_label({0, 2, 4}) == "Mon, Wed, Fri"
    assert weekdays_label(range(7)) == ""


def test_parse_template() -> None:
    t = template(
        "weekly",
        "Bins at the curb by 7 PM.\n\n--- Chore ---\nId: abc\nWho: ben, Ava\nTake turns: yes\nDays: Thu\nEvery: 2\n"
        "Starts: 2026-11-02\nEnds: 2027-06-05\nPoints: 3",
        title="🗑️ Take out the trash",
    )
    assert t.id == "abc"
    assert t.task_id == "task-1"
    assert t.who == ("ben", "ava")
    assert t.take_turns
    assert t.days == Days(weekdays=frozenset({3}))
    assert (t.every, t.starts, t.ends, t.points) == (2, date(2026, 11, 2), date(2027, 6, 5), 3)
    assert t.details == "Bins at the curb by 7 PM."
    assert t.active
    assert t.problems == ()


def test_template_problems_stop_it_making_chores() -> None:
    t = template("weekly", "--- Chore ---\nWho: Ava, Zed\nDays: Funday\nEvery: two\nStarts: soon\nPoints: lots")
    assert t.problems == ("who:Zed", "days:Funday", "every:two", "starts:soon", "points:lots")
    assert not t.active
    assert occurrences(t, TODAY, date(2026, 11, 30)) == []
    assert template("weekly", "").problems == ("who:",)


def test_everyone_and_paused() -> None:
    t = template("daily", "--- Chore ---\nWho: everyone", completed=True)
    assert t.who == ("ava", "ben", "cleo")
    assert t.paused
    assert not t.active


def test_template_notes_round_trip() -> None:
    head = "Details here.\n\n--- Chore ---\nId: abc\nWho: Ava, Ben\nTake turns: yes\n"
    notes = head + "Days: mondays\nStarts: 2026-11-02\nPoints: 1"
    t = template("weekly", notes)
    written = template_notes(t, KIDS)
    assert written == head.replace("Id: abc\n", "Id: abc\nRepeats: Every week\n") + (
        "Days: Mon\nStarts: 2026-11-02\nPoints: 1"
    )
    assert template("weekly", written) == t


def test_daily_on_some_weekdays() -> None:
    t = template("daily", "--- Chore ---\nWho: Ava\nDays: Mon-Fri\nStarts: 2026-11-01")
    assert due_days(t, last=date(2026, 11, 10)) == [
        ("ava", "2026-11-04"),
        ("ava", "2026-11-05"),
        ("ava", "2026-11-06"),
        ("ava", "2026-11-09"),
        ("ava", "2026-11-10"),
    ]


def test_every_other_day_counts_from_starts() -> None:
    t = template("daily", "--- Chore ---\nWho: Ava\nEvery: 2\nStarts: 2026-11-03")
    assert [d for _k, d in due_days(t, last=date(2026, 11, 9))] == ["2026-11-05", "2026-11-07", "2026-11-09"]


def test_weekly_each_kid_gets_their_own() -> None:
    t = template("weekly", "--- Chore ---\nWho: Ava, Ben\nDays: Mon, Thu\nStarts: 2026-11-01")
    assert due_days(t, last=date(2026, 11, 10)) == [
        ("ava", "2026-11-05"),
        ("ben", "2026-11-05"),
        ("ava", "2026-11-09"),
        ("ben", "2026-11-09"),
    ]


def test_every_other_week_counts_from_the_week_starts_is_in() -> None:
    # Starts on a Sunday: that week (from Mon 26 Oct) is week 0.
    t = template("weekly", "--- Chore ---\nWho: Ava\nDays: Thu\nEvery: 2\nStarts: 2026-11-01")
    assert due_days(t, last=date(2026, 11, 30)) == [("ava", "2026-11-12"), ("ava", "2026-11-26")]


def test_sometime_this_week_shows_from_monday_due_sunday() -> None:
    t = template("weekly", "--- Chore ---\nWho: Ava\nDays: Any\nStarts: 2026-10-01")
    found = occurrences(t, TODAY, date(2026, 11, 10))
    assert [(o.due.isoformat(), o.shows_from.isoformat()) for o in found] == [
        ("2026-11-08", "2026-11-02"),
        ("2026-11-15", "2026-11-09"),
    ]


def test_sometime_this_week_starting_midweek_shows_from_starts() -> None:
    t = template("weekly", "--- Chore ---\nWho: Ava\nDays: Any\nStarts: 2026-11-04")
    assert [(o.due, o.shows_from) for o in occurrences(t, TODAY, TODAY)] == [(date(2026, 11, 8), TODAY)]


def test_turns_go_in_order_from_starts() -> None:
    t = template("weekly", "--- Chore ---\nWho: Ben, Ava\nTake turns: yes\nDays: Thu\nStarts: 2026-10-01")
    # Thursdays from 1 Oct: Ben, Ava, Ben, Ava, Ben (29 Oct), Ava (5 Nov), Ben (12 Nov).
    assert due_days(t) == [("ava", "2026-11-05"), ("ben", "2026-11-12")]


def test_monthly_dates_and_weekdays() -> None:
    t = template("monthly", "--- Chore ---\nWho: Cleo\nDays: 1st Sat, last\nStarts: 2026-11-01")
    assert due_days(t, last=date(2027, 2, 28)) == [
        ("cleo", "2026-11-07"),
        ("cleo", "2026-11-30"),
        ("cleo", "2026-12-05"),
        ("cleo", "2026-12-31"),
        ("cleo", "2027-01-02"),
        ("cleo", "2027-01-31"),
        ("cleo", "2027-02-06"),
        ("cleo", "2027-02-28"),
    ]


def test_quarterly_is_monthly_every_three() -> None:
    t = template("monthly", "--- Chore ---\nWho: Ava\nDays: 15\nEvery: 3\nStarts: 2026-11-01")
    assert due_days(t, last=date(2027, 6, 30)) == [
        ("ava", "2026-11-15"),
        ("ava", "2027-02-15"),
        ("ava", "2027-05-15"),
    ]


def test_sometime_this_month_shows_from_the_first() -> None:
    t = template("monthly", "--- Chore ---\nWho: Ava\nDays: Any\nStarts: 2026-10-01")
    found = occurrences(t, TODAY, date(2026, 11, 10))
    assert [(o.due.isoformat(), o.shows_from.isoformat()) for o in found] == [("2026-11-30", "2026-11-01")]


def test_starts_and_ends() -> None:
    t = template("daily", "--- Chore ---\nWho: Ava\nStarts: 2026-11-06\nEnds: 2026-11-08")
    assert [d for _k, d in due_days(t)] == ["2026-11-06", "2026-11-07", "2026-11-08"]
    # A week cut short by Ends is due on Ends.
    t = template("weekly", "--- Chore ---\nWho: Ava\nDays: Any\nStarts: 2026-11-02\nEnds: 2026-11-06")
    assert due_days(t) == [("ava", "2026-11-06")]


def test_no_starts_means_from_today() -> None:
    t = template("weekly", "--- Chore ---\nWho: Ava\nDays: Mon")
    assert t.starts is None
    assert due_days(t, last=date(2026, 11, 10)) == [("ava", "2026-11-09")]


@pytest.mark.parametrize(
    ("text", "expected"),
    [
        ("Every day", ("daily", 1)),
        ("daily", ("daily", 1)),
        ("every 3 days", ("daily", 3)),
        ("Every other day", ("daily", 2)),
        ("Weekly", ("weekly", 1)),
        ("Every 2 weeks", ("weekly", 2)),
        ("biweekly", ("weekly", 2)),
        ("Every month", ("monthly", 1)),
        ("Quarterly", ("monthly", 3)),
        ("every 1 year", ("monthly", 12)),
        ("School days", ("school", 1)),
        ("every 0 weeks", None),
        ("sometimes", None),
    ],
)
def test_parse_repeats(text: str, expected: tuple[str, int] | None) -> None:
    assert parse_repeats(text) == expected


def test_repeats_label_round_trips() -> None:
    for repeats, every in [("daily", 1), ("daily", 3), ("weekly", 1), ("weekly", 2), ("monthly", 3), ("school", 1)]:
        label = repeats_label(repeats, every)  # type: ignore[arg-type]
        assert parse_repeats(label) == (repeats, every)
    assert repeats_label("weekly", 2) == "Every 2 weeks"


def seed(notes: str) -> Template:
    return parse_template("task-1", None, "Vacuum", notes, completed=False, kids=KIDS)


def test_seed_reads_how_often_from_its_repeats_line() -> None:
    t = seed("--- Chore ---\nId: v\nRepeats: Every 2 weeks\nWho: Ava\nDays: Mon, Thu\nStarts: 2026-11-02")
    assert (t.repeats, t.every, t.days, t.problems) == ("weekly", 2, Days(weekdays=frozenset({0, 3})), ())
    assert template_notes(t, KIDS) == (
        "--- Chore ---\nId: v\nRepeats: Every 2 weeks\nWho: Ava\nDays: Mon, Thu\nStarts: 2026-11-02"
    )
    assert seed("--- Chore ---\nRepeats: Quarterly\nWho: Ava\nDays: 1st Sat").every == 3
    assert seed("--- Chore ---\nRepeats: whenever\nWho: Ava").problems == ("repeats:whenever",)


def test_picking_days_means_weekly() -> None:
    # Marty's "Mon and Thu, every 2 days" can't happen: picked days make it weekly.
    t = seed("--- Chore ---\nRepeats: Every 2 days\nWho: Ava\nDays: Mon, Thu")
    assert (t.repeats, t.every) == ("weekly", 1)
    assert due_days(replace_starts(t)) == [
        ("ava", "2026-11-05"),
        ("ava", "2026-11-09"),
        ("ava", "2026-11-12"),
        ("ava", "2026-11-16"),
    ]
    # An old Daily template with days moves across the same way.
    old = template("daily", "--- Chore ---\nWho: Ava\nDays: Sat, Sun")
    assert (old.repeats, old.days.label("weekly")) == ("weekly", "Sat, Sun")


def test_seed_with_no_repeats_line_goes_by_its_days() -> None:
    assert seed("--- Chore ---\nWho: Ava").repeats == "daily"
    assert seed("--- Chore ---\nWho: Ava\nDays: Tue").repeats == "weekly"
    assert seed("--- Chore ---\nWho: Ava\nDays: 15").repeats == "monthly"
    assert seed("--- Chore ---\nWho: Ava\nDays: Any").repeats == "weekly"


def test_old_every_line_still_counts() -> None:
    t = template("monthly", "--- Chore ---\nWho: Ava\nDays: 1\nEvery: 3")
    assert (t.repeats, t.every) == ("monthly", 3)
    assert "Repeats: Every 3 months" in template_notes(t, KIDS)
    assert "Every:" not in template_notes(t, KIDS)


def test_weekly_on_every_weekday_isnt_any() -> None:
    t = seed("--- Chore ---\nRepeats: Every 2 weeks\nWho: Ava\nDays: Mon-Sun")
    assert len(t.days.weekdays) == 7
    written = template_notes(t, KIDS)
    assert "Days: Mon-Sun" in written
    assert seed(written).days == t.days


def replace_starts(t: Template) -> Template:
    return replace(t, starts=date(2026, 11, 2))
