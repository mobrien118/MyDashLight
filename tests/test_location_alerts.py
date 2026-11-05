"""Location checks in Home Assistant: the driver's phone says where they are, and only the driver hears about it."""

from __future__ import annotations

import time
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant, ServiceCall
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed, async_mock_service
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from .common import AVA, BEN, OPTIONS, ROUTES_KEY, FakeGoogle, FakeRoutes, make_entry, setup_credentials, timed

NOW = "2026-11-03T15:00:00+00:00"  # 9 AM in Central time, a Tuesday
PIANO = "Piano studio, 1 Elm St"
HOME = (40.0, -86.9)
PIANO_SPOT = (40.02, -86.88)
WORK = (39.95, -86.95)
"""Farther from piano than home is."""
ON_THE_WAY = (40.012, -86.89)
OPTIONS_HERE = {
    **OPTIONS,
    "mom_notify": "robin_phone",
    "dad_notify": "sam_phone",
    "kid_notify": {AVA: "mobile_app_avas_phone", BEN: "off"},
    "mom_person": "person.robin",
    "no_driver_alerts": False,
    "routes_api_key": ROUTES_KEY,
}


@pytest.fixture(autouse=True)
async def setup(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    await hass.config.async_set_time_zone("America/Chicago")
    hass.config.latitude, hass.config.longitude = HOME
    freezer.move_to(NOW)
    await setup_credentials(hass)


@pytest.fixture
def google(aioclient_mock: AiohttpClientMocker) -> FakeGoogle:
    g = FakeGoogle(aioclient_mock)
    # Robin takes Ava to piano at 4: a 15-minute drive, so Robin leaves at 3:38 and is
    # reminded at 3:23. The check that Robin has left is at 3:43, five minutes later.
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
    r.minutes = {PIANO: 15, "home": 15}
    r.spots = {PIANO: PIANO_SPOT}
    r.from_points = {WORK: 30}
    return r


@pytest.fixture
def phones(hass: HomeAssistant) -> dict[str, list[ServiceCall]]:
    return {
        "robin": async_mock_service(hass, "notify", "robin_phone"),
        "sam": async_mock_service(hass, "notify", "sam_phone"),
        "ava": async_mock_service(hass, "notify", "mobile_app_avas_phone"),
    }


def robin_is(hass: HomeAssistant, zone: str, spot: tuple[float, float] | None, accuracy: int = 15) -> None:
    attrs: dict[str, Any] = {"gps_accuracy": accuracy}
    if spot is not None:
        attrs |= {"latitude": spot[0], "longitude": spot[1]}
    hass.states.async_set("person.robin", zone, attrs)


async def load(hass: HomeAssistant, options: dict[str, Any] | None = None) -> MockConfigEntry:
    entry = make_entry(OPTIONS_HERE if options is None else options, expires_at=time.time() + 86400)
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def at(hass: HomeAssistant, freezer: FrozenDateTimeFactory, when: str) -> None:
    freezer.move_to(when)
    async_fire_time_changed(hass)
    await hass.async_block_till_done()


async def test_still_home_after_leave_time(
    hass: HomeAssistant,
    google: FakeGoogle,
    routes: FakeRoutes,
    phones: dict[str, list[ServiceCall]],
    freezer: FrozenDateTimeFactory,
) -> None:
    robin_is(hass, "home", HOME)
    await load(hass)
    assert routes.live == []

    # 3:25: home, as planned, so the reminder is the usual one.
    await at(hass, freezer, "2026-11-03T21:25:00+00:00")
    assert [c.data["title"] for c in phones["robin"]] == ["Leave at 3:38 PM: Drive Ava to Piano studio"]

    # 3:44: still home, six minutes after leave time.
    await at(hass, freezer, "2026-11-03T21:44:00+00:00")
    assert phones["robin"][1].data == {
        "title": "Time to go: Drive Ava to Piano studio",
        "message": "You were due to leave home at 3:38 PM to be at Piano studio by 4:00 PM.",
    }
    # Only Robin hears about it. Nothing about where Robin is cost a drive-time lookup.
    assert phones["sam"] == []
    assert len(phones["ava"]) == 1
    assert routes.live == []

    # Once is enough, even after a restart.
    await at(hass, freezer, "2026-11-03T21:46:00+00:00")
    entry = hass.config_entries.async_entries("mydashlight")[0]
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert len(phones["robin"]) == 2


async def test_on_the_way(
    hass: HomeAssistant,
    google: FakeGoogle,
    routes: FakeRoutes,
    phones: dict[str, list[ServiceCall]],
    freezer: FrozenDateTimeFactory,
) -> None:
    robin_is(hass, "home", HOME)
    await load(hass)
    await at(hass, freezer, "2026-11-03T21:25:00+00:00")
    robin_is(hass, "not_home", ON_THE_WAY)
    await at(hass, freezer, "2026-11-03T21:44:00+00:00")
    assert len(phones["robin"]) == 1
    assert routes.live == []


async def test_starting_from_somewhere_else(
    hass: HomeAssistant,
    google: FakeGoogle,
    routes: FakeRoutes,
    phones: dict[str, list[ServiceCall]],
    freezer: FrozenDateTimeFactory,
) -> None:
    robin_is(hass, "Work", WORK)
    await load(hass)

    # 3:25: Robin is at work, 30 minutes from piano, so the reminder says to leave by 3:30.
    await at(hass, freezer, "2026-11-03T21:25:00+00:00")
    assert phones["robin"][0].data == {
        "title": "Leave by 3:30 PM: Drive Ava to Piano studio",
        "message": "You're not at home. From where you are, it's 30 min to Piano studio.\n"
        "Leave 3:38\n3:53  Piano studio, drop off Ava\n4:08  Home",
    }
    assert [b["origin"] for b in routes.live] == [{"location": {"latLng": {"latitude": 39.95, "longitude": -86.95}}}]
    assert routes.live[0]["destination"] == {"address": PIANO}
    # Ava's reminder doesn't change.
    assert phones["ava"][0].data["title"] == "Leave home at 3:38 PM with Robin"

    # 3:44: still at work, so Robin will be about 14 minutes late.
    await at(hass, freezer, "2026-11-03T21:44:00+00:00")
    assert phones["robin"][1].data == {
        "title": "Running late: Drive Ava to Piano studio",
        "message": "From where you are, it's 30 min to Piano studio, so you'll get there about 4:14 PM, 14 min late.",
    }
    assert len(routes.live) == 2
    assert phones["sam"] == []


async def test_without_a_person_nothing_is_checked(
    hass: HomeAssistant,
    google: FakeGoogle,
    routes: FakeRoutes,
    phones: dict[str, list[ServiceCall]],
    freezer: FrozenDateTimeFactory,
) -> None:
    robin_is(hass, "Work", WORK)
    await load(hass, {**OPTIONS_HERE, "mom_person": None})
    await at(hass, freezer, "2026-11-03T21:25:00+00:00")
    await at(hass, freezer, "2026-11-03T21:44:00+00:00")
    assert [c.data["title"] for c in phones["robin"]] == ["Leave at 3:38 PM: Drive Ava to Piano studio"]
    assert routes.live == []


async def test_without_a_location_nothing_is_said(
    hass: HomeAssistant,
    google: FakeGoogle,
    routes: FakeRoutes,
    phones: dict[str, list[ServiceCall]],
    freezer: FrozenDateTimeFactory,
) -> None:
    hass.states.async_set("person.robin", "unknown")
    await load(hass)
    await at(hass, freezer, "2026-11-03T21:25:00+00:00")
    await at(hass, freezer, "2026-11-03T21:44:00+00:00")
    assert [c.data["title"] for c in phones["robin"]] == ["Leave at 3:38 PM: Drive Ava to Piano studio"]
    assert routes.live == []


async def test_without_drive_times_home_still_counts(
    hass: HomeAssistant,
    google: FakeGoogle,
    routes: FakeRoutes,
    phones: dict[str, list[ServiceCall]],
    freezer: FrozenDateTimeFactory,
) -> None:
    # No Routes key: piano's place on the map is unknown, but home is Home Assistant's own.
    robin_is(hass, "home", HOME)
    options = {k: v for k, v in OPTIONS_HERE.items() if k != "routes_api_key"}
    await load(hass, options)
    await at(hass, freezer, "2026-11-03T21:44:00+00:00")
    assert phones["robin"][-1].data["title"] == "Time to go: Drive Ava to Piano studio"
    assert routes.bodies == []
