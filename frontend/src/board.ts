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
  attention,
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
  whoName,
  yAt,
  type AttentionItem,
  type Board,
  type Mode,
  type NextUp,
  type Target,
  type Today,
} from "./layout.ts";
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
function initial(name: string): string {
  const m = /\p{L}|\p{N}/u.exec(name);
  return m ? m[0].toUpperCase() : "?";
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
  private scrolledOnce = false;

  constructor() {
    super();
    this.backend = null;
    this.kiosk = false;
    this.showMenu = false;
    this.plan = null;
    this.error = null;
    this.mode = readMode();
    this.sel = null;
    this.sheet = false;
    this.width = 1600;
    this.boardWidth = 1160;
    this.pending = null;
    this.toast = null;
    this.scope = "this";
    this.arriveDraft = undefined;
    this.tick = 0;
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
    if (!this.backend) return;
    this.stopWatching = this.backend.watch(
      (plan) => {
        this.plan = plan;
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

  private scrollToTime(t: number): void {
    const el = this.scroller;
    if (!el || !this.board) return;
    el.scrollTop = Math.max(0, yAt(this.board, t) - DAY_HEAD - 4);
    this.syncDay();
  }

  private scrollToNow(): void {
    if (!this.plan) return;
    const today = this.today();
    const i = Math.max(0, this.dayIndexOf(today.date));
    this.scrollToTime(i * 1440 + (this.mode === "timeline" && i === this.dayIndexOf(today.date) ? today.minutes - 45 : 0));
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
    this.scrollToTime(i * 1440 + (Number.isFinite(first) ? Math.max(0, first - 30) : 0));
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

  private setMode(m: Mode): void {
    if (m === this.mode) return;
    const el = this.scroller;
    this.keepAt = el && this.board ? tAt(this.board, el.scrollTop + DAY_HEAD + 4) : null;
    this.mode = m;
    saveMode(m);
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
      this.scrollToNow();
    }, IDLE_MS);
  };

  private onKey = (e: KeyboardEvent): void => {
    if (e.key !== "Escape") return;
    if (this.sel) this.closeEditor();
    else this.sheet = false;
  };

  // Selecting and changing an event

  private findEvent(t: Target): { day: PlanDay; event: PlanEvent } | null {
    const day = this.plan?.days.find((d) => d.date === t.day);
    const event = day?.events.find((e) => e.id === t.event);
    return day && event ? { day, event } : null;
  }

  private open(t: Target | null): void {
    if (!t) return;
    this.flushArrive();
    this.sel = t;
    this.scope = "this";
    this.arriveDraft = undefined;
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

  private toggleStay(e: PlanEvent): void {
    if (!this.backend) return;
    const b = this.backend;
    void this.save("stay", !e.stay, () => b.setStay(e.id, !e.stay, this.scope));
  }

  private toggleAlong(e: PlanEvent, kid: string): void {
    if (!this.backend) return;
    const b = this.backend;
    const next = e.along.includes(kid) ? e.along.filter((k) => k !== kid) : [...e.along, kid];
    void this.save("along", next, () => b.setTakeAlong(e.id, next, this.scope));
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
    const att = plan ? attention(plan, this.today().date) : { items: [], problems: 0 };
    const panelOpen = this.wide || this.sheet || !!this.sel;
    return html`
      <div class="app ${this.wide ? "wide" : this.width < PHONE ? "narrow phone" : "narrow"}">
        ${this.renderHeader(plan, att.problems)} ${plan ? this.renderWeek(plan) : nothing} ${this.renderBanner(plan)}
        <main>
          <section class="board-area" aria-label="Everyone’s week">
            ${board && plan ? (quietWeek(plan) ? this.renderQuiet(plan) : this.renderBoard(board)) : this.renderEmpty()}
          </section>
          ${panelOpen
            ? html`${this.wide ? nothing : html`<div class="backdrop" @click=${() => this.closePanel()}></div>`}
                <aside class="panel" aria-label=${this.sel ? "Change this ride" : "Needs attention"}>
                  ${this.sel && plan ? this.renderEditor(plan) : this.renderAttention(att.items, att.problems)}
                </aside>`
            : nothing}
        </main>
        ${this.toast ? html`<div class="toast" role="status">${this.toast}</div>` : nothing}
      </div>
    `;
  }

  private closePanel(): void {
    this.closeEditor();
    this.sheet = false;
  }

  private renderHeader(plan: Plan | null, problems: number): TemplateResult {
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
        ${plan && !quiet ? this.renderNext(plan, nextUp(plan, now)) : nothing}
        <div class="controls">
          ${this.wide || quiet
            ? nothing
            : html`<button type="button" class="attn-btn ${problems ? "has" : ""}" @click=${() => {
                this.sheet = true;
              }}>
                <span class="attn-label">Needs attention</span> <span class="count">${problems}</span>
              </button>`}
          <div role="group" aria-label="View" class="seg">
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
          </div>
        </div>
      </header>
    `;
  }

  /** The next trip out of the house, big enough to read across the kitchen. */
  private renderNext(plan: Plan, next: NextUp | null): TemplateResult {
    if (!next) {
      const today = this.today().date;
      const open = plan.days
        .filter((d) => d.date >= today)
        .reduce((sum, d) => sum + d.issues.filter((i) => i.level === "problem" && i.kind === "unassigned").length, 0);
      if (open) {
        const body = html`<span class="next-eyebrow">No trips planned yet</span>
          <span class="next-lead">${open} ${open === 1 ? "ride needs" : "rides need"} a driver</span>
          <span class="next-stop">${this.wide ? "Pick who drives under Needs attention." : "Tap to pick who drives."}</span>`;
        return this.wide
          ? html`<div class="next idle needs">${body}</div>`
          : html`<button type="button" class="next idle needs" @click=${() => (this.sheet = true)}>${body}</button>`;
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
        const dots = d.events.slice(0, 6).map((e) => colors.get(e.kid)?.color ?? kidColor(0).color);
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
                <span class="name">${c.name}</span>
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
            b.preps,
            (x) => x.key,
            (x) =>
              html`<div
                class="prep"
                aria-hidden="true"
                style="left:${x.x}px;top:${x.y}px;width:${x.w}px;height:${x.h}px;border-color:${x.color.color};background:rgba(${x.color.rgb},0.07);color:${x.color.ink}"
              >
                ${x.label}
              </div>`,
          )}
          ${repeat(
            b.cards,
            (x) => x.key,
            (x) => {
              const k = x.color;
              const bg = x.stayed
                ? `repeating-linear-gradient(135deg, rgba(${k.rgb},0.24) 0px, rgba(${k.rgb},0.24) 6px, rgba(${k.rgb},0.08) 6px, rgba(${k.rgb},0.08) 12px), var(--surface)`
                : `linear-gradient(rgba(${k.rgb},0.15), rgba(${k.rgb},0.15)), var(--surface)`;
              return html`<button
                type="button"
                class="card ${x.wrap ? "wrap" : ""} ${isSel(x.target) ? "sel" : ""} ${x.clash ? "clash" : ""}"
                aria-label=${x.aria}
                style="left:${x.x}px;top:${x.y}px;width:${x.w}px;height:${x.h}px;background:${bg};border-color:${x.clash ? "var(--bad)" : `rgba(${k.rgb},0.45)`};--c:${k.color};--ring:${k.color}"
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
            b.rides,
            (x) => x.key,
            (x) =>
              html`<button
                type="button"
                class="ride ${x.dashed ? "dashed" : ""} ${x.clash ? "clash" : ""}"
                aria-label=${x.aria}
                style="left:${x.x}px;top:${x.y}px;width:${x.w}px;height:${x.h}px"
                @click=${() => this.open(x.target)}
              >
                <span class="l1">${x.l1}</span>${x.show2 ? html`<span class="l2">${x.l2}</span>` : nothing}
              </button>`,
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

  private renderAttention(items: AttentionItem[], problems: number): TemplateResult {
    const plan = this.plan;
    return html`
      <div class="panel-head">
        <h2>Needs attention</h2>
        <span class="count-pill ${problems ? "bad" : "ok"}">${problems}</span>
        ${this.wide ? nothing : html`<button type="button" class="btn dark" @click=${() => (this.sheet = false)}>Done</button>`}
      </div>
      ${plan && !problems
        ? html`<div class="all-clear">
            <span class="check" aria-hidden="true">${svg`<svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>`}</span>
            <span><strong>All clear</strong>${quietWeek(plan)
              ? "Nothing needs you this week."
              : "Every ride is covered and nobody is double-booked."}</span>
          </div>`
        : nothing}
      ${items.map(
        (it) => html`<div class="issue ${it.tone}">
          <div class="issue-main">
            <span class="glyph" aria-hidden="true">${it.tone === "heads_up" ? "i" : "!"}</span>
            <div class="issue-text">
              ${it.target
                ? html`<button type="button" class="issue-title" @click=${() => this.open(it.target)}>${it.title}</button>`
                : html`<strong class="issue-title">${it.title}</strong>`}
              <span class="issue-body">${it.body}</span>
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
      ${this.wide && plan && !quietWeek(plan) ? this.renderLegend() : nothing}
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

  private renderEditor(plan: Plan): TemplateResult {
    const found = this.findEvent(this.sel!);
    if (!found) return html``;
    const { day, event: e } = found;
    const drivers = driverIds(plan);
    const colors = kidColors(plan);
    const color = colors.get(e.kid) ?? kidColor(0);
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
      </div>`;
    };

    const stayPend = pendingValue("stay");
    const stay = stayPend !== undefined ? Boolean(stayPend) : e.stay;
    const canStay = e.drop === e.pick && drivers.includes(e.drop);
    const alongPend = pendingValue("along");
    const along = alongPend !== undefined ? (alongPend as string[]) : e.along;
    const otherKids = kidIds(plan).filter((k) => k !== e.kid);
    const canTake = drivers.includes(e.drop) && e.sides.includes("drop");
    const arrivePend = pendingValue("arrive");
    const arrive = this.arriveDraft !== undefined ? this.arriveDraft : arrivePend !== undefined ? (arrivePend as number | null) : e.arrive_by;

    const notes: string[] = [];
    const noteVal = (v: string): string => (v === "none" ? "Not needed" : whoName(plan, v));
    if (e.drop !== "") notes.push(`Drop-off: ${noteVal(e.drop)}`);
    if (e.pick !== "") notes.push(`Pick-up: ${noteVal(e.pick)}`);
    if (e.stay) notes.push("Stay: yes");
    if (e.along.length) notes.push(`Take along: ${e.along.map((k) => kidName(plan, k)).join(", ")}`);
    if (e.arrive_by != null) notes.push(`Arrive by: ${clockAmPm(e.arrive_by)}`);

    const ahead = day.date === this.today().date ? "" : `${shortDay(day.date)} · `;
    return html`
      <div class="ed-head">
        <div class="ed-titles">
          <span class="ed-title"><span class="dot" style="background:${color.color}"></span>${kidName(plan, e.kid)} · ${e.title}</span>
          <span class="ed-meta">${ahead}${clock(e.start)}–${clock(e.end)}${e.place_name && !e.place.startsWith("?") ? ` · ${e.place_name}` : ""}</span>
        </div>
        <button type="button" class="btn dark" @click=${() => this.closeEditor()}>Done</button>
      </div>
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
      ${side("drop")} ${side("pick")}
      <div class="field">
        <button type="button" class="choice wide" aria-pressed=${stay ? "true" : "false"} ?disabled=${!canStay || busy} @click=${() => this.toggleStay(e)}>
          ${canStay ? (stay ? "Driver stays the whole time" : "Driver leaves and comes back") : "Staying needs the same driver both ways"}
        </button>
      </div>
      ${canTake && otherKids.length
        ? html`<div class="field">
            <span class="field-label">Take along <span class="field-hint">They leave home in the same car</span></span>
            <div role="group" aria-label="Kids taken along" class="chips">
              ${otherKids.map(
                (k) => html`<button type="button" class="chip" aria-pressed=${along.includes(k) ? "true" : "false"} ?disabled=${busy} @click=${() => this.toggleAlong(e, k)}>
                  ${kidName(plan, k)}
                </button>`,
              )}
            </div>
          </div>`
        : nothing}
      <div class="field arrive">
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
        : nothing}
      <div class="notes">
        <span class="notes-label">${this.backend?.saves === false ? "Would be saved" : "Saved"} to this event’s notes in Google Calendar</span>
        <span class="notes-body">--- Rides ---\n${notes.length ? notes.join("\n") : "(no ride lines yet)"}</span>
      </div>
      ${e.problems.length
        ? html`<p class="field-hint bad">These lines in the notes couldn’t be read: ${e.problems.join("; ")}</p>`
        : nothing}
      <p class="field-hint">Tap a selected driver again to clear it. Type any name for a carpool or a relative.</p>
    `;
  }
}

if (!customElements.get("mydashlight-board")) customElements.define("mydashlight-board", MyDashLightBoard);

declare global {
  interface HTMLElementTagNameMap {
    "mydashlight-board": MyDashLightBoard;
  }
}
