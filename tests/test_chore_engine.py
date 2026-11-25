"""Chores end to end: lists made in Google Tasks, kids' lists filled from templates, check-offs,
template changes through the services, the live feed, and sign-ins from before chores."""

from __future__ import annotations

import time
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import SOURCE_REAUTH
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker
from pytest_homeassistant_custom_component.typing import WebSocketGenerator
import voluptuous as vol

from custom_components.mydashlight.chore_rules import read_block
from custom_components.mydashlight.const import DOMAIN

from .common import AVA, BEN, FakeGoogle, FakeTasks, google_error, make_entry, setup_credentials

NOW = "2026-11-04T15:00:00+00:00"  # 9 AM in Central time, a Wednesday
SEEDS = "Chore seeds"


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
    assert titles == ["Chore seeds", "Chores: Ava", "Chores: Ben"]


async def test_finds_lists_by_title_and_keeps_them_when_renamed(hass: HomeAssistant, tasks: FakeTasks) -> None:
    seeds = tasks.add_list(SEEDS)
    entry = await load(hass)
    assert tasks.list_id(SEEDS) == seeds
    tasks.lists[seeds]["title"] = "Our chores"
    await refresh(hass, entry)
    assert len(tasks.lists) == 3
    assert entry.runtime_data.chores.data.seed_list == seeds


async def test_fills_kids_lists_from_a_hand_typed_template(hass: HomeAssistant, tasks: FakeTasks) -> None:
    seeds = tasks.add_list(SEEDS)
    template = tasks.add(seeds, "🧹 Vacuum the stairs", "Both flights.\n\n--- Chore ---\nWho: Ava, Ben\nDays: Thu")
    entry = await load(hass)

    # Typed in by hand: MyDashLight gives it an Id, how often (from its days) and a start day.
    block = read_block(template["notes"])
    assert block.first("id") == template["id"]
    assert block.first("repeats") == "Every week"
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
    seeds = tasks.add_list(SEEDS)
    tasks.add(seeds, "Feed the cat", "--- Chore ---\nId: cat\nRepeats: Every day\nWho: Ava\nStarts: 2026-11-01")
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
    [template] = tasks.items(SEEDS)
    assert template["title"] == "🗑️ Take out the trash"
    assert template["notes"] == (
        f"Bins at the curb by 7 PM.\n\n--- Chore ---\nId: {template_id}\nRepeats: Every week\nWho: Ava, Ben\n"
        "Take turns: yes\nDays: Thu\nStarts: 2026-11-04"
    )
    # Turns start with Ava on the first Thursday.
    assert [t["title"] for t in tasks.items("Chores: Ava")] == ["🗑️ Take out the trash"]
    assert tasks.items("Chores: Ben") == []

    # Change the day: the coming chore moves.
    await call(hass, "save_chore_template", template=template_id, days="Fri")
    assert [t["due"][:10] for t in tasks.items("Chores: Ava")] == ["2026-11-06"]
    assert tasks.items(SEEDS)[0]["title"] == "🗑️ Take out the trash"

    # Make it monthly: it stays where it is, with its Id, starting over on its days.
    await call(hass, "save_chore_template", template=template_id, repeats="monthly")
    [changed] = tasks.items(SEEDS)
    assert read_block(changed["notes"]).first("id") == template_id
    assert read_block(changed["notes"]).first("repeats") == "Every month"
    assert read_block(changed["notes"]).first("days") == "Any"
    assert [t["due"][:10] for t in tasks.items("Chores: Ava")] == ["2026-11-30"]

    await call(hass, "remove_chore_template", template=template_id)
    assert tasks.items(SEEDS) == []
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
    seeds = tasks.add_list(SEEDS)
    tasks.add(seeds, "Feed the cat", "--- Chore ---\nId: cat\nRepeats: Every day\nWho: Ben\nStarts: 2026-11-01")
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
    seeds = tasks.add_list(SEEDS)
    tasks.add(seeds, "Feed the cat", "--- Chore ---\nId: cat\nRepeats: Every day\nWho: Ava\nStarts: 2026-11-01")
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


