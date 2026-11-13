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
LATE_AFTER = 0.5
"""Getting somewhere less than this many minutes late isn't late: it rounds to the same minute."""

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
    along: tuple[str, ...] = ()
    """Kids taken along on this drop-off. They leave home in the same car, so the driver can go
    on to their own drop-offs without coming home for them."""
    attending: bool = True
    """False when the kid isn't going this time. Its rides are then not needed, so the
    planner never routes it, and the board doesn't count it as a clash."""
    own: str | None = None
    """The driver whose own event this is, from their own calendar. They drive themselves
    there and stay, so ``kid``, ``drop`` and ``pick`` are that driver too and ``stay`` is set.
    The kids in ``along`` go too, leaving home in the car."""
    parents: tuple[str, ...] = ()
    """Other drivers riding along: to a parent's own event, or on a kid's drop-off. They're
    busy for the trip."""
    pick_along: tuple[str, ...] = ()
    """Kids riding along on the pick-up. They leave home in the car if they aren't in it."""
    pick_parents: tuple[str, ...] = ()
    """Other drivers riding along on the pick-up."""
    takes: int | None = None
    """A parent's errand: the minutes it takes, any time from ``start`` to ``end``. The planner
    picks the time, fitting it into the parent's other trips where it can."""

    def attends(self, kid: str) -> bool:
        """Whether ``kid`` is at this event: their own activity, or a parent's they go along to."""
        return self.kid == kid or (self.own is not None and kid in self.along)


@dataclass(frozen=True, slots=True)
class BusyBlock:
    """Time on a parent's own calendar when they can't be on the road."""

    start: int
    end: int
    title: str


@dataclass(frozen=True, slots=True)
class PlannerSettings:
    """Planner thresholds, in minutes. The defaults match the agreed design."""

    fixed_early: int | None = None
    """A margin for traffic that doesn't grow with the drive, for tests and the sample week.
    Unset, it's :func:`early_for_drive`."""
    go_home_margin: int = 15
    """Go home between stops when that frees at least this much more idle time."""
    take_along_window: int = 45
    """Suggest taking a kid along on a drop-off at most this long before theirs."""
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
    aim: float | None = None
    """When to aim to arrive for a pick-up: the margin for traffic before ``ready``."""
    after: float | None = None
    """When a stay ends."""
    dwell: float = 0
    """Minutes spent there, for an errand: from arriving, or from ``ready`` if that's later."""
    late: bool = False
    """An errand done as late as still works, on the way to the next stop. Otherwise it's done
    as early as it can be: at ``ready``, or straight from the stop before."""
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
    busy: Mapping[str, Sequence[BusyBlock]] = field(default_factory=dict)
    """The parents' busy times as planned: their calendars, plus trips they ride along on."""

    def __getitem__(self, driver: str) -> DriverPlan:
        return self.drivers[driver]


@dataclass(frozen=True, slots=True)
class Change:
    """A single edit to try: give one side of an event to a driver, or take kids along on it."""

    event_id: str
    field: Literal["drop", "pick", "along"]
    value: str | tuple[str, ...]

    def as_dict(self) -> dict[str, str | list[str]]:
        value = list(self.value) if isinstance(self.value, tuple) else self.value
        return {"id": self.event_id, "field": self.field, "value": value}


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


def arrive_at(event: RideEvent, settings: PlannerSettings, travel: TravelFn) -> int:
    """When the driver aims to have the kid there: a margin for traffic before the time they
    must be there (the Arrive by time, or else the start). Arrive by doesn't replace it, because
    it's a different need: being there earlier than the event says."""
    due = event.arrive_by if event.arrive_by is not None else event.start
    return due - arrive_early(event.loc, settings, travel)


def arrive_early(loc: str, settings: PlannerSettings, travel: TravelFn) -> int:
    """How long before it's due to aim to be at ``loc``, for a drop-off or a pick-up."""
    if settings.fixed_early is not None:
        return settings.fixed_early
    return early_for_drive(travel(HOME, loc))


