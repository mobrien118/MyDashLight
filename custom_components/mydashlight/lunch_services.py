"""MyDashLight's lunch services: read the lunches, and save a kid's Bring or Buy picks.

Picks are "Bring Lunch" and "Buy Lunch" all-day events on the kid's own calendar, so they
show the same on the board, in Google Calendar and on phones.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse, callback
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import config_validation as cv
import voluptuous as vol

from .chore_rules import kid_for
from .const import ATTR_DATES, ATTR_KID, ATTR_LUNCH, DOMAIN, SERVICE_GET_LUNCHES, SERVICE_SET_LUNCH
from .google import GoogleAuthError, GoogleConflict, GoogleError

if TYPE_CHECKING:
    from . import MyDashLightConfigEntry

LUNCH_DEFAULT = "default"
SET_LUNCH_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_KID): cv.string,
        vol.Required(ATTR_DATES): vol.All(cv.ensure_list, [cv.date], vol.Length(min=1, max=62)),
        vol.Required(ATTR_LUNCH): vol.In(("bring", "buy", LUNCH_DEFAULT)),
    }
)


@callback
def async_setup_lunch_services(hass: HomeAssistant) -> None:
    hass.services.async_register(
        DOMAIN, SERVICE_GET_LUNCHES, _async_get_lunches, supports_response=SupportsResponse.ONLY
    )
    hass.services.async_register(DOMAIN, SERVICE_SET_LUNCH, _async_set_lunch, schema=SET_LUNCH_SCHEMA)


def _entry(hass: HomeAssistant) -> MyDashLightConfigEntry:
    entries: list[MyDashLightConfigEntry] = hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="not_loaded")
    return entries[0]


async def _async_get_lunches(call: ServiceCall) -> ServiceResponse:
    lunch = _entry(call.hass).runtime_data.lunch
    if lunch.data is None:
        # Just started, and the first read hasn't finished yet.
        await lunch.async_refresh()
    payload = lunch.payload()
    if payload is None:
        raise HomeAssistantError(translation_domain=DOMAIN, translation_key="lunch_unavailable")
    return payload


async def _async_set_lunch(call: ServiceCall) -> None:
    entry = _entry(call.hass)
    lunch = entry.runtime_data.lunch
    kid = kid_for(call.data[ATTR_KID], lunch.kids)
    if kid is None:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="unknown_kid",
            translation_placeholders={"name": call.data[ATTR_KID]},
        )
    choice = call.data[ATTR_LUNCH]
    try:
        await lunch.async_set_lunch(kid, call.data[ATTR_DATES], None if choice == LUNCH_DEFAULT else choice)
    except GoogleAuthError as err:
        entry.async_start_reauth(call.hass)
        raise HomeAssistantError(translation_domain=DOMAIN, translation_key="auth_failed") from err
    except GoogleConflict as err:
        raise HomeAssistantError(translation_domain=DOMAIN, translation_key="write_conflict") from err
    except GoogleError as err:
        raise HomeAssistantError(
            translation_domain=DOMAIN, translation_key="lunch_failed", translation_placeholders={"error": str(err)}
        ) from err
    # Pack-lunch chores follow the picks.
    await entry.runtime_data.chores.async_request_refresh()
