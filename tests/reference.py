"""The reference planner's example world, and serializers that match tests/rides_reference/cli.js."""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from typing import Any

from custom_components.mydashlight.board import CardLine, DayBoard, build_day
from custom_components.mydashlight.planner import (
    BusyBlock,
    DayPlan,
    DriverPlan,
    Issue,
    Labels,
    RideEvent,
    Segment,
    fmt12,
    issue_text,
    suggestions_for,
)

# The tables at the top of planner-reference.js.
KIDS = ("ava", "ben", "cleo")
LABELS = Labels(
    kids={"ava": "Ava", "ben": "Ben", "cleo": "Cleo"},
    drivers={"mom": "Robin", "dad": "Sam"},
    places={
        "home": "Home",
        "piano": "Piano studio",
        "soccer": "Soccer fields",
        "football": "Football field",
        "gym": "Middle school gym",
        "church": "Church",
        "party": "Noah’s house",
        "dance": "Dance studio",
        "nextdoor": "Next door",
    },
    short_places={
        "home": "Home",
        "piano": "Piano",
        "soccer": "Soccer",
        "football": "Football",
        "gym": "Gym",
        "church": "Church",
        "party": "Noah’s",
        "dance": "Dance",
        "nextdoor": "Next door",
    },
)
DRIVE = {
    "home|piano": 10,
    "home|soccer": 15,
    "home|football": 20,
    "home|gym": 8,
    "piano|soccer": 12,
    "piano|football": 18,
    "piano|gym": 10,
    "soccer|football": 10,
    "soccer|gym": 14,
    "football|gym": 16,
    "home|church": 12,
    "home|party": 9,
    "home|dance": 11,
    "dance|football": 14,
    "dance|soccer": 9,
}
PLACES = tuple(LABELS.places)


def travel(a: str, b: str) -> int:
    if a == b:
        return 0
    v = DRIVE.get(f"{a}|{b}", DRIVE.get(f"{b}|{a}"))
    return 15 if v is None else v


def event_from_json(e: Mapping[str, Any]) -> RideEvent:
    return RideEvent(
        id=e["id"],
        kid=e["kid"],
        title=e["title"],
        loc=e["loc"],
        start=e["start"],
        end=e["end"],
        drop=e["drop"],
        pick=e["pick"],
        stay=e["stay"],
        arrive_by=e["arriveBy"],
    )


def busy_from_json(busy: Mapping[str, Sequence[Mapping[str, Any]]]) -> dict[str, list[BusyBlock]]:
    return {d: [BusyBlock(b["start"], b["end"], b["title"]) for b in blocks] for d, blocks in busy.items()}


def _num(v: float) -> int | float:
    return int(v) if float(v).is_integer() else v


def segment_json(g: Segment) -> dict[str, Any]:
    o: dict[str, Any] = {"type": g.type, "start": fmt12(g.start), "end": fmt12(g.end)}
    if g.type == "drive":
        o["from"] = g.from_loc
        o["to"] = g.to_loc
    if g.type in ("wait", "stay"):
        o["loc"] = g.loc
    if g.type != "home":
        o["kids"] = list(g.kids)
        o["serves"] = g.serves.id if g.serves else None
    if g.overlaps_busy:
        o["overlaps_busy"] = True
    return o


def driver_json(p: DriverPlan) -> dict[str, Any]:
    return {
        "first_leave": None if p.leave is None else fmt12(p.leave),
        "drive_min": _num(p.drive),
        "segments": [segment_json(g) for g in p.segments],
    }


def issue_json(x: Issue) -> dict[str, Any]:
    o: dict[str, Any] = {"kind": x.kind}
    if x.driver:
        o["driver"] = x.driver
    if x.event:
        o["event"] = x.event.id
    if x.side:
        o["side"] = x.side
    if x.minutes is not None and x.kind != "unassigned":
        o["min"] = _num(x.minutes)
    return o


def expected_json(
    events: Sequence[RideEvent],
    along: Mapping[str, bool],
    busy: Mapping[str, Sequence[BusyBlock]],
    board: DayBoard,
) -> dict[str, Any]:
    plan: DayPlan = board.plan
    suggestions = []
    for x in plan.hard:
        options = suggestions_for(x, events, along, plan, busy, travel, LABELS)
        if options:
            suggestions.append(
                {
                    "for": x.key,
                    "options": [{"label": c.label, "change": c.change.as_dict(), "note": c.note} for c in options],
                }
            )
    out: dict[str, Any] = {
        "mom": driver_json(plan["mom"]),
        "dad": driver_json(plan["dad"]),
        "issues": [issue_json(x) for x in plan.hard],
        "heads_ups": [issue_json(x) for x in plan.soft],
        "suggestions": suggestions,
    }
    if board.clashes:
        out["double_booked"] = [
            {
                "kid": c.kid,
                "a": c.a.event.id if c.a.event else None,
                "b": c.b.event.id if c.b.type == "act" and c.b.event else "ride",
            }
            for c in board.clashes
        ]
    return out


def _line(line: CardLine | None) -> dict[str, str] | None:
    return None if line is None else {"text": line.text, "tone": line.tone}


def board_json(day: Mapping[str, Any]) -> dict[str, Any]:
    """Everything cli.js prints for one day in ``board`` mode."""
    events = [event_from_json(e) for e in day["events"]]
    along = dict(day["along"])
    busy = busy_from_json(day["busy"])
    board = build_day(events, along, busy, travel, LABELS, kids=KIDS)
    plan = board.plan
    return {
        "expected": expected_json(events, along, busy, board),
        "score": _num(plan.score),
        "issue_texts": [{"key": x.key, **_text(x)} for x in [*plan.hard, *plan.soft]],
        "rides": [
            {
                "kid": r.kid,
                "driver": r.driver,
                "start": _num(r.start),
                "end": _num(r.end),
                "own": r.own,
                "legs": len(r.legs),
            }
            for r in board.rides
        ],
        "outings": {
            d: [
                {
                    "start": _num(o.start),
                    "end": _num(o.end),
                    "lead": o.lead,
                    "lines": o.lines,
                    "kids": o.kids,
                    "warn": o.warn,
                    "target": o.target.id if o.target else None,
                }
                for o in board.outings[d]
            ]
            for d in ("mom", "dad")
        },
        "lines": {eid: {"drop": _line(cl.drop), "pick": _line(cl.pick)} for eid, cl in board.lines.items()},
    }


def _text(x: Issue) -> dict[str, str | None]:
    t = issue_text(x, LABELS)
    return {"title": t.title, "body": t.body, "note": t.note}
