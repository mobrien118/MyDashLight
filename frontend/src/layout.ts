// Lays out a week of plans as the ride board: a column per kid, then one per driver.
//
// Two ways to read it. Timeline keeps true spacing within each day. Compact has no time scale:
// everything sits in start order, and a column only skips down to stay in order with the
// others. Pure module: plain data in, boxes with positions and text out. The board element
// only draws them.

import { DRIVER_DOT, DRIVER_RGB, kidColor, type KidColor } from "./colors.ts";
import { clock, clockAmPm, dayLabel, daysBetween, duration, hourLabel, shortDay } from "./format.ts";
import type { BusyBlock, CardLine, KidItem, Plan, PlanDay, PlanEvent, Segment, UnplacedEvent } from "./types.ts";

export type Mode = "timeline" | "compact";

/** Pixels per minute in Timeline. */
export const PPM = 3;
export const DAY_HEAD = 36;
const PAD = 12;
const GAP = 8;
/** A car box is joined to what comes next in the kid's column when that starts within this many minutes. */
const JOIN_MINUTES = 30;
/** How far an add-on runs behind the piece in front of it, so its rounded corners show behind. */
const LINK_TUCK = 16;
/** The stacking layer of an activity card; the add-ons around it sit below this. */
const MAIN_LAYER = 100;
/** Left gutter for the hour labels. */
export const GUTTER = 60;
const KID_GAP = 10;
const SEP = 30;
const DRIVER_GAP = 10;
const MIN_KID = 150;
const MIN_DRIVER = 150;
/** A parent's column next to a kid's. The same width: a kid's column holds as much. */
const DRIVER_SHARE = 1;

export interface Target {
  day: string;
  event: string;
}

export interface Column {
  id: string;
  kind: "kid" | "driver";
  x: number;
  w: number;
  name: string;
  dot: string;
  /** "18,135,122", for tinting the column. */
  rgb: string;
  sub: string;
  subWarn: boolean;
}

interface Box {
  key: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CardBox extends Box {
  target: Target;
  event: PlanEvent;
  color: KidColor;
  kidName: string;
  /** The title without the kid's name in front: "Tap", not "Ava Tap", in Ava's column. */
  title: string;
  clash: boolean;
  /** The driver stays: the card is striped. */
  stayed: boolean;
  /** Not attending: it stays on the board, faded and struck through. */
  skipped: boolean;
  time: string;
  drop: CardLine | null;
  pick: CardLine | null;
  showDrop: boolean;
  showPick: boolean;
  /** Lines wrap (Compact) instead of being cut off. */
  wrap: boolean;
  /** Under way at the top of today: it started before the time shown, which is over. */
  cut?: boolean;
  aria: string;
  layer?: number;
}

export interface RideBox extends Box {
  target: Target | null;
  l1: string;
  l2: string;
  show2: boolean;
  /** How many lines of l2 fit in the box. */
  lines2: number;
  dashed: boolean;
  clash: boolean;
  aria: string;
  /** Stacking within its kid's column: higher is drawn in front. Add-ons sit behind their event. */
  layer?: number;
  /** Pixels at the top or bottom tucked behind the piece it's built onto. */
  tuckTop?: number;
  tuckBottom?: number;
}

export interface BandBox extends Box {
  color: KidColor;
}

export interface TripStop {
  text: string;
  warn: boolean;
}

export interface TripBox extends Box {
  target: Target | null;
  l1: string;
  l2: string;
  show2: boolean;
  l3: string;
  show3: boolean;
  stops: TripStop[] | null;
  kids: string[];
  bad: boolean;
  aria: string;
}

export interface StayBox extends Box {
  target: Target | null;
  /** Under way at the top of today, as on a card. */
  cut?: boolean;
  color: KidColor;
  l1: string;
  l2: string;
}

export interface BusyBox extends Box {
  label: string;
  labelY: number;
}

/** The time an errand can be done in, drawn faintly behind the driver's trips. */
export interface WindowBox extends Box {
  label: string;
}

export interface PrepBox extends Box {
  color: KidColor;
  label: string;
  layer?: number;
}

/** The time between a car box and its event, built on like the arrive-by strip: no label. */
export interface LinkBox extends Box {
  color: KidColor;
  layer?: number;
}

export interface Mark {
  key: string;
  x: number;
  y: number;
  text: string;
  /** Anchored at its right edge. */
  right: boolean;
}

export interface DayHead {
  date: string;
  y: number;
  /** "Tuesday, November 3". */
  label: string;
  /** "Today", "Tomorrow" or "". */
  tag: string;
  sub: string;
  warn: boolean;
  /** The whole heading's height: the date line, then the all-day row glued under it. */
  h: number;
  /** The all-day row: all-day events, and timed ones for nobody. Floats with the date line. */
  allDay: AllDayChip[];
}

/** The heading's height for the day at ``t`` minutes into the week. */
export function headAt(board: Board, t: number): number {
  return board.dayHeads[Math.max(0, Math.floor(t / 1440))]?.h ?? DAY_HEAD;
}

/** One piece of the thin row across the top of a day: an all-day event, or a timed one for nobody. */
export interface AllDayChip {
  key: string;
  title: string;
  /** "Day 2 of 4", or what's wrong with an event for nobody. */
  note: string;
  /** The colour of the first person its title names, or null for nobody's. */
  color: KidColor | null;
  cancelled: boolean;
  /** A timed event whose title doesn't say who it's for. */
  warn: boolean;
}

export interface AllDayRow {
  key: string;
  /** The chips' height, without the space under them. */
  h: number;
  chips: AllDayChip[];
}

export const ALL_DAY_LINE = 26;
/** Between wrapped lines of chips, and under the last line. */
export const ALL_DAY_GAP = 4;

export interface Board {
  mode: Mode;
  width: number;
  height: number;
  columns: Column[];
  /** Between the kids' columns and the drivers'. */
  sepX: number;
  dayHeads: DayHead[];
  /** Each day's all-day row, under its heading. Days with nothing all day have none. */
  empties: { key: string; y: number; text: string }[];
  grid: { key: string; y: number; strong: boolean }[];
  hours: { key: string; y: number; label: string }[];
  cards: CardBox[];
  rides: RideBox[];
  bands: BandBox[];
  trips: TripBox[];
  stays: StayBox[];
  busy: BusyBox[];
  windows: WindowBox[];
  links: LinkBox[];
  preps: PrepBox[];
  overlaps: Box[];
  marks: Mark[];
  now: { y: number; label: string } | null;
  /** Maps between absolute time (day index * 1440 + minutes) and y, for keeping the place on a mode switch. */
  anchors: { t: number; y: number }[];
}

export interface Today {
  date: string;
  minutes: number;
}

/** The narrowest the board gets before it scrolls sideways. */
export function minWidth(kids: number, drivers: number): number {
  const unit = Math.max(MIN_KID, MIN_DRIVER / DRIVER_SHARE);
  return Math.ceil(
    GUTTER +
      Math.max(0, kids - 1) * KID_GAP +
      SEP +
      Math.max(0, drivers - 1) * DRIVER_GAP +
      unit * (kids + DRIVER_SHARE * drivers),
  );
}

export function kidIds(plan: Plan): string[] {
  if (plan.people) return plan.people.kids.map((k) => k.id);
  return plan.days.length ? Object.keys(plan.days[0]!.kids) : [];
}

export function driverIds(plan: Plan): string[] {
  if (plan.people) return plan.people.drivers.map((d) => d.id);
  return plan.days.length ? Object.keys(plan.days[0]!.drivers) : [];
}

export function kidColors(plan: Plan): Map<string, KidColor> {
  return new Map(kidIds(plan).map((k, i) => [k, kidColor(i)]));
}

export function kidName(plan: Plan, kid: string): string {
  const p = plan.people?.kids.find((k) => k.id === kid);
  if (p) return p.name;
  for (const d of plan.days) if (d.kids[kid]) return d.kids[kid]!.name;
  return kid;
}

export function driverName(plan: Plan, driver: string): string {
  const p = plan.people?.drivers.find((d) => d.id === driver);
  if (p) return p.name;
  for (const d of plan.days) if (d.drivers[driver]) return d.drivers[driver]!.name;
  return driver;
}

/** A name for any driver value: a routed driver's name, or the carpool name as written. */
export function whoName(plan: Plan, value: string): string {
  if (value === "none") return "Not needed";
  return driverIds(plan).includes(value) ? driverName(plan, value) : value;
}

/** Whose event it is: the kid's name, or the parent's on their own event. */
/** When an event is on this day. Busy time over more than a day says only this day's part. */
export function spanText(e: PlanEvent): string {
  if (e.busy_why === "days") {
    if (e.start <= 0 && e.end >= 1440) return "All day";
    if (e.start <= 0) return `Until ${clock(e.end)}`;
    if (e.end >= 1440) return `From ${clock(e.start)}`;
  }
  return `${clock(e.start)}–${clock(e.end)}`;
}

export function ownerName(plan: Plan, e: PlanEvent): string {
  return e.own ? driverName(plan, e.own) : kidName(plan, e.kid);
}

/** A parent's own event is drawn in the drivers' dark ink, not a kid's color. */
export const OWN_COLOR: KidColor = { color: DRIVER_DOT, rgb: DRIVER_RGB, ink: DRIVER_DOT };

/** The color for an event: its kid's, or the drivers' ink on a parent's own event. */
export function eventColor(plan: Plan, e: PlanEvent): KidColor {
  return e.own ? OWN_COLOR : (kidColors(plan).get(e.kid) ?? kidColor(0));
}

/** "Golf with Ben and Robin": everyone going along to a parent's own event. */
function alongNames(plan: Plan, e: PlanEvent): string[] {
  const kids = kidIds(plan);
  return e.along.map((a) => (kids.includes(a) ? kidName(plan, a) : driverName(plan, a)));
}

/** "Ben and Robin", "Ava, Ben and Robin". */
export function andList(names: string[]): string {
  if (names.length < 2) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** Short names for every place in the plan, by place key. */
export function placeNames(plan: Plan): Map<string, string> {
  const names = new Map<string, string>([["home", "Home"]]);
  for (const d of plan.days) for (const e of d.events) names.set(e.place, e.short_place || e.place_name || e.place);
  return names;
}

function shortOf(names: Map<string, string>, loc: string | null): string {
  if (!loc) return "";
  return names.get(loc) ?? (loc.split(",")[0]?.trim() || loc);
}

/** "Home → Piano → Soccer (wait)". */
export function routeOf(legs: Segment[], names: Map<string, string>): string[] {
  const places: string[] = [];
  for (const g of legs) {
    if (g.type === "drive") {
      if (!places.length) places.push(shortOf(names, g.from));
      places.push(shortOf(names, g.to));
    } else if (g.type === "wait" || g.type === "stay") {
      if (!places.length) places.push(shortOf(names, g.place));
      if (g.type === "wait" && !places[places.length - 1]!.endsWith("(wait)")) places[places.length - 1] += " (wait)";
    }
  }
  return places;
}

interface Packed<T> {
  item: T;
  s: number;
  en: number;
  col: number;
  cols: number;
}

/** Calendar-style packing: overlapping items in one column sit side by side. */
export function pack<T>(items: { item: T; s: number; en: number }[]): Packed<T>[] {
  const sorted = items.map((x) => ({ ...x, col: 0, cols: 1 })).sort((a, b) => a.s - b.s || b.en - a.en);
  let cluster: Packed<T>[] = [];
  let colsEnd: number[] = [];
  let clusterEnd = -Infinity;
  const flush = (): void => {
    for (const it of cluster) it.cols = colsEnd.length;
    cluster = [];
    colsEnd = [];
  };
  for (const it of sorted) {
    if (it.s >= clusterEnd) {
      flush();
      clusterEnd = -Infinity;
    }
    let c = colsEnd.findIndex((end) => end <= it.s);
    if (c < 0) {
      c = colsEnd.length;
      colsEnd.push(it.en);
    } else colsEnd[c] = it.en;
    it.col = c;
    cluster.push(it);
    clusterEnd = Math.max(clusterEnd, it.en);
  }
  flush();
  return sorted;
}

function anchorY(anchors: { t: number; y: number }[], t: number): number {
  if (!anchors.length) return 0;
  if (t <= anchors[0]!.t) return anchors[0]!.y;
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i]!;
    const b = anchors[i + 1]!;
    if (t <= b.t) return b.t === a.t ? a.y : Math.round(a.y + ((t - a.t) / (b.t - a.t)) * (b.y - a.y));
  }
  return anchors[anchors.length - 1]!.y;
}

