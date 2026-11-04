"""The chore engine: making, fixing, removing, marking missed and closing out kids' chores,
and what the board shows."""

from __future__ import annotations

from datetime import UTC, date, datetime, timedelta, timezone

from custom_components.mydashlight.chore_rules import Template, parse_template, read_block
from custom_components.mydashlight.chores import (
    Chore,
    Make,
    Remove,
    TaskItem,
    Update,
    board_items,
    chore_notes,
    plan_changes,
    read_chore,
)

KIDS = {"ava": "Ava", "ben": "Ben"}
LISTS = {"ava": "list-ava", "ben": "list-ben"}
CENTRAL = timezone(timedelta(hours=-6))
# Wednesday 4 November 2026.
TODAY = date(2026, 11, 4)


def template(repeats: str, rules: str, *, tid: str = "t1", title: str = "Vacuum", paused: bool = False) -> Template:
    notes = f"Details.\n\n--- Chore ---\nId: {tid}\n{rules}"
    return parse_template(f"task-{tid}", repeats, title, notes, completed=paused, kids=KIDS)  # type: ignore[arg-type]


def chore(
    task_id: str,
    due: date,
    *,
    kid: str = "ava",
    tid: str = "t1",
    title: str = "Vacuum",
    done: datetime | None = None,
    missed: tuple[date, ...] = (),
    extra: str = "",
    details: str = "Details.",
) -> Chore:
    notes = chore_notes(details, tid, due, None, missed) + extra
    return read_chore(TaskItem(task_id, title, notes, due, done), kid, LISTS[kid])


def plan(templates: list[Template], chores: list[Chore], today: date = TODAY, days: int = 7) -> list[object]:
    return plan_changes(templates, chores, LISTS, today, days).changes


def test_makes_the_coming_week() -> None:
    t = template("weekly", "Who: Ava, Ben\nDays: Mon, Thu\nStarts: 2026-11-01")
    changes = plan([t], [])
    assert [(c.list_id, c.due.isoformat()) for c in changes if isinstance(c, Make)] == [
        ("list-ava", "2026-11-05"),
        ("list-ben", "2026-11-05"),
        ("list-ava", "2026-11-09"),
        ("list-ben", "2026-11-09"),
    ]
    made = changes[0]
    assert isinstance(made, Make)
    assert made.title == "Vacuum"
    assert made.notes == "Details.\n\n--- Chore ---\nFrom: t1\nFor: 2026-11-05"


def test_nothing_to_do_when_lists_match() -> None:
    t = template("weekly", "Who: Ava\nDays: Thu\nStarts: 2026-11-01")
    assert plan([t], [chore("a", date(2026, 11, 5))]) == []


def test_done_chores_count_as_made() -> None:
    t = template("daily", "Who: Ava\nStarts: 2026-11-01")
    done = datetime(2026, 11, 4, 9, tzinfo=UTC)
    chores = [chore(f"c{i}", TODAY + timedelta(days=i)) for i in range(1, 7)]
    assert plan([t], [chore("a", TODAY, done=done), *chores]) == []


def test_template_change_fixes_and_removes_coming_chores_only() -> None:
    t = template("weekly", "Who: Ava\nDays: Fri\nStarts: 2026-11-01", title="Vacuum stairs")
    done = datetime(2026, 11, 2, 9, tzinfo=UTC)
    changes = plan(
        [t],
        [
            chore("thu", date(2026, 11, 5)),  # moved to Friday: remove
            chore("fri", date(2026, 11, 6)),  # still wanted: new title
            chore("donethu", date(2026, 11, 12), done=done),  # done: keep
        ],
    )
    assert Remove("list-ava", "thu") in changes
    assert Update("list-ava", "fri", title="Vacuum stairs") in changes
    assert not any(getattr(c, "task_id", None) == "donethu" for c in changes)
    # The next Friday (13 Nov) is past the coming week.
    assert not any(isinstance(c, Make) for c in changes)