def early_for_drive(drive: float) -> int:
    """The margin for traffic, from the drive from home: 3 + 14 ln(1 + drive / 50) minutes,
    rounded down (Marty, 2026-11-12). Each minute of driving adds about 17 seconds at first,
    7.5 at an hour and 5 at two hours, and it keeps growing for gas stops on a long trip:
    3 for no drive, 5 for 10 minutes, 10 for 35, 14 for an hour, 20 for two, 24 for three."""
    # The tiny nudge keeps a value that should be whole from landing just under it.
    return math.floor(3 + 14 * math.log1p(max(drive, 0) / 50) + 1e-9)


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
    late: bool = False
    """For an errand: as late as still works, instead of as early as it can be."""


def plan_driver(
    driver: str,
    events: Sequence[RideEvent],
    busy: Mapping[str, Sequence[BusyBlock]],
    travel: TravelFn,
    settings: PlannerSettings = DEFAULT_SETTINGS,
) -> DriverPlan:
    """String one parent's drop-offs and pick-ups into a route and time it.

    Errands come last: each goes wherever in the route it costs least, so it's tacked onto a
    trip that's out already when that fits its window.
    """
    tasks: list[_Task] = []
    errands: list[_Task] = []
    for e in events:
        if e.takes is not None:
            if e.own == driver and e.drop == driver:
                errands.append(_Task("stay", e, e.end - e.takes))
        elif e.stay and e.drop == driver and e.pick == driver:
            tasks.append(_Task("stay", e, arrive_at(e, settings, travel)))
        else:
            if e.drop == driver:
                tasks.append(_Task("drop", e, arrive_at(e, settings, travel)))
            if e.pick == driver:
                tasks.append(_Task("pick", e, e.end))
    tasks.sort(key=lambda k: k.t)
    _same_place_first(tasks, settings)
    _nearby_first(driver, tasks, busy, travel, settings)
    errands.sort(key=lambda k: (k.t, k.event.id))
    for k in errands:
        # The cheapest; on a tie, the least time away from home, so the stop sits right next to
        # the trip it joins instead of stretching it.
        best: tuple[float, float, list[_Task]] | None = None
        for i in range(len(tasks) + 1):
            for late in (False, True):
                trial = [*tasks[:i], replace(k, late=late), *tasks[i:]]
                p = _route(driver, trial, busy, travel, settings)
                cost, away = _cost(p), sum(g.end - g.start for g in p.segments if g.type != "home")
                if best is None or cost < best[0] - 1e-9 or (cost < best[0] + 1e-9 and away < best[1] - 1e-9):
                    best = (cost, away, trial)
        assert best is not None
        tasks = best[2]
    return _route(driver, tasks, busy, travel, settings)


def _cost(p: DriverPlan) -> float:
    return len(p.issues) * 1000 + sum(x.minutes or 0 for x in p.issues) * 10 + p.drive


