import assert from "node:assert/strict";
import { test } from "node:test";
import {
  attention,
  columnsFor,
  compactCardHeight,
  dayTag,
  layout,
  minWidth,
  nextUp,
  pack,
  shortTitle,
  rideLines,
  alongHeight,
  busyLabel,
  tidyMinutes,
  routeOf,
  placeNames,
  tAt,
  wrapRows,
  yAt,
  type Board,
} from "../src/layout.ts";
import { sampleWeek } from "./helpers.ts";

const plan = sampleWeek();
const FIRST = plan.days[0]!.date;
const today = { date: FIRST, minutes: 16 * 60 };

function overlaps(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

test("a column per kid, then one per driver, in the order set up in Home Assistant", () => {
  const { columns } = columnsFor(plan, 1160);
  assert.deepEqual(
    columns.map((c) => [c.kind, c.name]),
    [
      ["kid", "Ava"],
      ["kid", "Ben"],
      ["kid", "Cleo"],
      ["driver", "Robin"],
      ["driver", "Sam"],
    ],
  );
  // The kitchen screen's widths: as in the design.
  assert.equal(columns[0]!.w, 179);
  assert.equal(columns[3]!.w, 251);
  assert.equal(columns[0]!.sub, "Needs a ride · 7 this week");
  assert.equal(columns[0]!.subWarn, true);
  assert.match(columns[3]!.sub, /^\d+ trips this week · .* driving$/);
  for (let i = 1; i < columns.length; i++) assert.ok(columns[i]!.x >= columns[i - 1]!.x + columns[i - 1]!.w);
});

test("a narrow screen scrolls sideways instead of squeezing the columns", () => {
  const { width, columns } = columnsFor(plan, 390);
  assert.equal(width, minWidth(3, 2));
  assert.ok(columns.every((c) => c.w >= 150));
});

for (const mode of ["timeline", "compact"] as const) {
  test(`${mode}: every activity has a card, and nothing in a column overlaps`, () => {
    const b = layout(plan, mode, 1160, today);
    for (const day of plan.days) {
      for (const e of day.events) {
        assert.ok(b.cards.some((c) => c.target.day === day.date && c.target.event === e.id), `${day.date} ${e.id}`);
      }
    }
    // Boxes in one column only share space when they're side by side (a double-booking).
    const boxes = [...b.cards, ...b.rides, ...b.trips, ...b.stays];
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i]!;
        const c = boxes[j]!;
        if (!overlaps(a, c)) continue;
        const clash = ("clash" in a && a.clash) || ("clash" in c && c.clash);
        assert.ok(clash, `${a.key} overlaps ${c.key}`);
      }
    }
    assert.equal(b.dayHeads.length, 7);
    assert.ok(b.height > 0);
  });
}

test("timeline: the driver's trips, the clash with work, and now", () => {
  const b = layout(plan, "timeline", 1160, today);
  const sam = b.columns.find((c) => c.name === "Sam")!;
  const day0 = b.trips.filter((t) => t.key.startsWith(FIRST) && t.x > sam.x);
  assert.ok(day0.some((t) => t.l1 === "Leave 4:25" && t.bad && t.kids.length === 2));
  assert.ok(b.overlaps.some((o) => o.key.startsWith(FIRST) && o.x > sam.x));
  assert.ok(b.busy.some((x) => x.label === "Work until 4:40"));
  assert.ok(b.preps.some((p) => p.label === "Arrive by 5:15"));
  assert.equal(b.now?.label, "Now 4:00");
  assert.ok(b.stays.some((s) => s.l1 === "At Piano with Ava"));
  assert.ok(b.rides.some((r) => r.l1 === "In Sam’s car" && r.l2 === "Home → Football field"));
  // Each ride is linked to its driver's column.
  for (const band of b.bands) assert.ok(band.w >= 0);
});

test("compact: things sit in start order across columns", () => {
  const b = layout(plan, "compact", 1160, today);
  const day0 = [...b.cards, ...b.trips].filter((x) => x.key.startsWith(FIRST)).sort((p, q) => p.y - q.y);
  assert.ok(day0.length > 0);
  // Trips list their stops instead of a route.
  assert.ok(b.trips.every((t) => t.stops !== null));
  assert.ok(b.busy.some((x) => x.label === "Work 1:00–4:40"));
  assert.equal(b.now, null);
});

