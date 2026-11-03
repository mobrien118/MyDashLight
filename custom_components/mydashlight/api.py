"""Google access tokens from Home Assistant's OAuth session for the config entry."""

from __future__ import annotations

from http import HTTPStatus

from aiohttp import ClientError, ClientResponseError
from homeassistant.const import CONF_ACCESS_TOKEN
from homeassistant.helpers.config_entry_oauth2_flow import OAuth2Session

from .google import GoogleAuthError, GoogleError


class OAuthTokens:
    """A :class:`~.google.TokenSource` that refreshes the token when it runs out."""

    def __init__(self, session: OAuth2Session) -> None:
        self._session = session

    async def async_get_access_token(self) -> str:
        try:
            await self._session.async_ensure_token_valid()
        except ClientResponseError as err:
            # Google answers a revoked or expired refresh token with 400 invalid_grant.
            if err.status in (HTTPStatus.BAD_REQUEST, HTTPStatus.UNAUTHORIZED):
                raise GoogleAuthError("Google turned down the saved sign-in") from err
            raise GoogleError(f"Couldn't refresh the Google sign-in: {err}") from err
        except (ClientError, TimeoutError) as err:
            raise GoogleError(f"Couldn't refresh the Google sign-in: {err}") from err
        return str(self._session.token[CONF_ACCESS_TOKEN])
