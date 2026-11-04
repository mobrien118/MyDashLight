"""Pairing a screen: a code on the screen, approved by an admin, and a sign-in collected once."""

from __future__ import annotations

from datetime import timedelta
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
import pytest
from pytest_homeassistant_custom_component.common import async_fire_time_changed
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker
from pytest_homeassistant_custom_component.typing import ClientSessionGenerator, WebSocketGenerator

from custom_components.mydashlight import pairing as pairing_module
from custom_components.mydashlight.pairing import (
    ALPHABET,
    CODE_LENGTH,
    CODE_LIFETIME,
    MAX_PENDING,
    MAX_PENDING_PER_ADDRESS,
    POLL_URL,
    START_URL,
    Pairing,
    new_code,
    normalize_code,
)

from .common import FakeGoogle, make_entry, setup_credentials


@pytest.fixture(autouse=True)
async def setup(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    await hass.config.async_set_time_zone("America/Chicago")
    await setup_credentials(hass)
    FakeGoogle(aioclient_mock)
    entry = make_entry()
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()


async def start(client: Any) -> dict[str, Any]:
    res = await client.post(START_URL)
    assert res.status == 200
    assert res.headers["Cache-Control"] == "no-store"
    body: dict[str, Any] = await res.json()
    return body


async def poll(client: Any, secret: str) -> tuple[int, dict[str, Any]]:
    res = await client.post(POLL_URL, json={"secret": secret})
    return res.status, await res.json()


async def ws(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator, msg: dict[str, Any], token: str | None = None
) -> Any:
    client = await hass_ws_client(hass, token) if token else await hass_ws_client(hass)
    await client.send_json_auto_id(msg)
    return await client.receive_json()


def test_codes_are_easy_to_read() -> None:
    for _ in range(200):
        code = new_code()
        assert len(code) == CODE_LENGTH
        assert set(code) <= set(ALPHABET)
    assert not set("01IO") & set(ALPHABET)
    assert normalize_code(" kq7m-4txp ") == "KQ7M4TXP"


async def test_a_screen_pairs_and_stays_signed_in(
    hass: HomeAssistant, hass_client_no_auth: ClientSessionGenerator, hass_ws_client: WebSocketGenerator
) -> None:
    client = await hass_client_no_auth()
    started = await start(client)
    assert started["expires_in"] == CODE_LIFETIME
    assert started["interval"] > 0
    code, secret = started["code"], started["secret"]

    assert await poll(client, secret) == (200, {"status": "pending"})

    # The admin sees where the request came from, typed however they like, then allows it.
    shown = code[:4].lower() + "-" + code[4:].lower()
    checked = await ws(hass, hass_ws_client, {"type": "mydashlight/pair/check", "code": shown})
    assert checked["success"]
    assert checked["result"]["found"] is True
    assert checked["result"]["code"] == code
    assert checked["result"]["address"] == "127.0.0.1"
    approved = await ws(hass, hass_ws_client, {"type": "mydashlight/pair/approve", "code": code})
    assert approved["success"], approved

    # A code can be approved once.
    again = await ws(hass, hass_ws_client, {"type": "mydashlight/pair/approve", "code": code})
    assert again["error"]["code"] == "not_found"

    status, body = await poll(client, secret)
    assert status == 200
    assert body["status"] == "paired"
    auth = body["auth"]
    assert auth["token_type"] == "Bearer"
    assert auth["client_id"].endswith("/mydashlight-kitchen")
    assert auth["expires_in"] > 0

    # It's an ordinary sign-in for the admin, under the kitchen page's address.
    refresh = hass.auth.async_get_refresh_token_by_token(auth["refresh_token"])
    assert refresh is not None
    assert refresh.client_id == auth["client_id"]
    assert refresh.user.is_admin
    assert hass.auth.async_validate_access_token(auth["access_token"]) is not None

    # The screen can renew it the way Home Assistant's own pages do.
    res = await client.post(
        "/auth/token",
        data={"grant_type": "refresh_token", "client_id": auth["client_id"], "refresh_token": auth["refresh_token"]},
    )
    assert res.status == 200, await res.text()
    assert (await res.json())["access_token"]

    # The sign-in is handed over once; the code is gone.
    assert await poll(client, secret) == (404, {"status": "expired"})


async def test_only_an_admin_can_approve(
    hass: HomeAssistant,
    hass_client_no_auth: ClientSessionGenerator,
    hass_ws_client: WebSocketGenerator,
    hass_read_only_access_token: str,
) -> None:
    client = await hass_client_no_auth()
    started = await start(client)
    for kind in ("check", "approve"):
        request = {"type": f"mydashlight/pair/{kind}", "code": started["code"]}
        msg = await ws(hass, hass_ws_client, request, hass_read_only_access_token)
        assert msg["error"]["code"] == "unauthorized"
    assert await poll(client, started["secret"]) == (200, {"status": "pending"})


async def test_unknown_codes_and_secrets(
    hass: HomeAssistant, hass_client_no_auth: ClientSessionGenerator, hass_ws_client: WebSocketGenerator
) -> None:
    client = await hass_client_no_auth()
    await start(client)
    checked = await ws(hass, hass_ws_client, {"type": "mydashlight/pair/check", "code": "AAAA-AAAA"})
    assert checked["result"] == {"found": False}
    approved = await ws(hass, hass_ws_client, {"type": "mydashlight/pair/approve", "code": "AAAA-AAAA"})
    assert approved["error"]["code"] == "not_found"

    assert await poll(client, "not-the-secret") == (404, {"status": "expired"})
    res = await client.post(POLL_URL, data="nonsense")
    assert res.status == 400
    res = await client.post(POLL_URL, json={"secret": 5})
    assert res.status == 400


async def test_an_approved_code_never_collected_is_cleaned_up(
    hass: HomeAssistant,
    hass_client_no_auth: ClientSessionGenerator,
    hass_ws_client: WebSocketGenerator,
    freezer: FrozenDateTimeFactory,
) -> None:
    client = await hass_client_no_auth()
    started = await start(client)
    before = {t.id for user in await hass.auth.async_get_users() for t in user.refresh_tokens.values()}
    approved = await ws(hass, hass_ws_client, {"type": "mydashlight/pair/approve", "code": started["code"]})
    assert approved["success"]
    after = {t.id for user in await hass.auth.async_get_users() for t in user.refresh_tokens.values()}
    assert len(after - before) == 1

    freezer.tick(timedelta(seconds=CODE_LIFETIME + 1))
    async_fire_time_changed(hass, dt_util.utcnow())
    await hass.async_block_till_done()

    left = {t.id for user in await hass.auth.async_get_users() for t in user.refresh_tokens.values()}
    assert left == before
    assert await poll(client, started["secret"]) == (404, {"status": "expired"})


async def test_codes_run_out(
    hass: HomeAssistant,
    hass_client_no_auth: ClientSessionGenerator,
    hass_ws_client: WebSocketGenerator,
    freezer: FrozenDateTimeFactory,
) -> None:
    client = await hass_client_no_auth()
    started = await start(client)
    freezer.tick(timedelta(seconds=CODE_LIFETIME + 1))
    async_fire_time_changed(hass, dt_util.utcnow())
    await hass.async_block_till_done()
    assert await poll(client, started["secret"]) == (404, {"status": "expired"})
    checked = await ws(hass, hass_ws_client, {"type": "mydashlight/pair/check", "code": started["code"]})
    assert checked["result"] == {"found": False}


async def test_too_many_codes_at_once(hass: HomeAssistant, hass_client_no_auth: ClientSessionGenerator) -> None:
    pairing = Pairing(hass)
    # One address asking again and again keeps only its newest few.
    first = pairing.start("https://ha.example/mydashlight-kitchen", "192.168.1.50")
    assert first is not None
    for _ in range(MAX_PENDING_PER_ADDRESS):
        assert pairing.start("https://ha.example/mydashlight-kitchen", "192.168.1.50") is not None
    assert pairing.find(first[0].code) is None
    assert len(pairing.pending) == MAX_PENDING_PER_ADDRESS

    # Many addresses at once: past the limit, no more codes until some run out.
    for i in range(MAX_PENDING - MAX_PENDING_PER_ADDRESS):
        assert pairing.start("https://ha.example/mydashlight-kitchen", f"10.0.0.{i}") is not None
    assert pairing.start("https://ha.example/mydashlight-kitchen", "10.0.1.1") is None
    pairing.clear()
    assert not pairing.pending

    # The page is told to try again later.
    client = await hass_client_no_auth()
    real = pairing_module._pairing(hass)
    for i in range(MAX_PENDING):
        real.start("https://ha.example/mydashlight-kitchen", f"10.1.0.{i}")
    res = await client.post(START_URL)
    assert res.status == 429
    real.clear()
