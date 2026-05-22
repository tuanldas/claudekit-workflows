import { expect, test } from "@playwright/test";
import {
  ROUTE_DOCS_INDEX,
  ROUTE_SKILLS,
  ROUTE_WORKFLOWS,
} from "./helpers/playwright-setup";

test.describe("shell navigation", () => {
  test("/ redirects to /vi/workflows", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/vi\/workflows\/?$/);
  });

  test("sidebar landmark persists across sections", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "Sidebar is collapsed on mobile — see mobile-drawer.spec.ts");

    await page.goto(ROUTE_WORKFLOWS);
    const sidebar = page.getByRole("navigation", { name: /sidebar/i });
    await expect(sidebar).toBeVisible();

    await page.goto(ROUTE_DOCS_INDEX);
    await expect(sidebar).toBeVisible();
    // Docs nav exposes section headings (h3) inside sidebar
    await expect(sidebar.getByRole("heading", { level: 3 }).first()).toBeVisible();

    await page.goto(ROUTE_SKILLS);
    await expect(sidebar).toBeVisible();
  });

  test("locale switcher preserves sub-path", async ({ page }) => {
    await page.goto(ROUTE_DOCS_INDEX);
    await page
      .getByRole("button", { name: /^EN$/, exact: true })
      .first()
      .click();
    await expect(page).toHaveURL(/\/en\/docs\/engineer\/01-core-workflow\/?$/);
  });
});
