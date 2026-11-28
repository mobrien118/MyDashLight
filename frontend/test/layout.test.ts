import assert from "node:assert/strict";
import { test } from "node:test";
import {
  attention,
  leaveText,
  columnsFor,
  DAY_HEAD,
  headAt,
  compactHeight,
  compactTripHeight,
  foldsIntoTime,
  terseStop,
  useMeasure,
  dayTag,
  layout,
  minWidth,
  nextUp,
  pack,
  shortTitle,
  rideLines,
  compactLines,
  busyLabel,
  tidyMinutes,
  routeOf,
  placeNames,
  tAt,
  wrapRows,
  yAt,
  foldLabel,
  foldsFor,
  FOLD_H,
  type Board,
} from "../src/layout.ts";
import { OWN_COLOR, andList, eventColor, goingWithout, ownerName } from "../src/layout.ts";
import { sampleWeek } from "./helpers.ts";
import type { PlanEvent } from "../src/types.ts";

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
  // Every column the same width: a parent's is no wider than a kid's.
  assert.equal(columns[0]!.w, 208);
  assert.equal(columns[3]!.w, 208);
  assert.equal(columns[0]!.sub, "Needs a ride");
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
        const card = b.cards.some((c) => c.target.day === day.date && c.target.event === e.id);
        // In Compact, a parent's own event is a stop on their trip.
        const stop = mode === "compact" && !!e.own && b.trips.some((t) => t.key.startsWith(day.date) && t.stops?.some((x) => x.text.includes(e.title)));
        assert.ok(card || stop, `${day.date} ${e.id}`);
      }
    }
    // Boxes in one column only share space when they're side by side (a double-booking).
    // A car box's tucked edge sits behind the piece it's built onto on purpose; only what shows counts.
    const shown = b.rides.map((r) => ({ ...r, y: r.y + (r.tuckTop ?? 0), h: r.h - (r.tuckTop ?? 0) - (r.tuckBottom ?? 0) }));
    const boxes = [...b.cards, ...shown, ...b.trips, ...b.stays];
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
  assert.ok(day0.some((t) => t.l1 === "Leave 4:20" && t.bad && t.kids.length === 2));
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
  assert.equal(all.problems, 5);
  assert.deepEqual(
    all.items.filter((i) => i.tone !== "heads_up").map((i) => i.title),
    [
      "Sam is still at Work",
      "No pick-up for Ava",
      "Fri · 4:00 Garage floor bid: who is this for?",
      `Sun · No pick-up for Ava`,
      "Tue · Cleo is double-booked",
    ],
  );
  // An event whose title names nobody opens the picker for who it's for, and says the other fix
  // with the family's own names.
  const nobody = all.items.find((i) => i.key.endsWith("|unplaced|bid"))!;
  assert.equal(nobody.target, null);
  assert.deepEqual(nobody.pick, { day: plan.days[1]!.date, id: "bid" });
  assert.match(nobody.body, /Tap to pick who it’s for, or start the title in Google Calendar with a name, such as “Ava Piano”/);
  // Normally only the next two days: later problems are counted, not listed.
  const { items, problems, later, laterUnassigned } = attention(plan, today);
  assert.equal(problems, 3);
  assert.equal(later, 2);
  assert.equal(laterUnassigned, 1);
  const busy = items[0]!;
  assert.equal(busy.suggestions.length, 2);
  assert.equal(busy.suggestions[0]!.label, "Take Ben along");
  assert.equal(busy.target?.event, "soccer");
  assert.ok(!items.some((i) => i.title.startsWith("Sun ·")));
  const clash = all.items.find((i) => i.title.endsWith("double-booked"))!;
  assert.equal(clash.body, "Soccer 5:00–6:30 and Art class 6:00–7:00 overlap.");
  // The headline opens neither event; each event's name opens that event.
  assert.equal(clash.target, null);
  const links = (clash.parts ?? []).filter((p) => typeof p !== "string") as { text: string; target: { event: string } }[];
  assert.deepEqual(
    links.map((l) => l.text),
    ["Soccer", "Art class"],
  );
  assert.notEqual(links[0]!.target.event, links[1]!.target.event);
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
});

