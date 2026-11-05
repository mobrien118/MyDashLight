"""Chore templates and the chores made from them, as they're stored in Google Tasks.

A template is a task on one of the three base lists ("Chore templates: Daily", "Weekly" and
"Monthly"). Its title is the chore, the list says how often it repeats, and the rest of the
rules are lines in a block at the end of its notes::

    Bins at the curb by 7 PM.

    --- Chore ---
    Id: k3J9x0
    Who: Ava, Ben
    Take turns: yes
    Days: Thu
    Every: 2
    Starts: 2026-11-04
    Ends: 2027-06-05
    Points: 1

Text above the block is the chore's details, shown when it's tapped. A template that's
checked off in Google is paused.

Each chore made from a template is a task on that kid's list, due on its day, with the same
title and details and a block linking it back::

    Bins at the curb by 7 PM.

    --- Chore ---
    From: k3J9x0
    For: 2026-11-05
    Points: 1
    Missed: 2026-11-05
    Closed: missed

``For`` is the day it was scheduled for, which stays the same if someone moves its due date
in Google. ``Missed`` lines are added each time it's still open after its due day.
``Closed: missed`` marks a missed chore MyDashLight checked off to make way for the next one,
so it isn't counted as done.

Pure module, no Home Assistant imports.
"""

from __future__ import annotations

import calendar
from collections.abc import Iterable, Iterator, Mapping, Sequence
from dataclasses import dataclass, field, replace
from datetime import date, timedelta
import re
from typing import Final, Literal

CHORE_HEADER: Final = "--- Chore ---"

Repeats = Literal["daily", "weekly", "monthly"]
REPEATS: Final[tuple[Repeats, ...]] = ("daily", "weekly", "monthly")

