"""Reminders in Home Assistant: phone reminders, the Google Calendar reminder, no-driver alerts."""

from __future__ import annotations

from datetime import timedelta
import time
from typing import Any

from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.data_entry_flow import FlowResultType
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed, async_mock_service
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from custom_components.mydashlight.const import DOMAIN
from custom_components.mydashlight.google import REMINDER_MARK
from custom_components.mydashlight.settings import HubSettings

from .common import AVA, BEN, FAMILY, OPTIONS, FakeGoogle, google_error, make_entry, setup_credentials, timed

NOW = "2026-11-03T15:00:00+00:00"  # 9 AM in Central time, a Tuesday
PIANO = "Piano studio, 1 Elm St"
REMINDERS = {
    **OPTIONS,
    "mom_notify": "robin_phone",
    "dad_notify": "off",
    "kid_notify": {AVA: "mobile_app_avas_phone", BEN: "off"},
    "calendar_reminders": True,
}


@pytest.fixture(autouse=True)
async def setup(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    await hass.config.async_set_time_zone("America/Chicago")
    freezer.move_to(NOW)
    await setup_credentials(hass)


@pytest.fixture
def google(aioclient_mock: AiohttpClientMocker) -> FakeGoogle:
    g = FakeGoogle(aioclient_mock)
    # Robin takes Ava to piano at 4. With no drive times looked up, a drive is 15 minutes, so
    # Robin aims to be there 6 minutes early, leaves at 3:39 and the reminder goes off at 3:24.
    # Nobody picks Ava up yet.
    g.add(
        FAMILY,
        **timed(
            "piano",
            "Ava Piano",
            "2026-11-03T16:00:00-06:00",
            "2026-11-03T17:00:00-06:00",
            location=PIANO,
            description="Drop-off: Robin",
        ),
    )
    return g


@pytest.fixture
def phones(hass: HomeAssistant) -> dict[str, list[ServiceCall]]:
    return {
        "robin": async_mock_service(hass, "notify", "robin_phone"),
        "ava": async_mock_service(hass, "notify", "mobile_app_avas_phone"),
    }


async def load(hass: HomeAssistant, options: dict[str, Any] | None = None) -> MockConfigEntry:
    # Signed in for the whole day the tests move through.
    entry = make_entry(REMINDERS if options is None else options, expires_at=time.time() + 86400)
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


def reminder_patches(google: FakeGoogle) -> list[tuple[str, str, dict[str, Any]]]:
    return [(cal, ev, body) for cal, ev, _etag, body in google.patches if "reminders" in body]


async def test_settings() -> None:
    reminders = HubSettings.from_options(REMINDERS).reminders
    assert reminders.notify == {"mom": "robin_phone", AVA: "mobile_app_avas_phone"}
    assert reminders.before == 15
    assert reminders.calendar is True
    assert reminders.no_driver_alerts is True
    assert reminders.no_driver_hours == 6
    assert HubSettings.from_options({**REMINDERS, "no_driver_hours": 12}).reminders.no_driver_hours == 12
    defaults = HubSettings.from_options({**OPTIONS, "calendar_reminders": True}).reminders
    assert defaults.notify == {}
    # A kid who's no longer one of the kids gets nothing.
    gone = HubSettings.from_options({**REMINDERS, "kid_notify": {"old@example.com": "x"}}).reminders
    assert gone.notify == {"mom": "robin_phone"}


async def test_reminders(
    hass: HomeAssistant,
    google: FakeGoogle,
    phones: dict[str, list[ServiceCall]],
    freezer: FrozenDateTimeFactory,
) -> None:
    entry = await load(hass)

    # The Google reminder goes on piano: 15 minutes before leaving at 3:39 is 36 minutes
    # before piano starts.
    assert reminder_patches(google) == [
        (
            FAMILY,
            "piano",
            {
                "reminders": {"useDefault": False, "overrides": [{"method": "popup", "minutes": 36}]},
                "extendedProperties": {"private": {REMINDER_MARK: "36"}},
            },
        )
    ]
    # Nobody picks Ava up at 5 yet, but that's more than six hours off: no alert yet.
    assert phones["robin"] == []

    # Reading the calendars again finds the reminder already there.
    await entry.runtime_data.coordinator.async_refresh()
    await hass.async_block_till_done()
    assert len(reminder_patches(google)) == 1

    # 11 AM: the pick-up is six hours off, so Robin hears about it. Kids don't.
    freezer.move_to("2026-11-03T17:00:00+00:00")
    await entry.runtime_data.coordinator.async_refresh()
    await hass.async_block_till_done()
    assert [c.data["title"] for c in phones["robin"]] == ["A ride needs a driver"]
    assert phones["robin"][0].data["message"] == "Tue 5:00 PM  Ava home from Piano (Piano studio)"
    assert phones["ava"] == []
    await entry.runtime_data.coordinator.async_refresh()
    await hass.async_block_till_done()
    assert len(phones["robin"]) == 1

    # 3:25, just after the 3:24 reminder: time to get ready.
    freezer.move_to("2026-11-03T21:25:00+00:00")
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert phones["robin"][1].data == {
        "title": "Leave at 3:39 PM: Drive Ava to Piano studio",
        "message": "Leave 3:39\n3:54  Piano studio, drop off Ava\n4:09  Home",
    }
    assert phones["ava"][0].data == {
        "title": "Leave home at 3:39 PM with Robin",
        "message": "Drive Ava to Piano studio",
        "data": {"tag": "mydashlight-2026-11-03|mom|piano|0|" + AVA, "group": DOMAIN},
    }

    # Nothing is sent twice, even after a restart.
    freezer.tick(timedelta(seconds=30))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.LOADED
    assert len(phones["robin"]) == 2
    assert len(phones["ava"]) == 1


async def test_alert_window_is_a_setting(
    hass: HomeAssistant, google: FakeGoogle, phones: dict[str, list[ServiceCall]]
) -> None:
    # At 9 AM the 5 PM pick-up is eight hours off: inside an 8-hour window, not the usual six.
    await load(hass, {**REMINDERS, "no_driver_hours": 8})
    assert [c.data["title"] for c in phones["robin"]] == ["A ride needs a driver"]


async def test_a_reminder_missed_while_off_still_goes_before_leaving(
    hass: HomeAssistant, google: FakeGoogle, phones: dict[str, list[ServiceCall]], freezer: FrozenDateTimeFactory
) -> None:
    freezer.move_to("2026-11-03T21:30:00+00:00")  # 3:30, after the reminder, before leaving
    await load(hass)
    assert [c.data["title"] for c in phones["robin"]] == [
        "Leave at 3:39 PM: Drive Ava to Piano studio",
        "A ride needs a driver",
    ]


async def test_a_drive_moved_earlier_is_reminded_again(
    hass: HomeAssistant, google: FakeGoogle, phones: dict[str, list[ServiceCall]], freezer: FrozenDateTimeFactory
) -> None:
    freezer.move_to("2026-11-03T21:26:00+00:00")
    entry = await load(hass, {**REMINDERS, "no_driver_alerts": False})
    assert len(phones["robin"]) == 1
    # Piano moves to 3:50, so Robin now leaves at 3:29.
    piano = google.event(FAMILY, "piano")
    assert piano is not None
    piano["start"] = {"dateTime": "2026-11-03T15:50:00-06:00"}
    await entry.runtime_data.coordinator.async_refresh()
    await hass.async_block_till_done()
    assert [c.data["title"] for c in phones["robin"]] == [
        "Leave at 3:39 PM: Drive Ava to Piano studio",
        "Leave at 3:29 PM: Drive Ava to Piano studio",
    ]


async def test_reminder_comes_off_when_the_drive_goes(
    hass: HomeAssistant, google: FakeGoogle, phones: dict[str, list[ServiceCall]]
) -> None:
    await load(hass)
    await hass.services.async_call(
        DOMAIN, "set_ride", {"event": "piano", "side": "drop", "driver": "none"}, blocking=True
    )
    await hass.async_block_till_done()
    assert reminder_patches(google)[-1][2] == {
        "reminders": {"useDefault": True, "overrides": []},
        "extendedProperties": {"private": {REMINDER_MARK: ""}},
    }


async def test_calendar_reminders_off(
    hass: HomeAssistant, google: FakeGoogle, phones: dict[str, list[ServiceCall]]
) -> None:
    await load(hass, {**REMINDERS, "calendar_reminders": False})
    assert reminder_patches(google) == []


async def test_a_failed_save_is_logged_once(
    hass: HomeAssistant,
    google: FakeGoogle,
    phones: dict[str, list[ServiceCall]],
    caplog: pytest.LogCaptureFixture,
) -> None:
    google.write_errors["piano"] = google_error(403, "forbidden")
    entry = await load(hass)
    await entry.runtime_data.coordinator.async_refresh()
    await hass.async_block_till_done()
    assert caplog.text.count("Couldn't save a ride reminder") == 1
    # Another app changing the event first just means trying again next time.
    google.write_errors.clear()
    google.edits_in_between = 1
    await entry.runtime_data.coordinator.async_refresh()
    await hass.async_block_till_done()
    assert reminder_patches(google) == []
    await entry.runtime_data.coordinator.async_refresh()
    await hass.async_block_till_done()
    assert len(reminder_patches(google)) == 1


async def test_missing_notify_service_is_logged_once(
    hass: HomeAssistant, google: FakeGoogle, caplog: pytest.LogCaptureFixture, freezer: FrozenDateTimeFactory
) -> None:
    freezer.move_to("2026-11-03T19:00:00+00:00")  # 1 PM, so rides this afternoon need a driver
    entry = await load(hass, {**REMINDERS, "kid_notify": {}})
    google.add(
        FAMILY,
        **timed("swim", "Ben Swim", "2026-11-03T18:00:00-06:00", "2026-11-03T19:00:00-06:00", location="Pool"),
    )
    await entry.runtime_data.coordinator.async_refresh()
    await hass.async_block_till_done()
    assert caplog.text.count("notify.robin_phone doesn't exist") == 1


async def test_no_notifiers_means_no_reminders(hass: HomeAssistant, google: FakeGoogle) -> None:
    entry = await load(hass, {**REMINDERS, "mom_notify": "off", "kid_notify": {}})
    assert entry.runtime_data.notifier.active is False


async def test_options(hass: HomeAssistant, google: FakeGoogle, phones: dict[str, list[ServiceCall]]) -> None:
    entry = await load(hass, {**OPTIONS, "dad_notify": "gone_phone"})
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "reminders"})
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "reminders"
    schema = result["data_schema"].schema
    fields = [str(k) for k in schema]
    assert fields == [
        "Robin",
        "Sam",
        "Ava",
        "Ben",
        "mom_person",
        "dad_person",
        "remind_before",
        "calendar_reminders",
        "no_driver_alerts",
        "no_driver_hours",
    ]
    sam = next(k for k in schema if str(k) == "Sam")
    choices = [o["value"] for o in schema[sam].config["options"]]
    # A notifier that's gone stays listed, so the form still opens.
    assert choices == ["off", "mobile_app_avas_phone", "robin_phone", "gone_phone"]

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "Robin": "robin_phone",
            "Sam": "off",
            "Ava": "mobile_app_avas_phone",
            "Ben": "off",
            "mom_person": "person.robin",
            "remind_before": 20,
            "calendar_reminders": False,
            "no_driver_alerts": True,
            "no_driver_hours": 8.0,
        },
    )
    await hass.async_block_till_done()
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert entry.options["mom_notify"] == "robin_phone"
    assert entry.options["dad_notify"] == "off"
    assert entry.options["kid_notify"] == {AVA: "mobile_app_avas_phone", BEN: "off"}
    assert entry.options["mom_person"] == "person.robin"
    assert entry.options["dad_person"] is None
    assert entry.runtime_data.settings.reminders.people == {"mom": "person.robin"}
    assert entry.options["remind_before"] == 20
    assert entry.options["calendar_reminders"] is False
    assert entry.runtime_data.settings.reminders.before == 20
    assert entry.options["no_driver_hours"] == 8
    assert entry.runtime_data.settings.reminders.no_driver_hours == 8
