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
