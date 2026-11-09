"""Plans each day and writes the result as plain data for the app and the get_plan service.

Times are minutes after midnight on that day, as numbers. The app formats them. Pure module,
no Home Assistant imports.
"""

from __future__ import annotations

from collections.abc import Callable, Sequence
import math
from typing import Any

from .board import CardLine, DayBoard, Going, KidItem, Outing, Ride, build_day, event_where, planned_at
from .planner import (
    BusyBlock,
    Change,
    Issue,
    Labels,
    PlannerSettings,
    RideEvent,
    Segment,
    TravelFn,
    issue_text,
    suggestions_for,
)
from .week import DayInput, WeekInput

SUGGESTIONS_PER_ISSUE = 2


def plan_week(
    week: WeekInput,
    travel_for: Callable[[DayInput], TravelFn],
    settings: PlannerSettings,
    drivers: Sequence[str],
) -> list[dict[str, Any]]:
    """Every day's plan, with each day's drive times from ``travel_for``."""
    return [plan_day(day, week.labels, week.kids, travel_for(day), settings, drivers) for day in week.days]


def plan_day(
    day: DayInput,
    labels: Labels,
    kids: Sequence[str],
    travel: TravelFn,
    settings: PlannerSettings,
    drivers: Sequence[str],
) -> dict[str, Any]:
    board = build_day(day.events, day.busy, travel, labels, settings, drivers, kids)
    rides = board.rides

    def issue(x: Issue, level: str) -> dict[str, Any]:
        text = issue_text(x, labels)
        out: dict[str, Any] = {
            "key": x.key,
            "level": level,
            "kind": x.kind,
            "driver": x.driver,
            "event": x.event.id if x.event else None,
            "side": x.side,
            "minutes": _num(x.minutes),
            "at": _num(x.at),
            "title": text.title,
            "body": text.body,
            "note": text.note,
        }
        if level == "problem":
            out["suggestions"] = [
                {
                    "id": suggestion_id(day.day.isoformat(), s.change),
                    "label": s.label,
                    "change": s.change.as_dict(),
                    "who": s.who,
                    "note": s.note,
                }
                for s in suggestions_for(
                    x,
                    day.events,
                    board.plan,
                    day.busy,
                    travel,
                    labels,
                    settings,
                    drivers,
                    SUGGESTIONS_PER_ISSUE,
                )
            ]
        return out

    return {
        "date": day.day.isoformat(),
        "events": [_event(e, day, labels, board) for e in day.events],
        "all_day": list(day.all_day),
        "unplaced": list(day.unplaced),
        "drivers": {
            d: {
                "name": labels.driver(d),
                "leave": _num(board.plan[d].leave),
                "drive": _num(board.plan[d].drive),
                "trips": board.plan[d].trips,
                "segments": [_segment(g) for g in board.plan[d].segments],
                "outings": [_outing(o) for o in board.outings[d]],
                "busy": _busy_for(d, day.events, board),
            }
            for d in drivers
        },
        "rides": [_ride(r, i) for i, r in enumerate(rides)],
        "kids": {
            k: {"name": labels.kid(k), "items": [_item(it, rides) for it in board.kid_items.get(k, [])]} for k in kids
        },
        "clashes": [{"kid": c.kid, "a": _item(c.a, rides), "b": _item(c.b, rides)} for c in board.clashes],
        "issues": [issue(x, "problem") for x in board.plan.hard] + [issue(x, "heads_up") for x in board.plan.soft],
        "score": _num(board.plan.score),
    }


def suggestion_id(day: str, change: Change) -> str:
    """A fix's id for ``apply_suggestion``. It says what the fix does, so it stays the same
    from one update to the next while the fix still applies."""
    value = "+".join(change.value) if isinstance(change.value, tuple) else change.value
    return f"{day}|{change.event_id}|{change.field}|{value}"


