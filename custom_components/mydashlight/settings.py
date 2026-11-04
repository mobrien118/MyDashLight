"""The integration's options, turned into what the planner and notes parser need.

Pure module, no Home Assistant imports.
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass, field
from typing import Any

from .const import (
    CONF_ARRIVE_EARLY,
    CONF_ARRIVE_EARLY_MAX,
    CONF_ARRIVE_EARLY_PER,
    CONF_CALENDAR_ID,
    CONF_CALENDAR_REMINDERS,
    CONF_CARPOOLS,
    CONF_DAD_ALIASES,
    CONF_DAD_CALENDARS,
    CONF_DAD_NAME,
    CONF_DAD_NOTIFY,
    CONF_GO_HOME_MARGIN,
    CONF_KID_NOTIFY,
    CONF_KIDS,
    CONF_MOM_ALIASES,
    CONF_MOM_CALENDARS,
    CONF_MOM_NAME,
    CONF_MOM_NOTIFY,
    CONF_NAME,
    CONF_NO_ADDRESS_TRAVEL,
    CONF_NO_DRIVER_ALERTS,
    CONF_PLANNER,
    CONF_REMIND_BEFORE,
    CONF_TAKE_ALONG_WINDOW,
    CONF_TIGHT_SLACK,
    CONF_TOO_EARLY,
    CONF_WAITING_AFTER,
    DEFAULT_PLANNER,
    DEFAULT_REMIND_BEFORE,
    NOTIFY_OFF,
)
from .notes import DriverDirectory
from .planner import PlannerSettings
from .week import CalendarRoles, KidCalendar


@dataclass(frozen=True, slots=True)
class ReminderSettings:
    notify: Mapping[str, str] = field(default_factory=dict)
    """Each person's notify service, by driver id or kid calendar id. Nobody else gets one."""
    before: int = DEFAULT_REMIND_BEFORE
    """Minutes before leaving."""
    no_driver_alerts: bool = True
    calendar: bool = True
    """Also save each drive's reminder on its first drop-off event in Google Calendar."""


@dataclass(frozen=True, slots=True)
class HubSettings:
    planner: PlannerSettings
    directory: DriverDirectory
    no_address_travel: int
    roles: CalendarRoles = field(default_factory=CalendarRoles)
    reminders: ReminderSettings = field(default_factory=ReminderSettings)

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
        kids = _kids(options.get(CONF_KIDS))
        return cls(
            planner=PlannerSettings(
                arrive_early=int(planner[CONF_ARRIVE_EARLY]),
                arrive_early_max=int(planner[CONF_ARRIVE_EARLY_MAX]),
                arrive_early_per=int(planner[CONF_ARRIVE_EARLY_PER]),
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
                kids={k.calendar_id: k.name for k in kids},
            ),
            no_address_travel=int(planner[CONF_NO_ADDRESS_TRAVEL]),
            roles=CalendarRoles(
                kids=kids,
                busy={
                    "mom": _ids(options.get(CONF_MOM_CALENDARS)),
                    "dad": _ids(options.get(CONF_DAD_CALENDARS)),
                },
            ),
            reminders=ReminderSettings(
                notify=_notifiers(options, kids),
                before=int(options.get(CONF_REMIND_BEFORE, DEFAULT_REMIND_BEFORE)),
                no_driver_alerts=bool(options.get(CONF_NO_DRIVER_ALERTS, True)),
                calendar=bool(options.get(CONF_CALENDAR_REMINDERS, True)),
            ),
        )


def _notifiers(options: Mapping[str, Any], kids: tuple[KidCalendar, ...]) -> dict[str, str]:
    kid_notify = options.get(CONF_KID_NOTIFY)
    kid_notify = kid_notify if isinstance(kid_notify, Mapping) else {}
    pairs = [("mom", options.get(CONF_MOM_NOTIFY)), ("dad", options.get(CONF_DAD_NOTIFY))]
    pairs += [(k.calendar_id, kid_notify.get(k.calendar_id)) for k in kids]
    return {who: str(service) for who, service in pairs if service and service != NOTIFY_OFF}


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