function anchorT(anchors: { t: number; y: number }[], y: number): number {
  if (!anchors.length) return 0;
  if (y <= anchors[0]!.y) return anchors[0]!.t;
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i]!;
    const b = anchors[i + 1]!;
    if (y <= b.y) return b.y === a.y ? a.t : a.t + ((y - a.y) / (b.y - a.y)) * (b.t - a.t);
  }
  return anchors[anchors.length - 1]!.t;
}

/** The y of a moment on the board (day index * 1440 + minutes). */
export function yAt(board: Board, t: number): number {
  return anchorY(board.anchors, t);
}

/** The moment at a y on the board. */
export function tAt(board: Board, y: number): number {
  return anchorT(board.anchors, y);
}

export function columnsFor(plan: Plan, width: number): { columns: Column[]; sepX: number; width: number } {
  const kids = kidIds(plan);
  const drivers = driverIds(plan);
  const w = Math.max(width, minWidth(kids.length, drivers.length));
  const avail =
    w - GUTTER - Math.max(0, kids.length - 1) * KID_GAP - SEP - Math.max(0, drivers.length - 1) * DRIVER_GAP;
  const unit = avail / (kids.length + DRIVER_SHARE * drivers.length || 1);
  const kidW = Math.floor(unit);
  const driverW = Math.floor(unit * DRIVER_SHARE);

  // The week's totals count what's over too; only "Needs a ride" is about what's still to come.
  const week = plan.whole_week ?? plan.days;
  const weekEvents = new Map<string, PlanEvent[]>();
  for (const d of week) {
    for (const e of d.events) {
      for (const who of e.own ? e.along : [e.kid]) {
        const list = weekEvents.get(who) ?? [];
        // A long event shows on two days: count it once.
        if (!list.some((x) => x.event_id === e.event_id && x.calendar_id === e.calendar_id)) list.push(e);
        weekEvents.set(who, list);
      }
    }
  }
  const colors = kidColors(plan);
  const columns: Column[] = [];
  let x = GUTTER;
  kids.forEach((k, i) => {
    const evs = weekEvents.get(k) ?? [];
    const missing = plan.days.some((d) =>
      d.events.some(
        (e) => e.kid === k && ((e.sides.includes("drop") && e.drop === "") || (e.sides.includes("pick") && e.pick === "")),
      ),
    );
    columns.push({
      id: k,
      kind: "kid",
      x,
      w: kidW,
      name: kidName(plan, k),
      dot: colors.get(k)!.color,
      rgb: colors.get(k)!.rgb,
      sub: `${missing ? "Needs a ride · " : ""}${evs.length} this week`,
      subWarn: missing,
    });
    x += kidW + (i < kids.length - 1 ? KID_GAP : 0);
  });
  const sepX = x + SEP / 2;
  x += SEP;
  drivers.forEach((d, i) => {
    let trips = 0;
    let mins = 0;
    for (const day of week) {
      const dd = day.drivers[d];
      if (!dd) continue;
      trips += dd.outings.length;
      mins += dd.drive ?? 0;
    }
    columns.push({
      id: d,
      kind: "driver",
      x,
      w: driverW,
      name: driverName(plan, d),
      dot: DRIVER_DOT,
      rgb: DRIVER_RGB,
      sub: `${trips} ${trips === 1 ? "trip" : "trips"} this week · ${duration(mins)} driving`,
      subWarn: false,
    });
    x += driverW + (i < drivers.length - 1 ? DRIVER_GAP : 0);
  });
  return { columns, sepX, width: w };
}