def _event(e: RideEvent, day: DayInput, labels: Labels, board: DayBoard) -> dict[str, Any]:
    ref = day.refs[e.id]
    lines = board.lines.get(e.id)
    return {
        "id": e.id,
        "kid": e.kid,
        "title": e.title,
        "place": e.loc,
        "place_name": labels.place(e.loc),
        "short_place": labels.short_place(e.loc),
        "where": event_where(e),
        "attending": e.attending,
        "start": e.start,
        "end": e.end,
        "drop": e.drop,
        "pick": e.pick,
        "stay": e.stay,
        "arrive_by": e.arrive_by,
        "along": [*e.along, *e.parents],
        "pick_along": [*e.pick_along, *e.pick_parents],
        "own": e.own,
        "takes": e.takes,
        "planned": _num(planned_at(e, board.plan)),
        "sides": list(ref.sides),
        "calendar_id": ref.calendar_id,
        "event_id": ref.event_id,
        "recurring": ref.recurring_id is not None,
        "problems": list(day.problems.get(e.id, ())),
        "lines": {
            "drop": _line(lines.drop) if lines else None,
            "pick": _line(lines.pick) if lines else None,
        },
    }


def _segment(g: Segment) -> dict[str, Any]:
    return {
        "type": g.type,
        "start": _num(g.start),
        "end": _num(g.end),
        "from": g.from_loc,
        "to": g.to_loc,
        "place": g.loc,
        "kids": list(g.kids),
        "event": g.event.id if g.event else None,
        "serves": g.serves.id if g.serves else None,
        "overlaps_busy": g.overlaps_busy,
    }


def _outing(o: Outing) -> dict[str, Any]:
    return {
        "start": _num(o.start),
        "end": _num(o.end),
        "lead": o.lead,
        "title": o.title,
        "lines": list(o.lines),
        "kids": list(o.kids),
        "warn": o.warn or None,
        "target": o.target.id if o.target else None,
        "first_drop": o.first_drop.id if o.first_drop else None,
        "riders": dict(o.riders),
        "go": _go(o.go) if o.go else None,
        "parents": dict(o.parents),
        "solo": o.solo,
    }


def _go(g: Going) -> dict[str, Any]:
    return {
        "from": g.from_loc,
        "from_name": g.from_name,
        "to": g.to_loc,
        "to_name": g.to_name,
        "due": _num(g.due),
        "via_home": g.via_home,
    }


def _ride(r: Ride, index: int) -> dict[str, Any]:
    return {
        "index": index,
        "kid": r.kid,
        "driver": r.driver,
        "start": _num(r.start),
        "end": _num(r.end),
        "own": r.own,
        "serves": list(dict.fromkeys(g.serves.id for g in r.legs if g.serves is not None)),
    }


def _item(it: KidItem, rides: list[Ride]) -> dict[str, Any]:
    out: dict[str, Any] = {"type": it.type, "start": _num(it.start), "end": _num(it.end), "clash": it.clash}
    if it.event is not None:
        out["event"] = it.event.id
    if it.ride is not None:
        out["ride"] = next(i for i, r in enumerate(rides) if r is it.ride)
    return out


def _busy_for(driver: str, events: Sequence[RideEvent], board: DayBoard) -> list[dict[str, Any]]:
    """A driver's busy times: their calendar, the trips they ride along on, and their own
    events, which carry the event's id."""
    out = [_busy(b) for b in board.plan.busy.get(driver, ())]
    for e in events:
        if e.own != driver or not e.attending:
            continue
        if e.takes is None:
            out.append(_busy(BusyBlock(e.start, e.end, e.title), e.id))
        elif (at := planned_at(e, board.plan)) is not None:
            out.append(_busy(BusyBlock(math.floor(at), math.ceil(at + e.takes), e.title), e.id))
    out.sort(key=lambda b: (b["start"], b["end"], b["title"]))
    return out


def _busy(b: BusyBlock, event: str | None = None) -> dict[str, Any]:
    return {"start": b.start, "end": b.end, "title": b.title, "event": event}


def _line(line: CardLine | None) -> dict[str, str] | None:
    return {"text": line.text, "tone": line.tone} if line else None


def _num(v: float | None) -> float | int | None:
    if v is None or not math.isfinite(v):
        return None
    return int(v) if float(v).is_integer() else round(v, 1)
