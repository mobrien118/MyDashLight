"""School days and lunches, read from all-day events as if on each kid's own calendar.

Since 0.19 a kid's events here are their part of the lunch calendar and of the family calendar,
with the kid's name taken off the front of each title (see :func:`.shared.school_lanes`).

* An all-day event with "No School" in its title means no school that day (or those days),
  for that kid. Every other weekday is a school day.
* Each day's lunch is one all-day event for the kid, titled "Lunch: Pizza, side
  salad" when the menu is known, or just "Lunch". Its notes hold the rest of the menu, and the
  kid's pick (Bring or Buy) goes in a short block at the end::

      Or: chef salad. Fruit, milk.

      --- Lunch ---
      Pick: Bring

  A school day with no pick gets the kid's default from the settings (Buy, unless changed).
  Titled just "Lunch", the first line of the notes (above the block) is the dish, if any.
  A .ics file of menus can be imported into the lunch calendar once a month.

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
from .notes import plain_text

Lunch = Literal["bring", "buy"]
DEFAULT_LUNCH: Final[Lunch] = "buy"
PICK_WORDS: Final[dict[Lunch, str]] = {"bring": "Bring", "buy": "Buy"}

_NO_SCHOOL_RE: Final = re.compile(r"\bno[\s-]+school\b", re.IGNORECASE)
_MENU_RE: Final = re.compile(r"^\W*lunch(?:\s*$|\s*[:\u2013\u2014-]\s*(.*)$)", re.IGNORECASE)
MENU_TITLE: Final = "Lunch"
MENU_MARK: Final = "mydashlight_menu"
"""Private event property: "feed" on a menu MyDashLight copied from the kid's menu feed."""
MENU_FROM_FEED: Final = "feed"

PICK_HEADER: Final = "--- Lunch ---"
_PICK_HEADER_RE: Final = re.compile(r"^\s*-{2,}\s*lunch\s*-{2,}\s*$", re.IGNORECASE)
_PICK_LINE_RE: Final = re.compile(r"^\s*(pick|lunch|bring or buy)\s*:\s*(\w+)", re.IGNORECASE)


def _pick_word(value: str) -> Lunch | None:
    word = value.strip().casefold()
    if word.startswith("bring"):
        return "bring"
    if word.startswith("buy"):
        return "buy"
    return None


def split_pick(notes: str) -> tuple[str, Lunch | None]:
    """The notes without the pick block at the end, and the pick in it (or None)."""
    lines = plain_text(notes).split("\n")
    at = next((i for i, line in enumerate(lines) if _PICK_HEADER_RE.match(line)), None)
    if at is None:
        return "\n".join(lines).strip(), None
    pick: Lunch | None = None
    for line in lines[at + 1 :]:
        match = _PICK_LINE_RE.match(line)
        if match and pick is None:
            pick = _pick_word(match.group(2))
    return "\n".join(lines[:at]).strip(), pick


def with_pick(details: str, pick: Lunch | None) -> str:
    """The notes for a day's lunch event: the rest of the menu, then the pick block."""
    details = details.strip()
    if pick is None:
        return details
    block = f"{PICK_HEADER}\nPick: {PICK_WORDS[pick]}"
    return f"{details}\n\n{block}" if details else block


def lunch_event_of(title: str, notes: str = "") -> tuple[str, str, Lunch | None] | None:
    """(dish, the rest of the menu, pick) for a day's lunch event, else None.

    "Lunch: Pizza" has the dish in the title. Titled just "Lunch", the first line of the notes
    above the pick block is the dish, or there's no menu yet ("" for the dish). "Lunch with
    Grandma" isn't a lunch event, and neither is a "Lunch" with nothing in it.
    """
    match = _MENU_RE.match(" ".join(title.split()))
    if not match:
        return None
    dish = " ".join((match.group(1) or "").split())
    details, pick = split_pick(notes)
    if not dish:
        first, _, rest = details.partition("\n")
        dish, details = " ".join(first.split()), rest.strip()
    if not dish and not details and pick is None:
        return None
    return dish, details, pick


def menu_title(dish: str) -> str:
    """The event title for a day's lunch: "Lunch: Pizza", or just "Lunch" with no menu yet."""
    dish = " ".join(dish.split())
    return f"{MENU_TITLE}: {dish}" if dish else MENU_TITLE


