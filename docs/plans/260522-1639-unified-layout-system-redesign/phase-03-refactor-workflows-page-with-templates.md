# Phase 03 — Refactor Workflows Page to Use Templates

## Context Links

- `src/components/workflows/workflows-page-content.tsx` (123 lines — main page)
- `src/components/workflow-card.tsx` (60 lines — catalog card)
- `src/components/workflow-detail.tsx` (165 lines — inline expansion w/ `SectionLabel` + `CloseButton` local)
- `src/components/workflow-flow-canvas.tsx` (ReactFlow canvas — preserve as-is)
- `src/components/level-badge.tsx` + `src/components/flow-steps.tsx` (badge + chain — preserve)
- `src/components/search-bar.tsx` (Workflows-specific search; keep using)
- Phase 02 deliverables: `CatalogTemplate`, `DetailInlineTemplate`, `EntityCard`, `PageToolbar`, `SectionLabel`, `DetailHeader`, `EmptyState`
- Phase 01 typography tokens (`text-h1`, `text-h3`, `text-caption`)

## Overview

- **Priority:** P1
- **Status:** pending
- **Duration estimate:** 2h
- **Brief:** Rewire `workflows-page-content.tsx` to use `CatalogTemplate`. Replace `WorkflowCard` markup with `EntityCard`. Replace `WorkflowDetail` internal layout with `DetailInlineTemplate`. Preserve URL-query filter behavior + ReactFlow canvas.

## Key Insights

1. URL-query state (search `q` + category) lives in Workflows page already. Keep — Skills will migrate TO this pattern in phase 4.
2. `WorkflowCard` uses `<button>` because cards trigger inline-expansion (not navigation). `EntityCard` from phase-02 supports `onClick` mode → straightforward swap.
3. `WorkflowDetail` 2-col layout (info left / ReactFlow right) must stay. `DetailInlineTemplate` takes `leftContent` + `rightContent` slots.
4. `SectionLabel` + `CloseButton` were defined locally; replace with phase-02 primitives.
5. `FlowSteps` rendered inside card footer — fits `EntityCard.footer` slot.
6. `selectedId` useState lives in page; pass into `EntityCard.selected` + `DetailInlineTemplate.selected`.
7. The `eyebrow` prop on `PageHeader` currently shows active category label. Keep wiring — passes through `CatalogTemplate.header`.

## Requirements

### Functional
- Page renders catalog grid identical to current visual (verify side-by-side).
- Search bar + count + (no filter currently — category is via sidebar/URL only, no toolbar filter element) stay in toolbar.
- Selected workflow renders `DetailInlineTemplate` above grid (current behavior).
- ReactFlow canvas works inside `rightContent` slot.
- URL query `?q=` + `?category=` unchanged (no behavior regression).
- Empty state shows when filtered list empty.
- All locale strings via `uiStrings` (no hardcoded text).

### Non-functional
- `workflows-page-content.tsx` ≤ 100 lines after refactor (target: 80).
- `workflow-card.tsx` becomes wrapper around `EntityCard` ≤ 50 lines.
- `workflow-detail.tsx` ≤ 130 lines after extracting `SectionLabel` + `CloseButton`.
- Existing tests `workflows-page-content.test.tsx` + `workflow-detail.spec.ts` (e2e) green.
- No new dependencies.

## Architecture

### Before
```
WorkflowsPageContent
  └─ PageShell
       ├─ PageHeader (eyebrow, title, description)
       ├─ <div flex>  search + count
       ├─ {selected && <div mb-6> <WorkflowDetail/> }
       ├─ <div grid grid-cols-3>  WorkflowCard[]
       └─ {empty && <div border-dashed>}

WorkflowCard (60 lines)
  └─ <button>
       ├─ <div flex justify-between>  LevelBadge + duration
       ├─ <h3>  title
       ├─ <p>  description
       └─ <FlowSteps>

WorkflowDetail (165 lines)
  └─ <div border>
       ├─ left: <div>
       │     ├─ DetailHeader-like inline metadata
       │     ├─ local SectionLabel "Phases"
       │     ├─ phases timeline (preserved as feature-specific)
       │     ├─ tips section w/ local SectionLabel
       │     ├─ shortcut section
       │     └─ mobile CloseButton
       └─ right: ReactFlowCanvas + desktop CloseButton
```

### After
```
WorkflowsPageContent (~80 lines)
  └─ CatalogTemplate
       header={ eyebrow, title, description }
       toolbar={ <SearchBar/> + count }
       detailSlot={ selected && <WorkflowDetail/> }
       grid={ filtered.map(w => <WorkflowCard/>) }
       empty={ filtered.length === 0 }
       emptyMessage={ uiStrings.noResults }

WorkflowCard (~45 lines)
  └─ EntityCard
       as="button"
       onClick selected
       meta={ <LevelBadge/> }
       accent={ duration }
       title description
       footer={ <FlowSteps/> }

WorkflowDetail (~120 lines)
  └─ DetailInlineTemplate
       selected
       onClose
       header={ <DetailHeader meta={level+duration} title description /> }
       leftContent={
         <>
           <SectionLabel>Phases</SectionLabel>
           {phases timeline — Workflows-specific markup preserved}
           {tips && <><SectionLabel>Tips</SectionLabel><ul/></>}
           {shortcut && <><SectionLabel>Shortcut</SectionLabel><code/></>}
         </>
       }
       rightContent={ <WorkflowFlowCanvas/> }
```

## Related Code Files

