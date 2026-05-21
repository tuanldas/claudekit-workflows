import { test, expect } from "@playwright/test";

test.describe("docs navigation", () => {
  test("docs page renders sidebar with sections", async ({ page }) => {
    await page.goto("/vi/docs/engineer/01-core-workflow");
    await expect(page.getByRole("navigation", { name: /docs navigation/i })).toBeVisible();
    await expect(page.getByText(/engineer/i)).toBeVisible();
  });

  test("fallback EN→VI shows translation banner", async ({ page }) => {
    await page.goto("/en/docs/engineer/01-core-workflow");
    await expect(page.getByRole("status")).toContainText(/translation|Vietnamese/i);
  });
});
