---
phase: 4
dev: dev-3
date: 2026-05-22
branch: wave2/dev-3-theme-system
status: DONE
---

# Phase 4 — Theme system dark mode (dev-3)

## Scope delivered

Theme infrastructure ONLY (light/dark/system + Shiki dual theme). Per
lead scope guard: dark variants on existing shell/workflow/docs components
are **deferred** to a follow-up lead pass after Wave 2 merge — avoids file
conflicts with dev-1/2/4.

## Files

**Created:**
- `src/lib/theme-init-script.ts` — `getThemeInitScript()` returns IIFE
  string. Reads `localStorage['claudekit-theme']` (default `system`),
  resolves via `matchMedia('(prefers-color-scheme: dark)')`, toggles
  `<html class="dark">`. try/catch guard so blocked storage never throws.
- `src/lib/theme-init-script.test.ts` — 8 tests (string shape +
  evaluated behavior for light/dark/system cases).
- `src/lib/theme-context.test.tsx` — 11 tests (defaults, hydrate,
  localStorage persist, resolvedTheme derivation, html.dark toggle,
  matchMedia subscription + ignore-when-explicit).
- `src/components/shell/theme-toggle.test.tsx` — 9 tests (cycle order,
  icon swap, locale aria-label).
- `src/lib/mdx-compile-shiki-dual-theme.test.ts` — 2 tests (asserts
  `--shiki-light` + `--shiki-dark` + `-bg` vars emitted; no bare inline
  `color:` outside vars).

**Modified:**
- `src/lib/theme-context.tsx` — real ThemeProvider. `theme` + `systemTheme`
  state, `resolvedTheme` derived; one effect syncs `html.dark`, another
  subscribes to matchMedia (unconditional — subscription is cheap, only
  consumed when `theme === 'system'`). `useTheme()` throws outside
  provider.
- `src/components/shell/theme-toggle.tsx` — enabled button, cycle order
  `light → dark → system → light`, inline SVG icons (Sun/Moon/Monitor)
  tagged with `data-testid` for tests. aria-label localized: e.g.
  `"Đổi giao diện (Theo hệ thống)"`. No `lucide-react` dep added.
- `src/app/layout.tsx` (ROOT) — injects `<script
  dangerouslySetInnerHTML={...}` in `<head>`. `colorScheme: "light dark"`,
  themeColor entries for both schemes. `suppressHydrationWarning` on
  `<html>` because init script may add `dark` class before React
  hydrates.
- `src/app/globals.css` — `@variant dark`, `:root` + `.dark` blocks
  redefine `--background` / `--foreground`, Shiki swap rules:
  `.shiki / .shiki span { color: var(--shiki-light); background-color:
  var(--shiki-light-bg); }` + `.dark .shiki / .dark .shiki span` flip
  to `--shiki-dark` / `-bg`.
- `src/lib/mdx-compile.ts` — `rehypeShiki` `theme: 'github-light'` →
  `themes: { light: 'github-light', dark: 'github-dark' }` +
  `defaultColor: false`.
- `src/i18n/translations.ts` — `theme.light / .dark / .system` labels VI/EN.

**Untouched (per scope guard):**
- All other shell components (admin-shell, sidebar, topbar, breadcrumb,
  locale-switcher, sidebar-*-nav, mobile-drawer, hamburger-button,
  command-palette-trigger, sidebar-header) — still light-only.
- workflows-page-content, workflow-card, workflow-detail,
  workflow-flow-canvas — still light-only.
- docs components (docs-sidebar-item, translation-banner, code-block,
  floating-toc) — still light-only at component level; Shiki code blocks
  swap automatically via CSS vars.
- `src/app/[locale]/layout.tsx` (dev-2 file).

## Tests

- 92/92 passed across 14 test files.
- New tests: 30 (init-script 8 + context 11 + toggle 9 + Shiki dual 2).
- `npm run lint`: clean.
- `npm run build`: succeeds; 43 static pages generated.

## Smoke verification (dev server on :3009)

- Init script present in `<head>` (raw HTML inspect).
- Initial `<html>` has no `dark` class when no localStorage + matchMedia
  matches=false (correct default-light path).
- `/vi/workflows`: toggle button renders with aria-label
  `"Đổi giao diện (Theo hệ thống)"`, icon = MonitorIcon.
- `/vi/docs/claudekit-overview`: Shiki tokens emit both `--shiki-light:#xxx`
  AND `--shiki-dark:#xxx` (+ `-bg` vars). Confirmed multiple colors
  (foreground tokens, comments, strings) all dual-emitted.

## Bundle impact

theme-context.tsx + theme-toggle.tsx + theme-init-script.ts are small
(<150 LOC total). No new dependency (inline SVGs replace lucide-react).
Expected bundle delta <2KB gzipped (cannot quantify exactly without
before/after `.next` diff, but no third-party module added).

## Commits

1. `1524f36` — feat(theme): light/dark/system theme infrastructure
2. `04deb32` — feat(mdx): Shiki dual theme (github-light + github-dark)

## Risks left for lead follow-up

- Existing components still use light-only Tailwind classes. When toggle
  switches to dark, page background flips (via `--background` var on
  body) but card/sidebar/topbar surfaces stay light → contrast issues.
  Lead's follow-up audit pass needs to add `dark:` variants. **Shiki
  code blocks DO swap correctly** because they paint from CSS vars, not
  Tailwind classes.
- ReactFlow nodes/edges: also light-only. Workflow canvas needs
  CSS-var-driven node colors in follow-up.
- `suppressHydrationWarning` on `<html>` is necessary because init
  script mutates class before hydrate; this is the standard pattern
  (used by next-themes etc.) and safe.

## Unresolved questions

1. Should `prefers-color-scheme: dark` media-color-scheme override the
  light variant during static-HTML render for non-JS users? Currently
  static HTML has no dark class; only init script (requires JS) adds it.
  Acceptable for project per plan but worth noting.
2. ReactFlow `attribution` overlay (Phase 4 risk row) untouched —
  defer to component-level audit.