def test_paused_template_removes_coming_chores() -> None:
    t = template("weekly", "Who: Ava\nDays: Thu\nStarts: 2026-11-01", paused=True)
    assert plan([t], [chore("a", date(2026, 11, 5))]) == [Remove("list-ava", "a")]


def test_details_change_rewrites_notes() -> None:
    t = template("weekly", "Who: Ava\nDays: Thu\nStarts: 2026-11-01")
    changes = plan([t], [chore("a", date(2026, 11, 5), details="Old details.")])
    assert changes == [
        Update("list-ava", "a", notes="Details.\n\n--- Chore ---\nFrom: t1\nFor: 2026-11-05"),
    ]


def test_missed_is_marked_once_and_stays_until_the_next_shows() -> None:
    t = template("weekly", "Who: Ava\nDays: Mon\nStarts: 2026-10-01")
    upcoming = chore("next", date(2026, 11, 9))
    # Monday 2 Nov was missed; the next Monday doesn't show until 9 Nov.
    changes = plan([t], [chore("a", date(2026, 11, 2)), upcoming])
    assert len(changes) == 1
    marked = changes[0]
    assert isinstance(marked, Update)
    assert not marked.complete
    assert marked.notes is not None
    assert read_block(marked.notes).every("missed") == ["2026-11-02"]
    # Marked already: nothing more until it's closed out.
    assert plan([t], [chore("a", date(2026, 11, 2), missed=(date(2026, 11, 2),)), upcoming]) == []


def test_missed_chore_closes_out_when_the_next_shows() -> None:
    t = template("weekly", "Who: Ava\nDays: Mon\nStarts: 2026-10-01")
    missed = chore("a", date(2026, 11, 2), missed=(date(2026, 11, 2),))
    changes = plan([t], [missed, chore("b", date(2026, 11, 9))], today=date(2026, 11, 9))
    assert len(changes) == 1
    closed = changes[0]
    assert isinstance(closed, Update)
    assert closed.complete
    assert closed.notes is not None
    assert read_chore(TaskItem("a", "Vacuum", closed.notes), "ava", "list-ava").closed


def test_missed_daily_chore_closes_out_the_next_morning() -> None:
    t = template("daily", "Who: Ava\nStarts: 2026-10-01")
    chores = [chore("y", TODAY - timedelta(days=1))] + [chore(f"c{i}", TODAY + timedelta(days=i)) for i in range(7)]
    changes = plan([t], chores)
    assert len(changes) == 1
    closed = changes[0]
    assert isinstance(closed, Update)
    assert closed.complete
    assert closed.notes is not None
    block = read_block(closed.notes)
    assert block.every("missed") == ["2026-11-03"]
    assert block.first("closed") == "missed"


def test_missed_chore_of_a_paused_template_closes_out() -> None:
    t = template("weekly", "Who: Ava\nDays: Mon\nStarts: 2026-10-01", paused=True)
    changes = plan([t], [chore("a", date(2026, 11, 2), missed=(date(2026, 11, 2),))])
    assert len(changes) == 1
    assert isinstance(changes[0], Update)
    assert changes[0].complete


def test_missed_chore_of_a_kid_taken_off_the_template_closes_out() -> None:
    t = template("weekly", "Who: Ben\nDays: Mon\nStarts: 2026-10-01")
    changes = plan([t], [chore("a", date(2026, 11, 2)), chore("b", date(2026, 11, 9), kid="ben")])
    assert len(changes) == 1
    assert isinstance(changes[0], Update)
    assert changes[0].complete
    assert changes[0].list_id == "list-ava"


def test_one_offs_are_left_alone() -> None:
    one_off = read_chore(TaskItem("x", "Clean your room", "Before Grandma comes", date(2026, 11, 1)), "ava", "list-ava")
    assert one_off.template is None
    assert plan([], [one_off]) == []


