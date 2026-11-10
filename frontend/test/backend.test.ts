import assert from "node:assert/strict";
import { test } from "node:test";
import { BackendError, HassBackend, PreviewBackend, type HassConnection } from "../src/backend.ts";
import type { ChoresPayload } from "../src/chores.ts";
import type { Plan } from "../src/types.ts";
import { sampleWeek } from "./helpers.ts";

class FakeConnection implements HassConnection {
  sent: Record<string, unknown>[] = [];
  plan: Plan = sampleWeek();
  pushes = false;
  push: ((msg: { plan: Plan | null }) => void) | null = null;
  fail: unknown = null;

  async sendMessagePromise<T>(message: Record<string, unknown>): Promise<T> {
    this.sent.push(message);
    if (this.fail) throw this.fail;
    if (message["service"] === "get_plan") return { response: this.plan } as T;
    return { context: {} } as T;
  }

  async subscribeMessage<T>(callback: (result: T) => void, message: Record<string, unknown>): Promise<() => Promise<void>> {
    this.sent.push(message);
    if (!this.pushes) throw { code: "unknown_command", message: "Unknown command." };
    this.push = callback as unknown as (msg: { plan: Plan | null }) => void;
    return async () => {
      this.push = null;
    };
  }
}

const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 0));

test("reads the week's plan, and changes rides through the mydashlight actions", async () => {
  const conn = new FakeConnection();
  const b = new HassBackend(conn);
  const plans: Plan[] = [];
  const stop = b.watch(
    (p) => plans.push(p),
    () => assert.fail("no error expected"),
  );
  await tick();
  assert.equal(plans.length, 1);
  assert.deepEqual(conn.sent[0], {
    type: "call_service",
    domain: "mydashlight",
    service: "get_plan",
    service_data: { days: 7 },
    return_response: true,
  });
  assert.deepEqual(conn.sent[1], { type: "mydashlight/rides/subscribe" });

  conn.sent = [];
  await b.setRide("soccer", "pick", "mom", "series");
  await b.setRide("piano", "both", "dad", "this", true);
  await b.setArriveBy("football", 1035, "this");
  await b.setArriveBy("football", null, "this");
  await b.setStay("piano", false, "this");
  await b.setTakeAlong("piano", ["kid-b@group.calendar.google.com"], "this");
  await b.setTakeAlong("piano", ["dad"], "this", "pick");
  await b.setTakes("errand", 10, "this");
  await b.setTakes("errand", null, "this");
  await b.applySuggestion("2026-11-05|soccer|drop|mom");
  const calls = conn.sent.filter((m) => m["service"] !== "get_plan");
  assert.deepEqual(
    calls.map((m) => [m["service"], m["service_data"]]),
    [
      ["set_ride", { event: "soccer", side: "pick", driver: "mom", scope: "series" }],
      ["set_ride", { event: "piano", side: "both", driver: "dad", scope: "this", stay: true }],
      ["set_arrive_by", { event: "football", time: "17:15:00", scope: "this" }],
      ["set_arrive_by", { event: "football", scope: "this" }],
      ["set_stay", { event: "piano", stay: false, scope: "this" }],
      ["set_take_along", { event: "piano", kids: ["kid-b@group.calendar.google.com"], scope: "this", side: "drop" }],
      ["set_take_along", { event: "piano", kids: ["dad"], scope: "this", side: "pick" }],
      ["set_takes", { event: "errand", minutes: 10, scope: "this" }],
      ["set_takes", { event: "errand", scope: "this" }],
      ["apply_suggestion", { suggestion: "2026-11-05|soccer|drop|mom" }],
    ],
  );
  // Without live updates, each change reads the new plan.
  assert.equal(conn.sent.filter((m) => m["service"] === "get_plan").length, 10);
  stop();
});

test("uses live updates when MyDashLight sends them", async () => {
  const conn = new FakeConnection();
  conn.pushes = true;
  const b = new HassBackend(conn);
  const plans: (Plan | null)[] = [];
  const errors: BackendError[] = [];
  const stop = b.watch(
    (p) => plans.push(p),
    (e) => errors.push(e),
  );
  await tick();
  const pushed = { ...conn.plan, updated: "2026-11-05T22:11:00+00:00" };
  conn.push!({ plan: pushed });
  assert.equal(plans.at(-1), pushed);

  conn.sent = [];
  await b.setStay("piano", false, "this");
  // The change is pushed, so it isn't read again.
  assert.deepEqual(
    conn.sent.map((m) => m["service"]),
    ["set_stay"],
  );

  conn.push!({ plan: null });
  assert.equal(errors.at(-1)?.code, "not_running");
  stop();
  assert.equal(conn.push, null);
});

