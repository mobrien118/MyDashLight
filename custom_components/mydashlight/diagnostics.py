"""Diagnostics: what MyDashLight read and planned, without the sign-in or anyone's names."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.const import CONF_TOKEN
from homeassistant.core import HomeAssistant

from .const import (
    CONF_ALL_KIDS,
    CONF_CARPOOLS,
    CONF_DAD_ALIASES,
    CONF_DAD_CALENDARS,
    CONF_DAD_NAME,
    CONF_EVENTS_CALENDAR,
    CONF_KIDS,
    CONF_LUNCH_CALENDAR,
    CONF_LUNCH_DEFAULTS,
    CONF_LUNCH_FEEDS,
    CONF_MOM_ALIASES,
    CONF_MOM_CALENDARS,
    CONF_MOM_NAME,
    CONF_ROUTES_KEY,
)

if TYPE_CHECKING:
    from . import MyDashLightConfigEntry

TO_REDACT = {
    CONF_TOKEN,
    CONF_MOM_NAME,
    CONF_DAD_NAME,
    CONF_MOM_ALIASES,
    CONF_DAD_ALIASES,
    CONF_CARPOOLS,
    CONF_KIDS,
    CONF_ALL_KIDS,
    CONF_MOM_CALENDARS,
    CONF_DAD_CALENDARS,
    CONF_EVENTS_CALENDAR,
    CONF_LUNCH_CALENDAR,
    # Keyed by kid id, which can be the email-like id of a kid's old calendar.
    CONF_LUNCH_DEFAULTS,
    CONF_LUNCH_FEEDS,
    CONF_ROUTES_KEY,
}


async def async_get_config_entry_diagnostics(hass: HomeAssistant, entry: MyDashLightConfigEntry) -> dict[str, Any]:
    coordinator = entry.runtime_data.coordinator
    data = coordinator.data
    settings = entry.runtime_data.settings
    roles = settings.roles
    # Calendar ids are often email addresses, and kid ids can be too (a kid's id is the id of
    # the calendar they had before 0.19), so they're shown by role and position only.
    alias = {k.calendar_id: f"kid {i + 1}" for i, k in enumerate(roles.kids)}
    alias.update({d: d for d in roles.busy})
    alias.update({settings.events_calendar: "family calendar", settings.lunch_calendar: "lunch calendar"})
    out: dict[str, Any] = {
        "entry": {
            "data": async_redact_data(dict(entry.data), TO_REDACT),
            "options": async_redact_data(dict(entry.options), TO_REDACT),
        },
        "calendars": {
            "family": bool(settings.events_calendar),
            "lunch": bool(settings.lunch_calendar),
            "kids": len(roles.kids),
        },
        "last_update_success": coordinator.last_update_success,
    }
    if data is not None:
        out["plan"] = {
            "updated": data.updated.isoformat(),
            "time_zone": data.time_zone,
            "events_read": {alias.get(c, "other"): n for c, n in data.event_counts.items()},
            "unavailable": [alias.get(c, "other") for c in data.unavailable],
            "drive_times": dict(data.drive_times),
            "drive_times_saved": len(entry.runtime_data.coordinator.lookups.cache.entries),
            "days": [
                {
                    "date": d["date"],
                    "events": len(d["events"]),
                    "problems": sum(1 for x in d["issues"] if x["level"] == "problem"),
                    "heads_ups": sum(1 for x in d["issues"] if x["level"] == "heads_up"),
                    "notes_problems": sum(len(e["problems"]) for e in d["events"]),
                    "all_day": len(d.get("all_day", ())),
                    "unplaced": len(d.get("unplaced", ())),
                }
                for d in data.days
            ],
        }
    return out
