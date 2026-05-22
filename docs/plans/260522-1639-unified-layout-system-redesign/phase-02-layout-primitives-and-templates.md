# Phase 02 — Layout Primitives + Page Templates

## Context Links

- `src/components/shell/page-shell.tsx` (24 lines, exists — wrap with max-width container)
- `src/components/shell/page-header.tsx` (38 lines, exists — eyebrow + h1 + description + actions)
- `src/components/shell/admin-shell.tsx` (sidebar + topbar wrapper)
- `src/components/ui/card.tsx:16` (Card primitive exists, currently unused in catalogs)
- `src/components/ui/input.tsx` (Input exists)
- `src/components/search-bar.tsx` (custom search using Input)
- `src/components/workflow-detail.tsx:131` (`SectionLabel` local fn — extract)
- `src/components/workflow-detail.tsx:139` (`CloseButton` local fn — extract)
- `src/components/skills/skills-catalog-content.tsx:93` (native `<select>` — replace)
- `src/components/skills/skills-catalog-content.tsx:123` (local `EmptyState` fn — extract)

## Overview

- **Priority:** P1 (blocks phase 3/4/5)
- **Status:** pending
- **Duration estimate:** 3h
- **Brief:** Tạo 6 layout primitives + 3 page templates. Composition-first, no big config props. Templates ăn `children` + 1-2 specific slots.

## Key Insights

1. `Card`, `CardHeader`, `CardBody`, `CardFooter` đã có nhưng catalog cards bỏ qua dùng `<button>` / `<Link>` raw. Lý do: Card chưa support `as` prop để render thành `<button>`/`<a>`. **Cần thêm `as` prop**.
2. `SectionLabel` xuất hiện local trong `workflow-detail.tsx`. Same pattern dùng được ở Skills detail metadata. → Extract.
3. `EmptyState` cũng local trong `skills-catalog-content.tsx`. Workflows page có inline version với gần như identical markup → cùng primitive.
4. Native `<select>` trong skills-catalog không matches Input styling. Cần `FilterSelect` styled primitive (vẫn dùng native `<select>` element bên trong cho a11y, chỉ style chrome).
5. `PageShell` đã handle max-width + padding. Templates nên dùng `PageShell` bên trong, không reinvent.
6. Workflows uses **inline detail expansion** (above grid). Skills uses **separate route**. Hai pattern khác nhau → 2 templates riêng: `CatalogTemplate` (Workflows) + `CatalogLinkTemplate` (Skills, cards link to route). Hoặc gộp với `renderDetail` slot. Decision in step 1.

## Requirements

### Functional
- `EntityCard` (extends Card primitive) — interactive + selected variants, supports `as="button"` or `as="a"`.
- `PageToolbar` — flex row container with search + filter + count, responsive (stack on mobile).
- `CatalogGrid` — responsive grid (1/2/3/4 col) wrapping cards.
- `EmptyState` — bordered dashed surface with message; supports optional CTA.
- `SectionLabel` — uppercase tracked label for in-detail sections.
- `DetailHeader` — eyebrow + h1 + description + meta-strip (level/duration/badges) + optional close button.
- `FilterSelect` — styled `<select>` with Input-matching chrome.
- `CatalogTemplate` — `<PageShell><PageHeader/><PageToolbar/>{detailSlot}<CatalogGrid/>{empty?}</PageShell>`.
- `DetailInlineTemplate` — used by Workflows for inline expansion (2-col layout, dismissible).
- `DetailPageTemplate` — used by Skills for full-page detail with `prose` + FloatingToc.
- `DocsTemplate` — same as `DetailPageTemplate` but always-on prose, optional TranslationBanner slot.

### Non-functional
- Each primitive ≤ 80 lines (KISS).
- Templates ≤ 60 lines each (mostly composition).
- All consume tokens from phase-01.
- Locale-aware via `useLocale` context where strings present.
- TypeScript strict — no `any`.
- Unit tests for each primitive (vitest + RTL).

## Architecture

```
src/components/
├── shell/
│   ├── page-shell.tsx          (exists)
│   ├── page-header.tsx         (exists; may absorb DetailHeader logic — see step 1)
│   ├── page-toolbar.tsx        NEW
│   ├── catalog-grid.tsx        NEW
│   ├── empty-state.tsx         NEW
│   ├── section-label.tsx       NEW
│   ├── detail-header.tsx       NEW
│   ├── catalog-template.tsx    NEW (composition)
│   ├── detail-inline-template.tsx   NEW
│   ├── detail-page-template.tsx     NEW
│   └── docs-template.tsx       NEW
├── ui/
│   ├── card.tsx                MODIFY (add `as` prop union)
│   ├── filter-select.tsx       NEW
│   └── index.ts                MODIFY (export FilterSelect)
└── entity-card.tsx             NEW (extends Card + interactive + selected, used by Workflows/Skills catalog)
```