/** "Ava Tap" in Ava's column is just "Tap". Leaves the title alone when that's all there is. */
export function shortTitle(title: string, kid: string): string {
  const t = title.trim();
  if (!kid || t.length <= kid.length) return t;
  const head = t.slice(0, kid.length);
  if (head.localeCompare(kid, undefined, { sensitivity: "accent" }) !== 0) return t;
  const rest = t.slice(kid.length);
  const m = /^(?:’s|'s)?\s*[-–—:·]?\s+/u.exec(rest);
  if (!m) return t;
  const out = rest.slice(m[0].length);
  return out ? out[0]!.toUpperCase() + out.slice(1) : t;
}

/**
 * A busy block's label. A trip away spans days: the middle days are "all day", the first says
 * when it starts, the last when it ends. Otherwise Timeline gives the end ("Work until 4:40",
 * the start is on the clock) and Compact the whole range.
 */
export function busyLabel(b: { start: number; end: number; title: string }, range: boolean): string {
  const fromBefore = b.start <= 0;
  const pastMidnight = b.end >= 1440;
  if (fromBefore && pastMidnight) return `${b.title} · all day`;
  if (pastMidnight) return `${b.title} from ${clock(b.start)}`;
  if (fromBefore || !range) return `${b.title} until ${clock(b.end)}`;
  return `${b.title} ${clock(b.start)}–${clock(b.end)}`;
}

/** How many problems a day has: issues to fix plus double-bookings. */
export function problemCount(day: PlanDay): number {
  return day.issues.filter((i) => i.level === "problem").length + day.clashes.length + (day.unplaced?.length ?? 0);
}

export function dayTag(date: string, today: string): string {
  const n = daysBetween(today, date);
  if (n === 0) return "Today";
  if (n === 1) return "Tomorrow";
  return "";
}

function n(v: number | null | undefined, fallback = 0): number {
  return v == null || !Number.isFinite(v) ? fallback : v;
}

/** How many lines a text takes when it wraps at spaces, at about `charW` pixels a character. */
export function wrapRows(text: string, width: number, charW = 7): number {
  const per = Math.max(8, Math.floor(width / charW));
  let rows = 1;
  let used = 0;
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const len = word.length;
    if (used === 0) used = len;
    else if (used + 1 + len <= per) used += 1 + len;
    else {
      rows++;
      used = len;
    }
    while (used > per) {
      rows++;
      used -= per;
    }
  }
  return rows;
}

/** A car box: 3px padding and 1.5px border top and bottom, a 15px first line, 1px gap, 15px lines. */
const RIDE_CHROME = 9 + 15 + 1;
const RIDE_LINE = 15;
const RIDE_MAX_LINES = 3;

/** Lines of route that fit in a car box this tall, so none is cut in half. */
export function rideLines(h: number): number {
  return Math.max(0, Math.min(RIDE_MAX_LINES, Math.floor((h - RIDE_CHROME) / RIDE_LINE)));
}

/** A Compact "along with" box: one line, on its driver's trip's row. */
const ALONG_H = RIDE_CHROME + 2;
/** How much lower each later start time's row begins, at least. */
const ROW_STEP = 20;

/** The time a trip's last stop line says it's home ("6:01  Home"), or null. */
function homeAt(lines: string[]): string | null {
  return /^(\d+:\d\d)\s+Home$/.exec(lines.at(-1) ?? "")?.[1] ?? null;
}


const CAR = "🚗";

type RideBit = { who: string; at: string; stays: boolean; extra: string };

/** A card's ride line, read back into its parts, or null when it isn't one we can shorten. */
function rideBit(text: string, side: "drop" | "pick"): RideBit | "needed" | null {
  if (text === (side === "drop" ? "No ride there yet" : "No ride home yet")) return "needed";
  const bit = (at: string, who: string, extra: string | undefined, stays = false): RideBit => ({
    at,
    who,
    stays,
    extra: extra ? ` ·${extra.slice(1)}` : "",
  });
  let m: RegExpExecArray | null;
  if (side === "drop") {
    if ((m = /^Leaves (\d+:\d\d) with (.+?)(, .+)?$/.exec(text))) return bit(m[1]!, m[2]!, m[3]);
    if ((m = /^(.+?) stays · leaves (\d+:\d\d)(, .+)?$/.exec(text))) return bit(m[2]!, m[1]!, m[3], true);
    if ((m = /^(?:Drop-off: |Goes with )(.+?)(, .+)?$/.exec(text))) return bit("", m[1]!, m[2]);
  } else {
    if ((m = /^(?:Home (\d+:\d\d) with|Picked up (\d+:\d\d) by) (.+?)(, .+)?$/.exec(text))) return bit(m[1] ?? m[2]!, m[3]!, m[4]);
    if ((m = /^(?:Pick-up: |Home with )(.+?)(, .+)?$/.exec(text))) return bit("", m[1]!, m[2]);
  }
  return null;
}

const TONE_RANK: Record<string, number> = { muted: 0, normal: 1, pending: 2, problem: 3 };

/**
 * A card's ride lines, shortened for Compact into one line: a car, then ↓ for the drop-off and
 * ↑ for the pick-up, each with its time and driver ("🚗 Sam ↓4:25 ↑6:10" when it's the same
 * driver both ways). Two rides still needed are "🚗 No rides yet". Lines that aren't rides stay
 * as they are.
 */
export function compactLines(lines: { drop: CardLine | null; pick: CardLine | null }): {
  drop: CardLine | null;
  pick: CardLine | null;
} {
  const { drop, pick } = lines;
  const d = drop ? rideBit(drop.text, "drop") : null;
  const p = pick ? rideBit(pick.text, "pick") : null;
  // Something that isn't a ride line (no ride needed, at home) stays as it is.
  if ((drop && !d) || (pick && !p) || (!d && !p)) return lines;
  const tone = [drop, pick].reduce<CardLine["tone"]>(
    (t, l) => (l && (TONE_RANK[l.tone] ?? 1) > (TONE_RANK[t] ?? 1) ? l.tone : t),
    (drop ?? pick)!.tone,
  );
  if (d === "needed" && p === "needed") return { drop: { text: `${CAR} No rides yet`, tone }, pick: null };
  if (d && p && d !== "needed" && p !== "needed" && d.who === p.who && !d.extra && !p.extra) {
    const who = `${CAR} ${d.who}${d.stays ? " stays" : ""}`;
    if (!d.at && !p.at) return { drop: { text: `${who} both ways`, tone }, pick: null };
    return { drop: { text: `${who} ↓${d.at} ↑${p.at}`.trimEnd(), tone }, pick: null };
  }
  const part = (b: RideBit | "needed", arrow: string): string =>
    b === "needed" ? `${arrow} needed` : `${arrow}${b.at ? `${b.at} ` : " "}${b.who}${b.stays ? " stays" : ""}${b.extra}`;
  const parts = [d ? part(d, "↓") : null, p ? part(p, "↑") : null].filter(Boolean);
  return { drop: { text: `${CAR} ${parts.join(" · ")}`, tone }, pick: null };
}

/** A Compact card's height: everything on it shows, wrapped. */
export function compactCardHeight(e: PlanEvent, colW: number): number {
  const inner = colW - 23; // padding, the color stripe and the border
  const time = `${clock(e.start)}–${clock(e.end)}` + (e.arrive_by != null ? ` · arrive ${clock(e.arrive_by)}` : "");
  let h = 15 + 18 + wrapRows(time, inner, 6.6) * 16;
  const ln = e.own ? e.lines : compactLines(e.lines);
  for (const l of [ln.drop, ln.pick]) if (l) h += 2 + wrapRows(l.text, inner, 7) * 16;
  return h + 4;
}