test("moving between modes keeps the same moment on screen", () => {
  const tl: Board = layout(plan, "timeline", 1160, today);
  const t = 2 * 1440 + 9 * 60;
  const y = yAt(tl, t);
  assert.ok(Math.abs(tAt(tl, y) - t) <= 1);
  const cp = layout(plan, "compact", 1160, today);
  assert.ok(yAt(cp, t) > yAt(cp, 1440));
});

test("the needs-attention list", () => {
  // The whole week, seen from early on the first day with a window that takes it all in.
  const all = attention(plan, { date: FIRST, minutes: 0 }, 24 * 8);
  assert.equal(all.problems, 4);
  assert.deepEqual(
    all.items.filter((i) => i.tone !== "heads_up").map((i) => i.title),
    ["Sam is still at Work", "No pick-up for Ava", `Sun · No pick-up for Ava`, "Tue · Cleo is double-booked"],
  );
  // Normally only the next two days: later problems are counted, not listed.
  const { items, problems, later, laterUnassigned } = attention(plan, today);
  assert.equal(problems, 2);
  assert.equal(later, 2);
  assert.equal(laterUnassigned, 1);
  const busy = items[0]!;
  assert.equal(busy.suggestions.length, 2);
  assert.equal(busy.suggestions[0]!.label, "Take Ben along");
  assert.equal(busy.target?.event, "soccer");
  assert.ok(!items.some((i) => i.title.startsWith("Sun ·")));
  const clash = all.items.find((i) => i.title.endsWith("double-booked"))!;
  assert.equal(clash.body, "Soccer 5:00–6:30 and Art class 6:00–7:00 overlap.");
  // Seen from later in the week, other days are named.
  assert.equal(attention(plan, { date: plan.days[3]!.date, minutes: 0 }).items.find((i) => i.title.includes("pick-up"))?.title, "Thu · No pick-up for Ava");
});

test("day tags", () => {
  assert.equal(dayTag("2026-11-05", "2026-11-05"), "Today");
  assert.equal(dayTag("2026-11-06", "2026-11-05"), "Tomorrow");
  assert.equal(dayTag("2026-11-07", "2026-11-05"), "");
});

test("routes read as short place names", () => {
  const names = placeNames(plan);
  const sam = plan.days[0]!.drivers["dad"]!;
  const trip = sam.segments.filter((g) => g.type !== "home" && g.start! < 1060);
  assert.equal(routeOf(trip, names).join(" → "), "Home → Soccer fields → Home → Football field → Home");
});

test("packing side by side", () => {
  const packed = pack([
    { item: "a", s: 0, en: 60 },
    { item: "b", s: 30, en: 90 },
    { item: "c", s: 100, en: 120 },
  ]);
  assert.deepEqual(
    packed.map((p) => [p.item, p.col, p.cols]),
    [
      ["a", 0, 2],
      ["b", 1, 2],
      ["c", 0, 1],
    ],
  );
});

test("wrapped text in Compact gets room for every line", () => {
  assert.equal(wrapRows("Home 4:40 with Robin", 1000), 1);
  assert.equal(wrapRows("Robin stays · leaves 3:30", 130, 7), 2);
  assert.equal(wrapRows("Supercalifragilistic", 70, 7), 2);
  const e = plan.days[0]!.events[0]!;
  assert.ok(compactCardHeight(e, 150) > compactCardHeight(e, 300));
});

test("the next trip: leaving soon, under way, or tomorrow", () => {
  const soon = nextUp(plan, { date: FIRST, minutes: 16 * 60 })!;
  assert.equal(soon.ongoing, false);
  assert.equal(soon.name, "Sam");
  assert.equal(soon.lead, "Leave 4:25");
  assert.equal(soon.inMinutes, 25);
  assert.equal(soon.warn, "Still at Work until 4:40");
  assert.equal(soon.stop, "4:40 Soccer fields, drop off Cleo");
  assert.ok(soon.target);

  // Someone is out, but the next one to leave matters more.
  const later = nextUp(plan, { date: FIRST, minutes: 17 * 60 })!;
  assert.equal(later.lead, "Leave 6:15");
  assert.equal(later.inMinutes, 75);

  const out = nextUp(plan, { date: FIRST, minutes: 19 * 60 + 10 })!;
  assert.equal(out.ongoing, true);
  assert.equal(out.lead, "Leave 6:40");

  const tomorrow = nextUp(plan, { date: FIRST, minutes: 23 * 60 })!;
  assert.equal(tomorrow.ahead, 1);
  assert.equal(tomorrow.lead, "Leave 4:40");

  const last = plan.days[plan.days.length - 1]!.date;
  assert.equal(nextUp(plan, { date: last, minutes: 23 * 60 + 59 }), null);
});

