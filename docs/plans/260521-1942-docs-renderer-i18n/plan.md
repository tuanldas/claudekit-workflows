---
title: "Docs Renderer + i18n + Workflow JSON migration foundation"
description: "Build /docs route rendering 32+ markdown files với i18n (vi/en), auto-discover sidebar, full-text search, code highlight. Refactor app sang /[locale]/ structure. Workflow JSON migration tách plan riêng sau."
status: completed
priority: P2
branch: "main"
tags: [docs, i18n, mdx, refactor, tdd]
blockedBy: []
blocks: []
created: "2026-05-21T12:44:16.161Z"
createdBy: "ck:plan"
source: skill
---

# Docs Renderer + i18n + Workflow JSON migration foundation

## Overview

Build trang `/docs` render 32 file markdown trong `docs/` thành interactive documentation site. Refactor app sang `/[locale]/` routing structure để support i18n VI + EN. Sidebar auto-discover từ folder structure (zero-config). Features: code highlight, TOC, search, anchor links, fallback EN→VI banner.

Tổng effort: **9-13h** chia 5 phases TDD-structured. Workflow JSON migration (chuyển workflows.ts → JSON files) tách plan riêng sau khi docs renderer ship.

## Context & References

**Brainstorm:** [brainstorm-260521-1702-docs-renderer-i18n-design-report.md](../reports/brainstorm-260521-1702-docs-renderer-i18n-design-report.md)

**Research reports:**
- [i18n MD patterns](../reports/researcher-260521-1702-i18n-md-patterns-report.md) — subdirectory pattern wins
- [MDX + Next.js 16 stack](../reports/researcher-260521-1718-mdx-nextjs16-stack-report.md) — research suggested `@next/mdx`; post-red-team revised to `@mdx-js/mdx` `evaluate` (Approach C) vì `.md` ngoài `src/app/` không fit file-based routing
- [flexsearch + cmdk](../reports/researcher-260521-1718-search-flexsearch-cmdk-report.md)
- [TDD Next.js 16 + MDX](../reports/researcher-260521-1720-tdd-nextjs16-mdx-report.md) — Vitest 2.0 + RTL + happy-dom

## Deployment target

**Vercel serverful** (full SSR + Edge functions). `dynamicParams = true`. Implies:
- Sidebar tree dùng `unstable_cache` (re-build per docs/ change, không per-request)
- Fallback EN→VI render-on-demand OK
- `generateStaticParams` chỉ generate routes mà file EXISTS trong locale đó; missing routes fall to dynamic SSR + cache

## MDX rendering approach — Approach C (final)

**Decision**: Request-time compile dùng `@mdx-js/mdx` `evaluate` trực tiếp (canonical RSC pattern) + `unstable_cache` cho file read. `.md` giữ nguyên ngoài `src/app/`.

Lý do (per red-team):
- `@next/mdx` file-based routing không fit khi source files ở `docs/{locale}/` ngoài app dir
- `next-mdx-remote/rsc` archived Apr 2026 → tránh
- Approach B (copy/symlink) gây watch-mode stale + xung đột dynamic route
- Approach A (`next-mdx-remote-client` fork) research warn "avoid"
- `@mdx-js/mdx` `evaluate` là foundation primitive — không lock-in, control hoàn toàn

## Tech stack additions

| Package | Version | Purpose |
|---------|---------|---------|
| `@mdx-js/mdx` | latest | `evaluate()` request-time render trong RSC |
| `@mdx-js/react` | latest | React peer (MDXProvider context) |
| `@types/mdx` | latest | TS types |
| `remark-gfm` | 4.0.0 | GFM (tables, strikethrough, tasklists) |
| `rehype-slug` | 6.0.0 | Auto heading ids |
| `rehype-autolink-headings` | 7.1.0 | Anchor links |
| `@shikijs/rehype` | 0.21.0+ | Build-time syntax highlight (github-light/dark) |
| `gray-matter` | 4.0+ | Frontmatter parsing |
| `flexsearch` | **^0.7.31** (LOCKED, NOT 0.8) | Client-side search Flat Index + sidecar metadata |
| `cmdk` | 1.0+ | Cmd+K modal (Vercel/shadcn standard) |
| `@tailwindcss/typography` | v4 | Prose styling (CSS `@plugin` syntax) |
| `vitest` | 2.0+ | Test runner |
| `@testing-library/react` | 16+ | Component testing |
| `happy-dom` | latest | DOM mock |
| `playwright` | latest | E2E flows (Phase 5 add 3-5 E2E tests) |
| `msw` | latest | Fetch mock cho search index tests |

