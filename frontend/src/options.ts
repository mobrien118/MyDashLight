// Settings a screen can be given in its address, such as
// `/mydashlight-kitchen?view=compact`, so each screen can open the way it's wanted.

import type { Mode } from "./layout.ts";

export type Page = "rides" | "chores" | "lunch";

export interface PageOptions {
  /** The view to open in. Unset means the one last picked in this browser. */
  view?: Mode;
  /** `keyboard=off` hides the kitchen screen's on-screen keyboard, for a screen with a real one. */
  keyboard?: false;
  /** `cursor=show` keeps the mouse pointer on screen; otherwise the kitchen screen hides it when idle. */
  cursor?: "show";
  /** The page to open on. Unset means rides. */
  page?: Page;
  /** `past=show` keeps events that are over on the board; otherwise they drop off. */
  past?: "show";
  /** `daypicker=off` leaves out the row of days that slides in at the board's edge while scrolling. */
  daypicker?: false;
}

const VIEWS: Record<string, Mode> = {
  timeline: "timeline",
  full: "timeline",
  compact: "compact",
};

/** Reads the settings from an address's `?…` part. Unknown names and values are ignored. */
export function pageOptions(search: string): PageOptions {
  const q = new URLSearchParams(search);
  const opts: PageOptions = {};
  const view = VIEWS[(q.get("view") ?? "").trim().toLowerCase()];
  if (view) opts.view = view;
  if (["off", "no", "false", "0"].includes((q.get("keyboard") ?? "").trim().toLowerCase())) opts.keyboard = false;
  if ((q.get("cursor") ?? "").trim().toLowerCase() === "show") opts.cursor = "show";
  const page = (q.get("page") ?? "").trim().toLowerCase();
  if (page === "rides" || page === "chores" || page === "lunch") opts.page = page;
  if (["show", "yes", "on", "true", "1"].includes((q.get("past") ?? "").trim().toLowerCase())) opts.past = "show";
  if (["off", "no", "false", "0", "hide"].includes((q.get("daypicker") ?? "").trim().toLowerCase())) opts.daypicker = false;
  return opts;
}

/** What Home Assistant's sign-in adds to the address on its way back. */
const AUTH_PARAMS = ["auth_callback", "code", "state"];

/** The `?…` part without the sign-in's leftovers, keeping the screen's own settings. */
export function withoutAuthParams(search: string): string {
  const q = new URLSearchParams(search);
  for (const p of AUTH_PARAMS) q.delete(p);
  const s = q.toString();
  return s ? `?${s}` : "";
}
