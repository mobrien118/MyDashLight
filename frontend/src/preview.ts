// The offline preview: the sample week, moved so it starts today. Nothing is saved.

import { PreviewBackend } from "./backend.ts";
import "./board.ts";
import { nowIn } from "./format.ts";
import type { Plan } from "./types.ts";

declare const PREVIEW_PLAN: Plan;

function shift(plan: Plan): Plan {
  const today = nowIn(plan.time_zone).date;
  const start = new Date(`${today}T12:00:00Z`).getTime();
  const days = plan.days.map((d, i) => ({ ...d, date: new Date(start + i * 86_400_000).toISOString().slice(0, 10) }));
  return { ...plan, days, updated: new Date(Date.now() - 60_000).toISOString() };
}

const board = document.querySelector("mydashlight-board");
if (board) board.backend = new PreviewBackend(shift(PREVIEW_PLAN));
