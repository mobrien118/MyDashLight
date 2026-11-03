"""Serves the kitchen app from Home Assistant.

The app is built from ``frontend/`` in the repository into the ``frontend`` folder here, so a
HACS update brings the app along with the backend. It shows up two ways:

- a **Rides** item in the sidebar, which also works in the Home Assistant app on a phone, and
- a full-screen page at ``/mydashlight-kitchen`` for the kitchen screen, which signs in with the
  same Home Assistant login.

Both read the plan and change rides through the ``mydashlight`` actions, so the app keeps no data.
"""

from __future__ import annotations

import hashlib
from pathlib import Path
from typing import Final

from aiohttp import web
from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.helpers.http import HomeAssistantView

from .const import DOMAIN

FILES_URL: Final = "/mydashlight_app"
"""Where the app's scripts are served from."""
KITCHEN_URL: Final = "/mydashlight-kitchen"
"""The full-screen page for the kitchen screen."""
PANEL_URL: Final = DOMAIN
"""The sidebar item's address: ``/mydashlight``."""
PANEL_TITLE: Final = "Rides"
PANEL_ICON: Final = "mdi:car-multiple"
PANEL_ELEMENT: Final = "mydashlight-panel"

FILES: Final = Path(__file__).parent / "frontend"
_SERVED: Final = f"{DOMAIN}_frontend_served"


def _versions() -> dict[str, str]:
    """A short hash of each script, so browsers fetch a new build instead of a cached one."""
    out: dict[str, str] = {}
    for name in ("panel.js", "kiosk.js"):
        out[name] = hashlib.sha256((FILES / name).read_bytes()).hexdigest()[:12]
    return out


async def async_setup_frontend(hass: HomeAssistant) -> None:
    """Serve the app's files and the kitchen page. Done once; paths can't be removed later."""
    if hass.data.get(_SERVED):
        return
    hass.data[_SERVED] = True
    versions = await hass.async_add_executor_job(_versions)
    page = await hass.async_add_executor_job((FILES / "index.html").read_text, "utf-8")
    hass.data[f"{_SERVED}_versions"] = versions
    await hass.http.async_register_static_paths([StaticPathConfig(FILES_URL, str(FILES), cache_headers=True)])
    hass.http.register_view(KitchenView(page.replace("%SCRIPT%", f"{FILES_URL}/kiosk.js?v={versions['kiosk.js']}")))


async def async_register_panel(hass: HomeAssistant) -> None:
    """Add the Rides item to the sidebar, for everyone who can sign in."""
    await async_setup_frontend(hass)
    versions: dict[str, str] = hass.data[f"{_SERVED}_versions"]
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_URL,
        webcomponent_name=PANEL_ELEMENT,
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        module_url=f"{FILES_URL}/panel.js?v={versions['panel.js']}",
        embed_iframe=False,
        require_admin=False,
    )


def async_remove_panel(hass: HomeAssistant) -> None:
    frontend.async_remove_panel(hass, PANEL_URL, warn_if_unknown=False)


class KitchenView(HomeAssistantView):
    """The kitchen page. It holds no data: the page signs in to Home Assistant itself."""

    url = KITCHEN_URL
    name = f"{DOMAIN}:kitchen"
    requires_auth = False

    def __init__(self, page: str) -> None:
        self._page = page

    async def get(self, request: web.Request) -> web.Response:
        return web.Response(
            text=self._page,
            content_type="text/html",
            headers={"Cache-Control": "no-cache"},
        )
