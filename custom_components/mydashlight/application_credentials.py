"""Sign-in with your own Google Cloud OAuth client (Settings > Application credentials)."""

from __future__ import annotations

from homeassistant.components.application_credentials import AuthorizationServer
from homeassistant.core import HomeAssistant

from .const import OAUTH_AUTHORIZE, OAUTH_TOKEN


async def async_get_authorization_server(hass: HomeAssistant) -> AuthorizationServer:
    """Google's OAuth endpoints."""
    return AuthorizationServer(authorize_url=OAUTH_AUTHORIZE, token_url=OAUTH_TOKEN)


async def async_get_description_placeholders(hass: HomeAssistant) -> dict[str, str]:
    """Links shown in the dialog for adding the OAuth client."""
    return {
        "more_info_url": "https://github.com/mobrien118/MyDashLight#google-sign-in",
        "oauth_consent_url": "https://console.cloud.google.com/auth/overview",
        "oauth_creds_url": "https://console.cloud.google.com/auth/clients",
    }
