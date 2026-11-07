"""The chore engine: what to change in the kids' Google Tasks lists, and what the board shows.

Each run reads the templates and every kid's list, then :func:`plan_changes` works out the
changes that make the lists match the templates:

* **Make** each chore the templates ask for in the next few days that isn't on its kid's
  list yet, done or not.
* **Fix** a chore that's coming up and not done yet when its template's title, details or
  points changed, and **remove** one whose template no longer asks for it (paused, moved to
  another day or kid, or deleted). Done chores and chores whose day has passed are never
  changed or removed, so the history stays true.
* **Mark missed** a chore still open after its due day, once for each due day it missed.
* **Close out** a missed chore once the next one of the same chore for the same kid shows
  (or its template stops making more), so the board shows one, not a pile. It's checked off
  in Google with ``Closed: missed``, which tells it apart from a chore done late.

Tasks someone adds to a kid's list by hand are one-off chores: they're shown, and checking
them off works, but the engine never changes them.

Pure module, no Home Assistant imports.
"""

from __future__ import annotations

from collections.abc import Iterable, Mapping, Sequence
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta, tzinfo
from typing import Any, Final, Literal

from .chore_rules import (
    Repeats,
    SchoolDays,
    Template,
    kid_for,
    read_block,
    schedule,
    split_icon,
    write_block,
)

CLOSED_MISSED: Final = "missed"
MAX_CHANGES: Final = 40
"""Changes saved per run, so the first run after setting up doesn't flood Google. The
rest follow on the next runs."""

State = Literal["upcoming", "open", "overdue", "done", "late"]


@dataclass(frozen=True, slots=True)
class TaskItem:
    """A task on a kid's list, as Google returned it."""

    id: str
    title: str
    notes: str = ""
    due: date | None = None
    completed: datetime | None = None
    """When it was checked off, or None while it's open."""
    position: str = ""


@dataclass(frozen=True, slots=True)
class Chore:
    """A task on a kid's list, read as a chore."""

    task: TaskItem
    kid: str
    list_id: str
    details: str
    template: str | None
    """The template it was made from, or None for a one-off."""
    scheduled: date | None
    """The day it was made for (the ``For`` line)."""
    points: int | None
    missed: tuple[date, ...]
    closed: bool
    done_by: str | None = None
    """Who checked it off, as the ``Done by`` line names them, or None when it doesn't say."""

    @property
    def done(self) -> bool:
        return self.task.completed is not None

    @property
    def key(self) -> tuple[str, str, str] | None:
        if self.template is None or self.scheduled is None:
            return None
        return (self.template, self.kid, self.scheduled.isoformat())


def read_chore(task: TaskItem, kid: str, list_id: str) -> Chore:
    block = read_block(task.notes)
    template = (block.first("from") or "").strip() or None
    scheduled = _date(block.first("for"))
    missed = tuple(sorted({d for v in block.every("missed") if (d := _date(v))}))
    points = None
    if (value := block.first("points")) is not None:
        try:
            points = int(value)
        except ValueError:
            points = None
    return Chore(
        task=task,
        kid=kid,
        list_id=list_id,
        details=block.details,
        template=template if scheduled else None,
        scheduled=scheduled if template else None,
        points=points,
        missed=missed,
        closed=(block.first("closed") or "").strip().casefold() == CLOSED_MISSED,
        done_by=" ".join((block.first("done_by") or "").split()) or None,
    )


def chore_notes(details: str, template: str, scheduled: date, points: int | None, missed: Iterable[date] = ()) -> str:
    lines = [("From", template), ("For", scheduled.isoformat())]
    if points is not None:
        lines.append(("Points", str(points)))
    lines.extend(("Missed", d.isoformat()) for d in sorted(set(missed)))
    return write_block(details, lines)


_LINE_LABELS: Final = {
    "from": "From",
    "for": "For",
    "points": "Points",
    "missed": "Missed",
    "closed": "Closed",
    "id": "Id",
    "done_by": "Done by",
}


def _with_lines(notes: str, extra: Iterable[tuple[str, str]], *, drop: str | None = None) -> str:
    """Notes with lines added at the end of the Chore block, leaving out ``drop`` lines."""
    block = read_block(notes)
    lines = [(_LINE_LABELS.get(k, k.title()), v) for k, v in block.lines if k != drop]
    return write_block(block.details, [*lines, *extra])


