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

from custom_components.mydashlight.const import DEFAULT_PLANNER, DOMAIN, SCOPES

CLIENT_ID = "client-id.apps.googleusercontent.com"
CLIENT_SECRET = "client-secret"
ACCOUNT = "robin@example.com"
AVA = "ava-calendar@group.calendar.google.com"
BEN = "ben-calendar@group.calendar.google.com"
ROBIN = "robin-calendar@group.calendar.google.com"
SAM = "sam-calendar@group.calendar.google.com"
JOINT = "joint-calendar@group.calendar.google.com"
FAMILY = "family-calendar@group.calendar.google.com"
"""The shared calendar every family event is on, each title starting with who it's for."""
LUNCH = "lunch-calendar@group.calendar.google.com"

CALENDARS = [
    {"id": ACCOUNT, "summary": ACCOUNT, "primary": True, "accessRole": "owner"},
    {"id": AVA, "summary": "Kid-Ava", "accessRole": "owner"},
    {"id": BEN, "summary": "Kid-Ben", "accessRole": "owner"},
    {"id": ROBIN, "summary": "Robin", "accessRole": "owner"},
    {"id": SAM, "summary": "Sam", "accessRole": "writer"},
    {"id": JOINT, "summary": "Robin & Sam", "accessRole": "owner"},
    {"id": FAMILY, "summary": "Family", "accessRole": "owner"},
    {"id": LUNCH, "summary": "Lunches", "accessRole": "owner"},
]

OPTIONS: dict[str, Any] = {
    "mom_name": "Robin",
    "dad_name": "Sam",
    "mom_aliases": [],
    "dad_aliases": [],
    "carpools": ["the Parkers"],
    "planner": dict(DEFAULT_PLANNER),
    # The kids had calendars of their own before 0.19, and their ids are still the kids' ids.
    "kids": [{"calendar_id": AVA, "name": "Ava"}, {"calendar_id": BEN, "name": "Ben"}],
    "events_calendar": FAMILY,
    "lunch_calendar": LUNCH,
    # Off here so the tests of other changes see only their own saves. test_alerts turns it on.
    "calendar_reminders": False,
}


