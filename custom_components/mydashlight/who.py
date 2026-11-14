"""Who an event on the shared family calendar is for, read from the start of its title.

The family's rule: a title starts with the person's name, and " & " (or ", ") joins more
names, so "Ava & Ben Swim" is in both Ava's and Ben's lanes. Each person can have other
names too (such as Mom or Dad for a parent), and a shortcut can stand for all the kids, such
as "AB&C". The kids' initials work as that shortcut without being set up: "AB&C" and
"A, B & C" for Ava, Ben and Cleo.

Only the start of the title counts. A name later on ("Happy hour with Ben") is left alone,
since it's often someone else's event about that person, so the event is for nobody and
whoever shows it says so.

The same names can be written in a "For:" line in the event's notes instead (see
:func:`read_names`), which wins over the title. Pure module, no Home Assistant imports.
"""

from __future__ import annotations

from collections.abc import Iterable, Mapping
from dataclasses import dataclass, field
import re
from typing import Final

from .notes import skip_prefix

_JOIN_RE: Final = re.compile(r"\s*(?:&|,|\+)\s*")
"""What joins one name to the next."""
_AFTER_RE: Final = re.compile(r"^(?:['’]s\b)?\s*(?:[-–—:|]\s*)?")
"""What may follow the names before the rest of the title: a possessive, then a dash or colon."""
_LEAD_RE: Final = re.compile(r"^[^\w]*", re.UNICODE)
"""Emoji, stars and the like before the first name."""


@dataclass(frozen=True, slots=True)
class People:
    """The household, as the title reader needs it.

    ``kids`` and ``parents`` give each person's display name by their id. ``aliases`` gives
    anyone's other names by the same id. ``all_kids`` lists more shortcuts for all the kids,
    besides their initials.
    """

    kids: Mapping[str, str] = field(default_factory=dict)
    parents: Mapping[str, str] = field(default_factory=dict)
    aliases: Mapping[str, Iterable[str]] = field(default_factory=dict)
    all_kids: Iterable[str] = ()

    def labels(self) -> list[tuple[str, tuple[str, ...]]]:
        """Every way of writing someone, with who it means, longest first."""
        out: dict[str, tuple[str, ...]] = {}

        def add(label: str, ids: tuple[str, ...]) -> None:
            key = _key(label)
            if key and ids and key not in out:
                out[key] = ids

        for pid, name in [*self.kids.items(), *self.parents.items()]:
            add(name, (pid,))
        for pid, names in self.aliases.items():
            if pid in self.kids or pid in self.parents:
                for name in names:
                    add(name, (pid,))
        everyone = tuple(self.kids)
        if len(everyone) > 1:
            for shortcut in (*self.all_kids, *initials(self.kids.values())):
                add(shortcut, everyone)
        return sorted(out.items(), key=lambda item: -len(item[0]))


@dataclass(frozen=True, slots=True)
class Who:
    people: tuple[str, ...]
    """Who the event is for, by id, in the order the title names them. Empty for nobody."""
    title: str
    """The title without a leading NO."""
    cancelled: bool = False
    """The title started with NO: they aren't going this time."""
    unknown: str | None = None
    """A word joined to the names that isn't anyone in the family, as in "Ava & Zoe Sleepover"."""
    rest: str = ""
    """The title after the names, as "Lunch: Pizza" in "Ava Lunch: Pizza"."""


def initials(names: Iterable[str]) -> tuple[str, ...]:
    """The kids' initials as a shortcut for all of them: "AB&C" and "A, B & C"."""
    letters = [n.strip()[:1].upper() for n in names if n.strip()]
    if len(letters) < 2:
        return ()
    return ("".join(letters[:-1]) + "&" + letters[-1], ", ".join(letters[:-1]) + " & " + letters[-1])


def read_title(title: str | None, people: People) -> Who:
    """Who an event is for, from the names at the start of its title."""
    plain, cancelled = skip_prefix(title or "")
    text = plain.strip()
    labels = [(_pattern(key), ids) for key, ids in people.labels()]
    pos = _LEAD_RE.match(text).end()  # type: ignore[union-attr]
    found: list[str] = []
    unknown: str | None = None
    rest_at = 0
    while True:
        hit = _match(text, pos, labels)
        if hit is None:
            if found:
                # A join with no name after it: "Ava & Zoe Sleepover".
                word = re.match(r"[\w'’-]+", text[pos:])
                unknown = word.group(0) if word else None
            break
        end, ids = hit
        found.extend(i for i in ids if i not in found)
        rest_at = end
        join = _JOIN_RE.match(text, end)
        if join is None:
            break
        pos = join.end()
    rest = " ".join(text[rest_at:].split()) if found else " ".join(text.split())
    return Who(tuple(found), " ".join(plain.split()), cancelled, unknown, rest)


_NOBODY: Final = frozenset({"", "nobody", "no one", "none", "-"})


def read_names(text: str | None, people: People) -> tuple[tuple[str, ...], str | None]:
    """Who a list of names means, as written in a For line: "Ava & Ben", "Mom, Cleo", "AB&C".

    Returns their ids in the order written, and the first word that isn't anyone in the family
    (None when every name is known). Unlike a title, nothing may follow the names.
    """
    plain = " ".join((text or "").split())
    if plain.casefold() in _NOBODY:
        return (), None
    who = read_title(plain, people)
    if not who.people:
        word = re.match(r"[\w'’-]+", plain)
        return (), word.group(0) if word else plain
    if who.unknown is not None:
        return who.people, who.unknown
    leftover = who.rest.strip(" &,+.")
    word = re.match(r"[\w'’-]+", leftover)
    return who.people, (word.group(0) if word else None) if leftover else None


def names_text(ids: Iterable[str], people: People) -> str:
    """Names for a For line, the way the family writes them: "Ava", "Ava & Ben", "Ava, Ben & Cleo"."""
    known = {**people.kids, **people.parents}
    names = [known.get(i, i) for i in dict.fromkeys(ids)]
    if len(names) < 2:
        return "".join(names)
    return ", ".join(names[:-1]) + " & " + names[-1]


def _key(label: str) -> str:
    """A label with its spacing tidied, for comparing."""
    return " ".join(str(label).split()).casefold()


def _pattern(key: str) -> re.Pattern[str]:
    """A label as a pattern: any case, any spacing around & and commas, then a word break."""
    parts: list[str] = []
    for ch in key:
        if ch.isspace():
            parts.append(r"\s*")
        elif ch in "&,+":
            parts.append(r"\s*" + re.escape(ch) + r"\s*")
        else:
            parts.append(re.escape(ch))
    return re.compile("".join(parts) + r"(?!\w)", re.IGNORECASE)


def _match(
    text: str, pos: int, labels: list[tuple[re.Pattern[str], tuple[str, ...]]]
) -> tuple[int, tuple[str, ...]] | None:
    """The longest label at ``pos``: where it ends, after any possessive or dash, and who it means."""
    best: tuple[int, tuple[str, ...]] | None = None
    for pattern, ids in labels:
        m = pattern.match(text, pos)
        if m and (best is None or m.end() > best[0]):
            best = (m.end(), ids)
    if best is None:
        return None
    after = _AFTER_RE.match(text[best[0] :])
    # A possessive or dash ends the names: "Ben's party", "Sam - dentist".
    tail = after.group(0) if after else ""
    if tail.strip():
        return best[0] + len(tail), best[1]
    return best
