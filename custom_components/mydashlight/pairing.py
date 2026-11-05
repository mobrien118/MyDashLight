"""Pairs a screen, such as the kitchen screen, with no keyboard and no password typed on it.

1. The kitchen page, with no sign-in saved, asks for a pairing code: ``POST /api/mydashlight/pair``.
   It gets a short code to show (``KQ7M-4TXP``) and a long secret it keeps to itself.
2. A Home Assistant admin approves the code in the MyDashLight sidebar page, from a phone, by
   scanning the screen's QR code or typing the code: ``mydashlight/pair/approve``.
3. The page asks with its secret, every couple of seconds, whether it's been approved:
   ``POST /api/mydashlight/pair/poll``. Once it is, it gets a normal Home Assistant sign-in for the
   admin who approved it, and from then on talks to Home Assistant like any other page.

Seeing the code isn't enough to collect the sign-in: only the page holding the secret can. The
sign-in is an ordinary refresh token, listed on the admin's profile under the kitchen page's
address, and Home Assistant keeps it alive as long as the screen uses it. Deleting it there signs
the screen out, and it shows a new code.

Codes live only in memory and last ten minutes; a code that's approved but never collected has
its sign-in deleted when it runs out.

Anyone on the internet who can reach Home Assistant can open the kitchen page and get a code too. A
code like that is harmless unless an admin approves it, so the admin is warned when a code didn't
come from the home network, and codes from outside can't use up the room home screens need.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass, field
import hashlib
import hmac
from ipaddress import ip_address, ip_network
import logging
import secrets
import time
from typing import Any, Final

from aiohttp import web
from homeassistant.auth.models import RefreshToken
from homeassistant.components import network, websocket_api
from homeassistant.components.websocket_api.connection import ActiveConnection
from homeassistant.components.websocket_api.decorators import async_response, require_admin, websocket_command
from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.event import async_call_later
from homeassistant.helpers.http import KEY_HASS, HomeAssistantView
import voluptuous as vol

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

START_URL: Final = f"/api/{DOMAIN}/pair"
POLL_URL: Final = f"/api/{DOMAIN}/pair/poll"
WS_PAIR_CHECK: Final = f"{DOMAIN}/pair/check"
WS_PAIR_APPROVE: Final = f"{DOMAIN}/pair/approve"

CODE_LIFETIME: Final = 600
"""Seconds a code can be approved and collected in."""
POLL_INTERVAL: Final = 2
"""Seconds the page waits between asking whether it's been approved."""
MAX_PENDING: Final = 20
"""Codes waiting at once, across all screens. More is someone flooding the page."""
MAX_PENDING_PER_ADDRESS: Final = 3
"""Codes waiting at once from one address. A new one past this replaces the oldest."""
MAX_PENDING_OUTSIDE: Final = 10
"""Codes waiting at once from outside the home network, so they can't crowd out home screens."""

ALPHABET: Final = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
"""No 0/O or 1/I, so a code can't be misread. 32 letters, 8 of them: about a trillion codes."""
CODE_LENGTH: Final = 8

_DATA: Final = f"{DOMAIN}_pairing"


def new_code() -> str:
    return "".join(secrets.choice(ALPHABET) for _ in range(CODE_LENGTH))


def normalize_code(text: str) -> str:
    """The code as typed, without spaces or dashes and in capitals."""
    return "".join(c for c in text.upper() if c.isalnum())


def is_home_address(address: str, home_networks: Iterable[str] = ()) -> bool:
    """Whether a request came from the home network: a private address, or one on a network that
    Home Assistant itself is on (which covers a home's public IPv6 addresses)."""
    try:
        ip = ip_address(address)
    except ValueError:
        return False
    if ip.version == 6 and ip.ipv4_mapped is not None:
        ip = ip.ipv4_mapped
    if ip.is_loopback or ip.is_link_local or (ip.is_private and not ip.is_unspecified):
        return True
    for net in home_networks:
        try:
            if ip in ip_network(net, strict=False):
                return True
        except ValueError:
            continue
    return False


