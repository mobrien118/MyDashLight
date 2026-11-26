"""Points for chores: what a check-off earns, and each person's score for the last few days.

The rules, kept simple on purpose:

* A chore is worth its seed's ``Points`` line as it is now, or the default points when the seed
  has none (or is gone).
* Done on time by the kid it's for: all of it.
* Done late: the late share (half, unless set otherwise), whoever does it, the kid it's for
  included. Keep the share under 100%, or two kids would earn more by swapping their chores
  than by doing their own.
* Done by someone else before it's late, or before it's been late for ``open_after``: a favor,
  worth nothing.
* Missed (closed out by MyDashLight), skipped or excused: nothing. Points are never taken away.

A chore is late once its due day is over. Google Tasks keeps due dates without a time.

Nothing earned is written down: points are worked out from the chore's current value and the
settings each time, so changing a value or a setting counts for check-offs already made too.

Pure module, no Home Assistant imports.
"""

from __future__ import annotations

from collections.abc import Iterable, Mapping
from dataclasses import dataclass
from datetime import date, datetime, time, timedelta, tzinfo
from typing import TYPE_CHECKING, Final

from .chore_rules import kid_for

if TYPE_CHECKING:
    from .chores import Chore

DEFAULT_POINTS: Final = 1
DEFAULT_LATE_SHARE: Final = 50
"""Percent of a chore's points for doing it late."""
DEFAULT_OPEN_AFTER: Final = 0
"""Hours after a chore turns late before someone else earns points for it."""
SCORE_DAYS: Final = 7


@dataclass(frozen=True, slots=True)
class PointsSettings:
    default: int = DEFAULT_POINTS
    late_share: int = DEFAULT_LATE_SHARE
    """Percent, 0 to 100."""
    open_after: timedelta = timedelta(hours=DEFAULT_OPEN_AFTER)


def worth(chore: Chore, settings: PointsSettings, values: Mapping[str, int | None]) -> int:
    """What the chore is worth done on time. ``values`` gives each seed's ``Points``, by seed id."""
    points = values.get(chore.template) if chore.template else None
    return settings.default if points is None else max(0, points)


def late_after(chore: Chore, tz: tzinfo) -> datetime | None:
    """When the chore turns late (the end of its due day), or None when it has no due day."""
    due = chore.task.due
    if due is None:
        return None
    return datetime.combine(due + timedelta(days=1), time(0), tz)


def doer(chore: Chore, people: Mapping[str, str]) -> str:
    """Who checked the chore off, by id: the ``Done by`` person, else the kid it's for."""
    if chore.done_by:
        return kid_for(chore.done_by, people) or chore.kid
    return chore.kid


def earned(
    chore: Chore,
    settings: PointsSettings,
    tz: tzinfo,
    people: Mapping[str, str],
    values: Mapping[str, int | None],
) -> float | None:
    """What the check-off earned, or None while the chore is open."""
    if not chore.done:
        return None
    if chore.closed or chore.skipped:
        return 0.0
    full = worth(chore, settings, values)
    cutoff = late_after(chore, tz)
    done_at = chore.task.completed
    assert done_at is not None
    late = cutoff is not None and done_at >= cutoff
    if doer(chore, people) == chore.kid:
        return _share(full, settings.late_share) if late else float(full)
    if not late or cutoff is None or done_at < cutoff + settings.open_after:
        return 0.0
    return _share(full, settings.late_share)


@dataclass(frozen=True, slots=True)
class Checkoff:
    """A chore checked off in the last few days: who did it, what it earned, and whether it was late."""

    chore: Chore
    by: str
    """Who did it, by id."""
    points: float
    late: bool


def checkoffs(
    chores: Iterable[Chore],
    settings: PointsSettings,
    tz: tzinfo,
    people: Mapping[str, str],
    values: Mapping[str, int | None],
    now: datetime,
    days: int = SCORE_DAYS,
) -> list[Checkoff]:
    """The chores checked off in the last ``days`` days, newest first, favors (worth 0) included.
    Skipped, excused and missed ones aren't check-offs."""
    since = now - timedelta(days=days)
    out: list[Checkoff] = []
    for chore in chores:
        done_at = chore.task.completed
        if done_at is None or chore.closed or chore.skipped or not since < done_at <= now:
            continue
        cutoff = late_after(chore, tz)
        out.append(
            Checkoff(
                chore,
                doer(chore, people),
                earned(chore, settings, tz, people, values) or 0.0,
                cutoff is not None and done_at >= cutoff,
            )
        )
    out.sort(key=lambda c: c.chore.task.completed or now, reverse=True)
    return out


def possible(
    chores: Iterable[Chore],
    settings: PointsSettings,
    values: Mapping[str, int | None],
    kids: Iterable[str],
    today: date,
    days: int = SCORE_DAYS,
) -> dict[str, int]:
    """What each kid's own chores due in the last ``days`` days (today included) were worth on
    time, by kid id: what they could have earned. Excused ones don't count; skipped and missed
    ones do. A kid who also does others' chores late can end up with more than this."""
    first = today - timedelta(days=days - 1)
    out = dict.fromkeys(kids, 0)
    for chore in chores:
        due = chore.task.due
        if chore.kid not in out or due is None or not first <= due <= today or chore.skipped == "excused":
            continue
        out[chore.kid] += worth(chore, settings, values)
    return out


def scores(done: Iterable[Checkoff], people: Mapping[str, str]) -> dict[str, float]:
    """Everyone's points from ``done``, by person id. Everyone in ``people`` is listed, with 0
    when they earned nothing."""
    out = dict.fromkeys(people, 0.0)
    for c in done:
        if c.points:
            out[c.by] = round(out.get(c.by, 0.0) + c.points, 1)
    return out


def leaders(totals: Mapping[str, float], kids: Iterable[str]) -> list[str]:
    """The kids with the most points, ties included. Nobody when the top score is 0."""
    kid_scores = {k: totals.get(k, 0.0) for k in kids}
    top = max(kid_scores.values(), default=0.0)
    return [k for k, v in kid_scores.items() if v == top] if top > 0 else []


def _share(full: int, percent: int) -> float:
    return round(full * max(0, min(100, percent)) / 100, 1)
