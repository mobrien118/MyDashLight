// How the board reads the plan and saves ride changes.
//
// In Home Assistant, every change is a `mydashlight` action, which saves it in the event's notes
// on Google and replans. The board never keeps ride data of its own.

import { timeField } from "./format.ts";
import type { Plan, Scope, Side } from "./types.ts";
import type { ChoresPayload, ChoreTemplate, TemplateFields } from "./chores.ts";
import type { Lunch, LunchPayload } from "./lunch.ts";

export interface Backend {
  /** Calls `onPlan` with the plan now and whenever it changes. Returns a function that stops it. */
  watch(onPlan: (plan: Plan) => void, onError: (err: BackendError) => void): () => void;
  /** Reads the plan again now. */
  refresh(): Promise<void>;
  setRide(event: string, side: Side | "both", driver: string, scope: Scope): Promise<void>;
  setStay(event: string, stay: boolean, scope: Scope): Promise<void>;
  /** `minutes` past midnight, or null to go back to a few minutes before the start. */
  setArriveBy(event: string, minutes: number | null, scope: Scope): Promise<void>;
  /** Who rides along. On a kid's event, `side` picks the drop-off (default) or pick-up; staying is always both. */
  setTakeAlong(event: string, kids: string[], scope: Scope, side?: Side | "both"): Promise<void>;
  /** A parent's own event as an errand that takes `minutes` any time in its window, or null for a set time. */
  setTakes(event: string, minutes: number | null, scope: Scope): Promise<void>;
  /** Going (true) or skipping this one (false). */
  setAttending(event: string, attending: boolean, scope: Scope): Promise<void>;
  applySuggestion(id: string): Promise<void>;
  /**
   * Calls `onChores` with the chores now and whenever they change; null while they can't be
   * read (MyDashLight not running, or a version without chores). Returns a function that stops it.
   */
  watchChores(onChores: (chores: ChoresPayload | null) => void): () => void;
  /** Checks a chore off, or opens it again. `by` is who did it, when it wasn't the kid it's for. */
  setChoreDone(chore: string, done: boolean, by?: string): Promise<void>;
  /** Adds a chore template (no `template`) or changes one. */
  saveChoreTemplate(fields: TemplateFields): Promise<void>;
  /** Removes a chore template; its chores that aren't done yet go too. */
  removeChoreTemplate(template: string): Promise<void>;
  /**
   * Calls `onLunch` with the lunches now and whenever they change; null while they can't be
   * read (MyDashLight not running, or a version without lunches). Returns a function that stops it.
   */
  watchLunch(onLunch: (lunch: LunchPayload | null) => void): () => void;
  /** Saves a kid's lunch on some school days; null takes the picks away, back to the kid's default. */
  setLunch(kid: string, dates: string[], lunch: Lunch | null): Promise<void>;
  /** Saves what the school serves on a day, for each of the kids; an empty dish removes it. */
  setLunchMenu(kids: string[], date: string, dish: string, details: string): Promise<void>;
  /** Changes are saved for real (false in the offline preview). */
  readonly saves: boolean;
  /** Home Assistant pushes each new plan, so the plan on screen is current. */
  readonly live: boolean;
}

export class BackendError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "BackendError";
  }
}

/** The part of a Home Assistant WebSocket connection the board uses. */
export interface HassConnection {
  sendMessagePromise<T>(message: Record<string, unknown>): Promise<T>;
  subscribeMessage<T>(
    callback: (result: T) => void,
    message: Record<string, unknown>,
    options?: { resubscribe?: boolean },
  ): Promise<() => Promise<void>>;
  addEventListener?(event: "ready" | "disconnected", cb: () => void): void;
  removeEventListener?(event: "ready" | "disconnected", cb: () => void): void;
}

const DOMAIN = "mydashlight";
/** Days to show: today and the six after it, all the backend plans. */
export const DAYS = 7;
/** How often to read the plan when Home Assistant can't push changes. It reads what's already planned, so it's cheap. */
export const POLL_MS = 30_000;

function toError(err: unknown): BackendError {
  if (err instanceof BackendError) return err;
  if (err && typeof err === "object") {
    const e = err as { code?: unknown; message?: unknown };
    if (typeof e.message === "string") return new BackendError(String(e.code ?? "error"), e.message);
  }
  if (typeof err === "number") {
    // home-assistant-js-websocket rejects with a number when the connection drops.
    return new BackendError("connection_lost", "Lost the connection to Home Assistant.");
  }
  return new BackendError("error", String(err));
}