export function layout(plan: Plan, mode: Mode, width: number, today: Today): Board {
  const compact = mode === "compact";
  const { columns, sepX, width: w } = columnsFor(plan, width);
  const col = new Map(columns.map((c) => [c.id, c]));
  const kids = kidIds(plan);
  const drivers = driverIds(plan);
  const order = [...kids, ...drivers];
  const colors = kidColors(plan);
  const names = placeNames(plan);
  const nameOfKid = (k: string): string => kidName(plan, k);
  const nameOfDriver = (d: string): string => driverName(plan, d);

  const board: Board = {
    mode,
    width: w,
    height: 0,
    columns,
    sepX,
    dayHeads: [],
    empties: [],
    grid: [],
    hours: [],
    cards: [],
    rides: [],
    bands: [],
    trips: [],
    stays: [],
    busy: [],
    windows: [],
    links: [],
    preps: [],
    overlaps: [],
    marks: [],
    now: null,
    anchors: [],
  };

  let y = 0;
  plan.days.forEach((day, di) => {
    const base = di * 1440;
    const events = new Map(day.events.map((e) => [e.id, e]));
    const target = (id: string | null | undefined): Target | null => (id && events.has(id) ? { day: day.date, event: id } : null);
    const problems = problemCount(day);
    const count = day.events.length;
    const tag = dayTag(day.date, today.date);
    const strip = allDayRow(plan, day, colors, w);
    board.dayHeads.push({
      date: day.date,
      y,
      label: dayLabel(day.date),
      tag,
      sub:
        (count
          ? `${count} ${count === 1 ? "activity" : "activities"}${day.done ? " left" : ""}`
          : day.done
            ? "All done for today"
            : "Nothing scheduled") + (problems ? ` · ${problems} to sort out` : ""),
      warn: problems > 0,
      h: DAY_HEAD + (strip ? strip.h + ALL_DAY_GAP + 2 : 0),
      allDay: strip?.chips ?? [],
    });
    board.anchors.push({ t: base, y });
    const head = board.dayHeads[board.dayHeads.length - 1]!;
    const top = y + head.h + PAD;

    const outings = drivers.flatMap((d) => day.drivers[d]?.outings ?? []);
    if (!count && !outings.length) {
      board.empties.push({ key: day.date, y: top, text: day.done ? "Nothing else today" : "Nothing planned" });
      y = top + 40;
      board.anchors.push({ t: base + 1439, y });
      return;
    }

    // A card in one column: a kid's activity, a parent's own event in their column, or that
    // event again in the column of each kid who goes along.
    const cardFor = (
      e: PlanEvent,
      x: number,
      cy: number,
      cw: number,
      h: number,
      clash: boolean,
      wrap: boolean,
      colId: string = e.kid,
    ): CardBox => {
      const mine = !!e.own && colId === e.own;
      const along = !!e.own && colId !== e.own;
      const c = mine ? OWN_COLOR : (colors.get(colId) ?? kidColor(0));
      const who = mine ? nameOfDriver(colId) : nameOfKid(colId);
      const ln: { drop: CardLine | null; pick: CardLine | null } = along
        ? { drop: { text: `With ${nameOfDriver(e.own!)}`, tone: e.attending === false ? "muted" : "normal" }, pick: null }
        : wrap && !e.own
          ? compactLines(e.lines)
          : e.lines;
      const going = mine ? alongNames(plan, e) : [];
      const time =
        (e.takes != null
          ? `${e.takes} min, any time ${clock(e.start)}–${clock(e.end)}`
          : spanText(e) + (e.arrive_by != null ? ` · arrive ${clock(e.arrive_by)}` : "")) +
        (going.length ? ` · with ${andList(going)}` : "");
      return {
        key: `${day.date}|card|${e.id}` + (e.own ? `|${colId}` : ""),
        x,
        y: cy,
        w: cw,
        h,
        target: { day: day.date, event: e.id },
        event: e,
        color: c,
        kidName: who,
        clash,
        stayed: !e.own && e.stay && drivers.includes(e.drop),
        skipped: e.attending === false,
        title: shortTitle(e.title, who),
        time,
        drop: ln.drop,
        pick: ln.pick,
        showDrop: !!ln.drop && (wrap || h >= 56),
        showPick: !!ln.pick && (wrap || h >= 74),
        wrap,
        aria:
          `${who}, ${e.title} ${e.takes != null ? `any time from ${clock(e.start)} to ${clock(e.end)}` : spanText(e).replace("–", " to ")}. ` +
          (e.attending === false && !ln.drop ? "Not attending. " : "") +
          [ln.drop, ln.pick]
            .filter((l): l is CardLine => !!l)
            .map((l) => l.text)
            .join(". "),
      };
    };

    // Each ride's legs: the driver's segments while the kid is in the car.
    const legsOf = (rideIndex: number): Segment[] => {
      const r = day.rides[rideIndex];
      if (!r) return [];
      const segs = day.drivers[r.driver]?.segments ?? [];
      return segs.filter(
        (g) => g.type !== "home" && g.kids.includes(r.kid) && n(g.start) >= n(r.start) && n(g.end) <= n(r.end),
      );
    };
    const rideTarget = (rideIndex: number): Target | null => {
      const r = day.rides[rideIndex];
      if (!r) return null;
      const own = r.serves.find((id) => events.get(id)?.kid === r.kid);
      return target(own ?? r.serves[0]);
    };

    // A busy block that's a ride along to the other parent's own event says whose it is.
    const busyOf = (d: string, b: BusyBlock): BusyBlock => {
      if (b.event) return b;
      const host = day.events.find((e) => e.own && e.own !== d && e.along.includes(d) && e.title === b.title);
      return host ? { ...b, title: `${b.title} with ${nameOfDriver(host.own!)}` } : b;
    };
    // A parent's own event: a card in their column. An errand sits at the time it was fitted in.
    const ownSpan = (e: PlanEvent): [number, number] => {
      if (e.takes == null) return [e.start, e.end];
      const at = e.planned ?? e.start;
      return [at, at + e.takes];
    };

    const issueMarks = new Map<string, string>();
    for (const x of day.issues) {
      if (x.level !== "problem" || !x.event) continue;
      if (x.kind === "late") issueMarks.set(x.event, `${Math.round(n(x.minutes))} min late`);
      if (x.kind === "waiting") issueMarks.set(`${x.event}|pick`, `Waits ${Math.round(n(x.minutes))} min`);
    }

    if (!compact) {
      let lo = Infinity;
      let hi = -Infinity;
      for (const e of day.events) {
        // Something running in from the day before or on past midnight (a sleepover, say) only
        // shows its edge inside the day, so the hours shown don't stretch to midnight for it.
        if (e.start <= 0 && e.end >= 1440) continue;
        if (e.start > 0) lo = Math.min(lo, e.start - 20, e.arrive_by != null ? e.arrive_by - 10 : Infinity);
        else lo = Math.min(lo, e.end - 30);
        if (e.end < 1440) hi = Math.max(hi, e.end + 20);
        else hi = Math.max(hi, e.start + 30);
      }
      for (const o of outings) {
        if (o.start != null) lo = Math.min(lo, o.start);
        if (o.end != null) hi = Math.max(hi, o.end);
      }
      // With what's over left off, today starts just before now: whatever is under way runs in
      // from the top, cut off where the time before is over.
      const from = day.from;
      if (from != null && Number.isFinite(lo) && lo < from + 60) lo = from - 15;
      else if (day.date === today.date && Number.isFinite(lo) && today.minutes > lo - 60 && today.minutes < hi) {
        lo = Math.min(lo, today.minutes - 15);
      }
      const r0 = Number.isFinite(lo) ? Math.floor((lo - 5) / 30) * 30 : 900;
      const r1 = Math.max(Number.isFinite(hi) ? Math.ceil((hi + 5) / 30) * 30 : 960, r0 + 60);
      // Still on the board but over before the top (an event whose trip home is still going).
      const above = (end: number | null | undefined): boolean => from != null && n(end) <= r0;
      const cut = (start: number | null | undefined): boolean => from != null && n(start) < r0;
      const Y = (t: number): number => Math.round(top + (Math.max(r0, Math.min(r1, t)) - r0) * PPM);
      board.anchors.push({ t: base + r0, y: Y(r0) }, { t: base + r1, y: Y(r1) });

      for (const kid of kids) {
        const c = col.get(kid)!;
        const color = colors.get(kid)!;
        const items: { item: KidItem; s: number; en: number }[] = (day.kids[kid]?.items ?? [])
          .filter((it) => it.start != null && it.end != null && !above(it.end))
          .map((it) => ({ item: it, s: n(it.start), en: n(it.end) }));
        // What's drawn in this column, to join each car box to whatever it's going to.
        type Piece = {
          s: number;
          en: number;
          top: number;
          bottom: number;
          x: number;
          w: number;
          ride?: RideBox;
          band?: BandBox | null;
          prep?: PrepBox;
          card?: CardBox;
        };
        const pieces: Piece[] = [];
        for (const p of pack(items)) {
          const cw = c.w / p.cols;
          const ix = Math.round(c.x + p.col * cw);
          const iw = Math.round(cw - (p.cols > 1 ? 4 : 0));
          const y0 = Y(p.s);
          const it = p.item;
          if (it.type === "act") {
            const e = events.get(it.event ?? "");
            if (!e) continue;
            const h = Math.max(30, Y(p.en) - y0);
            const card = cardFor(e, ix, y0, iw, h, it.clash, false, kid);
            card.layer = MAIN_LAYER;
            card.cut = cut(p.s);
            board.cards.push(card);
            if (e.arrive_by != null && e.start - e.arrive_by >= 5 && !card.cut) {
              const py = Y(e.arrive_by);
              const prep: PrepBox = {
                key: `${day.date}|prep|${e.id}`,
                x: ix,
                y: py,
                w: iw,
                h: y0 - py + LINK_TUCK,
                color,
                label: `Arrive by ${clock(e.arrive_by)}`,
                layer: MAIN_LAYER - 1,
              };
              board.preps.push(prep);
              pieces.push({ s: e.arrive_by, en: p.en, top: py, bottom: y0 + h, x: ix, w: iw, prep, card });
            } else {
              pieces.push({ s: p.s, en: p.en, top: y0, bottom: y0 + h, x: ix, w: iw, card });
            }
            const late = issueMarks.get(e.id);
            if (late) board.marks.push({ key: `${day.date}|late|${e.id}`, x: ix + iw - 4, y: y0 + 4, text: late, right: true });
            const waits = issueMarks.get(`${e.id}|pick`);
            if (waits) board.marks.push({ key: `${day.date}|wait|${e.id}`, x: ix + 4, y: y0 + h + 2, text: waits, right: false });
            continue;
          }
          const ride = day.rides[it.ride ?? -1];
          if (!ride) continue;
          const rh = Math.max(22, Y(p.en) - y0);
          const route = routeOf(legsOf(ride.index), names);
          const who = nameOfDriver(ride.driver);
          const rideBox: RideBox = {
            key: `${day.date}|ride|${ride.index}`,
            x: ix,
            y: y0,
            w: iw,
            h: rh,
            target: rideTarget(ride.index),
            l1: `${ride.own ? "In" : "Along in"} ${who}’s car`,
            l2: route.join(" → "),
            show2: rideLines(rh) > 0,
            lines2: rideLines(rh),
            dashed: !ride.own,
            clash: it.clash,
            aria: `${nameOfKid(kid)} ${ride.own ? "in" : "riding along in"} ${who}’s car, ${clock(n(ride.start))} to ${clock(n(ride.end))}: ${route.join(" to ")}`,
          };
          board.rides.push(rideBox);
          const dc = col.get(ride.driver);
          let band: BandBox | null = null;
          if (dc) {
            band = {
              key: `${day.date}|band|${ride.index}`,
              x: ix + iw,
              y: y0,
              w: Math.max(0, dc.x + 8 - (ix + iw)),
              h: rh,
              color,
            };
            board.bands.push(band);
          }
          pieces.push({ s: p.s, en: p.en, top: y0, bottom: y0 + rh, x: ix, w: iw, ride: rideBox, band });
        }
        // Car boxes are add-ons to the activity they're for, stacked like cards: the drive there
        // (and any ride before it) tucks behind what comes next, the drive home tucks behind the
        // activity, and the time between is an unlabeled block built on the same way, like the
        // arrive-by strip. Each piece keeps its own size; only its tucked edge hides behind.
        const front = (q: Piece): number => q.ride?.layer ?? (q.prep ? MAIN_LAYER - 1 : MAIN_LAYER);
        const link = (ride: RideBox, y: number, h: number, layer: number): void => {
          if (h > LINK_TUCK) board.links.push({ key: `${ride.key}|link`, x: ride.x, y, w: ride.w, h, color, layer });
        };
        // A built-on piece is as wide as what it's built onto; its link to the driver follows its edge.
        // It only ever narrows into its own lane, so it can't spread over a box beside it.
        const fit = (r: Piece, to: Piece): void => {
          if (to.x < r.x || to.x + to.w > r.x + r.w) return;
          r.x = to.x;
          r.w = to.w;
          r.ride!.x = to.x;
          r.ride!.w = to.w;
          if (r.band) {
            const right = r.band.x + r.band.w;
            r.band.x = to.x + to.w;
            r.band.w = Math.max(0, right - r.band.x);
          }
        };
        const going = new Set<Piece>();
        // Latest first, so each piece's own place in its stack is known before what's behind it.
        for (const r of [...pieces].sort((a, b) => b.s - a.s)) {
          const ride = r.ride;
          if (!ride) continue;
          const next = pieces
            .filter((q) => q !== r && q.s >= r.en && q.s - r.en <= JOIN_MINUTES && q.top >= r.bottom)
            .sort((a, b) => a.s - b.s || a.top - b.top)[0];
          if (!next) continue;
          going.add(r);
          fit(r, next);
          const layer = front(next);
          const gap = next.top - r.bottom;
          link(ride, r.bottom, gap + LINK_TUCK, layer - 1);
          ride.layer = layer - (gap > 0 ? 2 : 1);
          ride.h += LINK_TUCK;
          ride.tuckBottom = LINK_TUCK;
        }
        for (const r of [...pieces].sort((a, b) => a.s - b.s)) {
          const ride = r.ride;
          if (!ride || going.has(r)) continue;
          const prev = pieces
            .filter((q) => q !== r && q.en <= r.s && r.s - q.en <= JOIN_MINUTES && q.bottom <= r.top && (q.card || q.ride?.layer != null))
            .sort((a, b) => b.en - a.en || b.bottom - a.bottom)[0];
          if (!prev) continue;
          fit(r, prev);
          const layer = prev.ride?.layer ?? MAIN_LAYER;
          const gap = r.top - prev.bottom;
          link(ride, prev.bottom - LINK_TUCK, gap + LINK_TUCK, layer - 1);
          ride.layer = layer - (gap > 0 ? 2 : 1);
          ride.y -= LINK_TUCK;
          ride.h += LINK_TUCK;
          ride.tuckTop = LINK_TUCK;
        }
      }

      for (const d of drivers) {
        const c = col.get(d)!;
        const dd = day.drivers[d];
        if (!dd) continue;
        // A stay is its own box, so it breaks the trip there.
        type Piece = { type: "trip"; s: number; en: number; legs: Segment[] } | { type: "stay"; g: Segment; s: number; en: number };
        const pieces: Piece[] = [];
        let cur: Extract<Piece, { type: "trip" }> | null = null;
        for (const g of dd.segments) {
          if (g.start == null || g.end == null) continue;
          if (g.type === "home") {
            cur = null;
            continue;
          }
          if (g.type === "stay") {
            cur = null;
            pieces.push({ type: "stay", g, s: g.start, en: g.end });
            continue;
          }
          if (cur && cur.en === g.start) {
            cur.en = g.end;
            cur.legs.push(g);
          } else {
            cur = { type: "trip", s: g.start, en: g.end, legs: [g] };
            pieces.push(cur);
          }
        }
        const drawn = new Set<string>();
        const ownCard = (e: PlanEvent, s: number, en: number, onTrip: boolean): void => {
          drawn.add(e.id);
          const y0 = Y(s);
          const card = cardFor(e, c.x + 8, y0, c.w - 16, Math.max(30, Y(en) - y0), false, false, d);
          card.cut = cut(s);
          // The trip box just above already says when they leave.
          if (onTrip && card.drop?.tone === "normal") {
            card.drop = null;
            card.showDrop = false;
          }
          board.cards.push(card);
        };
        for (const piece of pieces) {
          if (above(piece.en)) continue;
          const y0 = Y(piece.s);
          const h = Math.max(24, Y(piece.en) - y0);
          if (piece.type === "stay") {
            const e = events.get(piece.g.event ?? piece.g.serves ?? "");
            if (e?.own === d) {
              // Their own event: the trip there and back attach to its card.
              ownCard(e, piece.s, piece.en, true);
              continue;
            }
            const color = e ? colors.get(e.kid) ?? kidColor(0) : kidColor(0);
            const others = piece.g.kids.map(nameOfKid);
            board.stays.push({
              cut: cut(piece.s),
              key: `${day.date}|stay|${d}|${piece.s}`,
              x: c.x + 8,
              y: y0,
              w: c.w - 16,
              h,
              target: target(e?.id),
              color,
              l1: e ? `At ${e.title} with ${nameOfKid(e.kid)}` : "Staying",
              l2: `until ${clock(piece.en)}` + (others.length ? ` · ${others.join(" and ")} too` : ""),
            });
            continue;
          }
          const first = piece.legs[0]!;
          const last = piece.legs[piece.legs.length - 1]!;
          const kidsIn: string[] = [];
          for (const g of piece.legs) for (const k of g.kids) if (!kidsIn.includes(k)) kidsIn.push(k);
          const home = last.type === "drive" && last.to === "home";
          const route = routeOf(piece.legs, names);
          board.trips.push({
            key: `${day.date}|trip|${d}|${piece.s}`,
            x: c.x + 8,
            y: y0,
            w: c.w - 16,
            h,
            target: target(piece.legs.find((g) => g.serves)?.serves),
            l1:
              first.type === "drive" && first.from === "home"
                ? `Leave ${clock(piece.s)}`
                : `From ${shortOf(names, first.from ?? first.place)} ${clock(piece.s)}`,
            l2: route.join(" → "),
            show2: h >= 36,
            l3: home ? `Home ${clock(piece.en)}` : "",
            show3: home && h >= 62,
            stops: null,
            kids: kidsIn.map((k) => (colors.get(k) ?? kidColor(0)).color),
            bad: piece.legs.some((g) => g.overlaps_busy),
            aria: `${nameOfDriver(d)} drives ${route.join(" to ")}, ${clock(piece.s)} to ${clock(piece.en)}`,
          });
        }
        for (const g of dd.segments) {
          if (!g.overlaps_busy || g.start == null || g.end == null) continue;
          for (const b of dd.busy) {
            const s = Math.max(g.start, b.start);
            const en = Math.min(g.end, b.end);
            if (en <= s || above(en)) continue;
            board.overlaps.push({
              key: `${day.date}|overlap|${d}|${s}`,
              x: c.x + 6,
              y: Y(s) - 2,
              w: c.w - 12,
              h: Math.max(8, Y(en) - Y(s) + 4),
            });
          }
        }
        for (const e of day.events) {
          if (e.own !== d) continue;
          // Not going, or an errand that didn't fit: still on the board, to change it.
          if (!drawn.has(e.id) && !above(ownSpan(e)[1])) ownCard(e, ...ownSpan(e), false);
          if (e.takes != null && e.attending !== false && !above(e.end)) {
            const wy = Y(e.start);
            board.windows.push({
              key: `${day.date}|window|${e.id}`,
              x: c.x + 4,
              y: wy,
              w: c.w - 8,
              h: Math.max(24, Y(e.end) - wy),
              label: `${e.title} · any time ${clock(e.start)}–${clock(e.end)}`,
            });
          }
        }
        for (const raw of dd.busy) {
          // A parent's own event is drawn as its trip and card.
          if (raw.event || raw.end <= r0 || raw.start >= r1) continue;
          const b = busyOf(d, raw);
          const y0 = Y(b.start);
          const y1 = Y(b.end);
          board.busy.push({
            key: `${day.date}|busy|${d}|${b.start}`,
            x: c.x + 1,
            y: y0,
            w: c.w - 2,
            h: y1 - y0,
            labelY: 8,
            label: busyLabel(b, false),
          });
        }
      }

      let lastLabel = -Infinity;
      for (let t = r0; t <= r1; t += 30) {
        board.grid.push({ key: `${day.date}|grid|${t}`, y: Y(t), strong: t % 60 === 0 });
        if (t % 60 === 0 && Y(t) - lastLabel >= 22) {
          board.hours.push({ key: `${day.date}|hour|${t}`, y: Y(t) - 8, label: hourLabel(t) });
          lastLabel = Y(t);
        }
      }
      if (day.date === today.date && today.minutes > r0 && today.minutes < r1) {
        board.now = { y: Y(today.minutes), label: `Now ${clock(today.minutes)}` };
      }
      y = Y(r1) + PAD;
      return;
    }

    // Compact: no time scale, but it reads in time order. Things that start together share a
    // row; anything later starts lower, with its start time in the margin. A kid riding along
    // is on the same row as the driver's trip.
    type Item =
      | { col: string; s: number; h: number; kind: "act"; item: KidItem }
      | { col: string; s: number; h: number; kind: "along"; item: KidItem }
      | { col: string; s: number; h: number; kind: "busy"; busy: BusyBlock }
      | { col: string; s: number; h: number; kind: "own"; event: PlanEvent }
      | { col: string; s: number; h: number; kind: "out"; out: (typeof outings)[number] };
    const items: Item[] = [];
    for (const kid of kids) {
      const c = col.get(kid)!;
      for (const it of day.kids[kid]?.items ?? []) {
        if (it.start == null) continue;
        if (it.type === "act") {
          const e = events.get(it.event ?? "");
          if (!e) continue;
          items.push({ col: kid, s: it.start, h: compactCardHeight(e, c.w), kind: "act", item: it });
        } else if (!day.rides[it.ride ?? -1]?.own) {
          const along = day.rides[it.ride ?? -1];
          const trip = along
            ? day.drivers[along.driver]?.outings.find((o) => o.start != null && o.start <= n(along.start) && n(along.start) <= n(o.end, o.start))
            : undefined;
          items.push({ col: kid, s: trip?.start ?? it.start, h: ALONG_H, kind: "along", item: it });
        }
      }
    }
    for (const d of drivers) {
      const dd = day.drivers[d];
      if (!dd) continue;
      for (const b of dd.busy) if (!b.event) items.push({ col: d, s: b.start, h: 32, kind: "busy", busy: busyOf(d, b) });
      // A parent's own event shows in their trip's stops. One with no trip (not going, or an
      // errand that didn't fit) gets a card, so it can still be changed.
      const cw = col.get(d)!.w;
      for (const e of day.events) {
        if (e.own !== d || (!e.busy_only && e.attending !== false && (e.takes == null || e.planned != null))) continue;
        items.push({ col: d, s: ownSpan(e)[0], h: compactCardHeight(e, cw), kind: "own", event: e });
      }
      for (const o of dd.outings) {
        if (o.start == null) continue;
        // Each stop wraps rather than getting cut off: the box is the column less its margins and padding.
        const lines = homeAt(o.lines) ? o.lines.slice(0, -1) : o.lines;
        const rows = [...lines, ...(o.warn ? [o.warn] : [])].reduce((n, t) => n + wrapRows(t, cw - 36, 7), 0);
        items.push({ col: d, s: o.start, h: 30 + rows * 16, kind: "out", out: o });
      }
    }
    items.sort((a, b) => a.s - b.s || order.indexOf(a.col) - order.indexOf(b.col));
    const bottom = new Map<string, number>();
    // Where each box landed, and the box itself when a long event can stretch to fill its time.
    const placed: { col: string; s: number; end: number | null; y: number; h: number; box: { h: number } | null }[] = [];
    // Each start time's row: below the row before, and below whatever is above in its columns.
    const rowTop = new Map<number, number>();
    let prevRow = top - ROW_STEP;
    for (let i = 0; i < items.length; ) {
      let j = i;
      let t = prevRow + ROW_STEP;
      for (; j < items.length && items[j]!.s === items[i]!.s; j++) {
        const below = bottom.get(items[j]!.col);
        if (below != null) t = Math.max(t, below + GAP);
      }
      const used = new Set<string>();
      for (let k = i; k < j; k++) {
        const m = items[k]!;
        // Two things in one column at the same time still stack.
        const iy = used.has(m.col) ? bottom.get(m.col)! + GAP : t;
        used.add(m.col);
        bottom.set(m.col, iy + m.h);
      }
      rowTop.set(items[i]!.s, t);
      if (items[i]!.s > 0) board.hours.push({ key: `${day.date}|hour|${items[i]!.s}`, y: t + 2, label: clockAmPm(items[i]!.s) });
      prevRow = t;
      i = j;
    }
    bottom.clear();
    items.forEach((m, i) => {
      const below = bottom.get(m.col);
      const iy = Math.max(below != null ? below + GAP : top, rowTop.get(m.s)!);
      bottom.set(m.col, iy + m.h);
      const end =
        m.kind === "busy"
          ? m.busy.end
          : m.kind === "act"
            ? (events.get(m.item.event ?? "")?.end ?? null)
            : m.kind === "own"
              ? ownSpan(m.event)[1]
              : null;
      placed.push({ col: m.col, s: m.s, end, y: iy, h: m.h, box: null });
      board.anchors.push({ t: base + m.s, y: iy });
      const c = col.get(m.col)!;
      if (m.kind === "busy") {
        const box: BusyBox = {
          key: `${day.date}|busy|${m.col}|${i}`,
          x: c.x + 1,
          y: iy,
          w: c.w - 2,
          h: m.h,
          labelY: 8,
          label: busyLabel(m.busy, true),
        };
        board.busy.push(box);
        placed[placed.length - 1]!.box = box;
      } else if (m.kind === "out") {
        const o = m.out;
        // Home goes up beside the leave time, a line shorter.
        const home = homeAt(o.lines);
        const stopLines = home ? o.lines.slice(0, -1) : o.lines;
        board.trips.push({
          key: `${day.date}|trip|${m.col}|${i}`,
          x: c.x + 8,
          y: iy,
          w: c.w - 16,
          h: m.h,
          target: target(o.target),
          l1: home ? `${o.lead} · home ${home}` : o.lead,
          l2: "",
          show2: false,
          l3: "",
          show3: false,
          stops: [...stopLines.map((text) => ({ text, warn: false })), ...(o.warn ? [{ text: o.warn, warn: true }] : [])],
          kids: o.kids.map((k) => (colors.get(k) ?? kidColor(0)).color),
          bad: !!o.warn,
          aria: `${nameOfDriver(m.col)}: ${o.lead}. ${o.lines.join(". ")}${o.warn ? `. ${o.warn}` : ""}`,
        });
      } else if (m.kind === "own") {
        const card = cardFor(m.event, c.x + 8, iy, c.w - 16, m.h, false, true, m.col);
        board.cards.push(card);
        placed[placed.length - 1]!.box = card;
      } else if (m.kind === "act") {
        const e = events.get(m.item.event ?? "")!;
        const card = cardFor(e, c.x, iy, c.w, m.h, m.item.clash, true, m.col);
        board.cards.push(card);
        placed[placed.length - 1]!.box = card;
      } else {
        const ride = day.rides[m.item.ride ?? -1]!;
        const route = routeOf(legsOf(ride.index), names);
        const who = nameOfDriver(ride.driver);
        board.rides.push({
          key: `${day.date}|ride|${ride.index}`,
          x: c.x,
          y: iy,
          w: c.w,
          h: m.h,
          target: rideTarget(ride.index),
          l1: `${CAR} with ${who}`,
          l2: route.join(" → "),
          show2: false,
          lines2: RIDE_MAX_LINES,
          dashed: true,
          clash: m.item.clash,
          aria: `${nameOfKid(m.col)} riding along with ${who}, ${clock(n(ride.start))} to ${clock(n(ride.end))}: ${route.join(" to ")}`,
        });
      }
    });
    let maxB = top;
    for (const b of bottom.values()) maxB = Math.max(maxB, b);
    // An event that runs past others (a day away, a long activity) stretches down across the
    // things that start while it's on, to show that time is taken. It never makes the day
    // taller, and stops short of the next thing in its own column.
    for (const p of placed) {
      if (!p.box || p.end == null) continue;
      let reach = p.y + p.h;
      for (const q of placed) {
        if (q.col !== p.col && q.s >= p.s && q.s < p.end) reach = Math.max(reach, q.y + q.h);
      }
      if (p.end >= 1440) reach = maxB;
      for (const q of placed) if (q.col === p.col && q.y > p.y) reach = Math.min(reach, q.y - GAP);
      reach = Math.min(reach, maxB);
      if (reach > p.y + p.h) p.box.h = reach - p.y;
    }
    y = maxB + PAD + 6;
    board.anchors.push({ t: base + 1439, y });
  });

  board.height = y;
  return board;
}

