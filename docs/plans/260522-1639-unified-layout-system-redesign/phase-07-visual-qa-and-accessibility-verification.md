# Phase 07 — Visual QA + Accessibility Verification

## Context Links

- All phase-03/04/05 deliverables (refactored pages)
- Phase 01 baseline screenshots in `visuals/before/`
- E2E suite: `e2e/accessibility.spec.ts`, `e2e/workflow-detail.spec.ts`, `e2e/skill-detail.spec.ts`, `e2e/shell-navigation.spec.ts`, `e2e/theme-toggle.spec.ts`, `e2e/mobile-drawer.spec.ts`, `e2e/command-palette.spec.ts`
- Unit suite: `npm run test:run` (baseline 224+ tests)

## Overview

- **Priority:** P1 (gate to "done")
- **Status:** pending
- **Duration estimate:** 2.5h
- **Brief:** Run full test matrix + manual visual comparison vs phase-01 baseline. Capture side-by-side screenshots. Fix any regressions found. Validate accessibility (axe-core) for all 3 page types in both light/dark + mobile.

## Key Insights

1. Project has both unit + e2e + axe a11y suites. Use all.
2. Baseline screenshots from phase-01 (`visuals/before/`) enable visual diff.
3. Mobile testing: viewports `< lg` hide sidebar — verify content still readable + actionable.
4. Dark mode parity check: every page in both `:root` and `.dark` mode.
5. Locale check: VI + EN both render — fallback banner triggers correctly.
6. Cinnabar accent should be visually consistent everywhere — focus ring, active filter, selected card, link, primary button.

## Requirements

### Functional
- Unit tests green (count ≥ baseline).
- E2E tests green (all specs).
- Accessibility (axe-core) clean on:
  - Workflows catalog (VI + EN, light + dark)
  - Workflow detail expanded (VI + EN, light + dark)
  - Skills catalog (VI + EN, light + dark)
  - Skill detail (VI + EN, light + dark)
  - Docs landing (VI + EN, light + dark)
  - Docs slug (VI + EN, light + dark)
- Visual: no rhythm/spacing/typography drift across 3 page types (manual review against phase-01 baseline).
- Mobile (< 1024px): all 3 pages usable, no layout breaks.

### Non-functional
- Capture `visuals/after/` (6 pages × 2 themes = 12 screenshots minimum).
- Capture `visuals/mobile/` (3 pages × 2 themes = 6 screenshots).
- Diff report `docs/plans/reports/visual-qa-260522-1639-unified-layout-system-redesign-report.md` summarizing pass/fail per page.

## Architecture

### Test matrix

| Page | Light | Dark | Mobile | A11y | Visual diff |
|---|---|---|---|---|---|
| Workflows catalog | ✓ | ✓ | ✓ | axe | manual |
| Workflow detail | ✓ | ✓ | ✓ | axe | manual |
| Skills catalog | ✓ | ✓ | ✓ | axe | manual |
| Skill detail | ✓ | ✓ | ✓ | axe | manual |
| Docs landing | ✓ | ✓ | ✓ | axe | manual |
| Docs slug | ✓ | ✓ | ✓ | axe | manual |

Total: 6 pages × 4 dims = 24 verification points (plus 6 axe passes).

## Related Code Files

### Modify (only if regressions found)
- Whatever component the bug lives in.

### Read (verification only)
- All phase 3/4/5 deliverables.

### Create
- `docs/plans/reports/visual-qa-260522-1639-unified-layout-system-redesign-report.md` (summary)
- Screenshots in `docs/plans/260522-1639-unified-layout-system-redesign/visuals/after/` + `/mobile/`

## Implementation Steps

