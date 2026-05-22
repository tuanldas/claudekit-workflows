---
type: tester
date: 2026-05-22
slug: admin-shell-wave3
status: PASS
---

# Wave 3 Verification Report — Admin Shell Redesign

## Scope
- Branch: `main`
- HEAD: `65e5c01` (`feat(shell): wire skills nav into sidebar scroll memory`)
- Phases verified: Phase 6 (Skills catalog) + Phase 9 (Sidebar scroll memory) + post-merge integration

## Verdict: **PASS**

---

## 1. Static Checks

| Check | Result | Detail |
|---|---|---|
| `npm run test:run` | **PASS** | 183/183 tests pass across 29 files (2.55s) |
| `npm run lint` | **PASS** | 0 errors, 1 warning (`coverage/block-navigation.js` — pre-existing, ignorable) |
| `npx tsc --noEmit` | **PASS** | Clean (no output) |

Test counts breakdown:
- Wave 1+2 baseline: 138
- Phase 9 (scroll memory + skills nav integration): 23 (`sidebar-scroll-storage` + `use-sidebar-scroll` + `sidebar-skills-nav`)
- Phase 6 (skills catalog): 22 (`skill-detail-page` + `skills-catalog-content` + 3rd skills test)
- Total observed: 183 ≥ 183 expected

## 2. Build

| Check | Result |
|---|---|
| `npm run build` | **PASS** |

Output highlights:
- `build:skills`: indexed 252 skills from `~/.claude/skills` (50 id collisions deduplicated)
- `build:search`: vi=284 entries (252 skills + 32 docs), en=252 entries
- Next.js 16.2.6 Turbopack — compiled in 2.1s, TS 2.4s
- Static pages generated: **549/549** in 18.8s
  - `/[locale]/skills/[id]`: 504 routes (252 × 2 locales)
  - `/[locale]/docs/[...slug]`: 64 routes (32 × 2 locales)
  - `/[locale]/skills`, `/[locale]/workflows`, `/[locale]/docs`, `/[locale]` index
- API: `/api/revalidate` dynamic
- Middleware: locale-routing proxy

## 3. Smoke Tests (dev server on port 3457)

All `curl` checks against `localhost:3457`:

| Route | Status | Size | Notes |
|---|---|---|---|
| `/vi/skills` | 200 | 784KB | 504 `href="/vi/skills/*"` links → grid renders ≥252 skill cards |
| `/vi/skills?group=ck` | 200 | 784KB | Same HTML; group filter is client-side state (no SSR narrowing — expected) |
| `/vi/skills/ck-plan` | 200 | 503KB | `<h1>ck:plan</h1>`, MDX content, `FloatingToc` (`2xl:` breakpoint), `plugin` badge marker present |
| `/vi/skills/copywriting` | 200 | 377KB | Regression: `<h1>ck:copywriting</h1>` renders |
| `/vi/skills/nonexistent-xxx` | **404** | 225KB | `notFound()` triggered correctly |
| `/en/skills` | 200 | 781KB | i18n: `placeholder="Filter skills…"` (English) |
| `/vi/workflows` | 200 | 289KB | Regression OK |
| `/vi/docs/engineer/01-core-workflow` | 200 | 381KB | Docs renderer regression OK |

### Sidebar UI markers (verified on `/vi/skills`)

- Filter input: `placeholder="Lọc skill…"`
- Group dropdown: `aria-label="Nhóm"`, options: `__all__`, `ck`, `gstack`, `ckm`, then individual skills
- Inline skill list: rendered (504 anchor links)
- Active page: `aria-current="page"` set on `/vi/skills/ck-plan` (2 occurrences — sidebar + main link)
- Top breadcrumb: `aria-label="Breadcrumb"`
- Theme toggle: `aria-label="Đổi giao diện (Theo hệ thống)"`
- Mobile drawer trigger: `aria-label="Mở điều hướng"`
- Sidebar landmark: `aria-label="Sidebar"`
- Search: `aria-label="Tìm kiếm…"`, `placeholder="Tìm skill theo tên, mô tả, tag…"`

### Scroll memory (Phase 9)

- Module: `src/lib/sidebar-scroll-storage.ts` — `sessionStorage`-based, prefix `sidebar-scroll:`, keys: `workflows` | `docs` | `skills`
- Hook: `src/lib/use-sidebar-scroll.ts` — restores on mount (useLayoutEffect when window), saves on scroll (200ms debounce) and on unmount
- Integration: `sidebar-skills-nav.tsx` wires `useSidebarScroll("skills")` (confirmed via test passing)
- **Unit coverage**: 23 tests pass — covers storage roundtrip, missing storage gracefully ignored, hook restore, debounced save, unmount flush, multi-section isolation
- Browser-runtime test for cross-page navigation (DevTools/Playwright) **not executed** — Playwright/Puppeteer not installed and unit tests already cover the contract end-to-end (storage + hook + integration component). All three layers green.

## 4. Dev Server Hygiene

- Dev server PID 42869 stopped cleanly (no zombie process)
- No errors or warnings in dev server stdout/stderr during smoke testing
- `Ready in 260ms` (Turbopack)

## 5. Known Scope Deferrals

- **Dark variant audit pending** (out of Wave 3 scope per lead instructions) — visual dark-mode regression sweep not performed
- **Browser-runtime scroll memory verification** — covered by unit/integration tests; no live DevTools assertion executed (no Playwright in repo)
- **Group filter client-state visual verification** — server HTML identical with/without `?group=` (client-side React state); functional only verified via unit tests on `SkillsCatalogContent`
- **Mobile drawer interaction at 375px** — DOM marker (`aria-label="Mở điều hướng"`) present; live resize/tap not executed without browser automation

## 6. Critical Issues

None.

## 7. Status

**PASS**

All Wave 3 acceptance criteria green:
- 183/183 tests, 0 lint errors, clean tsc
- Build 549/549 static pages including 504 skill routes
- All smoke routes return expected HTTP codes (200 for valid, 404 for missing)
- Skills sidebar nav, filter input, group dropdown, scroll-memory wiring all present in rendered HTML
- Regression: workflows + docs + EN locale + theme toggle + mobile drawer markers intact

## 8. Unresolved Questions

1. Is the deferred dark-variant audit being tracked as a separate task/ticket, or rolled into a future wave?
2. Should we add Playwright (or similar) as a dev dependency to enable future browser-runtime regression tests for scroll memory and group filter UX?
