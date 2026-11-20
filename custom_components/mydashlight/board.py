"""What the ride board shows for a day, worked out from the planner's routes.

A port of ``buildDay`` in the ride board mockup, minus the parts that only depend on the
screen layout. It answers: which kid is in which car and when, which kids are double-booked,
each driver's outings as a list of stops, and the one-line ride summary on each activity card.

The backend writes this wording so the kitchen screen, phones and notifications all say the
same thing. The app only lays it out. Pure module, no Home Assistant imports.
"""

from __future__ import annotations

from collections.abc import Callable, Mapping, Sequence
from dataclasses import dataclass, field
import math
from typing import Final, Literal

from .planner import (
    DEFAULT_DRIVERS,
    DEFAULT_SETTINGS,
    HOME,
    NOT_NEEDED,
    UNASSIGNED,
    BusyBlock,
    DayPlan,
    Labels,
    PlannerSettings,
    RideEvent,
    Segment,
    Span,
    Stop,
    TravelFn,
    Trip,
    base_at,
    busy_along,
    fmt,
    fmt12,
    minutes_text,
    plan_all,
)
from .week import NO_ADDRESS, Where

Tone = Literal["normal", "pending", "problem", "muted"]
"""How a card line reads: as usual, still needs a driver, has a problem, or nothing to do."""


def event_where(e: RideEvent) -> Where:
    """Home, anywhere (no address and no ride, such as a call), or a place to drive to."""
    if e.loc == HOME:
        return "home"
    if e.loc.startswith(NO_ADDRESS) and e.drop == NOT_NEEDED and e.pick == NOT_NEEDED:
        return "anywhere"
    return "place"


@dataclass(eq=False, slots=True)
class Ride:
    """A kid's continuous time in one driver's car.

    ``own`` is False while the kid is only along for someone else's stop.
    """

    kid: str
    driver: str
    start: float
    end: float
    legs: list[Segment]
    own: bool


@dataclass(eq=False, slots=True)
class KidItem:
    """Something in a kid's column: an activity or a ride."""

    type: Literal["act", "ride"]
    start: float
    end: float
    event: RideEvent | None = None
    ride: Ride | None = None
    clash: bool = False


@dataclass(frozen=True, slots=True)
class Clash:
    """A kid with two things at once. ``a`` is always an activity."""

    kid: str
    a: KidItem
    b: KidItem


@dataclass(eq=False, slots=True)
class Outing:
    """A driver's time away from home: leave, every stop, back home."""

    start: float
    end: float
    legs: list[Segment]
    lead: str = ""
    title: str = ""
    """What the outing is for, such as "Drive Ava to Piano"."""
    lines: list[str] = field(default_factory=list)
    kids: list[str] = field(default_factory=list)
    warn: str = ""
    target: RideEvent | None = None
    first_drop: RideEvent | None = None
    """The first event someone is dropped off at, which holds the calendar reminder."""
    riders: dict[str, str] = field(default_factory=dict)
    """What each kid in the car needs to know, by kid: when they leave or are picked up."""
    go: Going | None = None
    """Where the drive starts and the first place it has to be by a set time."""
    parents: dict[str, str] = field(default_factory=dict)
    """The other parent riding along to this driver's own event, by driver id: when they leave."""
    solo: bool = False
    """Only this driver going to their own events, with nobody along. They know their own day,
    so it gets no reminder."""
    home: str = "Home"
    """What the trip calls home: a hotel's name while the driver stays there."""


@dataclass(frozen=True, slots=True)
class Going:
    """The first stretch of an outing, for checking the driver is on their way."""

    from_loc: str
    from_name: str
    to_loc: str
    to_name: str
    due: float
    """When the driver has to be there: the drop-off's Arrive by time or start, or the pick-up's end."""
    via_home: bool
    """The drive goes home first to get someone, so a drive straight there isn't the plan."""


@dataclass(frozen=True, slots=True)
class CardLine:
    text: str
    tone: Tone


