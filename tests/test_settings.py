"""Turning options into planner and notes settings."""

from __future__ import annotations

from custom_components.family_hub.planner import PlannerSettings
from custom_components.family_hub.settings import HubSettings


def test_defaults_for_missing_options() -> None:
    settings = HubSettings.from_options({})
    assert settings.planner == PlannerSettings()
    assert settings.no_address_travel == 15
    assert settings.driver_names == {"mom": "Mom", "dad": "Dad"}


def test_options() -> None:
    settings = HubSettings.from_options(
        {
            "mom_name": "Robin",
            "dad_name": " Sam ",
            "mom_aliases": ["Rae", " Mom ", "mom", ""],
            "dad_aliases": "Dad, Pops",
            "carpools": ["the Parkers"],
            "planner": {"take_along_window": 30, "no_address_travel": 20},
        }
    )
    assert settings.driver_names == {"mom": "Robin", "dad": "Sam"}
    assert settings.directory.aliases == {"mom": ("Rae", "Mom"), "dad": ("Dad", "Pops")}
    assert settings.planner == PlannerSettings(take_along_window=30)
    assert settings.no_address_travel == 20
    assert settings.directory.resolve("pops") == "dad"
    assert settings.directory.resolve("THE PARKERS") == "the Parkers"
