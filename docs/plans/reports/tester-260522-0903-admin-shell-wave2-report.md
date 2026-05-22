---
title: Tester verification report — Wave 2 (Phase 2/3/4/8)
date: 2026-05-22
agent: tester
team: admin-shell-wave2
head_commit: cb149d1
branches_merged:
  - wave2/dev-1-phase-2-workflows-migration (Phase 2)
  - wave2/dev-2-docs-layout (Phase 3)
  - wave2/dev-3-theme-system (Phase 4)
  - wave2/dev-4-mobile-drawer (Phase 8)
verdict: FAIL
---

# Verdict: FAIL

`npm run build` fails on prerender of `/[locale]/workflows`. All other criteria pass. Build failure is a hard blocker (deploy-affecting). Fix-then-revert summary at bottom.

---

## 1. Static checks

| Check | Result | Detail |
|---|---|---|
| `npm run test:run` | PASS | 23 files, 138 tests, 0 fail, 1.58s |
| `npm run lint` | PASS | 0 errors, 1 warning (`coverage/block-navigation.js` unused-disable — generated file noise) |
| `npx tsc --noEmit` | PASS | clean, exit 0 |

### Test breakdown (138 total)

- `src/lib/locale-routing.test.ts` — 14 tests
- `src/lib/mdx-loader.test.ts` — 7
- `src/lib/docs-tree.test.ts` — 7
- `src/lib/skills-loader.test.ts` — 4
- `src/lib/body-scroll-lock.test.ts` — 4
- `src/lib/smoke.test.ts` — 4
- `src/lib/theme-context.test.tsx` — 11 (Phase 4)
- `src/lib/theme-init-script.test.ts` — 8 (Phase 4)
- `src/lib/mdx-compile-shiki-dual-theme.test.ts` — 2 (Phase 4)
- `scripts/build-skills-index.test.ts` — 8
- `src/app/[locale]/docs/[...slug]/page.regression.test.tsx` — 3 (Phase 3)
- `src/components/shell/admin-shell.test.tsx` — 3
- `src/components/shell/sidebar.test.tsx` — 5
- `src/components/shell/sidebar-workflows-nav.test.tsx` — 6 (Phase 2)
- `src/components/shell/sidebar-docs-tree.test.tsx` — 4 (Phase 3)
- `src/components/shell/floating-toc.test.tsx` — 3 (Phase 3)
- `src/components/shell/breadcrumb.test.tsx` — 4
- `src/components/shell/locale-switcher.test.tsx` — 3
- `src/components/shell/theme-toggle.test.tsx` — 10 (Phase 4)
- `src/components/shell/hamburger-button.test.tsx` — 4 (Phase 8)
- `src/components/shell/mobile-drawer.test.tsx` — 9 (Phase 8)
- `src/components/shell/mobile-drawer-context.test.tsx` — 4 (Phase 8)
- `src/components/workflows/workflows-page-content.test.tsx` — 8 (Phase 2)

Wave 2 net-new tests visible above: ~74 (Phase 2: 14, Phase 3: 10, Phase 4: 31, Phase 8: 17). Earlier wave-1 baseline preserved.

### Test noise (non-blocking)

- `src/components/shell/mobile-drawer.test.tsx` warns: `Received \`true\` for a non-boolean attribute \`jsx\`/\`global\`` — happy-dom does not understand `<style jsx global>` styled-jsx attributes. Test still passes; warning prints to stderr only.

---

## 2. Build verification — FAIL

```
> claudekit-workflows@0.1.0 build
> npm run build:skills && npm run build:search && next build

build:skills → Indexed 252 skills (50 collisions deduped) — OK
build:search → vi: 284 entries, en: 252 entries — OK
next build   → Compiled successfully (1786ms), TypeScript OK (2.2s)
             Static pages 32/43 OK, then:

⨯ useSearchParams() should be wrapped in a suspense boundary at page "/[locale]/workflows".
   Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
Error occurred prerendering page "/vi/workflows".
Export encountered an error on /[locale]/workflows/page: /vi/workflows, exiting the build.
⨯ Next.js build worker exited with code: 1
```

### Root cause

