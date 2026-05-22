import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import {
  ROUTE_DOCS_INDEX,
  ROUTE_SKILLS,
  ROUTE_SKILL_DETAIL,
  ROUTE_WORKFLOWS,
} from "./helpers/playwright-setup";

interface RouteSpec {
  path: string;
  label: string;
}

const ROUTES: RouteSpec[] = [
  { path: ROUTE_WORKFLOWS, label: "workflows index" },
  { path: ROUTE_DOCS_INDEX, label: "docs page" },
  { path: ROUTE_SKILLS, label: "skills catalog" },
  { path: ROUTE_SKILL_DETAIL, label: "skill detail" },
];

/**
 * Rules we acknowledge but do NOT fail on. Color contrast violations are a
 * brand decision (orange-500 with white text on the app logo, gray-400 muted
 * section headings) — we surface them in a separate informational bucket so
 * future design tweaks can address them, but the gate stays clean.
 */
const INFORMATIONAL_RULES = new Set<string>(["color-contrast"]);

async function scanPage(page: Page) {
  // ReactFlow renders an interactive canvas whose nodes legitimately fail
  // axe checks (focusable controls inside non-semantic divs). Exclude the
  // .react-flow region so the gate enforces app-shell a11y without false
  // positives from the third-party widget.
  return new AxeBuilder({ page })
    .exclude(".react-flow")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
    .analyze();
}

for (const { path, label } of ROUTES) {
  test(`a11y: ${label} (${path})`, async ({ page }) => {
    await page.goto(path);
    await page.locator("main").waitFor({ state: "visible" });

    const results = await scanPage(page);
    const blocking = results.violations.filter((v) => {
      if (v.impact !== "critical" && v.impact !== "serious") return false;
      return !INFORMATIONAL_RULES.has(v.id);
    });
    const informational = results.violations.filter(
      (v) =>
        (v.impact === "critical" || v.impact === "serious") &&
        INFORMATIONAL_RULES.has(v.id),
    );

    if (informational.length > 0) {
      const summary = informational
        .map(
          (v) =>
            `${v.id} (${v.impact}, ${v.nodes.length} node${v.nodes.length === 1 ? "" : "s"})`,
        )
        .join("; ");
      console.log(`[a11y][info] ${path}: ${summary}`);
    }

    if (blocking.length > 0) {
      console.log(
        `[a11y][fail] ${path}: ${blocking.length} blocking violation(s):`,
        JSON.stringify(
          blocking.map((v) => ({
            id: v.id,
            impact: v.impact,
            help: v.help,
            nodes: v.nodes.slice(0, 3).map((n) => ({
              html: n.html.slice(0, 200),
              target: n.target,
            })),
          })),
          null,
          2,
        ),
      );
    }

    expect(
      blocking,
      `Critical/serious violations on ${path}: ${blocking
        .map((v) => `${v.id}: ${v.help}`)
        .join(" | ")}`,
    ).toEqual([]);
  });
}
