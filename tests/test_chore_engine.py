"""Chores end to end: lists made in Google Tasks, kids' lists filled from templates, check-offs,
template changes through the services, the live feed, and sign-ins from before chores."""

from __future__ import annotations

from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import SOURCE_REAUTH
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.mydashlight.chore_rules import read_block
from custom_components.mydashlight.const import DOMAIN

from .common import FakeGoogle, FakeTasks, google_error, make_entry, setup_credentials

NOW = "2026-11-04T15:00:00+00:00"  # 9 AM in Central time, a Wednesday
WEEKLY = "Chore templates: Weekly"
DAILY = "Chore templates: Daily"


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


async def load(hass: HomeAssistant, entry: MockConfigEntry | None = None) -> MockConfigEntry:
    entry = entry or make_entry()
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def refresh(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    await entry.runtime_data.chores.async_refresh()
    await hass.async_block_till_done()


async def call(hass: HomeAssistant, service: str, **data: Any) -> Any:
    response = service in ("get_chores", "save_chore_template")
    return await hass.services.async_call(DOMAIN, service, data, blocking=True, return_response=response)


def ids(chores: dict[str, Any]) -> list[tuple[str, str, str]]:
    return [(c["kid"].split("-")[0], c["title"], c["due"]) for c in chores["chores"]]


async def test_makes_the_lists(hass: HomeAssistant, tasks: FakeTasks) -> None:
    await load(hass)
    titles = sorted(tl["title"] for tl in tasks.lists.values())
    assert titles == [
        "Chore templates: Daily",
        "Chore templates: Monthly",
        "Chore templates: Weekly",
        "Chores: Ava",
        "Chores: Ben",
    ]


async def test_finds_lists_by_title_and_keeps_them_when_renamed(hass: HomeAssistant, tasks: FakeTasks) -> None:
    weekly = tasks.add_list(WEEKLY)
    entry = await load(hass)
    assert tasks.list_id(WEEKLY) == weekly
    tasks.lists[weekly]["title"] = "Our weekly chores"
    await refresh(hass, entry)
    assert len(tasks.lists) == 5
    assert entry.runtime_data.chores.data.template_lists["weekly"] == weekly


async def test_fills_kids_lists_from_a_hand_typed_template(hass: HomeAssistant, tasks: FakeTasks) -> None:
    weekly = tasks.add_list(WEEKLY)
    template = tasks.add(weekly, "🧹 Vacuum the stairs", "Both flights.\n\n--- Chore ---\nWho: Ava, Ben\nDays: Thu")
    entry = await load(hass)

    # Typed in by hand: MyDashLight gives it an Id and a start day.
    block = read_block(template["notes"])
    assert block.first("id") == template["id"]
    assert block.first("starts") == "2026-11-04"
    ava = tasks.items("Chores: Ava")
    assert [(t["title"], t["due"]) for t in ava] == [("🧹 Vacuum the stairs", "2026-11-05T00:00:00.000Z")]
    assert read_block(ava[0]["notes"]).details == "Both flights."
    assert len(tasks.items("Chores: Ben")) == 1

    chores = await call(hass, "get_chores")
    assert ids(chores) == [
        ("ava", "Vacuum the stairs", "2026-11-05"),
        ("ben", "Vacuum the stairs", "2026-11-05"),
    ]
    first = chores["chores"][0]
    assert (first["icon"], first["state"], first["repeats"]) == ("🧹", "upcoming", "weekly")
    assert chores["status"] == {"ok": True, "error": None, "needs": None}
    assert chores["templates"][0]["who"] == [k["id"] for k in chores["kids"]]

    # Nothing more to do on the next read.
    calls = len(tasks.calls)
    await refresh(hass, entry)
    assert all(method == "GET" for method, _url in tasks.calls[calls:])


async def test_check_off_and_undo(hass: HomeAssistant, tasks: FakeTasks) -> None:
    daily = tasks.add_list(DAILY)
    tasks.add(daily, "Feed the cat", "--- Chore ---\nId: cat\nWho: Ava\nStarts: 2026-11-01")
    await load(hass)
    chores = await call(hass, "get_chores")
    today = next(c for c in chores["chores"] if c["due"] == "2026-11-04")
    assert today["state"] == "open"

    await call(hass, "set_chore_done", chore=today["id"])
    done = next(c for c in (await call(hass, "get_chores"))["chores"] if c["id"] == today["id"])
    assert (done["state"], done["done_at"]) == ("done", "2026-11-04T15:00:00+00:00")

    await call(hass, "set_chore_done", chore=today["id"], done=False)
    again = next(c for c in (await call(hass, "get_chores"))["chores"] if c["id"] == today["id"])
    assert again["state"] == "open"

    with pytest.raises(ServiceValidationError) as err:
        await call(hass, "set_chore_done", chore="nope")
    assert err.value.translation_key == "chore_not_found"


async def test_save_change_move_and_remove_a_template(hass: HomeAssistant, tasks: FakeTasks) -> None:
    entry = await load(hass)
    saved = await call(
        hass,
        "save_chore_template",
        repeats="weekly",
        title="Take out the trash",
        icon="🗑️",
        who=["Ava", "ben"],
        take_turns=True,
        days="Thu",
        details="Bins at the curb by 7 PM.",
    )
    template_id = saved["template"]
    [template] = tasks.items(WEEKLY)
    assert template["title"] == "🗑️ Take out the trash"
    assert template["notes"] == (
        f"Bins at the curb by 7 PM.\n\n--- Chore ---\nId: {template_id}\nWho: Ava, Ben\nTake turns: yes\n"
        "Days: Thu\nStarts: 2026-11-04"
    )
    # Turns start with Ava on the first Thursday.
    assert [t["title"] for t in tasks.items("Chores: Ava")] == ["🗑️ Take out the trash"]
    assert tasks.items("Chores: Ben") == []

    # Change the day: the coming chore moves.
    await call(hass, "save_chore_template", template=template_id, days="Fri")
    assert [t["due"][:10] for t in tasks.items("Chores: Ava")] == ["2026-11-06"]
    assert tasks.items(WEEKLY)[0]["title"] == "🗑️ Take out the trash"

    # Make it monthly: it moves to the Monthly list and keeps its Id.
    await call(hass, "save_chore_template", template=template_id, repeats="monthly", days="Any")
    assert tasks.items(WEEKLY) == []
    [moved] = tasks.items("Chore templates: Monthly")
    assert read_block(moved["notes"]).first("id") == template_id
    assert [t["due"][:10] for t in tasks.items("Chores: Ava")] == ["2026-11-30"]

    await call(hass, "remove_chore_template", template=template_id)
    assert tasks.items("Chore templates: Monthly") == []
    assert tasks.items("Chores: Ava") == []
    assert entry.runtime_data.chores.data.templates == []


@pytest.mark.parametrize(
    ("fields", "key"),
    [
        ({"repeats": "weekly", "title": "Mow", "who": ["Zed"]}, "unknown_kid"),
        ({"repeats": "weekly", "title": "Mow", "who": ["Ava"], "days": "Funday"}, "bad_days"),
        ({"repeats": "weekly", "title": "", "who": ["Ava"]}, "template_incomplete"),
        (
            {"repeats": "weekly", "title": "Mow", "who": ["Ava"], "starts": "2026-11-10", "ends": "2026-11-01"},
            "ends_before_starts",
        ),
        ({"template": "nope", "title": "Mow"}, "template_not_found"),
    ],
)
async def test_save_rejects(hass: HomeAssistant, tasks: FakeTasks, fields: dict[str, Any], key: str) -> None:
    await load(hass)
    with pytest.raises(ServiceValidationError) as err:
        await call(hass, "save_chore_template", **fields)
    assert err.value.translation_key == key


async def test_old_sign_in_asks_to_sign_in_again(hass: HomeAssistant, google: FakeGoogle, tasks: FakeTasks) -> None:
    entry = make_entry()
    entry = MockConfigEntry(
        domain=DOMAIN,
        title=entry.title,
        unique_id=entry.unique_id,
        data={
            **entry.data,
            "token": {**entry.data["token"], "scope": "calendar.events calendar.calendarlist.readonly"},
        },
        options=dict(entry.options),
    )
    await load(hass, entry)
    assert tasks.calls == []
    chores = await call(hass, "get_chores")
    assert chores["status"]["needs"] == "sign_in"
    reauth = [f for f in hass.config_entries.flow.async_progress() if f["context"]["source"] == SOURCE_REAUTH]
    assert len(reauth) == 1
    # Rides keep working.
    assert entry.runtime_data.coordinator.last_update_success
    with pytest.raises(ServiceValidationError) as err:
        await call(hass, "set_chore_done", chore="x")
    assert err.value.translation_key == "chores_sign_in"


async def test_tasks_api_turned_off(hass: HomeAssistant, tasks: FakeTasks) -> None:
    tasks.errors["lists"] = google_error(403, "accessNotConfigured")
    entry = await load(hass)
    assert (await call(hass, "get_chores"))["status"]["needs"] == "tasks_api"
    assert entry.runtime_data.coordinator.last_update_success


async def test_live_chores(hass: HomeAssistant, hass_ws_client: WebSocketGenerator, tasks: FakeTasks) -> None:
    daily = tasks.add_list(DAILY)
    tasks.add(daily, "Feed the cat", "--- Chore ---\nId: cat\nWho: Ben\nStarts: 2026-11-01")
    await load(hass)
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "mydashlight/chores/subscribe"})
    assert (await client.receive_json())["success"]
    first = (await client.receive_json())["event"]["chores"]
    today = next(c for c in first["chores"] if c["due"] == "2026-11-04")
    await call(hass, "set_chore_done", chore=today["id"])
    changed = (await client.receive_json())["event"]["chores"]
    assert next(c for c in changed["chores"] if c["id"] == today["id"])["state"] == "done"


