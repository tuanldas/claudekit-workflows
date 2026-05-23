# Unified Layout System — Phase 7 QA Report

**Date:** 2026-05-23
**Tester:** dev-2
**Plan:** `docs/plans/260522-1639-unified-layout-system-redesign/`
**Commits validated:** 71378b6 (tokens) → 1a47550 (primitives) → 1bfe212 (workflows) → 76462bf (skills) → 0b6f664 (docs) → a776fbd (design-system doc).

## Summary

Plan acceptance gates pass. Visual identity preserved (Cinnabar accent + spacing rhythm), typography unified through `text-h*` tokens, all 3 catalog/detail/docs page types now route through reusable templates. Zero critical/serious axe-core violations across 4 sampled routes (`color-contrast` flagged at info level only — pre-existing brand decision per `e2e/accessibility.spec.ts:28`).

## Test results

| Suite | Result |
|---|---|
| `npm run lint` | clean (1 stale warning on `coverage/block-navigation.js`, generated file) |
| `npm run test:run` | 253 passed / 42 files (baseline 224; +29 new from layout refactor) |
| `npm run build` | clean (Next.js 16.2.6 + Turbopack + Tailwind v4) |
| `npm run test:e2e --project=desktop` | 17 passed, 1 flaky (command-palette Escape — retried green), 1 failed (skill-detail catalog→detail — pre-existing infra) |
| `npm run test:e2e --project=mobile` | 17 passed, 1 skipped, 1 failed (same skill-detail) |
| `npm run test:e2e:a11y --project=desktop` | 4 routes pass (workflows / docs / skills / skill-detail) |

### Known E2E fail (not a Phase 4 regression)

`e2e/skill-detail.spec.ts` test #1 (`search filters cards then navigates to detail`) fails because the long-running dev server has cached `loadSkills()` via `unstable_cache` (`src/lib/skills-loader.ts:17`) against the real `~/.claude/skills` tree before Playwright's `globalSetup` re-indexes against fixtures. Verified by running the same spec on pre-Phase-4 code (git stash) — same fail. Fix is out of scope (read-only role); two options for follow-up:

1. Restart dev server before E2E run, or
2. Drop `unstable_cache` from `skills-loader.ts` and rely on Next route segment cache instead.

## Visual diff matrix (desktop, full-page)

`visuals/before/` (phase 1 baseline) vs `visuals/after/` (post-Phase 6):

| Page | Light | Dark | Verdict |
|---|---|---|---|
| `/vi/workflows` | parity | parity | clean — toolbar, grid, cards, sidebar, accent identical |
| `/vi/skills` | minor intentional shift | minor intentional shift | card title font sized via `text-h3` (15px) replacing ad-hoc 13px; mono preserved |
| `/vi/docs` | parity | parity | prose-zinc theme unified with skill-detail; visually identical |

Mobile screenshots captured at `visuals/mobile/` (3 pages × 2 themes = 6 PNGs). No layout breaks, sidebar collapses correctly.

### Intentional changes (documented for sign-off)

1. **Typography unification:** Workflows + Skills card titles now both consume `text-h3` (15px). Skills previously 13px mono — accepted as a deliberate unification per Phase 1 spec.
2. **Card primitive composition:** `WorkflowCard` and `SkillCard` no longer carry inline border/hover CSS — the `Card` primitive (now polymorphic via `as`) owns it. No pixel-level shift observed.
3. **Prose theme parity:** Skill detail page now bakes the same `prose prose-zinc dark:prose-invert …` class string used by Docs — fixes the inconsistency flagged in `plan.md` (Docs was `prose-slate` w/o dark before).
4. **URL query for Skills filter:** `?group=`, `?q=` now persist filter state. Reload + share both restore (verified by hitting `/vi/skills?group=ck` directly).

## A11y verdict

`scanPage` from `e2e/accessibility.spec.ts:35` excludes `.react-flow` and runs `wcag2a + wcag2aa + wcag21a + wcag21aa + best-practice`. Output across all 4 routes:

- **Blocking violations (critical/serious, excluding `color-contrast`):** 0
- **Info-only (`color-contrast`, by-design):** workflows 44 nodes, docs 18, skills 268, skill-detail 130 — same buckets as pre-redesign baseline; not introduced by Phase 1–6 refactor

## Manual checks performed via baseline run

- Mobile drawer opens/closes (covered by `e2e/mobile-drawer.spec.ts` — passed)
- Command palette Cmd+K open + Escape close (covered by `e2e/command-palette.spec.ts` — passed; flake retried green)
- Theme toggle light → dark → system (covered by `e2e/theme-toggle.spec.ts` — passed)
- URL query state survives reload — verified above
- Workflow inline-expand with ReactFlow canvas (covered by `e2e/workflow-detail.spec.ts` — passed)
- Skill detail page MDX rendering (covered by `e2e/skill-detail.spec.ts` test #2 — passed)

## Recommendations

1. Apply one of the two `unstable_cache` fixes mentioned above so skill-detail E2E test #1 stops failing against a long-running dev server.
2. Consider Playwright visual-regression snapshots (`toHaveScreenshot`) as a CI gate in a follow-on plan, so we don't rely on manual side-by-side comparison after future refactors.
3. The `color-contrast` info bucket is large (skills 268 nodes) — a follow-up brand tweak could close the gap; out of scope here.

## Status

**DONE_WITH_CONCERNS** — concerns are pre-existing infra (E2E dev-server cache) and a brand-decision a11y bucket (color-contrast info), neither caused by Phase 1–6 work.

## Unresolved questions

None blocking. The two recommendations above are non-blocking enhancements.
