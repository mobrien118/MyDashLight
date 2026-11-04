// Lays out a week of plans as the ride board: a column per kid, then one per driver.
//
// Two ways to read it. Timeline keeps true spacing within each day. Compact has no time scale:
// everything sits in start order, and a column only skips down to stay in order with the
// others. Pure module: plain data in, boxes with positions and text out. The board element
// only draws them.

import { DRIVER_DOT, DRIVER_RGB, kidColor, type KidColor } from "./colors.ts";
import { clock, dayLabel, daysBetween, duration, hourLabel, shortDay } from "./format.ts";
import type { CardLine, KidItem, Plan, PlanDay, PlanEvent, Segment } from "./types.ts";

export type Mode = "timeline" | "compact";

/** Pixels per minute in Timeline. */
export const PPM = 3;
export const DAY_HEAD = 36;
const PAD = 12;
const GAP = 8;
/** Left gutter for the hour labels. */
export const GUTTER = 60;
const KID_GAP = 10;
const SEP = 30;
const DRIVER_GAP = 10;
const MIN_KID = 150;
const MIN_DRIVER = 200;
const DRIVER_SHARE = 1.4;

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
  time: string;
  drop: CardLine | null;
  pick: CardLine | null;
  showDrop: boolean;
  showPick: boolean;
  /** Lines wrap (Compact) instead of being cut off. */
  wrap: boolean;
  aria: string;
}

export interface RideBox extends Box {
  target: Target | null;
  l1: string;
  l2: string;
  show2: boolean;
  dashed: boolean;
  clash: boolean;
  aria: string;
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
  color: KidColor;
  l1: string;
  l2: string;
}

export interface BusyBox extends Box {
  label: string;
  labelY: number;
}

export interface PrepBox extends Box {
  color: KidColor;
  label: string;
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
}

export interface Board {
  mode: Mode;
  width: number;
  height: number;
  columns: Column[];
  /** Between the kids' columns and the drivers'. */
  sepX: number;
  dayHeads: DayHead[];
  empties: { key: string; y: number; text: string }[];
  grid: { key: string; y: number; strong: boolean }[];
  hours: { key: string; y: number; label: string }[];
  cards: CardBox[];
  rides: RideBox[];
  bands: BandBox[];
  trips: TripBox[];
  stays: StayBox[];
  busy: BusyBox[];
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

