// Chores as `mydashlight.get_chores` returns them (custom_components/mydashlight/chores.py),
// and how the board groups them. Pure module: plain data in, lists and labels out.

import { kidColor, type KidColor } from "./colors.ts";
import { daysBetween, shortDay } from "./format.ts";

export type ChoreState = "upcoming" | "open" | "overdue" | "done" | "late";
export type Repeats = "daily" | "weekly" | "monthly";

export interface Chore {
  /** The Google task's id, for checking it off. */
  id: string;
  kid: string;
  /** Without the emoji in front. */
  title: string;
  icon: string | null;
  details: string;
  /** Null for a one-off chore added to a kid's list by hand. */
  repeats: Repeats | null;
  /** "2026-11-04", or null when it has no day. */
  due: string | null;
  /** The first day it shows, for a chore done sometime in a week or month. */
  shows_from: string | null;
  state: ChoreState;
  done_at: string | null;
  /** Days missed so far. */
  missed: number;
  points: number | null;
  template: string | null;
  order: number;
}

export interface ChoreTemplate {
  id: string;
  repeats: Repeats;
  title: string;
  icon: string | null;
  who: string[];
  paused: boolean;
  problems: string[];
}

export interface ChoresPayload {
  updated: string;
  today: string;
  time_zone: string;
  days_ahead: number;
  kids: { id: string; name: string }[];
  chores: Chore[];
  templates: ChoreTemplate[];
  /** `needs` says what's stopping chores: signing in to Google again, or the Tasks API. */
  status: { ok: boolean; error: string | null; needs: "sign_in" | "tasks_api" | null };
}

/** Checked off, on time or late. */
export function isDone(c: Chore): boolean {
  return c.state === "done" || c.state === "late";
}

/** Ready to check off now: today's, this week's or this month's, and overdue ones. */
export function isDoable(c: Chore): boolean {
  return c.state === "open" || c.state === "overdue";
}

/** "Missed Mon", "By Sun", "Done 4:12 PM": the line under a chore. Empty when there's nothing to add. */
export function choreNote(c: Chore, today: string, timeZone: string): string {
  if (isDone(c)) {
    const at = c.done_at ? doneTime(c.done_at, today, timeZone) : "";
    return c.state === "late" ? `Done late${at ? ` · ${at}` : ""}` : `Done${at ? ` ${at}` : ""}`;
  }
  if (c.state === "overdue") {
    if (c.missed > 1) return `Missed ${c.missed} times`;
    return c.due ? `Missed ${dayWord(c.due, today)}` : "Missed";
  }
  if (c.state === "upcoming") {
    // The board lists these under the day they show, so only a later due day needs saying.
    const shows = c.shows_from ?? c.due;
    if (!c.due || !shows || c.due <= shows) return "";
    const ahead = daysBetween(today, c.due);
    return `By ${ahead === 1 ? "tomorrow" : ahead < 7 ? shortDay(c.due) : monthDay(c.due)}`;
  }
  if (c.due && c.due > today) {
    const ahead = daysBetween(today, c.due);
    return ahead === 1 ? "By tomorrow" : `By ${ahead < 7 ? shortDay(c.due) : monthDay(c.due)}`;
  }
  return c.missed ? `Today · missed ${c.missed === 1 ? "once" : `${c.missed} times`} before` : "Today";
}

function dayWord(date: string, today: string): string {
  const d = daysBetween(today, date);
  if (d === 0) return "today";
  if (d === -1) return "yesterday";
  return Math.abs(d) < 7 ? shortDay(date) : monthDay(date);
}

function monthDay(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d!)).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function doneTime(iso: string, today: string, timeZone: string): string {
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return "";
  let tz: string | undefined = timeZone;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
  } catch {
    tz = undefined;
  }
  const day = at.toLocaleDateString("en-CA", { timeZone: tz });
  const time = at.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz });
  return day === today ? time : `${shortDay(day)} ${time}`;
}

export interface ChoreColumn {
  kid: string;
  name: string;
  color: KidColor;
  /** Missed and not done yet. */
  overdue: Chore[];
  /** To do now: today's, plus this week's or month's that are showing. */
  now: Chore[];
  /** Checked off today, or ahead of their day. */
  done: Chore[];
  /** Coming up, by the day they show. */
  later: { date: string; chores: Chore[] }[];
  /** How many are left to do now (overdue and now). */
  left: number;
}

/** One column per kid, in the order Home Assistant lists them, colored the same as on the rides board. */
export function choreColumns(data: ChoresPayload, colors?: Map<string, KidColor>): ChoreColumn[] {
  const sorted = [...data.chores].sort((a, b) => a.order - b.order);
  return data.kids.map((k, i) => {
    const mine = sorted.filter((c) => c.kid === k.id);
    const later = new Map<string, Chore[]>();
    for (const c of mine) {
      if (c.state !== "upcoming") continue;
      const day = c.shows_from ?? c.due ?? data.today;
      later.set(day, [...(later.get(day) ?? []), c]);
    }
    const overdue = mine.filter((c) => c.state === "overdue");
    const now = mine.filter((c) => c.state === "open");
    return {
      kid: k.id,
      name: k.name,
      color: colors?.get(k.id) ?? kidColor(i),
      overdue,
      now,
      done: mine.filter(isDone),
      later: [...later.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, chores]) => ({ date, chores })),
      left: overdue.length + now.length,
    };
  });
}

/**
 * The chores Needs attention lists: overdue ones, and ones due today. A chore done sometime this
 * week or month only joins on its last day, so the list stays short.
 */
export function choresNeedingAttention(data: ChoresPayload): Chore[] {
  return [...data.chores]
    .filter((c) => c.state === "overdue" || (c.state === "open" && (c.due == null || c.due <= data.today)))
    .sort((a, b) => (a.state === b.state ? a.order - b.order : a.state === "overdue" ? -1 : 1));
}

/** No chores and no templates yet: the Chores view explains how to add some. */
export function noChoresYet(data: ChoresPayload): boolean {
  return !data.chores.length && !data.templates.length;
}