`src/app/[locale]/workflows/page.tsx` wraps its own `<WorkflowsPageContent>` (which calls `useSearchParams`) in a `<Suspense>` boundary. PASS for that component.

But `SidebarWorkflowsNav` (`src/components/shell/sidebar-workflows-nav.tsx:16`) — added by Phase 3 wiring — ALSO calls `useSearchParams()`. It is rendered by `<AdminShell>` → `<Sidebar>` in `src/app/[locale]/layout.tsx`, OUTSIDE the page-level Suspense. Layouts render above pages in the React tree, so the page's Suspense does not cover the layout.

When Next.js attempts to statically prerender `/vi/workflows`, the layout sidebar bails out into CSR — but with no Suspense ancestor in the layout/shell, prerender errors.

### Reproduction

```bash
git checkout cb149d1
npm install
npm run build
# expect exit code 1 on "/vi/workflows" prerender
```

### Suggested fix (info only — no code changes per task constraint)

Wrap `<Sidebar>` (or just the `SidebarWorkflowsNav` portion of it) in `<Suspense fallback={null}>` inside `admin-shell.tsx`, or move the `useSearchParams` call into a child component wrapped in Suspense within `sidebar.tsx`. Should be ≤5 line change in one of:

- `src/components/shell/admin-shell.tsx:41` and `:55` — wrap `<Sidebar ...>` in `<Suspense>`
- `src/components/shell/sidebar.tsx:37` — wrap `<SidebarWorkflowsNav ...>` in `<Suspense>`

### Build artefact note

`.next/` partially populated but failed before output finalization. No bundle-size delta measurable.

---

## 3. Dev smoke tests (npm run dev on :3457)

Dev mode does NOT statically prerender → routes serve via streaming SSR + client hydration, so the build-time error does not surface here. All routes return content correctly under `npm run dev`.

| Criterion | Result | Evidence |
|---|---|---|
| `/vi/workflows` returns 200 | PASS | curl → 200 |
| Grid renders 39 workflow cards | PASS | 39 `<h3>` workflow titles in streamed HTML |
| Sidebar shows category list (11 categories) | PASS | 11 distinct `href="/vi/workflows?category=..."` links + "all" link → 12 total nav links |
| No duplicate header on `/vi/workflows` | PASS | exactly 1 `<header role="banner">` |
| `/vi/workflows?category=advanced-pipelines` filters grid | PASS | 6 cards rendered (vs 39); tab "Pipeline Nâng cao" has `aria-pressed="true"` |
| Workflow card click expands inline detail | PARTIAL (static-inspectable only) | `WorkflowsPageContent > expands detail when workflow card clicked` test passes — confirms behavior wired. Live ReactFlow ≥800px lg width not asserted via curl (needs visual or Playwright). |
| `/vi/docs/engineer/01-core-workflow` returns 200 | PASS | curl → 200, 177KB HTML |
| Docs sidebar shows docs tree | PASS | 29 distinct doc links (17 engineer + 9 marketing + 2 workflows + roots) |
| `aria-current="page"` on active doc | PASS | 2 occurrences (active doc + active category root) |
| FloatingToc renders with `hidden 2xl:block` | PASS | class `"hidden 2xl:fixed 2xl:top-20 2xl:right-8 2xl:block 2xl:max-h-... 2xl:w-56"` present |
| Theme-init script in `<head>` (no FOUC) | PASS | inline IIFE reads `localStorage.getItem('claudekit-theme')`, queries `prefers-color-scheme: dark`, toggles `documentElement.classList.add/remove('dark')` — verified in served HTML |
| `<html>` element has `suppressHydrationWarning` | PASS | confirmed in RSC payload |
| Theme toggle button has VI aria-label | PASS | `aria-label="Đổi giao diện (Theo hệ thống)"` |
| Theme toggle behavior (system→light→dark cycle, html.dark toggled, persists across reload) | PASS (unit-verified) | `theme-toggle.test.tsx` (10 tests) + `theme-context.test.tsx` (11 tests) all pass — covers cycle, html.dark class, localStorage persistence |
| Code block on docs page has Shiki dual theme CSS vars | PASS | `style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e"` confirmed on `/vi/docs/engineer/13-safety-context` |
| Shiki `<pre class="shiki shiki-themes ...">` and dual-theme markers in DOM | PASS | grep finds `shiki`, `shiki-light`, `shiki-dark`, `shiki-light-bg`, `shiki-dark-bg`, `shiki-themes` |
| HamburgerButton has `lg:hidden` | PASS | class `"... lg:hidden dark:text-gray-200 dark:hover:bg-gray-800"` confirmed on rendered topbar |
| Sidebar has desktop variant `hidden ... lg:flex` | PASS | class `"hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex"` confirmed |
| MobileDrawer renders only when `open=true` | PASS | initial HTML has 0 `role="dialog"` elements (drawer closed by default — `mobile-drawer.tsx:70` `if (!open) return null`) |
| Drawer slide-in / Esc close / nav-link close / focus trap | PASS (unit-verified) | `mobile-drawer.test.tsx` (9 tests) + `mobile-drawer-context.test.tsx` (4 tests) — covers Escape, backdrop, body-scroll-lock, focus trap |
| `/vi/skills` returns 200 (placeholder Wave 1) | FAIL | curl → 404. Route directory `src/app/[locale]/skills/` does not exist. Not a Wave 2 regression — flagged as missing scope. |
| `/vi/docs/engineer/02-thinking-tools` regression | PASS | curl → 200 |
| `/en/docs/marketing/01-overview` regression | INVALID PATH | curl → 404, but `docs/en/marketing/` directory does not exist at all, and even `docs/vi/marketing/01-overview.md` does not exist (VI has `01-core.md`). Spec path itself is wrong. Substituted: `/vi/docs/marketing/01-core` → 200 PASS; `/en/docs/engineer/01-core-workflow` → 200 PASS. |
| `/` redirects | PASS | curl → 308 |

