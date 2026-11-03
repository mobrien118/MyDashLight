"""Take-along choices: which parent brings the other kids along on which day.

Take-along is about a parent's whole day rather than one event, so it isn't kept in event
notes. It's saved in Home Assistant's own storage, like the drive times, and days that have
passed are dropped.
"""

from __future__ import annotations

from datetime import date
from typing import Any, Final

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DOMAIN

STORE_KEY: Final = f"{DOMAIN}.take_along"
STORE_VERSION: Final = 1


class TakeAlong:
    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(hass, STORE_VERSION, STORE_KEY)
        self.days: dict[str, dict[str, bool]] = {}
        """Choices by ISO date, then driver."""

    async def async_load(self) -> None:
        data = await self._store.async_load() or {}
        days = data.get("days")
        if isinstance(days, dict):
            self.days = {
                str(day): {str(d): bool(on) for d, on in choices.items()}
                for day, choices in days.items()
                if isinstance(choices, dict)
            }

    async def async_set(self, day: date, driver: str, on: bool, today: date) -> bool:
        """Turn take-along on or off for a driver on a day. False when nothing changed."""
        key = day.isoformat()
        if self.days.get(key, {}).get(driver, False) == on:
            return False
        choices = self.days.setdefault(key, {})
        if on:
            choices[driver] = True
        else:
            choices.pop(driver, None)
            if not choices:
                del self.days[key]
        self.days = {d: c for d, c in self.days.items() if d >= today.isoformat()}
        await self._store.async_save({"days": self.days})
        return True

    async def async_remove(self) -> None:
        await self._store.async_remove()
