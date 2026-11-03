"""Saves ride changes into the notes of the kids' Google Calendar events.

Each change reads the event fresh, rewrites only its Rides block, and saves it with the etag
it read. If someone changed the event in the meantime (on a phone, say), Google refuses the
save and the change is applied again on top of their edit.

A change to "every one" of a repeating event goes to the series. Occurrences someone already
changed by themselves keep their own notes in Google, so those in ``also`` (the occurrences
being planned) get the same change too.

Pure module, no Home Assistant imports.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass
from typing import Final

from .google import GoogleCalendarApi, GoogleConflict
from .notes import KEEP, DriverDirectory, Keep, write_notes

TRIES: Final = 3


@dataclass(frozen=True, slots=True)
class RideChange:
    """New values for some of an event's ride lines. ``KEEP`` leaves a line as it is."""

    drop: str | Keep = KEEP
    pick: str | Keep = KEEP
    stay: bool | Keep = KEEP
    along: bool | Keep = KEEP
    arrive_by: int | Keep | None = KEEP
    """Minutes after midnight, or None to go back to the default."""

    def apply(self, description: str, directory: DriverDirectory, event_start: int | None) -> str:
        return write_notes(
            description,
            directory,
            drop=self.drop,
            pick=self.pick,
            stay=self.stay,
            along=self.along,
            arrive_by=self.arrive_by,
            event_start=event_start,
        )


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
) -> int:
    """Save the change, returning how many events were actually written.

    With ``series`` (the repeating event's id), the change goes to the series first, then to
    each of ``also`` that still needs it. Otherwise it goes to ``target`` alone.
    """
    if series is None:
        return int(await _async_save_one(api, directory, target, change))
    written = int(await _async_save_one(api, directory, Target(target.calendar_id, series, target.event_start), change))
    seen = {series}
    for other in (target, *also):
        if other.event_id in seen:
            continue
        seen.add(other.event_id)
        written += await _async_save_one(api, directory, other, change)
    return written


async def _async_save_one(
    api: GoogleCalendarApi, directory: DriverDirectory, target: Target, change: RideChange
) -> bool:
    for attempt in range(TRIES):
        event = await api.async_get_notes(target.calendar_id, target.event_id)
        description = change.apply(event.description, directory, target.event_start)
        if description == event.description:
            return False
        try:
            await api.async_set_notes(target.calendar_id, target.event_id, event.etag, description)
        except GoogleConflict:
            if attempt == TRIES - 1:
                raise
            continue
        return True
    raise AssertionError("unreachable")  # pragma: no cover
