"""Ride details stored in the notes of a kid's Google Calendar event.

The ride lines live in a block at the end of the event's description, after a header line::

    Bring shin guards. Field 3.

    --- Rides ---
    Drop-off: Sam
    Pick-up: the Parkers
    Stay: yes
    Arrive by: 5:15 PM
    Travel: 25 min

Reading:

* Labels match without regard to case, spaces or hyphens (``Drop off``, ``Dropoff`` and
  ``Pickup`` all work). Values are trimmed.
* When the notes have a Rides block, only lines inside it count. Text above it is never read
  as a ride, so a coach's "Pick-up: bring cleats" can't be mistaken for a driver.
* When there is no block, ``Label: value`` lines anywhere count, so a quick line typed on a
  phone still works. The next write moves them into a new block.
* Google stores the description as HTML once someone edits it on the web. Line breaks come
  from ``<br>``, ``<p>``, ``<div>`` and ``<li>``, and other tags are ignored.

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

Field = Literal["drop", "pick", "stay", "arrive_by", "travel"]
FIELDS: Final[tuple[Field, ...]] = ("drop", "pick", "stay", "arrive_by", "travel")

_LABELS: Final[dict[str, Field]] = {
    "dropoff": "drop",
    "pickup": "pick",
    "stay": "stay",
    "arriveby": "arrive_by",
    "travel": "travel",
    "traveltime": "travel",
}
_WRITE_LABELS: Final[dict[Field, str]] = {
    "drop": "Drop-off",
    "pick": "Pick-up",
    "stay": "Stay",
    "arrive_by": "Arrive by",
    "travel": "Travel",
}
_NOT_NEEDED_WORDS: Final = frozenset({"not needed", "none", "no", "n/a", "na", "no ride", "not required"})
_YES: Final = frozenset({"yes", "y", "true", "on", "stay", "staying"})
_NO: Final = frozenset({"no", "n", "false", "off", ""})

_HEADER_RE: Final = re.compile(r"^\s*-{2,}\s*rides\s*-{2,}\s*$", re.IGNORECASE)
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
_BEFORE_RE: Final = re.compile(r"^(\d{1,3})\s*(?:m|mins?|minutes?)?\s*(?:early|before(?: the start)?)$", re.IGNORECASE)
_DURATION_RE: Final = re.compile(
    r"^(?:(\d{1,2})\s*(?:h|hrs?|hours?))?\s*(?:(\d{1,3})\s*(?:m|mins?|minutes?)?)?$", re.IGNORECASE
)


class _Keep:
    def __repr__(self) -> str:
        return "KEEP"


KEEP: Final = _Keep()
"""Leave a field as it is in :func:`write_notes`."""


@dataclass(frozen=True, slots=True)
class DriverDirectory:
    """How driver names in notes map to the parents the planner routes.

    ``names`` gives each routed driver's display name, which is also what gets written.
    ``aliases`` adds other names for them (such as Rae or Mom). ``carpools`` lists known
    carpool drivers, so "the parkers" is shown as "the Parkers".
    """

    names: Mapping[str, str]
    aliases: Mapping[str, Iterable[str]] = field(default_factory=dict)
    carpools: Iterable[str] = ()

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
    stay: bool = False
    arrive_by: int | None = None
    """Minutes after midnight."""
    travel: int | None = None
    """A manual drive time in minutes, overriding the computed one."""
    has_block: bool = False
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


def parse_notes(description: str | None, directory: DriverDirectory, event_start: int | None = None) -> RideNotes:
    """Read the ride settings from an event's description.

    ``event_start`` (minutes after midnight) lets an Arrive by time with no AM or PM, such as
    ``5:15``, be read as the one just before the event, and allows ``15 min early``.
    """
    return _read(_split(description or ""), directory, event_start)


def write_notes(
    description: str | None,
    directory: DriverDirectory,
    *,
    drop: str | _Keep = KEEP,
    pick: str | _Keep = KEEP,
    stay: bool | _Keep = KEEP,
    arrive_by: int | _Keep | None = KEEP,
    travel: int | _Keep | None = KEEP,
    event_start: int | None = None,
) -> str:
    """Return the description with ride settings changed.

    Returns the description unchanged when no value actually changes, so callers can skip
    the write to Google.
    """
    original = description or ""
    doc = _split(original)
    notes = _read(doc, directory, event_start)
    current: dict[Field, object] = {f: getattr(notes, f) for f in FIELDS}
    wanted: dict[Field, object] = {
        "drop": drop,
        "pick": pick,
        "stay": stay,
        "arrive_by": arrive_by,
        "travel": travel,
    }
    changed = {
        f: _norm(f, v, directory)
        for f, v in wanted.items()
        if not isinstance(v, _Keep) and _norm(f, v, directory) != current[f]
    }
    if not changed:
        return original

    found = _locate(doc)
    rendered = {f: _render(f, v, directory) for f, v in changed.items()}

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
                block.append(_ours(text, doc))
        body = _join(doc, doc.lines[: doc.header])
    else:
        # First write: move the loose ride lines that counted into a new block.
        block = []
        for f in FIELDS:
            if f in changed:
                if (text := rendered[f]) is not None:
                    block.append(_ours(text, doc))
            elif found[f] and (text := _render(f, current[f], directory)) is not None:
                block.append(_ours(text, doc))
        remove = {i for f in FIELDS for i in found[f]}
        body = _join(doc, _without(doc, remove))

    return _assemble(body, block, doc)


def parse_clock(value: str, event_start: int | None = None) -> int | None:
    """Minutes after midnight for a time such as ``5:15 PM``, ``5pm`` or ``17:15``."""
    value = value.strip()
    if event_start is not None and (m := _BEFORE_RE.match(value)):
        return event_start - int(m.group(1))
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
        if (fld := _field_of(doc.lines[i].text)) is not None:
            found[fld].append(i)
    return found


def _read(doc: _Doc, directory: DriverDirectory, event_start: int | None) -> RideNotes:
    drivers = {"drop": UNASSIGNED, "pick": UNASSIGNED}
    stay = False
    arrive_by: int | None = None
    travel: int | None = None
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
        if fld in ("drop", "pick"):
            drivers[fld] = directory.resolve(raw)
        elif fld == "stay":
            word = raw.casefold()
            if word in _YES:
                stay = True
            elif word not in _NO:
                problems.append(f"{label}: “{raw}” isn’t yes or no")
        elif fld == "arrive_by":
            if raw and (arrive_by := parse_clock(raw, event_start)) is None:
                problems.append(f"{label}: “{raw}” isn’t a time")
        elif raw and (travel := parse_duration(raw)) is None:
            problems.append(f"{label}: “{raw}” isn’t a number of minutes")
    return RideNotes(
        drop=drivers["drop"],
        pick=drivers["pick"],
        stay=stay,
        arrive_by=arrive_by,
        travel=travel,
        has_block=doc.header is not None,
        problems=tuple(problems),
    )


def _norm(fld: Field, value: object, directory: DriverDirectory) -> object:
    if fld in ("drop", "pick"):
        return directory.resolve(str(value or ""))
    if fld == "stay":
        return bool(value)
    if isinstance(value, (int, float)):
        return int(value)
    return None


def _render(fld: Field, value: object, directory: DriverDirectory) -> str | None:
    """The line for a value, or None when the value is the default and needs no line."""
    label = _WRITE_LABELS[fld]
    if fld in ("drop", "pick"):
        v = str(value)
        return None if v == UNASSIGNED else f"{label}: {directory.display(v)}"
    if fld == "stay":
        return f"{label}: yes" if value else None
    if not isinstance(value, int):
        return None
    if fld == "arrive_by":
        return f"{label}: {fmt12(value)}"
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
