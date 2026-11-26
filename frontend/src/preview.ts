// The offline preview: the sample week, moved so it starts today. Nothing is saved.

import { PreviewBackend } from "./backend.ts";
import "./board.ts";
import type { Chore, ChoresPayload, ChoreTemplate, PointsEntry } from "./chores.ts";
import { addDays, weekday, type LunchPayload } from "./lunch.ts";
import { nowIn } from "./format.ts";
import type { Plan } from "./types.ts";

declare const PREVIEW_PLAN: Plan;

function shift(plan: Plan): Plan {
  const today = nowIn(plan.time_zone).date;
  const start = new Date(`${today}T12:00:00Z`).getTime();
  const days = plan.days.map((d, i) => ({ ...d, date: new Date(start + i * 86_400_000).toISOString().slice(0, 10) }));
  return { ...plan, days, updated: new Date(Date.now() - 60_000).toISOString() };
}

/** A few sample chores for the plan's kids, around today. */
function sampleChores(plan: Plan): ChoresPayload {
  const today = nowIn(plan.time_zone).date;
  const day = (n: number): string => new Date(new Date(`${today}T12:00:00Z`).getTime() + n * 86_400_000).toISOString().slice(0, 10);
  const kids = plan.people?.kids ?? [];
  const chores: Chore[] = [];
  const add = (kid: number, icon: string, title: string, extra: Partial<Chore>): void => {
    const k = kids[kid];
    if (!k) return;
    chores.push({
      id: `sample-${chores.length}`,
      kid: k.id,
      title,
      icon,
      details: "",
      repeats: "daily",
      due: today,
      shows_from: null,
      state: "open",
      done_at: null,
      missed: 0,
      worth: 1,
      earned: null,
      template: null,
      order: chores.length,
      ...extra,
    });
  };
  const doneAt = new Date(Date.now() - 50 * 60_000).toISOString();
  add(0, "🛏️", "Make bed", { state: "done", done_at: doneAt, earned: 1 });
  add(0, "🐕", "Feed the dog", {});
  add(0, "🎻", "Practice violin", { due: day(-1), state: "overdue", missed: 1 });
  add(0, "🧺", "Put away laundry", { repeats: "weekly", due: day(3), shows_from: day(-2) });
  add(1, "🛏️", "Make bed", {});
  add(1, "🍽️", "Clear the table", {});
  add(1, "🗑️", "Take out recycling", { repeats: "weekly", due: day(2), shows_from: day(2), state: "upcoming" });
  add(2, "🛏️", "Make bed", { state: "done", done_at: doneAt, earned: 1 });
  add(2, "🪥", "Brush teeth", { state: "done", done_at: doneAt, earned: 1 });
  add(2, "🧸", "Tidy room", { repeats: "weekly", due: day(4), shows_from: day(1), state: "upcoming" });
  // Night before: due on the school day, showing from the evening before.
  const school = addDays(today, weekday(today) === 4 ? 3 : 1);
  add(1, "🥪", "Pack lunch", { repeats: "school", due: school, shows_from: today, for_day: school });
  return {
    updated: new Date(Date.now() - 60_000).toISOString(),
    today,
    time_zone: plan.time_zone,
    days_ahead: 7,
    kids: kids.map((k) => ({ id: k.id, name: k.name })),
    chores,
    points: samplePoints(plan, kids.map((k) => k.id)),
    templates: sampleTemplates(kids.map((k) => k.id)),
    people: [
      ...kids.map((k) => ({ id: k.id, name: k.name, role: "kid" as const })),
      ...(plan.people?.drivers ?? []).map((d) => ({ id: d.id, name: d.name, role: "parent" as const })),
    ],
    status: { ok: true, error: null, needs: null },
  };
}