test("errors from Home Assistant come back readable", async () => {
  const conn = new FakeConnection();
  const b = new HassBackend(conn);
  const errors: BackendError[] = [];
  conn.fail = { code: "service_validation_error", message: "That event isn't in the plan any more." };
  const stop = b.watch(
    () => undefined,
    (e) => errors.push(e),
  );
  await tick();
  assert.equal(errors[0]?.message, "That event isn't in the plan any more.");
  await assert.rejects(b.setStay("piano", true, "this"), (e: unknown) => e instanceof BackendError && e.code === "service_validation_error");
  conn.fail = 3; // home-assistant-js-websocket's "connection lost"
  await assert.rejects(b.applySuggestion("x"), (e: unknown) => e instanceof BackendError && e.code === "connection_lost");
  stop();
});

test("the preview never saves", async () => {
  const b = new PreviewBackend(sampleWeek());
  let got: Plan | null = null;
  b.watch((p) => (got = p));
  await tick();
  assert.ok(got);
  assert.equal(b.saves, false);
  await assert.rejects(b.setStay(), (e: unknown) => e instanceof BackendError && e.code === "preview");
});

const CHORES: ChoresPayload = {
  updated: "2026-11-04T20:00:00Z",
  today: "2026-11-04",
  time_zone: "America/Chicago",
  days_ahead: 7,
  kids: [{ id: "ava", name: "Ava" }],
  chores: [],
  templates: [],
  status: { ok: true, error: null, needs: null },
};

class ChoreConnection implements HassConnection {
  sent: Record<string, unknown>[] = [];
  pushes = false;
  push: ((msg: { chores: ChoresPayload | null }) => void) | null = null;

  async sendMessagePromise<T>(message: Record<string, unknown>): Promise<T> {
    this.sent.push(message);
    if (message["service"] === "get_chores") return { response: CHORES } as T;
    return { context: {} } as T;
  }

  async subscribeMessage<T>(callback: (result: T) => void, message: Record<string, unknown>): Promise<() => Promise<void>> {
    this.sent.push(message);
    if (!this.pushes) throw { code: "unknown_command", message: "Unknown command." };
    this.push = callback as unknown as (msg: { chores: ChoresPayload | null }) => void;
    return async () => {
      this.push = null;
    };
  }
}

test("chores come live when MyDashLight pushes them, and change through the chore actions", async () => {
  const conn = new ChoreConnection();
  conn.pushes = true;
  const b = new HassBackend(conn);
  const got: (ChoresPayload | null)[] = [];
  const stop = b.watchChores((c) => got.push(c));
  await tick();
  assert.deepEqual(conn.sent[0], { type: "mydashlight/chores/subscribe" });
  conn.push!({ chores: CHORES });
  conn.push!({ chores: null });
  assert.deepEqual(got, [CHORES, null]);

  conn.sent = [];
  await b.setChoreDone("task-1", true);
  await b.setChoreDone("task-1", true, "mom");
  await b.setChoreDone("task-1", false, "mom");
  await b.saveChoreTemplate({
    repeats: "weekly",
    title: "Recycling",
    icon: "",
    details: "",
    who: ["ava"],
    take_turns: false,
    days: "Fri",
    every: 1,
    paused: false,
  });
  await b.removeChoreTemplate("t1");
  assert.deepEqual(
    conn.sent.map((m) => [m["service"], m["service_data"]]),
    [
      ["set_chore_done", { chore: "task-1", done: true }],
      ["set_chore_done", { chore: "task-1", done: true, by: "mom" }],
      ["set_chore_done", { chore: "task-1", done: false }],
      [
        "save_chore_template",
        { repeats: "weekly", title: "Recycling", icon: "", details: "", who: ["ava"], take_turns: false, days: "Fri", every: 1, paused: false },
      ],
      ["remove_chore_template", { template: "t1" }],
    ],
  );
  stop();
  assert.equal(conn.push, null);
});

test("chores are read with get_chores when they can't be pushed", async () => {
  const conn = new ChoreConnection();
  const b = new HassBackend(conn);
  const got: (ChoresPayload | null)[] = [];
  const stop = b.watchChores((c) => got.push(c));
  await tick();
  await tick();
  assert.deepEqual(got, [CHORES]);
  assert.equal(conn.sent.at(-1)?.["service"], "get_chores");
  stop();
});

test("the preview checks chores off on the page only", async () => {
  const chores = { ...CHORES, chores: [{ ...sampleChore(), id: "c1" }] };
  const b = new PreviewBackend(sampleWeek(), chores);
  const got: (ChoresPayload | null)[] = [];
  const stop = b.watchChores((c) => got.push(c));
  await tick();
  await b.setChoreDone("c1", true);
  await tick();
  assert.equal(got.at(-1)?.chores[0]?.state, "done");
  await b.setChoreDone("c1", false);
  await tick();
  assert.equal(got.at(-1)?.chores[0]?.state, "open");
  stop();
});

function sampleChore(): ChoresPayload["chores"][number] {
  return {
    id: "c",
    kid: "ava",
    title: "Make bed",
    icon: "🛏️",
    details: "",
    repeats: "daily",
    due: "2026-11-04",
    shows_from: null,
    state: "open",
    done_at: null,
    missed: 0,
    points: null,
    template: null,
    order: 0,
  };
}
