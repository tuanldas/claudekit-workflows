# Phase 01 — Design Tokens Audit + Typography/Spacing Scale Formalization

## Context Links

- `src/app/globals.css` — existing tokens (Cinnabar Minimal phase 1 shipped)
- `docs/plans/260522-1552-frontend-redesign-cinnabar-minimal/phase-01-foundation-tokens-primitives.md` — previous tokens phase
- `src/components/shell/page-header.tsx:21` — current `text-2xl sm:text-3xl` ad-hoc h1
- `src/components/workflow-detail.tsx:31` — `text-xl` ad-hoc h2
- `src/components/skills/skill-card.tsx:22` — `text-[13px]` ad-hoc card title
- `src/components/workflow-card.tsx:46` — `text-[15px]` ad-hoc card title (mismatch with skills card)

## Overview

- **Priority:** P1 (blocks phase 2+)
- **Status:** pending
- **Duration estimate:** 1.5h
- **Brief:** Tokens (colors/radius) đã ổn. Phase này thêm `--text-*` typography scale + `--space-*` spacing scale vào `globals.css`, decision-document Cinnabar accent (giữ), prune ad-hoc `text-[Npx]` ad-hoc patterns trong feature components (note for phase 3-5).

## Key Insights

1. Color tokens đã ship Cinnabar Minimal phase 1: 28 semantic vars light+dark pair. Đừng đụng vào.
2. Radius tokens: `--radius-sm 6px / md 8px / lg 10px`. Đủ. Đừng đụng.
3. **THIẾU typography scale** — mỗi component tự chọn `text-xl`, `text-2xl`, `text-[13px]`, `text-[15px]`. Card title không thống nhất (Skills 13px mono, Workflows 15px sans).
4. **THIẾU spacing scale tokens** — page padding hiện `px-6 py-8 lg:px-8`, sidebar `mb-6/mb-8`, gap `gap-3/gap-4`. Ad-hoc, không bind token.
5. Body font `14px` đã set ở `body {}` rule. Default base scale will key off `1rem = 16px` browser default. **Keep body 14px** (dashboard convention).
6. Cinnabar accent verified working WCAG AA (previous phase). **Giữ nguyên**.

## Requirements

### Functional
- Add typography token scale (6 sizes + line-heights) to `:root` and consume via `@theme inline`.
- Add spacing rhythm tokens (4pt base) keyed to common usage.
- Document the scale rationale in `globals.css` comments (kept brief — full docs in phase-06).
- No visual regression on existing pages.

### Non-functional
- All new tokens ≤ 30 lines of CSS added.
- Tokens namespaced `--text-*` and `--space-*` to avoid collision.
- Light + dark identical for typography/spacing (no value differences — only colors/borders vary by mode).

## Architecture

```
globals.css
   ├─ :root
   │    ├─ existing color + radius tokens (UNCHANGED)
   │    ├─ NEW --text-{display, h1, h2, h3, body, caption} + matching --leading-*
   │    └─ NEW --space-{0.5, 1, 2, 3, 4, 6, 8, 12} (4pt scale: 2,4,8,12,16,24,32,48px)
   │
   └─ @theme inline
        ├─ existing color mappings (UNCHANGED)
        ├─ NEW text-display, text-h1...text-caption Tailwind utilities
        └─ NEW spacing-* utilities (Tailwind already has spacing scale; only override if our 4pt deviates)
```

### Token values (proposed — confirm in step 2)

| Token | Value | Use for |
|---|---|---|
| `--text-display` | 30px / 1.15 / -0.02em | Hero/landing hero (rarely used) |
| `--text-h1` | 24px / 1.25 / -0.015em | Page title (PageHeader) |
| `--text-h2` | 18px / 1.35 / -0.01em | Detail section header (h2 inside cards/articles) |
| `--text-h3` | 15px / 1.4 / -0.005em | Card title (Workflows + Skills unified) |
| `--text-body` | 14px / 1.5 | Body (default — matches `body` rule) |
| `--text-caption` | 12px / 1.45 | Metadata, duration, level badge, eyebrow |
| `--text-micro` | 11px / 1.4 | Eyebrow uppercase, command chip labels |

