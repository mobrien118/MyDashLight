// The plan as `mydashlight.get_plan` returns it (custom_components/mydashlight/payload.py).
// Times are minutes after midnight on that day. A pick-up after midnight can go past 1440.

export type Tone = "normal" | "pending" | "problem" | "muted";
export type Side = "drop" | "pick";

export interface CardLine {
  text: string;
  tone: Tone;
}

export interface PlanEvent {
  id: string;
  kid: string;
  title: string;
  place: string;
  place_name: string;
  short_place: string;
  /** "home" (no ride), "anywhere" (no address or online, no ride unless one is named) or "place". */
  where: "home" | "anywhere" | "place";
  start: number;
  end: number;
  /** "mom" or "dad" (the routed drivers), "none" (no ride needed), "" (nobody yet), or anyone else's name. */
  drop: string;
  pick: string;
  stay: boolean;
  arrive_by: number | null;
  /** Kids taken along on this drop-off. On a parent's own event, the other parent can go too (their driver id). */
  along: string[];
  sides: Side[];
  calendar_id: string;
  event_id: string;
  recurring: boolean;
  /** Lines in the event's notes that couldn't be read. */
  problems: string[];
  lines: { drop: CardLine | null; pick: CardLine | null };
  /** False when the kid is skipping this one: no rides, no issues, no clashes. Older plans leave it out. */
  attending?: boolean;
  /**
   * A parent's own event: their driver id. They drive themselves and stay, so `kid`, `drop` and
   * `pick` are that driver too. Null on a kid's event; older plans leave it out.
   */
  own?: string | null;
  /** A parent's errand: the minutes it takes, any time from `start` to `end`. */
  takes?: number | null;
  /** When the planner fitted an errand in, or null when it couldn't. */
  planned?: number | null;
}

export interface Segment {
  type: "drive" | "wait" | "stay" | "home";
  start: number | null;
  end: number | null;
  from: string | null;
  to: string | null;
  place: string | null;
  kids: string[];
  event: string | null;
  serves: string | null;
  overlaps_busy: boolean;
}

export interface Outing {
  start: number | null;
  end: number | null;
  /** "Leave 4:35" or "From Soccer 4:50". */
  lead: string;
  /** "4:50  Soccer, drop off Madeline". */
  lines: string[];
  kids: string[];
  warn: string | null;
  target: string | null;
  /** The other parent riding along to this parent's own event, with when they leave. */
  parents?: Record<string, string>;
  /** The driver goes alone to their own event. */
  solo?: boolean;
}

export interface BusyBlock {
  start: number;
  end: number;
  title: string;
  /** The driver's own event this is the time of; the board draws that as a trip instead. */
  event?: string | null;
}

export interface DriverDay {
  name: string;
  leave: number | null;
  drive: number | null;
  trips: number;
  segments: Segment[];
  outings: Outing[];
  busy: BusyBlock[];
}

export interface Ride {
  index: number;
  kid: string;
  driver: string;
  start: number | null;
  end: number | null;
  /** False while the kid is only along for someone else's stop. */
  own: boolean;
  serves: string[];
}

export interface KidItem {
  type: "act" | "ride";
  start: number | null;
  end: number | null;
  clash: boolean;
  event?: string;
  ride?: number;
}

export interface Change {
  id: string;
  field: "drop" | "pick" | "along";
  value: string | string[];
}

export interface Suggestion {
  id: string;
  label: string;
  change: Change;
  who: string;
  note: string;
}

export interface Issue {
  key: string;
  level: "problem" | "heads_up";
  kind: string;
  driver: string | null;
  event: string | null;
  side: Side | null;
  minutes: number | null;
  at: number | null;
  title: string;
  body: string;
  note: string | null;
  suggestions?: Suggestion[];
}

export interface Clash {
  kid: string;
  a: KidItem;
  b: KidItem;
}

export interface PlanDay {
  date: string;
  events: PlanEvent[];
  drivers: Record<string, DriverDay>;
  rides: Ride[];
  kids: Record<string, { name: string; items: KidItem[] }>;
  clashes: Clash[];
  issues: Issue[];
  score: number | null;
}

export interface Plan {
  updated: string;
  time_zone: string;
  unavailable_calendars: string[];
  drive_times?: Record<string, unknown>;
  days: PlanDay[];
  /** Who the board shows, in the order set up in Home Assistant (MyDashLight 0.5 and later). */
  people?: People;
  /** Whether the last calendar read worked (MyDashLight 0.5 and later). */
  status?: { ok: boolean; error: string | null };
}

export interface People {
  drivers: { id: string; name: string }[];
  kids: { id: string; name: string }[];
  /** Carpool drivers set up in Home Assistant, offered in the driver picker. */
  carpools: string[];
}

export type Scope = "this" | "series";
