// Builds the app into the integration, which serves it from Home Assistant.
//
//   node build.mjs                      panel.js, kiosk.js and index.html for the integration
//   node build.mjs --preview plan.json --out preview.html
//                                       one self-contained page with a fixed plan, nothing saved

import { build } from "esbuild";
import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../custom_components/mydashlight/frontend");
const common = {
  bundle: true,
  format: "esm",
  target: "es2021",
  minify: true,
  legalComments: "eof",
  charset: "utf8",
  logLevel: "warning",
};

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

if (args.includes("--preview")) {
  const plan = await readFile(resolve(flag("--preview") ?? resolve(here, "test/fixtures/week.json")), "utf8");
  const target = resolve(flag("--out") ?? resolve(here, "preview.html"));
  const res = await build({
    ...common,
    entryPoints: [resolve(here, "src/preview.ts")],
    write: false,
    define: { PREVIEW_PLAN: JSON.stringify(JSON.parse(plan)) },
  });
  const js = res.outputFiles[0].text.replaceAll("</script", "<\\/script");
  const favicon = await readFile(resolve(here, "public/favicon.svg"), "utf8");
  const page = (await readFile(resolve(here, "src/kiosk.html"), "utf8"))
    .replace("<title>MyDashLight rides</title>", "<title>Rides board preview</title>")
    .replace("<mydashlight-board kiosk>", "<mydashlight-board>")
    // The preview never signs in or types, so it has no pairing page or keyboard.
    .replace(/^ *<mydashlight-(?:pairing|keyboard) hidden><\/mydashlight-(?:pairing|keyboard)>\n/gm, "")
    .replace('<script type="module" src="%SCRIPT%"></script>', () => `<script type="module">${js}</script>`)
    // One self-contained page: the icon goes inline, and the PNG fallbacks aren't needed.
    .replace(/^ *<link rel="(?:icon|apple-touch-icon)"[^>]*\.png"[^>]*>\n/gm, "")
    .replace('href="%FILES%/favicon.svg"', () => `href="data:image/svg+xml,${encodeURIComponent(favicon)}"`);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, page);
  console.log(`Wrote ${target}`);
} else {
  await mkdir(out, { recursive: true });
  await build({
    ...common,
    entryPoints: { panel: resolve(here, "src/panel.ts"), kiosk: resolve(here, "src/kiosk.ts") },
    outdir: out,
  });
  // The icons the kitchen page links to, copied as they are.
  for (const name of await readdir(resolve(here, "public"))) {
    await copyFile(resolve(here, "public", name), resolve(out, name));
  }
  // Home Assistant fills in the script's and icons' addresses, with a version on the script so
  // browsers fetch new builds.
  await writeFile(resolve(out, "index.html"), await readFile(resolve(here, "src/kiosk.html"), "utf8"));
}
