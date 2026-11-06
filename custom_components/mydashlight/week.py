"""Turns a week of Google Calendar events into the planner's input for each day.

Kid calendars give the activities that need rides. Each parent's own calendars give the
times they can't drive. Pure module, no Home Assistant imports.

An event at home needs no ride. Nor does one with no address, or an online one, since it can
happen anywhere, unless its notes name a driver.

Times are wall-clock minutes after midnight in the household's time zone, as the planner
expects. An evening event that ends after midnight stays on its start day (an end of 1450
is 12:10 AM). An event that runs past :data:`NEXT_MORNING` the next day, such as a weekend
trip, is split: the drop-off on its first day and the pick-up on its last day.
"""

from __future__ import annotations

from collections.abc import Callable, Iterable, Mapping, Sequence
from dataclasses import dataclass, field, replace
from datetime import date, datetime, time, timedelta, tzinfo
import re
from typing import Any, Final, Literal

from .google import CalendarEvent
from .notes import DriverDirectory, RideNotes, parse_notes, skip_prefix
from .planner import HOME, NOT_NEEDED, UNASSIGNED, BusyBlock, Labels, RideEvent, Side, TravelFn

DAY: Final = 1440
NEXT_MORNING: Final = DAY + 6 * 60
"""Events ending by 6 AM the next day stay on their start day."""
NO_TITLE: Final = "Event"
NO_ADDRESS: Final = "?"
"""Prefix of the place key for an event with no location."""

Where = Literal["home", "anywhere", "place"]

_HOME_WORDS: Final = frozenset({"home", "at home", "our house"})
_ONLINE_WORDS: Final = frozenset(
    {"online", "virtual", "remote", "zoom", "google meet", "teams", "facetime", "phone", "phone call", "call"}
)
_ONLINE_HOSTS: Final = ("zoom.us/", "meet.google.com", "teams.microsoft.com", "teams.live.com", "webex.com")
_STREET_WORDS: Final = {
    "street": "st",
    "avenue": "ave",
    "av": "ave",
    "road": "rd",
    "drive": "dr",
    "lane": "ln",
    "court": "ct",
    "boulevard": "blvd",
    "place": "pl",
    "circle": "cir",
    "terrace": "ter",
    "parkway": "pkwy",
    "highway": "hwy",
    "trail": "trl",
    "way": "wy",
    "north": "n",
    "south": "s",
    "east": "e",
    "west": "w",
}


@dataclass(frozen=True, slots=True)
class KidCalendar:
    calendar_id: str
    name: str


@dataclass(frozen=True, slots=True)
class CalendarRoles:
    """Which calendars MyDashLight reads, and what each one means."""

    kids: tuple[KidCalendar, ...] = ()
    busy: Mapping[str, tuple[str, ...]] = field(default_factory=dict)
    """Each routed driver's own calendars, where their events mean they can't drive."""

    @property
    def calendar_ids(self) -> tuple[str, ...]:
        """Every calendar to read, each once, kids first."""
        out: list[str] = []
        for cal_id in [k.calendar_id for k in self.kids] + [c for ids in self.busy.values() for c in ids]:
            if cal_id not in out:
                out.append(cal_id)
        return tuple(out)


@dataclass(frozen=True, slots=True)
class EventRef:
    """Where a ride event came from, so a change can be written back to it."""

    calendar_id: str
    event_id: str
    etag: str
    recurring_id: str | None
    sides: tuple[Side, ...]
    """The sides this day's copy plans. A split event plans its drop-off on the first day
    and its pick-up on the last."""
    popups: tuple[int, ...] | None = None
    """The event's pop-up reminders, or None for the calendar's default."""
    private: tuple[tuple[str, str], ...] = ()
    """The event's private properties, where MyDashLight marks the reminder it set."""


@dataclass(slots=True)
class DayInput:
    """Everything the planner needs for one day."""

    day: date
    events: list[RideEvent] = field(default_factory=list)
    refs: dict[str, EventRef] = field(default_factory=dict)
    problems: dict[str, tuple[str, ...]] = field(default_factory=dict)
    """Lines in an event's notes that couldn't be read, by ride event id."""
    busy: dict[str, list[BusyBlock]] = field(default_factory=dict)


@dataclass(slots=True)
class WeekInput:
    days: list[DayInput]
    labels: Labels
    kids: tuple[str, ...]
    travel_overrides: dict[str, int]
    """Drive minutes set in event notes, by place key."""


