# Design System

Layout chuẩn cho mọi trang catalog/detail/docs trong project. Lock visual identity ở **Cinnabar Minimal** + spacing rhythm 4pt. Nếu cần thêm trang mới, **compose templates + primitives** thay vì tự lắp `<PageShell><PageHeader>` manual.

## Tokens

Tokens định nghĩa ở `src/app/globals.css` → `@theme inline`. Tailwind v4 generate utilities tự động (`text-h1`, `bg-accent`, …).

### Typography

| Token | Size / Leading | Use |
|---|---|---|
| `text-display` | 30px / 1.15 | Hero (hiếm dùng) |
| `text-h1` | 24px / 1.25 | Page title (`PageHeader`) |
| `text-h2` | 18px / 1.35 | Detail section header / article H2 |
| `text-h3` | 15px / 1.4 | Card title (Workflows + Skills unified) |
| `text-body` | 14px / 1.5 | Default body (matches `body {}` rule) |
| `text-caption` | 12px / 1.45 | Metadata, level badge, duration |
| `text-micro` | 11px / 1.4 | Eyebrow uppercase, command chip label |

Mono variant: thêm `font-mono` (Geist Mono). Letter-spacing đã pair sẵn.

### Spacing

Reuse Tailwind 4pt defaults: `gap-1=4px`, `gap-2=8px`, `gap-3=12px`, `gap-4=16px`, `gap-6=24px`, `gap-8=32px`. **Không** custom `--space-*` tokens.

### Colors (Cinnabar Minimal)

- Accent `#c96442` light / `#e08363` dark — **reserved** cho: active filter, selected card, primary CTA, link, focus ring. Không dùng cho body text/surface fills.
- Surface ladder: `bg-background` → `bg-surface` → `bg-surface-elevated` → `bg-surface-hover`.
- Foreground: `text-foreground` / `text-foreground-muted` / `text-foreground-subtle`.
- Borders: `border-border` (default) / `border-border-strong` (hover).

### Radius

`rounded-[var(--radius-sm)]` (6px) / `radius-md` (8px) / `radius-lg` (10px). Cards = lg, inputs/badges = md/sm.

## Primitives

| Primitive | File | Purpose |
|---|---|---|
| `Card` | `src/components/ui/card.tsx` | Polymorphic surface (`as` = `div | button | a`), `interactive`, `selected` |
| `Button` | `src/components/ui/button.tsx` | Variants: default / outline / ghost / accent / danger |
| `Badge` | `src/components/ui/badge.tsx` | Variants: default / outline / accent / success / warning / danger |
| `Input` | `src/components/ui/input.tsx` | With `leadingIcon` / `trailingIcon` slot |
| `FilterSelect` | `src/components/ui/filter-select.tsx` | Native `<select>` styled — options accept `{ value, label, count? }` |
| `PageShell` | `src/components/shell/page-shell.tsx` | Max-width container, page padding |
| `PageHeader` | `src/components/shell/page-header.tsx` | Title + eyebrow + description + actions |
| `PageToolbar` | `src/components/shell/page-toolbar.tsx` | Search/filter/count strip |
| `CatalogGrid` | `src/components/shell/catalog-grid.tsx` | Responsive grid, density `cards` or `tight` |
| `EmptyState` | `src/components/shell/empty-state.tsx` | Dashed border placeholder + optional icon/action |
| `SectionLabel` | `src/components/shell/section-label.tsx` | Eyebrow `<h3>` for detail sub-sections |
| `DetailHeader` | `src/components/shell/detail-header.tsx` | Title + eyebrow + meta + actions row |
| `FloatingToc` | `src/components/shell/floating-toc.tsx` | Side TOC ≥ 1700px |

## Templates

### CatalogTemplate — catalog grid + toolbar

```tsx
<CatalogTemplate
  title={uiStrings.skills.title[locale]}
  description="…"
  search={<Input … />}
  filter={<FilterSelect options={…} value={group} onValueChange={…} />}
  count={`${filtered.length} skills`}
  isEmpty={filtered.length === 0}
  emptyMessage={uiStrings.skills.empty[locale]}
  gridDensity="tight" // "cards" (3-col) or "tight" (4-col)
>
  {filtered.map((s) => <SkillCard key={s.id} … />)}
</CatalogTemplate>
```

