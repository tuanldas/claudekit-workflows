import { defineConfig, devices } from "@playwright/test";
import * as path from "node:path";

/**
 * Playwright E2E config. Run with `npm run test:e2e`. Requires browsers
 * installed: `npx playwright install chromium`.
 *
 * The dev server starts on port 3001 (Next.js dev mode + Turbopack). The
 * `globalSetup` step bakes a deterministic skills index from
 * `e2e/fixtures/skills` so the catalog never depends on the developer's
 * local `~/.claude/skills` tree.
 */

const iPhone13 = devices["iPhone 13"];

export default defineConfig({
  testDir: "./e2e",
  testIgnore: ["**/fixtures/**", "**/helpers/**"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  reporter: process.env.CI ? "list" : [["list"], ["html", { open: "never" }]],
  globalSetup: path.resolve(__dirname, "./e2e/helpers/global-setup.ts"),
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3001",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      // Reuse iPhone 13's viewport/userAgent on Chromium so we don't need to
      // download webkit just for responsive coverage.
      name: "mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: iPhone13.viewport,
        deviceScaleFactor: iPhone13.deviceScaleFactor,
        isMobile: true,
        hasTouch: true,
        userAgent: iPhone13.userAgent,
      },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run dev -- --port 3001",
        url: "http://localhost:3001",
        timeout: 120_000,
        reuseExistingServer: !process.env.CI,
        stdout: "ignore",
        stderr: "pipe",
      },
});
