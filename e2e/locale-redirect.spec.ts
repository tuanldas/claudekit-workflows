import { test, expect } from "@playwright/test";

test.describe("locale redirect", () => {
  test("/ redirects to /vi", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/vi\/?$/);
  });

  test("/vi renders dashboard", async ({ page }) => {
    await page.goto("/vi");
    await expect(page).toHaveTitle(/ClaudeKit Workflows/i);
  });

  test("/en renders dashboard with EN locale", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveTitle(/ClaudeKit Workflows/i);
  });
});