def _route(
    driver: str,
    tasks: list[_Task],
    busy: Mapping[str, Sequence[BusyBlock]],
    travel: TravelFn,
    settings: PlannerSettings,
) -> DriverPlan:
    """Time the tasks in this order."""
    out = DriverPlan(driver)
    if not tasks:
        return out

    stops = _build_stops(tasks)
    n = len(stops)
    # A pick-up gets the same margin for traffic as a drop-off (Marty, 2026-11-12), so the kid
    # isn't left waiting when the drive runs slow. The driver waits there if it doesn't.
    for st in stops:
        if st.kind == "pick" and st.ready is not None:
            st.aim = st.ready - arrive_early(st.loc, settings, travel)

    # Backward pass: the latest arrival and departure at each stop that still make every deadline.
    def backward(due: list[float]) -> list[float]:
        latest_arrive, latest_depart = list(due), [INF] * n
        for i in range(n - 1, 0, -1):
            latest_depart[i - 1] = min(latest_depart[i - 1], latest_arrive[i] - travel(stops[i - 1].loc, stops[i].loc))
            latest_arrive[i - 1] = min(latest_arrive[i - 1], latest_depart[i - 1] - stops[i - 1].dwell)
        return latest_depart

    latest_depart = backward([s.deadline if s.deadline is not None else INF for s in stops])
    # Once the car has been back home partway through, leaving times also get each kid picked
    # up as their activity ends, so a stop at home in between doesn't leave anyone waiting.
    fetched = [any(x.kind == "fetch" for x in stops[:i]) for i in range(n)]
    leave_by = backward(
        [
            s.deadline if s.deadline is not None else s.aim if s.aim is not None and fetched[i] else INF
            for i, s in enumerate(stops)
        ]
    )

    def target(j: int) -> float:
        v = leave_by[j]
        nxt = stops[j + 1] if j + 1 < n else None
        if nxt is not None and nxt.ready is not None and not nxt.late:
            v = min(v, (nxt.aim if nxt.aim is not None else nxt.ready) - travel(stops[j].loc, nxt.loc))
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
        due = stops[1].aim if stops[1].aim is not None else stops[1].ready
        t = (due if due is not None else 0) - travel(HOME, stops[1].loc)
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
        if s.deadline is not None and arr - s.deadline >= LATE_AFTER:
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
        ready += s.dwell
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
                    and not s.late
                    and 0 <= tg - ready < settings.tight_slack
                    and math.isfinite(latest_depart[j])
                ):
                    out.soft.append(Issue("tight", driver, s.event, s, at=ready))
                dep = max(ready, tg)
        if s.kind == "stay" and ready > arr and s.event is not None:
            tag(
                Segment(
                    "stay",
                    arr,
                    ready,
                    loc=s.loc,
                    event=s.event,
                    kids=[k for k in s.car if not s.event.attends(k) and k not in dropped_home],
                ),
                s,
            )
        if s.kind == "fetch":
            dropped_home = []
        elif s.kind in ("pick", "stay") and s.event is not None and s.event.own is None:
            # Picked up again after an earlier ride ended at home: back in the car.
            dropped_home = [k for k in dropped_home if k != s.event.kid]
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
                # Kids with somewhere to be later leave home again in the car; the rest stay home.
                needed = _needed_later(stops, j + 1)
                dropped_home = dropped_home + [k for k in car_now if k not in needed]
                t = leave_home
                here = HOME
                car_now = [k for k in car_now if k in needed]
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


def _needed_later(stops: Sequence[Stop], start: int) -> set[str]:
    """The kids dropped off, staying or taken along at a stop from ``start`` on, up to the next
    time the car is at home."""
    out: set[str] = set()
    for st in stops[start:]:
        if st.kind in ("fetch", "end"):
            break
        if st.event is not None and st.kind in ("drop", "stay"):
            if st.event.own is None:
                out.add(st.event.kid)
            out.update(st.event.along)
        if st.event is not None and st.kind == "pick":
            out.update(st.event.pick_along)
    return out


def _same_place_first(tasks: list[_Task], settings: PlannerSettings) -> None:
    """Drop the next kid off on arriving for a pick-up at the same place a few minutes before.

    Otherwise they'd be fetched from home after the pick-up and arrive late. Only when the
    drop-off is at most :attr:`PlannerSettings.too_early` after the pick-up, so they don't
    wait long.
    """
    q = 0
    while q + 1 < len(tasks):
        a, b = tasks[q], tasks[q + 1]
        if (
            a.type == "pick"
            and b.type != "pick"
            and a.event.loc == b.event.loc
            and a.event.kid != b.event.kid
            and b.t - a.t <= settings.too_early
        ):
            tasks[q], tasks[q + 1] = b, a
            q += 1
        q += 1


def _nearby_first(
    driver: str,
    tasks: list[_Task],
    busy: Mapping[str, Sequence[BusyBlock]],
    travel: TravelFn,
    settings: PlannerSettings,
) -> None:
    """Like :func:`_same_place_first`, for a drop-off at another place a few minutes after a
    pick-up: drop that kid off first when it makes for a better route, which it does when the
    car would otherwise go home for them after the pick-up and get them there late."""
    q = 0
    while q + 1 < len(tasks):
        a, b = tasks[q], tasks[q + 1]
        if (
            a.type == "pick"
            and b.type != "pick"
            and b.event.own is None
            and a.event.loc != b.event.loc
            and a.event.kid != b.event.kid
            and b.t - a.t <= settings.too_early
        ):
            swapped = [*tasks[:q], b, a, *tasks[q + 2 :]]
            if (
                _cost(_route(driver, swapped, busy, travel, settings))
                < _cost(_route(driver, tasks, busy, travel, settings)) - 1e-9
            ):
                tasks[q], tasks[q + 1] = b, a
                q += 1
        q += 1