async def test_check_off_says_who_did_it(hass: HomeAssistant, tasks: FakeTasks) -> None:
    daily = tasks.add_list(DAILY)
    tasks.add(daily, "Feed the cat", "--- Chore ---\nId: cat\nWho: Ava\nStarts: 2026-11-01")
    await load(hass)
    chores = await call(hass, "get_chores")
    assert [p["name"] for p in chores["people"]] == ["Ava", "Ben", "Robin", "Sam"]
    assert [p["role"] for p in chores["people"]] == ["kid", "kid", "parent", "parent"]
    today = next(c for c in chores["chores"] if c["due"] == "2026-11-04")

    def saved() -> dict[str, Any]:
        return next(t for t in tasks.items("Chores: Ava") if t["id"] == today["id"])

    def shown(chores: dict[str, Any]) -> dict[str, Any]:
        return next(c for c in chores["chores"] if c["id"] == today["id"])

    # Left out: the kid it's for.
    await call(hass, "set_chore_done", chore=today["id"])
    assert read_block(saved()["notes"]).first("done_by") == "Ava"
    done = shown(await call(hass, "get_chores"))
    assert (done["state"], done["done_by"], done["done_by_name"]) == ("done", today["kid"], "Ava")

    # A parent sniped it: changing who, while it stays done.
    await call(hass, "set_chore_done", chore=today["id"], by="dad")
    assert read_block(saved()["notes"]).every("done_by") == ["Sam"]
    assert shown(await call(hass, "get_chores"))["done_by"] == "dad"

    # Opened again: the line goes.
    await call(hass, "set_chore_done", chore=today["id"], done=False)
    assert read_block(saved()["notes"]).every("done_by") == []
    again = shown(await call(hass, "get_chores"))
    assert (again["state"], again["done_by"]) == ("open", None)

    with pytest.raises(ServiceValidationError) as err:
        await call(hass, "set_chore_done", chore=today["id"], by="Grandma")
    assert err.value.translation_key == "unknown_person"