def is_no_school(title: str) -> bool:
    return bool(_NO_SCHOOL_RE.search(title))


@dataclass(frozen=True, slots=True)
class LunchPick:
    """A kid's pick for a day, and the event it's saved on."""

    kid: str
    day: date
    lunch: Lunch
    event_id: str
    etag: str
    one_day: bool = True


@dataclass(frozen=True, slots=True)
class MenuDay:
    """One day's lunch event: what the school serves that day ("" for the dish when it isn't
    known yet), and the kid's pick, if any."""

    kid: str
    day: date
    dish: str
    details: str
    """The rest of the menu: the event's notes without the pick block."""
    event_id: str
    etag: str
    from_feed: bool = False
    """MyDashLight copied it from the kid's menu feed, so it follows the feed."""
    pick: Lunch | None = None
    one_day: bool = True
    """It covers just this day. One spanning several days is read but never changed."""


@dataclass(frozen=True, slots=True)
class DayOff:
    """One "No School" event: ``first`` to ``last``, both included."""

    first: date
    last: date
    title: str


@dataclass(slots=True)
class SchoolCalendar:
    """What the kids' events say about school and lunch from ``first`` to ``last``.

    Outside that range every weekday counts as a school day with the default lunch.
    """

    first: date
    last: date
    defaults: Mapping[str, Lunch] = field(default_factory=dict)
    days_off: dict[str, list[DayOff]] = field(default_factory=dict)
    lunches: dict[tuple[str, date], list[MenuDay]] = field(default_factory=dict)
    """Every lunch event for each kid and day. More than one only if one was imported twice."""

    def lunch_event(self, kid: str, day: date) -> MenuDay | None:
        """The day's lunch event: the one with a menu, else the first, else None."""
        found = self.lunches.get((kid, day), [])
        return next((m for m in found if m.dish), found[0] if found else None)

    def menu(self, kid: str, day: date) -> MenuDay | None:
        """The day's lunch event when it has a menu."""
        found = self.lunch_event(kid, day)
        return found if found is not None and found.dish else None

    def default(self, kid: str) -> Lunch:
        return self.defaults.get(kid, DEFAULT_LUNCH)

    def day_off(self, kid: str, day: date) -> DayOff | None:
        return next((d for d in self.days_off.get(kid, ()) if d.first <= day <= d.last), None)

    def is_school_day(self, kid: str, day: date) -> bool:
        return day.weekday() < 5 and self.day_off(kid, day) is None

    def pick(self, kid: str, day: date) -> LunchPick | None:
        """The kid's pick for the day, from its lunch event."""
        for m in self.lunches.get((kid, day), []):
            if m.pick is not None:
                return LunchPick(kid, day, m.pick, m.event_id, m.etag, one_day=m.one_day)
        return None

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
    """The school days, lunch events and picks in each kid's events (by kid calendar id)."""
    out = SchoolCalendar(first=first, last=last, defaults=dict(defaults))
    for kid, kid_events in events.items():
        offs: list[DayOff] = []
        for ev in kid_events:
            if not ev.all_day or not isinstance(ev.start, date) or not isinstance(ev.end, date):
                continue
            # All-day events end the day after their last day.
            ev_last = max(ev.start, ev.end - timedelta(days=1))
            one_day = ev_last == ev.start
            if is_no_school(ev.title):
                offs.append(DayOff(ev.start, ev_last, " ".join(ev.title.split())))
                continue
            found = lunch_event_of(ev.title, ev.description)
            if found is None:
                continue
            dish, details, pick = found
            from_feed = dict(ev.private).get(MENU_MARK) == MENU_FROM_FEED
            day = ev.start
            while day <= ev_last:
                lunch = MenuDay(kid, day, dish, details, ev.id, ev.etag, from_feed, pick, one_day)
                out.lunches.setdefault((kid, day), []).append(lunch)
                day += timedelta(days=1)
        out.days_off[kid] = sorted(offs, key=lambda d: (d.first, d.last))
    return out


