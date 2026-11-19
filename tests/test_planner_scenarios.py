"""The planner port against the golden scenarios from the ride board mockup."""

from __future__ import annotations

from dataclasses import replace
import json
from pathlib import Path
from typing import Any

import pytest

from custom_components.mydashlight.board import build_day, span
from custom_components.mydashlight.planner import (
    NOT_NEEDED,
    Issue,
    Labels,
    PlannerSettings,
    RideEvent,
    arrive_at,
    arrive_early,
    driving_text,
    early_for_drive,
    issue_text,
    minutes_text,
    plan_all,
    plan_driver,
    with_rides_along,
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
    assert any(e.get("pickAlong") for s in SCENARIOS for e in s["input"]["events"])
    assert len(SCENARIOS) == 17


def test_arrive_early_grows_with_the_drive() -> None:
    # Marty, 2026-11-12: one smooth curve, about 3 for no drive, 5 for 10 minutes, 10 for 35, 15 for
    # an hour and 20 for two, still growing past that for gas stops.
    settings = PlannerSettings()
    early = {d: arrive_early("x", settings, lambda _a, _b, d=d: d) for d in (0, 5, 10, 35, 60, 90, 120, 180, 240)}
    assert early == {0: 3, 5: 4, 10: 5, 35: 10, 60: 14, 90: 17, 120: 20, 180: 24, 240: 27}
    assert all(early_for_drive(d) <= early_for_drive(d + 1) for d in range(600))
    assert arrive_early("x", PlannerSettings(fixed_early=5), lambda _a, _b: 60) == 5
    # Marty, 2026-11-08: Arrive by (be there earlier than the event says) and the traffic margin
    # are different needs, so the margin still comes off the Arrive by time.
    e = RideEvent("e", "ava", "Piano", "piano", 960, 1020, arrive_by=930)
    assert arrive_at(e, settings, lambda _a, _b: 60) == 930 - 14
    assert arrive_at(replace(e, arrive_by=None), settings, lambda _a, _b: 60) == 946


def test_a_pick_up_gets_the_traffic_margin_too() -> None:
    # Marty, 2026-11-12: padding was only on drop-offs. A pick-up 30 minutes away aims to be there
    # 9 minutes early, and the driver waits for the kid.
    game = RideEvent("game", "ben", "Game", "field", 1050, 1140, pick="mom")
    day = plan_driver("mom", [game], {}, lambda a, b: 0 if a == b else 30)
    pick = next(s for s in day.stops if s.kind == "pick")
    assert (day.leave, pick.arrive) == (1140 - 9 - 30, 1140 - 9)
    assert [(g.type, g.start, g.end) for g in day.segments][:2] == [("drive", 1101, 1131), ("wait", 1131, 1140)]
    assert day.issues == []


def test_arrive_by_keeps_the_traffic_margin() -> None:
    # Marty, 2026-11-08: Arrive by 5:15 for a 5:30 game 30 minutes away. The traffic margin for a
    # 30-minute drive is 9, so leave at 4:36, not 4:45.
    game = RideEvent("game", "ben", "Game", "field", 1050, 1140, drop="mom", arrive_by=1035)
    day = plan_driver("mom", [game], {}, lambda a, b: 0 if a == b else 30)
    assert day.leave == 1035 - 9 - 30
    assert day.issues == []


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


def test_a_rider_already_at_the_pick_up_is_not_fetched_from_home() -> None:
    # Ava is dropped early for tap (Arrive by 6:40) at the studio Cleo's hip hop lets out of at
    # 6:45, and Ava is also named as riding along on Cleo's pick-up. She is already there, still
    # in tap, so Robin waits for Cleo instead of going home for Ava and picking Cleo up late.
    hiphop = RideEvent("hiphop", "cleo", "Hip Hop", "dance", 1080, 1125, drop="mom", pick="mom", pick_along=("ava",))
    tap = RideEvent("tap", "ava", "Tap", "dance", 1155, 1200, drop="mom", pick=NOT_NEEDED, arrive_by=1120)
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
    # Done by the pick-up instead, Ava gets in the car there, still without a trip home for her.
    short = replace(tap, start=1095, end=1120, arrive_by=None)
    stops = plan_driver("mom", [hiphop, short], {}, travel).stops
    assert [(s.kind, s.loc, s.car) for s in stops] == [
        ("start", "home", ["cleo"]),
        ("drop", "dance", []),
        ("fetch", "home", ["ava"]),
        ("drop", "dance", []),
        ("pick", "dance", ["ava", "cleo"]),
        ("end", "home", []),
    ]
    # A rider who wasn't dropped there still comes from home.
    stops = plan_driver("mom", [hiphop], {}, travel).stops
    assert [(s.kind, s.car) for s in stops] == [
        ("start", ["cleo"]),
        ("drop", []),
        ("fetch", ["ava"]),
        ("pick", ["ava", "cleo"]),
        ("end", []),
    ]


def test_a_rider_dropped_off_earlier_is_never_fetched_from_home() -> None:
    hiphop = RideEvent("hiphop", "cleo", "Hip Hop", "dance", 1080, 1125, drop="mom", pick="mom")
    tap = RideEvent("tap", "ava", "Tap", "dance", 1155, 1200, drop="mom", pick=NOT_NEEDED, arrive_by=1120)
    on_time = [
        ("start", "home", ["cleo"]),
        ("drop", "hiphop", []),
        ("fetch", "home", ["ava"]),
        ("drop", "tap", []),
        ("pick", "hiphop", ["cleo"]),
        ("end", "home", []),
    ]
    # Cleo, still in hip hop, named as riding along on Ava's drop-off: she isn't at home.
    plan = plan_driver("mom", [hiphop, replace(tap, along=("cleo",))], {}, travel)
    assert plan.issues == []
    assert [(s.kind, s.event.id if s.event else s.loc, s.car) for s in plan.stops] == on_time
    # Ava dropped off somewhere else nearby, and named on Cleo's pick-up: she isn't at home either.
    near = _drive({frozenset({"home", "dance"}): 8, frozenset({"home", "gym"}): 8, frozenset({"dance", "gym"}): 5})
    plan = plan_driver("mom", [replace(hiphop, pick_along=("ava",)), replace(tap, loc="gym")], {}, near)
    assert plan.issues == []
    assert [(s.kind, s.loc) for s in plan.stops] == [
        ("start", "home"),
        ("drop", "dance"),
        ("fetch", "home"),
        ("drop", "gym"),
        ("pick", "dance"),
        ("end", "home"),
    ]


def test_a_drop_off_nearby_just_after_a_pick_up_goes_first() -> None:
    # Ava has to be at the gym 5 minutes from the studio by 6:55 (6:50 with the traffic margin),
    # just after Cleo's hip hop lets out at 6:45. Dropping Ava off first gets both there in time,
    # instead of picking Cleo up, going home for Ava and getting her there late.
    near = _drive({frozenset({"home", "dance"}): 8, frozenset({"home", "gym"}): 8, frozenset({"dance", "gym"}): 5})
    hiphop = RideEvent("hiphop", "cleo", "Hip Hop", "dance", 1080, 1125, drop="mom", pick="mom")
    tap = RideEvent("tap", "ava", "Tap", "gym", 1155, 1200, drop="mom", pick=NOT_NEEDED, arrive_by=1135)
    plan = plan_driver("mom", [hiphop, tap], {}, near)
    assert plan.issues == []
    assert [(s.kind, s.loc) for s in plan.stops] == [
        ("start", "home"),
        ("drop", "dance"),
        ("fetch", "home"),
        ("drop", "gym"),
        ("pick", "dance"),
        ("end", "home"),
    ]
    # Ava is there by 6:35, and Robin is at the studio at 6:40, the traffic margin early for Cleo.
    assert [round(s.arrive or 0) for s in plan.stops if s.kind in ("drop", "pick")][1:] == [1115, 1120]


def test_a_rider_from_home_doesnt_make_the_pick_up_late() -> None:
    # Ava rides along to Cleo's 6:45 pick-up and is dropped at tap there afterwards. The car
    # leaves home in time for the pick-up, the traffic margin early, not just in time for tap.
    hiphop = RideEvent("hiphop", "cleo", "Hip Hop", "dance", 1080, 1125, drop="mom", pick="mom", pick_along=("ava",))
    tap = RideEvent("tap", "ava", "Tap", "dance", 1155, 1200, drop="mom", pick=NOT_NEEDED)
    plan = plan_driver("mom", [hiphop, tap], {}, travel)
    assert plan.issues == []
    pick = next(s for s in plan.stops if s.kind == "pick")
    assert pick.arrive == 1125 - 5


def test_a_few_seconds_late_is_not_late() -> None:
    # Ben goes straight from soccer (ends 4:00) to piano (Arrive by 4:18, less 5 min for traffic
    # on a 10-minute drive: aim for 4:13).
    soccer = RideEvent("soccer", "ben", "Soccer", "soccer", 900, 960, drop="dad", pick="mom")
    piano = RideEvent("piano", "ben", "Piano", "piano", 975, 1020, drop="mom", arrive_by=978)

    def issues(drive: float) -> list[Issue]:
        return plan_driver(
            "mom", [soccer, piano], {}, lambda a, b: drive if {a, b} == {"soccer", "piano"} else 10
        ).issues

    # 12 seconds late shows as 4:13 either way, so it isn't late.
    assert issues(13.2) == []
    (late,) = issues(13.6)
    assert late.kind == "late"
    assert issue_text(late, LABELS).body == (
        "Robin gets there at 4:14, 1 min after the 4:13 target, 5 min before the 4:18 arrive-by time."
    )
    assert [minutes_text(v) for v in (15.200000000000045, 0.5, 2.0, None)] == ["15", "1", "2", "0"]


def _drive(table: dict[frozenset[str], int]) -> Any:
    return lambda a, b: 0 if a == b else table[frozenset({a, b})]


def test_kids_taken_along_from_home_go_straight_on_to_their_own_event() -> None:
    # Ava is picked up first. Ava's golf takes Ben along, and Ben's game takes Ava along, with
    # the driver staying at both: Ben comes from home before golf, then golf goes straight on to
    # the game instead of back home for Ben.
    drive = _drive(
        {
            frozenset({"home", "party"}): 10,
            frozenset({"home", "golf"}): 20,
            frozenset({"home", "gym"}): 25,
            frozenset({"party", "golf"}): 25,
            frozenset({"party", "gym"}): 30,
            frozenset({"golf", "gym"}): 25,
        }
    )
    party = RideEvent("party", "ava", "Party", "party", 0, 690, drop=NOT_NEEDED, pick="mom")
    golf = RideEvent("golf", "ava", "Golf", "golf", 840, 960, drop="mom", pick="mom", stay=True, along=("ben",))
    game = RideEvent("game", "ben", "Game", "gym", 1005, 1080, drop="mom", pick="mom", stay=True, along=("ava",))
    plan = plan_all([party, golf, game], {}, drive)
    assert [(s.kind, s.loc) for s in plan["mom"].stops] == [
        ("start", "home"),
        ("pick", "party"),
        ("fetch", "home"),
        ("stay", "golf"),
        ("stay", "gym"),
        ("end", "home"),
    ]
    assert plan.hard == []
    to_game = next(g for g in plan["mom"].segments if g.type == "drive" and g.to_loc == "gym")
    assert (to_game.from_loc, sorted(to_game.kids)) == ("golf", ["ava", "ben"])


def test_kids_with_somewhere_to_be_leave_home_again() -> None:
    # Ben's game in the morning takes Cleo along. After picking Ava up, the driver has time to
    # go home before Ava's golf, which takes Ben and Cleo: all three leave home again for it.
    drive = _drive(
        {
            frozenset({"home", "field"}): 30,
            frozenset({"home", "party"}): 10,
            frozenset({"home", "golf"}): 20,
            frozenset({"field", "party"}): 35,
            frozenset({"field", "golf"}): 40,
            frozenset({"party", "golf"}): 25,
        }
    )
    game = RideEvent("game", "ben", "Game", "field", 600, 660, drop="mom", pick="mom", stay=True, along=("cleo",))
    party = RideEvent("party", "ava", "Party", "party", 0, 690, drop=NOT_NEEDED, pick="mom")
    golf = RideEvent("golf", "ava", "Golf", "golf", 840, 960, drop="mom", pick="mom", stay=True, along=("ben", "cleo"))
    plan = plan_all([game, party, golf], {}, drive)
    segments = plan["mom"].segments
    home = next(i for i, g in enumerate(segments) if g.type == "home")
    to_golf = segments[home + 1]
    assert (to_golf.type, to_golf.from_loc, to_golf.to_loc) == ("drive", "home", "golf")
    assert sorted(to_golf.kids) == ["ava", "ben", "cleo"]


def test_a_kid_picked_up_twice_is_in_the_car_both_times() -> None:
    # Robin brings Ava home from piano, Sam takes her to a party, and Robin fetches her again.
    drive = _drive(
        {frozenset({"home", "piano"}): 15, frozenset({"home", "party"}): 15, frozenset({"piano", "party"}): 20}
    )
    piano = RideEvent("piano", "ava", "Piano", "piano", 960, 1020, drop="mom", pick="mom")
    party = RideEvent("party", "ava", "Party", "party", 1080, 1140, drop="dad", pick="mom")
    plan = plan_all([piano, party], {}, drive)
    home_rides = [g.kids for g in plan["mom"].segments if g.type == "drive" and g.to_loc == "home"]
    assert home_rides == [[], ["ava"], ["ava"]]


def test_a_very_long_drive_is_called_out_on_the_trip() -> None:
    # Marty, 2026-11-17: a 14-hour drive to a place Google got wrong looked like a short drive
    # that left hours early, because a trip only listed its stops.
    game = RideEvent("game", "ben", "Game", "soccer", 1080, 1140, drop="mom")

    def far(a: str, b: str) -> float:
        return 0 if a == b else 875.8 if "soccer" in (a, b) else 10

    board = build_day([game], {}, far, LABELS, kids=KIDS)
    (out, *_rest) = board.outings["mom"]
    assert out.warn == "14 hr 36 min drive to Soccer. Is the address right?"
    board = build_day([game], {}, lambda a, b: 0 if a == b else 119, LABELS, kids=KIDS)
    assert all(not o.warn for o in board.outings["mom"])
    assert [span(m) for m in (0, 45, 120, 875.8)] == ["0 min", "45 min", "2 hr", "14 hr 36 min"]


def test_a_pick_up_driven_straight_on_still_has_its_time() -> None:
    # Marty, 2026-11-17: Hip Hop's pick-up went straight on to Girl Scouts, so the card said
    # "Pick-up: Sam" with no time, and Compact showed a bare "↑".
    dance = RideEvent("dance", "cleo", "Hip Hop", "dance", 1080, 1125, drop="mom", pick="mom")
    scouts = RideEvent("scouts", "cleo", "Scouts", "soccer", 1140, 1200, drop="mom", pick="Robin")
    board = build_day([dance, scouts], {}, travel, LABELS, kids=KIDS)
    pick = board.lines["dance"].pick
    assert pick is not None
    assert pick.text == "Picked up 6:45 by " + LABELS.driver("mom")


def test_arrive_late_and_leave_late() -> None:
    # Marty, 2026-11-17: sometimes they get there late, or are picked up after the end.
    game = RideEvent("game", "ben", "Game", "soccer", 960, 1020, drop="mom", pick="mom", arrive_by=975, leave_by=1035)
    assert game.out == 1035
    board = build_day([game], {}, travel, LABELS, kids=KIDS)
    lines = board.lines["game"]
    assert lines.drop is not None
    assert lines.pick is not None
    # There by 4:15 less the traffic margin, not 4:00; picked up at 5:15, not 5:00.
    assert lines.pick.text.startswith("Home 5:")
    stops = board.plan["mom"].stops
    drop = next(s for s in stops if s.kind == "drop")
    pick = next(s for s in stops if s.kind == "pick")
    assert drop.arrive is not None
    assert 960 < drop.arrive <= 975
    assert pick.ready == 1035
    assert not board.plan.hard


def test_a_kid_taken_along_while_busy_elsewhere_is_a_problem() -> None:
    # Marty, 2026-11-17: a stop at a friend's on the way to Hip Hop's pick-up took Cleo along,
    # in the middle of Hip Hop. The car went home for her and everything after ran late, and
    # the board only showed a quiet clash.
    hiphop = RideEvent("hiphop", "cleo", "Hip Hop", "dance", 1080, 1125, drop="mom", pick="mom")
    friend = RideEvent(
        "friend", "mom", "Pick up Noah", "party", 1115, 1117, drop="mom", pick="mom", stay=True, own="mom"
    )
    ok = build_day([hiphop, friend], {}, travel, LABELS, kids=KIDS)
    board = build_day([hiphop, replace(friend, along=("cleo",))], {}, travel, LABELS, kids=KIDS)
    (issue,) = [x for x in board.plan.hard if x.kind == "alongBusy"]
    assert issue.event is not None
    assert (issue.event.id, issue.side, issue.kid) == ("friend", "drop", "cleo")
    text = issue_text(issue, LABELS)
    assert text.title == "Cleo can’t be in two places"
    assert text.body == (
        "Cleo is at Hip Hop 6:00–6:45, so can’t be taken along to Pick up Noah at 6:35. "
        "The rides are planned without Cleo."
    )
    # Planned as if she weren't named: same route, nobody fetched from home, no extra clash.
    assert [(s.kind, s.loc, s.car) for s in board.plan["mom"].stops] == [
        (s.kind, s.loc, s.car) for s in ok.plan["mom"].stops
    ]
    assert board.clashes == []
    assert all(it.event is None or it.event.id != "friend" for it in board.kid_items["cleo"])
    assert [x.kind for x in board.plan.hard] == ["alongBusy", *(x.kind for x in ok.plan.hard)]


def test_a_kid_riding_along_on_a_pick_up_while_busy_elsewhere_is_a_problem() -> None:
    soccer = RideEvent("soccer", "ben", "Soccer", "soccer", 1020, 1080, drop="mom", pick="mom", pick_along=("ava",))
    piano = RideEvent("piano", "ava", "Piano", "piano", 1050, 1110, drop="dad", pick="dad")
    plan = plan_all([soccer, piano], {}, travel)
    (issue,) = [x for x in plan.hard if x.kind == "alongBusy"]
    assert (issue.side, issue.kid) == ("pick", "ava")
    assert issue_text(issue, LABELS).body == (
        "Ava is at Piano 5:30–6:30, so can’t ride along on the 6:00 pick-up from Ben’s Soccer. "
        "The rides are planned without Ava."
    )
    assert all("ava" not in s.car for s in plan["mom"].stops)
    # Not going to piano that day, she can ride along.
    plan = plan_all([soccer, replace(piano, attending=False)], {}, travel)
    assert not [x for x in plan.hard if x.kind == "alongBusy"]


def test_a_parent_along_with_several_kids_is_busy_once() -> None:
    # Marty, 2026-11-18: a family dinner naming all three kids and both parents showed five
    # "riding along" blocks for the parent who wasn't driving, one for each kid's copy and side.
    dinner = RideEvent(
        "dinner",
        "ava",
        "Dinner",
        "party",
        1005,
        1095,
        drop="mom",
        pick="mom",
        parents=("dad",),
        pick_parents=("dad",),
    )
    copies = [dinner, replace(dinner, id="dinner~2", kid="ben"), replace(dinner, id="dinner~3", kid="cleo", stay=True)]
    busy = with_rides_along(copies, {}, travel)
    # Home to Noah's is 9 minutes: one block from leaving for the drop-off until back after it.
    leave = arrive_at(dinner, PlannerSettings(), travel) - 9
    assert [(b.start, b.end, b.title) for b in busy["dad"]] == [(leave, 1095 + 9, "Dinner")]
    # Without the stay there are two trips, there and later back, and those stay apart.
    apart = with_rides_along(copies[:2], {}, travel)
    assert len(apart["dad"]) == 2