def window(today: date, days: int, tz: tzinfo) -> tuple[datetime, datetime]:
    """The time span to read: midnight today until :data:`NEXT_MORNING` after the last day."""
    start = datetime.combine(today, time(0), tz)
    end = datetime.combine(today + timedelta(days=days), time(0), tz) + timedelta(minutes=NEXT_MORNING - DAY)
    return start, end


def place_key(location: str) -> str:
    return " ".join(location.split()).casefold()


def where(location: str, home_address: str = "") -> Where:
    """Whether an event's location is home, anywhere (none, or online), or a place to drive to.

    Home is the word "Home", or the same street address as ``home_address``. Only the part
    before the first comma counts, so "12 Oak Street" matches "12 Oak St, Springfield, IL".
    """
    text = " ".join(location.split()).casefold()
    if not text or text in _ONLINE_WORDS or text.startswith(("http://", "https://")):
        return "anywhere"
    if any(host in text for host in _ONLINE_HOSTS):
        return "anywhere"
    if text in _HOME_WORDS:
        return "home"
    street = _street(location)
    if street and street == _street(home_address):
        return "home"
    return "place"


def _street(address: str) -> str:
    words = re.sub(r"[.#]", " ", address.split(",", 1)[0].casefold()).split()
    return " ".join(_STREET_WORDS.get(w, w) for w in words)


def short_place(location: str) -> str:
    """The first part of an address, such as the school's name."""
    return location.split(",", 1)[0].strip() or location


