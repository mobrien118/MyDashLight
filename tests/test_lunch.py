"""Lunches end to end: reading picks and days off from the kids' calendars, saving picks
through the service, the live feed, the default setting, and Pack-lunch chores following
the picks."""

from __future__ import annotations

from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.exceptions import ServiceValidationError
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.mydashlight.const import DOMAIN

from .common import AVA, BEN, OPTIONS, FakeGoogle, FakeTasks, all_day, make_entry, setup_credentials
from .test_menu_feed import FEED

FEED_URL = "https://school.example/calendar/menus.ics"

NOW = "2026-11-04T15:00:00+00:00"  # 9 AM in Central time, a Wednesday
SCHOOL = "Chore templates: School days"


@pytest.fixture(autouse=True)
async def setup(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    await hass.config.async_set_time_zone("America/Chicago")
    freezer.move_to(NOW)
    await setup_credentials(hass)


@pytest.fixture
def google(aioclient_mock: AiohttpClientMocker) -> FakeGoogle:
    return FakeGoogle(aioclient_mock)


@pytest.fixture
def tasks(google: FakeGoogle) -> FakeTasks:
    return google.tasks


async def load(hass: HomeAssistant, options: dict[str, Any] | None = None) -> MockConfigEntry:
    entry = make_entry(options)
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def call(hass: HomeAssistant, service: str, **data: Any) -> Any:
    response = service in ("get_lunches", "get_chores")
    return await hass.services.async_call(DOMAIN, service, data, blocking=True, return_response=response)


def titles(google: FakeGoogle, cal: str) -> list[tuple[str, str]]:
    return sorted((e["start"]["date"], e["summary"]) for e in google.events.get(cal, []) if "date" in e["start"])


async def test_reads_picks_and_days_off(hass: HomeAssistant, google: FakeGoogle) -> None:
    google.add(AVA, **all_day("off", "No School – Thanksgiving Break", "2026-11-25", "2026-11-28"))
    google.add(AVA, **all_day("b1", "Bring Lunch", "2026-11-05", "2026-11-06"))
    google.add(BEN, **all_day("b2", "Buy Lunch", "2026-11-06", "2026-11-07"))
    await load(hass)
    lunches = await call(hass, "get_lunches")
    assert lunches["first"] == "2026-11-01"
    assert lunches["last"] == "2026-12-31"
    assert lunches["status"] == {"ok": True, "error": None}
    ava, ben = lunches["kids"]
    assert ava["name"] == "Ava"
    assert ava["default"] == "buy"
    assert ava["picks"] == {"2026-11-05": "bring"}
    assert ava["days_off"] == [{"first": "2026-11-25", "last": "2026-11-27", "title": "No School – Thanksgiving Break"}]
    assert ben["picks"] == {"2026-11-06": "buy"}


async def test_set_lunch(hass: HomeAssistant, google: FakeGoogle) -> None:
    google.add(AVA, **all_day("off", "No School", "2026-11-25", "2026-11-28"))
    google.add(AVA, **all_day("b1", "Buy Lunch", "2026-11-06", "2026-11-07"))
    await load(hass)

    await call(hass, "set_lunch", kid="Ava", dates=["2026-11-05", "2026-11-06", "2026-11-25"], lunch="bring")
    assert titles(google, AVA) == [
        ("2026-11-05", "Bring Lunch"),
        ("2026-11-06", "Bring Lunch"),
        ("2026-11-25", "No School"),
    ]
    (_cal, made), *_ = google.inserted
    assert made["transparency"] == "transparent"
    assert made["end"] == {"date": "2026-11-06"}
    assert made["reminders"] == {"useDefault": False}
    lunches = await call(hass, "get_lunches")
    assert lunches["kids"][0]["picks"] == {"2026-11-05": "bring", "2026-11-06": "bring"}

    await call(hass, "set_lunch", kid=AVA, dates=["2026-11-06"], lunch="default")
    assert titles(google, AVA) == [("2026-11-05", "Bring Lunch"), ("2026-11-25", "No School")]
    assert google.deleted == [(AVA, "b1")]

    with pytest.raises(ServiceValidationError):
        await call(hass, "set_lunch", kid="Zed", dates=["2026-11-06"], lunch="buy")


async def test_menus(hass: HomeAssistant, google: FakeGoogle) -> None:
    google.add(AVA, **all_day("m1", "Lunch: Pizza", "2026-11-05", "2026-11-06", description="Or: salad bar"))
    google.add(BEN, **all_day("m2", "Lunch", "2026-11-05", "2026-11-06", description="Fish sticks\nCorn"))
    await load(hass)
    ava, ben = (await call(hass, "get_lunches"))["kids"]
    assert ava["menus"] == {"2026-11-05": {"dish": "Pizza", "details": "Or: salad bar"}}
    assert ben["menus"] == {"2026-11-05": {"dish": "Fish sticks", "details": "Corn"}}
    # A menu event isn't a ride or a pick.
    assert ava["picks"] == {}

    await call(hass, "set_lunch_menu", kids=["Ava", "Ben"], date="2026-11-05", menu="Burgers", details="Or: salad")
    assert titles(google, AVA) == [("2026-11-05", "Lunch: Burgers")]
    assert titles(google, BEN) == [("2026-11-05", "Lunch: Burgers")]
    await call(hass, "set_lunch_menu", kids=["Ben"], date="2026-11-09", menu="Tacos")
    (cal, made) = google.inserted[-1]
    assert cal == BEN
    assert made["summary"] == "Lunch: Tacos"
    assert made["transparency"] == "transparent"
    ava, ben = (await call(hass, "get_lunches"))["kids"]
    assert ava["menus"] == {"2026-11-05": {"dish": "Burgers", "details": "Or: salad"}}
    assert ben["menus"]["2026-11-09"] == {"dish": "Tacos", "details": ""}

    await call(hass, "set_lunch_menu", kids=["Ava"], date="2026-11-05", menu="")
    assert titles(google, AVA) == []
    with pytest.raises(ServiceValidationError):
        await call(hass, "set_lunch_menu", kids=["Zed"], date="2026-11-05", menu="Pizza")


async def test_live_feed(hass: HomeAssistant, google: FakeGoogle, hass_ws_client: WebSocketGenerator) -> None:
    await load(hass)
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "mydashlight/lunch/subscribe"})
    assert (await client.receive_json())["success"]
    first = (await client.receive_json())["event"]["lunch"]
    assert first["kids"][0]["picks"] == {}
    await call(hass, "set_lunch", kid="Ben", dates=["2026-11-09"], lunch="bring")
    changed = (await client.receive_json())["event"]["lunch"]
    assert changed["kids"][1]["picks"] == {"2026-11-09": "bring"}


