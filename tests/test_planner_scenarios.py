"""The planner port against the golden scenarios from the ride board mockup."""

from __future__ import annotations

from dataclasses import replace
import json
from pathlib import Path
from typing import Any

import pytest

from custom_components.mydashlight.board import build_day
from custom_components.mydashlight.planner import (
    Issue,
    Labels,
    PlannerSettings,
    RideEvent,
    arrive_at,
    arrive_early,
    driving_text,
    issue_text,
    minutes_text,
    plan_driver,
)

from .reference import KIDS, LABELS, busy_from_json, event_from_json, expected_json, travel

SCENARIOS: list[dict[str, Any]] = json.loads(
    (Path(__file__).parent / "rides_reference" / "scenarios.json").read_text(encoding="utf-8")
)["scenarios"]


@pytest.mark.parametrize("scenario", SCENARIOS, ids=[s["name"] for s in SCENARIOS])
def test_scenario(scenario: dict[str, Any]) -> None:
    events = [event_from_json(e) for e in scenario["input"]["events"]]
    busy = busy_from_json(scenario["input"]["busy"])
    board = build_day(events, busy, travel, LABELS, kids=KIDS)

    got = expected_json(events, busy, board)

    want = scenario["expected"]
    # Compare part by part so a failure says which part is off.
    for part in ("mom", "dad", "issues", "heads_ups", "suggestions", "double_booked"):
        assert got.get(part) == want.get(part), part
    assert got == want


def test_scenarios_cover_the_tricky_cases() -> None:
    """The golden file still exercises take-along, a swapped driver and a double-booking."""
    names = " ".join(s["name"] for s in SCENARIOS)
    assert any(e.get("along") for s in SCENARIOS for e in s["input"]["events"])
    assert "drop-off" in names
    assert any("double_booked" in s["expected"] for s in SCENARIOS)
    assert len(SCENARIOS) == 12


def test_arrive_early_grows_with_the_drive() -> None:
    # Marty, 2026-11-04: 5 early when it's 5 minutes away, 10 for 30, 15 for an hour, 20 at most.
    settings = PlannerSettings()
    early = {d: arrive_early("x", settings, lambda _a, _b, d=d: d) for d in (0, 5, 12, 30, 59.9, 60, 90, 200)}
    assert early == {0: 5, 5: 5, 12: 7, 30: 10, 59.9: 14, 60: 15, 90: 20, 200: 20}
    assert arrive_early("x", PlannerSettings(arrive_early_per=0), lambda _a, _b: 60) == 5
    assert arrive_early("x", PlannerSettings(arrive_early=10, arrive_early_max=8), lambda _a, _b: 60) == 10
    # An Arrive by time still wins.
    e = RideEvent("e", "ava", "Piano", "piano", 960, 1020, arrive_by=930)
    assert arrive_at(e, settings, lambda _a, _b: 60) == 930
    assert arrive_at(replace(e, arrive_by=None), settings, lambda _a, _b: 60) == 945


def test_driving_text() -> None:
    assert [driving_text(v) for v in (18.299999999999997, 37.900000000000006, 0.75, 0.1, 12, 45.5)] == [
        "18¼ min",
        "38 min",
        "¾ min",
        "0 min",
        "12 min",
        "45½ min",
    ]
    assert [driving_text(v) for v in (59.5, 75, 120.2)] == ["1 hr", "1 hr 15 min", "2 hr"]


def test_no_address_events_dont_repeat_their_title() -> None:
    e = RideEvent("party", "ava", "Mia's Birthday Party", "?party", 960, 1080)
    labels = Labels(kids={"ava": "Ava"}, places={"?party": "Mia's Birthday Party"})
    x = Issue(kind="unassigned", event=e, side="drop")
    assert issue_text(x, labels).body == "Mia's Birthday Party starts at 4:00."
    labels = Labels(kids={"ava": "Ava"}, places={"?party": "Mia's house"})
    assert issue_text(x, labels).body == "Mia's Birthday Party starts at 4:00, Mia's house."


def test_same_place_drop_off_and_pick_up_in_one_stop() -> None:
    # Cleo's hip hop ends at 6:45, and Ava has to be at the same studio by 6:45 for tap.
    # Robin brings Ava along to the pick-up instead of fetching her from home afterwards.
    hiphop = RideEvent("hiphop", "cleo", "Hip Hop", "dance", 1080, 1125, drop="mom", pick="mom")
    tap = RideEvent("tap", "ava", "Tap", "dance", 1155, 1200, drop="mom", pick="dad", arrive_by=1125)
    plan = plan_driver("mom", [hiphop, tap], {}, travel)
    assert plan.issues == []
    assert [(s.kind, s.event.id if s.event else s.loc, s.car) for s in plan.stops] == [
        ("start", "home", ["cleo"]),
        ("drop", "hiphop", []),
        ("fetch", "home", ["ava"]),
        ("drop", "tap", []),
        ("pick", "hiphop", ["cleo"]),
        ("end", "home", []),
    ]
    # Not for the same kid: picked up from one class and dropped at the next, they're already there.
    again = RideEvent("again", "cleo", "Ballet", "dance", 1135, 1200, drop="mom", pick="mom")
    stops = plan_driver("mom", [hiphop, again], {}, travel).stops
    assert [s.kind for s in stops] == ["start", "drop", "pick", "drop", "pick", "end"]


def test_a_few_seconds_late_is_not_late() -> None:
    # Ben goes straight from soccer (ends 4:00) to piano (be there by 4:12).
    soccer = RideEvent("soccer", "ben", "Soccer", "soccer", 900, 960, drop="dad", pick="mom")
    piano = RideEvent("piano", "ben", "Piano", "piano", 975, 1020, drop="mom", arrive_by=972)

    def issues(drive: float) -> list[Issue]:
        return plan_driver(
            "mom", [soccer, piano], {}, lambda a, b: drive if {a, b} == {"soccer", "piano"} else 10
        ).issues

    # 12 seconds late shows as 4:12 either way, so it isn't late.
    assert issues(12.2) == []
    (late,) = issues(12.6)
    assert late.kind == "late"
    assert issue_text(late, LABELS).body == "Robin gets there at 4:13, 1 min after the 4:12 arrive-by time."
    assert [minutes_text(v) for v in (15.200000000000045, 0.5, 2.0, None)] == ["15", "1", "2", "0"]
