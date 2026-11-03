import { readFileSync } from "node:fs";
import type { Plan } from "../src/types.ts";

/** The sample week from scripts/sample_plan.py, drawn by the real planner. */
export function sampleWeek(): Plan {
  return JSON.parse(readFileSync(new URL("./fixtures/week.json", import.meta.url), "utf8")) as Plan;
}
