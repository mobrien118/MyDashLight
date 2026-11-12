// The board against the real home-assistant-js-websocket Connection, with a pretend Home
// Assistant on the other end of the socket: what happens when Home Assistant restarts.

import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { Connection } from "home-assistant-js-websocket";
import { BackendError, HassBackend, POLL_MS, problemLine, type HassConnection } from "../src/backend.ts";
import type { ChoresPayload } from "../src/chores.ts";
import { keepAlive, type PingableConnection } from "../src/heartbeat.ts";
import type { Plan } from "../src/types.ts";
import { sampleWeek } from "./helpers.ts";

type Msg = Record<string, unknown> & { id: number; type: string };

const CHORES: ChoresPayload = {
  updated: "2026-11-11T20:00:00Z",
  today: "2026-11-11",
  time_zone: "America/Chicago",
  days_ahead: 7,
  kids: [{ id: "ava", name: "Ava" }],
  chores: [],
  templates: [],
  status: { ok: true, error: null, needs: null },
};

/** Home Assistant, as far as the socket can tell. */
class FakeHA {
  up = true;
  /** MyDashLight has loaded: its commands and actions exist. */
  loaded = true;
  plan: Plan = sampleWeek();
  chores: ChoresPayload = CHORES;
  sockets: FakeSocket[] = [];
  /** Answer pings (false: a socket that looks open but gets nothing through). */
  answers = true;

  socket(): FakeSocket {
    if (!this.up) throw 1; // ERR_CANNOT_CONNECT
    const s = new FakeSocket(this);
    this.sockets.push(s);
    return s;
  }

  /** Home Assistant goes down: every socket closes. */
  stop(): void {
    this.up = false;
    this.loaded = false;
    for (const s of this.sockets) s.serverClose();
    this.sockets = [];
  }

  /** Something changed: push it to every live subscription. */
  changePlan(plan: Plan): void {
    this.plan = plan;
    for (const s of this.sockets) s.pushPlan();
  }

  changeChores(chores: ChoresPayload): void {
    this.chores = chores;
    for (const s of this.sockets) s.pushChores();
  }
}

class FakeSocket {
  readonly OPEN = 1;
  readyState = 1;
  haVersion = "2026.11.0";
  private ha: FakeHA;
  private listeners = new Map<string, ((ev: { data?: string }) => void)[]>();
  private subs = new Map<number, string>();

  constructor(ha: FakeHA) {
    this.ha = ha;
  }

  addEventListener(type: string, cb: (ev: { data?: string }) => void): void {
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), cb]);
  }

  removeEventListener(type: string, cb: (ev: { data?: string }) => void): void {
    this.listeners.set(
      type,
      (this.listeners.get(type) ?? []).filter((x) => x !== cb),
    );
  }

  private fire(type: string, ev: { data?: string } = {}): void {
    for (const cb of this.listeners.get(type) ?? []) cb(ev);
  }

  private reply(msg: Record<string, unknown>): void {
    queueMicrotask(() => {
      if (this.readyState === 1) this.fire("message", { data: JSON.stringify(msg) });
    });
  }

  send(raw: string): void {
    const msg = JSON.parse(raw) as Msg;
    if (msg.type === "ping") {
      if (this.ha.answers) this.reply({ id: msg.id, type: "pong" });
      return;
    }
    if (msg.type === "unsubscribe_events") {
      this.subs.delete(msg["subscription"] as number);
      this.reply({ id: msg.id, type: "result", success: true, result: null });
      return;
    }
    if (msg.type.startsWith("mydashlight/")) {
      if (!this.ha.loaded) {
        this.reply({ id: msg.id, type: "result", success: false, error: { code: "unknown_command", message: "Unknown command." } });
        return;
      }
      this.subs.set(msg.id, msg.type);
      this.reply({ id: msg.id, type: "result", success: true, result: null });
      this.pushTo(msg.id);
      return;
    }
    if (msg.type === "call_service") {
      if (!this.ha.loaded) {
        const error = { code: "service_not_found", message: `Action mydashlight.${String(msg["service"])} not found.` };
        this.reply({ id: msg.id, type: "result", success: false, error });
        return;
      }
      const response = msg["service"] === "get_plan" ? this.ha.plan : msg["service"] === "get_chores" ? this.ha.chores : null;
      this.reply({ id: msg.id, type: "result", success: true, result: { context: {}, response } });
    }
  }

  private pushTo(id: number): void {
    const type = this.subs.get(id);
    const event =
      type === "mydashlight/rides/subscribe"
        ? { plan: this.ha.plan }
        : type === "mydashlight/chores/subscribe"
          ? { chores: this.ha.chores }
          : { lunch: null };
    this.reply({ id, type: "event", event });
  }

  pushPlan(): void {
    for (const [id, type] of this.subs) if (type === "mydashlight/rides/subscribe") this.pushTo(id);
  }

  pushChores(): void {
    for (const [id, type] of this.subs) if (type === "mydashlight/chores/subscribe") this.pushTo(id);
  }

  serverClose(): void {
    if (this.readyState !== 1) return;
    this.readyState = 3;
    this.fire("close");
  }

  close(): void {
    this.serverClose();
  }
}

async function connect(ha: FakeHA): Promise<Connection> {
  const options = {
    setupRetry: 0,
    auth: undefined,
    createSocket: async () => ha.socket() as unknown as WebSocket,
  };
  return new Connection((await options.createSocket()) as never, options as never);
}

