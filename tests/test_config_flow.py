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
import voluptuous as vol

from custom_components.mydashlight.const import DEFAULT_PLANNER, DOMAIN, OAUTH_AUTHORIZE, OAUTH_TOKEN, SCOPES

from .common import (
    ACCOUNT,
    AVA,
    BEN,
    CLIENT_ID,
    FAMILY,
    LUNCH,
    OPTIONS,
    ROUTES_KEY,
    FakeGoogle,
    FakeRoutes,
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
    assert result["description_placeholders"] == {"account": ACCOUNT}
    options = result["data_schema"].schema["events_calendar"].config["options"]
    labels = ["Family", "Kid-Ava", "Kid-Ben", "Lunches", "Robin", "Robin & Sam", ACCOUNT, "Sam"]
    assert [o["label"] for o in options] == labels

    async def pick(**data: Any) -> dict[str, Any]:
        return await hass.config_entries.flow.async_configure(result["flow_id"], data)

    result = await pick(events_calendar=FAMILY, kids=[" "])
    assert result["errors"] == {"kids": "kids_required"}
    result = await pick(events_calendar=FAMILY, lunch_calendar=FAMILY, kids=["Ava"])
    assert result["errors"] == {"lunch_calendar": "lunch_on_events_calendar"}
    result = await pick(events_calendar=FAMILY, kids=["Ava", "ava"])
    assert result["errors"] == {"kids": "kid_names_match"}
    result = await pick(events_calendar=FAMILY, kids=["Ava", "Robin"])
    assert result["errors"] == {"kids": "kid_named_like_parent"}
    result = await pick(events_calendar=FAMILY, lunch_calendar=LUNCH, kids=[" Ava ", "Ben"])
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    entry = result["result"]
    assert entry.title == "MyDashLight"
    assert entry.unique_id == ACCOUNT
    assert entry.data["auth_implementation"] == DOMAIN
    assert entry.data["token"]["refresh_token"] == "mock-refresh-token"
    assert entry.options == {k: v for k, v in OPTIONS.items() if k != "calendar_reminders"} | {
        "carpools": [],
        "kids": [{"id": "kid-ava", "name": "Ava", "aliases": []}, {"id": "kid-ben", "name": "Ben", "aliases": []}],
        "all_kids": [],
    }
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
    assert result["menu_options"] == ["settings", "calendars", "lunch", "drive_times", "reminders"]
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
            "home_address": "12 Oak St",
            "Ava's other names": ["Aves"],
            "Ben's other names": [],
            "all_kids": ["the kids"],
            "planner": {**DEFAULT_PLANNER, "arrive_early": 10.0},
        },
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert entry.options["planner"]["arrive_early"] == 10
    assert entry.options["kids"] == [
        {"calendar_id": AVA, "name": "Ava", "aliases": ["Aves"]},
        {"calendar_id": BEN, "name": "Ben", "aliases": []},
    ]
    assert "Ava's other names" not in entry.options
    assert entry.options["all_kids"] == ["the kids"]
    settings = entry.runtime_data.settings
    assert settings.planner.arrive_early == 10
    assert settings.directory.resolve("rae") == "mom"
    assert settings.directory.resolve("the parkers") == "the Parkers"
    assert settings.home_address == "12 Oak St"
    assert settings.people.aliases[AVA] == ("Aves",)
    assert tuple(settings.people.all_kids) == ("the kids",)

    # The kids' other names are filled in next time.
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "settings"})
    assert result["data_schema"]({"planner": DEFAULT_PLANNER})["Ava's other names"] == ["Aves"]


async def test_options_calendars(hass: HomeAssistant, google: FakeGoogle) -> None:
    entry = await loaded_entry(hass)

    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "calendars"})
    assert result["step_id"] == "calendars"
    defaults = result["data_schema"]({})
    assert defaults == {"events_calendar": FAMILY, "kids": ["Ava", "Ben"]}

    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"events_calendar": FAMILY, "lunch_calendar": FAMILY, "kids": ["Ben"]}
    )
    assert result["errors"] == {"lunch_calendar": "lunch_on_events_calendar"}
    # Ben is kept, with his id from before, Cleo is new, and Ava has gone.
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"events_calendar": FAMILY, "kids": ["Cleo", "ben"]}
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert entry.options["kids"] == [
        {"id": "kid-cleo", "name": "Cleo", "aliases": []},
        {"id": BEN, "name": "ben", "aliases": []},
    ]
    assert entry.options["events_calendar"] == FAMILY
    assert entry.options["lunch_calendar"] is None
    assert entry.options["mom_name"] == "Robin"
    assert [k.calendar_id for k in entry.runtime_data.settings.roles.kids] == ["kid-cleo", BEN]


