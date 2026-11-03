"""Constants for MyDashLight."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "mydashlight"
TITLE: Final = "MyDashLight"

# The two parents the planner routes. These ids are part of the plan the app reads,
# so they stay fixed; the names people see come from the options.
DRIVERS: Final = ("mom", "dad")

CONF_MOM_NAME: Final = "mom_name"
CONF_MOM_ALIASES: Final = "mom_aliases"
CONF_DAD_NAME: Final = "dad_name"
CONF_DAD_ALIASES: Final = "dad_aliases"
CONF_CARPOOLS: Final = "carpools"
CONF_PLANNER: Final = "planner"

CONF_ARRIVE_EARLY: Final = "arrive_early"
CONF_GO_HOME_MARGIN: Final = "go_home_margin"
CONF_TAKE_ALONG_WINDOW: Final = "take_along_window"
CONF_WAITING_AFTER: Final = "waiting_after"
CONF_TOO_EARLY: Final = "too_early"
CONF_TIGHT_SLACK: Final = "tight_slack"
CONF_NO_ADDRESS_TRAVEL: Final = "no_address_travel"

DEFAULT_PLANNER: Final = {
    CONF_ARRIVE_EARLY: 5,
    CONF_GO_HOME_MARGIN: 15,
    CONF_TAKE_ALONG_WINDOW: 45,
    CONF_WAITING_AFTER: 5,
    CONF_TOO_EARLY: 15,
    CONF_TIGHT_SLACK: 3,
    CONF_NO_ADDRESS_TRAVEL: 15,
}

# Google sign-in. calendarlist.readonly lists the calendars to pick from; events reads the
# events and writes who drives into their notes.
OAUTH_AUTHORIZE: Final = "https://accounts.google.com/o/oauth2/v2/auth"
OAUTH_TOKEN: Final = "https://oauth2.googleapis.com/token"
SCOPES: Final = (
    "https://www.googleapis.com/auth/calendar.calendarlist.readonly",
    "https://www.googleapis.com/auth/calendar.events",
)

# Which calendars to read. Kids: a list of {"calendar_id", "name"}. The parents' busy
# calendars: lists of calendar ids.
CONF_KIDS: Final = "kids"
CONF_CALENDAR_ID: Final = "calendar_id"
CONF_NAME: Final = "name"
CONF_MOM_CALENDARS: Final = "mom_calendars"
CONF_DAD_CALENDARS: Final = "dad_calendars"

UPDATE_SECONDS: Final = 60
PLAN_DAYS: Final = 7
"""Today and the six days after it."""

SIGNAL_PLAN_UPDATED: Final = f"{DOMAIN}_plan_updated"
"""Sent with the config entry when its plan changes, and with None when it stops."""
WS_SUBSCRIBE: Final = f"{DOMAIN}/rides/subscribe"

SERVICE_GET_PLAN: Final = "get_plan"
SERVICE_SET_RIDE: Final = "set_ride"
SERVICE_SET_STAY: Final = "set_stay"
SERVICE_SET_ARRIVE_BY: Final = "set_arrive_by"
SERVICE_SET_TAKE_ALONG: Final = "set_take_along"
SERVICE_APPLY_SUGGESTION: Final = "apply_suggestion"
ATTR_DATE: Final = "date"
ATTR_DAYS: Final = "days"
ATTR_EVENT: Final = "event"
"""An event's ``id`` in the plan."""
ATTR_SIDE: Final = "side"
ATTR_DRIVER: Final = "driver"
ATTR_SCOPE: Final = "scope"
ATTR_STAY: Final = "stay"
ATTR_TIME: Final = "time"
ATTR_KIDS: Final = "kids"
ATTR_SUGGESTION: Final = "suggestion"
SCOPE_THIS: Final = "this"
SCOPE_SERIES: Final = "series"

# Drive times from Google Routes, set on the options' Drive times page.
CONF_ROUTES_KEY: Final = "routes_api_key"
CONF_ROUTES_DAILY_LIMIT: Final = "routes_daily_limit"
CONF_REMOVE_ROUTES_KEY: Final = "remove_routes_key"
DEFAULT_ROUTES_DAILY_LIMIT: Final = 150
"""Lookups a day. 150 a day stays under 5,000 a month."""
ROUTES_PER_UPDATE: Final = 25
ROUTES_AT_ONCE: Final = 4