def done_by_notes(notes: str, name: str | None) -> str:
    """Notes saying who checked the chore off (``Done by``), or with that line taken out when
    ``name`` is None. Notes with nothing to change come back as they were."""
    block = read_block(notes)
    if block.every("done_by") == ([name] if name else []):
        return notes
    if name is None and all(k == "done_by" for k, _v in block.lines):
        # The block only said who did it: a one-off goes back to its own notes.
        return block.details
    return _with_lines(notes, [("Done by", name)] if name else [], drop="done_by")


# Changes


@dataclass(frozen=True, slots=True)
class Make:
    list_id: str
    title: str
    notes: str
    due: date


@dataclass(frozen=True, slots=True)
class Update:
    list_id: str
    task_id: str
    title: str | None = None
    notes: str | None = None
    complete: bool = False


@dataclass(frozen=True, slots=True)
class Remove:
    list_id: str
    task_id: str


Change = Make | Update | Remove


@dataclass(slots=True)
class ChangePlan:
    changes: list[Change] = field(default_factory=list)
    more: bool = False
    """There were more than :data:`MAX_CHANGES`; the rest come on the next run."""


def plan_changes(
    templates: Sequence[Template],
    chores: Sequence[Chore],
    kid_lists: Mapping[str, str],
    today: date,
    days_ahead: int,
    school: SchoolDays | None = None,
) -> ChangePlan:
    """The changes that bring the kids' lists in line with the templates.

    ``kid_lists`` gives each kid's list id. ``days_ahead`` counts today: 7 makes chores that
    show from today through six days from now.

    ``school`` says which days are school days and lunches. Without it (the calendars couldn't
    be read), school-days chores are left as they are: none made, changed or removed.
    """
    last = today + timedelta(days=max(1, days_ahead) - 1)
    by_id = {t.id: t for t in templates}
    held = {t.id for t in templates if t.repeats == "school"} if school is None else set()
    wanted = {o.key: o for o in schedule(templates, today, last, school) if o.kid in kid_lists}
    have: dict[tuple[str, str, str], Chore] = {}
    changes: list[Change] = []

    for chore in sorted(chores, key=lambda c: (not c.done, c.task.position, c.task.id)):
        key = chore.key
        if key is None:
            continue
        if key in have:
            # Made twice (say, two runs at once): keep the done one or the first.
            if not chore.done:
                changes.append(Remove(chore.list_id, chore.task.id))
            continue
        have[key] = chore

    # The first due day of each kid's next chore from each template that already shows.
    coming: dict[tuple[str, str], date] = {}
    for o in wanted.values():
        k = (o.template, o.kid)
        if o.shows_from <= today and (k not in coming or o.due < coming[k]):
            coming[k] = o.due

    for key, o in sorted(wanted.items(), key=lambda kv: (kv[1].due, kv[0])):
        if key in have:
            continue
        source = by_id[o.template]
        changes.append(
            Make(kid_lists[o.kid], source.title, chore_notes(source.details, source.id, o.due, source.points), o.due)
        )

    for chore in have.values():
        t = by_id.get(chore.template or "")
        assert chore.scheduled is not None
        assert chore.template is not None
        if chore.done:
            continue
        due = chore.task.due or chore.scheduled
        if due < today:
            missed = due not in chore.missed
            next_due = coming.get((chore.template, chore.kid))
            ended = (
                t is None
                or not t.active
                or chore.kid not in t.who
                or (next_due is not None and next_due > chore.scheduled)
            )
            if ended:
                extra = [("Missed", due.isoformat())] if missed else []
                changes.append(
                    Update(
                        chore.list_id,
                        chore.task.id,
                        notes=_with_lines(chore.task.notes, [*extra, ("Closed", CLOSED_MISSED)]),
                        complete=True,
                    )
                )
            elif missed:
                changes.append(
                    Update(
                        chore.list_id, chore.task.id, notes=_with_lines(chore.task.notes, [("Missed", due.isoformat())])
                    )
                )
            continue
        if chore.scheduled < today or chore.missed or chore.template in held:
            continue
        if chore.key not in wanted or t is None:
            changes.append(Remove(chore.list_id, chore.task.id))
            continue
        notes = chore_notes(t.details, t.id, chore.scheduled, t.points)
        if chore.task.title != t.title or read_block(chore.task.notes) != read_block(notes):
            changes.append(
                Update(
                    chore.list_id,
                    chore.task.id,
                    title=t.title if chore.task.title != t.title else None,
                    notes=notes if read_block(chore.task.notes) != read_block(notes) else None,
                )
            )

    return ChangePlan(changes[:MAX_CHANGES], more=len(changes) > MAX_CHANGES)


