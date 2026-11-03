"""The integration's options, turned into what the planner and notes parser need.

Pure module, no Home Assistant imports.
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any

from .const import (
    CONF_ARRIVE_EARLY,
    CONF_CARPOOLS,
    CONF_DAD_ALIASES,
    CONF_DAD_NAME,
    CONF_GO_HOME_MARGIN,
    CONF_MOM_ALIASES,
    CONF_MOM_NAME,
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


@dataclass(frozen=True, slots=True)
class HubSettings:
    planner: PlannerSettings
    directory: DriverDirectory
    no_address_travel: int

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