### Smoke-mode caveats

- ReactFlow 800px width not assertable via curl (client-rendered canvas with dynamic SVG layout). Unit test `workflows-page-content > expands detail when workflow card clicked` covers the wiring; visual width is a UI assertion better caught by Playwright/manual.
- Viewport-specific behavior (375px hamburger visible / lg sidebar hidden) cannot be observed by curl since responsiveness is CSS-only — verified instead via class names in served HTML + unit tests for HamburgerButton/Sidebar.

---

## 4. Scope deferrals to flag

- **Dark variant audit (dev-3 explicit deferral)**: shell, workflow, docs components have NOT been audited for dark-mode color contrast / dark variants. Confirmed by `dev-3-260522-1229-phase-04-theme-system-dark-mode-report.md`. Future Phase will need full dark-variant sweep.
- **`/vi/skills` placeholder missing**: route directory not present at HEAD `cb149d1`. Either the Wave 1 placeholder was never merged, or it was removed. Re-confirm with lead.
- **EN marketing docs missing**: `docs/en/marketing/` directory does not exist; only `docs/en/engineer/` is populated. Locale fallback (`mdx-loader` en→vi) should kick in but `/en/docs/marketing/01-core` was not tested. Flag as content gap, not Wave 2 regression.

---

## 5. Unresolved questions

1. Is the `/[locale]/workflows` build-time prerender failure considered a hard FAIL for this Wave (blocks merging to prod / Vercel deploy), or acceptable since dev mode works? Recommend treating as hard FAIL.
2. Should `/vi/skills` placeholder be in scope of Wave 2 verification, or deferred?
3. EN marketing docs intentionally absent (locale fallback handles), or content gap to log?

---

## Status

**Status:** DONE_WITH_CONCERNS
**Summary:** Wave 2 tests/lint/typecheck all green (138 tests pass), dev smoke all positive across 4 phases, but production build fails: `/[locale]/workflows` prerender hits `useSearchParams must be wrapped in Suspense` because `SidebarWorkflowsNav` (rendered in layout shell) calls `useSearchParams` outside the page's Suspense boundary.
**Concerns:** Build-time blocker prevents Vercel/static deploy. Fix is small (one Suspense wrapper in admin-shell or sidebar). Reported per task constraint — no code changes made.
