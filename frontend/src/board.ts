// <mydashlight-board>: everyone's week of rides, a column per person.
//
// It draws what layout.ts works out and sends every change to the backend, which saves it in
// the event's notes on Google. It keeps no ride data of its own.

import { LitElement, html, nothing, svg, type PropertyValues, type TemplateResult } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { BackendError, type Backend } from "./backend.ts";
import { kidColor } from "./colors.ts";
import { ago, clock, clockAmPm, dayLabel, duration, nowIn, shortDay } from "./format.ts";
import {
  DAY_HEAD,
  GUTTER,
  OWN_COLOR,
  andList,
  attention,
  eventColor,
  ownerName,
  dayTag,
  driverIds,
  driverName,
  kidColors,
  kidIds,
  kidName,
  layout,
  minWidth,
  nextUp,
  problemCount,
  tAt,
  tidyPlan,
  whoName,
  yAt,
  type Attention,
  type Board,
  type Mode,
  type NextUp,
  type Target,
  type Today,
} from "./layout.ts";
import {
  NO_DAYS,
  WEEKDAYS,
  choreColumns,
  choreNote,
  choresNeedingAttention,
  defaultDays,
  draftFields,
  draftOf,
  draftProblem,
  newDraft,
  ordinal,
  problemText,
  scheduleText,
  weekdaysLabel,
  weekdaysOf,
  whoText,
  type ChoreDraft,
  type ChoreTemplate,
  type Person,
  type Repeats,
  isDone,
  isDoable,
  noChoresYet,
  type Chore,
  type ChoresPayload,
} from "./chores.ts";
import {
  addDays,
  draftKey,
  lunchChip,
  lunchMonths,
  lunchOn,
  menuOn,
  monthCounts,
  monthGrid,
  monthOf,
  monthTitle,
  nextMonth,
  offLabel,
  weekday,
  type KidLunches,
  type Lunch,
  type LunchCell,
  type LunchPayload,
} from "./lunch.ts";
import { pageOptions, type Page } from "./options.ts";
import { styles } from "./styles.ts";
import type { Plan, PlanDay, PlanEvent, Scope, Side } from "./types.ts";

const MODE_KEY = "mydashlight.rides.mode";
/** Below this width the side panel becomes a sheet over the board. */
const WIDE = 1100;
/** What the side panel takes from the board: its width, the gap and the page's padding. */
const PANEL_SPACE = 360 + 24 + 56;
/** Below this width the panel slides up from the bottom instead of in from the side. */
const PHONE = 700;
/** On the kitchen screen, go back to now after this long without a touch. */
const IDLE_MS = 3 * 60_000;
/** Arrive-by taps are saved together once they stop. */
const ARRIVE_SAVE_MS = 1200;

function localZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/** "S" for Sam: the first letter of a name, for its round badge. */
const PLUS = svg`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>`;
const PENCIL = svg`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 17.3V20h2.7l9.9-9.9-2.7-2.7zM19.7 7a1 1 0 0 0 0-1.4l-1.3-1.3a1 1 0 0 0-1.4 0l-1.2 1.2 2.7 2.7z"/></svg>`;
/** Pictures for a chore; a kitchen screen has no emoji keyboard. */
/** Every emoji, for the chore picture's More button: served with the app, so it works offline. */
const EMOJI_DATA = new URL("emoji.json", import.meta.url).href;
const ICONS = ["🛏️", "🍽️", "🧺", "👕", "🧹", "🧽", "🗑️", "♻️", "🐕", "🐈", "🐟", "🌱", "🪥", "🛁", "🧸", "📚", "🎒", "🎻", "🎹", "🚗", "🥪", "💊"];

/** A lunch bag, for Bring. */
const BAG = svg`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`;
/** A fork and knife, for Buy. */
const TRAY = svg`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/></svg>`;
/** Arrows out, to make a kid's lunch month fill the tab; arrows in, to go back to everyone. */
const EXPAND = svg`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`;
const COLLAPSE = svg`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>`;
const LUNCH_WORD: Record<Lunch, string> = { bring: "Bring", buy: "Buy" };

/** The unit after "Every [2]": "weeks", "day", "months (quarterly)". */
function everyUnit(repeats: Repeats, every: number): string {
  const unit = { daily: "day", weekly: "week", monthly: "month", school: "school day" }[repeats];
  if (every <= 1) return unit;
  return `${unit}s${repeats === "monthly" && every === 3 ? " (quarterly)" : repeats === "monthly" && every === 12 ? " (yearly)" : ""}`;
}

function initial(name: string): string {
  const m = /\p{L}|\p{N}/u.exec(name);
  return m ? m[0].toUpperCase() : "?";
}

/** "Nov 25". */
function shortDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d!)).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

/** "Tomorrow", or "Sat" for a day later this week. */
function dayTagOr(date: string, today: string): string {
  const tag = dayTag(date, today);
  return tag || dayLabel(date).split(",")[0]!;
}

/** "Ava’s, Ben’s or Cleo’s". */
function possessives(names: string[]): string {
  const p = names.map((n) => `${n}’s`);
  return p.length < 2 ? (p[0] ?? "") : `${p.slice(0, -1).join(", ")} or ${p[p.length - 1]}`;
}

function readMode(): Mode {
  try {
    const v = localStorage.getItem(MODE_KEY);
    return v === "compact" ? "compact" : "timeline";
  } catch {
    return "timeline";
  }
}

function saveMode(m: Mode): void {
  try {
    localStorage.setItem(MODE_KEY, m);
  } catch {
    // Private windows can refuse storage; the board still works.
  }
}

interface Pending {
  key: string;
  value: unknown;
}

/** A day's lunch menu being added or changed. */
interface MenuEdit {
  /** The kid whose day was tapped. */
  kid: string;
  date: string;
  dish: string;
  details: string;
  /** The kids it's saved for: the tapped kid, and others who had the same menu that day. */
  kids: string[];
  /** The day had a menu: it can be removed. */
  had: boolean;
  busy: boolean;
}

/** Nothing on any kid's calendar all week. */
function quietWeek(plan: Plan): boolean {
  return plan.days.every((d) => !d.events.length);
}

export class MyDashLightBoard extends LitElement {
  static override styles = styles;

  static override properties = {
    backend: { attribute: false },
    kiosk: { type: Boolean },
    showMenu: { type: Boolean, attribute: "show-menu" },
    plan: { state: true },
    error: { state: true },
    mode: { state: true },
    sel: { state: true },
    sheet: { state: true },
    width: { state: true },
    boardWidth: { state: true },
    pending: { state: true },
    toast: { state: true },
    scope: { state: true },
    arriveDraft: { state: true },
    tick: { state: true },
    page: { state: true },
    chores: { state: true },
    choreDraft: { state: true },
    manage: { state: true },
    choreEdit: { state: true },
    choreBusy: { state: true },
    removeArmed: { state: true },
    whoFor: { state: true },
    whoOthers: { state: true },
    iconMore: { state: true },
    lunch: { state: true },
    lunchDraft: { state: true },
    lunchMonth: { state: true },
    lunchKid: { state: true },
    menuMode: { state: true },
    menuEdit: { state: true },
  };

  declare backend: Backend | null;
  /** The shared kitchen screen: returns to now when nobody's touching it. */
  declare kiosk: boolean;
  /** Show a button that opens Home Assistant's sidebar (in the HA app on a phone). */
  declare showMenu: boolean;
  declare plan: Plan | null;
  declare error: BackendError | null;
  declare mode: Mode;
  declare sel: Target | null;
  declare sheet: boolean;
  declare width: number;
  declare boardWidth: number;
  declare pending: Pending | null;
  declare toast: string | null;
  declare scope: Scope;
  /** An arrive-by time being tapped in, not saved yet. Undefined when there's none. */
  declare arriveDraft: number | null | undefined;
  declare tick: number;
  /** Rides or chores. */
  declare page: Page;
  /** Undefined until the first read; null when chores can't be read. */
  declare chores: ChoresPayload | null | undefined;
  /** Check-offs tapped but not confirmed yet: chore id to done. */
  declare choreDraft: ReadonlyMap<string, boolean>;
  /** The chores page shows the list of chores to change instead of each kid's chores. */
  declare manage: boolean;
  /** A chore being added or changed in the panel. */
  declare choreEdit: ChoreDraft | null;
  declare choreBusy: boolean;
  /** Remove was tapped once; a second tap removes. */
  declare removeArmed: boolean;
  /** A chore being checked off: the panel asks who did it. */
  declare whoFor: Chore | null;
  /** "Someone else did" was tapped: everyone is listed. */
  declare whoOthers: boolean;
  /** The full emoji picker is open under the chore's picture chips. */
  declare iconMore: boolean;
  /** Undefined until the first read; null when lunches can't be read (or MyDashLight has none). */
  declare lunch: LunchPayload | null | undefined;
  /** Lunch picks tapped but not seen back from Google yet. */
  declare lunchDraft: ReadonlyMap<string, Lunch | null>;
  /** The month the Lunch tab shows, "2026-11"; null for this month. */
  declare lunchMonth: string | null;
  /** The one kid whose month fills the Lunch tab, with each day's whole menu; null for everyone. */
  declare lunchKid: string | null;
  /** The Lunch tab's days open the menu editor instead of switching Buy and Bring. */
  declare menuMode: boolean;
  /** A day's menu being added or changed in the panel. */
  declare menuEdit: MenuEdit | null;

  private stopWatching: (() => void) | null = null;
  private resize: ResizeObserver | null = null;
  private clockTimer: ReturnType<typeof setInterval> | null = null;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;
  private arriveTimer: ReturnType<typeof setTimeout> | null = null;
  private drag: { el: HTMLElement; x: number; y: number; top: number; left: number; moved: boolean; id: number } | null = null;
  private eatClick = false;
  private board: Board | null = null;
  private minuteKey = "";
  /** The board's scroll area, watched for size: it only exists once a plan has loaded. */
  private watchedScroller: HTMLElement | null = null;
  private boardPlan: Plan | null = null;
  private boardKey = "";
  /** Where to scroll after the next render: a moment on the board. */
  private keepAt: number | null = null;
  /** The view this screen's address asks for, if any. */
  private readonly urlView = pageOptions(location.search).view;
  /** The page this screen's address asks for, if any. */
  private readonly urlPage = pageOptions(location.search).page;
  private stopChores: (() => void) | null = null;
  private stopLunch: (() => void) | null = null;
  private scrolledOnce = false;

