# Phase 4 — Detail Pages (Workflow Detail / Skill Detail / Docs MDX Viewer)

**Priority:** P1
**Status:** Blocked by Phase 1 (có thể song song Phase 2/3)
**Duration:** 2-3h

## Overview

Hoàn thiện 3 loại detail page:
1. **Workflow Detail** — inline expansion above grid (2-col: info + ReactFlow canvas)
2. **Skill Detail** — full page với header, description, examples
3. **Docs MDX Viewer** — long-form reading với TOC, code blocks, callouts

Đây là phase "polish" cuối — focus vào reading experience, code rendering, ReactFlow theme parity với dark mode.

## Key insights

- Workflow detail có ReactFlow canvas — node colors hiện hardcoded → cần map sang token để dark mode đẹp
- Docs viewer dùng MDX + Shiki cho code highlighting — `globals.css` đã có dual theme swap → giữ nguyên, chỉ tinh chỉnh prose styles
- Skill detail có sections: description, when-to-use, examples, full skill.md content rendering
- Floating TOC (`floating-toc.tsx`) đã được Phase 2 cover

## Architecture — Visual specs

### Workflow Detail (inline expansion)

```
╭───────────────────────────────────────────────────────╮
│  Workflow Title                              [×]      │  ← Close btn ghost
│  ────────────────────────────────────────────────     │
│                                                       │
│  ┌─────────────────────┐  ┌──────────────────────┐    │
│  │  PHASES             │  │   ReactFlow canvas   │    │
│  │  ─────              │  │   (pan / zoom / drag)│    │
│  │  ● Setup     30 min │  │                      │    │
│  │  ● Implement 2 hr   │  │   [Node]→[Node]      │    │
│  │  ● Test      30 min │  │                      │    │
│  │                     │  │                      │    │
│  │  TIPS               │  │                      │    │
│  │  · Tip 1            │  │                      │    │
│  │  · Tip 2            │  │                      │    │
│  └─────────────────────┘  └──────────────────────┘    │
╰───────────────────────────────────────────────────────╯
```

- Container: `<Card>` primitive với `--radius-lg`, hairline border
- Sub-section: SectionHeader uppercase 11px label tracking, content normal
- ReactFlow nodes: bg `var(--color-surface)`, border `var(--color-border-strong)`, top border `var(--color-accent)` cho phase highlight
- Tips list: dash bullets (`·`), không icon emoji

### Skill Detail (full page)

```
┌─────────────────────────────────────────┐
│  /ck:plan       [Group: planning]       │
│  ────────────────────────────────────   │
│  Intelligent plan creation...           │  ← Description
│                                         │
│  ## When to Use                         │  ← MDX render
│  - Bullet 1                             │
│  - Bullet 2                             │
│                                         │
│  ## Examples                            │
│  ```bash                                │
│  /ck:plan                               │
│  ```                                    │
└─────────────────────────────────────────┘
```

- Header: command name dùng mono font 24px, group badge bên phải
- Body: MDX content qua `mdx-components.tsx` (Phase 3 đã chuẩn hoá prose styles)

### Docs MDX Viewer

- Prose: `@tailwindcss/typography` plugin (đã có) — override `prose-zinc` cho color tokens
- Code blocks: dùng `code-block.tsx` đã có với Shiki dual theme; thêm copy button accent hover
- Callouts (info/warn/danger): `<Callout>` component mới, dùng accent/danger/warning tokens
- TOC: floating right side, active item accent (Phase 2 đã làm)
- Translation banner: muted bg, dismissible

## Related code files

### Modify
- `src/components/workflow-detail.tsx` — layout refactor + token migration
- `src/components/workflow-flow-canvas.tsx` — node theme map (light/dark)
- `src/components/skills/skill-detail-page.tsx`
- `src/components/skills/skill-header.tsx`
- `src/components/docs/code-block.tsx` (copy button polish)
- `src/components/docs/docs-toc.tsx`
- `src/components/docs/mdx-components.tsx` (prose styles)
- `src/components/docs/translation-banner.tsx`
- `src/components/docs/docs-search.tsx`
- `src/components/docs/docs-sidebar.tsx` + `docs-sidebar-item.tsx`

