"""Reading and writing ride lines in event notes."""

from __future__ import annotations

import pytest

from custom_components.family_hub.notes import (
    DriverDirectory,
    RideNotes,
    parse_clock,
    parse_duration,
    parse_notes,
    write_notes,
)
from custom_components.family_hub.planner import NOT_NEEDED, UNASSIGNED

DIRECTORY = DriverDirectory(
    names={"mom": "Robin", "dad": "Sam"},
    aliases={"mom": ["Rae", "Mom"], "dad": ["Dad"]},
    carpools=["the Parkers", "Jordan"],
)


def parse(text: str | None, **kwargs: int) -> RideNotes:
    return parse_notes(text, DIRECTORY, **kwargs)


# Reading


def test_block_at_the_end() -> None:
    notes = parse(
        "Bring shin guards. Field 3.\n\n--- Rides ---\nDrop-off: Sam\nPick-up: the Parkers\n"
        "Stay: yes\nArrive by: 5:15 PM\nTravel: 25 min"
    )
    assert notes == RideNotes(
        drop="dad", pick="the Parkers", stay=True, arrive_by=17 * 60 + 15, travel=25, has_block=True
    )


@pytest.mark.parametrize("text", [None, "", "Just a note", "\n\n"])
def test_nothing_to_read(text: str | None) -> None:
    assert parse(text) == RideNotes()


@pytest.mark.parametrize(
    "label", ["Drop-off", "Drop off", "Dropoff", "drop-off", "DROP OFF", "Drop_off", "  Drop - off "]
)
def test_labels_ignore_case_spaces_and_hyphens(label: str) -> None:
    assert parse(f"{label}: Robin").drop == "mom"


@pytest.mark.parametrize("label", ["Pick-up", "Pickup", "pick up"])
def test_pick_up_labels(label: str) -> None:
    assert parse(f"{label}: Robin").pick == "mom"


@pytest.mark.parametrize(
    ("value", "driver"),
    [
        ("Robin", "mom"),
        ("robin", "mom"),
        ("Rae", "mom"),
        ("Mom", "mom"),
        ("Sam", "dad"),
        ("DAD", "dad"),
        ("  Sam  ", "dad"),
        ("Not needed", NOT_NEEDED),
        ("not needed", NOT_NEEDED),
        ("None", NOT_NEEDED),
        ("N/A", NOT_NEEDED),
        ("", UNASSIGNED),
        ("the parkers", "the Parkers"),
        ("the  Parkers", "the Parkers"),
        ("Grandma Jo", "Grandma Jo"),
    ],
)
def test_driver_names(value: str, driver: str) -> None:
    assert parse(f"Drop-off: {value}").drop == driver


def test_driver_ids_are_accepted() -> None:
    """The ids themselves resolve, so a service call with driver "dad" round-trips."""
    assert DIRECTORY.resolve("dad") == "dad"
    assert DIRECTORY.resolve("mom") == "mom"


def test_rides_block_shields_the_notes_above_it() -> None:
    notes = parse("Pick-up: bring cleats\nDrop-off: ask coach\n\n--- Rides ---\nDrop-off: Sam")
    assert notes.drop == "dad"
    assert notes.pick == UNASSIGNED


def test_loose_lines_count_without_a_block() -> None:
    notes = parse("Coach: Ms. Lee\nDrop off: Mom\nBring water")
    assert notes.drop == "mom"
    assert notes.has_block is False


def test_unrelated_colon_lines_are_ignored() -> None:
    notes = parse("--- Rides ---\nCoach: Ms. Lee\nNote: gate code 1234\nDrop-off: Sam")
    assert notes == RideNotes(drop="dad", has_block=True)


def test_last_line_for_a_field_wins() -> None:
    assert parse("--- Rides ---\nDrop-off: Robin\nDrop-off: Sam").drop == "dad"


@pytest.mark.parametrize("header", ["--- Rides ---", "---rides---", "-- RIDES --", "  ----- Rides -----  "])
def test_header_variants(header: str) -> None:
    assert parse(f"Pick-up: soon\n{header}\nDrop-off: Sam") == RideNotes(drop="dad", has_block=True)


@pytest.mark.parametrize(
    ("value", "stay"), [("yes", True), ("Yes", True), ("y", True), ("true", True), ("no", False), ("", False)]
)
def test_stay(value: str, stay: bool) -> None:
    notes = parse(f"Stay: {value}")
    assert notes.stay is stay
    assert notes.problems == ()


