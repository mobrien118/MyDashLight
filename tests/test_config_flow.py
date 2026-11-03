"""Setting up MyDashLight: Google sign-in, names, calendars, and the options."""

from __future__ import annotations

from typing import Any
from urllib.parse import parse_qs, urlparse

from homeassistant.config_entries import SOURCE_USER
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers import config_entry_oauth2_flow
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker
from pytest_homeassistant_custom_component.typing import ClientSessionGenerator

from custom_components.mydashlight.config_flow import suggested_kid_name
from custom_components.mydashlight.const import DEFAULT_PLANNER, DOMAIN, OAUTH_AUTHORIZE, OAUTH_TOKEN, SCOPES

from .common import (
    ACCOUNT,
    AVA,
    BEN,
    CLIENT_ID,
    JOINT,
    OPTIONS,
    ROBIN,
    SAM,
    FakeGoogle,
    google_error,
    make_entry,
    setup_credentials,
)

REDIRECT = "https://example.com/auth/external/callback"


@pytest.fixture(autouse=True)
async def credentials(hass: HomeAssistant) -> None:
    await setup_credentials(hass)


@pytest.fixture
def google(aioclient_mock: AiohttpClientMocker) -> FakeGoogle:
    return FakeGoogle(aioclient_mock)


async def sign_in(
    hass: HomeAssistant,
    client_factory: ClientSessionGenerator,
    aioclient_mock: AiohttpClientMocker,
    result: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Go through Google's sign-in and return the step after it."""
    if result is None:
        result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    assert result["type"] is FlowResultType.EXTERNAL_STEP
    state = config_entry_oauth2_flow._encode_jwt(hass, {"flow_id": result["flow_id"], "redirect_uri": REDIRECT})
    query = parse_qs(urlparse(result["url"]).query)
    assert result["url"].startswith(OAUTH_AUTHORIZE + "?")
    assert query == {
        "response_type": ["code"],
        "client_id": [CLIENT_ID],
        "redirect_uri": [REDIRECT],
        "state": [state],
        "scope": [" ".join(SCOPES)],
        "access_type": ["offline"],
        "prompt": ["consent"],
    }
    client = await client_factory()
    resp = await client.get(f"/auth/external/callback?code=abcd&state={state}")
    assert resp.status == 200
    aioclient_mock.post(
        OAUTH_TOKEN,
        json={
            "refresh_token": "mock-refresh-token",
            "access_token": "mock-access-token",
            "token_type": "Bearer",
            "expires_in": 3599,
        },
    )
    return await hass.config_entries.flow.async_configure(result["flow_id"])


@pytest.mark.usefixtures("current_request_with_host")
async def test_full_flow(
    hass: HomeAssistant,
    hass_client_no_auth: ClientSessionGenerator,
    aioclient_mock: AiohttpClientMocker,
    google: FakeGoogle,
) -> None:
    result = await sign_in(hass, hass_client_no_auth, aioclient_mock)
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "parents"

    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"mom_name": " ", "dad_name": "Sam"})
    assert result["errors"] == {"mom_name": "name_required"}
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"mom_name": "Sam", "dad_name": "sam"})
    assert result["errors"] == {"dad_name": "names_match"}
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"mom_name": " Robin ", "dad_name": "Sam"}
    )
    assert result["step_id"] == "calendars"
    assert result["description_placeholders"] == {"mom": "Robin", "dad": "Sam", "account": ACCOUNT}
    options = result["data_schema"].schema["kids"].config["options"]
    assert [o["label"] for o in options] == ["Kid-Ava", "Kid-Ben", "Robin", "Robin & Sam", ACCOUNT, "Sam"]

    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"kids": []})
    assert result["errors"] == {"kids": "kids_required"}
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"kids": [AVA], "mom_calendars": [AVA]})
    assert result["errors"] == {"mom_calendars": "kid_calendar_as_busy"}
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"kids": [AVA], "mom_calendars": [JOINT], "dad_calendars": [JOINT]}
    )
    assert result["errors"] == {"dad_calendars": "shared_busy_calendar"}
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"kids": [AVA, BEN], "mom_calendars": [ROBIN], "dad_calendars": [SAM]}
    )

    assert result["step_id"] == "kid_name"
    assert result["description_placeholders"] == {"calendar": "Kid-Ava", "number": "1", "count": "2"}
    assert result["data_schema"]({})["name"] == "Ava"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"name": "Ava"})
    assert result["description_placeholders"]["calendar"] == "Kid-Ben"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"name": "ava"})
    assert result["errors"] == {"name": "kid_names_match"}
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"name": "Ben"})
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    entry = result["result"]
    assert entry.title == "MyDashLight"
    assert entry.unique_id == ACCOUNT
    assert entry.data["auth_implementation"] == DOMAIN
    assert entry.data["token"]["refresh_token"] == "mock-refresh-token"
    assert entry.options == {**OPTIONS, "carpools": []}
    assert entry.runtime_data.coordinator.last_update_success


@pytest.mark.parametrize(
    ("reply", "reason"),
    [
        (google_error(403, "accessNotConfigured"), "api_disabled"),
        (google_error(401, "authError"), "oauth_unauthorized"),
        (google_error(500, "backendError"), "cannot_connect"),
    ],
)
@pytest.mark.usefixtures("current_request_with_host")
async def test_calendar_list_fails(
    hass: HomeAssistant,
    hass_client_no_auth: ClientSessionGenerator,
    aioclient_mock: AiohttpClientMocker,
    google: FakeGoogle,
    reply: tuple[int, dict[str, Any]],
    reason: str,
) -> None:
    google.errors["calendarList"] = reply
    result = await sign_in(hass, hass_client_no_auth, aioclient_mock)
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == reason


