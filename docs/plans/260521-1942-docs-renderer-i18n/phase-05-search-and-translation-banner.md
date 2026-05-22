---
phase: 5
title: "Search and translation banner"
status: pending
priority: P2
effort: "3-5h"
dependencies: [4]
---

# Phase 5: Search (flexsearch 0.7 Flat Index + cmdk) + E2E

## Overview

Implement full-text search xuyên 32 file md với **flexsearch 0.7.x Flat Index + sidecar metadata** (NOT Document API; matches research recommendation, safer). cmdk modal UI. Build search index ở build-time script. **Skip search trong dev** (BLOCKER 2 fix). Phase 5 cũng add 3-5 Playwright E2E tests (MEDIUM 4 fix).

**Lưu ý**: Translation banner đã implement ở Phase 4.

## Requirements

**Functional:**
- Cmd+K (Mac) / Ctrl+K (Win) mở search modal (production)
- Dev mode: modal show "Search unavailable in dev (run `npm run build:search` once)"
- ESC đóng modal
- Search xuyên title + content + headings của 32 file
- Arrow up/down + Enter navigate kết quả
- Click result navigate sang page
- Per-locale index (separate vi/en sidecar JSON)
- **Real debounce** 150ms (`setTimeout` + cleanup, NOT `useDeferredValue`) — HIGH 4 fix

**Non-functional:**
- Search index lazy-load (không block initial paint)
- Index size <500KB gzipped cho 32 files
- Search query response <50ms
- Bundle add ≤15KB gzipped (flexsearch 7KB + cmdk 5KB)
- Dev startup unaffected (no chained build:search)

## Architecture

```
Build time:
scripts/build-search-index.ts → read all docs/{locale}/*.md → strip frontmatter → tokenize
  → flexsearch.Index.export() → public/search-index-{locale}.json

Runtime:
User presses Cmd+K → SearchModal opens
  → useEffect: fetch /search-index-{locale}.json → flexsearch.Index.import()
  → onInput debounced → index.search(query) → display results
  → cmdk handles keyboard nav + render
```

## Related Code Files

**Create:**
- `scripts/build-search-index.ts` — build-time index generator
- `src/lib/search-client.ts` — client-side search API (load + query)
- `src/lib/search-client.test.ts`
- `src/components/docs/docs-search.tsx` — Cmd+K modal (replace stub từ Phase 4)
- `src/components/docs/docs-search.test.tsx`
- `public/search-index-vi.json` (generated)
- `public/search-index-en.json` (generated)

**Modify:**
- `package.json` — add `flexsearch` + `cmdk` + `tsx` (script runner) + `build` script chain
- `src/app/[locale]/layout.tsx` — mount `<DocsSearch />` trong header

## Implementation Steps

### Step 1: Tests-First

```ts
// search-client.test.ts
describe('searchClient', () => {
  it('loads index lazily', async () => {
    const client = await loadSearchIndex('vi');
    expect(client).toBeDefined();
  });

  it('returns matches for query', async () => {
    const client = await loadSearchIndex('vi');
    const results = client.search('workflow');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('slug');
  });

  it('handles Vietnamese diacritics', async () => {
    const client = await loadSearchIndex('vi');
    const results = client.search('thiết kế');
    expect(results.length).toBeGreaterThan(0);
  });

  it('returns empty on no match', async () => { /* ... */ });
});
```

```tsx
// docs-search.test.tsx
it('opens modal on Cmd+K', async () => {
  render(<DocsSearch locale="vi" />);
  await userEvent.keyboard('{Meta>}k{/Meta}');
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});

it('closes modal on Escape', async () => { /* ... */ });
it('displays results on input', async () => { /* ... */ });
```

### Step 2: Install dependencies

**BLOCKER 3 fix**: lock flexsearch `^0.7.31` explicitly.

```bash
npm install flexsearch@^0.7.31 cmdk
npm install -D tsx playwright @playwright/test
```

**Add to `.gitignore`** (MEDIUM 5 fix):
```
/public/search-index-*.json
```

### Step 3: Implement `scripts/build-search-index.ts`

**BLOCKER 3 fix**: dùng flexsearch 0.7 **Flat Index** (not Document) + sidecar metadata, per research report recommendation.

```ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { glob } from 'glob';
import matter from 'gray-matter';
import FlexSearch from 'flexsearch';

const LOCALES = ['vi', 'en'] as const;

interface DocMeta { slug: string; title: string; }
type IndexExport = Record<string, string>;

async function buildIndex(locale: typeof LOCALES[number]) {
  const docsRoot = path.join(process.cwd(), 'docs', locale);
  let files: string[];
  try {
    files = await glob('**/*.md', { cwd: docsRoot, ignore: ['_*'] });
  } catch { files = []; }

  if (files.length === 0) {
    // Empty locale (e.g., en initially) → write empty index
    await writeOutput(locale, {}, {});
    console.log(`[search-index] ${locale}: empty (no docs)`);
    return;
  }

  // Flat Index — single-field search, simpler API, 0.7 export() works.
  // Concat fields với separator để tất cả searchable từ 1 index.
  const index = new FlexSearch.Index({
    tokenize: 'forward',
    encode: 'advanced', // Vietnamese diacritic normalization
  });

  const meta: Record<number, DocMeta> = {};

  for (let i = 0; i < files.length; i++) {
    const full = path.join(docsRoot, files[i]);
    const raw = await fs.readFile(full, 'utf-8');
    const { content, data } = matter(raw);
    const slug = files[i].replace(/\.md$/, '');

    const h1 = content.match(/^#\s+(.+)$/m)?.[1] || (data.title as string) || slug;
    const headings = (content.match(/^#{2,3}\s+(.+)$/gm) || [])
      .map(h => h.replace(/^#+\s+/, ''))
      .join(' ');
    const body = content
      .replace(/```[\s\S]*?```/g, '')
      .replace(/[#*_`~]/g, '')
      .replace(/\s+/g, ' ')
      .slice(0, 5000);

    // Boost title via repetition, then headings, then body
    const searchableText = `${h1} ${h1} ${headings} ${body}`;
    index.add(i, searchableText);
    meta[i] = { slug, title: h1 };
  }

  // Export Flat Index — 0.7 supports this on Index (not Document)
  const exported: IndexExport = {};
  await new Promise<void>((resolve) => {
    let pending = 0;
    let started = false;
    index.export((key, data) => {
      if (!started) started = true;
      exported[String(key)] = data;
    });
    // Heuristic flush (0.7 export is sync-ish for Flat Index in this version)
    setTimeout(() => resolve(), 50);
  });

  await writeOutput(locale, exported, meta);
  console.log(`[search-index] ${locale}: ${files.length} docs indexed`);
}

async function writeOutput(locale: string, exported: IndexExport, meta: Record<number, DocMeta>) {
  const outDir = path.join(process.cwd(), 'public');
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(
    path.join(outDir, `search-index-${locale}.json`),
    JSON.stringify({ index: exported, meta }),
  );
}

await Promise.all(LOCALES.map(buildIndex));
```

**Note về flexsearch 0.7 export API**: Flat Index `.export(callback)` emits multiple sequential keys synchronously trong 1 tick. Setting `setTimeout` flush conservative. Verify với actual flexsearch 0.7.31 docs — adjust nếu pattern khác.

### Step 4: Update `package.json`

**BLOCKER 2 fix**: KHÔNG chain `build:search` vào `dev`. Dev start nhanh.

```json
{
  "scripts": {
    "build:search": "tsx scripts/build-search-index.ts",
    "build": "npm run build:search && next build",
    "dev": "next dev",
    "dev:search": "tsx --watch scripts/build-search-index.ts"
  }
}
```

Workflow:
- **Dev** (mặc định): `npm run dev` start ngay, no search index. Cmd+K modal show "Search unavailable in dev (run `npm run build:search` once)".
- **Dev với search**: `npm run build:search` 1 lần để có index, hoặc chạy `npm run dev:search` ở terminal khác để watch.
- **Production**: `npm run build` chain build:search trước next build.

### Step 5: Implement `src/lib/search-client.ts`

Flat Index pattern matching research report. Returns SearchResult với slug + title (no excerpt cho MVP; có thể add sau).

```ts
import FlexSearch from 'flexsearch';
import type { Locale } from '@/types/workflow';