def test_unreadable_values_are_reported_not_guessed() -> None:
    notes = parse("--- Rides ---\nStay: maybe\nArrive by: soonish\nTravel: a while")
    assert notes.stay is False
    assert notes.arrive_by is None
    assert notes.travel is None
    assert notes.problems == (
        "Stay: “maybe” isn’t yes or no",
        "Arrive by: “soonish” isn’t a time",
        "Travel: “a while” isn’t a number of minutes",
    )


def test_crlf_notes() -> None:
    assert parse("Note\r\n\r\n--- Rides ---\r\nDrop-off: Sam\r\n").drop == "dad"


# HTML from the Google Calendar web editor


def test_html_with_breaks_and_formatting() -> None:
    notes = parse(
        'Bring <b>cleats</b><br><a href="https://example.com">Map</a><br><br>'
        "--- Rides ---<br><b>Drop-off:</b> Sam<br>Pick-up:&nbsp;the Parkers"
    )
    assert notes == RideNotes(drop="dad", pick="the Parkers", has_block=True)


def test_html_paragraphs_and_divs() -> None:
    notes = parse(
        "<p>Hello</p><div>--- Rides ---</div><div>Stay: yes</div><div>Drop-off: Robin</div><div>Pick-up: Robin</div>"
    )
    assert notes == RideNotes(drop="mom", pick="mom", stay=True, has_block=True)


def test_html_entities() -> None:
    assert parse("--- Rides ---<br>Pick-up: Tom &amp; Jerry").pick == "Tom & Jerry"


# Times and durations


@pytest.mark.parametrize(
    ("value", "minutes"),
    [
        ("5:15 PM", 1035),
        ("5:15pm", 1035),
        ("5:15 p.m.", 1035),
        ("5 PM", 1020),
        ("5pm", 1020),
        ("12:00 PM", 720),
        ("12:30 AM", 30),
        ("17:15", 1035),
        ("07:05", 425),
        ("9:00 am", 540),
    ],
)
def test_clock(value: str, minutes: int) -> None:
    assert parse_clock(value) == minutes


@pytest.mark.parametrize("value", ["", "soon", "13 PM", "5:75", "25:00", "5"])
def test_clock_rejects(value: str) -> None:
    assert parse_clock(value) is None


def test_clock_without_am_pm_uses_the_event() -> None:
    """With no AM or PM, take the reading just before the event starts."""
    assert parse_clock("5:15", event_start=17 * 60 + 30) == 17 * 60 + 15
    assert parse_clock("7:45", event_start=8 * 60) == 7 * 60 + 45
    assert parse_clock("17:15", event_start=18 * 60) == 17 * 60 + 15


def test_minutes_before_the_start() -> None:
    assert parse_clock("15 min early", event_start=1050) == 1035
    assert parse_clock("20 minutes before", event_start=1050) == 1030
    assert parse_clock("15 min early") is None
    assert parse("Arrive by: 15 min early", event_start=1050).arrive_by == 1035


@pytest.mark.parametrize(
    ("value", "minutes"),
    [
        ("25 min", 25),
        ("25", 25),
        ("25 mins", 25),
        ("25 minutes", 25),
        ("1 hr", 60),
        ("1h 10m", 70),
        ("1 hour 5 min", 65),
    ],
)
def test_duration(value: str, minutes: int) -> None:
    assert parse_duration(value) == minutes


@pytest.mark.parametrize("value", ["", "soon", "min", "1.5 hr"])
def test_duration_rejects(value: str) -> None:
    assert parse_duration(value) is None


# Writing


def write(text: str | None, **changes: object) -> str:
    return write_notes(text, DIRECTORY, **changes)  # type: ignore[arg-type]


def test_first_write_adds_a_block_after_one_blank_line() -> None:
    assert write("Bring shin guards.", drop="dad") == "Bring shin guards.\n\n--- Rides ---\nDrop-off: Sam"


def test_first_write_to_empty_notes() -> None:
    assert write(None, pick="the parkers") == "--- Rides ---\nPick-up: the Parkers"
    assert write("", drop=NOT_NEEDED) == "--- Rides ---\nDrop-off: Not needed"


def test_replace_in_place_and_keep_everything_else() -> None:
    text = "Field 3\nCoach: Ms. Lee\n\n--- Rides ---\nDrop-off: Robin\nGate code 1234\nPick-up: Jordan"
    assert write(text, drop="dad") == (
        "Field 3\nCoach: Ms. Lee\n\n--- Rides ---\nDrop-off: Sam\nGate code 1234\nPick-up: Jordan"
    )