export class HassBackend implements Backend {
  readonly saves = true;
  private readonly conn: HassConnection;
  private listeners = new Set<{ onPlan: (p: Plan) => void; onError: (e: BackendError) => void }>();
  private timer: ReturnType<typeof setInterval> | null = null;
  private unsubscribe: (() => Promise<void>) | null = null;
  private pushing = false;
  private reading: Promise<void> | null = null;
  private readonly onVisible = (): void => {
    if (typeof document === "undefined" || document.visibilityState === "visible") void this.refresh();
  };
  private readonly onReady = (): void => void this.refresh();
  private readonly onDisconnected = (): void =>
    this.fail(new BackendError("connection_lost", "Lost the connection to Home Assistant."));

  get live(): boolean {
    return this.pushing;
  }

  constructor(conn: HassConnection) {
    this.conn = conn;
  }

  watch(onPlan: (plan: Plan) => void, onError: (err: BackendError) => void): () => void {
    const l = { onPlan, onError };
    this.listeners.add(l);
    if (this.listeners.size === 1) this.start();
    else void this.refresh();
    return () => {
      this.listeners.delete(l);
      if (!this.listeners.size) this.stop();
    };
  }

  private start(): void {
    void this.refresh();
    void this.trySubscribe();
    this.timer = setInterval(() => {
      if (!this.pushing) void this.refresh();
    }, POLL_MS);
    if (typeof document !== "undefined") document.addEventListener("visibilitychange", this.onVisible);
    this.conn.addEventListener?.("ready", this.onReady);
    this.conn.addEventListener?.("disconnected", this.onDisconnected);
  }