def _build_stops(tasks: list[_Task]) -> list[Stop]:
    """Sort tasks into stops that start and end at home, tracking who is in the car."""
    stops = [Stop(HOME, "start")]
    car: list[str] = []
    # Where each kid dropped off on this route was left, and when their activity there ends.
    left: dict[str, tuple[str, int]] = {}
    for q, k in enumerate(tasks):
        kid = k.event.kid
        nxt = tasks[q + 1] if q + 1 < len(tasks) else None
        if k.event.takes is not None and nxt is not None and nxt.type != "pick" and nxt.event.takes is None:
            # An errand on the way to a drop-off: the kids for it leave home before the errand,
            # instead of the car coming home for them after.
            riders = (
                list(nxt.event.along)
                if nxt.event.own is not None
                else [nxt.event.kid, *(a for a in dict.fromkeys(nxt.event.along) if a != nxt.event.kid)]
            )
            if any(r not in car for r in riders):
                if stops[-1].loc != HOME:
                    stops.append(Stop(HOME, "fetch"))
                car = riders
                stops[-1].car = list(car)
        if k.event.own is not None:
            # A parent's own event: the kids going too leave home with them.
            riders = list(k.event.along)
            if any(r not in car for r in riders):
                if stops[-1].loc != HOME:
                    stops.append(Stop(HOME, "fetch"))
                car = riders
                stops[-1].car = list(car)
            stop = Stop(k.event.loc, "stay", list(car), event=k.event, deadline=k.t)
            if k.event.takes is not None:
                stop.ready = k.event.start
                stop.dwell = k.event.takes
                stop.late = k.late
            else:
                stop.after = k.event.end
            stops.append(stop)
            continue
        if k.type != "pick":
            # A rider dropped off earlier on this route isn't at home, so nobody goes home for them.
            # Dropped off here and done by now, they get in; otherwise they stay where they are.
            here = [a for a in dict.fromkeys(k.event.along) if a in left]
            missing = [a for a in dict.fromkeys(k.event.along) if a != kid and a not in car and a not in here]
            if kid in car and missing:
                # Kids taken along who aren't in the car yet come from home.
                if stops[-1].loc != HOME:
                    stops.append(Stop(HOME, "fetch"))
                car += missing
                stops[-1].car = list(car)
            if kid not in car:
                # Dropping off a kid who isn't in the car means collecting them from home first.
                if stops[-1].loc != HOME:
                    stops.append(Stop(HOME, "fetch"))
                car = [kid]
                # The kids taken along on this drop-off leave home in the same car.
                car += [a for a in dict.fromkeys(k.event.along) if a != kid and a not in here]
                stops[-1].car = list(car)
            for a in here:
                if a not in car and left[a][0] == k.event.loc and left[a][1] <= k.t:
                    car.append(a)
                    del left[a]
            car = [x for x in car if x != kid]
            stop = Stop(k.event.loc, k.type, event=k.event, deadline=k.t)
            if k.type == "drop":
                left[kid] = (k.event.loc, k.event.end)
            if k.type == "stay":
                stop.after = k.event.end
                if kid not in car:
                    car.append(kid)
            stop.car = list(car)
            stops.append(stop)
        else:
            riders = [a for a in dict.fromkeys(k.event.pick_along) if a != kid and a not in car]
            # A rider dropped off earlier on this route isn't at home, so nobody goes home for them.
            # Dropped off here and done by the pick-up, they get in; otherwise they stay where
            # they are.
            here = [a for a in riders if a in left]
            missing = [a for a in riders if a not in here]
            if missing:
                # Kids riding along on the pick-up leave home in the car.
                if stops[-1].loc != HOME:
                    stops.append(Stop(HOME, "fetch"))
                car += missing
                stops[-1].car = list(car)
            for a in here:
                if left[a][0] == k.event.loc and left[a][1] <= k.event.end:
                    car.append(a)
                    del left[a]
            if kid not in car:
                car.append(kid)
            left.pop(kid, None)
            stops.append(Stop(k.event.loc, "pick", list(car), event=k.event, ready=k.event.end))
    if stops[-1].loc != HOME:
        stops.append(Stop(HOME, "end"))
    return stops


