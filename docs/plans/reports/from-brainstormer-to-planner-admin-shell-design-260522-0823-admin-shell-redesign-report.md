---
type: brainstorm-handoff
from: brainstormer
to: planner
date: 2026-05-22
slug: admin-shell-redesign
status: approved
---

# Brainstorm Report — Admin Shell Redesign

## 1. Problem Statement

Trang web ClaudeKit Workflows hiện có 2 layouts tách biệt:
- `/[locale]` (WorkflowPage) — header riêng + grid workflows
- `/[locale]/docs/[...slug]` (DocsLayout) — 3-col sidebar/main/TOC

Hệ quả:
- Navigate Workflows ↔ Docs là full page reload
- 2 patterns nav khác nhau, UX không nhất quán
- Không có chỗ thống nhất cho Skills catalog (chưa tồn tại)
- Không cảm giác "1 app" mà như 2 sites ghép lại

**User goal**: redesign thành 1 admin shell chung (sidebar + topbar persistent), mọi section (Workflows, Docs, Skills) nằm trong shell, không reload khi đổi section.

## 2. Final Requirements (verified)

| # | Requirement | Source |
|---|---|---|
| R1 | Sidebar trái cố định + topbar (classic admin) | User chọn Q1 |
| R2 | Sections: Workflows + Docs + Skills (no Agents) | User chọn Q2 |
| R3 | Docs render MDX inline, URL đổi, shell persist | User chọn Q3 |
| R4 | Workflow detail giữ inline expand | User chọn Q4 |
| R5 | Skills data: build-time script scan `~/.claude/skills/` | User chọn Q5 |
| R6 | Dark mode toggle topbar | User chọn Q6 |
| R7 | Cmd+K global palette (cmdk + flexsearch) | User chọn Q7 |
| R8 | Mobile sidebar drawer (tái dùng pattern hiện có) | User chọn Q8 |
| R9 | URL: `/vi/workflows`, `/vi/docs/...`, `/vi/skills`, `/vi/skills/[id]`; `/vi` → redirect `/vi/workflows` | User chọn Q9 |
| R10 | Skill detail render full SKILL.md (tái dùng MDX pipeline) | User chọn Q10 |
| R11 | Sidebar scroll position preserved across nav | User chọn Q12 |
| R12 | Architecture: single shell + context-aware sidebar (Approach C) | User chọn Q11 |

## 3. Out of Scope (round này)

- Agents catalog (13 agents) — round sau
- Refactor data structure workflows.ts
- Backend/database (project là static + build-time)
- gstack vs ClaudeKit skill merging
- `anthropic-skills:` / plugins prefix handling
- Polishing search ranking algorithm
- Real-time skill update khi `~/.claude/skills/` thay đổi (build-time only)

## 4. Architecture — Approach C: Single Shell + Context-Aware Sidebar

### 4.1 Route structure

```
src/app/[locale]/
├── layout.tsx              ← LanguageProvider + AdminShell (sidebar+topbar)
├── page.tsx                ← redirect 308 → /[locale]/workflows
├── workflows/page.tsx      ← move từ current /[locale]/page.tsx
├── docs/
│   ├── layout.tsx          ← REMOVE 3-col, chỉ wrap children với floating TOC
│   ├── page.tsx            ← docs index (đã có)
│   └── [...slug]/page.tsx  ← MDX page + floating TOC
└── skills/
    ├── page.tsx            ← skills catalog grid (NEW)
    └── [id]/page.tsx       ← skill detail + floating TOC (NEW)

src/middleware.ts hoặc src/proxy.ts:
- `/` → 308 `/vi`
- `/vi` → 308 `/vi/workflows`
- `/en` → 308 `/en/workflows`
```

### 4.2 Component tree

```
<LanguageProvider>
  <ThemeProvider>
    <AdminShell>
      <Sidebar>                ← context-aware theo pathname
        {pathname.startsWith('/workflows') && <WorkflowsNav />}
        {pathname.startsWith('/docs')      && <DocsTree />}
        {pathname.startsWith('/skills')    && <SkillsNav />}
      </Sidebar>
      <Topbar>
        <Breadcrumb />
        <CommandPaletteTrigger />  ← Cmd+K
        <ThemeToggle />
        <LanguageSwitcher />
      </Topbar>
      <Main>{children}</Main>     ← page content
      <FloatingToc />              ← chỉ render khi page có headings (docs, skill detail)
      <CommandPalette />           ← portal, mở bằng Cmd+K
      <MobileDrawer />             ← portal, mở bằng hamburger
    </AdminShell>
  </ThemeProvider>
</LanguageProvider>
```

### 4.3 New files