**Removed**: `next-mdx-remote/rsc` (archived Apr 2026), `next-mdx-remote` main (lock-in, dùng `@mdx-js/mdx` primitive thay), `@next/mdx` (không fit Approach C), bare `shiki`.

**Threat model**: Markdown sources là **trusted** (commit qua PR review). Nếu future cho phép user-contributable content (CMS, GitHub issues sync), MUST re-evaluate MDX safety config.

## Phases

| Phase | Name | Effort | Status |
|-------|------|--------|--------|
| 1 | [TDD setup](./phase-01-tdd-setup.md) | 3-4h | ✅ Completed |
| 2 | [Locale restructure](./phase-02-locale-restructure.md) | 2-3h | ✅ Completed |
| 3 | [MDX pipeline + auto-discover](./phase-03-mdx-pipeline-auto-discover.md) | 4-5h | ✅ Completed |
| 4 | [Docs UI shell + mobile](./phase-04-docs-ui-shell.md) | 5-7h | ✅ Completed |
| 5 | [Search + revalidate + E2E](./phase-05-search-and-translation-banner.md) | 4-6h | Pending |

**Tổng**: 18-25h (post-red-team + validate revised).

## Decisions from validate interview

| Topic | Decision |
|-------|----------|
| Cache invalidation | Manual `/api/revalidate` route, called bởi deploy webhook |
| EN content workflow | Manual file-by-file dịch, banner cho missing translations |
| Coverage gate | Pre-commit hook qua `lefthook` (not CI) |
| Mobile responsive | Full mobile-first redesign trong Phase 4 |

## Cross-phase dependencies

```
Phase 1 (TDD setup)
   ↓
Phase 2 (Locale restructure)  ← phải xong trước MDX vì routing thay đổi
   ↓
Phase 3 (MDX pipeline) ←─┐
   ↓                     │ depends on routing structure
Phase 4 (Docs UI)        │
   ↓                     │
Phase 5 (Search + banner)
```

Mỗi phase tests-first per `--tdd` flag.

## Out of scope

- Workflow JSON migration (chuyển `src/data/workflows.ts` → JSON files) — tách plan riêng sau khi docs renderer ship
- EN content translation (chỉ setup fallback infra, không dịch nội dung)
- Dark mode (chưa có DESIGN.md)
- Mobile responsive polish (best-effort, không strict)
- Translation service integration (Crowdin/Lokalise)

## Success criteria (overall)

- [ ] Truy cập `/vi/docs` thấy sidebar auto-generated từ `docs/vi/` folder tree
- [ ] Click page render đúng nội dung với code highlight, heading anchors
- [ ] `/en/docs/X` (file thiếu, VI exists) → fallback VI + banner + `<link rel="canonical" href="/vi/docs/X">`
- [ ] `/vi/docs/X` (file thiếu, EN exists) → fallback EN + banner (symmetric)
- [ ] Locale switcher: nếu target locale missing → inline confirm trước khi push route (KHÔNG silently swap URL)
- [ ] Cmd+K search xuyên 32 file md production; dev show "Search unavailable in dev"
- [ ] Existing `/` 308 → `/vi` (verify `curl -I`)
- [ ] Add file md mới chỉ cần đặt đúng folder + filename
- [ ] Vitest coverage gate: lines ≥70%, branches ≥60% (CI enforced)
- [ ] Production `npm run build` OK
- [ ] Sidebar tree cached (verify no fs reads on second page load via logging)
- [ ] Playwright E2E: 3-5 tests pass (locale switch, docs nav, search keyboard, fallback)

## Risks (top-level, post-red-team)

1. **`@shikijs/rehype` serializable options** — config `{ themes: { light, dark } }` là serializable JSON → Turbopack OK. Risk DROPPED (red-team confirm).
2. **Next.js 16 `params` Promise breaking** — dynamic routes phải `await params`.
3. **Tailwind v4 typography** — CSS `@plugin` syntax.
4. **`CLAUDE.md` + internal cross-references** — sau move docs/ → docs/vi/, audit tất cả paths bằng grep (xem Phase 2 Step 7).
5. **Vercel deploy preserve 308 redirect** — verify post-deploy với `curl -I /`.
6. **Sidebar tree cache invalidation** — `unstable_cache` revalidate strategy: dùng file mtime hash hoặc deploy-time invalidation; spec trong Phase 3.
7. **flexsearch 0.7 vs 0.8 API drift** — version-pinned `^0.7.31` để match research report patterns.
8. **Coverage threshold gate** — Vitest config thresholds enforced ở CI, không advisory.

## Dependencies

- No cross-plan dependencies (first plan in this codebase)
- Internal: Phase 2 → Phase 3 → Phase 4 → Phase 5 (linear chain)
- Phase 1 (TDD) parallel-safe nhưng nên làm trước để tests-first
