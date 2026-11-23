"""Ride details stored in the notes of a kid's Google Calendar event.

The ride lines live in a block at the end of the event's description, after a header line::

    Bring shin guards. Field 3.

    --- Rides ---
    For: Ava & Ben
    Drop-off: Sam
    Pick-up: the Parkers
    Stay: yes
    Take along: Ben
    Arrive: 15 min early
    Leave: 10 min late
    Travel: 25 min

Reading:

* Labels match without regard to case, spaces or hyphens (``Drop off``, ``Dropoff`` and
  ``Pickup`` all work). Values are trimmed.
* When the notes have a Rides block, only lines inside it count. Text above it is never read
  as a ride, so a coach's "Pick-up: bring cleats" can't be mistaken for a driver.
* When there is no block, ``Label: value`` lines anywhere count, so a quick line typed on a
  phone still works. The next write moves them into a new block. The For line is the
  exception: it only counts inside the block, since copied event details often say things
  like "For: ages 6 to 10".
* ``For`` says who the event is for, by name, in place of the names at the start of the title
  (see :mod:`.shared`). This module keeps it as the text it is; :mod:`.who` reads the names.
* ``Arrive`` and ``Leave`` move when the kid has to be there and when they're picked up (or the
  driver who stayed leaves with them), early or late: ``15 min early``, ``10 min late``,
  ``1 hr early``. That's against the event's own start and end, so it still holds when the
  event moves. A clock time also works (``Arrive by: 3:50``, ``Leave by: 1:15 PM``), as
  MyDashLight wrote them before 0.25: those lines are read as they are and written the new way
  the next time that setting changes.
* Google stores the description as HTML once someone edits it on the web. Line breaks come
  from ``<br>``, ``<p>``, ``<div>`` and ``<li>``, and other tags are ignored.

Other notes MyDashLight keeps go in blocks of their own, also after a header line: a lunch pick
under ``--- Lunch ---`` (see :mod:`.school`). :func:`human_notes` is everything people wrote
above the first such block, for the board to show.

Writing changes only the Rides block (and, the first time, moves loose ride lines into it).
Everything else in the notes stays exactly as it was. A line is removed when its value goes
back to the default, and the block is removed when it has nothing left in it. The result
uses the same form, HTML or plain text, as the description it came from.

Pure module, no Home Assistant imports.
"""

from __future__ import annotations

from collections.abc import Iterable, Mapping
from dataclasses import dataclass, field
import html
import re
from typing import Final, Literal

from .planner import NOT_NEEDED, UNASSIGNED, fmt12

RIDES_HEADER: Final = "--- Rides ---"

Field = Literal[
    "people", "attending", "drop", "pick", "stay", "along", "arrive_by", "leave_by", "travel", "takes", "overnight"
]
FIELDS: Final[tuple[Field, ...]] = (
    "people",
    "attending",
    "drop",
    "pick",
    "stay",
    "along",
    "arrive_by",
    "leave_by",
    "travel",
    "takes",
    "overnight",
)
BLOCK_ONLY: Final[frozenset[Field]] = frozenset({"people", "overnight"})
"""Fields only read inside the Rides block, never from a loose line."""


