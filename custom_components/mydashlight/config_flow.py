"""Config flow for MyDashLight: Google sign-in, the parents' names, and which calendars to read."""

from __future__ import annotations

from collections.abc import Iterable, Mapping
from datetime import timedelta
import logging
import re
from typing import TYPE_CHECKING, Any

from homeassistant.config_entries import (
    SOURCE_REAUTH,
    ConfigEntry,
    ConfigFlowResult,
    OptionsFlowWithReload,
)
from homeassistant.const import CONF_ACCESS_TOKEN, CONF_TOKEN
from homeassistant.core import callback
from homeassistant.data_entry_flow import section
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.config_entry_oauth2_flow import AbstractOAuth2FlowHandler
from homeassistant.helpers.selector import (
    BooleanSelector,
    EntitySelector,
    EntitySelectorConfig,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectOptionDict,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
    TextSelectorConfig,
    TextSelectorType,
)
from homeassistant.util import dt as dt_util, slugify
import voluptuous as vol

from .alerts import notify_services
from .const import (
    CONF_ALIASES,
    CONF_ALL_KIDS,
    CONF_CALENDAR_REMINDERS,
    CONF_CARPOOLS,
    CONF_CHORE_DAYS,
    CONF_DAD_ALIASES,
    CONF_DAD_NAME,
    CONF_DAD_NOTIFY,
    CONF_DAD_PERSON,
    CONF_EVENTS_CALENDAR,
    CONF_GO_HOME_MARGIN,
    CONF_HOME_ADDRESS,
    CONF_KID_ID,
    CONF_KID_NOTIFY,
    CONF_KIDS,
    CONF_LUNCH_CALENDAR,
    CONF_LUNCH_DEFAULTS,
    CONF_LUNCH_FEEDS,
    CONF_MOM_ALIASES,
    CONF_MOM_NAME,
    CONF_MOM_NOTIFY,
    CONF_MOM_PERSON,
    CONF_NAME,
    CONF_NO_ADDRESS_TRAVEL,
    CONF_NO_DRIVER_ALERTS,
    CONF_NO_DRIVER_HOURS,
    CONF_PLANNER,
    CONF_REMIND_BEFORE,
    CONF_REMOVE_ROUTES_KEY,
    CONF_ROUTES_DAILY_LIMIT,
    CONF_ROUTES_KEY,
    CONF_TAKE_ALONG_WINDOW,
    CONF_TIGHT_SLACK,
    CONF_TOO_EARLY,
    CONF_WAITING_AFTER,
    DEFAULT_CHORE_DAYS,
    DEFAULT_NO_DRIVER_HOURS,
    DEFAULT_PLANNER,
    DEFAULT_REMIND_BEFORE,
    DEFAULT_ROUTES_DAILY_LIMIT,
    DOMAIN,
    DRIVERS,
    MAX_CHORE_DAYS,
    NOTIFY_OFF,
    SCOPES,
    TITLE,
)
from .google import CalendarInfo, GoogleApiDisabled, GoogleAuthError, GoogleCalendarApi, GoogleError, StaticToken
from .lunch_coordinator import MenuFeedError, async_read_menu_feed
from .menu_feed import webcal_to_https
from .routes import Place, RoutesApi, RoutesError, RoutesKeyError, RoutesNoRoute, RoutesQuotaError
from .settings import HubSettings, kid_id

if TYPE_CHECKING:
    from . import MyDashLightConfigEntry

_LOGGER = logging.getLogger(__name__)

_NAME = TextSelector()
_NAMES = TextSelector(TextSelectorConfig(multiple=True))


def _minutes(maximum: int) -> NumberSelector:
    return NumberSelector(
        NumberSelectorConfig(min=0, max=maximum, step=1, mode=NumberSelectorMode.BOX, unit_of_measurement="min")
    )


_PLANNER_LIMITS = {
    CONF_GO_HOME_MARGIN: 120,
    CONF_TAKE_ALONG_WINDOW: 180,
    CONF_WAITING_AFTER: 60,
    CONF_TOO_EARLY: 120,
    CONF_TIGHT_SLACK: 30,
    CONF_NO_ADDRESS_TRAVEL: 120,
}


