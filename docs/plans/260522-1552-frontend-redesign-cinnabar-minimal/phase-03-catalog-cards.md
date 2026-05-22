# Phase 3 — Catalog Cards & Filter Bar

**Priority:** P1
**Status:** Blocked by Phase 1 (có thể song song Phase 2)
**Duration:** 2-3h

## Overview

Redesign 2 catalog chính: **Workflows** (39 cards) và **Skills** (130+ cards). Hiện tại 2 catalog dùng card style **khác nhau** (`rounded-xl` vs `rounded-lg`, accent border khác). Mục tiêu: 1 card pattern thống nhất, hairline borders, mono-leaning command chips, accent cinnabar cho selected/hover.

## Key insights

- Catalog là trang user gặp đầu tiên — first impression quan trọng
- 130+ skills cards = density quan trọng → giảm padding, tăng info per card
- Command chain (FlowSteps) là điểm visual độc đáo của workflow cards → nên giữ nhưng style monospace, không box rộng
- Level badge (Beginner/Intermediate/Advanced) hiện dùng colored bg → dùng dot indicator + label thay vì pill loè loẹt
- Search bar + category filter chiếm space trên top → cần compact lại

## Architecture — Visual specs

### Workflow Card

```
┌─────────────────────────────────────┐
│ ● Beginner              ~30 min     │  ← Dot indicator + label, mono duration
│                                     │
│ Build with Research First           │  ← Title, 15px weight 600
│                                     │
│ Plan, research, then implement      │  ← Description, 13px muted
│ a feature with full traceability.   │
│                                     │
│ /plan → /research → /cook → /test   │  ← Mono chips, no boxes, accent arrow
└─────────────────────────────────────┘
```

- Border: 1px `var(--color-border)` (hairline)
- Radius: `--radius-lg` (10px)
- Padding: 16px
- Background: `var(--color-background)` default, `var(--color-surface)` on hover, `var(--color-accent-subtle)` selected
- Selected: thêm `border-color: var(--color-accent)` (1px), KHÔNG cần shadow

### Skill Card (denser)

```
┌────────────────────────────────────┐
│ /ck:plan          [plugin: ck]     │  ← Mono command name + plugin chip
│ Intelligent plan creation with     │
│ prompt enhancement and...          │  ← 2-line clamp description
│ ─────────────────────────────────  │
│ #planning #ai #automation          │  ← Tag chips, muted
└────────────────────────────────────┘
```

- Smaller padding (14px), same border treatment
- Title trong mono font (Geist Mono)
- Plugin badge: outline variant
- Tag chips: ghost/outline, muted text

### LevelBadge (redesign)

Hiện tại pill colored (orange/blue/red). Đổi thành **dot + label**:
- ● Beginner: green dot (`--color-success`)
- ◆ Intermediate: amber dot (`--color-warning`)
- ▲ Advanced: cinnabar dot (`--color-accent`)
- 11px label, mono caps, weight 500

### FlowSteps (command chain)

Hiện tại box loè loẹt. Redesign:
- Mono text `text-xs` Geist Mono
- Separator: muted `→` (arrow), không phải box
- Color: `text-foreground-muted` default; nếu workflow selected → `text-accent`
- Wrap nếu dài

### CategoryTabs (filter bar)

```
[ All ▴ ] [ Core ] [ Setup ] [ ... ]   13 workflows
```

- Pills nhỏ (height 30px), padding 8px 12px
- Active: bg `--color-accent-subtle`, border `--color-accent`, text `--color-accent`
- Inactive: border `--color-border`, text muted
- Hover: bg `--color-surface`

### SearchBar

- Dùng `<Input>` primitive với icon left (Lucide `Search`)
- Width: 320px max
- Placeholder muted
- Focus ring accent

## Related code files

### Modify
- `src/components/workflow-card.tsx`
- `src/components/skills/skill-card.tsx`
- `src/components/level-badge.tsx`
- `src/components/flow-steps.tsx`
- `src/components/search-bar.tsx`
- `src/components/category-tabs.tsx`
- `src/components/skills/skill-group-badge.tsx`
- `src/components/skills/skill-plugin-badge.tsx`
- `src/components/workflows/workflows-page-content.tsx` (layout grid)
- `src/components/skills/skills-catalog-content.tsx` (layout grid)
- `src/components/shell/page-header.tsx` (eyebrow color → accent token)

## Implementation steps

1. **WorkflowCard** — refactor để dùng `<Card>` primitive làm wrapper; replace hardcoded oranges → accent tokens; mới radius/padding/border
2. **SkillCard** — chuyển title sang mono font, thay class set; standardize với WorkflowCard
3. **LevelBadge** — rewrite hoàn toàn: dot + label thay vì pill
4. **FlowSteps** — text-based với arrow separator, không box
5. **SearchBar** — chỉ dùng `<Input>` primitive với icon slot
6. **CategoryTabs** — pill style nhất quán, active = accent
7. **PluginBadge / GroupBadge** — dùng `<Badge variant="outline">`
8. **Catalog grids** — verify `gap-4` spacing, breakpoints 1/2/3 cột không đổi nhưng test ở 1440px (4 cột?)
9. **PageHeader eyebrow** — replace orange → accent token
10. **No-results empty state** — minimal text + helpful hint (e.g., "Try clearing filters or different search")
11. **Tests** — update các tests có thể bị ảnh hưởng (workflow-card test có check selected bg-orange-50, skill-card test check border)

## Todo

- [ ] WorkflowCard refactor + test update
- [ ] SkillCard refactor + test update
- [ ] LevelBadge redesign (dot + label)
- [ ] FlowSteps text-based
- [ ] SearchBar dùng Input primitive
- [ ] CategoryTabs pill style + active accent
- [ ] PluginBadge / GroupBadge dùng Badge primitive
- [ ] PageHeader eyebrow token
- [ ] Empty state polish
- [ ] Verify catalog grid 1280px / 1920px (cân nhắc 4 cột)
- [ ] `npm run test:run` xanh
- [ ] `npm run test:e2e` xanh
- [ ] Visual: 2 catalog × 2 theme × 3 viewport = 12 screenshots

## Success criteria

- Workflows catalog + Skills catalog có **cùng card visual language** (radius / border / padding / typography)
- Không còn class hardcoded `orange-*` trong card components (grep verify)
- Level badge readable cho colorblind users (dot + label thay vì chỉ color)
- Selected state rõ ràng visual (accent border + subtle bg) ở cả 2 mode
- Search + filter bar compact, không overflow ở 375px

## Risk assessment

| Risk | Mitigation |
|------|------------|
| Workflow card hiện có `isSelected` logic prop → đảm bảo behavior không đổi | Keep prop signature, chỉ refactor className |
| 130+ skill cards có thể chậm khi re-render với complex style | Virtualize nếu cần (Phase 3.5), nhưng hiện tại Next.js đang server-render → ổn |
| FlowSteps có thể overflow card width khi chain dài | Add `flex-wrap` + smaller font for long chains |
| Test snapshot vỡ ở workflow-card.test.tsx | Có thể chấp nhận update snapshot — verify visual đúng trước |

## Next steps

→ Phase 4: Detail pages (workflow detail + ReactFlow canvas + skill detail + docs MDX viewer)