async def async_home_networks(hass: HomeAssistant) -> list[str]:
    """The networks Home Assistant's own network adapters are on, like ``2600:1700:1:2::/64``."""
    nets: list[str] = []
    for adapter in await network.async_get_adapters(hass):
        if not adapter["enabled"]:
            continue
        for ip in [*adapter["ipv4"], *adapter["ipv6"]]:
            nets.append(f"{ip['address']}/{ip['network_prefix']}")
    return nets


def _digest(secret: str) -> str:
    return hashlib.sha256(secret.encode()).hexdigest()


@dataclass
class Pending:
    code: str
    secret_digest: str
    client_id: str
    """The address the sign-in is for: the kitchen page on the address the screen used."""
    address: str
    """Where the request came from, shown when approving."""
    home: bool
    """Whether that's on the home network. If not, the admin is warned before approving."""
    created: float
    approving: bool = False
    refresh_token: RefreshToken | None = None
    approved_by: str | None = None
    expire: CALLBACK_TYPE | None = field(default=None, repr=False)


class Pairing:
    """The codes waiting to be approved and collected."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.pending: dict[str, Pending] = {}

    def start(self, client_id: str, address: str, home: bool) -> tuple[Pending, str] | None:
        """A new code and its secret, or None if too many are waiting."""
        mine = sorted((p for p in self.pending.values() if p.address == address), key=lambda p: p.created)
        while len(mine) >= MAX_PENDING_PER_ADDRESS:
            self._drop(mine.pop(0))
        if len(self.pending) >= MAX_PENDING:
            return None
        if not home and sum(not p.home for p in self.pending.values()) >= MAX_PENDING_OUTSIDE:
            return None
        code = new_code()
        while code in self.pending:
            code = new_code()
        secret = secrets.token_urlsafe(32)
        p = Pending(code, _digest(secret), client_id, address, home, time.monotonic())
        p.expire = async_call_later(self.hass, CODE_LIFETIME, lambda _now: self._drop(p))
        self.pending[code] = p
        return p, secret

    def find(self, code: str) -> Pending | None:
        return self.pending.get(normalize_code(code))

    def by_secret(self, secret: str) -> Pending | None:
        digest = _digest(secret)
        for p in self.pending.values():
            if hmac.compare_digest(p.secret_digest, digest):
                return p
        return None

    def waiting(self, code: str) -> Pending | None:
        """The code if it can still be approved: not run out, not approved already."""
        p = self.find(code)
        return None if p is None or p.approving else p

    async def approve(self, p: Pending, user_id: str) -> bool:
        """Sign the screen in as this user. False if the code ran out meanwhile."""
        p.approving = True
        user = await self.hass.auth.async_get_user(user_id)
        if user is None:
            return False
        token = await self.hass.auth.async_create_refresh_token(user, client_id=p.client_id)
        if self.pending.get(p.code) is not p:
            self.hass.auth.async_remove_refresh_token(token)
            return False
        p.refresh_token = token
        p.approved_by = user.name
        if p.home:
            _LOGGER.info("%s paired a screen at %s, signed in as them", user.name, p.address)
        else:
            _LOGGER.warning(
                "%s paired a screen at %s, outside the home network, signed in as them", user.name, p.address
            )
        return True

    def collect(self, p: Pending, address: str) -> dict[str, Any]:
        """The sign-in for the screen, once. The code is gone afterwards."""
        assert p.refresh_token is not None
        access = self.hass.auth.async_create_access_token(p.refresh_token, address)
        expires_in = int(p.refresh_token.access_token_expiration.total_seconds())
        refresh = p.refresh_token.token
        p.refresh_token = None  # Handed over: no longer ours to delete.
        self._drop(p)
        return {
            "access_token": access,
            "refresh_token": refresh,
            "expires_in": expires_in,
            "token_type": "Bearer",
            "client_id": p.client_id,
        }

    @callback
    def _drop(self, p: Pending) -> None:
        if self.pending.get(p.code) is not p:
            return
        del self.pending[p.code]
        if p.expire is not None:
            p.expire()
            p.expire = None
        if p.refresh_token is not None:
            # Approved but never collected: the sign-in would never be used, so delete it.
            self.hass.auth.async_remove_refresh_token(p.refresh_token)
            p.refresh_token = None

    @callback
    def clear(self) -> None:
        for p in list(self.pending.values()):
            self._drop(p)


def _pairing(hass: HomeAssistant) -> Pairing:
    pairing: Pairing | None = hass.data.get(_DATA)
    if pairing is None:
        pairing = hass.data[_DATA] = Pairing(hass)
    return pairing


def _address(request: web.Request) -> str:
    return request.remote or "unknown"


@callback
def async_setup_pairing(hass: HomeAssistant, kitchen_url: str) -> None:
    """Serve the screen's side of pairing and register the admin's side. Done once."""
    hass.http.register_view(PairStartView(kitchen_url))
    hass.http.register_view(PairPollView())
    websocket_api.async_register_command(hass, _ws_check)
    websocket_api.async_register_command(hass, _ws_approve)


class PairStartView(HomeAssistantView):
    """A new code for a screen to show. No sign-in needed: that's the point."""

    url = START_URL
    name = f"{DOMAIN}:pair"
    requires_auth = False

    def __init__(self, kitchen_url: str) -> None:
        self._kitchen_url = kitchen_url

    async def post(self, request: web.Request) -> web.Response:
        hass = request.app[KEY_HASS]
        client_id = f"{request.url.origin()}{self._kitchen_url}"
        address = _address(request)
        home = is_home_address(address, await async_home_networks(hass))
        started = _pairing(hass).start(client_id, address, home)
        if started is None:
            return self.json({"error": "busy"}, 429)
        p, secret = started
        return self.json(
            {"code": p.code, "secret": secret, "expires_in": CODE_LIFETIME, "interval": POLL_INTERVAL},
            headers={"Cache-Control": "no-store"},
        )


