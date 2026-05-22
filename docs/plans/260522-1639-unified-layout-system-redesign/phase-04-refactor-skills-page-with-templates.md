# Phase 04 — Refactor Skills Page to Use Templates

## Context Links

- `src/components/skills/skills-catalog-content.tsx` (130 lines — main page)
- `src/components/skills/skill-card.tsx` (43 lines — catalog card, currently `<Link>` to detail route)
- `src/components/skills/skill-detail-page.tsx` (27 lines — detail page wrapper)
- `src/components/skills/skill-header.tsx` (42 lines — metadata strip)
- `src/components/skills/skill-plugin-badge.tsx` + `src/components/skills/skill-group-badge.tsx`
- `src/types/skill.ts`
- `src/lib/skill-plugin.ts`
- Phase 02 deliverables: `CatalogTemplate`, `DetailPageTemplate`, `EntityCard`, `PageToolbar`, `FilterSelect`, `EmptyState`, `DetailHeader`
- Phase 03 establishes Workflows pattern (reuse decisions)

## Overview

- **Priority:** P1
- **Status:** pending
- **Duration estimate:** 2h
- **Brief:** Rewire Skills catalog + Skills detail. Replace native `<select>` with `FilterSelect`. Replace `<Link>`-card markup with `EntityCard` (link mode). Skills detail uses `DetailPageTemplate`. Decision: migrate group filter from `useState` to URL query for consistency.

## Key Insights

1. Skills uses `useState` + `useDeferredValue` for search; Workflows uses URL query. **Unify on URL query** for shareable filtered links + SSR-friendliness. Trade-off: lose `useDeferredValue` smooth typing. Mitigate: wrap `router.replace` in `startTransition` or debounce 150ms.
2. `<select>` native for plugin filter — replace with `FilterSelect` primitive (phase 02).
3. Skills cards link to `/${locale}/skills/${id}` — `EntityCard` link mode.
4. Skill cards use **mono font** for title (`font-mono text-[13px]`) — distinct from Workflows cards (sans `text-[15px]`). **Decision:** keep distinction (skill IDs are technical identifiers; reading as code makes sense). Document in design-system.md as "EntityCard prefers sans, but supports `titleVariant='mono'` for technical identifiers like skill IDs". Add `titleVariant` to EntityCard (phase-02 will need addendum or this phase modifies EntityCard).
5. `EmptyState` local fn at lines 123-129 of `skills-catalog-content.tsx` — delete, use phase-02 primitive.
6. `SkillHeader` is a metadata strip rendered above MDX article (since MDX owns H1). `DetailHeader` from phase-02 supports `title?` optional — render `<SkillHeader>` content via `meta` slot, or refactor `SkillHeader` to use `DetailHeader` internally. **Decision:** refactor `SkillHeader` to compose `DetailHeader` (title omitted, only meta strip).
7. Search input uses Skills-specific placeholder + icon. Workflows uses `SearchBar` (also a generic search). **Decision:** introduce shared `SearchInput` primitive (lift from `SearchBar`) OR keep both. **Recommend keeping both for now** — `SearchBar` uses `uiStrings.searchPlaceholder` (workflow context); Skills has `uiStrings.skills.searchPlaceholder`. Refactoring beyond YAGNI scope. Skills page keeps its own `<Input>` usage inside `PageToolbar.search` slot.

## Requirements

### Functional
- Page renders catalog grid (1/2/3/4 col responsive) identical visual.
- Search + plugin filter + count in toolbar.
- Filter state in URL: `?group=<key>` + `?q=<query>`.
- Empty state when zero results.
- Skill detail page: metadata strip + prose article + FloatingToc.
- Mono card titles preserved.
- Plugin badges + tag badges preserved.

### Non-functional
- `skills-catalog-content.tsx` ≤ 100 lines after refactor (target: 80).
- `skill-card.tsx` ≤ 40 lines.
- `skill-detail-page.tsx` ≤ 25 lines.
- `skill-header.tsx` ≤ 40 lines (still useful as semantic name wrapping `DetailHeader`).
- Existing tests green (`skills-catalog-content.test.tsx`, `skill-card.test.tsx`, `skill-detail-page.test.tsx`).
- E2E `skill-detail.spec.ts` green.

## Architecture

