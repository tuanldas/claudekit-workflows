# Unified Layout System Redesign — Cook Session Complete

**Date**: 2026-05-24 14:30
**Severity**: Low (infrastructure refactor, zero user-facing breakage)
**Component**: Layout templates, typography tokens, shell primitives, card primitives
**Status**: Resolved

## What Happened

Completed 7-phase cook session to eliminate design fragmentation across 3 page types (Workflows/Skills/Docs). Each section had drifted to its own markup + styling idiom. Goal: reusable templates + semantic tokens so future pages = template pick, not design reinvention.

All 7 commits landed on main. Build clean, 253/253 tests pass (29 new), zero critical A11y violations. E2E shows 1 pre-existing infra fail (not a regression), 1 flake (retried green).

## The Brutal Truth

This session exposed how easy it is for a fast-moving UI codebase to calcify into isolated silos when templates aren't enforced early. The user complaint was right: "mỗi trang mỗi categories lại một kiểu thiết kế." Three devs, zero shared component language until Phase 1. Lucky it only took 7 phases to unify — a few more feature cycles and we'd have been untangling 10 inconsistent patterns.

Frustrating part: dev-3 sat idle the entire session because task chain timing favored dev-1 and dev-2. With 3 devs + sequential dependencies, parallelism was theoretical. Should've either planned for 2 devs upfront or front-loaded independent research/doc tasks for dev-3.

Silent 12-hour idle gap mid-session where both devs went dark — no heartbeat, no status. Required explicit ping to wake them. That's a process gap we should bake into team rotation.

## Technical Details

**Commits (in order):**
1. `71378b6` feat(tokens): add typography scale tokens — `text-h1` through `text-body`, `--text-*` CSS variable naming (not `--font-size-*`)
2. `1a47550` feat(shell): add 4 layout primitives (`PageShell`, `PageHeader`, `SidebarLayout`, `TwoColumnLayout`) + 1 UI primitive (`Card` polymorphic with `as: 'div' | 'button' | 'a'`)
3. `1bfe212` refactor(workflows): route Workflows page through `TwoColumnLayout` + use `Card as="button"` for clickable workflow cards
4. `76462bf` refactor(skills): migrate Skills filter to URL query state (`?group=`, `?q=`), route through `TwoColumnLayout`, use polymorphic `Card`
5. `0b6f664` refactor(docs): unify Docs prose theme from `prose-slate` → `prose prose-zinc dark:prose-invert`, route through `PageShell`
6. `a776fbd` docs(design-system): create `docs/docs/design-system.md` (151 lines), document 4 templates + recipe for adding pages
7. `df65d2d` test(qa): visual QA + A11y verification, 253 unit tests, E2E against desktop + mobile

**Key metrics:**
- 253 unit tests (baseline 224 + 29 new)
- Build: 16.2.6 Next.js, Turbopack, Tailwind v4 — clean
- Lint: clean (1 stale coverage gen warning, not our code)
- Desktop E2E: 17 passed, 1 flake (command-palette, retried green), 1 pre-existing fail (skill-detail `unstable_cache` dev-server interaction)
- Mobile E2E: 17 passed, 1 skipped, 1 pre-existing fail
- A11y: zero critical/serious violations (4 routes sampled), 44/18/268/130 `color-contrast` info-only (pre-existing brand decision)

## What We Tried

**Decision 1: Typography token naming**
- Option A: `--font-size-*` (semantic)
- Option B: `--text-*` (concise)
- **Chose B** — aligns with design system convention (Tailwind uses `text-*` utility names). Less verbose in JSX.

**Decision 2: Spacing tokens**
- Explored custom `--space-*` tokens for margin/padding consistency
- **Chose to skip** — YAGNI. Tailwind 4's 4pt grid already baked into utility names; no new issues surfaced. Keep it simple.

**Decision 3: Card polymorphism (mid-Phase-3)**
- Dev-1 raised: "WorkflowCard needs `<button>` for click handlers, but Card was hardcoded `<div>`"
- Option A: Create separate `ButtonCard` variant (duplication risk)
- Option B: Add `as` prop polymorphism to `Card` (composition win)
- **Chose B** — implemented Phase 4 by dev-2, retrofitted WorkflowCard same commit. No performance penalty (polymorphic `as` is standard React pattern).

