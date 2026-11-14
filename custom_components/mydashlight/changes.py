"""Saves ride changes into the notes of the kids' Google Calendar events.

Each change reads the event fresh, rewrites only its Rides block, and saves it with the etag
it read. If someone changed the event in the meantime (on a phone, say), Google refuses the
save and the change is applied again on top of their edit.

A change to "every one" of a repeating event goes to the series. Occurrences someone already
changed by themselves keep their own notes in Google, so those in ``also`` (the occurrences
being planned) get the same change too, except on a line that occurrence was given by hand: one
that differed from the series before the change. Those stay as they were.

Pure module, no Home Assistant imports.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass, replace
from typing import Any, Final

from .google import EventNotes, GoogleCalendarApi, GoogleConflict
from .notes import KEEP, DriverDirectory, Keep, RideNotes, parse_notes, skip_prefix, write_notes

TRIES: Final = 3


@dataclass(frozen=True, slots=True)
class RideChange:
    """New values for some of an event's ride lines. ``KEEP`` leaves a line as it is."""

    drop: str | Keep = KEEP
    pick: str | Keep = KEEP
    stay: bool | Keep = KEEP
    along: tuple[str, ...] | Keep = KEEP
    """Who is taken along, by name or id: kids, or on a parent's own event the other parent
    too. Empty takes nobody."""
    arrive_by: int | Keep | None = KEEP
    """Minutes after midnight, or None to go back to the default."""
    attending: bool | Keep = KEEP
    """False when the kid isn't going. True also takes the old "NO" prefix off the title."""
    drop_riders: tuple[str, ...] | Keep = KEEP
    """Who rides along on the drop-off, written after the driver on its line."""
    takes: int | Keep | None = KEEP
    """For a parent's errand: the minutes it takes, or None for an event at a set time."""
    pick_riders: tuple[str, ...] | Keep = KEEP
    """Who rides along on the pick-up."""
    leave_by: int | Keep | None = KEEP
    """When the kid has to leave, if before the end: minutes after midnight, or None for the end."""
    people: str | Keep | None = KEEP
    """Who the event is for, worded for the For line ("Ava & Ben"), or None to go back to the
    names in the title."""

    @property
    def rides(self) -> bool:
        """Whether this changes any ride line, as opposed to only whether the kid is going."""
        return any(
            not isinstance(v, Keep)
            for v in (
                self.drop,
                self.pick,
                self.stay,
                self.along,
                self.arrive_by,
                self.drop_riders,
                self.pick_riders,
                self.takes,
                self.leave_by,
            )
        )

    def unless_set_by_hand(self, series: _Notes, own: _Notes) -> RideChange:
        """This change, leaving out the lines where ``own`` (an occurrence) already differed
        from ``series`` (the series it belongs to) before the change."""
        kept: dict[str, Any] = {}
        for name in _LINES:
            if not isinstance(getattr(self, name), Keep) and not _same(name, series, own):
                kept[name] = KEEP
        return replace(self, **kept) if kept else self

    @property
    def empty(self) -> bool:
        return not self.rides and isinstance(self.attending, Keep) and isinstance(self.people, Keep)

    def apply(self, description: str, directory: DriverDirectory, event_start: int | None) -> str:
        return write_notes(
            description,
            directory,
            attending=self.attending,
            drop=self.drop,
            pick=self.pick,
            stay=self.stay,
            along=self.along,
            arrive_by=self.arrive_by,
            leave_by=self.leave_by,
            drop_riders=self.drop_riders,
            pick_riders=self.pick_riders,
            takes=self.takes,
            people=self.people,
            event_start=event_start,
        )


_LINES: Final = (
    "drop",
    "pick",
    "stay",
    "along",
    "arrive_by",
    "leave_by",
    "attending",
    "drop_riders",
    "pick_riders",
    "takes",
    "people",
)


@dataclass(frozen=True, slots=True)
class _Notes:
    """An event's ride lines as they were before a change, to tell the ones set by hand."""

    rides: RideNotes
    start: int | None
    skipped: bool
    """Whether the title has the old "NO" prefix."""


def _same(name: str, a: _Notes, b: _Notes) -> bool:
    if name == "attending":
        return (a.rides.attending and not a.skipped) == (b.rides.attending and not b.skipped)
    x, y = getattr(a.rides, name), getattr(b.rides, name)
    if name in ("arrive_by", "leave_by") and x is not None and y is not None and x != y:
        # "15 min early" reads as a different clock time on an occurrence moved to another time.
        return a.start is not None and b.start is not None and x - a.start == y - b.start
    return bool(x == y)


@dataclass(frozen=True, slots=True)
class Target:
    """An event to change: its calendar, its Google id, and its start for reading times."""

    calendar_id: str
    event_id: str
    event_start: int | None = None


async def async_save(
    api: GoogleCalendarApi,
    directory: DriverDirectory,
    target: Target,
    change: RideChange,
    *,
    series: str | None = None,
    also: Iterable[Target] = (),
    saved: list[tuple[str, EventNotes]] | None = None,
) -> int:
    """Save the change, returning how many events were actually written.

    With ``series`` (the repeating event's id), the change goes to the series first, then to
    each of ``also`` that still needs it. Otherwise it goes to ``target`` alone. Each event
    written is added to ``saved`` (its calendar, and its notes as Google saved them).
    """
    out = saved if saved is not None else []

    async def save(t: Target, c: RideChange) -> int:
        notes = await _async_save_one(api, directory, t, c)
        if notes is None:
            return 0
        out.append((t.calendar_id, notes))
        return 1

    if series is None:
        return await save(target, change)
    whole = Target(target.calendar_id, series, target.event_start)
    others = {o.event_id: o for o in also if o.event_id not in (series, target.event_id)}
    # Read before writing the series: Google can carry the series' new notes onto occurrences.
    before = await _async_notes(api, directory, whole)
    own = {event_id: await _async_notes(api, directory, o) for event_id, o in others.items()}
    written = await save(whole, change)
    if target.event_id != series:
        written += await save(target, change)
    for event_id, other in others.items():
        theirs = change.unless_set_by_hand(before, own[event_id])
        if not theirs.empty:
            written += await save(other, theirs)
    return written


async def _async_notes(api: GoogleCalendarApi, directory: DriverDirectory, target: Target) -> _Notes:
    event = await api.async_get_notes(target.calendar_id, target.event_id)
    return _Notes(
        parse_notes(event.description, directory, target.event_start),
        target.event_start,
        skip_prefix(event.title)[1],
    )


async def _async_save_one(
    api: GoogleCalendarApi, directory: DriverDirectory, target: Target, change: RideChange
) -> EventNotes | None:
    """Write the change to one event, returning its notes as saved, or None when it already
    had them."""
    for attempt in range(TRIES):
        event = await api.async_get_notes(target.calendar_id, target.event_id)
        description = change.apply(event.description, directory, target.event_start)
        title, prefixed = skip_prefix(event.title)
        new_title = title if change.attending is True and prefixed else None
        if description == event.description and new_title is None:
            return None
        try:
            return await api.async_set_notes(target.calendar_id, target.event_id, event.etag, description, new_title)
        except GoogleConflict:
            if attempt == TRIES - 1:
                raise
            continue
    raise AssertionError("unreachable")  # pragma: no cover