// The "Needs attention" list, across the week.

export type IssueTone = "unassigned" | "problem" | "heads_up";

/** A piece of an attention item's text: plain, or a link that opens an event. */
export type BodyPart = string | { text: string; target: Target };

export interface AttentionItem {
  key: string;
  tone: IssueTone;
  title: string;
  body: string;
  /** The body with links in it. When set, it's drawn instead of `body`. */
  parts?: BodyPart[];
  target: Target | null;
  suggestions: { id: string; label: string; note: string }[];
}

const QUARTERS = ["", "¼", "½", "¾"];

/**
 * Driving minutes in the planner's text, the way the board writes them: under an hour to the
 * nearest quarter ("+18¼ min"), an hour or more in hours and whole minutes ("+1 hr 15 min").
 */
export function tidyMinutes(text: string): string {
  return text.replace(/(\d+(?:\.\d+)?)\s*min\b/g, (_m, num: string) => {
    const v = Number(num);
    if (v >= 59.5) return duration(v);
    const q = Math.round(v * 4);
    const whole = Math.floor(q / 4);
    const part = QUARTERS[q % 4]!;
    return `${whole || !part ? whole : ""}${part} min`;
  });
}

/**
 * The plan with every bit of the planner's text run through {@link tidyMinutes}: card lines,
 * trip stops and warnings, and problem and suggestion text. Older planners wrote raw floats
 * such as "15.200000000000003 min".
 */