class FakeGoogle:
    """Answers the Calendar API calls MyDashLight makes, from in-memory calendars.

    Single events can be read and their notes patched. A patch needs the event's current
    etag in If-Match, as Google does. Patching a repeating event's series also changes the
    occurrences whose notes still match the series' old notes, the way occurrences nobody
    changed by themselves follow the series.
    """

    def __init__(self, aioclient_mock: AiohttpClientMocker) -> None:
        self.calendars: list[dict[str, Any]] = list(CALENDARS)
        self.events: dict[str, list[dict[str, Any]]] = {}
        self.series: dict[str, dict[str, dict[str, Any]]] = {}
        """Repeating events' series, by calendar id and then event id."""
        self.errors: dict[str, tuple[int, dict[str, Any]]] = {}
        """Error replies by calendar id, or "calendarList"."""
        self.write_errors: dict[str, tuple[int, dict[str, Any]]] = {}
        """Error replies to patches, by event id."""
        self.edits_in_between = 0
        """How many patches find that someone else just changed the event."""
        self.page_size = 250
        self.calls: list[URL] = []
        self.patches: list[tuple[str, str, str, dict[str, Any]]] = []
        """(calendar id, event id, If-Match, body) for each patch saved."""
        self._etags = 100
        self._mock = aioclient_mock
        base = re.compile(r"^https://www\.googleapis\.com/calendar/v3/")
        aioclient_mock.get(base, side_effect=self._handle)
        aioclient_mock.patch(base, side_effect=self._patch)
        aioclient_mock.post(base, side_effect=self._insert)
        aioclient_mock.delete(base, side_effect=self._delete)
        self.inserted: list[tuple[str, dict[str, Any]]] = []
        """(calendar id, body) for each event added."""
        self.deleted: list[tuple[str, str]] = []
        """(calendar id, event id) for each event deleted."""
        self.tasks = FakeTasks(aioclient_mock)
        self._listed: dict[str, list[dict[str, Any]]] | None = None

    def add(self, calendar_id: str, **event: Any) -> dict[str, Any]:
        item = {"etag": f'"{len(self.events.get(calendar_id, []))}"', **event}
        self.events.setdefault(calendar_id, []).append(item)
        return item

    def add_series(self, calendar_id: str, **event: Any) -> dict[str, Any]:
        item = {"etag": self._next_etag(), **event}
        self.series.setdefault(calendar_id, {})[item["id"]] = item
        return item

    def lag_lists(self) -> None:
        """From now until :meth:`catch_up`, lists of events show them as they are now, the way
        Google's list can be a moment behind a change. Reading one event stays current."""
        self._listed = {cal: [dict(item) for item in items] for cal, items in self.events.items()}

    def catch_up(self) -> None:
        self._listed = None

    def event(self, calendar_id: str, event_id: str) -> dict[str, Any] | None:
        for item in self.events.get(calendar_id, []):
            if item["id"] == event_id:
                return item
        return self.series.get(calendar_id, {}).get(event_id)

    def _next_etag(self) -> str:
        self._etags += 1
        return f'"{self._etags}"'

    async def _patch(self, method: str, url: URL, data: Any) -> AiohttpClientMockResponse:
        headers = self._mock.mock_calls[-1][3] or {}
        assert url.query.get("sendUpdates") == "none"
        match = re.search(r"/calendars/(.+)/events/(.+)$", url.path)
        assert match, url
        cal_id, event_id = match.groups()
        item = self.event(cal_id, event_id)
        if event_id in self.write_errors:
            status, body = self.write_errors[event_id]
            return AiohttpClientMockResponse(method, url, status=status, json=body)
        if item is None:
            return AiohttpClientMockResponse(method, url, status=HTTPStatus.NOT_FOUND, json=_error(404, "notFound"))
        if self.edits_in_between:
            self.edits_in_between -= 1
            item["etag"] = self._next_etag()
            item["description"] = (item.get("description") or "") + "\nEdited on a phone"
        if headers.get("If-Match") != item["etag"]:
            return AiohttpClientMockResponse(
                method, url, status=HTTPStatus.PRECONDITION_FAILED, json=_error(412, "conditionNotMet")
            )
        sent, data = dict(data), dict(data)
        if "reminders" in data:
            # Like Google, PATCH merges the reminders object into the event's.
            data["reminders"] = {**(item.get("reminders") or {}), **data["reminders"]}
            if data["reminders"].get("useDefault") and data["reminders"].get("overrides"):
                message = "Cannot specify both default reminders and overrides at the same time."
                return AiohttpClientMockResponse(
                    method,
                    url,
                    status=HTTPStatus.BAD_REQUEST,
                    json=_error(400, "cannotUseDefaultRemindersAndSpecifyOverride", message),
                )
        self.patches.append((cal_id, event_id, headers["If-Match"], sent))
        old = item.get("description") or ""
        if event_id in self.series.get(cal_id, {}):
            for occurrence in self.events.get(cal_id, []):
                if occurrence.get("recurringEventId") == event_id and (occurrence.get("description") or "") == old:
                    occurrence.update(data)
                    occurrence["etag"] = self._next_etag()
        item.update(data)
        item["etag"] = self._next_etag()
        return AiohttpClientMockResponse(method, url, json=item)

    async def _insert(self, method: str, url: URL, data: Any) -> AiohttpClientMockResponse:
        assert url.query.get("sendUpdates") == "none"
        match = re.search(r"/calendars/(.+)/events$", url.path)
        assert match, url
        cal_id = match.group(1)
        item = {"id": f"made-{len(self.inserted) + 1}", "etag": self._next_etag(), **dict(data)}
        self.inserted.append((cal_id, dict(data)))
        self.events.setdefault(cal_id, []).append(item)
        return AiohttpClientMockResponse(method, url, json=item)

    async def _delete(self, method: str, url: URL, data: Any) -> AiohttpClientMockResponse:
        headers = self._mock.mock_calls[-1][3] or {}
        assert url.query.get("sendUpdates") == "none"
        match = re.search(r"/calendars/(.+)/events/(.+)$", url.path)
        assert match, url
        cal_id, event_id = match.groups()
        item = self.event(cal_id, event_id)
        if item is None:
            return AiohttpClientMockResponse(method, url, status=HTTPStatus.GONE, json=_error(410, "deleted"))
        if headers.get("If-Match") and headers["If-Match"] != item["etag"]:
            return AiohttpClientMockResponse(
                method, url, status=HTTPStatus.PRECONDITION_FAILED, json=_error(412, "conditionNotMet")
            )
        self.events[cal_id].remove(item)
        self.deleted.append((cal_id, event_id))
        return AiohttpClientMockResponse(method, url, status=HTTPStatus.NO_CONTENT)

    async def _handle(self, method: str, url: URL, data: Any) -> AiohttpClientMockResponse:
        self.calls.append(url)
        if one := re.search(r"/calendars/(.+)/events/(.+)$", url.path):
            item = self.event(*one.groups())
            if item is None:
                return AiohttpClientMockResponse(method, url, status=HTTPStatus.NOT_FOUND, json=_error(404, "notFound"))
            return AiohttpClientMockResponse(method, url, json=item)
        if url.path.endswith("/users/me/calendarList"):
            return self._reply(method, url, "calendarList", self.calendars)
        match = re.search(r"/calendars/(.+)/events$", url.path)
        assert match, url
        cal_id = match.group(1)
        if cal_id not in self.events and cal_id not in self.errors and cal_id not in {c["id"] for c in self.calendars}:
            return AiohttpClientMockResponse(method, url, status=HTTPStatus.NOT_FOUND, json=_error(404, "notFound"))
        listed = self._listed if self._listed is not None else self.events
        return self._reply(method, url, cal_id, listed.get(cal_id, []))

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
                "scope": " ".join(SCOPES),
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
        self.spots: dict[str, tuple[float, float]] = {}
        """Where each address is on the map, sent back as the route's ends."""
        self.from_points: dict[tuple[float, float], float] = {}
        """Drive minutes from a point on the map, used before :attr:`minutes`."""
        self.bodies: list[dict[str, Any]] = []
        aioclient_mock.post("https://routes.googleapis.com/directions/v2:computeRoutes", side_effect=self._handle)

    async def _handle(self, method: str, url: URL, data: Any) -> AiohttpClientMockResponse:
        self.bodies.append(data)
        if self.status is not None:
            return AiohttpClientMockResponse(method, url, status=self.status, json=self.error)
        dest = data["destination"].get("address", "home")
        start = self._point(data["origin"])
        minutes = self.from_points[start] if start in self.from_points else self.minutes.get(dest, self.default)
        route: dict[str, Any] = {"duration": f"{int(minutes * 60)}s"}
        end = self._point(data["destination"])
        if start is not None and end is not None:
            route["legs"] = [{"startLocation": _lat_lng(start), "endLocation": _lat_lng(end)}]
        return AiohttpClientMockResponse(method, url, json={"routes": [route]})

    def _point(self, waypoint: dict[str, Any]) -> tuple[float, float] | None:
        if "address" in waypoint:
            return self.spots.get(waypoint["address"])
        point = waypoint["location"]["latLng"]
        return (point["latitude"], point["longitude"])

    @property
    def live(self) -> list[dict[str, Any]]:
        """The lookups made from wherever someone is, in today's traffic."""
        return [b for b in self.bodies if "departureTime" not in b]


