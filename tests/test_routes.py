"""The Google Routes client and the drive time cache."""

from __future__ import annotations

from datetime import date, datetime
import time
from zoneinfo import ZoneInfo

from aiohttp import ClientError
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
import pytest
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from custom_components.mydashlight.routes import (
    MISSING,
    ROUTES_URL,
    Place,
    Route,
    RoutesApi,
    RoutesError,
    RoutesKeyError,
    RoutesNoRoute,
    RoutesQuotaError,
    TravelCache,
    next_departure,
)

TZ = ZoneInfo("America/Chicago")
HOME = Place(lat=41.5, lon=-90.5)
SCHOOL = Place(address="Lincoln Elementary, 100 Main St")
DEPART = datetime(2026, 11, 4, 7, tzinfo=TZ)


def api(hass: HomeAssistant) -> RoutesApi:
    return RoutesApi(async_get_clientsession(hass), "key-1")


async def test_drive_minutes(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    aioclient_mock.post(ROUTES_URL, json={"routes": [{"duration": "754s"}]})

    assert await api(hass).async_drive_minutes(HOME, SCHOOL, DEPART) == 12.6

    _method, _url, body, headers = aioclient_mock.mock_calls[0]
    assert headers == {
        "X-Goog-Api-Key": "key-1",
        "X-Goog-FieldMask": "routes.duration,routes.legs.startLocation,routes.legs.endLocation",
    }
    assert body == {
        "origin": {"location": {"latLng": {"latitude": 41.5, "longitude": -90.5}}},
        "destination": {"address": "Lincoln Elementary, 100 Main St"},
        "travelMode": "DRIVE",
        "routingPreference": "TRAFFIC_AWARE",
        "departureTime": "2026-11-04T13:00:00Z",
    }


async def test_route_says_where_each_end_is(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    def point(lat: object, lon: object) -> dict[str, object]:
        return {"latLng": {"latitude": lat, "longitude": lon}}

    legs = [{"startLocation": point(41.5, -90.5), "endLocation": point(41.6, -90.4)}]
    aioclient_mock.post(ROUTES_URL, json={"routes": [{"duration": "600s", "legs": legs}]})
    assert await api(hass).async_route(HOME, SCHOOL, None) == Route(10.0, (41.5, -90.5), (41.6, -90.4))
    # With no departure time, Google uses today's traffic right now.
    assert "departureTime" not in aioclient_mock.mock_calls[0][2]

    aioclient_mock.clear_requests()
    junk = [{"startLocation": point("x", 1), "endLocation": point(91, 0)}]
    aioclient_mock.post(ROUTES_URL, json={"routes": [{"duration": "600s", "legs": junk}]})
    assert await api(hass).async_route(HOME, SCHOOL, DEPART) == Route(10.0)


@pytest.mark.parametrize("reply", [{}, {"routes": []}, {"routes": [{"duration": "soon"}]}])
async def test_no_route(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker, reply: dict[str, object]) -> None:
    aioclient_mock.post(ROUTES_URL, json=reply)
    assert await api(hass).async_drive_minutes(HOME, SCHOOL, DEPART) is None


@pytest.mark.parametrize(
    ("status", "body", "error"),
    [
        (403, {"error": {"code": 403, "message": "Denied"}}, RoutesKeyError),
        (400, {"error": {"message": "Bad key", "details": [{"reason": "API_KEY_INVALID"}]}}, RoutesKeyError),
        (429, {"error": {"code": 429, "message": "Quota"}}, RoutesQuotaError),
        (400, {"error": {"code": 400, "message": "Unknown address"}}, RoutesNoRoute),
        (503, {}, RoutesError),
    ],
)
async def test_errors(
    hass: HomeAssistant, aioclient_mock: AiohttpClientMocker, status: int, body: dict[str, object], error: type
) -> None:
    aioclient_mock.post(ROUTES_URL, status=status, json=body)
    with pytest.raises(error) as caught:
        await api(hass).async_drive_minutes(HOME, SCHOOL, DEPART)
    assert type(caught.value) is error


async def test_error_that_is_not_json(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    aioclient_mock.post(ROUTES_URL, status=502, text="<html>")
    with pytest.raises(RoutesError, match="error 502"):
        await api(hass).async_drive_minutes(HOME, SCHOOL, DEPART)


async def test_connection_error(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    aioclient_mock.post(ROUTES_URL, exc=ClientError("down"))
    with pytest.raises(RoutesError, match="Couldn't reach"):
        await api(hass).async_drive_minutes(HOME, SCHOOL, DEPART)


def test_cache_keeps_times_for_a_month_and_misses_for_a_day() -> None:
    cache = TravelCache()
    now = time.time()
    key = TravelCache.key("home", "school", 2, 7)
    assert key == "home|school|2|7"
    assert cache.get(key, now) is MISSING

    cache.put(key, 12.5, now)
    cache.put("x", None, now)
    assert cache.get(key, now + 29 * 86400) == 12.5
    assert cache.get(key, now + 31 * 86400) is MISSING
    assert cache.get("x", now + 3600) is None
    assert cache.get("x", now + 2 * 86400) is MISSING

    cache.prune(now + 2 * 86400)
    assert list(cache.entries) == [key]


def test_cache_counts_calls_per_day() -> None:
    cache = TravelCache()
    today, tomorrow = date(2026, 11, 3), date(2026, 11, 4)
    assert cache.calls_left(today, 3) == 3
    cache.count_call(today)
    cache.count_call(today)
    assert cache.calls_left(today, 3) == 1
    assert cache.calls_left(tomorrow, 3) == 3


def test_cache_keeps_places_for_three_months() -> None:
    cache = TravelCache()
    now = time.time()
    assert cache.spot("school", now) is None
    cache.put_spot("school", (41.6, -90.4), now)
    cache.put_spot("park", None, now)
    assert cache.spot("school", now + 89 * 86400) == (41.6, -90.4)
    assert cache.spot("school", now + 91 * 86400) is None
    assert cache.spot("park", now) is None
    cache.prune(now + 91 * 86400)
    assert cache.spots == {}


def test_cache_round_trip_and_junk() -> None:
    cache = TravelCache()
    cache.put("a", 10.0, 100.0)
    cache.put("b", None, 200.0)
    cache.put_spot("school", (41.6, -90.4), 300.0)
    cache.count_call(date(2026, 11, 3))
    again = TravelCache.from_dict(cache.as_dict())
    assert again == cache

    junk = TravelCache.from_dict(
        {"entries": {"a": [1], "b": ["x", 5], "c": "no"}, "calls": "many", "spots": {"s": [1, 2], "t": [1, "x", 3]}}
    )
    assert list(junk.entries) == ["b"]
    assert junk.entries["b"].minutes is None
    assert junk.calls == 0
    assert junk.spots == {}
    assert TravelCache.from_dict(None) == TravelCache()


def test_next_departure() -> None:
    now = datetime(2026, 11, 3, 9, 30, tzinfo=TZ)
    assert next_departure(date(2026, 11, 3), 15, now) == datetime(2026, 11, 3, 15, tzinfo=TZ)
    # 7 AM today is past, so the same hour next week has the same traffic.
    assert next_departure(date(2026, 11, 3), 7, now) == datetime(2026, 11, 10, 7, tzinfo=TZ)
