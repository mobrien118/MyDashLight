"""The planner port against the reference planner on random days.

The golden scenarios cover ten hand-picked days. This feeds a few hundred random ones
(seeded, so a failure always reproduces) through both the Python port and the original
JavaScript, and checks that routes, issues, suggestions, rides, outings and card lines
all match. Needs Node; skipped when it isn't installed.
"""

from __future__ import annotations

import json
from pathlib import Path
import random
import shutil
import subprocess
from typing import Any

import pytest

from .reference import KIDS, PLACES, board_json

CLI = Path(__file__).parent / "rides_reference" / "cli.js"
NODE = shutil.which("node")
DAYS = 1000
SEED = 20261028

pytestmark = pytest.mark.skipif(NODE is None, reason="Node is needed to run the reference planner")

DRIVER_CHOICES = ["mom", "mom", "dad", "dad", "", "none", "Jordan"]


def random_day(rng: random.Random, n: int) -> dict[str, Any]:
    events = []
    # Most days are a busy after-school window, where the interesting interactions happen.
    lo, hi = (15 * 60, 19 * 60) if rng.random() < 0.7 else (7 * 60, 20 * 60)
    for i in range(rng.randint(0, 6)):
        start = rng.randrange(lo, hi, 5)
        end = start + rng.choice([30, 45, 60, 75, 90, 120, 240])
        drop = rng.choice(DRIVER_CHOICES)
        pick = drop if rng.random() < 0.4 else rng.choice(DRIVER_CHOICES)
        events.append(
            {
                "id": f"d{n}e{i}",
                "day": 0,
                "kid": rng.choice(KIDS),
                "title": rng.choice(["Piano", "Soccer", "Football", "Volleyball", "Dance"]),
                "loc": rng.choice(PLACES[1:]),
                "start": start,
                "end": end,
                "drop": drop,
                "pick": pick,
                "stay": drop == pick and drop in ("mom", "dad") and rng.random() < 0.5,
                "arriveBy": start - rng.choice([10, 15, 20, 30]) if rng.random() < 0.3 else None,
            }
        )
    busy: dict[str, list[dict[str, Any]]] = {}
    for d in ("mom", "dad"):
        if rng.random() < 0.5:
            end = rng.randrange(14 * 60, 18 * 60, 5)
            busy[d] = [{"start": end - rng.choice([60, 120, 240, 480]), "end": end, "title": "Work"}]
    along = {"mom": rng.random() < 0.4, "dad": rng.random() < 0.4}
    return {"events": events, "along": along, "busy": busy}


def test_matches_reference_on_random_days() -> None:
    assert NODE is not None
    rng = random.Random(SEED)
    days = [random_day(rng, n) for n in range(DAYS)]
    result = subprocess.run(
        [NODE, str(CLI), "board"],
        input=json.dumps(days),
        capture_output=True,
        text=True,
        check=True,
        timeout=120,
    )
    reference = json.loads(result.stdout)

    for n, (day, want) in enumerate(zip(days, reference, strict=True)):
        got = board_json(day)
        for part in ("expected", "score", "issue_texts", "rides", "outings", "lines"):
            assert got[part] == want[part], f"day {n}, {part}: {json.dumps(day)}"