class PairPollView(HomeAssistantView):
    """Whether the screen's code has been approved, and if so its sign-in."""

    url = POLL_URL
    name = f"{DOMAIN}:pair:poll"
    requires_auth = False

    async def post(self, request: web.Request) -> web.Response:
        hass = request.app[KEY_HASS]
        try:
            body = await request.json()
        except ValueError:
            body = None
        secret = body.get("secret") if isinstance(body, dict) else None
        if not isinstance(secret, str) or not secret:
            return self.json({"error": "bad_request"}, 400)
        pairing = _pairing(hass)
        p = pairing.by_secret(secret)
        headers = {"Cache-Control": "no-store"}
        if p is None:
            return self.json({"status": "expired"}, 404, headers=headers)
        if p.refresh_token is None:
            return self.json({"status": "pending"}, headers=headers)
        auth = pairing.collect(p, _address(request))
        return self.json({"status": "paired", "auth": auth}, headers=headers)


@require_admin
@websocket_command({vol.Required("type"): WS_PAIR_CHECK, vol.Required("code"): str})
@callback
def _ws_check(hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]) -> None:
    """Whether a code is waiting, and where it came from, before an admin approves it."""
    p = _pairing(hass).waiting(msg["code"])
    if p is None:
        connection.send_result(msg["id"], {"found": False})
        return
    connection.send_result(
        msg["id"],
        {
            "found": True,
            "code": p.code,
            "address": p.address,
            "home": p.home,
            "age": int(time.monotonic() - p.created),
            "expires_in": max(0, int(CODE_LIFETIME - (time.monotonic() - p.created))),
        },
    )


@require_admin
@websocket_command({vol.Required("type"): WS_PAIR_APPROVE, vol.Required("code"): str})
@async_response
async def _ws_approve(hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]) -> None:
    """Approve a code: the screen that showed it is signed in as the admin approving it."""
    pairing = _pairing(hass)
    p = pairing.waiting(msg["code"])
    if p is None or not await pairing.approve(p, connection.user.id):
        connection.send_error(
            msg["id"], "not_found", "That code isn't waiting any more. Check the screen for a new code."
        )
        return
    connection.send_result(msg["id"], {"approved": True})
