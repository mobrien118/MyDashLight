"""A fake Google Calendar for the integration tests, and a ready-made config entry."""

from __future__ import annotations

from collections.abc import Mapping
from http import HTTPStatus
import re
import time
from typing import Any

from homeassistant.components.application_credentials import ClientCredential, async_import_client_credential
from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker, AiohttpClientMockResponse
from yarl import URL

from custom_components.mydashlight.const import DEFAULT_PLANNER, DOMAIN

CLIENT_ID = "client-id.apps.googleusercontent.com"
CLIENT_SECRET = "client-secret"
ACCOUNT = "robin@example.com"
AVA = "ava-calendar@group.calendar.google.com"
BEN = "ben-calendar@group.calendar.google.com"
ROBIN = "robin-calendar@group.calendar.google.com"
SAM = "sam-calendar@group.calendar.google.com"
JOINT = "joint-calendar@group.calendar.google.com"

CALENDARS = [
    {"id": ACCOUNT, "summary": ACCOUNT, "primary": True, "accessRole": "owner"},
    {"id": AVA, "summary": "Kid-Ava", "accessRole": "owner"},
    {"id": BEN, "summary": "Kid-Ben", "accessRole": "owner"},
    {"id": ROBIN, "summary": "Robin", "accessRole": "owner"},
    {"id": SAM, "summary": "Sam", "accessRole": "writer"},
    {"id": JOINT, "summary": "Robin & Sam", "accessRole": "owner"},
]

OPTIONS: dict[str, Any] = {
    "mom_name": "Robin",
    "dad_name": "Sam",
    "mom_aliases": [],
    "dad_aliases": [],
    "carpools": ["the Parkers"],
    "planner": dict(DEFAULT_PLANNER),
    "kids": [{"calendar_id": AVA, "name": "Ava"}, {"calendar_id": BEN, "name": "Ben"}],
    "mom_calendars": [ROBIN],
    "dad_calendars": [SAM],
}


class FakeGoogle:
    """Answers the Calendar API calls MyDashLight makes, from in-memory calendars."""

    def __init__(self, aioclient_mock: AiohttpClientMocker) -> None:
        self.calendars: list[dict[str, Any]] = list(CALENDARS)
        self.events: dict[str, list[dict[str, Any]]] = {}
        self.errors: dict[str, tuple[int, dict[str, Any]]] = {}
        """Error replies by calendar id, or "calendarList"."""
        self.page_size = 250
        self.calls: list[URL] = []
        aioclient_mock.get(re.compile(r"^https://www\.googleapis\.com/calendar/v3/"), side_effect=self._handle)

    def add(self, calendar_id: str, **event: Any) -> dict[str, Any]:
        item = {"etag": f'"{len(self.events.get(calendar_id, []))}"', **event}
        self.events.setdefault(calendar_id, []).append(item)
        return item

    async def _handle(self, method: str, url: URL, data: Any) -> AiohttpClientMockResponse:
        self.calls.append(url)
        if url.path.endswith("/users/me/calendarList"):
            return self._reply(method, url, "calendarList", self.calendars)
        match = re.search(r"/calendars/(.+)/events$", url.path)
        assert match, url
        cal_id = match.group(1)
        if cal_id not in self.events and cal_id not in self.errors and cal_id not in {c["id"] for c in self.calendars}:
            return AiohttpClientMockResponse(method, url, status=HTTPStatus.NOT_FOUND, json=_error(404, "notFound"))
        return self._reply(method, url, cal_id, self.events.get(cal_id, []))

    def _reply(self, method: str, url: URL, key: str, items: list[dict[str, Any]]) -> AiohttpClientMockResponse:
        if key in self.errors:
            status, body = self.errors[key]
            return AiohttpClientMockResponse(method, url, status=status, json=body)
        start = int(url.query.get("pageToken") or 0)
        page = items[start : start + self.page_size]
        body: dict[str, Any] = {"items": page}
        if start + self.page_size < len(items):
            body["nextPageToken"] = str(start + self.page_size)
        return AiohttpClientMockResponse(method, url, json=body)


def _error(code: int, reason: str, message: str = "Error") -> dict[str, Any]:
    return {"error": {"code": code, "message": message, "errors": [{"reason": reason, "message": message}]}}


def google_error(code: int, reason: str, message: str = "Error") -> tuple[int, dict[str, Any]]:
    return code, _error(code, reason, message)


def timed(event_id: str, title: str, start: str, end: str, **extra: Any) -> dict[str, Any]:
    """An event with times, such as ``timed("e1", "Piano", "2026-11-03T16:00:00-06:00", ...)``."""
    return {"id": event_id, "summary": title, "start": {"dateTime": start}, "end": {"dateTime": end}, **extra}


def all_day(event_id: str, title: str, start: str, end: str, **extra: Any) -> dict[str, Any]:
    return {"id": event_id, "summary": title, "start": {"date": start}, "end": {"date": end}, **extra}


async def setup_credentials(hass: HomeAssistant) -> None:
    assert await async_setup_component(hass, "application_credentials", {})
    await async_import_client_credential(hass, DOMAIN, ClientCredential(CLIENT_ID, CLIENT_SECRET), DOMAIN)


def make_entry(
    options: Mapping[str, Any] | None = None, expires_at: float | None = None, **data: Any
) -> MockConfigEntry:
    return MockConfigEntry(
        domain=DOMAIN,
        title="MyDashLight",
        unique_id=ACCOUNT,
        data={
            "auth_implementation": DOMAIN,
            "token": {
                "access_token": "mock-access-token",
                "refresh_token": "mock-refresh-token",
                "expires_at": time.time() + 3600 if expires_at is None else expires_at,
                "token_type": "Bearer",
                "scope": "calendar",
            },
            **data,
        },
        options=dict(OPTIONS if options is None else options),
    )


ROUTES_KEY = "routes-key"


class FakeRoutes:
    """Answers Google Routes lookups with fixed drive times, by destination."""

    def __init__(self, aioclient_mock: AiohttpClientMocker) -> None:
        self.minutes: dict[str, float] = {}
        """Drive minutes by destination address; "home" for home."""
        self.default = 22.5
        self.status: int | None = None
        self.error: dict[str, Any] = {}
        self.bodies: list[dict[str, Any]] = []
        aioclient_mock.post("https://routes.googleapis.com/directions/v2:computeRoutes", side_effect=self._handle)

    async def _handle(self, method: str, url: URL, data: Any) -> AiohttpClientMockResponse:
        self.bodies.append(data)
        if self.status is not None:
            return AiohttpClientMockResponse(method, url, status=self.status, json=self.error)
        dest = data["destination"].get("address", "home")
        minutes = self.minutes.get(dest, self.default)
        return AiohttpClientMockResponse(method, url, json={"routes": [{"duration": f"{int(minutes * 60)}s"}]})