export interface SearchResult {
  slug: string;
  title: string;
}

interface IndexBundle {
  search: (query: string) => SearchResult[];
  isEmpty: boolean;
}

const cachedClients = new Map<Locale, IndexBundle>();

export async function loadSearchIndex(locale: Locale): Promise<IndexBundle> {
  if (cachedClients.has(locale)) return cachedClients.get(locale)!;

  let bundle: IndexBundle;
  try {
    const res = await fetch(`/search-index-${locale}.json`);
    if (!res.ok) throw new Error(`fetch failed ${res.status}`);
    const { index: exported, meta } = await res.json() as {
      index: Record<string, string>;
      meta: Record<number, { slug: string; title: string }>;
    };

    if (Object.keys(exported).length === 0) {
      bundle = { search: () => [], isEmpty: true };
    } else {
      const index = new FlexSearch.Index({ tokenize: 'forward', encode: 'advanced' });
      for (const [key, data] of Object.entries(exported)) {
        index.import(key, data);
      }
      bundle = {
        search: (query) => {
          if (!query.trim()) return [];
          const hits = index.search(query, 10) as number[];
          return hits
            .map(id => meta[id])
            .filter(Boolean)
            .map(m => ({ slug: m.slug, title: m.title }));
        },
        isEmpty: false,
      };
    }
  } catch (err) {
    console.warn('[search] index load failed:', err);
    bundle = { search: () => [], isEmpty: true };
  }

  cachedClients.set(locale, bundle);
  return bundle;
}
```

### Step 6: Implement `src/components/docs/docs-search.tsx`

**HIGH 4 fix**: real `setTimeout` debounce 150ms thay vì `useDeferredValue`.

```tsx
'use client';
import { useEffect, useState, useRef } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { loadSearchIndex, type SearchResult } from '@/lib/search-client';
import type { Locale } from '@/types/workflow';

const DEBOUNCE_MS = 150;

