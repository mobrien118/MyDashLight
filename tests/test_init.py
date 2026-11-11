"""Loading the integration, syncing the calendars, the get_plan service and diagnostics."""

from __future__ import annotations

from datetime import timedelta
import logging
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import SOURCE_REAUTH, ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.setup import async_setup_component
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed
from pytest_homeassistant_custom_component.components.diagnostics import get_diagnostics_for_config_entry
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker
from pytest_homeassistant_custom_component.typing import ClientSessionGenerator

from custom_components.mydashlight.const import DOMAIN, OAUTH_TOKEN

from .common import (
    ACCOUNT,
    AVA,
    BEN,
    FAMILY,
    LUNCH,
    OPTIONS,
    FakeGoogle,
    all_day,
    google_error,
    make_entry,
    setup_credentials,
    timed,
)

NOW = "2026-11-03T15:00:00+00:00"  # 9 AM in Central time


@pytest.fixture(autouse=True)
async def setup(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    await hass.config.async_set_time_zone("America/Chicago")
    freezer.move_to(NOW)
    await setup_credentials(hass)


@pytest.fixture
def google(aioclient_mock: AiohttpClientMocker) -> FakeGoogle:
    g = FakeGoogle(aioclient_mock)
    g.add(
        FAMILY,
        **timed(
            "piano",
            "Ava Piano",
            "2026-11-03T16:00:00-06:00",
            "2026-11-03T17:00:00-06:00",
            location="Piano studio, 1 Elm St",
            description="Drop-off: Robin\nPick-up: Robin",
        ),
    )
    g.add(FAMILY, **timed("soccer", "Ben Soccer", "2026-11-04T16:00:00-06:00", "2026-11-04T17:00:00-06:00"))
    g.add(FAMILY, **timed("work", "Robin Work", "2026-11-03T08:00:00-06:00", "2026-11-03T15:00:00-06:00"))
    return g


async def load(hass: HomeAssistant, entry: MockConfigEntry | None = None) -> MockConfigEntry:
    entry = entry or make_entry()
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def get_plan(hass: HomeAssistant, **data: Any) -> dict[str, Any]:
    response = await hass.services.async_call(DOMAIN, "get_plan", data, blocking=True, return_response=True)
    assert isinstance(response, dict)
    return response


async def test_setup_sync_and_unload(hass: HomeAssistant, google: FakeGoogle, freezer: FrozenDateTimeFactory) -> None:
    entry = await load(hass)
    assert entry.state is ConfigEntryState.LOADED
    data = entry.runtime_data.coordinator.data
    assert data.time_zone == "America/Chicago"
    assert data.days[0]["date"] == "2026-11-03"
    assert len(data.days) == 7
    assert data.event_counts == {AVA: 1, BEN: 1, "mom": 1, "dad": 0}
    # One request for the family calendar, for today until 6 AM a week from today. It's also
    # read with the lunch calendar for lunches, from the 1st of this month to the end of next month.
    rides = [u for u in google.calls if u.query["timeMin"] != "2026-11-01T00:00:00-05:00"]
    lunch = [u for u in google.calls if u.query["timeMin"] == "2026-11-01T00:00:00-05:00"]
    assert {u.query["timeMin"] for u in rides} == {"2026-11-03T00:00:00-06:00"}
    assert {u.query["timeMax"] for u in rides} == {"2026-11-10T06:00:00-06:00"}
    assert {u.query["timeMax"] for u in lunch} == {"2027-01-01T00:00:00-06:00"}
    assert len(lunch) == 2

    google.add(FAMILY, **timed("art", "Ava Art", "2026-11-03T18:00:00-06:00", "2026-11-03T19:00:00-06:00"))
    freezer.tick(timedelta(seconds=61))
    async_fire_time_changed(hass)
    await hass.async_block_till_done(wait_background_tasks=True)
    assert [e["id"] for e in entry.runtime_data.coordinator.data.days[0]["events"]] == ["work", "piano", "art"]

    assert await hass.config_entries.async_unload(entry.entry_id)
    assert entry.state is ConfigEntryState.NOT_LOADED


async def test_get_plan(hass: HomeAssistant, google: FakeGoogle) -> None:
    await load(hass)

    plan = await get_plan(hass)
    assert plan["time_zone"] == "America/Chicago"
    assert plan["unavailable_calendars"] == []
    (today,) = plan["days"]
    assert today["date"] == "2026-11-03"
    # Robin's work is only busy time: a card to see, and to mark not going, but no drive.
    work, piano = today["events"]
    assert (work["own"], work["busy_only"], work["busy_why"]) == ("mom", True, "anywhere")
    assert (work["drop"], work["pick"]) == ("none", "none")
    assert work["lines"]["drop"] == {"text": "Can’t drive then", "tone": "muted"}
    assert piano["kid"] == AVA
    assert piano["drop"] == "mom"
    assert today["kids"][AVA]["name"] == "Ava"
    assert today["drivers"]["mom"]["busy"] == [{"start": 480, "end": 900, "title": "Work", "event": "work"}]
    assert today["drivers"]["mom"]["leave"] is not None

    plan = await get_plan(hass, date="2026-11-04", days=2)
    assert [d["date"] for d in plan["days"]] == ["2026-11-04", "2026-11-05"]
    soccer = plan["days"][0]["events"][0]
    assert soccer["place"] == "?soccer"
    # With no address it could be anywhere, so it needs no ride.
    assert (soccer["where"], soccer["drop"], soccer["pick"]) == ("anywhere", "none", "none")
    assert plan["days"][0]["issues"] == []

    with pytest.raises(ServiceValidationError) as err:
        await get_plan(hass, date="2026-11-09", days=2)
    assert err.value.translation_key == "date_not_planned"
    assert err.value.translation_placeholders == {"first": "2026-11-03", "last": "2026-11-09"}


async def test_one_family_calendar(hass: HomeAssistant, google: FakeGoogle) -> None:
    google.add(
        FAMILY,
        **timed(
            "dentist",
            "Ava & Ben Dentist",
            "2026-11-03T10:00:00-06:00",
            "2026-11-03T11:00:00-06:00",
            location="Smile Dental",
        ),
    )
    google.add(FAMILY, **all_day("trash", "Trash & Recycling Day", "2026-11-03", "2026-11-04"))
    google.add(FAMILY, **timed("bid", "Garage floor bid", "2026-11-03T16:00:00-06:00", "2026-11-03T17:00:00-06:00"))
    await load(hass)

    (today,) = (await get_plan(hass))["days"]
    # One event, in both kids' lanes.
    dentist = [(e["id"], e["kid"], e["title"]) for e in today["events"] if e["title"] == "Dentist"]
    assert dentist == [("dentist", AVA, "Dentist"), ("dentist~2", BEN, "Dentist")]
    assert [(i["id"], i["title"], i["people"]) for i in today["all_day"]] == [("trash", "Trash & Recycling Day", [])]
    assert [(u["id"], u["reason"]) for u in today["unplaced"]] == [("bid", "nobody")]


async def test_a_parent_named_with_the_kids_takes_them(hass: HomeAssistant, google: FakeGoogle) -> None:
    shop = {"location": "Donut Shop, 1 Main St"}
    google.add(
        FAMILY,
        **timed("donuts", "Sam, Ava & Ben Donuts", "2026-11-03T18:00:00-06:00", "2026-11-03T19:00:00-06:00", **shop),
    )
    google.add(FAMILY, **timed("call", "Sam & Ben Call", "2026-11-03T12:00:00-06:00", "2026-11-03T13:00:00-06:00"))
    await load(hass)

    (today,) = (await get_plan(hass))["days"]
    lines = {
        e["id"]: (e["drop"], e["pick"], e["lines"]["drop"]["text"], e["lines"]["pick"]["text"])
        for e in today["events"]
        if e["title"] == "Donuts"
    }
    # Sam takes them both, in one car, and stays.
    assert lines == {
        "donuts": ("dad", "dad", "Sam stays · leaves 5:38", "Home 7:15 with Sam"),
        "donuts~2": ("dad", "dad", "Sam stays · leaves 5:38", "Home 7:15 with Sam"),
    }
    dad = today["drivers"]["dad"]
    assert [o["title"] for o in dad["outings"]] == ["Drive Ava and Ben to Donut Shop and stay"]
    assert today["issues"] == []
    # Taking them isn't busy time on top. A call can happen anywhere, so it needs no ride.
    assert [b["title"] for b in dad["busy"]] == ["Call"]
    (call,) = [e for e in today["events"] if e["title"] == "Call"]
    assert (call["drop"], call["pick"]) == ("none", "none")


async def test_the_notes_win_over_the_parent_named(hass: HomeAssistant, google: FakeGoogle) -> None:
    google.add(
        FAMILY,
        **timed(
            "donuts",
            "Sam, Ava & Ben Donuts",
            "2026-11-03T18:00:00-06:00",
            "2026-11-03T19:00:00-06:00",
            location="Donut Shop, 1 Main St",
            description="--- Rides ---\nPick-up: Robin",
        ),
    )
    await load(hass)

    (today,) = (await get_plan(hass))["days"]
    sides = {(e["id"], e["drop"], e["pick"], e["stay"]) for e in today["events"] if e["title"] == "Donuts"}
    # Sam still drops them off, Robin picks them up, and Sam doesn't stay.
    assert sides == {("donuts", "dad", "mom", False), ("donuts~2", "dad", "mom", False)}
    (home,) = [
        g
        for g in today["drivers"]["mom"]["segments"]
        if g["type"] == "drive" and g["to"] == "home" and g["start"] >= 1140
    ]
    assert sorted(home["kids"]) == [AVA, BEN]
    assert today["issues"] == []


async def test_kids_at_one_event_ride_in_one_car(hass: HomeAssistant, google: FakeGoogle) -> None:
    google.add(
        FAMILY,
        **timed(
            "school",
            "Ava & Ben Lighthouse",
            "2026-11-03T08:00:00-06:00",
            "2026-11-03T09:00:00-06:00",
            location="Elm School, 5 Elm St",
            description="--- Rides ---\nDrop-off: Robin",
        ),
    )
    await load(hass)

    (today,) = (await get_plan(hass))["days"]
    (trip,) = [o for o in today["drivers"]["mom"]["outings"] if o["target"] == "school"]
    # One stop for both of them.
    assert trip["lines"] == ["7:53  Elm School, drop off Ava and Ben", "8:08  Home"]
    # Each of them is in the car for their own event, not along for the other's.
    rides = [(r["kid"], r["own"]) for r in today["rides"] if r["serves"] == ["school"]]
    assert rides == [(AVA, True), (BEN, True)]


async def test_until_the_family_calendar_is_picked(hass: HomeAssistant, google: FakeGoogle) -> None:
    await load(hass, make_entry({**OPTIONS, "events_calendar": None}))
    plan = await get_plan(hass)
    assert plan["needs_setup"] == "events_calendar"
    assert all(d["events"] == [] for d in plan["days"])


async def test_get_plan_when_not_loaded(hass: HomeAssistant, google: FakeGoogle) -> None:
    entry = await load(hass)
    await hass.config_entries.async_unload(entry.entry_id)
    with pytest.raises(ServiceValidationError) as err:
        await get_plan(hass)
    assert err.value.translation_key == "not_loaded"


async def test_refreshes_the_token(
    hass: HomeAssistant, google: FakeGoogle, aioclient_mock: AiohttpClientMocker
) -> None:
    aioclient_mock.post(OAUTH_TOKEN, json={"access_token": "new-token", "expires_in": 3599, "token_type": "Bearer"})
    entry = await load(hass, make_entry(expires_at=0))

    assert entry.state is ConfigEntryState.LOADED
    assert entry.data["token"]["access_token"] == "new-token"
    # Google doesn't send the refresh token again, so the saved one is kept.
    assert entry.data["token"]["refresh_token"] == "mock-refresh-token"
    _method, _url, _data, headers = aioclient_mock.mock_calls[-1]
    assert headers["Authorization"] == "Bearer new-token"


@pytest.mark.parametrize(
    ("status", "state"), [(400, ConfigEntryState.SETUP_ERROR), (500, ConfigEntryState.SETUP_RETRY)]
)
async def test_token_refresh_fails(
    hass: HomeAssistant,
    google: FakeGoogle,
    aioclient_mock: AiohttpClientMocker,
    status: int,
    state: ConfigEntryState,
) -> None:
    aioclient_mock.post(OAUTH_TOKEN, status=status, json={"error": "invalid_grant"})
    entry = await load(hass, make_entry(expires_at=0))

    assert entry.state is state
    reauth = [f for f in hass.config_entries.flow.async_progress() if f["context"]["source"] == SOURCE_REAUTH]
    assert bool(reauth) is (status == 400)


async def test_google_turns_down_the_token_later(hass: HomeAssistant, google: FakeGoogle) -> None:
    entry = await load(hass)
    google.errors[FAMILY] = google_error(401, "authError")

    await entry.runtime_data.coordinator.async_refresh()
    await hass.async_block_till_done()

    flows = hass.config_entries.flow.async_progress()
    assert [f["context"]["source"] for f in flows] == [SOURCE_REAUTH]


@pytest.mark.parametrize(
    ("reply", "key"),
    [(google_error(403, "accessNotConfigured"), "api_disabled"), (google_error(500, "backendError"), "google_error")],
)
async def test_setup_retries_when_google_fails(
    hass: HomeAssistant, google: FakeGoogle, reply: tuple[int, dict[str, Any]], key: str
) -> None:
    google.errors[FAMILY] = reply
    entry = await load(hass)
    assert entry.state is ConfigEntryState.SETUP_RETRY
    assert entry.reason is not None


async def test_unreadable_calendar_is_skipped(
    hass: HomeAssistant, google: FakeGoogle, caplog: pytest.LogCaptureFixture
) -> None:
    google.errors[FAMILY] = google_error(404, "notFound")
    with caplog.at_level(logging.WARNING):
        entry = await load(hass)

    assert entry.state is ConfigEntryState.LOADED
    assert entry.runtime_data.coordinator.data.unavailable == [FAMILY]
    assert f"Can't read the calendar {FAMILY}" in caplog.text
    assert (await get_plan(hass))["unavailable_calendars"] == [FAMILY]

    caplog.clear()
    await entry.runtime_data.coordinator.async_refresh()
    assert "Can't read the calendar" not in caplog.text  # said once, not every minute

    del google.errors[FAMILY]
    with caplog.at_level(logging.INFO):
        await entry.runtime_data.coordinator.async_refresh()
    assert f"The calendar {FAMILY} can be read again" in caplog.text
    assert entry.runtime_data.coordinator.data.unavailable == []


async def test_missing_oauth_client(hass: HomeAssistant, google: FakeGoogle) -> None:
    entry = await load(hass, make_entry(auth_implementation="gone"))
    assert entry.state is ConfigEntryState.SETUP_RETRY


async def test_entry_from_before_sign_in(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(domain=DOMAIN, options={"mom_name": "Robin", "dad_name": "Sam"})
    entry = await load(hass, entry)
    assert entry.state is ConfigEntryState.SETUP_ERROR
    assert entry.reason is not None


async def test_diagnostics(hass: HomeAssistant, hass_client: ClientSessionGenerator, google: FakeGoogle) -> None:
    google.errors[LUNCH] = google_error(404, "notFound")
    entry = await load(hass)
    assert await async_setup_component(hass, "diagnostics", {})

    diag = await get_diagnostics_for_config_entry(hass, hass_client, entry)

    text = str(diag)
    for secret in ("mock-access-token", "mock-refresh-token", "Robin", "Sam", "Ava", AVA, FAMILY, LUNCH, ACCOUNT):
        assert secret not in text
    assert diag["entry"]["data"]["token"] == "**REDACTED**"
    assert diag["calendars"] == {"family": True, "lunch": True, "kids": 2}
    assert diag["plan"]["events_read"] == {"kid 1": 1, "kid 2": 1, "mom": 1, "dad": 0}
    assert diag["plan"]["unavailable"] == []
    assert diag["plan"]["days"][0] == {
        "date": "2026-11-03",
        "events": 2,
        "problems": 0,
        "heads_ups": diag["plan"]["days"][0]["heads_ups"],
        "notes_problems": 0,
        "all_day": 0,
        "unplaced": 0,
    }
