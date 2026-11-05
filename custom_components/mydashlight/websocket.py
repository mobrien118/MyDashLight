"""The kitchen app's live plan, ``mydashlight/rides/subscribe``, and live chores,
``mydashlight/chores/subscribe``.

After subscribing, the app gets an event with the whole week's plan straight away, then
another each time the plan changes. The plan is the same as ``get_plan`` returns for all
seven days, with the people the app's pickers need (``people``) and whether the last read of
the calendars worked (``status``). ``{"plan": null}`` means MyDashLight isn't running right
now (say, during a restart or while someone signs in to Google again); a plan follows once
it's back.

Calendars are read every minute, but an event is only sent when something in the plan
actually changed, not just the time it was checked.

Chores work the same way: an event with ``{"chores": ...}``, the same as ``get_chores``
returns, straight away and after each change, and ``{"chores": null}`` while MyDashLight
isn't running.

Lunches too, on ``mydashlight/lunch/subscribe``: ``{"lunch": ...}``, the same as
``get_lunches`` returns.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from homeassistant.components import websocket_api
from homeassistant.components.websocket_api.connection import ActiveConnection
from homeassistant.components.websocket_api.decorators import websocket_command
from homeassistant.components.websocket_api.messages import event_message
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
import voluptuous as vol

from .const import (
    DOMAIN,
    SIGNAL_CHORES_UPDATED,
    SIGNAL_LUNCH_UPDATED,
    SIGNAL_PLAN_UPDATED,
    WS_CHORES_SUBSCRIBE,
    WS_LUNCH_SUBSCRIBE,
    WS_SUBSCRIBE,
)

if TYPE_CHECKING:
    from . import MyDashLightConfigEntry


@callback
def async_setup_websocket(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, _ws_subscribe)
    websocket_api.async_register_command(hass, _ws_chores_subscribe)
    websocket_api.async_register_command(hass, _ws_lunch_subscribe)


def _current(hass: HomeAssistant) -> MyDashLightConfigEntry | None:
    entries: list[MyDashLightConfigEntry] = hass.config_entries.async_loaded_entries(DOMAIN)
    return entries[0] if entries else None


def _content(plan: dict[str, Any] | None) -> dict[str, Any] | None:
    """What counts as a change: everything but when the calendars were last read."""
    return None if plan is None else {k: v for k, v in plan.items() if k != "updated"}


@websocket_command({vol.Required("type"): WS_SUBSCRIBE})
@callback
def _ws_subscribe(hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]) -> None:
    msg_id: int = msg["id"]
    sent: dict[str, Any] = {}

    @callback
    def send(entry: MyDashLightConfigEntry | None) -> None:
        plan = entry.runtime_data.coordinator.payload() if entry is not None else None
        content = _content(plan)
        if "content" in sent and sent["content"] == content:
            return
        sent["content"] = content
        connection.send_message(event_message(msg_id, {"plan": plan}))

    connection.subscriptions[msg_id] = async_dispatcher_connect(hass, SIGNAL_PLAN_UPDATED, send)
    connection.send_result(msg_id)
    send(_current(hass))


@websocket_command({vol.Required("type"): WS_CHORES_SUBSCRIBE})
@callback
def _ws_chores_subscribe(hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]) -> None:
    msg_id: int = msg["id"]
    sent: dict[str, Any] = {}

    @callback
    def send(entry: MyDashLightConfigEntry | None) -> None:
        chores = entry.runtime_data.chores.payload() if entry is not None else None
        content = _content(chores)
        if "content" in sent and sent["content"] == content:
            return
        sent["content"] = content
        connection.send_message(event_message(msg_id, {"chores": chores}))

    connection.subscriptions[msg_id] = async_dispatcher_connect(hass, SIGNAL_CHORES_UPDATED, send)
    connection.send_result(msg_id)
    send(_current(hass))


@websocket_command({vol.Required("type"): WS_LUNCH_SUBSCRIBE})
@callback
def _ws_lunch_subscribe(hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]) -> None:
    msg_id: int = msg["id"]
    sent: dict[str, Any] = {}

    @callback
    def send(entry: MyDashLightConfigEntry | None) -> None:
        lunch = entry.runtime_data.lunch.payload() if entry is not None else None
        content = _content(lunch)
        if "content" in sent and sent["content"] == content:
            return
        sent["content"] = content
        connection.send_message(event_message(msg_id, {"lunch": lunch}))

    connection.subscriptions[msg_id] = async_dispatcher_connect(hass, SIGNAL_LUNCH_UPDATED, send)
    connection.send_result(msg_id)
    send(_current(hass))