@dataclass(frozen=True, slots=True)
class CardLines:
    """The getting-there and getting-home lines on an activity's card."""

    drop: CardLine | None
    pick: CardLine | None


@dataclass(eq=False, slots=True)
class DayBoard:
    plan: DayPlan
    rides: list[Ride]
    kid_items: dict[str, list[KidItem]]
    clashes: list[Clash]
    outings: dict[str, list[Outing]]
    lines: dict[str, CardLines]


def build_day(
    events: Sequence[RideEvent],
    busy: Mapping[str, Sequence[BusyBlock]],
    travel: TravelFn,
    labels: Labels,
    settings: PlannerSettings = DEFAULT_SETTINGS,
    drivers: Sequence[str] = DEFAULT_DRIVERS,
    kids: Sequence[str] = (),
    homes: Mapping[str, str] | None = None,
    trips: Sequence[Trip] = (),
    spans: Mapping[str, Sequence[Span]] | None = None,
) -> DayBoard:
    """Plan the day and work out everything the board shows for it.

    ``homes`` gives, by driver, where their rides start and end when it isn't home (a hotel on
    a trip, see :func:`.planner.plan_all`). Their trips name it where they'd say Home.
    ``trips`` are today's drives to a hotel and back: each is an outing of its own, and the
    kids in the car have a ride. ``spans`` are the stays' own times on a day one starts or ends.
    """
    plan = plan_all(events, busy, travel, settings, drivers, homes, trips, spans)
    # A kid taken along while busy elsewhere isn't planned in the car or shown going: the
    # plan's problem for it says so.
    events, _ = busy_along(events)
    goes = _goes_to(events)
    rides = _rides(plan, drivers, goes)
    kid_items = _kid_items(events, rides, kids, goes)
    outings = {d: _outings(plan, d, plan.busy, labels) for d in drivers}
    return DayBoard(
        plan=plan,
        rides=rides,
        kid_items=kid_items,
        clashes=_clashes(kid_items),
        outings=outings,
        lines=_card_lines(events, plan, rides, labels, drivers),
    )


def _trip_outing(
    g: Segment, t: Trip, d: str, busy: Mapping[str, Sequence[BusyBlock]], labels: Labels, drivers: Sequence[str]
) -> Outing:
    """The drive to a hotel or back home, on to the next hotel, or straight on from or to a
    stop next to it, as the driver's outing."""

    def called(loc: str | None) -> str:
        if loc in (None, HOME):
            return "home"
        return t.name if loc == t.place else t.other_name if loc == t.other else labels.short_place(loc)

    name = labels.driver(d)
    kid_names = [labels.kid(k) for k in g.kids]
    who = f"{_and(kid_names)} " if kid_names else ""
    start_name, to_name = called(g.from_loc), called(g.to_loc)
    leave_line = f"Leave {start_name} at {fmt12(g.start)} with {name}"
    if g.from_loc == HOME:
        title = f"Drive {who}to {to_name}"
    elif g.to_loc == HOME:
        title = f"Drive {who}home from {start_name}"
    else:
        title = f"Drive {who}from {start_name} to {to_name}"
    due = f", there by {fmt(t.due)}" if t.there and g.to_loc == t.place and g.end < t.due else ""
    lines = [f"{fmt(g.end)}  {'Home' if g.to_loc == HOME else to_name}{due}"]
    warn = ""
    for b in busy.get(d, ()):
        if b.start < g.end and b.end > g.start:
            warn = f"Still at {b.title} until {fmt(b.end)}"
    o = Outing(g.start, g.end, [g], lead=f"Leave {fmt(g.start)}", title=title, lines=lines, warn=warn)
    o.kids = list(g.kids)
    o.riders = {k: leave_line for k in g.kids}
    o.parents = {p: leave_line for p in t.riders if p in drivers and p != d}
    o.go = Going(
        from_loc=g.from_loc or HOME,
        from_name=start_name,
        to_loc=g.to_loc or HOME,
        to_name=to_name,
        due=t.due if t.there and g.to_loc == t.place else g.end,
        via_home=False,
    )
    # Both ends of the drive are where they are: home is home on it.
    o.home = "Home"
    return o


