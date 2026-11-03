"""Changing rides through the services: saved in the event notes on Google, then replanned."""

from __future__ import annotations

from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import SOURCE_REAUTH
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from custom_components.mydashlight.const import DOMAIN

from .common import AVA, BEN, ROBIN, FakeGoogle, google_error, make_entry, setup_credentials, timed

NOW = "2026-11-03T15:00:00+00:00"  # 9 AM in Central time, a Tuesday
PIANO = "Piano studio, 1 Elm St"
SWIM = "Pool, 9 Lake Rd"


@pytest.fixture(autouse=True)
async def setup(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    await hass.config.async_set_time_zone("America/Chicago")
    freezer.move_to(NOW)
    await setup_credentials(hass)


@pytest.fixture
def google(aioclient_mock: AiohttpClientMocker) -> FakeGoogle:
    g = FakeGoogle(aioclient_mock)
    g.add(
        AVA,
        **timed(
            "piano",
            "Piano",
            "2026-11-03T16:00:00-06:00",
            "2026-11-03T17:00:00-06:00",
            location=PIANO,
            description="Bring the music book.",
        ),
    )
    return g


async def load(hass: HomeAssistant) -> MockConfigEntry:
    entry = make_entry()
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def call(hass: HomeAssistant, service: str, **data: Any) -> None:
    await hass.services.async_call(DOMAIN, service, data, blocking=True)


def planned(entry: MockConfigEntry, ride_id: str, day: int = 0) -> dict[str, Any]:
    days: list[dict[str, Any]] = entry.runtime_data.coordinator.data.days
    return next(e for e in days[day]["events"] if e["id"] == ride_id)


async def test_set_driver(hass: HomeAssistant, google: FakeGoogle) -> None:
    entry = await load(hass)
    assert planned(entry, "piano")["drop"] == ""

    await call(hass, "set_ride", event="piano", side="drop", driver="dad")

    assert google.patches == [
        (AVA, "piano", '"0"', {"description": "Bring the music book.\n\n--- Rides ---\nDrop-off: Sam"})
    ]
    # Planned again straight away, from what Google now has.
    assert planned(entry, "piano")["drop"] == "dad"
    assert planned(entry, "piano")["pick"] == ""

    # By name, both ways, and nothing is written when nothing changes.
    await call(hass, "set_ride", event="piano", side="both", driver="Sam")
    assert len(google.patches) == 2
    assert google.event(AVA, "piano")["description"].endswith("Drop-off: Sam\nPick-up: Sam")
    await call(hass, "set_ride", event="piano", side="pick", driver="sam")
    assert len(google.patches) == 2

    # A carpool, then nobody.
    await call(hass, "set_ride", event="piano", side="pick", driver="the parkers")
    assert planned(entry, "piano")["pick"] == "the Parkers"
    await call(hass, "set_ride", event="piano", side="both")
    assert google.event(AVA, "piano")["description"] == "Bring the music book."
    assert planned(entry, "piano")["drop"] == ""


async def test_stay_and_arrive_by(hass: HomeAssistant, google: FakeGoogle) -> None:
    google.event(AVA, "piano")["description"] = "<b>Bring</b> the music book.<br>Drop-off: Robin<br>Pick-up: Robin"
    entry = await load(hass)

    await call(hass, "set_stay", event="piano", stay=True)
    await call(hass, "set_arrive_by", event="piano", time="15:45")

    assert google.event(AVA, "piano")["description"] == (
        "<b>Bring</b> the music book.<br><br>--- Rides ---<br>Drop-off: Robin<br>Pick-up: Robin<br>Stay: yes"
        "<br>Arrive by: 3:45 PM"
    )
    event = planned(entry, "piano")
    assert event["stay"] is True
    assert event["arrive_by"] == 15 * 60 + 45

    await call(hass, "set_arrive_by", event="piano")
    assert planned(entry, "piano")["arrive_by"] is None
    assert "Arrive by" not in google.event(AVA, "piano")["description"]


async def test_someone_else_edits_at_the_same_time(hass: HomeAssistant, google: FakeGoogle) -> None:
    entry = await load(hass)
    google.edits_in_between = 1

    await call(hass, "set_ride", event="piano", side="drop", driver="mom")

    # The first save was turned down; the change went on top of the other edit.
    assert google.event(AVA, "piano")["description"] == (
        "Bring the music book.\nEdited on a phone\n\n--- Rides ---\nDrop-off: Robin"
    )
    assert planned(entry, "piano")["drop"] == "mom"

    google.edits_in_between = 3
    with pytest.raises(HomeAssistantError) as err:
        await call(hass, "set_ride", event="piano", side="pick", driver="mom")
    assert err.value.translation_key == "write_conflict"


def lessons(google: FakeGoogle) -> None:
    """Swim lessons every day this week. Thursday's was changed by itself."""
    google.add_series(BEN, id="swim", summary="Swim", description="Goggles.")
    for day, description in (("03", "Goggles."), ("04", "Goggles."), ("05", "Goggles. Lane 4 on Thursday.")):
        google.add(
            BEN,
            **timed(
                f"swim_202611{day}",
                "Swim",
                f"2026-11-{day}T17:00:00-06:00",
                f"2026-11-{day}T18:00:00-06:00",
                location=SWIM,
                description=description,
                recurringEventId="swim",
            ),
        )


async def test_just_this_one(hass: HomeAssistant, google: FakeGoogle) -> None:
    lessons(google)
    entry = await load(hass)
    assert planned(entry, "swim_20261104", 1)["recurring"] is True

    await call(hass, "set_ride", event="swim_20261104", side="drop", driver="mom")

    assert [p[1] for p in google.patches] == ["swim_20261104"]
    assert planned(entry, "swim_20261103", 0)["drop"] == ""
    assert planned(entry, "swim_20261104", 1)["drop"] == "mom"


async def test_every_one(hass: HomeAssistant, google: FakeGoogle) -> None:
    lessons(google)
    entry = await load(hass)

    await call(hass, "set_ride", event="swim_20261104", side="pick", driver="dad", scope="series")

    # The series, then Thursday's, which has its own notes and so doesn't follow the series.
    assert [p[1] for p in google.patches] == ["swim", "swim_20261105"]
    assert google.event(BEN, "swim")["description"] == "Goggles.\n\n--- Rides ---\nPick-up: Sam"
    assert google.event(BEN, "swim_20261105")["description"] == (
        "Goggles. Lane 4 on Thursday.\n\n--- Rides ---\nPick-up: Sam"
    )
    assert [planned(entry, f"swim_202611{d}", i)["pick"] for i, d in enumerate(("03", "04", "05"))] == ["dad"] * 3


async def test_every_one_of_an_event_that_does_not_repeat(hass: HomeAssistant, google: FakeGoogle) -> None:
    entry = await load(hass)
    await call(hass, "set_ride", event="piano", side="drop", driver="dad", scope="series")
    assert [p[1] for p in google.patches] == ["piano"]
    assert planned(entry, "piano")["drop"] == "dad"


async def test_unknown_event(hass: HomeAssistant, google: FakeGoogle) -> None:
    await load(hass)
    with pytest.raises(ServiceValidationError) as err:
        await call(hass, "set_stay", event="nope", stay=True)
    assert err.value.translation_key == "event_not_found"
    assert err.value.translation_placeholders == {"event": "nope"}


@pytest.mark.parametrize(
    ("status", "reason", "key"),
    [
        (403, "forbiddenForNonOrganizer", "cant_change_event"),
        (404, "notFound", "cant_change_event"),
        (500, "backendError", "write_failed"),
        (401, "authError", "auth_failed"),
    ],
)
async def test_google_turns_down_the_change(
    hass: HomeAssistant, google: FakeGoogle, status: int, reason: str, key: str
) -> None:
    await load(hass)
    google.write_errors["piano"] = google_error(status, reason)
    with pytest.raises(HomeAssistantError) as err:
        await call(hass, "set_ride", event="piano", side="drop", driver="dad")
    assert err.value.translation_key == key
    reauth = [f for f in hass.config_entries.flow.async_progress() if f["context"]["source"] == SOURCE_REAUTH]
    assert bool(reauth) is (status == 401)


async def test_not_loaded(hass: HomeAssistant, google: FakeGoogle) -> None:
    entry = await load(hass)
    await hass.config_entries.async_unload(entry.entry_id)
    with pytest.raises(ServiceValidationError) as err:
        await call(hass, "set_ride", event="piano", side="drop", driver="dad")
    assert err.value.translation_key == "not_loaded"


async def test_take_along(hass: HomeAssistant, google: FakeGoogle, hass_storage: dict[str, Any]) -> None:
    entry = await load(hass)
    days = lambda: entry.runtime_data.coordinator.data.days  # noqa: E731

    await call(hass, "set_take_along", parent="Robin", on=True)
    await call(hass, "set_take_along", parent="dad", on=True, date="2026-11-05")
    assert days()[0]["along"] == {"mom": True, "dad": False}
    assert days()[2]["along"] == {"mom": False, "dad": True}
    assert hass_storage[f"{DOMAIN}.take_along"]["data"] == {
        "days": {"2026-11-03": {"mom": True}, "2026-11-05": {"dad": True}}
    }

    updated = entry.runtime_data.coordinator.data.updated
    await call(hass, "set_take_along", parent="mom", on=True)
    assert entry.runtime_data.coordinator.data.updated is updated  # already on: no replan

    await call(hass, "set_take_along", parent="mom", on=False)
    assert days()[0]["along"] == {"mom": False, "dad": False}
    assert hass_storage[f"{DOMAIN}.take_along"]["data"] == {"days": {"2026-11-05": {"dad": True}}}

    with pytest.raises(ServiceValidationError) as err:
        await call(hass, "set_take_along", parent="the Parkers", on=True)
    assert err.value.translation_key == "not_a_parent"
    assert err.value.translation_placeholders == {"parent": "the Parkers", "names": "Robin or Sam"}
    with pytest.raises(ServiceValidationError) as err:
        await call(hass, "set_take_along", parent="mom", on=True, date="2026-11-02")
    assert err.value.translation_key == "date_passed"


async def test_take_along_is_kept(
    hass: HomeAssistant, google: FakeGoogle, hass_storage: dict[str, Any], freezer: FrozenDateTimeFactory
) -> None:
    hass_storage[f"{DOMAIN}.take_along"] = {
        "version": 1,
        "key": f"{DOMAIN}.take_along",
        "data": {"days": {"2026-11-01": {"mom": True}, "2026-11-04": {"dad": True}}},
    }
    entry = await load(hass)
    assert entry.runtime_data.coordinator.data.days[1]["along"] == {"mom": False, "dad": True}

    # Days that have passed are dropped on the next change.
    await call(hass, "set_take_along", parent="mom", on=True)
    assert hass_storage[f"{DOMAIN}.take_along"]["data"]["days"] == {
        "2026-11-03": {"mom": True},
        "2026-11-04": {"dad": True},
    }

    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()
    assert f"{DOMAIN}.take_along" not in hass_storage


def suggestions(entry: MockConfigEntry) -> list[dict[str, Any]]:
    return [
        s
        for day in entry.runtime_data.coordinator.data.days
        for issue in day["issues"]
        for s in issue.get("suggestions", ())
    ]


async def test_apply_a_suggested_fix(hass: HomeAssistant, google: FakeGoogle) -> None:
    google.event(AVA, "piano")["description"] = "Drop-off: Robin"
    entry = await load(hass)
    ids = [s["id"] for s in suggestions(entry)]
    assert ids == ["2026-11-03|piano|pick|mom", "2026-11-03|piano|pick|dad"]

    await call(hass, "apply_suggestion", suggestion="2026-11-03|piano|pick|dad")

    assert google.event(AVA, "piano")["description"] == "--- Rides ---\nDrop-off: Robin\nPick-up: Sam"
    assert planned(entry, "piano")["pick"] == "dad"
    assert suggestions(entry) == []

    with pytest.raises(ServiceValidationError) as err:
        await call(hass, "apply_suggestion", suggestion="2026-11-03|piano|pick|dad")
    assert err.value.translation_key == "suggestion_gone"


async def test_apply_a_take_along_fix(hass: HomeAssistant, google: FakeGoogle) -> None:
    # Robin works until 3:30, then drops Ava at piano for 4:00 and Ben at the pool for 4:15.
    # Going home for Ben in between means leaving during work; taking him along doesn't.
    google.event(AVA, "piano")["description"] = "Drop-off: Robin\nPick-up: Robin"
    google.add(
        BEN,
        **timed(
            "swim",
            "Swim",
            "2026-11-03T16:15:00-06:00",
            "2026-11-03T17:15:00-06:00",
            location=SWIM,
            description="Drop-off: Robin\nPick-up: Robin",
        ),
    )
    google.add(ROBIN, **timed("work", "Work", "2026-11-03T09:00:00-06:00", "2026-11-03T15:30:00-06:00"))
    entry = await load(hass)
    along = [s for s in suggestions(entry) if "along" in s["change"]]
    assert along, suggestions(entry)

    await call(hass, "apply_suggestion", suggestion=along[0]["id"])

    assert along[0]["id"] == "2026-11-03|along|mom"
    assert entry.runtime_data.coordinator.data.days[0]["along"]["mom"] is True
    assert google.patches == []