async def test_check_off_shows_at_once_with_one_save(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator, tasks: FakeTasks
) -> None:
    seeds = tasks.add_list(SEEDS)
    tasks.add(seeds, "Feed the cat", "--- Chore ---\nId: cat\nRepeats: Every day\nWho: Ben\nStarts: 2026-11-01")
    await load(hass)
    # Two boards watching.
    boards = [await hass_ws_client(hass) for _ in range(2)]
    for board in boards:
        await board.send_json_auto_id({"type": "mydashlight/chores/subscribe"})
        assert (await board.receive_json())["success"]
        first = (await board.receive_json())["event"]["chores"]
    today = next(c for c in first["chores"] if c["due"] == "2026-11-04")

    calls = len(tasks.calls)
    await call(hass, "set_chore_done", chore=today["id"])
    # Only the save itself: no read of every list before the boards hear of it.
    assert [method for method, _url in tasks.calls[calls:]] == ["PATCH"]
    for board in boards:
        shown = (await board.receive_json())["event"]["chores"]
        assert next(c for c in shown["chores"] if c["id"] == today["id"])["state"] == "done"

    # Nothing to save: nothing sent to Google.
    await call(hass, "set_chore_done", chore=today["id"])
    assert [method for method, _url in tasks.calls[calls:]] == ["PATCH"]


async def test_saved_template_shows_before_its_chores(
    hass: HomeAssistant, hass_ws_client: WebSocketGenerator, tasks: FakeTasks
) -> None:
    await load(hass)
    board = await hass_ws_client(hass)
    await board.send_json_auto_id({"type": "mydashlight/chores/subscribe"})
    assert (await board.receive_json())["success"]
    assert (await board.receive_json())["event"]["chores"]["templates"] == []
    saved = await call(hass, "save_chore_template", repeats="weekly", title="Mow", who=["Ava"], days="Thu")
    template = (await board.receive_json())["event"]["chores"]
    assert [t["id"] for t in template["templates"]] == [saved["template"]]
    made = (await board.receive_json())["event"]["chores"]
    assert [c["title"] for c in made["chores"]] == ["Mow"]

    await call(hass, "remove_chore_template", template=saved["template"])
    assert (await board.receive_json())["event"]["chores"]["templates"] == []


async def test_a_read_under_way_during_a_save_reads_again(hass: HomeAssistant, tasks: FakeTasks) -> None:
    entry = await load(hass)
    coordinator = entry.runtime_data.chores
    reads = 0
    read = coordinator._async_read_and_fill

    async def saved_meanwhile(data: Any, now: Any) -> Any:
        nonlocal reads
        reads += 1
        if reads == 1:
            coordinator._saves += 1  # what a check-off on a board does
        return await read(data, now)

    coordinator._async_read_and_fill = saved_meanwhile  # type: ignore[method-assign]
    await refresh(hass, entry)
    assert reads == 2


async def test_daily_chores_dont_take_days(hass: HomeAssistant, tasks: FakeTasks) -> None:
    await load(hass)
    with pytest.raises(ServiceValidationError) as err:
        await call(hass, "save_chore_template", repeats="daily", title="Piano", who=["Ava"], days="Mon, Wed")
    assert err.value.translation_key == "daily_no_days"
    saved = await call(hass, "save_chore_template", repeats="daily", every=3, title="Water plants", who=["Ava"])
    [seed] = tasks.items(SEEDS)
    assert read_block(seed["notes"]).first("repeats") == "Every 3 days"
    chores = await call(hass, "get_chores")
    [template] = [t for t in chores["templates"] if t["id"] == saved["template"]]
    assert (template["repeats"], template["every"], template["repeats_label"]) == ("daily", 3, "Every 3 days")
    assert [c["due"] for c in chores["chores"]] == ["2026-11-04", "2026-11-07", "2026-11-10"]