/** Made-up scores for the last 7 days: everyone listed, the first kid ahead. */
function samplePoints(plan: Plan, kids: string[]): NonNullable<ChoresPayload["points"]> {
  const scores: Record<string, number> = {};
  [12, 9.5, 7].forEach((n, i) => {
    if (kids[i]) scores[kids[i]!] = n;
  });
  (plan.people?.drivers ?? []).forEach((d, i) => (scores[d.id] = i ? 2 : 4));
  const [a = "", b = "", c = ""] = kids;
  const ago = (days: number, hour: number): string => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    d.setUTCHours(hour + 6, 12, 0, 0); // the sample family is on Central time
    return d.toISOString();
  };
  const log: PointsEntry[] = [];
  const add = (by: string, kid: string, icon: string, title: string, points: number, days: number, hour: number, late = false): void => {
    if (by && kid) log.push({ id: `log${log.length}`, title, icon, kid, by, done_at: ago(days, hour), points, late });
  };
  add(a, a, "🛏️", "Make bed", 1, 0, 7);
  add(c, a, "🐕", "Feed the dog", 0, 0, 7);
  add(a, b, "🧻", "Restock TP", 1.5, 1, 18, true);
  add(a, a, "🧹", "Vacuum stairs", 4, 2, 16);
  add(a, a, "🐕", "Feed the dog", 2, 2, 7);
  add(a, a, "🐕", "Feed the dog", 2, 3, 7);
  add(a, a, "🛏️", "Make bed", 0.5, 4, 9, true);
  add(a, a, "🛏️", "Make bed", 1, 5, 7);
  add(b, b, "🍽️", "Clear the table", 2, 0, 19);
  add(b, b, "🍽️", "Clear the table", 2, 1, 19);
  add(b, b, "🧺", "Put away laundry", 3, 3, 17);
  add(b, b, "🛏️", "Make bed", 1, 4, 7);
  add(b, b, "🛏️", "Make bed", 1, 5, 7);
  add(b, b, "🛏️", "Make bed", 0.5, 6, 10, true);
  add(c, c, "🛏️", "Make bed", 1, 0, 7);
  add(c, c, "🪥", "Brush teeth", 1, 0, 8);
  add(c, c, "🧸", "Tidy room", 2, 2, 17);
  add(c, c, "🧸", "Tidy room", 2, 4, 17);
  add(c, c, "🛏️", "Make bed", 1, 5, 7);
  log.sort((x, y) => (y.done_at ?? "").localeCompare(x.done_at ?? ""));
  const possible: Record<string, number> = {};
  [14, 11, 6].forEach((n, i) => {
    if (kids[i]) possible[kids[i]!] = n;
  });
  return { days: 7, default: 1, scores, leaders: kids.length ? [kids[0]!] : [], log, possible };
}

/** The templates behind the sample chores, plus one typed into Google Tasks and not set up yet. */
function sampleTemplates(kids: string[]): ChoreTemplate[] {
  const [a = "", b = "", c = ""] = kids;
  const t = (id: string, icon: string, title: string, extra: Partial<ChoreTemplate>): ChoreTemplate => ({
    id,
    repeats: "daily",
    title,
    icon,
    details: "",
    who: [],
    take_turns: false,
    days: "",
    every: 1,
    paused: false,
    problems: [],
    ...extra,
  });
  return [
    t("t-bed", "🛏️", "Make bed", { who: [a, b, c].filter(Boolean) }),
    t("t-dog", "🐕", "Feed the dog", { who: [a].filter(Boolean) }),
    t("t-violin", "🎻", "Practice violin", { who: [a].filter(Boolean), repeats: "weekly", days: "Mon-Fri" }),
    t("t-table", "🍽️", "Clear the table", { who: [b].filter(Boolean) }),
    t("t-teeth", "🪥", "Brush teeth", { who: [c].filter(Boolean) }),
    t("t-laundry", "🧺", "Put away laundry", { repeats: "weekly", who: [a].filter(Boolean), days: "Any" }),
    t("t-recycling", "🗑️", "Take out recycling", { repeats: "weekly", who: [a, b].filter(Boolean), take_turns: true, days: "Fri" }),
    t("t-room", "🧸", "Tidy room", { repeats: "weekly", who: [c].filter(Boolean), days: "Any" }),
    t("t-fridge", "🧽", "Wipe out the fridge", { repeats: "monthly", who: [a].filter(Boolean), days: "last", paused: true }),
    t("t-plants", "", "Water the plants", { icon: null, problems: ["who:"] }),
  ];
}

