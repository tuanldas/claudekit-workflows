import { expect, test } from "@playwright/test";
import { ROUTE_WORKFLOWS } from "./helpers/playwright-setup";

test.describe("workflow detail modal", () => {
  test("clicking a card opens detail modal with phases content", async ({
    page,
  }) => {
    await page.goto(ROUTE_WORKFLOWS);
    const firstCard = page
      .getByRole("button")
      .filter({ has: page.getByRole("heading", { level: 3 }) })
      .first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // Modal renders with role=dialog + aria-modal=true.
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Modal shows the "Phases" header (localized strings).
    await expect(
      page.getByRole("heading", { name: /Các Phase|Workflow Phases/i }),
    ).toBeVisible();
  });

  test("close button dismisses the detail modal", async ({ page }) => {
    await page.goto(ROUTE_WORKFLOWS);
    const firstCard = page
      .getByRole("button")
      .filter({ has: page.getByRole("heading", { level: 3 }) })
      .first();
    await firstCard.click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByRole("button", { name: /^Close$/ }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("Escape key dismisses the detail modal", async ({ page }) => {
    await page.goto(ROUTE_WORKFLOWS);
    const firstCard = page
      .getByRole("button")
      .filter({ has: page.getByRole("heading", { level: 3 }) })
      .first();
    await firstCard.click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});
