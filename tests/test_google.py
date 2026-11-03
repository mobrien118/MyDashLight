"""The Google Calendar client: paging, reading events, and telling errors apart."""

from __future__ import annotations

from datetime import date, datetime, timedelta, timezone

from aiohttp import ClientError
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
import pytest
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from custom_components.mydashlight.google import (
    GoogleApiDisabled,
    GoogleAuthError,
    GoogleCalendarApi,
    GoogleCalendarUnavailable,
    GoogleError,
    StaticToken,
    parse_event,
)

from .common import ACCOUNT, AVA, FakeGoogle, all_day, google_error, timed

CENTRAL = timezone(timedelta(hours=-6))
START = datetime(2026, 11, 3, tzinfo=CENTRAL)
END = START + timedelta(days=7)


@pytest.fixture
def google(aioclient_mock: AiohttpClientMocker) -> FakeGoogle:
    return FakeGoogle(aioclient_mock)


def api(hass: HomeAssistant) -> GoogleCalendarApi:
    return GoogleCalendarApi(async_get_clientsession(hass), StaticToken("token-1"))


async def test_list_calendars(hass: HomeAssistant, google: FakeGoogle, aioclient_mock: AiohttpClientMocker) -> None:
    google.calendars.append({"id": "x@group.calendar.google.com", "summary": "Old", "summaryOverride": "  My  name "})
    google.calendars.append({"summary": "no id"})
    google.page_size = 2

    calendars = await api(hass).async_list_calendars()

    assert [c.name for c in calendars][:3] == [ACCOUNT, "Kid-Ava", "Kid-Ben"]
    assert calendars[-1].name == "My name"
    assert calendars[0].primary
    assert calendars[0].writable
    assert not calendars[-1].writable
    assert len(google.calls) == 4  # 7 entries, 2 per page
    _method, url, _data, headers = aioclient_mock.mock_calls[0]
    assert headers["Authorization"] == "Bearer token-1"
    assert url.query["minAccessRole"] == "reader"


async def test_list_events(hass: HomeAssistant, google: FakeGoogle) -> None:
    google.add(AVA, **timed("a", "  Piano\n lesson ", "2026-11-03T16:00:00-06:00", "2026-11-03T17:00:00-06:00"))
    google.add(AVA, **all_day("b", "No school", "2026-11-04", "2026-11-05", transparency="transparent"))
    google.add(AVA, **timed("c", "Gone", "2026-11-03T16:00:00-06:00", "2026-11-03T17:00:00-06:00", status="cancelled"))
    google.add(
        AVA,
        **timed(
            "d",
            "Declined",
            "2026-11-03T16:00:00Z",
            "2026-11-03T17:00:00Z",
            attendees=[{"email": "x", "responseStatus": "accepted"}, {"self": True, "responseStatus": "declined"}],
        ),
    )
    google.add(AVA, **timed("e", "Office", "2026-11-03T08:00:00Z", "2026-11-03T17:00:00Z", eventType="workingLocation"))
    google.add(AVA, id="f", summary="Broken", start={"dateTime": "not a time"}, end={"dateTime": "2026-11-03T17:00Z"})

    events = await api(hass).async_list_events(AVA, START, END)

    assert [e.id for e in events] == ["a", "b", "d"]
    piano, school, declined = events
    assert piano.title == "Piano lesson"
    assert piano.start == datetime(2026, 11, 3, 16, tzinfo=CENTRAL)
    assert piano.busy
    assert not piano.all_day
    assert school.all_day
    assert school.start == date(2026, 11, 4)
    assert not school.busy
    assert declined.declined
    url = google.calls[0]
    assert url.query["singleEvents"] == "true"
    assert url.query["timeMin"] == START.isoformat()


def test_parse_event_needs_a_time_zone() -> None:
    item = timed("a", "Piano", "2026-11-03T16:00:00", "2026-11-03T17:00:00")
    assert parse_event(item, AVA) is None
    mixed = {"id": "b", "start": {"date": "2026-11-03"}, "end": {"dateTime": "2026-11-03T17:00:00Z"}}
    assert parse_event(mixed, AVA) is None


@pytest.mark.parametrize(
    ("reply", "error"),
    [
        (google_error(401, "authError"), GoogleAuthError),
        (google_error(403, "accessNotConfigured"), GoogleApiDisabled),
        (google_error(403, "rateLimitExceeded"), GoogleError),
        (google_error(429, "rateLimitExceeded"), GoogleError),
        (google_error(403, "forbidden"), GoogleCalendarUnavailable),
        (google_error(404, "notFound"), GoogleCalendarUnavailable),
        (google_error(500, "backendError"), GoogleError),
    ],
)
async def test_errors(
    hass: HomeAssistant, google: FakeGoogle, reply: tuple[int, dict[str, object]], error: type
) -> None:
    google.errors[AVA] = reply
    with pytest.raises(error) as caught:
        await api(hass).async_list_events(AVA, START, END)
    assert type(caught.value) is error


async def test_rate_limit_is_not_a_missing_calendar(hass: HomeAssistant, google: FakeGoogle) -> None:
    google.errors[AVA] = google_error(403, "rateLimitExceeded", "Slow down")
    with pytest.raises(GoogleError, match="limiting requests: Slow down"):
        await api(hass).async_list_events(AVA, START, END)


async def test_connection_error(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    aioclient_mock.get("https://www.googleapis.com/calendar/v3/users/me/calendarList", exc=ClientError("down"))
    with pytest.raises(GoogleError, match="Couldn't reach Google Calendar"):
        await api(hass).async_list_calendars()


async def test_error_body_that_is_not_json(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    aioclient_mock.get("https://www.googleapis.com/calendar/v3/users/me/calendarList", status=502, text="<html>")
    with pytest.raises(GoogleError, match="error 502: HTTP 502"):
        await api(hass).async_list_calendars()
