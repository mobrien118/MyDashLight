import assert from "node:assert/strict";
import { test } from "node:test";
import { attention, layout } from "../src/layout.ts";
import { pageOptions } from "../src/options.ts";
import { overAt, withoutPast } from "../src/past.ts";
import { sampleWeek } from "./helpers.ts";

const plan = sampleWeek();
const FIRST = plan.days[0]!.date;
const SECOND = plan.days[1]!.date;
const at = (minutes: number, date = FIRST) => ({ date, minutes });
const ids = (p: typeof plan, i = 0): string[] => p.days[i]!.events.map((e) => e.id);

function overlaps(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

test("an event stays until it and the drive home are over", () => {
  const day = plan.days[0]!;
  const piano = day.events.find((e) => e.id === "piano")!;
  // Piano ends at 4:30; the drive home gets in at 4:40.
  assert.equal(piano.end, 990);
  assert.equal(overAt(day, piano), 1000);
  assert.ok(ids(withoutPast(plan, at(995))).includes("piano"));
  assert.ok(!ids(withoutPast(plan, at(1000))).includes("piano"));
  // Nobody drives to the math tutor, so it goes when it ends.
  assert.ok(ids(withoutPast(plan, at(1004))).includes("tutor"));
  assert.ok(!ids(withoutPast(plan, at(1005))).includes("tutor"));
});

test("days before today drop off, and later days are left as they are", () => {
  const shown = withoutPast(plan, at(0, SECOND));
  assert.equal(shown.days[0]!.date, SECOND);
  assert.equal(shown.days.length, plan.days.length - 1);
  assert.deepEqual(shown.days[1], plan.days[2]);
});

test("a trip goes once it's done, and one under way stays whole", () => {
  // 4:25: Sam's trip that left at 4:20 is under way, so all of it stays.
  const mid = withoutPast(plan, at(16 * 60 + 25)).days[0]!;
  assert.deepEqual(
    mid.drivers["dad"]!.segments.filter((g) => g.type === "drive").map((g) => g.start),
    [980, 995, 1010, 1030, 1115, 1140],
  );
  assert.equal(mid.drivers["dad"]!.outings[0]!.lead, "Leave 4:20");
  // 5:55: that trip is over; the evening one is still to come.
  const later = withoutPast(plan, at(17 * 60 + 55)).days[0]!;
  assert.deepEqual(later.drivers["dad"]!.outings.map((o) => o.lead), ["Leave 6:35"]);
  assert.deepEqual(later.drivers["dad"]!.busy, []);
  // Ride items that are over leave the kids' columns; the rides list keeps its order.
  assert.equal(later.rides.length, plan.days[0]!.rides.length);
  for (const k of Object.values(later.kids)) for (const it of k.items) if (it.type === "ride") assert.ok((later.rides[it.ride!]!.end ?? 0) > 17 * 60 + 55);
});

test("today's heading counts what's left, and says when it's all done", () => {
  const b = layout(withoutPast(plan, at(17 * 60 + 55)), "compact", 1160, at(17 * 60 + 55));
  assert.match(b.dayHeads[0]!.sub, /^\d activit(y|ies) left/);
  const done = layout(withoutPast(plan, at(23 * 60)), "timeline", 1160, at(23 * 60));
  assert.equal(done.dayHeads[0]!.sub, "All done for today");
  assert.ok(done.empties.some((x) => x.key === FIRST && x.text === "Nothing else today"));
  // Other days read as before.
  assert.equal(done.dayHeads[1]!.sub, layout(plan, "timeline", 1160, at(23 * 60)).dayHeads[1]!.sub);
});

test("timeline: today starts just before now, and what's under way runs in from the top", () => {
  const now = 16 * 60 + 25;
  const b = layout(withoutPast(plan, at(now)), "timeline", 1160, at(now));
  const head = b.dayHeads[0]!;
  const first = Math.min(...b.grid.filter((g) => g.key.startsWith(FIRST)).map((g) => Number(g.key.split("|")[2])));
  assert.ok(first <= now - 15 && first >= now - 60, `starts at ${first}`);
  assert.equal(b.now?.label, "Now 4:25");
  // Piano (3:45-4:30) is under way, so it runs in from the top with its top edge open.
  const piano = b.cards.find((c) => c.target.event === "piano")!;
  assert.ok(piano.cut);
  assert.ok(piano.y >= head.y + head.h);
  // Shorter than the whole day was.
  assert.ok(b.height < layout(plan, "timeline", 1160, at(now)).height);
});

for (const mode of ["timeline", "compact"] as const) {
  test(`${mode}: through the day, what's left is all drawn and nothing overlaps or pokes above the day`, () => {
    for (let now = 0; now <= 1440; now += 5) {
      const shown = withoutPast(plan, at(now));
      const b = layout(shown, mode, 1160, at(now));
      const head = b.dayHeads[0]!;
      const day0 = <T extends { key: string }>(xs: T[]): T[] => xs.filter((x) => x.key.startsWith(`${FIRST}|`));
      for (const e of shown.days[0]!.events) {
        const card = b.cards.some((c) => c.target.day === FIRST && c.target.event === e.id);
        const stop = mode === "compact" && !!e.own;
        const timelineEnded = mode === "timeline" && e.end <= now; // its trip home is still drawn
        assert.ok(card || stop || timelineEnded, `${now}: ${e.id}`);
      }
      const rides = day0(b.rides).map((r) => ({ ...r, y: r.y + (r.tuckTop ?? 0), h: r.h - (r.tuckTop ?? 0) - (r.tuckBottom ?? 0) }));
      const boxes = [...day0(b.cards), ...rides, ...day0(b.trips), ...day0(b.stays)];
      for (const x of boxes) assert.ok(x.y >= head.y + head.h, `${now}: ${x.key} above the day`);
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i]!;
          const c = boxes[j]!;
          if (!overlaps(a, c)) continue;
          assert.ok(("clash" in a && a.clash) || ("clash" in c && c.clash), `${now}: ${a.key} overlaps ${c.key}`);
        }
      }
    }
  });
}

test("the columns' week totals still count what's over", () => {
  const all = layout(plan, "compact", 1160, at(23 * 60)).columns.map((c) => c.sub.replace("Needs a ride · ", ""));
  const shown = layout(withoutPast(plan, at(23 * 60)), "compact", 1160, at(23 * 60)).columns.map((c) => c.sub.replace("Needs a ride · ", ""));
  assert.deepEqual(shown, all);
});

test("needs attention leaves out what's over", () => {
  const all = attention(plan, at(23 * 60));
  const shown = attention(withoutPast(plan, at(23 * 60)), at(23 * 60));
  const today = (a: typeof all): number => a.items.filter((x) => x.key.startsWith(`${FIRST}|`) && !x.key.includes("|unplaced|")).length;
  assert.ok(today(all) > 0);
  assert.equal(today(shown), 0);
});

test("past=show in the address keeps everything", () => {
  assert.equal(pageOptions("?past=show").past, "show");
  assert.equal(pageOptions("?view=compact").past, undefined);
});