def _goes_to(events: Sequence[RideEvent]) -> Callable[[RideEvent, str], bool]:
    """Whether a kid is at an event, or at the same calendar event in their own lane: kids
    named on one event each have their own copy, but they're all going to the same thing."""
    at: dict[str, set[str]] = {}
    for e in events:
        if e.own is None:
            at.setdefault(same_event(e.id), set()).add(e.kid)

    def goes(e: RideEvent, kid: str) -> bool:
        return e.attends(kid) or kid in at.get(same_event(e.id), ())

    return goes


def _rides(plan: DayPlan, drivers: Sequence[str], goes: Callable[[RideEvent, str], bool]) -> list[Ride]:
    # Back-to-back legs in the same car are one ride, split where a kid stops riding along
    # for someone else's stop and starts heading to their own (or the other way round).
    rides: list[Ride] = []
    for d in drivers:
        for g in plan[d].segments:
            if g.type == "home":
                continue
            for k in g.kids:
                prev = None
                for r in rides:
                    if r.kid == k and r.driver == d and r.end == g.start:
                        prev = r
                # A ride belongs to a kid when it serves their own stop.
                own = prev.own if prev else True
                if g.serves is not None:
                    own = goes(g.serves, k)
                if prev is not None and prev.own == own:
                    prev.end = g.end
                    prev.legs.append(g)
                else:
                    rides.append(Ride(k, d, g.start, g.end, [g], own))
    return rides


def _kid_items(
    events: Sequence[RideEvent], rides: list[Ride], kids: Sequence[str], goes: Callable[[RideEvent, str], bool]
) -> dict[str, list[KidItem]]:
    # Activities plus time in a car. A late arrival is trimmed at the start time:
    # that's lateness, not a clash.
    items: dict[str, list[KidItem]] = {k: [] for k in kids}
    for e in events:
        # A parent's own event is in the column of each kid going along, not a kid's of its own.
        for k in e.along if e.own is not None else (e.kid,):
            items.setdefault(k, []).append(KidItem("act", e.start, e.out, event=e))
    for r in rides:
        s, en = r.start, r.end
        for g in r.legs:
            served = g.serves
            if served is None or not goes(served, r.kid):
                continue
            if r.start < served.start < en:
                en = served.start
            if r.end > served.out > s:
                s = served.out
        if en > s:
            items.setdefault(r.kid, []).append(KidItem("ride", s, en, ride=r))
    return items


def _clashes(kid_items: dict[str, list[KidItem]]) -> list[Clash]:
    clashes: list[Clash] = []
    for kid, it in kid_items.items():
        for i, x in enumerate(it):
            for y in it[i + 1 :]:
                if x.start < y.end and y.start < x.end and "act" in (x.type, y.type):
                    a, b = (x, y) if x.type == "act" else (y, x)
                    if any(item.event is not None and not item.event.attending for item in (a, b)):
                        continue  # Not going, so it can't clash.
                    if b.type == "ride" and a.event is not None and event_where(a.event) == "anywhere":
                        continue  # A call or an online class can happen in the car.
                    x.clash = y.clash = True
                    clashes.append(Clash(kid, a, b))
    # One warning per clash: a car ride during an activity that already clashes with
    # another activity adds nothing new.
    return [
        c
        for c in clashes
        if c.b.type == "act" or not any(o.b.type == "act" and (o.a is c.a or o.b is c.a) for o in clashes)
    ]


