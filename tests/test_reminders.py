"""Working out reminders from the plan: leave reminders, calendar reminders and no-driver alerts."""

from __future__ import annotations

from dataclasses import replace
from datetime import datetime, timedelta
from typing import Any

from custom_components.mydashlight.google import REMINDER_MARK
from custom_components.mydashlight.payload import plan_week
from custom_components.mydashlight.planner import PlannerSettings
from custom_components.mydashlight.reminders import (
    MAX_REMINDER,
    at_minutes,
    calendar_reminders,
    leave_reminders,
    missing_message,
    missing_rides,
    reminder_writes,
)
from custom_components.mydashlight.week import WeekInput, make_travel

from .common import AVA, BEN, timed
from .test_week import SCHOOL, TODAY, TZ, at, week

DRIVERS = ("mom", "dad")
PARK = "Park, 2 Oak St"


def plan(w: WeekInput) -> list[dict[str, Any]]:
    travel = make_travel(w.travel_overrides, 15)
    # A fixed 5 minutes early keeps the times here easy to follow.
    return plan_week(w, lambda _day: travel, PlannerSettings(arrive_early_per=0), DRIVERS)


def piano_and_soccer(**piano: Any) -> WeekInput:
    """Robin takes Ava to piano with Ben along, drops Ben at soccer, and picks Ava up. Sam
    picks Ben up."""
    return week(
        {
            AVA: [
                timed(
                    "piano",
                    "Piano",
                    at(3, "16:00"),
                    at(3, "17:00"),
                    location=SCHOOL,
                    description="Drop-off: Robin\nPick-up: Robin\nTake along: Ben",
                    **piano,
                )
            ],
            BEN: [
                timed(
                    "soccer",
                    "Soccer",
                    at(3, "16:30"),
                    at(3, "17:30"),
                    location=PARK,
                    description="Drop-off: Robin\nPick-up: Sam",
                )
            ],
        },
        days=2,
    )


def test_outings_say_what_they_are_for_and_tell_each_kid() -> None:
    days = plan(piano_and_soccer())
    robin = days[0]["drivers"]["mom"]["outings"]
    sam = days[0]["drivers"]["dad"]["outings"]
    assert [o["title"] for o in robin] == [
        "Drop off Ava at Lincoln Elementary, drop off Ben at Park, pick up Ava at Lincoln Elementary"
    ]
    assert robin[0]["first_drop"] == "piano"
    assert robin[0]["riders"] == {
        AVA: "Leave home at 3:40 PM with Robin. Pick-up at 5:00 PM at Lincoln Elementary",
        BEN: "Leave home at 3:40 PM with Robin",
    }
    assert [o["title"] for o in sam] == ["Pick up Ben at Park"]
    assert sam[0]["first_drop"] is None
    assert sam[0]["riders"] == {BEN: "Sam picks you up at Park at 5:30 PM"}


def test_single_stop_titles() -> None:
    days = plan(
        week(
            {
                AVA: [
                    timed(
                        "piano",
                        "Piano",
                        at(3, "16:00"),
                        at(3, "18:00"),
                        location=SCHOOL,
                        description="Drop-off: Robin\nPick-up: Sam",
                    )
                ],
                BEN: [
                    timed(
                        "swim",
                        "Swim",
                        at(3, "19:00"),
                        at(3, "20:00"),
                        location=PARK,
                        description="Drop-off: Robin\nPick-up: Robin\nStay: yes",
                    )
                ],
            },
            days=1,
        )
    )
    robin = [o["title"] for o in days[0]["drivers"]["mom"]["outings"]]
    assert robin == ["Drive Ava to Lincoln Elementary", "Drive Ben to Park and stay"]


def test_leave_reminders_for_drivers_and_kids_with_a_notifier() -> None:
    days = plan(piano_and_soccer())
    reminders = leave_reminders(days, DRIVERS, {"mom", "dad", BEN}, 15, TZ)
    by_who = {(r.who, r.key): r for r in reminders}
    robin = by_who[("mom", "2026-11-03|mom|piano|0")]
    assert robin.leave == datetime(2026, 11, 3, 15, 40, tzinfo=TZ)
    assert robin.at == datetime(2026, 11, 3, 15, 25, tzinfo=TZ)
    assert robin.title.startswith("Leave at 3:40 PM: Drop off Ava at Lincoln Elementary")
    assert robin.message.splitlines()[0] == "Leave 3:40"
    assert "4:25  Park, drop off Ben" in robin.message
    ben = by_who[(BEN, f"2026-11-03|mom|piano|0|{BEN}")]
    assert ben.title == "Leave home at 3:40 PM with Robin"
    assert ben.at == robin.at
    sam_ben = by_who[(BEN, f"2026-11-03|dad|soccer|0|{BEN}")]
    assert sam_ben.title == "Sam picks you up at Park at 5:30 PM"
    assert sam_ben.message == "Pick up Ben at Park"
    # Ava has no notifier, so nothing for her.
    assert not any(r.who == AVA for r in reminders)
    # Only the people asked for.
    assert {r.who for r in leave_reminders(days, DRIVERS, {"dad"}, 10, TZ)} == {"dad"}


