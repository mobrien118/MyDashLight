"""A small Google Calendar API client: the calendar list and events in a time window.

No Home Assistant imports. Access tokens come from a ``TokenSource``, which is Home
Assistant's OAuth session at runtime and a fixed token during setup.
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass
from datetime import date, datetime
import logging
from typing import Any, Final, Protocol
from urllib.parse import quote

from aiohttp import ClientError, ClientSession, ClientTimeout

_LOGGER = logging.getLogger(__name__)

API_BASE: Final = "https://www.googleapis.com/calendar/v3"
_TIMEOUT: Final = ClientTimeout(total=30)
_PAGE_SIZE: Final = 250
_MAX_PAGES: Final = 40

_CALENDAR_FIELDS: Final = "nextPageToken,items(id,summary,summaryOverride,primary,accessRole)"
_EVENT_FIELDS: Final = (
    "nextPageToken,items(id,etag,status,eventType,summary,location,description,start,end,"
    "transparency,recurringEventId,attendees(self,responseStatus))"
)
# Event types that never mean a kid's activity or a parent being busy.
_IGNORED_EVENT_TYPES: Final = frozenset({"workingLocation", "birthday"})
_DISABLED_REASONS: Final = frozenset({"accessNotConfigured", "SERVICE_DISABLED"})
_RATE_REASONS: Final = frozenset({"rateLimitExceeded", "userRateLimitExceeded", "quotaExceeded", "RATE_LIMIT_EXCEEDED"})


class GoogleError(Exception):
    """Talking to Google Calendar failed. Usually worth trying again later."""


class GoogleAuthError(GoogleError):
    """Google turned down the sign-in. Someone has to sign in again."""


class GoogleApiDisabled(GoogleError):
    """The Google Calendar API is turned off in the Google Cloud project."""


class GoogleCalendarUnavailable(GoogleError):
    """The calendar is gone, or the signed-in account can no longer read it."""


class TokenSource(Protocol):
    async def async_get_access_token(self) -> str:
        """Return a valid access token, refreshing it first if needed."""


@dataclass(frozen=True, slots=True)
class StaticToken:
    """An access token that is already known to be valid, used during setup."""

    access_token: str

    async def async_get_access_token(self) -> str:
        return self.access_token


@dataclass(frozen=True, slots=True)
class CalendarInfo:
    id: str
    name: str
    access_role: str
    primary: bool = False

    @property
    def writable(self) -> bool:
        return self.access_role in ("owner", "writer")


@dataclass(frozen=True, slots=True)
class CalendarEvent:
    """One event (or one occurrence of a repeating event) as Google returned it."""

    calendar_id: str
    id: str
    etag: str
    title: str
    location: str
    description: str
    start: datetime | date
    """A timezone-aware datetime, or a date for an all-day event."""
    end: datetime | date
    busy: bool
    """False when the event is marked Free (transparent)."""
    declined: bool = False
    """The signed-in person declined it."""
    recurring_id: str | None = None

    @property
    def all_day(self) -> bool:
        return not isinstance(self.start, datetime)


class GoogleCalendarApi:
    """Reads calendars and events with the signed-in Google account."""

    def __init__(self, websession: ClientSession, tokens: TokenSource) -> None:
        self._session = websession
        self._tokens = tokens

    async def async_list_calendars(self) -> list[CalendarInfo]:
        """Every calendar in the account's list that it can read events on."""
        items = await self._pages("/users/me/calendarList", {"minAccessRole": "reader", "fields": _CALENDAR_FIELDS})
        return [cal for item in items if (cal := parse_calendar(item)) is not None]

    async def async_list_events(self, calendar_id: str, start: datetime, end: datetime) -> list[CalendarEvent]:
        """The events that overlap ``start`` to ``end``, with repeating events expanded."""
        items = await self._pages(
            f"/calendars/{quote(calendar_id, safe='')}/events",
            {
                "timeMin": start.isoformat(),
                "timeMax": end.isoformat(),
                "singleEvents": "true",
                "orderBy": "startTime",
                "showDeleted": "false",
                "fields": _EVENT_FIELDS,
            },
        )
        return [event for item in items if (event := parse_event(item, calendar_id)) is not None]

    async def _pages(self, path: str, params: dict[str, str]) -> list[dict[str, Any]]:
        items: list[dict[str, Any]] = []
        token: str | None = None
        for _ in range(_MAX_PAGES):
            query = {**params, "maxResults": str(_PAGE_SIZE)}
            if token:
                query["pageToken"] = token
            body = await self._get(path, query)
            items.extend(i for i in body.get("items", []) if isinstance(i, dict))
            token = body.get("nextPageToken")
            if not token:
                return items
        _LOGGER.warning("Stopped reading %s after %d pages", path, _MAX_PAGES)
        return items

    async def _get(self, path: str, params: Mapping[str, str]) -> dict[str, Any]:
        access_token = await self._tokens.async_get_access_token()
        try:
            async with self._session.get(
                API_BASE + path,
                params=dict(params),
                headers={"Authorization": f"Bearer {access_token}"},
                timeout=_TIMEOUT,
            ) as resp:
                if resp.status < 400:
                    body = await resp.json(content_type=None)
                    return body if isinstance(body, dict) else {}
                try:
                    error = await resp.json(content_type=None)
                except (ValueError, ClientError):
                    error = None
                raise _error_for(resp.status, error, path)
        except (ClientError, TimeoutError) as err:
            raise GoogleError(f"Couldn't reach Google Calendar: {err}") from err


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
    if status in (403, 429) and reasons & _DISABLED_REASONS:
        return GoogleApiDisabled(message)
    if status in (403, 429) and (status == 429 or reasons & _RATE_REASONS):
        return GoogleError(f"Google Calendar is limiting requests: {message}")
    if status in (403, 404, 410):
        return GoogleCalendarUnavailable(f"{path}: {message}")
    return GoogleError(f"Google Calendar error {status}: {message}")


