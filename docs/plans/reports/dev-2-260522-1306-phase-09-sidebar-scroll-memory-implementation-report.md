---
phase: 9
date: 2026-05-22
agent: dev-2
team: admin-shell-wave3
branch: wave3/dev-2-sidebar-scroll
worktree: /Users/admin/Desktop/Codes/tuanldas/claudekit-workflows-scroll
status: DONE
---

# Phase 9 — Sidebar scroll memory (impl report)

## Summary

Sidebar scroll position preserved per section (workflows/docs/skills) via `sessionStorage`. TDD red→green→refactor done. Lint, typecheck, full suite (154/154) green. Dev server smoke 200 OK on `/vi/workflows` + `/vi/docs/engineer/01-core-workflow`.

## Files

### Created
- `src/lib/sidebar-scroll-storage.ts` — `saveSidebarScroll`, `getSidebarScroll`, `SECTION_KEYS` (WORKFLOWS/DOCS/SKILLS). SSR-safe via `typeof sessionStorage` guard. Quota errors swallowed. Truncates fractional input.
- `src/lib/sidebar-scroll-storage.test.ts` — 8 tests: save/get, default 0, invalid value, fractional input, quota catch, key isolation, SECTION_KEYS shape.
- `src/lib/use-sidebar-scroll.ts` — hook. `useIsomorphicLayoutEffect` restore (avoid flash; falls back to `useEffect` SSR). `useEffect` attaches passive scroll listener; debounce 200ms; cleanup removes listener + final save.
- `src/lib/use-sidebar-scroll.test.tsx` — 8 tests: mount restore, no-op when empty, debounced save, multi-event coalesce, unmount final save, per-section isolation, listener cleanup, stable ref.
- `src/components/shell/sidebar-docs-tree-client.tsx` — client wrapper. Uses hook with `SECTION_KEYS.DOCS`. Wraps `DocsSidebar`.

### Modified
- `src/components/shell/sidebar-workflows-nav.tsx` — wrap root `<div>` with `useSidebarScroll(SECTION_KEYS.WORKFLOWS)`; class `h-full overflow-y-auto px-2`.
- `src/components/shell/sidebar-docs-tree.tsx` — server component now delegates to `SidebarDocsTreeClient` when tree present (stub branch unchanged).

### Skipped (per ownership)
- `src/components/shell/sidebar-skills-nav.tsx` — dev-1 (Phase 6) fills from scratch. Lead post-merge to add 1-line wrap with `SECTION_KEYS.SKILLS`.

## TDD trail

1. **Red:** wrote both `*.test.ts/tsx` files; ran `npm run test:run` → fail (module not found).
2. **Green:** implemented storage + hook; tests 16/16 pass.
3. **Refactor:** centralized `SECTION_KEYS` constant; switched layout effect to isomorphic guard; renamed test probe `refOut` → `outRef` to satisfy `react-hooks/immutability`.

## Validation

| Check | Result |
|---|---|
| `npm run lint` | clean |
| `npm run test:run` (full) | 154/154 pass |
| `npx tsc --noEmit` | clean |
| pre-commit hook (typecheck+lint+test) | green |
| Dev server `/vi/workflows` | 200, scroll container rendered |
| Dev server `/vi/docs/engineer/01-core-workflow` | 200, scroll container rendered |
| HTML inspection | `h-full overflow-y-auto px-2` present in workflows + docs HTML |

## Implementation notes

- **Scroll container choice:** Plan said wrap "scroll container". Existing `sidebar.tsx` has parent `<div class="flex-1 overflow-y-auto py-4">`. To respect file ownership (cannot edit `sidebar.tsx`), I made each per-section nav its own scroll container (`h-full overflow-y-auto`) inside the parent. Parent `overflow-y-auto` becomes inert when child fills 100% height (content height = container height).
- **No flash:** `useLayoutEffect` runs before paint when window is defined. SSR path uses `useEffect` (harmless — initial scrollTop is 0 anyway server-side).
- **Debounce:** 200ms matches plan spec. Final save on unmount catches scroll just before nav.
- **Per-section isolation:** verified by unit test "isolates memory per section key".

## Risks / known concerns

- **Parent overflow interaction:** Both parent (`sidebar.tsx`) and child have `overflow-y-auto`. Visual works (child takes height, parent inert) but if lead later sets parent `flex-1 overflow-hidden` it would be slightly cleaner. Not blocking.
- **Skills nav:** waiting on dev-1's Phase 6 merge. Lead adds wrap there post-merge per task description.
- **No e2e:** unit tests cover restore + debounce + cleanup. Real-browser flash verification deferred to tester (task #3).

## Commit

```
7054c49 feat(shell): sidebar scroll memory hook + storage
```

Branch: `wave3/dev-2-sidebar-scroll` (worktree only — not pushed).

## Unresolved questions

None.
