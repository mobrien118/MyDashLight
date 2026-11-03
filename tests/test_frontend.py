"""The kitchen app: the Rides sidebar item, the kitchen page and the app's files."""

from __future__ import annotations

from homeassistant.components.frontend import DATA_PANELS
from homeassistant.core import HomeAssistant
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker
from pytest_homeassistant_custom_component.typing import ClientSessionGenerator

from custom_components.mydashlight.frontend import FILES, FILES_URL, KITCHEN_URL, PANEL_URL

from .common import FakeGoogle, make_entry, setup_credentials


@pytest.fixture(autouse=True)
async def setup(hass: HomeAssistant) -> None:
    await hass.config.async_set_time_zone("America/Chicago")
    await setup_credentials(hass)


async def load(hass: HomeAssistant) -> MockConfigEntry:
    entry = make_entry()
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_built_app_is_in_the_integration() -> None:
    # The app is built into the integration so HACS ships it. CI checks it matches the source.
    for name in ("panel.js", "kiosk.js", "index.html"):
        assert (FILES / name).is_file(), name
    assert "%SCRIPT%" in (FILES / "index.html").read_text("utf-8")


async def test_panel_in_the_sidebar(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    FakeGoogle(aioclient_mock)
    entry = await load(hass)

    panel = hass.data[DATA_PANELS][PANEL_URL]
    assert panel.sidebar_title == "Rides"
    assert panel.sidebar_icon == "mdi:car-multiple"
    assert panel.require_admin is False
    custom = panel.config["_panel_custom"]
    assert custom["name"] == "mydashlight-panel"
    assert custom["module_url"].startswith(f"{FILES_URL}/panel.js?v=")
    assert custom["embed_iframe"] is False

    assert await hass.config_entries.async_unload(entry.entry_id)
    assert PANEL_URL not in hass.data[DATA_PANELS]

    # Set up again after an unload, as on a reload: the panel comes back.
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert PANEL_URL in hass.data[DATA_PANELS]


async def test_kitchen_page_and_files(
    hass: HomeAssistant, hass_client_no_auth: ClientSessionGenerator, aioclient_mock: AiohttpClientMocker
) -> None:
    FakeGoogle(aioclient_mock)
    await load(hass)
    client = await hass_client_no_auth()

    # The page itself holds no data, so it loads before signing in; the app then signs in.
    res = await client.get(KITCHEN_URL)
    assert res.status == 200
    assert res.headers["Cache-Control"] == "no-cache"
    page = await res.text()
    assert "<mydashlight-board kiosk>" in page
    assert f'src="{FILES_URL}/kiosk.js?v=' in page
    assert "%SCRIPT%" not in page

    res = await client.get(f"{FILES_URL}/kiosk.js")
    assert res.status == 200
    assert "mydashlight-board" in await res.text()
    res = await client.get(f"{FILES_URL}/panel.js")
    assert res.status == 200
    assert "mydashlight-panel" in await res.text()
