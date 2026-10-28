"""Config flow for Family Hub."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigEntry, ConfigFlow, ConfigFlowResult, OptionsFlowWithReload
from homeassistant.core import callback
from homeassistant.data_entry_flow import section
from homeassistant.helpers.selector import (
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    TextSelector,
    TextSelectorConfig,
)
import voluptuous as vol

from .const import (
    CONF_ARRIVE_EARLY,
    CONF_CARPOOLS,
    CONF_DAD_ALIASES,
    CONF_DAD_NAME,
    CONF_GO_HOME_MARGIN,
    CONF_MOM_ALIASES,
    CONF_MOM_NAME,
    CONF_NO_ADDRESS_TRAVEL,
    CONF_PLANNER,
    CONF_TAKE_ALONG_WINDOW,
    CONF_TIGHT_SLACK,
    CONF_TOO_EARLY,
    CONF_WAITING_AFTER,
    DEFAULT_PLANNER,
    DOMAIN,
    TITLE,
)

_NAME = TextSelector()
_NAMES = TextSelector(TextSelectorConfig(multiple=True))


def _minutes(maximum: int) -> NumberSelector:
    return NumberSelector(
        NumberSelectorConfig(min=0, max=maximum, step=1, mode=NumberSelectorMode.BOX, unit_of_measurement="min")
    )


_PLANNER_LIMITS = {
    CONF_ARRIVE_EARLY: 60,
    CONF_GO_HOME_MARGIN: 120,
    CONF_TAKE_ALONG_WINDOW: 180,
    CONF_WAITING_AFTER: 60,
    CONF_TOO_EARLY: 120,
    CONF_TIGHT_SLACK: 30,
    CONF_NO_ADDRESS_TRAVEL: 120,
}


def _clean_name(value: str) -> str:
    return " ".join(value.split())


def _names_schema(defaults: dict[str, Any]) -> dict[vol.Marker, Any]:
    return {
        vol.Required(CONF_MOM_NAME, default=defaults.get(CONF_MOM_NAME, "")): _NAME,
        vol.Required(CONF_DAD_NAME, default=defaults.get(CONF_DAD_NAME, "")): _NAME,
    }


def _validate_names(user_input: dict[str, Any]) -> dict[str, str]:
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


class FamilyHubConfigFlow(ConfigFlow, domain=DOMAIN):
    """Set up Family Hub."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            errors = _validate_names(user_input)
            if not errors:
                return self.async_create_entry(
                    title=TITLE,
                    data={},
                    options={
                        CONF_MOM_NAME: _clean_name(user_input[CONF_MOM_NAME]),
                        CONF_DAD_NAME: _clean_name(user_input[CONF_DAD_NAME]),
                        CONF_MOM_ALIASES: [],
                        CONF_DAD_ALIASES: [],
                        CONF_CARPOOLS: [],
                        CONF_PLANNER: dict(DEFAULT_PLANNER),
                    },
                )
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(_names_schema(user_input or {})),
            errors=errors,
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> FamilyHubOptionsFlow:
        return FamilyHubOptionsFlow()


class FamilyHubOptionsFlow(OptionsFlowWithReload):
    """Names, carpool drivers and planner timing."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        current = dict(self.config_entry.options)
        if user_input is not None:
            errors = _validate_names(user_input)
            if not errors:
                return self.async_create_entry(
                    data={
                        **user_input,
                        CONF_MOM_NAME: _clean_name(user_input[CONF_MOM_NAME]),
                        CONF_DAD_NAME: _clean_name(user_input[CONF_DAD_NAME]),
                        CONF_PLANNER: {k: int(v) for k, v in user_input[CONF_PLANNER].items()},
                    }
                )
            current = user_input
        planner = {**DEFAULT_PLANNER, **current.get(CONF_PLANNER, {})}
        schema = vol.Schema(
            {
                **_names_schema(current),
                vol.Optional(CONF_MOM_ALIASES, default=current.get(CONF_MOM_ALIASES, [])): _NAMES,
                vol.Optional(CONF_DAD_ALIASES, default=current.get(CONF_DAD_ALIASES, [])): _NAMES,
                vol.Optional(CONF_CARPOOLS, default=current.get(CONF_CARPOOLS, [])): _NAMES,
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
        return self.async_show_form(step_id="init", data_schema=schema, errors=errors)
