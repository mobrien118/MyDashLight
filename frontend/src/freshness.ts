// The kitchen screen stays open for days. When MyDashLight is updated, Home Assistant restarts
// and serves a new build of the app, but the screen would keep running the old one until its
// nightly restart. So it asks which build is being served (after every reconnect, and every 10
// minutes in case it never noticed one) and reloads when it isn't the one it runs. It waits until
// nobody has touched the screen for a while, so it never reloads in the middle of an edit.

/** The part of home-assistant-js-websocket's Connection this uses. */
export interface VersionConnection {
  sendMessagePromise<T>(message: Record<string, unknown>): Promise<T>;
  addEventListener?(event: "ready", cb: () => void): void;
  removeEventListener?(event: "ready", cb: () => void): void;
}

export const CHECK_EVERY_MS = 10 * 60_000;
/** Right after a restart MyDashLight may not have loaded yet: ask again this often, a few times. */
export const RETRY_MS = 30_000;
export const RETRIES = 20;
/** How long nobody must have touched the screen before it reloads. */
export const IDLE_MS = 2 * 60_000;

export interface FreshnessOptions {
  /** Reloads the page to pick up `build`. */
  reload(build: string): void;
  /** Milliseconds since someone last touched the screen. */
  idleFor(): number;
  everyMs?: number;
  retryMs?: number;
  idleMs?: number;
}

/** The build this page runs: the `?v=` on its own script, which Home Assistant sets. */
export function buildOf(scriptUrl: string): string | null {
  try {
    return new URL(scriptUrl).searchParams.get("v");
  } catch {
    return null;
  }
}

/** Returns a function that stops it. Does nothing when the page doesn't know its own build. */
export function reloadOnUpdate(conn: VersionConnection, mine: string | null, opts: FreshnessOptions): () => void {
  if (!mine) return () => undefined;
  const everyMs = opts.everyMs ?? CHECK_EVERY_MS;
  const retryMs = opts.retryMs ?? RETRY_MS;
  const idleMs = opts.idleMs ?? IDLE_MS;
  let retry: ReturnType<typeof setTimeout> | null = null;
  let waiting: ReturnType<typeof setTimeout> | null = null;
  let tries = 0;
  let stopped = false;

  const reloadWhenIdle = (build: string): void => {
    if (stopped || waiting) return;
    const idle = opts.idleFor();
    if (idle >= idleMs) {
      opts.reload(build);
      return;
    }
    waiting = setTimeout(() => {
      waiting = null;
      reloadWhenIdle(build);
    }, idleMs - idle);
  };

  const check = async (): Promise<void> => {
    try {
      const served = await conn.sendMessagePromise<Record<string, string>>({ type: "mydashlight/app_version" });
      tries = 0;
      const build = served["kiosk.js"];
      if (!stopped && build && build !== mine) reloadWhenIdle(build);
    } catch {
      // Not loaded yet after a restart (or a version without this): ask again soon.
      if (stopped || retry || ++tries > RETRIES) return;
      retry = setTimeout(() => {
        retry = null;
        void check();
      }, retryMs);
    }
  };

  const onReady = (): void => {
    tries = 0;
    void check();
  };
  conn.addEventListener?.("ready", onReady);
  const timer = setInterval(() => void check(), everyMs);
  return () => {
    stopped = true;
    clearInterval(timer);
    if (retry) clearTimeout(retry);
    if (waiting) clearTimeout(waiting);
    conn.removeEventListener?.("ready", onReady);
  };
}
