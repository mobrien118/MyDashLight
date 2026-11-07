"""School menu feeds: reading an iCal feed, picking out lunch, and the changes that copy it
onto a kid's calendar."""

from __future__ import annotations

from datetime import date, timedelta

from custom_components.mydashlight.google import CalendarEvent
from custom_components.mydashlight.menu_feed import (
    FEED_NOTE,
    FeedMenu,
    feed_changes,
    feed_menus,
    lunch_of_meal,
    read_feed,
    webcal_to_https,
)
from custom_components.mydashlight.school import MENU_FROM_FEED, MENU_MARK, SchoolCalendar, read_school

# Shaped like a real district feed: breakfast and lunch as separate all-day events, escaped
# commas and semicolons, a folded line, and days with no school.
FEED = (
    "BEGIN:VCALENDAR\r\n"
    "VERSION:2.0\r\n"
    "PRODID:-//School District/finalsite//NONSGML v1.0//EN\r\n"
    "X-WR-CALNAME:Elementary School Menus\r\n"
    "BEGIN:VEVENT\r\n"
    "UID:1@example\r\n"
    "DTSTART;VALUE=DATE:20261105\r\n"
    "SUMMARY:B: Dutch Waffle\\, Choice of Fruit and/or Juice\\, Choice of Cold Milk\r\n"
    "DESCRIPTION:\r\n"
    "END:VEVENT\r\n"
    "BEGIN:VEVENT\r\n"
    "UID:2@example\r\n"
    "DTSTART;VALUE=DATE:20261105\r\n"
    "SUMMARY:L\\; Wild Mike's Cheese Pocket w/ Marinara Sauce\\, Italian Sweet Peas\\, Fres\r\n"
    " h Honeydew Slices\\, Choice of Cold Milk\r\n"
    "DESCRIPTION:\r\n"
    "END:VEVENT\r\n"
    "BEGIN:VEVENT\r\n"
    "UID:3@example\r\n"
    "DTSTART;VALUE=DATE:20261106\r\n"
    "SUMMARY:L: Nachos Supreme w/ Queso\\, Southwestern Refried Beans\r\n"
    "END:VEVENT\r\n"
    "BEGIN:VEVENT\r\n"
    "UID:4@example\r\n"
    "DTSTART;VALUE=DATE:20261109\r\n"
    "SUMMARY:L: Create Your Own Pizza\\, Parmesan Roasted Broccoli\r\n"
    "END:VEVENT\r\n"
    "BEGIN:VEVENT\r\n"
    "UID:5@example\r\n"
    "DTSTART;VALUE=DATE:20261125\r\n"
    "SUMMARY:NO SCHOOL\r\n"
    "END:VEVENT\r\n"
    "END:VCALENDAR\r\n"
)

FIRST = date(2026, 11, 1)
LAST = date(2026, 12, 31)
TODAY = date(2026, 11, 5)


def test_reads_the_feed() -> None:
    events = read_feed(FEED)
    assert [(e.day.isoformat(), e.title[:24]) for e in events] == [
        ("2026-11-05", "B: Dutch Waffle, Choice "),
        ("2026-11-05", "L; Wild Mike's Cheese Po"),
        ("2026-11-06", "L: Nachos Supreme w/ Que"),
        ("2026-11-09", "L: Create Your Own Pizza"),
        ("2026-11-25", "NO SCHOOL"),
    ]
    assert events[1].title.endswith("Fresh Honeydew Slices, Choice of Cold Milk")
    assert read_feed("<html>Not found</html>") == []


def test_lunch_of_meal() -> None:
    assert lunch_of_meal("B: Waffles") is None
    assert lunch_of_meal("Breakfast - Waffles") is None
    assert lunch_of_meal("L: Pizza, Peas") == "Pizza, Peas"
    assert lunch_of_meal("Lunch: Pizza") == "Pizza"
    assert lunch_of_meal("Chicken nuggets") == "Chicken nuggets"
    assert lunch_of_meal("NO SCHOOL") is None
    assert lunch_of_meal("No School - Thanksgiving") is None
    assert lunch_of_meal("  ") is None
    assert webcal_to_https("webcal://example.org/menu.ics") == "https://example.org/menu.ics"
    assert webcal_to_https(" https://example.org/menu.ics ") == "https://example.org/menu.ics"


def test_feed_menus() -> None:
    menus = feed_menus(read_feed(FEED))
    assert menus == {
        date(2026, 11, 5): FeedMenu(
            "Wild Mike's Cheese Pocket w/ Marinara Sauce",
            "Italian Sweet Peas, Fresh Honeydew Slices, Choice of Cold Milk",
        ),
        date(2026, 11, 6): FeedMenu("Nachos Supreme w/ Queso", "Southwestern Refried Beans"),
        date(2026, 11, 9): FeedMenu("Create Your Own Pizza", "Parmesan Roasted Broccoli"),
    }
    # A second lunch the same day is another choice.
    two = feed_menus(read_feed(FEED.replace("SUMMARY:B: Dutch Waffle", "SUMMARY:L: Chef Salad")))[date(2026, 11, 5)]
    assert two.dish == "Chef Salad"
    assert two.details.endswith(
        "\nOr: Wild Mike's Cheese Pocket w/ Marinara Sauce, Italian Sweet Peas, Fresh Honeydew Slices, "
        "Choice of Cold Milk"
    )