async def test_check_off_earns_points(hass: HomeAssistant, tasks: FakeTasks) -> None:
    seeds = tasks.add_list(SEEDS)
    tasks.add(
        seeds, "Feed the cat", "--- Chore ---\nId: cat\nRepeats: Every day\nWho: Ava\nPoints: 2\nStarts: 2026-11-01"
    )
    await load(hass)
    chores = await call(hass, "get_chores")
    assert chores["points"] == {
        "days": 7,
        "default": 1,
        "scores": dict.fromkeys((AVA, BEN, "mom", "dad"), 0.0),
        "leaders": [],
    }
    today = next(c for c in chores["chores"] if c["due"] == "2026-11-04")
    assert (today["worth"], today["earned"]) == (2, None)

    def saved() -> dict[str, Any]:
        return next(t for t in tasks.items("Chores: Ava") if t["id"] == today["id"])

    # Done on time by the kid it's for: all of it. Only who did it is written on the chore.
    await call(hass, "set_chore_done", chore=today["id"])
    assert read_block(saved()["notes"]).lines == (("from", "cat"), ("for", "2026-11-04"), ("done_by", "Ava"))
    chores = await call(hass, "get_chores")
    assert next(c for c in chores["chores"] if c["id"] == today["id"])["earned"] == 2
    assert chores["points"]["scores"][AVA] == 2
    assert chores["points"]["leaders"] == [AVA]

    # Ben did it before it was late: a favor, worth nothing.
    await call(hass, "set_chore_done", chore=today["id"], by="Ben")
    chores = await call(hass, "get_chores")
    assert (chores["points"]["scores"][AVA], chores["points"]["scores"][BEN]) == (0, 0)
    assert chores["points"]["leaders"] == []

    # Ava after all, then the chore made worth more: what she has follows.
    await call(hass, "set_chore_done", chore=today["id"], by="Ava")
    await call(
        hass, "save_chore_template", template="cat", repeats="daily", title="Feed the cat", who=["Ava"], points=5
    )
    chores = await call(hass, "get_chores")
    assert next(c for c in chores["chores"] if c["id"] == today["id"])["earned"] == 5
    assert chores["points"]["scores"][AVA] == 5


async def test_a_late_chore_earns_the_late_share_for_whoever_does_it(
    hass: HomeAssistant, tasks: FakeTasks, freezer: FrozenDateTimeFactory
) -> None:
    seeds = tasks.add_list(SEEDS)
    # A daily chore missed is closed out once the next one shows; a weekly one waits for anyone.
    tasks.add(
        seeds,
        "Vacuum",
        "--- Chore ---\nId: vac\nRepeats: Every week\nDays: Wed\nWho: Ava\nPoints: 2\nStarts: 2026-11-01",
    )
    entry = await load(hass, make_entry(expires_at=time.time() + 3 * 86400))
    wednesday = next(c for c in (await call(hass, "get_chores"))["chores"] if c["due"] == "2026-11-04")

    freezer.move_to("2026-11-05T15:00:00+00:00")
    tasks.now = "2026-11-05T15:00:00.000Z"
    await refresh(hass, entry)
    late = next(c for c in (await call(hass, "get_chores"))["chores"] if c["id"] == wednesday["id"])
    assert late["state"] == "overdue"

    await call(hass, "set_chore_done", chore=wednesday["id"], by="Ben")
    assert (await call(hass, "get_chores"))["points"]["scores"][BEN] == 1


async def test_a_chore_ticked_in_google_counts_too(hass: HomeAssistant, tasks: FakeTasks) -> None:
    seeds = tasks.add_list(SEEDS)
    tasks.add(seeds, "Feed the cat", "--- Chore ---\nId: cat\nRepeats: Every day\nWho: Ava\nStarts: 2026-11-01")
    entry = await load(hass)
    task = next(t for t in tasks.items("Chores: Ava") if t["due"].startswith("2026-11-04"))
    # Ticked in the Google Tasks app: no Done by line. Nothing needs writing.
    task.update(status="completed", completed="2026-11-04T14:00:00.000Z")
    await refresh(hass, entry)
    assert read_block(task["notes"]).every("done_by") == []
    assert (await call(hass, "get_chores"))["points"]["scores"][AVA] == 1


