"""Points for chores: what a check-off earns and everyone's score."""

from __future__ import annotations

from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

import pytest

from custom_components.mydashlight.chore_points import (
    PointsSettings,
    earned,
    leaders,
    scores,
    worth,
)
from custom_components.mydashlight.chore_rules import read_block, write_block
from custom_components.mydashlight.chores import Chore, TaskItem, chore_notes, read_chore, skip_notes

CENTRAL = ZoneInfo("America/Chicago")
PEOPLE = {"ava": "Ava", "ben": "Ben", "mom": "Robin", "dad": "Sam"}
DUE = date(2026, 11, 4)  # a Wednesday
SETTINGS = PointsSettings()
VALUES = {"t1": 2}
"""The seed's Points, by seed id."""


def at(day: int, hour: int) -> datetime:
    return datetime(2026, 11, day, hour, tzinfo=CENTRAL)


def chore(
    *,
    done_at: datetime | None = None,
    by: str | None = None,
    kid: str = "ava",
    extra: str = "",
    template: str = "t1",
) -> Chore:
    notes = chore_notes("", template, DUE)
    if by or extra:
        block = read_block(notes)
        lines = [("From", template), ("For", DUE.isoformat())]
        if by:
            lines.append(("Done by", by))
        notes = write_block(block.details, lines) + extra
    return read_chore(TaskItem("c1", "Vacuum", notes, DUE, done_at), kid, f"list-{kid}")


def test_worth_is_the_seeds_points_now() -> None:
    assert worth(chore(), SETTINGS, {"t1": 3}) == 3
    assert worth(chore(), PointsSettings(default=2), {"t1": None}) == 2
    assert worth(chore(), SETTINGS, {"t1": 0}) == 0
    # The seed is gone, or it's a one-off: the default.
    assert worth(chore(template="gone"), PointsSettings(default=2), VALUES) == 2


@pytest.mark.parametrize(
    ("done_at", "by", "points"),
    [
        (at(4, 20), None, 2.0),  # the kid it's for, on time
        (at(4, 23), "Ava", 2.0),  # still the due day
        (at(5, 7), "Ava", 1.0),  # the next morning: late, half
        (at(4, 18), "Ben", 0.0),  # a brother before it's late: a favor
        (at(5, 7), "Ben", 1.0),  # after: he gets the late share
        (at(5, 7), "Sam", 1.0),  # a parent too, by name
        (at(5, 7), "dad", 1.0),  # or by id
        (None, None, None),  # still open
    ],
)
def test_earned(done_at: datetime | None, by: str | None, points: float | None) -> None:
    assert earned(chore(done_at=done_at, by=by), SETTINGS, CENTRAL, PEOPLE, VALUES) == points


def test_waiting_before_others_earn_a_late_chore() -> None:
    wait = PointsSettings(open_after=timedelta(hours=12))
    assert earned(chore(done_at=at(5, 7), by="Ben"), wait, CENTRAL, PEOPLE, VALUES) == 0.0
    assert earned(chore(done_at=at(5, 13), by="Ben"), wait, CENTRAL, PEOPLE, VALUES) == 1.0
    # The kid it's for gets the late share straight away.
    assert earned(chore(done_at=at(5, 7), by="Ava"), wait, CENTRAL, PEOPLE, VALUES) == 1.0


def test_late_share_and_odd_points() -> None:
    assert earned(chore(done_at=at(5, 7)), SETTINGS, CENTRAL, PEOPLE, {"t1": 1}) == 0.5
    assert earned(chore(done_at=at(5, 7)), PointsSettings(late_share=0), CENTRAL, PEOPLE, {"t1": 3}) == 0.0
    assert earned(chore(done_at=at(4, 12)), SETTINGS, CENTRAL, PEOPLE, {"t1": 0}) == 0.0


def test_points_follow_the_seed_and_settings_as_they_are_now() -> None:
    """Nothing earned is kept: a check-off already made counts at the new value."""
    done = chore(done_at=at(5, 7))  # late, by the kid it's for
    assert earned(done, SETTINGS, CENTRAL, PEOPLE, {"t1": 2}) == 1.0
    assert earned(done, SETTINGS, CENTRAL, PEOPLE, {"t1": 4}) == 2.0
    assert earned(done, PointsSettings(late_share=75), CENTRAL, PEOPLE, {"t1": 4}) == 3.0
    # An old Earned or Points line on the chore is ignored.
    old = chore(done_at=at(4, 12), extra="\nPoints: 1\nEarned: 1.5")
    assert earned(old, SETTINGS, CENTRAL, PEOPLE, {"t1": 4}) == 4.0


def test_missed_chores_earn_nothing() -> None:
    closed = chore(done_at=at(6, 0), extra="\nMissed: 2026-11-04\nClosed: missed")
    assert earned(closed, SETTINGS, CENTRAL, PEOPLE, VALUES) == 0.0


def test_scores_count_the_last_seven_days_for_whoever_did_it() -> None:
    now = at(11, 9)
    chores = [
        chore(done_at=at(4, 8)),  # just over 7 days ago: not counted
        chore(done_at=at(5, 7), by="Ben"),  # 1 to Ben
        chore(done_at=at(10, 12)),  # late: 1 to Ava
        chore(done_at=at(10, 12), by="Sam"),  # late: 1 to the parent
        chore(done_at=at(10, 12), extra="\nMissed: 2026-11-04\nClosed: missed"),
        chore(),  # open
    ]
    assert scores(chores, SETTINGS, CENTRAL, PEOPLE, VALUES, now) == {"ava": 1.0, "ben": 1.0, "mom": 0.0, "dad": 1.0}
    # Worth more now: the week's scores follow.
    assert scores(chores, SETTINGS, CENTRAL, PEOPLE, {"t1": 4}, now)["ava"] == 2.0


def test_leaders() -> None:
    assert leaders({"ava": 3, "ben": 5, "dad": 9}, ["ava", "ben"]) == ["ben"]
    assert leaders({"ava": 5, "ben": 5}, ["ava", "ben"]) == ["ava", "ben"]
    assert leaders({"ava": 0, "ben": 0}, ["ava", "ben"]) == []
    assert leaders({}, ["ava"]) == []


@pytest.mark.parametrize("skip", ["skipped", "excused"])
def test_skipped_and_excused_earn_nothing(skip: str) -> None:
    closed = chore(done_at=at(4, 12), extra=f"\nClosed: {skip}\nEarned: 2")
    assert closed.skipped == skip
    assert not closed.closed
    assert earned(closed, SETTINGS, CENTRAL, PEOPLE, VALUES) == 0.0
    assert scores([closed], SETTINGS, CENTRAL, PEOPLE, VALUES, at(5, 9))["ava"] == 0.0


def test_skip_notes() -> None:
    notes = chore_notes("Both floors.", "t1", DUE)
    skipped = skip_notes(notes, "skipped")
    assert read_block(skipped).every("closed") == ["skipped"]
    assert skip_notes(skipped, "skipped") == skipped
    assert read_block(skip_notes(skipped, "excused")).every("closed") == ["excused"]
    assert read_block(skip_notes(skipped, None)) == read_block(notes)
    assert skip_notes(notes, None) == notes
    # MyDashLight's own close-out stays.
    missed = notes + "\nClosed: missed"
    assert skip_notes(missed, "excused") == missed
    assert skip_notes(missed, None) == missed
    # A one-off whose block only said it was skipped goes back to its own notes.
    assert skip_notes(skip_notes("Just this once", "excused"), None) == "Just this once"
