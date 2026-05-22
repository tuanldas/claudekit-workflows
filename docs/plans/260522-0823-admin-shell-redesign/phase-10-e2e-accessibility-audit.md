---
phase: 10
title: "E2E accessibility audit"
status: pending
priority: P2
effort: "1d"
dependencies: [1, 2, 3, 4, 5, 6, 7, 8, 9]
---

# Phase 10: E2E accessibility audit

## Overview

Final QA gate: Playwright E2E tests cho 5-7 golden paths + axe-core accessibility scan. Fix bugs surfaced. Lighthouse audit desktop + mobile. Validate all success criteria từ plan.md.

Đây là gate cuối trước khi merge — không phải optional polish.

## Requirements

**Functional (E2E coverage):**
1. **Workflow grid + filter**: `/vi/workflows` load → click category → URL update → grid filters
2. **Workflow detail expand**: click card → canvas render → close
3. **Docs navigation**: shell sidebar visible → click docs page → URL + content update → no full reload
4. **Skills catalog + detail**: `/vi/skills` → search → click → detail render
5. **Cmd+K palette**: open via shortcut → type → arrow nav → Enter → navigate
6. **Theme toggle**: click toggle → light/dark/system cycle → reload preserves choice
7. **Mobile drawer**: resize viewport → hamburger → drawer → click nav item → close + navigate

**Non-functional (a11y + perf):**
- axe-core scan: 0 violations (severity = serious/critical)
- Lighthouse desktop: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90
- Lighthouse mobile (375px): Performance ≥ 80, Accessibility ≥ 95
- Keyboard-only nav: all interactive elements reachable, focus visible
- Screen reader (manual): VoiceOver/NVDA can navigate shell

## Architecture

```
e2e/
├── shell-navigation.spec.ts        ← cover Workflows + Docs + Skills nav
├── command-palette.spec.ts
├── theme-toggle.spec.ts
├── mobile-drawer.spec.ts
├── workflow-detail.spec.ts
├── skill-detail.spec.ts
├── accessibility.spec.ts            ← axe-core per route
└── fixtures/
    └── seed-skills-index.ts        ← deterministic skills for E2E
```

Use `@axe-core/playwright` for a11y scan.

## Related Code Files

**Create:**
- `e2e/shell-navigation.spec.ts`
- `e2e/command-palette.spec.ts`
- `e2e/theme-toggle.spec.ts`
- `e2e/mobile-drawer.spec.ts`
- `e2e/workflow-detail.spec.ts`
- `e2e/skill-detail.spec.ts`
- `e2e/accessibility.spec.ts`
- `e2e/fixtures/seed-skills-index.ts` — bake deterministic skills-index.json for CI
- `e2e/helpers/playwright-setup.ts` — shared beforeEach (auth-free)

**Modify:**
- `playwright.config.ts` — add projects for desktop + mobile viewports; add a11y reporter
- `package.json` — add `test:e2e:a11y` script
- `lefthook.yml` — optionally run E2E pre-push (otherwise CI-only)

**Install (new dep, deferred to this phase):**
- `@axe-core/playwright` — accessibility scan integration

## Implementation Steps (TDD)

### Step 1 — Write E2E specs

```ts
// e2e/shell-navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Shell navigation', () => {
  test('redirects / to /vi/workflows', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/vi/workflows');
  });

  test('shell sidebar persists between sections (no full reload)', async ({ page }) => {
    await page.goto('/vi/workflows');
    const sidebar = page.getByRole('navigation', { name: /sidebar/i });
    await expect(sidebar).toBeVisible();

    // navigate to docs
    await page.goto('/vi/docs/engineer/01-core-workflow');
    await expect(sidebar).toBeVisible(); // same element, persistent
    await expect(sidebar).toContainText(/engineer/i); // docs tree now visible

    // navigate to skills
    await page.goto('/vi/skills');
    await expect(sidebar).toBeVisible();
  });

  test('locale switcher preserves sub-path', async ({ page }) => {
    await page.goto('/vi/docs/engineer/01-core-workflow');
    await page.getByRole('button', { name: /english/i }).click();
    await expect(page).toHaveURL('/en/docs/engineer/01-core-workflow');
  });
});
```

```ts
// e2e/command-palette.spec.ts
test('Cmd+K opens palette and navigates on Enter', async ({ page }) => {
  await page.goto('/vi/workflows');
  await page.keyboard.press('Meta+K');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.type('core');
  await page.keyboard.press('Enter');
  // expect navigation to one of the results
  await expect(page).not.toHaveURL('/vi/workflows');
});
```