WEEKDAYS: Final = ("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
_WEEKDAY_WORDS: Final[dict[str, int]] = {
    **{d.casefold(): i for i, d in enumerate(WEEKDAYS)},
    **{d.casefold(): i for i, d in enumerate(calendar.day_name)},
    "tues": 1,
    "wednes": 2,
    "thur": 3,
    "thurs": 3,
}
_ORDINALS: Final[dict[str, int]] = {
    "1st": 1,
    "first": 1,
    "2nd": 2,
    "second": 2,
    "3rd": 3,
    "third": 3,
    "4th": 4,
    "fourth": 4,
    "5th": 5,
    "fifth": 5,
    "last": -1,
}
_ANY: Final = frozenset({"any", "anytime", "any day", "sometime", "any time"})
_EVERY_DAY: Final = frozenset({"", "every day", "everyday", "daily", "all", "all days"})
_EVERYONE: Final = frozenset({"everyone", "everybody", "all", "all kids"})
_YES: Final = frozenset({"yes", "y", "true", "on"})
_NO: Final = frozenset({"no", "n", "false", "off", ""})

_HEADER_RE: Final = re.compile(r"^\s*-{2,}\s*chores?\s*-{2,}\s*$", re.IGNORECASE)
_LINE_RE: Final = re.compile(r"^\s*([A-Za-z][A-Za-z ]{0,20}?)\s*:\s*(.*?)\s*$")
_SPLIT_RE: Final = re.compile(r"\s*(?:,|;|&|\+|/|\band\b)\s*", re.IGNORECASE)
_RANGE_RE: Final = re.compile(r"^([a-z]+)\s*(?:-|–|to|through|thru)\s*([a-z]+)$", re.IGNORECASE)
_DATE_RE: Final = re.compile(r"^(\d{1,2})(?:st|nd|rd|th)?$", re.IGNORECASE)
_NTH_RE: Final = re.compile(r"^([a-z0-9]+)\s+([a-z]+)$", re.IGNORECASE)
# An emoji (with its joiners and variation selectors) at the start of a title.
_ICON_RE: Final = re.compile(
    r"^((?:[\U0001F000-\U0001FAFF☀-➿⬀-⯿⌀-⏿]"
    r"[︎️‍\U0001F3FB-\U0001F3FF\U0001F000-\U0001FAFF☀-➿]*)+)\s*"
)

_LABELS: Final[dict[str, str]] = {
    "id": "id",
    "who": "who",
    "for": "for",
    "kid": "who",
    "kids": "who",
    "taketurns": "turns",
    "turns": "turns",
    "rotate": "turns",
    "days": "days",
    "day": "days",
    "on": "days",
    "every": "every",
    "starts": "starts",
    "start": "starts",
    "ends": "ends",
    "end": "ends",
    "points": "points",
    "from": "from",
    "missed": "missed",
    "closed": "closed",
    "doneby": "done_by",
    "completedby": "done_by",
}


@dataclass(frozen=True, slots=True)
class ChoreBlock:
    """A task's notes split into the details above the Chore block and the block's lines."""

    details: str
    lines: tuple[tuple[str, str], ...]
    """Each recognized line as (field, value), in order. Repeated fields keep every value."""
    has_block: bool

    def first(self, key: str) -> str | None:
        return next((v for k, v in self.lines if k == key), None)

    def every(self, key: str) -> list[str]:
        return [v for k, v in self.lines if k == key]


def read_block(notes: str) -> ChoreBlock:
    """Split a task's notes at the Chore block. Notes with no block are all details."""
    lines = notes.replace("\r\n", "\n").split("\n")
    start = next((i for i, line in enumerate(lines) if _HEADER_RE.match(line)), None)
    if start is None:
        return ChoreBlock(details=notes.strip(), lines=(), has_block=False)
    found: list[tuple[str, str]] = []
    for line in lines[start + 1 :]:
        match = _LINE_RE.match(line)
        if not match:
            continue
        key = _LABELS.get(re.sub(r"[\s]", "", match.group(1)).casefold())
        if key:
            found.append((key, match.group(2)))
    return ChoreBlock(details="\n".join(lines[:start]).strip(), lines=tuple(found), has_block=True)


def write_block(details: str, lines: Iterable[tuple[str, str]]) -> str:
    """Notes made of the details, then the Chore block with ``lines`` as (label, value)."""
    body = "\n".join(f"{label}: {value}" for label, value in lines)
    block = f"{CHORE_HEADER}\n{body}" if body else CHORE_HEADER
    details = details.strip()
    return f"{details}\n\n{block}" if details else block


def split_icon(title: str) -> tuple[str | None, str]:
    """A leading emoji and the rest of the title: ("🧹", "Vacuum") for "🧹 Vacuum"."""
    title = " ".join(title.split())
    match = _ICON_RE.match(title)
    if not match or not title[match.end() :]:
        return None, title
    return match.group(1), title[match.end() :]


# Days


@dataclass(frozen=True, slots=True)
class MonthDay:
    """A day in the month: a date (``day``, 31 meaning the last day in shorter months), or the
    ``nth`` weekday (-1 for the last one)."""

    day: int | None = None
    nth: int | None = None
    weekday: int | None = None

    def resolve(self, year: int, month: int) -> date | None:
        last = calendar.monthrange(year, month)[1]
        if self.day is not None:
            return date(year, month, min(self.day, last))
        assert self.nth is not None
        assert self.weekday is not None
        if self.nth == -1:
            d = date(year, month, last)
            return d - timedelta(days=(d.weekday() - self.weekday) % 7)
        first = date(year, month, 1)
        d = first + timedelta(days=(self.weekday - first.weekday()) % 7 + 7 * (self.nth - 1))
        return d if d.month == month else None

    def label(self) -> str:
        if self.day is not None:
            return "last" if self.day == 31 else str(self.day)
        nth = {1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", -1: "last"}[self.nth or 1]
        return f"{nth} {WEEKDAYS[self.weekday or 0]}"


@dataclass(frozen=True, slots=True)
class Days:
    """When in its period a chore is due. ``any`` means sometime that week or month, due on
    its last day. Otherwise ``weekdays`` (daily and weekly) or ``month_days`` (monthly)."""

    any: bool = False
    weekdays: frozenset[int] = frozenset()
    month_days: tuple[MonthDay, ...] = ()

    def label(self, repeats: Repeats) -> str:
        if self.any:
            return "Any"
        if repeats == "monthly":
            return ", ".join(m.label() for m in self.month_days)
        return weekdays_label(self.weekdays)


def weekdays_label(days: Iterable[int]) -> str:
    """ "Mon-Fri", "Sat, Sun", "Mon, Wed, Fri" or "" for every day."""
    wanted = sorted(set(days))
    if len(wanted) in (0, 7):
        return ""
    runs: list[list[int]] = []
    for d in wanted:
        if runs and runs[-1][-1] == d - 1:
            runs[-1].append(d)
        else:
            runs.append([d])
    parts: list[str] = []
    for run in runs:
        if len(run) >= 3:
            parts.append(f"{WEEKDAYS[run[0]]}-{WEEKDAYS[run[-1]]}")
        else:
            parts.extend(WEEKDAYS[d] for d in run)
    return ", ".join(parts)


class DaysError(ValueError):
    """The Days line can't be read."""


def parse_days(value: str, repeats: Repeats) -> Days:
    """Read a Days value for a chore that repeats ``repeats``. Raises :class:`DaysError`."""
    text = " ".join(value.split()).casefold()
    if repeats == "daily":
        if text in _EVERY_DAY or text in _ANY:
            return Days()
        return Days(weekdays=_weekdays(text))
    if text in _ANY or (repeats == "weekly" and text in ("", "this week", "sometime this week")):
        return Days(any=True)
    if repeats == "monthly" and text in ("this month", "sometime this month", ""):
        return Days(any=True)
    if repeats == "weekly":
        return Days(weekdays=_weekdays(text))
    return Days(month_days=_month_days(text))


def _weekdays(text: str) -> frozenset[int]:
    if text in ("weekdays", "school days", "weekday"):
        return frozenset(range(5))
    if text in ("weekends", "weekend"):
        return frozenset({5, 6})
    out: set[int] = set()
    for part in _SPLIT_RE.split(text):
        if not part:
            continue
        span = _RANGE_RE.match(part)
        if span:
            a, b = _weekday(span.group(1)), _weekday(span.group(2))
            out.update((a + i) % 7 for i in range((b - a) % 7 + 1))
        else:
            out.update(_weekday(word) for word in part.split())
    if not out:
        raise DaysError(text)
    return frozenset(out)


def _weekday(word: str) -> int:
    word = word.casefold().rstrip(".")
    if word.endswith("s") and word[:-1] in _WEEKDAY_WORDS:
        word = word[:-1]  # "Mondays"
    if word.endswith("day") and word not in _WEEKDAY_WORDS:
        word = word[: -len("day")]
    if word in _WEEKDAY_WORDS:
        return _WEEKDAY_WORDS[word]
    raise DaysError(word)


def _month_days(text: str) -> tuple[MonthDay, ...]:
    out: list[MonthDay] = []
    for part in (p for p in re.split(r"\s*[,;&]\s*|\s+and\s+", text) if p):
        if part in ("last", "last day", "end", "end of month"):
            out.append(MonthDay(day=31))
            continue
        number = _DATE_RE.match(part)
        if number:
            day = int(number.group(1))
            if not 1 <= day <= 31:
                raise DaysError(part)
            out.append(MonthDay(day=day))
            continue
        nth = _NTH_RE.match(part)
        if nth and nth.group(1).casefold() in _ORDINALS:
            out.append(MonthDay(nth=_ORDINALS[nth.group(1).casefold()], weekday=_weekday(nth.group(2))))
            continue
        raise DaysError(part)
    if not out:
        raise DaysError(text)
    return tuple(dict.fromkeys(out))


# Templates


@dataclass(frozen=True, slots=True)
class Template:
    """One chore's rules, read from a task on a base list."""

    id: str
    """The Id line, or the Google task's id when there is none yet."""
    task_id: str
    repeats: Repeats
    title: str
    details: str = ""
    who: tuple[str, ...] = ()
    """Kid ids."""
    take_turns: bool = False
    days: Days = field(default_factory=Days)
    every: int = 1
    starts: date | None = None
    """None means it was never set: from the day it was made."""
    ends: date | None = None
    points: int | None = None
    paused: bool = False
    position: str = ""
    """Google's sort key within the base list."""
    problems: tuple[str, ...] = ()
    """What couldn't be read, such as "who:Zed". A template with problems makes no chores."""

    @property
    def active(self) -> bool:
        return not self.paused and not self.problems and bool(self.who)


def parse_template(
    task_id: str,
    repeats: Repeats,
    title: str,
    notes: str,
    *,
    completed: bool,
    kids: Mapping[str, str],
    created: date | None = None,
    position: str = "",
) -> Template:
    """Read a template task. ``kids`` gives each kid's name by kid id."""
    block = read_block(notes)
    problems: list[str] = []
    who: list[str] = []
    for name in _SPLIT_RE.split(block.first("who") or ""):
        name = " ".join(name.split())
        if not name:
            continue
        if name.casefold() in _EVERYONE:
            who.extend(k for k in kids if k not in who)
            continue
        kid = kid_for(name, kids)
        if kid is None:
            problems.append(f"who:{name}")
        elif kid not in who:
            who.append(kid)
    if not who and not problems:
        problems.append("who:")
    try:
        days = parse_days(block.first("days") or "", repeats)
    except DaysError:
        problems.append(f"days:{block.first('days') or ''}")
        days = Days()
    every = _number(block.first("every"), 1)
    if every is None or every < 1:
        problems.append(f"every:{block.first('every')}")
        every = 1
    starts = _date(block.first("starts"))
    if block.first("starts") and starts is None:
        problems.append(f"starts:{block.first('starts')}")
    ends = _date(block.first("ends"))
    if block.first("ends") and ends is None:
        problems.append(f"ends:{block.first('ends')}")
    points = _number(block.first("points"), None)
    if block.first("points") and points is None:
        problems.append(f"points:{block.first('points')}")
    turns = (block.first("turns") or "").strip().casefold()
    if turns not in _YES and turns not in _NO:
        problems.append(f"take_turns:{block.first('turns')}")
    if not " ".join(title.split()):
        problems.append("title:")
    return Template(
        id=(block.first("id") or "").strip() or task_id,
        task_id=task_id,
        repeats=repeats,
        title=" ".join(title.split()),
        details=block.details,
        who=tuple(who),
        take_turns=turns in _YES and len(who) > 1,
        days=days,
        every=every,
        starts=starts or created,
        ends=ends,
        points=points,
        paused=completed,
        position=position,
        problems=tuple(problems),
    )


def template_notes(template: Template, kids: Mapping[str, str]) -> str:
    """The notes MyDashLight writes for a template, in the fixed form."""
    lines: list[tuple[str, str]] = [("Id", template.id)]
    lines.append(("Who", ", ".join(kids.get(k, k) for k in template.who)))
    if template.take_turns:
        lines.append(("Take turns", "yes"))
    days = template.days.label(template.repeats)
    if days:
        lines.append(("Days", days))
    if template.every != 1:
        lines.append(("Every", str(template.every)))
    if template.starts:
        lines.append(("Starts", template.starts.isoformat()))
    if template.ends:
        lines.append(("Ends", template.ends.isoformat()))
    if template.points is not None:
        lines.append(("Points", str(template.points)))
    return write_block(template.details, lines)


def kid_for(name: str, kids: Mapping[str, str]) -> str | None:
    """The id for a kid's (or anyone's) name or id, ignoring case and extra spaces."""
    key = " ".join(name.split()).casefold()
    for kid, kid_name in kids.items():
        if key in (kid.casefold(), " ".join(kid_name.split()).casefold()):
            return kid
    return None


def _number(value: str | None, default: int | None) -> int | None:
    if value is None or not value.strip():
        return default
    try:
        return int(value.strip())
    except ValueError:
        return None


def _date(value: str | None) -> date | None:
    if not value or not value.strip():
        return None
    try:
        return date.fromisoformat(value.strip())
    except ValueError:
        return None


# The schedule


@dataclass(frozen=True, slots=True)
class Occurrence:
    """One chore one kid should have: due ``due``, shown from ``shows_from``."""

    template: str
    kid: str
    due: date
    shows_from: date

    @property
    def key(self) -> tuple[str, str, str]:
        return (self.template, self.kid, self.due.isoformat())


def week_start(day: date) -> date:
    return day - timedelta(days=day.weekday())


def _months_between(a: date, b: date) -> int:
    return (b.year - a.year) * 12 + b.month - a.month


def _due_days(template: Template, first: date, last: date) -> Iterator[tuple[date, date]]:
    """Each (due, shows from) of the template, in order, with due from ``first`` to ``last``.

    Every N counts from the period Starts falls in. A "sometime this week or month" chore
    shows from the start of its period (or Starts) and is due on its last day (or Ends).
    """
    starts = template.starts or first
    begin = max(first, starts)
    end = min(last, template.ends) if template.ends else last
    if begin > end:
        return
    days = template.days
    if template.repeats == "daily":
        for i in range((end - begin).days + 1):
            d = begin + timedelta(days=i)
            if (d - starts).days % template.every == 0 and (not days.weekdays or d.weekday() in days.weekdays):
                yield d, d
        return
    if template.repeats == "weekly":
        period = week_start(begin)
        while period <= end:
            if ((period - week_start(starts)).days // 7) % template.every == 0:
                if days.any:
                    due = period + timedelta(days=6)
                    if template.ends and due > template.ends:
                        due = template.ends
                    if begin <= due <= end:
                        yield due, max(period, starts)
                else:
                    for wd in sorted(days.weekdays):
                        d = period + timedelta(days=wd)
                        if begin <= d <= end:
                            yield d, d
            period += timedelta(days=7)
        return
    period = date(begin.year, begin.month, 1)
    while period <= end:
        if _months_between(starts, period) % template.every == 0:
            if days.any:
                due = next_month(period) - timedelta(days=1)
                if template.ends and due > template.ends:
                    due = template.ends
                if begin <= due <= end:
                    yield due, max(period, starts)
            else:
                found = sorted({hit for m in days.month_days if (hit := m.resolve(period.year, period.month))})
                for day in found:
                    if begin <= day <= end:
                        yield day, day
        period = next_month(period)


def next_month(month: date) -> date:
    """The first of the month after ``month``."""
    return date(month.year + (month.month == 12), month.month % 12 + 1, 1)


def occurrences(template: Template, first: date, last: date) -> list[Occurrence]:
    """The chores the template asks for that are due from ``first`` on and show by ``last``.

    A "sometime this month" chore shows from the 1st, so it's made then even though it's due
    weeks later. Each kid in Who gets their own, unless they take turns. Turns go in order of
    Who, one per due day, counted from Starts, so whose turn it is never depends on what got
    done.
    """
    if not template.active:
        return []
    # Anything showing by ``last`` is due within a month of it.
    horizon = last + timedelta(days=31)
    if not template.take_turns:
        due_days = list(_due_days(template, first, horizon))
        return [
            Occurrence(template.id, kid, due, shows) for due, shows in due_days if shows <= last for kid in template.who
        ]
    starts = template.starts or first
    out: list[Occurrence] = []
    for i, (due, shows) in enumerate(_due_days(template, min(starts, first), horizon)):
        if due >= first and shows <= last:
            out.append(Occurrence(template.id, template.who[i % len(template.who)], due, shows))
    return out


def schedule(templates: Sequence[Template], first: date, last: date) -> list[Occurrence]:
    """Every active template's chores due from ``first`` to ``last``."""
    return [o for t in templates for o in occurrences(t, first, last)]


def with_changes(template: Template, **changes: object) -> Template:
    """A copy of the template with fields changed, its problems cleared."""
    return replace(template, problems=(), **changes)  # type: ignore[arg-type]
