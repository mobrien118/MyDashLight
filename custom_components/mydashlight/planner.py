"""Rides planner: turns a day of kids' activities into each parent's driving plan.

A port of the planner in the ride board mockup (``tests/fixtures/rides/planner-reference.js``).
It is a pure module with no Home Assistant imports: events, the parents' busy times and a
travel-time function go in, and timed routes, issues and suggested fixes come out.

Times are minutes after midnight on the event's day. An evening event that runs past
midnight keeps counting up (an end of 1450 is 12:10 AM the next day).

Each ride side (drop-off or pick-up) holds one of:

* a routed driver id, such as ``"mom"`` or ``"dad"``: the planner works out their route;
* :data:`NOT_NEEDED`: the kid gets there on their own;
* :data:`UNASSIGNED`: nobody is driving yet, which is an issue to fix;
* any other text: a carpool driver by name. They are shown but not routed, since their
  schedules are unknown.
"""

from __future__ import annotations

from collections.abc import Callable, Mapping, Sequence
from dataclasses import dataclass, field, replace
import math
from typing import Final, Literal

HOME = "home"
UNASSIGNED = ""
NOT_NEEDED = "none"
DEFAULT_DRIVERS: tuple[str, ...] = ("mom", "dad")

INF = math.inf

TravelFn = Callable[[str, str], float]
"""Drive minutes from one place to another. Places are opaque keys; :data:`HOME` is home."""

Side = Literal["drop", "pick"]


@dataclass(frozen=True, slots=True)
class RideEvent:
    """One of a kid's activities, with who drives each way."""

    id: str
    kid: str
    title: str
    loc: str
    start: int
    end: int
    drop: str = UNASSIGNED
    pick: str = UNASSIGNED
    stay: bool = False
    arrive_by: int | None = None


@dataclass(frozen=True, slots=True)
class BusyBlock:
    """Time on a parent's own calendar when they can't be on the road."""

    start: int
    end: int
    title: str


@dataclass(frozen=True, slots=True)
class PlannerSettings:
    """Planner thresholds, in minutes. The defaults match the agreed design."""

    arrive_early: int = 5
    """Aim to arrive this long before the start when an event has no Arrive by time."""
    go_home_margin: int = 15
    """Go home between stops when that frees at least this much more idle time."""
    take_along_window: int = 45
    """With take-along on, kids whose drop-offs are this close leave home together."""
    waiting_after: int = 5
    """Reaching a pick-up more than this long after it ends leaves the kid waiting."""
    too_early: int = 15
    """Arriving more than this long before the target is a heads-up."""
    tight_slack: int = 3
    """Less slack than this before the next stop is a heads-up."""


DEFAULT_SETTINGS: Final = PlannerSettings()


@dataclass(frozen=True, slots=True)
class Labels:
    """Display names used in issue text, suggestion labels and card lines."""

    kids: Mapping[str, str] = field(default_factory=dict)
    drivers: Mapping[str, str] = field(default_factory=dict)
    places: Mapping[str, str] = field(default_factory=dict)
    short_places: Mapping[str, str] = field(default_factory=dict)

    def kid(self, kid: str) -> str:
        return self.kids.get(kid, kid)

    def driver(self, driver: str) -> str:
        return self.drivers.get(driver, driver)

    def place(self, loc: str) -> str:
        return self.places.get(loc, loc)

    def short_place(self, loc: str) -> str:
        return self.short_places.get(loc) or self.places.get(loc, loc)


@dataclass(eq=False, slots=True)
class Stop:
    """A place on a driver's route. ``car`` is who is in the car when leaving it."""

    loc: str
    kind: Literal["start", "fetch", "drop", "stay", "pick", "end"]
    car: list[str] = field(default_factory=list)
    event: RideEvent | None = None
    deadline: float | None = None
    """Latest arrival (drop-off and stay)."""
    ready: float | None = None
    """When the kid is ready to be collected (pick-up)."""
    after: float | None = None
    """When a stay ends."""
    arrive: float | None = None
    legs: list[Segment] = field(default_factory=list)
    """The drives and waits that serve this stop."""