def _outings(plan: DayPlan, d: str, busy: Mapping[str, Sequence[BusyBlock]], labels: Labels) -> list[Outing]:
    p = plan[d]
    outings: list[Outing] = []
    trip_outings: list[Outing] = []
    cur: Outing | None = None
    for g in p.segments:
        if g.type == "home":
            cur = None
            continue
        straight_on = g.trip is not None and not g.trip.there and g.to_loc not in (HOME, g.trip.other)
        if g.trip is not None and not straight_on:
            # The drive to a hotel or back is an outing of its own.
            trip_outings.append(_trip_outing(g, g.trip, d, busy, labels, list(plan.drivers)))
            cur = None
            continue
        if straight_on:
            # Back from the hotel straight to the next stop: one outing, from the hotel.
            cur = Outing(g.start, g.end, [g])
            outings.append(cur)
        elif cur is not None and cur.end == g.start:
            cur.end = g.end
            cur.legs.append(g)
        else:
            cur = Outing(g.start, g.end, [g])
            outings.append(cur)

    for o in outings:
        # Home in this driver's route, as their trips say it: a hotel's name while they stay there.
        away = base_at(plan.windows, d, o.start)
        home = labels.short_place(away) if away else "Home"
        home_at = home if away else "home"
        lines: list[str] = []
        kids: list[str] = []
        jobs: list[tuple[str, str, list[str]]] = []
        job_event: str | None = None
        riders: dict[str, str] = {}
        # The last stop line, when it was a kid's: its kind, place, time, event and kids.
        said: tuple[str, str, str, str | None, list[str]] | None = None
        left: tuple[str, str, str | None, list[str]] | None = None
        name = labels.driver(d)
        first = o.legs[0]
        if first.type == "drive" and (first.from_loc == HOME or first.trip is not None):
            start = home_at if first.from_loc == HOME else labels.short_place(first.from_loc or "")
            for x in first.kids:
                riders[x] = f"Leave {start} at {fmt12(o.start)} with {name}"
        for g in o.legs:
            for x in g.kids:
                if x not in kids:
                    kids.append(x)
        for idx, s in enumerate(p.stops):
            if idx == 0 or s.arrive is None or s.arrive < o.start or s.arrive > o.end:
                continue
            at = fmt(s.arrive)
            place = labels.short_place(s.loc)
            own = s.event is not None and s.event.own is not None
            k = labels.kid(s.event.kid) if s.event and not own else ""
            if s.kind in ("drop", "stay") and o.first_drop is None and not own:
                # A parent's own event gets no Google reminder: it would be the signed-in account's.
                o.first_drop = s.event
            if s.kind == "pick" and s.event is not None:
                when = fmt12(max(s.arrive, s.ready or 0))
                if s.event.kid in riders:
                    riders[s.event.kid] += f". Pick-up at {when} at {place}"
                else:
                    riders[s.event.kid] = f"{name} picks you up at {place} at {when}"
            if s.kind == "fetch":
                for x in s.car:
                    riders.setdefault(x, f"{name} picks you up at {home_at} at {fmt12(s.arrive)}")
            if s.kind in ("drop", "stay", "pick") and k:
                prev = jobs[-1] if jobs and jobs[-1][1] == place else None
                same = prev is not None and s.event is not None and job_event == same_event(s.event.id)
                if prev is not None and prev[0] == s.kind:
                    prev[2].append(k)
                elif prev is not None and same and (prev[0], s.kind) == ("drop", "stay"):
                    # Kids at the same event, and the driver stays: "take Ava and Ben to ... and stay".
                    jobs[-1] = ("stay", place, [*prev[2], k])
                elif prev is not None and same and prev[0] == "stay" and s.kind == "pick" and k in prev[2]:
                    pass
                else:
                    jobs.append((s.kind, place, [k]))
                job_event = same_event(s.event.id) if s.event is not None else None
            if s.event is not None and s.kind in ("drop", "stay", "pick"):
                # The other parent riding along hears when they leave too.
                for x in s.event.pick_parents if s.kind == "pick" else s.event.parents:
                    o.parents.setdefault(x, f"Leave {home_at} at {fmt12(o.start)} with {name}")
            if s.kind in ("drop", "stay", "pick") and not own:
                when = at if s.kind != "pick" else fmt(max(s.arrive, s.ready or 0))
                kind, base = s.kind, same_event(s.event.id) if s.event is not None else None
                if (
                    said is not None
                    and base is not None
                    and said[1:4] == (place, when, base)
                    and (said[0], kind) in (("drop", "drop"), ("drop", "stay"), ("pick", "pick"))
                ):
                    # Kids at the same event, there at the same time: one line for them all.
                    lines.pop()
                    who = [*said[4], k]
                else:
                    who = [k]
                said = (kind, place, when, base, who)
                text = {"drop": "drop off", "stay": "stay with", "pick": "pick up"}[kind]
                if not (kind == "pick" and left is not None and left[:3] == (place, when, base) and k in left[3]):
                    # A kid the driver stayed with, leaving with them from that same event, needs
                    # no pick-up line after "Leave ...".
                    lines.append(f"{when}  {place}, {text} {' and '.join(who)}")
            elif own and s.event is not None:
                said = None
                jobs.append(("errand" if s.event.takes is not None else "go", place, [s.event.title]))
                lines.append(f"{fmt(max(s.arrive, s.ready or 0))}  {place}, {s.event.title}")
            elif s.kind == "fetch":
                lines.append(f"{at}  {home}, get " + " and ".join(labels.kid(x) for x in s.car))
            elif s.kind == "end":
                lines.append(f"{at}  {home}")
            if s.kind not in ("drop", "stay", "pick") or own:
                said = None
            left = None
            if s.kind == "stay" and s.after is not None and s.after < o.end:
                if said is not None and said[0] == "stay":
                    left = (place, fmt(s.after), said[3], said[4])
                said = None
                lines.append(f"{fmt(s.after)}  Leave {place}")
        last = o.legs[-1]
        home_line = f"{fmt(o.end)}  {home}"
        if last.type == "drive" and last.to_loc == HOME and (not lines or lines[-1] != home_line):
            lines.append(home_line)
        warn = ""
        for b in busy.get(d, ()):
            if b.start < o.end and b.end > o.start:
                warn = f"Still at {b.title} until {fmt(b.end)}"
        far = next((g for g in o.legs if g.type == "drive" and g.trip is None and g.end - g.start >= LONG_DRIVE), None)
        if far is not None:
            # A drive this long is most often Google matching the wrong place, and the trip's
            # stop times alone make it look like a short drive that leaves hours early.
            place = labels.short_place(far.to_loc or "")
            trip = f"{span(far.end - far.start)} drive to {place}. Is the address right?"
            warn = f"{trip} {warn}" if warn else trip
        if first.type == "drive" and first.from_loc == HOME:
            o.lead = f"Leave {fmt(o.start)}"
        else:
            o.lead = f"From {labels.short_place(first.from_loc or first.loc or '')} {fmt(o.start)}"
        o.lines = lines
        o.title = _outing_title(jobs)
        o.kids = kids
        o.riders = {x: riders.get(x, f"Ride with {name} at {fmt12(o.start)}") for x in kids}
        o.warn = warn
        o.target = next((g.serves for g in o.legs if g.serves is not None), None)
        o.go = _going(p.stops, o, first, labels, away)
        o.home = home
        # An errand's time is the planner's pick, so the driver hears about it.
        o.solo = bool(jobs) and all(j[0] == "go" for j in jobs) and not kids and not o.parents
    return sorted([*outings, *trip_outings], key=lambda o: o.start)