### Create
- `src/components/ui/callout.tsx` — `<Callout variant="info|warn|danger">` với icon Lucide + token bg

## Implementation steps

1. **WorkflowDetail** — wrap `<Card>` primitive, refactor 2-col grid với gap-6, replace section headers, polish tips list
2. **WorkflowFlowCanvas** — extract node style sang `getNodeStyle(theme)` function; subscribe theme từ context để re-style khi switch
3. **ReactFlow nodes** — bg surface, border-strong, top accent border 2px; edges grayed-out với arrow muted
4. **SkillDetailPage** — header dùng mono command name, group badge bên phải, content wrap trong `.prose`
5. **SkillHeader** — standardize spacing
6. **Callout component mới** — info (accent-subtle bg + accent border-left), warn (warning-subtle), danger (danger-subtle); icon Lucide
7. **CodeBlock** — copy button: ghost icon-only, hover accent; verify Shiki theme đang OK với token bg
8. **MDX components** — `prose-zinc dark:prose-invert` baseline, override link → accent, code inline → mono surface
9. **DocsToc** — Phase 2 đã làm, verify thôi
10. **TranslationBanner** — muted bg, close button
11. **DocsSearch** — dùng same pattern với SearchBar
12. **E2E test** — verify 1 workflow detail + 1 skill detail + 1 docs page render đúng cả 2 theme

## Todo

- [ ] WorkflowDetail wrap Card + 2-col refactor
- [ ] WorkflowFlowCanvas theme-aware node styling
- [ ] ReactFlow edges + arrows polish
- [ ] SkillDetailPage layout
- [ ] SkillHeader spacing
- [ ] Callout component + test
- [ ] CodeBlock copy button polish
- [ ] MDX prose styles override (link, inline code, blockquote)
- [ ] DocsToc verify
- [ ] TranslationBanner restyle
- [ ] DocsSearch align với SearchBar
- [ ] `npm run test:run` xanh
- [ ] `npm run test:e2e` xanh (workflow detail flow, docs nav)
- [ ] `npm run test:e2e:a11y` xanh
- [ ] Visual: 3 detail page × 2 theme = 6 screenshots
- [ ] Delete dev route `/[locale]/_dev/ui-kit` từ Phase 1

## Success criteria

- Workflow detail mở/đóng smooth, ReactFlow nodes có visible theme khác biệt light/dark
- Skill detail render mọi field SKILL.md đúng, không vỡ với skills có description dài
- Docs MDX viewer: prose readable (line-length, line-height), code blocks Shiki theme đúng, copy button hoạt động
- TOC active item highlight đúng khi scroll
- a11y: heading hierarchy h1→h2→h3 nguyên trên detail pages, không skip level

## Risk assessment

| Risk | Mitigation |
|------|------------|
| ReactFlow node restyle có thể vỡ pan/zoom UX | Test interactivity sau mỗi change; keep ReactFlow Controls component nguyên |
| MDX prose override có thể conflict với existing `prose-zinc` defaults | Override từng selector cụ thể (`prose-a`, `prose-code`) thay vì rewrite |
| Shiki dual theme có thể không pick up theme change instant | Verify CSS-only swap qua `@variant dark` đủ, không cần JS |
| Skill content dài + TOC overlap content trên narrow viewport | TOC hide < 1280px (đã đúng), giữ floating-toc breakpoint |

## Next steps

→ Final QA pass: full app screenshot tour, fix bugs phát sinh
→ Update CHANGELOG / commit message
→ Optional: write journal entry tại `docs/plans/reports/journal-260522-frontend-redesign-cinnabar-minimal.md`