async def test_options_calendars_drop_ones_that_are_gone(hass: HomeAssistant, google: FakeGoogle) -> None:
    entry = await loaded_entry(hass)
    google.calendars = [c for c in google.calendars if c["id"] != FAMILY]

    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "calendars"})
    with pytest.raises(vol.Invalid):
        result["data_schema"]({})
    assert result["data_schema"]({"events_calendar": LUNCH})["kids"] == ["Ava", "Ben"]


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


async def drive_times_form(hass: HomeAssistant, entry: MockConfigEntry) -> dict[str, Any]:
    result = await hass.config_entries.options.async_init(entry.entry_id)
    return await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "drive_times"})


async def test_options_drive_times_add_key(
    hass: HomeAssistant, google: FakeGoogle, aioclient_mock: AiohttpClientMocker
) -> None:
    routes = FakeRoutes(aioclient_mock)
    entry = await loaded_entry(hass)

    result = await drive_times_form(hass, entry)
    assert result["step_id"] == "drive_times"
    assert result["description_placeholders"] == {"key_state": "not set"}
    assert "remove_routes_key" not in result["data_schema"].schema
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"routes_api_key": f" {ROUTES_KEY} ", "routes_daily_limit": 100.0}
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert entry.options["routes_api_key"] == ROUTES_KEY
    assert entry.options["routes_daily_limit"] == 100
    assert entry.options["kids"] == OPTIONS["kids"]
    # The key was checked with one lookup from home to home before it was saved.
    assert routes.bodies[0]["origin"] == routes.bodies[0]["destination"]
    lookups = entry.runtime_data.coordinator.lookups
    assert lookups.api is not None
    assert lookups.daily_limit == 100


@pytest.mark.parametrize(
    ("status", "error"),
    [
        (403, {"routes_api_key": "routes_key_rejected"}),
        (429, {"base": "routes_quota"}),
        (503, {"base": "cannot_connect"}),
    ],
)
async def test_options_drive_times_bad_key(
    hass: HomeAssistant,
    google: FakeGoogle,
    aioclient_mock: AiohttpClientMocker,
    status: int,
    error: dict[str, str],
) -> None:
    routes = FakeRoutes(aioclient_mock)
    routes.status = status
    entry = await loaded_entry(hass)

    result = await drive_times_form(hass, entry)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"routes_api_key": "bad", "routes_daily_limit": 150}
    )
    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == error
    assert "routes_api_key" not in entry.options


async def test_options_drive_times_no_route_still_accepts_the_key(
    hass: HomeAssistant, google: FakeGoogle, aioclient_mock: AiohttpClientMocker
) -> None:
    routes = FakeRoutes(aioclient_mock)
    routes.status = 400
    entry = await loaded_entry(hass)
    result = await drive_times_form(hass, entry)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"routes_api_key": ROUTES_KEY, "routes_daily_limit": 150}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert entry.options["routes_api_key"] == ROUTES_KEY


async def test_options_drive_times_keep_and_remove_key(
    hass: HomeAssistant, google: FakeGoogle, aioclient_mock: AiohttpClientMocker
) -> None:
    routes = FakeRoutes(aioclient_mock)
    entry = make_entry({**OPTIONS, "routes_api_key": ROUTES_KEY})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    asked = len(routes.bodies)

    result = await drive_times_form(hass, entry)
    assert result["description_placeholders"] == {"key_state": "set"}
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"routes_daily_limit": 50})
    await hass.async_block_till_done()
    assert entry.options["routes_api_key"] == ROUTES_KEY  # an empty field keeps the key
    assert entry.options["routes_daily_limit"] == 50
    assert len(routes.bodies) >= asked

    result = await drive_times_form(hass, entry)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"routes_daily_limit": 50, "remove_routes_key": True}
    )
    await hass.async_block_till_done()
    assert "routes_api_key" not in entry.options
    assert entry.runtime_data.coordinator.lookups.api is None


async def test_options_drive_times_needs_home(hass: HomeAssistant, google: FakeGoogle) -> None:
    entry = await loaded_entry(hass)
    hass.config.latitude = 0
    hass.config.longitude = 0
    result = await drive_times_form(hass, entry)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"routes_api_key": ROUTES_KEY, "routes_daily_limit": 150}
    )
    assert result["errors"] == {"base": "no_home_location"}
