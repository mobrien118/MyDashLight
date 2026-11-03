"""The ``mydashlight.get_plan`` service."""

from __future__ import annotations

from datetime import date, timedelta
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse, callback
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .const import ATTR_DATE, ATTR_DAYS, DOMAIN, PLAN_DAYS, SERVICE_GET_PLAN

if TYPE_CHECKING:
    from . import MyDashLightConfigEntry

GET_PLAN_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_DATE): cv.date,
        vol.Optional(ATTR_DAYS, default=1): vol.All(vol.Coerce(int), vol.Range(min=1, max=PLAN_DAYS)),
    }
)


@callback
def async_setup_services(hass: HomeAssistant) -> None:
    hass.services.async_register(
        DOMAIN, SERVICE_GET_PLAN, _async_get_plan, schema=GET_PLAN_SCHEMA, supports_response=SupportsResponse.ONLY
    )


def _loaded_entry(hass: HomeAssistant) -> MyDashLightConfigEntry:
    entries: list[MyDashLightConfigEntry] = hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="not_loaded")
    return entries[0]


async def _async_get_plan(call: ServiceCall) -> ServiceResponse:
    entry = _loaded_entry(call.hass)
    data = entry.runtime_data.coordinator.data
    first: date = call.data.get(ATTR_DATE) or dt_util.now().date()
    wanted = {(first + timedelta(days=i)).isoformat() for i in range(call.data[ATTR_DAYS])}
    days: list[Any] = [d for d in data.days if d["date"] in wanted]
    if len(days) < len(wanted):
        planned = [d["date"] for d in data.days]
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="date_not_planned",
            translation_placeholders={"first": planned[0], "last": planned[-1]},
        )
    return {
        "updated": data.updated.isoformat(),
        "time_zone": data.time_zone,
        "unavailable_calendars": list(data.unavailable),
        "drive_times": dict(data.drive_times),
        "days": days,
    }