def plan_all(
    events: Sequence[RideEvent],
    busy: Mapping[str, Sequence[BusyBlock]],
    travel: TravelFn,
    settings: PlannerSettings = DEFAULT_SETTINGS,
    drivers: Sequence[str] = DEFAULT_DRIVERS,
) -> DayPlan:
    """Plan every routed driver's day and collect the issues across them."""
    busy = with_rides_along(events, busy, travel, settings, drivers)
    plans = {d: plan_driver(d, events, busy, travel, settings) for d in drivers}
    hard = [x for d in drivers for x in plans[d].issues]
    for e in events:
        if e.drop == UNASSIGNED:
            hard.append(Issue("unassigned", event=e, side="drop"))
        if e.pick == UNASSIGNED:
            hard.append(Issue("unassigned", event=e, side="pick"))
    soft = [x for d in drivers for x in plans[d].soft]
    late_minutes = sum(x.minutes or 0 for x in hard)
    score = len(hard) * 1000 + late_minutes * 10 + sum(p.drive for p in plans.values())
    return DayPlan(plans, hard, soft, score, busy)


def with_rides_along(
    events: Sequence[RideEvent],
    busy: Mapping[str, Sequence[BusyBlock]],
    travel: TravelFn,
    settings: PlannerSettings = DEFAULT_SETTINGS,
    drivers: Sequence[str] = DEFAULT_DRIVERS,
) -> dict[str, list[BusyBlock]]:
    """The parents' busy times, plus each trip they ride along on, to the other parent's own
    event or on a kid's drop-off or pick-up: from leaving home until back home."""
    out = {d: list(blocks) for d, blocks in busy.items()}

    def add(p: str, driver: str, leave: float, home: float, title: str) -> None:
        if p in drivers and p != driver:
            out.setdefault(p, []).append(BusyBlock(math.floor(leave), math.ceil(home), title))

    for e in events:
        if e.takes is not None or not e.attending:
            continue
        there, back = travel(HOME, e.loc), travel(e.loc, HOME)
        arrive = arrive_at(e, settings, travel)
        if e.own is not None:
            for p in e.parents:
                add(p, e.own, arrive - there, e.end + back, e.title)
            continue
        # Riding along on a kid's ride: from leaving home until back, staying if the driver does.
        stays = e.stay and e.drop == e.pick
        if e.drop not in (UNASSIGNED, NOT_NEEDED):
            for p in e.parents:
                add(p, e.drop, arrive - there, (e.end if stays else arrive) + back, e.title)
        if e.pick not in (UNASSIGNED, NOT_NEEDED) and not stays:
            for p in e.pick_parents:
                add(p, e.pick, e.end - arrive_early(e.loc, settings, travel) - there, e.end + back, e.title)
    for blocks in out.values():
        blocks.sort(key=lambda b: (b.start, b.end, b.title))
    return out


def who_of(e: RideEvent, labels: Labels) -> str:
    """The name of whoever an event is for: the kid, or the parent for their own event."""
    return labels.driver(e.own) if e.own is not None else labels.kid(e.kid)


def issue_text(issue: Issue, labels: Labels) -> IssueText:
    """The words shown for an issue. ``note`` is the short form used under a suggestion."""
    e = issue.event
    kid = who_of(e, labels) if e else ""
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
            target = f"the {fmt(s.deadline)} target"
            if e.arrive_by is not None and e.arrive_by > s.deadline:
                target += f", {minutes_text(e.arrive_by - s.deadline)} min before the {fmt(e.arrive_by)} arrive-by time"
            target += "."
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
                return IssueText(f"No drop-off for {kid}", f"{e.title} starts at {fmt(e.start)}{_at(e, labels)}.")
            return IssueText(f"No pick-up for {kid}", f"{e.title} ends at {fmt(e.end)}{_at(e, labels)}.")
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


def _at(e: RideEvent, labels: Labels) -> str:
    """ ", Piano studio", or nothing when the event has no address and the place is its title."""
    place = labels.place(e.loc)
    return "" if place == e.title else f", {place}"