export function DocsSearch({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [client, setClient] = useState<Awaited<ReturnType<typeof loadSearchIndex>> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cmd+K toggle
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Lazy load index on first open
  useEffect(() => {
    if (open && !client) {
      loadSearchIndex(locale).then(setClient);
    }
  }, [open, client, locale]);

  // Real debounce
  useEffect(() => {
    if (!client) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setResults(client.search(query));
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [client, query]);

  function select(slug: string) {
    setOpen(false);
    setQuery('');
    router.push(`/${locale}/docs/${slug}`);
  }

  const isDevIndexMissing = client?.isEmpty && process.env.NODE_ENV !== 'production';

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Search docs">
      <Command.Input
        placeholder={locale === 'vi' ? 'Tìm trong docs…' : 'Search docs…'}
        value={query}
        onValueChange={setQuery}
        autoFocus
      />
      <Command.List>
        {isDevIndexMissing && (
          <div className="p-3 text-sm text-amber-700 bg-amber-50">
            Search unavailable in dev. Run <code>npm run build:search</code> once.
          </div>
        )}
        {!isDevIndexMissing && results.length === 0 && query && (
          <Command.Empty>Không có kết quả</Command.Empty>
        )}
        {results.map(r => (
          <Command.Item key={r.slug} value={r.slug} onSelect={() => select(r.slug)}>
            {r.title}
            <span className="ml-2 text-xs text-gray-500">{r.slug}</span>
          </Command.Item>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}
```

Styling cmdk: theo cmdk docs hoặc copy từ shadcn `command.tsx` style.

### Step 7: Mount DocsSearch trong header

Update `src/app/[locale]/layout.tsx` (hoặc header component) thêm `<DocsSearch locale={locale} />`. Optional: thêm button mở modal cho user không nhớ shortcut.

### Step 7b: Implement `/api/revalidate` route (validate decision)

Per Phase 3 cache invalidation decision, expose endpoint cho deploy webhook trigger cache flush.

```ts
// src/app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-revalidate-token');
  if (!process.env.REVALIDATE_SECRET || token !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const tags = body.tags ?? ['docs-mdx', 'docs-tree'];
  for (const tag of tags) revalidateTag(tag);
  return NextResponse.json({ ok: true, revalidated: tags });
}
```

Env: add `REVALIDATE_SECRET` to Vercel dashboard. Deploy hook script:
```bash
curl -X POST https://yoursite.com/api/revalidate \
  -H "x-revalidate-token: $REVALIDATE_SECRET" \
  -H "content-type: application/json" \
  -d '{"tags": ["docs-mdx", "docs-tree"]}'
```

Add Vercel deploy hook script trong `package.json` post-deploy command, OR set up Vercel Integration hook calling /api/revalidate.

### Step 8: Playwright E2E tests (MEDIUM 4 fix)

Install + configure:
```bash
npx playwright install --with-deps chromium
```

`playwright.config.ts`:
```ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:3001' },
  webServer: { command: 'npm run build && npm start', port: 3001, reuseExistingServer: true },
});
```

Write 3-5 critical-path E2E:
```ts
// e2e/locale-redirect.spec.ts
test('root redirects to /vi', async ({ page }) => { /* ... */ });

// e2e/docs-navigation.spec.ts
test('sidebar click navigates to docs page', async ({ page }) => { /* ... */ });

// e2e/search-keyboard.spec.ts
test('Cmd+K opens search modal, Escape closes', async ({ page }) => { /* ... */ });
test('typing query shows results', async ({ page }) => { /* ... */ });

// e2e/fallback.spec.ts
test('en route shows banner when only vi exists', async ({ page }) => { /* ... */ });
```

### Step 9: Run tests + production smoke

```bash
npm run test:run            # Vitest unit tests
npm run build               # build:search → next build
npm start                   # production server :3001
npx playwright test         # E2E suite
# Manual: /vi/docs → Cmd+K → search "workflow" → click → navigate
# Manual: /en/docs/X → banner displays
```

## Success Criteria

- [ ] `npm run build:search` generate `public/search-index-{vi,en}.json`
- [ ] Index size <500KB gzipped mỗi locale
- [ ] `npm run dev` start <3s (no chained build:search)
- [ ] Dev mode: Cmd+K modal show "Search unavailable in dev" message
- [ ] Cmd+K trên Mac, Ctrl+K trên Win mở modal (production)
- [ ] ESC đóng modal
- [ ] Type "workflow" trong vi index → ≥3 results
- [ ] Type "thiết kế" (có dấu) → matched (Vietnamese diacritics work)
- [ ] Real 150ms debounce active (verify với manual fast-typing test)
- [ ] Arrow up/down + Enter navigate
- [ ] Click result → router push sang `/{locale}/docs/{slug}`
- [ ] Index lazy-loaded (Network tab: fetch chỉ khi mở modal lần đầu)
- [ ] Bundle add ≤15KB gzipped (verify bundle analyzer)
- [ ] Vitest tests pass
- [ ] Playwright E2E suite (5 tests) pass
- [ ] `.gitignore` exclude `public/search-index-*.json`

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| flexsearch Document index không support `export()` trong v0.7 | Medium | Test export pattern sớm; fallback Flat index nếu Document fail |
| Vietnamese diacritics không match tốt với `encode: 'advanced'` | Medium | Test cases với "thiết kế", "tổng quan"; custom encoder nếu fail |
| Build:search slow cho 32+ files | Low | Hiện 32 file = <1s expected; profile nếu chậm |
| cmdk + Tailwind v4 styling conflict | Low | Style theo cmdk plain CSS hoặc shadcn pattern |
| Public folder index leaks → ai cũng download được | None | Docs public anyway, OK |

## Unresolved questions

1. Có cần index VI + EN gộp 1 file (cross-language search) không? Hiện tách 2 file (default).
2. Search analytics track popular queries? (Cần backend → defer)
3. Highlight matched term trong result excerpt? (Nice-to-have, defer nếu không kịp)
4. Vietnamese native speaker validate diacritical matching trước launch?

## Final wrap-up

Sau Phase 5:
- Toàn bộ docs renderer hoạt động end-to-end
- Commit + PR ready
- Run `/ck:ship` để land

Workflow JSON migration (chuyển `src/data/workflows.ts` → JSON) tách plan riêng — create sau khi docs ship.
