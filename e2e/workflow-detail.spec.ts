import { expect, test } from "@playwright/test";
import { ROUTE_WORKFLOWS } from "./helpers/playwright-setup";

test.describe("workflow detail panel", () => {
  test("clicking a card opens inline detail with ReactFlow canvas", async ({
    page,
  }) => {
    await page.goto(ROUTE_WORKFLOWS);
    // Workflow cards are <button> with heading h3 containing workflow title.
    const firstCard = page
      .getByRole("button")
      .filter({ has: page.getByRole("heading", { level: 3 }) })
      .first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // Inline detail panel shows the "Phases" header (localized strings).
    await expect(
      page.getByRole("heading", { name: /Các Phase|Workflow Phases/i }),
    ).toBeVisible();

    // ReactFlow renders a container with class ".react-flow" — wait for nodes.
    await expect(page.locator(".react-flow")).toBeVisible();
    await expect(page.locator(".react-flow__node").first()).toBeVisible();
  });

  test("close button collapses the detail panel", async ({ page, isMobile }) => {
    await page.goto(ROUTE_WORKFLOWS);
    const firstCard = page
      .getByRole("button")
      .filter({ has: page.getByRole("heading", { level: 3 }) })
      .first();
    await firstCard.click();
    await expect(
      page.getByRole("heading", { name: /Các Phase|Workflow Phases/i }),
    ).toBeVisible();

    // Two close buttons exist (mobile floats inside info col, desktop floats
    // top-right of canvas). On mobile only the first is visible; on desktop
    // only the second. Pick the one that is actually visible.
    const closeButtons = page.getByRole("button", { name: /^Close$/ });
    const visibleClose = isMobile ? closeButtons.first() : closeButtons.last();
    await visibleClose.click();

    await expect(
      page.getByRole("heading", { name: /Các Phase|Workflow Phases/i }),
    ).toHaveCount(0);
  });
});
