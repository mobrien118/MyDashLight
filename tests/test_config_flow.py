"""Setting up MyDashLight and changing its options."""

from __future__ import annotations

from homeassistant.config_entries import SOURCE_USER
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.mydashlight.const import DEFAULT_PLANNER, DOMAIN


async def test_user_step_creates_the_entry(hass: HomeAssistant) -> None:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"mom_name": "  Robin ", "dad_name": "Sam"}
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "MyDashLight"
    entry = result["result"]
    assert entry.data == {}
    assert entry.options == {
        "mom_name": "Robin",
        "dad_name": "Sam",
        "mom_aliases": [],
        "dad_aliases": [],
        "carpools": [],
        "planner": DEFAULT_PLANNER,
    }
    assert entry.runtime_data.driver_names == {"mom": "Robin", "dad": "Sam"}


async def test_user_step_needs_two_different_names(hass: HomeAssistant) -> None:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})

    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"mom_name": " ", "dad_name": "Sam"})
    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {"mom_name": "name_required"}

    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"mom_name": "Sam", "dad_name": "sam"})
    assert result["errors"] == {"dad_name": "names_match"}

    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"mom_name": "Robin", "dad_name": "Sam"})
    assert result["type"] is FlowResultType.CREATE_ENTRY


async def test_only_one_entry(hass: HomeAssistant) -> None:
    MockConfigEntry(domain=DOMAIN, options={"mom_name": "Robin", "dad_name": "Sam"}).add_to_hass(hass)

    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "single_instance_allowed"


async def test_options_update_and_reload(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(
        domain=DOMAIN,
        options={"mom_name": "Robin", "dad_name": "Sam", "planner": dict(DEFAULT_PLANNER)},
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "init"

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "mom_name": "Robin",
            "dad_name": "Sam",
            "mom_aliases": ["Rae", "Mom"],
            "dad_aliases": ["Dad"],
            "carpools": ["the Parkers", "Jordan"],
            "planner": {**DEFAULT_PLANNER, "arrive_early": 10.0},
        },
    )
    await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert entry.options["planner"]["arrive_early"] == 10
    settings = entry.runtime_data
    assert settings.planner.arrive_early == 10
    assert settings.directory.resolve("rae") == "mom"
    assert settings.directory.resolve("the parkers") == "the Parkers"


async def test_options_reject_matching_names(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(domain=DOMAIN, options={"mom_name": "Robin", "dad_name": "Sam"})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)

    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"mom_name": "Robin", "dad_name": "ROBIN", "planner": dict(DEFAULT_PLANNER)},
    )

    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {"dad_name": "names_match"}