async def test_default_setting(hass: HomeAssistant, google: FakeGoogle) -> None:
    entry = await load(hass)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "lunch"})
    assert result["step_id"] == "lunch"
    assert result["data_schema"]({}) == {"bring_by_default": []}
    # A menu feed box for each kid, on the same form, which can be left empty.
    assert [str(k) for k in result["data_schema"].schema] == ["bring_by_default", "Ava's menu feed", "Ben's menu feed"]
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"bring_by_default": [BEN]})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert entry.options["lunch_defaults"] == {AVA: "buy", BEN: "bring"}
    assert entry.options["lunch_feeds"] == {}
    await hass.async_block_till_done()
    lunches = await call(hass, "get_lunches")
    assert [k["default"] for k in lunches["kids"]] == ["buy", "bring"]


async def test_menu_feed(hass: HomeAssistant, google: FakeGoogle, aioclient_mock: AiohttpClientMocker) -> None:
    aioclient_mock.get(FEED_URL, text=FEED)
    aioclient_mock.get("https://school.example/missing.ics", status=404)
    # Typed by hand before: the feed leaves it alone.
    google.add(BEN, **all_day("hand", "Lunch: Pizza party", "2026-11-06", "2026-11-07"))
    entry = await load(hass)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "lunch"})
    ava, ben = "Ava's menu feed", "Ben's menu feed"
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"bring_by_default": [], ava: "not a link", ben: "https://school.example/missing.ics"}
    )
    assert result["step_id"] == "lunch"
    assert result["errors"] == {ava: "feed_not_web", ben: "feed_unreadable"}
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"bring_by_default": [], ava: "webcal://school.example/calendar/menus.ics", ben: FEED_URL}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert entry.options["lunch_feeds"] == {AVA: FEED_URL, BEN: FEED_URL}
    # Saving reloads MyDashLight, which reads the feeds after its first read of the calendars.
    await hass.async_block_till_done(wait_background_tasks=True)

    # Today is Wednesday Nov 4: the feed's lunches from Nov 5 on are on both calendars.
    assert titles(google, AVA) == [
        ("2026-11-05", "Lunch: Wild Mike's Cheese Pocket w/ Marinara Sauce"),
        ("2026-11-06", "Lunch: Nachos Supreme w/ Queso"),
        ("2026-11-09", "Lunch: Create Your Own Pizza"),
    ]
    assert ("2026-11-06", "Lunch: Pizza party") in titles(google, BEN)
    assert ("2026-11-06", "Lunch: Nachos Supreme w/ Queso") not in titles(google, BEN)
    made = next(e for e in google.events[AVA] if e["start"]["date"] == "2026-11-09")
    assert made["extendedProperties"] == {"private": {"mydashlight_menu": "feed"}}
    assert made["description"].startswith("Parmesan Roasted Broccoli")
    ava, _ben = (await call(hass, "get_lunches"))["kids"]
    assert ava["menus"]["2026-11-09"]["dish"] == "Create Your Own Pizza"
    assert ava["menu_feed"] == {"ok": True, "error": None}

    # Reading it again changes nothing.
    count = len(google.inserted)
    await entry.runtime_data.lunch.async_sync_feeds()
    assert len(google.inserted) == count

    # Changed on the Lunch tab, it stops following the feed.
    await call(hass, "set_lunch_menu", kids=["Ava"], date="2026-11-09", menu="Pizza")
    changed = next(e for e in google.events[AVA] if e["start"]["date"] == "2026-11-09")
    assert changed["summary"] == "Lunch: Pizza"
    assert changed["extendedProperties"] == {"private": {"mydashlight_menu": ""}}
    await entry.runtime_data.lunch.async_sync_feeds()
    assert ("2026-11-09", "Lunch: Pizza") in titles(google, AVA)