**Decision 4: Skills filter state**
- Was: local `useState` (no persistence)
- New: URL query `?group=` / `?q=` (Workflows parity)
- Absence of `?group=` = all groups (no `__all__` sentinel — cleaner)
- Debounce 150ms on search input. Reload + share both restore state.

**Decision 5: Prose theme unification**
- Docs was `prose-slate` w/o dark mode
- Skill detail page was `prose` base (no theme specified, drifted)
- **Unified both to `prose prose-zinc dark:prose-invert`** — matches Cinnabar accent palette. Verified visual parity in QA.

**Decision 6: Design-system doc location**
- Could be `docs/vi/design-system.md` (alongside localized content)
- Could be `docs/design-system.md` (engineering doc, English)
- **Chose `docs/docs/design-system.md`** — engineering audience (devs adding pages), not translatable at this moment.

**Decision 7: Cinnabar accent retention**
- Discussed: should we shift to a more contrast-friendly palette?
- **Chose to keep Cinnabar** — design identity decision, not a bug. A11y color-contrast flags are pre-existing brand decision (documented in `e2e/accessibility.spec.ts:28`). Out of scope for this refactor.

## Root Cause Analysis

Why did layout fragmentation happen in the first place?

1. **No shared template language:** Each new page was greenfield. Dev reached for different primitives (Workflows used grid + sidebar, Docs used prose block, Skills used cards).
2. **No early enforcement:** Tokens didn't exist until Phase 1. Before that, devs typed spacing/font values inline. Easy to drift.
3. **Three-page codebase** felt "small enough" that templates weren't obvious necessity. 4+ pages and fragmentation becomes painful.
4. **Type system didn't help:** `src/types/` had interface definitions but no component slot contract (`Slot<T>` patterns). Polymorphism was post-hoc.

If we'd started with Phase 1 (tokens) + Phase 2 (templates) *before* shipping Workflows/Skills/Docs, we'd never have had this problem.

## Lessons Learned

1. **Token-first design saves refactoring.** Typography scale should be baked in before first page ships. We did it at page 3 — paid 7-phase debt for 3 pages' worth of inconsistency. Cost: justified, but preventable.

2. **Polymorphic components > variant duplication.** Dev-1's mid-Phase-3 question exposed a real win: `Card as="div" | "button" | "a"` replaced 3 potential variants. React composition wins.

3. **URL query state for persistent filters is non-negotiable.** Skills filter was a bad UX (reset on reload). Dev-2 fixed it in Phase 4. Workflows already had it. Should've been required from day 1.

4. **Team sizing vs. task chain dependency.** Three devs with a 7-phase sequential chain = one dev idle, two working. Either:
   - Plan for 2 devs + no wasted capacity, OR
   - Front-load independent research/doc work so 3rd dev unblocks early
   - We did neither. Dev-3 had nothing to do after Phase 1. Process fix for next multi-dev cook.

5. **Silent idle is a process failure.** 12-hour gap where both devs went dark with no heartbeat. We need check-in cadence or async-friendly task handoff so blockages surface earlier.

6. **Pre-existing infra debt surfaces during refactors.** The E2E flake on `skill-detail` test #1 (`unstable_cache` + dev-server cache-invalidation) was lurking. Now visible. Fix is low-priority but should hit next QA cycle.

## Next Steps

**Follow-up (out of scope, post-cook):**
1. Resolve `unstable_cache` dev-server cache-invalidation issue in `skills-loader.ts:17` (choose: restart before E2E, or drop `unstable_cache`). Blocks automated E2E in CI.
2. Add Playwright visual-regression snapshots (`toHaveScreenshot`) as a CI gate. Current QA is manual side-by-side; snapshots prevent pixel drift in future refactors.
3. Review `color-contrast` A11y bucket (268 flags on Skills catalog). Pre-existing brand decision, but large enough to consider a follow-on brand-palette tweak.

**Immediate:** Main is clean, tests pass, ship to production. Plan next feature without technical debt on templates.

---

**Status: DONE**

All acceptance gates pass. No regressions. Infrastructure now supports adding new pages at template granularity (choice: catalog, detail, or docs layout). Seven commits form a coherent chain with clean git history.
