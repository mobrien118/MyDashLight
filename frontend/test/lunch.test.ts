import assert from "node:assert/strict";
import { test } from "node:test";
import {
  addDays,
  draftKey,
  isSchoolDay,
  lunchChip,
  lunchMonths,
  lunchOn,
  menuOn,
  menuSides,
  monthCounts,
  monthGrid,
  monthTitle,
  nextMonth,
  offLabel,
  weekday,
  type KidLunches,
  type LunchPayload,
} from "../src/lunch.ts";

// Wednesday.
const TODAY = "2026-11-04";

const ava: KidLunches = {
  id: "ava",
  name: "Ava",
  default: "buy",
  picks: { "2026-11-05": "bring", "2026-11-09": "bring", "2026-11-30": "buy" },
  menus: {
    "2026-11-04": { dish: "Pizza", details: "Or: chef salad" },
    // A menu on a day off isn't shown.
    "2026-11-26": { dish: "Turkey", details: "" },
  },
  days_off: [{ first: "2026-11-25", last: "2026-11-27", title: "No School – Thanksgiving Break" }],
};

const data: LunchPayload = {
  today: TODAY,
  first: "2026-11-01",
  last: "2026-12-31",
  kids: [ava],
  status: { ok: true, error: null },
};

test("dates", () => {
  assert.equal(addDays("2026-11-30", 1), "2026-12-01");
  assert.equal(addDays("2026-03-01", -1), "2026-02-28");
  assert.equal(weekday("2026-11-02"), 0);
  assert.equal(weekday("2026-11-08"), 6);
  assert.equal(nextMonth("2026-12"), "2027-01");
  assert.equal(nextMonth("2027-01", -1), "2026-12");
  assert.equal(monthTitle("2026-11"), "November 2026");
  assert.deepEqual(lunchMonths(data), ["2026-11", "2026-12"]);
});

test("school days and lunches", () => {
  assert.ok(isSchoolDay(ava, "2026-11-04"));
  assert.ok(!isSchoolDay(ava, "2026-11-07"), "Saturday");
  assert.ok(!isSchoolDay(ava, "2026-11-26"), "Thanksgiving");
  assert.deepEqual(lunchOn(ava, "2026-11-04"), { lunch: "buy", picked: false });
  assert.deepEqual(lunchOn(ava, "2026-11-05"), { lunch: "bring", picked: true });
  assert.equal(lunchOn(ava, "2026-11-26"), null);
  // A tap not seen back from Google yet wins, and null goes back to the default.
  const drafts = new Map([
    [draftKey("ava", "2026-11-04"), "bring" as const],
    [draftKey("ava", "2026-11-05"), null],
  ]);
  assert.deepEqual(lunchOn(ava, "2026-11-04", drafts), { lunch: "bring", picked: true });
  assert.deepEqual(menuOn(ava, "2026-11-04"), { dish: "Pizza", details: "Or: chef salad" });
  assert.equal(menuOn(ava, "2026-11-05"), null);
  assert.equal(menuOn(ava, "2026-11-26"), null);
  assert.equal(menuOn({ ...ava, menus: undefined }, "2026-11-04"), null);
  assert.deepEqual(lunchOn(ava, "2026-11-05", drafts), { lunch: "buy", picked: false });
});

test("the month grid is school weeks, Monday to Friday", () => {
  const weeks = monthGrid(data, ava, "2026-11");
  // Nov 1 is a Sunday: its week has no weekdays in November, so the first week starts Nov 2.
  assert.equal(weeks[0]![0]!.date, "2026-11-02");
  assert.equal(weeks.at(-1)![0]!.date, "2026-11-30");
  assert.equal(weeks.length, 5);
  assert.ok(weeks.every((w) => w.length === 5));
  const last = weeks.at(-1)!;
  assert.ok(!last[0]!.outside);
  assert.ok(last[1]!.outside, "Dec 1 is drawn empty");
  assert.equal(last[1]!.lunch, null);
  const cell = (date: string) => weeks.flat().find((c) => c.date === date)!;
  assert.equal(cell("2026-11-03").past, true);
  assert.equal(cell("2026-11-04").today, true);
  assert.equal(cell("2026-11-05").lunch, "bring");
  assert.equal(cell("2026-11-05").picked, true);
  assert.equal(cell("2026-11-06").picked, false);
  assert.equal(cell("2026-11-26").off, "No School – Thanksgiving Break");
  assert.equal(cell("2026-11-26").lunch, null);
  assert.equal(cell("2026-11-04").menu, "Pizza");
  assert.equal(cell("2026-11-26").menu, null);
  assert.equal(last[1]!.menu, null);
  // From today on: Nov 4–24 and Nov 30 (15 school days), two of them Bring.
  assert.deepEqual(monthCounts(weeks), { bring: 2, buy: 14 });
});

test("a day off's name", () => {
  assert.equal(offLabel("No School – Thanksgiving Break"), "Thanksgiving Break");
  assert.equal(offLabel("Thanksgiving (No School)"), "Thanksgiving");
  assert.equal(offLabel("No school"), "No school");
  assert.equal(offLabel("NO SCHOOL: PD Day"), "PD Day");
});

test("the lunch chip on a kid's card", () => {
  // Morning: today's lunch.
  assert.deepEqual(lunchChip(ava, TODAY, 8 * 60), { lunch: "buy", when: "today", date: TODAY, menu: "Pizza" });
  // Afternoon on: the next school day's.
  assert.deepEqual(lunchChip(ava, TODAY, 19 * 60), { lunch: "bring", when: "tomorrow", date: "2026-11-05", menu: null });
  // Friday evening: Monday's.
  assert.deepEqual(lunchChip(ava, "2026-11-06", 19 * 60), { lunch: "bring", when: "Mon", date: "2026-11-09", menu: null });
  // The night before Thanksgiving break: the Monday after.
  assert.deepEqual(lunchChip(ava, "2026-11-24", 19 * 60), { lunch: "buy", when: "Mon", date: "2026-11-30", menu: null });
  const off: KidLunches = { ...ava, days_off: [{ first: "2026-11-04", last: "2026-11-20", title: "No School" }] };
  assert.equal(lunchChip(off, TODAY, 8 * 60), null);
});

test("the rest of a menu, without MyDashLight's feed note", () => {
  assert.equal(menuSides("Peas, Pears, Milk\n\nFrom the school's menu feed."), "Peas, Pears, Milk");
  assert.equal(menuSides("Or: chef salad\n Fruit "), "Or: chef salad\nFruit");
  assert.equal(menuSides("From the school's menu feed."), null);
  assert.equal(menuSides(""), null);
  const cell = monthGrid(data, ava, "2026-11").flat().find((c) => c.date === "2026-11-04")!;
  assert.equal(cell.sides, "Or: chef salad");
});
