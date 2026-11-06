"""What to remind the parents about, worked out from the plan.

Two kinds:

* **Leave reminders.** A set time before each drive leaves (15 minutes unless the options say
  otherwise). Leave time is worked back from when the kid has to be there and the drive, so
  the reminder moves when the plan or the traffic does.
* **No-driver alerts.** A ride in the next few hours (six unless the options say otherwise)
  that nobody is driving yet.

Pure module, no Home Assistant imports. Times in the plan are wall-clock minutes after
midnight on their day, in the household's time zone.
"""

from __future__ import annotations

from collections.abc import Collection, Iterable, Iterator, Mapping, Sequence
from dataclasses import dataclass
from datetime import date, datetime, time, timedelta, tzinfo
import math
from typing import Any, Final

from .google import REMINDER_MARK
from .planner import UNASSIGNED, fmt, fmt12
from .week import DayInput

NO_DRIVER_AHEAD: Final = timedelta(hours=6)
"""How far ahead a ride with no driver is worth an alert, unless the options say otherwise.
Nobody plans much further out."""
MAX_REMINDER: Final = 40320
"""Google's longest reminder: four weeks."""
NO_DRIVER_LINES: Final = 8
"""Rides listed in one no-driver alert before it says how many more there are."""


@dataclass(frozen=True, slots=True)
class LeaveReminder:
    """A reminder to leave for one drive."""

    who: str
    """A driver id or a kid's calendar id."""
    key: str
    """Stays the same while the drive does, even when its times move."""
    leave: datetime
    at: datetime
    title: str
    message: str
    target: str | None
    """The plan id of the first event the drive is for."""


@dataclass(frozen=True, slots=True)
class MissingRide:
    """A drop-off or pick-up nobody is driving yet."""

    key: str
    when: datetime
    text: str


