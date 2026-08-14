import { readFileSync } from "node:fs";
import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

/**
 * Reads .env.local directly. Next.js loads it for the dev server, but this
 * config file runs in Playwright's own process, which doesn't - and we need
 * TEST_DATABASE_URL here to override the dev server's database.
 */
function envLocal(key: string): string | undefined {
  try {
    const raw = readFileSync(path.join(__dirname, ".env.local"), "utf8");
    const match = raw.match(new RegExp(`^${key}="?([^"\\r\\n]+)"?`, "m"));
    return match?.[1];
  } catch {
    return undefined;
  }
}

// The test suite creates draft sessions, submits questionnaires, and requests
// white papers - all of which write rows. Point the dev server at the separate
// `reciprocalwealth_test` database so none of that lands in production
// alongside real client records. Without this the suite writes to whatever
// DATABASE_URL .env.local holds, which is production.
const testDatabaseUrl = envLocal("TEST_DATABASE_URL");
if (!testDatabaseUrl) {
  throw new Error(
    "TEST_DATABASE_URL is not set in .env.local. Tests write real rows, so " +
      "they must not run against the production database. See docs/RUNBOOK.md."
  );
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    // A server already on :3000 won't have these env vars, so reusing one
    // silently sends test writes to production and fails the token tests.
    reuseExistingServer: false,
    timeout: 60_000,
    env: {
      DATABASE_URL: testDatabaseUrl,
      // Lets the resume-link test read back the real, server-issued token
      // instead of depending on Resend delivery. Test-only - see the guard
      // in src/app/api/get-started/resume-link/route.ts.
      RW_E2E_EXPOSE_RESUME_TOKEN: "1",
      // Same escape hatch for the white paper verification flow - see
      // src/app/api/white-paper/request/route.ts.
      RW_E2E_EXPOSE_WP_TOKEN: "1",
    },
  },
});
