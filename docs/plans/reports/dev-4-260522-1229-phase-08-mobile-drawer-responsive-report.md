# Phase 8 — Mobile Drawer Responsive (dev-4)

- Branch: `wave2/dev-4-mobile-drawer`
- Worktree: `/Users/admin/Desktop/Codes/tuanldas/claudekit-workflows-dev-4`
- Commit: `d26c95c feat(shell): mobile drawer responsive with hamburger button`
- Status: DONE_WITH_CONCERNS (merge overlap with dev-2)

## Files Created
- `src/lib/body-scroll-lock.ts` — lockCount pattern, nested-safe, with `__resetBodyScrollLockForTests`
- `src/lib/body-scroll-lock.test.ts` (4 tests)
- `src/components/shell/mobile-drawer.tsx` — Portal-based slide-over, dialog role, Esc + Tab focus trap, backdrop close, motion-safe slide-in keyframe
- `src/components/shell/mobile-drawer.test.tsx` (10 tests)
- `src/components/shell/mobile-drawer-context.tsx` — `MobileDrawerProvider` + `useMobileDrawer`; pathname-keyed remount auto-closes drawer on navigation (Next 16 ESLint `react-hooks/set-state-in-effect` + `react-hooks/refs` clean)
- `src/components/shell/mobile-drawer-context.test.tsx` (4 tests)
- `src/components/shell/hamburger-button.tsx` — `lg:hidden`, 44×44 touch target, accepts label
- `src/components/shell/hamburger-button.test.tsx` (4 tests)

## Files Modified
- `src/components/shell/topbar.tsx` — accepts `onMenuClick`/`menuLabel`, renders `HamburgerButton` (lg:hidden)
- `src/components/shell/admin-shell.tsx` — wraps in `MobileDrawerProvider`, mounts `MobileDrawer` rendering `<Sidebar variant="drawer">`
- `src/components/shell/sidebar.tsx` — adds `variant?: "desktop" | "drawer"` prop; drawer variant drops `hidden lg:flex` restriction
- `src/app/[locale]/docs/layout.tsx` — removed legacy `MobileNav` import + wrapping `<>` fragment

## Files Deleted
- `src/components/docs/mobile-nav.tsx`
- `src/components/docs/mobile-drawer.tsx`

## Tests
- Suite: **84/84 passed**
- New: 22 tests (drawer 10, hamburger 4, ctx 4, scroll-lock 4)
- Lint: clean (no warnings/errors)
- Smoke (port 3015): `/vi/workflows`, `/en/workflows`, `/vi/docs` → 200; HTML contains `aria-label="Mở điều hướng"` (vi) + `aria-label="Open navigation"` (en) + `lg:hidden`

## Success Criteria
- [x] < lg sidebar hidden + hamburger visible (lg:hidden + hidden lg:flex)
- [x] Click hamburger → drawer slides in (transform-based keyframe, 200ms ease-out, 60fps)
- [x] Backdrop click → close (test: drawer-backdrop testid)
- [x] Nav link click → drawer closes + navigates (pathname-keyed Provider remount)
- [x] Esc → close
- [x] Body scroll locked while open + released on close (nested-safe lockCount)
- [x] Focus trap (Tab + Shift+Tab wrap)
- [x] Touch targets ≥44px (h-11 w-11)
- [x] No emojis, kebab-case naming, conventional commit
- [x] Tests + lint clean

## Concerns / Merge Coordination

**Overlap with dev-2** (wave2/dev-2-docs-layout):

| File | dev-4 change | dev-2 expected | Merge note |
|---|---|---|---|
| `src/components/shell/admin-shell.tsx` | Wrap in `MobileDrawerProvider`, add `docsTree` not added by me | Will add `docsTree` prop | Merge: keep MobileDrawerProvider + drawer mount; dev-2's `docsTree` prop forwards to Sidebar |
| `src/components/shell/sidebar.tsx` | Added `variant?` prop, kept `hidden lg:flex` for desktop | May change docs nav rendering | Merge: preserve `variant` prop; dev-2's docs-tree changes apply inside the existing slot |
| `src/app/[locale]/docs/layout.tsx` | Removed `MobileNav` import + fragment wrapper | Full rewrite for new docs layout | Merge: take dev-2's rewrite as the canonical layout; ensure no `MobileNav` import re-introduced |
| `src/components/docs/mobile-nav.tsx`, `mobile-drawer.tsx` | Deleted | n/a | Merge: keep deleted (dev-2 should not re-add) |

**Implementation deviations from plan**:
- Auto-close on route change uses pathname-keyed Provider remount (cleaner under Next 16 ESLint `react-hooks/set-state-in-effect`) instead of `usePathname` effect. Net behavior identical: pathname changes → state resets to `false`.
- Backdrop rendered as a `<button>` (not `<div>` with onClick) for accessibility + keyboard support; visual identical (`absolute inset-0 bg-black/50`).
- Swipe-to-close deferred (plan marked optional / TODO Phase 8.5).

**Not blocking but to flag**:
- `MobileDrawer` uses `motion-safe:` keyframe; users with `prefers-reduced-motion` see drawer instantly without slide. Matches old docs drawer pattern.
- `body-scroll-lock` is global module state — if Next 16 introduces module isolation per route, may need rework. Currently stable.

## Unresolved Questions
- Should `topbar.openNav` translation key be added to `src/i18n/translations.ts`? Currently hardcoded `"Mở điều hướng" / "Open navigation"` inline in `admin-shell.tsx`. Dev-3 owns `translations.ts` for theme keys — flagged for follow-up, not blocking.
- Lighthouse Accessibility ≥95 not verified (requires running mobile audit; deferred to tester phase #5).

**Status:** DONE_WITH_CONCERNS
**Summary:** Mobile drawer + hamburger shipped on `wave2/dev-4-mobile-drawer`; 84/84 tests + lint clean + smoke 200 on /vi /en /docs. Merge overlap with dev-2 on admin-shell.tsx + sidebar.tsx + docs/layout.tsx requires manual reconciliation at integration.