| Path | Purpose |
|---|---|
| `src/components/shell/admin-shell.tsx` | Layout wrapper (grid: sidebar / main / TOC) |
| `src/components/shell/sidebar.tsx` | Context-aware sidebar; render đúng nav theo route |
| `src/components/shell/sidebar-workflows-nav.tsx` | Category tree cho workflows |
| `src/components/shell/sidebar-docs-tree.tsx` | Wrap `DocsSidebar` hiện có + scroll preservation |
| `src/components/shell/sidebar-skills-nav.tsx` | Skill list grouped (engineer/marketing/...) |
| `src/components/shell/topbar.tsx` | Logo, breadcrumb, search trigger, theme, locale |
| `src/components/shell/breadcrumb.tsx` | Auto-generate từ pathname + section labels |
| `src/components/shell/command-palette.tsx` | cmdk modal + flexsearch index merging |
| `src/components/shell/theme-toggle.tsx` | Light/Dark/System; persist `localStorage` |
| `src/components/shell/floating-toc.tsx` | Right-side TOC, hide < `2xl` breakpoint |
| `src/components/shell/mobile-drawer.tsx` | Hamburger drawer (mobile-only) |
| `src/components/skills/skill-card.tsx` | Grid item cho skills catalog |
| `src/components/skills/skill-detail.tsx` | Render SKILL.md via MDX pipeline |
| `src/lib/theme-context.tsx` | Theme provider + hook |
| `src/lib/sidebar-scroll-memory.ts` | sessionStorage scroll memory |
| `src/lib/skills-loader.ts` | Load build-time JSON skills index |
| `src/data/skills-index.json` | Build output (gitignored) |
| `scripts/build-skills-index.ts` | Scan `~/.claude/skills/` → JSON |
| `src/types/skill.ts` | `Skill`, `SkillFrontmatter` types |

### 4.4 Modified files

| Path | Change |
|---|---|
| `src/app/[locale]/layout.tsx` | Add `ThemeProvider` + `AdminShell` wrapper |
| `src/app/[locale]/page.tsx` | Replace `WorkflowPage` với `redirect('/[locale]/workflows')` |
| `src/app/[locale]/docs/layout.tsx` | Strip 3-col grid; chỉ wrap children với FloatingToc; nav đã ở shell sidebar |
| `src/app/[locale]/docs/[...slug]/page.tsx` | Render MDX vào main slot (không cần wrapper grid) |
| `src/components/workflow-page.tsx` | Strip header (header → shell topbar); chỉ giữ grid + filters |
| `src/components/docs/mobile-nav.tsx` | Có thể deprecate (mobile drawer ở shell handle) |
| `src/proxy.ts` hoặc `src/middleware.ts` | Add `/vi` → `/vi/workflows` redirect |
| `package.json` | Add `build:skills` script vào `build` chain |
| `next.config.ts` | Configure MDX cho `skills` route nếu cần |
| `src/i18n/translations.ts` | Add strings: `nav.workflows`, `nav.docs`, `nav.skills`, `theme.*`, `palette.*` |
| `src/lib/search-client.ts` | Extend để index workflows + skills (hiện chỉ docs) |
| `scripts/build-search-index.ts` | Thêm workflows + skills sources |

### 4.5 Skills index build pipeline

```
scripts/build-skills-index.ts
  ↓ glob ~/.claude/skills/**/SKILL.md
  ↓ parse frontmatter (gray-matter — đã có)
  ↓ extract: name, description, tags, group (folder), content
  ↓ output: src/data/skills-index.json
  ↓ also feed src/data/search-index.json

Triggered by:
  npm run build:skills    (standalone)
  npm run build           (auto, chained)
  npm run dev:skills      (watch mode, tsx --watch)
```

**Frontmatter schema** (best-effort, defaults nếu missing):
```yaml
---
name: skill-name          # fallback: folder name
description: ...          # fallback: first paragraph
tags: [tag1, tag2]        # optional
plugin: anthropic-skills  # optional
---
```

### 4.6 Theme system

- Tailwind v4 `dark:` variants
- CSS variables for color tokens (Tailwind v4 supports `@theme` block)
- ThemeProvider: `light` | `dark` | `system`
- Persist `localStorage.theme`
- Apply `<html class="dark">` via inline script in `<head>` (avoid FOUC)
- Toggle component: 3-state cycler (light → dark → system → light)

### 4.7 Command palette (Cmd+K)

- `cmdk` (đã có) + `flexsearch` (đã có)
- Sources: Workflows (39) + Docs pages (~50) + Skills (130+)
- Modal portal, kbd shortcut: `Cmd+K` / `Ctrl+K`
- Grouped results: Workflows · Docs · Skills
- Hit Enter → navigate via `next/link router.push`
- Recent searches stored in `localStorage` (top 5)

### 4.8 Sidebar scroll memory

- Hook `useSidebarScroll(sectionKey)` reads/writes `sessionStorage[`sidebar-scroll:${sectionKey}`]`
- Save scroll position on unmount
- Restore on mount nếu same section
- Reset khi đổi section (workflows ↔ docs ↔ skills)

### 4.9 Mobile UX

- Breakpoint `lg` (≥1024px): shell sidebar visible
- < `lg`: sidebar ẩn, hamburger button trong topbar
- Click hamburger → slide-over drawer (full sidebar content)
- Click backdrop hoặc nav item → close drawer
- Floating TOC ẩn < `2xl` (≥1536px)

