---
title: "Admin shell redesign — unified sidebar + Workflows/Docs/Skills"
description: "Refactor app sang admin shell pattern (sidebar trái cố định + topbar persistent) chứa 3 sections Workflows/Docs/Skills. Add Cmd+K palette, dark mode, mobile drawer. Skills catalog scan ~/.claude/skills/ build-time. TDD-structured per phase."
status: pending
priority: P2
branch: "main"
tags: [redesign, ui, admin-shell, dark-mode, cmd-k, tdd]
blockedBy: [260521-1942-docs-renderer-i18n]
blocks: []
created: "2026-05-22T01:35:18.807Z"
createdBy: "ck:plan"
source: skill
---

# Admin shell redesign — unified sidebar + Workflows/Docs/Skills

## Overview

Hiện tại app có 2 layouts tách biệt: `/[locale]` (workflows + header riêng) và `/[locale]/docs/[...slug]` (3-col sidebar/main/TOC). Navigate giữa 2 sections là full reload, không cảm giác "1 app".

Plan này refactor thành **admin shell pattern** (Approach C — single shell + context-aware sidebar):
- 1 sidebar trái cố định + topbar persistent
- Sidebar context-aware: render Workflows nav / Docs tree / Skills nav theo pathname
- 3 routes: `/[locale]/workflows`, `/[locale]/docs/[...slug]`, `/[locale]/skills`, `/[locale]/skills/[id]`
- `/[locale]` redirect 308 → `/[locale]/workflows`
- Cmd+K global palette (cmdk + flexsearch) cho cả 3 sections
- Dark mode toggle (light/dark/system)
- Mobile: sidebar drawer (hamburger)
- Sidebar scroll position preserved (sessionStorage)
- Skills catalog (130+) build-time scan `~/.claude/skills/`, skill detail render SKILL.md qua MDX pipeline

Tổng effort: **~8 days** chia 10 phases TDD-structured.

## Context & References

**Brainstorm:** [from-brainstormer-to-planner-admin-shell-design-260522-0823-admin-shell-redesign-report.md](../reports/from-brainstormer-to-planner-admin-shell-design-260522-0823-admin-shell-redesign-report.md)

**Predecessor plan (completed):** [260521-1942-docs-renderer-i18n](../260521-1942-docs-renderer-i18n/plan.md) — built `[locale]/` routing, MDX pipeline, docs 3-col layout. Plan mới refactor phase 4 layout vào shell.

**Tech stack (no new deps):**
- Next.js 16 App Router + Turbopack — existing
- React 19 + TypeScript strict — existing
- Tailwind CSS v4 — extend với dark mode tokens
- `cmdk@1.1.1` — Cmd+K palette (already installed for docs Phase 5, now used)
- `flexsearch@0.7.43` — search index (extend từ docs-only sang 3 sections)
- `@xyflow/react@12.10.2` — ReactFlow giữ nguyên cho workflow canvas
- `gray-matter@4.0.3` — parse SKILL.md frontmatter
- `glob@13.0.6` — scan `~/.claude/skills/`
- `@mdx-js/mdx@3.1.1` — reuse cho skill detail render

## Architecture summary (Approach C)

```
src/app/[locale]/
├── layout.tsx              ← LanguageProvider + ThemeProvider + AdminShell
├── page.tsx                ← redirect 308 → /[locale]/workflows
├── workflows/page.tsx      ← (NEW) move từ current page.tsx
├── docs/
│   ├── layout.tsx          ← REMOVE 3-col grid; chỉ wrap children + FloatingToc
│   ├── page.tsx            ← existing docs index
│   └── [...slug]/page.tsx  ← existing MDX render
└── skills/                 ← (NEW)
    ├── page.tsx            ← skills catalog grid
    └── [id]/page.tsx       ← skill detail (MDX render SKILL.md)

src/components/shell/       ← (NEW directory)
├── admin-shell.tsx
├── sidebar.tsx             ← context-aware (Workflows/Docs/Skills nav)
├── sidebar-workflows-nav.tsx
├── sidebar-docs-tree.tsx   ← wrap existing DocsSidebar + scroll memory
├── sidebar-skills-nav.tsx
├── topbar.tsx              ← logo + breadcrumb + search trigger + theme + locale
├── breadcrumb.tsx
├── command-palette.tsx
├── theme-toggle.tsx
├── floating-toc.tsx        ← right-side TOC, hide < 2xl
└── mobile-drawer.tsx
```

## URL contract

