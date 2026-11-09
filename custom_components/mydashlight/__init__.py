"""MyDashLight: the kitchen family planner's backend in Home Assistant.

Signs in to Google, reads the one shared family calendar every minute (each title starts with
who it's for, see :mod:`.who`), and plans the week's rides with drive times from Google Routes. ``mydashlight.get_plan``
returns the plan, and the other services save who drives, Stay, Take along and Arrive by into
the events' notes. The kitchen app subscribes to ``mydashlight/rides/subscribe`` for the plan as
it changes. Each parent can get a reminder on their phone before each drive leaves.

Chores live in Google Tasks: templates on three base lists, and each kid's chores on their own
list, which MyDashLight keeps filled from the templates. The app subscribes to
``mydashlight/chores/subscribe`` for the chores as they change.

Lunches are a "<Kid> Lunch" all-day event a day on the lunch calendar (the menu, with the Bring
or Buy pick at the end of its notes), and days off are "No School" events on the family calendar. School-days
chores (like Pack lunch) follow them. The app subscribes to ``mydashlight/lunch/subscribe``.
"""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
from datetime import datetime, timedelta

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import ConfigEntryAuthFailed, ConfigEntryError, ConfigEntryNotReady
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.config_entry_oauth2_flow import (
    ImplementationUnavailableError,
    OAuth2Session,
    async_get_config_entry_implementation,
)
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.storage import Store
from homeassistant.helpers.typing import ConfigType

from .alerts import CalendarReminders, Notifier, async_remove_sent
from .api import OAuthTokens
from .chore_coordinator import STORE_KEY as CHORE_STORE_KEY, STORE_VERSION as CHORE_STORE_VERSION, ChoreCoordinator
from .chore_services import async_setup_chore_services
from .const import (
    CONF_ROUTES_DAILY_LIMIT,
    CONF_ROUTES_KEY,
    DEFAULT_ROUTES_DAILY_LIMIT,
    DOMAIN,
    MENU_FEED_HOURS,
    SIGNAL_CHORES_UPDATED,
    SIGNAL_LUNCH_UPDATED,
    SIGNAL_PLAN_UPDATED,
)
from .coordinator import MyDashLightCoordinator
from .frontend import async_register_panel, async_remove_panel
from .google import GoogleAuthError, GoogleCalendarApi, GoogleError
from .lookups import RoutesLookups
from .lunch_coordinator import LunchCoordinator
from .lunch_services import async_setup_lunch_services
from .routes import RoutesApi
from .services import async_setup_services
from .settings import HubSettings
from .tasks_api import GoogleTasksApi
from .websocket import async_setup_websocket

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


@dataclass(slots=True)
class MyDashLightData:
    settings: HubSettings
    api: GoogleCalendarApi
    coordinator: MyDashLightCoordinator
    notifier: Notifier
    calendar_reminders: CalendarReminders
    write_lock: asyncio.Lock
    """One change to Google at a time, so two taps don't race each other."""
    chores: ChoreCoordinator
    lunch: LunchCoordinator


type MyDashLightConfigEntry = ConfigEntry[MyDashLightData]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the services and the app's live subscription."""
    async_setup_services(hass)
    async_setup_chore_services(hass)
    async_setup_lunch_services(hass)
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
    notifier = Notifier(hass, settings.reminders, lookups, settings.planner.arrive_early)
    await notifier.async_load()
    lock = asyncio.Lock()
    reminders = CalendarReminders(hass, api, lock, settings.reminders)
    lunch = LunchCoordinator(hass, entry, api, settings, lock, websession)
    chores = ChoreCoordinator(hass, entry, GoogleTasksApi(websession, tokens), settings, lock, lunch.school)
    entry.runtime_data = MyDashLightData(settings, api, coordinator, notifier, reminders, lock, chores, lunch)

    @callback
    def plan_updated() -> None:
        # Tell the app's live subscriptions and the reminders about every new plan.
        async_dispatcher_send(hass, SIGNAL_PLAN_UPDATED, entry)
        if coordinator.last_update_success:
            notifier.async_plan_updated(coordinator.data.days, coordinator.data.week)
            reminders.async_plan_updated(coordinator.data.days, coordinator.data.week.days)

    # This listener also keeps the coordinator polling, which it only does while something listens.
    entry.async_on_unload(coordinator.async_add_listener(plan_updated))
    entry.async_on_unload(notifier.async_stop)
    entry.async_on_unload(reminders.async_stop)
    entry.async_on_unload(lambda: async_dispatcher_send(hass, SIGNAL_PLAN_UPDATED, None))
    plan_updated()

    @callback
    def chores_updated() -> None:
        async_dispatcher_send(hass, SIGNAL_CHORES_UPDATED, entry)

    @callback
    def lunch_updated() -> None:
        async_dispatcher_send(hass, SIGNAL_LUNCH_UPDATED, entry)

    # Lunches and chores read in the background: a problem with them never stops rides.
    entry.async_on_unload(chores.async_add_listener(chores_updated))
    entry.async_on_unload(lambda: async_dispatcher_send(hass, SIGNAL_CHORES_UPDATED, None))
    entry.async_on_unload(lunch.async_add_listener(lunch_updated))
    entry.async_on_unload(lambda: async_dispatcher_send(hass, SIGNAL_LUNCH_UPDATED, None))

    async def first_reads() -> None:
        # School days first, so the first chore read already knows them.
        await lunch.async_refresh()
        await chores.async_refresh()
        await lunch.async_fold_old_picks()
        await lunch.async_sync_feeds()

    entry.async_create_background_task(hass, first_reads(), f"{DOMAIN}_first_reads")

    @callback
    def sync_feeds(_now: datetime) -> None:
        entry.async_create_background_task(hass, lunch.async_sync_feeds(), f"{DOMAIN}_menu_feeds")

    if settings.lunch_feeds:
        entry.async_on_unload(async_track_time_interval(hass, sync_feeds, timedelta(hours=MENU_FEED_HOURS)))
    # The kitchen app: the Rides item in the sidebar, and the kitchen page.
    await async_register_panel(hass)
    entry.async_on_unload(lambda: async_remove_panel(hass))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: MyDashLightConfigEntry) -> bool:
    """Unload a config entry."""
    return True


async def async_remove_entry(hass: HomeAssistant, entry: MyDashLightConfigEntry) -> None:
    """Delete the saved drive times and the record of sent reminders along with the entry."""
    await RoutesLookups(hass, None, 0).async_remove()
    await async_remove_sent(hass)
    await Store(hass, CHORE_STORE_VERSION, CHORE_STORE_KEY).async_remove()
