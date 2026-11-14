"""Reading who an event is for from the start of its title."""

from __future__ import annotations

import pytest

from custom_components.mydashlight.who import People, initials, names_text, read_names, read_title

PEOPLE = People(
    kids={"ava": "Ava", "ben": "Ben", "cleo": "Cleo"},
    parents={"mom": "Robin", "dad": "Sam"},
    aliases={"mom": ["Mom"], "dad": ["Dad"], "cleo": ["Clee"], "nobody": ["Ghost"]},
    all_kids=["the kids"],
)


@pytest.mark.parametrize(
    ("title", "people"),
    [
        ("Ava Ballet", ("ava",)),
        ("ava ballet", ("ava",)),
        ("Ben & Cleo Dentist", ("ben", "cleo")),
        ("Ben& Cleo Crazy sock day", ("ben", "cleo")),
        ("Ben &Cleo Crazy sock day", ("ben", "cleo")),
        ("Dad, Ben & Cleo Donuts", ("dad", "ben", "cleo")),
        ("Ava & Mom Nutcracker", ("ava", "mom")),
        ("Mom & Dad Dinner", ("mom", "dad")),
        ("Robin Grand Rounds", ("mom",)),
        ("Sam - Dr Appt.", ("dad",)),
        ("Sam: call the office", ("dad",)),
        ("Cleo's Birthday!", ("cleo",)),
        ("Ben & Cleo's passports expire", ("ben", "cleo")),
        ("Clee Soccer", ("cleo",)),
        ("AB&C Passports", ("ava", "ben", "cleo")),
        ("A, B & C passports expire in 3mo", ("ava", "ben", "cleo")),
        ("A,B&C passports", ("ava", "ben", "cleo")),
        ("the kids Flu shots", ("ava", "ben", "cleo")),
        ("Ava & AB&C", ("ava", "ben", "cleo")),
        ("❤️ Robin & Sam Anniversary ❤️", ("mom", "dad")),
        ("Ava & Ava Ballet", ("ava",)),
    ],
)
def test_names_at_the_start(title: str, people: tuple[str, ...]) -> None:
    assert read_title(title, PEOPLE).people == people


@pytest.mark.parametrize(
    "title",
    [
        "Trash & Recycling Day",
        "Happy Hour Robin",
        "Eat lunch with Ben",
        "CCL Ben & Cleo",
        "Avalanche game",
        "Benefit dinner",
        "No School - Professional Development Day",
        "Ghost tour",
        "",
        None,
    ],
)
def test_nobody(title: str | None) -> None:
    assert read_title(title, PEOPLE).people == ()


def test_no_means_not_going() -> None:
    who = read_title("NO Cleo Soccer (Open Play)", PEOPLE)
    assert who.people == ("cleo",)
    assert who.cancelled
    assert who.title == "Cleo Soccer (Open Play)"
    assert not read_title("No School - Thanksgiving", PEOPLE).cancelled


def test_a_join_to_someone_outside_the_family() -> None:
    who = read_title("Ava & Zoe Sleepover", PEOPLE)
    assert who.people == ("ava",)
    assert who.unknown == "Zoe"
    assert read_title("Ava Ballet", PEOPLE).unknown is None


def test_title_keeps_its_wording() -> None:
    assert read_title("  Ava   Tap ", PEOPLE).title == "Ava Tap"


def test_initials() -> None:
    assert initials(["Ava", "Ben", "Cleo"]) == ("AB&C", "A, B & C")
    assert initials(["Ava", "Ben"]) == ("A&B", "A & B")
    assert initials(["Ava"]) == ()


def test_one_kid_has_no_all_kids_shortcut() -> None:
    people = People(kids={"ava": "Ava"}, all_kids=["the kids"])
    assert read_title("the kids party", people).people == ()


@pytest.mark.parametrize(
    ("title", "rest"),
    [
        ("Ava Lunch: Pizza", "Lunch: Pizza"),
        ("Ben & Cleo   Lunch", "Lunch"),
        ("Sam - Dr Appt.", "Dr Appt."),
        ("Cleo's Birthday!", "Birthday!"),
        ("NO Ava Golf", "Golf"),
        ("Ava & Zoe Sleepover", "& Zoe Sleepover"),
        ("Trash & Recycling Day", "Trash & Recycling Day"),
    ],
)
def test_the_rest_of_the_title(title: str, rest: str) -> None:
    assert read_title(title, PEOPLE).rest == rest


@pytest.mark.parametrize(
    ("text", "people", "unknown"),
    [
        ("Ava", ("ava",), None),
        ("Ava & Ben", ("ava", "ben"), None),
        ("ava, ben & cleo", ("ava", "ben", "cleo"), None),
        ("Mom & Clee", ("mom", "cleo"), None),
        ("AB&C", ("ava", "ben", "cleo"), None),
        ("Ava, Zoe", ("ava",), "Zoe"),
        ("Ava Zoe", ("ava",), "Zoe"),
        ("Zoe", (), "Zoe"),
        ("Ben.", ("ben",), None),
        ("nobody", (), None),
        ("", (), None),
        (None, (), None),
    ],
)
def test_read_names(text: str | None, people: tuple[str, ...], unknown: str | None) -> None:
    assert read_names(text, PEOPLE) == (people, unknown)


def test_names_text() -> None:
    assert names_text([], PEOPLE) == ""
    assert names_text(["ava"], PEOPLE) == "Ava"
    assert names_text(["ava", "mom"], PEOPLE) == "Ava & Robin"
    assert names_text(["ava", "ben", "cleo", "ben"], PEOPLE) == "Ava, Ben & Cleo"
    # Read back, the same people in the same order.
    assert read_names(names_text(["dad", "cleo", "ava"], PEOPLE), PEOPLE) == (("dad", "cleo", "ava"), None)
