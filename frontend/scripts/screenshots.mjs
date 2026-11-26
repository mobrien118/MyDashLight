// Renders the screenshots in docs/images from the offline preview's sample family.
//
//   npm run screenshots
//
// Needs Playwright with Chromium, which isn't one of the app's dependencies:
//   npm install --no-save playwright && npx playwright install chromium
//
// The clock is fixed at a Monday afternoon, so the shots come out the same every time.

import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const frontend = resolve(here, "..");
const out = resolve(frontend, "../docs/images");
const built = resolve(frontend, "../custom_components/mydashlight/frontend");
const NOW = new Date("2026-11-30T21:20:00Z"); // 3:20 PM in Chicago, the sample's time zone
const KITCHEN = { width: 1920, height: 1080 };

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Playwright isn't installed. Run: npm install --no-save playwright && npx playwright install chromium");
  process.exit(1);
}

const tmp = await mkdtemp(join(tmpdir(), "mydashlight-shots-"));
const preview = join(tmp, "preview.html");
execFileSync(process.execPath, ["build.mjs", "--preview", "test/fixtures/week.json", "--out", preview], {
  cwd: frontend,
  stdio: "inherit",
});
await mkdir(out, { recursive: true });

const browser = await chromium.launch();

async function newPage(viewport, extra = {}) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, timezoneId: "America/Chicago", ...extra });
  const page = await context.newPage();
  await page.clock.install({ time: NOW });
  page.on("pageerror", (e) => console.error(e));
  return page;
}

async function open(page, query = "") {
  await page.goto(pathToFileURL(preview).href + query);
  await page.clock.runFor(2000);
  await page.waitForTimeout(700);
}

async function shot(page, name) {
  await page.screenshot({ path: join(out, `${name}.png`) });
  console.log(`Wrote docs/images/${name}.png`);
}

const board = (page) => page.locator("mydashlight-board");

let page = await newPage(KITCHEN);
await open(page, "?view=compact");
await shot(page, "rides-compact");
await open(page, "?view=timeline");
await shot(page, "rides-timeline");
await open(page, "?view=compact");
await board(page).getByText("Soccer", { exact: true }).first().click();
await page.waitForTimeout(600);
await shot(page, "ride-editor");

await open(page, "?page=chores");
await shot(page, "chores");
await page.getByText("Points this week").click();
await page.waitForTimeout(600);
await shot(page, "points");
await open(page, "?page=chores");
await board(page).getByText("Feed the dog").first().click();
await page.waitForTimeout(600);
await shot(page, "chore-done");
await open(page, "?page=chores");
await page.getByText("Add a chore").click();
await page.waitForTimeout(600);
await shot(page, "chore-editor");

await open(page, "?page=lunch");
await shot(page, "lunch");

// A phone, as in the Home Assistant app's Rides item.
page = await newPage({ width: 390, height: 844 }, { deviceScaleFactor: 1.5, isMobile: true, hasTouch: true });
await open(page, "?view=compact");
await shot(page, "phone-rides");
await open(page, "?page=chores");
await shot(page, "phone-chores");

// The kitchen page before it's paired, with Home Assistant stood in for.
page = await newPage(KITCHEN);
const shell = (await readFile(join(built, "index.html"), "utf8"))
  .replace("%SCRIPT%", "/mydashlight_app/kiosk.js")
  .replaceAll("%FILES%", "/mydashlight_app");
await page.route("http://homeassistant.local:8123/**", async (route) => {
  const path = new URL(route.request().url()).pathname;
  if (path === "/mydashlight-kitchen") return route.fulfill({ contentType: "text/html", body: shell });
  if (path.startsWith("/mydashlight_app/")) return route.fulfill({ path: join(built, path.split("/").pop()) });
  if (path === "/api/mydashlight/pair") {
    const body = { code: "KQ7M4TXP", secret: "sample", expires_in: 600, interval: 5 };
    return route.fulfill({ contentType: "application/json", body: JSON.stringify(body) });
  }
  if (path === "/api/mydashlight/pair/poll") {
    return route.fulfill({ contentType: "application/json", body: JSON.stringify({ status: "pending" }) });
  }
  return route.fulfill({ status: 404, body: "" });
});
await page.goto("http://homeassistant.local:8123/mydashlight-kitchen");
await page.clock.runFor(3000);
await page.waitForTimeout(1000);
await shot(page, "pairing");

await browser.close();
await rm(tmp, { recursive: true, force: true });