test("measured text wraps where the browser would, and a no-break space holds words together", () => {
  // 10px a character, spaces included.
  useMeasure((t) => t.length * 10);
  try {
    // Half a pixel is kept spare for the browser's rounding.
    assert.equal(wrapRows("abc def", 71, 7, "f"), 1);
    assert.equal(wrapRows("abc def", 70, 7, "f"), 2);
    assert.equal(wrapRows("abcdefghij", 51, 7, "f"), 2);
    assert.equal(wrapRows("field ↓\u00a0Cleo", 100, 7, "f"), 2);
    // No font given: still guessed.
    assert.equal(wrapRows("Robin stays · leaves 3:30", 130, 7), 2);
  } finally {
    useMeasure(null);
  }
  // A font the browser can't read: guessed instead.
  useMeasure(() => null);
  try {
    assert.equal(wrapRows("Supercalifragilistic", 70, 7, "f"), 2);
  } finally {
    useMeasure(null);
  }
});

test("Compact cards show the whole title, and are as tall as what's on them", () => {
  useMeasure((t) => t.length * 10);
  try {
    const L = (text: string, tone: "normal" | "muted" = "normal") => ({ text, tone });
    // 100px wide: 76px inside, so 7 characters a line.
    const base = { title: "Hip Hop", time: "6:00", drop: L("Car Sam"), pick: null, inline: false };
    // Border 2, padding 10, one title line 18, the time 1 + 16, the ride line 1 + 16, 1 spare.
    assert.equal(compactHeight(base, 100), 65);
    assert.equal(compactHeight({ ...base, title: "Hip Hop ride there" }, 100), 65 + 2 * 18);
    // The note mark takes room at the end of the title.
    assert.equal(compactHeight({ ...base, title: "Hip Hop" }, 100, { noted: true }), 65 + 18);
    // "No ride needed" on the end of the time line: one line fewer when it fits.
    assert.equal(compactHeight({ ...base, time: "6", drop: L("Hi", "muted"), inline: true }, 100), 65 - 17);
    // When it doesn't fit, it wraps onto the next line: no room saved, but none lost.
    assert.equal(compactHeight({ ...base, time: "6:00", drop: L("At home", "muted"), inline: true }, 100), 64);
    assert.equal(compactHeight(base, 100, { clash: true }), 67);
  } finally {
    useMeasure(null);
  }
});

test("Compact folds a line that isn't about a ride into the time line", () => {
  const L = (text: string, tone: "normal" | "muted" | "pending" = "normal") => ({ text, tone });
  assert.equal(foldsIntoTime({ drop: L("No ride needed", "muted"), pick: null }, false), true);
  assert.equal(foldsIntoTime({ drop: L("At home", "muted"), pick: null }, false), true);
  // Struck through when not attending: it keeps its own line.
  assert.equal(foldsIntoTime({ drop: L("Not attending", "muted"), pick: null }, true), false);
  assert.equal(foldsIntoTime({ drop: L("🚗 Sam ↓4:25 ↑6:10"), pick: null }, false), false);
  assert.equal(foldsIntoTime({ drop: L("🚗 No rides yet", "pending"), pick: null }, false), false);
});

test("Compact trip stops use the card's arrows", () => {
  assert.equal(terseStop("4:35  Soccer fields, drop off Cleo"), "4:35  Soccer fields ↓\u00a0Cleo");
  assert.equal(terseStop("6:30  Soccer fields, pick up Cleo and Ben"), "6:30  Soccer fields ↑\u00a0Cleo and Ben");
  assert.equal(terseStop("4:50  Home, get Ben"), "4:50  Home ↑\u00a0Ben");
  assert.equal(terseStop("3:40  Piano studio, stay with Ava"), "3:40  Piano studio, stay with Ava");
  assert.equal(terseStop("4:30  Leave Piano studio"), "4:30  Leave Piano studio");
  assert.equal(terseStop("7:09  Cleaners, Pick up dry cleaning"), "7:09  Cleaners, Pick up dry cleaning");
  // On a trip, home is the hotel: only its own "get" line is a pick-up from home.
  assert.equal(terseStop("4:50  Westin, get Ben", "Westin"), "4:50  Westin ↑\u00a0Ben");
  assert.equal(terseStop("4:50  Store, get milk", "Westin"), "4:50  Store, get milk");
  useMeasure((t) => t.length * 10);
  try {
    // 6px padding top and bottom, the 16px lead, then 16px a line, a pixel apart, 1 spare.
    assert.equal(compactTripHeight(["abc", "abc def"], 90), 12 + 16 + 2 + 3 * 16 + 1);
  } finally {
    useMeasure(null);
  }
});

