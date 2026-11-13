"""The integration's options, turned into what the planner and notes parser need.

Pure module, no Home Assistant imports.
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass, field
from typing import Any

from .const import (
    CONF_ALIASES,
    CONF_ALL_KIDS,
    CONF_CALENDAR_ID,
    CONF_CALENDAR_REMINDERS,
    CONF_CARPOOLS,
    CONF_CHORE_DAYS,
    CONF_DAD_ALIASES,
    CONF_DAD_NAME,
    CONF_DAD_NOTIFY,
    CONF_DAD_PERSON,
    CONF_EVENTS_CALENDAR,
    CONF_GO_HOME_MARGIN,
    CONF_HOME_ADDRESS,
    CONF_KID_ID,
    CONF_KID_NOTIFY,
    CONF_KIDS,
    CONF_LUNCH_CALENDAR,
    CONF_LUNCH_DEFAULTS,
    CONF_LUNCH_FEEDS,
    CONF_MOM_ALIASES,
    CONF_MOM_NAME,
    CONF_MOM_NOTIFY,
    CONF_MOM_PERSON,
    CONF_NAME,
    CONF_NO_ADDRESS_TRAVEL,
    CONF_NO_DRIVER_ALERTS,
    CONF_NO_DRIVER_HOURS,
    CONF_PLANNER,
    CONF_REMIND_BEFORE,
    CONF_TAKE_ALONG_WINDOW,
    CONF_TIGHT_SLACK,
    CONF_TOO_EARLY,
    CONF_WAITING_AFTER,
    DEFAULT_CHORE_DAYS,
    DEFAULT_NO_DRIVER_HOURS,
    DEFAULT_PLANNER,
    DEFAULT_REMIND_BEFORE,
    DRIVERS,
    MAX_CHORE_DAYS,
    NOTIFY_OFF,
)
from .notes import DriverDirectory
from .planner import PlannerSettings
from .week import CalendarRoles, KidCalendar
from .who import People


@dataclass(frozen=True, slots=True)
class ReminderSettings:
    notify: Mapping[str, str] = field(default_factory=dict)
    """Each person's notify service, by driver id or kid id. Nobody else gets one."""
    before: int = DEFAULT_REMIND_BEFORE
    """Minutes before leaving."""
    no_driver_alerts: bool = True
    no_driver_hours: int = DEFAULT_NO_DRIVER_HOURS
    """How far ahead a ride with no driver is worth an alert."""
    calendar: bool = True
    """Also save each drive's reminder on its first drop-off event in Google Calendar."""
    people: Mapping[str, str] = field(default_factory=dict)
    """Each parent's person entity, by driver id, for checking they're on their way."""


@dataclass(frozen=True, slots=True)
class HubSettings:
    planner: PlannerSettings
    directory: DriverDirectory
    no_address_travel: int
    home_address: str = ""
    """Events here are at home and need no ride."""
    roles: CalendarRoles = field(default_factory=CalendarRoles)
    reminders: ReminderSettings = field(default_factory=ReminderSettings)
    chore_days_ahead: int = DEFAULT_CHORE_DAYS
    """How many days of chores, counting today, to keep on the kids' lists."""
    lunch_defaults: Mapping[str, str] = field(default_factory=dict)
    """Each kid's lunch when nobody picked, ``buy`` or ``bring``, by kid id."""
    lunch_feeds: Mapping[str, str] = field(default_factory=dict)
    """Each kid's school menu feed (an iCal address), by kid id. Kids without one aren't listed."""
    events_calendar: str = ""
    """The shared family calendar, or empty until it's picked."""
    lunch_calendar: str = ""
    """The calendar the kids' lunches are kept on, or empty when there's none."""
    people: People = field(default_factory=People)
    """Who's who, for reading the names at the start of each title."""

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
        aliases = {
            "mom": _names(options.get(CONF_MOM_ALIASES)),
            "dad": _names(options.get(CONF_DAD_ALIASES)),
            **_kid_aliases(options.get(CONF_KIDS)),
        }
        return cls(
            planner=PlannerSettings(
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
            home_address=" ".join(str(options.get(CONF_HOME_ADDRESS) or "").split()),
            # Everyone's events come from the one shared calendar, sorted into a lane each by
            # kid id or driver id, so each lane is read as if it were that person's calendar.
            roles=CalendarRoles(kids=kids, busy={d: (d,) for d in DRIVERS}),
            reminders=ReminderSettings(
                notify=_notifiers(options, kids),
                before=int(options.get(CONF_REMIND_BEFORE, DEFAULT_REMIND_BEFORE)),
                no_driver_alerts=bool(options.get(CONF_NO_DRIVER_ALERTS, True)),
                no_driver_hours=max(1, int(options.get(CONF_NO_DRIVER_HOURS, DEFAULT_NO_DRIVER_HOURS))),
                calendar=bool(options.get(CONF_CALENDAR_REMINDERS, True)),
                people={
                    who: str(entity)
                    for who, entity in (("mom", options.get(CONF_MOM_PERSON)), ("dad", options.get(CONF_DAD_PERSON)))
                    if isinstance(entity, str) and entity.startswith("person.")
                },
            ),
            chore_days_ahead=min(MAX_CHORE_DAYS, max(1, int(options.get(CONF_CHORE_DAYS, DEFAULT_CHORE_DAYS)))),
            lunch_defaults=_lunch_defaults(options.get(CONF_LUNCH_DEFAULTS), kids),
            lunch_feeds=_lunch_feeds(options.get(CONF_LUNCH_FEEDS), kids),
            events_calendar=str(options.get(CONF_EVENTS_CALENDAR) or ""),
            lunch_calendar=str(options.get(CONF_LUNCH_CALENDAR) or ""),
            people=People(
                kids={k.calendar_id: k.name for k in kids},
                parents=names,
                aliases=aliases,
                all_kids=_names(options.get(CONF_ALL_KIDS)),
            ),
        )


def _lunch_defaults(value: object, kids: tuple[KidCalendar, ...]) -> dict[str, str]:
    """Each kid's default lunch: ``bring`` only when set so, else ``buy``."""
    saved = value if isinstance(value, Mapping) else {}
    return {k.calendar_id: "bring" if saved.get(k.calendar_id) == "bring" else "buy" for k in kids}


def _lunch_feeds(value: object, kids: tuple[KidCalendar, ...]) -> dict[str, str]:
    saved = value if isinstance(value, Mapping) else {}
    return {k.calendar_id: str(saved[k.calendar_id]) for k in kids if saved.get(k.calendar_id)}


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


def kid_id(item: Mapping[str, Any]) -> str:
    """A kid's id in the options: its own, or the id of the calendar they had before 0.19."""
    return str(item.get(CONF_KID_ID) or item.get(CONF_CALENDAR_ID) or "")


def _kids(value: object) -> tuple[KidCalendar, ...]:
    if not isinstance(value, (list, tuple)):
        return ()
    out: list[KidCalendar] = []
    for item in value:
        if not isinstance(item, Mapping):
            continue
        kid = kid_id(item)
        if kid and all(k.calendar_id != kid for k in out):
            out.append(KidCalendar(kid, _name(item.get(CONF_NAME), kid)))
    return tuple(out)


def _kid_aliases(value: object) -> dict[str, tuple[str, ...]]:
    if not isinstance(value, (list, tuple)):
        return {}
    return {
        kid_id(item): _names(item.get(CONF_ALIASES)) for item in value if isinstance(item, Mapping) and kid_id(item)
    }
