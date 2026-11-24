"""Points for chores: what a check-off earns, and each person's score for the last few days.

The rules, kept simple on purpose:

* A chore is worth its seed's ``Points`` line, or the default points when it has none.
* Done on time by the kid it's for: all of it.
* Done late: the late share (half, unless set otherwise), whoever does it, the kid it's for
  included. Keep the share under 100%, or two kids would earn more by swapping their chores
  than by doing their own.
* Done by someone else before it's late, or before it's been late for ``open_after``: a favor,
  worth nothing.
* Missed (closed out by MyDashLight): nothing. Points are never taken away.

A chore is late once its due day is over. Google Tasks keeps due dates without a time.

What a check-off earned is written on the task (``Earned``), so changing a setting later never
changes what was earned before.

Pure module, no Home Assistant imports.
"""

from __future__ import annotations

from collections.abc import Iterable, Mapping
from dataclasses import dataclass
from datetime import datetime, time, timedelta, tzinfo
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


def worth(chore: Chore, settings: PointsSettings) -> int:
    """What the chore is worth done on time."""
    return settings.default if chore.points is None else max(0, chore.points)


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
) -> float | None:
    """What the check-off earned, or None while the chore is open. The ``Earned`` line wins."""
    if not chore.done:
        return None
    if chore.earned is not None:
        return chore.earned
    if chore.closed:
        return 0.0
    full = worth(chore, settings)
    cutoff = late_after(chore, tz)
    done_at = chore.task.completed
    assert done_at is not None
    late = cutoff is not None and done_at >= cutoff
    if doer(chore, people) == chore.kid:
        return _share(full, settings.late_share) if late else float(full)
    if not late or cutoff is None or done_at < cutoff + settings.open_after:
        return 0.0
    return _share(full, settings.late_share)


def scores(
    chores: Iterable[Chore],
    settings: PointsSettings,
    tz: tzinfo,
    people: Mapping[str, str],
    now: datetime,
    days: int = SCORE_DAYS,
) -> dict[str, float]:
    """Everyone's points for chores checked off in the last ``days`` days, by person id.
    Everyone in ``people`` is listed, with 0 when they earned nothing."""
    since = now - timedelta(days=days)
    out = dict.fromkeys(people, 0.0)
    for chore in chores:
        done_at = chore.task.completed
        if done_at is None or chore.closed or not since < done_at <= now:
            continue
        points = earned(chore, settings, tz, people)
        if points:
            who = doer(chore, people)
            out[who] = round(out.get(who, 0.0) + points, 1)
    return out


def leaders(totals: Mapping[str, float], kids: Iterable[str]) -> list[str]:
    """The kids with the most points, ties included. Nobody when the top score is 0."""
    kid_scores = {k: totals.get(k, 0.0) for k in kids}
    top = max(kid_scores.values(), default=0.0)
    return [k for k, v in kid_scores.items() if v == top] if top > 0 else []


def format_points(value: float) -> str:
    """``2`` for whole points, ``0.5`` otherwise."""
    return str(int(value)) if value == int(value) else f"{value:.1f}"


def parse_points(value: str | None) -> float | None:
    if value is None:
        return None
    try:
        number = float(value.strip())
    except ValueError:
        return None
    return number if number >= 0 else None


def _share(full: int, percent: int) -> float:
    return round(full * max(0, min(100, percent)) / 100, 1)
