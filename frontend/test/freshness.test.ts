import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { buildOf, reloadOnUpdate, type VersionConnection } from "../src/freshness.ts";

class Conn implements VersionConnection {
  served: Record<string, string> | null = { "kiosk.js": "aaa", "panel.js": "ppp" };
  asked = 0;
  private ready: (() => void)[] = [];

  async sendMessagePromise<T>(message: Record<string, unknown>): Promise<T> {
    assert.equal(message["type"], "mydashlight/app_version");
    this.asked++;
    if (!this.served) throw { code: "unknown_command", message: "Unknown command." };
    return this.served as T;
  }

  addEventListener(_e: "ready", cb: () => void): void {
    this.ready.push(cb);
  }

  removeEventListener(_e: "ready", cb: () => void): void {
    this.ready = this.ready.filter((x) => x !== cb);
  }

  reconnected(): void {
    for (const cb of this.ready) cb();
  }
}

const flush = async (): Promise<void> => {
  for (let i = 0; i < 3; i++) await Promise.resolve();
};

test("the page knows its build from its own script address", () => {
  assert.equal(buildOf("https://ha.local:8123/mydashlight_app/kiosk.js?v=3f2a9c"), "3f2a9c");
  assert.equal(buildOf("https://ha.local:8123/mydashlight_app/kiosk.js"), null);
  assert.equal(buildOf("not a url"), null);
});

test("after a restart with a new build, the screen reloads once nobody is using it", async () => {
  mock.timers.enable({ apis: ["setInterval", "setTimeout"] });
  try {
    const conn = new Conn();
    const reloads: string[] = [];
    let idle = 0;
    const stop = reloadOnUpdate(conn, "aaa", { reload: (b) => reloads.push(b), idleFor: () => idle, idleMs: 1000, retryMs: 100 });

    // Home Assistant restarts with the update. MyDashLight hasn't loaded when the socket is back.
    conn.served = null;
    conn.reconnected();
    await flush();
    assert.equal(reloads.length, 0);

    // It loads, with the new build. Someone is tapping the screen, so it waits.
    conn.served = { "kiosk.js": "bbb", "panel.js": "qqq" };
    mock.timers.tick(100);
    await flush();
    assert.equal(reloads.length, 0);
    idle = 1000;
    mock.timers.tick(1000);
    assert.deepEqual(reloads, ["bbb"]);
    stop();
  } finally {
    mock.timers.reset();
  }
});

test("it checks now and then too, and leaves the same build alone", async () => {
  mock.timers.enable({ apis: ["setInterval", "setTimeout"] });
  try {
    const conn = new Conn();
    const reloads: string[] = [];
    const stop = reloadOnUpdate(conn, "aaa", { reload: (b) => reloads.push(b), idleFor: () => 1e9, everyMs: 5000 });
    mock.timers.tick(5000);
    await flush();
    assert.equal(conn.asked, 1);
    assert.equal(reloads.length, 0);
    conn.served = { "kiosk.js": "ccc" };
    mock.timers.tick(5000);
    await flush();
    assert.deepEqual(reloads, ["ccc"]);
    stop();
  } finally {
    mock.timers.reset();
  }
});

test("a page that doesn't know its build never reloads", async () => {
  const conn = new Conn();
  const stop = reloadOnUpdate(conn, null, { reload: () => assert.fail("no reload"), idleFor: () => 1e9 });
  conn.reconnected();
  await flush();
  assert.equal(conn.asked, 0);
  stop();
});
