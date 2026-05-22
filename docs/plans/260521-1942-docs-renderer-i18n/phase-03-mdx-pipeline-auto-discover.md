---
phase: 3
title: "MDX pipeline + auto-discover"
status: pending
priority: P2
effort: "4-5h"
dependencies: [2]
---

# Phase 3: MDX pipeline + auto-discover (Approach C)

## Overview

**Approach C** (decided): Request-time `evaluate` từ `@mdx-js/mdx` (canonical RSC primitive). `.md` giữ ngoài `src/app/`. Each request → load md (cached) → compile MDX → render trong RSC. Sidebar tree cũng cached qua `unstable_cache`.

Build auto-discover loader đọc folder tree `docs/{locale}/...` → sidebar tree. Symmetric fallback EN↔VI. Dynamic route `/[locale]/docs/[...slug]` render từng page.

## Requirements

**Functional:**
- Truy cập `/vi/docs/engineer/01-core-workflow` render được md file
- Code blocks highlighted với shiki (github-light/dark theme)
- Headings có auto-generated id + anchor links
- GFM tables, strikethrough, tasklists render đúng
- Auto-discover folder tree → sidebar data structure
- Fallback: `/en/docs/X` thiếu file → load `docs/vi/X.md`, mark `fallback: true`
- File mới chỉ cần đặt đúng folder `docs/{locale}/section/NN-name.md`, không cần config

**Non-functional:**
- Build time <10s cho 32 files với syntax highlight
- Per-page bundle nhỏ (RSC, không client JS cho MDX)
- TypeScript types cho frontmatter shape

## Architecture

```
docs/vi/engineer/01-core-workflow.md
        │  │      │
        │  │      └── filename: order prefix "01-" → order=1
        │  └────────── folder name → section "Engineer"
        └───────────── locale segment

Pipeline:
md file → gray-matter strip frontmatter → @mdx-js/mdx evaluate → remark-gfm + rehype-slug + rehype-autolink-headings + @shikijs/rehype → React component (rendered trong RSC, cached qua unstable_cache)
```

Auto-discover algorithm:
1. Glob `docs/{locale}/**/*.md`
2. Parse frontmatter (gray-matter) cho mỗi file
3. Group theo top-level folder = section
4. Sort theo `frontmatter.order` || filename prefix `NN-`
5. Build tree: `{ sections: [{ name, slug, items: [{ slug, title, order, hidden }] }] }`

Frontmatter optional fields:
```yaml
---
title: "Core Workflow"          # override H1
nav_title: "Core"               # short label sidebar
order: 1                        # override filename prefix
hidden: false                   # exclude từ sidebar
---
```

Section title override qua optional `docs/{locale}/{section}/_section.json`:
```json
{ "title": { "vi": "Engineer Kit", "en": "Engineer Kit" }, "order": 1 }
```

## Related Code Files

**Create:**
- `src/lib/docs-tree.ts` — auto-discover + tree builder
- `src/lib/docs-tree.test.ts`
- `src/lib/mdx-loader.ts` — load MDX với symmetric fallback
- `src/lib/mdx-loader.test.ts`
- `src/lib/mdx-compile.ts` — compile MDX source → React component qua `@mdx-js/mdx`
- `src/types/docs.ts` — DocsTree, DocsPage, Frontmatter types
- `src/components/docs/constants.ts` — `MDX_CONTENT_SELECTOR` shared selector
- `src/app/[locale]/docs/[...slug]/page.tsx` — dynamic MDX route
- `src/app/[locale]/docs/page.tsx` — landing (render claudekit-overview)

**Modify:**
- `next.config.ts` (no MDX loader; Approach C runtime compile)
- `src/app/globals.css` (add `@plugin "@tailwindcss/typography"`)
- `package.json` (add `@mdx-js/mdx`, `@mdx-js/react`, `@types/mdx`, remark/rehype plugins, shiki, gray-matter, glob)

## Implementation Steps

### Step 1: Tests-First

