"""Sorts the one shared family calendar into each person's events.

Every event's title starts with who it's for (see :mod:`.who`). From there:

* A timed event naming a kid is that kid's activity, planned for rides as before. One that
  names two kids is in both lanes and shares its one set of ride notes. In a lane the names
  are left off the title, so "Ava Piano" shows as "Piano".
* A timed event naming a parent is that parent's own event: time they can't drive, or a drive
  they make themselves when it has an address.
* A timed event that runs across days (a trip with a start and end time) is one event in its
  person's lane, the same as any other.
* An all-day event, on one day or several, is shown in a thin row across the top of each day it
  covers, for nobody. A name in its title only gives it that person's colour, and it never
  stops anyone driving.
* A timed event that names nobody can't be placed, so it's flagged, never guessed.

Pure module, no Home Assistant imports.
"""

from __future__ import annotations

from collections.abc import Callable, Iterable, Mapping, Sequence
from dataclasses import dataclass, field, replace
from datetime import date, datetime, timedelta, tzinfo

from .google import CalendarEvent
from .who import People, Who, read_title


@dataclass(frozen=True, slots=True)
class DayItem:
    """An all-day event as one day shows it."""

    id: str
    title: str
    people: tuple[str, ...]
    """Who it names, by id, only for its colour."""
    first: date
    last: date
    """Its first and last days, both included."""
    cancelled: bool = False
    calendar_id: str = ""

    def as_dict(self, day: date) -> dict[str, object]:
        return {
            "id": self.id,
            "title": self.title,
            "people": list(self.people),
            "first": self.first.isoformat(),
            "last": self.last.isoformat(),
            "day_number": (day - self.first).days + 1,
            "days": (self.last - self.first).days + 1,
            "cancelled": self.cancelled,
        }


@dataclass(frozen=True, slots=True)
class Unplaced:
    """A timed event that couldn't be given to anyone, or named someone we don't know."""

    id: str
    title: str
    day: date
    start: datetime
    end: datetime
    reason: str
    """``nobody`` when no name starts the title; ``unknown`` when a name is joined to a word
    that isn't anyone in the family (``word`` says which), so a misspelt name isn't missed."""
    word: str | None = None
    people: tuple[str, ...] = ()
    at: int = 0
    """Its start, in minutes after midnight on its day."""

    def as_dict(self) -> dict[str, object]:
        return {
            "id": self.id,
            "title": self.title,
            "start": self.start.isoformat(),
            "end": self.end.isoformat(),
            "at": self.at,
            "reason": self.reason,
            "word": self.word,
            "people": list(self.people),
        }


@dataclass(slots=True)
class Split:
    lanes: dict[str, list[CalendarEvent]] = field(default_factory=dict)
    """Each person's timed events, by kid id or driver id."""
    day_items: list[DayItem] = field(default_factory=list)
    unplaced: list[Unplaced] = field(default_factory=list)
    escorts: dict[str, tuple[str, ...]] = field(default_factory=dict)
    """The parents a kid's event also names, by event id, in title order: "Sam, Ben & Cleo
    Donuts" means Sam takes them, so Sam drives both ways unless the notes say otherwise."""

    def day_items_on(self, day: date) -> list[DayItem]:
        return [i for i in self.day_items if i.first <= day <= i.last]

    def unplaced_on(self, day: date) -> list[Unplaced]:
        return [u for u in self.unplaced if u.day == day]


def split_events(events: Iterable[CalendarEvent], people: People, tz: tzinfo) -> Split:
    """Sort the shared calendar's events by who they're for."""
    out = Split(lanes={pid: [] for pid in (*people.kids, *people.parents)})
    for ev in events:
        if ev.declined:
            continue
        who = read_title(ev.title, people)
        if ev.all_day:
            out.day_items.append(_day_item(ev, who))
            continue
        assert isinstance(ev.start, datetime)
        assert isinstance(ev.end, datetime)
        if who.unknown is not None or not who.people:
            local = ev.start.astimezone(tz)
            out.unplaced.append(
                Unplaced(
                    ev.id,
                    who.title or "Event",
                    local.date(),
                    ev.start,
                    ev.end,
                    "unknown" if who.people else "nobody",
                    who.unknown,
                    who.people,
                    local.hour * 60 + local.minute,
                )
            )
        if who.people:
            # In a person's lane their name goes without saying: "Ava Piano" shows as "Piano".
            # A NO in front still means they aren't going.
            shown = lane_title(who)
            for pid in who.people:
                out.lanes[pid].append(replace(ev, title=shown))
            parents = tuple(p for p in who.people if p in people.parents)
            if parents and any(p in people.kids for p in who.people):
                out.escorts[ev.id] = parents
    return out


def lane_title(who: Who) -> str:
    """How an event is titled in its people's lanes: the title after the names."""
    rest = who.rest.lstrip("&,+ ").strip() or who.title or "Event"
    return f"NO {rest}" if who.cancelled else rest


def in_window(split: Split, days: Sequence[date]) -> dict[str, dict[str, list[dict[str, object]]]]:
    """The all-day items and unplaced events of each day, for the app, by ISO date."""
    return {
        d.isoformat(): {
            "all_day": [i.as_dict(d) for i in split.day_items_on(d)],
            "unplaced": [u.as_dict() for u in split.unplaced_on(d)],
        }
        for d in days
    }


def people_events(split: Split, ids: Mapping[str, object]) -> dict[str, list[CalendarEvent]]:
    """The lanes for the people in ``ids``, each present even when empty."""
    return {pid: list(split.lanes.get(pid, ())) for pid in ids}


def _day_item(ev: CalendarEvent, who: Who) -> DayItem:
    assert isinstance(ev.start, date)
    assert isinstance(ev.end, date)
    last = max(ev.start, ev.end - timedelta(days=1))
    return DayItem(ev.id, who.title or "Event", who.people, ev.start, last, who.cancelled, ev.calendar_id)


def school_lanes(
    lunches: Iterable[CalendarEvent],
    family: Iterable[CalendarEvent],
    people: People,
    is_day_off: Callable[[str], bool],
) -> dict[str, list[CalendarEvent]]:
    """Each kid's lunch events and days off, by kid id, titled as if on their own calendar.

    A lunch event names one kid, as "Ava Lunch: Pizza", and is read as "Lunch: Pizza". A day
    off ("No School") comes from the family calendar: for the kids it names, or for every kid
    when it names nobody. Nothing else on the family calendar is about lunch.
    """
    out: dict[str, list[CalendarEvent]] = {kid: [] for kid in people.kids}
    for ev in lunches:
        who = read_title(ev.title, people)
        kids = [p for p in who.people if p in out]
        if ev.all_day and len(kids) == 1 and len(who.people) == 1 and not who.cancelled:
            out[kids[0]].append(replace(ev, title=who.rest))
    for ev in family:
        if not ev.all_day or ev.declined:
            continue
        who = read_title(ev.title, people)
        if who.cancelled or not is_day_off(who.rest):
            continue
        kids = [p for p in who.people if p in out] if who.people else list(out)
        for kid in kids:
            out[kid].append(replace(ev, title=who.rest))
    return out