async def test_pack_lunch_follows_the_picks(hass: HomeAssistant, google: FakeGoogle, tasks: FakeTasks) -> None:
    school = tasks.add_list(SCHOOL)
    tasks.add(
        school,
        "Pack lunch",
        "--- Chore ---\nId: pack\nWho: Ava, Ben\nWhen: Night before\nOnly: Bring lunch days\nStarts: 2026-11-01",
    )
    tasks.add(school, "Fill up water", "--- Chore ---\nId: water\nWho: Ava\nStarts: 2026-11-01")
    google.add(AVA, **all_day("off", "No School", "2026-11-09", "2026-11-10"))
    google.add(AVA, **all_day("b1", "Bring Lunch", "2026-11-05", "2026-11-06"))
    await load(hass, {**OPTIONS, "lunch_defaults": {BEN: "bring"}})

    def made(kid: str, title: str) -> list[str]:
        return sorted(t["due"][:10] for t in tasks.items(f"Chores: {kid}") if t["title"] == title)

    # Ava buys by default, so she packs only the night before Thursday the 5th. Ben brings
    # every school day: each school night, Sunday for Monday.
    assert made("Ava", "Pack lunch") == ["2026-11-04"]
    assert made("Ben", "Pack lunch") == ["2026-11-04", "2026-11-05", "2026-11-08", "2026-11-09", "2026-11-10"]
    # Water every school day for Ava, but not Monday the 9th: no school.
    assert made("Ava", "Fill up water") == ["2026-11-04", "2026-11-05", "2026-11-06", "2026-11-10"]

    await call(hass, "set_lunch", kid="Ava", dates=["2026-11-05"], lunch="buy")
    await call(hass, "set_lunch", kid="Ava", dates=["2026-11-06"], lunch="bring")
    await hass.async_block_till_done()
    await hass.config_entries.async_entries(DOMAIN)[0].runtime_data.chores.async_refresh()
    assert made("Ava", "Pack lunch") == ["2026-11-05"]
    chores = await call(hass, "get_chores")
    pack = next(c for c in chores["chores"] if c["title"] == "Pack lunch" and c["kid"] == AVA)
    assert pack["for_day"] == "2026-11-06"