  private stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    if (typeof document !== "undefined") document.removeEventListener("visibilitychange", this.onVisible);
    this.conn.removeEventListener?.("ready", this.onReady);
    this.conn.removeEventListener?.("disconnected", this.onDisconnected);
    const unsub = this.unsubscribe;
    this.unsubscribe = null;
    this.pushing = false;
    if (unsub) void unsub().catch(() => undefined);
  }

  /** Live updates, when this version of MyDashLight pushes them (0.5 and later). Otherwise the board polls. */
  private async trySubscribe(): Promise<void> {
    try {
      this.unsubscribe = await this.conn.subscribeMessage<{ plan: Plan | null }>(
        (msg) => {
          this.pushing = true;
          if (msg.plan) this.emit(msg.plan);
          else this.fail(new BackendError("not_running", "MyDashLight isn’t running right now."));
        },
        { type: `${DOMAIN}/rides/subscribe` },
        { resubscribe: true },
      );
    } catch {
      this.pushing = false;
    }
  }

  private fail(e: BackendError): void {
    for (const l of this.listeners) l.onError(e);
  }

  private emit(plan: Plan): void {
    for (const l of this.listeners) l.onPlan(plan);
  }

  refresh(): Promise<void> {
    // Taps and timers can ask at the same moment: one read answers both.
    if (this.reading) return this.reading;
    this.reading = this.read().finally(() => {
      this.reading = null;
    });
    return this.reading;
  }

  private async read(): Promise<void> {
    try {
      const res = await this.conn.sendMessagePromise<{ response: Plan }>({
        type: "call_service",
        domain: DOMAIN,
        service: "get_plan",
        service_data: { days: DAYS },
        return_response: true,
      });
      this.emit(res.response);
    } catch (err) {
      this.fail(toError(err));
    }
  }

  private async call(service: string, data: Record<string, unknown>): Promise<void> {
    try {
      await this.conn.sendMessagePromise({ type: "call_service", domain: DOMAIN, service, service_data: data });
    } catch (err) {
      throw toError(err);
    }
    // The action replans before it returns; read the new plan unless it's pushed.
    if (!this.pushing) await this.refresh();
  }

  setRide(event: string, side: Side | "both", driver: string, scope: Scope): Promise<void> {
    return this.call("set_ride", { event, side, driver, scope });
  }

  setStay(event: string, stay: boolean, scope: Scope): Promise<void> {
    return this.call("set_stay", { event, stay, scope });
  }

  setAttending(event: string, attending: boolean, scope: Scope): Promise<void> {
    return this.call("set_attending", { event, attending, scope });
  }

  setArriveBy(event: string, minutes: number | null, scope: Scope): Promise<void> {
    return this.call("set_arrive_by", minutes == null ? { event, scope } : { event, time: timeField(minutes), scope });
  }

  setTakeAlong(event: string, kids: string[], scope: Scope, side: Side | "both" = "drop"): Promise<void> {
    return this.call("set_take_along", { event, kids, scope, side });
  }

  setTakes(event: string, minutes: number | null, scope: Scope): Promise<void> {
    return this.call("set_takes", minutes == null ? { event, scope } : { event, minutes, scope });
  }

  applySuggestion(id: string): Promise<void> {
    return this.call("apply_suggestion", { suggestion: id });
  }

  watchChores(onChores: (chores: ChoresPayload | null) => void): () => void {
    let stopped = false;
    let unsub: (() => Promise<void>) | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;
    const read = async (): Promise<void> => {
      try {
        const res = await this.conn.sendMessagePromise<{ response: ChoresPayload }>({
          type: "call_service",
          domain: DOMAIN,
          service: "get_chores",
          service_data: {},
          return_response: true,
        });
        if (!stopped) onChores(res.response ?? null);
      } catch {
        if (!stopped) onChores(null);
      }
    };
    void (async () => {
      try {
        const u = await this.conn.subscribeMessage<{ chores: ChoresPayload | null }>(
          (msg) => {
            if (!stopped) onChores(msg.chores);
          },
          { type: `${DOMAIN}/chores/subscribe` },
          { resubscribe: true },
        );
        if (stopped) void u().catch(() => undefined);
        else unsub = u;
      } catch {
        // A version that can't push chores: read them now and then.
        if (stopped) return;
        void read();
        timer = setInterval(() => void read(), POLL_MS);
      }
    })();
    return () => {
      stopped = true;
      if (timer) clearInterval(timer);
      if (unsub) void unsub().catch(() => undefined);
    };
  }

  watchLunch(onLunch: (lunch: LunchPayload | null) => void): () => void {
    let stopped = false;
    let unsub: (() => Promise<void>) | null = null;
    void (async () => {
      try {
        const u = await this.conn.subscribeMessage<{ lunch: LunchPayload | null }>(
          (msg) => {
            if (!stopped) onLunch(msg.lunch);
          },
          { type: `${DOMAIN}/lunch/subscribe` },
          { resubscribe: true },
        );
        if (stopped) void u().catch(() => undefined);
        else unsub = u;
      } catch {
        // A version of MyDashLight without lunches.
        if (!stopped) onLunch(null);
      }
    })();
    return () => {
      stopped = true;
      if (unsub) void unsub().catch(() => undefined);
    };
  }

  async setLunch(kid: string, dates: string[], lunch: Lunch | null): Promise<void> {
    await this.choreCall("set_lunch", { kid, dates, lunch: lunch ?? "default" });
  }

  async setLunchMenu(kids: string[], date: string, dish: string, details: string): Promise<void> {
    await this.choreCall("set_lunch_menu", { kids, date, menu: dish, details });
  }

  async setChoreDone(chore: string, done: boolean, by?: string): Promise<void> {
    await this.choreCall("set_chore_done", { chore, done, ...(done && by ? { by } : {}) });
  }

  async saveChoreTemplate(fields: TemplateFields): Promise<void> {
    await this.choreCall("save_chore_template", { ...fields });
  }

  async removeChoreTemplate(template: string): Promise<void> {
    await this.choreCall("remove_chore_template", { template });
  }

  /** Chore actions read the chores again themselves, and the change is pushed to the board. */
  private async choreCall(service: string, data: Record<string, unknown>): Promise<void> {
    try {
      await this.conn.sendMessagePromise({ type: "call_service", domain: DOMAIN, service, service_data: data });
    } catch (err) {
      throw toError(err);
    }
  }
}

/** The offline preview: a fixed week. Changes show a note instead of saving. */
export class PreviewBackend implements Backend {
  readonly saves = false;
  readonly live = false;
  private readonly plan: Plan;
  private chores: ChoresPayload | null;
  private onChores: ((chores: ChoresPayload | null) => void) | null = null;
  private lunch: LunchPayload | null;
  private onLunch: ((lunch: LunchPayload | null) => void) | null = null;

  constructor(plan: Plan, chores: ChoresPayload | null = null, lunch: LunchPayload | null = null) {
    this.plan = plan;
    this.chores = chores;
    this.lunch = lunch;
  }