LONG_DRIVE: Final = 120
"""Minutes of driving in one go that a trip calls out, so it doesn't look like a short drive."""


def span(minutes: float) -> str:
    """A length of time, such as ``45 min``, ``2 hr`` or ``14 hr 36 min``."""
    h, m = divmod(math.floor(minutes + 0.5), 60)
    return " ".join([*([f"{h} hr"] if h else []), *([f"{m} min"] if m or not h else [])])


def _going(stops: Sequence[Stop], o: Outing, first: Segment, labels: Labels, away: str | None = None) -> Going | None:
    start = first.from_loc or first.loc
    if start is None:
        return None
    if start == HOME and away:
        # Leaving the hotel: the location checks look for the driver there, not at home.
        start = away
    fetch = False
    for idx, s in enumerate(stops):
        if idx == 0 or s.arrive is None or s.arrive < o.start or s.arrive > o.end:
            continue
        if s.kind == "fetch":
            fetch = True
        if s.kind not in ("drop", "stay", "pick"):
            continue
        if s.kind == "pick":
            due = s.ready
        elif s.event is not None and s.event.takes is not None:
            due = s.deadline
        elif s.event is not None:
            # When they have to be there, without the arrive-early margin: that's the slack.
            due = s.event.arrive_by if s.event.arrive_by is not None else s.event.start
        else:
            due = s.deadline
        return Going(
            from_loc=start,
            from_name="home" if start == HOME else labels.short_place(start),
            to_loc=s.loc,
            to_name=labels.short_place(s.loc),
            due=s.arrive if due is None else due,
            via_home=fetch,
        )
    return None


