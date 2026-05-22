import { expect, test } from "@playwright/test";
import { ROUTE_WORKFLOWS } from "./helpers/playwright-setup";

// Force a mobile-sized viewport on Chromium (the iPhone 13 device descriptor
// otherwise forces webkit which we don't ship). Width below the `lg` (1024px)
// breakpoint exposes the hamburger and hides the desktop sidebar.
test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});

// Suppress Next.js dev error overlay (any future hydration warning) so it
// can't intercept clicks against the drawer. Also disable the drawer slide-in
// keyframe — the panel starts at translateX(-100%) and animates in over
// 200ms, which Playwright's stability check rejects as "outside viewport".
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addStyleTag({
    content: `
      [data-nextjs-dialog-overlay],
      nextjs-portal { display: none !important; }
      /* Force the drawer to its open position even if motion-safe variants
         (which start it at translateX(-100%)) ended up applied. */
      [role="dialog"][aria-label="Điều hướng"],
      [role="dialog"][aria-label="Navigation"] {
        transform: none !important;
        animation: none !important;
      }
    `,
  });
});

test.describe("mobile drawer", () => {
  test("hamburger opens drawer; backdrop click closes it", async ({ page }) => {
    await page.goto(ROUTE_WORKFLOWS);

    const drawer = page.getByRole("dialog", {
      name: /Điều hướng|Navigation/,
    });
    await expect(drawer).toHaveCount(0);

    await page
      .getByRole("button", { name: /Mở điều hướng|Open navigation/ })
      .click();
    await expect(drawer).toBeVisible();

    // Backdrop spans full viewport and is layered below the 280px panel —
    // click outside the panel column so the dialog (which intercepts pointer
    // events over its own area) doesn't swallow the event.
    await page.getByTestId("drawer-backdrop").click({
      position: { x: 350, y: 400 },
    });
    await expect(drawer).toHaveCount(0);
  });

  test("Escape closes the drawer", async ({ page }) => {
    await page.goto(ROUTE_WORKFLOWS);
    await page
      .getByRole("button", { name: /Mở điều hướng|Open navigation/ })
      .click();
    const drawer = page.getByRole("dialog", {
      name: /Điều hướng|Navigation/,
    });
    await expect(drawer).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(drawer).toHaveCount(0);
  });

  test("clicking a category link updates the URL while staying on workflows", async ({
    page,
  }) => {
    await page.goto(ROUTE_WORKFLOWS);
    await page
      .getByRole("button", { name: /Mở điều hướng|Open navigation/ })
      .click();
    const drawer = page.getByRole("dialog", {
      name: /Điều hướng|Navigation/,
    });
    await expect(drawer).toBeVisible();

    await drawer.getByRole("link", { name: /Debug.*Fix|Debugging/i }).click();
    await expect(page).toHaveURL(/category=debugging-fixes/);
  });
});