@dataclass(eq=False, slots=True)
class Segment:
    """A stretch of a driver's day: driving, waiting, staying, or at home."""

    type: Literal["drive", "wait", "stay", "home"]
    start: float
    end: float
    from_loc: str | None = None
    to_loc: str | None = None
    loc: str | None = None
    kids: list[str] = field(default_factory=list)
    from_home: bool = False
    event: RideEvent | None = None
    anchor: Stop | None = None
    """The drop-off or pick-up this segment serves."""
    overlaps_busy: bool = False

    @property
    def serves(self) -> RideEvent | None:
        return self.anchor.event if self.anchor else None


IssueKind = Literal["late", "waiting", "busy", "unassigned", "early", "tight", "tightBusy"]


@dataclass(eq=False, slots=True)
class Issue:
    """A problem to fix (``hard``) or a heads-up (``soft``)."""

    kind: IssueKind
    driver: str | None = None
    event: RideEvent | None = None
    stop: Stop | None = None
    minutes: float | None = None
    side: Side | None = None
    busy: BusyBlock | None = None
    segment: Segment | None = None
    at: float | None = None

    @property
    def key(self) -> str:
        """Stable id for this issue, the same across replans of the same day."""
        return "|".join(
            (
                self.kind,
                self.driver or "",
                self.event.id if self.event else "",
                self.side or "",
                self.busy.title if self.busy else "",
            )
        )


@dataclass(eq=False, slots=True)
class DriverPlan:
    """One parent's day."""

    driver: str
    segments: list[Segment] = field(default_factory=list)
    stops: list[Stop] = field(default_factory=list)
    issues: list[Issue] = field(default_factory=list)
    soft: list[Issue] = field(default_factory=list)
    overlaps: list[tuple[float, float]] = field(default_factory=list)
    drive: float = 0
    leave: float | None = None
    """When they first leave home, or None when they have no rides."""
    trips: int = 0


@dataclass(eq=False, slots=True)
class DayPlan:
    """Every parent's plan for a day, plus the issues across all of them."""

    drivers: dict[str, DriverPlan]
    hard: list[Issue]
    soft: list[Issue]
    score: float

    def __getitem__(self, driver: str) -> DriverPlan:
        return self.drivers[driver]


@dataclass(frozen=True, slots=True)
class Change:
    """A single edit to try: give one side of an event to a driver, or toggle take-along."""

    event_id: str | None = None
    side: Side | None = None
    value: str | None = None
    along: str | None = None

    def as_dict(self) -> dict[str, str]:
        if self.along is not None:
            return {"along": self.along}
        return {"id": self.event_id or "", "field": self.side or "", "value": self.value or ""}


@dataclass(slots=True)
class Suggestion:
    """A fix worth offering for an issue, with what it costs."""

    label: str
    change: Change
    who: str
    note: str
    score: float


@dataclass(frozen=True, slots=True)
class IssueText:
    title: str
    body: str
    note: str | None = None


def arrive_at(event: RideEvent, settings: PlannerSettings) -> int:
    """When the driver aims to have the kid there."""
    if event.arrive_by is not None:
        return event.arrive_by
    return event.start - settings.arrive_early


def fmt(minutes: float) -> str:
    """Clock time without AM or PM, such as ``4:35``."""
    m = math.floor(minutes + 0.5)
    h, mm = divmod(m, 60)
    return f"{(h + 11) % 12 + 1}:{mm:02d}"


def fmt12(minutes: float) -> str:
    """Clock time with AM or PM, such as ``4:35 PM``."""
    m = math.floor(minutes + 0.5)
    return f"{fmt(m)} {'PM' if (m // 60) % 24 >= 12 else 'AM'}"


