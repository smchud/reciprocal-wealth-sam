import { defineConfig, devices } from "@playwright/test";

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
    reuseExistingServer: true,
    timeout: 60_000,
    env: {
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
