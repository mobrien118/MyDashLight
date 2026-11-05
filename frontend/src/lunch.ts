// Lunches as `mydashlight.get_lunches` returns them (custom_components/mydashlight/school.py),
// and the month grid the Lunch tab draws. Pure module: plain data in, grids and labels out.

import { daysBetween, shortDay } from "./format.ts";

export type Lunch = "bring" | "buy";

export interface DayOff {
  first: string;
  last: string;
  /** The event's title, such as "No School – Thanksgiving Break". */
  title: string;
}

/** What the school serves: a "Lunch: Pizza" all-day event on the kid's calendar. */
export interface Menu {
  dish: string;
  /** The event's notes: the rest of the menu, or empty. */
  details: string;
}

export interface KidLunches {
  id: string;
  name: string;
  /** What a school day nobody picked for gets. */
  default: Lunch;
  /** Each picked school day: "2026-11-06" to "bring". */
  picks: Record<string, Lunch>;
  /** Each day with a menu: "2026-11-06" to what's served. Missing before MyDashLight 0.13.0. */
  menus?: Record<string, Menu>;
  /** Set when the kid has a school menu feed: whether it was read last time. */
  menu_feed?: { ok: boolean; error: string | null };
  days_off: DayOff[];
}

export interface LunchPayload {
  today: string;
  /** The days read from the calendars, "2026-11-01" to "2026-12-31". */
  first: string;
  last: string;
  kids: KidLunches[];
  status: { ok: boolean; error: string | null };
}

/** A pick tapped but not seen back from Google yet: `${kid}|${date}` to the lunch (null: back to the default). */
export type LunchDrafts = ReadonlyMap<string, Lunch | null>;

export function draftKey(kid: string, date: string): string {
  return `${kid}|${date}`;
}

export function addDays(date: string, n: number): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d! + n)).toISOString().slice(0, 10);
}

/** Monday 0 to Sunday 6. */
export function weekday(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return (new Date(Date.UTC(y!, m! - 1, d!)).getUTCDay() + 6) % 7;
}

export function dayOff(kid: KidLunches, date: string): DayOff | null {
  return kid.days_off.find((d) => d.first <= date && date <= d.last) ?? null;
}

export function isSchoolDay(kid: KidLunches, date: string): boolean {
  return weekday(date) < 5 && !dayOff(kid, date);
}

/** The kid's lunch that day, with picks still being saved, or null with no school. */
export function lunchOn(kid: KidLunches, date: string, drafts: LunchDrafts = new Map()): { lunch: Lunch; picked: boolean } | null {
  if (!isSchoolDay(kid, date)) return null;
  const key = draftKey(kid.id, date);
  if (drafts.has(key)) {
    const d = drafts.get(key);
    return d ? { lunch: d, picked: true } : { lunch: kid.default, picked: false };
  }
  const pick = kid.picks[date];
  return pick ? { lunch: pick, picked: true } : { lunch: kid.default, picked: false };
}

/** What the school serves the kid that day, or null with no menu or no school. */
export function menuOn(kid: KidLunches, date: string): Menu | null {
  if (!isSchoolDay(kid, date)) return null;
  return kid.menus?.[date] ?? null;
}

export interface LunchCell {
  date: string;
  day: number;
  /** In another month: drawn empty. */
  outside: boolean;
  /** The day-off event's title on a weekday with no school. */
  off: string | null;
  lunch: Lunch | null;
  picked: boolean;
  /** The day's dish, such as "Pizza". */
  menu: string | null;
  past: boolean;
  today: boolean;
}

/** "2026-11" for the month a date is in. */
export function monthOf(date: string): string {
  return date.slice(0, 7);
}

export function monthTitle(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, 1)).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

export function nextMonth(month: string, by = 1): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y!, m! - 1 + by, 1));
  return d.toISOString().slice(0, 7);
}

/** The months the Lunch tab can show: the ones read from the calendars. */
export function lunchMonths(data: LunchPayload): string[] {
  const out: string[] = [];
  for (let m = monthOf(data.first); m <= monthOf(data.last); m = nextMonth(m)) out.push(m);
  return out;
}

/**
 * The school weeks of a month, Monday to Friday, like the printed lunch menu. Weeks that are
 * only weekend days of the month are left out.
 */
export function monthGrid(data: LunchPayload, kid: KidLunches, month: string, drafts: LunchDrafts = new Map()): LunchCell[][] {
  const first = `${month}-01`;
  let monday = addDays(first, -weekday(first));
  const weeks: LunchCell[][] = [];
  while (monthOf(monday) <= month) {
    const week: LunchCell[] = [];
    for (let i = 0; i < 5; i++) {
      const date = addDays(monday, i);
      const outside = monthOf(date) !== month;
      const off = outside ? null : dayOff(kid, date);
      const l = outside ? null : lunchOn(kid, date, drafts);
      week.push({
        date,
        day: Number(date.slice(8)),
        outside,
        off: off ? off.title : null,
        lunch: l?.lunch ?? null,
        picked: l?.picked ?? false,
        menu: outside ? null : (menuOn(kid, date)?.dish ?? null),
        past: date < data.today,
        today: date === data.today,
      });
    }
    if (week.some((c) => !c.outside)) weeks.push(week);
    monday = addDays(monday, 7);
  }
  return weeks;
}

/** "Thanksgiving Break" from "No School – Thanksgiving Break": what's left after "No School". */
export function offLabel(title: string): string {
  const rest = title.replace(/no[\s-]+school/i, "").replace(/^[\s:–—\-()]+|[\s()]+$/g, "");
  return rest || "No school";
}

/** How many school days left this month bring and buy, from today on. */
export function monthCounts(cells: LunchCell[][]): { bring: number; buy: number } {
  let bring = 0;
  let buy = 0;
  for (const c of cells.flat()) {
    if (c.outside || c.past || !c.lunch) continue;
    if (c.lunch === "bring") bring++;
    else buy++;
  }
  return { bring, buy };
}

/**
 * The lunch a kid's card shows: today's until early afternoon, then the next school day's,
 * so in the evening it says what to pack for. Null when there's no school in the next week.
 */
export function lunchChip(
  kid: KidLunches,
  today: string,
  minutes: number,
  drafts: LunchDrafts = new Map(),
): { lunch: Lunch; when: string; date: string; menu: string | null } | null {
  const start = minutes < 13 * 60 ? 0 : 1;
  for (let i = start; i < 8; i++) {
    const date = addDays(today, i);
    const l = lunchOn(kid, date, drafts);
    if (!l) continue;
    const ahead = daysBetween(today, date);
    return {
      lunch: l.lunch,
      when: ahead === 0 ? "today" : ahead === 1 ? "tomorrow" : shortDay(date),
      date,
      menu: menuOn(kid, date)?.dish ?? null,
    };
  }
  return null;
}