## 5. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Refactor `DocsLayout` break docs rendering | High | Phase 1 chỉ shell ngoài; Phase 2 mới refactor docs layout với regression test |
| Skills build script chậm (130+ files) | Medium | Cache JSON output; chỉ rebuild khi mtime đổi |
| `~/.claude/skills/` path không tồn tại trên CI/Vercel | High | Detect via env; fallback empty array + log warning; commit checked-in `skills-index.json` cho prod build |
| FOUC khi switch theme | Low | Inline script trong `<head>` set class trước React hydrate |
| Cmd+K conflict với browser shortcut trên Safari (Cmd+K = clear console) | Low | Use `e.preventDefault()` + listen only khi focused trong app |
| Existing plan `260521-1942-docs-renderer-i18n` chưa xong | Medium | Verify status trước plan; phase order phải sau plan đó hoặc rebase |
| Floating TOC overlap content trên narrow screens | Low | `2xl` breakpoint + `aria-hidden` khi collapse |
| Sidebar context-aware logic phức tạp dễ break | Medium | Tách thành 3 component (Workflows/Docs/Skills Nav) thay vì mega-switch; test pathname routing |
| MDX rendering cho SKILL.md có pattern khác docs (vd: code blocks dài, no frontmatter) | Medium | Reuse `mdx-compile.ts` nhưng add fallback frontmatter; test với 5-10 SKILL.md mẫu trước |

## 6. Success Metrics

- Click sidebar Workflows → Docs → Skills: shell không reload, URL đổi, < 100ms perceived
- Cmd+K mở < 50ms, search 200+ items < 100ms
- Mobile (375px width): sidebar drawer hoạt động đúng, không overflow horizontal
- Dark mode toggle áp dụng instant, không FOUC khi reload
- Sidebar scroll memory: scroll xuống item 50 trong docs tree, navigate sang skills rồi quay lại, scroll vẫn ở vị trí cũ
- Skills catalog load 130+ skills < 200ms (build-time index)
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95 trên desktop
- Build time tăng < 5s do skills index

## 7. Implementation Phases (suggest cho `/ck:plan`)

| Phase | Scope | Files | Estimated |
|---|---|---|---|
| 1 | Admin shell skeleton (sidebar + topbar + redirect) | shell/* (skeleton), layout.tsx, page.tsx redirect | 0.5d |
| 2 | Migrate workflows page vào shell | workflows/page.tsx, workflow-page.tsx (strip header) | 0.5d |
| 3 | Refactor docs layout vào shell + floating TOC | docs/layout.tsx, floating-toc.tsx | 1d |
| 4 | Theme system (light/dark/system) | theme-context.tsx, theme-toggle.tsx, CSS vars | 1d |
| 5 | Skills index build pipeline + types | build-skills-index.ts, skills-loader.ts, types | 1d |
| 6 | Skills catalog page + skill detail | skills/page.tsx, skills/[id]/page.tsx, components/skills/* | 1d |
| 7 | Command palette (Cmd+K) | command-palette.tsx, search-client.ts extend | 1d |
| 8 | Mobile drawer + responsive polish | mobile-drawer.tsx, responsive testing | 0.5d |
| 9 | Sidebar scroll memory + polish | sidebar-scroll-memory.ts, integration | 0.5d |
| 10 | E2E test + accessibility audit | playwright tests, axe-core run | 1d |

**Total: ~8 days** (1 dev). TDD mode khả thi cho phase 4, 5, 7, 9 (testable units).

## 8. Dependencies (existing — no new packages required)

- `cmdk@1.1.1` (đã có) — command palette
- `flexsearch@0.7.43` (đã có) — search index
- `@xyflow/react@12.10.2` (đã có) — ReactFlow giữ nguyên
- `tailwindcss@4` (đã có) — dark mode + theme tokens
- `gray-matter@4.0.3` (đã có) — parse SKILL.md frontmatter
- `glob@13.0.6` (đã có) — scan ~/.claude/skills/

## 9. Open Questions

1. **Skills index trong CI/Vercel**: `~/.claude/skills/` không tồn tại trên build server. Phương án:
   - (a) Commit `src/data/skills-index.json` vào git, dev rebuild local
   - (b) Build script optional — skip nếu folder không tồn tại + log warning
   - (c) Pull skills index từ remote URL (CDN) — overkill
   → Cần user xác nhận ở phase plan.

2. **Existing plan `260521-1942-docs-renderer-i18n`**: chưa rõ status. Nếu phase-04/05 (docs UI shell + search) đã ship → phase 3 của plan này chỉ là tweak. Nếu chưa → cần merge hoặc supersede.

3. **gstack skills**: trong `~/.claude/skills/` có cả gstack (`gstack` prefix). Có catalog luôn hay tách? CLAUDE.md project cũng note câu này (open question #2 dự án).

4. **Skill detail rich features**: SKILL.md thường có scripts/examples — có cần render code blocks runnable (vd: copy button, "open in claude" button)? Hay chỉ static.

5. **Workflow detail vẫn inline expand**: với shell sidebar mới chỉ chừa ~70% width, canvas ReactFlow có đủ chỗ render? Cần đo + có thể fallback slide-over panel nếu hẹp.