# What the board shows


_REPEATS_ORDER: Final[dict[Repeats | None, int]] = {"daily": 0, "school": 1, "weekly": 2, "monthly": 3, None: 4}


def chore_state(chore: Chore, today: date, tz: tzinfo, shows_from: date | None) -> State:
    due = chore.task.due
    if chore.task.completed is not None:
        done_day = chore.task.completed.astimezone(tz).date()
        return "late" if due is not None and (chore.missed or done_day > due) else "done"
    if due is not None and due < today:
        return "overdue"
    if shows_from is not None and shows_from > today:
        return "upcoming"
    return "open"


def board_items(
    chores: Sequence[Chore],
    templates: Sequence[Template],
    kid_order: Sequence[str],
    today: date,
    days_ahead: int,
    tz: tzinfo,
    people: Mapping[str, str] | None = None,
    school: SchoolDays | None = None,
) -> list[dict[str, Any]]:
    """The chores the board shows, in order: each kid's open and overdue chores, those
    coming up in the next ``days_ahead`` days, and those done today or still to come.

    ``people`` (each kid's and parent's name by id) turns a ``Done by`` name into an id.
    A night-before chore says which school day it's for (``for_day``)."""
    last = today + timedelta(days=max(1, days_ahead) - 1)
    by_id = {t.id: t for t in templates}
    shows = {
        o.key: o.shows_from for o in schedule(templates, today - timedelta(days=62), last + timedelta(days=31), school)
    }
    rows: list[tuple[tuple[Any, ...], dict[str, Any]]] = []
    for chore in chores:
        if chore.closed:
            continue
        template = by_id.get(chore.template or "")
        shows_from = shows.get(chore.key) if chore.key else None
        if shows_from is None and chore.scheduled is not None:
            shows_from = chore.scheduled
        state = chore_state(chore, today, tz, shows_from)
        due = chore.task.due
        done_today = chore.task.completed is not None and chore.task.completed.astimezone(tz).date() == today
        if state in ("done", "late") and not done_today and (due is None or due < today):
            continue
        if state == "upcoming" and shows_from is not None and shows_from > last:
            continue
        if due is not None and due > last and (shows_from is None or shows_from > last):
            continue
        icon, title = split_icon(chore.task.title)
        night_before = template is not None and template.night_before and chore.scheduled is not None
        row = {
            "id": chore.task.id,
            "kid": chore.kid,
            "title": title,
            "icon": icon,
            "details": chore.details,
            "repeats": template.repeats if template else None,
            "due": due.isoformat() if due else None,
            "shows_from": shows_from.isoformat() if shows_from else None,
            "state": state,
            "done_at": chore.task.completed.isoformat() if chore.task.completed else None,
            "done_by": kid_for(chore.done_by, people or {}) if chore.done and chore.done_by else None,
            "done_by_name": chore.done_by if chore.done else None,
            "missed": len(chore.missed),
            "points": chore.points,
            "template": chore.template,
            "for_day": (chore.scheduled + timedelta(days=1)).isoformat() if night_before and chore.scheduled else None,
        }
        order = (
            kid_order.index(chore.kid) if chore.kid in kid_order else len(kid_order),
            due or date.max,
            _REPEATS_ORDER[template.repeats if template else None],
            template.position if template else chore.task.position,
            title.casefold(),
            chore.task.id,
        )
        rows.append((order, row))
    rows.sort(key=lambda r: r[0])
    for i, (_order, row) in enumerate(rows):
        row["order"] = i
    return [row for _order, row in rows]


def template_item(template: Template) -> dict[str, Any]:
    """A template as the chore editor sees it."""
    icon, title = split_icon(template.title)
    return {
        "id": template.id,
        "repeats": template.repeats,
        "title": title,
        "icon": icon,
        "details": template.details,
        "who": list(template.who),
        "take_turns": template.take_turns,
        "repeats_label": template.repeats_label,
        "days": template.days_label,
        "every": template.every,
        "starts": template.starts.isoformat() if template.starts else None,
        "ends": template.ends.isoformat() if template.ends else None,
        "points": template.points,
        "paused": template.paused,
        "night_before": template.night_before,
        "bring_only": template.bring_only,
        "problems": list(template.problems),
    }


def _date(value: str | None) -> date | None:
    if not value:
        return None
    try:
        return date.fromisoformat(value.strip())
    except ValueError:
        return None
