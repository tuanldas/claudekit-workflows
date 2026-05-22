# Phase 05 — Refactor Docs Page to Use DocsTemplate

## Context Links

- `src/app/[locale]/docs/layout.tsx` (15 lines — wraps article)
- `src/app/[locale]/docs/[...slug]/page.tsx` (80 lines — MDX slug page)
- `src/app/[locale]/docs/page.tsx` (47 lines — docs landing page)
- `src/components/docs/translation-banner.tsx`
- `src/components/docs/mdx-components.tsx`
- `src/components/shell/floating-toc.tsx`
- Phase 02 deliverable: `DocsTemplate`
- Inconsistency to fix: Skills detail uses `prose-zinc dark:prose-invert`; Docs uses `prose-slate` (no dark) — phase-02 standardized on `prose-zinc dark:prose-invert`

## Overview

- **Priority:** P2 (independent of phase 3/4, but lighter)
- **Status:** pending
- **Duration estimate:** 1h
- **Brief:** Switch Docs layout + slug + landing pages to use `DocsTemplate`. Fix prose styling to match Skills detail. Preserve cache + revalidate + generateMetadata behavior.

## Key Insights

1. `layout.tsx` is thin (15 lines, just `<PageShell withToc>{children}<FloatingToc/>`). Layout still useful for shared shell BUT `DocsTemplate` includes both — layout may shrink to identity passthrough OR remove if children render their own `DocsTemplate`.
2. `page.tsx` (slug) and landing `page.tsx` both render `<article className="prose prose-slate max-w-none">` directly inside layout. **The article wrapper should move INTO `DocsTemplate`** — pages just pass MDX content.
3. `prose-slate` (Docs) vs `prose-zinc` (Skills) — divergent palettes. **Standardize on `prose-zinc dark:prose-invert`** with same custom overrides as `skill-detail-page.tsx:20`.
4. `TranslationBanner` only renders when fallback. `DocsTemplate` accepts `banner?: ReactNode` slot.
5. Cache + `unstable_cache` + `generateMetadata` are page-level concerns — leave untouched.
6. Layout currently passes `withToc` to PageShell — `DocsTemplate` inherits + handles internally.

## Requirements

### Functional
- Docs landing page (`/vi/docs`, `/en/docs`) renders MDX via `DocsTemplate`.
- Docs slug page (`/vi/docs/[...slug]`) renders MDX via `DocsTemplate`.
- TranslationBanner appears above article when fallback active.
- FloatingToc renders on right edge of viewport when content has headings.
- Prose styling matches Skills detail (zinc + dark:invert + accent links).
- All existing tests green.

### Non-functional
- `layout.tsx` either ≤ 15 lines (current) or removed entirely (if pages own `DocsTemplate`).
- `page.tsx` (slug) ≤ 70 lines (currently 80).
- `page.tsx` (landing) ≤ 40 lines (currently 47).
- E2E `accessibility.spec.ts` clean (axe-core passes on docs pages).

## Architecture

### Before
```
app/[locale]/docs/layout.tsx (15 lines)
  └─ PageShell(withToc)
       ├─ {children}      ← page.tsx renders <article.prose>
       └─ FloatingToc

app/[locale]/docs/[...slug]/page.tsx (80 lines)
  └─ <>
       ├─ {fallback && <TranslationBanner/>}
       └─ <article className="prose prose-slate max-w-none">
            <MDXContent/>
          </article>

app/[locale]/docs/page.tsx (47 lines)
  └─ <>
       ├─ {fallback && <TranslationBanner/>}
       └─ <article className="prose prose-slate max-w-none">
            <MDXContent/>
          </article>
```

### After
```
app/[locale]/docs/layout.tsx (REMOVE or keep ≤ 8 lines as no-op passthrough)
  // If kept: just <>{children}</> — DocsTemplate owns shell.

app/[locale]/docs/[...slug]/page.tsx (~65 lines)
  └─ DocsTemplate
       banner={ fallback && <TranslationBanner/> }
       article={ <MDXContent components={docsMDXComponents}/> }
       withToc

app/[locale]/docs/page.tsx (~35 lines)
  └─ DocsTemplate
       banner={ fallback && <TranslationBanner/> }
       article={ <MDXContent components={docsMDXComponents}/> }
       withToc
```

### Article styling unification

`DocsTemplate` internal article element:
```tsx
<article
  data-docs-content
  data-fallback={fallback ? "true" : "false"}  // forwarded via prop
  className="prose prose-zinc max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground-muted prose-strong:text-foreground prose-li:text-foreground-muted prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
>
  {article}
</article>
```

Same overrides Skills uses. Single source of truth.

## Related Code Files