@dataclass(slots=True)
class _Task:
    type: Literal["drop", "stay", "pick"]
    event: RideEvent
    t: int


def plan_driver(
    driver: str,
    events: Sequence[RideEvent],
    along: bool,
    busy: Mapping[str, Sequence[BusyBlock]],
    travel: TravelFn,
    settings: PlannerSettings = DEFAULT_SETTINGS,
) -> DriverPlan:
    """String one parent's drop-offs and pick-ups into a route and time it."""
    tasks: list[_Task] = []
    for e in events:
        if e.stay and e.drop == driver and e.pick == driver:
            tasks.append(_Task("stay", e, arrive_at(e, settings)))
        else:
            if e.drop == driver:
                tasks.append(_Task("drop", e, arrive_at(e, settings)))
            if e.pick == driver:
                tasks.append(_Task("pick", e, e.end))
    tasks.sort(key=lambda k: k.t)
    out = DriverPlan(driver)
    if not tasks:
        return out

    stops = _build_stops(tasks, along, settings)
    n = len(stops)

    # Backward pass: the latest arrival and departure at each stop that still make every deadline.
    latest_arrive = [s.deadline if s.deadline is not None else INF for s in stops]
    latest_depart = [INF] * n
    for i in range(n - 1, 0, -1):
        latest_depart[i - 1] = min(latest_depart[i - 1], latest_arrive[i] - travel(stops[i - 1].loc, stops[i].loc))
        latest_arrive[i - 1] = min(latest_arrive[i - 1], latest_depart[i - 1])

    def target(j: int) -> float:
        v = latest_depart[j]
        nxt = stops[j + 1] if j + 1 < n else None
        if nxt is not None and nxt.ready is not None:
            v = min(v, nxt.ready - travel(stops[j].loc, nxt.loc))
        return v

    def event_stop(q: int, step: int) -> Stop | None:
        while 0 <= q < n:
            if stops[q].event is not None:
                return stops[q]
            q += step
        return None

    def tag(seg: Segment, stop: Stop | None) -> None:
        # Each bit of driving or waiting is tied to the drop-off or pick-up it serves.
        if stop is not None:
            seg.anchor = stop
            stop.legs.append(seg)
        out.segments.append(seg)

    # Forward pass: leave each place as late as still works.
    t = target(0)
    if not math.isfinite(t):
        t = (stops[1].ready if stops[1].ready is not None else 0) - travel(HOME, stops[1].loc)
    out.leave = t
    here = HOME
    car_now = stops[0].car
    dropped_home: list[str] = []
    for j in range(1, n):
        s = stops[j]
        tr = travel(here, s.loc)
        arr = t + tr
        if tr > 0:
            serves: Stop | None
            if s.event is not None:
                serves = s
            elif s.kind == "fetch":
                serves = event_stop(j + 1, 1)
            else:
                serves = event_stop(j - 1, -1)
            tag(
                Segment(
                    "drive",
                    t,
                    arr,
                    from_loc=here,
                    to_loc=s.loc,
                    kids=car_now,
                    from_home=here == HOME,
                ),
                serves,
            )
            out.drive += tr
            if here == HOME:
                out.trips += 1
        s.arrive = arr
        if s.deadline is not None and arr > s.deadline:
            out.issues.append(Issue("late", driver, s.event, s, arr - s.deadline))
        if s.kind == "pick" and s.ready is not None and arr > s.ready + settings.waiting_after:
            out.issues.append(Issue("waiting", driver, s.event, s, arr - s.ready))
        if (
            s.kind == "drop"
            and s.deadline is not None
            and s.event is not None
            and s.deadline - arr > settings.too_early
        ):
            out.soft.append(Issue("early", driver, s.event, s, s.event.start - arr))
        ready = arr
        if s.ready is not None:
            ready = max(ready, s.ready)
        if s.after is not None:
            ready = max(ready, s.after)
        if s.kind != "stay" and ready > arr:
            if s.loc == HOME:
                out.segments.append(Segment("home", arr, ready))
            else:
                tag(
                    Segment("wait", arr, ready, loc=s.loc, kids=car_now),
                    s if s.event is not None else event_stop(j + 1, 1),
                )
        dep = ready
        if j < n - 1:
            tg = target(j)
            if math.isfinite(tg):
                if (
                    s.kind in ("stay", "pick")
                    and 0 <= tg - ready < settings.tight_slack
                    and math.isfinite(latest_depart[j])
                ):
                    out.soft.append(Issue("tight", driver, s.event, s, at=ready))
                dep = max(ready, tg)
        if s.kind == "stay" and ready > arr and s.event is not None:
            kid = s.event.kid
            tag(
                Segment(
                    "stay",
                    arr,
                    ready,
                    loc=s.loc,
                    event=s.event,
                    kids=[k for k in s.car if k != kid and k not in dropped_home],
                ),
                s,
            )
        if s.kind == "fetch":
            dropped_home = []
        car_now = [k for k in s.car if k not in dropped_home]
        here = s.loc
        idle = dep - ready
        if idle > 0:
            nxt = stops[j + 1] if j + 1 < n else None
            back = travel(s.loc, HOME)
            out_again = travel(HOME, nxt.loc) if nxt else 0
            direct = travel(s.loc, nxt.loc) if nxt else 0
            if s.loc != HOME and nxt is not None and idle + direct - back - out_again >= settings.go_home_margin:
                # Enough spare time to go home in between.
                tag(
                    Segment("drive", ready, ready + back, from_loc=s.loc, to_loc=HOME, kids=car_now),
                    s if s.event is not None else event_stop(j - 1, -1),
                )
                out.drive += back
                leave_home = dep + direct - out_again
                out.segments.append(Segment("home", ready + back, leave_home))
                dropped_home = dropped_home + car_now
                t = leave_home
                here = HOME
                car_now = []
                continue
            if s.loc == HOME:
                out.segments.append(Segment("home", ready, dep))
            else:
                tag(Segment("wait", ready, dep, loc=s.loc, kids=car_now), event_stop(j + 1, 1))
        t = dep
    out.stops = stops

    # The parent's own calendar: being on the road during a busy block is a conflict.
    for b in busy.get(driver, ()):
        first: Segment | None = None
        for g in out.segments:
            if g.type == "home" or g.start >= b.end or g.end <= b.start:
                continue
            out.overlaps.append((max(g.start, b.start), min(g.end, b.end)))
            if first is None:
                first = g
        if first is not None:
            first.overlaps_busy = True
            next_stop = next(
                (st for st in stops if st.event is not None and st.arrive is not None and st.arrive >= first.end),
                None,
            )
            out.issues.append(
                Issue(
                    "busy",
                    driver,
                    next_stop.event if next_stop else None,
                    minutes=min(first.end, b.end) - max(first.start, b.start),
                    busy=b,
                    segment=first,
                )
            )
        elif 0 <= out.leave - b.end < settings.tight_slack:
            out.soft.append(Issue("tightBusy", driver, busy=b))
    return out


