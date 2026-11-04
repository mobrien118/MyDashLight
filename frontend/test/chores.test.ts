import assert from "node:assert/strict";
import { test } from "node:test";
import {
  choreColumns,
  choreNote,
  choresNeedingAttention,
  isDoable,
  isDone,
  noChoresYet,
  type Chore,
  type ChoresPayload,
} from "../src/chores.ts";
import { kidColor } from "../src/colors.ts";

// Wednesday.
const TODAY = "2026-11-04";
const TZ = "America/Chicago";

let next = 0;
function chore(kid: string, title: string, extra: Partial<Chore> = {}): Chore {
  next += 1;
  return {
    id: `t${next}`,
    kid,
    title,
    icon: null,
    details: "",
    repeats: "daily",
    due: TODAY,
    shows_from: null,
    state: "open",
    done_at: null,
    missed: 0,
    points: null,
    template: null,
    order: next,
    ...extra,
  };
}

function payload(chores: Chore[], templates: ChoresPayload["templates"] = []): ChoresPayload {
  return {
    updated: "2026-11-04T20:00:00Z",
    today: TODAY,
    time_zone: TZ,
    days_ahead: 7,
    kids: [
      { id: "ava", name: "Ava" },
      { id: "ben", name: "Ben" },
      { id: "cleo", name: "Cleo" },
    ],
    chores,
    templates,
    status: { ok: true, error: null, needs: null },
  };
}

test("done and doable states", () => {
  assert.ok(isDone(chore("ava", "x", { state: "done" })));
  assert.ok(isDone(chore("ava", "x", { state: "late" })));
  assert.ok(!isDone(chore("ava", "x", { state: "open" })));
  assert.ok(isDoable(chore("ava", "x", { state: "open" })));
  assert.ok(isDoable(chore("ava", "x", { state: "overdue" })));
  assert.ok(!isDoable(chore("ava", "x", { state: "upcoming" })));
  assert.ok(!isDoable(chore("ava", "x", { state: "done" })));
});

test("the line under a chore", () => {
  const note = (extra: Partial<Chore>): string => choreNote(chore("ava", "Make bed", extra), TODAY, TZ);
  assert.equal(note({}), "Today");
  assert.equal(note({ missed: 1 }), "Today · missed once before");
  assert.equal(note({ missed: 3 }), "Today · missed 3 times before");
  assert.equal(note({ due: "2026-11-05", repeats: "weekly" }), "By tomorrow");
  assert.equal(note({ due: "2026-11-08", repeats: "weekly" }), "By Sun");
  assert.equal(note({ due: "2026-11-30", repeats: "monthly" }), "By Nov 30");
  assert.equal(note({ state: "overdue", due: "2026-11-03", missed: 1 }), "Missed yesterday");
  assert.equal(note({ state: "overdue", due: "2026-11-02", missed: 1 }), "Missed Mon");
  assert.equal(note({ state: "overdue", due: "2026-11-01", missed: 3 }), "Missed 3 times");
  // 4:12 PM in Chicago.
  assert.equal(note({ state: "done", done_at: "2026-11-04T22:12:00Z" }), "Done 4:12 PM");
  assert.equal(note({ state: "late", done_at: "2026-11-04T22:12:00Z" }), "Done late · 4:12 PM");
  assert.equal(note({ state: "done", done_at: "2026-11-03T22:12:00Z", due: "2026-11-05" }), "Done Tue 4:12 PM");
  assert.equal(note({ state: "done", done_at: null }), "Done");
  // Coming up: the board shows the day, so only a later due day is said.
  assert.equal(note({ state: "upcoming", due: "2026-11-06" }), "");
  assert.equal(note({ state: "upcoming", due: "2026-11-08", shows_from: "2026-11-05", repeats: "weekly" }), "By Sun");
});

test("one column per kid, grouped and in order", () => {
  const data = payload([
    chore("ben", "Clear the table"),
    chore("ava", "Practice", { state: "overdue", due: "2026-11-03", missed: 1 }),
    chore("ava", "Make bed", { state: "done", done_at: "2026-11-04T13:00:00Z" }),
    chore("ava", "Feed the dog"),
    chore("ava", "Laundry", { repeats: "weekly", due: "2026-11-07", shows_from: "2026-11-02" }),
    chore("ava", "Recycling", { state: "upcoming", repeats: "weekly", due: "2026-11-06" }),
    chore("ava", "Tidy room", { state: "upcoming", repeats: "weekly", due: "2026-11-08", shows_from: "2026-11-05" }),
    chore("ava", "Make bed", { state: "upcoming", due: "2026-11-05" }),
  ]);
  const cols = choreColumns(data);
  assert.deepEqual(
    cols.map((c) => c.name),
    ["Ava", "Ben", "Cleo"],
  );
  const [ava, ben, cleo] = cols;
  assert.deepEqual(ava!.overdue.map((c) => c.title), ["Practice"]);
  assert.deepEqual(ava!.now.map((c) => c.title), ["Feed the dog", "Laundry"]);
  assert.deepEqual(ava!.done.map((c) => c.title), ["Make bed"]);
  assert.deepEqual(
    ava!.later.map((g) => [g.date, g.chores.map((c) => c.title)]),
    [
      ["2026-11-05", ["Tidy room", "Make bed"]],
      ["2026-11-06", ["Recycling"]],
    ],
  );
  assert.equal(ava!.left, 3);
  assert.equal(ben!.left, 1);
  assert.equal(cleo!.left, 0);
  assert.deepEqual(cleo!.later, []);
  assert.deepEqual(ava!.color, kidColor(0));
  assert.deepEqual(cleo!.color, kidColor(2));
});

test("columns take the rides board's colors when given", () => {
  const colors = new Map([["ben", kidColor(5)]]);
  const cols = choreColumns(payload([]), colors);
  assert.deepEqual(cols[1]!.color, kidColor(5));
  assert.deepEqual(cols[0]!.color, kidColor(0));
});

test("needs attention lists overdue chores first, then today's", () => {
  const data = payload([
    chore("ava", "Feed the dog"),
    chore("ben", "Practice", { state: "overdue", due: "2026-11-03", missed: 1 }),
    chore("ava", "Laundry", { repeats: "weekly", due: "2026-11-07", shows_from: "2026-11-02" }),
    chore("cleo", "Bins", { repeats: "weekly", due: TODAY, shows_from: "2026-11-02" }),
    chore("cleo", "Water plants", { repeats: null, due: null }),
    chore("ava", "Make bed", { state: "done" }),
    chore("ben", "Tidy room", { state: "upcoming", due: "2026-11-05" }),
  ]);
  assert.deepEqual(
    choresNeedingAttention(data).map((c) => c.title),
    ["Practice", "Feed the dog", "Bins", "Water plants"],
  );
});

test("no chores yet only when there are no chores and no templates", () => {
  assert.ok(noChoresYet(payload([])));
  assert.ok(!noChoresYet(payload([chore("ava", "Make bed")])));
  const template = { id: "x", repeats: "daily" as const, title: "Make bed", icon: null, who: ["ava"], paused: true, problems: [] };
  assert.ok(!noChoresYet(payload([], [template])));
});
