import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E config. Run với `npm run test:e2e`. Requires browsers
 * installed: `npx playwright install --with-deps chromium`.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run build && npm start",
        port: 3000,
        timeout: 120_000,
        reuseExistingServer: !process.env.CI,
      },
});