test("the next trip: leaving soon, under way, or tomorrow", () => {
  const soon = nextUp(plan, { date: FIRST, minutes: 16 * 60 })!;
  assert.equal(soon.ongoing, false);
  assert.equal(soon.name, "Sam");
  assert.equal(soon.lead, "Leave 4:20");
  assert.equal(soon.inMinutes, 20);
  assert.equal(soon.warn, "Still at Work until 4:40");
  assert.equal(soon.stop, "4:35 Soccer fields, drop off Cleo");
  assert.ok(soon.target);

  // Someone is out, but the next one to leave matters more.
  const later = nextUp(plan, { date: FIRST, minutes: 17 * 60 })!;
  assert.equal(later.lead, "Leave 6:10");
  assert.equal(later.inMinutes, 70);

  const out = nextUp(plan, { date: FIRST, minutes: 19 * 60 + 10 })!;
  assert.equal(out.ongoing, true);
  assert.equal(out.lead, "Leave 6:35");

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
});

test("compact: things read in time order, and a kid along sits beside the trip", () => {
  const b = layout(plan, "compact", 1160, today);
  for (const day of plan.days) {
    const cards = b.cards.filter((c) => c.key.startsWith(day.date) && !c.event.own);
    for (const x of cards)
      for (const y of cards) {
        if (x.event.start < y.event.start) assert.ok(x.y < y.y, `${x.event.title} starts before ${y.event.title}`);
        if (x.event.start === y.event.start) assert.equal(x.y, y.y);
      }
  }
  const along = b.rides.filter((r) => r.dashed);
  assert.ok(along.length > 0);
  for (const r of along) {
    assert.equal(r.l1.startsWith("🚗 with "), true);
    assert.equal(r.show2, false);
    assert.ok(b.trips.some((t) => t.y === r.y), `${r.key} is level with its trip`);
  }
  // Each row's start time is in the margin.
  assert.ok(b.hours.some((h) => /^\d+:\d\d [AP]M$/.test(h.label)));
});

