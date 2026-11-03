// The full-screen kitchen page. It signs in with the same Home Assistant login, sharing the
// sign-in Home Assistant's own pages keep in this browser, so it usually needs none.

import {
  ERR_CANNOT_CONNECT,
  ERR_INVALID_AUTH,
  createConnection,
  getAuth,
  type AuthData,
} from "home-assistant-js-websocket";
import { HassBackend } from "./backend.ts";
import "./board.ts";

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
    // Without storage the page asks to sign in each time it opens.
  }
}

function showProblem(text: string): void {
  const el = document.getElementById("problem");
  if (!el) return;
  el.hidden = false;
  el.querySelector("p")!.textContent = text;
}

async function connect(): Promise<void> {
  const board = document.querySelector("mydashlight-board");
  if (!board) return;
  board.kiosk = true;
  try {
    const auth = await getAuth({ hassUrl: location.origin, loadTokens: async () => loadTokens(), saveTokens });
    if (location.search.includes("auth_callback")) history.replaceState(null, "", location.pathname);
    const conn = await createConnection({ auth });
    board.backend = new HassBackend(conn);
  } catch (err) {
    if (err === ERR_INVALID_AUTH) {
      // The saved sign-in was revoked: sign in again.
      saveTokens(null);
      location.replace(location.pathname);
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

void connect();
