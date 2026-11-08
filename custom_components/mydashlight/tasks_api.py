"""A small Google Tasks API client: task lists, and the tasks on them.

No Home Assistant imports. Access tokens come from the same ``TokenSource`` as the Calendar
client, so one Google sign-in covers both.
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass
from datetime import UTC, date, datetime
import logging
from typing import Any, Final
from urllib.parse import quote

from aiohttp import ClientError, ClientSession, ClientTimeout

from .google import GoogleApiDisabled, GoogleAuthError, GoogleError, TokenSource

_LOGGER = logging.getLogger(__name__)

API_BASE: Final = "https://tasks.googleapis.com/tasks/v1"
_TIMEOUT: Final = ClientTimeout(total=30)
_PAGE_SIZE: Final = 100
_MAX_PAGES: Final = 20
_TASK_FIELDS: Final = "id,title,notes,status,due,completed,position,deleted"
_DISABLED_REASONS: Final = frozenset({"accessNotConfigured", "SERVICE_DISABLED"})
_SCOPE_REASONS: Final = frozenset({"insufficientPermissions", "ACCESS_TOKEN_SCOPE_INSUFFICIENT"})
_RATE_REASONS: Final = frozenset({"rateLimitExceeded", "userRateLimitExceeded", "quotaExceeded", "RATE_LIMIT_EXCEEDED"})


class TasksNeedSignIn(GoogleError):
    """The Google sign-in doesn't include Google Tasks. Someone has to sign in again."""


class TasksNotFound(GoogleError):
    """The task or list is gone."""


@dataclass(frozen=True, slots=True)
class TaskList:
    id: str
    title: str


@dataclass(frozen=True, slots=True)
class TaskRecord:
    """One task as Google returned it."""

    id: str
    title: str
    notes: str
    due: date | None
    completed: datetime | None
    """When it was checked off, or None while it's open."""
    position: str = ""


class GoogleTasksApi:
    """Reads and changes task lists and tasks with the signed-in Google account."""

    def __init__(self, websession: ClientSession, tokens: TokenSource) -> None:
        self._session = websession
        self._tokens = tokens

    async def async_lists(self) -> list[TaskList]:
        items = await self._pages("/users/@me/lists", {"fields": "nextPageToken,items(id,title)"})
        return [
            TaskList(str(i["id"]), " ".join(str(i.get("title") or "").split()))
            for i in items
            if isinstance(i.get("id"), str)
        ]

    async def async_create_list(self, title: str) -> TaskList:
        body = await self._request("POST", "/users/@me/lists", {"fields": "id,title"}, json={"title": title})
        return TaskList(str(body.get("id") or ""), str(body.get("title") or title))

    async def async_rename_list(self, list_id: str, title: str) -> None:
        await self._request(
            "PATCH", f"/users/@me/lists/{quote(list_id, safe='')}", {"fields": "id"}, json={"title": title}
        )

    async def async_delete_list(self, list_id: str) -> None:
        try:
            await self._request("DELETE", f"/users/@me/lists/{quote(list_id, safe='')}", {})
        except TasksNotFound:
            return

    async def async_tasks(
        self, list_id: str, *, completed: bool = True, completed_min: datetime | None = None
    ) -> list[TaskRecord]:
        """The tasks on a list. With ``completed``, done ones too (including those cleared
        from view in the Google Tasks app), only those done since ``completed_min`` if given."""
        params = {
            "fields": f"nextPageToken,items({_TASK_FIELDS})",
            "showCompleted": "true" if completed else "false",
            "showHidden": "true" if completed else "false",
        }
        if completed and completed_min is not None:
            params["completedMin"] = _rfc3339(completed_min)
        items = await self._pages(_tasks_path(list_id), params)
        return [t for i in items if (t := parse_task(i)) is not None]

    async def async_insert(self, list_id: str, title: str, notes: str, due: date | None = None) -> TaskRecord:
        payload: dict[str, Any] = {"title": title, "notes": notes}
        if due is not None:
            payload["due"] = _due(due)
        body = await self._request("POST", _tasks_path(list_id), {"fields": _TASK_FIELDS}, json=payload)
        task = parse_task(body)
        if task is None:
            raise GoogleError("Google Tasks didn't return the new task")
        return task

    async def async_update(
        self,
        list_id: str,
        task_id: str,
        *,
        title: str | None = None,
        notes: str | None = None,
        done: bool | None = None,
    ) -> TaskRecord | None:
        """Change a task. ``done`` checks it off (Google records when) or opens it again."""
        payload: dict[str, Any] = {}
        if title is not None:
            payload["title"] = title
        if notes is not None:
            payload["notes"] = notes
        if done is True:
            payload["status"] = "completed"
        elif done is False:
            payload["status"] = "needsAction"
            payload["completed"] = None
        body = await self._request(
            "PATCH", f"{_tasks_path(list_id)}/{quote(task_id, safe='')}", {"fields": _TASK_FIELDS}, json=payload
        )
        return parse_task(body)

    async def async_delete(self, list_id: str, task_id: str) -> None:
        try:
            await self._request("DELETE", f"{_tasks_path(list_id)}/{quote(task_id, safe='')}", {})
        except TasksNotFound:
            return

    async def _pages(self, path: str, params: dict[str, str]) -> list[dict[str, Any]]:
        items: list[dict[str, Any]] = []
        token: str | None = None
        for _ in range(_MAX_PAGES):
            query = {**params, "maxResults": str(_PAGE_SIZE)}
            if token:
                query["pageToken"] = token
            body = await self._request("GET", path, query)
            items.extend(i for i in body.get("items", []) if isinstance(i, dict))
            token = body.get("nextPageToken")
            if not token:
                return items
        _LOGGER.warning("Stopped reading %s after %d pages", path, _MAX_PAGES)
        return items

    async def _request(
        self, method: str, path: str, params: Mapping[str, str], json: Mapping[str, Any] | None = None
    ) -> dict[str, Any]:
        access_token = await self._tokens.async_get_access_token()
        try:
            async with self._session.request(
                method,
                API_BASE + path,
                params=dict(params),
                json=dict(json) if json is not None else None,
                headers={"Authorization": f"Bearer {access_token}"},
                timeout=_TIMEOUT,
            ) as resp:
                if resp.status < 400:
                    if resp.status == 204:
                        return {}
                    body = await resp.json(content_type=None)
                    return body if isinstance(body, dict) else {}
                try:
                    error = await resp.json(content_type=None)
                except (ValueError, ClientError):
                    error = None
                raise _error_for(resp.status, error, path)
        except (ClientError, TimeoutError) as err:
            raise GoogleError(f"Couldn't reach Google Tasks: {err}") from err