def build_week(
    events: Mapping[str, Sequence[CalendarEvent]],
    roles: CalendarRoles,
    directory: DriverDirectory,
    today: date,
    days: int,
    tz: tzinfo,
    home_address: str = "",
) -> WeekInput:
    """Sort the events read from each calendar into each day's planner input."""
    # Kids taken along are named in the notes, so the notes need the kids' names.
    directory = replace(directory, kids={k.calendar_id: k.name for k in roles.kids})
    day_list = [today + timedelta(days=i) for i in range(days)]
    by_day = {d: DayInput(d) for d in day_list}
    places: dict[str, str] = {}
    short: dict[str, str] = {}
    overrides: dict[str, int] = {}

    for kid in roles.kids:
        for ev in sorted(events.get(kid.calendar_id, ()), key=_sort_key):
            if ev.all_day or ev.declined:
                continue
            assert isinstance(ev.start, datetime)
            assert isinstance(ev.end, datetime)
            first = ev.start.astimezone(tz).date()
            start = _minutes(ev.start, first, tz)
            end = max(_minutes(ev.end, first, tz), start)
            title, skipped = skip_prefix(ev.title or NO_TITLE)
            notes = parse_notes(ev.description, directory, start)
            if skipped:
                notes = replace(notes, attending=False)
            notes = _kids_only(notes, directory)
            base_id = ev.id
            kind = where(ev.location or "", home_address)
            if kind == "home":
                # Home needs no ride, whatever the notes say.
                loc = HOME
                notes = replace(
                    notes, drop=NOT_NEEDED, pick=NOT_NEEDED, stay=False, arrive_by=None, along=(), travel=None
                )
            elif kind == "place":
                loc = place_key(ev.location or "")
                places.setdefault(loc, ev.location or "")
                short.setdefault(loc, short_place(ev.location or ""))
            else:
                loc = ""
                if notes.drop == UNASSIGNED and notes.pick == UNASSIGNED:
                    # It can happen anywhere. Naming a driver in the notes plans it after all.
                    notes = replace(notes, drop=NOT_NEEDED, pick=NOT_NEEDED)
            if not notes.attending:
                # Still shown, but nobody drives and nothing clashes with it.
                notes = replace(notes, drop=NOT_NEEDED, pick=NOT_NEEDED, stay=False, arrive_by=None, along=())
            pieces: list[tuple[date, RideEvent, tuple[Side, ...]]] = []
            if end <= NEXT_MORNING:
                pieces.append(
                    (
                        first,
                        RideEvent(base_id, kid.calendar_id, title, loc, start, end, **_sides(notes)),
                        ("drop", "pick"),
                    )
                )
            else:
                last = ev.end.astimezone(tz).date()
                pieces.append(
                    (
                        first,
                        RideEvent(
                            base_id,
                            kid.calendar_id,
                            title,
                            loc,
                            start,
                            max(start, DAY),
                            drop=notes.drop,
                            pick=NOT_NEEDED,
                            arrive_by=notes.arrive_by,
                            along=notes.along,
                            attending=notes.attending,
                        ),
                        ("drop",),
                    )
                )
                pieces.append(
                    (
                        last,
                        RideEvent(
                            base_id,
                            kid.calendar_id,
                            title,
                            loc,
                            0,
                            _minutes(ev.end, last, tz),
                            drop=NOT_NEEDED,
                            pick=notes.pick,
                            attending=notes.attending,
                        ),
                        ("pick",),
                    )
                )
            for day, ride, sides in pieces:
                target = by_day.get(day)
                if target is None:
                    continue
                ride_id = _unique_id(base_id, target.refs)
                if not ride.loc:
                    key = f"{NO_ADDRESS}{ride_id}"
                    places[key] = title
                    short[key] = title
                    ride = replace(ride, id=ride_id, loc=key)
                elif ride_id != ride.id:
                    ride = replace(ride, id=ride_id)
                target.events.append(ride)
                target.refs[ride_id] = EventRef(
                    ev.calendar_id, ev.id, ev.etag, ev.recurring_id, sides, ev.popups, ev.private
                )
                if notes.problems:
                    target.problems[ride_id] = notes.problems
                if notes.travel is not None and "drop" in sides:
                    overrides[ride.loc] = max(overrides.get(ride.loc, 0), notes.travel)

    # A parent's own event at a place, at a set time on one day: they drive themselves there,
    # stay, and drive back, maybe with kids or the other parent along. Anything else on their
    # calendar is just time they can't drive.
    kid_event_ids = {ev.id for kid in roles.kids for ev in events.get(kid.calendar_id, ())}
    owned: dict[tuple[str, str], tuple[DayInput, str]] = {}
    for driver, cal_ids in roles.busy.items():
        seen: set[tuple[str, str]] = set()
        for cal_id in cal_ids:
            for ev in sorted(events.get(cal_id, ()), key=_sort_key):
                seen_key = (ev.id, str(ev.start))
                if not ev.busy or ev.declined or seen_key in seen:
                    continue
                seen.add(seen_key)
                if seen_key in owned:
                    # On both parents' calendars: the second one goes along.
                    target, ride_id = owned[seen_key]
                    i = next(i for i, e in enumerate(target.events) if e.id == ride_id)
                    e = target.events[i]
                    if e.attending and driver != e.own and driver not in e.parents:
                        target.events[i] = replace(e, parents=(*e.parents, driver))
                    continue
                own = None if ev.id in kid_event_ids else _own_event(ev, driver, directory, tz, home_address)
                if own is not None:
                    first, ride, notes = own
                    target = by_day.get(first)
                    if target is None:
                        continue
                    ride_id = _unique_id(ev.id, target.refs)
                    ride = replace(ride, id=ride_id)
                    owned[seen_key] = (target, ride_id)
                    places.setdefault(ride.loc, ev.location or "")
                    short.setdefault(ride.loc, short_place(ev.location or ""))
                    target.events.append(ride)
                    target.refs[ride_id] = EventRef(
                        ev.calendar_id, ev.id, ev.etag, ev.recurring_id, ("drop", "pick"), ev.popups, ev.private
                    )
                    if notes.problems:
                        target.problems[ride_id] = notes.problems
                    if notes.travel is not None and ride.attending:
                        overrides[ride.loc] = max(overrides.get(ride.loc, 0), notes.travel)
                    continue
                for d in day_list:
                    block = _busy_on(ev, d, tz)
                    if block is not None:
                        by_day[d].busy.setdefault(driver, []).append(block)
    for d in day_list:
        by_day[d].events.sort(key=lambda e: (e.start, e.end, e.id))
        for blocks in by_day[d].busy.values():
            blocks.sort(key=lambda b: (b.start, b.end, b.title))

    return WeekInput(
        days=[by_day[d] for d in day_list],
        labels=Labels(
            kids={k.calendar_id: k.name for k in roles.kids},
            drivers=dict(directory.names),
            places={HOME: "Home", **places},
            short_places={HOME: "Home", **short},
        ),
        kids=tuple(k.calendar_id for k in roles.kids),
        travel_overrides=overrides,
    )


def make_travel(
    overrides: Mapping[str, int],
    default: float,
    base: Callable[[str, str], float | None] | None = None,
) -> TravelFn:
    """Drive minutes between two places.

    A drive time set in an event's notes is the time to get to that event, so it wins for
    trips to that place. Then the computed time, if there is one, then the notes' time for
    the place being left (usually the same trip the other way), then ``default``.
    """

    def travel(a: str, b: str) -> float:
        if a == b:
            return 0
        if b in overrides:
            return overrides[b]
        if base is not None and not (a.startswith(NO_ADDRESS) or b.startswith(NO_ADDRESS)):
            minutes = base(a, b)
            if minutes is not None:
                return minutes
        if a in overrides:
            return overrides[a]
        return default

    return travel


