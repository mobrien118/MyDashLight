import assert from "node:assert/strict";
import { test } from "node:test";
import { allDayRow, layout } from "../src/layout.ts";
import { placeTip } from "../src/notetip.ts";
import { sampleWeek } from "./helpers.ts";

const view = { w: 1280, h: 800 };
const tip = { w: 300, h: 80 };

test("a held finger's bubble goes above the finger, centred on it", () => {
  const p = placeTip({ x: 600, top: 500, bottom: 500 }, tip, view, true, 36);
  assert.deepEqual(p, { left: 450, top: 500 - 36 - 80, above: true });
});

test("the mouse's bubble goes below the pointer", () => {
  const p = placeTip({ x: 600, top: 296, bottom: 310 }, tip, view, false);
  assert.equal(p.above, false);
  assert.equal(p.top, 310 + 14);
});

test("it flips to the other side when there's no room", () => {
  // Near the top, a held bubble can't go above, so it goes below.
  const high = placeTip({ x: 600, top: 60, bottom: 60 }, tip, view, true, 36);
  assert.equal(high.above, false);
  assert.equal(high.top, 60 + 36);
  // Near the bottom, the mouse's bubble goes above.
  const low = placeTip({ x: 600, top: 760, bottom: 774 }, tip, view, false);
  assert.equal(low.above, true);
  assert.equal(low.top, 760 - 14 - 80);
});

test("it never leaves the screen", () => {
  const left = placeTip({ x: 20, top: 400, bottom: 400 }, tip, view, true);
  assert.equal(left.left, 8);
  const right = placeTip({ x: 1275, top: 400, bottom: 400 }, tip, view, true);
  assert.equal(right.left, 1280 - 8 - 300);
  // Taller than the room on either side: kept on screen, on the roomier side.
  const tall = placeTip(
    { x: 600, top: 300, bottom: 300 },
    { w: 300, h: 700 },
    view,
    true,
  );
  assert.deepEqual([tall.top, tall.above], [800 - 8 - 700, false]);
});

test("events, all-day events and events for nobody carry the notes people wrote", () => {
  const plan = sampleWeek();
  const board = layout(plan, "timeline", 1160, {
    date: plan.days[0]!.date,
    minutes: 0,
  });
  const soccer = board.cards.find((c) => c.event.id === "soccer")!;
  assert.match(soccer.event.notes ?? "", /^Bring shin guards/);
  const piano = board.cards.find((c) => c.event.id === "piano")!;
  assert.equal(piano.event.notes, "");
  const fri = plan.days[1]!;
  const row = allDayRow(plan, fri, new Map(), 1160)!;
  const bid = row.chips.find((c) => c.pick === "bid")!;
  assert.match(bid.notes, /epoxy/);
  const trash = row.chips.find((c) => c.key.endsWith("|trash"))!;
  assert.equal(trash.notes, "");
});

test("a hotel stay's chip names the hotel and who's staying, and can be tapped", () => {
  const plan = sampleWeek();
  const kids = plan.people!.kids.map((k) => k.id);
  const [mom, dad] = plan.people!.drivers.map((d) => d.id);
  const day = plan.days[1]!;
  const stay = (people: string[]) => ({
    ...day,
    all_day: [
      {
        id: "hotel",
        title: "Westin Chicago",
        people,
        first: day.date,
        last: day.date,
        day_number: 1,
        days: 3,
        cancelled: false,
        notes: "",
        stay: true,
      },
    ],
  });
  const chip = (people: string[]) =>
    allDayRow(plan, stay(people), new Map(), 1160)!.chips[0]!;
  const one = chip([mom!]);
  assert.equal(one.title, "🏨 Westin Chicago");
  assert.equal(one.note, `${plan.people!.drivers[0]!.name} · Day 1 of 3`);
  assert.equal(one.stay, "hotel");
  assert.equal(one.pick, null);
  assert.equal(chip([mom!, dad!, ...kids]).note, "Everyone · Day 1 of 3");
  assert.match(chip([mom!, ...kids]).note, / & the kids · /);
  // Any other all-day event isn't tappable.
  const trash = allDayRow(plan, day, new Map(), 1160)!.chips.find((c) =>
    c.key.endsWith("|trash"),
  )!;
  assert.equal(trash.stay, null);
});