def test_duplicates_keep_the_done_one() -> None:
    t = template("weekly", "Who: Ava\nDays: Thu\nStarts: 2026-11-01")
    done = datetime(2026, 11, 4, 9, tzinfo=UTC)
    changes = plan([t], [chore("open", date(2026, 11, 5)), chore("done", date(2026, 11, 5), done=done)])
    assert changes == [Remove("list-ava", "open")]


def test_changes_are_capped_per_run() -> None:
    t = template("daily", "Who: Ava, Ben\nStarts: 2026-11-01")
    result = plan_changes([t], [], LISTS, TODAY, 28)
    assert len(result.changes) == 40
    assert result.more


def test_kids_without_a_list_are_skipped() -> None:
    t = template("weekly", "Who: Ava, Ben\nDays: Thu\nStarts: 2026-11-01")
    changes = plan_changes([t], [], {"ava": "list-ava"}, TODAY, 7).changes
    assert [c.list_id for c in changes if isinstance(c, Make)] == ["list-ava"]


def states(items: list[dict[str, object]]) -> list[tuple[object, ...]]:
    return [(i["id"], i["state"]) for i in items]


def test_board_items() -> None:
    weekly = template("weekly", "Who: Ava\nDays: Mon\nStarts: 2026-10-01", tid="w", title="🧹 Vacuum")
    daily = template("daily", "Who: Ava, Ben\nStarts: 2026-10-01", tid="d", title="Feed the cat")
    anytime = template("weekly", "Who: Ben\nDays: Any\nStarts: 2026-10-01", tid="a", title="Clean room")
    morning = datetime(2026, 11, 4, 14, tzinfo=UTC)  # 8 AM in Chicago
    chores = [
        chore("w-missed", date(2026, 11, 2), tid="w", title="🧹 Vacuum", missed=(date(2026, 11, 2),)),
        chore("d-ava", TODAY, tid="d", title="Feed the cat", done=morning),
        chore("d-ben", TODAY, kid="ben", tid="d", title="Feed the cat"),
        chore("d-ben-tomorrow", TODAY + timedelta(days=1), kid="ben", tid="d", title="Feed the cat"),
        chore("a-ben", date(2026, 11, 8), kid="ben", tid="a", title="Clean room"),
        chore("old-done", date(2026, 11, 2), tid="d", title="Feed the cat", done=morning - timedelta(days=2)),
        chore("closed", date(2026, 11, 1), tid="w", extra="\nClosed: missed"),
        read_chore(TaskItem("one-off", "Pack for camp", "", None), "ben", "list-ben"),
    ]
    items = board_items(chores, [weekly, daily, anytime], ["ava", "ben"], TODAY, 7, CENTRAL)
    assert states(items) == [
        ("w-missed", "overdue"),
        ("d-ava", "done"),
        ("d-ben", "open"),
        ("d-ben-tomorrow", "upcoming"),
        ("a-ben", "open"),
        ("one-off", "open"),
    ]
    first = items[0]
    assert (first["title"], first["icon"], first["repeats"], first["missed"]) == ("Vacuum", "🧹", "weekly", 1)
    assert items[4]["shows_from"] == "2026-11-02"
    assert items[1]["done_at"] == "2026-11-04T14:00:00+00:00"
    assert [i["order"] for i in items] == list(range(6))


def test_done_after_the_due_day_is_late() -> None:
    t = template("weekly", "Who: Ava\nDays: Mon\nStarts: 2026-10-01")
    late = chore("a", date(2026, 11, 2), missed=(date(2026, 11, 2),), done=datetime(2026, 11, 4, 1, tzinfo=UTC))
    # 1 AM UTC is still 3 Nov in Chicago, but it was marked missed, so it's late either way.
    assert states(board_items([late], [t], ["ava"], date(2026, 11, 3), 7, CENTRAL)) == [("a", "late")]
    on_time = chore("b", TODAY, done=datetime(2026, 11, 5, 3, tzinfo=UTC))  # 9 PM on the 4th in Chicago
    assert states(board_items([on_time], [t], ["ava"], TODAY, 7, CENTRAL)) == [("b", "done")]