### Composition diagram

```
CatalogTemplate
   └─ PageShell
        ├─ PageHeader (title, description, eyebrow?, actions?)
        ├─ PageToolbar (search slot, filter slot, count slot)
        ├─ {detailSlot}  (optional — used by Workflows for inline expansion)
        ├─ CatalogGrid (cols={1,2,3,4})
        │     └─ children: EntityCard[]
        └─ {empty && <EmptyState />}

DetailInlineTemplate
   └─ Card (selected)
        ├─ CardHeader (DetailHeader inside) + close button
        └─ CardBody (2-col grid: info | canvas)
              ├─ <div> with SectionLabel + content
              └─ {rightSlot}  // ReactFlow lives here

DetailPageTemplate
   └─ PageShell (withToc)
        ├─ DetailHeader (metadata strip — no title since prose has H1)
        ├─ article.prose (children = MDX)
        └─ FloatingToc

DocsTemplate
   └─ PageShell (withToc)
        ├─ {translationBannerSlot}
        ├─ article.prose (children = MDX)
        └─ FloatingToc
```

## Related Code Files

### Create
- `src/components/shell/page-toolbar.tsx`
- `src/components/shell/catalog-grid.tsx`
- `src/components/shell/empty-state.tsx`
- `src/components/shell/section-label.tsx`
- `src/components/shell/detail-header.tsx`
- `src/components/shell/catalog-template.tsx`
- `src/components/shell/detail-inline-template.tsx`
- `src/components/shell/detail-page-template.tsx`
- `src/components/shell/docs-template.tsx`
- `src/components/ui/filter-select.tsx`
- `src/components/entity-card.tsx`
- `src/components/shell/page-toolbar.test.tsx`
- `src/components/shell/catalog-grid.test.tsx`
- `src/components/shell/empty-state.test.tsx`
- `src/components/shell/section-label.test.tsx`
- `src/components/shell/detail-header.test.tsx`
- `src/components/ui/filter-select.test.tsx`
- `src/components/entity-card.test.tsx`

### Modify
- `src/components/ui/card.tsx` — add polymorphic `as` prop (`"div" | "button" | "a"`). Forward refs handle each.
- `src/components/ui/index.ts` — export `FilterSelect`.

### Delete
- (none in this phase; old inline `EmptyState`, `SectionLabel`, `CloseButton` removed when consumed in phase 3/4)

## Implementation Steps

1. **Decision: polymorphic Card or separate EntityCard?** Trade-off: polymorphic Card = 1 source of truth but type-juggling for refs. Separate `EntityCard` = simpler types but slight duplication. **Recommend EntityCard** because catalog cards have specific semantics (interactive + selected + icon row + body + footer) that pure Card doesn't have. Card stays for generic use; EntityCard wraps Card + interactive prop + standardizes the catalog-card body layout.
2. **Create `EntityCard`** — props: `href?: string` (Link) | `onClick?` (button), `selected`, `title`, `description`, `meta?: ReactNode` (top row e.g. LevelBadge), `accent?: ReactNode` (right meta e.g. duration), `footer?: ReactNode` (e.g. FlowSteps). Render as `<Link>` if `href`, else `<button>`. Reuse Card primitive internally.
3. **Create `PageToolbar`** — props: `search?`, `filter?`, `count?` slots. Mobile stack, desktop justify-between. ≤ 30 lines.
4. **Create `CatalogGrid`** — props: `cols?: 2 | 3 | 4` (default 3). Renders `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-{N} gap-4">`. ≤ 20 lines.
5. **Create `EmptyState`** — props: `message: string`, `action?: ReactNode`. Bordered dashed surface. ≤ 30 lines.
6. **Create `SectionLabel`** — props: `children: ReactNode`. Wrap in `<h3>` with uppercase tracked-wider style. ≤ 15 lines.
7. **Create `DetailHeader`** — props: `eyebrow?`, `title?`, `description?`, `meta?: ReactNode` (level + duration row), `actions?: ReactNode` (close button slot). ≤ 50 lines. Note: when used inside MDX detail (Skills, Docs), `title` may be omitted because article H1 owns it.
8. **Create `FilterSelect`** — wrap native `<select>` with Input-matching styling. Accept `label` (sr-only), `options: {value, label, count?}[]`, `value`, `onChange`. ≤ 40 lines.
9. **Create `CatalogTemplate`** — props: `header: PageHeaderProps`, `toolbar`, `detailSlot?`, `grid` (children), `empty?: boolean`, `emptyMessage`. ≤ 50 lines. Composition only.
10. **Create `DetailInlineTemplate`** — props: `selected`, `header` (DetailHeader content), `leftContent`, `rightContent`, `onClose`. 2-col grid on lg, stacked on mobile. ≤ 60 lines.
11. **Create `DetailPageTemplate`** — props: `metaStrip?: ReactNode`, `article: ReactNode` (children), `withToc?: boolean`. ≤ 30 lines.
12. **Create `DocsTemplate`** — props: `banner?: ReactNode`, `article: ReactNode`, `withToc?: boolean`. ≤ 25 lines.
13. **Write unit tests** for each primitive (snapshot + a11y role + interaction where applicable).
14. **Modify Card** if EntityCard internally needs Card's selected/interactive states — current Card already has them. May not need touching.
15. **Run `npm run lint` + `npm run test:run`** — must pass green.
16. **Visual smoke check** in Storybook-free style: temporarily import a primitive into a page to eyeball. Revert before commit.
17. **Commit:** `feat(shell): add layout primitives + page templates`.