  watchLunch(onLunch: (lunch: LunchPayload | null) => void): () => void {
    this.onLunch = onLunch;
    queueMicrotask(() => onLunch(this.lunch));
    return () => {
      this.onLunch = null;
    };
  }

  /** Lunch picks stay in this page only, so the preview can be tried out. */
  async setLunch(kid: string, dates: string[], lunch: Lunch | null): Promise<void> {
    const data = this.lunch;
    if (!data) return this.nope();
    const kids = data.kids.map((k) => {
      if (k.id !== kid) return k;
      const picks = { ...k.picks };
      for (const d of dates) {
        if (lunch) picks[d] = lunch;
        else delete picks[d];
      }
      return { ...k, picks };
    });
    this.lunch = { ...data, kids };
    const emit = this.onLunch;
    if (emit) queueMicrotask(() => emit(this.lunch));
  }

  /** Menus too stay in this page only. */
  async setLunchMenu(kids: string[], date: string, dish: string, details: string): Promise<void> {
    const data = this.lunch;
    if (!data) return this.nope();
    this.lunch = {
      ...data,
      kids: data.kids.map((k) => {
        if (!kids.includes(k.id)) return k;
        const menus = { ...k.menus };
        if (dish.trim()) menus[date] = { dish: dish.trim(), details: details.trim() };
        else delete menus[date];
        return { ...k, menus };
      }),
    };
    const emit = this.onLunch;
    if (emit) queueMicrotask(() => emit(this.lunch));
  }

  watchChores(onChores: (chores: ChoresPayload | null) => void): () => void {
    this.onChores = onChores;
    queueMicrotask(() => onChores(this.chores));
    return () => {
      this.onChores = null;
    };
  }

  /** Chore changes stay in this page only, so the preview can be tried out. */
  async setChoreDone(chore: string, done: boolean, by?: string): Promise<void> {
    const data = this.chores;
    if (!data) return this.nope();
    const chores = data.chores.map((c) => {
      if (c.id !== chore) return c;
      if (!done) return { ...c, state: c.due && c.due < data.today ? ("overdue" as const) : ("open" as const), done_at: null, done_by: null };
      return {
        ...c,
        state: c.state === "overdue" ? ("late" as const) : ("done" as const),
        done_at: new Date().toISOString(),
        done_by: by ?? c.kid,
      };
    });
    this.setChores({ ...data, chores });
  }

  async saveChoreTemplate(fields: TemplateFields): Promise<void> {
    const data = this.chores;
    if (!data) return this.nope();
    const old = data.templates.find((t) => t.id === fields.template);
    const made: ChoreTemplate = {
      ...(old ?? { problems: [] }),
      id: old?.id ?? `sample-t${data.templates.length}`,
      repeats: fields.repeats,
      title: fields.title,
      icon: fields.icon || null,
      details: fields.details,
      who: fields.who,
      take_turns: fields.take_turns,
      days: fields.days,
      every: fields.every,
      paused: fields.paused,
      problems: [],
    };
    const templates = old ? data.templates.map((t) => (t === old ? made : t)) : [...data.templates, made];
    this.setChores({ ...data, templates });
  }

  async removeChoreTemplate(template: string): Promise<void> {
    const data = this.chores;
    if (!data) return this.nope();
    this.setChores({ ...data, templates: data.templates.filter((t) => t.id !== template) });
  }

  private setChores(chores: ChoresPayload): void {
    this.chores = chores;
    const emit = this.onChores;
    if (emit) queueMicrotask(() => emit(this.chores));
  }

  watch(onPlan: (plan: Plan) => void): () => void {
    queueMicrotask(() => onPlan(this.plan));
    return () => undefined;
  }

  async refresh(): Promise<void> {}

  private nope(): Promise<void> {
    return Promise.reject(
      new BackendError("preview", "This is a preview, so changes aren’t saved. In Home Assistant they go into the event’s notes."),
    );
  }

  setRide(): Promise<void> {
    return this.nope();
  }

  setStay(): Promise<void> {
    return this.nope();
  }

  setAttending(): Promise<void> {
    return this.nope();
  }

  setArriveBy(): Promise<void> {
    return this.nope();
  }

  setTakeAlong(): Promise<void> {
    return this.nope();
  }

  setTakes(): Promise<void> {
    return this.nope();
  }

  applySuggestion(): Promise<void> {
    return this.nope();
  }
}