@pytest.mark.usefixtures("current_request_with_host")
async def test_account_without_primary_calendar(
    hass: HomeAssistant,
    hass_client_no_auth: ClientSessionGenerator,
    aioclient_mock: AiohttpClientMocker,
    google: FakeGoogle,
) -> None:
    google.calendars = [c for c in google.calendars if not c.get("primary")]
    result = await sign_in(hass, hass_client_no_auth, aioclient_mock)
    assert result["reason"] == "no_primary_calendar"


async def test_only_one_entry(hass: HomeAssistant) -> None:
    MockConfigEntry(domain=DOMAIN, unique_id=ACCOUNT).add_to_hass(hass)
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "single_instance_allowed"


@pytest.mark.usefixtures("current_request_with_host")
async def test_reauth(
    hass: HomeAssistant,
    hass_client_no_auth: ClientSessionGenerator,
    aioclient_mock: AiohttpClientMocker,
    google: FakeGoogle,
) -> None:
    entry = make_entry()
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    result = await entry.start_reauth_flow(hass)
    assert result["step_id"] == "reauth_confirm"
    assert result["description_placeholders"]["account"] == ACCOUNT
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {})
    result = await sign_in(hass, hass_client_no_auth, aioclient_mock, result)
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "reauth_successful"
    assert entry.data["token"]["access_token"] == "mock-access-token"
    assert entry.data["token"]["expires_in"] == 3599
    assert entry.options == OPTIONS


@pytest.mark.usefixtures("current_request_with_host")
async def test_reauth_with_another_account(
    hass: HomeAssistant,
    hass_client_no_auth: ClientSessionGenerator,
    aioclient_mock: AiohttpClientMocker,
    google: FakeGoogle,
) -> None:
    entry = make_entry()
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    google.calendars = [{"id": "other@example.com", "summary": "Other", "primary": True, "accessRole": "owner"}]

    result = await entry.start_reauth_flow(hass)
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {})
    result = await sign_in(hass, hass_client_no_auth, aioclient_mock, result)

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "wrong_account"


@pytest.mark.parametrize(
    ("name", "suggestion"),
    [
        ("Kid-Ava", "Ava"),
        ("kid: Ben", "Ben"),
        ("Kids - Cleo  Ray", "Cleo Ray"),
        ("Kid Ava", "Ava"),
        ("Kidney", "Kidney"),
        ("Kid-", "Kid-"),
    ],
)
def test_suggested_kid_name(name: str, suggestion: str) -> None:
    assert suggested_kid_name(name) == suggestion


async def loaded_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = make_entry()
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_options_settings(hass: HomeAssistant, google: FakeGoogle) -> None:
    entry = await loaded_entry(hass)

    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] is FlowResultType.MENU
    assert result["menu_options"] == ["settings", "calendars"]
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "settings"})
    assert result["step_id"] == "settings"

    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"mom_name": "Robin", "dad_name": "ROBIN", "planner": dict(DEFAULT_PLANNER)}
    )
    assert result["errors"] == {"dad_name": "names_match"}

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "mom_name": "Robin",
            "dad_name": "Sam",
            "mom_aliases": ["Rae", "Mom"],
            "dad_aliases": ["Dad"],
            "carpools": ["the Parkers", "Jordan"],
            "planner": {**DEFAULT_PLANNER, "arrive_early": 10.0},
        },
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert entry.options["planner"]["arrive_early"] == 10
    assert entry.options["kids"] == OPTIONS["kids"]
    settings = entry.runtime_data.settings
    assert settings.planner.arrive_early == 10
    assert settings.directory.resolve("rae") == "mom"
    assert settings.directory.resolve("the parkers") == "the Parkers"


async def test_options_calendars(hass: HomeAssistant, google: FakeGoogle) -> None:
    entry = await loaded_entry(hass)

    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "calendars"})
    assert result["step_id"] == "calendars"
    defaults = result["data_schema"]({})
    assert defaults == {"kids": [AVA, BEN], "mom_calendars": [ROBIN], "dad_calendars": [SAM]}

    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"kids": [BEN], "mom_calendars": [BEN]}
    )
    assert result["errors"] == {"mom_calendars": "kid_calendar_as_busy"}
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"kids": [BEN], "mom_calendars": [ROBIN, JOINT], "dad_calendars": []}
    )
    # The name chosen before is kept.
    assert result["step_id"] == "kid_name"
    assert result["data_schema"]({})["name"] == "Ben"
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"name": "Benny"})
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert entry.options["kids"] == [{"calendar_id": BEN, "name": "Benny"}]
    assert entry.options["mom_calendars"] == [ROBIN, JOINT]
    assert entry.options["dad_calendars"] == []
    assert entry.options["mom_name"] == "Robin"
    assert entry.runtime_data.settings.roles.busy == {"mom": (ROBIN, JOINT), "dad": ()}


async def test_options_calendars_drop_ones_that_are_gone(hass: HomeAssistant, google: FakeGoogle) -> None:
    entry = await loaded_entry(hass)
    google.calendars = [c for c in google.calendars if c["id"] != SAM]

    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "calendars"})
    assert result["data_schema"]({})["dad_calendars"] == []


async def test_options_calendars_when_google_fails(hass: HomeAssistant, google: FakeGoogle) -> None:
    entry = await loaded_entry(hass)
    google.errors["calendarList"] = google_error(500, "backendError")

    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "calendars"})
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "cannot_connect"


async def test_options_calendars_when_not_loaded(hass: HomeAssistant) -> None:
    entry = make_entry()
    entry.add_to_hass(hass)

    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "calendars"})
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "not_loaded"
