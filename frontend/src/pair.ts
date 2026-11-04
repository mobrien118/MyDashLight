// Pairing a screen, the parts with no page around them: talking to MyDashLight and the code's
// look. The screen is `pairing.ts` (its QR code is `qr.ts`); the approving side is `approve.ts`.

import type { AuthData } from "home-assistant-js-websocket";

export const DOMAIN = "mydashlight";
export const PAIR_START = `/api/${DOMAIN}/pair`;
export const PAIR_POLL = `/api/${DOMAIN}/pair/poll`;
/** The page an admin approves a screen on: the Rides sidebar item, opened with `?pair=CODE`. */
export const APPROVE_PATH = `/${DOMAIN}`;
export const APPROVE_PARAM = "pair";

export interface PairStart {
  code: string;
  secret: string;
  expires_in: number;
  interval: number;
}

interface IssuedAuth {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  client_id: string;
}

export type PollResult = { status: "pending" } | { status: "expired" } | { status: "paired"; auth: AuthData };

/** `KQ7M4TXP` as people read it: `KQ7M-4TXP`. */
export function displayCode(code: string): string {
  return code.length > 4 ? `${code.slice(0, 4)}-${code.slice(4)}` : code;
}

/** What someone typed, as a code: capitals, no spaces or dashes. */
export function normalizeCode(text: string): string {
  return text.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/** The address the QR code opens: the approving page with the code filled in. */
export function approveUrl(origin: string, code: string): string {
  return `${origin}${APPROVE_PATH}?${APPROVE_PARAM}=${encodeURIComponent(code)}`;
}

/** The sign-in the screen collects, in the shape Home Assistant's own pages save it. */
export function toAuthData(hassUrl: string, issued: IssuedAuth, now = Date.now()): AuthData {
  return {
    hassUrl,
    clientId: issued.client_id,
    access_token: issued.access_token,
    refresh_token: issued.refresh_token,
    expires_in: issued.expires_in,
    expires: now + issued.expires_in * 1000,
  };
}

export class PairError extends Error {
  readonly busy: boolean;
  constructor(message: string, busy = false) {
    super(message);
    this.busy = busy;
  }
}

/** Asks Home Assistant for a new code to show. */
export async function startPairing(fetchFn: typeof fetch = fetch): Promise<PairStart> {
  const res = await fetchFn(PAIR_START, { method: "POST", cache: "no-store" });
  if (res.status === 429) throw new PairError("Too many screens are asking to pair right now.", true);
  if (!res.ok) throw new PairError(`Home Assistant answered ${res.status}.`);
  return (await res.json()) as PairStart;
}

/** Whether this screen's code has been approved yet; once it has, the sign-in. */
export async function pollPairing(secret: string, hassUrl: string, fetchFn: typeof fetch = fetch): Promise<PollResult> {
  const res = await fetchFn(PAIR_POLL, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret }),
  });
  if (res.status === 404) return { status: "expired" };
  if (!res.ok) throw new PairError(`Home Assistant answered ${res.status}.`);
  const body = (await res.json()) as { status: string; auth?: IssuedAuth };
  if (body.status === "paired" && body.auth) return { status: "paired", auth: toAuthData(hassUrl, body.auth) };
  return { status: "pending" };
}
