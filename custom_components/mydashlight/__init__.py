"""MyDashLight: the kitchen family planner's backend in Home Assistant.

Signs in to Google, reads the kids' calendars and the parents' own calendars every minute,
and plans the week's rides with drive times from Google Routes. ``mydashlight.get_plan``
returns the plan, and the other services save who drives, Stay, Take along and Arrive by into
the events' notes. The kitchen app subscribes to ``mydashlight/rides/subscribe`` for the plan as
it changes.
"""

from __future__ import annotations

import asyncio
from dataclasses import dataclass, field

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed, ConfigEntryError, ConfigEntryNotReady
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.config_entry_oauth2_flow import (
    ImplementationUnavailableError,
    OAuth2Session,
    async_get_config_entry_implementation,
)
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.typing import ConfigType

from .api import OAuthTokens
from .const import CONF_ROUTES_DAILY_LIMIT, CONF_ROUTES_KEY, DEFAULT_ROUTES_DAILY_LIMIT, DOMAIN, SIGNAL_PLAN_UPDATED
from .coordinator import MyDashLightCoordinator
from .frontend import async_register_panel, async_remove_panel
from .google import GoogleAuthError, GoogleCalendarApi, GoogleError
from .lookups import RoutesLookups
from .routes import RoutesApi
from .services import async_setup_services
from .settings import HubSettings
from .websocket import async_setup_websocket

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


@dataclass(slots=True)
class MyDashLightData:
    settings: HubSettings
    api: GoogleCalendarApi
    coordinator: MyDashLightCoordinator
    write_lock: asyncio.Lock = field(default_factory=asyncio.Lock)
    """One change to Google at a time, so two taps don't race each other."""


type MyDashLightConfigEntry = ConfigEntry[MyDashLightData]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the services and the app's live subscription."""
    async_setup_services(hass)
    async_setup_websocket(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: MyDashLightConfigEntry) -> bool:
    """Set up MyDashLight from a config entry."""
    if "auth_implementation" not in entry.data:
        # Set up with version 0.1, before MyDashLight signed in to Google.
        raise ConfigEntryError(translation_domain=DOMAIN, translation_key="set_up_again")
    try:
        implementation = await async_get_config_entry_implementation(hass, entry)
    except (ImplementationUnavailableError, ValueError) as err:
        # The OAuth client was removed from Application credentials, or isn't loaded yet.
        raise ConfigEntryNotReady(translation_domain=DOMAIN, translation_key="no_credentials") from err

    tokens = OAuthTokens(OAuth2Session(hass, entry, implementation))
    try:
        await tokens.async_get_access_token()
    except GoogleAuthError as err:
        raise ConfigEntryAuthFailed(translation_domain=DOMAIN, translation_key="auth_failed") from err
    except GoogleError as err:
        raise ConfigEntryNotReady(
            translation_domain=DOMAIN, translation_key="google_error", translation_placeholders={"error": str(err)}
        ) from err

    settings = HubSettings.from_options(entry.options)
    websession = async_get_clientsession(hass)
    api = GoogleCalendarApi(websession, tokens)
    routes_key = entry.options.get(CONF_ROUTES_KEY)
    lookups = RoutesLookups(
        hass,
        RoutesApi(websession, routes_key) if routes_key else None,
        int(entry.options.get(CONF_ROUTES_DAILY_LIMIT, DEFAULT_ROUTES_DAILY_LIMIT)),
    )
    await lookups.async_load()
    coordinator = MyDashLightCoordinator(hass, entry, api, settings, lookups)
    await coordinator.async_config_entry_first_refresh()
    entry.runtime_data = MyDashLightData(settings, api, coordinator)
    # Tell the app's live subscriptions about every new plan. This listener also keeps the
    # coordinator polling, which it only does while something listens.
    entry.async_on_unload(
        coordinator.async_add_listener(lambda: async_dispatcher_send(hass, SIGNAL_PLAN_UPDATED, entry))
    )
    entry.async_on_unload(lambda: async_dispatcher_send(hass, SIGNAL_PLAN_UPDATED, None))
    async_dispatcher_send(hass, SIGNAL_PLAN_UPDATED, entry)
    # The kitchen app: the Rides item in the sidebar, and the kitchen page.
    await async_register_panel(hass)
    entry.async_on_unload(lambda: async_remove_panel(hass))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: MyDashLightConfigEntry) -> bool:
    """Unload a config entry."""
    return True


async def async_remove_entry(hass: HomeAssistant, entry: MyDashLightConfigEntry) -> None:
    """Delete the saved drive times along with the entry."""
    await RoutesLookups(hass, None, 0).async_remove()