def leg_hour(day: DayInput, origin: str, destination: str) -> int:
    """The hour of the day a trip is most likely driven, for looking up its drive time.

    A trip to an activity leaves about half an hour before the first one there starts. A trip
    from an activity leaves when the first one there ends. Anything else counts as midday.
    """
    starts = [e.start for e in day.events if e.loc == destination]
    ends = [e.end for e in day.events if e.loc == origin]
    if destination != HOME and starts:
        minute = min(starts) - 30
    elif origin != HOME and ends:
        minute = min(ends)
    else:
        minute = 12 * 60
    return min(max(minute, 0), DAY - 1) // 60


def addresses(week: WeekInput) -> list[str]:
    """Every place key with a real address, for computing drive times."""
    return sorted(
        {e.loc for d in week.days for e in d.events if e.loc and e.loc != HOME and not e.loc.startswith(NO_ADDRESS)}
    )


def _sides(notes: RideNotes) -> dict[str, Any]:
    return {
        "drop": notes.drop,
        "pick": notes.pick,
        "stay": notes.stay,
        "arrive_by": notes.arrive_by,
        "along": notes.along,
        "attending": notes.attending,
    }


def _own_event(
    ev: CalendarEvent, driver: str, directory: DriverDirectory, tz: tzinfo, home_address: str
) -> tuple[date, RideEvent, RideNotes] | None:
    """A parent's own event as a ride they drive themselves, with its day and notes, or None
    when it's only busy time: all day, over more than a day, at home, or anywhere."""
    if ev.all_day or where(ev.location or "", home_address) != "place":
        return None
    assert isinstance(ev.start, datetime)
    assert isinstance(ev.end, datetime)
    first = ev.start.astimezone(tz).date()
    start = _minutes(ev.start, first, tz)
    end = max(_minutes(ev.end, first, tz), start)
    if end > NEXT_MORNING:
        return None
    title, skipped = skip_prefix(ev.title or NO_TITLE)
    notes = parse_notes(ev.description, directory, start)
    attending = notes.attending and not skipped
    kids = tuple(a for a in notes.along if a in directory.kids) if attending else ()
    parents = tuple(a for a in notes.along if a in directory.names and a != driver) if attending else ()
    side = driver if attending else NOT_NEEDED
    ride = RideEvent(
        ev.id,
        driver,
        title,
        place_key(ev.location or ""),
        start,
        end,
        drop=side,
        pick=side,
        stay=attending,
        arrive_by=notes.arrive_by if attending else None,
        along=kids,
        attending=attending,
        own=driver,
        parents=parents,
    )
    return first, ride, notes


def _kids_only(notes: RideNotes, directory: DriverDirectory) -> RideNotes:
    """A kid's event takes only kids along. A parent can only go along to the other parent's
    own event."""
    kids = tuple(a for a in notes.along if a in directory.kids)
    if kids == notes.along:
        return notes
    extra = tuple(
        f"Take along: “{directory.names.get(a, a)}” can only go along to a parent’s own event"
        for a in notes.along
        if a not in directory.kids
    )
    return replace(notes, along=kids, problems=notes.problems + extra)


def _sort_key(ev: CalendarEvent) -> tuple[str, str]:
    return (str(ev.start), ev.id)


def _minutes(moment: datetime, day: date, tz: tzinfo) -> int:
    local = moment.astimezone(tz)
    return (local.date() - day).days * DAY + local.hour * 60 + local.minute


def _unique_id(event_id: str, taken: Iterable[str]) -> str:
    # The same event can be on two kids' calendars. Each kid gets their own ride event.
    used = set(taken)
    if event_id not in used:
        return event_id
    n = 2
    while f"{event_id}~{n}" in used:
        n += 1
    return f"{event_id}~{n}"


def _busy_on(ev: CalendarEvent, day: date, tz: tzinfo) -> BusyBlock | None:
    """The part of a parent's event that falls in this day's planning span, if any."""
    title = ev.title or "Busy"
    if ev.all_day:
        assert isinstance(ev.start, date)
        assert isinstance(ev.end, date)
        # An all-day event only counts when it's marked Busy. Google marks new ones Free.
        return BusyBlock(0, DAY, title) if ev.start <= day < ev.end else None
    assert isinstance(ev.start, datetime)
    assert isinstance(ev.end, datetime)
    start = max(_minutes(ev.start, day, tz), 0)
    end = min(_minutes(ev.end, day, tz), NEXT_MORNING)
    return BusyBlock(start, end, title) if end > start else None