def _people(options: Mapping[str, Any]) -> list[tuple[str, str]]:
    """Each parent and kid as (the name their notifier field shows, their id)."""
    out: list[tuple[str, str]] = [
        (_clean_name(options.get(CONF_MOM_NAME) or "") or "First parent", "mom"),
        (_clean_name(options.get(CONF_DAD_NAME) or "") or "Second parent", "dad"),
    ]
    for kid in options.get(CONF_KIDS) or []:
        if isinstance(kid, Mapping) and kid_id(kid):
            label = _clean_name(kid.get(CONF_NAME) or "") or kid_id(kid)
            while any(label.casefold() == taken.casefold() for taken, _ in out):
                label += " (kid)"
            out.append((label, kid_id(kid)))
    return out


def _feed_fields(kids: list[tuple[str, str]]) -> list[tuple[str, str]]:
    """Each kid's menu feed box on the Lunch form, as (the label it shows, the kid's id)."""
    out: list[tuple[str, str]] = []
    for kid, name in kids:
        label = f"{_clean_name(name) or kid}'s menu feed"
        while any(label == taken for taken, _ in out) or label == CONF_BRING_BY_DEFAULT:
            label += " (2)"
        out.append((label, kid))
    return out


def _clean_name(value: str) -> str:
    return " ".join(str(value).split())


def _names_schema(defaults: Mapping[str, Any]) -> dict[vol.Marker, Any]:
    return {
        vol.Required(CONF_MOM_NAME, default=defaults.get(CONF_MOM_NAME, "")): _NAME,
        vol.Required(CONF_DAD_NAME, default=defaults.get(CONF_DAD_NAME, "")): _NAME,
    }


def _validate_names(user_input: Mapping[str, Any]) -> dict[str, str]:
    errors: dict[str, str] = {}
    mom = _clean_name(user_input.get(CONF_MOM_NAME, ""))
    dad = _clean_name(user_input.get(CONF_DAD_NAME, ""))
    if not mom:
        errors[CONF_MOM_NAME] = "name_required"
    if not dad:
        errors[CONF_DAD_NAME] = "name_required"
    if mom and dad and mom.casefold() == dad.casefold():
        errors[CONF_DAD_NAME] = "names_match"
    return errors


def _calendars_schema(calendars: list[CalendarInfo], current: Mapping[str, Any]) -> vol.Schema:
    options = [SelectOptionDict(value=c.id, label=c.name) for c in sorted(calendars, key=lambda c: c.name.casefold())]
    known = {c.id for c in calendars}

    def one() -> SelectSelector:
        return SelectSelector(SelectSelectorConfig(options=options, mode=SelectSelectorMode.DROPDOWN))

    events = current.get(CONF_EVENTS_CALENDAR)
    lunch = current.get(CONF_LUNCH_CALENDAR)
    events_key = (
        vol.Required(CONF_EVENTS_CALENDAR, default=events) if events in known else vol.Required(CONF_EVENTS_CALENDAR)
    )
    return vol.Schema(
        {
            events_key: one(),
            vol.Optional(
                CONF_LUNCH_CALENDAR, description={"suggested_value": lunch if lunch in known else None}
            ): one(),
            vol.Required(CONF_KIDS, default=_kid_names(current.get(CONF_KIDS))): _NAMES,
        }
    )


def _kid_names(value: object) -> list[str]:
    """The kids' names from saved options (a list of kids) or a form (a list of names)."""
    if not isinstance(value, (list, tuple)):
        return []
    out: list[str] = []
    for item in value:
        name = _clean_name(item.get(CONF_NAME) or "") if isinstance(item, Mapping) else _clean_name(str(item))
        if name:
            out.append(name)
    return out


