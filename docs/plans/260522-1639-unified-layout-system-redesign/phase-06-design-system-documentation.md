# Phase 06 — Design System Documentation

## Context Links

- `CLAUDE.md` (project conventions — add "thêm trang mới" recipe)
- Phase 01 typography tokens (cite)
- Phase 02 layout primitives + templates (document each API)
- Phase 03/04/05 final source code (cite as canonical examples)
- Existing `docs/vi/claudekit-overview.md` (sibling docs style — for tone reference)

## Overview

- **Priority:** P2 (not blocking but high-value to lock the system)
- **Status:** pending
- **Duration estimate:** 1h
- **Brief:** Tạo `docs/docs/design-system.md` (or `docs/vi/design-system.md` — decision below) documenting tokens scale + primitive APIs + template recipes. Add short "how to add a page" section to `CLAUDE.md`. Stop the "mỗi lần thêm mới lại lòi ra một thiết kế mới" pattern.

## Key Insights

1. Project conventions: docs live in `docs/vi/` and `docs/en/` (user-facing); `docs/docs/` is engineering/internal docs per `documentation-management.md` rules (`./docs/code-standards.md`, `./docs/codebase-summary.md`, etc.).
2. Design-system doc IS engineering doc (consumer = developer). → `docs/docs/design-system.md`.
3. Doc target: short reference (~ 150-200 lines), not a deep visual style guide. Code is the source of truth; doc maps "user need → template + primitive".
4. CLAUDE.md addition is critical — agents reading CLAUDE.md will find the recipe and avoid reinventing.
5. No emoji per project convention.

## Requirements