def test_calendar_reminders_go_on_the_first_drop_off() -> None:
    days = plan(piano_and_soccer())
    # Robin leaves at 3:40 for piano at 4:00: a reminder 15 minutes before leaving is 35
    # minutes before piano. Ben's soccer is on the same drive, so it gets none, and Sam's
    # pick-up can't have one.
    assert calendar_reminders(days, DRIVERS, 15) == {("2026-11-03", "piano"): 35}
    assert calendar_reminders(days, DRIVERS, 0) == {("2026-11-03", "piano"): 20}


def test_reminder_writes() -> None:
    w = piano_and_soccer()
    wanted = {("2026-11-03", "piano"): 35}
    morning = datetime(2026, 11, 3, 9, tzinfo=TZ)
    writes = reminder_writes(w.days, wanted, morning, TZ)
    assert [(x.calendar_id, x.event_id, x.minutes) for x in writes] == [(AVA, "piano", 35)]
    assert writes[0].private == {}

    # Already there: nothing to do.
    ref = w.days[0].refs["piano"]
    w.days[0].refs["piano"] = replace(ref, popups=(35,), private=((REMINDER_MARK, "35"), ("other", "x")))
    assert reminder_writes(w.days, wanted, morning, TZ) == []
    # Moved: saved again, keeping other apps' properties.
    moved = reminder_writes(w.days, {("2026-11-03", "piano"): 30}, morning, TZ)
    assert [(x.minutes, dict(x.private)) for x in moved] == [(30, {"other": "x"})]
    # No longer wanted: MyDashLight takes its reminder off.
    off = reminder_writes(w.days, {}, morning, TZ)
    assert [(x.event_id, x.minutes) for x in off] == [("piano", None)]
    # A reminder someone else set is left alone.
    w.days[0].refs["piano"] = replace(ref, popups=(10,), private=())
    assert reminder_writes(w.days, {}, morning, TZ) == []
    # Events that have started are left as they are.
    assert reminder_writes(w.days, wanted, datetime(2026, 11, 3, 16, tzinfo=TZ), TZ) == []


def test_reminders_never_go_past_googles_limit() -> None:
    days = [
        {
            "date": "2026-11-03",
            "events": [{"id": "trip", "start": 50000, "sides": ["drop"]}],
            "drivers": {"mom": {"outings": [{"start": 0, "first_drop": "trip"}]}, "dad": {"outings": []}},
        }
    ]
    assert calendar_reminders(days, DRIVERS, 15) == {("2026-11-03", "trip"): MAX_REMINDER}


def test_missing_rides() -> None:
    w = week(
        {
            AVA: [
                timed("piano", "Piano", at(3, "16:00"), at(3, "17:00"), location=SCHOOL),
                timed("art", "Art", at(4, "16:00"), at(4, "17:00"), location=SCHOOL, description="Pick-up: none"),
                timed("late", "Camp", at(6, "16:00"), at(6, "17:00"), location=SCHOOL),
            ],
            BEN: [timed("soccer", "Soccer", at(3, "08:00"), at(3, "09:30"), description="Drop-off: Robin")],
        },
        days=4,
    )
    days = plan(w)
    # At 9 AM only the next six hours count: Ben's drop-off has a driver, his pick-up at
    # 9:30 doesn't. Piano is later today, art tomorrow and camp later in the week.
    missing = missing_rides(days, datetime(2026, 11, 3, 9, tzinfo=TZ), TZ)
    assert [m.key for m in missing] == ["2026-11-03|soccer|pick"]
    assert missing[0].text == "Tue 9:30 AM  Ben home from Soccer"
    # By 11 AM, Ben's pick-up has gone by and both piano rides are within six hours.
    missing = missing_rides(days, datetime(2026, 11, 3, 11, tzinfo=TZ), TZ)
    assert [m.key for m in missing] == ["2026-11-03|piano|drop", "2026-11-03|piano|pick"]
    assert missing[0].text == "Tue 4:00 PM  Ava to Piano (Lincoln Elementary)"
    # Art's drop-off is at 4 PM tomorrow.
    later = missing_rides(days, datetime(2026, 11, 4, 10, tzinfo=TZ), TZ)
    assert [m.key for m in later] == ["2026-11-04|art|drop"]
    # A longer window reaches further: at 9 AM, eight hours takes in both piano rides.
    wide = missing_rides(days, datetime(2026, 11, 3, 9, tzinfo=TZ), TZ, timedelta(hours=8))
    assert [m.key for m in wide] == ["2026-11-03|soccer|pick", "2026-11-03|piano|drop", "2026-11-03|piano|pick"]
    title, message = missing_message(missing)
    assert title == "2 rides need a driver"
    assert message.splitlines()[0] == "Tue 4:00 PM  Ava to Piano (Lincoln Elementary)"
    assert missing_message(missing[:1])[0] == "A ride needs a driver"
    many = [replace(missing[0], key=str(i)) for i in range(10)]
    assert missing_message(many)[1].splitlines()[-1] == "and 2 more"


def test_at_minutes_runs_into_the_next_day() -> None:
    assert at_minutes(TODAY, 1450, TZ) == datetime(2026, 11, 4, 0, 10, tzinfo=TZ)
    assert at_minutes(TODAY, 59.6, TZ) == datetime(2026, 11, 3, 1, 0, tzinfo=TZ)
