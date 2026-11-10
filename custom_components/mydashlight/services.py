"""MyDashLight's services: read the plan, and change rides.

Ride changes are saved in the notes of the event on the kid's Google calendar, then the
plan is read again, so the change shows the same everywhere: in the app, on phones and in
Google Calendar. Nothing about rides is kept in Home Assistant.
"""

from __future__ import annotations

from collections.abc import Callable, Coroutine
from datetime import date, time, timedelta
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse, callback
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import config_validation as cv
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .changes import RideChange, async_save
from .const import (
    ATTR_ATTENDING,
    ATTR_DATE,
    ATTR_DAYS,
    ATTR_DRIVER,
    ATTR_EVENT,
    ATTR_KIDS,
    ATTR_MINUTES,
    ATTR_SCOPE,
    ATTR_SIDE,
    ATTR_STAY,
    ATTR_SUGGESTION,
    ATTR_TIME,
    DOMAIN,
    PLAN_DAYS,
    SCOPE_SERIES,
    SCOPE_THIS,
    SERVICE_APPLY_SUGGESTION,
    SERVICE_GET_PLAN,
    SERVICE_SET_ARRIVE_BY,
    SERVICE_SET_ATTENDING,
    SERVICE_SET_RIDE,
    SERVICE_SET_STAY,
    SERVICE_SET_TAKE_ALONG,
    SERVICE_SET_TAKES,
)
from .coordinator import target_for
from .google import EventNotes, GoogleAuthError, GoogleCalendarUnavailable, GoogleConflict, GoogleError
from .notes import KEEP, Keep
from .planner import HOME

if TYPE_CHECKING:
    from . import MyDashLightConfigEntry

GET_PLAN_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_DATE): cv.date,
        vol.Optional(ATTR_DAYS, default=1): vol.All(vol.Coerce(int), vol.Range(min=1, max=PLAN_DAYS)),
    }
)
_EVENT_FIELDS: dict[vol.Marker, Any] = {
    vol.Required(ATTR_EVENT): cv.string,
    vol.Optional(ATTR_SCOPE, default=SCOPE_THIS): vol.In([SCOPE_THIS, SCOPE_SERIES]),
}
SET_RIDE_SCHEMA = vol.Schema(
    {
        **_EVENT_FIELDS,
        vol.Required(ATTR_SIDE): vol.In(["drop", "pick", "both"]),
        vol.Optional(ATTR_DRIVER, default=""): vol.Any(None, cv.string),
        vol.Optional(ATTR_STAY): cv.boolean,
    }
)
SET_STAY_SCHEMA = vol.Schema({**_EVENT_FIELDS, vol.Required(ATTR_STAY): cv.boolean})
SET_ATTENDING_SCHEMA = vol.Schema({**_EVENT_FIELDS, vol.Required(ATTR_ATTENDING): cv.boolean})
SET_ARRIVE_BY_SCHEMA = vol.Schema({**_EVENT_FIELDS, vol.Optional(ATTR_TIME): vol.Any(None, cv.time)})
SET_TAKE_ALONG_SCHEMA = vol.Schema(
    {
        **_EVENT_FIELDS,
        vol.Optional(ATTR_KIDS, default=[]): vol.All(cv.ensure_list, [cv.string]),
        vol.Optional(ATTR_SIDE, default="drop"): vol.In(["drop", "pick", "both"]),
    }
)
SET_TAKES_SCHEMA = vol.Schema(
    {**_EVENT_FIELDS, vol.Optional(ATTR_MINUTES): vol.Any(None, vol.All(vol.Coerce(int), vol.Range(min=1, max=600)))}
)
APPLY_SUGGESTION_SCHEMA = vol.Schema({vol.Required(ATTR_SUGGESTION): cv.string})


@callback
def async_setup_services(hass: HomeAssistant) -> None:
    hass.services.async_register(
        DOMAIN, SERVICE_GET_PLAN, _async_get_plan, schema=GET_PLAN_SCHEMA, supports_response=SupportsResponse.ONLY
    )
    changes: list[tuple[str, Callable[[ServiceCall], Coroutine[Any, Any, None]], vol.Schema]] = [
        (SERVICE_SET_RIDE, _async_set_ride, SET_RIDE_SCHEMA),
        (SERVICE_SET_STAY, _async_set_stay, SET_STAY_SCHEMA),
        (SERVICE_SET_ATTENDING, _async_set_attending, SET_ATTENDING_SCHEMA),
        (SERVICE_SET_ARRIVE_BY, _async_set_arrive_by, SET_ARRIVE_BY_SCHEMA),
        (SERVICE_SET_TAKE_ALONG, _async_set_take_along, SET_TAKE_ALONG_SCHEMA),
        (SERVICE_SET_TAKES, _async_set_takes, SET_TAKES_SCHEMA),
        (SERVICE_APPLY_SUGGESTION, _async_apply_suggestion, APPLY_SUGGESTION_SCHEMA),
    ]
    for name, handler, schema in changes:
        hass.services.async_register(DOMAIN, name, handler, schema=schema)


def _loaded_entry(hass: HomeAssistant) -> MyDashLightConfigEntry:
    entries: list[MyDashLightConfigEntry] = hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="not_loaded")
    return entries[0]


async def _async_get_plan(call: ServiceCall) -> ServiceResponse:
    entry = _loaded_entry(call.hass)
    coordinator = entry.runtime_data.coordinator
    data = coordinator.data
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
    return coordinator.payload(days)


