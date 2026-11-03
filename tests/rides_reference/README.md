# Rides planner reference

`planner-reference.js` is the working planner from the ride board mockup (Option B, 2026-10-27),
with the example family's names changed to made-up ones. One design change since: take-along
is set on an event, as the kids taken along on its drop-off, not on a parent for the whole day
(Marty, 2026-11-03).
The Python port in `custom_components/mydashlight/planner.py` and `board.py` must give the same
answers. Don't edit it to make a test pass: change the design first, then the reference, then the port.

| File | What it is |
| --- | --- |
| `planner-reference.js` | The reference planner from the mockup, with per-event take-along. |
| `cli.js` | Runs the reference for the tests. |
| `scenarios.json` | Golden results for the example week plus three Thursday variants (a take-along, a swapped driver, a double-booking). |

Regenerate the golden file after a deliberate change to the reference:

```sh
node tests/rides_reference/cli.js scenarios > tests/rides_reference/scenarios.json
```

CI checks that the file still matches the reference. `tests/test_planner_vs_reference.py` also runs
1,000 random days through both planners and compares everything: routes, issues, suggestions, rides,
outings and card lines.
