# Phase 2 — Shell Redesign (Sidebar / Topbar / Drawer / Command Palette)

**Priority:** P1
**Status:** Blocked by Phase 1
**Duration:** 2h

## Overview

Áp dụng tokens + primitives lên admin shell. Hiện tại Topbar/Sidebar **không có dark variant** (hardcoded `bg-white`), đây là vấn đề lớn nhất sau Phase 1. Mục tiêu: dark mode parity 100% cho chrome, hairline borders, removed shadows, accent cinnabar cho active states.

## Key insights

- Shell render trên mọi route, lỗi ở đây ảnh hưởng toàn app
- Sidebar có 3 variants nội dung (workflows / docs / skills) — không đổi behavior, chỉ đổi visual
- Command palette là điểm "high-touch" — user dùng Cmd+K thường xuyên → phải polish kỹ
- Mobile drawer dùng chung component Sidebar (variant="drawer") → fix Sidebar là fix luôn drawer

## Architecture — Visual specs

### Sidebar (desktop)

```
┌─────────────────────────┐
│ ●  ClaudeKit Workflows  │  ← Header: logo + wordmark
│ ─────────────────────── │  ← 1px border-bottom
│ [Workflows][Docs][Skill]│  ← Section tabs, active = accent underline
│ ─────────────────────── │
│                         │
│  CATEGORY               │  ← Section label, uppercase 11px tracking
│  · All workflows     12 │  ← Active = accent bg-subtle, accent text
│  · Core              5  │
│  · Setup             3  │
│                         │
└─────────────────────────┘
```

- Width: 256px desktop, full-screen drawer mobile
- Background: `var(--color-background)` (KHÔNG `bg-white` cứng)
- Right border: 1px `var(--color-border)`
- Item padding: 8px 12px, hover bg `var(--color-surface)`, active bg `var(--color-accent-subtle)` + text `var(--color-accent)`

### Topbar

```
┌──────────────────────────────────────────────────────┐
│ [☰] Workflows / Core   [⌘ Search...]  [VI▼] [☀/🌙]  │
└──────────────────────────────────────────────────────┘
```

- Height: 52px (was 56)
- Bottom border: 1px hairline
- Bg: `var(--color-background)`
- Search trigger button: outline style, 240px width on desktop, icon-only on mobile
- Locale switcher + theme toggle: ghost button + dropdown

### Command Palette

- Bg: `var(--color-surface-elevated)`
- Border: 1px `var(--color-border-strong)`
- Radius: `--radius-lg`
- Shadow: `0 8px 24px rgba(0,0,0,0.08)` light / `0 8px 24px rgba(0,0,0,0.5)` dark
- Result item: hover/keyboard-active = `var(--color-surface)` bg, no accent overload

### Breadcrumb

- Separator: ` / ` muted text, không dùng emoji/icon
- Last segment: foreground, others: foreground-muted

## Related code files

### Modify (13 files)
- `src/components/shell/sidebar.tsx`
- `src/components/shell/sidebar-header.tsx`
- `src/components/shell/sidebar-section-tabs.tsx`
- `src/components/shell/sidebar-workflows-nav.tsx`
- `src/components/shell/sidebar-docs-tree.tsx`
- `src/components/shell/sidebar-docs-tree-client.tsx`
- `src/components/shell/sidebar-skills-nav.tsx`
- `src/components/shell/topbar.tsx`
- `src/components/shell/breadcrumb.tsx`
- `src/components/shell/command-palette.tsx`
- `src/components/shell/command-palette-trigger.tsx`
- `src/components/shell/mobile-drawer.tsx`
- `src/components/shell/hamburger-button.tsx`
- `src/components/shell/locale-switcher.tsx`
- `src/components/shell/theme-toggle.tsx`
- `src/components/shell/floating-toc.tsx`

### Optional create
- `src/components/ui/dropdown-menu.tsx` (nếu locale/theme dropdown cần shared)

## Implementation steps

1. **Sidebar container** — replace `bg-white border-gray-200` → `bg-background border-border`
2. **SidebarHeader** — wordmark dùng `--font-sans` 14px weight 600, logo SVG (không emoji)
3. **SidebarSectionTabs** — active state dùng `border-b-2 border-accent text-accent`, inactive `text-foreground-muted hover:text-foreground`
4. **SidebarWorkflowsNav / DocsTree / SkillsNav** — item layout chuẩn: 8px padding-y, 12px padding-x, count badge bên phải (`<Badge variant="outline" size="sm">`)
5. **Topbar** — height 52px, replace hardcoded colors, search trigger dùng `<Input>` primitive trong variant button
6. **Breadcrumb** — separator ` / ` thay vì chevron, muted color
7. **CommandPalette** — full visual overhaul: replace bg, border, shadow tokens; result item layout có icon (Lucide), title, group label, kbd hint
8. **CommandPaletteTrigger** — button style: ghost outline với `<Kbd>` chip bên phải hiển thị `⌘K`
9. **LocaleSwitcher / ThemeToggle** — ghost button + minimal dropdown (hoặc segmented toggle cho theme: ☀/🌙/💻)
10. **MobileDrawer** — backdrop blur subtle, drawer dùng cùng Sidebar tokens
11. **FloatingToc** (docs route) — minimal panel right side, active item accent
12. **Visual regression** — chụp screenshot trước/sau mỗi route (workflows / docs / skills) × light/dark, diff thủ công

## Todo

- [ ] Migrate Sidebar container + Header
- [ ] Migrate SectionTabs với accent underline
- [ ] Migrate 3 nav variants (workflows / docs / skills)
- [ ] Migrate Topbar (bg, height, borders)
- [ ] Migrate Breadcrumb (separator + muted colors)
- [ ] Overhaul CommandPalette + Trigger
- [ ] Migrate LocaleSwitcher + ThemeToggle với ghost style
- [ ] Migrate MobileDrawer
- [ ] Migrate FloatingToc
- [ ] Migrate HamburgerButton
- [ ] Update tests trong `src/components/shell/*.test.tsx` (snapshot có thể vỡ → cập nhật)
- [ ] Run `npm run test:run` xanh
- [ ] Manual QA: 3 routes × 2 themes × 3 viewports = 18 screenshot

## Success criteria

- Bật/tắt dark mode trên 3 route (workflows, docs/{slug}, skills) **không vỡ** bất kỳ phần nào của shell
- Mọi component shell dùng `var(--color-*)` tokens (grep `bg-white|bg-gray-\d|border-gray-\d` trong `src/components/shell/` không return kết quả)
- Command palette: keyboard nav (↑↓ enter esc) còn nguyên, visual modernized
- a11y test (`npm run test:e2e:a11y`) không có critical/serious regression mới

## Risk assessment

| Risk | Mitigation |
|------|------------|
| Snapshot test trong `*.test.tsx` vỡ hàng loạt | Cập nhật snapshot theo từng component, không bulk-update |
| Theme transition flicker khi swap class trên `<html>` | Verify `next-themes` config: `disableTransitionOnChange: true` |
| Command palette regression UX | Test keyboard flow trước & sau visual change, dùng e2e nếu cần |
| Drawer dùng cùng Sidebar component → một bug ảnh hưởng cả 2 | Thêm variant prop check trong test |

## Next steps

→ Phase 3: Catalog cards + search/filter bar dùng primitives + tokens