async def _async_set_ride(call: ServiceCall) -> None:
    driver = call.data[ATTR_DRIVER] or ""
    side = call.data[ATTR_SIDE]
    # Stay goes in the same save, so "the driver stays" and the driver both ways land together.
    change = RideChange(
        drop=driver if side in ("drop", "both") else KEEP,
        pick=driver if side in ("pick", "both") else KEEP,
        stay=call.data.get(ATTR_STAY, KEEP),
    )
    await _async_change_event(call, change)


async def _async_set_stay(call: ServiceCall) -> None:
    await _async_change_event(call, RideChange(stay=call.data[ATTR_STAY]))


async def _async_set_attending(call: ServiceCall) -> None:
    await _async_change_event(call, RideChange(attending=call.data[ATTR_ATTENDING]))


async def _async_set_arrive_by(call: ServiceCall) -> None:
    when: time | None = call.data.get(ATTR_TIME)
    await _async_change_event(call, RideChange(arrive_by=None if when is None else when.hour * 60 + when.minute))


async def _async_set_take_along(call: ServiceCall) -> None:
    """Who rides along. On a kid's event they go after the driver on the Drop-off or Pick-up
    line, both when the driver stays; a parent's own event keeps its Take along line."""
    people = tuple(call.data[ATTR_KIDS])
    found = _loaded_entry(call.hass).runtime_data.coordinator.find(call.data[ATTR_EVENT], None)
    ride = found[1] if found else None
    side = call.data[ATTR_SIDE]
    if ride is not None and ride.own is not None:
        change = RideChange(along=people)
    elif side == "both" or (ride is not None and ride.stay and ride.drop == ride.pick):
        change = RideChange(along=(), drop_riders=people, pick_riders=people)
    elif side == "pick":
        change = RideChange(pick_riders=people)
    else:
        change = RideChange(along=(), drop_riders=people)
    await _async_change_event(call, change)


async def _async_set_takes(call: ServiceCall) -> None:
    """Make a parent's own event an errand that takes this many minutes, or none for a set time."""
    found = _loaded_entry(call.hass).runtime_data.coordinator.find(call.data[ATTR_EVENT], None)
    if found is not None and found[1].own is None:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="errand_on_kid",
            translation_placeholders={"title": found[1].title},
        )
    await _async_change_event(call, RideChange(takes=call.data.get(ATTR_MINUTES)))


async def _async_apply_suggestion(call: ServiceCall) -> None:
    entry = _loaded_entry(call.hass)
    wanted = call.data[ATTR_SUGGESTION]
    for day in entry.runtime_data.coordinator.data.days:
        for issue in day["issues"]:
            for suggestion in issue.get("suggestions", ()):
                if suggestion["id"] == wanted:
                    change = suggestion["change"]
                    value = change["value"]
                    if change["field"] == "along":
                        ride = RideChange(along=tuple(value))
                    elif change["field"] == "drop":
                        ride = RideChange(drop=value)
                    else:
                        ride = RideChange(pick=value)
                    await _async_change_event(call, ride, ride_id=change["id"], day=day["date"])
                    return
    raise ServiceValidationError(translation_domain=DOMAIN, translation_key="suggestion_gone")


async def _async_change_event(
    call: ServiceCall, change: RideChange, *, ride_id: str | None = None, day: str | None = None
) -> None:
    """Save a change to one planned event, or to every one when it repeats and that's asked."""
    entry = _loaded_entry(call.hass)
    coordinator = entry.runtime_data.coordinator
    ride_id = ride_id or call.data[ATTR_EVENT]
    found = coordinator.find(ride_id, day)
    if found is None:
        raise ServiceValidationError(
            translation_domain=DOMAIN, translation_key="event_not_found", translation_placeholders={"event": ride_id}
        )
    _, ride, ref = found
    if ride.loc == HOME and change.rides:
        raise ServiceValidationError(
            translation_domain=DOMAIN, translation_key="at_home", translation_placeholders={"title": ride.title}
        )
    if ride.own is not None and not all(isinstance(v, Keep) for v in (change.drop, change.pick, change.stay)):
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="own_event",
            translation_placeholders={"title": ride.title, "driver": coordinator.settings.directory.display(ride.own)},
        )
    target = target_for(ride, ref)
    series = ref.recurring_id if call.data.get(ATTR_SCOPE) == SCOPE_SERIES else None
    also = coordinator.occurrences(ref.calendar_id, series) if series else []
    saved: list[tuple[str, EventNotes]] = []
    async with entry.runtime_data.write_lock:
        try:
            written = await async_save(
                entry.runtime_data.api,
                coordinator.settings.directory,
                target,
                change,
                series=series,
                also=also,
                saved=saved,
            )
        except GoogleAuthError as err:
            entry.async_start_reauth(call.hass)
            raise HomeAssistantError(translation_domain=DOMAIN, translation_key="auth_failed") from err
        except GoogleConflict as err:
            raise HomeAssistantError(translation_domain=DOMAIN, translation_key="write_conflict") from err
        except GoogleCalendarUnavailable as err:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="cant_change_event",
                translation_placeholders={"title": ride.title},
            ) from err
        except GoogleError as err:
            raise HomeAssistantError(
                translation_domain=DOMAIN, translation_key="write_failed", translation_placeholders={"error": str(err)}
            ) from err
        if written:
            coordinator.note_saved(saved)
            await coordinator.async_refresh()