def _outing_title(jobs: list[tuple[str, str, list[str]]]) -> str:
    """ "Drive Ava to Piano", "Pick up Ava and Ben at School", or each stop in turn."""
    if not jobs:
        return "Drive"
    if len(jobs) == 1:
        kind, place, names = jobs[0]
        who = _and(names)
        if kind == "drop":
            return f"Drive {who} to {place}"
        if kind == "stay":
            return f"Drive {who} to {place} and stay"
        if kind in ("go", "errand"):
            return f"{who} at {place}"
        return f"Pick up {who} at {place}"
    verbs = {
        "drop": "drop off {} at {}",
        "stay": "take {} to {} and stay",
        "pick": "pick up {} at {}",
        "go": "{} at {}",
        "errand": "{} at {}",
    }
    text = ", ".join(verbs[kind].format(_and(names), place) for kind, place, names in jobs)
    return text[0].upper() + text[1:]


def same_event(ride_id: str) -> str:
    """The calendar event a ride event is a copy of: "dentist~2" is the second kid's "dentist"."""
    return ride_id.split("~", 1)[0]


def _and(names: list[str]) -> str:
    return names[0] if len(names) == 1 else ", ".join(names[:-1]) + " and " + names[-1]


def _card_lines(
    events: Sequence[RideEvent],
    plan: DayPlan,
    rides: list[Ride],
    labels: Labels,
    drivers: Sequence[str],
) -> dict[str, CardLines]:
    out: dict[str, CardLines] = {}
    for e in events:
        there: Ride | None = None
        back: Ride | None = None
        # Kids at the same event ride together, on rides that serve the first kid's copy, and
        # only the last copy holds the driver's wait.
        twins = [x for x in events if e.own is None and x.own is None and same_event(x.id) == same_event(e.id)]
        twin_ids = {x.id for x in twins} | {e.id}
        stays = e.stay or any(x.stay and (x.drop, x.pick) == (e.drop, e.pick) for x in twins)
        for r in rides:
            if r.kid != e.kid or not (r.own or len(twin_ids) > 1):
                continue
            if not any(g.serves is not None and g.serves.id in twin_ids for g in r.legs):
                continue
            if r.start < e.start:
                there = r
            else:
                back = r

        def line(side: str, r: Ride | None, e: RideEvent = e, stays: bool = stays) -> CardLine | None:
            v = e.drop if side == "drop" else e.pick
            if v == NOT_NEEDED:
                return None
            if v == UNASSIGNED:
                return CardLine("No ride there yet" if side == "drop" else "No ride home yet", "pending")
            if v not in drivers:
                return CardLine(("Goes with " if side == "drop" else "Home with ") + v, "normal")
            extra = ""
            for x in plan.hard:
                if x.event is None or x.event.id != e.id or x.driver != v:
                    continue
                if side == "drop" and x.kind == "late":
                    extra = f", {minutes_text(x.minutes)} min late"
                if side == "pick" and x.kind == "waiting":
                    extra = f", waits {minutes_text(x.minutes)} min"
            tone: Tone = "problem" if extra else "normal"
            name = labels.driver(v)
            if r is None:
                # Picked up and driven straight on to another stop, so no ride of the kid's own:
                # the time still comes from the driver's route.
                at = _picked_up_at(e, plan[v].stops) if side == "pick" and v in plan.drivers else None
                if at is not None:
                    return CardLine(f"Picked up {fmt(at)} by {name}{extra}", tone)
                return CardLine(("Drop-off: " if side == "drop" else "Pick-up: ") + name + extra, tone)
            if side == "drop":
                first = r.legs[0]
                from_home = first.type == "drive" and first.from_loc == HOME
                if stays:
                    return CardLine(f"{name} stays · leaves {fmt(r.start)}{extra}", tone)
                lead = f"Leaves {fmt(r.start)} with " if from_home else "With "
                return CardLine(lead + name + extra, tone)
            last = r.legs[-1]
            if last.type == "drive" and last.to_loc == HOME:
                return CardLine(f"Home {fmt(r.end)} with {name}{extra}", tone)
            return CardLine(f"Picked up {fmt(r.start)} by {name}{extra}", tone)

        if not e.attending:
            out[e.id] = CardLines(CardLine("Not attending", "muted"), None)
            continue
        if e.own is not None and e.own in drivers:
            out[e.id] = _own_lines(e, plan, labels)
            continue
        if e.loc == HOME:
            out[e.id] = CardLines(CardLine("At home", "muted"), None)
            continue
        if e.drop == NOT_NEEDED and e.pick == NOT_NEEDED:
            out[e.id] = CardLines(CardLine("No ride needed", "muted"), None)
            continue
        # Staying, the pick-up line only shows once there's a drive home to time.
        waits = stays and e.drop in drivers and back is None
        pick = None if waits else line("pick", back)
        out[e.id] = CardLines(line("drop", there), pick)
    return out