@dataclass(frozen=True, slots=True)
class MenuChange:
    """Make, change or remove one lunch event."""

    kid: str
    day: date
    make: tuple[str, str] | None = None
    """(title, notes): make a new event."""
    update: tuple[str, str, str, str] | None = None
    """(event id, etag, title, notes): change an existing event."""
    remove: tuple[str, str] | None = None
    """(event id, etag): remove an event."""
    from_feed: bool | None = None
    """True to mark the event as copied from the menu feed, False to take that away, None to
    leave it as it is. A new event is only marked when True."""


class _Keep:
    """Leave this part of the day as it is."""


KEEP: Final = _Keep()


def day_changes(
    school: SchoolCalendar,
    kid: str,
    day: date,
    *,
    dish: str | _Keep = KEEP,
    details: str | _Keep = KEEP,
    pick: Lunch | _Keep | None = KEEP,
    from_feed: bool | None = None,
) -> list[MenuChange]:
    """The changes that leave ``kid`` with one lunch event on ``day`` holding the menu and the
    pick, with the given parts changed (and the rest as they are).

    A second copy of the day's event is folded in and removed. With no menu and no pick left,
    the day's event goes. An event spanning several days is never changed or removed.
    """
    found = [m for m in school.lunches.get((kid, day), []) if m.one_day]
    keep = next((m for m in found if m.dish), found[0] if found else None)
    current = school.pick(kid, day)
    want_dish = " ".join((keep.dish if keep else "").split()) if isinstance(dish, _Keep) else " ".join(dish.split())
    want_details = (keep.details if keep else "") if isinstance(details, _Keep) else details.strip()
    want_pick = (current.lunch if current else None) if isinstance(pick, _Keep) else pick
    out = [MenuChange(kid, day, remove=(m.event_id, m.etag)) for m in found if m is not keep]
    title, notes = menu_title(want_dish), with_pick(want_details, want_pick)
    if not want_dish and not want_details and want_pick is None:
        if keep is not None:
            out.append(MenuChange(kid, day, remove=(keep.event_id, keep.etag)))
    elif keep is None:
        out.append(MenuChange(kid, day, make=(title, notes), from_feed=from_feed))
    elif (keep.dish, keep.details, keep.pick) != (want_dish, want_details, want_pick) or (
        from_feed is not None and from_feed != keep.from_feed
    ):
        out.append(MenuChange(kid, day, update=(keep.event_id, keep.etag, title, notes), from_feed=from_feed))
    return out


def pick_changes(school: SchoolCalendar, kid: str, days: Iterable[date], lunch: Lunch | None) -> list[MenuChange]:
    """The changes that make ``kid``'s lunch on each of ``days`` ``lunch``, saved on the day's
    lunch event, or take the pick away (back to the default) when ``lunch`` is None.

    Days with no school are skipped.
    """
    out: list[MenuChange] = []
    for day in sorted(set(days)):
        if lunch is not None and not school.is_school_day(kid, day):
            continue
        out.extend(day_changes(school, kid, day, pick=lunch))
    return out


def menu_changes(school: SchoolCalendar, kid: str, day: date, dish: str, details: str = "") -> list[MenuChange]:
    """The changes that make ``kid``'s menu on ``day`` ``dish``, with ``details`` in the notes,
    or take the menu away when ``dish`` is empty. The pick stays. Changed by hand, a menu stops
    following the feed."""
    if not " ".join(dish.split()):
        details = ""
    return day_changes(school, kid, day, dish=dish, details=details, from_feed=False)


def lunch_payload(school: SchoolCalendar, kids: Mapping[str, str], today: date) -> dict[str, Any]:
    """What the kitchen app's Lunch tab and lunch chips need."""
    out_kids: list[dict[str, Any]] = []
    for kid, name in kids.items():
        days = sorted({d for k, d in school.lunches if k == kid})
        picks = {
            d.isoformat(): p.lunch
            for d in days
            if school.is_school_day(kid, d) and (p := school.pick(kid, d)) is not None
        }
        menus = {
            d.isoformat(): {"dish": m.dish, "details": m.details}
            for d in days
            if (m := school.menu(kid, d)) is not None
        }
        out_kids.append(
            {
                "id": kid,
                "name": name,
                "default": school.default(kid),
                "picks": picks,
                "menus": menus,
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
