# Phase 1 — Foundation: Design Tokens + Primitive Components

**Priority:** P0 (blocker cho Phase 2/3/4)
**Status:** Not started
**Duration:** 2-3h

## Overview

Tạo nền tảng design system: semantic color tokens, spacing/radius/typography scale trong `globals.css`, và 5 primitive components (`Button`, `Card`, `Badge`, `Input`, `Separator`) trong `src/components/ui/`. Sau phase này, toàn bộ component sau (shell, cards, detail) chỉ dùng token + primitives — không hardcode màu/radius.

## Key insights

- Tailwind v4 hỗ trợ `@theme inline` trong CSS → declare CSS vars + utility class tự sinh
- `@variant dark (&:where(.dark, .dark *))` đã có → giữ pattern này
- Body font hiện đang Arial vì `body` CSS hardcode `font-family: Arial`; chỉ cần xoá là `--font-geist-sans` từ layout.tsx (Geist) sẽ thắng
- Cinnabar `#C96442` ở light cần test 4.5:1 contrast với background; ở dark có thể cần lighter shade `#E08363`

## Architecture — Design tokens

### Colors (semantic, paired light/dark)

```css
:root {
  /* surfaces */
  --color-background: #ffffff;
  --color-surface: #fafafa;          /* card bg */
  --color-surface-elevated: #ffffff; /* modal/popover bg */

  /* text */
  --color-foreground: #09090b;       /* zinc-950 */
  --color-foreground-muted: #71717a; /* zinc-500 */
  --color-foreground-subtle: #a1a1aa;/* zinc-400 */

  /* borders */
  --color-border: #e4e4e7;           /* zinc-200 */
  --color-border-strong: #d4d4d8;    /* zinc-300 */

  /* accent — cinnabar */
  --color-accent: #c96442;
  --color-accent-hover: #b85535;
  --color-accent-foreground: #ffffff;
  --color-accent-subtle: #fdf1ec;    /* tinted bg for selected */
  --color-accent-ring: rgba(201,100,66,0.35);

  /* feedback */
  --color-danger: #dc2626;
  --color-success: #16a34a;
  --color-warning: #d97706;
}

.dark {
  --color-background: #09090b;       /* zinc-950 */
  --color-surface: #18181b;          /* zinc-900 */
  --color-surface-elevated: #27272a; /* zinc-800 */

  --color-foreground: #fafafa;
  --color-foreground-muted: #a1a1aa;
  --color-foreground-subtle: #71717a;

  --color-border: #27272a;           /* zinc-800 */
  --color-border-strong: #3f3f46;    /* zinc-700 */

  --color-accent: #e08363;           /* lighter cinnabar */
  --color-accent-hover: #ed9477;
  --color-accent-foreground: #1c0d08;
  --color-accent-subtle: #2a1812;
  --color-accent-ring: rgba(224,131,99,0.4);

  --color-danger: #f87171;
  --color-success: #4ade80;
  --color-warning: #fbbf24;
}
```

### Spacing scale (4pt base)

Dùng Tailwind default (`1` = 4px). Quy ước rhythm:
- Component padding: 12 / 16 / 20 / 24
- Section gap: 24 / 32 / 48 / 64
- Inline gap: 4 / 8 / 12

### Radius scale (3 tier — không cho phép giá trị khác)

```css
@theme inline {
  --radius-sm: 6px;   /* badges, chips, small tags */
  --radius-md: 8px;   /* buttons, inputs, small cards */
  --radius-lg: 10px;  /* cards, panels, modals */
}
```

**Lưu ý:** Linear/Vercel dùng radius khá thấp (6-10px), không "pill". Bỏ `rounded-xl` / `rounded-2xl`.

### Typography scale

```css
@theme inline {
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, "SF Mono", monospace;
}
```

- Body 14px (text-sm) base — phù hợp catalog dense
- Heading scale: 13 / 14 / 16 / 20 / 24 / 32 — không scale to hơn (catalog không phải landing)
- Line-height: 1.5 cho body, 1.2 cho heading
- Weight: 400 body / 500 label / 600 heading. Không dùng 700+ trừ display

