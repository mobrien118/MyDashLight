// The kitchen screen's own connection to Home Assistant. A Wi-Fi drop can leave the socket
// looking open while nothing gets through, and then the board would quietly stop changing. So it
// pings now and then, and starts over when Home Assistant doesn't answer.

/** The part of home-assistant-js-websocket's Connection this uses. */
export interface PingableConnection {
  readonly connected: boolean;
  ping(): Promise<unknown>;
  /** With `true`, drops the socket at once and connects again. */
  reconnect(force?: boolean): void;
}

export const PING_EVERY_MS = 60_000;
export const PING_TIMEOUT_MS = 15_000;

/** Returns a function that stops it. */
export function keepAlive(conn: PingableConnection, everyMs = PING_EVERY_MS, timeoutMs = PING_TIMEOUT_MS): () => void {
  let waiting: ReturnType<typeof setTimeout> | null = null;
  const timer = setInterval(() => {
    if (!conn.connected || waiting) return;
    let answered = false;
    waiting = setTimeout(() => {
      waiting = null;
      if (!answered && conn.connected) conn.reconnect(true);
    }, timeoutMs);
    const done = (): void => {
      answered = true;
      if (waiting) clearTimeout(waiting);
      waiting = null;
    };
    conn.ping().then(done, done);
  }, everyMs);
  return () => {
    clearInterval(timer);
    if (waiting) clearTimeout(waiting);
    waiting = null;
  };
}