def test_new_lines_go_at_the_end_of_the_block() -> None:
    text = "--- Rides ---\nDrop-off: Robin"
    assert write(text, arrive_by=1035, stay=True, pick="mom") == (
        "--- Rides ---\nDrop-off: Robin\nPick-up: Robin\nStay: yes\nArrive by: 5:15 PM"
    )


def test_defaults_remove_lines_then_the_block() -> None:
    text = "Field 3\n\n--- Rides ---\nDrop-off: Robin\nStay: yes\nArrive by: 5:15 PM\nTravel: 25 min"
    assert write(text, stay=False, arrive_by=None) == "Field 3\n\n--- Rides ---\nDrop-off: Robin\nTravel: 25 min"
    assert write(text, drop=UNASSIGNED, stay=False, arrive_by=None, travel=None) == "Field 3"


def test_unchanged_values_leave_the_notes_alone() -> None:
    text = "Field 3\n\n\n--- Rides ---\ndrop off: sam  \nStay: y"
    assert write(text, drop="dad", stay=True) == text
    assert write(text, drop="Sam") == text
    assert write(text) == text
    assert write(None) == ""


def test_duplicate_lines_collapse_into_one() -> None:
    assert write("--- Rides ---\nDrop-off: Robin\nPick-up: Jordan\nDrop-off: Sam", drop="mom") == (
        "--- Rides ---\nDrop-off: Robin\nPick-up: Jordan"
    )


def test_loose_lines_move_into_the_new_block() -> None:
    text = "Coach: Ms. Lee\nDropoff: mom\nBring water\nStay: yes"
    assert write(text, pick="mom") == (
        "Coach: Ms. Lee\nBring water\n\n--- Rides ---\nDrop-off: Robin\nPick-up: Robin\nStay: yes"
    )


def test_loose_lines_go_when_the_change_clears_them() -> None:
    assert write("Bring water\nDrop-off: Sam", drop="") == "Bring water"


def test_crlf_is_kept() -> None:
    assert write("Field 3\r\nBring water", drop="dad") == "Field 3\r\nBring water\r\n\r\n--- Rides ---\r\nDrop-off: Sam"


def test_written_notes_read_back() -> None:
    text = write("Bring water", drop="the parkers", pick="Rae", stay=False, arrive_by=1035, travel=25)
    assert parse(text) == RideNotes(drop="the Parkers", pick="mom", arrive_by=1035, travel=25, has_block=True)


def test_html_stays_html() -> None:
    text = 'Bring <b>cleats</b><br><a href="https://example.com">Map</a>'
    out = write(text, drop="dad", pick="Tom & Jerry")
    assert out == (
        'Bring <b>cleats</b><br><a href="https://example.com">Map</a>'
        "<br><br>--- Rides ---<br>Drop-off: Sam<br>Pick-up: Tom &amp; Jerry"
    )
    assert parse(out).pick == "Tom & Jerry"


def test_html_block_is_rewritten_in_place() -> None:
    text = "Map<br><br>--- Rides ---<br><b>Drop-off:</b> Robin<br>Gate <i>1234</i><br>Pick-up: Jordan"
    assert write(text, pick="mom") == (
        "Map<br><br>--- Rides ---<br><b>Drop-off:</b> Robin<br>Gate <i>1234</i><br>Pick-up: Robin"
    )


def test_html_block_removed_when_empty() -> None:
    text = "<p>Map</p><p>--- Rides ---</p><p>Drop-off: Robin</p>"
    assert write(text, drop="") == "<p>Map</p>"


def test_html_loose_lines_after_breaks() -> None:
    text = "Map<br>Drop-off: Mom<br>Bring water"
    assert write(text, stay=True, pick="mom") == (
        "Map<br>Bring water<br><br>--- Rides ---<br>Drop-off: Robin<br>Pick-up: Robin<br>Stay: yes"
    )


def test_html_loose_paragraph_is_dropped_whole() -> None:
    text = "<p>Notes here</p><p>Drop off: Dad</p><p>More</p>"
    assert write(text, stay=True) == "<p>Notes here</p><p>More</p><br><br>--- Rides ---<br>Drop-off: Sam<br>Stay: yes"


def test_html_loose_paragraph_next_to_bare_text_keeps_lines_apart() -> None:
    text = "intro<p>Drop off: Dad</p>outro"
    out = write(text, drop="mom")
    assert out == "intro<p></p>outro<br><br>--- Rides ---<br>Drop-off: Robin"
    assert parse(out).drop == "mom"