def _lat_lng(spot: tuple[float, float]) -> dict[str, Any]:
    return {"latLng": {"latitude": spot[0], "longitude": spot[1]}}


class FakeTasks:
    """Answers the Google Tasks API calls MyDashLight makes, from in-memory task lists.

    Checking a task off records when, the way Google does, at ``now``.
    """

    def __init__(self, aioclient_mock: AiohttpClientMocker) -> None:
        self.lists: dict[str, dict[str, Any]] = {}
        """Each list's ``title`` and ``items``, by list id."""
        self.now = "2026-11-04T15:00:00.000Z"
        self.errors: dict[str, tuple[int, dict[str, Any]]] = {}
        """Error replies by list id, or "lists" for the list of lists."""
        self.calls: list[tuple[str, URL]] = []
        self._ids = 0
        base = re.compile(r"^https://tasks\.googleapis\.com/tasks/v1/")
        for method in ("get", "post", "patch", "delete"):
            getattr(aioclient_mock, method)(base, side_effect=self._handle)

    def add_list(self, title: str, list_id: str | None = None) -> str:
        list_id = list_id or self._next("list")
        self.lists[list_id] = {"title": title, "items": []}
        return list_id

    def list_id(self, title: str) -> str | None:
        return next((i for i, tl in self.lists.items() if tl["title"] == title), None)

    def add(self, list_id: str, title: str, notes: str = "", **extra: Any) -> dict[str, Any]:
        item = {"id": self._next("task"), "title": title, "notes": notes, "status": "needsAction", **extra}
        item.setdefault("position", f"{len(self.lists[list_id]['items']):08d}")
        self.lists[list_id]["items"].append(item)
        return item

    def items(self, title: str) -> list[dict[str, Any]]:
        list_id = self.list_id(title)
        return list(self.lists[list_id]["items"]) if list_id else []

    def _next(self, kind: str) -> str:
        self._ids += 1
        return f"{kind}-{self._ids}"

    async def _handle(self, method: str, url: URL, data: Any) -> AiohttpClientMockResponse:
        self.calls.append((method, url))
        path = url.path.removeprefix("/tasks/v1")
        if path == "/users/@me/lists":
            if "lists" in self.errors:
                status, body = self.errors["lists"]
                return AiohttpClientMockResponse(method, url, status=status, json=body)
            if method == "POST":
                list_id = self.add_list(data["title"])
                return AiohttpClientMockResponse(method, url, json={"id": list_id, "title": data["title"]})
            items = [{"id": i, "title": tl["title"]} for i, tl in self.lists.items()]
            return AiohttpClientMockResponse(method, url, json={"items": items})
        if one := re.fullmatch(r"/users/@me/lists/([^/]+)", path):
            if method == "DELETE":
                self.lists.pop(one.group(1), None)
                return AiohttpClientMockResponse(method, url, status=HTTPStatus.NO_CONTENT)
            self.lists[one.group(1)]["title"] = data["title"]
            return AiohttpClientMockResponse(method, url, json={"id": one.group(1)})
        match = re.fullmatch(r"/lists/([^/]+)/tasks(?:/([^/]+))?", path)
        assert match, url
        list_id, task_id = match.groups()
        if list_id in self.errors:
            status, body = self.errors[list_id]
            return AiohttpClientMockResponse(method, url, status=status, json=body)
        if list_id not in self.lists:
            return AiohttpClientMockResponse(method, url, status=HTTPStatus.NOT_FOUND, json=_error(404, "notFound"))
        items: list[dict[str, Any]] = self.lists[list_id]["items"]
        if method == "GET":
            found = [i for i in items if url.query.get("showCompleted") == "true" or i["status"] != "completed"]
            if since := url.query.get("completedMin"):
                found = [i for i in found if i["status"] != "completed" or i["completed"] >= since.replace("Z", "")]
            return AiohttpClientMockResponse(method, url, json={"items": found})
        if method == "POST":
            item = self.add(list_id, data["title"], data.get("notes", ""))
            if "due" in data:
                item["due"] = data["due"]
            return AiohttpClientMockResponse(method, url, json=item)
        item = next((i for i in items if i["id"] == task_id), None)
        if item is None:
            return AiohttpClientMockResponse(method, url, status=HTTPStatus.NOT_FOUND, json=_error(404, "notFound"))
        if method == "DELETE":
            items.remove(item)
            return AiohttpClientMockResponse(method, url, status=HTTPStatus.NO_CONTENT)
        item.update({k: v for k, v in data.items() if k != "completed"})
        if data.get("status") == "completed" and "completed" not in item:
            item["completed"] = self.now
        if data.get("status") == "needsAction":
            item.pop("completed", None)
        return AiohttpClientMockResponse(method, url, json=item)