```ts
// src/lib/docs-tree.test.ts
import { describe, it, expect } from 'vitest';
import { buildDocsTree } from './docs-tree';

describe('buildDocsTree', () => {
  it('groups by top-level folder = section', async () => {
    const tree = await buildDocsTree('vi', './tests/fixtures/docs');
    expect(tree.sections.map(s => s.slug)).toContain('engineer');
  });

  it('orders by filename prefix NN-', async () => {
    const tree = await buildDocsTree('vi', './tests/fixtures/docs');
    const engineer = tree.sections.find(s => s.slug === 'engineer');
    expect(engineer?.items.map(i => i.order)).toEqual([1, 2, 3]);
  });

  it('frontmatter order overrides filename prefix', async () => { /* ... */ });
  it('hidden:true excludes from tree', async () => { /* ... */ });
  it('reads _section.json title override', async () => { /* ... */ });
});

// src/lib/mdx-loader.test.ts
describe('loadMdx', () => {
  it('returns content + fallback=false khi file en exists', async () => { /* ... */ });
  it('falls back to vi khi en file missing', async () => {
    const result = await loadMdx('en', 'engineer/some-vi-only');
    expect(result.fallback).toBe(true);
    expect(result.originalLocale).toBe('en');
  });
  it('throws notFound khi cả vi và en thiếu', async () => { /* ... */ });
});
```

Fixture files at `tests/fixtures/docs/vi/engineer/01-test.md`, etc.

### Step 2: Install dependencies

```bash
npm install @mdx-js/mdx @mdx-js/react @types/mdx \
  remark-gfm rehype-slug rehype-autolink-headings \
  @shikijs/rehype shiki \
  gray-matter \
  glob \
  @tailwindcss/typography
```

**Removed**: `@next/mdx` (file-based routing không fit), `next-mdx-remote/rsc` (archived). Dùng `@mdx-js/mdx` `evaluate` trực tiếp — pattern canonical cho RSC docs sites.

### Step 3: Update `next.config.ts`

KHÔNG cần `createMDX` wrapper hay `pageExtensions: ['md']` (LOW 3 fix). MDX compile diễn ra ở runtime trong RSC.

```ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  // No MDX webpack/turbopack loader needed; @mdx-js/mdx evaluate runs per-request
};

export default config;
```

### Step 3a: Update `globals.css` (Tailwind v4 typography)

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

**MEDIUM 1 fix**: `@shikijs/rehype` config `{ themes: {...} }` là serializable JSON (no functions) → Turbopack OK. Risk DROPPED.

### Step 4: Create `mdx-components.tsx` (root)

```tsx
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
    h2: (props) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
    h3: (props) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
    table: (props) => <table className="w-full border-collapse my-4" {...props} />,
    th: (props) => <th className="border px-3 py-2 bg-gray-50 text-left" {...props} />,
    td: (props) => <td className="border px-3 py-2" {...props} />,
    a: (props) => <a className="text-blue-600 underline" {...props} />,
    // Phase 4: code block với copy button, etc.
    ...components,
  };
}
```

### Step 5: Implement `src/lib/docs-tree.ts`