_LABELS: Final[dict[str, Field]] = {
    "for": "people",
    "whofor": "people",
    "who": "people",
    "attending": "attending",
    "attend": "attending",
    "dropoff": "drop",
    "pickup": "pick",
    "stay": "stay",
    "takealong": "along",
    "along": "along",
    "arrive": "arrive_by",
    "arriveby": "arrive_by",
    "arriveadjust": "arrive_by",
    "leave": "leave_by",
    "leaveby": "leave_by",
    "leaveadjust": "leave_by",
    "pickupadjust": "leave_by",
    "travel": "travel",
    "traveltime": "travel",
    "takes": "takes",
    "duration": "takes",
    "overnight": "overnight",
}
_WRITE_LABELS: Final[dict[Field, str]] = {
    "people": "For",
    "attending": "Attending",
    "drop": "Drop-off",
    "pick": "Pick-up",
    "stay": "Stay",
    "along": "Take along",
    "arrive_by": "Arrive by",
    "leave_by": "Leave by",
    "travel": "Travel",
    "takes": "Takes",
    "overnight": "Overnight",
}
_NOT_NEEDED_WORDS: Final = frozenset({"not needed", "none", "no", "n/a", "na", "no ride", "not required"})
_TBD_WORDS: Final = frozenset({"", "tbd", "?", "nobody yet", "unassigned", "anyone"})
"""What a driver line can start with when it names riders but no driver yet."""
_YES: Final = frozenset({"yes", "y", "true", "on", "stay", "staying"})
_NOBODY: Final = frozenset({"", "none", "no", "nobody", "no one", "n/a", "na"})
_LIST_SPLIT_RE: Final = re.compile(r"\s*(?:,|&|\+|/|\band\b)\s*", re.IGNORECASE)
_NO: Final = frozenset({"no", "n", "false", "off", ""})
_ATTENDING_YES: Final = frozenset({"", "yes", "y", "true", "on", "going", "attending"})
_ATTENDING_NO: Final = frozenset({"no", "n", "false", "off", "not going", "not attending", "skip", "skipping"})

_HEADER_RE: Final = re.compile(r"^\s*-{2,}\s*rides\s*-{2,}\s*$", re.IGNORECASE)
_ANY_HEADER_RE: Final = re.compile(r"^\s*-{2,}\s*(?:rides|lunch|chore)\s*-{2,}\s*$", re.IGNORECASE)
"""The header of any block MyDashLight writes in notes: Rides, Lunch (a pick) or Chore."""
HUMAN_NOTES_MAX: Final = 600
"""The most of an event's own notes the board is sent, in characters."""
_LINE_RE: Final = re.compile(r"^\s*([A-Za-z][A-Za-z \-_]{0,20}?)\s*:\s*(.*?)\s*$")
_HTML_RE: Final = re.compile(r"<(?:br|p|div|span|b|i|u|a|ul|ol|li|strong|em|font)\b[^>]*>", re.IGNORECASE)
_BREAK_RE: Final = re.compile(r"(<br\s*/?>|</?(?:p|div|li|ul|ol)\b[^>]*>)", re.IGNORECASE)
_TAG_RE: Final = re.compile(r"<[^>]*>")
_BR_RE: Final = re.compile(r"<br\s*/?>", re.IGNORECASE)
# Breaks, spaces and empty or unclosed paragraphs at the very end of the notes.
_TRAILING_HTML_GAP: Final = re.compile(
    r"(?:\s|&nbsp;|<br\s*/?>|<(?:p|div)\b[^>]*>(?:\s|&nbsp;|<br\s*/?>)*(?:</(?:p|div)>)?)*\Z",
    re.IGNORECASE,
)
_CLOCK_RE: Final = re.compile(r"^(\d{1,2})(?::(\d{2}))?\s*(?:([ap])\.?\s*m?\.?)?$", re.IGNORECASE)
_OFFSET_RE: Final = re.compile(
    r"^(?:(?P<sign>[-+])\s*(?P<signed>.+?)"
    r"|(?P<amount>.+?)\s+(?P<way>early|before|late|after)(?: the (?:start|end))?)$",
    re.IGNORECASE,
)
_ON_TIME: Final = frozenset({"on time", "0", "0 min", "none"})
_DURATION_RE: Final = re.compile(
    r"^(?:(\d{1,2})\s*(?:h|hrs?|hours?))?\s*(?:(\d{1,3})\s*(?:m|mins?|minutes?)?)?$", re.IGNORECASE
)


class Keep:
    def __repr__(self) -> str:
        return "KEEP"


KEEP: Final = Keep()
"""Leave a field as it is in :func:`write_notes`."""