test("compact: ride lines are a car and arrows on one line", () => {
  const L = (text: string, tone: "normal" | "pending" | "problem" = "normal") => ({ text, tone });
  assert.deepEqual(compactLines({ drop: L("Leaves 4:25 with Sam"), pick: L("Home 6:10 with Sam") }), {
    drop: L("🚗 Sam ↓4:25 ↑6:10"),
    pick: null,
  });
  assert.deepEqual(compactLines({ drop: L("Sam stays · leaves 4:25"), pick: L("Home 6:10 with Sam") }).drop, L("🚗 Sam stays ↓4:25 ↑6:10"));
  assert.deepEqual(compactLines({ drop: L("No ride there yet", "pending"), pick: L("No ride home yet", "pending") }).drop, L("🚗 No rides yet", "pending"));
  assert.deepEqual(compactLines({ drop: L("Leaves 4:25 with Sam"), pick: L("No ride home yet", "pending") }).drop, L("🚗 ↓4:25 Sam · ↑ needed", "pending"));
  assert.deepEqual(
    compactLines({ drop: L("Leaves 4:25 with Sam, 5 min late", "problem"), pick: L("Picked up 6:00 by Robin") }).drop,
    L("🚗 ↓4:25 Sam · 5 min late · ↑6:00 Robin", "problem"),
  );
  assert.deepEqual(compactLines({ drop: L("Drop-off: Sam"), pick: L("Pick-up: Sam") }).drop, L("🚗 Sam both ways"));
  // A drop-off that carries on from an earlier stop, and someone else bringing them home.
  assert.deepEqual(compactLines({ drop: L("With Sam"), pick: L("Home with Piper") }), { drop: L("🚗 ↓ Sam · ↑ Piper"), pick: null });
  // The same driver, with a time on only one side: no bare arrow.
  assert.deepEqual(compactLines({ drop: L("Leaves 5:49 with Sam"), pick: L("Pick-up: Sam") }).drop, L("🚗 Sam both ways · ↓5:49"));
  assert.deepEqual(compactLines({ drop: L("Drop-off: Sam"), pick: L("Home 6:10 with Sam") }).drop, L("🚗 Sam both ways · ↑6:10"));
  // Not rides: left alone.
  const none = { drop: L("No ride needed"), pick: null };
  assert.deepEqual(compactLines(none), none);
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

test("an event the kid isn't going to stays on the board, marked", () => {
  const p = sampleWeek();
  const e = p.days[0]!.events[0]!;
  e.attending = false;
  const b = layout(p, "timeline", 1160, today);
  const card = b.cards.find((c) => c.event.id === e.id)!;
  assert.equal(card.skipped, true);
  assert.equal(b.cards.filter((c) => c.skipped).length, 1);
});

test("compact: a trip away fills the parent's column for the day, without making the day taller", () => {
  const withBusy = (end: number): Board => {
    const p = sampleWeek();
    // A day the driver has nothing else on.
    p.days[3]!.drivers["dad"]!.outings = [];
    p.days[3]!.drivers["dad"]!.busy = [{ start: 0, end, title: "Trip to the lake" }];
    return layout(p, "compact", 1160, today);
  };
  const date = plan.days[3]!.date;
  const short = withBusy(60);
  const away = withBusy(1800);
  // Tethered: the long block only fills space the day already has.
  assert.equal(away.height, short.height);
  const box = (b: Board) => b.busy.find((x) => x.key.startsWith(`${date}|busy|`))!;
  assert.ok(box(away).h > box(short).h);
  const bottom = Math.max(
    ...[...away.cards, ...away.rides, ...away.trips].filter((x) => x.key.startsWith(`${date}|`)).map((x) => x.y + x.h),
  );
  assert.equal(box(away).y + box(away).h, bottom);
});

test("compact: a long block reaches down past what starts during it in other columns", () => {
  const p = sampleWeek();
  p.days[3]!.drivers["dad"]!.outings = [];
  p.days[3]!.drivers["dad"]!.busy = [{ start: 0, end: 1439, title: "Conference" }];
  const b = layout(p, "compact", 1160, today);
  const date = p.days[3]!.date;
  const block = b.busy.find((x) => x.key.startsWith(`${date}|busy|`))!;
  for (const c of b.cards.filter((x) => x.key.startsWith(`${date}|`))) assert.ok(block.y + block.h >= c.y + c.h, c.key);
});

test("timeline: car boxes stack behind their activity like cards, keeping their own size", () => {
  const b = layout(plan, "timeline", 1160, today);
  const byKey = new Map(b.rides.map((r) => [r.key, r]));
  let going = 0;
  let home = 0;
  for (const r of b.rides) {
    const shown = r.h - (r.tuckTop ?? 0) - (r.tuckBottom ?? 0);
    // Never stretched: what shows is the car's own time (or the smallest a box gets).
    assert.ok(shown <= Math.max(22, shown), r.key);
    if (r.tuckBottom) {
      going++;
      // Tucked behind what comes next: drawn behind it, the time between built on as its own block.
      assert.ok(r.layer! < 100, r.key);
      // With time to spare, that time is its own unlabeled block, in front of the car box.
      const link = b.links.find((l) => l.key === `${r.key}|link`);
      if (link) {
        assert.equal(link.y, r.y + r.h - r.tuckBottom);
        assert.ok(link.layer! > r.layer!);
      }
    }
    if (r.tuckTop) {
      home++;
      assert.ok(r.layer! < 100, r.key);
    }
  }
  assert.ok(going > 0 && home > 0);
  assert.equal(byKey.size, b.rides.length);
  // The activity is in front of everything built onto it.
  for (const c of b.cards) if (c.layer != null) assert.equal(c.layer, 100);
  for (const p of b.preps) assert.ok(p.layer! < 100);
});

// A parent's own events: they drive themselves, with kids or the other parent along.

const dayOf = (id: string) => plan.days.find((d) => d.events.some((e) => e.id === id))!;
const colOf = (b: Board, name: string) => b.columns.find((c) => c.name === name)!;
const inCol = (x: { x: number; w: number }, c: { x: number; w: number }) => x.x >= c.x && x.x + x.w <= c.x + c.w;

test("timeline: a parent's own event is a card in their column, joined to the trip there and back", () => {
  const b = layout(plan, "timeline", 1160, today);
  const date = dayOf("sun-golf").date;
  const sam = colOf(b, "Sam");
  const golf = b.cards.filter((c) => c.target.day === date && c.target.event === "sun-golf");
  const mine = golf.find((c) => inCol(c, sam))!;
  assert.equal(mine.kidName, "Sam");
  assert.equal(mine.color, OWN_COLOR);
  assert.equal(mine.time, "1:00–4:00 · with Ben and Robin");
  assert.equal(mine.stayed, false);
  // The trips there and back touch the card.
  const trips = b.trips.filter((t) => t.key.startsWith(date) && inCol(t, sam));
  assert.ok(trips.some((t) => t.y + t.h === mine.y));
  assert.ok(trips.some((t) => t.y === mine.y + mine.h));
  // Not drawn a second time as busy time, or as a stay.
  assert.ok(!b.busy.some((x) => x.key.startsWith(date) && inCol(x, sam)));
  assert.ok(!b.stays.some((x) => x.key.startsWith(date) && x.target?.event === "sun-golf"));
  // Ben goes along: it's in his column, in his color.
  const ben = colOf(b, "Ben");
  const his = golf.find((c) => inCol(c, ben))!;
  assert.equal(his.drop?.text, "With Sam");
  assert.equal(his.pick, null);
  assert.equal(his.color.color, ben.dot);
  assert.ok(b.rides.some((r) => r.key.startsWith(date) && inCol(r, ben) && r.l1 === "In Sam’s car"));
  // Robin rides along too, so she's busy, and it says with whom.
  const robin = colOf(b, "Robin");
  assert.ok(b.busy.some((x) => x.key.startsWith(date) && inCol(x, robin) && x.label.startsWith("Golf with Sam")));
  // Every card has its own key, even an event shown in two columns.
  assert.equal(new Set(b.cards.map((c) => c.key)).size, b.cards.length);
});

test("timeline: an errand sits at the time it was fitted in, with its window behind it", () => {
  const b = layout(plan, "timeline", 1160, today);
  const day = dayOf("mon-cleaners");
  const e = day.events.find((x) => x.id === "mon-cleaners")!;
  assert.equal(e.takes, 10);
  assert.ok(e.planned != null);
  const sam = colOf(b, "Sam");
  const card = b.cards.find((c) => c.target.day === day.date && c.target.event === e.id)!;
  assert.ok(inCol(card, sam));
  assert.equal(card.time, "10 min, any time 5:00–7:30");
  const win = b.windows.find((w) => w.key === `${day.date}|window|${e.id}`)!;
  assert.equal(win.label, "Pick up dry cleaning · any time 5:00–7:30");
  assert.ok(win.y < card.y && card.y + card.h <= win.y + win.h);
  // Its busy time is the card, not a hatched block.
  assert.ok(!b.busy.some((x) => x.key.startsWith(day.date) && inCol(x, sam) && x.label.startsWith("Pick up")));
});

test("a parent's own event they're not going to stays on the board, to change it back", () => {
  const p = sampleWeek();
  const day = p.days.find((d) => d.events.some((e) => e.id === "tue-book"))!;
  const e = day.events.find((x) => x.id === "tue-book")!;
  e.attending = false;
  day.drivers["mom"]!.outings = day.drivers["mom"]!.outings.filter((o) => o.target !== "tue-book");
  day.drivers["mom"]!.segments = day.drivers["mom"]!.segments.filter((g) => g.serves !== "tue-book");
  day.drivers["mom"]!.busy = day.drivers["mom"]!.busy.filter((x) => x.event !== "tue-book");
  for (const mode of ["timeline", "compact"] as const) {
    const b = layout(p, mode, 1160, today);
    const card = b.cards.find((c) => c.target.day === day.date && c.target.event === "tue-book");
    assert.ok(card, mode);
    assert.ok(card.skipped);
    assert.ok(inCol(card, colOf(b, "Robin")));
  }
});

test("compact: a parent's own event is a stop on their trip, and kids along get a card", () => {
  const b = layout(plan, "compact", 1160, today);
  const date = dayOf("sun-golf").date;
  assert.ok(b.trips.some((t) => t.key.startsWith(date) && t.target?.event === "sun-golf" && t.stops!.some((x) => x.text.includes("Golf"))));
  const cards = b.cards.filter((c) => c.target.day === date && c.target.event === "sun-golf");
  assert.equal(cards.length, 1);
  assert.ok(inCol(cards[0]!, colOf(b, "Ben")));
  assert.equal(cards[0]!.drop?.text, "🚗 With Sam");
  assert.ok(!b.busy.some((x) => x.key.startsWith(date) && x.label.startsWith("Golf 1:00")));
  assert.ok(b.busy.some((x) => x.key.startsWith(date) && x.label.startsWith("Golf with Sam")));
});

test("whose event it is, by name and color", () => {
  const golf = dayOf("sun-golf").events.find((e) => e.id === "sun-golf")!;
  const soccer = plan.days[0]!.events.find((e) => e.id === "soccer")!;
  assert.equal(ownerName(plan, golf), "Sam");
  assert.equal(ownerName(plan, soccer), "Cleo");
  assert.equal(eventColor(plan, golf), OWN_COLOR);
  assert.notEqual(eventColor(plan, soccer), OWN_COLOR);
  assert.equal(andList([]), "");
  assert.equal(andList(["Ben"]), "Ben");
  assert.equal(andList(["Ava", "Ben", "Robin"]), "Ava, Ben and Robin");
  // Notes on a parent's own event name the parent.
  const p = sampleWeek();
  const e = p.days.find((d) => d.events.some((x) => x.id === "sun-golf"))!.events.find((x) => x.id === "sun-golf")!;
  e.problems = ["Take along: “Nobody”"];
  const all = attention(p, { date: FIRST, minutes: 0 }, 24 * 8);
  assert.ok(all.items.some((i) => i.title === "Sun · Check the notes on Sam’s Golf"));
});

test("timeline: something running past midnight shows only its edge, not the whole night", () => {
  const hours = (p: ReturnType<typeof sampleWeek>): [number, number] => {
    const b = layout(p, "timeline", 1160, today);
    const a = b.anchors.filter((x) => x.t >= 1440 && x.t < 2 * 1440).map((x) => x.t - 1440);
    return [Math.min(...a), Math.max(...a)];
  };
  const before = hours(sampleWeek());
  const p = sampleWeek();
  const day = p.days[1]!;
  const first = day.events[0]!;
  const kid = first.kid;
  const late = { ...first, id: "overnight-in", start: 0, end: before[0] + 60, arrive_by: null };
  const out = { ...first, id: "overnight-out", start: before[1] - 60, end: 1440 + 600, arrive_by: null };
  const allDay = { ...first, id: "whole-day", start: 0, end: 1440, arrive_by: null };
  day.events.push(late, out, allDay);
  day.kids[kid]!.items.push(
    { type: "act", start: 0, end: late.end, clash: false, event: late.id },
    { type: "act", start: out.start, end: 1440, clash: false, event: out.id },
    { type: "act", start: 0, end: 1440, clash: false, event: allDay.id },
  );
  assert.deepEqual(hours(p), before);
});

test("all-day events go in the day's heading, up on the date line while they fit", () => {
  const board = layout(plan, "timeline", 1160, today);
  const heads = new Map(board.dayHeads.map((h) => [h.date, h]));
  const fri = heads.get(plan.days[1]!.date)!;
  assert.deepEqual(
    fri.allDay.map((c) => [c.title, c.note, c.warn, c.pick]),
    [
      ["Trash & Recycling Day", "", false, null],
      ["Wear the black jersey", "", false, null],
      // Tapping the one for nobody picks who it's for.
      ["4:00 Garage floor bid", "Who is this for?", true, "bid"],
    ],
  );
  // Nobody's all-day event is plain; one naming someone takes their colour.
  assert.equal(fri.allDay[0]!.color, null);
  assert.ok(fri.allDay[1]!.color);
  // Marty, 2026-11-17: chips sit on the date line while they fit, so the heading stays one line.
  assert.deepEqual([fri.inline, fri.h], [3, DAY_HEAD]);
  // Narrower, fewer fit up there. The first that doesn't starts a line of chips under the date,
  // as many to a line as fit, and the day starts below it.
  const narrow = layout(plan, "timeline", 700, today);
  const nfri = narrow.dayHeads.find((h) => h.date === fri.date)!;
  assert.ok(nfri.inline > 0 && nfri.inline < 3);
  assert.equal(nfri.h, DAY_HEAD + 26 + 4 + 2);
  const nFirst = Math.min(...narrow.cards.filter((c) => c.target?.day === fri.date).map((c) => c.y));
  assert.ok(nFirst >= nfri.y + nfri.h);
  const firstCard = Math.min(...board.cards.filter((c) => c.target?.day === plan.days[1]!.date).map((c) => c.y));
  assert.ok(firstCard >= fri.y + fri.h);
  assert.deepEqual(
    board.dayHeads.filter((h) => h.allDay.some((c) => c.title === "Indianapolis")).map((h) => h.allDay[0]!.note),
    ["Day 1 of 3", "Day 2 of 3", "Day 3 of 3"],
  );
  // A day with nothing all day keeps the plain heading, in either view.
  const thu = heads.get(plan.days[0]!.date)!;
  assert.deepEqual([thu.h, thu.allDay], [DAY_HEAD, []]);
  const compact = layout(plan, "compact", 1160, today).dayHeads;
  assert.deepEqual(
    compact.map((h) => h.h),
    board.dayHeads.map((h) => h.h),
  );
  // Scrolling to a time leaves room for that day's heading.
  assert.equal(headAt(board, 1440 + 600), fri.h);
});

test("a parent's busy time from their calendar is a card in their column, in both views", () => {
  for (const mode of ["timeline", "compact"] as const) {
    const b = layout(plan, mode, 1160, { date: FIRST, minutes: 0 });
    for (const [id, name] of [["sun-rounds", "Robin"], ["wed-rental", "Sam"]] as const) {
      const date = dayOf(id).date;
      const col = colOf(b, name);
      const card = b.cards.find((c) => c.target.day === date && c.target.event === id);
      assert.ok(card && inCol(card, col), `${mode} ${id}`);
      assert.equal(card.drop?.text, "Can’t drive then");
      // Drawn once, as the card, not again as grey busy time.
      assert.ok(!b.busy.some((x) => x.key.startsWith(date) && inCol(x, col) && x.label.startsWith(card.title)), `${mode} ${id}`);
      assert.equal(card.time, id === "wed-rental" ? "From 8:00" : "7:00–8:00");
    }
  }
});

test("leaving early shows on the card's time line", () => {
  const e = { start: 765, end: 885, leave_by: 795 } as PlanEvent;
  assert.equal(leaveText(e), " · leave 1:15");
  assert.equal(leaveText({ ...e, leave_by: null }), "");
  assert.equal(leaveText({ ...e, leave_by: 885 }), "");
});

test("timeline: a long quiet stretch in the middle of a day folds to a short torn strip", () => {
  const b = layout(plan, "timeline", 1160, today);
  const date = plan.days[3]!.date;
  // Grand rounds 7:00–8:00, then nothing until the drive to golf at 12:37.
  const folds = b.folds.filter((f) => f.key.startsWith(date));
  assert.equal(folds.length, 1);
  const f = folds[0]!;
  assert.deepEqual([f.from, f.to, f.label], [510, 720, "3½ hrs"]);
  assert.equal(f.h, FOLD_H);
  // Its edges are labeled, even on the half hour, and nothing inside it is.
  const base = 3 * 1440;
  const labels = b.hours.filter((h) => h.key.startsWith(date)).map((h) => h.label);
  assert.ok(labels.includes("8:30 AM") && labels.includes("12 PM"));
  for (const l of ["9 AM", "10 AM", "11 AM"]) assert.ok(!labels.includes(l), l);
  assert.ok(!b.grid.some((g) => g.key.startsWith(date) && g.y > f.y && g.y < f.y + f.h));
  // Times either side keep their true spacing, and the fold maps both ways.
  assert.equal(yAt(b, base + 480) - yAt(b, base + 420), 180);
  assert.equal(yAt(b, base + 780) - yAt(b, base + 720), 180);
  assert.equal(yAt(b, base + 720) - yAt(b, base + 510), FOLD_H);
  const t = base + 600;
  assert.ok(Math.abs(tAt(b, yAt(b, t)) - t) <= 1);
  // Nothing in a column overlaps another box after folding.
  const boxes = [...b.cards, ...b.trips, ...b.stays].filter((x) => x.key.startsWith(date));
  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++)
      if (boxes[i]!.x === boxes[j]!.x) assert.ok(!overlaps(boxes[i]!, boxes[j]!) || boxes[i]!.h <= 0, `${boxes[i]!.key} / ${boxes[j]!.key}`);
});

test("timeline: a parent's long busy time doesn't keep a quiet stretch open", () => {
  const b = layout(plan, "timeline", 1160, today);
  const date = plan.days[5]!.date;
  // Book club ends 11:30, Sam is at work 9:00–5:00, and the kids start after 4:30.
  const f = b.folds.find((x) => x.key.startsWith(date))!;
  assert.deepEqual([f.from, f.to, f.label], [720, 960, "4 hrs"]);
  const work = b.busy.find((x) => x.key.startsWith(date) && x.label === "Work until 5:00")!;
  assert.ok(work.y < f.y && work.y + work.h > f.y + f.h);
});

test("timeline: short gaps, the time around now, and Compact never fold", () => {
  // Day 0 is busy all afternoon, and now (4:00) is in it.
  const b = layout(plan, "timeline", 1160, today);
  assert.ok(!b.folds.some((f) => f.key.startsWith(FIRST)));
  assert.deepEqual(layout(plan, "compact", 1160, today).folds, []);
  // Now in the middle of a quiet stretch keeps an hour around it open.
  const date = plan.days[3]!.date;
  const at = layout(plan, "timeline", 1160, { date, minutes: 600 });
  const folds = at.folds.filter((f) => f.key.startsWith(date));
  assert.ok(folds.every((f) => f.to <= 570 || f.from >= 630));
  assert.ok(at.now && !folds.some((f) => at.now!.y > f.y && at.now!.y < f.y + f.h));
  // A gap under two hours stays.
  assert.deepEqual(foldsFor([[600, 660], [770, 900]], 600, 900), []);
  assert.deepEqual(foldsFor([[600, 660], [790, 900]], 600, 900), [{ from: 660, to: 780 }]);
});

test("fold labels", () => {
  assert.equal(foldLabel(120), "2 hrs");
  assert.equal(foldLabel(150), "2½ hrs");
  assert.equal(foldLabel(240), "4 hrs");
});

test("someone not going comes off a shared event instead of calling it off", () => {
  // Marty, 2026-11-20: one kid wasn't going to a family dinner. "Isn't going" took everyone.
  const plan = sampleWeek();
  const [ava, ben, cleo] = plan.people!.kids.map((k) => k.id) as [string, string, string];
  const dinner = { event_id: "dinner", kid: ava, own: null } as unknown as PlanEvent;
  const who = (people: string[]) => ({ ...plan, who: { dinner: { people, from_notes: true } } });
  assert.deepEqual(goingWithout(who([ava, ben, cleo, "mom", "dad"]), dinner), [ben, cleo, "mom", "dad"]);
  // The only kid on it: the parents named go with her, so it's off.
  assert.equal(goingWithout(who([ava, "mom"]), dinner), null);
  assert.equal(goingWithout(who([ava]), dinner), null);
  // A parent's own event goes on with the other parent.
  const date = { event_id: "dinner", kid: "mom", own: "mom" } as unknown as PlanEvent;
  assert.deepEqual(goingWithout(who(["mom", "dad"]), date), ["dad"]);
});
