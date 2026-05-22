import { expect, test } from "@playwright/test";
import {
  FIXTURE_SKILL_ID,
  ROUTE_SKILL_DETAIL,
  ROUTE_SKILLS,
} from "./helpers/playwright-setup";

test.describe("skills catalog → detail", () => {
  test("search filters cards then navigates to detail", async ({ page }) => {
    await page.goto(ROUTE_SKILLS);
    await expect(
      page.getByRole("heading", { level: 1, name: /^Skills$/ }),
    ).toBeVisible();

    // Fixture ships ck-plan + ck-cook + ck-debug + ck-fix + copywriting + design.
    const searchInput = page.getByPlaceholder(
      /T.+m skill|Search skills/,
    );
    await searchInput.fill("ck-plan");

    // SkillCard wraps an <article> in a <Link href>; scope to <main> so the
    // sidebar's identical-href link doesn't collide with the catalog card.
    const planCard = page
      .locator("main")
      .locator(`a[href$="/vi/skills/${FIXTURE_SKILL_ID}"]`);
    await expect(planCard).toBeVisible();

    await planCard.click();
    await expect(page).toHaveURL(new RegExp(`/vi/skills/${FIXTURE_SKILL_ID}/?$`));
  });

  test("direct skill URL renders MDX content with description", async ({
    page,
  }) => {
    await page.goto(ROUTE_SKILL_DETAIL);
    // SKILL.md heading h1 = "ck-plan" — assert it rendered through MDX pipeline.
    await expect(
      page.getByRole("heading", { name: /^ck-plan$/, level: 1 }).first(),
    ).toBeVisible();
    // "When to use" subsection from fixture body (h2 inside the article).
    await expect(
      page.getByRole("heading", { level: 2, name: /When to use/i }),
    ).toBeVisible();
  });
});
