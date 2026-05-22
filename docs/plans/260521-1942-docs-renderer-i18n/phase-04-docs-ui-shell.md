---
phase: 4
title: "Docs UI shell + mobile-first"
status: pending
priority: P2
effort: "5-7h"
dependencies: [3]
---

# Phase 4: Docs UI shell + mobile-first

## Overview

Build docs page layout responsive mobile-first: sidebar (drawer trên mobile, sticky trên desktop) + content + TOC (hidden mobile, sticky desktop). Sidebar auto-render từ `buildDocsTree`. TOC auto-generate từ headings. Custom MDX components: code-block với copy button, table styling. Translation banner cho fallback EN→VI.

**Mobile scope (validate decision)**: Full mobile-first redesign — hamburger drawer cho sidebar, optimized typography, swipe gestures cho nav.

## Requirements

**Functional:**
- Sidebar render từ docs tree, current page highlighted
- Sidebar mobile: hamburger button → drawer overlay (animation slide-in từ trái)
- Sidebar desktop (≥1024px): sticky 3-column layout
- Sidebar tablet (768-1023px): collapsed sidebar, content + TOC
- TOC auto-generated từ H2/H3 headings, sticky desktop, hidden mobile
- Code block render với shiki + "Copy" button click copy clipboard
- Anchor links cho headings (icon click copy URL)
- Translation banner show khi `result.fallback === true`
- Typography mobile: font-size scaled, line-height tăng cho readability
- Touch targets ≥44px (Apple HIG)

**Non-functional:**
- Sidebar render <100ms (server-rendered RSC)
- TOC build client-side từ DOM (after hydration)
- Code copy không cần re-render full page
- Mobile FCP <2s on slow 3G simulation
- Drawer animation 60fps

## Architecture

Responsive breakpoints (Tailwind defaults + custom for tablet):
- Mobile: <768px (drawer sidebar, no TOC)
- Tablet: 768-1023px (drawer sidebar, content + TOC inline)
- Desktop: ≥1024px (3-column sticky)

```
/[locale]/docs/layout.tsx (responsive)
├── <MobileNav locale={locale}>          # Mobile: hamburger button + drawer
│   └── <DocsSidebar />                  # Same component, different layout context
├── <DesktopLayout>                      # ≥1024px
│   ├── <DocsSidebar /> (sticky col-3)
│   ├── <main>
│   │   ├── <TranslationBanner /> if fallback
│   │   └── <article>
│   ├── <DocsToc /> (sticky col-2)
│   </DesktopLayout>
└── (state via useState mở drawer)

components/docs/
├── docs-sidebar.tsx           # Server component, renders tree
├── docs-sidebar-item.tsx      # Client component (active link highlight)
├── docs-mobile-drawer.tsx     # Client component (drawer state, animation)
├── docs-mobile-nav.tsx        # Client component (hamburger + breadcrumb)
├── docs-toc.tsx               # Client component, scroll observer
├── code-block.tsx             # Client wrapper around <pre><code> với copy button
├── translation-banner.tsx     # Server component
├── mdx-components.tsx         # Re-exports custom components
├── constants.ts               # Shared MDX_CONTENT_SELECTOR
└── docs-search.tsx            # Stub (Phase 5 fill)
```

## Related Code Files

**Create:**
- `src/app/[locale]/docs/layout.tsx` — 3-column shell
- `src/components/docs/docs-sidebar.tsx` (server)
- `src/components/docs/docs-sidebar-item.tsx` (client)
- `src/components/docs/docs-toc.tsx` (client)
- `src/components/docs/code-block.tsx` (client)
- `src/components/docs/translation-banner.tsx` (server)
- `src/components/docs/mdx-components.tsx` — custom MDX overrides
- Test files cho từng component (co-located `*.test.tsx`)

**Modify:**
- `mdx-components.tsx` (root) — import customs từ `src/components/docs/mdx-components`
- `src/app/[locale]/docs/[...slug]/page.tsx` — wire translation banner

## Implementation Steps

### Step 1: Tests-First

```tsx
// docs-sidebar.test.tsx
import { render, screen } from '@testing-library/react';
import { DocsSidebar } from './docs-sidebar';

const fixtureTree = {
  sections: [
    { slug: 'engineer', title: { vi: 'Engineer Kit', en: 'Engineer Kit' }, order: 1,
      items: [{ slug: 'engineer/01-core', navTitle: 'Core', order: 1, hidden: false }] },
  ],
};

it('renders section title', () => {
  render(<DocsSidebar tree={fixtureTree} currentSlug="engineer/01-core" locale="vi" />);
  expect(screen.getByText('Engineer Kit')).toBeInTheDocument();
});

it('highlights current page', () => {
  render(<DocsSidebar tree={fixtureTree} currentSlug="engineer/01-core" locale="vi" />);
  expect(screen.getByText('Core').closest('a')).toHaveAttribute('aria-current', 'page');
});

it('does not render hidden items', () => { /* ... */ });
```