@dataclass(frozen=True, slots=True)
class DriverDirectory:
    """How names in notes map to the parents the planner routes, and to the kids.

    ``names`` gives each routed driver's display name, which is also what gets written.
    ``aliases`` adds other names for them (such as Rae or Mom). ``carpools`` lists known
    carpool drivers, so "the parkers" is shown as "the Parkers". ``kids`` gives each kid's
    display name by kid id, for the kids taken along.
    """

    names: Mapping[str, str]
    aliases: Mapping[str, Iterable[str]] = field(default_factory=dict)
    carpools: Iterable[str] = ()
    kids: Mapping[str, str] = field(default_factory=dict)

    def kid(self, value: str) -> str | None:
        """The kid id for a kid's name (or id), or None when it isn't one of the kids."""
        key = " ".join(value.split()).casefold()
        for kid, name in self.kids.items():
            if key in (kid.casefold(), " ".join(name.split()).casefold()):
                return kid
        return None

    def rider(self, value: str) -> str | None:
        """Who a name in Take along means: a kid id, a routed driver id (who can ride along to
        the other parent's own event), or None."""
        if (kid := self.kid(value)) is not None:
            return kid
        found = self.resolve(value)
        return found if found in self.names else None

    def resolve(self, value: str) -> str:
        """The driver id, :data:`NOT_NEEDED`, :data:`UNASSIGNED`, or a carpool name."""
        value = " ".join(value.split())
        key = value.casefold()
        if not key:
            return UNASSIGNED
        if key in _NOT_NEEDED_WORDS:
            return NOT_NEEDED
        for driver, name in self.names.items():
            if key in (driver.casefold(), name.casefold()):
                return driver
        for driver, names in self.aliases.items():
            if any(key == " ".join(n.split()).casefold() for n in names):
                return driver
        for carpool in self.carpools:
            if key == " ".join(carpool.split()).casefold():
                return carpool
        return value

    def display(self, value: str) -> str:
        if value == NOT_NEEDED:
            return "Not needed"
        return self.names.get(value, value)


@dataclass(frozen=True, slots=True)
class RideNotes:
    """The ride settings read from an event's notes."""

    drop: str = UNASSIGNED
    pick: str = UNASSIGNED
    attending: bool = True
    """False when the kid isn't going this time, so the event needs no rides."""
    stay: bool = False
    along: tuple[str, ...] = ()
    """Who is taken along: kid ids, and on a parent's own event the other parent's driver id
    too. On a kid's drop-off, the driver can go on to the other kids' drop-offs without coming
    home for them."""
    arrive_by: int | None = None
    """When the kid has to be there, in minutes after midnight: before the start, or after it."""
    leave_by: int | None = None
    """When the kid is picked up instead of at the end, in minutes after midnight: before the end,
    or after it."""
    travel: int | None = None
    """A manual drive time in minutes, overriding the computed one."""
    takes: int | None = None
    """For an errand on a parent's calendar: the minutes it takes, any time in the event."""
    drop_riders: tuple[str, ...] = ()
    """Who rides along on the drop-off, after the driver on its line: kid ids and driver ids."""
    pick_riders: tuple[str, ...] = ()
    """Who rides along on the pick-up, after the driver on its line."""
    people: str | None = None
    """Who the event is for, as the For line says it ("Ava & Ben"), or None with no such line."""
    overnight: bool | None = None
    """Whether the event is a stay away from home, as its Overnight line says, or None to guess."""
    problems: tuple[str, ...] = ()
    """Lines that couldn't be read, worded for people."""


@dataclass(slots=True)
class _Line:
    raw: str
    sep: str
    text: str


@dataclass(slots=True)
class _Doc:
    lines: list[_Line]
    is_html: bool
    newline: str
    header: int | None

    @property
    def scope(self) -> range:
        """The lines that count as ride lines."""
        if self.header is None:
            return range(len(self.lines))
        return range(self.header + 1, len(self.lines))


_SKIP_PREFIX_RE: Final = re.compile(r"^\s*NO(?:\s*[-:–—]\s*|\s+)(?=\S)")


def skip_prefix(title: str) -> tuple[str, bool]:
    """The title without the family's old "NO" prefix for a week they're not going, and
    whether it had one. Only a capital NO followed by a space, dash or colon counts, so
    "No-bake cookies" and "Nora's party" are left alone."""
    m = _SKIP_PREFIX_RE.match(title)
    return (title[m.end() :], True) if m else (title, False)