def _build_stops(tasks: list[_Task], along: bool, settings: PlannerSettings) -> list[Stop]:
    """Sort tasks into stops that start and end at home, tracking who is in the car."""
    stops = [Stop(HOME, "start")]
    car: list[str] = []
    for i, k in enumerate(tasks):
        kid = k.event.kid
        if k.type != "pick":
            if kid not in car:
                # Dropping off a kid who isn't in the car means collecting them from home first.
                if stops[-1].loc != HOME:
                    stops.append(Stop(HOME, "fetch"))
                car = [kid]
                if along:
                    for o in tasks[i + 1 :]:
                        if o.type != "pick" and o.t - k.t <= settings.take_along_window and o.event.kid not in car:
                            car.append(o.event.kid)
                stops[-1].car = list(car)
            car = [x for x in car if x != kid]
            stop = Stop(k.event.loc, k.type, event=k.event, deadline=k.t)
            if k.type == "stay":
                stop.after = k.event.end
                car.append(kid)
            stop.car = list(car)
            stops.append(stop)
        else:
            car.append(kid)
            stops.append(Stop(k.event.loc, "pick", list(car), event=k.event, ready=k.event.end))
    if stops[-1].loc != HOME:
        stops.append(Stop(HOME, "end"))
    return stops


def plan_all(
    events: Sequence[RideEvent],
    along: Mapping[str, bool],
    busy: Mapping[str, Sequence[BusyBlock]],
    travel: TravelFn,
    settings: PlannerSettings = DEFAULT_SETTINGS,
    drivers: Sequence[str] = DEFAULT_DRIVERS,
) -> DayPlan:
    """Plan every routed driver's day and collect the issues across them."""
    plans = {d: plan_driver(d, events, bool(along.get(d)), busy, travel, settings) for d in drivers}
    hard = [x for d in drivers for x in plans[d].issues]
    for e in events:
        if e.drop == UNASSIGNED:
            hard.append(Issue("unassigned", event=e, side="drop"))
        if e.pick == UNASSIGNED:
            hard.append(Issue("unassigned", event=e, side="pick"))
    soft = [x for d in drivers for x in plans[d].soft]
    late_minutes = sum(x.minutes or 0 for x in hard)
    score = len(hard) * 1000 + late_minutes * 10 + sum(p.drive for p in plans.values())
    return DayPlan(plans, hard, soft, score)


