"""The planner port against the golden scenarios from the ride board mockup."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import pytest

from custom_components.mydashlight.board import build_day

from .reference import KIDS, LABELS, busy_from_json, event_from_json, expected_json, travel

SCENARIOS: list[dict[str, Any]] = json.loads(
    (Path(__file__).parent / "rides_reference" / "scenarios.json").read_text(encoding="utf-8")
)["scenarios"]


@pytest.mark.parametrize("scenario", SCENARIOS, ids=[s["name"] for s in SCENARIOS])
def test_scenario(scenario: dict[str, Any]) -> None:
    events = [event_from_json(e) for e in scenario["input"]["events"]]
    along = scenario["input"]["along"]
    busy = busy_from_json(scenario["input"]["busy"])
    board = build_day(events, along, busy, travel, LABELS, kids=KIDS)

    got = expected_json(events, along, busy, board)

    want = scenario["expected"]
    # Compare part by part so a failure says which part is off.
    for part in ("mom", "dad", "issues", "heads_ups", "suggestions", "double_booked"):
        assert got.get(part) == want.get(part), part
    assert got == want


def test_scenarios_cover_the_tricky_cases() -> None:
    """The golden file still exercises take-along, a swapped driver and a double-booking."""
    names = " ".join(s["name"] for s in SCENARIOS)
    assert "taking kids along" in names
    assert "drop-off" in names
    assert any("double_booked" in s["expected"] for s in SCENARIOS)
    assert len(SCENARIOS) == 10
