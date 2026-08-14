// Renders every public route to PDF for our records.
//
//   npm run capture                          # captures production
//   npm run capture -- --base=http://localhost:3000
//   npm run capture -- --out=some/directory
//
// Output goes to captures/<timestamp>/, alongside a manifest.json recording
// the base URL, git commit, and capture time — so an archived PDF can always
// be traced back to the exact deploy it came from.
//
// Requires the Playwright chromium browser (already a dev dependency):
//   npx playwright install chromium

import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...rest] = a.replace(/^--/, "").split("=");
    return [k, rest.join("=") || true];
  })
);

const baseUrl = (args.base ?? "https://reciprocalwealth.com").replace(/\/$/, "");

// Routes come from the live sitemap so this stays in sync automatically as
// pages are added. /get-started is appended explicitly: it's a public route
// but is deliberately kept out of the sitemap (it's a form flow, not a
// content page a search engine should land people on).
async function resolveRoutes() {
  const res = await fetch(`${baseUrl}/sitemap.xml`);
  if (!res.ok) throw new Error(`Could not read ${baseUrl}/sitemap.xml (${res.status})`);
  const xml = await res.text();
  const routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace(baseUrl, "") || "/")
    .map((r) => (r.startsWith("/") ? r : `/${r}`));
  if (!routes.includes("/get-started")) routes.push("/get-started");
  return [...new Set(routes)].sort();
}

function gitCommit() {
  try {
    return execSync("git rev-parse HEAD", { cwd: repoRoot }).toString().trim();
  } catch {
    return "unknown";
  }
}

// FadeIn reveals content via IntersectionObserver, so anything below the fold
// is still opacity:0 on load. Scroll the full height to trip every observer,
// then force the final state so nothing is captured mid-transition.
async function revealAllContent(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.addStyleTag({
    content: `*, *::before, *::after {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
      animation: none !important;
    }`,
  });
  await page.waitForTimeout(250);
}

function fileNameFor(route) {
  return (route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-")) + ".pdf";
}

async function main() {
  const routes = await resolveRoutes();
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const outDir = path.resolve(repoRoot, args.out ?? path.join("captures", stamp));
  mkdirSync(outDir, { recursive: true });

  console.log(`Capturing ${routes.length} routes from ${baseUrl}`);
  console.log(`Output: ${outDir}\n`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 1600 } });
  const page = await context.newPage();

  const captured = [];
  const failed = [];

  for (const route of routes) {
    const url = `${baseUrl}${route === "/" ? "" : route}`;
    try {
      const res = await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
      const status = res?.status() ?? 0;
      if (status >= 400) throw new Error(`HTTP ${status}`);

      await page.evaluate(() => document.fonts?.ready);
      await revealAllContent(page);

      const file = path.join(outDir, fileNameFor(route));
      await page.pdf({
        path: file,
        format: "Letter",
        printBackground: true,
        margin: { top: "0.4in", bottom: "0.4in", left: "0.4in", right: "0.4in" },
      });

      console.log(`  ok    ${route}  ->  ${path.basename(file)}`);
      captured.push({ route, url, status, file: path.basename(file) });
    } catch (err) {
      console.log(`  FAIL  ${route}  ->  ${err.message}`);
      failed.push({ route, url, error: err.message });
    }
  }

  await browser.close();

  const manifest = {
    baseUrl,
    capturedAt: new Date().toISOString(),
    gitCommit: gitCommit(),
    routeCount: routes.length,
    captured,
    failed,
  };
  writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));

  console.log(`\n${captured.length}/${routes.length} captured -> ${outDir}`);
  if (failed.length) {
    console.error(`${failed.length} route(s) failed.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
