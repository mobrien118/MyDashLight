// The full-screen kitchen page. A kitchen screen has no keyboard, so it signs in by pairing: it
// shows a code that a Home Assistant admin approves from their phone, and is then signed in as
// them (see `pairing.ts`). The sign-in is kept where Home Assistant's own pages keep theirs, so a
// browser already signed in to Home Assistant on this address needs no pairing at all.

import {
  ERR_CANNOT_CONNECT,
  ERR_INVALID_AUTH,
  createConnection,
  getAuth,
  type AuthData,
} from "home-assistant-js-websocket";
import { HassBackend } from "./backend.ts";
import "./board.ts";
import { autoHideCursor } from "./cursor.ts";
import { buildOf, reloadOnUpdate } from "./freshness.ts";
import { keepAlive } from "./heartbeat.ts";
import { useKeyboard } from "./keyboard.ts";
import { pageOptions, withoutAuthParams } from "./options.ts";
import "./pairing.ts";

/** Where Home Assistant's own pages keep their sign-in, on this same address. */
const TOKENS = "hassTokens";

function loadTokens(): AuthData | null {
  try {
    const raw = localStorage.getItem(TOKENS);
    return raw ? (JSON.parse(raw) as AuthData) : null;
  } catch {
    return null;
  }
}

function saveTokens(data: AuthData | null): void {
  try {
    if (data) localStorage.setItem(TOKENS, JSON.stringify(data));
    else localStorage.removeItem(TOKENS);
  } catch {
    // Without storage the page pairs again each time it opens.
  }
}

function showProblem(text: string): void {
  const el = document.getElementById("problem");
  if (!el) return;
  el.hidden = false;
  el.querySelector("p")!.textContent = text;
}

/** Shows the pairing code until someone approves it. Null means sign in with a password instead. */
function pair(): Promise<AuthData | null> {
  const pairing = document.querySelector("mydashlight-pairing");
  if (!pairing) return Promise.resolve(null);
  return new Promise((resolve) => {
    const done = (auth: AuthData | null): void => {
      pairing.stop();
      pairing.hidden = true;
      resolve(auth);
    };
    pairing.addEventListener("paired", (ev) => done((ev as CustomEvent<AuthData>).detail), { once: true });
    pairing.addEventListener("password", () => done(null), { once: true });
    pairing.start();
  });
}

async function connect(): Promise<void> {
  const board = document.querySelector("mydashlight-board");
  if (!board) return;
  board.kiosk = true;
  const returning = location.search.includes("auth_callback");
  if (!returning && !loadTokens()) {
    const auth = await pair();
    if (auth) saveTokens(auth);
  }
  try {
    // With a saved sign-in this just uses it; without one it goes to Home Assistant's sign-in page.
    const auth = await getAuth({ hassUrl: location.origin, loadTokens: async () => loadTokens(), saveTokens });
    if (returning) {
      history.replaceState(null, "", location.pathname + withoutAuthParams(location.search));
    }
    const conn = await createConnection({ auth });
    board.backend = new HassBackend(conn);
    keepAlive(conn);
    reloadOnUpdate(conn, buildOf(import.meta.url), { reload: reloadFor, idleFor: () => Date.now() - lastTouch });
    // The sign-in was removed (say, from the profile page): pair again.
    conn.addEventListener("reconnect-error", (_conn, err) => {
      if (err === ERR_INVALID_AUTH) signedOut();
    });
  } catch (err) {
    if (err === ERR_INVALID_AUTH) {
      signedOut();
      return;
    }
    showProblem(
      err === ERR_CANNOT_CONNECT
        ? "Can’t reach Home Assistant. Trying again in a minute."
        : `Couldn’t sign in to Home Assistant (${String(err)}). Trying again in a minute.`,
    );
    setTimeout(() => location.reload(), 60_000);
  }
}

/** When someone last touched the screen, so an update never reloads it mid-edit. */
let lastTouch = Date.now();
for (const type of ["pointerdown", "keydown", "wheel"]) {
  document.addEventListener(type, () => (lastTouch = Date.now()), { capture: true, passive: true });
}

const RELOADED_FOR = "mydashlight-reloaded-for";

/** Reloads for a new build, once: if the page still runs the old one after that, it doesn't keep trying. */
function reloadFor(build: string): void {
  try {
    if (sessionStorage.getItem(RELOADED_FOR) === build) return;
    sessionStorage.setItem(RELOADED_FOR, build);
  } catch {
    // Without storage, reload anyway: the new page asks for the new script by its address.
  }
  location.reload();
}

function signedOut(): void {
  saveTokens(null);
  location.replace(location.pathname + withoutAuthParams(location.search));
}

const options = pageOptions(location.search);
const keyboard = document.querySelector("mydashlight-keyboard");
if (keyboard && options.keyboard !== false) useKeyboard(keyboard);
if (options.cursor !== "show") autoHideCursor();

void connect();
