"""A school's lunch menu read from its calendar feed (iCal), copied onto the lunch calendar.

Many school menus are published as a calendar to subscribe to, one all-day event per meal:
"L: Create Your Own Pizza, Parmesan Roasted Broccoli, Diced Pears, Choice of Cold Milk". Each
kid can be given their school's feed. MyDashLight reads it every few hours and keeps a
"Ava Lunch: Create Your Own Pizza" event on the lunch calendar for each day, the rest of the
menu in its notes, so the menu sits with the kid's picks.

Events MyDashLight made from a feed carry a private mark. Only those are changed or removed
when the feed changes: a menu typed by hand, imported, or changed on the Lunch tab is left as
it is.

Pure module, no Home Assistant imports.
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass
from datetime import date
import re
from typing import Final

from .school import MenuChange, SchoolCalendar, day_changes, is_no_school

FEED_NOTE: Final = "From the school's menu feed."

# "B: Waffles" is breakfast; "L: Pizza", "L; Pizza" and "Lunch: Pizza" are lunch.
_MEAL_RE: Final = re.compile(r"^\W*(b|bk|bfast|breakfast|l|lunch)\s*[:;\-–—]\s*(.*)$", re.IGNORECASE | re.DOTALL)
_DATE_RE: Final = re.compile(r"^(\d{4})(\d{2})(\d{2})")


@dataclass(frozen=True, slots=True)
class FeedEvent:
    """One event in a calendar feed."""

    day: date
    title: str
    notes: str


@dataclass(frozen=True, slots=True)
class FeedMenu:
    dish: str
    details: str


def webcal_to_https(url: str) -> str:
    """Calendar apps' webcal:// links are plain https underneath."""
    url = url.strip()
    return "https://" + url[len("webcal://") :] if url.lower().startswith("webcal://") else url


def _unfold(text: str) -> list[str]:
    """The feed's lines, with folded lines (continued after a space or tab) joined back."""
    lines: list[str] = []
    for raw in text.replace("\r\n", "\n").replace("\r", "\n").split("\n"):
        if raw[:1] in (" ", "\t") and lines:
            lines[-1] += raw[1:]
        else:
            lines.append(raw)
    return lines


def _unescape(value: str) -> str:
    out: list[str] = []
    i = 0
    while i < len(value):
        ch = value[i]
        if ch == "\\" and i + 1 < len(value):
            nxt = value[i + 1]
            out.append("\n" if nxt in "nN" else nxt)
            i += 2
            continue
        out.append(ch)
        i += 1
    return "".join(out)


def _day(value: str) -> date | None:
    match = _DATE_RE.match(value.strip())
    if not match:
        return None
    try:
        return date(int(match.group(1)), int(match.group(2)), int(match.group(3)))
    except ValueError:
        return None


def read_feed(text: str) -> list[FeedEvent]:
    """The events in an iCal feed, by the day they start. Not a calendar: an empty list.

    Repeating events and time zones aren't needed for a menu, which is one event per day.
    """
    events: list[FeedEvent] = []
    current: dict[str, str] | None = None
    for line in _unfold(text):
        if line == "BEGIN:VEVENT":
            current = {}
            continue
        if line == "END:VEVENT":
            if current is not None and (day := _day(current.get("DTSTART", ""))) is not None:
                title, notes = current.get("SUMMARY", ""), current.get("DESCRIPTION", "")
                events.append(FeedEvent(day, title.strip(), notes.strip()))
            current = None
            continue
        if current is None or ":" not in line:
            continue
        head, value = line.split(":", 1)
        name = head.split(";", 1)[0].upper()
        if name in ("DTSTART", "SUMMARY", "DESCRIPTION") and name not in current:
            current[name] = value if name == "DTSTART" else _unescape(value)
    return events


def lunch_of_meal(title: str) -> str | None:
    """The lunch in a meal's title: "Pizza, Peas" for "L: Pizza, Peas", the whole title when it
    names no meal, and None for breakfast or a day with no school."""
    text = " ".join(title.split())
    if not text or is_no_school(text):
        return None
    match = _MEAL_RE.match(text)
    if match:
        if match.group(1).casefold().startswith("b"):
            return None
        text = match.group(2).strip()
    return text or None


def feed_menus(events: list[FeedEvent]) -> dict[date, FeedMenu]:
    """Each day's lunch: the first item is the dish, the rest goes in the details.

    "Create Your Own Pizza, Parmesan Roasted Broccoli, Diced Pears" is "Create Your Own Pizza",
    with "Parmesan Roasted Broccoli, Diced Pears" as details. A second lunch on a day (another
    choice) is added to the details.
    """
    out: dict[date, FeedMenu] = {}
    for ev in sorted(events, key=lambda e: e.day):
        lunch = lunch_of_meal(ev.title)
        if lunch is None:
            continue
        dish, _, rest = lunch.partition(",")
        dish, rest = dish.strip(), rest.strip()
        details = "\n".join(part for part in (rest, ev.notes) if part)
        if ev.day in out:
            prev = out[ev.day]
            extra = f"Or: {lunch}"
            out[ev.day] = FeedMenu(prev.dish, f"{prev.details}\n{extra}".strip())
        else:
            out[ev.day] = FeedMenu(dish, details)
    return out


def _with_note(details: str) -> str:
    return f"{details}\n\n{FEED_NOTE}" if details else FEED_NOTE


def feed_changes(
    school: SchoolCalendar, kid: str, menus: Mapping[date, FeedMenu], first: date, last: date
) -> list[MenuChange]:
    """The changes that copy a feed's menus from ``first`` to ``last`` onto ``kid``'s calendar.

    A day with no menu gets one, on the day's lunch event (which keeps the kid's pick). A menu
    copied from the feed before follows it, and goes when the feed drops that day (within the
    days the feed covers). Any other menu is left alone. Days with no school are skipped.
    """
    out: list[MenuChange] = []
    covered = [d for d in menus if first <= d <= last]
    if not covered:
        return out
    since, until = min(covered), max(covered)
    for day in sorted(covered):
        if not school.is_school_day(kid, day):
            continue
        keep = school.lunch_event(kid, day)
        if keep is not None and keep.dish and not keep.from_feed:
            continue
        menu = menus[day]
        out.extend(day_changes(school, kid, day, dish=menu.dish, details=_with_note(menu.details), from_feed=True))
    for k, day in sorted(school.lunches):
        if k != kid or not (since <= day <= until) or day in menus:
            continue
        keep = school.lunch_event(kid, day)
        if keep is not None and keep.dish and keep.from_feed:
            out.extend(day_changes(school, kid, day, dish="", details="", from_feed=False))
    return out
