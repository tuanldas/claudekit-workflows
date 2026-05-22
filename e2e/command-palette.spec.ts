import { expect, test } from "@playwright/test";
import { ROUTE_WORKFLOWS } from "./helpers/playwright-setup";

test.describe("command palette (Cmd+K)", () => {
  test("Cmd+K opens palette and typing produces results", async ({ page }) => {
    await page.goto(ROUTE_WORKFLOWS);

    await page.keyboard.press("Meta+K");
    const dialog = page.locator('[role="dialog"][data-state="open"]');
    await expect(dialog).toHaveCount(1);

    // Palette input is a cmdk combobox — scope to the dialog to avoid the
    // standalone workflow search bar on the page.
    const input = dialog.getByRole("combobox");
    await expect(input).toBeVisible();
    await input.fill("plan");

    await expect(page.locator("[cmdk-item]").first()).toBeVisible({
      timeout: 5_000,
    });
  });

  test("Enter navigates away from current route", async ({ page }) => {
    await page.goto(ROUTE_WORKFLOWS);
    await page.keyboard.press("Meta+K");

    const dialog = page.locator('[role="dialog"][data-state="open"]');
    const input = dialog.getByRole("combobox");
    await input.fill("plan");

    await expect(page.locator("[cmdk-item]").first()).toBeVisible();
    await page.keyboard.press("Enter");

    await expect(
      page.locator('[role="dialog"][data-state="open"]'),
    ).toHaveCount(0);
    await expect(page).not.toHaveURL(/\/vi\/workflows\/?$/);
  });

  test("Escape closes the palette", async ({ page }) => {
    await page.goto(ROUTE_WORKFLOWS);
    await page.keyboard.press("Meta+K");
    await expect(
      page.locator('[role="dialog"][data-state="open"]'),
    ).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(
      page.locator('[role="dialog"][data-state="open"]'),
    ).toHaveCount(0);
  });
});
