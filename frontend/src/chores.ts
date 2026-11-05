// Chores as `mydashlight.get_chores` returns them (custom_components/mydashlight/chores.py),
// and how the board groups them. Pure module: plain data in, lists and labels out.

import { kidColor, type KidColor } from "./colors.ts";
import { daysBetween, shortDay } from "./format.ts";

export type ChoreState = "upcoming" | "open" | "overdue" | "done" | "late";
export type Repeats = "daily" | "weekly" | "monthly" | "school";

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
  /** Who checked it off, when it wasn't the kid it's for: a person's id (MyDashLight 0.11 and later). */
  done_by?: string | null;
  /** Who checked it off, as saved in Google: shown when that person isn't set up any more. */
  done_by_name?: string | null;
  /** Days missed so far. */
  missed: number;
  points: number | null;
  template: string | null;
  order: number;
  /** The school day a night-before chore gets ready for, such as Pack lunch (MyDashLight 0.11 and later). */
  for_day?: string | null;
}

export interface Person {
  id: string;
  name: string;
  role: "kid" | "parent";
}

export interface ChoreTemplate {
  id: string;
  repeats: Repeats;
  title: string;
  icon: string | null;
  details?: string;
  /** Kid ids. */
  who: string[];
  take_turns?: boolean;
  /** As MyDashLight writes the Days line: "" (every day), "Mon-Fri", "Any", "15", "last", "1st Sat". */
  days?: string;
  every?: number;
  starts?: string | null;
  ends?: string | null;
  points?: number | null;
  paused: boolean;
  /** School days: due the evening before each school day. */
  night_before?: boolean;
  /** School days: only on days the kid brings lunch. */
  bring_only?: boolean;
  /** What couldn't be read, such as "who:" or "days:Funday". A template with problems makes no chores. */
  problems: string[];
}