### Before
```
SkillsCatalogContent (130 lines)
  ├─ useState(group), useState(query)+useDeferredValue
  ├─ PageShell
  │    ├─ PageHeader
  │    ├─ <div flex>  Input (search) + <select> (plugin filter)
  │    └─ {filtered.length > 0 ? <div grid>SkillCard[] : <EmptyState/>}
  └─ local EmptyState fn

SkillCard (43 lines)
  └─ <Link>
       └─ <article>
            ├─ <div flex>  mono title + SkillPluginBadge
            ├─ <p>  description
            └─ {tags && <div flex>  Badge[]}

SkillDetailPage (27 lines)
  └─ PageShell(withToc)
       ├─ SkillHeader
       ├─ <article.prose>  MDX
       └─ FloatingToc

SkillHeader (42 lines)
  └─ <div flex>  SkillPluginBadge + group label + Badge[]
```

### After
```
SkillsCatalogContent (~80 lines)
  ├─ useSearchParams + buildQuery helper (mirror Workflows pattern)
  └─ CatalogTemplate
       header={ title, description }
       toolbar={
         <PageToolbar
           search={ <Input ... /> }   // skills-specific placeholder via uiStrings.skills.searchPlaceholder
           filter={ <FilterSelect options={groupOptions} ... /> }
           count={ <span>{ count }</span> }
         />
       }
       grid={ filtered.map(s => <SkillCard locale=...>) }
       empty={ filtered.length === 0 }
       emptyMessage={ uiStrings.skills.empty }

SkillCard (~35 lines)
  └─ EntityCard
       as="link"
       href={`/${locale}/skills/${id}`}
       titleVariant="mono"
       title={ skill.name }
       description={ skill.description }
       meta={ plugin && <SkillPluginBadge/> }
       footer={ tags.length > 0 && <Badge[]/> }

SkillDetailPage (~22 lines)
  └─ DetailPageTemplate
       metaStrip={ <SkillHeader skill=...> }
       article={ content }
       withToc

SkillHeader (~35 lines)
  └─ DetailHeader (no title — MDX owns H1)
       meta={ plugin + group label + tag badges }
```

## Related Code Files

### Modify
- `src/components/skills/skills-catalog-content.tsx` — switch to `CatalogTemplate` + URL query state.
- `src/components/skills/skill-card.tsx` — wrap `EntityCard`.
- `src/components/skills/skill-detail-page.tsx` — wrap `DetailPageTemplate`.
- `src/components/skills/skill-header.tsx` — compose `DetailHeader`.
- `src/components/skills/skills-catalog-content.test.tsx` — adjust for URL query state + new DOM.
- `src/components/skills/skill-card.test.tsx` — adjust for EntityCard wrapper.
- `src/components/skills/skill-detail-page.test.tsx` — adjust for DetailPageTemplate.

### Maybe modify (from phase-02 retroactive)
- `src/components/entity-card.tsx` — add `titleVariant?: "sans" | "mono"` prop if not added in phase-02. If added in phase-02 already, skip.
- `src/components/entity-card.test.tsx` — add test for mono variant.

### Create
- (none)

### Delete
- Local `EmptyState` fn (lines 123-129 of `skills-catalog-content.tsx`).

## Implementation Steps

