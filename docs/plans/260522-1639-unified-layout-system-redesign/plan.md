---
title: "Unified Layout System Redesign"
description: "Standardize visual + structural layout across Workflows, Skills, Docs pages with reusable templates"
status: pending
priority: P1
effort: 14h
branch: main
tags: [design-system, layout, refactor, frontend, cinnabar]
created: 2026-05-22
---

# Unified Layout System Redesign

**Slug:** `unified-layout-system-redesign`
**Date:** 2026-05-22
**Branch (suggested):** `feat/unified-layout-system`

## Vấn đề

User feedback: "mỗi trang mỗi categories lại một kiểu thiết kế, mỗi lần thêm mới lại lòi ra một thiết kế mới". Tokens + primitives đã ổn (Cinnabar minimal phase 1-4 done), nhưng template/layout patterns lệch:

| Aspect | Workflows | Skills | Docs |
|---|---|---|---|
| Toolbar (search+filter+count) | `SearchBar` + inline span | `Input` + native `<select>` | n/a |
| Card markup | `<button>` reinvent | `<Link>` reinvent (Card unused) | n/a |
| Filter mechanism | URL query | useState | n/a |
| Empty state | inline `div` | `EmptyState` local fn | n/a |
| Detail header | inline metadata strip + local `SectionLabel` + local `CloseButton` | `SkillHeader` strip | none |
| Article styling | n/a | `prose-zinc dark:prose-invert` | `prose-slate` (no dark) |

## Mục tiêu

Một bộ **layout templates** reusable (`CatalogTemplate`, `DetailTemplate`, `DocsTemplate`) + 6 layout primitives (`PageToolbar`, `CatalogGrid`, `EmptyState`, `SectionLabel`, `DetailHeader`, `FilterSelect`) khoá visual identity ở **Cinnabar Minimal** (giữ tokens hiện có) nhưng chuẩn hoá rhythm + spacing + typography.

## Nguyên tắc

- **Visual identity preserved** — Cinnabar accent `#c96442` light + `#e08363` dark giữ nguyên. Tokens không đổi (đã ship phase 1-4).
- **Typography scale formal hoá** — page-title / section-title / card-title / body / caption / mono — chỉ 6 bậc.
- **Spacing rhythm 4pt** — page py 32px, gap-grid 16px, gap-stack 24px, card-padding 16px (sm) / 24px (lg).
- **Composition over config** — templates accept children/slots, không có 20-prop monsters.
- **Template owns layout, page owns data** — `WorkflowsPage` chỉ fetch + truyền data; `CatalogTemplate` xử lý toolbar/grid/empty.
- **A11y untouched** — axe-core specs đang pass, không regress.
- **Locale-aware** — tất cả text qua `i18n/translations.ts` hoặc props, không hardcode.
- **No emoji** trong code/markdown (project convention).

## Phases

| # | Phase | Status | Duration | Owns Files |
|---|-------|--------|----------|------------|
| 1 | [Design tokens audit + scale formalization](./phase-01-design-tokens-audit-and-refresh.md) | pending | 1.5h | `globals.css`, `docs/docs/design-system.md` (scaffold) |
| 2 | [Layout primitives + templates](./phase-02-layout-primitives-and-templates.md) | pending | 3h | `components/shell/page-toolbar.tsx`, `catalog-grid.tsx`, `empty-state.tsx`, `section-label.tsx`, `detail-header.tsx`, `catalog-template.tsx`, `detail-template.tsx`, `docs-template.tsx`, `components/ui/filter-select.tsx` |
| 3 | [Refactor Workflows page](./phase-03-refactor-workflows.md) | pending | 2h | `components/workflows/workflows-page-content.tsx`, `components/workflow-card.tsx`, `components/workflow-detail.tsx` |
| 4 | [Refactor Skills page](./phase-04-refactor-skills.md) | pending | 2h | `components/skills/skills-catalog-content.tsx`, `skill-card.tsx`, `skill-detail-page.tsx`, `skill-header.tsx` |
| 5 | [Refactor Docs page](./phase-05-refactor-docs.md) | pending | 1h | `app/[locale]/docs/layout.tsx`, `app/[locale]/docs/[...slug]/page.tsx`, `app/[locale]/docs/page.tsx` |
| 6 | [Design system doc](./phase-06-design-system-doc.md) | pending | 1h | `docs/docs/design-system.md`, `CLAUDE.md` patch |
| 7 | [Visual QA + a11y verification](./phase-07-visual-qa-and-a11y.md) | pending | 2.5h | tests/e2e, no source changes |

**Total estimate:** 13–14 hours. Phases 3/4/5 có thể song song (different files) sau khi phase 2 done.

## Dependency graph

