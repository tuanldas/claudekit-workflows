---
phase: 3
title: "Docs layout refactor"
status: pending
priority: P1
effort: "1d"
dependencies: [1]
---

# Phase 3: Docs layout refactor

## Overview

Refactor `src/app/[locale]/docs/layout.tsx` từ 3-col grid (sidebar + main + TOC) sang lean wrapper (chỉ main + floating TOC right). Docs tree nav move vào shell sidebar (`SidebarDocsTree` fill từ stub). Existing components giữ nguyên: `DocsSidebar`, `DocsSidebarItem`, `DocsToc`, `CodeBlock`, `TranslationBanner`, `DocsSearch`, `MobileNav`, `MobileDrawer`.

**Critical**: TDD-first — viết regression tests cho existing docs render BEFORE refactor. Tránh break các test đã pass trong plan cũ.

## Requirements

**Functional:**
- Existing docs pages render đúng (no visual regression on content + TOC scroll-spy)
- `SidebarDocsTree` render full docs tree (reuse existing `DocsSidebar` component)
- `FloatingToc` right-side, sticky top-14 (dưới topbar), hide < `2xl` breakpoint
- `DocsLayout` không còn 3-col grid — chỉ wrap children với floating TOC overlay
- Translation banner vẫn render khi fallback
- MDX rendering pipeline không đổi (mdx-compile.ts unchanged)

**Non-functional:**
- Floating TOC `position: fixed` (right edge) hoặc grid với `lg:col-span-9 2xl:col-span-7 + col-span-2`
- TOC IntersectionObserver vẫn track active heading
- No re-render docs tree khi navigate giữa docs pages (shell sidebar persistent)

## Architecture

```
Before (current):
[locale]/docs/layout.tsx
  └── grid grid-cols-12
      ├── aside col-span-3 (DocsSidebar)     ← REMOVE (move to shell)
      ├── main col-span-7 (children)         ← KEEP (simplified)
      └── aside col-span-2 (DocsToc)         ← REPLACE with FloatingToc

After:
[locale]/docs/layout.tsx
  └── div className="mx-auto max-w-3xl px-6 py-8 2xl:mx-0 2xl:max-w-none 2xl:pr-72"
      ├── children
      └── FloatingToc (2xl:fixed right-8 top-20, hide below)

SidebarDocsTree (shell sidebar)
  └── reuse <DocsSidebar tree={tree} locale={locale} />
      └── ScrollMemoryWrapper (Phase 9 wire)
```

Build docs tree at shell level (server) → pass via props to client `SidebarDocsTree`. Use `unstable_cache` already established.

## Related Code Files

**Create:**
- `src/components/shell/floating-toc.tsx` (wrap existing `DocsToc` + position fixed)
- Test: `floating-toc.test.tsx`, `sidebar-docs-tree.test.tsx`

**Modify:**
- `src/app/[locale]/docs/layout.tsx` — strip 3-col grid; chỉ giữ DocsSearch (mobile?) + children + FloatingToc
- `src/components/shell/sidebar-docs-tree.tsx` — fill từ stub: server-fetch tree, render `DocsSidebar`
- `src/app/[locale]/layout.tsx` — pass tree builder hook để sidebar shell có docs tree (or move tree fetch vào sidebar-docs-tree server component)
- `src/components/docs/docs-toc.tsx` — extract positioning logic ra wrapper

**Delete:**
- Inline DocsSearch + sidebar block trong `docs/layout.tsx` (moved to shell)

**Keep unchanged:**
- `src/components/docs/docs-sidebar.tsx` (reused inside `SidebarDocsTree`)
- `src/components/docs/docs-sidebar-item.tsx`
- `src/components/docs/code-block.tsx`
- `src/components/docs/translation-banner.tsx`
- `src/components/docs/mdx-components.tsx`
- `src/lib/mdx-compile.ts`, `mdx-loader.ts`, `docs-tree.ts`

## Implementation Steps (TDD)

### Step 1 — Red: Regression tests trước refactor

```tsx
// src/app/[locale]/docs/[...slug]/page.regression.test.tsx (NEW)
// Test rằng docs page vẫn render content sau refactor
import { render, screen } from '@testing-library/react';
import DocsPage from './page';

it('renders docs page content with heading anchors', async () => {
  const page = await DocsPage({ params: Promise.resolve({ locale: 'vi', slug: ['engineer', '01-core-workflow'] }) });
  render(page as React.ReactElement);
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
});

it('renders translation banner when fallback', async () => {
  // ... existing test logic
});
```

```tsx
// src/components/shell/sidebar-docs-tree.test.tsx
it('renders all docs sections', async () => {
  const tree = await buildDocsTree('vi');
  render(<SidebarDocsTree tree={tree} locale="vi" />);
  expect(screen.getByText(/engineer/i)).toBeInTheDocument();
  expect(screen.getByText(/marketing/i)).toBeInTheDocument();
});

it('highlights current docs page', () => {
  vi.mocked(usePathname).mockReturnValue('/vi/docs/engineer/01-core-workflow');
  render(<SidebarDocsTree tree={fixtureTree} locale="vi" />);
  expect(screen.getByText('Core Workflow').closest('a')).toHaveAttribute('aria-current', 'page');
});
```