def _validate_calendars(user_input: Mapping[str, Any], parents: Iterable[str]) -> dict[str, str]:
    names = _kid_names(user_input.get(CONF_KIDS))
    folded = [n.casefold() for n in names]
    if not user_input.get(CONF_EVENTS_CALENDAR):
        return {CONF_EVENTS_CALENDAR: "events_calendar_required"}
    if user_input.get(CONF_LUNCH_CALENDAR) and user_input.get(CONF_LUNCH_CALENDAR) == user_input[CONF_EVENTS_CALENDAR]:
        return {CONF_LUNCH_CALENDAR: "lunch_on_events_calendar"}
    if not names:
        return {CONF_KIDS: "kids_required"}
    if len(set(folded)) != len(folded):
        return {CONF_KIDS: "kid_names_match"}
    if any(_clean_name(p).casefold() in folded for p in parents):
        return {CONF_KIDS: "kid_named_like_parent"}
    return {}


def _kids_from(names: Iterable[str], current: object) -> list[dict[str, Any]]:
    """The kids for the options, in the order given. A kid already set up keeps their id and
    other names, so everything saved for them carries over; a new kid gets a new id."""
    old: dict[str, Mapping[str, Any]] = {}
    if isinstance(current, (list, tuple)):
        for item in current:
            if isinstance(item, Mapping) and kid_id(item):
                old.setdefault(_clean_name(item.get(CONF_NAME) or "").casefold(), item)
    out: list[dict[str, Any]] = []
    for name in names:
        before = old.get(name.casefold())
        if before is not None:
            kid = kid_id(before)
            aliases = list(before.get(CONF_ALIASES) or [])
        else:
            base = "kid-" + (slugify(name) or "kid")
            kid, n = base, 2
            taken = {k[CONF_KID_ID] for k in out} | {kid_id(i) for i in old.values()}
            while kid in taken:
                kid, n = f"{base}-{n}", n + 1
            aliases = []
        out.append({CONF_KID_ID: kid, CONF_NAME: name, CONF_ALIASES: aliases})
    return out


def _alias_fields(kids: Iterable[tuple[str, str]]) -> list[tuple[str, str]]:
    """Each kid's other-names box on the Settings form, as (the label it shows, the kid's id)."""
    out: list[tuple[str, str]] = []
    for kid, name in kids:
        label = f"{name}'s other names"
        while any(label == taken for taken, _ in out):
            label += " (2)"
        out.append((label, kid))
    return out


async def _list_calendars(api: GoogleCalendarApi) -> tuple[list[CalendarInfo] | None, str | None]:
    """The account's calendars, or the reason to stop."""
    try:
        return await api.async_list_calendars(), None
    except GoogleApiDisabled:
        return None, "api_disabled"
    except GoogleAuthError:
        return None, "oauth_unauthorized"
    except GoogleError as err:
        _LOGGER.warning("Couldn't list the Google calendars: %s", err)
        return None, "cannot_connect"