### Functional
- `docs/docs/design-system.md` covers:
  - Token scale (typography, spacing, colors, radius)
  - Primitive API table (props summary, file path, line count)
  - Template recipes (CatalogTemplate, DetailInlineTemplate, DetailPageTemplate, DocsTemplate)
  - "How to add a new page" 5-step recipe with example
  - "How to add a new card variant" note
  - Anti-patterns (don't reinvent shell, don't hardcode prose theme, don't bypass templates)
- `CLAUDE.md` patch: 1 new section "Design System — Adding pages" pointing to design-system.md.

### Non-functional
- `design-system.md` ≤ 200 lines.
- No code dumps — show only signatures + 5-10 line usage snippets.
- Token tables format consistent with existing project docs.
- Bilingual not required — internal eng doc, VI primary (matching CLAUDE.md style which is VI-heavy).

## Architecture

### Doc structure

```
docs/docs/design-system.md
   ├─ Mục tiêu (1 paragraph)
   ├─ Token scale
   │    ├─ Typography table
   │    ├─ Spacing rhythm (link to Tailwind defaults)
   │    ├─ Colors (link to globals.css comments)
   │    └─ Radius (3-tier)
   ├─ Primitives (table: name | file | purpose | key props)
   ├─ Templates (4 sections, each ≤ 15 lines)
   │    ├─ CatalogTemplate (recipe + Workflows example)
   │    ├─ DetailInlineTemplate (recipe + Workflows detail example)
   │    ├─ DetailPageTemplate (recipe + Skills detail example)
   │    └─ DocsTemplate (recipe + Docs landing example)
   ├─ Recipe: thêm 1 catalog page mới (5 steps)
   ├─ Recipe: thêm 1 detail page mới (5 steps)
   ├─ Anti-patterns (5 bullets — what NOT to do)
   └─ Reference: existing pages (cite files)
```

### CLAUDE.md patch

Add section after "Cấu trúc thư mục":

```markdown
## Design System — Adding pages

Mọi trang catalog/detail/docs trong project DÙNG layout templates ở
`src/components/shell/`. KHÔNG tự lắp `<PageShell><PageHeader>...</PageShell>`
manual. Xem `docs/docs/design-system.md` cho recipe + token scale.

Templates: `CatalogTemplate`, `DetailInlineTemplate`, `DetailPageTemplate`,
`DocsTemplate`. Primitives: `EntityCard`, `PageToolbar`, `CatalogGrid`,
`EmptyState`, `SectionLabel`, `DetailHeader`, `FilterSelect`.
```

## Related Code Files

### Create
- `docs/docs/design-system.md`

### Modify
- `CLAUDE.md` — add "Design System — Adding pages" section (~ 10 lines).

### Delete
- (none)

## Implementation Steps

1. **Decision: doc location.** Recommend `docs/docs/design-system.md` (engineering convention). Alternative `docs/vi/design-system.md` if user prefers all docs together. Pick & proceed.
2. **Draft `design-system.md`** sections in order. Reference exact line counts + file paths from phase-02/03/04/05 final code (verify by re-grep).
3. **Token scale table** — copy values from phase-01 finalized `globals.css`. Format:
   ```markdown
   | Token | Size / Leading | Usage |
   |---|---|---|
   | `text-h1` | 24px / 1.25 | Page title (PageHeader) |
   ```
4. **Primitive API table** — one row per primitive, with key props only (not full signatures).
5. **Template recipes** — each has: signature snippet (~ 5 lines), "Use when" 1-liner, "Example" file path reference.
6. **"How to add a catalog page" recipe** — 5 numbered steps from data model → page.tsx → done. Reference Workflows as canonical example.
7. **Anti-patterns section** — 5 bullets:
   - Don't reinvent `<PageShell>` wrappers
   - Don't hardcode prose theme (use DocsTemplate / DetailPageTemplate)
   - Don't use raw `<select>` — use FilterSelect
   - Don't define local `SectionLabel` / `EmptyState` / `CloseButton` — import from shell/
   - Don't use `text-2xl sm:text-3xl` ad-hoc — use `text-h1` token
8. **Patch `CLAUDE.md`** with new section.
9. **Verify links** — every file path in design-system.md exists. Use grep/find.
10. **Lint markdown** — check format consistency (heading levels, table alignment).
11. **Commit:** `docs(design-system): document layout system + adding-page recipe`.

## Todo List

- [ ] Decide doc location (recommend `docs/docs/design-system.md`)
- [ ] Draft section: Mục tiêu
- [ ] Draft section: Token scale tables
- [ ] Draft section: Primitives table
- [ ] Draft section: Templates (4 recipes)
- [ ] Draft section: "Thêm 1 catalog page mới" recipe
- [ ] Draft section: "Thêm 1 detail page mới" recipe
- [ ] Draft section: Anti-patterns
- [ ] Patch CLAUDE.md with design system pointer
- [ ] Verify all file paths exist
- [ ] Commit

## Success Criteria

- `docs/docs/design-system.md` exists, ≤ 200 lines.
- All token names + primitive names + template names match real code (verified by grep).
- CLAUDE.md has new section pointing to design-system.md.
- No emoji in either file (project convention).
- Markdown renders cleanly (no broken table syntax).

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Doc drifts from code over time | High | Medium | Anti-pattern: don't include implementation details that change often (line counts, prop defaults). Keep doc principles-level + signature-level. Quarterly review recommended. |
| Wrong doc location violates project convention | Low | Low | Step 1 decision explicit. CLAUDE.md `## Documentation Management` lists allowed `./docs` files — design-system.md is "system architecture"-adjacent, fits. |
| CLAUDE.md grows unwieldy | Low | Low | Adding 10 lines; CLAUDE.md is project-root and intentionally has guidance. Stay focused. |
| Recipes become outdated when adding new primitive | Medium | Low | Document the "add 1 primitive" path too — though that's rare. Defer to phase-02-style approach. |
| Bilingual mismatch (project is VI-primary) | Low | Low | Write in VI (matches existing CLAUDE.md style + existing user prefs). Tech terms in EN. |

## Security Considerations

None — documentation only.

## Next Steps

- Phase 07 final QA verifies docs accuracy by following its own recipe to (mentally) "add a new page".

## Unresolved Questions

1. `docs/docs/design-system.md` location vs `docs/vi/design-system.md` — recommended docs/docs (engineering). Open to user override at phase start.
2. Should design-system doc be linked from project README.md? Plan says no (out of scope), but trivially added if requested.