```tsx
// src/components/shell/floating-toc.test.tsx
it('renders TOC items from headings', async () => {
  document.body.innerHTML = `<article id="docs-content"><h2 id="intro">Intro</h2></article>`;
  render(<FloatingToc />);
  expect(await screen.findByText('Intro')).toBeInTheDocument();
});

it('hides on viewport < 2xl', () => {
  render(<FloatingToc />);
  expect(screen.getByRole('navigation', { name: /on this page/i })).toHaveClass('hidden', '2xl:block');
});
```

### Step 2 — Green: Refactor

```tsx
// src/app/[locale]/docs/layout.tsx (rewrite)
import { FloatingToc } from '@/components/shell/floating-toc';

export default async function DocsLayout({ children, params }: Props) {
  return (
    <div className="relative mx-auto max-w-3xl px-6 py-8 2xl:max-w-none 2xl:pr-72">
      {children}
      <FloatingToc />
    </div>
  );
}
```

```tsx
// src/components/shell/floating-toc.tsx
'use client';
import { DocsToc } from '@/components/docs/docs-toc';

export function FloatingToc() {
  return (
    <aside
      role="navigation"
      aria-label="On this page"
      className="hidden 2xl:block 2xl:fixed 2xl:right-8 2xl:top-20 2xl:w-56 2xl:max-h-[calc(100vh-6rem)] 2xl:overflow-y-auto"
    >
      <DocsToc />
    </aside>
  );
}
```

```tsx
// src/components/shell/sidebar-docs-tree.tsx (fill from stub)
import { unstable_cache } from 'next/cache';
import { buildDocsTree } from '@/lib/docs-tree';
import { DocsSidebar } from '@/components/docs/docs-sidebar';

const getCachedDocsTree = unstable_cache(
  async (locale: Locale) => buildDocsTree(locale),
  ['docs-tree'],
  { tags: ['docs-tree'], revalidate: false },
);

export async function SidebarDocsTree({ locale }: { locale: Locale }) {
  const tree = await getCachedDocsTree(locale);
  return <DocsSidebar tree={tree} locale={locale} />;
}
```

**Important:** `SidebarDocsTree` là server component (async). Cần adjust `Sidebar` để handle async children (RSC OK trong `layout.tsx`, but `Sidebar` là client component using `usePathname`). Solution: render docs tree ở `layout.tsx` server level, pass as prop:

```tsx
// src/app/[locale]/layout.tsx
const docsTree = locale === 'vi' || locale === 'en' ? await getCachedDocsTree(locale) : null;
return (
  <LanguageProvider locale={locale}>
    <ThemeProvider>
      <AdminShell docsTree={docsTree}>{children}</AdminShell>
    </ThemeProvider>
  </LanguageProvider>
);
```

Pass `docsTree` qua AdminShell → Sidebar → SidebarDocsTree (client, render only when on /docs).

### Step 3 — Refactor

- Move `DocsSearch` từ docs sidebar vào shell topbar (or trigger Cmd+K — defer to Phase 7)
- Mobile drawer cũ (`MobileNav` + `MobileDrawer` trong `src/components/docs/`) — keep working trong docs context, deprecate in Phase 8
- Verify no duplicate `unstable_cache` instances (single cache key)
- Type-check + lint

## Success Criteria

- [ ] `/vi/docs/engineer/01-core-workflow` renders correctly (content + TOC active on scroll)
- [ ] Shell sidebar shows full docs tree với highlighting đúng page
- [ ] Floating TOC visible trên `2xl` (≥1536px), hidden < 2xl
- [ ] Existing docs tests still pass (regression)
- [ ] Translation banner renders trên fallback page
- [ ] Code blocks render với Shiki (no regression)
- [ ] All new tests pass
- [ ] No memory leak: docs tree cached, not refetched per nav
- [ ] Lighthouse Performance ≥ 90 trên docs page

## Risk Assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| `usePathname()` in client `Sidebar` while `SidebarDocsTree` server-async | High | Pass docsTree as prop từ server layout; client Sidebar chỉ render conditionally based on pathname |
| Floating TOC overlap content trên < 2xl | Low | `hidden 2xl:block` explicit hide |
| `<DocsToc>` selector mismatch | Low | Verified: `MDX_CONTENT_SELECTOR = "article[data-docs-content]"` in `src/components/docs/constants.ts`. FloatingToc + DocsToc both reuse this constant. <!-- Updated: Validation Session 1 - selector verified --> |
| `unstable_cache` duplicate keys conflict với phase 1 | Low | Use single cache instance trong shared `src/lib/cached-docs-tree.ts` |
| Mobile docs nav (`MobileNav` existing) conflicts với shell mobile drawer (Phase 8) | High | Phase 3 keep both; Phase 8 deprecate `docs/mobile-nav.tsx` |
| TDD test cho docs page server component khó (RSC await) | Medium | Use integration test pattern; or mock at lib level |

## Next phase

Phase 4: theme system (light/dark/system) với CSS vars, no FOUC.