Mono variant: same sizes but `font-family: var(--font-mono)`.

Spacing 4pt scale: `2 4 8 12 16 24 32 48 64 96`. Tailwind defaults align well — only add `--space-*` if we need to override or document.

### Cinnabar accent decision

**Keep `#c96442` light / `#e08363` dark.** Already WCAG AA, user-confirmed in previous redesign. No tweak. Document in phase-06 design-system doc as "accent is reserved for: active filter, selected card, primary CTA, link, focus ring".

## Related Code Files

### Modify
- `src/app/globals.css` — add `--text-*` + `--leading-*` token block; optionally `--space-*` if 4pt deviates from Tailwind defaults (likely we just adopt Tailwind's `gap-2/3/4/6/8`).

### Create
- (none in this phase — primitives come in phase-02)

### Delete
- (none)

## Implementation Steps

1. **Audit** `globals.css` current state. Confirm no `--text-*` tokens exist. Confirm `--font-sans` + `--font-mono` wired.
2. **Decide token naming** — `--text-h1` vs `--font-size-h1`. Recommend `--text-h1` (matches Tailwind `text-{name}` ergonomic). Document choice in CSS comment.
3. **Add typography token block** to `:root` (no dark override — sizes are mode-agnostic). Insert after radius tokens (line ~111).
4. **Add `@theme inline` mappings** so Tailwind generates `text-h1`, `text-h2`, etc. utilities. Verify Tailwind v4 `@theme inline` syntax in current `globals.css`.
5. **Decision: spacing tokens.** Check if 4pt scale matches Tailwind default. Tailwind: `1=4px 2=8px 3=12px 4=16px 6=24px 8=32px`. Matches. **Skip custom spacing tokens** (YAGNI). Document in comment.
6. **Verify build:** run `npm run lint` + `npm run test:run`. No new code uses tokens yet so should pass.
7. **Capture screenshots** of 3 pages (Workflows, Skills, Docs) light+dark to `visuals/before/` as baseline for phase 7 regression check.
8. **Document decisions** in inline CSS comments. Keep ≤ 10 lines comment.

## Todo List

- [ ] Audit existing globals.css; list tokens already present
- [ ] Decide token naming convention (`--text-*` preferred)
- [ ] Add `--text-display/h1/h2/h3/body/caption/micro` + matching `--leading-*` to `:root`
- [ ] Add corresponding `@theme inline` mappings
- [ ] Verify Tailwind v4 picks up new utilities (`text-h1` class compiles)
- [ ] Decide on `--space-*` tokens (likely skip — match Tailwind defaults)
- [ ] Document Cinnabar accent reserved-use rule in CSS comment
- [ ] Run `npm run lint` and `npm run test:run` → green
- [ ] Capture before-screenshots to `visuals/before/`
- [ ] Commit: `feat(tokens): add typography scale tokens`

## Success Criteria

- `globals.css` contains `--text-h1` through `--text-micro` + leading pairs, all under `:root`.
- `@theme inline` exports them as Tailwind utilities (`text-h1`, `text-h2`, ...).
- `npm run test:run` passes (no test affected since no feature code touched).
- `npm run build` succeeds.
- `visuals/before/` has 6 baseline screenshots (3 pages × 2 modes).

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Tailwind v4 doesn't honor custom `text-{name}` utility from `@theme inline` | Low | High | Test single utility in scratch component before mass-add. Fallback: keep as CSS variable, use `style={{ fontSize: 'var(--text-h1)' }}`. |
| Adding tokens without consumers causes lint "unused custom property" | Low | Low | Tailwind doesn't flag unused custom props. Verify in step 6. |
| Token rename collision with Tailwind builtins | Low | Medium | Tailwind doesn't ship `text-h1` by default — namespace clean. |
| Screenshot capture flaky | Low | Low | Use Playwright `e2e/helpers` if exists, else manual via dev server. |

## Security Considerations

None — CSS tokens only.

## Next Steps

- Phase 02 consumes these tokens in layout primitives.
- Phase 03/04/05 replace ad-hoc `text-{Npx}` patterns with `text-h1` / `text-h3` / etc.
- Phase 06 documents token scale in `design-system.md`.