def _error_for(status: int, body: object, path: str) -> GoogleError:
    error = body.get("error") if isinstance(body, dict) else None
    error = error if isinstance(error, dict) else {}
    message = str(error.get("message") or f"HTTP {status}")
    reasons = {
        str(item.get("reason"))
        for key in ("errors", "details")
        for item in error.get(key) or []
        if isinstance(item, dict) and item.get("reason")
    }
    if status == 401:
        return GoogleAuthError(message)
    if status == 403 and (reasons & _SCOPE_REASONS or "insufficient authentication scopes" in message.casefold()):
        return TasksNeedSignIn(message)
    if status in (403, 429) and reasons & _DISABLED_REASONS:
        return GoogleApiDisabled(message)
    if status in (403, 429) and (status == 429 or reasons & _RATE_REASONS):
        return GoogleError(f"Google Tasks is limiting requests: {message}")
    if status in (404, 410):
        return TasksNotFound(f"{path}: {message}")
    return GoogleError(f"Google Tasks error {status}: {message}")


def _tasks_path(list_id: str) -> str:
    return f"/lists/{quote(list_id, safe='')}/tasks"


def _due(day: date) -> str:
    # Google keeps only the date of a task's due time.
    return f"{day.isoformat()}T00:00:00.000Z"


def _rfc3339(moment: datetime) -> str:
    return moment.isoformat().replace("+00:00", "Z")


def parse_task(item: Mapping[str, Any]) -> TaskRecord | None:
    task_id = item.get("id")
    if not isinstance(task_id, str) or not task_id or item.get("deleted"):
        return None
    due = None
    if isinstance(item.get("due"), str):
        try:
            due = date.fromisoformat(item["due"][:10])
        except ValueError:
            due = None
    completed = None
    if item.get("status") == "completed":
        # Google always sends when; the fallback only keeps a done task from reading as open.
        completed = _moment(item.get("completed")) or datetime.fromtimestamp(0, UTC)
    return TaskRecord(
        id=task_id,
        title=" ".join(str(item.get("title") or "").split()),
        notes=str(item.get("notes") or ""),
        due=due,
        completed=completed,
        position=str(item.get("position") or ""),
    )


def _moment(value: object) -> datetime | None:
    if not isinstance(value, str):
        return None
    try:
        moment = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    return moment if moment.tzinfo is not None else None