| Old | New | Type |
|-----|-----|------|
| `/` | `/vi` → `/vi/workflows` | 308 redirect chain |
| `/vi` | `/vi/workflows` | 308 redirect |
| `/en` | `/en/workflows` | 308 redirect |
| `/vi` (WorkflowPage) | `/vi/workflows` | Moved |
| `/vi/docs/*` | `/vi/docs/*` | Unchanged route, refactored layout |
| (none) | `/vi/skills` | New |
| (none) | `/vi/skills/[id]` | New |

## Phases

| Phase | Name | Effort | Status | Depends |
|-------|------|--------|--------|---------|
| 1 | [Admin shell skeleton](./phase-01-admin-shell-skeleton.md) | 0.5d | Pending | — |
| 2 | [Workflows page migration](./phase-02-workflows-page-migration.md) | 0.5d | Pending | 1 |
| 3 | [Docs layout refactor](./phase-03-docs-layout-refactor.md) | 1d | Pending | 1 |
| 4 | [Theme system dark mode](./phase-04-theme-system-dark-mode.md) | 1d | Pending | 1 |
| 5 | [Skills index build pipeline](./phase-05-skills-index-build-pipeline.md) | 1d | Pending | — |
| 6 | [Skills catalog pages](./phase-06-skills-catalog-pages.md) | 1d | Pending | 1, 5 |
| 7 | [Command palette Cmd-K](./phase-07-command-palette-cmd-k.md) | 1d | Pending | 2, 3, 6 |
| 8 | [Mobile drawer responsive](./phase-08-mobile-drawer-responsive.md) | 0.5d | Pending | 1 |
| 9 | [Sidebar scroll memory](./phase-09-sidebar-scroll-memory.md) | 0.5d | Pending | 3 |
| 10 | [E2E accessibility audit](./phase-10-e2e-accessibility-audit.md) | 1d | Pending | 1-9 |

**Tổng: ~8 days** (1 dev). Phases 4, 5 parallel-safe với 2, 3.

## TDD structure (per `--tdd` flag)

Mỗi phase tổ chức theo Red-Green-Refactor:

1. **Red** — viết failing tests trước (component tests, integration tests)
2. **Green** — implement minimum để pass tests
3. **Refactor** — clean up, extract helpers, đảm bảo type-check + lint pass

Coverage gate (đã có từ plan cũ): lines ≥70%, branches ≥60% qua lefthook pre-commit.

## Out of scope

- Agents catalog (13 agents) — round sau
- Refactor `src/data/workflows.ts` data structure
- Backend/database (project là static + build-time)
- Real-time `~/.claude/skills/` watch (build-time only)
- gstack vs ClaudeKit skill merging (track riêng)
- Search ranking algorithm tuning
- Workflow canvas resize cho narrow viewport (giữ inline expand)

## Cross-phase dependencies

```
Phase 1 (Admin shell skeleton — layouts + routes)
   ├──→ Phase 2 (Workflows page migration)
   ├──→ Phase 3 (Docs layout refactor) ──→ Phase 9 (Sidebar scroll memory)
   ├──→ Phase 4 (Theme system)
   ├──→ Phase 6 (Skills catalog pages) ←── Phase 5 (Skills index pipeline)
   └──→ Phase 8 (Mobile drawer)
              ↓
         Phase 7 (Command palette) ← needs 2, 3, 6 to index sources
              ↓
         Phase 10 (E2E + a11y audit)
```

## Risks (top-level)

| # | Risk | Mitigation |
|---|---|---|
| R1 | `~/.claude/skills/` không tồn tại trên Vercel build | Phase 5: detect via env; skip-if-missing → empty array fallback; production shows empty state until sync setup (accepted trade-off — see Validation Session 1) |
| R2 | Refactor `DocsLayout` break docs rendering | Phase 3: TDD — viết test cho existing render trước, refactor sau |
| R3 | FOUC khi switch theme | Phase 4: inline script trong `<head>` set class trước React hydrate |
| R4 | Cmd+K conflict Safari Cmd+K (clear console) | Phase 7: `e.preventDefault()` chỉ khi app focused |
| R5 | Workflow canvas hẹp do shell sidebar chiếm chỗ | Phase 2: đo `lg:col-span-9` (75%) còn đủ; fallback slide-over nếu < 800px |
| R6 | Sidebar context-aware switch logic phức tạp | Phase 1: tách 3 components riêng (WorkflowsNav/DocsTree/SkillsNav) thay vì mega-switch |
| R7 | MDX render SKILL.md có pattern khác docs | Phase 6: reuse `mdx-compile.ts` + fallback frontmatter; test 5-10 SKILL.md mẫu |
| R8 | Skills build-time tăng > 5s do scan 130+ files | Phase 5: cache JSON output, mtime-based rebuild |
| R9 | Cross-locale link mất khi navigate giữa sections | Phase 1: LocaleSwitcher dùng pathname-relative swap, preserve current sub-path |