### Modify
- `src/app/[locale]/docs/layout.tsx` — likely reduce to pass-through or delete.
- `src/app/[locale]/docs/[...slug]/page.tsx` — wrap in `DocsTemplate`.
- `src/app/[locale]/docs/page.tsx` — wrap in `DocsTemplate`.

### Maybe modify
- `src/components/shell/docs-template.tsx` (created in phase-02) — accept `data-fallback?: boolean` prop to preserve existing data attribute used by tests/styling.

### Create
- (none)

### Delete
- Inline `<article>` wrappers in both pages.

## Implementation Steps

1. **Read `docs-template.tsx` from phase-02**. Verify it accepts: `banner?: ReactNode`, `article: ReactNode`, `withToc?: boolean`. If missing `data-fallback` support, add it (phase-05 addendum to phase-02).
2. **Decide layout.tsx fate.** Options:
   - (a) Delete layout.tsx. Pages own DocsTemplate.
   - (b) Keep as pass-through (`<>{children}</>`).
   - (c) Move DocsTemplate INTO layout — pages pass MDX as children. **Cons:** banner+toc slot needs to live in page (data fetch result drives banner). Layout can't access page data.
   - **Recommend (a) delete.** Layout adds no value once template owns shell.
3. **Refactor `app/[locale]/docs/[...slug]/page.tsx`** — wrap return in `<DocsTemplate>`. Pass `result.fallback ? <TranslationBanner.../> : null` as `banner`. Pass `<MDXContent/>` as `article`. Forward `data-fallback` if template accepts.
4. **Refactor `app/[locale]/docs/page.tsx` (landing)** — same pattern.
5. **Delete `app/[locale]/docs/layout.tsx`** (or stub it).
6. **Update `mdx-components.tsx`** — no change needed; already uses semantic tokens.
7. **Run `npm run lint + test:run`** → green.
8. **Run `npm run build`** → green (Next.js will warn if layout deletion breaks something).
9. **Run `npm run test:e2e -- accessibility.spec.ts`** → green.
10. **Visual check** — `/vi/docs`, `/vi/docs/[some-slug]`, `/en/docs`, light/dark. Confirm: article width, prose styling, FloatingToc position, TranslationBanner visibility (use `/en/docs/[vi-only-slug]` to trigger fallback).
11. **Capture screenshots** to `visuals/phase-05/`.
12. **Commit:** `refactor(docs): use unified docs template + prose-zinc parity`.

## Todo List

- [ ] Verify DocsTemplate API (banner, article, withToc, optional data-fallback)
- [ ] Decide layout.tsx delete vs keep — recommend delete
- [ ] Refactor slug page.tsx
- [ ] Refactor landing page.tsx
- [ ] Delete layout.tsx if approach (a)
- [ ] Run lint + test:run → green
- [ ] Run build → green
- [ ] Run e2e accessibility.spec.ts → green
- [ ] Visual check VI/EN × light/dark + fallback banner trigger
- [ ] Capture screenshots
- [ ] Commit

## Success Criteria

- 2 files modified, 1 file deleted (layout).
- `[...slug]/page.tsx` ≤ 70 lines.
- `page.tsx` (landing) ≤ 40 lines.
- `npm run test:run` green.
- `npm run test:e2e -- accessibility.spec.ts` green.
- `npm run build` green.
- Visual: prose styling identical between Skills detail + Docs (zinc + dark invert + accent links).
- TranslationBanner still renders on fallback case.

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Deleting `layout.tsx` breaks Next App Router default behavior | Low | Medium | Verify in step 8 (`npm run build`). Next allows missing layout for nested routes — root layout still active. If issue, fallback to pass-through layout (option b). |
| `data-docs-content` / `data-fallback` attributes used by tests or external CSS | Medium | Medium | Grep for these attributes before removing. If used, ensure DocsTemplate forwards them. Phase-02 addendum adds `data-fallback` support. |
| Prose styling change visually shifts existing docs | Medium | Low | Side-by-side screenshot comparison phase-01 baseline → phase-05. If shift, accept (intentional unification) but document. |
| FloatingToc position change due to template restructure | Low | Medium | DocsTemplate must place FloatingToc with same `withToc` semantics as before. Verify in step 10. |
| `unstable_cache` revalidation broken by component restructure | Very Low | Low | Cache is at data-fetch layer (page.tsx loadMdxCached). Component swap doesn't affect. |
| Skills detail also uses prose — already standardized to zinc, no change needed there | Resolved | n/a | Verified at skill-detail-page.tsx:20. Consistent. |

## Security Considerations

None — refactor only.

## Next Steps

- Phase 06 documents prose styling rule + DocsTemplate usage in `design-system.md`.
- Phase 07 visual QA verifies docs/skills/workflows parity.