```ts
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { glob } from 'glob';
import type { Locale } from '@/types/workflow';

export interface DocsItem {
  slug: string;          // e.g. "engineer/01-core-workflow"
  navTitle: string;
  order: number;
  hidden: boolean;
}
export interface DocsSection {
  slug: string;          // "engineer"
  title: { vi: string; en: string };
  order: number;
  items: DocsItem[];
}
export interface DocsTree {
  sections: DocsSection[];
}

export async function buildDocsTree(
  locale: Locale,
  rootDir = path.join(process.cwd(), 'docs', locale),
): Promise<DocsTree> {
  const files = await glob('**/*.md', { cwd: rootDir, ignore: ['_*.json', '_*'] });
  const sectionsMap = new Map<string, DocsSection>();

  for (const file of files) {
    const [section, ...rest] = file.split('/');
    const isRoot = rest.length === 0;
    const slug = isRoot ? section.replace(/\.md$/, '') : file.replace(/\.md$/, '');

    const full = path.join(rootDir, file);
    const raw = await fs.readFile(full, 'utf-8');
    const { data: fm } = matter(raw);
    if (fm.hidden) continue;

    // Extract order
    const filenamePrefix = path.basename(file).match(/^(\d+)-/)?.[1];
    const order = fm.order ?? (filenamePrefix ? Number(filenamePrefix) : 999);

    // Extract title
    const navTitle = fm.nav_title || fm.title || titleFromSlug(slug);

    const sectionKey = isRoot ? '_root' : section;
    if (!sectionsMap.has(sectionKey)) {
      const meta = await readSectionMeta(rootDir, sectionKey);
      sectionsMap.set(sectionKey, {
        slug: sectionKey,
        title: meta?.title || { vi: capitalize(sectionKey), en: capitalize(sectionKey) },
        order: meta?.order ?? 999,
        items: [],
      });
    }
    sectionsMap.get(sectionKey)!.items.push({ slug, navTitle, order, hidden: false });
  }

  // Sort sections + items
  const sections = Array.from(sectionsMap.values())
    .map(s => ({ ...s, items: s.items.sort((a, b) => a.order - b.order) }))
    .sort((a, b) => a.order - b.order);

  return { sections };
}

async function readSectionMeta(root: string, section: string) {
  if (section === '_root') return null;
  const metaPath = path.join(root, section, '_section.json');
  try {
    const raw = await fs.readFile(metaPath, 'utf-8');
    return JSON.parse(raw);
  } catch { return null; }
}

function titleFromSlug(slug: string): string {
  return slug.split('/').pop()!
    .replace(/^\d+-/, '')
    .split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

function capitalize(s: string) { return s[0].toUpperCase() + s.slice(1); }
```

### Step 6: Implement `src/lib/mdx-loader.ts`

**HIGH 5 fix**: symmetric fallback (cả `vi` thiếu file cũng fall sang `en`).

```ts
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import type { Locale } from '@/types/workflow';

export interface LoadedMdx {
  source: string;          // MDX source (frontmatter stripped)
  frontmatter: Record<string, unknown>;
  fallback: boolean;
  originalLocale: Locale;
  resolvedLocale: Locale;
}

const ALL_LOCALES: Locale[] = ['vi', 'en'];

export async function loadMdx(locale: Locale, slug: string): Promise<LoadedMdx | null> {
  // Try requested locale first, then fall back to OTHER locale(s)
  const candidates = [locale, ...ALL_LOCALES.filter(l => l !== locale)];

  for (const candidate of candidates) {
    const filePath = path.join(process.cwd(), 'docs', candidate, `${slug}.md`);
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      const { content, data } = matter(raw);
      return {
        source: content,
        frontmatter: data,
        fallback: candidate !== locale,
        originalLocale: locale,
        resolvedLocale: candidate,
      };
    } catch { continue; }
  }
  return null;
}

export async function listAllSlugs(locale: Locale): Promise<string[]> {
  const { glob } = await import('glob');
  const root = path.join(process.cwd(), 'docs', locale);
  try {
    const files = await glob('**/*.md', { cwd: root, ignore: ['_*'] });
    return files.map(f => f.replace(/\.md$/, ''));
  } catch {
    return []; // docs/en/ might be empty
  }
}
```

### Step 7: Dynamic route `/[locale]/docs/[...slug]/page.tsx`

**Approach C implementation** — `@mdx-js/mdx` `evaluate` trong RSC.

First, helper compile module:

```ts
// src/lib/mdx-compile.ts
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeShiki from '@shikijs/rehype';
import type { ReactElement } from 'react';

export async function compileMdxToComponent(
  source: string,
  components: Record<string, React.ComponentType<unknown>>,
): Promise<ReactElement> {
  const { default: MDXContent } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'append' }],
      [rehypeShiki, {
        themes: { light: 'github-light', dark: 'github-dark' },
        // Whitelist languages to control bundle size
        langs: ['bash', 'ts', 'tsx', 'json', 'yaml', 'sh', 'md', 'mdx', 'css', 'html'],
      }],
    ],
  });
  return MDXContent({ components }) as ReactElement;
}
```

Then the dynamic route:

