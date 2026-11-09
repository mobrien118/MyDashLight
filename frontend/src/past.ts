// What's over drops off the board, so more of the week fits on screen.
//
// An event goes once it has ended and so has every drive for it, the trip home included. A trip,
// a ride or a busy block goes once it has ended. Days before today go altogether. All-day events
// stay until their day is over. The board's `?past=show` setting keeps everything, as before.

import type { Today } from "./layout.ts";
import type { KidItem, Plan, PlanDay, PlanEvent, Segment } from "./types.ts";

function n(v: number | null | undefined, fallback = 0): number {
  return v == null || !Number.isFinite(v) ? fallback : v;
}

/** When an event is over: its end, or later if a drive for it (the trip home) is still going. */
export function overAt(day: PlanDay, e: PlanEvent): number {
  // An errand is over once its stop is done, not at the end of the window it could be done in.
  let at = e.takes != null && e.planned != null ? e.planned + e.takes : e.end;
  if (e.attending === false) return e.end;
  for (const r of day.rides) if (r.serves.includes(e.id) && r.end != null) at = Math.max(at, r.end);
  for (const dd of Object.values(day.drivers)) {
    for (const g of dd.segments) {
      if (g.type === "home" || g.end == null) continue;
      if (g.serves === e.id || g.event === e.id) at = Math.max(at, g.end);
    }
  }
  return at;
}

/**
 * The driver's segments, each trip kept or dropped whole: a run of drives and waits that follow
 * on from each other (as the board draws them) goes once its last leg is done. A stay goes once
 * it's over. So a trip under way still says where it started.
 */
function liveSegments(segments: Segment[], now: number): Segment[] {
  const out: Segment[] = [];
  let run: Segment[] = [];
  const flush = (): void => {
    const last = run[run.length - 1];
    if (last && n(last.end) > now) out.push(...run);
    run = [];
  };
  for (const g of segments) {
    if (g.start == null || g.end == null) continue;
    if (g.type === "home" || g.type === "stay") {
      flush();
      if (g.end > now) out.push(g);
      continue;
    }
    const last = run[run.length - 1];
    if (last && last.end !== g.start) flush();
    run.push(g);
  }
  flush();
  return out;
}

/** Today without what's over. `done` counts the events that dropped off; `from` is now. */
export function todayFrom(day: PlanDay, now: number): PlanDay {
  const gone = new Set(day.events.filter((e) => overAt(day, e) <= now).map((e) => e.id));
  const rideOver = (i: number | undefined): boolean => n(day.rides[i ?? -1]?.end, -1) <= now;
  const itemGone = (it: KidItem): boolean =>
    it.type === "act" ? gone.has(it.event ?? "") : rideOver(it.ride);
  return {
    ...day,
    events: day.events.filter((e) => !gone.has(e.id)),
    // Rides stay in the list, since items point at them by their place in it. Only what's drawn goes.
    kids: Object.fromEntries(
      Object.entries(day.kids).map(([k, v]) => [k, { ...v, items: v.items.filter((it) => !itemGone(it)) }]),
    ),
    drivers: Object.fromEntries(
      Object.entries(day.drivers).map(([d, dd]) => [
        d,
        {
          ...dd,
          segments: liveSegments(dd.segments, now),
          outings: dd.outings.filter((o) => o.start == null || n(o.end, o.start) > now),
          busy: dd.busy.filter((b) => b.end > now),
        },
      ]),
    ),
    clashes: day.clashes.filter((c) => !itemGone(c.a) && !itemGone(c.b)),
    issues: day.issues.filter((x) => !x.event || !gone.has(x.event)),
    done: gone.size,
    from: now,
  };
}

/** The plan as the board shows it: from today on, and today from now on. */
export function withoutPast(plan: Plan, today: Today): Plan {
  return {
    ...plan,
    whole_week: plan.whole_week ?? plan.days,
    days: plan.days.filter((d) => d.date >= today.date).map((d) => (d.date === today.date ? todayFrom(d, today.minutes) : d)),
  };
}