export function tidyPlan(plan: Plan): Plan {
  const line = (l: CardLine | null): CardLine | null => (l ? { ...l, text: tidyMinutes(l.text) } : null);
  return {
    ...plan,
    days: plan.days.map((d) => ({
      ...d,
      events: d.events.map((e) => ({ ...e, lines: { drop: line(e.lines.drop), pick: line(e.lines.pick) } })),
      drivers: Object.fromEntries(
        Object.entries(d.drivers).map(([id, dd]) => [
          id,
          {
            ...dd,
            outings: dd.outings.map((o) => ({
              ...o,
              lines: o.lines.map(tidyMinutes),
              warn: o.warn == null ? o.warn : tidyMinutes(o.warn),
            })),
          },
        ]),
      ),
      issues: d.issues.map((x) => ({
        ...x,
        title: tidyMinutes(x.title),
        body: tidyMinutes(x.body),
        note: x.note == null ? x.note : tidyMinutes(x.note),
        ...(x.suggestions ? { suggestions: x.suggestions.map((g) => ({ ...g, note: tidyMinutes(g.note) })) } : {}),
      })),
    })),
  };
}

/** Heads-ups are only worth reading for today and tomorrow. */
const HEADS_UP_DAYS = 2;

/** How far ahead Needs attention looks. Later problems still show on the week's day tiles. */
export const ATTENTION_HOURS = 48;