```
Phase 1 (typography + spacing scale finalized in globals.css)
   │
Phase 2 (primitives + templates depend on scale)
   │
   ├──→ Phase 3 (Workflows uses templates)
   ├──→ Phase 4 (Skills uses templates)
   └──→ Phase 5 (Docs uses templates)
           │
           ▼
Phase 6 (design-system.md documents finalized API)
   │
Phase 7 (e2e + a11y verify nothing regressed)
```

Phase 1 + 2 BẮT BUỘC tuần tự. Phase 3/4/5 parallel-safe (no shared edits). Phase 6 chờ 5 xong. Phase 7 sau cùng.

## Key decisions (proposed, may revise in phase-01)

1. **Cinnabar accent:** GIỮ. Subtle/hover variants không đổi.
2. **Typography:** 6-bậc scale `--text-{display,h1,h2,h3,body,caption}` với line-height pair. Replace ad-hoc `text-2xl sm:text-3xl` patterns.
3. **Spacing:** Formalize 4pt scale tokens `--space-{1..12}`. Map to Tailwind via `@theme inline`.
4. **Card primitive:** Standardize trên `Card` đã có (currently unused in catalogs). Catalog cards extend `Card` + interactive prop.
5. **Filter mechanism:** Unify on **URL query** (Workflows pattern). Skills page chuyển từ `useState` → searchParams. Trade-off: SSR-friendly + shareable URL; cost: hydration tweak.
6. **Detail expansion behavior:** Workflows giữ inline-expand. Skills giữ separate route. Họ DÙNG cùng `DetailHeader` primitive nhưng template khác nhau (`DetailInline` vs `DetailPage`).
7. **Prose theme:** Standardize `prose prose-zinc max-w-none dark:prose-invert` + custom overrides. Apply trên cả Skills detail + Docs (fix inconsistency).

## Risks + mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| URL-query migration breaks Skills page bookmarks | Low | Low | Skills chưa có URL filter → không có bookmark cũ cần preserve. Phase 4 step 1 verify. |
| Typography token rename breaks downstream Tailwind classes | Medium | Medium | Add new `--text-*` tokens NEXT to existing utilities. Migrate file-by-file in phase 3/4/5. Don't remove old until phase 7 verifies. |
| Prose styling change shifts MDX layout | Low | Medium | Test Skills detail + Docs page side-by-side in phase 7. Capture before/after screenshots. |
| Inline `SectionLabel` + `CloseButton` removal breaks workflow-detail | Low | Low | Replace 1:1 in phase 3. Tests `workflow-detail.spec.ts` will catch. |
| Refactor causes axe-core a11y regression | Low | High | Phase 7 runs `npm run test:e2e:a11y` against all 3 page types light+dark. |
| Sidebar nav (already shipped) interaction with new templates | Low | Medium | Templates render inside `PageShell` only — sidebar unchanged. Phase 2 step 1 verifies. |
| ReactFlow canvas inside `DetailInline` width calc | Low | Medium | Workflow detail has 2-col layout with ReactFlow on right. Phase 3 keeps 2-col grid intact inside new `DetailInline` wrapper. |

## Out of scope

- Storybook / Figma integration (YAGNI)
- Search upgrade to Fuse.js (separate concern)
- Mobile drawer redesign (already shipped in admin-shell phase 8)
- Adding dark mode (already shipped phase 4 of previous redesign)
- Refactoring sidebar nav (already shipped phase 9)

## Rollback

Each phase commits independently. Revert single commit if regression. Phase 3/4/5 each touch isolated component dirs — no cross-cutting rollback complexity.

## Success criteria (whole plan)

- All 3 page types (Workflows/Skills/Docs) render via `CatalogTemplate`/`DetailTemplate`/`DocsTemplate` — no inline layout assembly.
- Typography classes consistent (no `text-2xl sm:text-3xl` ad-hoc in feature components — only in templates).
- `npm run lint` clean, `npm run test:run` ≥ current pass count (224+), `npm run test:e2e:a11y` clean.
- Visual: 3 pages × light/dark = 6 screenshots stored in `visuals/` showing zero rhythm/spacing/typography drift.
- `docs/docs/design-system.md` exists, ≤ 200 lines, contains "how to add a new page" recipe.
- New page can be added by composing templates + data, zero new layout markup.

## Unresolved questions

1. **Typography token naming:** prefix `--text-*` vs `--font-size-*`? (decide phase-01)
2. **`docs/docs/design-system.md` location:** project convention says docs in `docs/vi/` and `docs/en/`. Design-system doc is internal developer doc — put in `docs/docs/` per project conventions, or `docs/vi/design-system.md` for parity with rest of docs structure? (decide phase-06)
3. **Card hover state:** keep current `hover:bg-surface hover:border-border-strong` or unify on single `hover:bg-surface-hover`? (decide phase-02)