async def test_old_points_and_earned_lines_are_taken_off(hass: HomeAssistant, tasks: FakeTasks) -> None:
    """Before 0.29.6 chores carried a copy of their points and what a check-off earned."""
    seeds = tasks.add_list(SEEDS)
    tasks.add(
        seeds, "Feed the cat", "--- Chore ---\nId: cat\nRepeats: Every day\nWho: Ava\nPoints: 3\nStarts: 2026-11-01"
    )
    kid = tasks.add_list("Chores: Ava")
    old = "Bowl by the door.\n\n--- Chore ---\nFrom: cat\nFor: {day}\nPoints: 1\nDone by: Ava\nEarned: 1"
    done = tasks.add(kid, "Feed the cat", old.format(day="2026-11-03"), due="2026-11-03")
    done.update(status="completed", completed="2026-11-03T14:00:00.000Z")
    coming = tasks.add(
        kid, "Feed the cat", old.format(day="2026-11-05").replace("\nDone by: Ava\nEarned: 1", ""), due="2026-11-05"
    )
    await load(hass)
    for task in (done, coming):
        block = read_block(task["notes"])
        assert (block.every("points"), block.every("earned")) == ([], [])
    done_block = read_block(done["notes"])
    assert (done_block.details, done_block.every("done_by")) == ("Bowl by the door.", ["Ava"])
    # Counted at the seed's points now, not the old copy.
    assert (await call(hass, "get_chores"))["points"]["scores"][AVA] == 3


async def test_skip_or_excuse_a_chore(hass: HomeAssistant, tasks: FakeTasks, freezer: FrozenDateTimeFactory) -> None:
    seeds = tasks.add_list(SEEDS)
    tasks.add(
        seeds,
        "Vacuum",
        "--- Chore ---\nId: vac\nRepeats: Every week\nDays: Wed\nWho: Ava\nPoints: 2\nStarts: 2026-11-01",
    )
    entry = await load(hass, make_entry(expires_at=time.time() + 3 * 86400))
    wednesday = next(c for c in (await call(hass, "get_chores"))["chores"] if c["due"] == "2026-11-04")

    def saved() -> dict[str, Any]:
        return next(t for t in tasks.items("Chores: Ava") if t["id"] == wednesday["id"])

    async def row() -> dict[str, Any]:
        chores = await call(hass, "get_chores")
        return next(c for c in chores["chores"] if c["id"] == wednesday["id"])

    # Done first, then marked skipped instead: closed, the points it had earned taken off.
    await call(hass, "set_chore_done", chore=wednesday["id"])
    assert (await row())["earned"] == 2
    await call(hass, "set_chore_done", chore=wednesday["id"], skip="skipped", by="mom")
    block = read_block(saved()["notes"])
    assert (block.every("closed"), block.every("done_by")) == (["skipped"], ["Robin"])
    assert saved()["status"] == "completed"
    skipped = await row()
    assert (skipped["state"], skipped["earned"]) == ("skipped", 0)
    assert (await call(hass, "get_chores"))["points"]["scores"][AVA] == 0

    # Excused instead: one Closed line, saying so.
    await call(hass, "set_chore_done", chore=wednesday["id"], skip="excused")
    assert read_block(saved()["notes"]).every("closed") == ["excused"]
    assert (await row())["state"] == "excused"

    # A day later it stays closed: not missed, and nobody can earn points for it.
    freezer.move_to("2026-11-05T15:00:00+00:00")
    tasks.now = "2026-11-05T15:00:00.000Z"
    await refresh(hass, entry)
    block = read_block(saved()["notes"])
    assert block.every("missed") == []
    assert all(c["id"] != wednesday["id"] for c in (await call(hass, "get_chores"))["chores"])

    # Opened again: the line goes, and it's overdue like any other.
    await call(hass, "set_chore_done", chore=wednesday["id"], done=False)
    block = read_block(saved()["notes"])
    assert (block.every("closed"), block.every("done_by")) == ([], [])
    assert (await row())["state"] == "overdue"

    # Then done late by Ben after all: the late share, as usual.
    await call(hass, "set_chore_done", chore=wednesday["id"], by="Ben")
    assert (await call(hass, "get_chores"))["points"]["scores"][BEN] == 1

    with pytest.raises(vol.Invalid):
        await call(hass, "set_chore_done", chore=wednesday["id"], skip="lazy")
