"""Turns a week of Google Calendar events into the planner's input for each day.

Each kid's events (their lane of the shared calendar, see :mod:`.shared`) give the activities
that need rides. Each parent's own events give the times they can't drive. Each lane is passed
in as if it were that person's own calendar, by their id. Pure module, no Home Assistant imports.

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
    """The kid's id. Before 0.19 each kid had a calendar, and this was its id."""
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
    no_ride_unless_named: bool = False
    """It needs no ride only because it has no address and its notes name no driver yet."""
    busy_only: Literal["", "days", "home", "anywhere"] = ""
    """Why it's a parent's event that only blocks their time, or "" when it isn't one: over
    more than a day, at home, or with no address. Shown and editable for Going, never driven to."""


@dataclass(slots=True)
class DayInput:
    """Everything the planner needs for one day."""

    day: date
    events: list[RideEvent] = field(default_factory=list)
    refs: dict[str, EventRef] = field(default_factory=dict)
    problems: dict[str, tuple[str, ...]] = field(default_factory=dict)
    """Lines in an event's notes that couldn't be read, by ride event id."""
    busy: dict[str, list[BusyBlock]] = field(default_factory=dict)
    all_day: list[dict[str, Any]] = field(default_factory=list)
    """The day's all-day events, shown across the top of the day for nobody."""
    unplaced: list[dict[str, Any]] = field(default_factory=list)
    """The day's timed events whose titles don't say who they're for."""


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
    escorts: Mapping[str, Sequence[str]] | None = None,
) -> WeekInput:
    """Sort the events read from each calendar into each day's planner input.

    ``escorts`` names, by event id, the parents going to a kid's event with them: the first one
    drives both ways and stays, with the others along, wherever the notes don't name a driver.
    """
    escorts = escorts or {}
    # Kids taken along are named in the notes, so the notes need the kids' names.
    directory = replace(directory, kids={k.calendar_id: k.name for k in roles.kids})
    day_list = [today + timedelta(days=i) for i in range(days)]
    by_day = {d: DayInput(d) for d in day_list}
    places: dict[str, str] = {}
    short: dict[str, str] = {}
    overrides: dict[str, int] = {}
    # (event id, driver id): a parent taking the kids to an event they're named on with them.
    # The drive and the wait cover that time, so it isn't busy time as well.
    taking: set[tuple[str, str]] = set()

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
            notes = _kid_notes(notes, kid.calendar_id)
            base_id = ev.id
            no_ride_unless_named = False
            kind = where(ev.location or "", home_address)
            if kind == "home":
                # Home needs no ride, whatever the notes say.
                loc = HOME
                notes = replace(
                    notes,
                    drop=NOT_NEEDED,
                    pick=NOT_NEEDED,
                    stay=False,
                    arrive_by=None,
                    leave_by=None,
                    drop_riders=(),
                    pick_riders=(),
                    travel=None,
                )
            elif kind == "place":
                if ev.id in escorts and notes.attending:
                    notes = _escorted(notes, tuple(escorts[ev.id]))
                    riders = {notes.drop, notes.pick, *notes.drop_riders, *notes.pick_riders}
                    taking.update((ev.id, p) for p in escorts[ev.id] if p in riders)
                loc = place_key(ev.location or "")
                places.setdefault(loc, ev.location or "")
                short.setdefault(loc, short_place(ev.location or ""))
            else:
                loc = ""
                if notes.drop == UNASSIGNED and notes.pick == UNASSIGNED:
                    # It can happen anywhere. Naming a driver in the notes plans it after all.
                    notes = replace(notes, drop=NOT_NEEDED, pick=NOT_NEEDED)
                    no_ride_unless_named = True
            if not notes.attending:
                # Still shown, but nobody drives and nothing clashes with it.
                notes = replace(
                    notes,
                    drop=NOT_NEEDED,
                    pick=NOT_NEEDED,
                    stay=False,
                    arrive_by=None,
                    leave_by=None,
                    drop_riders=(),
                    pick_riders=(),
                )
            riding = _sides(notes, directory)
            pieces: list[tuple[date, RideEvent, tuple[Side, ...]]] = []
            if end <= NEXT_MORNING:
                pieces.append(
                    (
                        first,
                        RideEvent(base_id, kid.calendar_id, title, loc, start, end, **riding),
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
                            along=riding["along"],
                            parents=riding["parents"],
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
                            pick_along=riding["pick_along"],
                            pick_parents=riding["pick_parents"],
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
                    ev.calendar_id,
                    ev.id,
                    ev.etag,
                    ev.recurring_id,
                    sides,
                    ev.popups,
                    ev.private,
                    no_ride_unless_named=no_ride_unless_named,
                )
                if notes.problems:
                    target.problems[ride_id] = notes.problems
                if notes.travel is not None and "drop" in sides:
                    overrides[ride.loc] = max(overrides.get(ride.loc, 0), notes.travel)

    for target in by_day.values():
        _ride_together(target)

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
                if ev.declined or seen_key in seen:
                    continue
                seen.add(seen_key)
                if (ev.id, driver) in taking:
                    continue
                if seen_key in owned:
                    # On both parents' calendars: the second one goes along.
                    target, ride_id = owned[seen_key]
                    i = next(i for i, e in enumerate(target.events) if e.id == ride_id)
                    e = target.events[i]
                    if e.attending and e.takes is None and driver != e.own and driver not in e.parents:
                        target.events[i] = replace(e, parents=(*e.parents, driver))
                    continue
                own = None if ev.id in kid_event_ids else _own_event(ev, driver, directory, tz, home_address)
                # An errand counts even when marked Free: it only takes a few minutes of the time.
                if not ev.busy and (own is None or own[1].takes is None):
                    continue
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
                # Only busy time: on the board as the parent's own card, to see and to mark not
                # going, which frees their time. It's never driven to.
                title, skipped = skip_prefix(ev.title or "Busy")
                notes = parse_notes(ev.description, directory, None)
                attending = notes.attending and not skipped
                key = f"{NO_ADDRESS}{ev.id}"
                at = where(ev.location or "", home_address)
                why: Literal["days", "home", "anywhere"] = "days" if at == "place" else at
                places.setdefault(key, ev.location or title)
                short.setdefault(key, short_place(ev.location or "") or title)
                for d in day_list:
                    block = _busy_on(ev, d, tz)
                    # A kid's event too: changed from the kid's card, so here it's only busy time.
                    if block is None or ev.all_day or ev.id in kid_event_ids:
                        if block is not None and attending:
                            by_day[d].busy.setdefault(driver, []).append(block)
                        continue
                    target = by_day[d]
                    if attending:
                        target.busy.setdefault(driver, []).append(replace(block, title=title))
                    ride_id = _unique_id(ev.id, target.refs)
                    target.events.append(
                        RideEvent(
                            ride_id,
                            driver,
                            title,
                            key,
                            block.start,
                            block.end,
                            drop=NOT_NEEDED,
                            pick=NOT_NEEDED,
                            attending=attending,
                            own=driver,
                        )
                    )
                    target.refs[ride_id] = EventRef(
                        ev.calendar_id,
                        ev.id,
                        ev.etag,
                        ev.recurring_id,
                        ("drop", "pick"),
                        ev.popups,
                        ev.private,
                        busy_only=why,
                    )
                    if notes.problems:
                        target.problems[ride_id] = notes.problems
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


def _ride_together(day: DayInput) -> None:
    """Kids at the same event with the same driver go in the same car.

    One event naming several kids is one ride: the first kid's drop-off takes the others
    along, and when the driver stays, only the last one's stop is the wait, so the drop-offs
    all come first.
    """
    groups: dict[tuple[str, str], list[int]] = {}
    for i, e in enumerate(day.events):
        ref = day.refs.get(e.id)
        if ref is not None and e.own is None and e.takes is None:
            groups.setdefault((ref.calendar_id, ref.event_id), []).append(i)
    for idx in groups.values():
        rides = [day.events[i] for i in idx]
        if len(rides) < 2 or len({(e.start, e.loc) for e in rides}) > 1:
            continue
        drivers = {e.drop for e in rides}
        if len(drivers) == 1 and next(iter(drivers)) not in (UNASSIGNED, NOT_NEEDED):
            first = rides[0]
            along = tuple(dict.fromkeys((*first.along, *(e.kid for e in rides[1:]))))
            day.events[idx[0]] = replace(first, along=along)
        if any(e.stay for e in rides) and len({(e.drop, e.pick) for e in rides}) == 1:
            for i in idx[:-1]:
                day.events[i] = replace(day.events[i], stay=False)
            day.events[idx[-1]] = replace(day.events[idx[-1]], stay=True)


def _escorted(notes: RideNotes, parents: tuple[str, ...]) -> RideNotes:
    """A kid's notes when the event also names the parents going: the first named drives, with
    the rest along, on each side the notes leave open. Driving both ways, they stay."""
    driver, *others = parents
    drop, pick = notes.drop == UNASSIGNED, notes.pick == UNASSIGNED
    return replace(
        notes,
        drop=driver if drop else notes.drop,
        pick=driver if pick else notes.pick,
        stay=notes.stay or (drop and pick),
        drop_riders=(*notes.drop_riders, *others) if drop else notes.drop_riders,
        pick_riders=(*notes.pick_riders, *others) if pick else notes.pick_riders,
    )


def _sides(notes: RideNotes, directory: DriverDirectory) -> dict[str, Any]:
    def kids(riders: tuple[str, ...]) -> tuple[str, ...]:
        return tuple(r for r in riders if r in directory.kids)

    def parents(riders: tuple[str, ...], driver: str) -> tuple[str, ...]:
        return tuple(r for r in riders if r in directory.names and r != driver)

    return {
        "drop": notes.drop,
        "pick": notes.pick,
        "stay": notes.stay,
        "arrive_by": notes.arrive_by,
        "leave_by": notes.leave_by,
        "along": kids(notes.drop_riders),
        "parents": parents(notes.drop_riders, notes.drop),
        "pick_along": kids(notes.pick_riders),
        "pick_parents": parents(notes.pick_riders, notes.pick),
        "attending": notes.attending,
    }


def _own_event(
    ev: CalendarEvent, driver: str, directory: DriverDirectory, tz: tzinfo, home_address: str
) -> tuple[date, RideEvent, RideNotes] | None:
    """A parent's own event as a ride they drive themselves, with its day and notes, or None
    when it's only busy time: all day, over more than a day, at home, or anywhere.

    With a Takes line it's an errand: that many minutes any time from its start to its end,
    which the planner picks. An errand goes alone, so it takes nobody along.
    """
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
    errand = notes.takes is not None
    takes = min(notes.takes, end - start) if notes.takes is not None else None
    kids = tuple(a for a in notes.along if a in directory.kids) if attending and not errand else ()
    parents = tuple(a for a in notes.along if a in directory.names and a != driver) if attending and not errand else ()
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
        arrive_by=notes.arrive_by if attending and not errand else None,
        leave_by=notes.leave_by if attending and not errand else None,
        along=kids,
        attending=attending,
        own=driver,
        parents=parents,
        takes=takes,
    )
    return first, ride, notes