export interface Attention {
  items: AttentionItem[];
  /** Problems within the window. */
  problems: number;
  /** Rides with no driver within the window. */
  unassigned: number;
  /** Problems later in the week, past the window. */
  later: number;
  /** Of those, rides with no driver. */
  laterUnassigned: number;
}

/** What needs fixing from earlier today up to {@link ATTENTION_HOURS} from now. */
export function attention(plan: Plan, now: Today, hours = ATTENTION_HOURS): Attention {
  const items: AttentionItem[] = [];
  const drivers = new Set(driverIds(plan));
  const kidNames = kidIds(plan).map((k) => kidName(plan, k));
  const example = kidNames.length > 1 ? kidNames.slice(0, 2) : [kidNames[0] ?? "Ava", "Ben"];
  let problems = 0;
  let unassigned = 0;
  let later = 0;
  let laterUnassigned = 0;
  const limit = now.minutes + hours * 60;
  for (const day of plan.days) {
    const ahead = daysBetween(now.date, day.date);
    const pre = ahead === 0 ? "" : `${shortDay(day.date)} · `;
    const events = new Map(day.events.map((e) => [e.id, e]));
    const target = (id: string | null | undefined): Target | null => (id && events.has(id) ? { day: day.date, event: id } : null);
    // Measured from midnight today, so the rest of today always counts.
    const soon = (at: number | null | undefined, event?: string | null): boolean =>
      ahead * 1440 + (at ?? events.get(event ?? "")?.start ?? 0) < limit;
    for (const x of day.issues) {
      if (x.level !== "problem") continue;
      if (!soon(x.at, x.event)) {
        later++;
        if (x.kind === "unassigned") laterUnassigned++;
        continue;
      }
      problems++;
      if (x.kind === "unassigned") unassigned++;
      items.push({
        key: `${day.date}|${x.key}`,
        tone: x.kind === "unassigned" ? "unassigned" : "problem",
        title: pre + x.title,
        body: x.body,
        target: target(x.event),
        suggestions: (x.suggestions ?? []).map((s) => ({ id: s.id, label: s.label, note: s.note })),
      });
    }
    day.clashes.forEach((c, i) => {
      if (!soon(c.a.start, c.a.event)) {
        later++;
        return;
      }
      problems++;
      const a = events.get(c.a.event ?? "");
      const name = kidName(plan, c.kid);
      // Each event in the text opens its own details, where it can be marked not attending.
      const link = (text: string, id: string | null | undefined): BodyPart => {
        const t = target(id);
        return t ? { text, target: t } : text;
      };
      let parts: BodyPart[] = [];
      if (c.b.type === "act") {
        const b = events.get(c.b.event ?? "");
        if (a && b) {
          parts = [
            link(a.title, a.id),
            ` ${clock(a.start)}–${clock(a.end)} and `,
            link(b.title, b.id),
            ` ${clock(b.start)}–${clock(b.end)} overlap.`,
          ];
        }
      } else {
        const r = day.rides[c.b.ride ?? -1];
        if (a && r) {
          parts = [
            `${name} is in `,
            link(`${driverName(plan, r.driver)}’s car`, r.serves[0]),
            ` ${clock(n(c.b.start))}–${clock(n(c.b.end))}, during `,
            link(a.title, a.id),
            ".",
          ];
        }
      }
      items.push({
        key: `${day.date}|clash|${i}`,
        tone: "problem",
        title: `${pre}${name} is double-booked`,
        body: parts.map((p) => (typeof p === "string" ? p : p.text)).join(""),
        parts,
        // The headline covers both events, so it opens neither.
        target: null,
        suggestions: [],
      });
    });
    if (ahead >= 0 && ahead < HEADS_UP_DAYS) {
      for (const x of day.issues) {
        if (x.level !== "heads_up" || !soon(x.at, x.event)) continue;
        items.push({
          key: `${day.date}|${x.key}`,
          tone: "heads_up",
          title: pre + x.title,
          body: x.body,
          target: target(x.event),
          suggestions: [],
        });
      }
    }
    for (const u of day.unplaced ?? []) {
      if (!soon(u.at)) {
        later++;
        continue;
      }
      problems++;
      const named = u.people.map((p) => (drivers.has(p) ? driverName(plan, p) : kidName(plan, p)));
      items.push({
        key: `${day.date}|unplaced|${u.id}`,
        tone: "problem",
        title: `${pre}${clock(u.at)} ${u.title}: ${unplacedNote(u).toLowerCase()}`,
        body:
          u.reason === "unknown" && u.word
            ? `“${u.word}” isn’t anyone in the family, so this is only in ${andList(named)}’s lane. If it’s a misspelt name, fix the title in Google Calendar.`
            : `Its title doesn’t start with anyone’s name, so it isn’t on the board. Start the title in Google Calendar with who it’s for, such as “${example[0]} Piano”, or “${example.join(" & ")} Piano” for both.`,
        target: null,
        suggestions: [],
      });
    }
    for (const e of day.events) {
      if (!e.problems.length || !soon(e.start)) continue;
      items.push({
        key: `${day.date}|notes|${e.id}`,
        tone: "heads_up",
        title: `${pre}Check the notes on ${ownerName(plan, e)}’s ${e.title}`,
        body: `These lines couldn’t be read: ${e.problems.join("; ")}`,
        target: target(e.id),
        suggestions: [],
      });
    }
  }
  return { items, problems, unassigned, later, laterUnassigned };
}

