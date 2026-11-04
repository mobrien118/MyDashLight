// How the board reads the plan and saves ride changes.
//
// In Home Assistant, every change is a `mydashlight` action, which saves it in the event's notes
// on Google and replans. The board never keeps ride data of its own.

import { timeField } from "./format.ts";
import type { Plan, Scope, Side } from "./types.ts";

export interface Backend {
  /** Calls `onPlan` with the plan now and whenever it changes. Returns a function that stops it. */
  watch(onPlan: (plan: Plan) => void, onError: (err: BackendError) => void): () => void;
  /** Reads the plan again now. */
  refresh(): Promise<void>;
  setRide(event: string, side: Side | "both", driver: string, scope: Scope): Promise<void>;
  setStay(event: string, stay: boolean, scope: Scope): Promise<void>;
  /** `minutes` past midnight, or null to go back to a few minutes before the start. */
  setArriveBy(event: string, minutes: number | null, scope: Scope): Promise<void>;
  setTakeAlong(event: string, kids: string[], scope: Scope): Promise<void>;
  /** Going (true) or skipping this one (false). */
  setAttending(event: string, attending: boolean, scope: Scope): Promise<void>;
  applySuggestion(id: string): Promise<void>;
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

  setTakeAlong(event: string, kids: string[], scope: Scope): Promise<void> {
    return this.call("set_take_along", { event, kids, scope });
  }

  applySuggestion(id: string): Promise<void> {
    return this.call("apply_suggestion", { suggestion: id });
  }
}

/** The offline preview: a fixed week. Changes show a note instead of saving. */
export class PreviewBackend implements Backend {
  readonly saves = false;
  readonly live = false;
  private readonly plan: Plan;

  constructor(plan: Plan) {
    this.plan = plan;
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

  applySuggestion(): Promise<void> {
    return this.nope();
  }
}
