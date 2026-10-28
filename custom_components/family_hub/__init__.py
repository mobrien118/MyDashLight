"""Family Hub: the kitchen family planner's backend in Home Assistant.

This first version loads the settings. Google Calendar sync, travel times, the week's ride
plan and the services that change it come in later versions.
"""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .settings import HubSettings

type FamilyHubConfigEntry = ConfigEntry[HubSettings]


async def async_setup_entry(hass: HomeAssistant, entry: FamilyHubConfigEntry) -> bool:
    """Set up Family Hub from a config entry."""
    entry.runtime_data = HubSettings.from_options(entry.options)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: FamilyHubConfigEntry) -> bool:
    """Unload a config entry."""
    return True