def issue_text(issue: Issue, labels: Labels) -> IssueText:
    """The words shown for an issue. ``note`` is the short form used under a suggestion."""
    e = issue.event
    kid = labels.kid(e.kid) if e else ""
    who = labels.driver(issue.driver) if issue.driver else ""
    s = issue.stop
    match issue.kind:
        case "busy" if issue.busy and issue.segment:
            b = issue.busy
            what = f" for {kid}’s {e.title.lower()}" if e else ""
            return IssueText(
                f"{who} is still at {b.title}",
                f"Leaving at {fmt(issue.segment.start)}{what} overlaps {b.title} until {fmt(b.end)}.",
            )
        case "late" if e and s and s.arrive is not None and s.deadline is not None:
            target = (
                f"the {fmt(e.arrive_by)} arrive-by time."
                if e.arrive_by is not None
                else f"the {fmt(s.deadline)} target."
            )
            return IssueText(
                f"{kid} will be late to {e.title}",
                f"{who} gets there at {fmt(s.arrive)}, {minutes_text(issue.minutes)} min after {target}",
            )
        case "waiting" if e and s and s.arrive is not None:
            return IssueText(
                f"{kid} will be waiting",
                f"{who} reaches {e.title} at {fmt(s.arrive)}, {minutes_text(issue.minutes)} min after it ends.",
            )
        case "unassigned" if e:
            if issue.side == "drop":
                return IssueText(
                    f"No drop-off for {kid}",
                    f"{e.title} starts at {fmt(e.start)}, {labels.place(e.loc)}.",
                )
            return IssueText(f"No pick-up for {kid}", f"{e.title} ends at {fmt(e.end)}, {labels.place(e.loc)}.")
        case "early" if e and s and s.arrive is not None:
            mins = minutes_text(issue.minutes)
            return IssueText(
                f"{kid} waits {mins} min",
                f"{who} gets {kid} to {e.title} at {fmt(s.arrive)}, well before the {fmt(e.start)} start.",
                f"{kid} waits {mins} min at {e.title}",
            )
        case "tight" if e and issue.at is not None:
            return IssueText(
                "No time to spare",
                f"{who} has to leave {e.title} right at {fmt(issue.at)} to make the next stop.",
                f"{who} leaves {e.title} right at {fmt(issue.at)}",
            )
        case "tightBusy" if issue.busy:
            b = issue.busy
            return IssueText(
                "No time to spare",
                f"{who} has to leave right when {b.title} ends at {fmt(b.end)}.",
                f"{who} leaves right as {b.title} ends",
            )
    return IssueText("", "")