Use when: trang catalog có toolbar + grid + empty state. Examples: `workflows-page-content.tsx`, `skills-catalog-content.tsx`.

### DetailInlineTemplate — inline expansion

```tsx
<DetailInlineTemplate
  header={<DetailHeader title={w.title[locale]} meta={…} />}
  leftContent={<>… phases, tips …</>}
  rightContent={<WorkflowFlowCanvas … />}
  closeButton={<CloseBtn />}
/>
```

Use when: detail expand inline above grid (2-col, no route change). Example: `workflow-detail.tsx`.

### DetailPageTemplate — full route detail

```tsx
<DetailPageTemplate metaStrip={<SkillHeader skill={skill} />} withToc>
  {mdxContent}
</DetailPageTemplate>
```

Use when: detail có route riêng + prose article. Example: `skill-detail-page.tsx`. Bake prose theme đồng nhất với Docs.

### DocsTemplate — landing/article docs

```tsx
<DocsTemplate banner={<TranslationBanner />} withToc>
  {mdxContent}
</DocsTemplate>
```

Use when: docs page với MDX article. Example: `app/[locale]/docs/[...slug]/page.tsx`.

## Recipe: thêm catalog page mới

1. Tạo data source ở `src/data/<entity>.ts` (export array + types).
2. Tạo card component `src/components/<entity>/<entity>-card.tsx` — wrap `Card` primitive (`interactive`, optional `selected`).
3. Tạo `*-catalog-content.tsx` (`"use client"`):
   - Đọc filter state từ `useSearchParams` (?q=, ?category=, …) — **không** dùng `useState` cho filter (lose share-able URL).
   - Build `buildQuery` helper + `router.replace(basePath + buildQuery(…), { scroll: false })`.
   - Wrap content in `CatalogTemplate` (search/filter/count slots).
4. Page entry `src/app/[locale]/<entity>/page.tsx`:
   ```tsx
   export default async function Page() {
     return (
       <Suspense fallback={null}>
         <EntityCatalogContent … />
       </Suspense>
     );
   }
   ```
   Suspense bắt buộc vì `useSearchParams` cần boundary để SSG.
5. (Optional) Thêm sidebar nav entry ở `src/components/shell/sidebar-<entity>-nav.tsx`.

## Recipe: thêm detail page mới

1. Compose `DetailPageTemplate` với `metaStrip={<EntityHeader … />}` và children = MDX hoặc JSX article.
2. `EntityHeader` wrap `DetailHeader` (omit `title` nếu MDX đã own H1).
3. Route entry `app/[locale]/<entity>/[id]/page.tsx` async load content + pass via prop.

## Anti-patterns

- KHÔNG tự lắp `<PageShell><PageHeader>…</PageShell>` ở feature components — luôn qua template.
- KHÔNG hardcode `prose-zinc dark:prose-invert prose-headings:…` mỗi page — template đã bake.
- KHÔNG dùng raw `<select>` cho filter — luôn `FilterSelect`.
- KHÔNG copy-paste local `EmptyState` / `SectionLabel` / `CloseButton` — import từ `src/components/shell/`.
- KHÔNG ad-hoc `text-[13px]` / `text-2xl sm:text-3xl` — dùng token (`text-h1`, `text-h3`, `text-caption`, …).
- KHÔNG `useState` cho filter trong catalog page — dùng URL query để shareable + restorable on reload.
- KHÔNG tự thêm `--space-*` tokens — reuse Tailwind 4pt defaults.

## Reference

- Tokens canonical: `src/app/globals.css`
- Templates: `src/components/shell/{catalog,detail-inline,detail-page,docs}-template.tsx`
- Live examples: `src/components/workflows/workflows-page-content.tsx`, `src/components/skills/skills-catalog-content.tsx`, `src/app/[locale]/docs/[...slug]/page.tsx`