```tsx
// docs-toc.test.tsx
it('builds TOC from headings', async () => {
  document.body.innerHTML = `<article><h2 id="a">A</h2><h3 id="b">B</h3></article>`;
  render(<DocsToc selector="article" />);
  expect(await screen.findByText('A')).toBeInTheDocument();
});
```

```tsx
// code-block.test.tsx
it('copies code to clipboard on button click', async () => {
  const user = userEvent.setup();
  Object.assign(navigator, { clipboard: { writeText: vi.fn() } });
  render(<CodeBlock code="hello" lang="ts" />);
  await user.click(screen.getByRole('button', { name: /copy/i }));
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello');
});
```

```tsx
// translation-banner.test.tsx
it('renders fallback notice in VI', () => {
  render(<TranslationBanner originalLocale="en" resolvedLocale="vi" />);
  expect(screen.getByText(/Bản dịch sắp có/i)).toBeInTheDocument();
});
```

### Step 2: Implement `docs/layout.tsx`

```tsx
import { buildDocsTree } from '@/lib/docs-tree';
import { DocsSidebar } from '@/components/docs/docs-sidebar';
import { DocsToc } from '@/components/docs/docs-toc';

export default async function DocsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: 'vi' | 'en' }>;
}) {
  const { locale } = await params;
  const tree = await buildDocsTree(locale);

  return (
    <div className="mx-auto max-w-7xl px-6 grid grid-cols-12 gap-6">
      <aside className="col-span-3 sticky top-16 self-start h-[calc(100vh-4rem)] overflow-y-auto">
        <DocsSidebar tree={tree} locale={locale} />
      </aside>
      <main className="col-span-7 py-8">{children}</main>
      <aside className="col-span-2 sticky top-16 self-start">
        <DocsToc />
      </aside>
    </div>
  );
}
```

### Step 3: Implement `DocsSidebar` (server) + `DocsSidebarItem` (client)

```tsx
// docs-sidebar.tsx
import { DocsSidebarItem } from './docs-sidebar-item';
import type { DocsTree, Locale } from '@/types/docs';

export function DocsSidebar({ tree, locale }: { tree: DocsTree; locale: Locale }) {
  return (
    <nav className="text-sm">
      {tree.sections.map(section => (
        <section key={section.slug} className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">{section.title[locale]}</h3>
          <ul>
            {section.items.map(item => (
              <DocsSidebarItem key={item.slug} slug={item.slug} navTitle={item.navTitle} locale={locale} />
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
```

```tsx
// docs-sidebar-item.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function DocsSidebarItem({ slug, navTitle, locale }: { slug: string; navTitle: string; locale: 'vi' | 'en' }) {
  const pathname = usePathname();
  const href = `/${locale}/docs/${slug}`;
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        aria-current={isActive ? 'page' : undefined}
        className={`block py-1 px-2 rounded ${isActive ? 'bg-orange-50 text-orange-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
      >
        {navTitle}
      </Link>
    </li>
  );
}
```

### Step 4: Implement `DocsToc` (client)

**HIGH 3 fix**: import shared selector constant from Phase 3 (`MDX_CONTENT_SELECTOR`). Tests mock IntersectionObserver (already done in `vitest.setup.ts` Phase 1).

```tsx
'use client';
import { useEffect, useState } from 'react';
import { MDX_CONTENT_SELECTOR } from './constants';

interface TocItem { id: string; text: string; level: number; }