/** Let the socket's replies and the reconnect's zero-delay timer run. */
async function settle(): Promise<void> {
  for (let i = 0; i < 5; i++) await new Promise((r) => setTimeout(r, 0));
}

function watchBoard(b: HassBackend): { plans: Plan[]; error: () => BackendError | null; stop: () => void } {
  // Like the board: an error shows until the next plan arrives.
  let error: BackendError | null = null;
  const plans: Plan[] = [];
  const stop = b.watch(
    (p) => {
      plans.push(p);
      error = null;
    },
    (e) => (error = e),
  );
  return { plans, error: () => error, stop };
}

test("after Home Assistant restarts, the board clears its banner and gets live updates again", async (t) => {
  t.mock.timers.enable({ apis: ["setInterval"] });
  const ha = new FakeHA();
  const conn = await connect(ha);
  const b = new HassBackend(conn as unknown as HassConnection);
  const board = watchBoard(b);
  await settle();
  assert.equal(b.live, true);
  assert.equal(board.error(), null);

  // Home Assistant restarts. It takes connections again before MyDashLight has loaded.
  ha.stop();
  assert.equal(board.error()?.code, "connection_lost");
  assert.equal(problemLine(board.error()!), "Can’t reach Home Assistant");
  ha.up = true;
  await settle();
  assert.ok(board.error(), "MyDashLight isn't loaded yet, so the plan can't be read");
  assert.equal(b.live, false);

  // MyDashLight loads. Within one poll the plan is read and the banner goes.
  ha.loaded = true;
  t.mock.timers.tick(POLL_MS);
  await settle();
  assert.equal(board.error(), null);
  assert.equal(b.live, true, "subscribed again");

  // And a change made somewhere else shows up right away.
  const changed = { ...ha.plan, updated: "2026-11-11T23:00:00+00:00", time_zone: "America/Denver" };
  const before = board.plans.length;
  ha.changePlan(changed);
  await settle();
  assert.equal(board.plans.length, before + 1);
  assert.equal(board.plans.at(-1)?.time_zone, "America/Denver");
  board.stop();
  conn.close();
});

test("a plain reconnect needs no poll: the banner goes as soon as the socket is back", async (t) => {
  t.mock.timers.enable({ apis: ["setInterval"] });
  const ha = new FakeHA();
  const conn = await connect(ha);
  const b = new HassBackend(conn as unknown as HassConnection);
  const board = watchBoard(b);
  await settle();
  for (const s of ha.sockets) s.serverClose();
  ha.sockets = ha.sockets.filter((s) => s.readyState === 1);
  assert.equal(board.error()?.code, "connection_lost");
  await settle();
  assert.equal(board.error(), null);
  assert.equal(b.live, true);
  board.stop();
  conn.close();
});

test("chores keep coming after a restart, and stay on screen while MyDashLight loads", async (t) => {
  t.mock.timers.enable({ apis: ["setInterval"] });
  const ha = new FakeHA();
  const conn = await connect(ha);
  const b = new HassBackend(conn as unknown as HassConnection);
  const got: (ChoresPayload | null)[] = [];
  const stop = b.watchChores((c) => got.push(c));
  await settle();
  assert.deepEqual(got, [CHORES]);

  ha.stop();
  ha.up = true;
  await settle();
  assert.deepEqual(got, [CHORES], "a failed read during the restart doesn't blank the chores");

  ha.loaded = true;
  t.mock.timers.tick(POLL_MS);
  await settle();
  const done = { ...CHORES, updated: "2026-11-11T23:05:00Z" };
  ha.changeChores(done);
  await settle();
  assert.equal(got.at(-1)?.updated, done.updated, "a kid's check-off elsewhere shows up");
  stop();
  conn.close();
});

test("a version without lunches still says there are none", async (t) => {
  t.mock.timers.enable({ apis: ["setInterval"] });
  const ha = new FakeHA();
  ha.loaded = false;
  const conn = await connect(ha);
  const b = new HassBackend(conn as unknown as HassConnection);
  const got: unknown[] = [];
  const stop = b.watchLunch((l) => got.push(l));
  await settle();
  assert.deepEqual(got, [null]);
  stop();
  conn.close();
});

test("the kitchen screen starts over when a ping goes unanswered", () => {
  mock.timers.enable({ apis: ["setInterval", "setTimeout"] });
  try {
    let reconnects = 0;
    let answer: (() => void) | null = null;
    const conn: PingableConnection = {
      connected: true,
      ping: () => new Promise<void>((r) => (answer = r)),
      reconnect: () => void reconnects++,
    };
    const stop = keepAlive(conn, 1000, 200);
    mock.timers.tick(1000);
    assert.ok(answer, "pinged");
    mock.timers.tick(200);
    assert.equal(reconnects, 1);
    stop();
  } finally {
    mock.timers.reset();
  }
});

test("an answered ping leaves the connection alone", async () => {
  mock.timers.enable({ apis: ["setInterval", "setTimeout"] });
  try {
    let reconnects = 0;
    const conn: PingableConnection = { connected: true, ping: () => Promise.resolve(), reconnect: () => void reconnects++ };
    const stop = keepAlive(conn, 1000, 200);
    mock.timers.tick(1000);
    await Promise.resolve();
    await Promise.resolve();
    mock.timers.tick(500);
    assert.equal(reconnects, 0);
    stop();
  } finally {
    mock.timers.reset();
  }
});
