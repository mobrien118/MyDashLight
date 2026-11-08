"""MyDashLight's chore services: read the chores, check one off, and add, change or remove
chore templates.

Everything is saved in Google Tasks, then the chores are read again, so a change shows the
same on the board, in the Google Tasks app and on phones.
"""

from __future__ import annotations

from dataclasses import replace
from datetime import date
import secrets
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse, callback
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import config_validation as cv
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .chore_rules import REPEATS, DaysError, Repeats, Template, kid_for, parse_days, split_icon, template_notes
from .chores import done_by_notes
from .const import (
    ATTR_BY,
    ATTR_CHORE,
    ATTR_DONE,
    ATTR_TEMPLATE,
    DOMAIN,
    SERVICE_GET_CHORES,
    SERVICE_REMOVE_CHORE_TEMPLATE,
    SERVICE_SAVE_CHORE_TEMPLATE,
    SERVICE_SET_CHORE_DONE,
)
from .google import GoogleAuthError, GoogleError
from .tasks_api import TasksNeedSignIn, TasksNotFound

if TYPE_CHECKING:
    from . import MyDashLightConfigEntry
    from .chore_coordinator import ChoreCoordinator

SET_CHORE_DONE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_CHORE): cv.string,
        vol.Optional(ATTR_DONE, default=True): cv.boolean,
        vol.Optional(ATTR_BY): cv.string,
    }
)
SAVE_TEMPLATE_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_TEMPLATE): cv.string,
        vol.Optional("repeats"): vol.In(REPEATS),
        vol.Optional("title"): cv.string,
        vol.Optional("icon"): vol.Any(None, cv.string),
        vol.Optional("details"): vol.Any(None, cv.string),
        vol.Optional("who"): vol.All(cv.ensure_list, [cv.string]),
        vol.Optional("take_turns"): cv.boolean,
        vol.Optional("days"): vol.Any(None, cv.string),
        vol.Optional("every"): vol.All(vol.Coerce(int), vol.Range(min=1, max=52)),
        vol.Optional("starts"): cv.date,
        vol.Optional("ends"): vol.Any(None, cv.date),
        vol.Optional("points"): vol.Any(None, vol.All(vol.Coerce(int), vol.Range(min=0, max=1000))),
        vol.Optional("paused"): cv.boolean,
        vol.Optional("night_before"): cv.boolean,
        vol.Optional("bring_only"): cv.boolean,
    }
)
REMOVE_TEMPLATE_SCHEMA = vol.Schema({vol.Required(ATTR_TEMPLATE): cv.string})


@callback
def async_setup_chore_services(hass: HomeAssistant) -> None:
    hass.services.async_register(DOMAIN, SERVICE_GET_CHORES, _async_get_chores, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, SERVICE_SET_CHORE_DONE, _async_set_chore_done, schema=SET_CHORE_DONE_SCHEMA)
    hass.services.async_register(
        DOMAIN,
        SERVICE_SAVE_CHORE_TEMPLATE,
        _async_save_template,
        schema=SAVE_TEMPLATE_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN, SERVICE_REMOVE_CHORE_TEMPLATE, _async_remove_template, schema=REMOVE_TEMPLATE_SCHEMA
    )


def _loaded(hass: HomeAssistant) -> tuple[MyDashLightConfigEntry, ChoreCoordinator]:
    entries: list[MyDashLightConfigEntry] = hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="not_loaded")
    entry = entries[0]
    chores = entry.runtime_data.chores
    if chores.data is not None and chores.data.needs is not None:
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key=f"chores_{chores.data.needs}")
    return entry, chores


async def _async_get_chores(call: ServiceCall) -> ServiceResponse:
    entries: list[MyDashLightConfigEntry] = call.hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="not_loaded")
    return entries[0].runtime_data.chores.payload()


async def _async_set_chore_done(call: ServiceCall) -> None:
    entry, coordinator = _loaded(call.hass)
    chore = coordinator.find_chore(call.data[ATTR_CHORE])
    if chore is None or chore.closed:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="chore_not_found",
            translation_placeholders={"chore": call.data[ATTR_CHORE]},
        )
    done: bool = call.data[ATTR_DONE]
    people = coordinator.people
    by = chore.kid
    if ATTR_BY in call.data:
        found = kid_for(call.data[ATTR_BY], people)
        if found is None:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="unknown_person",
                translation_placeholders={"name": call.data[ATTR_BY]},
            )
        by = found
    # Who did it is saved on the chore itself, so the history stays in Google Tasks.
    notes = done_by_notes(chore.task.notes, people.get(by, by) if done else None)
    if done == chore.done and notes == chore.task.notes:
        return
    async with coordinator.write_lock:
        saved = await _async_google(
            entry,
            call,
            coordinator.api.async_update(
                chore.list_id,
                chore.task.id,
                notes=notes if notes != chore.task.notes else None,
                done=done if done != chore.done else None,
            ),
        )
    # Every board shows it now; nothing else changes with a check-off, so the next read is soon enough.
    coordinator.async_saved_task(chore, saved)