## Decisions (locked from brainstorm)

| Topic | Decision |
|---|---|
| Layout | Sidebar trái cố định + topbar (classic admin) |
| Sections | Workflows + Docs + Skills (no Agents) |
| Docs nav | MDX inline render, URL đổi (Next.js routing với persistent shell) |
| Workflow detail | Inline expand (giữ hiện tại) |
| Skills data | Build-time scan `~/.claude/skills/` |
| Skill detail | Full SKILL.md via MDX pipeline |
| Theme | Light/Dark/System với CSS vars |
| Search | Cmd+K global palette |
| Mobile | Hamburger drawer |
| Scroll memory | sessionStorage per section |
| URL | `/vi` redirect → `/vi/workflows` |

## Success criteria (overall)

- [ ] `/vi`, `/en` redirect 308 → `/vi/workflows`, `/en/workflows`
- [ ] Sidebar shell persist khi navigate giữa 3 sections (no full reload)
- [ ] Sidebar context-aware: render đúng nav theo pathname
- [ ] Cmd+K mở < 50ms, search 200+ items < 100ms, navigate trên Enter
- [ ] Dark mode toggle (light/dark/system), no FOUC, persist localStorage
- [ ] Mobile < `lg`: hamburger drawer, all touch targets ≥44px
- [ ] Sidebar scroll memory: scroll docs tree → đổi section → quay lại, vị trí preserved
- [ ] Skills catalog load 130+ skills < 200ms (build-time index)
- [ ] Skill detail render SKILL.md correctly (5-10 mẫu pass)
- [ ] All existing docs pages still render correctly (regression)
- [ ] All existing workflows + canvas vẫn work (regression)
- [ ] Lighthouse desktop: Performance ≥ 90, Accessibility ≥ 95
- [ ] Vitest coverage gate vẫn pass (≥70% lines)
- [ ] Playwright E2E: 5-7 tests cho golden paths
- [ ] `npm run build` OK (incl. `build:skills` chained)
- [ ] No accessibility errors (axe-core scan)

## Open questions (track during implementation)

All major scope/architecture questions resolved in Validation Session 1 below. Remaining inline open questions:
1. **Mobile drawer animation**: spring vs ease-out? → Phase 8 pick reasonable default (deferred — trivial polish).
2. **Skill detail rich features (Phase 6)**: future polish — "Open in Claude" deep link, GitHub source link, internal link rewrite — defer to follow-up plan if user requests.

## Validation Log

### Session 1 — 2026-05-22
**Trigger:** Post-plan validation via `/ck:plan validate`
**Questions asked:** 6 (4 critical + 2 scope)
**Tier:** Full (10 phases)

#### Verification Results
- **Claims checked:** ~25 across path/dep/route claims
- **Verified:** 21 | **Failed:** 4 | **Unverified:** 0

##### Failures (propagated to phases)
1. [Fact Checker] `src/middleware.ts` — does NOT exist. Plan said "src/proxy.ts or src/middleware.ts" — ambiguous. Actual: `src/proxy.ts` (custom `proxy` export + matcher config, NOT Next.js middleware convention). → Fix Phase 1 file references.
2. [Fact Checker] `MDX_CONTENT_SELECTOR` = `"article[data-docs-content]"` — Phase 3 risk row referenced `#docs-content` (wrong). → Fix Phase 3 risk row.
3. [Fact Checker] `next.config.ts` empty — plan mentioned "Configure MDX cho skills route nếu cần" but MDX via mdx-compile.ts (Approach C, no next.config changes needed). → Remove from Phase 6 file list.
4. [Contract Verifier] Shiki currently single theme `github-light` with comment "dark mode out of scope per plan." Phase 4 mentioned dark Shiki without explicit task to modify `src/lib/mdx-compile.ts`. → Add explicit step to Phase 4.

#### Questions & Answers

1. **[Scope]** Skills index trên Vercel/CI không có ~/.claude/skills/ — chiến lược nào?
   - Options: Commit JSON (Recommended) | Skip if missing | GitHub Action sync
   - **Answer:** Skip if missing — empty array fallback
   - **Rationale:** User chose lower-friction option. Production sẽ show empty skills catalog cho đến khi sync setup. Có thể đi GitHub Action sau (deferred).