```ts
// e2e/theme-toggle.spec.ts
test('cycles theme and persists across reload', async ({ page }) => {
  await page.goto('/vi/workflows');
  const toggle = page.getByRole('button', { name: /toggle theme/i });
  await toggle.click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/); // persisted, no FOUC
});
```

```ts
// e2e/mobile-drawer.spec.ts
test.use({ viewport: { width: 375, height: 667 } });

test('hamburger opens drawer, click nav closes', async ({ page }) => {
  await page.goto('/vi/workflows');
  await expect(page.getByRole('navigation', { name: /sidebar/i })).toBeHidden();
  await page.getByRole('button', { name: /open navigation/i }).click();
  await expect(page.getByRole('dialog', { name: /navigation/i })).toBeVisible();
  // click a nav link inside drawer
  await page.getByRole('link', { name: /debugging/i }).click();
  await expect(page.getByRole('dialog', { name: /navigation/i })).toBeHidden();
});
```

```ts
// e2e/accessibility.spec.ts
import AxeBuilder from '@axe-core/playwright';

const routes = ['/vi/workflows', '/vi/docs/engineer/01-core-workflow', '/vi/skills', '/vi/skills/ck-plan'];

for (const route of routes) {
  test(`a11y: ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(critical).toEqual([]);
  });
}
```

### Step 2 — Setup fixtures + config

```ts
// e2e/fixtures/seed-skills-index.ts
// Pre-built deterministic JSON for CI
export const FIXTURE_SKILLS = [/* 5-10 skills minimum for E2E coverage */];
```

```ts
// playwright.config.ts (extend)
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  use: { baseURL: 'http://localhost:3001' },
  webServer: { command: 'npm run dev', url: 'http://localhost:3001', reuseExistingServer: true },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
});
```

### Step 3 — Run + fix

```bash
npm install --save-dev @axe-core/playwright
npm run build:skills
npm run dev &
npm run test:e2e
```

Fix issues surfaced:
- Missing aria-labels
- Color contrast failures (dark mode)
- Focus order issues
- Missing landmarks (header, nav, main)

Lighthouse run:

```bash
npx lighthouse http://localhost:3001/vi/workflows --output html --view
```

### Step 4 — Documentation + handoff

- Update README.md với screenshots admin shell
- Update docs/vi/claudekit-overview.md nếu structure đổi
- Note breaking change: `/` → `/vi/workflows` (old `/vi` redirected)

## Success Criteria

- [ ] All 7 E2E specs pass on `desktop` project
- [ ] Mobile E2E specs pass on `iPhone 13` project
- [ ] axe-core: 0 critical/serious violations cho 4 routes
- [ ] Lighthouse desktop: Perf ≥ 90, A11y ≥ 95
- [ ] Lighthouse mobile: Perf ≥ 80, A11y ≥ 95
- [ ] All Vitest unit tests pass (from phases 1-9)
- [ ] Build success: `npm run build` (incl. build:skills + build:search + next build)
- [ ] No console errors trên all routes
- [ ] Keyboard-only nav reachable trên golden paths
- [ ] Dark mode: no contrast failures
- [ ] No regression: existing tests from old plan still pass
- [ ] README updated với new URL structure + screenshots
- [ ] git commit message theo conventional commits

## Risk Assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| `@axe-core/playwright` flaky trên CI | Medium | Retry 2x; pin versions; deterministic fixtures |
| Lighthouse score variance | High | Run 3x, take median; allow ±5 buffer trên thresholds |
| Mobile viewport tests slow | Medium | Run mobile project in separate shard |
| Skills-index empty trên CI (no ~/.claude/skills) | High | Use fixture JSON via `SKILLS_DIR=e2e/fixtures/skills` env var override trong playwright config — bypasses skip-if-missing for deterministic E2E. <!-- Updated: Validation Session 1 --> |
| Existing E2E từ plan cũ (3-5 tests) conflict | Medium | Run together; update/replace as needed |
| Flaky `network idle` waits | Medium | Use `waitForLoadState('domcontentloaded')` + specific element waits |
| ReactFlow canvas tests fail (canvas a11y) | Low | Exclude canvas region từ axe scan via `include` filter |

## Final deliverable

Pull request bao gồm:
- All 10 phase implementations
- Updated README + screenshots
- Migration note for users: `/vi` URL → `/vi/workflows`
- Changelog entry
- Lighthouse + axe reports attached