async def _async_save_template(call: ServiceCall) -> ServiceResponse:
    entry, coordinator = _loaded(call.hass)
    data = coordinator.data
    if data is None or not data.seed_list:
        raise HomeAssistantError(translation_domain=DOMAIN, translation_key="chores_not_ready")
    kids = coordinator.kids
    old: Template | None = None
    if ATTR_TEMPLATE in call.data:
        old = coordinator.find_template(call.data[ATTR_TEMPLATE])
        if old is None:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="template_not_found",
                translation_placeholders={"template": call.data[ATTR_TEMPLATE]},
            )
    template = build_template(call.data, old, kids, dt_util.now().date())
    notes = template_notes(template, kids)
    seeds = data.seed_list
    api = coordinator.api
    async with coordinator.write_lock:
        if old is not None:
            await _async_google(
                entry,
                call,
                api.async_update(seeds, old.task_id, title=template.title, notes=notes, done=template.paused),
            )
        else:
            made = await _async_google(entry, call, api.async_insert(seeds, template.title, notes))
            if template.paused:
                await _async_google(entry, call, api.async_update(seeds, made.id, done=True))
            template = replace(template, task_id=made.id)
    # The editor and every board show the template now, and its chores once they're made.
    coordinator.async_saved_template(replace(template, position=old.position) if old else template)
    await coordinator.async_refresh()
    return {"template": template.id} if call.return_response else None


async def _async_remove_template(call: ServiceCall) -> None:
    entry, coordinator = _loaded(call.hass)
    template = coordinator.find_template(call.data[ATTR_TEMPLATE])
    data = coordinator.data
    if template is None or data is None:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="template_not_found",
            translation_placeholders={"template": call.data[ATTR_TEMPLATE]},
        )
    async with coordinator.write_lock:
        await _async_google(entry, call, coordinator.api.async_delete(data.seed_list, template.task_id))
    coordinator.async_saved_template(None, removed=template.id)
    # The next read removes the chores it made that aren't done yet.
    await coordinator.async_refresh()


def build_template(fields: dict[str, Any], old: Template | None, kids: dict[str, str], today: date) -> Template:
    """A template from the service's fields, starting from ``old`` when changing one.

    Raises :class:`ServiceValidationError` when the fields don't make a chore.
    """

    def pick(name: str, default: Any) -> Any:
        return fields.get(name, default)

    repeats: Repeats | None = pick("repeats", old.repeats if old else None)
    old_icon, old_title = split_icon(old.title) if old else (None, "")
    typed_icon, title = split_icon(str(pick("title", old_title) or ""))
    icon = " ".join(str(pick("icon", old_icon) or "").split()) or typed_icon
    if repeats is None or not title:
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="template_incomplete")
    if "who" in fields:
        who: list[str] = []
        for name in fields["who"]:
            kid = kid_for(name, kids)
            if kid is None:
                raise ServiceValidationError(
                    translation_domain=DOMAIN, translation_key="unknown_kid", translation_placeholders={"name": name}
                )
            if kid not in who:
                who.append(kid)
    else:
        who = list(old.who) if old else []
    if not who:
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="template_incomplete")
    # A different kind of repeat starts over on its days and how many apart: a week's days
    # and a month's are different things, and so are 2 days and 2 weeks.
    same_kind = old is not None and old.repeats == repeats
    days_text = fields.get("days", old.days_label if old and same_kind else "")
    try:
        days = parse_days(days_text or "", repeats)
    except DaysError as err:
        raise ServiceValidationError(
            translation_domain=DOMAIN, translation_key="bad_days", translation_placeholders={"days": days_text or ""}
        ) from err
    if repeats == "daily" and days.weekdays:
        # Picking days means weekly; a daily chore is every day, or every few days.
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="daily_no_days")
    every = int(pick("every", old.every if old and same_kind else 1)) if repeats != "school" else 1
    starts: date = pick("starts", (old.starts if old else None) or today)
    ends: date | None = pick("ends", old.ends if old else None)
    if ends is not None and ends < starts:
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="ends_before_starts")
    return Template(
        id=old.id if old else secrets.token_hex(5),
        task_id=old.task_id if old else "",
        repeats=repeats,
        title=f"{icon} {title}" if icon else title,
        details=str(pick("details", old.details if old else "") or "").strip(),
        who=tuple(who),
        take_turns=bool(pick("take_turns", old.take_turns if old else False)) and len(who) > 1,
        days=days,
        every=every,
        starts=starts,
        ends=ends,
        points=pick("points", old.points if old else None),
        paused=bool(pick("paused", old.paused if old else False)),
        night_before=repeats == "school" and bool(pick("night_before", old.night_before if old else False)),
        bring_only=repeats == "school" and bool(pick("bring_only", old.bring_only if old else False)),
    )


async def _async_google(entry: MyDashLightConfigEntry, call: ServiceCall, request: Any) -> Any:
    """Run one call to Google Tasks, turning its errors into ones people can act on."""
    try:
        return await request
    except GoogleAuthError as err:
        entry.async_start_reauth(call.hass)
        raise HomeAssistantError(translation_domain=DOMAIN, translation_key="auth_failed") from err
    except TasksNeedSignIn as err:
        entry.async_start_reauth(call.hass)
        raise HomeAssistantError(translation_domain=DOMAIN, translation_key="chores_sign_in") from err
    except TasksNotFound as err:
        raise HomeAssistantError(translation_domain=DOMAIN, translation_key="chore_changed") from err
    except GoogleError as err:
        raise HomeAssistantError(
            translation_domain=DOMAIN, translation_key="write_failed", translation_placeholders={"error": str(err)}
        ) from err