def minutes_text(v: float | None) -> str:
    """A minute count as written in text: ``16``, not ``16.0``."""
    if v is None:
        return "0"
    return str(int(v)) if float(v).is_integer() else str(v)


def apply_change(
    events: Sequence[RideEvent],
    along: Mapping[str, bool],
    change: Change,
    drivers: Sequence[str] = DEFAULT_DRIVERS,
) -> tuple[list[RideEvent], dict[str, bool]]:
    """Return the events and take-along flags with one change applied."""
    new_events: list[RideEvent] = []
    for e in events:
        if change.event_id is None or e.id != change.event_id:
            new_events.append(e)
            continue
        n = e
        if change.side == "drop":
            n = replace(n, drop=change.value or UNASSIGNED)
        elif change.side == "pick":
            n = replace(n, pick=change.value or UNASSIGNED)
        # Stay only makes sense when the same routed parent drives both ways.
        if n.drop != n.pick or n.drop not in drivers:
            n = replace(n, stay=False)
        new_events.append(n)
    new_along = dict(along)
    if change.along is not None:
        new_along[change.along] = not new_along.get(change.along, False)
    return new_events, new_along


def suggestions_for(
    issue: Issue,
    events: Sequence[RideEvent],
    along: Mapping[str, bool],
    base: DayPlan,
    busy: Mapping[str, Sequence[BusyBlock]],
    travel: TravelFn,
    labels: Labels,
    settings: PlannerSettings = DEFAULT_SETTINGS,
    drivers: Sequence[str] = DEFAULT_DRIVERS,
    limit: int = 2,
) -> list[Suggestion]:
    """Single changes that clear this issue without adding a worse one, best first."""
    cands: list[tuple[str | None, Change, str]] = []
    if issue.kind == "unassigned" and issue.event is not None and issue.side is not None:
        verb = " drops off" if issue.side == "drop" else " picks up"
        for drv in drivers:
            cands.append((labels.driver(drv) + verb, Change(issue.event.id, issue.side, drv), drv))
    elif issue.driver is not None:
        d = issue.driver
        others = [o for o in drivers if o != d]
        for e in events:
            for side in ("drop", "pick"):
                if getattr(e, side) != d:
                    continue
                leg = "drop-off" if side == "drop" else "pick-up"
                for o in others:
                    cands.append(
                        (
                            f"{labels.driver(o)} does {labels.kid(e.kid)}’s {leg}",
                            Change(e.id, side, o),
                            o,
                        )
                    )
        if not along.get(d):
            cands.append((None, Change(along=d), d))

    base_soft = {x.key for x in base.soft}
    key = issue.key
    good: list[Suggestion] = []
    for label, change, who in cands:
        next_events, next_along = apply_change(events, along, change, drivers)
        p = plan_all(next_events, next_along, busy, travel, settings, drivers)
        if key in {x.key for x in p.hard} or len(p.hard) >= len(base.hard):
            continue
        if label is None:
            multi = next((g for g in p[who].segments if g.type == "drive" and len(g.kids) > 1), None)
            if multi is None:
                continue
            label = "Take " + " and ".join(labels.kid(k) for k in multi.kids[1:]) + " along"
        extra = [x for x in p.soft if x.key not in base_soft]
        delta = p[who].drive - base[who].drive
        if extra:
            note = issue_text(extra[0], labels).note or ""
        elif delta > 0:
            note = f"+{minutes_text(delta)} min of driving for {labels.driver(who)}"
        elif delta < 0:
            note = f"{minutes_text(-delta)} min less driving for {labels.driver(who)}"
        else:
            note = "No new problems"
        good.append(Suggestion(label, change, who, note, p.score))
    good.sort(key=lambda c: c.score)
    return good[:limit]