  const weekEvents = new Map<string, PlanEvent[]>();
  for (const d of plan.days) {
    for (const e of d.events) {
      const list = weekEvents.get(e.kid) ?? [];
      // A long event shows on two days: count it once.
      if (!list.some((x) => x.event_id === e.event_id && x.calendar_id === e.calendar_id)) list.push(e);
      weekEvents.set(e.kid, list);
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
    for (const day of plan.days) {
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

/** How many problems a day has: issues to fix plus double-bookings. */
export function problemCount(day: PlanDay): number {
  return day.issues.filter((i) => i.level === "problem").length + day.clashes.length;
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

/** A Compact card's height: everything on it shows, wrapped. */
export function compactCardHeight(e: PlanEvent, colW: number): number {
  const inner = colW - 23; // padding, the color stripe and the border
  const time = `${clock(e.start)}–${clock(e.end)}` + (e.arrive_by != null ? ` · arrive ${clock(e.arrive_by)}` : "");
  let h = 15 + 18 + wrapRows(time, inner, 6.6) * 16;
  for (const l of [e.lines.drop, e.lines.pick]) if (l) h += 2 + wrapRows(l.text, inner, 7) * 16;
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
    board.dayHeads.push({
      date: day.date,
      y,
      label: dayLabel(day.date),
      tag,
      sub:
        (count ? `${count} ${count === 1 ? "activity" : "activities"}` : "Nothing scheduled") +
        (problems ? ` · ${problems} to sort out` : ""),
      warn: problems > 0,
    });
    board.anchors.push({ t: base, y });
    const top = y + DAY_HEAD + PAD;

    const outings = drivers.flatMap((d) => day.drivers[d]?.outings ?? []);
    if (!count && !outings.length) {
      board.empties.push({ key: day.date, y: top, text: "Nothing planned" });
      y = top + 40;
      board.anchors.push({ t: base + 1439, y });
      return;
    }

    const cardFor = (e: PlanEvent, x: number, cy: number, cw: number, h: number, clash: boolean, wrap: boolean): CardBox => {
      const c = colors.get(e.kid) ?? kidColor(0);
      const ln = e.lines;
      return {
        key: `${day.date}|card|${e.id}`,
        x,
        y: cy,
        w: cw,
        h,
        target: { day: day.date, event: e.id },
        event: e,
        color: c,
        kidName: nameOfKid(e.kid),
        clash,
        stayed: e.stay && drivers.includes(e.drop),
        title: shortTitle(e.title, nameOfKid(e.kid)),
        time: `${clock(e.start)}–${clock(e.end)}` + (e.arrive_by != null ? ` · arrive ${clock(e.arrive_by)}` : ""),
        drop: ln.drop,
        pick: ln.pick,
        showDrop: !!ln.drop && (wrap || h >= 56),
        showPick: !!ln.pick && (wrap || h >= 74),
        wrap,
        aria:
          `${nameOfKid(e.kid)}, ${e.title} ${clock(e.start)} to ${clock(e.end)}. ` +
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
        lo = Math.min(lo, e.start - 20, e.arrive_by != null ? e.arrive_by - 10 : Infinity);
        hi = Math.max(hi, e.end + 20);
      }
      for (const o of outings) {
        if (o.start != null) lo = Math.min(lo, o.start);
        if (o.end != null) hi = Math.max(hi, o.end);
      }
      if (day.date === today.date && Number.isFinite(lo) && today.minutes > lo - 60 && today.minutes < hi) {
        lo = Math.min(lo, today.minutes - 15);
      }
      const r0 = Number.isFinite(lo) ? Math.floor((lo - 5) / 30) * 30 : 900;
      const r1 = Number.isFinite(hi) ? Math.ceil((hi + 5) / 30) * 30 : 960;
      const Y = (t: number): number => Math.round(top + (Math.max(r0, Math.min(r1, t)) - r0) * PPM);
      board.anchors.push({ t: base + r0, y: Y(r0) }, { t: base + r1, y: Y(r1) });

      for (const kid of kids) {
        const c = col.get(kid)!;
        const color = colors.get(kid)!;
        const items: { item: KidItem; s: number; en: number }[] = (day.kids[kid]?.items ?? [])
          .filter((it) => it.start != null && it.end != null)
          .map((it) => ({ item: it, s: n(it.start), en: n(it.end) }));
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
            board.cards.push(cardFor(e, ix, y0, iw, h, it.clash, false));
            if (e.arrive_by != null && e.start - e.arrive_by >= 5) {
              const py = Y(e.arrive_by);
              board.preps.push({
                key: `${day.date}|prep|${e.id}`,
                x: ix,
                y: py,
                w: iw,
                h: y0 - py + 6,
                color,
                label: `Arrive by ${clock(e.arrive_by)}`,
              });
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
          board.rides.push({
            key: `${day.date}|ride|${ride.index}`,
            x: ix,
            y: y0,
            w: iw,
            h: rh,
            target: rideTarget(ride.index),
            l1: `${ride.own ? "In" : "Along in"} ${who}’s car`,
            l2: route.join(" → "),
            show2: rh >= 36,
            dashed: !ride.own,
            clash: it.clash,
            aria: `${nameOfKid(kid)} ${ride.own ? "in" : "riding along in"} ${who}’s car, ${clock(n(ride.start))} to ${clock(n(ride.end))}: ${route.join(" to ")}`,
          });
          const dc = col.get(ride.driver);
          if (dc) {
            board.bands.push({
              key: `${day.date}|band|${ride.index}`,
              x: ix + iw,
              y: y0,
              w: Math.max(0, dc.x + 8 - (ix + iw)),
              h: rh,
              color,
            });
          }
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
        for (const piece of pieces) {
          const y0 = Y(piece.s);
          const h = Math.max(24, Y(piece.en) - y0);
          if (piece.type === "stay") {
            const e = events.get(piece.g.event ?? piece.g.serves ?? "");
            const color = e ? colors.get(e.kid) ?? kidColor(0) : kidColor(0);
            const others = piece.g.kids.map(nameOfKid);
            board.stays.push({
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
            if (en <= s) continue;
            board.overlaps.push({
              key: `${day.date}|overlap|${d}|${s}`,
              x: c.x + 6,
              y: Y(s) - 2,
              w: c.w - 12,
              h: Math.max(8, Y(en) - Y(s) + 4),
            });
          }
        }
        for (const b of dd.busy) {
          if (b.end <= r0 || b.start >= r1) continue;
          const y0 = Y(b.start);
          const y1 = Y(b.end);
          board.busy.push({
            key: `${day.date}|busy|${d}|${b.start}`,
            x: c.x + 1,
            y: y0,
            w: c.w - 2,
            h: y1 - y0,
            labelY: 8,
            label: `${b.title} until ${clock(b.end)}`,
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

    // Compact: no time scale. Sort everything by start; each box goes as high as its column
    // allows without rising above anything that starts earlier.
    type Item =
      | { col: string; s: number; h: number; kind: "act"; item: KidItem }
      | { col: string; s: number; h: number; kind: "along"; item: KidItem }
      | { col: string; s: number; h: number; kind: "busy"; busy: { start: number; end: number; title: string } }
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
          items.push({ col: kid, s: it.start, h: 44, kind: "along", item: it });
        }
      }
    }
    for (const d of drivers) {
      const dd = day.drivers[d];
      if (!dd) continue;
      for (const b of dd.busy) items.push({ col: d, s: b.start, h: 32, kind: "busy", busy: b });
      for (const o of dd.outings) {
        if (o.start == null) continue;
        items.push({ col: d, s: o.start, h: 30 + o.lines.length * 16 + (o.warn ? 16 : 0), kind: "out", out: o });
      }
    }
    items.sort((a, b) => a.s - b.s || order.indexOf(a.col) - order.indexOf(b.col));
    const bottom = new Map<string, number>();
    let prevY = top;
    items.forEach((m, i) => {
      const below = bottom.get(m.col);
      const iy = Math.max(below != null ? below + GAP : top, prevY);
      bottom.set(m.col, iy + m.h);
      prevY = iy;
      board.anchors.push({ t: base + m.s, y: iy });
      const c = col.get(m.col)!;
      if (m.kind === "busy") {
        board.busy.push({
          key: `${day.date}|busy|${m.col}|${i}`,
          x: c.x + 1,
          y: iy,
          w: c.w - 2,
          h: m.h,
          labelY: 8,
          label: `${m.busy.title} ${clock(m.busy.start)}–${clock(m.busy.end)}`,
        });
      } else if (m.kind === "out") {
        const o = m.out;
        board.trips.push({
          key: `${day.date}|trip|${m.col}|${i}`,
          x: c.x + 8,
          y: iy,
          w: c.w - 16,
          h: m.h,
          target: target(o.target),
          l1: o.lead,
          l2: "",
          show2: false,
          l3: "",
          show3: false,
          stops: [...o.lines.map((text) => ({ text, warn: false })), ...(o.warn ? [{ text: o.warn, warn: true }] : [])],
          kids: o.kids.map((k) => (colors.get(k) ?? kidColor(0)).color),
          bad: !!o.warn,
          aria: `${nameOfDriver(m.col)}: ${o.lead}. ${o.lines.join(". ")}${o.warn ? `. ${o.warn}` : ""}`,
        });
      } else if (m.kind === "act") {
        const e = events.get(m.item.event ?? "")!;
        board.cards.push(cardFor(e, c.x, iy, c.w, m.h, m.item.clash, true));
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
          l1: `Along with ${who} ${clock(n(ride.start))}`,
          l2: route.join(" → "),
          show2: true,
          dashed: true,
          clash: m.item.clash,
          aria: `${nameOfKid(m.col)} riding along with ${who}, ${clock(n(ride.start))} to ${clock(n(ride.end))}: ${route.join(" to ")}`,
        });
      }
    });
    let maxB = top;
    for (const b of bottom.values()) maxB = Math.max(maxB, b);
    y = maxB + PAD + 6;
    board.anchors.push({ t: base + 1439, y });
  });

  board.height = y;
  return board;
}

// The "Needs attention" list, across the week.

export type IssueTone = "unassigned" | "problem" | "heads_up";

export interface AttentionItem {
  key: string;
  tone: IssueTone;
  title: string;
  body: string;
  target: Target | null;
  suggestions: { id: string; label: string; note: string }[];
}

/** "+18.299999999999997 min" reads as "+18.5 min": minutes in text, to the nearest half. */
export function tidyMinutes(text: string): string {
  return text.replace(/(\d+\.\d+)(?=\s*min\b)/g, (m) => {
    const v = Math.round(Number(m) * 2) / 2;
    return Number.isInteger(v) ? String(v) : v.toFixed(1);
  });
}

/** Heads-ups are only worth reading for today and tomorrow. */
const HEADS_UP_DAYS = 2;

export function attention(plan: Plan, today: string): { items: AttentionItem[]; problems: number } {
  const items: AttentionItem[] = [];
  let problems = 0;
  for (const day of plan.days) {
    const ahead = daysBetween(today, day.date);
    const pre = ahead === 0 ? "" : `${shortDay(day.date)} · `;
    const events = new Map(day.events.map((e) => [e.id, e]));
    const target = (id: string | null | undefined): Target | null => (id && events.has(id) ? { day: day.date, event: id } : null);
    for (const x of day.issues) {
      if (x.level !== "problem") continue;
      problems++;
      items.push({
        key: `${day.date}|${x.key}`,
        tone: x.kind === "unassigned" ? "unassigned" : "problem",
        title: pre + x.title,
        body: x.body,
        target: target(x.event),
        suggestions: (x.suggestions ?? []).map((s) => ({ id: s.id, label: s.label, note: tidyMinutes(s.note) })),
      });
    }
    day.clashes.forEach((c, i) => {
      problems++;
      const a = events.get(c.a.event ?? "");
      const name = kidName(plan, c.kid);
      let body = "";
      if (c.b.type === "act") {
        const b = events.get(c.b.event ?? "");
        body = a && b ? `${a.title} ${clock(a.start)}–${clock(a.end)} and ${b.title} ${clock(b.start)}–${clock(b.end)} overlap.` : "";
      } else {
        const r = day.rides[c.b.ride ?? -1];
        body =
          a && r
            ? `${name} is in ${driverName(plan, r.driver)}’s car ${clock(n(c.b.start))}–${clock(n(c.b.end))}, during ${a.title}.`
            : "";
      }
      items.push({
        key: `${day.date}|clash|${i}`,
        tone: "problem",
        title: `${pre}${name} is double-booked`,
        body,
        target: target(c.a.event),
        suggestions: [],
      });
    });
    if (ahead >= 0 && ahead < HEADS_UP_DAYS) {
      for (const x of day.issues) {
        if (x.level !== "heads_up") continue;
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
    for (const e of day.events) {
      if (!e.problems.length) continue;
      items.push({
        key: `${day.date}|notes|${e.id}`,
        tone: "heads_up",
        title: `${pre}Check the notes on ${kidName(plan, e.kid)}’s ${e.title}`,
        body: `These lines couldn’t be read: ${e.problems.join("; ")}`,
        target: target(e.id),
        suggestions: [],
      });
    }
  }
  return { items, problems };
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