def parse_notes(
    description: str | None,
    directory: DriverDirectory,
    event_start: int | None = None,
    event_end: int | None = None,
) -> RideNotes:
    """Read the ride settings from an event's description.

    ``event_start`` and ``event_end`` (minutes after midnight) read Arrive and Leave lines such as
    ``15 min early`` against the event, and a clock time with no AM or PM, such as ``5:15``, as
    the reading nearest the event.
    """
    return _read(_split(description or ""), directory, event_start, event_end)


def read_for(description: str | None) -> str | None:
    """The For line's text in the Rides block ("Ava & Ben"), or None when there isn't one."""
    return _block_line(description, "people")


def read_overnight(description: str | None) -> bool | None:
    """What the Overnight line in the Rides block says: a stay away from home or not, or None
    when there's no such line (or it isn't yes or no), so the board guesses."""
    word = (_block_line(description, "overnight") or "").casefold()
    return True if word in _YES else False if word in _NO and word else None


def _block_line(description: str | None, fld: Field) -> str | None:
    doc = _split(description or "")
    found = _locate(doc)[fld]
    if not found:
        return None
    m = _LINE_RE.match(doc.lines[found[-1]].text)
    assert m is not None
    return " ".join(m.group(2).split()) or None


def human_notes(description: str | None) -> str:
    """What people wrote in an event's notes, as plain text, without what MyDashLight keeps there.

    That's everything above the first MyDashLight block (Rides, Lunch or Chore). With no Rides
    block, loose ride lines (``Drop-off: Sam``) are MyDashLight's too, since they're read as
    rides, so they're left out wherever they are. Blank lines at either end go, runs of them
    become one, and very long notes are cut at a word with "…". "" when nothing is left.
    """
    doc = _split(description or "")
    end = next((i for i, line in enumerate(doc.lines) if _ANY_HEADER_RE.match(line.text)), len(doc.lines))
    loose = {i for found in _locate(doc).values() for i in found} if doc.header is None else set()
    kept: list[str] = []
    for i in range(end):
        if i in loose:
            continue
        line = doc.lines[i]
        # In HTML, only a <br> makes an empty line: "</p><p>" is just a paragraph break.
        after_br = i > 0 and _BR_RE.fullmatch(doc.lines[i - 1].sep)
        if doc.is_html and not line.raw.strip() and not _BR_RE.fullmatch(line.sep) and not after_br:
            continue
        text = line.text.replace("\xa0", " ").rstrip()
        if text.strip() or (kept and kept[-1]):
            kept.append(text)
    out = "\n".join(kept).strip()
    if len(out) > HUMAN_NOTES_MAX:
        cut = out[: HUMAN_NOTES_MAX - 1]
        space = max(cut.rfind(" "), cut.rfind("\n"))
        out = (cut[:space] if space > HUMAN_NOTES_MAX // 2 else cut).rstrip(" \n,;:-") + "…"
    return out


def write_notes(
    description: str | None,
    directory: DriverDirectory,
    *,
    drop: str | Keep = KEEP,
    pick: str | Keep = KEEP,
    stay: bool | Keep = KEEP,
    along: Iterable[str] | Keep = KEEP,
    arrive_by: int | Keep | None = KEEP,
    leave_by: int | Keep | None = KEEP,
    travel: int | Keep | None = KEEP,
    attending: bool | Keep = KEEP,
    takes: int | Keep | None = KEEP,
    drop_riders: Iterable[str] | Keep = KEEP,
    pick_riders: Iterable[str] | Keep = KEEP,
    people: str | Keep | None = KEEP,
    overnight: bool | Keep | None = KEEP,
    event_start: int | None = None,
    event_end: int | None = None,
) -> str:
    """Return the description with ride settings changed.

    A driver line holds the driver, then whoever rides along on that side, such as
    "Drop-off: Sam, Ben". Riders with no driver yet are written after "TBD".

    ``people`` is the For line's text, already worded ("Ava & Ben"); None takes the line away.

    ``arrive_by`` and ``leave_by`` are clock times. With ``event_start`` and ``event_end`` known
    they're written against the event ("Arrive: 15 min early", "Leave: 10 min late"), and the
    line goes when the time is the event's own.

    Returns the description unchanged when no value actually changes, so callers can skip
    the write to Google.
    """
    original = description or ""
    doc = _split(original)
    notes = _read(doc, directory, event_start, event_end)
    current: dict[Field, object] = {f: getattr(notes, f) for f in FIELDS}
    current["drop"] = (notes.drop, notes.drop_riders)
    current["pick"] = (notes.pick, notes.pick_riders)
    wanted: dict[Field, object] = {
        "people": people,
        "attending": attending,
        "drop": _side(drop, drop_riders, notes.drop, notes.drop_riders),
        "pick": _side(pick, pick_riders, notes.pick, notes.pick_riders),
        "stay": stay,
        "along": along,
        "arrive_by": arrive_by,
        "leave_by": leave_by,
        "travel": travel,
        "takes": takes,
        "overnight": overnight,
    }
    changed = {
        f: _norm(f, v, directory)
        for f, v in wanted.items()
        if not isinstance(v, Keep) and _norm(f, v, directory) != current[f]
    }
    if not changed:
        return original

    found = _locate(doc)
    ends = (event_start, event_end)
    rendered = {f: _render(f, v, directory, ends) for f, v in changed.items()}

    if doc.header is not None:
        # Rebuild the block in place: keep its order and any lines we don't recognise.
        block: list[str] = []
        placed: set[Field] = set()
        for i in doc.scope:
            line = doc.lines[i]
            if not line.text.strip():
                continue
            fld = _field_of(line.text)
            if fld is None or fld not in changed:
                block.append(_own(line, doc))
            elif fld not in placed:
                placed.add(fld)
                if (text := rendered[fld]) is not None:
                    block.append(_ours(text, doc))
        for f in FIELDS:
            if f in changed and f not in placed and (text := rendered[f]) is not None:
                # Who it's for heads the block; other new lines go at its end.
                block.insert(0 if f == "people" else len(block), _ours(text, doc))
        body = _join(doc, doc.lines[: doc.header])
    else:
        # First write: move the loose ride lines that counted into a new block.
        block = []
        for f in FIELDS:
            if f in changed:
                if (text := rendered[f]) is not None:
                    block.append(_ours(text, doc))
            elif found[f] and (text := _render(f, current[f], directory, ends)) is not None:
                block.append(_ours(text, doc))
        remove = {i for f in FIELDS for i in found[f]}
        body = _join(doc, _without(doc, remove))

    return _assemble(body, block, doc)


def parse_clock(value: str, event_start: int | None = None) -> int | None:
    """Minutes after midnight for a time such as ``5:15 PM``, ``5pm`` or ``17:15``."""
    value = value.strip()
    if event_start is not None and (off := parse_offset(value)) is not None:
        return event_start + off
    m = _CLOCK_RE.match(value)
    if not m:
        return None
    hour, minute = int(m.group(1)), int(m.group(2) or 0)
    if minute > 59:
        return None
    if m.group(3):
        if not 1 <= hour <= 12:
            return None
        hour %= 12
        if m.group(3).lower() == "p":
            hour += 12
        return hour * 60 + minute
    if m.group(2) is None or hour > 23:
        return None
    t = hour * 60 + minute
    if event_start is not None and 1 <= hour <= 12:
        # No AM or PM: take the reading that falls closest before the event.
        readings = [t % 720, t % 720 + 720]
        before = [r for r in readings if r <= event_start]
        return max(before) if before else min(readings)
    return t


def parse_leave_clock(value: str, event_start: int | None = None) -> int | None:
    """Like :func:`parse_clock`, for a Leave by time: with no AM or PM, such as ``1:15``, it's
    the first reading at or after the event's start (``event_start``), since it's during it."""
    m = _CLOCK_RE.match(value.strip())
    if m and not m.group(3) and m.group(2) is not None and event_start is not None and 1 <= int(m.group(1)) <= 12:
        if int(m.group(2)) > 59:
            return None
        t = int(m.group(1)) * 60 + int(m.group(2))
        readings = [t % 720, t % 720 + 720]
        after = [r for r in readings if r >= event_start]
        return min(after) if after else max(readings)
    return parse_clock(value)


def parse_offset(value: str) -> int | None:
    """Signed minutes for how early or late, such as ``15 min early`` (-15), ``10 min late``
    (10), ``1 hr before``, ``-15``, ``+10`` or ``on time`` (0). None when it isn't one."""
    value = " ".join(value.replace("−", "-").split()).casefold()
    if value in _ON_TIME:
        return 0
    m = _OFFSET_RE.match(value)
    if not m:
        return None
    if m.group("sign"):
        n = parse_duration(m.group("signed"))
        return None if n is None else (-n if m.group("sign") == "-" else n)
    n = parse_duration(m.group("amount"))
    return None if n is None else (-n if m.group("way") in ("early", "before") else n)


def offset_text(minutes: int) -> str:
    """How early or late, such as ``15 min early``, ``1 hr 10 min late`` or ``on time``."""
    if not minutes:
        return "on time"
    h, m = divmod(abs(minutes), 60)
    amount = " ".join([*([f"{h} hr"] if h else []), *([f"{m} min"] if m else [])])
    return f"{amount} {'early' if minutes < 0 else 'late'}"


def parse_duration(value: str) -> int | None:
    """Minutes for a duration such as ``25 min``, ``25``, ``1 hr`` or ``1h 10m``."""
    m = _DURATION_RE.match(value.strip())
    if not m or (m.group(1) is None and m.group(2) is None):
        return None
    return int(m.group(1) or 0) * 60 + int(m.group(2) or 0)


def _split(description: str) -> _Doc:
    is_html = bool(_HTML_RE.search(description))
    newline = "\r\n" if "\r\n" in description else "\n"
    lines: list[_Line] = []
    if is_html:
        tokens = _BREAK_RE.split(description)
        for i in range(0, len(tokens), 2):
            raw = tokens[i]
            sep = tokens[i + 1] if i + 1 < len(tokens) else ""
            lines.append(_Line(raw, sep, _html_text(raw)))
    else:
        parts = description.split(newline)
        for i, part in enumerate(parts):
            lines.append(_Line(part, newline if i < len(parts) - 1 else "", part))
    header = None
    for i, line in enumerate(lines):
        if _HEADER_RE.match(line.text):
            header = i
    return _Doc(lines, is_html, newline, header)


def plain_text(description: str) -> str:
    """Notes as plain text: Google keeps them as HTML once someone edits them on the web."""
    if _HTML_RE.search(description):
        description = html.unescape(_TAG_RE.sub("", _BREAK_RE.sub("\n", description))).replace("\xa0", " ")
    return description.replace("\r\n", "\n")


def _html_text(raw: str) -> str:
    text = html.unescape(_TAG_RE.sub("", raw)).replace("\xa0", " ")
    return " ".join(text.split("\n")).strip()


def _field_of(text: str) -> Field | None:
    m = _LINE_RE.match(text)
    if not m:
        return None
    return _LABELS.get(re.sub(r"[\s\-_]", "", m.group(1)).lower())


def _locate(doc: _Doc) -> dict[Field, list[int]]:
    found: dict[Field, list[int]] = {f: [] for f in FIELDS}
    for i in doc.scope:
        if (fld := _field_of(doc.lines[i].text)) is not None and (doc.header is not None or fld not in BLOCK_ONLY):
            found[fld].append(i)
    return found


def _read(doc: _Doc, directory: DriverDirectory, event_start: int | None, event_end: int | None = None) -> RideNotes:
    drivers = {"drop": UNASSIGNED, "pick": UNASSIGNED}
    riders: dict[str, list[str]] = {"drop": [], "pick": []}
    attending = True
    stay = False
    along: list[str] = []
    arrive_by: int | None = None
    leave_by: int | None = None
    travel: int | None = None
    takes: int | None = None
    people: str | None = None
    overnight: bool | None = None
    problems: list[str] = []
    found = _locate(doc)
    for fld in FIELDS:
        if not found[fld]:
            continue
        # The last line for a field wins: it's usually the one typed most recently.
        m = _LINE_RE.match(doc.lines[found[fld][-1]].text)
        assert m is not None
        raw = m.group(2)
        label = _WRITE_LABELS[fld]
        if fld == "people":
            people = " ".join(raw.split()) or None
        elif fld in ("drop", "pick"):
            first, *rest = raw.split(",") if "," in raw else [raw]
            drivers[fld] = UNASSIGNED if rest and first.strip().casefold() in _TBD_WORDS else directory.resolve(first)
            for name in filter(None, (r.strip() for r in rest)):
                if (who := directory.rider(name)) is None:
                    problems.append(f"{label}: “{name}” isn’t one of the family")
                elif who != drivers[fld] and who not in riders[fld]:
                    riders[fld].append(who)
        elif fld == "attending":
            word = " ".join(raw.split()).casefold()
            if word in _ATTENDING_NO:
                attending = False
            elif word not in _ATTENDING_YES:
                problems.append(f"{label}: “{raw}” isn’t yes or no")
        elif fld == "along":
            if raw.casefold() not in _NOBODY:
                for name in filter(None, _LIST_SPLIT_RE.split(raw)):
                    if (kid := directory.rider(name)) is None:
                        problems.append(f"{label}: “{name}” isn’t one of the family")
                    elif kid not in along:
                        along.append(kid)
        elif fld == "overnight":
            word = raw.casefold()
            if word in _YES:
                overnight = True
            elif word in _NO and word:
                overnight = False
            elif word:
                problems.append(f"{label}: “{raw}” isn’t yes or no")
        elif fld == "stay":
            word = raw.casefold()
            if word in _YES:
                stay = True
            elif word not in _NO:
                problems.append(f"{label}: “{raw}” isn’t yes or no")
        elif fld == "arrive_by":
            if raw and (arrive_by := _when(raw, event_start, parse_clock(raw, event_start))) is None:
                problems.append(f"Arrive: “{raw}” isn’t a time, or minutes early or late")
        elif fld == "leave_by":
            if raw and (leave_by := _when(raw, event_end, parse_leave_clock(raw, event_start))) is None:
                problems.append(f"Leave: “{raw}” isn’t a time, or minutes early or late")
        elif fld == "takes":
            if raw and not (takes := parse_duration(raw)):
                takes = None
                problems.append(f"{label}: “{raw}” isn’t a number of minutes")
        elif raw and (travel := parse_duration(raw)) is None:
            problems.append(f"{label}: “{raw}” isn’t a number of minutes")
    return RideNotes(
        drop=drivers["drop"],
        pick=drivers["pick"],
        drop_riders=tuple(riders["drop"]),
        pick_riders=tuple(riders["pick"]),
        attending=attending,
        stay=stay,
        along=tuple(along),
        arrive_by=arrive_by,
        leave_by=leave_by,
        travel=travel,
        takes=takes,
        people=people,
        overnight=overnight,
        problems=tuple(problems),
    )


def _when(raw: str, base: int | None, clock: int | None) -> int | None:
    """An Arrive or Leave line's clock time: minutes early or late against ``base`` (the event's
    start or end), or else a clock time."""
    off = parse_offset(raw)
    if off is not None and base is not None:
        return base + off
    return clock


def _side(driver: str | Keep, riders: Iterable[str] | Keep, now_driver: str, now_riders: tuple[str, ...]) -> object:
    """A driver line's wanted value, as (driver, riders), or KEEP when neither changes."""
    if isinstance(driver, Keep) and isinstance(riders, Keep):
        return KEEP
    return (
        now_driver if isinstance(driver, Keep) else driver,
        now_riders if isinstance(riders, Keep) else tuple(riders),
    )


def _norm(fld: Field, value: object, directory: DriverDirectory) -> object:
    if fld == "people":
        return None if value is None else (" ".join(str(value).split()) or None)
    if fld == "overnight":
        return None if value is None else bool(value)
    if fld in ("drop", "pick"):
        assert isinstance(value, tuple)
        driver = directory.resolve(str(value[0] or ""))
        found = (directory.rider(str(v)) for v in value[1])
        return (driver, tuple(dict.fromkeys(r for r in found if r is not None and r != driver)))
    if fld in ("stay", "attending"):
        return bool(value)
    if fld == "along":
        names = [value] if isinstance(value, str) else list(value) if isinstance(value, Iterable) else []
        kids = [directory.rider(str(v)) for v in names]
        return tuple(dict.fromkeys(k for k in kids if k is not None))
    if isinstance(value, (int, float)):
        return int(value)
    return None


def _render(
    fld: Field, value: object, directory: DriverDirectory, ends: tuple[int | None, int | None] = (None, None)
) -> str | None:
    """The line for a value, or None when the value is the default and needs no line."""
    label = _WRITE_LABELS[fld]
    if fld == "people":
        return f"{label}: {value}" if value else None
    if fld in ("drop", "pick"):
        assert isinstance(value, tuple)
        driver, riders = str(value[0]), value[1]
        names = [directory.kids.get(r) or directory.names.get(r, r) for r in riders]
        if driver == UNASSIGNED:
            return f"{label}: {', '.join(['TBD', *names])}" if names else None
        return f"{label}: {', '.join([directory.display(driver), *names])}"
    if fld == "stay":
        return f"{label}: yes" if value else None
    if fld == "overnight":
        return None if value is None else f"{label}: {'yes' if value else 'no'}"
    if fld == "attending":
        return None if value else f"{label}: no"
    if fld == "along":
        assert isinstance(value, tuple)
        kids = (directory.kids.get(k) or directory.names.get(k, k) for k in value)
        return f"{label}: {', '.join(kids)}" if value else None
    if not isinstance(value, int):
        return None
    if fld in ("arrive_by", "leave_by"):
        base = ends[0] if fld == "arrive_by" else ends[1]
        if base is None:
            # The event's time isn't known here: a clock time, as before.
            return f"{label}: {fmt12(value)}"
        word = "Arrive" if fld == "arrive_by" else "Leave"
        return f"{word}: {offset_text(value - base)}" if value != base else None
    return f"{label}: {value} min"


def _ours(text: str, doc: _Doc) -> str:
    return html.escape(text, quote=False) if doc.is_html else text


def _own(line: _Line, doc: _Doc) -> str:
    return line.raw.strip() if doc.is_html else line.raw


def _without(doc: _Doc, remove: set[int]) -> list[_Line]:
    kept: list[_Line] = []
    for i, line in enumerate(doc.lines):
        if i not in remove:
            kept.append(line)
        elif not doc.is_html or _BR_RE.fullmatch(line.sep):
            # The line and its break both go: "a<br>Drop-off: Sam<br>b" becomes "a<br>b".
            continue
        elif kept and kept[-1] is doc.lines[i - 1] and not kept[-1].raw.strip() and _pair(kept[-1].sep, line.sep):
            # A paragraph of its own: drop the whole <p>Drop-off: Sam</p>.
            kept[-1] = _Line("", "", "")
        else:
            # Text right before the paragraph: keep its tags so the lines stay apart.
            kept.append(_Line("", line.sep, ""))
    if not doc.is_html and kept:
        kept[-1] = _Line(kept[-1].raw, "", kept[-1].text)
    return kept


def _pair(opening: str, closing: str) -> bool:
    """Whether two break tags open and close the same element, such as <p ...> and </p>."""
    m = re.fullmatch(r"<(p|div|li)\b[^>]*>", opening, re.IGNORECASE)
    return m is not None and closing.lower().replace(" ", "") == f"</{m.group(1).lower()}>"


def _join(doc: _Doc, lines: list[_Line]) -> str:
    body = "".join(line.raw + line.sep for line in lines)
    if doc.is_html:
        return _TRAILING_HTML_GAP.sub("", body)
    return body.rstrip()


def _assemble(body: str, block: list[str], doc: _Doc) -> str:
    if not block:
        return body
    if doc.is_html:
        rides = "<br>".join([html.escape(RIDES_HEADER, quote=False), *block])
        return f"{body}<br><br>{rides}" if body else rides
    rides = doc.newline.join([RIDES_HEADER, *block])
    return f"{body}{doc.newline}{doc.newline}{rides}" if body else rides