def event(event_id: str, title: str, day: str, notes: str = "", feed: bool = False) -> CalendarEvent:
    start = date.fromisoformat(day)
    private = ((MENU_MARK, MENU_FROM_FEED),) if feed else ()
    return CalendarEvent(
        "ava", event_id, f'"{event_id}"', title, "", notes, start, start + timedelta(days=1), False, private=private
    )


def school(*events: CalendarEvent) -> SchoolCalendar:
    return read_school({"ava": list(events)}, {}, FIRST, LAST)


def test_feed_changes() -> None:
    menus = feed_menus(read_feed(FEED))
    cal = school(
        # Typed by hand: left alone.
        event("hand", "Lunch: Pizza Friday!", "2026-11-06"),
        # Copied from the feed before, now different: follows the feed.
        event("old", "Lunch: Tacos", "2026-11-09", FEED_NOTE, feed=True),
        # Copied from the feed, and the feed dropped that day: removed.
        event("gone", "Lunch: Fish", "2026-11-05", FEED_NOTE, feed=True),
        event("gone2", "Lunch: Fish", "2026-11-10", FEED_NOTE, feed=True),
        # Out of the feed's days: left alone.
        event("later", "Lunch: Soup", "2026-12-01", FEED_NOTE, feed=True),
        event("off", "No School", "2026-11-25"),
    )
    changes = feed_changes(cal, "ava", menus, TODAY, LAST)
    made = [(c.day.isoformat(), c.make) for c in changes if c.make]
    updated = [(c.day.isoformat(), c.update) for c in changes if c.update]
    removed = [(c.day.isoformat(), c.remove) for c in changes if c.remove]
    assert made == []
    assert updated == [
        (
            "2026-11-05",
            (
                "gone",
                '"gone"',
                "Lunch: Wild Mike's Cheese Pocket w/ Marinara Sauce",
                f"Italian Sweet Peas, Fresh Honeydew Slices, Choice of Cold Milk\n\n{FEED_NOTE}",
            ),
        ),
        ("2026-11-09", ("old", '"old"', "Lunch: Create Your Own Pizza", f"Parmesan Roasted Broccoli\n\n{FEED_NOTE}")),
    ]
    assert removed == []
    assert all(c.from_feed for c in changes)

    # A calendar with nothing yet gets every school day from today on.
    changes = feed_changes(school(), "ava", menus, date(2026, 11, 6), LAST)
    assert [(c.day.isoformat(), c.make[0]) for c in changes if c.make] == [
        ("2026-11-06", "Lunch: Nachos Supreme w/ Queso"),
        ("2026-11-09", "Lunch: Create Your Own Pizza"),
    ]

    # Nothing changes the second time.
    synced = school(
        event("a", "Lunch: Nachos Supreme w/ Queso", "2026-11-06", f"Southwestern Refried Beans\n\n{FEED_NOTE}", True),
        event("b", "Lunch: Create Your Own Pizza", "2026-11-09", f"Parmesan Roasted Broccoli\n\n{FEED_NOTE}", True),
        # A feed menu on a day the feed no longer has, inside the days it covers.
        event("c", "Lunch: Fish", "2026-11-07", FEED_NOTE, True),
    )
    changes = feed_changes(synced, "ava", menus, date(2026, 11, 6), LAST)
    assert [(c.day.isoformat(), c.remove) for c in changes] == [("2026-11-07", ("c", '"c"'))]


def test_feed_keeps_the_pick() -> None:
    """The kid's pick at the end of the notes stays when the feed fills, changes or drops a menu."""
    menus = feed_menus(read_feed(FEED))
    pick = "\n\n--- Lunch ---\nPick: Bring"
    cal = school(
        # A pick with no menu yet: the feed fills it in.
        event("p", "Lunch", "2026-11-06", pick.strip()),
        # A feed menu the feed changed: the pick stays.
        event("old", "Lunch: Tacos", "2026-11-09", FEED_NOTE + pick, feed=True),
        # A feed menu the feed dropped: back to just the pick.
        event("gone", "Lunch: Fish", "2026-11-07", FEED_NOTE + pick, feed=True),
    )
    changes = feed_changes(cal, "ava", menus, date(2026, 11, 6), LAST)
    assert [(c.day.isoformat(), c.update) for c in changes] == [
        (
            "2026-11-06",
            ("p", '"p"', "Lunch: Nachos Supreme w/ Queso", f"Southwestern Refried Beans\n\n{FEED_NOTE}{pick}"),
        ),
        (
            "2026-11-09",
            ("old", '"old"', "Lunch: Create Your Own Pizza", f"Parmesan Roasted Broccoli\n\n{FEED_NOTE}{pick}"),
        ),
        ("2026-11-07", ("gone", '"gone"', "Lunch", pick.strip())),
    ]
    assert [c.from_feed for c in changes] == [True, True, False]
