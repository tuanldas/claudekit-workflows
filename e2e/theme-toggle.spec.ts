import { expect, test } from "@playwright/test";
import { ROUTE_WORKFLOWS } from "./helpers/playwright-setup";

test.describe("theme toggle", () => {
  test("cycles light → dark and persists across reload", async ({ page }) => {
    await page.goto(ROUTE_WORKFLOWS);
    // Seed deterministic starting state via localStorage and reload so the
    // pre-hydration init script picks it up.
    await page.evaluate(() => {
      window.localStorage.setItem("claudekit-theme", "light");
    });
    await page.reload();
    await expect(page.locator("html")).not.toHaveClass(/dark/);

    const toggle = page.getByRole("button", {
      name: /Đổi giao diện|Toggle theme/i,
    });
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Persisted across reload via localStorage + theme-init-script (no FOUC).
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("cycles dark → system; aria-label reflects new mode", async ({
    page,
  }) => {
    await page.goto(ROUTE_WORKFLOWS);
    await page.evaluate(() => {
      window.localStorage.setItem("claudekit-theme", "dark");
    });
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);

    const toggle = page.getByRole("button", {
      name: /Đổi giao diện|Toggle theme/i,
    });
    await toggle.click();
    await expect(toggle).toHaveAttribute(
      "aria-label",
      /\((Theo hệ thống|System)\)/,
    );
  });
});