### Modify
- `src/components/workflows/workflows-page-content.tsx` — switch to `CatalogTemplate`.
- `src/components/workflow-card.tsx` — wrap `EntityCard`.
- `src/components/workflow-detail.tsx` — wrap `DetailInlineTemplate`; remove local `SectionLabel` + `CloseButton`.
- `src/components/workflows/workflows-page-content.test.tsx` — adjust assertions if DOM structure changed.

### Read (no changes)
- `src/components/search-bar.tsx`
- `src/components/level-badge.tsx`
- `src/components/flow-steps.tsx`
- `src/components/workflow-flow-canvas.tsx`
- `src/data/workflows.ts`

### Create
- (none)

### Delete
- Local `SectionLabel` function (lines 131-137 of `workflow-detail.tsx`).
- Local `CloseButton` function (lines 139-165 of `workflow-detail.tsx`).

## Implementation Steps

1. **Read phase-02 deliverables** — verify `CatalogTemplate`, `DetailInlineTemplate`, `EntityCard`, `SectionLabel`, `DetailHeader`, `EmptyState` exports are stable.
2. **Refactor `workflow-card.tsx`** to wrap `EntityCard`. Pass `LevelBadge` to `meta` slot, `duration` to `accent` slot, `FlowSteps` to `footer` slot. Preserve `aria-pressed` semantic via EntityCard's button mode.
3. **Run `npm run test:run -- workflow-card`** — likely 1-2 assertion fixes needed if test queried specific DOM (`button` role unchanged should pass).
4. **Refactor `workflow-detail.tsx`** to compose `DetailInlineTemplate`. Move `level + duration + title + description` block into `<DetailHeader>` rendered in `header` prop. Move `phases` + `tips` + `shortcut` blocks into `leftContent`. Move `WorkflowFlowCanvas` to `rightContent`.
5. **Replace local `SectionLabel`** usages with imported `SectionLabel` from `@/components/shell/section-label`. Delete local fn.
6. **Replace local `CloseButton`** with template-owned close button (template renders close on its own). Delete local fn.
7. **Run `npm run test:run`** — fix any test failures. Detail e2e at `e2e/workflow-detail.spec.ts` may need re-check.
8. **Refactor `workflows-page-content.tsx`** to use `CatalogTemplate`. Move `<PageShell>`+`<PageHeader>`+toolbar+grid+empty into template props.
9. **Replace inline empty state** with `EmptyState` primitive consumed by template's `empty` flag.
10. **Run lint + test:run + build**. Fix issues.
11. **Manual visual check** — `npm run dev`, browse `/vi/workflows` and `/en/workflows` + open detail + light/dark toggle. Confirm: identical layout, no visual drift, ReactFlow renders, close works, URL query preserved.
12. **Run e2e:** `npm run test:e2e -- workflow-detail.spec.ts shell-navigation.spec.ts`. Fix selectors if changed.
13. **Capture screenshots** to `visuals/phase-03/` (workflows index + workflow detail × light/dark).
14. **Commit:** `refactor(workflows): use unified layout templates`.

## Todo List

- [ ] Verify phase-02 primitive APIs stable (import + read signatures)
- [ ] Refactor `workflow-card.tsx` to EntityCard
- [ ] Test `workflow-card` unit tests
- [ ] Refactor `workflow-detail.tsx` to DetailInlineTemplate
- [ ] Remove local SectionLabel + CloseButton
- [ ] Test `workflow-detail` unit tests
- [ ] Refactor `workflows-page-content.tsx` to CatalogTemplate
- [ ] Update `workflows-page-content.test.tsx` if needed
- [ ] Run lint + test:run → green
- [ ] Run e2e `workflow-detail.spec.ts` → green
- [ ] Visual check VI/EN × light/dark
- [ ] Capture screenshots
- [ ] Commit

## Success Criteria

- 3 files modified, 0 added, 2 local fns deleted.
- `workflows-page-content.tsx` ≤ 100 lines.
- `workflow-card.tsx` ≤ 50 lines.
- `workflow-detail.tsx` ≤ 130 lines.
- `npm run test:run` green.
- `npm run test:e2e -- workflow-detail.spec.ts` green.
- `npm run build` green.
- Visual parity vs phase-01 baseline screenshots — no rhythm/spacing drift.
- URL query `?q=` and `?category=` still functional (verify via dev manual).

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| ReactFlow `rightContent` slot loses width/height calc | Medium | High | DetailInlineTemplate's right slot MUST preserve `relative bg-surface p-4` styling. Verify in phase-02 step 10. Test by snapshot-comparing rendered HTML before/after. |
| `EntityCard.onClick` event differs from button click semantics breaking `aria-pressed` | Low | Medium | EntityCard renders real `<button>` when no href. `aria-pressed` forwarded via `selected` prop. Test in phase 2 covers. |
| Mobile close button (currently `lg:hidden` in left col) goes missing | Low | Medium | DetailInlineTemplate places close button in header — visible on all viewports. Mobile UX equivalent or better. |
| Phase tracking timeline (vertical dots) needs Workflows-specific markup not generalizable | Resolved | n/a | Acknowledged feature-specific; lives in `leftContent` slot unchanged. |
| Tests at `workflows-page-content.test.tsx` query specific DOM that changes | Medium | Low | Update test selectors (use roles/labels not class names). |
| URL query state lost when `CatalogTemplate` re-mounts | Low | Medium | `CatalogTemplate` doesn't manage state. `useSearchParams` stays in page component. Verify in step 11. |
| `selectedId` useState reset on filter change | Low | Low | Existing behavior — when filtering removes selected card from list, it just stays open with stale data until user clicks elsewhere. Preserve as-is. |

## Security Considerations

None — refactor only.

## Next Steps

- Phase 04 applies same pattern to Skills page.
- Phase 06 documents the Workflows recipe as canonical example in `design-system.md`.
