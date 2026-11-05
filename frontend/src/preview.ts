// The offline preview: the sample week, moved so it starts today. Nothing is saved.

import { PreviewBackend } from "./backend.ts";
import "./board.ts";
import type { Chore, ChoresPayload, ChoreTemplate } from "./chores.ts";
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
      points: null,
      template: null,
      order: chores.length,
      ...extra,
    });
  };
  const doneAt = new Date(Date.now() - 50 * 60_000).toISOString();
  add(0, "🛏️", "Make bed", { state: "done", done_at: doneAt });
  add(0, "🐕", "Feed the dog", {});
  add(0, "🎻", "Practice violin", { due: day(-1), state: "overdue", missed: 1 });
  add(0, "🧺", "Put away laundry", { repeats: "weekly", due: day(3), shows_from: day(-2) });
  add(1, "🛏️", "Make bed", {});
  add(1, "🍽️", "Clear the table", {});
  add(1, "🗑️", "Take out recycling", { repeats: "weekly", due: day(2), shows_from: day(2), state: "upcoming" });
  add(2, "🛏️", "Make bed", { state: "done", done_at: doneAt });
  add(2, "🪥", "Brush teeth", { state: "done", done_at: doneAt });
  add(2, "🧸", "Tidy room", { repeats: "weekly", due: day(4), shows_from: day(1), state: "upcoming" });
  return {
    updated: new Date(Date.now() - 60_000).toISOString(),
    today,
    time_zone: plan.time_zone,
    days_ahead: 7,
    kids: kids.map((k) => ({ id: k.id, name: k.name })),
    chores,
    templates: sampleTemplates(kids.map((k) => k.id)),
    people: [
      ...kids.map((k) => ({ id: k.id, name: k.name, role: "kid" as const })),
      ...(plan.people?.drivers ?? []).map((d) => ({ id: d.id, name: d.name, role: "parent" as const })),
    ],
    status: { ok: true, error: null, needs: null },
  };
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
    t("t-violin", "🎻", "Practice violin", { who: [a].filter(Boolean), days: "Mon-Fri" }),
    t("t-table", "🍽️", "Clear the table", { who: [b].filter(Boolean) }),
    t("t-teeth", "🪥", "Brush teeth", { who: [c].filter(Boolean) }),
    t("t-laundry", "🧺", "Put away laundry", { repeats: "weekly", who: [a].filter(Boolean), days: "Any" }),
    t("t-recycling", "🗑️", "Take out recycling", { repeats: "weekly", who: [a, b].filter(Boolean), take_turns: true, days: "Fri" }),
    t("t-room", "🧸", "Tidy room", { repeats: "weekly", who: [c].filter(Boolean), days: "Any" }),
    t("t-fridge", "🧽", "Wipe out the fridge", { repeats: "monthly", who: [a].filter(Boolean), days: "last", paused: true }),
    t("t-plants", "", "Water the plants", { icon: null, problems: ["who:"] }),
  ];
}

const board = document.querySelector("mydashlight-board");
if (board) {
  const plan = shift(PREVIEW_PLAN);
  board.backend = new PreviewBackend(plan, sampleChores(plan));
}