class MyDashLightConfigFlow(AbstractOAuth2FlowHandler, domain=DOMAIN):
    """Sign in to Google, then name the parents and pick the calendars."""

    DOMAIN = DOMAIN
    VERSION = 1

    def __init__(self) -> None:
        super().__init__()
        self._oauth_data: dict[str, Any] = {}
        self._calendars: list[CalendarInfo] = []
        self._options: dict[str, Any] = {}

    @property
    def logger(self) -> logging.Logger:
        return _LOGGER

    @property
    def extra_authorize_data(self) -> dict[str, Any]:
        # offline and consent so Google always sends a refresh token.
        return {"scope": " ".join(SCOPES), "access_type": "offline", "prompt": "consent"}

    async def async_oauth_create_entry(self, data: dict[str, Any]) -> ConfigFlowResult:
        api = GoogleCalendarApi(async_get_clientsession(self.hass), StaticToken(data[CONF_TOKEN][CONF_ACCESS_TOKEN]))
        calendars, reason = await _list_calendars(api)
        if calendars is None:
            return self.async_abort(reason=reason or "cannot_connect")
        primary = next((c for c in calendars if c.primary), None)
        if primary is None:
            return self.async_abort(reason="no_primary_calendar")
        # The primary calendar's id is the account's email address.
        await self.async_set_unique_id(primary.id)
        if self.source == SOURCE_REAUTH:
            self._abort_if_unique_id_mismatch(reason="wrong_account")
            return self.async_update_reload_and_abort(self._get_reauth_entry(), data=data)
        self._abort_if_unique_id_configured()
        self._oauth_data = data
        self._calendars = calendars
        return await self.async_step_parents()

    async def async_step_parents(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            errors = _validate_names(user_input)
            if not errors:
                self._options = {
                    CONF_MOM_NAME: _clean_name(user_input[CONF_MOM_NAME]),
                    CONF_DAD_NAME: _clean_name(user_input[CONF_DAD_NAME]),
                    CONF_MOM_ALIASES: [],
                    CONF_DAD_ALIASES: [],
                    CONF_CARPOOLS: [],
                    CONF_PLANNER: dict(DEFAULT_PLANNER),
                }
                return await self.async_step_calendars()
        return self.async_show_form(
            step_id="parents", data_schema=vol.Schema(_names_schema(user_input or {})), errors=errors
        )

    async def async_step_calendars(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            errors = _validate_calendars(user_input, (self._options[CONF_MOM_NAME], self._options[CONF_DAD_NAME]))
            if not errors:
                return self.async_create_entry(
                    title=TITLE,
                    data=self._oauth_data,
                    options={
                        **self._options,
                        CONF_EVENTS_CALENDAR: user_input[CONF_EVENTS_CALENDAR],
                        CONF_LUNCH_CALENDAR: user_input.get(CONF_LUNCH_CALENDAR) or None,
                        CONF_KIDS: _kids_from(_kid_names(user_input[CONF_KIDS]), []),
                        CONF_ALL_KIDS: [],
                    },
                )
        return self.async_show_form(
            step_id="calendars",
            data_schema=_calendars_schema(self._calendars, user_input or {}),
            errors=errors,
            description_placeholders={"account": self.unique_id or ""},
        )

    async def async_step_reauth(self, entry_data: Mapping[str, Any]) -> ConfigFlowResult:
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is None:
            return self.async_show_form(
                step_id="reauth_confirm",
                description_placeholders={"account": self._get_reauth_entry().unique_id or ""},
            )
        return await self.async_step_user()

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> MyDashLightOptionsFlow:
        return MyDashLightOptionsFlow()


CONF_BRING_BY_DEFAULT = "bring_by_default"


class MyDashLightOptionsFlow(OptionsFlowWithReload):
    """Names, carpool drivers and planner timing, or which calendars to read."""

    config_entry: MyDashLightConfigEntry

    def __init__(self) -> None:
        self._calendars: list[CalendarInfo] = []

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        return self.async_show_menu(
            step_id="init", menu_options=["settings", "calendars", "lunch", "drive_times", "reminders"]
        )

    async def async_step_settings(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        options: Mapping[str, Any] = self.config_entry.options
        current: Mapping[str, Any] = options
        kids = [k for k in options.get(CONF_KIDS) or [] if isinstance(k, Mapping) and kid_id(k)]
        alias_fields = _alias_fields((kid_id(k), _clean_name(k.get(CONF_NAME) or "") or kid_id(k)) for k in kids)
        if user_input is not None:
            errors = _validate_names(user_input)
            if not errors:
                user_input = dict(user_input)
                aliases = {kid: user_input.pop(label, []) for label, kid in alias_fields}
                return self.async_create_entry(
                    data={
                        **options,
                        **user_input,
                        CONF_KIDS: [{**k, CONF_ALIASES: list(aliases.get(kid_id(k), []))} for k in kids],
                        CONF_MOM_NAME: _clean_name(user_input[CONF_MOM_NAME]),
                        CONF_DAD_NAME: _clean_name(user_input[CONF_DAD_NAME]),
                        CONF_PLANNER: {k: int(v) for k, v in user_input[CONF_PLANNER].items()},
                        CONF_CHORE_DAYS: int(user_input.get(CONF_CHORE_DAYS, DEFAULT_CHORE_DAYS)),
                    }
                )
            current = user_input
        planner = {**DEFAULT_PLANNER, **current.get(CONF_PLANNER, {})}
        saved_aliases = {kid_id(k): list(k.get(CONF_ALIASES) or []) for k in kids}
        alias_schema: dict[vol.Marker, Any] = {
            vol.Optional(label, default=current[label] if label in current else saved_aliases.get(kid, [])): _NAMES
            for label, kid in alias_fields
        }
        schema = vol.Schema(
            {
                **_names_schema(current),
                vol.Optional(CONF_MOM_ALIASES, default=current.get(CONF_MOM_ALIASES, [])): _NAMES,
                vol.Optional(CONF_DAD_ALIASES, default=current.get(CONF_DAD_ALIASES, [])): _NAMES,
                **alias_schema,
                vol.Optional(CONF_ALL_KIDS, default=current.get(CONF_ALL_KIDS, [])): _NAMES,
                vol.Optional(CONF_CARPOOLS, default=current.get(CONF_CARPOOLS, [])): _NAMES,
                vol.Optional(CONF_HOME_ADDRESS, default=current.get(CONF_HOME_ADDRESS, "")): _NAME,
                vol.Required(CONF_CHORE_DAYS, default=current.get(CONF_CHORE_DAYS, DEFAULT_CHORE_DAYS)): NumberSelector(
                    NumberSelectorConfig(
                        min=1, max=MAX_CHORE_DAYS, step=1, mode=NumberSelectorMode.BOX, unit_of_measurement="days"
                    )
                ),
                vol.Required(CONF_PLANNER): section(
                    vol.Schema(
                        {
                            vol.Required(key, default=planner[key]): _minutes(limit)
                            for key, limit in _PLANNER_LIMITS.items()
                        }
                    ),
                    {"collapsed": True},
                ),
            }
        )
        return self.async_show_form(step_id="settings", data_schema=schema, errors=errors)

    async def async_step_calendars(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if not self._calendars:
            runtime = getattr(self.config_entry, "runtime_data", None)
            if runtime is None:
                return self.async_abort(reason="not_loaded")
            calendars, reason = await _list_calendars(runtime.api)
            if calendars is None:
                return self.async_abort(reason=reason or "cannot_connect")
            self._calendars = calendars
        options: Mapping[str, Any] = self.config_entry.options
        current: Mapping[str, Any] = options
        if user_input is not None:
            errors = _validate_calendars(user_input, (options.get(CONF_MOM_NAME, ""), options.get(CONF_DAD_NAME, "")))
            if not errors:
                return self.async_create_entry(
                    data={
                        **options,
                        CONF_EVENTS_CALENDAR: user_input[CONF_EVENTS_CALENDAR],
                        CONF_LUNCH_CALENDAR: user_input.get(CONF_LUNCH_CALENDAR) or None,
                        CONF_KIDS: _kids_from(_kid_names(user_input[CONF_KIDS]), options.get(CONF_KIDS)),
                    }
                )
            current = user_input
        return self.async_show_form(
            step_id="calendars",
            data_schema=_calendars_schema(self._calendars, current),
            errors=errors,
            description_placeholders={"account": self.config_entry.unique_id or ""},
        )

    async def async_step_drive_times(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """The Google Routes key and how many lookups a day it may make."""
        errors: dict[str, str] = {}
        entry = self.config_entry
        has_key = bool(entry.options.get(CONF_ROUTES_KEY))
        if user_input is not None:
            new_key = str(user_input.get(CONF_ROUTES_KEY) or "").strip()
            remove = bool(user_input.get(CONF_REMOVE_ROUTES_KEY))
            if new_key and not remove:
                errors = await self._check_routes_key(new_key)
            if not errors:
                options = {**entry.options, CONF_ROUTES_DAILY_LIMIT: int(user_input[CONF_ROUTES_DAILY_LIMIT])}
                if remove:
                    options.pop(CONF_ROUTES_KEY, None)
                elif new_key:
                    options[CONF_ROUTES_KEY] = new_key
                return self.async_create_entry(data=options)
        limit = (user_input or entry.options).get(CONF_ROUTES_DAILY_LIMIT, DEFAULT_ROUTES_DAILY_LIMIT)
        fields: dict[vol.Marker, Any] = {
            vol.Optional(CONF_ROUTES_KEY): TextSelector(TextSelectorConfig(type=TextSelectorType.PASSWORD)),
            vol.Required(CONF_ROUTES_DAILY_LIMIT, default=limit): NumberSelector(
                NumberSelectorConfig(min=0, max=5000, step=1, mode=NumberSelectorMode.BOX)
            ),
        }
        if has_key:
            fields[vol.Optional(CONF_REMOVE_ROUTES_KEY, default=False)] = BooleanSelector()
        return self.async_show_form(
            step_id="drive_times",
            data_schema=vol.Schema(fields),
            errors=errors,
            description_placeholders={"key_state": "set" if has_key else "not set"},
        )

    async def async_step_reminders(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Who gets reminders on their phone, and when."""
        options = self.config_entry.options
        people = _people(options)
        if user_input is not None:
            kid_notify = {who: user_input.get(label, NOTIFY_OFF) for label, who in people if who not in DRIVERS}
            by_driver = {who: user_input.get(label, NOTIFY_OFF) for label, who in people if who in DRIVERS}
            return self.async_create_entry(
                data={
                    **options,
                    CONF_MOM_NOTIFY: by_driver.get("mom", NOTIFY_OFF),
                    CONF_DAD_NOTIFY: by_driver.get("dad", NOTIFY_OFF),
                    CONF_KID_NOTIFY: kid_notify,
                    CONF_MOM_PERSON: user_input.get(CONF_MOM_PERSON) or None,
                    CONF_DAD_PERSON: user_input.get(CONF_DAD_PERSON) or None,
                    CONF_REMIND_BEFORE: int(user_input[CONF_REMIND_BEFORE]),
                    CONF_CALENDAR_REMINDERS: bool(user_input[CONF_CALENDAR_REMINDERS]),
                    CONF_NO_DRIVER_ALERTS: bool(user_input[CONF_NO_DRIVER_ALERTS]),
                    CONF_NO_DRIVER_HOURS: int(user_input[CONF_NO_DRIVER_HOURS]),
                }
            )
        current = {
            "mom": options.get(CONF_MOM_NOTIFY) or NOTIFY_OFF,
            "dad": options.get(CONF_DAD_NOTIFY) or NOTIFY_OFF,
            **(options.get(CONF_KID_NOTIFY) or {}),
        }
        services = notify_services(self.hass)
        fields: dict[vol.Marker, Any] = {}
        for label, who in people:
            value = current.get(who) or NOTIFY_OFF
            choices = [*services, value] if value != NOTIFY_OFF and value not in services else services
            fields[vol.Optional(label, default=value)] = SelectSelector(
                SelectSelectorConfig(
                    options=[
                        SelectOptionDict(value=NOTIFY_OFF, label="No reminders"),
                        *(SelectOptionDict(value=c, label=f"notify.{c}") for c in choices),
                    ],
                    mode=SelectSelectorMode.DROPDOWN,
                )
            )
        for key in (CONF_MOM_PERSON, CONF_DAD_PERSON):
            fields[vol.Optional(key, description={"suggested_value": options.get(key)})] = EntitySelector(
                EntitySelectorConfig(domain="person")
            )
        fields[vol.Required(CONF_REMIND_BEFORE, default=options.get(CONF_REMIND_BEFORE, DEFAULT_REMIND_BEFORE))] = (
            _minutes(120)
        )
        fields[vol.Required(CONF_CALENDAR_REMINDERS, default=options.get(CONF_CALENDAR_REMINDERS, True))] = (
            BooleanSelector()
        )
        fields[vol.Required(CONF_NO_DRIVER_ALERTS, default=options.get(CONF_NO_DRIVER_ALERTS, True))] = (
            BooleanSelector()
        )
        fields[
            vol.Required(CONF_NO_DRIVER_HOURS, default=options.get(CONF_NO_DRIVER_HOURS, DEFAULT_NO_DRIVER_HOURS))
        ] = NumberSelector(
            NumberSelectorConfig(min=1, max=168, step=1, mode=NumberSelectorMode.BOX, unit_of_measurement="h")
        )
        return self.async_show_form(step_id="reminders", data_schema=vol.Schema(fields))

    async def async_step_lunch(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Which kids bring lunch on a school day nobody picked for (the rest buy), and each kid's
        school menu feed: an iCal address, read every few hours. Optional."""
        options = self.config_entry.options
        settings = HubSettings.from_options(options)
        kids = settings.roles.kids
        # One feed box per kid, labelled with their name.
        fields = _feed_fields([(k.calendar_id, k.name) for k in kids])
        errors: dict[str, str] = {}
        if user_input is not None:
            feeds: dict[str, str] = {}
            checked: set[str] = set()
            for label, kid in fields:
                url = webcal_to_https(str(user_input.get(label) or ""))
                if url and not re.match(r"^https?://\S+$", url, re.IGNORECASE):
                    errors[label] = "feed_not_web"
                    continue
                if url and url != settings.lunch_feeds.get(kid) and url not in checked:
                    try:
                        await async_read_menu_feed(async_get_clientsession(self.hass), url)
                    except MenuFeedError as err:
                        _LOGGER.warning("Couldn't read the menu feed %s: %s", url, err)
                        errors[label] = "feed_unreadable"
                        continue
                    checked.add(url)
                if url:
                    feeds[kid] = url
            if not errors:
                bring = set(user_input.get(CONF_BRING_BY_DEFAULT) or [])
                return self.async_create_entry(
                    data={
                        **options,
                        CONF_LUNCH_DEFAULTS: {
                            k.calendar_id: "bring" if k.calendar_id in bring else "buy" for k in kids
                        },
                        CONF_LUNCH_FEEDS: feeds,
                    }
                )
        bring_now = (
            list(user_input.get(CONF_BRING_BY_DEFAULT) or [])
            if user_input is not None
            else [k for k, v in settings.lunch_defaults.items() if v == "bring"]
        )
        schema: dict[vol.Marker, Any] = {
            vol.Optional(CONF_BRING_BY_DEFAULT, default=bring_now): SelectSelector(
                SelectSelectorConfig(
                    options=[SelectOptionDict(value=k.calendar_id, label=k.name) for k in kids],
                    multiple=True,
                    mode=SelectSelectorMode.LIST,
                )
            ),
        }
        for label, kid in fields:
            current = user_input.get(label) if user_input is not None else settings.lunch_feeds.get(kid)
            schema[vol.Optional(label, description={"suggested_value": current or ""})] = TextSelector(
                TextSelectorConfig(type=TextSelectorType.URL)
            )
        return self.async_show_form(step_id="lunch", data_schema=vol.Schema(schema), errors=errors)

    async def _check_routes_key(self, key: str) -> dict[str, str]:
        """Try the key with one short lookup from home to home."""
        lat, lon = self.hass.config.latitude, self.hass.config.longitude
        if not lat and not lon:
            return {"base": "no_home_location"}
        home = Place(lat=lat, lon=lon)
        api = RoutesApi(async_get_clientsession(self.hass), key)
        try:
            await api.async_drive_minutes(home, home, dt_util.now() + timedelta(hours=1))
        except RoutesNoRoute:
            pass  # Google took the key; it just had no route to give.
        except RoutesKeyError as err:
            _LOGGER.warning("Google turned down the Routes key: %s", err)
            return {CONF_ROUTES_KEY: "routes_key_rejected"}
        except RoutesQuotaError:
            return {"base": "routes_quota"}
        except RoutesError as err:
            _LOGGER.warning("Couldn't check the Routes key: %s", err)
            return {"base": "cannot_connect"}
        return {}
