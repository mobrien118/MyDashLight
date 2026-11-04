// Settings a screen can be given in its address, such as
// `/mydashlight-kitchen?view=compact`, so each screen can open the way it's wanted.

import type { Mode } from "./layout.ts";

export type Page = "rides" | "chores";

export interface PageOptions {
  /** The view to open in. Unset means the one last picked in this browser. */
  view?: Mode;
  /** The page to open on. Unset means rides. */
  page?: Page;
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
  const page = (q.get("page") ?? "").trim().toLowerCase();
  if (page === "rides" || page === "chores") opts.page = page;
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