/** Sample lunches: this month and next, a few Bring days, Thanksgiving-style days off. */
function sampleLunch(plan: Plan): LunchPayload {
  const today = nowIn(plan.time_zone).date;
  const first = `${today.slice(0, 7)}-01`;
  const [y, m] = today.split("-").map(Number);
  const last = new Date(Date.UTC(y!, m! + 1, 0)).toISOString().slice(0, 10);
  const kids = plan.people?.kids ?? [];
  // The 4th Wednesday to Friday of this month off for everyone, like Thanksgiving.
  const wed = addDays(first, ((2 - weekday(first) + 7) % 7) + 21);
  const picks = (every: number[], kid: number): Record<string, "bring" | "buy"> => {
    const out: Record<string, "bring" | "buy"> = {};
    for (let d = first; d <= last; d = addDays(d, 1)) {
      if (weekday(d) < 5 && every.includes(weekday(d))) out[d] = kid === 1 ? "buy" : "bring";
    }
    return out;
  };
  // Two schools' menus: the first kid's, and the others'. Next month's isn't in yet.
  const dishes = [
    ["Chicken tenders", "Cheese pizza", "Beef tacos", "Mac & cheese", "Orange chicken", "Hamburger", "Pancakes & sausage"],
    ["Pizza dippers", "Corn dog", "Chicken nuggets", "Spaghetti & meatballs", "Grilled cheese & tomato soup", "Walking taco"],
  ];
  // Like a school's feed: the sides and other choices, then MyDashLight's note.
  const sides = [
    [
      "Seasoned Spiral Fries, Hamburger, Cheeseburger, Black Bean Burger, Grilled Chicken Sandwich, PBJ Uncrustable, Daily Entree Salad",
      "Parmesan Roasted Broccoli, Hamburger, Cheeseburger, Grilled Cheese Pretzel Roll, Choice of Cold Milk",
      "Sweet Corn, Hamburger, Cheeseburger, Black Bean Burger, Daily Entree Salad, Choice of Cold Milk",
    ],
    [
      "Italian Sweet Peas, Fresh Honeydew Slices, Choice of Cold Milk",
      "Southwestern Refried Beans, Orange Wedges, Choice of Cold Milk",
      "Baked Sweet Potato, Fresh Apple Slices, Choice of Cold Milk",
    ],
  ];
  const menus = (school: number): Record<string, { dish: string; details: string }> => {
    const out: Record<string, { dish: string; details: string }> = {};
    const list = dishes[school]!;
    let n = 0;
    for (let d = first; d <= addDays(first, 30) && d.slice(0, 7) === first.slice(0, 7); d = addDays(d, 1)) {
      if (weekday(d) < 5) out[d] = { dish: list[n++ % list.length]!, details: `${sides[school]![n % 3]}\n\nFrom the school's menu feed.` };
    }
    return out;
  };
  return {
    today,
    first,
    last,
    kids: kids.map((k, i) => ({
      id: k.id,
      name: k.name,
      default: i === 1 ? "bring" : "buy",
      picks: picks(i === 0 ? [0, 2] : i === 1 ? [4] : [1, 3], i),
      menus: menus(i === 0 ? 0 : 1),
      days_off: [{ first: wed, last: addDays(wed, 2), title: "No School – Thanksgiving Break" }],
    })),
    status: { ok: true, error: null },
  };
}

const board = document.querySelector("mydashlight-board");
if (board) {
  const plan = shift(PREVIEW_PLAN);
  board.backend = new PreviewBackend(plan, sampleChores(plan), sampleLunch(plan));
}