### Ring / focus

```css
--ring-width: 2px;
--ring-offset: 2px;
```

Mọi interactive element dùng `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-ring)]`.

## Related code files

### Modify
- `src/app/globals.css` — full rewrite với tokens
- `src/app/layout.tsx` — verify `--font-geist-sans` được pass đúng cho `<body>` className
- `src/app/[locale]/layout.tsx` — đảm bảo `<html className={dark ? 'dark' : ''}>` chuyển theo theme

### Create
- `src/components/ui/button.tsx` — `variant: default | accent | ghost | outline | danger`, `size: sm | md | lg`
- `src/components/ui/card.tsx` — `<Card>`, `<CardHeader>`, `<CardBody>`, `<CardFooter>`
- `src/components/ui/badge.tsx` — `variant: default | accent | outline | success | warning | danger`, dùng cho level/category/tag
- `src/components/ui/input.tsx` — text input + icon slot (cho search)
- `src/components/ui/separator.tsx` — horizontal/vertical 1px border
- `src/components/ui/kbd.tsx` — keyboard shortcut chip (Cmd+K)

## Implementation steps

1. **Audit current usage** — grep `bg-white|bg-gray-|border-gray-|text-gray-|orange-` trong `src/components/**/*.tsx` để biết các shade đang dùng
2. **Rewrite `globals.css`** — replace với section "Architecture" ở trên; xoá `font-family: Arial` cứng
3. **Verify font wiring** — `src/app/layout.tsx` phải `<body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>`
4. **Create `src/components/ui/` directory** — 6 primitive files (button, card, badge, input, separator, kbd) — mỗi file ≤80 lines
5. **Write component tests** — Vitest test cho `Button` (variants, sizes, disabled state) và `Badge` (variants)
6. **Compile check** — `npm run build` (Turbopack) phải xanh
7. **Visual smoke test** — tạo 1 storybook-lite route tạm `/[locale]/_dev/ui-kit/page.tsx` (xoá sau Phase 4) để render tất cả primitive variants × light/dark

## Todo

- [ ] Audit hardcoded colors qua grep
- [ ] Rewrite `globals.css` với token system mới
- [ ] Fix body font (xoá Arial)
- [ ] `Button` component + test
- [ ] `Card` component + test
- [ ] `Badge` component + test
- [ ] `Input` component + test
- [ ] `Separator` component
- [ ] `Kbd` component
- [ ] Dev route `/[locale]/_dev/ui-kit` để smoke-test
- [ ] `npm run build` xanh
- [ ] `npm run test:run` xanh
- [ ] Manual screenshot 375 / 768 / 1280 cả light + dark trên dev route

## Success criteria

- `globals.css` chứa **toàn bộ** semantic tokens (colors / radius / typography)
- 5 primitive components tồn tại tại `src/components/ui/`, có TypeScript types đầy đủ
- Dev route `/vi/_dev/ui-kit` hiển thị tất cả variants × cả 2 theme không vỡ
- Contrast ratio cinnabar accent ≥ 4.5:1 trên cả light và dark background (verify bằng tool)
- Body text actually renders Geist Sans (verify trong DevTools Computed)

## Risk assessment

| Risk | Mitigation |
|------|------------|
| Tailwind v4 syntax cho `@theme` thay đổi | Reference docs: tailwindcss.com/docs/theme; test trên 1 file đơn giản trước |
| Dark mode flicker khi load | `next-themes` đã handle qua `ThemeProvider` — verify trong devtools |
| ReactFlow node colors xung đột với token system | Tạm thời giữ ReactFlow node colors inline, refactor ở Phase 4 |
| Removing `bg-orange-50` etc. có thể vỡ một số component chưa migrate | Phase 1 KHÔNG xoá class cũ — chỉ thêm token mới. Phase 2/3/4 mới migrate component → xoá class cũ |

## Next steps

→ Phase 2: Apply tokens + primitives cho shell (Sidebar, Topbar, Drawer, Command Palette)