## Todo List

- [ ] Step 1: confirm EntityCard separate from Card
- [ ] Create `entity-card.tsx` + test
- [ ] Create `page-toolbar.tsx` + test
- [ ] Create `catalog-grid.tsx` + test
- [ ] Create `empty-state.tsx` + test
- [ ] Create `section-label.tsx` + test
- [ ] Create `detail-header.tsx` + test
- [ ] Create `filter-select.tsx` + test
- [ ] Update `ui/index.ts` exports
- [ ] Create `catalog-template.tsx`
- [ ] Create `detail-inline-template.tsx`
- [ ] Create `detail-page-template.tsx`
- [ ] Create `docs-template.tsx`
- [ ] Run lint + test:run + build → green
- [ ] Commit

## Success Criteria

- All 11 new files created, each ≤ 80 lines (primitives) or ≤ 60 lines (templates).
- All 7 primitive unit tests green.
- `npm run test:run` count grows by ≥ 7 (one per primitive).
- `npm run build` succeeds.
- No existing tests fail (224+ baseline maintained).
- No feature pages touched yet — primitives sit dormant ready for phase 3/4/5.

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Polymorphic component types (Link vs button vs div) get hairy | Medium | Medium | Stick to 2 modes only (`href` => Link, else button). Avoid TS generics. Inline render branch. |
| Template composition props balloon | Low | Medium | Cap each template ≤ 6 props. If pressure to add more, reconsider whether new template needed instead. |
| `FilterSelect` native chrome can't fully be styled cross-browser | Low | Low | Accept native arrow + use custom border/padding/font. Sufficient for dashboard UX. |
| Adding `detailSlot` to CatalogTemplate creates Workflows-only feature in shared template | Low | Low | Document as `optional` slot. Skills doesn't use it (passes null). No conditional behavior change. |
| Tests fragile due to ReactFlow inside `DetailInlineTemplate` slot | Low | Medium | Templates don't import ReactFlow; only Workflows page does. Test templates with `<div>` children dummies. |
| Loss of existing `SearchBar` component | Low | Low | `SearchBar` stays for Workflows page (uses uiStrings + useLocale). PageToolbar accepts a slot, doesn't reinvent SearchBar. |
| Duplicate "search input" between SearchBar and Skills inline Input | Medium | Low | Phase 4 will refactor Skills to also use SearchBar (or a generic SearchInput primitive if SearchBar is too workflows-specific). Decision deferred to phase 4 step 1. |

## Security Considerations

- `EntityCard` rendered as `<a>` with external `href` — ensure `rel="noopener noreferrer"` if cross-origin. Internal Next Link doesn't need it.

## Next Steps

- Phase 03 wires Workflows page to `CatalogTemplate` + `DetailInlineTemplate`.
- Phase 04 wires Skills page to `CatalogTemplate` + `DetailPageTemplate`.
- Phase 05 wires Docs page to `DocsTemplate`.

## Unresolved Questions

1. EntityCard separate from Card vs polymorphic Card — finalize step 1 before coding.
2. SearchBar reused or generalized — decide in phase 4 step 1.
3. Does Card's `interactive` prop need updating to handle button vs link variants? — answer in step 14.
