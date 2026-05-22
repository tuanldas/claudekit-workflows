# Frontend Redesign — Cinnabar Minimal

**Slug:** `frontend-redesign-cinnabar-minimal`
**Date:** 2026-05-22
**Branch (suggested):** `feat/frontend-redesign-cinnabar-minimal`

## Mục tiêu

Thiết kế lại toàn bộ frontend ClaudeKit Workflows theo phong cách **Linear / Vercel** (sharp & minimal) với accent **Anthropic cinnabar `#C96442`**. Giải quyết 6 root cause "xấu & không đồng nhất":

1. `globals.css` không có design tokens → tokens hoá toàn bộ
2. Body font sai (Arial thay vì Geist Sans) → fix font wiring
3. Dark mode chỉ phủ ~50% → light/dark parity 100%
4. Border radius loạn (xl / lg / default) → 3-tier scale (sm / md / lg)
5. Accent orange hardcoded khắp nơi → semantic token `--color-accent`
6. Không có primitive component layer → tạo Button / Card / Badge / Input / Separator

## Nguyên tắc thiết kế

- **Hairline borders** 1px, không shadow nặng
- **Mono-leaning** chips cho command/CLI tokens
- **Subtle gray scale** + 1 accent cinnabar
- **Type-driven hierarchy** thay vì màu sắc loè loẹt
- **Spatial system** 4pt base scale (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64)
- **Dark mode equal** — mọi token có pair light + dark, verify WCAG AA

## Phases

| # | Phase | Status | Duration | Files |
|---|-------|--------|----------|-------|
| 1 | [Foundation — tokens + primitives](./phase-01-foundation-tokens-primitives.md) | Done | 2-3h | `globals.css`, `components/ui/*` (6 new + index) |
| 2 | [Shell redesign](./phase-02-shell-redesign.md) | Done | 2h | `components/shell/*` (16 files migrated) |
| 3 | [Catalog cards & filters](./phase-03-catalog-cards.md) | Done | 2-3h | `workflow-card`, `skill-card`, `search-bar`, `category-tabs`, `level-badge`, `flow-steps`, etc. |
| 4 | [Detail pages](./phase-04-detail-pages.md) | Done | 2-3h | `workflow-detail`, `workflow-flow-canvas`, `skill-detail-page`, `components/docs/*` |

## Outcome (2026-05-22)

- Toàn bộ 4 phase đã ship trong cùng session
- `globals.css`: 28 semantic tokens (colors / radius / fonts), light + dark pair
- 6 primitive components mới (`Button`, `Card`, `Badge`, `Input`, `Separator`, `Kbd`) + 15 tests pass
- Tổng 32+ component files migrate tokens, 0 hardcoded `bg-white|gray-*|orange-*` còn lại
- `npm run lint` clean, `npm run test:run` 224/224 pass, `npm run build` thành công (57 pages)
- Verified visually: workflows catalog + skills catalog + workflow detail + skill detail + docs MDX × light/dark

**Total estimate:** 8-11 hours. Mỗi phase ship được riêng (commit + verify locally), không cần đợi cả 4 xong.

## Dependencies giữa các phase

```
Phase 1 (tokens + primitives)
   │
   ├─→ Phase 2 (shell uses tokens + primitives)
   │
   ├─→ Phase 3 (cards use tokens + primitives)
   │
   └─→ Phase 4 (detail pages use everything above)
```

Phase 1 BẮT BUỘC xong trước Phase 2/3/4. Phase 2/3/4 có thể song song nếu cần (different files), nhưng tuần tự an toàn hơn để verify từng tầng.

## Success criteria toàn dự án

- [ ] Bật/tắt dark mode không vỡ bất kỳ trang nào (workflows / docs / skills + 1 detail page mỗi loại)
- [ ] Mọi màu/radius/spacing đến từ semantic token, không hardcode `gray-200`/`orange-300`/`rounded-xl` trong components
- [ ] `npm run lint` pass
- [ ] `npm run test:run` pass (Vitest)
- [ ] `npm run test:e2e:a11y` pass (axe-core critical/serious)
- [ ] Visual screenshot review ở 375px / 768px / 1280px / 1920px cả light + dark

## Reports

Reports lưu tại `/Users/admin/Desktop/Codes/tuanldas/claudekit-workflows/docs/plans/reports/`.

## Unresolved questions

1. Có cần migrate workflow-flow-canvas (ReactFlow) sang token-based styling không, hay giữ inline node colors? (đề xuất: token-based để dark mode đồng nhất)
2. ReactFlow node colors (`phaseColors` array) có cần re-pick theo cinnabar palette không, hay giữ rainbow để phân biệt phase? (đề xuất: giữ rainbow nhưng desaturate + add dark variant)