export function DocsToc({ selector = MDX_CONTENT_SELECTOR }: { selector?: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const article = document.querySelector(selector);
    if (!article) return;
    const headings = Array.from(article.querySelectorAll('h2, h3'));
    setItems(headings.map(h => ({
      id: h.id,
      text: h.textContent || '',
      level: Number(h.tagName[1]),
    })));

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); });
    }, { rootMargin: '-20% 0px -75% 0px' });

    headings.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, [selector]);

  if (items.length === 0) return null;

  return (
    <nav className="text-sm sticky top-16">
      <p className="font-semibold mb-2">Trên trang</p>
      <ul className="space-y-1">
        {items.map(item => (
          <li key={item.id} className={item.level === 3 ? 'ml-3' : ''}>
            <a
              href={`#${item.id}`}
              className={`block py-0.5 ${activeId === item.id ? 'text-orange-600 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

### Step 5: Implement `CodeBlock` với copy button

```tsx
// code-block.tsx
'use client';
import { useState } from 'react';

export function CodeBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const code = extractTextFromChildren(children);
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative group">
      <pre {...props}>{children}</pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy code"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 px-2 py-1 text-xs bg-gray-800 text-white rounded transition"
      >
        {copied ? 'Đã copy' : 'Copy'}
      </button>
    </div>
  );
}

function extractTextFromChildren(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractTextFromChildren).join('');
  if (typeof node === 'object' && node !== null && 'props' in node) {
    return extractTextFromChildren((node as React.ReactElement<{ children?: React.ReactNode }>).props.children);
  }
  return '';
}
```

### Step 6: Implement `TranslationBanner`

**LOW 2 fix**: i18n strings vào `uiStrings`, không hardcode.

Add to `src/i18n/translations.ts`:
```ts
export const uiStrings = {
  // ...existing
  translationBanner: {
    fromEn: {
      vi: 'Đang hiển thị bản tiếng Việt vì bản dịch tiếng Anh chưa có.',
      en: 'Showing Vietnamese version — English translation coming soon.',
    },
    fromVi: {
      vi: 'Đang hiển thị bản tiếng Anh vì bản tiếng Việt chưa có.',
      en: 'Showing English version — Vietnamese translation coming soon.',
    },
  },
};
```

```tsx
import { uiStrings } from '@/i18n/translations';
import type { Locale } from '@/types/workflow';

export function TranslationBanner({
  originalLocale,
  resolvedLocale,
}: {
  originalLocale: Locale;
  resolvedLocale: Locale;
}) {
  if (originalLocale === resolvedLocale) return null;
  const key = resolvedLocale === 'vi' ? 'fromEn' : 'fromVi';
  const message = uiStrings.translationBanner[key][originalLocale];
  return (
    <div
      role="status"
      className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-400 text-amber-800 text-sm"
    >
      {message}
    </div>
  );
}
```

### Step 7: Wire `TranslationBanner` vào `[...slug]/page.tsx`

```tsx
// in DocsPage
{result.fallback && (
  <TranslationBanner originalLocale={result.originalLocale} resolvedLocale={result.resolvedLocale} />
)}
```

### Step 8: Update root `mdx-components.tsx` để dùng custom CodeBlock

```tsx
import { CodeBlock } from '@/components/docs/code-block';
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    pre: CodeBlock,
    // ...other overrides
    ...components,
  };
}
```

### Step 9: Run tests + smoke test

```bash
npm run test:run    # all component tests pass
npm run dev         # visit /vi/docs, /en/docs/{vi-only-page}
```

## Success Criteria

- [ ] `/vi/docs/engineer/01-core-workflow` hiển thị: sidebar tree, content, TOC right (desktop)
- [ ] Sidebar item current page có `aria-current="page"` + visual highlight
- [ ] TOC list H2/H3 từ content, active heading highlighted khi scroll (desktop)
- [ ] Code block có "Copy" button hover-visible, click copy clipboard
- [ ] Anchor click trên heading copy URL fragment
- [ ] Truy cập `/en/docs/X` (chỉ tồn tại vi) → render content vi + banner + canonical link
- [ ] Mobile <768px: hamburger button visible, click → drawer slide-in
- [ ] Mobile drawer: tap outside → close, swipe-left → close
- [ ] Mobile typography: font-base ≥16px, line-height 1.6+
- [ ] Touch targets all ≥44px
- [ ] Tablet 768-1023px: drawer sidebar, content + inline TOC
- [ ] Desktop ≥1024px: 3-column sticky layout
- [ ] Mobile Lighthouse score ≥85 (perf + accessibility)
- [ ] Vitest component tests all pass (incl. drawer state)
- [ ] No accessibility errors (aria-current, button labels, focus trap drawer)

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| `IntersectionObserver` không support older browsers | Low | All modern browsers OK; ignore IE |
| `<pre>` MDX override conflict với shiki HTML output | Medium | Test với real shiki output; có thể cần wrap CodeBlock chỉ khi có `data-language` |
| Sticky positioning broken khi parent overflow | Medium | Ensure layout parent không `overflow:hidden` |
| Sidebar quá dài → cần scroll | Low | Sidebar `overflow-y-auto`, max-h `calc(100vh - 4rem)` |

## Next phase

Phase 5: Search (flexsearch + cmdk) + production polish.
