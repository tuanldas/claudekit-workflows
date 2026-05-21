import { test, expect } from "@playwright/test";

test.describe("search modal", () => {
  test("Cmd+K opens search modal, Escape closes", async ({ page }) => {
    await page.goto("/vi/docs/engineer/01-core-workflow");
    await page.keyboard.press("Meta+K");
    await expect(page.getByRole("dialog", { name: /search/i })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: /search/i })).not.toBeVisible();
  });

  test("typing query shows results", async ({ page }) => {
    await page.goto("/vi/docs");
    await page.keyboard.press("Meta+K");
    const input = page.getByPlaceholder(/T.+m trong docs|Search docs/i);
    await input.fill("workflow");
    // Wait for debounce (150ms) + render
    await page.waitForTimeout(300);
    // At least 1 result row (Command.Item rendered as div role="option")
    await expect(page.locator("[cmdk-item]").first()).toBeVisible();
  });
});
