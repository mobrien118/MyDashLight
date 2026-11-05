import assert from "node:assert/strict";
import { test } from "node:test";
import {
  NO_DAYS,
  choreColumns,
  choreNote,
  choresNeedingAttention,
  defaultDays,
  draftFields,
  draftOf,
  draftProblem,
  isDoable,
  isDone,
  newDraft,
  noChoresYet,
  ordinal,
  problemText,
  scheduleText,
  weekdaysLabel,
  weekdaysOf,
  whoText,
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
  // A night-before school chore says which school day it's for.
  assert.equal(note({ repeats: "school", for_day: "2026-11-05" }), "Tonight · for tomorrow");
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

test("a night-before chore waits for the afternoon of its day", () => {
  const data = payload([
    chore("ben", "Pack lunch", { repeats: "school", for_day: "2026-11-05" }),
    chore("ben", "Make bed"),
    chore("cleo", "Pack lunch", { repeats: "school", for_day: "2026-11-05", state: "done" }),
  ]);
  // Morning: coming up later today, not to do.
  const morning = choreColumns(data, undefined, 9 * 60).find((c) => c.kid === "ben")!;
  assert.deepEqual(morning.now.map((c) => c.title), ["Make bed"]);
  assert.deepEqual(morning.later.map((g) => [g.date, g.chores.map((c) => c.title)]), [[TODAY, ["Pack lunch"]]]);
  assert.equal(morning.left, 1);
  assert.equal(choreNote(morning.later[0]!.chores[0]!, TODAY, TZ), "From 1 PM · for tomorrow");
  assert.deepEqual(choresNeedingAttention(data, 9 * 60).map((c) => c.title), ["Make bed"]);
  // From 1 PM it's to do.
  const afternoon = choreColumns(data, undefined, 13 * 60).find((c) => c.kid === "ben")!;
  assert.deepEqual(afternoon.now.map((c) => c.title), ["Pack lunch", "Make bed"]);
  assert.deepEqual(choresNeedingAttention(data, 13 * 60).map((c) => c.title), ["Pack lunch", "Make bed"]);
  // Done early stays done.
  const cleo = choreColumns(data, undefined, 9 * 60).find((c) => c.kid === "cleo")!;
  assert.deepEqual(cleo.done.map((c) => c.title), ["Pack lunch"]);
});

test("no chores yet only when there are no chores and no templates", () => {
  assert.ok(noChoresYet(payload([])));
  assert.ok(!noChoresYet(payload([chore("ava", "Make bed")])));
  const template = { id: "x", repeats: "daily" as const, title: "Make bed", icon: null, who: ["ava"], paused: true, problems: [] };
  assert.ok(!noChoresYet(payload([], [template])));
});

test("days of the week read and written like MyDashLight does", () => {
  assert.deepEqual([...weekdaysOf("Mon-Fri")!].sort(), [0, 1, 2, 3, 4]);
  assert.deepEqual([...weekdaysOf("Sat, Sun")!].sort(), [5, 6]);
  assert.deepEqual([...weekdaysOf("Fri-Mon")!].sort(), [0, 4, 5, 6]);
  assert.equal(weekdaysOf("")!.size, 7);
  assert.equal(weekdaysOf("Any"), null);
  assert.equal(weekdaysLabel([0, 1, 2, 3, 4]), "Mon-Fri");
  assert.equal(weekdaysLabel([5, 6]), "Sat, Sun");
  assert.equal(weekdaysLabel([0, 2, 4]), "Mon, Wed, Fri");
  assert.equal(weekdaysLabel([0, 1, 2, 4, 6]), "Mon-Wed, Fri, Sun");
  assert.equal(weekdaysLabel([0, 1, 2, 3, 4, 5, 6]), "");
  assert.equal(weekdaysLabel([]), "");
});

test("a template in words", () => {
  assert.equal(scheduleText("daily", ""), "Every day");
  assert.equal(scheduleText("daily", "Mon-Fri"), "Mon–Fri");
  assert.equal(scheduleText("daily", "", 2), "Every 2 days");
  assert.equal(scheduleText("weekly", "Any"), "Sometime each week");
  assert.equal(scheduleText("weekly", "Thu", 2), "Thu every 2 weeks");
  assert.equal(scheduleText("monthly", "Any"), "Sometime each month");
  assert.equal(scheduleText("monthly", "15"), "The 15th each month");
  assert.equal(scheduleText("monthly", "last", 3), "The last day every 3 months");
  assert.equal(scheduleText("monthly", "1st Sat"), "The 1st Sat each month");
  assert.equal(scheduleText("school", ""), "Every school day");
  assert.equal(scheduleText("school", "Mon-Thu"), "Mon–Thu school days");
  assert.equal(scheduleText("school", "", 1, true), "Every school day, the night before");
  assert.equal(scheduleText("school", "", 1, true, true), "Bring lunch days, the night before");
  assert.equal(scheduleText("school", "Mon, Wed", 1, false, true), "Mon, Wed Bring lunch days");
  const kids = payload([]).kids;
  assert.equal(whoText(["ava"], kids), "Ava");
  assert.equal(whoText(["ava", "ben", "cleo"], kids), "Ava, Ben and Cleo");
  assert.equal(whoText(["ava", "ben"], kids, true), "Ava and Ben take turns");
  assert.equal(whoText([], kids), "Nobody yet");
  assert.equal(ordinal(1), "1st");
  assert.equal(ordinal(2), "2nd");
  assert.equal(ordinal(3), "3rd");
  assert.equal(ordinal(11), "11th");
  assert.equal(ordinal(22), "22nd");
  assert.equal(problemText("who:"), "Nobody is picked to do it");
  assert.equal(problemText("who:Zed"), "“Zed” isn’t one of the kids");
  assert.equal(problemText("days:Funday"), "The days (“Funday”) couldn’t be read");
});

test("editing a template: what's sent, and what stops a save", () => {
  const t = {
    id: "t1",
    repeats: "weekly" as const,
    title: "Recycling",
    icon: "🗑️",
    details: "By 7 PM",
    who: ["ava", "ben"],
    take_turns: true,
    days: "Fri",
    every: 1,
    paused: false,
    problems: [],
  };
  const d = draftOf(t);
  assert.equal(draftProblem(d), null);
  assert.deepEqual(draftFields(d), {
    template: "t1",
    repeats: "weekly",
    title: "Recycling",
    icon: "🗑️",
    details: "By 7 PM",
    who: ["ava", "ben"],
    take_turns: true,
    days: "Fri",
    every: 1,
    paused: false,
  });
  // One kid can't take turns; no icon is sent as empty.
  assert.equal(draftFields({ ...d, who: ["ava"], icon: null }).take_turns, false);
  assert.equal(draftFields({ ...d, icon: null }).icon, "");
  const fresh = newDraft();
  assert.equal(draftFields(fresh).template, undefined);
  assert.equal(draftProblem(fresh), "Give the chore a name.");
  assert.equal(draftProblem({ ...fresh, title: "Bins" }), "Pick who does it.");
  assert.equal(draftProblem({ ...fresh, title: "Bins", who: ["ava"], days: NO_DAYS }), "Pick at least one day.");
  // A bare task typed into Google: no who yet, days from the payload.
  const bare = draftOf({ id: "task9", repeats: "daily", title: "Water plants", icon: null, who: [], paused: false, problems: ["who:"] });
  assert.equal(bare.days, "");
  assert.equal(bare.every, 1);
  assert.equal(defaultDays("weekly"), "Any");
  assert.equal(defaultDays("school"), "");
});