def _picked_up_at(e: RideEvent, stops: Sequence[Stop]) -> float | None:
    for s in stops:
        if s.kind == "pick" and s.event is not None and s.event.id == e.id and s.arrive is not None:
            return max(s.arrive, s.ready or 0)
    return None


def planned_at(e: RideEvent, plan: DayPlan) -> float | None:
    """When a parent's errand is planned to start, or None when it isn't planned."""
    if e.own is None or e.own not in plan.drivers:
        return None
    for s in plan[e.own].stops:
        if s.event is not None and s.event.id == e.id and s.arrive is not None:
            return max(s.arrive, s.ready or 0)
    return None


def _own_lines(e: RideEvent, plan: DayPlan, labels: Labels) -> CardLines:
    """A parent's own event: when they leave for it, and when they're home or off again."""
    assert e.own is not None
    p = plan[e.own]
    late = next(
        (x for x in p.issues if x.kind == "late" and x.event is not None and x.event.id == e.id),
        None,
    )
    extra = f", {minutes_text(late.minutes)} min late" if late else ""
    tone: Tone = "problem" if late else "normal"
    stop = next((st for st in p.stops if st.event is not None and st.event.id == e.id), None)
    there = next((g for g in stop.legs if g.type == "drive"), None) if stop else None
    drop: CardLine | None = None
    when = planned_at(e, plan)
    if e.takes is not None and when is not None:
        drop = CardLine(f"Stop at {fmt(when)}{extra}", tone)
    elif there is not None:
        start = there.from_loc or HOME
        lead = "Leaves" if start == HOME else f"From {labels.short_place(start)}"
        drop = CardLine(f"{lead} {fmt(there.start)}{extra}", tone)
    if drop is None and e.attending and e.drop == NOT_NEEDED:
        # Only busy time: no drive, just time they can't drive.
        drop = CardLine("Can’t drive then", "muted")
    pick: CardLine | None = None
    at = next(
        (i for i, g in enumerate(p.segments) if g.type == "stay" and g.event is not None and g.event.id == e.id), None
    )
    if at is not None:
        after = next((g for g in p.segments[at + 1 :] if g.type == "drive"), None)
        if after is not None:
            text = f"Home {fmt(after.end)}" if after.to_loc == HOME else f"Leaves {fmt(after.start)}"
            pick = CardLine(text, "normal")
    return CardLines(drop, pick)
