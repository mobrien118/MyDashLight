import assert from "node:assert/strict";
import { test } from "node:test";
import { BackendError, HassBackend, PreviewBackend, type HassConnection } from "../src/backend.ts";
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
  await b.setArriveBy("football", 1035, "this");
  await b.setArriveBy("football", null, "this");
  await b.setStay("piano", false, "this");
  await b.setTakeAlong("piano", ["kid-b@group.calendar.google.com"], "this");
  await b.applySuggestion("2026-11-05|soccer|drop|mom");
  const calls = conn.sent.filter((m) => m["service"] !== "get_plan");
  assert.deepEqual(
    calls.map((m) => [m["service"], m["service_data"]]),
    [
      ["set_ride", { event: "soccer", side: "pick", driver: "mom", scope: "series" }],
      ["set_arrive_by", { event: "football", time: "17:15:00", scope: "this" }],
      ["set_arrive_by", { event: "football", scope: "this" }],
      ["set_stay", { event: "piano", stay: false, scope: "this" }],
      ["set_take_along", { event: "piano", kids: ["kid-b@group.calendar.google.com"], scope: "this" }],
      ["apply_suggestion", { suggestion: "2026-11-05|soccer|drop|mom" }],
    ],
  );
  // Without live updates, each change reads the new plan.
  assert.equal(conn.sent.filter((m) => m["service"] === "get_plan").length, 6);
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