/** What a timed event for nobody needs, in a few words. */
export function unplacedNote(u: UnplacedEvent): string {
  return u.reason === "unknown" && u.word ? `Who is “${u.word}”?` : "Who is this for?";
}

/**
 * The thin row across the top of a day: its all-day events, for nobody, then any timed events
 * whose titles don't say who they're for. Null when there are none. Chips that don't fit on one
 * line go on the next, so the row's height is worked out from a rough width for each chip.
 */
export function allDayRow(
  plan: Plan,
  day: PlanDay,
  colors: Map<string, KidColor>,
  width: number,
): Omit<AllDayRow, "y"> | null {
  const drivers = new Set(driverIds(plan));
  const colorOf = (people: string[]): KidColor | null => {
    const first = people[0];
    if (first == null) return null;
    return drivers.has(first) ? OWN_COLOR : (colors.get(first) ?? null);
  };
  const chips: AllDayChip[] = [
    ...(day.all_day ?? []).map((i) => ({
      key: `${day.date}|allday|${i.id}`,
      title: i.title,
      note: i.days > 1 ? `Day ${i.day_number} of ${i.days}` : "",
      color: colorOf(i.people),
      cancelled: i.cancelled,
      warn: false,
    })),
    ...(day.unplaced ?? []).map((u) => ({
      key: `${day.date}|unplaced|${u.id}`,
      title: `${clock(u.at)} ${u.title}`,
      note: unplacedNote(u),
      color: null,
      cancelled: false,
      warn: true,
    })),
  ];
  if (!chips.length) return null;
  // About 7 px a character at 12 px, plus the chip's padding and the gap after it.
  const room = Math.max(120, width - GUTTER);
  let lines = 1;
  let used = 0;
  for (const c of chips) {
    const chip = Math.min(room, 30 + 7 * (c.title.length + (c.note ? c.note.length + 2 : 0)));
    if (used && used + chip > room) {
      lines++;
      used = 0;
    }
    used += chip;
  }
  return { key: `${day.date}|allday`, h: lines * ALL_DAY_LINE + (lines - 1) * ALL_DAY_GAP, chips };
}

// What's coming up next, for the top of the board.

export interface NextUp {
  driver: string;
  name: string;
  date: string;
  /** Days from today: 0 is today. */
  ahead: number;
  start: number;
  /** Minutes from now until it starts; 0 or less once it has. */
  inMinutes: number;
  /** The driver is out on it right now. */
  ongoing: boolean;
  /** "Leave 4:35" or "From Soccer 4:50". */
  lead: string;
  /** The first stop: "4:50 Soccer fields, drop off Cleo". */
  stop: string;
  kids: KidColor[];
  warn: string | null;
  target: Target | null;
}

/**
 * The trip to show at the top: the next one to leave today, else one under way now, else the first
 * on a later day. Null when there are none left this week.
 */
export function nextUp(plan: Plan, today: Today): NextUp | null {
  const colors = kidColors(plan);
  let best: NextUp | null = null;
  // Leaving later today beats under way now, which beats a later day.
  const rank = (x: NextUp): number => (x.ahead > 0 ? 2 : x.ongoing ? 1 : 0);
  for (const day of plan.days) {
    const ahead = daysBetween(today.date, day.date);
    if (ahead < 0) continue;
    for (const d of driverIds(plan)) {
      for (const o of day.drivers[d]?.outings ?? []) {
        if (o.start == null) continue;
        const start = ahead * 1440 + o.start;
        const end = ahead * 1440 + n(o.end, o.start);
        if (end <= today.minutes) continue;
        const inMinutes = start - today.minutes;
        const x: NextUp = {
          driver: d,
          name: driverName(plan, d),
          date: day.date,
          ahead,
          start: o.start,
          inMinutes,
          ongoing: inMinutes <= 0,
          lead: o.lead,
          stop: (o.lines[0] ?? "").replace(/\s+/g, " ").trim(),
          kids: o.kids.map((k) => colors.get(k) ?? kidColor(0)),
          warn: o.warn,
          target: o.target && day.events.some((e) => e.id === o.target) ? { day: day.date, event: o.target } : null,
        };
        if (!best || rank(x) < rank(best) || (rank(x) === rank(best) && x.inMinutes < best.inMinutes)) best = x;
      }
    }
  }
  return best;
}