_QUARTERS: Final = ("", "¼", "½", "¾")


def driving_text(v: float) -> str:
    """Minutes of driving as people read them: under an hour to the quarter minute ("18¼ min",
    "¾ min"), an hour or more in hours and whole minutes ("1 hr 15 min", "2 hr")."""
    if v >= 59.5:
        total = math.floor(v + 0.5)
        h, m = divmod(total, 60)
        return f"{h} hr {m} min" if m else f"{h} hr"
    q = math.floor(v * 4 + 0.5)
    whole, part = divmod(q, 4)
    return f"{whole if whole or not part else ''}{_QUARTERS[part]} min"


def minutes_text(v: float | None) -> str:
    """A minute count as written in text, rounded to the whole minute: ``16``, not ``15.6``."""
    if v is None:
        return "0"
    return str(math.floor(v + 0.5))


def apply_change(
    events: Sequence[RideEvent],
    change: Change,
    drivers: Sequence[str] = DEFAULT_DRIVERS,
) -> list[RideEvent]:
    """Return the events with one change applied."""
    new_events: list[RideEvent] = []
    for e in events:
        if e.id != change.event_id:
            new_events.append(e)
            continue
        n = e
        if change.field == "along":
            n = replace(n, along=tuple(change.value))
        elif change.field == "drop":
            n = replace(n, drop=str(change.value) or UNASSIGNED)
        else:
            n = replace(n, pick=str(change.value) or UNASSIGNED)
        # Stay only makes sense when the same routed parent drives both ways.
        if n.drop != n.pick or n.drop not in drivers:
            n = replace(n, stay=False)
        new_events.append(n)
    return new_events


def suggestions_for(
    issue: Issue,
    events: Sequence[RideEvent],
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
    along_kid: dict[Change, str] = {}
    if issue.kind == "unassigned" and issue.event is not None and issue.side is not None:
        verb = " drops off" if issue.side == "drop" else " picks up"
        for drv in drivers:
            cands.append((labels.driver(drv) + verb, Change(issue.event.id, issue.side, drv), drv))
    elif issue.driver is not None:
        d = issue.driver
        others = [o for o in drivers if o != d]
        for e in events:
            if e.own is not None:
                continue  # A parent's own event is always theirs to drive.
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
        # Take a kid along on an earlier drop-off by the same driver, if it's close enough.
        for e in events:
            if e.drop != d or e.own is not None:
                continue
            for f in events:
                gap = arrive_at(e, settings, travel) - arrive_at(f, settings, travel)
                if f is e or f.drop != d or f.kid == e.kid or not 0 <= gap <= settings.take_along_window:
                    continue
                if f.own is not None:
                    continue
                if e.kid in f.along:
                    continue
                change = Change(f.id, "along", (*f.along, e.kid))
                cands.append((None, change, d))
                along_kid[change] = e.kid

    base_soft = {x.key for x in base.soft}
    key = issue.key
    good: list[Suggestion] = []
    for label, change, who in cands:
        p = plan_all(apply_change(events, change, drivers), busy, travel, settings, drivers)
        if key in {x.key for x in p.hard} or len(p.hard) >= len(base.hard):
            continue
        if label is None:
            kid = along_kid[change]
            # Only offer it when the kid really does ride along on someone else's trip.
            if not any(g.type == "drive" and kid in g.kids[1:] for g in p[who].segments):
                continue
            label = f"Take {labels.kid(kid)} along"
        extra = [x for x in p.soft if x.key not in base_soft]
        delta = p[who].drive - base[who].drive
        if extra:
            note = issue_text(extra[0], labels).note or ""
        elif delta > 0 and p[who].trips > base[who].trips:
            # A new trip from home and back. The label already names who drives.
            note = f"+{driving_text(delta)} round trip"
        elif delta > 0:
            note = f"+{driving_text(delta)} of driving"
        elif delta < 0:
            note = f"{driving_text(-delta)} less driving"
        else:
            note = "No new problems"
        good.append(Suggestion(label, change, who, note, p.score))
    good.sort(key=lambda c: c.score)
    return good[:limit]
