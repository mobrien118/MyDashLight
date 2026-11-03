"""What the ride board shows for a day, worked out from the planner's routes.

A port of ``buildDay`` in the ride board mockup, minus the parts that only depend on the
screen layout. It answers: which kid is in which car and when, which kids are double-booked,
each driver's outings as a list of stops, and the one-line ride summary on each activity card.

The backend writes this wording so the kitchen screen, phones and notifications all say the
same thing. The app only lays it out. Pure module, no Home Assistant imports.
"""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field
from typing import Literal

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
    TravelFn,
    fmt,
    minutes_text,
    plan_all,
)

Tone = Literal["normal", "pending", "problem", "muted"]
"""How a card line reads: as usual, still needs a driver, has a problem, or nothing to do."""


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
    lines: list[str] = field(default_factory=list)
    kids: list[str] = field(default_factory=list)
    warn: str = ""
    target: RideEvent | None = None


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
    along: Mapping[str, bool],
    busy: Mapping[str, Sequence[BusyBlock]],
    travel: TravelFn,
    labels: Labels,
    settings: PlannerSettings = DEFAULT_SETTINGS,
    drivers: Sequence[str] = DEFAULT_DRIVERS,
    kids: Sequence[str] = (),
) -> DayBoard:
    """Plan the day and work out everything the board shows for it."""
    plan = plan_all(events, along, busy, travel, settings, drivers)
    rides = _rides(plan, drivers)
    kid_items = _kid_items(events, rides, kids)
    return DayBoard(
        plan=plan,
        rides=rides,
        kid_items=kid_items,
        clashes=_clashes(kid_items),
        outings={d: _outings(plan, d, busy, labels) for d in drivers},
        lines=_card_lines(events, plan, rides, labels, drivers),
    )


def _rides(plan: DayPlan, drivers: Sequence[str]) -> list[Ride]:
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
                    own = g.serves.kid == k
                if prev is not None and prev.own == own:
                    prev.end = g.end
                    prev.legs.append(g)
                else:
                    rides.append(Ride(k, d, g.start, g.end, [g], own))
    return rides


def _kid_items(events: Sequence[RideEvent], rides: list[Ride], kids: Sequence[str]) -> dict[str, list[KidItem]]:
    # Activities plus time in a car. A late arrival is trimmed at the start time:
    # that's lateness, not a clash.
    items: dict[str, list[KidItem]] = {k: [] for k in kids}
    for e in events:
        items.setdefault(e.kid, []).append(KidItem("act", e.start, e.end, event=e))
    for r in rides:
        s, en = r.start, r.end
        for g in r.legs:
            served = g.serves
            if served is None or served.kid != r.kid:
                continue
            if r.start < served.start < en:
                en = served.start
            if r.end > served.end > s:
                s = served.end
        if en > s:
            items.setdefault(r.kid, []).append(KidItem("ride", s, en, ride=r))
    return items


def _clashes(kid_items: dict[str, list[KidItem]]) -> list[Clash]:
    clashes: list[Clash] = []
    for kid, it in kid_items.items():
        for i, x in enumerate(it):
            for y in it[i + 1 :]:
                if x.start < y.end and y.start < x.end and "act" in (x.type, y.type):
                    x.clash = y.clash = True
                    a, b = (x, y) if x.type == "act" else (y, x)
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
    cur: Outing | None = None
    for g in p.segments:
        if g.type == "home":
            cur = None
            continue
        if cur is not None and cur.end == g.start:
            cur.end = g.end
            cur.legs.append(g)
        else:
            cur = Outing(g.start, g.end, [g])
            outings.append(cur)

    for o in outings:
        lines: list[str] = []
        kids: list[str] = []
        for g in o.legs:
            for x in g.kids:
                if x not in kids:
                    kids.append(x)
        for idx, s in enumerate(p.stops):
            if idx == 0 or s.arrive is None or s.arrive < o.start or s.arrive > o.end:
                continue
            at = fmt(s.arrive)
            place = labels.short_place(s.loc)
            k = labels.kid(s.event.kid) if s.event else ""
            if s.kind == "drop":
                lines.append(f"{at}  {place}, drop off {k}")
            elif s.kind == "stay":
                lines.append(f"{at}  {place}, stay with {k}")
            elif s.kind == "pick":
                lines.append(f"{fmt(max(s.arrive, s.ready or 0))}  {place}, pick up {k}")
            elif s.kind == "fetch":
                lines.append(f"{at}  Home, get " + " and ".join(labels.kid(x) for x in s.car))
            elif s.kind == "end":
                lines.append(f"{at}  Home")
            if s.kind == "stay" and s.after is not None and s.after < o.end:
                lines.append(f"{fmt(s.after)}  Leave {place}")
        last = o.legs[-1]
        home_line = f"{fmt(o.end)}  Home"
        if last.type == "drive" and last.to_loc == HOME and (not lines or lines[-1] != home_line):
            lines.append(home_line)
        warn = ""
        for b in busy.get(d, ()):
            if b.start < o.end and b.end > o.start:
                warn = f"Still at {b.title} until {fmt(b.end)}"
        first = o.legs[0]
        if first.type == "drive" and first.from_loc == HOME:
            o.lead = f"Leave {fmt(o.start)}"
        else:
            o.lead = f"From {labels.short_place(first.from_loc or first.loc or '')} {fmt(o.start)}"
        o.lines = lines
        o.kids = kids
        o.warn = warn
        o.target = next((g.serves for g in o.legs if g.serves is not None), None)
    return outings


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
        for r in rides:
            if r.kid != e.kid or not r.own:
                continue
            if not any(g.serves is not None and g.serves.id == e.id for g in r.legs):
                continue
            if r.start < e.start:
                there = r
            else:
                back = r

        def line(side: str, r: Ride | None, e: RideEvent = e) -> CardLine | None:
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
                return CardLine(("Drop-off: " if side == "drop" else "Pick-up: ") + name + extra, tone)
            if side == "drop":
                first = r.legs[0]
                from_home = first.type == "drive" and first.from_loc == HOME
                if e.stay:
                    return CardLine(f"{name} stays · leaves {fmt(r.start)}{extra}", tone)
                lead = f"Leaves {fmt(r.start)} with " if from_home else "With "
                return CardLine(lead + name + extra, tone)
            last = r.legs[-1]
            if last.type == "drive" and last.to_loc == HOME:
                return CardLine(f"Home {fmt(r.end)} with {name}{extra}", tone)
            return CardLine(f"Picked up {fmt(r.start)} by {name}{extra}", tone)

        if e.drop == NOT_NEEDED and e.pick == NOT_NEEDED:
            out[e.id] = CardLines(CardLine("No ride needed", "muted"), None)
            continue
        if e.stay and e.drop in drivers:
            pick = line("pick", back) if back is not None else None
        else:
            pick = line("pick", back)
        out[e.id] = CardLines(line("drop", there), pick)
    return out