  constructor() {
    super();
    this.backend = null;
    this.kiosk = false;
    this.showMenu = false;
    this.plan = null;
    this.error = null;
    this.mode = this.urlView ?? readMode();
    this.sel = null;
    this.sheet = false;
    this.width = 1600;
    this.boardWidth = 1160;
    this.pending = null;
    this.toast = null;
    this.scope = "this";
    this.arriveDraft = undefined;
    this.tick = 0;
    this.page = this.urlPage ?? "rides";
    this.chores = undefined;
    this.choreDraft = new Map();
    this.manage = false;
    this.choreEdit = null;
    this.choreBusy = false;
    this.iconMore = false;
    this.removeArmed = false;
    this.whoFor = null;
    this.whoOthers = false;
    this.lunch = undefined;
    this.lunchDraft = new Map();
    this.lunchMonth = null;
    this.lunchKid = null;
    this.menuMode = false;
    this.menuEdit = null;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // The clock on screen changes on the minute; check often, draw only then.
    this.clockTimer = setInterval(() => {
      const t = this.today();
      const key = `${t.date}|${t.minutes}`;
      if (key !== this.minuteKey) {
        this.minuteKey = key;
        this.tick++;
      }
    }, 5_000);
    this.addEventListener("pointerdown", this.onActivity, { capture: true });
    this.addEventListener("keydown", this.onKey);
    this.watchBackend();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stopWatching?.();
    this.stopWatching = null;
    this.stopChores?.();
    this.stopChores = null;
    this.stopLunch?.();
    this.stopLunch = null;
    this.resize?.disconnect();
    this.resize = null;
    for (const t of [this.idleTimer, this.toastTimer, this.arriveTimer]) if (t) clearTimeout(t);
    if (this.clockTimer) clearInterval(this.clockTimer);
    this.removeEventListener("pointerdown", this.onActivity, { capture: true });
    this.removeEventListener("keydown", this.onKey);
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("backend") && this.isConnected) this.watchBackend();
  }

  protected override firstUpdated(): void {
    this.resize = new ResizeObserver(() => this.measure());
    this.resize.observe(this);
    this.measure();
  }

  protected override updated(): void {
    const el = this.scroller;
    if (el !== this.watchedScroller && this.resize) {
      // The columns are laid out for the scroll area's width, so measure it when it appears.
      if (this.watchedScroller) this.resize.unobserve(this.watchedScroller);
      if (el) this.resize.observe(el);
      this.watchedScroller = el;
    }
    if (!el || !this.board) return;
    if (!this.scrolledOnce && this.plan) {
      this.scrolledOnce = true;
      this.scrollToNow();
      return;
    }
    if (this.keepAt != null) {
      const t = this.keepAt;
      this.keepAt = null;
      this.scrollToTime(t);
    } else this.syncDay();
  }

  private watchBackend(): void {
    this.stopWatching?.();
    this.stopWatching = null;
    this.stopChores?.();
    this.stopChores = null;
    this.stopLunch?.();
    this.stopLunch = null;
    if (!this.backend) return;
    this.stopLunch = this.backend.watchLunch((lunch) => {
      this.lunch = lunch;
      // A pick is confirmed once it comes back that way.
      if (lunch && this.lunchDraft.size) {
        const left = new Map(this.lunchDraft);
        for (const [key, want] of this.lunchDraft) {
          const [kid, date] = key.split("|") as [string, string];
          const k = lunch.kids.find((x) => x.id === kid);
          if (!k || (k.picks[date] ?? null) === want || !lunchOn(k, date)) left.delete(key);
        }
        this.lunchDraft = left;
      }
      if (lunch === null && this.page === "lunch") this.setPage("rides");
    });
    this.stopChores = this.backend.watchChores((chores) => {
      this.chores = chores;
      // A check-off is confirmed once the chore comes back that way.
      if (chores && this.choreDraft.size) {
        const left = new Map(this.choreDraft);
        for (const c of chores.chores) if (left.has(c.id) && isDone(c) === left.get(c.id)) left.delete(c.id);
        for (const id of left.keys()) if (!chores.chores.some((c) => c.id === id)) left.delete(id);
        this.choreDraft = left;
      }
    });
    this.stopWatching = this.backend.watch(
      (plan) => {
        this.plan = tidyPlan(plan);
        this.error = null;
        // The selected event can disappear (moved or deleted in Google).
        if (this.sel && !this.findEvent(this.sel)) this.closeEditor();
      },
      (err) => {
        this.error = err;
      },
    );
  }

  private measure(): void {
    this.width = this.clientWidth || window.innerWidth;
    const el = this.scroller;
    if (el) this.boardWidth = el.clientWidth;
  }

  private get scroller(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>(".scroller");
  }

  /** Room for the side panel without squeezing the board until it scrolls sideways. */
  private get wide(): boolean {
    if (this.width < WIDE) return false;
    const p = this.plan;
    return !p || this.width - PANEL_SPACE >= minWidth(kidIds(p).length, driverIds(p).length);
  }

  private today(): Today {
    return nowIn(this.plan?.time_zone ?? localZone());
  }

  private currentBoard(): Board | null {
    const plan = this.plan;
    if (!plan) return null;
    const today = this.today();
    const key = `${this.mode}|${this.boardWidth}|${today.date}|${today.minutes}`;
    if (this.board == null || plan !== this.boardPlan || key !== this.boardKey) {
      this.board = layout(plan, this.mode, this.boardWidth, today);
      this.boardPlan = plan;
      this.boardKey = key;
    }
    return this.board;
  }

  // Scrolling

  private dayIndexOf(date: string): number {
    return this.plan ? this.plan.days.findIndex((d) => d.date === date) : -1;
  }

  /**
   * Scrolls a moment to just under the pinned day heading. Given its day, it never stops above
   * that day's heading, or the day before would stay pinned at the top. That happens when
   * jumping to a day's start, and when the day before runs past midnight.
   */
  private scrollToTime(t: number, date?: string): void {
    const el = this.scroller;
    if (!el || !this.board) return;
    const head = this.board.dayHeads.find((h) => h.date === date)?.y ?? 0;
    el.scrollTop = Math.max(head, yAt(this.board, t) - DAY_HEAD - 4);
    this.syncDay();
  }

  private scrollToNow(): void {
    if (!this.plan) return;
    const today = this.today();
    const i = Math.max(0, this.dayIndexOf(today.date));
    this.scrollToTime(
      i * 1440 + (this.mode === "timeline" && i === this.dayIndexOf(today.date) ? today.minutes - 45 : 0),
      this.plan.days[i]?.date,
    );
  }

  /** Jumps to a day: to now if it's today, else to its first activity or trip. */
  private goToDay(date: string): void {
    const plan = this.plan;
    if (!plan) return;
    const today = this.today();
    if (date === today.date) {
      this.scrollToNow();
      return;
    }
    const i = this.dayIndexOf(date);
    const day = plan.days[i];
    if (!day) return;
    let first = Infinity;
    if (this.mode === "timeline") {
      for (const e of day.events) first = Math.min(first, e.arrive_by ?? e.start);
      for (const d of Object.values(day.drivers)) for (const o of d.outings) if (o.start != null) first = Math.min(first, o.start);
    }
    this.scrollToTime(i * 1440 + (Number.isFinite(first) ? Math.max(0, first - 30) : 0), date);
  }

  private syncDay(): void {
    const el = this.scroller;
    if (!el || !this.board || !this.board.dayHeads.length) return;
    const top = el.scrollTop;
    let cur = this.board.dayHeads[0]!;
    for (const h of this.board.dayHeads) if (h.y <= top + 1) cur = h;
    const root = this.renderRoot;
    const label = root.querySelector(".pinned .label");
    const tag = root.querySelector<HTMLElement>(".pinned .tag");
    const sub = root.querySelector(".pinned .sub");
    if (label && label.textContent !== cur.label) label.textContent = cur.label;
    if (tag) {
      if (tag.textContent !== cur.tag) tag.textContent = cur.tag;
      tag.hidden = !cur.tag;
    }
    if (sub && sub.textContent !== cur.sub) sub.textContent = cur.sub;
    sub?.classList.toggle("warn", cur.warn);
    for (const t of root.querySelectorAll<HTMLElement>(".day-tile")) t.classList.toggle("in-view", t.dataset["date"] === cur.date);
  }

  private setPage(p: Page): void {
    if (p === this.page) return;
    this.closeEditor();
    this.closeChorePanels();
    this.manage = false;
    this.lunchMonth = null;
    this.lunchKid = null;
    this.menuMode = false;
    this.page = p;
    // Back on rides, start at now again.
    if (p === "rides") this.scrolledOnce = false;
  }

  /**
   * A chore was tapped. Done ones open again straight away. Otherwise the panel asks who did it,
   * when MyDashLight can record that; without it, the chore is checked off for its kid.
   */
  private tapChore(c: Chore): void {
    if (this.choreDone(c) || !this.chores?.people?.length) {
      void this.toggleChore(c);
      return;
    }
    this.closeEditor();
    this.closeChorePanels();
    this.whoFor = c;
  }

  /** Checks a chore off, or opens it again. Shown straight away; undone if saving fails. */
  private async toggleChore(c: Chore, by?: string): Promise<void> {
    if (!this.backend) return;
    this.whoFor = null;
    this.whoOthers = false;
    const done = !this.choreDone(c);
    const draft = new Map(this.choreDraft);
    draft.set(c.id, done);
    this.choreDraft = draft;
    try {
      await this.backend.setChoreDone(c.id, done, by && by !== c.kid ? by : undefined);
    } catch (err) {
      const back = new Map(this.choreDraft);
      back.delete(c.id);
      this.choreDraft = back;
      const e = err instanceof BackendError ? err : new BackendError("error", String(err));
      this.showToast(e.code === "preview" ? e.message : `Couldn’t save that. ${e.message}`);
    }
  }

  private choreDone(c: Chore): boolean {
    return this.choreDraft.get(c.id) ?? isDone(c);
  }

  /** Opens the menu editor on a kid's day, with the other kids who have the same menu that day. */
  private editMenu(k: KidLunches, date: string): void {
    const kids = this.lunch?.kids ?? [];
    const menu = menuOn(k, date);
    const same = kids.filter((o) => o.id === k.id || (menu && menuOn(o, date)?.dish === menu.dish)).map((o) => o.id);
    this.closePanel();
    this.menuEdit = { kid: k.id, date, dish: menu?.dish ?? "", details: menu?.details ?? "", kids: same, had: !!menu, busy: false };
  }

  private async saveMenu(remove = false): Promise<void> {
    const m = this.menuEdit;
    if (!m || !this.backend || !m.kids.length) return;
    this.menuEdit = { ...m, busy: true };
    try {
      await this.backend.setLunchMenu(m.kids, m.date, remove ? "" : m.dish.trim(), remove ? "" : m.details.trim());
      this.menuEdit = null;
    } catch (err) {
      this.menuEdit = { ...m, busy: false };
      const e = err instanceof BackendError ? err : new BackendError("error", String(err));
      this.showToast(e.code === "preview" ? e.message : `Couldn’t save that. ${e.message}`);
    }
  }

  /** Saves lunch picks. Shown straight away; undone if saving fails. */
  private async saveLunch(kid: string, dates: string[], lunch: Lunch | null): Promise<void> {
    if (!this.backend || !dates.length) return;
    const draft = new Map(this.lunchDraft);
    for (const d of dates) draft.set(draftKey(kid, d), lunch);
    this.lunchDraft = draft;
    try {
      await this.backend.setLunch(kid, dates, lunch);
    } catch (err) {
      const back = new Map(this.lunchDraft);
      for (const d of dates) back.delete(draftKey(kid, d));
      this.lunchDraft = back;
      const e = err instanceof BackendError ? err : new BackendError("error", String(err));
      this.showToast(e.code === "preview" ? e.message : `Couldn’t save that. ${e.message}`);
    }
  }

  /** Opens the chore editor in the panel: a template to change, or a new chore. */
  private editChore(t: ChoreTemplate | null): void {
    this.closeEditor();
    this.closeChorePanels();
    const first = this.chores?.kids[0]?.id;
    this.choreEdit = t ? draftOf(t) : newDraft(this.chores?.kids.length === 1 && first ? [first] : []);
  }

  private closeChorePanels(): void {
    this.menuEdit = null;
    this.choreEdit = null;
    this.choreBusy = false;
    this.removeArmed = false;
    this.whoFor = null;
    this.whoOthers = false;
    this.iconMore = false;
  }

  /** Opens the full emoji picker, loading it the first time. */
  private toggleIconMore(): void {
    this.iconMore = !this.iconMore;
    if (this.iconMore) void import("emoji-picker-element");
  }

  private changeDraft(change: Partial<ChoreDraft>): void {
    if (!this.choreEdit) return;
    this.choreEdit = { ...this.choreEdit, ...change };
    this.removeArmed = false;
  }

  private async saveChoreEdit(): Promise<void> {
    const d = this.choreEdit;
    if (!d || !this.backend || draftProblem(d)) return;
    this.choreBusy = true;
    try {
      await this.backend.saveChoreTemplate(draftFields(d));
      this.closeChorePanels();
      this.showToast(d.template ? "Saved." : `Added. ${d.title.trim()} shows on the board in a moment.`);
    } catch (err) {
      this.choreBusy = false;
      const e = err instanceof BackendError ? err : new BackendError("error", String(err));
      this.showToast(e.code === "preview" ? e.message : `Couldn’t save that. ${e.message}`);
    }
  }

  private async removeChoreEdit(): Promise<void> {
    const d = this.choreEdit;
    if (!d?.template || !this.backend) return;
    if (!this.removeArmed) {
      this.removeArmed = true;
      return;
    }
    this.choreBusy = true;
    try {
      await this.backend.removeChoreTemplate(d.template);
      this.closeChorePanels();
      this.showToast(`Removed ${d.title.trim() || "the chore"}.`);
    } catch (err) {
      this.choreBusy = false;
      this.removeArmed = false;
      const e = err instanceof BackendError ? err : new BackendError("error", String(err));
      this.showToast(e.code === "preview" ? e.message : `Couldn’t remove that. ${e.message}`);
    }
  }

  private setMode(m: Mode): void {
    if (m === this.mode) return;
    const el = this.scroller;
    this.keepAt = el && this.board ? tAt(this.board, el.scrollTop + DAY_HEAD + 4) : null;
    this.mode = m;
    // A screen whose address picks the view keeps it, and leaves this browser's choice alone.
    if (!this.urlView) saveMode(m);
  }

  // Fingers scroll natively; a mouse or pen drags the board the same way.
  private onDown = (e: PointerEvent): void => {
    if (e.pointerType === "touch" || e.button !== 0) return;
    const el = e.currentTarget as HTMLElement;
    this.drag = { el, x: e.clientX, y: e.clientY, top: el.scrollTop, left: el.scrollLeft, moved: false, id: e.pointerId };
  };

  private onMove = (e: PointerEvent): void => {
    const d = this.drag;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved) {
      if (Math.abs(dx) + Math.abs(dy) < 6) return;
      d.moved = true;
      try {
        d.el.setPointerCapture(d.id);
      } catch {
        // The pointer may already be gone.
      }
      d.el.classList.add("dragging");
    }
    d.el.scrollTop = d.top - dy;
    d.el.scrollLeft = d.left - dx;
  };

  private onUp = (): void => {
    const d = this.drag;
    this.drag = null;
    if (!d) return;
    d.el.classList.remove("dragging");
    if (d.moved) {
      this.eatClick = true;
      setTimeout(() => {
        this.eatClick = false;
      }, 0);
    }
  };

  /** A drag that ends over a box shouldn't also open it. */
  private onClickCapture = (e: Event): void => {
    if (!this.eatClick) return;
    e.stopPropagation();
    e.preventDefault();
    this.eatClick = false;
  };

  private onActivity = (): void => {
    if (!this.kiosk) return;
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.closeEditor();
      this.sheet = false;
      if (this.page !== (this.urlPage ?? "rides")) this.setPage(this.urlPage ?? "rides");
      if (this.urlView && this.mode !== this.urlView) {
        // Back to the view the address asks for, then to now once it's drawn.
        this.mode = this.urlView;
        this.scrolledOnce = false;
      } else this.scrollToNow();
    }, IDLE_MS);
  };

  private onKey = (e: KeyboardEvent): void => {
    if (e.key !== "Escape") return;
    if (this.choreEdit || this.whoFor) this.closeChorePanels();
    else if (this.sel) this.closeEditor();
    else this.sheet = false;
  };

  // Selecting and changing an event

  private findEvent(t: Target): { day: PlanDay; event: PlanEvent } | null {
    const day = this.plan?.days.find((d) => d.date === t.day);
    const event = day?.events.find((e) => e.id === t.event);
    return day && event ? { day, event } : null;
  }

  private open(t: Target | null, reveal = false): void {
    if (!t) return;
    this.flushArrive();
    this.closeChorePanels();
    this.sel = t;
    this.scope = "this";
    this.arriveDraft = undefined;
    if (reveal) this.reveal(t);
  }

  /** Scrolls the board to an event opened from the panel, so it's in view beside its details. */
  private reveal(t: Target): void {
    const found = this.findEvent(t);
    const i = this.dayIndexOf(t.day);
    if (!found || i < 0) return;
    this.scrollToTime(i * 1440 + Math.max(0, (found.event.arrive_by ?? found.event.start) - 30), t.day);
  }

  private closeEditor(): void {
    this.flushArrive();
    this.sel = null;
    this.arriveDraft = undefined;
  }

  private showToast(text: string): void {
    this.toast = text;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toast = null;
    }, 7000);
  }

  private async save(key: string, value: unknown, run: () => Promise<void>): Promise<void> {
    if (this.pending) return;
    this.pending = { key, value };
    try {
      await run();
    } catch (err) {
      const e = err instanceof BackendError ? err : new BackendError("error", String(err));
      this.showToast(e.code === "preview" ? e.message : `Couldn’t save that. ${e.message}`);
    } finally {
      this.pending = null;
    }
  }

  private setRide(e: PlanEvent, side: Side, driver: string): void {
    if (!this.backend) return;
    const b = this.backend;
    void this.save(`${side}`, driver, () => b.setRide(e.id, side, driver, this.scope));
  }

  private setAttending(e: PlanEvent, attending: boolean): void {
    if (!this.backend || (e.attending !== false) === attending) return;
    const b = this.backend;
    void this.save("attending", attending, () => b.setAttending(e.id, attending, this.scope));
  }

  private toggleStay(e: PlanEvent): void {
    if (!this.backend) return;
    const b = this.backend;
    void this.save("stay", !e.stay, () => b.setStay(e.id, !e.stay, this.scope));
  }

  /** Who rides along: on the drop-off, the pick-up, or both when the driver stays. */
  private toggleAlong(e: PlanEvent, kid: string, side: Side | "both" = "drop"): void {
    if (!this.backend) return;
    const b = this.backend;
    const cur = side === "pick" ? (e.pick_along ?? []) : e.along;
    const next = cur.includes(kid) ? cur.filter((k) => k !== kid) : [...cur, kid];
    void this.save(`along-${side}`, next, () => b.setTakeAlong(e.id, next, this.scope, side));
  }

  /** Errand minutes for a parent's own event, or null to put it back at its set time. */
  private setTakes(e: PlanEvent, minutes: number | null): void {
    if (!this.backend || (e.takes ?? null) === minutes) return;
    const b = this.backend;
    void this.save("takes", minutes, () => b.setTakes(e.id, minutes, this.scope));
  }

  private nudgeArrive(e: PlanEvent, by: number): void {
    const cur = this.arriveDraft !== undefined ? this.arriveDraft : e.arrive_by;
    let next: number | null;
    if (by < 0) next = (cur ?? e.start) - 5;
    else next = cur == null || cur + 5 >= e.start ? null : cur + 5;
    this.arriveDraft = next;
    if (this.arriveTimer) clearTimeout(this.arriveTimer);
    this.arriveTimer = setTimeout(() => this.flushArrive(), ARRIVE_SAVE_MS);
  }

  private clearArrive(): void {
    this.arriveDraft = null;
    this.flushArrive();
  }

  private flushArrive(): void {
    if (this.arriveTimer) clearTimeout(this.arriveTimer);
    this.arriveTimer = null;
    const draft = this.arriveDraft;
    const t = this.sel;
    if (draft === undefined || !t || !this.backend) return;
    const found = this.findEvent(t);
    if (!found || found.event.arrive_by === draft) {
      this.arriveDraft = undefined;
      return;
    }
    const b = this.backend;
    const id = found.event.id;
    const scope = this.scope;
    void this.save("arrive", draft, () => b.setArriveBy(id, draft, scope)).then(() => {
      this.arriveDraft = undefined;
    });
  }

  private apply(id: string): void {
    if (!this.backend) return;
    const b = this.backend;
    void this.save(`fix|${id}`, id, () => b.applySuggestion(id));
  }

  // Drawing

  override render(): TemplateResult {
    const plan = this.plan;
    const board = this.currentBoard();
    const att: Attention = plan
      ? attention(plan, this.today())
      : { items: [], problems: 0, unassigned: 0, later: 0, laterUnassigned: 0 };
    const wide = this.wide;
    const todo = this.chores ? choresNeedingAttention(this.chores, this.today().minutes).filter((c) => !this.choreDone(c)) : [];
    const chorePanel = this.menuEdit
      ? this.renderMenuEditor(this.menuEdit)
      : this.choreEdit
        ? this.renderChoreEditor(this.choreEdit)
        : this.whoFor
          ? this.renderWhoDidIt(this.whoFor)
          : null;
    const label = this.menuEdit
      ? "Lunch menu"
      : this.choreEdit
        ? this.choreEdit.template
          ? "Change a chore"
          : "Add a chore"
        : this.whoFor
          ? "Who did it"
          : this.sel
            ? "Change this ride"
            : "Needs attention";
    const panel = html`<aside class="panel" aria-label=${label}>
      ${chorePanel ?? (this.sel && plan ? this.renderEditor(plan) : this.renderAttention(att, todo))}
    </aside>`;
    const rides = this.page === "rides";
    // Wide, the panel runs the full height on the right, beside everything else. Narrower, it
    // slides over the board when opened.
    return html`
      <div class="app ${wide ? "wide" : this.width < PHONE ? "narrow phone" : "narrow"}">
        <div class="col">
          ${this.renderHeader(plan, att, todo.length)} ${rides && plan ? this.renderWeek(plan) : nothing}
          ${rides ? this.renderBanner(plan) : nothing}
          <main>
            ${rides
              ? html`<section class="board-area" aria-label="Everyone’s week">
                  ${board && plan ? (quietWeek(plan) ? this.renderQuiet(plan) : this.renderBoard(board)) : this.renderEmpty()}
                </section>`
              : this.page === "lunch"
                ? html`<section class="board-area chores-area" aria-label="Lunch">${this.renderLunch()}</section>`
                : html`<section class="board-area chores-area" aria-label="Chores">${this.renderChores()}</section>`}
            ${!wide && (this.sheet || this.sel || this.choreEdit || this.whoFor || this.menuEdit)
              ? html`<div class="backdrop" @click=${() => this.closePanel()}></div>
                  ${panel}`
              : nothing}
          </main>
        </div>
        ${wide ? panel : nothing}
        ${this.toast ? html`<div class="toast" role="status">${this.toast}</div>` : nothing}
      </div>
    `;
  }

  private closePanel(): void {
    this.closeEditor();
    this.closeChorePanels();
    this.sheet = false;
  }

  private renderHeader(plan: Plan | null, att: Attention, choresDue: number): TemplateResult {
    const problems = att.problems + choresDue;
    void this.tick;
    const now = this.today();
    let status: TemplateResult | string = "";
    if (plan) {
      const tz = plan.time_zone;
      const updated = new Date(plan.updated);
      if (this.error) {
        status = html`<span class="bad">Can’t reach Home Assistant · showing the plan from ${ago(updated, new Date(), tz)}</span>`;
      } else if (plan.status && !plan.status.ok) {
        status = html`<span class="bad">Couldn’t read Google Calendar${plan.status.error ? `: ${plan.status.error}` : ""} · plan from ${ago(updated, new Date(), tz)}</span>`;
      } else if (!this.backend?.live) {
        // Live plans are only sent when something changes, so their time isn't when they were checked.
        status = `Updated ${ago(updated, new Date(), tz)}`;
      }
    }
    const seg = (m: Mode, label: string, icon: TemplateResult, hint: string): TemplateResult => html`
      <button type="button" class="seg-btn" title=${hint} aria-pressed=${this.mode === m ? "true" : "false"} @click=${() => this.setMode(m)}>
        ${icon}<span class="seg-label">${label}</span>
      </button>
    `;
    const page = (p: Page, label: string, icon: TemplateResult): TemplateResult => html`
      <button type="button" class="seg-btn" aria-pressed=${this.page === p ? "true" : "false"} @click=${() => this.setPage(p)}>
        ${icon}<span class="seg-label">${label}</span>
      </button>
    `;
    const time = clockAmPm(now.minutes);
    const quiet = !!plan && quietWeek(plan);
    return html`
      <header>
        ${this.showMenu
          ? html`<button type="button" class="icon-btn" aria-label="Open the Home Assistant menu" @click=${this.toggleMenu}>
              ${svg`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>`}
            </button>`
          : nothing}
        <div class="titles">
          <h1 class="clock" aria-label=${`${dayLabel(now.date)}, ${time}`}>
            <span class="hm">${time.slice(0, -3)}</span><span class="ampm">${time.slice(-2)}</span>
          </h1>
          <p class="today-line">${dayLabel(now.date)}</p>
          ${status ? html`<p class="status">${status}</p>` : nothing}
        </div>
        ${plan && !quiet ? this.renderNext(plan, nextUp(plan, now), att) : nothing}
        <div class="controls">
          ${this.wide || (quiet && !choresDue)
            ? nothing
            : html`<button type="button" class="attn-btn ${problems ? "has" : ""}" @click=${() => {
                this.sheet = true;
              }}>
                <span class="attn-label">Needs attention</span> <span class="count">${problems}</span>
              </button>`}
          <!-- Views first: they go on Chores, so the page switch stays put at the edge. -->
          ${this.page !== "rides"
            ? nothing
            : html`<div role="group" aria-label="View" class="seg">
            ${seg(
              "timeline",
              "Timeline",
              svg`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="1" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="8" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.55"/><rect x="2" y="14" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,
              "Spacing matches the clock",
            )}
            ${seg(
              "compact",
              "Compact",
              svg`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="3" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="7.5" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="2" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>`,
              "Everything in order, no time scale",
            )}
          </div>`}
          <div role="group" aria-label="Page" class="seg pages">
            ${page("rides", "Rides", svg`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.2 0h9.6l-1.1-3H8.3zM7 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`)}
            ${page("chores", "Chores", svg`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M4 6.5l2 2 3.5-3.5M4 15.5l2 2 3.5-3.5M13 7h7M13 16h7"/></svg>`)}
            ${this.lunch === null ? nothing : page("lunch", "Lunch", svg`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 8h12l-1 13H7L6 8zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`)}
          </div>
        </div>
      </header>
    `;
  }

  /** The next trip out of the house, big enough to read across the kitchen. */
  private renderNext(plan: Plan, next: NextUp | null, att: Attention): TemplateResult {
    if (!next) {
      const today = this.today().date;
      const open = att.unassigned;
      const later = att.laterUnassigned;
      if (open) {
        const body = html`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${open} ${open === 1 ? "ride needs" : "rides need"} a driver</span>
          <span class="next-stop">${this.wide ? "Pick who drives under Needs attention." : "Tap to pick who drives."}</span>`;
        return this.wide
          ? html`<div class="next idle needs">${body}</div>`
          : html`<button type="button" class="next idle needs" @click=${() => (this.sheet = true)}>${body}</button>`;
      }
      if (later) {
        return html`<div class="next idle">
          <span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">All set for the next two days</span>
          <span class="next-stop">${later} ${later === 1 ? "ride needs" : "rides need"} a driver later this week.</span>
        </div>`;
      }
      const any = plan.days.some((d) => d.date >= today && d.events.length);
      return html`<div class="next idle">
        <span class="next-eyebrow">All set</span>
        <span class="next-lead">${any ? "No more trips this week" : "No trips this week"}</span>
        <span class="next-stop">${any ? "Nobody else needs driving anywhere." : "Nobody needs a ride yet."}</span>
      </div>`;
    }
    let when: string;
    if (next.ongoing) when = "On the road now";
    else if (next.ahead === 0) when = next.inMinutes < 180 ? `Next trip · in ${duration(next.inMinutes)}` : "Next trip · later today";
    else if (next.ahead === 1) when = "Next trip · tomorrow";
    else when = `Next trip · ${shortDay(next.date)}`;
    const soon = !next.ongoing && next.ahead === 0 && next.inMinutes <= 30;
    const body = html`
      <span class="next-eyebrow">${when}</span>
      <span class="next-main">
        <span class="avatar driver" aria-hidden="true">${initial(next.name)}</span>
        <span class="next-lead">${next.name} · ${next.lead}</span>
        <span class="next-kids">${next.kids.map((c) => html`<span class="kid-dot" style="background:${c.color}"></span>`)}</span>
      </span>
      ${next.warn
        ? html`<span class="next-stop warn">${next.warn}</span>`
        : next.stop
          ? html`<span class="next-stop">${next.stop}</span>`
          : nothing}
    `;
    const cls = `next ${next.ongoing ? "ongoing" : soon ? "soon" : ""}`;
    return next.target
      ? html`<button type="button" class=${cls} @click=${() => this.open(next.target)}>${body}</button>`
      : html`<div class=${cls}>${body}</div>`;
  }

  /** A tile per day: what's on, and what needs sorting out. Tapping one goes to it. */
  private renderWeek(plan: Plan): TemplateResult {
    const today = this.today().date;
    const colors = kidColors(plan);
    return html`<nav class="week" aria-label="Days">
      ${plan.days.map((d) => {
        const problems = problemCount(d);
        const n = d.events.length;
        const dots = d.events.slice(0, 6).map((e) => (e.own ? OWN_COLOR.color : (colors.get(e.kid)?.color ?? kidColor(0).color)));
        const label = `${dayLabel(d.date)}: ${n ? `${n} ${n === 1 ? "activity" : "activities"}` : "nothing planned"}${problems ? `, ${problems} to sort out` : ""}`;
        return html`<button
          type="button"
          class="day-tile ${d.date === today ? "today" : ""}"
          data-date=${d.date}
          aria-label=${label}
          @click=${() => this.goToDay(d.date)}
        >
          <span class="dt-wd">${d.date === today ? "Today" : shortDay(d.date)}</span>
          <span class="dt-num">${Number(d.date.slice(8))}</span>
          <span class="dt-dots" aria-hidden="true">
            ${dots.length
              ? dots.map((c) => html`<span class="dt-dot" style="background:${c}"></span>`)
              : html`<span class="dt-free">free</span>`}
            ${n > 6 ? html`<span class="dt-more">+${n - 6}</span>` : nothing}
          </span>
          ${problems ? html`<span class="dt-badge" aria-hidden="true">${problems}</span>` : nothing}
        </button>`;
      })}
    </nav>`;
  }

  /** Nothing on any kid's calendar all week: say so, and how things get here. */
  private renderQuiet(plan: Plan): TemplateResult {
    const kids = kidIds(plan);
    const drivers = driverIds(plan);
    const colors = kidColors(plan);
    const kidNames = kids.map((k) => kidName(plan, k));
    return html`<div class="quiet-week">
      <div class="qw-hero">
        <svg class="qw-art" viewBox="0 0 160 120" aria-hidden="true">
          <rect x="18" y="20" width="124" height="92" rx="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <rect x="18" y="20" width="124" height="26" rx="16" fill="var(--ink)" />
          <rect x="18" y="34" width="124" height="12" fill="var(--ink)" />
          <rect x="46" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          <rect x="106" y="10" width="8" height="20" rx="4" fill="var(--ink-2)" />
          ${kids.slice(0, 3).map(
            (k, i) => svg`<circle cx=${50 + i * 30} cy="80" r="11" fill=${colors.get(k)!.color} opacity="0.9" />`,
          )}
        </svg>
        <h2>A quiet week, with nothing to drive</h2>
        <p>
          When something lands on ${possessives(kidNames)} Google calendar, it shows up here within a minute, with who’s driving and when
          to leave.
        </p>
      </div>
      <div class="qw-people">
        ${kids.map((k) => {
          const c = colors.get(k)!;
          return html`<div class="qw-person" style="--c:${c.color};--rgb:${c.rgb}">
            <span class="avatar" aria-hidden="true">${initial(kidName(plan, k))}</span>
            <span class="qw-name">${kidName(plan, k)}</span>
            <span class="qw-sub">Free all week</span>
          </div>`;
        })}
        ${drivers.map(
          (d) => html`<div class="qw-person driver">
            <span class="avatar driver" aria-hidden="true">${initial(driverName(plan, d))}</span>
            <span class="qw-name">${driverName(plan, d)}</span>
            <span class="qw-sub">No trips</span>
          </div>`,
        )}
      </div>
      <ol class="qw-steps">
        <li>
          <span class="qw-num">1</span>
          <span><strong>Add it to a kid’s calendar</strong>Put the address in the event’s location, so drive times come out right.</span>
        </li>
        <li>
          <span class="qw-num">2</span>
          <span><strong>MyDashLight plans the rides</strong>Leave times, clashes, and who’s free to drive, worked out for you.</span>
        </li>
        <li>
          <span class="qw-num">3</span>
          <span><strong>Tap a ride to change it</strong>Changes are saved in the event’s notes in Google Calendar.</span>
        </li>
      </ol>
    </div>`;
  }

  private toggleMenu = (): void => {
    this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true }));
  };

  private renderBanner(plan: Plan | null): TemplateResult | typeof nothing {
    if (plan?.needs_setup === "events_calendar") {
      return html`<div class="banner" role="status">
        Pick your family calendar to see the week: in Home Assistant, open Settings &gt; Devices &amp; services &gt; MyDashLight &gt;
        Configure &gt; Calendars.
      </div>`;
    }
    const n = plan?.unavailable_calendars.length ?? 0;
    if (!n) return nothing;
    return html`<div class="banner" role="status">
      Couldn’t read ${n === 1 ? "one calendar" : `${n} calendars`} just now, so some activities may be missing. MyDashLight tries again every
      minute.
    </div>`;
  }

  private renderEmpty(): TemplateResult {
    if (this.error) {
      return html`<div class="empty-state">
        <p class="big">Can’t load the rides</p>
        <p>${this.error.message}</p>
        <button type="button" class="btn dark" @click=${() => void this.backend?.refresh()}>Try again</button>
      </div>`;
    }
    return html`<div class="empty-state"><p class="big">Loading the week…</p></div>`;
  }

  private renderBoard(b: Board): TemplateResult {
    const sel = this.sel;
    const isSel = (t: Target | null): boolean => !!t && !!sel && t.day === sel.day && t.event === sel.event;
    const first = b.dayHeads[0];
    const W = b.width;
    // Cards and the add-ons built onto them, drawn back to front so each add-on tucks behind.
    type Piece =
      | { t: "link"; x: Board["links"][number]; z: number }
      | { t: "prep"; x: Board["preps"][number]; z: number }
      | { t: "card"; x: Board["cards"][number]; z: number }
      | { t: "ride"; x: Board["rides"][number]; z: number };
    const MAIN = 100;
    const stack: Piece[] = [
      ...b.links.map((x): Piece => ({ t: "link", x, z: x.layer ?? 0 })),
      ...b.preps.map((x): Piece => ({ t: "prep", x, z: x.layer ?? MAIN - 1 })),
      ...b.cards.map((x): Piece => ({ t: "card", x, z: x.layer ?? MAIN })),
      ...b.rides.map((x): Piece => ({ t: "ride", x, z: x.layer ?? MAIN + 1 })),
    ].sort((p, q) => p.z - q.z);
    return html`
      <div
        class="scroller"
        @pointerdown=${this.onDown}
        @pointermove=${this.onMove}
        @pointerup=${this.onUp}
        @pointercancel=${this.onUp}
        @click=${this.onClickCapture}
        @scroll=${() => this.syncDay()}
      >
        <div class="heads" style="width:${W}px">
          ${b.columns.map(
            (c) => html`<div class="col-head ${c.kind}" style="left:${c.x}px;width:${c.w}px;--c:${c.dot};--rgb:${c.rgb}">
              <span class="avatar ${c.kind}" aria-hidden="true">${initial(c.name)}</span>
              <span class="ch-text">
                <span class="name-row"><span class="name">${c.name}</span>${c.kind === "kid" ? this.renderLunchChip(c.id, true) : nothing}</span>
                <span class="sub ${c.subWarn ? "warn" : ""}">${c.sub}</span>
              </span>
            </div>`,
          )}
        </div>
        <div class="pinned" aria-hidden="true" style="width:${W}px">
          <span class="label">${first?.label ?? ""}</span><span class="tag" ?hidden=${!first?.tag}>${first?.tag ?? ""}</span
          ><span class="sub ${first?.warn ? "warn" : ""}">${first?.sub ?? ""}</span>
        </div>
        <div class="canvas" style="width:${W}px;height:${Math.max(b.height + 400, 600)}px">
          ${b.columns.map(
            (c) =>
              html`<div
                class="col-bg ${c.kind}"
                style="left:${c.x}px;width:${c.w}px;height:${Math.max(b.height + 392, 592)}px;--rgb:${c.rgb}"
              ></div>`,
          )}
          <span class="sep" style="left:${b.sepX}px;height:${Math.max(b.height + 392, 592)}px"></span>
          ${b.dayHeads.map(
            (d) => html`<div class="day-head" style="top:${d.y}px;width:${W}px">
              <span class="label">${d.label}</span>${d.tag ? html`<span class="tag">${d.tag}</span>` : nothing}<span
                class="sub ${d.warn ? "warn" : ""}"
                >${d.sub}</span
              >
            </div>`,
          )}
          ${b.allDay.map(
            (r) => html`<div class="allday" style="top:${r.y}px;left:${GUTTER}px;width:${W - GUTTER}px;height:${r.h}px">
              ${r.chips.map(
                (c) =>
                  html`<span
                    class="ad-chip ${c.warn ? "warn" : ""} ${c.cancelled ? "skipped" : ""} ${c.color ? "" : "plain"}"
                    style=${c.color ? `--c:${c.color.color};--rgb:${c.color.rgb};--ink:${c.color.ink}` : ""}
                    ><span class="ad-title">${c.title}</span>${c.note ? html`<span class="ad-note">${c.note}</span>` : nothing}</span
                  >`,
              )}
            </div>`,
          )}
          ${b.empties.map((x) => html`<span class="empty" style="top:${x.y}px">${x.text}</span>`)}
          ${b.grid.map((g) => html`<div class="grid ${g.strong ? "strong" : ""}" style="top:${g.y}px;width:${W - 60}px"></div>`)}
          ${b.hours.map((h) => html`<span class="hour" style="top:${h.y}px">${h.label}</span>`)}
          ${repeat(
            b.bands,
            (x) => x.key,
            (x) =>
              html`<div
                class="band"
                aria-hidden="true"
                style="left:${x.x}px;top:${x.y}px;width:${x.w}px;height:${x.h}px;background:rgba(${x.color.rgb},0.10);border-color:rgba(${x.color.rgb},0.45)"
              ></div>`,
          )}
          ${repeat(
            b.busy,
            (x) => x.key,
            (x) =>
              html`<div class="busy" style="left:${x.x}px;top:${x.y}px;width:${x.w}px;height:${x.h}px">
                <span style="top:${x.labelY}px">${x.label}</span>
              </div>`,
          )}
          ${repeat(
            b.windows,
            (x) => x.key,
            (x) =>
              html`<div class="window" aria-hidden="true" style="left:${x.x}px;top:${x.y}px;width:${x.w}px;height:${x.h}px">
                <span>${x.label}</span>
              </div>`,
          )}
          ${repeat(
            stack,
            (p) => p.x.key,
            (p) => {
              if (p.t === "link") {
                const x = p.x;
                return html`<div
                  class="link"
                  aria-hidden="true"
                  style="left:${x.x}px;top:${x.y}px;width:${x.w}px;height:${x.h}px;border-color:${x.color.color};background:linear-gradient(rgba(${x.color.rgb},0.11), rgba(${x.color.rgb},0.11)), var(--surface)"
                ></div>`;
              }
              if (p.t === "prep") {
                const x = p.x;
                return html`<div
                  class="prep"
                  aria-hidden="true"
                  style="left:${x.x}px;top:${x.y}px;width:${x.w}px;height:${x.h}px;border-color:${x.color.color};background:linear-gradient(rgba(${x.color.rgb},0.11), rgba(${x.color.rgb},0.11)), var(--surface);color:${x.color.ink}"
                >
                  ${x.label}
                </div>`;
              }
              if (p.t === "ride") {
                const x = p.x;
                return html`<button
                  type="button"
                  class="ride ${x.dashed ? "dashed" : ""} ${x.clash ? "clash" : ""}"
                  aria-label=${x.aria}
                  style="left:${x.x}px;top:${x.y}px;width:${x.w}px;height:${x.h}px;padding-top:${3 + (x.tuckTop ?? 0)}px;padding-bottom:${3 + (x.tuckBottom ?? 0)}px"
                  @click=${() => this.open(x.target)}
                >
                  <span class="l1">${x.l1}</span>${x.show2
                    ? html`<span class="l2" style="-webkit-line-clamp:${x.lines2}">${x.l2}</span>`
                    : nothing}
                </button>`;
              }
              const x = p.x;
              const k = x.color;
              const bg = x.skipped
                ? `repeating-linear-gradient(135deg, rgba(${k.rgb},0.10) 0px, rgba(${k.rgb},0.10) 6px, transparent 6px, transparent 12px), var(--surface)`
                : x.stayed
                ? `repeating-linear-gradient(135deg, rgba(${k.rgb},0.24) 0px, rgba(${k.rgb},0.24) 6px, rgba(${k.rgb},0.08) 6px, rgba(${k.rgb},0.08) 12px), var(--surface)`
                : `linear-gradient(rgba(${k.rgb},0.15), rgba(${k.rgb},0.15)), var(--surface)`;
              return html`<button
                type="button"
                class="card ${x.wrap ? "wrap" : ""} ${isSel(x.target) ? "sel" : ""} ${x.clash ? "clash" : ""} ${x.skipped ? "skipped" : ""}"
                aria-label=${x.aria}
                style="left:${x.x}px;top:${x.y}px;width:${x.w}px;height:${x.h}px;background:${bg};border-color:${x.clash ? "var(--bad)" : `rgba(${k.rgb},0.45)`};--c:${k.color};--rgb:${k.rgb};--ring:${k.color}"
                @click=${() => this.open(x.target)}
              >
                <span class="top">
                  <span class="title">${x.title}</span>
                  <span class="time">${x.time}</span>
                  ${x.showDrop && x.drop ? html`<span class="line tone-${x.drop.tone}">${x.drop.text}</span>` : nothing}
                </span>
                ${x.showPick && x.pick ? html`<span class="line tone-${x.pick.tone}">${x.pick.text}</span>` : nothing}
              </button>`;
            },
          )}
          ${repeat(
            b.stays,
            (x) => x.key,
            (x) =>
              html`<button
                type="button"
                class="stay"
                style="left:${x.x}px;top:${x.y}px;width:${x.w}px;height:${x.h}px;border-color:${x.color.color};background:repeating-linear-gradient(135deg, rgba(${x.color.rgb},0.28) 0px, rgba(${x.color.rgb},0.28) 5px, #fff 5px, #fff 10px)"
                @click=${() => this.open(x.target)}
              >
                <span class="l1" style="color:${x.color.ink}">${x.l1}</span><span class="l2">${x.l2}</span>
              </button>`,
          )}
          ${repeat(
            b.trips,
            (x) => x.key,
            (x) =>
              html`<button
                type="button"
                class="trip ${x.bad ? "bad" : ""} ${x.stops ? "list" : ""}"
                aria-label=${x.aria}
                style="left:${x.x}px;top:${x.y}px;width:${x.w}px;height:${x.h}px"
                @click=${() => this.open(x.target)}
              >
                <span class="l1">${x.l1}${x.kids.map((c) => html`<span class="kid-dot" style="background:${c}"></span>`)}</span>
                ${x.show2 ? html`<span class="l2">${x.l2}</span>` : nothing}
                ${x.stops ? x.stops.map((s) => html`<span class="stop ${s.warn ? "warn" : ""}">${s.text}</span>`) : nothing}
                ${x.show3 ? html`<span class="l3">${x.l3}</span>` : nothing}
              </button>`,
          )}
          ${repeat(
            b.overlaps,
            (x) => x.key,
            (x) => html`<div class="overlap" aria-hidden="true" style="left:${x.x}px;top:${x.y}px;width:${x.w}px;height:${x.h}px"></div>`,
          )}
          ${repeat(
            b.marks,
            (x) => x.key,
            (x) =>
              html`<span class="mark" style="left:${x.x}px;top:${x.y}px;${x.right ? "transform:translateX(-100%)" : ""}">${x.text}</span>`,
          )}
          ${b.now
            ? html`<div class="now-line" aria-hidden="true" style="top:${b.now.y - 1.5}px;width:${W - 56}px"></div>
                <span class="now-label" aria-hidden="true" style="top:${b.now.y - 9}px">${b.now.label}</span>`
            : nothing}
        </div>
      </div>
    `;
  }

  private renderAttention(att: Attention, todo: Chore[]): TemplateResult {
    const { items, problems, later } = att;
    const plan = this.plan;
    const total = problems + todo.length;
    const chores = this.chores;
    const showChores = !!chores && !noChoresYet(chores);
    return html`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${total ? "bad" : "ok"}">${total}</span>
        ${this.wide ? nothing : html`<button type="button" class="btn dark" @click=${() => (this.sheet = false)}>Done</button>`}
      </div>
      ${showChores
        ? html`<h3 class="panel-section">Chores <span class="panel-sub">Overdue and due today</span></h3>
            ${todo.length
              ? html`<div class="attn-chores">${todo.map((c) => this.renderChoreRow(c, true))}</div>`
              : html`<p class="section-clear">All of today’s chores are done.</p>`}
            <h3 class="panel-section">Rides <span class="panel-sub">Next two days</span></h3>`
        : html`<p class="panel-sub">Rides in the next two days</p>`}
      ${plan && !problems
        ? html`<div class="all-clear">
            <span class="check" aria-hidden="true">${svg`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${quietWeek(plan)
              ? "Nothing needs you this week."
              : later
                ? `Nothing for the next two days. ${later} more later this week, marked on the days above.`
                : "Every ride is covered and nobody is double-booked."}</span>
          </div>`
        : nothing}
      ${items.map(
        (it) => html`<div class="issue ${it.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${it.tone === "heads_up" ? "i" : "!"}</span>
            <div class="issue-text">
              ${it.target
                ? html`<button type="button" class="issue-title" @click=${() => this.open(it.target, true)}>${it.title}</button>`
                : html`<strong class="issue-title">${it.title}</strong>`}
              <span class="issue-body"
                >${it.parts
                  ? it.parts.map((part) =>
                      typeof part === "string"
                        ? part
                        : html`<button type="button" class="issue-link" @click=${() => this.open(part.target, true)}>${part.text}</button>`,
                    )
                  : it.body}</span
              >
            </div>
          </div>
          ${it.suggestions.length
            ? html`<div class="fixes">
                ${it.suggestions.map(
                  (s) => html`<button
                    type="button"
                    class="fix"
                    ?disabled=${!!this.pending}
                    @click=${() => this.apply(s.id)}
                  >
                    <span class="fix-label">${this.pending?.key === `fix|${s.id}` ? "Saving…" : s.label}</span>
                    <span class="fix-note">${s.note}</span>
                  </button>`,
                )}
              </div>`
            : nothing}
        </div>`,
      )}
      ${this.wide && plan && !quietWeek(plan) && this.page === "rides" ? this.renderLegend() : nothing}
    `;
  }

  // Lunch

  private kidColorOf(kid: string): { color: string; rgb: string; ink: string } {
    const fromPlan = this.plan ? kidColors(this.plan).get(kid) : undefined;
    if (fromPlan) return fromPlan;
    const i = this.lunch?.kids.findIndex((k) => k.id === kid) ?? -1;
    return kidColor(Math.max(0, i));
  }

  /** "Buy today" or "Bring tomorrow" on a kid's column: what to pack for, glanceable. */
  private renderLunchChip(kid: string, small = false): TemplateResult | typeof nothing {
    const data = this.lunch;
    const k = data?.kids.find((x) => x.id === kid);
    if (!data || !k) return nothing;
    void this.tick;
    const now = this.today();
    const chip = lunchChip(k, now.date, now.minutes, this.lunchDraft);
    if (!chip) return nothing;
    const word = LUNCH_WORD[chip.lunch];
    return html`<span class="lunch-chip ${chip.lunch} ${small ? "small" : ""}" title=${`${word} lunch ${chip.when}${chip.menu ? `: ${chip.menu}` : ""}`}
      >${chip.lunch === "bring" ? BAG : TRAY}<span class="lunch-chip-text"
        >${word}${small ? nothing : ` ${chip.when}`}${!small && chip.menu ? html`<span class="lunch-chip-menu"> · ${chip.menu}</span>` : nothing}</span
      ></span
    >`;
  }

  /** The Lunch tab: each kid's month, Monday to Friday like the printed menu. Tap a day to switch. */
  private renderLunch(): TemplateResult {
    const data = this.lunch;
    if (data === undefined) return html`<div class="chores-message"><p>Loading lunches…</p></div>`;
    if (data === null) {
      return html`<div class="chores-message">
        <h2>Lunches aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;
    }
    const months = lunchMonths(data);
    const month = this.lunchMonth && months.includes(this.lunchMonth) ? this.lunchMonth : monthOf(data.today);
    const at = months.indexOf(month);
    const go = (by: number): void => {
      const m = months[at + by];
      if (m) this.lunchMonth = m;
    };
    // One kid's month can fill the tab, with room for each day's whole menu.
    const shown = data.kids.some((k) => k.id === this.lunchKid) ? this.lunchKid : null;
    const kids = shown ? data.kids.filter((k) => k.id === shown) : data.kids;
    const status =
      data.status && !data.status.ok
        ? html`<p class="field-hint bad">Couldn’t read the calendars just now${data.status.error ? `: ${data.status.error}` : ""}. Showing the last read.</p>`
        : nothing;
    return html`<div class="chores-scroll lunch-page">
      <div class="chores-bar">
        <div class="month-nav" role="group" aria-label="Month">
          <button type="button" class="icon-btn" aria-label="Previous month" ?disabled=${at <= 0} @click=${() => go(-1)}>
            ${svg`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>`}
          </button>
          <h2 class="month-title">${monthTitle(month)}</h2>
          <button type="button" class="icon-btn" aria-label="Next month" ?disabled=${at < 0 || at >= months.length - 1} @click=${() => go(1)}>
            ${svg`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>`}
          </button>
        </div>
        <span class="chores-hint"
          >${this.menuMode
            ? "Tap a day to add or change what’s served."
            : "Tap a day to switch between Buy and Bring. Tap a weekday to set the whole month."}</span
        >
        <button
          type="button"
          class="btn ${this.menuMode ? "dark" : ""}"
          aria-pressed=${this.menuMode ? "true" : "false"}
          @click=${() => {
            this.menuMode = !this.menuMode;
            this.menuEdit = null;
          }}
        >
          ${this.menuMode ? "Done" : html`${PENCIL} Edit menus`}
        </button>
      </div>
      ${status}
      <div class="chore-cols lunch-cols ${shown ? "wide" : ""}" style="--n:${kids.length}">
        ${kids.map((k) => this.renderLunchCard(data, k, month, shown !== null))}
      </div>
      <p class="message-aside">
        Each day’s lunch is a <strong>Lunch: Pizza</strong> all-day event on the kid’s calendar, with the rest of the
        menu in its notes and the Bring or Buy pick at the end. Menus can
        come from the school’s menu feed (set in Home Assistant under MyDashLight’s options, Lunch), a calendar file
        imported once a month, or <strong>Edit menus</strong> here.
        Days off come from <strong>No School</strong> events there. A day nobody picked gets the kid’s default, set in
        Home Assistant under MyDashLight’s options. For a Pack lunch reminder, add a School days chore set to
        <strong>Only on Bring lunch days</strong>.
      </p>
    </div>`;
  }

  private renderLunchCard(data: LunchPayload, k: KidLunches, month: string, wide: boolean): TemplateResult {
    const color = this.kidColorOf(k.id);
    const weeks = monthGrid(data, k, month, this.lunchDraft);
    const counts = monthCounts(weeks);
    const cells = weeks.flat();
    const days = cells.filter((c) => !c.outside && !c.past && c.lunch);
    const offs = k.days_off.filter((d) => monthOf(d.first) <= month && month <= monthOf(d.last));
    const column = (wd: number): LunchCell[] => days.filter((c) => weekday(c.date) === wd);
    const setColumn = (wd: number): void => {
      const col = column(wd);
      if (!col.length) return;
      const to: Lunch = col.every((c) => c.lunch === "bring") ? "buy" : "bring";
      void this.saveLunch(
        k.id,
        col.map((c) => c.date),
        to,
      );
    };
    const sub = days.length
      ? `${counts.bring} Bring · ${counts.buy} Buy${month === monthOf(data.today) ? " left this month" : ""}`
      : "No school days left this month";
    return html`<section class="chore-col lunch-card ${wide ? "wide" : ""}" style="--c:${color.color};--rgb:${color.rgb};--k:${color.ink}" aria-label=${`${k.name}’s lunches`}>
      <div class="chore-head">
        <span class="avatar" aria-hidden="true">${initial(k.name)}</span>
        <span class="ch-text">
          <span class="name">${k.name}</span>
          <span class="sub">${sub}</span>
        </span>
        <span class="lunch-actions">
          <span class="lunch-default">${LUNCH_WORD[k.default]} unless picked</span>
          ${data.kids.length < 2
            ? nothing
            : html`<button
                type="button"
                class="btn lunch-expand"
                aria-label=${wide ? "Show everyone’s lunches" : `Expand ${k.name}’s lunches to show each day’s whole menu`}
                @click=${() => (this.lunchKid = wide ? null : k.id)}
              >
                ${wide ? COLLAPSE : EXPAND}${wide ? "Show everyone" : "Expand to pick"}
              </button>`}
        </span>
      </div>
      ${k.menu_feed && !k.menu_feed.ok
        ? html`<p class="field-hint bad">Couldn’t read the school menu feed${k.menu_feed.error ? `: ${k.menu_feed.error}` : ""}.</p>`
        : nothing}
      <div class="lunch-grid" role="grid" aria-label=${`${k.name}, ${monthTitle(month)}`}>
        ${["Mon", "Tue", "Wed", "Thu", "Fri"].map(
          (w, i) => html`<button
            type="button"
            class="lunch-wd"
            ?disabled=${!column(i).length}
            aria-label=${`${column(i).every((c) => c.lunch === "bring") ? "Buy" : "Bring"} every ${w} left in ${monthTitle(month)} for ${k.name}`}
            @click=${() => setColumn(i)}
          >
            ${w}
          </button>`,
        )}
        ${cells.map((c) => this.renderLunchCell(k, c, wide))}
      </div>
      ${offs.length
        ? html`<p class="lunch-offs">
            No school:
            ${offs
              .map((d) => {
                const a = d.first < `${month}-01` ? `${month}-01` : d.first;
                const b = monthOf(d.last) > month ? addDays(`${nextMonth(month)}-01`, -1) : d.last;
                const range = a === b ? shortDate(a) : `${shortDate(a)}–${shortDate(b)}`;
                return `${range} ${offLabel(d.title)}`;
              })
              .join(" · ")}
          </p>`
        : nothing}
    </section>`;
  }

  private renderLunchCell(k: KidLunches, c: LunchCell, wide = false): TemplateResult {
    if (c.outside) return html`<span class="lunch-day outside" aria-hidden="true"></span>`;
    if (c.off !== null || !c.lunch) {
      return html`<span class="lunch-day off ${c.today ? "today" : ""}" title=${c.off ?? ""}>
        <span class="lunch-num">${c.day}</span><span class="lunch-word">No school</span>
      </span>`;
    }
    const lunch = c.lunch;
    const to: Lunch = lunch === "buy" ? "bring" : "buy";
    const menu = c.menu ? `, ${c.menu}` : "";
    const editing = this.menuMode;
    const sel = this.menuEdit?.date === c.date && this.menuEdit.kids.includes(k.id);
    const label = editing
      ? `${k.name}, ${dayLabel(c.date)}${menu || ", no menu yet"}. Tap to ${c.menu ? "change" : "add"} the menu.`
      : `${k.name}, ${dayLabel(c.date)}: ${LUNCH_WORD[lunch]}${c.picked ? "" : " (not picked yet)"}${menu}. Tap to ${LUNCH_WORD[to]}.`;
    return html`<button
      type="button"
      class="lunch-day ${lunch} ${c.picked ? "picked" : "unpicked"} ${c.past ? "past" : ""} ${c.today ? "today" : ""} ${editing ? "editing" : ""} ${sel ? "sel" : ""}"
      ?disabled=${c.past && !editing}
      aria-label=${label}
      @click=${() => (editing ? this.editMenu(k, c.date) : void this.saveLunch(k.id, [c.date], to))}
    >
      <span class="lunch-num">${c.day}</span>
      <span class="lunch-word">${lunch === "bring" ? BAG : TRAY}${LUNCH_WORD[lunch]}</span>
      ${c.menu
        ? html`<span class="lunch-menu">${c.menu}</span>${wide && c.sides ? html`<span class="lunch-sides">${c.sides}</span>` : nothing}`
        : editing
          ? html`<span class="lunch-menu add">${PLUS} Menu</span>`
          : nothing}
    </button>`;
  }

  // Chores

  /** One chore: tap anywhere on it to check it off, or to open it again. */
  private renderChoreRow(c: Chore, withName = false): TemplateResult {
    const data = this.chores!;
    const done = this.choreDone(c);
    const kid = data.kids.findIndex((k) => k.id === c.kid);
    const color = (this.plan ? kidColors(this.plan).get(c.kid) : undefined) ?? kidColor(Math.max(0, kid));
    const name = data.kids[kid]?.name ?? "";
    const shown: Chore = done === isDone(c) ? c : { ...c, state: done ? "done" : "open", done_at: done ? new Date().toISOString() : null };
    const by = done && shown.done_by && shown.done_by !== c.kid ? (data.people?.find((p) => p.id === shown.done_by)?.name ?? shown.done_by_name ?? null) : null;
    const note = `${choreNote(shown, data.today, data.time_zone)}${by ? ` · by ${by}` : ""}`;
    const canTap = done || isDoable(c);
    const label = `${withName ? `${name}: ` : ""}${c.title}. ${note ? `${note}. ` : ""}${done ? "Done. Tap to undo." : "Tap when it’s done."}`;
    const body = html`<span class="box" aria-hidden="true"
        >${done
          ? svg`<svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`
          : nothing}</span
      >
      ${c.icon ? html`<span class="chore-icon" aria-hidden="true">${c.icon}</span>` : nothing}
      <span class="chore-text">
        <span class="chore-title">${withName ? html`<span class="chore-kid">${name}</span> · ` : nothing}${c.title}</span>
        ${note ? html`<span class="chore-note">${note}</span>` : nothing}
      </span>`;
    const cls = `chore ${done ? "done" : ""} ${c.state === "overdue" && !done ? "overdue" : ""} ${canTap ? "" : "later"}`;
    const style = `--c:${color.color};--rgb:${color.rgb};--k:${color.ink}`;
    return canTap
      ? html`<button type="button" class=${cls} style=${style} aria-pressed=${done ? "true" : "false"} aria-label=${label} @click=${() => this.tapChore(c)}>
          ${body}
        </button>`
      : html`<div class=${cls} style=${style}>${body}</div>`;
  }

  private renderChores(): TemplateResult {
    const data = this.chores;
    if (data === undefined) return html`<div class="chores-message"><p>Loading chores…</p></div>`;
    if (data === null) {
      return html`<div class="chores-message">
        <h2>Chores aren’t available right now</h2>
        <p>MyDashLight may be restarting. If this stays, check that MyDashLight is up to date in HACS.</p>
      </div>`;
    }
    if (data.status.needs === "sign_in") {
      return html`<div class="chores-message">
        <h2>Sign in to Google again to turn on chores</h2>
        <p>Chores use Google Tasks, which needs one more permission. In Home Assistant, open <strong>Settings › Devices &amp; services</strong> and follow the MyDashLight sign-in prompt.</p>
      </div>`;
    }
    if (data.status.needs === "tasks_api") {
      return html`<div class="chores-message">
        <h2>Turn on the Google Tasks API</h2>
        <p>In Google Cloud, open the MyDashLight project, go to <strong>APIs &amp; Services › Library</strong>, find <strong>Google Tasks API</strong> and choose <strong>Enable</strong>. Chores show up a minute later.</p>
      </div>`;
    }
    if (this.manage) return this.renderManage(data);
    if (noChoresYet(data)) {
      return html`<div class="chores-message">
        <h2>No chores yet</h2>
        <p>Add the first one here: give it a name, pick who does it and which days.</p>
        <button type="button" class="btn dark big-btn" @click=${() => this.editChore(null)}>${PLUS} Add a chore</button>
        <p class="message-aside">
          Or add a task to the Google Tasks list <strong>Chore seeds</strong>. It shows here to be set up.
        </p>
      </div>`;
    }
    const setup = data.templates.filter((t) => t.problems.length);
    const problems = setup.length
      ? html`<section class="setup" aria-label="Chores to set up">
          <h3 class="chore-group setup-head">${setup.length === 1 ? "1 chore needs setting up" : `${setup.length} chores need setting up`}</h3>
          <div class="setup-list">${setup.map((t) => this.renderTemplateRow(t))}</div>
        </section>`
      : nothing;
    void this.tick;
    const cols = choreColumns(data, this.plan ? kidColors(this.plan) : undefined, this.today().minutes);
    return html`<div class="chores-scroll">
      <div class="chores-bar">
        <span class="chores-hint">Tap a chore when it’s done.</span>
        <button type="button" class="btn" @click=${() => this.editChore(null)}>${PLUS} Add a chore</button>
        <button type="button" class="btn" @click=${() => {
          this.closeChorePanels();
          this.manage = true;
        }}>${PENCIL} Manage chores</button>
      </div>
      ${problems}
      <div class="chore-cols" style="--n:${cols.length}">
        ${cols.map((col) => {
          const left = col.overdue.filter((c) => !this.choreDone(c)).length + col.now.filter((c) => !this.choreDone(c)).length;
          return html`<section class="chore-col" style="--c:${col.color.color};--rgb:${col.color.rgb}" aria-label=${`${col.name}’s chores`}>
            <div class="chore-head">
              <span class="avatar" aria-hidden="true">${initial(col.name)}</span>
              <span class="ch-text">
                <span class="name">${col.name}</span>
                <span class="sub">${left ? `${left} to do` : col.done.length ? "All done for now" : "Nothing to do now"}</span>
              </span>
              ${this.renderLunchChip(col.kid)}
            </div>
            ${col.overdue.length
              ? html`<h3 class="chore-group overdue">Missed</h3>
                  ${col.overdue.map((c) => this.renderChoreRow(c))}`
              : nothing}
            ${col.now.length
              ? html`<h3 class="chore-group">To do</h3>
                  ${col.now.map((c) => this.renderChoreRow(c))}`
              : nothing}
            ${col.done.length
              ? html`<h3 class="chore-group">Done</h3>
                  ${col.done.map((c) => this.renderChoreRow(c))}`
              : nothing}
            ${col.later.map(
              (g) => html`<h3 class="chore-group">${g.date === data.today ? "Later today" : dayTagOr(g.date, data.today)}</h3>
                ${g.chores.map((c) => this.renderChoreRow(c))}`,
            )}
            ${!col.overdue.length && !col.now.length && !col.done.length && !col.later.length
              ? html`<p class="chore-none">No chores this week.</p>`
              : nothing}
          </section>`;
        })}
      </div>
    </div>`;
  }

  /** One chore template, as Manage chores and the set-up list show it. Tap to change it. */
  private renderTemplateRow(t: ChoreTemplate): TemplateResult {
    const data = this.chores!;
    const kids = data.kids;
    const colors = this.plan ? kidColors(this.plan) : undefined;
    const sel = this.choreEdit?.template === t.id;
    const status = t.problems.length
      ? html`<span class="tmpl-note bad">${t.problems.map(problemText).join(" · ")} · tap to set up</span>`
      : html`<span class="tmpl-note">${whoText(t.who, kids, t.take_turns)} · ${scheduleText(t.repeats, t.days ?? "", t.every ?? 1, !!t.night_before, !!t.bring_only)}</span>`;
    return html`<button type="button" class="tmpl ${t.problems.length ? "needs" : ""} ${t.paused ? "paused" : ""} ${sel ? "sel" : ""}" @click=${() => this.editChore(t)}>
      <span class="tmpl-icon" aria-hidden="true">${t.icon ?? "•"}</span>
      <span class="chore-text">
        <span class="chore-title">${t.title || "(no name)"}${t.paused ? html` <span class="tag-paused">Paused</span>` : nothing}</span>
        ${status}
      </span>
      <span class="tmpl-dots" aria-hidden="true">
        ${t.who.map((id) => {
          const i = kids.findIndex((k) => k.id === id);
          const c = colors?.get(id) ?? kidColor(Math.max(0, i));
          return html`<span class="kid-dot" style="background:${c.color}"></span>`;
        })}
      </span>
    </button>`;
  }

  /** Manage chores: every chore template by how often it repeats, to add, change, pause or remove. */
  private renderManage(data: ChoresPayload): TemplateResult {
    const groups: [Repeats, string][] = [
      ["daily", "Every day"],
      ["weekly", "Every week"],
      ["monthly", "Every month"],
      ["school", "School days"],
    ];
    return html`<div class="chores-scroll">
      <div class="chores-bar">
        <h2 class="manage-title">Manage chores</h2>
        <button type="button" class="btn" @click=${() => this.editChore(null)}>${PLUS} Add a chore</button>
        <button type="button" class="btn dark" @click=${() => {
          this.closeChorePanels();
          this.manage = false;
        }}>Done</button>
      </div>
      ${data.templates.length
        ? groups.map(([r, label]) => {
            const list = data.templates.filter((t) => t.repeats === r);
            return list.length
              ? html`<section class="manage-group" aria-label=${label}>
                  <h3 class="chore-group">${label}</h3>
                  <div class="tmpl-list">${list.map((t) => this.renderTemplateRow(t))}</div>
                </section>`
              : nothing;
          })
        : html`<p class="chore-none">No chores yet. Tap <strong>Add a chore</strong> to make the first one.</p>`}
      <p class="message-aside">
        Chores are kept in Google Tasks, on the list <strong>Chore seeds</strong>. A task added there by hand shows up
        here to be set up.
      </p>
    </div>`;
  }

  /** The chore editor, in the panel like a ride's: name, how often, who, which days. */
  private renderChoreEditor(d: ChoreDraft): TemplateResult {
    const data = this.chores;
    if (!data) return html``;
    const kids = data.kids;
    const colors = this.plan ? kidColors(this.plan) : undefined;
    const busy = this.choreBusy;
    const t = d.template ? data.templates.find((x) => x.id === d.template) : undefined;
    const problem = draftProblem(d);
    // "Nobody is picked" is plain from the Who buttons; say what else is wrong with it.
    const fixes = (t?.problems ?? []).filter((p) => p !== "who:");

    const choice = (pressed: boolean, label: string, on: () => void, wide = false): TemplateResult =>
      html`<button type="button" class="choice ${wide ? "wide" : ""}" aria-pressed=${pressed ? "true" : "false"} ?disabled=${busy} @click=${on}>${label}</button>`;
    const chip = (pressed: boolean, label: string | TemplateResult, on: () => void, aria?: string): TemplateResult =>
      html`<button type="button" class="chip" aria-pressed=${pressed ? "true" : "false"} aria-label=${aria ?? nothing} ?disabled=${busy} @click=${on}>${label}</button>`;

    const setRepeats = (r: Repeats): void => {
      if (r === d.repeats) return;
      this.changeDraft({ repeats: r, days: t && t.repeats === r ? (t.days ?? defaultDays(r)) : defaultDays(r) });
    };
    const toggleWho = (id: string): void => {
      const who = d.who.includes(id) ? d.who.filter((x) => x !== id) : kids.filter((k) => k.id === id || d.who.includes(k.id)).map((k) => k.id);
      this.changeDraft({ who });
    };

    // Which days, by how often it repeats.
    let days: TemplateResult;
    if (d.repeats === "school") {
      const set = d.days === NO_DAYS ? new Set<number>() : d.days === "" ? new Set([0, 1, 2, 3, 4]) : (weekdaysOf(d.days) ?? new Set<number>());
      const toggleDay = (i: number): void => {
        const next = new Set(set);
        if (next.has(i)) next.delete(i);
        else next.add(i);
        this.changeDraft({ days: next.size === 5 ? "" : next.size ? weekdaysLabel(next) : NO_DAYS });
      };
      days = html`<div class="field">
          <span class="field-label">Which school days</span>
          <div role="group" aria-label="School days of the week" class="day-chips five">
            ${WEEKDAYS.slice(0, 5).map((w, i) => chip(set.has(i), w.slice(0, 2), () => toggleDay(i), w))}
          </div>
          <p class="field-hint">Weekdays with no “No School” event on the kid’s calendar.</p>
        </div>
        <div class="field">
          <span class="field-label">When</span>
          <div role="group" aria-label="When" class="choices" style="grid-template-columns:1fr 1fr">
            ${choice(!d.night_before, "That morning", () => this.changeDraft({ night_before: false }))}
            ${choice(d.night_before, "The night before", () => this.changeDraft({ night_before: true }))}
          </div>
          <p class="field-hint">${d.night_before ? "Due the evening before each school day: Sunday for Monday." : "Due on the school day itself."}</p>
        </div>
        <div class="field">
          ${choice(
            d.bring_only,
            d.bring_only ? "Only on Bring lunch days" : "Every school day, Bring or Buy",
            () => this.changeDraft({ bring_only: !d.bring_only }),
            true,
          )}
          <p class="field-hint">${d.bring_only ? "Made only when the kid brings lunch, like Pack lunch." : "Tap to make it only on Bring lunch days, like Pack lunch."}</p>
        </div>`;
    } else if (d.repeats === "monthly") {
      const v = d.days.trim();
      const n = /^\d+$/.test(v) ? Number(v) : null;
      const other = v && v.toLowerCase() !== "any" && v.toLowerCase() !== "last" && n === null;
      days = html`<div class="field">
        <span class="field-label">When in the month</span>
        <div role="group" aria-label="When in the month" class="choices" style="grid-template-columns:repeat(${other ? 4 : 3}, minmax(0, 1fr))">
          ${choice(v === "" || v.toLowerCase() === "any", "Any time", () => this.changeDraft({ days: "Any" }))}
          ${choice(n !== null, "On a date", () => this.changeDraft({ days: String(n ?? 1) }))}
          ${choice(v.toLowerCase() === "last", "Last day", () => this.changeDraft({ days: "last" }))}
          ${other ? choice(true, v, () => undefined) : nothing}
        </div>
        ${n !== null
          ? html`<div class="field arrive">
              <span class="arrive-text"><span class="field-label">On the</span></span>
              <span class="stepper">
                <button type="button" class="step" aria-label="A day earlier" ?disabled=${busy || n <= 1} @click=${() => this.changeDraft({ days: String(n - 1) })}>−</button>
                <span class="arrive-value">${ordinal(n)}</span>
                <button type="button" class="step" aria-label="A day later" ?disabled=${busy || n >= 31} @click=${() => this.changeDraft({ days: String(n + 1) })}>+</button>
              </span>
            </div>`
          : html`<p class="field-hint">${v.toLowerCase() === "last" ? "Due on the month’s last day." : other ? "Set in Google Tasks; pick another to change it." : "Shows all month, due on its last day."}</p>`}
      </div>`;
    } else if (d.repeats === "daily") {
      days = html`<p class="field-hint">Picking days of the week? That’s <strong>Every week</strong>, on those days.</p>`;
    } else {
      const any = d.days === "" || d.days.toLowerCase() === "any";
      const set = d.days === NO_DAYS ? new Set<number>() : any ? new Set<number>() : (weekdaysOf(d.days) ?? new Set<number>());
      const toggleDay = (i: number): void => {
        const next = new Set(set);
        if (next.has(i)) next.delete(i);
        else next.add(i);
        this.changeDraft({ days: next.size ? weekdaysLabel(next) || "Mon-Sun" : NO_DAYS });
      };
      days = html`<div class="field">
        <span class="field-label">Which days</span>
        <div role="group" aria-label="Any day" class="choices" style="grid-template-columns:1fr 1fr">
          ${choice(any, "Any day that week", () => this.changeDraft({ days: "Any" }))}
          ${choice(!any, "On set days", () => this.changeDraft({ days: any ? "Sat" : d.days }))}
        </div>
        ${any
          ? html`<p class="field-hint">Shows all week, due on Sunday.</p>`
          : html`<div role="group" aria-label="Days of the week" class="day-chips">
                ${WEEKDAYS.map((w, i) => chip(set.has(i), w.slice(0, 2), () => toggleDay(i), w))}
              </div>
              <div class="chips">
                ${chip(d.days === "Mon-Fri", "Weekdays", () => this.changeDraft({ days: "Mon-Fri" }))}
                ${chip(d.days === "Sat, Sun", "Weekends", () => this.changeDraft({ days: "Sat, Sun" }))}
              </div>
              <p class="field-hint">Due each day picked.</p>`}
      </div>`;
    }

    return html`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${d.icon ? html`<span class="ed-icon" aria-hidden="true">${d.icon}</span>` : nothing}${d.template ? d.title || "Set up a chore" : "Add a chore"}</span>
          <span class="ed-meta">${d.who.length ? whoText(d.who, kids, d.take_turns) : "Nobody yet"} · ${d.days === NO_DAYS ? "No days picked" : scheduleText(d.repeats, d.days, d.every, d.night_before, d.bring_only)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${busy} @click=${() => this.closeChorePanels()}>Cancel</button>
      </div>
      ${fixes.length ? html`<p class="field-hint bad">${fixes.map(problemText).join(". ")}. Saving fixes it.</p>` : nothing}
      <div class="field">
        <label class="field-label" for="chore-name">Chore</label>
        <input
          id="chore-name"
          class="text-input"
          type="text"
          autocomplete="off"
          placeholder="Make bed"
          .value=${d.title}
          ?disabled=${busy}
          @input=${(ev: Event) => this.changeDraft({ title: (ev.target as HTMLInputElement).value })}
        />
        <div role="group" aria-label="Picture" class="icon-chips">
          ${ICONS.map((i) => chip(d.icon === i, i, () => this.changeDraft({ icon: d.icon === i ? null : i }), `Picture ${i}`))}
          ${d.icon && !ICONS.includes(d.icon) ? chip(true, d.icon, () => this.changeDraft({ icon: null }), `Picture ${d.icon}`) : nothing}
          <button type="button" class="chip more" aria-pressed=${this.iconMore ? "true" : "false"} aria-expanded=${this.iconMore ? "true" : "false"} ?disabled=${busy} @click=${() => this.toggleIconMore()}>More…</button>
        </div>
        ${this.iconMore
          ? html`<emoji-picker
              class="emoji-more"
              .dataSource=${EMOJI_DATA}
              @emoji-click=${(ev: CustomEvent<{ unicode?: string }>) => {
                const u = ev.detail.unicode;
                if (u) this.changeDraft({ icon: u });
                this.iconMore = false;
              }}
            ></emoji-picker>`
          : nothing}
      </div>
      <div class="field">
        <span class="field-label">Who does it</span>
        <div role="group" aria-label="Who does it" class="who-chips">
          ${kids.map((k, i) => {
            const c = colors?.get(k.id) ?? kidColor(i);
            const on = d.who.includes(k.id);
            return html`<button type="button" class="who-chip" style="--c:${c.color};--rgb:${c.rgb}" aria-pressed=${on ? "true" : "false"} ?disabled=${busy} @click=${() => toggleWho(k.id)}>
              <span class="avatar" aria-hidden="true">${initial(k.name)}</span>${k.name}
            </button>`;
          })}
        </div>
        ${d.who.length > 1
          ? html`<div role="group" aria-label="Each or take turns" class="choices" style="grid-template-columns:1fr 1fr">
              ${choice(!d.take_turns, "Each does it", () => this.changeDraft({ take_turns: false }))}
              ${choice(d.take_turns, "They take turns", () => this.changeDraft({ take_turns: true }))}
            </div>`
          : nothing}
      </div>
      <div class="field">
        <span class="field-label">How often</span>
        <div role="group" aria-label="How often" class="choices" style="grid-template-columns:repeat(2, minmax(0, 1fr))">
          ${choice(d.repeats === "daily", "Every day", () => setRepeats("daily"))}
          ${choice(d.repeats === "weekly", "Every week", () => setRepeats("weekly"))}
          ${choice(d.repeats === "monthly", "Every month", () => setRepeats("monthly"))}
          ${choice(d.repeats === "school", "School days", () => setRepeats("school"))}
        </div>
      </div>
      ${days}
      ${d.repeats === "school" ? nothing : html`<div class="field arrive every-row">
        <span class="field-label">Every</span>
        <span class="stepper">
          <button type="button" class="step" aria-label="More often" ?disabled=${busy || d.every <= 1} @click=${() => this.changeDraft({ every: d.every - 1 })}>−</button>
          <span class="arrive-value">${d.every}</span>
          <button type="button" class="step" aria-label="Less often" ?disabled=${busy || d.every >= 52} @click=${() => this.changeDraft({ every: d.every + 1 })}>+</button>
        </span>
        <span class="field-label every-unit">${everyUnit(d.repeats, d.every)}</span>
      </div>`}
      <div class="field">
        <label class="field-label" for="chore-details">Notes <span class="field-hint">Optional, shown with the chore</span></label>
        <textarea
          id="chore-details"
          class="text-input"
          rows="2"
          .value=${d.details}
          ?disabled=${busy}
          @input=${(ev: Event) => this.changeDraft({ details: (ev.target as HTMLTextAreaElement).value })}
        ></textarea>
      </div>
      ${d.template
        ? html`<div class="field">
              ${choice(d.paused, d.paused ? "Paused: no new chores until it’s turned back on" : "On: makes chores as set above", () => this.changeDraft({ paused: !d.paused }), true)}
            </div>
            <button type="button" class="chip clear remove" ?disabled=${busy} @click=${() => void this.removeChoreEdit()}>
              ${this.removeArmed ? "Tap again to remove it for good" : "Remove this chore"}
            </button>`
        : nothing}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${busy || !!problem} @click=${() => void this.saveChoreEdit()}>
          ${busy ? "Saving to Google Tasks…" : problem ? problem.replace(/\.$/, "") : d.template ? "Save" : "Add this chore"}
        </button>
      </div>
    `;
  }

  /** A day's lunch menu: the dish, the rest of the menu, and which kids get it. */
  private renderMenuEditor(m: MenuEdit): TemplateResult {
    const data = this.lunch;
    if (!data) return html``;
    const busy = m.busy;
    const change = (c: Partial<MenuEdit>): void => {
      if (this.menuEdit) this.menuEdit = { ...this.menuEdit, ...c };
    };
    const toggle = (id: string): void =>
      change({ kids: m.kids.includes(id) ? m.kids.filter((x) => x !== id) : [...m.kids, id] });
    const school = data.kids.filter((k) => lunchOn(k, m.date));
    const dish = m.dish.trim();
    const problem = !m.kids.length ? "Pick who gets this menu" : !dish ? "Type what’s served" : null;
    return html`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${m.had ? "Change the menu" : "Add a menu"}</span>
          <span class="ed-meta">${dayLabel(m.date)}</span>
        </div>
        <button type="button" class="btn" ?disabled=${busy} @click=${() => (this.menuEdit = null)}>Cancel</button>
      </div>
      <div class="field">
        <label class="field-label" for="menu-dish">What’s served</label>
        <input
          id="menu-dish"
          class="text-input"
          type="text"
          autocomplete="off"
          placeholder="Pizza, side salad"
          .value=${m.dish}
          ?disabled=${busy}
          @input=${(ev: Event) => change({ dish: (ev.target as HTMLInputElement).value })}
        />
        <span class="field-hint">Shown on the Lunch tab and on each kid’s lunch tag.</span>
      </div>
      <div class="field">
        <label class="field-label" for="menu-details">More <span class="field-hint">Optional, like other choices or sides</span></label>
        <textarea
          id="menu-details"
          class="text-input"
          rows="3"
          .value=${m.details}
          ?disabled=${busy}
          @input=${(ev: Event) => change({ details: (ev.target as HTMLTextAreaElement).value })}
        ></textarea>
      </div>
      <div class="field">
        <span class="field-label">For</span>
        <div role="group" aria-label="Who gets this menu" class="who-chips">
          ${school.map((k) => {
            const c = this.kidColorOf(k.id);
            const on = m.kids.includes(k.id);
            return html`<button type="button" class="who-chip" style="--c:${c.color};--rgb:${c.rgb}" aria-pressed=${on ? "true" : "false"} ?disabled=${busy} @click=${() => toggle(k.id)}>
              <span class="avatar" aria-hidden="true">${initial(k.name)}</span>${k.name}
            </button>`;
          })}
        </div>
        <span class="field-hint">Saved as a <strong>Lunch: ${dish || "…"}</strong> all-day event on each one’s calendar.</span>
      </div>
      ${m.had
        ? html`<button type="button" class="chip clear remove" ?disabled=${busy || !m.kids.length} @click=${() => void this.saveMenu(true)}>
            Remove this day’s menu
          </button>`
        : nothing}
      <div class="ed-foot">
        <button type="button" class="btn dark save" ?disabled=${busy || !!problem} @click=${() => void this.saveMenu()}>
          ${busy ? "Saving to Google Calendar…" : (problem ?? "Save")}
        </button>
      </div>
    `;
  }

  /** Who did it: the kid it's for, big, or somebody else (parents can do kids' chores too). */
  private renderWhoDidIt(c: Chore): TemplateResult {
    const data = this.chores;
    if (!data) return html``;
    const people: Person[] = data.people?.length ? data.people : data.kids.map((k) => ({ ...k, role: "kid" as const }));
    const kidIndex = data.kids.findIndex((k) => k.id === c.kid);
    const kid = data.kids[kidIndex];
    const colors = this.plan ? kidColors(this.plan) : undefined;
    const color = colors?.get(c.kid) ?? kidColor(Math.max(0, kidIndex));
    const others = people.filter((p) => p.id !== c.kid);
    const personColor = (p: Person): string => {
      const i = data.kids.findIndex((k) => k.id === p.id);
      return i >= 0 ? (colors?.get(p.id) ?? kidColor(i)).color : "var(--dark)";
    };
    return html`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title">${c.icon ? html`<span class="ed-icon" aria-hidden="true">${c.icon}</span>` : nothing}${c.title}</span>
          <span class="ed-meta">${kid?.name ?? ""} · ${choreNote(c, data.today, data.time_zone)}</span>
        </div>
        <button type="button" class="btn" @click=${() => this.closeChorePanels()}>Cancel</button>
      </div>
      <div class="field">
        <span class="field-label">Who did it?</span>
        <button type="button" class="done-by main" style="--c:${color.color};--rgb:${color.rgb}" @click=${() => void this.toggleChore(c)}>
          <span class="avatar" aria-hidden="true">${initial(kid?.name ?? "?")}</span>
          <span>${kid?.name ?? "Done"} did it</span>
        </button>
        ${this.whoOthers
          ? html`<div role="group" aria-label="Who else did it" class="done-by-list">
              ${others.map(
                (p) => html`<button type="button" class="done-by" style="--c:${personColor(p)}" @click=${() => void this.toggleChore(c, p.id)}>
                  <span class="avatar ${p.role === "parent" ? "driver" : ""}" aria-hidden="true">${initial(p.name)}</span>
                  <span>${p.name}</span>
                </button>`,
              )}
            </div>`
          : html`<button type="button" class="choice wide" @click=${() => (this.whoOthers = true)}>Someone else did</button>`}
      </div>
    `;
  }

  private renderLegend(): TemplateResult {
    return html`<div class="legend">
      <span><span class="sw trip-sw"></span>A driver’s trip out of the house; dots show who’s in the car</span>
      <span><span class="sw ride-sw"></span>A kid in a car (dashed: along for someone else’s stop)</span>
      <span><span class="sw band-sw"></span>Link from the kid to whoever is driving</span>
      <span><span class="sw stay-sw"></span>Staying through the activity</span>
      <span><span class="sw busy-sw"></span>Busy on their own calendar</span>
      <span><span class="sw overlap-sw"></span>Overlap: can’t do both</span>
    </div>`;
  }

  /** What happens on a parent's own event: they drive themselves, or fit an errand in. */
  private ownHint(plan: Plan, e: PlanEvent): string {
    const who = ownerName(plan, e);
    if (e.takes != null) {
      const when = e.planned != null ? `It’s fitted in at ${clock(e.planned)}` : "It doesn’t fit anywhere yet";
      return `An errand: about ${e.takes} min any time from ${clock(e.start)} to ${clock(e.end)}. ${when}, around ${who}’s other trips. Errands go alone.`;
    }
    const going = e.along.map((a) => (driverIds(plan).includes(a) ? driverName(plan, a) : kidName(plan, a)));
    return `${who} drives there and back${going.length ? `, with ${andList(going)}` : ""}.`;
  }

  private renderEditor(plan: Plan): TemplateResult {
    const found = this.findEvent(this.sel!);
    if (!found) return html``;
    const { day, event: e } = found;
    const drivers = driverIds(plan);
    const color = eventColor(plan, e);
    const owner = ownerName(plan, e);
    const busy = !!this.pending;
    const pendingValue = (key: string): unknown => (this.pending?.key === key ? this.pending.value : undefined);

    const known: string[] = [...(plan.people?.carpools ?? [])];
    for (const d of plan.days)
      for (const x of d.events)
        for (const v of [x.drop, x.pick])
          if (v && v !== "none" && !drivers.includes(v) && !known.some((k) => k.toLowerCase() === v.toLowerCase())) known.push(v);

    const side = (s: Side): TemplateResult | typeof nothing => {
      if (!e.sides.includes(s)) return nothing;
      const pend = pendingValue(s);
      const v = pend !== undefined ? String(pend) : s === "drop" ? e.drop : e.pick;
      const other = v && v !== "none" && !drivers.includes(v) ? v : "";
      const choose = (value: string): void => this.setRide(e, s, v === value ? "" : value);
      const main: [string, string][] = [...drivers.map((d): [string, string] => [d, whoName(plan, d)]), ["none", "Not needed"]];
      return html`<div class="field">
        <span class="field-label">${s === "drop" ? "Drop-off" : "Pick-up"} ${v === "" ? html`<span class="nobody">· nobody yet</span>` : nothing}</span>
        <div role="group" aria-label=${s === "drop" ? "Drop-off driver" : "Pick-up driver"} class="choices" style="grid-template-columns:repeat(${main.length}, minmax(0, 1fr))">
          ${main.map(
            ([value, label]) =>
              html`<button type="button" class="choice" aria-pressed=${v === value ? "true" : "false"} ?disabled=${busy} @click=${() => choose(value)}>
                ${label}
              </button>`,
          )}
        </div>
        ${known.length
          ? html`<div role="group" aria-label=${s === "drop" ? "Drop-off: someone else" : "Pick-up: someone else"} class="chips">
              ${known.map(
                (name) =>
                  html`<button type="button" class="chip" aria-pressed=${v.toLowerCase() === name.toLowerCase() ? "true" : "false"} ?disabled=${busy} @click=${() => choose(name)}>
                    ${name}
                  </button>`,
              )}
            </div>`
          : nothing}
        <input
          type="text"
          .value=${other && !known.some((k) => k.toLowerCase() === other.toLowerCase()) ? other : ""}
          ?disabled=${busy}
          aria-label=${s === "drop" ? "Drop-off by someone else" : "Pick-up by someone else"}
          placeholder="Someone else, e.g. Grandma"
          enterkeyhint="done"
          @change=${(ev: Event) => {
            const t = (ev.target as HTMLInputElement).value.trim();
            if (t && t !== v) this.setRide(e, s, t);
          }}
          @keydown=${(ev: KeyboardEvent) => {
            if (ev.key === "Enter") (ev.target as HTMLInputElement).blur();
          }}
        />
        ${!stay && v !== "" && v !== "none" ? riders(s, v) : nothing}
      </div>`;
    };

    // Who rides along on one side (or both when the driver stays): the other kids, and the other
    // parent. They're written after the driver on the Drop-off or Pick-up line.
    const riders = (s: Side | "both", driver: string): TemplateResult | typeof nothing => {
      const pend = pendingValue(`along-${s}`);
      const cur = pend !== undefined ? (pend as string[]) : s === "pick" ? (e.pick_along ?? []) : e.along;
      const choices = [...kidIds(plan).filter((k) => k !== e.kid), ...drivers.filter((d) => d !== driver)];
      if (!choices.length) return nothing;
      const label = s === "both" ? "Riding along, both ways" : "Riding along";
      return html`<div class="field-sub">
        <span class="field-label">${label} <span class="field-hint">${s === "pick" ? "They come for the pick-up" : "They leave home in the same car"}</span></span>
        <div role="group" aria-label=${s === "drop" ? "Riding along on the drop-off" : s === "pick" ? "Riding along on the pick-up" : "Riding along both ways"} class="chips">
          ${choices.map(
            (k) => html`<button type="button" class="chip" aria-pressed=${cur.includes(k) ? "true" : "false"} ?disabled=${busy} @click=${() => this.toggleAlong(e, k, s)}>
              ${drivers.includes(k) ? driverName(plan, k) : kidName(plan, k)}
            </button>`,
          )}
        </div>
      </div>`;
    };

    const stayPend = pendingValue("stay");
    const stay = stayPend !== undefined ? Boolean(stayPend) : e.stay;
    const canStay = e.drop === e.pick && drivers.includes(e.drop);
    const alongPend = pendingValue("along");
    const along = alongPend !== undefined ? (alongPend as string[]) : e.along;
    // On a parent's own event the other parent can go along too.
    const otherKids = e.own ? [...kidIds(plan), ...drivers.filter((d) => d !== e.own)] : [];
    const errand = e.own != null && e.takes != null;
    const canTake = e.own != null && !errand;
    const takesPend = pendingValue("takes");
    const takes = takesPend !== undefined ? (takesPend as number | null) : (e.takes ?? null);
    const arrivePend = pendingValue("arrive");
    const arrive = this.arriveDraft !== undefined ? this.arriveDraft : arrivePend !== undefined ? (arrivePend as number | null) : e.arrive_by;

    const notes: string[] = [];
    const noteVal = (v: string): string => (v === "none" ? "Not needed" : whoName(plan, v));
    // A parent's own event drives itself: only who goes along and when to arrive are written.
    const who = (k: string): string => (drivers.includes(k) ? driverName(plan, k) : kidName(plan, k));
    const line = (label: string, driver: string, with_: string[]): void => {
      if (driver === "" && !with_.length) return;
      notes.push(`${label}: ${[driver === "" ? "TBD" : noteVal(driver), ...with_.map(who)].join(", ")}`);
    };
    if (!e.own) line("Drop-off", e.drop, e.along);
    if (!e.own) line("Pick-up", e.pick, e.pick_along ?? []);
    if (!e.own && e.stay) notes.push("Stay: yes");
    if (errand) notes.push(`Takes: ${e.takes} min`);
    if (e.own && e.along.length) notes.push(`Take along: ${e.along.map(who).join(", ")}`);
    if (e.arrive_by != null) notes.push(`Arrive by: ${clockAmPm(e.arrive_by)}`);
    const attendPend = pendingValue("attending");
    const attending = attendPend !== undefined ? Boolean(attendPend) : e.attending !== false;
    if (e.attending === false) notes.splice(0, notes.length, "Attending: no");

    const ahead = day.date === this.today().date ? "" : `${shortDay(day.date)} · `;
    const head = html`<div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${color.color}"></span>${owner} · ${e.title}</span>
          <span class="ed-meta">${ahead}${errand ? "any time " : ""}${clock(e.start)}–${clock(e.end)}${e.place_name && !e.place.startsWith("?") ? ` · ${e.place_name}` : ""}</span>
        </div>
        <button type="button" class="btn dark" @click=${() => this.closeEditor()}>Done</button>
      </div>`;
    if (e.where === "home") {
      return html`${head}
        <p class="field-hint">It’s at home, so it doesn’t need a ride. If ${owner} can’t get home in time, the board shows it as a clash.</p>`;
    }
    return html`
      ${head}
      ${this.pending ? html`<p class="saving" role="status">Saving to Google Calendar…</p>` : nothing}
      ${e.recurring
        ? html`<div class="field">
            <span class="field-label">Change</span>
            <div role="group" aria-label="Which ones to change" class="choices" style="grid-template-columns:1fr 1fr">
              <button type="button" class="choice" aria-pressed=${this.scope === "this" ? "true" : "false"} @click=${() => (this.scope = "this")}>
                Just ${shortDay(day.date)}’s
              </button>
              <button type="button" class="choice" aria-pressed=${this.scope === "series" ? "true" : "false"} @click=${() => (this.scope = "series")}>
                Every time
              </button>
            </div>
          </div>`
        : nothing}
      <div class="field">
        <span class="field-label">${owner} is</span>
        <div role="group" aria-label="Going or not" class="choices" style="grid-template-columns:1fr 1fr">
          <button type="button" class="choice" aria-pressed=${attending ? "true" : "false"} ?disabled=${busy} @click=${() => this.setAttending(e, true)}>
            Going
          </button>
          <button type="button" class="choice" aria-pressed=${attending ? "false" : "true"} ?disabled=${busy} @click=${() => this.setAttending(e, false)}>
            Not attending
          </button>
        </div>
      </div>
      ${attending
        ? html`${e.where === "anywhere"
              ? html`<p class="field-hint">No address, so it can happen anywhere and needs no ride. Pick a driver if it does.</p>`
              : nothing}
            ${e.own
              ? html`<p class="field-hint">${this.ownHint(plan, e)}</p>`
              : html`${side("drop")} ${side("pick")}
                  <div class="field">
                    <button type="button" class="choice wide" aria-pressed=${stay ? "true" : "false"} ?disabled=${!canStay || busy} @click=${() => this.toggleStay(e)}>
                      ${canStay ? (stay ? "Driver stays the whole time" : "Driver leaves and comes back") : "Staying needs the same driver both ways"}
                    </button>
                    ${stay && canStay ? riders("both", e.drop) : nothing}
                  </div>`}
      ${e.own
        ? html`<div class="field arrive">
            <span class="arrive-text">
              <span class="field-label">Errand</span>
              <span class="field-hint">${takes != null ? `Takes ${takes} min, any time ${clock(e.start)}–${clock(e.end)}` : "At its set time"}</span>
            </span>
            ${takes != null
              ? html`<span class="stepper">
                  <button type="button" class="step" aria-label="Five minutes shorter" ?disabled=${busy || takes <= 5} @click=${() => this.setTakes(e, Math.max(5, takes - 5))}>−</button>
                  <span class="arrive-value">${takes} min</span>
                  <button type="button" class="step" aria-label="Five minutes longer" ?disabled=${busy || takes + 5 > e.end - e.start} @click=${() => this.setTakes(e, takes + 5)}>+</button>
                </span>`
              : nothing}
          </div>
          <button type="button" class="chip clear" ?disabled=${busy} @click=${() => this.setTakes(e, takes != null ? null : Math.min(10, Math.max(5, e.end - e.start)))}>
            ${takes != null ? "Go at its set time instead" : "Make it an errand: any time in this window"}
          </button>`
        : nothing}
      ${canTake && otherKids.length
        ? html`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Who goes along" class="chips">
              ${otherKids.map(
                (k) => html`<button type="button" class="chip" aria-pressed=${along.includes(k) ? "true" : "false"} ?disabled=${busy} @click=${() => this.toggleAlong(e, k)}>
                  ${drivers.includes(k) ? driverName(plan, k) : kidName(plan, k)}
                </button>`,
              )}
            </div>
          </div>`
        : nothing}
      ${errand
        ? nothing
        : html`<div class="field arrive">
        <span class="arrive-text">
          <span class="field-label">Arrive by</span>
          <span class="field-hint">${arrive != null ? `${e.start - arrive} min before it starts` : `Aims for a few minutes before ${clock(e.start)}`}</span>
        </span>
        <span class="stepper">
          <button type="button" class="step" aria-label="Five minutes earlier" ?disabled=${busy} @click=${() => this.nudgeArrive(e, -5)}>−</button>
          <span class="arrive-value">${arrive != null ? clock(arrive) : "Not set"}</span>
          <button type="button" class="step" aria-label="Five minutes later" ?disabled=${busy || arrive == null} @click=${() => this.nudgeArrive(e, 5)}>+</button>
        </span>
      </div>
      ${arrive != null
        ? html`<button type="button" class="chip clear" ?disabled=${busy} @click=${() => this.clearArrive()}>Clear arrive-by time</button>`
        : nothing}`}
`
        : html`<p class="field-hint">
            Not going this time. It stays on the board, crossed out, with no rides planned, and it doesn’t count as a clash.
            Its other ride settings stay saved in the notes, so tapping Going brings them all back.
          </p>`}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves === false ? "Would be saved" : "Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${notes.length ? notes.join("\n") : "(no ride lines yet)"}</span>
      </div>
      ${e.problems.length
        ? html`<p class="field-hint bad">These lines in the notes couldn’t be read: ${e.problems.join("; ")}</p>`
        : nothing}
      ${attending && !e.own
        ? html`<p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>`
        : nothing}
    `;
  }
}

if (!customElements.get("mydashlight-board")) customElements.define("mydashlight-board", MyDashLightBoard);

declare global {
  interface HTMLElementTagNameMap {
    "mydashlight-board": MyDashLightBoard;
  }
}
