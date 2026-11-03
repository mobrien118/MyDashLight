"""The integration's options, turned into what the planner and notes parser need.

Pure module, no Home Assistant imports.
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass, field
from typing import Any

from .const import (
    CONF_ARRIVE_EARLY,
    CONF_CALENDAR_ID,
    CONF_CARPOOLS,
    CONF_DAD_ALIASES,
    CONF_DAD_CALENDARS,
    CONF_DAD_NAME,
    CONF_GO_HOME_MARGIN,
    CONF_KIDS,
    CONF_MOM_ALIASES,
    CONF_MOM_CALENDARS,
    CONF_MOM_NAME,
    CONF_NAME,
    CONF_NO_ADDRESS_TRAVEL,
    CONF_PLANNER,
    CONF_TAKE_ALONG_WINDOW,
    CONF_TIGHT_SLACK,
    CONF_TOO_EARLY,
    CONF_WAITING_AFTER,
    DEFAULT_PLANNER,
)
from .notes import DriverDirectory
from .planner import PlannerSettings
from .week import CalendarRoles, KidCalendar


@dataclass(frozen=True, slots=True)
class HubSettings:
    planner: PlannerSettings
    directory: DriverDirectory
    no_address_travel: int
    roles: CalendarRoles = field(default_factory=CalendarRoles)

    @property
    def driver_names(self) -> Mapping[str, str]:
        return self.directory.names

    @classmethod
    def from_options(cls, options: Mapping[str, Any]) -> HubSettings:
        planner = {**DEFAULT_PLANNER, **options.get(CONF_PLANNER, {})}
        names = {
            "mom": _name(options.get(CONF_MOM_NAME), "Mom"),
            "dad": _name(options.get(CONF_DAD_NAME), "Dad"),
        }
        return cls(
            planner=PlannerSettings(
                arrive_early=int(planner[CONF_ARRIVE_EARLY]),
                go_home_margin=int(planner[CONF_GO_HOME_MARGIN]),
                take_along_window=int(planner[CONF_TAKE_ALONG_WINDOW]),
                waiting_after=int(planner[CONF_WAITING_AFTER]),
                too_early=int(planner[CONF_TOO_EARLY]),
                tight_slack=int(planner[CONF_TIGHT_SLACK]),
            ),
            directory=DriverDirectory(
                names=names,
                aliases={
                    "mom": _names(options.get(CONF_MOM_ALIASES)),
                    "dad": _names(options.get(CONF_DAD_ALIASES)),
                },
                carpools=_names(options.get(CONF_CARPOOLS)),
            ),
            no_address_travel=int(planner[CONF_NO_ADDRESS_TRAVEL]),
            roles=CalendarRoles(
                kids=_kids(options.get(CONF_KIDS)),
                busy={
                    "mom": _ids(options.get(CONF_MOM_CALENDARS)),
                    "dad": _ids(options.get(CONF_DAD_CALENDARS)),
                },
            ),
        )


def _name(value: object, default: str) -> str:
    text = " ".join(str(value or "").split())
    return text or default


def _names(value: object) -> tuple[str, ...]:
    """A list of names from the options, accepting a list or comma-separated text."""
    if value is None:
        return ()
    items = value.split(",") if isinstance(value, str) else value
    if not isinstance(items, (list, tuple)):
        return ()
    out: list[str] = []
    for item in items:
        name = " ".join(str(item).split())
        if name and name.casefold() not in {n.casefold() for n in out}:
            out.append(name)
    return tuple(out)


def _kids(value: object) -> tuple[KidCalendar, ...]:
    if not isinstance(value, (list, tuple)):
        return ()
    out: list[KidCalendar] = []
    for item in value:
        if not isinstance(item, Mapping):
            continue
        cal_id = str(item.get(CONF_CALENDAR_ID) or "")
        if cal_id and all(k.calendar_id != cal_id for k in out):
            out.append(KidCalendar(cal_id, _name(item.get(CONF_NAME), cal_id)))
    return tuple(out)


def _ids(value: object) -> tuple[str, ...]:
    if not isinstance(value, (list, tuple)):
        return ()
    return tuple(dict.fromkeys(str(v) for v in value if v))