1. **Decision: URL query migration.** Confirm with user-confirmed decision in plan.md (Decision #5: "Unify on URL query"). If hesitation, fallback: keep useState in Skills, accept inconsistency. **Recommend proceed** per plan.
2. **Add `titleVariant` to `EntityCard`** if missing (phase-02 retroactive). Sans default, mono for technical IDs. ≤ 5 line addition.
3. **Refactor `skill-card.tsx`** to wrap `EntityCard` with `titleVariant="mono"`.
4. **Run `npm run test:run -- skill-card`** — fix assertions.
5. **Refactor `skill-header.tsx`** to compose `DetailHeader` with `title` omitted, meta slot containing plugin+group+tags. Preserve null-render when no metadata.
6. **Refactor `skill-detail-page.tsx`** to use `DetailPageTemplate`. Pass `<SkillHeader>` to `metaStrip`, `content` (MDX children) to `article`, set `withToc`.
7. **Run `npm run test:run -- skill-detail-page skill-header`** — fix.
8. **Refactor `skills-catalog-content.tsx`:**
   - Replace `useState(group)` + `useState(query)` with `useSearchParams` reads.
   - Add `buildQuery` helper (mirror Workflows).
   - Add `handleSearchChange` + `handleGroupChange` that call `router.replace(basePath + buildQuery(...), { scroll: false })`.
   - Optional: debounce search input by 150ms to mimic `useDeferredValue` smoothness. Use `setTimeout` ref + `clearTimeout` in `handleSearchChange`. ≤ 10 lines.
   - Switch to `CatalogTemplate`.
   - Replace native `<select>` with `<FilterSelect>` in toolbar.
9. **Delete local `EmptyState` fn**.
10. **Update `skills-catalog-content.test.tsx`** — likely needs `useSearchParams` mock (project already mocks Next router somewhere — grep tests).
11. **Run `npm run lint + test:run`** → green.
12. **Run `npm run test:e2e -- skill-detail.spec.ts`** → green.
13. **Visual check** — `/vi/skills`, `/en/skills`, click into skill, light/dark. Verify mono titles, prose article, FloatingToc, URL query persists on refresh + share.
14. **Capture screenshots** to `visuals/phase-04/`.
15. **Commit:** `refactor(skills): use unified layout templates + URL query state`.

## Todo List

- [ ] Confirm URL-query migration decision (per plan key decision #5)
- [ ] Add `titleVariant` to EntityCard if missing
- [ ] Refactor `skill-card.tsx` → EntityCard mono
- [ ] Test skill-card
- [ ] Refactor `skill-header.tsx` → DetailHeader compose
- [ ] Refactor `skill-detail-page.tsx` → DetailPageTemplate
- [ ] Test skill-header + skill-detail-page
- [ ] Refactor `skills-catalog-content.tsx` → CatalogTemplate + URL query + FilterSelect
- [ ] Delete local EmptyState fn
- [ ] Update `skills-catalog-content.test.tsx`
- [ ] Run lint + test:run → green
- [ ] Run e2e skill-detail.spec.ts → green
- [ ] Visual check + screenshots
- [ ] Commit

## Success Criteria

- 4 files modified, optionally 1 (EntityCard) touched if titleVariant added here.
- Local `EmptyState` deleted; primitive used.
- `skills-catalog-content.tsx` ≤ 100 lines.
- `skill-card.tsx` ≤ 40 lines.
- `skill-detail-page.tsx` ≤ 25 lines.
- `skill-header.tsx` ≤ 40 lines.
- `npm run test:run` green.
- `npm run test:e2e -- skill-detail.spec.ts` green.
- `npm run build` green.
- URL query `?q=`, `?group=<key>` reflects filter state, restorable on refresh.
- Visual parity vs phase-01 baseline (mono titles preserved).

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| URL-query migration changes test expectations heavily | High | Medium | Plan test updates as part of step 10. Mock `useSearchParams`, `usePathname`, `useRouter` like Workflows page tests do. |
| Losing `useDeferredValue` causes input lag on slow devices | Low | Low | Skills list is ~130 items, filter is cheap. Add 150ms debounce as cushion (step 8). |
| `FilterSelect` doesn't support `count` per option | Low | Low | Phase-02 step 8 spec includes `count?` in options shape. Verify before phase 4 starts. |
| Mono `titleVariant` API churn — phase-02 spec says EntityCard.title is text, no variant | Medium | Medium | Add `titleVariant` retroactively in step 2 (phase-04 owns this addendum). Modify entity-card.test.tsx for new variant. Document in design-system.md. |
| `SkillHeader` returns `null` when no metadata — `DetailPageTemplate` metaStrip slot must handle null | Low | Low | Template: `{metaStrip}` (no wrapper render). Null renders nothing. Safe. |
| Cache-related test breaking from URL query (Next router) | Medium | Medium | Wrap state reads in `useMemo` keyed on searchParams string. Pattern: see Workflows page line 22-23. |
| Plugin filter with single-result group may render confusing UI | Low | Low | Existing UX already does this. No regression. |

## Security Considerations

- URL query reflects search query (`q=`) — same as Workflows. Already accepted UX. No PII risk.

## Next Steps

- Phase 05 refactors Docs page.
- Phase 06 documents pattern: "Catalog with URL-query state = CatalogTemplate + buildQuery helper".

## Unresolved Questions

1. Debounce 150ms vs immediate replace — UX call. Default: 150ms; measure in dev.
2. Should `groupAll` value (`__all__`) be encoded as URL value `?group=__all__` or as absence (`?group=` removed)? **Recommend:** absence = all (mirrors Workflows category `?category=all` removal pattern at line 32 of workflows-page-content).