1. **Pre-flight checks** — confirm phase 3/4/5/6 all committed to branch.
2. **Run `npm run lint`** → must be green.
3. **Run `npm run build:skills && npm run build:search`** (pre-build deps for build).
4. **Run `npm run test:run`** → must be green. Compare test count to baseline (should be ≥ baseline + phase-02 new tests).
5. **Run `npm run build`** → must be green.
6. **Start dev:** `npm run dev` in background.
7. **Run e2e** — full suite: `npm run test:e2e`. Investigate any failures.
8. **Run e2e a11y specifically:** `npm run test:e2e:a11y`. Inspect axe violations if any.
9. **Manual visual capture (Playwright or browser):**
   - Workflows catalog `/vi/workflows` + `/en/workflows` × light + dark
   - Workflows detail: click "feature-development" workflow card → screenshot expanded
   - Skills catalog `/vi/skills` + `/en/skills` × light + dark
   - Skill detail: navigate to e.g. `/vi/skills/code-review` × light + dark
   - Docs landing `/vi/docs` + `/en/docs` × light + dark
   - Docs slug: navigate to e.g. `/vi/docs/engineer/01-core-workflow` × light + dark
   - Mobile (375px viewport): all 6 above × light only (skip dark to save time, sample only)
10. **Save to** `docs/plans/260522-1639-unified-layout-system-redesign/visuals/after/` (desktop) + `/visuals/mobile/`.
11. **Compare side-by-side** with phase-01 `visuals/before/`. Note differences. Categorize:
   - **Intentional** (typography scale unified, prose color unified for Docs) — accept.
   - **Regression** (button missing, layout shift, color leak) — log + fix.
12. **Fix any regressions** in source. Re-run lint + test:run + build. Re-capture affected screenshots.
13. **Write QA report** at `docs/plans/reports/visual-qa-260522-1639-unified-layout-system-redesign-report.md`:
    - Test counts (unit + e2e)
    - axe violations (should be 0)
    - Per-page pass/fail with screenshot links
    - Intentional changes vs phase-01 baseline
    - Any deferred items
14. **Update plan.md** — mark all phases `done`, plan status `completed`.
15. **Commit:** `test(qa): visual QA + a11y verification for unified layout system`.

## Todo List

- [ ] Pre-flight: confirm phase 3/4/5/6 committed
- [ ] Run lint → green
- [ ] Run test:run → green, count ≥ baseline
- [ ] Run build → green
- [ ] Run test:e2e → green
- [ ] Run test:e2e:a11y → green
- [ ] Capture desktop screenshots (12)
- [ ] Capture mobile screenshots (6)
- [ ] Compare vs phase-01 baseline
- [ ] Fix any regressions
- [ ] Write QA report
- [ ] Update plan.md status to completed
- [ ] Commit

## Success Criteria

- All unit tests pass.
- All e2e tests pass.
- 0 axe-core violations on 6 page types × 2 themes.
- Visual: no unintended drift; intentional changes documented.
- Mobile usability confirmed.
- QA report exists, complete, signed-off by reviewer (next agent or user).
- Plan status `completed`.

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Axe-core finds a11y regression introduced by template refactor | Medium | High | Templates wrap existing semantics. Tests in phase-02 cover roles + labels. If found, fix immediately — don't ship with regression. |
| Visual diff reveals unexpected color/spacing shift | Medium | Medium | Side-by-side baseline. Accept intentional (token-scale-unification); fix unintentional. |
| E2E tests query selectors that changed | Medium | Low | Update selectors using `role` + `accessible-name` patterns (not class names). E2E uses Playwright's recommended selector strategies. |
| Mobile drawer + new templates interaction issue | Low | Medium | Templates render inside `PageShell`, sidebar/mobile drawer already separate concern. Re-verify on mobile viewport. |
| Dark mode color drift on prose article (Skills/Docs unified to zinc dark:invert) | Low | Low | Document as intentional in QA report. |
| Test runtime exceeds CI budget | Low | Low | E2E suite has been running fine in previous waves. Run locally first. |

## Security Considerations

- A11y is part of security/inclusion mandate. axe-core covers WCAG 2 AA — meeting this is non-negotiable.

## Next Steps

- Plan complete. Update CLAUDE.md if any new insights emerged.
- Consider follow-on plan if patterns emerge for: notifications, dialogs, dropdowns — primitives missing from this scope.

## Unresolved Questions

1. Visual regression baseline: should we use Playwright visual regression assertions (`toHaveScreenshot`) for ongoing CI gate? Out of scope here but worth proposing in follow-up. Currently manual diff in this phase.
