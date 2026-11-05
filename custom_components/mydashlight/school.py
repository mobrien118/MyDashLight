"""School days and lunches, read from all-day events on each kid's own calendar.

* An all-day event with "No School" in its title means no school that day (or those days),
  for that kid. Every other weekday is a school day.
* An all-day event titled "Bring Lunch" or "Buy Lunch" is the kid's lunch pick for that day.
  A school day with no pick gets the kid's default from the settings (Buy, unless changed).

Nothing about school or lunch is kept in Home Assistant: the events are the record.

Pure module, no Home Assistant imports.
"""

from __future__ import annotations

from collections.abc import Iterable, Mapping, Sequence
from dataclasses import dataclass, field
from datetime import date, timedelta
import re
from typing import Any, Final, Literal

from .google import CalendarEvent

Lunch = Literal["bring", "buy"]
LUNCHES: Final[tuple[Lunch, ...]] = ("bring", "buy")
DEFAULT_LUNCH: Final[Lunch] = "buy"
LUNCH_TITLES: Final[dict[Lunch, str]] = {"bring": "Bring Lunch", "buy": "Buy Lunch"}

_NO_SCHOOL_RE: Final = re.compile(r"\bno[\s-]+school\b", re.IGNORECASE)
_LUNCH_RE: Final = re.compile(r"^\W*(bring|buy)(?:ing)?\s+lunch\W*$", re.IGNORECASE)


def lunch_of(title: str) -> Lunch | None:
    """``bring`` for "Bring Lunch", ``buy`` for "Buy Lunch", else None. Ignores case, spaces
    and emoji around it."""
    match = _LUNCH_RE.match(" ".join(title.split()))
    if not match:
        return None
    return "bring" if match.group(1).casefold() == "bring" else "buy"


def is_no_school(title: str) -> bool:
    return bool(_NO_SCHOOL_RE.search(title))


@dataclass(frozen=True, slots=True)
class LunchPick:
    """One "Bring Lunch" or "Buy Lunch" event."""

    kid: str
    day: date
    lunch: Lunch
    event_id: str
    etag: str


@dataclass(frozen=True, slots=True)
class DayOff:
    """One "No School" event: ``first`` to ``last``, both included."""

    first: date
    last: date
    title: str


@dataclass(slots=True)
class SchoolCalendar:
    """What the kids' calendars say about school and lunch from ``first`` to ``last``.

    Outside that range every weekday counts as a school day with the default lunch.
    """

    first: date
    last: date
    defaults: Mapping[str, Lunch] = field(default_factory=dict)
    days_off: dict[str, list[DayOff]] = field(default_factory=dict)
    picks: dict[tuple[str, date], list[LunchPick]] = field(default_factory=dict)
    """Every pick for each kid and day. More than one only if someone added two by hand."""

    def default(self, kid: str) -> Lunch:
        return self.defaults.get(kid, DEFAULT_LUNCH)

    def day_off(self, kid: str, day: date) -> DayOff | None:
        return next((d for d in self.days_off.get(kid, ()) if d.first <= day <= d.last), None)

    def is_school_day(self, kid: str, day: date) -> bool:
        return day.weekday() < 5 and self.day_off(kid, day) is None

    def pick(self, kid: str, day: date) -> LunchPick | None:
        found = self.picks.get((kid, day))
        return found[0] if found else None

    def lunch(self, kid: str, day: date) -> Lunch | None:
        if not self.is_school_day(kid, day):
            return None
        found = self.pick(kid, day)
        return found.lunch if found else self.default(kid)


def read_school(
    events: Mapping[str, Sequence[CalendarEvent]],
    defaults: Mapping[str, Lunch],
    first: date,
    last: date,
) -> SchoolCalendar:
    """The school days and lunch picks in each kid's events (by kid calendar id)."""
    out = SchoolCalendar(first=first, last=last, defaults=dict(defaults))
    for kid, kid_events in events.items():
        offs: list[DayOff] = []
        for ev in kid_events:
            if not ev.all_day or not isinstance(ev.start, date) or not isinstance(ev.end, date):
                continue
            # All-day events end the day after their last day.
            ev_last = max(ev.start, ev.end - timedelta(days=1))
            if is_no_school(ev.title):
                offs.append(DayOff(ev.start, ev_last, " ".join(ev.title.split())))
                continue
            lunch = lunch_of(ev.title)
            if lunch is None:
                continue
            day = ev.start
            while day <= ev_last:
                out.picks.setdefault((kid, day), []).append(LunchPick(kid, day, lunch, ev.id, ev.etag))
                day += timedelta(days=1)
        out.days_off[kid] = sorted(offs, key=lambda d: (d.first, d.last))
    return out


@dataclass(frozen=True, slots=True)
class LunchChange:
    """Make, retitle or remove one lunch event."""

    kid: str
    day: date
    make: Lunch | None = None
    """Make a new event with this lunch."""
    retitle: tuple[str, str, Lunch] | None = None
    """(event id, etag, lunch): change an existing event to this lunch."""
    remove: tuple[str, str] | None = None
    """(event id, etag): remove an event."""


def lunch_changes(school: SchoolCalendar, kid: str, days: Iterable[date], lunch: Lunch | None) -> list[LunchChange]:
    """The changes that make ``kid``'s lunch on each of ``days`` ``lunch``, or take the pick
    away (back to the default) when ``lunch`` is None.

    Days with no school are skipped. A pick that spans several days (made by hand) is
    left alone unless it's taken away. A second pick on the same day is removed.
    """
    out: list[LunchChange] = []
    for day in sorted(set(days)):
        if lunch is not None and not school.is_school_day(kid, day):
            continue
        found = school.picks.get((kid, day), [])
        keep, extra = (found[0], found[1:]) if found else (None, [])
        out.extend(LunchChange(kid, day, remove=(p.event_id, p.etag)) for p in extra)
        if lunch is None:
            if keep is not None:
                out.append(LunchChange(kid, day, remove=(keep.event_id, keep.etag)))
        elif keep is None:
            out.append(LunchChange(kid, day, make=lunch))
        elif keep.lunch != lunch:
            out.append(LunchChange(kid, day, retitle=(keep.event_id, keep.etag, lunch)))
    # An event can only be removed once, even when it covered more than one of the days.
    seen: set[str] = set()
    unique: list[LunchChange] = []
    for change in out:
        event = (change.remove or change.retitle or ("",))[0]
        if event and event in seen:
            continue
        if event:
            seen.add(event)
        unique.append(change)
    return unique


def lunch_payload(school: SchoolCalendar, kids: Mapping[str, str], today: date) -> dict[str, Any]:
    """What the kitchen app's Lunch tab and lunch chips need."""
    out_kids: list[dict[str, Any]] = []
    for kid, name in kids.items():
        picks = {
            day.isoformat(): found[0].lunch
            for (k, day), found in sorted(school.picks.items())
            if k == kid and found and school.is_school_day(kid, day)
        }
        out_kids.append(
            {
                "id": kid,
                "name": name,
                "default": school.default(kid),
                "picks": picks,
                "days_off": [
                    {"first": d.first.isoformat(), "last": d.last.isoformat(), "title": d.title}
                    for d in school.days_off.get(kid, [])
                ],
            }
        )
    return {
        "today": today.isoformat(),
        "first": school.first.isoformat(),
        "last": school.last.isoformat(),
        "kids": out_kids,
    }