```tsx
// src/app/[locale]/docs/[...slug]/page.tsx
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import { loadMdx, listAllSlugs } from '@/lib/mdx-loader';
import { compileMdxToComponent } from '@/lib/mdx-compile';
import { docsMDXComponents } from '@/components/docs/mdx-components';
import { TranslationBanner } from '@/components/docs/translation-banner';
import type { Locale } from '@/types/workflow';

// Vercel serverful: dynamicParams=true (default) → unlisted routes render dynamically + cached
export const dynamicParams = true;

export async function generateStaticParams() {
  // HIGH 7 fix: chỉ generate routes có file thực
  const params: Array<{ locale: Locale; slug: string[] }> = [];
  for (const locale of ['vi', 'en'] as Locale[]) {
    const slugs = await listAllSlugs(locale);
    for (const slug of slugs) params.push({ locale, slug: slug.split('/') });
  }
  return params;
}

// Cached compile per (locale, slug) — invalidate via revalidateTag('docs-mdx')
const compiledCache = unstable_cache(
  async (locale: Locale, slugStr: string) => {
    const result = await loadMdx(locale, slugStr);
    if (!result) return null;
    const content = await compileMdxToComponent(result.source, docsMDXComponents);
    // Note: cache stores serializable values only; React elements không serializable.
    // Solution: cache RAW (source + frontmatter), compile fresh per render call.
    // Trade-off: lose compile cache, but loadMdx fs read still cached.
    return { source: result.source, result };
  },
  ['docs-mdx-source'],
  { tags: ['docs-mdx'], revalidate: false },
);

export default async function DocsPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  const cached = await compiledCache(locale, slug.join('/'));
  if (!cached) notFound();
  const { source, result } = cached;

  // Compile per render (React element not cacheable in unstable_cache)
  const content = await compileMdxToComponent(source, docsMDXComponents);

  return (
    <>
      {result.fallback && (
        <TranslationBanner
          originalLocale={result.originalLocale}
          resolvedLocale={result.resolvedLocale}
        />
      )}
      <article
        data-fallback={result.fallback ? 'true' : 'false'}
        className="prose prose-slate max-w-none"
      >
        {content}
      </article>
    </>
  );
}

import { headers } from 'next/headers';

export default async function DocsPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  const cached = await compiledCache(locale, slug.join('/'));
  if (!cached) notFound();
  const { content, result } = cached;

  // HIGH 5 fix: set x-docs-fallback header (consumed by language-switcher probe)
  // Workaround: use response header — Next.js 16 allows via middleware or via headers().set in route handler
  // For RSC, we set via metadata or just return + frontend reads from DOM attribute
  // Simpler: render data-fallback attr on article wrapper

  return (
    <>
      {result.fallback && (
        <TranslationBanner
          originalLocale={result.originalLocale}
          resolvedLocale={result.resolvedLocale}
        />
      )}
      <article
        data-fallback={result.fallback ? 'true' : 'false'}
        className="prose prose-slate max-w-none"
      >
        {content}
      </article>
    </>
  );
}

// HIGH 5 fix: canonical link khi serve fallback
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string[] }> }) {
  const { locale, slug } = await params;
  const cached = await compiledCache(locale, slug.join('/'));
  if (!cached) return {};
  const { result } = cached;
  return {
    alternates: {
      canonical: result.fallback
        ? `/${result.resolvedLocale}/docs/${slug.join('/')}`
        : undefined,
    },
  };
}
```

**Constants** (Phase 4 reuse):
```ts
// src/components/docs/constants.ts
export const MDX_CONTENT_SELECTOR = 'article[data-fallback]';
```

### Step 8: Landing page `/[locale]/docs/page.tsx`

Hardcode slug `claudekit-overview`, render same pipeline:

```tsx
import { compiledCache } from './[...slug]/page';  // or refactor cache to lib
// render claudekit-overview
```

### Step 9: Cache sidebar tree (HIGH 8 fix)

Wrap `buildDocsTree` trong `unstable_cache`:

