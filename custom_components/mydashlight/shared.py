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
* A "For:" line in the event's Rides notes block names who it's for instead, and wins over the
  title. That's how the board saves a pick made on screen without changing the title.
* A stay away from home, titled with names and then "Stay" ("Sam Stay Marriott Chicago"), all
  day or from check-in to check-out, makes its location home for those parents' rides on the
  days it covers (Marty, 2026-11-18). It shows across the top of each day, like an all-day
  event, and is never busy time.

Pure module, no Home Assistant imports.
"""

from __future__ import annotations

from collections.abc import Callable, Iterable, Mapping, Sequence
from dataclasses import dataclass, field, replace
from datetime import date, datetime, timedelta, tzinfo
import re
from typing import Final

from .google import CalendarEvent
from .notes import human_notes, read_for
from .who import People, Who, read_names, read_title


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
    notes: str = ""
    """What people wrote in its notes (see :func:`.notes.human_notes`)."""

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
            "notes": self.notes,
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
    calendar_id: str = ""
    recurring_id: str | None = None
    from_notes: bool = False
    """Who it's for came from the For line in its notes, not its title."""
    notes: str = ""
    """What people wrote in its notes (see :func:`.notes.human_notes`)."""

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
            "recurring": self.recurring_id is not None,
            "from_notes": self.from_notes,
            "notes": self.notes,
        }


_STAY_RE: Final = re.compile(r"^stay(?:ing)?(?:\s+at)?\b[\s:,–-]*(.*)$", re.IGNORECASE)


@dataclass(frozen=True, slots=True)
class Stay:
    """A stay away from home: where its people's rides start and end while it lasts."""

    id: str
    people: tuple[str, ...]
    """Who it names, by id, at least one of them a parent. Only the parents' rides move; a kid
    goes where their driver goes."""
    name: str
    """What the title calls the place, as "Marriott Chicago", or "" when it doesn't say."""
    location: str
    """Its address, from the event's location, or else the name."""
    first: date
    last: date
    """The days it covers, both included: every day it touches."""

    def covers(self, day: date) -> bool:
        return self.first <= day <= self.last


def stay_place(who: Who) -> str | None:
    """The place a stay's title names, "" when it names none, or None when it isn't a stay."""
    if who.cancelled or not who.people:
        return None
    m = _STAY_RE.match(who.rest.lstrip("&,+ ").strip())
    return " ".join(m.group(1).split()) if m else None


@dataclass(slots=True)
class Split:
    lanes: dict[str, list[CalendarEvent]] = field(default_factory=dict)
    """Each person's timed events, by kid id or driver id."""
    day_items: list[DayItem] = field(default_factory=list)
    unplaced: list[Unplaced] = field(default_factory=list)
    who: dict[str, tuple[tuple[str, ...], bool]] = field(default_factory=dict)
    """Who each timed event is for, by Google event id, and whether that came from its notes."""
    escorts: dict[str, tuple[str, ...]] = field(default_factory=dict)
    """The parents a kid's event also names, by event id, in title order: "Sam, Ben & Cleo
    Donuts" means Sam takes them, so Sam drives both ways unless the notes say otherwise."""
    stays: list[Stay] = field(default_factory=list)

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
        who, from_notes = read_who(ev, people)
        # Only a parent's stay moves home. "Ava Stay at Noah's" is a sleepover: a ride as usual.
        place = stay_place(who) if any(p in people.parents for p in who.people) else None
        if place is not None and (stay := _stay(ev, who, place, tz)) is not None:
            out.stays.append(stay)
            out.day_items.append(
                DayItem(
                    ev.id,
                    who.title or "Stay",
                    who.people,
                    stay.first,
                    stay.last,
                    calendar_id=ev.calendar_id,
                    notes=human_notes(ev.description),
                )
            )
            continue
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
                    "unknown" if who.unknown is not None else "nobody",
                    who.unknown,
                    who.people,
                    local.hour * 60 + local.minute,
                    ev.calendar_id,
                    ev.recurring_id,
                    from_notes,
                    human_notes(ev.description),
                )
            )
        if who.people:
            out.who[ev.id] = (who.people, from_notes)
            # In a person's lane their name goes without saying: "Ava Piano" shows as "Piano".
            # A NO in front still means they aren't going.
            shown = lane_title(who)
            for pid in who.people:
                out.lanes[pid].append(replace(ev, title=shown))
            parents = tuple(p for p in who.people if p in people.parents)
            if parents and any(p in people.kids for p in who.people):
                out.escorts[ev.id] = parents
    return out


def read_who(ev: CalendarEvent, people: People) -> tuple[Who, bool]:
    """Who an event is for, and whether that came from the For line in its notes.

    A For line wins over the names in the title. The title then keeps its own names off the
    front only when the For line names all of them too, so "Ava Piano" for Ava and Ben shows as
    "Piano", while "Sam Golf" for Cleo keeps its whole title in Cleo's lane.
    """
    who = read_title(ev.title, people)
    said = read_for(ev.description)
    if said is None:
        return who, False
    ids, unknown = read_names(said, people)
    titled = who.people and set(who.people) <= set(ids)
    return replace(who, people=ids, unknown=unknown, rest=who.rest if titled else who.title), True


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


def _stay(ev: CalendarEvent, who: Who, place: str, tz: tzinfo) -> Stay | None:
    location = " ".join((ev.location or "").split()) or place
    if not location:
        return None  # Nowhere to be home.
    if isinstance(ev.start, datetime) and isinstance(ev.end, datetime):
        first = ev.start.astimezone(tz).date()
        end = ev.end.astimezone(tz)
        # Every day it touches: a stay ending at midnight is over before that day starts.
        last = end.date() - timedelta(days=1) if end.time() == datetime.min.time() else end.date()
    else:
        assert isinstance(ev.start, date)
        assert isinstance(ev.end, date)
        first, last = ev.start, ev.end - timedelta(days=1)
    return Stay(ev.id, who.people, place, location, first, max(first, last))


def _day_item(ev: CalendarEvent, who: Who) -> DayItem:
    assert isinstance(ev.start, date)
    assert isinstance(ev.end, date)
    last = max(ev.start, ev.end - timedelta(days=1))
    return DayItem(
        ev.id,
        who.title or "Event",
        who.people,
        ev.start,
        last,
        who.cancelled,
        ev.calendar_id,
        human_notes(ev.description),
    )


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
