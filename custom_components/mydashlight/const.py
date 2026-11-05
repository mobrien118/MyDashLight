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
CONF_HOME_ADDRESS: Final = "home_address"
"""The street address of home, so events there need no ride."""
CONF_PLANNER: Final = "planner"

CONF_ARRIVE_EARLY: Final = "arrive_early"
CONF_ARRIVE_EARLY_MAX: Final = "arrive_early_max"
CONF_ARRIVE_EARLY_PER: Final = "arrive_early_per"
CONF_GO_HOME_MARGIN: Final = "go_home_margin"
CONF_TAKE_ALONG_WINDOW: Final = "take_along_window"
CONF_WAITING_AFTER: Final = "waiting_after"
CONF_TOO_EARLY: Final = "too_early"
CONF_TIGHT_SLACK: Final = "tight_slack"
CONF_NO_ADDRESS_TRAVEL: Final = "no_address_travel"

DEFAULT_PLANNER: Final = {
    CONF_ARRIVE_EARLY: 5,
    CONF_ARRIVE_EARLY_MAX: 20,
    CONF_ARRIVE_EARLY_PER: 6,
    CONF_GO_HOME_MARGIN: 15,
    CONF_TAKE_ALONG_WINDOW: 45,
    CONF_WAITING_AFTER: 5,
    CONF_TOO_EARLY: 15,
    CONF_TIGHT_SLACK: 3,
    CONF_NO_ADDRESS_TRAVEL: 15,
}

# Google sign-in. calendarlist.readonly lists the calendars to pick from; events reads the
# events and writes who drives into their notes; tasks keeps the chores in Google Tasks.
OAUTH_AUTHORIZE: Final = "https://accounts.google.com/o/oauth2/v2/auth"
OAUTH_TOKEN: Final = "https://oauth2.googleapis.com/token"
SCOPES: Final = (
    "https://www.googleapis.com/auth/calendar.calendarlist.readonly",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/tasks",
)
TASKS_SCOPE: Final = SCOPES[-1]

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
SERVICE_SET_ATTENDING: Final = "set_attending"
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
ATTR_ATTENDING: Final = "attending"
ATTR_TIME: Final = "time"
ATTR_KIDS: Final = "kids"
ATTR_SUGGESTION: Final = "suggestion"
SCOPE_THIS: Final = "this"
SCOPE_SERIES: Final = "series"

# Reminders, set on the options' Reminders page. Each person's notifier is a service name in
# the notify domain, such as "mobile_app_robins_phone".
CONF_MOM_NOTIFY: Final = "mom_notify"
CONF_DAD_NOTIFY: Final = "dad_notify"
CONF_KID_NOTIFY: Final = "kid_notify"
"""Each kid's notify service, by the kid's calendar id."""
CONF_MOM_PERSON: Final = "mom_person"
CONF_DAD_PERSON: Final = "dad_person"
"""Each parent's person in Home Assistant, whose phone says where they are."""
CONF_REMIND_BEFORE: Final = "remind_before"
CONF_CALENDAR_REMINDERS: Final = "calendar_reminders"
"""Save each drive's reminder on its first drop-off event in Google Calendar too."""
CONF_NO_DRIVER_ALERTS: Final = "no_driver_alerts"
CONF_NO_DRIVER_HOURS: Final = "no_driver_hours"
"""How many hours ahead a ride with no driver is worth an alert."""
DEFAULT_NO_DRIVER_HOURS: Final = 6
DEFAULT_REMIND_BEFORE: Final = 15
"""Minutes before leaving."""
NOTIFY_OFF: Final = "off"

# Drive times from Google Routes, set on the options' Drive times page.
CONF_ROUTES_KEY: Final = "routes_api_key"
CONF_ROUTES_DAILY_LIMIT: Final = "routes_daily_limit"
CONF_REMOVE_ROUTES_KEY: Final = "remove_routes_key"
DEFAULT_ROUTES_DAILY_LIMIT: Final = 150
"""Lookups a day. 150 a day stays under 5,000 a month."""
ROUTES_PER_UPDATE: Final = 25
ROUTES_AT_ONCE: Final = 4

# Chores, kept in Google Tasks. Templates are tasks on the four base lists; each kid's chores
# are tasks on that kid's list, made from the templates this many days ahead.
CONF_CHORE_DAYS: Final = "chore_days_ahead"
DEFAULT_CHORE_DAYS: Final = 7
MAX_CHORE_DAYS: Final = 28
TEMPLATE_LIST_TITLES: Final = {
    "daily": "Chore templates: Daily",
    "weekly": "Chore templates: Weekly",
    "monthly": "Chore templates: Monthly",
    "school": "Chore templates: School days",
}
KID_LIST_TITLE: Final = "Chores: {name}"
CHORE_UPDATE_SECONDS: Final = 60
SIGNAL_CHORES_UPDATED: Final = f"{DOMAIN}_chores_updated"
"""Sent with the config entry when its chores change, and with None when it stops."""
WS_CHORES_SUBSCRIBE: Final = f"{DOMAIN}/chores/subscribe"
SERVICE_GET_CHORES: Final = "get_chores"
SERVICE_SET_CHORE_DONE: Final = "set_chore_done"
SERVICE_SAVE_CHORE_TEMPLATE: Final = "save_chore_template"
SERVICE_REMOVE_CHORE_TEMPLATE: Final = "remove_chore_template"
ATTR_CHORE: Final = "chore"
ATTR_BY: Final = "by"
ATTR_DONE: Final = "done"
ATTR_TEMPLATE: Final = "template"

# Lunch: "Bring Lunch" and "Buy Lunch" all-day events on each kid's calendar, and "No School"
# events for days off. The only setting is each kid's lunch when nobody picked.
CONF_LUNCH_DEFAULTS: Final = "lunch_defaults"
"""Each kid's default lunch, "buy" or "bring", by the kid's calendar id."""
CONF_LUNCH_FEEDS: Final = "lunch_feeds"
"""Each kid's school menu feed (an iCal address), by the kid's calendar id."""
MENU_FEED_HOURS: Final = 6
"""How often the menu feeds are read."""
LUNCH_UPDATE_SECONDS: Final = 120
SIGNAL_LUNCH_UPDATED: Final = f"{DOMAIN}_lunch_updated"
"""Sent with the config entry when the lunches change, and with None when they stop."""
WS_LUNCH_SUBSCRIBE: Final = f"{DOMAIN}/lunch/subscribe"
SERVICE_GET_LUNCHES: Final = "get_lunches"
SERVICE_SET_LUNCH: Final = "set_lunch"
ATTR_KID: Final = "kid"
ATTR_DATES: Final = "dates"
ATTR_LUNCH: Final = "lunch"
ATTR_MENU: Final = "menu"
ATTR_DETAILS: Final = "details"
SERVICE_SET_LUNCH_MENU: Final = "set_lunch_menu"