```ts
// src/lib/docs-tree.ts
import { unstable_cache } from 'next/cache';

export const getCachedDocsTree = unstable_cache(
  async (locale: Locale) => buildDocsTree(locale),
  ['docs-tree'],
  { tags: ['docs-tree'], revalidate: false },
);
```

Use `getCachedDocsTree(locale)` in layout, NOT raw `buildDocsTree`. Invalidate via `revalidateTag('docs-tree')` khi docs/ change (deploy webhook or manual API route).

### Step 10: Test fixtures

**MEDIUM 2 fix**: explicit fixture paths.

```bash
mkdir -p tests/fixtures/docs/vi/engineer tests/fixtures/docs/en/engineer
```

Create:
- `tests/fixtures/docs/vi/engineer/01-test.md`:
  ```md
  ---
  title: Test
  ---
  # Test heading
  Body text.
  ```
- `tests/fixtures/docs/vi/engineer/02-hidden.md` (frontmatter `hidden: true`)
- `tests/fixtures/docs/vi/engineer/_section.json` (title override test)

Tests use `path.resolve(__dirname, 'fixtures', 'docs', 'vi')` absolute paths — NOT relative.

### Step 11: Smoke test build + dev

```bash
npm run test:run                         # unit tests pass
npm run dev                              # /vi/docs/engineer/01-core-workflow render
npm run build                            # production build OK
npm start                                # verify /en/docs/X → fallback VI + banner
```

## Success Criteria

- [ ] `/vi/docs/engineer/01-core-workflow` render được md với heading + code block + table
- [ ] Code blocks có syntax highlight (github-light theme)
- [ ] Headings có id + anchor link click được
- [ ] `buildDocsTree('vi')` return tree với sections sorted, items sorted (tests with absolute fixture paths)
- [ ] Symmetric fallback: `loadMdx('en', 'X')` (vi only) returns vi + `fallback: true`
- [ ] Symmetric fallback: `loadMdx('vi', 'Y')` (en only) returns en + `fallback: true`
- [ ] `<article data-fallback="true">` set khi serve fallback
- [ ] `generateMetadata` set canonical link cho fallback pages
- [ ] `generateStaticParams` generate routes chỉ cho file thực (không duplicate)
- [ ] `unstable_cache` wrap compile + tree → second page load no fs read (verify với log)
- [ ] Vitest tests pass (docs-tree + mdx-loader)
- [ ] `npm run dev` start <3s (no search index build chained per BLOCKER 2 fix in Phase 5)
- [ ] `npm run build` OK
- [ ] Per-page client JS không tăng đáng kể (RSC)

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| `@mdx-js/mdx` `evaluate` không support React 19 server features | Low | `@mdx-js/mdx` is the foundation everything else builds on; RSC compat confirmed in mdx-js v3+ |
| Shiki bundle size lớn | Medium | Configure `langs` whitelist: `bash`, `ts`, `tsx`, `json`, `yaml`, `sh`, `md`, `mdx`, `css` |
| `gray-matter` parsing fail trên file thiếu frontmatter | Low | gray-matter returns empty `data: {}`, không throw |
| `@tailwindcss/typography` v4 `@plugin` syntax | Low | Verified per research report |
| `unstable_cache` revalidation strategy chưa quyết | Medium | Default `revalidate: false`, manual `revalidateTag` qua API route. Document trong Phase 4. |

## Cache invalidation strategy (validate decision)

Manual `/api/revalidate` route (implement trong Phase 5). Deploy webhook (Vercel post-deploy script) call endpoint với secret token → `revalidateTag('docs-mdx')` + `revalidateTag('docs-tree')`. Deterministic, không runtime overhead.

```ts
// src/app/api/revalidate/route.ts (skeleton — Phase 5 implement)
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-revalidate-token');
  if (token !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidateTag('docs-mdx');
  revalidateTag('docs-tree');
  return NextResponse.json({ ok: true });
}
```

## Unresolved questions

1. Có cần Mermaid không? Hiện docs không có Mermaid → skip; nếu sau cần, thêm `@theguild/remark-mermaid`.

## Next phase

Phase 4: Docs UI shell (sidebar + TOC + MDX components).