def parse_calendar(item: Mapping[str, Any]) -> CalendarInfo | None:
    cal_id = item.get("id")
    if not isinstance(cal_id, str) or not cal_id:
        return None
    name = item.get("summaryOverride") or item.get("summary") or cal_id
    return CalendarInfo(
        id=cal_id,
        name=" ".join(str(name).split()),
        access_role=str(item.get("accessRole") or ""),
        primary=bool(item.get("primary")),
    )


def parse_event(item: Mapping[str, Any], calendar_id: str) -> CalendarEvent | None:
    """Turn an event from the API into a ``CalendarEvent``, or None to skip it."""
    if item.get("status") == "cancelled" or item.get("eventType") in _IGNORED_EVENT_TYPES:
        return None
    event_id = item.get("id")
    start = _when(item.get("start"))
    end = _when(item.get("end"))
    if not isinstance(event_id, str) or start is None or end is None:
        return None
    if isinstance(start, datetime) != isinstance(end, datetime):
        return None
    attendees = item.get("attendees") or []
    declined = any(isinstance(a, dict) and a.get("self") and a.get("responseStatus") == "declined" for a in attendees)
    return CalendarEvent(
        calendar_id=calendar_id,
        id=event_id,
        etag=str(item.get("etag") or ""),
        title=" ".join(str(item.get("summary") or "").split()),
        location=" ".join(str(item.get("location") or "").split()),
        description=str(item.get("description") or ""),
        start=start,
        end=end,
        busy=item.get("transparency") != "transparent",
        declined=declined,
        recurring_id=item.get("recurringEventId") if isinstance(item.get("recurringEventId"), str) else None,
    )


def _when(value: object) -> datetime | date | None:
    if not isinstance(value, dict):
        return None
    try:
        if isinstance(value.get("dateTime"), str):
            moment = datetime.fromisoformat(value["dateTime"])
            return moment if moment.tzinfo is not None else None
        if isinstance(value.get("date"), str):
            return date.fromisoformat(value["date"])
    except ValueError:
        return None
    return None