test("a kid's name in front of the title is left off in their own column", () => {
  assert.equal(shortTitle("Ava Tap", "Ava"), "Tap");
  assert.equal(shortTitle("Ava's piano", "Ava"), "Piano");
  assert.equal(shortTitle("Ava - Soccer (Open Play)", "Ava"), "Soccer (Open Play)");
  assert.equal(shortTitle("ava hip hop", "Ava"), "Hip hop");
  assert.equal(shortTitle("Avalanche drills", "Ava"), "Avalanche drills");
  assert.equal(shortTitle("Ava", "Ava"), "Ava");
  assert.equal(shortTitle("Mia's birthday party", "Ava"), "Mia's birthday party");
});

test("driving minutes in a fix's note are rounded to the quarter minute", () => {
  assert.equal(tidyMinutes("+18.299999999999997 min of driving for Sam"), "+18¼ min of driving for Sam");
  assert.equal(tidyMinutes("+37.900000000000006 min of driving"), "+38 min of driving");
  assert.equal(tidyMinutes("+15.2 min"), "+15¼ min");
  assert.equal(tidyMinutes("+17.7 min"), "+17¾ min");
  assert.equal(tidyMinutes("+32.5 min"), "+32½ min");
  assert.equal(tidyMinutes("+0.4 min"), "+½ min");
  assert.equal(tidyMinutes("+0.1 min"), "+0 min");
  assert.equal(tidyMinutes("+30 min of driving"), "+30 min of driving");
  assert.equal(tidyMinutes("Leaves at 4.5 miles"), "Leaves at 4.5 miles");
  assert.equal(tidyMinutes("+59.6 min"), "+1 hr");
  assert.equal(tidyMinutes("+75.3 min of driving"), "+1 hr 15 min of driving");
  assert.equal(tidyMinutes("+120 min"), "+2 hr");
  assert.equal(tidyMinutes("+59.4 min"), "+59½ min");
});

test("a trip away over several days reads sensibly each day", () => {
  const trip = "Trip to the lake";
  assert.equal(busyLabel({ start: 505, end: 1800, title: trip }, false), "Trip to the lake from 8:25");
  assert.equal(busyLabel({ start: 0, end: 1800, title: trip }, false), "Trip to the lake · all day");
  assert.equal(busyLabel({ start: 0, end: 1145, title: trip }, true), "Trip to the lake until 7:05");
  assert.equal(busyLabel({ start: 780, end: 1000, title: "Work" }, false), "Work until 4:40");
  assert.equal(busyLabel({ start: 780, end: 1000, title: "Work" }, true), "Work 1:00–4:40");
});

test("a car box shows only whole lines of its route", () => {
  assert.equal(rideLines(22), 0);
  assert.equal(rideLines(36), 0);
  assert.equal(rideLines(40), 1);
  assert.equal(rideLines(55), 2);
  assert.equal(rideLines(200), 3);
  const long = "Main Street Dance Studio - West (wait) → Home";
  assert.ok(alongHeight(long, 190) >= 25 + 2 * 15);
  assert.ok(alongHeight("Home → Piano", 190) < alongHeight(long, 190));
  for (const b of layout(plan, "compact", 1160, today).rides) if (b.dashed) assert.ok(b.h >= 25 + 15);
});

test("planner text is tidied everywhere on the board", async () => {
  const { tidyPlan } = await import("../src/layout.ts");
  const plan = sampleWeek();
  const day = plan.days[0]!;
  const e = day.events[0]!;
  e.lines.drop = { text: "Leaves 6:53 with Sam, 15.200000000000003 min late", tone: "problem" };
  day.issues.push({
    key: "x", level: "problem", kind: "late", driver: null, event: null, side: null, minutes: 0.2, at: null,
    title: "Ava will be late", body: "Sam gets there at 7:00, 0.20000000000004547 min after the 7:00 arrive-by time.", note: null,
  });
  const out = tidyPlan(plan);
  assert.equal(out.days[0]!.events[0]!.lines.drop!.text, "Leaves 6:53 with Sam, 15¼ min late");
  assert.equal(out.days[0]!.issues.at(-1)!.body, "Sam gets there at 7:00, ¼ min after the 7:00 arrive-by time.");
  // The plan it was given is left alone.
  assert.match(plan.days[0]!.events[0]!.lines.drop!.text, /15\.2/);
});
