"""Drive times from Google Routes inside the running integration: lookups, the limit, failures."""

from __future__ import annotations

import logging
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from custom_components.mydashlight.const import DOMAIN

from .common import AVA, OPTIONS, ROUTES_KEY, FakeGoogle, FakeRoutes, make_entry, setup_credentials, timed

NOW = "2026-11-03T15:00:00+00:00"  # 9 AM in Central time
PIANO = "Piano studio, 1 Elm St"


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
            description="Drop-off: Robin\nPick-up: Robin",
        ),
    )
    return g


@pytest.fixture
def routes(aioclient_mock: AiohttpClientMocker) -> FakeRoutes:
    r = FakeRoutes(aioclient_mock)
    r.minutes = {PIANO: 12, "home": 14}
    return r


async def load(
    hass: HomeAssistant, options: dict[str, Any] | None = None, key: str | None = ROUTES_KEY
) -> MockConfigEntry:
    options = dict(OPTIONS if options is None else options)
    if key:
        options["routes_api_key"] = key
    entry = make_entry(options)
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


def segments(entry: MockConfigEntry, driver: str = "mom") -> list[dict[str, Any]]:
    days: list[dict[str, Any]] = entry.runtime_data.coordinator.data.days
    return [g for g in days[0]["drivers"][driver]["segments"] if g["type"] == "drive"]


async def test_looks_up_the_trips_the_plan_uses(
    hass: HomeAssistant,
    google: FakeGoogle,
    routes: FakeRoutes,
    hass_storage: dict[str, Any],
    freezer: FrozenDateTimeFactory,
) -> None:
    entry = await load(hass)

    drives = segments(entry)
    assert [(g["from"], g["to"], g["end"] - g["start"]) for g in drives] == [
        ("home", "piano studio, 1 elm st", 12),
        ("piano studio, 1 elm st", "home", 14),
        ("home", "piano studio, 1 elm st", 12),
        ("piano studio, 1 elm st", "home", 14),
    ]
    # Two trips, looked up once each: there for 3 PM (Tuesday) and back at 5 PM.
    assert len(routes.bodies) == 2
    assert {b["departureTime"] for b in routes.bodies} == {"2026-11-03T21:00:00Z", "2026-11-03T23:00:00Z"}
    data = entry.runtime_data.coordinator.data
    assert data.drive_times == {
        "source": "ok",
        "looked_up": 2,
        "estimated": 0,
        "lookups_today": 2,
        "daily_limit": 150,
    }

    # Saved, and not looked up again on the next update.
    await entry.runtime_data.coordinator.async_refresh()
    assert len(routes.bodies) == 2
    freezer.tick(11)
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    stored = hass_storage[f"{DOMAIN}.drive_times"]["data"]
    assert stored["calls"] == 2
    assert len(stored["entries"]) == 2


async def test_saved_times_are_used_after_a_restart(
    hass: HomeAssistant, google: FakeGoogle, routes: FakeRoutes, hass_storage: dict[str, Any]
) -> None:
    hass_storage[f"{DOMAIN}.drive_times"] = {
        "version": 1,
        "key": f"{DOMAIN}.drive_times",
        "data": {
            "day": "2026-11-03",
            "calls": 5,
            "entries": {
                "home|piano studio, 1 elm st|1|15": [30, 1_793_700_000],
                "piano studio, 1 elm st|home|1|17": [31, 1_793_700_000],
            },
        },
    }
    entry = await load(hass)
    assert [g["end"] - g["start"] for g in segments(entry)][:2] == [30, 31]
    assert routes.bodies == []
    assert entry.runtime_data.coordinator.data.drive_times["lookups_today"] == 5


async def test_daily_limit(hass: HomeAssistant, google: FakeGoogle, routes: FakeRoutes) -> None:
    entry = await load(hass, {**OPTIONS, "routes_daily_limit": 1})

    assert len(routes.bodies) == 1
    drive_times = entry.runtime_data.coordinator.data.drive_times
    assert drive_times["source"] == "daily_limit"
    assert drive_times["estimated"] == 1
    # One trip was looked up; the other is estimated until tomorrow.
    assert sorted(g["end"] - g["start"] for g in segments(entry)) == [14, 14, 15, 15]


async def test_without_a_key(hass: HomeAssistant, google: FakeGoogle, routes: FakeRoutes) -> None:
    entry = await load(hass, key=None)
    assert routes.bodies == []
    assert {g["end"] - g["start"] for g in segments(entry)} == {15}
    assert entry.runtime_data.coordinator.data.drive_times["source"] == "off"


async def test_without_a_home_location(hass: HomeAssistant, google: FakeGoogle, routes: FakeRoutes) -> None:
    hass.config.latitude = 0
    hass.config.longitude = 0
    entry = await load(hass)
    assert routes.bodies == []
    assert entry.runtime_data.coordinator.data.drive_times["source"] == "no_home"


async def test_key_turned_down(
    hass: HomeAssistant, google: FakeGoogle, routes: FakeRoutes, caplog: pytest.LogCaptureFixture
) -> None:
    routes.status = 403
    routes.error = {"error": {"code": 403, "message": "API key not valid"}}
    with caplog.at_level(logging.WARNING):
        entry = await load(hass)

    assert entry.state is ConfigEntryState.LOADED
    assert "Google turned down the Routes key" in caplog.text
    assert entry.runtime_data.coordinator.data.drive_times["source"] == "key_rejected"
    asked = len(routes.bodies)
    assert asked <= 2
    await entry.runtime_data.coordinator.async_refresh()
    assert len(routes.bodies) == asked  # not asked again until the key changes


async def test_google_quota_used_up(hass: HomeAssistant, google: FakeGoogle, routes: FakeRoutes) -> None:
    routes.status = 429
    routes.error = {"error": {"code": 429, "message": "Quota exceeded"}}
    entry = await load(hass)
    assert entry.runtime_data.coordinator.data.drive_times["source"] == "daily_limit"
    asked = len(routes.bodies)
    await entry.runtime_data.coordinator.async_refresh()
    assert len(routes.bodies) == asked


async def test_no_route_and_server_errors(hass: HomeAssistant, google: FakeGoogle, routes: FakeRoutes) -> None:
    routes.status = 400
    routes.error = {"error": {"code": 400, "message": "Address not found"}}
    entry = await load(hass)
    # Google couldn't route these, so they're estimated and not asked again today.
    assert {g["end"] - g["start"] for g in segments(entry)} == {15}
    assert len(routes.bodies) == 2
    await entry.runtime_data.coordinator.async_refresh()
    assert len(routes.bodies) == 2


async def test_server_error_is_tried_again(hass: HomeAssistant, google: FakeGoogle, routes: FakeRoutes) -> None:
    routes.status = 503
    entry = await load(hass)
    assert len(routes.bodies) == 2
    routes.status = None
    await entry.runtime_data.coordinator.async_refresh()
    assert len(routes.bodies) == 4
    assert [g["end"] - g["start"] for g in segments(entry)][:2] == [12, 14]


async def test_removing_the_entry_deletes_saved_times(
    hass: HomeAssistant, google: FakeGoogle, routes: FakeRoutes, hass_storage: dict[str, Any]
) -> None:
    entry = await load(hass)
    await hass.async_block_till_done()
    lookups = entry.runtime_data.coordinator.lookups
    await lookups._store.async_save(lookups.cache.as_dict())
    assert f"{DOMAIN}.drive_times" in hass_storage
    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()
    assert f"{DOMAIN}.drive_times" not in hass_storage