2. **[Architecture]** Shiki dual theme cho dark mode (Phase 4) — strategy nào?
   - Options: Dual themes + CSS swap (Recommended) | Single theme skip | Client-side re-compile
   - **Answer:** Dual themes config + CSS var swap
   - **Rationale:** Best UX (instant switch). Cost: HTML output ~30% larger, acceptable trade-off.

3. **[Scope]** gstack skills include catalog?
   - Options: Include all + plugin badge (Recommended) | Only ClaudeKit | Separate section
   - **Answer:** Include all, group by plugin badge
   - **Rationale:** Comprehensive catalog. Plugin badge differentiates source.

4. **[Risk]** Workflow canvas trên shell (~700px width on lg) — fallback?
   - Options: Keep inline narrow (Recommended) | Slide-over < 900px | Sidebar collapse on detail
   - **Answer:** Keep inline expand, accept narrow canvas
   - **Rationale:** ReactFlow pan/zoom handles narrow viewport adequately. Avoid 2-layout complexity.

5. **[Scope]** Skill detail page rich features (Phase 6) — MVP scope?
   - Options: copy button | link rewrite | "Open in Claude" | "Edit on GitHub" (multi-select)
   - **Answer:** Copy button only (reuse CodeBlock từ docs)
   - **Rationale:** Ship lean MVP. Other features defer to follow-up plan if user requests.

6. **[Scope]** Phase 5 build-skills script — watch mode cần?
   - Options: Yes dev:skills | No manual only (User chose this — NOT recommended option)
   - **Answer:** No — manual rebuild only
   - **Rationale:** Dev hiếm khi work trên skill files. Giảm script complexity.

#### Confirmed Decisions
- Skills index CI: skip if missing, empty array fallback (NOT commit JSON)
- Shiki: dual themes (`github-light` + `github-dark`) + CSS var swap in Phase 4
- gstack skills: include all, badge by `plugin` frontmatter field
- Workflow canvas: keep inline expand, no fallback
- Skill detail MVP: copy button reuse only
- build-skills: manual only, no watch mode

#### Action Items (propagated)
- [ ] Phase 1: replace "src/proxy.ts or src/middleware.ts" → "src/proxy.ts" only
- [ ] Phase 3: fix risk row MDX_CONTENT_SELECTOR (correct value: `article[data-docs-content]`)
- [ ] Phase 4: add explicit step to modify `src/lib/mdx-compile.ts` for Shiki dual themes
- [ ] Phase 5: drop watch mode (`dev:skills` script + tsx --watch); update success criteria
- [ ] Phase 5: confirm skip-if-missing as primary strategy (already in code); drop "commit JSON" recommendation
- [ ] Phase 6: skill detail = copy button only; drop deferred features from scope; remove next.config.ts mention
- [ ] Phase 6: skills card show plugin badge (engineer/marketing/ck/gstack/anthropic-skills)

#### Impact on Phases
- Phase 1: Related Code Files + Implementation Steps — proxy.ts only
- Phase 3: Risk Assessment — selector correction
- Phase 4: Implementation Steps — add Shiki dual theme step + mdx-compile.ts to Modify list
- Phase 5: Implementation Steps — remove watch mode + dev:skills script
- Phase 6: Architecture + Related Code Files + Scope — plugin badge, drop next.config, single rich feature (copy button)

### Whole-Plan Consistency Sweep
- **Files reread:** plan.md + phase-01 → phase-10 (11 files total)
- **Decision deltas checked:** 6 (skills CI, Shiki dual, gstack inclusion, canvas width, skill detail MVP, no watch mode) + 4 verification failures
- **Reconciled stale references:** 7 fixed
  1. phase-01 risk row: "middleware" → "proxy redirect"
  2. phase-05 overview: "Commit JSON output vào git để prod build có data" → "NOT committed (gitignored), production empty until sync setup"
  3. phase-05 Step 3 refactor decision: "Decide: commit (✅ recommended)" → "Confirm .gitignore includes"
  4. phase-05 success criteria: "commit JSON ahead of time" → "empty array fallback, no fail"
  5. phase-10 risk mitigation: "or commit JSON pre-build" → "SKILLS_DIR env var with fixture for deterministic E2E"
  6. plan.md R1 risk mitigation: "commit skills-index.json vào git" → "skip-if-missing → empty array"
  7. phase-04 risk row: "Shiki single theme cần rebuild for dual" → "dual theme breaks existing rendering (mitigated by Step 2.5)"
- **Unresolved contradictions:** 0
- **Sweep status:** CLEAN — plan eligible for `/ck:cook`
