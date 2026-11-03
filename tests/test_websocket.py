"""The app's live plan over Home Assistant's WebSocket API."""

from __future__ import annotations

from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from .common import AVA, BEN, FakeGoogle, google_error, make_entry, setup_credentials, timed

NOW = "2026-11-03T15:00:00+00:00"  # 9 AM in Central time


@pytest.fixture(autouse=True)
async def setup(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    await hass.config.async_set_time_zone("America/Chicago")
    freezer.move_to(NOW)
    await setup_credentials(hass)


@pytest.fixture
def google(aioclient_mock: AiohttpClientMocker) -> FakeGoogle:
    g = FakeGoogle(aioclient_mock)
    g.add(AVA, **timed("piano", "Piano", "2026-11-03T16:00:00-06:00", "2026-11-03T17:00:00-06:00"))
    return g


async def load(hass: HomeAssistant) -> MockConfigEntry:
    entry = make_entry()
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def subscribe(hass: HomeAssistant, hass_ws_client: WebSocketGenerator) -> Any:
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "mydashlight/rides/subscribe"})
    result = await client.receive_json()
    assert result["success"], result
    return client


async def next_plan(client: Any) -> dict[str, Any] | None:
    msg = await client.receive_json()
    assert msg["type"] == "event", msg
    plan: dict[str, Any] | None = msg["event"]["plan"]
    return plan


async def reread(entry: MockConfigEntry) -> None:
    """Read the calendars again, as the minute poll does."""
    await entry.runtime_data.coordinator.async_refresh()


async def test_sends_the_plan_then_each_change(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator, google: FakeGoogle
) -> None:
    entry = await load(hass)
    client = await subscribe(hass, hass_ws_client)

    plan = await next_plan(client)
    assert plan is not None
    assert len(plan["days"]) == 7
    assert [e["id"] for e in plan["days"][0]["events"]] == ["piano"]
    assert plan == entry.runtime_data.coordinator.payload()
    assert plan["people"] == {
        "drivers": [{"id": "mom", "name": "Robin"}, {"id": "dad", "name": "Sam"}],
        "kids": [{"id": AVA, "name": "Ava"}, {"id": BEN, "name": "Ben"}],
        "carpools": ["the Parkers"],
    }
    assert plan["status"] == {"ok": True, "error": None}

    # Nothing changed on the next read, so nothing is sent.
    await reread(entry)
    google.event(AVA, "piano")["description"] = "Drop-off: Robin"
    google.event(AVA, "piano")["etag"] = '"9"'
    await reread(entry)

    plan = await next_plan(client)
    assert plan is not None
    assert plan["days"][0]["events"][0]["drop"] == "mom"


async def test_says_when_google_cannot_be_read(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator, google: FakeGoogle
) -> None:
    entry = await load(hass)
    client = await subscribe(hass, hass_ws_client)
    await next_plan(client)

    google.errors[AVA] = google_error(500, "backendError", "Backend Error")
    await reread(entry)
    plan = await next_plan(client)
    assert plan is not None
    assert plan["status"]["ok"] is False
    assert "Backend Error" in plan["status"]["error"]
    # The last good plan is still there.
    assert [e["id"] for e in plan["days"][0]["events"]] == ["piano"]

    del google.errors[AVA]
    await reread(entry)
    plan = await next_plan(client)
    assert plan is not None
    assert plan["status"] == {"ok": True, "error": None}


async def test_while_not_running(hass: HomeAssistant, hass_ws_client: WebSocketGenerator, google: FakeGoogle) -> None:
    entry = await load(hass)
    client = await subscribe(hass, hass_ws_client)
    assert await next_plan(client) is not None

    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    assert await next_plan(client) is None

    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    plan = await next_plan(client)
    assert plan is not None
    assert plan["days"][0]["events"][0]["id"] == "piano"


async def test_subscribe_before_it_runs(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator, google: FakeGoogle
) -> None:
    entry = await load(hass)
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()

    client = await subscribe(hass, hass_ws_client)
    assert await next_plan(client) is None


async def test_unsubscribe(hass: HomeAssistant, hass_ws_client: WebSocketGenerator, google: FakeGoogle) -> None:
    await load(hass)
    client = await subscribe(hass, hass_ws_client)
    await next_plan(client)
    await client.send_json_auto_id({"type": "unsubscribe_events", "subscription": 1})
    msg = await client.receive_json()
    assert msg["success"], msg