def at_minutes(day: date, minutes: float, tz: tzinfo) -> datetime:
    """A wall-clock time on ``day``, ``minutes`` after midnight (may run into the next day)."""
    whole = math.floor(minutes + 0.5)
    days, rest = divmod(whole, 1440)
    return datetime.combine(day + timedelta(days=days), time(rest // 60, rest % 60), tz)


def driver_outings(day: Mapping[str, Any], driver: str) -> Iterator[tuple[str, Mapping[str, Any]]]:
    """Each of a driver's outings on a day, with a key that stays the same while the drive does."""
    seen: dict[str, int] = {}
    for o in day["drivers"][driver]["outings"]:
        base = f"{day['date']}|{driver}|{o.get('target') or ''}"
        n = seen.get(base, 0)
        seen[base] = n + 1
        yield f"{base}|{n}", o


def leave_reminders(
    days: Iterable[Mapping[str, Any]],
    drivers: Sequence[str],
    recipients: Collection[str],
    before: int,
    tz: tzinfo,
) -> list[LeaveReminder]:
    """A reminder ``before`` minutes before every drive leaves, for each of ``recipients``.

    A recipient is a driver id (the driver's reminder says where to go) or a kid's calendar
    id (the kid's says when they leave, or when they're picked up). The other parent riding
    along to a driver's own event is told when they leave too. A drive that's only the driver
    going to their own events gets no reminder.
    """
    out: list[LeaveReminder] = []
    for day in days:
        d = date.fromisoformat(day["date"])
        for driver in drivers:
            for key, o in driver_outings(day, driver):
                target = o.get("target")
                leave = at_minutes(d, o["start"], tz)
                at = leave - timedelta(minutes=before)
                title = o.get("title") or "Drive"
                if driver in recipients and not o.get("solo"):
                    out.append(
                        LeaveReminder(
                            who=driver,
                            key=key,
                            leave=leave,
                            at=at,
                            title=f"Leave at {fmt12(o['start'])}: {title}",
                            message="\n".join([o.get("lead") or f"Leave {fmt(o['start'])}", *o.get("lines", ())]),
                            target=target,
                        )
                    )
                riders = {**(o.get("riders") or {}), **(o.get("parents") or {})}
                for kid, text in riders.items():
                    if kid in recipients:
                        out.append(
                            LeaveReminder(
                                who=kid,
                                key=f"{key}|{kid}",
                                leave=leave,
                                at=at,
                                title=text,
                                message=title,
                                target=target,
                            )
                        )
    return out


def calendar_reminders(
    days: Iterable[Mapping[str, Any]], drivers: Sequence[str], before: int
) -> dict[tuple[str, str], int]:
    """The reminder to save on each drive's first drop-off event, in minutes before it starts.

    By the day and the event's plan id. The reminder goes off ``before`` minutes before the drive leaves.
    Google only reminds before an event starts, so pick-ups get none.
    """
    out: dict[tuple[str, str], int] = {}
    for day in days:
        starts = {e["id"]: e["start"] for e in day["events"] if "drop" in e["sides"]}
        for driver in drivers:
            for o in day["drivers"][driver]["outings"]:
                event = o.get("first_drop")
                if event not in starts:
                    continue
                minutes = math.floor(starts[event] - o["start"] + 0.5) + before
                out[(day["date"], event)] = min(max(minutes, 0), MAX_REMINDER)
    return out


def missing_rides(
    days: Iterable[Mapping[str, Any]], now: datetime, tz: tzinfo, ahead: timedelta = NO_DRIVER_AHEAD
) -> list[MissingRide]:
    """Rides from now until ``ahead`` from now with nobody driving yet, soonest first."""
    out: list[MissingRide] = []
    until = now + ahead
    for day in days:
        d = date.fromisoformat(day["date"])
        kids = day.get("kids", {})
        for e in day["events"]:
            kid = kids.get(e["kid"], {}).get("name", e["kid"])
            place = e.get("short_place") or e["title"]
            for side in e["sides"]:
                if e[side] != UNASSIGNED:
                    continue
                minutes = e["start"] if side == "drop" else e["end"]
                when = at_minutes(d, minutes, tz)
                if not now <= when <= until:
                    continue
                what = f"{kid} to {e['title']}" if side == "drop" else f"{kid} home from {e['title']}"
                if place and place != e["title"]:
                    what += f" ({place})"
                out.append(
                    MissingRide(
                        key=f"{day['date']}|{e['id']}|{side}",
                        when=when,
                        text=f"{when.strftime('%a')} {fmt12(minutes)}  {what}",
                    )
                )
    out.sort(key=lambda m: (m.when, m.key))
    return out


def missing_message(rides: Sequence[MissingRide]) -> tuple[str, str]:
    """The title and text of one alert about rides with no driver."""
    title = "A ride needs a driver" if len(rides) == 1 else f"{len(rides)} rides need a driver"
    lines = [r.text for r in rides[:NO_DRIVER_LINES]]
    if len(rides) > NO_DRIVER_LINES:
        lines.append(f"and {len(rides) - NO_DRIVER_LINES} more")
    return title, "\n".join(lines)


@dataclass(frozen=True, slots=True)
class ReminderWrite:
    """A change to the reminder on one kid's event. ``minutes`` None takes MyDashLight's off."""

    calendar_id: str
    event_id: str
    etag: str
    minutes: int | None
    private: Mapping[str, str]


def reminder_writes(
    week: Sequence[DayInput], wanted: Mapping[tuple[str, str], int], now: datetime, tz: tzinfo
) -> list[ReminderWrite]:
    """What to change so each future drop-off has the reminder it should, and no other event
    keeps one MyDashLight set. Events that have started are left as they are."""
    out: list[ReminderWrite] = []
    seen: set[tuple[str, str]] = set()
    for day in week:
        for e in day.events:
            ref = day.refs[e.id]
            where = (ref.calendar_id, ref.event_id)
            if "drop" not in ref.sides or where in seen or at_minutes(day.day, e.start, tz) <= now:
                continue
            seen.add(where)
            private = dict(ref.private)
            mark = private.pop(REMINDER_MARK, "")
            want = wanted.get((day.day.isoformat(), e.id))
            if want is not None and not (mark == str(want) and ref.popups == (want,)):
                out.append(ReminderWrite(ref.calendar_id, ref.event_id, ref.etag, want, private))
            elif want is None and mark:
                out.append(ReminderWrite(ref.calendar_id, ref.event_id, ref.etag, None, private))
    return out