export interface ChoresPayload {
  updated: string;
  today: string;
  time_zone: string;
  days_ahead: number;
  kids: { id: string; name: string }[];
  /** Everyone who can check a chore off: the kids, then the parents (MyDashLight 0.11 and later). */
  people?: Person[];
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
/** When a night-before chore shows on its day: 1 PM, when the lunch chips turn to the next day too. */
export const EVENING_FROM = 13 * 60;

/**
 * A night-before chore (like packing lunch) waits until the afternoon of its day: until then it's
 * listed as coming up later today, not to do.
 */
export function waitsForEvening(c: Chore, today: string, minutes: number): boolean {
  return c.state === "open" && !!c.for_day && c.due === today && minutes < EVENING_FROM;
}

/** The chores as they stand at ``minutes`` past midnight: night-before ones not yet showing are coming up. */
function atTime(data: ChoresPayload, minutes: number): Chore[] {
  return data.chores.map((c) => (waitsForEvening(c, data.today, minutes) ? { ...c, state: "upcoming" as const, shows_from: data.today } : c));
}

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
    if (c.for_day) return `From 1 PM · for ${dayWord(c.for_day, today)}`;
    // The board lists these under the day they show, so only a later due day needs saying.
    const shows = c.shows_from ?? c.due;
    if (!c.due || !shows || c.due <= shows) return "";
    const ahead = daysBetween(today, c.due);
    return `By ${ahead === 1 ? "tomorrow" : ahead < 7 ? shortDay(c.due) : monthDay(c.due)}`;
  }
  if (c.for_day && c.due === today) return `Tonight · for ${dayWord(c.for_day, today)}`;
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
  if (d === 1) return "tomorrow";
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
export function choreColumns(data: ChoresPayload, colors?: Map<string, KidColor>, minutes = 24 * 60): ChoreColumn[] {
  const sorted = atTime(data, minutes).sort((a, b) => a.order - b.order);
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
 * week or month only joins on its last day, so the list stays short. A night-before chore joins
 * from 1 PM.
 */
export function choresNeedingAttention(data: ChoresPayload, minutes = 24 * 60): Chore[] {
  return atTime(data, minutes)
    .filter((c) => c.state === "overdue" || (c.state === "open" && (c.due == null || c.due <= data.today)))
    .sort((a, b) => (a.state === b.state ? a.order - b.order : a.state === "overdue" ? -1 : 1));
}

/** No chores and no templates yet: the Chores view explains how to add some. */
export function noChoresYet(data: ChoresPayload): boolean {
  return !data.chores.length && !data.templates.length;
}

// Templates: the chore editor

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

/** The days in a Days label such as "Mon-Fri" or "Sat, Sun", Monday as 0; "" is every day. Null if it isn't a list of days. */
export function weekdaysOf(label: string): Set<number> | null {
  const text = label.trim();
  if (!text) return new Set([0, 1, 2, 3, 4, 5, 6]);
  const out = new Set<number>();
  for (const part of text.split(",")) {
    const [a, b] = part.split("-").map((s) => WEEKDAYS.indexOf(s.trim() as (typeof WEEKDAYS)[number]));
    if (a === undefined || a < 0 || (b !== undefined && b < 0)) return null;
    if (b === undefined) out.add(a);
    else for (let i = 0; i <= (b - a + 7) % 7; i++) out.add((a + i) % 7);
  }
  return out;
}

/** "Mon-Fri", "Sat, Sun", "Mon, Wed, Fri", or "" for every day: the same as MyDashLight writes. */
export function weekdaysLabel(days: Iterable<number>): string {
  const wanted = [...new Set(days)].sort((a, b) => a - b);
  if (wanted.length === 0 || wanted.length === 7) return "";
  const runs: number[][] = [];
  for (const d of wanted) {
    const last = runs.at(-1);
    if (last && last.at(-1) === d - 1) last.push(d);
    else runs.push([d]);
  }
  return runs
    .flatMap((r) => (r.length >= 3 ? [`${WEEKDAYS[r[0]!]}-${WEEKDAYS[r.at(-1)!]}`] : r.map((d) => WEEKDAYS[d]!)))
    .join(", ");
}

/** Daily chores with no day picked; never saved. */
export const NO_DAYS = "none";

/** A template being added or changed, before it's saved. */
export interface ChoreDraft {
  /** Null for a new one. */
  template: string | null;
  repeats: Repeats;
  title: string;
  icon: string | null;
  details: string;
  /** Kid ids. */
  who: string[];
  take_turns: boolean;
  /** A Days line, as MyDashLight writes it: "" (every day), "Mon-Fri", "Any", "15", "last"... */
  days: string;
  every: number;
  paused: boolean;
  /** School days: due the evening before. */
  night_before: boolean;
  /** School days: only on Bring lunch days. */
  bring_only: boolean;
}

/** What `save_chore_template` is sent. Fields left out keep what the template has. */
export interface TemplateFields {
  template?: string;
  repeats: Repeats;
  title: string;
  icon: string;
  details: string;
  who: string[];
  take_turns: boolean;
  days: string;
  every: number;
  paused: boolean;
  /** Only sent for school-days chores, so older versions of MyDashLight still take the rest. */
  night_before?: boolean;
  bring_only?: boolean;
}

/** The Days a chore starts with: every day (or school day), or sometime that week or month. */
export function defaultDays(repeats: Repeats): string {
  return repeats === "daily" || repeats === "school" ? "" : "Any";
}

export function newDraft(who: string[] = []): ChoreDraft {
  return {
    template: null,
    repeats: "daily",
    title: "",
    icon: null,
    details: "",
    who,
    take_turns: false,
    days: "",
    every: 1,
    paused: false,
    night_before: false,
    bring_only: false,
  };
}

export function draftOf(t: ChoreTemplate): ChoreDraft {
  return {
    template: t.id,
    repeats: t.repeats,
    title: t.title,
    icon: t.icon,
    details: t.details ?? "",
    who: [...t.who],
    take_turns: !!t.take_turns,
    days: t.days ?? defaultDays(t.repeats),
    every: t.every && t.every > 0 ? t.every : 1,
    paused: t.paused,
    night_before: !!t.night_before,
    bring_only: !!t.bring_only,
  };
}

/** Why the draft can't be saved yet, or null when it can. */
export function draftProblem(d: ChoreDraft): string | null {
  if (!d.title.trim()) return "Give the chore a name.";
  if (!d.who.length) return "Pick who does it.";
  if (d.days === NO_DAYS) return "Pick at least one day.";
  return null;
}

export function draftFields(d: ChoreDraft): TemplateFields {
  return {
    ...(d.template ? { template: d.template } : {}),
    repeats: d.repeats,
    title: d.title.trim(),
    icon: d.icon ?? "",
    details: d.details.trim(),
    who: d.who,
    take_turns: d.take_turns && d.who.length > 1,
    days: d.days,
    every: d.repeats === "school" ? 1 : d.every,
    paused: d.paused,
    ...(d.repeats === "school" ? { night_before: d.night_before, bring_only: d.bring_only } : {}),
  };
}

export function ordinal(n: number): string {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th"}`;
}

/**
 * "Every day", "Mon-Fri", "Thu every 2 weeks", "Sometime each month", "The 15th each month",
 * "Every school day, the night before", "Bring lunch days, the night before".
 */
export function scheduleText(repeats: Repeats, days: string, every = 1, nightBefore = false, bringOnly = false): string {
  if (repeats === "school") {
    const d = days.trim().replace(/-/g, "–");
    const which = bringOnly ? (d ? `${d} Bring lunch days` : "Bring lunch days") : d ? `${d} school days` : "Every school day";
    return nightBefore ? `${which}, the night before` : which;
  }
  const unit = { daily: "day", weekly: "week", monthly: "month" }[repeats];
  const each = every > 1 ? `every ${every} ${unit}s` : `each ${unit}`;
  const d = days.trim();
  if (repeats === "daily") {
    const label = d.replace(/-/g, "–");
    if (every > 1) return label ? `${label}, every ${every} days` : `Every ${every} days`;
    return label || "Every day";
  }
  if (!d || d.toLowerCase() === "any") return `Sometime ${each}`;
  if (repeats === "weekly") return `${d.replace(/-/g, "–")} ${each}`;
  const parts = d.split(",").map((p) => {
    const s = p.trim();
    if (s.toLowerCase() === "last") return "the last day";
    return /^\d+$/.test(s) ? `the ${ordinal(Number(s))}` : `the ${s}`;
  });
  const text = `${parts.join(" and ")} ${each}`;
  return text[0]!.toUpperCase() + text.slice(1);
}

/** "Ava and Ben take turns", "Ava, Ben and Cleo", or "Nobody yet". */
export function whoText(who: string[], kids: { id: string; name: string }[], takeTurns = false): string {
  const names = who.map((id) => kids.find((k) => k.id === id)?.name ?? id);
  if (!names.length) return "Nobody yet";
  const list = names.length === 1 ? names[0]! : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
  return takeTurns && names.length > 1 ? `${list} take turns` : list;
}

/** What's wrong with a template, in words, from MyDashLight's "who:Zed" style codes. */
export function problemText(p: string): string {
  const i = p.indexOf(":");
  const field = i < 0 ? p : p.slice(0, i);
  const value = i < 0 ? "" : p.slice(i + 1);
  switch (field) {
    case "who":
      return value ? `“${value}” isn’t one of the kids` : "Nobody is picked to do it";
    case "days":
      return `The days (“${value}”) couldn’t be read`;
    case "title":
      return "It has no name";
    case "every":
      return `“Every ${value}” couldn’t be read`;
    case "take_turns":
      return `“Take turns: ${value}” couldn’t be read`;
    default:
      return `The ${field.replace(/_/g, " ")} line (“${value}”) couldn’t be read`;
  }
}
