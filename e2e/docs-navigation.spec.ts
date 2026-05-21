import { test, expect } from "@playwright/test";

test.describe("docs navigation", () => {
  test("docs page renders sidebar with sections", async ({ page }) => {
    await page.goto("/vi/docs/engineer/01-core-workflow");
    const sidebar = page.getByRole("navigation", { name: /docs navigation/i });
    await expect(sidebar).toBeVisible();
    // Match section header (h3 inside sidebar) thay vì plain text (tránh ambiguity)
    await expect(sidebar.getByRole("heading", { level: 3 }).first()).toBeVisible();
  });

  test("fallback EN→VI shows translation banner", async ({ page }) => {
    await page.goto("/en/docs/engineer/01-core-workflow");
    await expect(page.getByRole("status")).toContainText(/translation|Vietnamese/i);
  });
});