def _kid_notes(notes: RideNotes, kid: str) -> RideNotes:
    """Who rides along on a kid's event, each side.

    The people after the driver on a Drop-off or Pick-up line ride along on that side. An old
    Take along line counts as riders on the drop-off. With Stay, everyone stays, so riders
    named on the drop-off ride home too; a Pick-up line naming different riders is a conflict,
    and until it's fixed everyone named on either goes both ways. An errand goes on a parent's
    calendar.
    """
    problems = list(notes.problems)
    if notes.takes is not None:
        problems.append("Takes: errands go on a parent’s own calendar")
    drop = tuple(r for r in dict.fromkeys((*notes.drop_riders, *notes.along)) if r != kid)
    pick = tuple(r for r in notes.pick_riders if r != kid)
    if notes.stay and notes.drop == notes.pick:
        if pick and set(pick) != set(drop):
            problems.append("Stay: everyone stays, so the Drop-off and Pick-up should name the same riders")
        drop = pick = tuple(dict.fromkeys((*drop, *pick)))
    return replace(notes, takes=None, along=(), drop_riders=drop, pick_riders=pick, problems=tuple(problems))


def _sort_key(ev: CalendarEvent) -> tuple[str, str]:
    return (str(ev.start), ev.id)


def _minutes(moment: datetime, day: date, tz: tzinfo) -> int:
    local = moment.astimezone(tz)
    return (local.date() - day).days * DAY + local.hour * 60 + local.minute


def _unique_id(event_id: str, taken: Iterable[str]) -> str:
    # One event can name two kids. Each kid gets their own ride event.
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
