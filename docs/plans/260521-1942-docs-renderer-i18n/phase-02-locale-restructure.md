---
phase: 2
title: "Locale restructure"
status: pending
priority: P2
effort: "2-3h"
dependencies: [1]
---

# Phase 2: Locale restructure

## Overview

Refactor app routing từ `/` flat sang `/[locale]/` path-based i18n. Move 32 file md từ `docs/` → `docs/vi/`. Setup root redirect `/` → `/vi`. Update `LanguageContext` để đọc locale từ URL segment thay vì localStorage.

## Requirements

**Functional:**
- `/` → 308 redirect → `/vi`
- `/vi` render dashboard hiện tại (VI)
- `/en` render dashboard hiện tại (EN)
- `/vi/docs` và `/en/docs` ready cho Phase 3 implement
- Locale switcher toggle `/vi/...` ↔ `/en/...` (preserve sub-path)
- All 32 file md ở `docs/vi/...`
- `CLAUDE.md` references updated

**Non-functional:**
- `next build` pass
- No broken internal links
- Existing dashboard UX không degrade

## Architecture

```
BEFORE                          AFTER
src/app/                        src/app/
├── layout.tsx                  ├── layout.tsx           # Root layout (minimal)
├── page.tsx                    ├── page.tsx             # 308 → /vi
└── globals.css                 ├── globals.css
                                └── [locale]/
                                    ├── layout.tsx       # LanguageProvider
                                    ├── page.tsx        # Dashboard (moved)
                                    └── docs/            # (Phase 3+)
                                        └── (empty)
docs/                           docs/
├── claudekit-overview.md       └── vi/
├── engineer/...                    ├── claudekit-overview.md
├── marketing/...                   ├── engineer/...
├── workflows/...                   ├── marketing/...
└── cli/...                         ├── workflows/...
                                    └── cli/...
                                 └── en/                  # Empty initially
```

## Related Code Files

**Create:**
- `src/app/[locale]/layout.tsx`
- `src/app/[locale]/page.tsx` (move từ `src/app/page.tsx`)
- `src/middleware.ts` (locale validation, redirect)

**Modify:**
- `src/app/page.tsx` → redirect logic
- `src/app/layout.tsx` → strip LanguageProvider (move sang [locale]/layout.tsx)
- `src/i18n/language-context.tsx` → đọc locale từ params/URL
- `src/components/language-switcher.tsx` → swap URL segment thay vì context state
- `src/components/workflow-page.tsx` → nhận locale prop hoặc useParams
- `CLAUDE.md` → update docs paths `docs/engineer/...` → `docs/vi/engineer/...`

**Move (rename):**
- `docs/*.md` → `docs/vi/*.md` (32 files)
- `docs/engineer/` → `docs/vi/engineer/`
- `docs/marketing/` → `docs/vi/marketing/`
- `docs/workflows/` → `docs/vi/workflows/`
- `docs/cli/` → `docs/vi/cli/`

**Delete:** None (just moves).

## Implementation Steps

### Step 1: Tests-First — Write failing tests

**HIGH 1 fix**: refactor middleware logic ra pure function để testable mà không phụ thuộc `NextRequest`/`Response` runtime parity trong happy-dom. Integration coverage qua Playwright (Phase 5 E2E).

```ts
// src/lib/locale-routing.ts (pure logic, testable trong Vitest)
const LOCALES = ['vi', 'en'] as const;
const DEFAULT_LOCALE = 'vi';

export function getRedirectTarget(pathname: string): string | null {
  // Skip patterns handled by matcher — defensive only
  if (pathname.startsWith('/_next') || pathname.startsWith('/api')) return null;
  if (pathname.includes('.')) return null; // static assets

  const seg1 = pathname.split('/')[1];
  if (LOCALES.includes(seg1 as typeof LOCALES[number])) return null;

  return `/${DEFAULT_LOCALE}${pathname || '/'}`;
}
```

```ts
// src/lib/locale-routing.test.ts (happy-dom OK, pure functions)
import { describe, it, expect } from 'vitest';
import { getRedirectTarget } from './locale-routing';

describe('getRedirectTarget', () => {
  it('redirects / to /vi', () => {
    expect(getRedirectTarget('/')).toBe('/vi/');
  });
  it('passes /vi/... unchanged', () => {
    expect(getRedirectTarget('/vi/docs')).toBeNull();
  });
  it('passes /en/... unchanged', () => {
    expect(getRedirectTarget('/en/docs')).toBeNull();
  });
  it('redirects /xx/docs → /vi/xx/docs (invalid locale)', () => {
    expect(getRedirectTarget('/xx/docs')).toBe('/vi/xx/docs');
  });
  it('returns null for /_next/...', () => {
    expect(getRedirectTarget('/_next/static/foo.js')).toBeNull();
  });
  it('returns null for /api/...', () => {
    expect(getRedirectTarget('/api/foo')).toBeNull();
  });
  it('returns null for files with extension', () => {
    expect(getRedirectTarget('/sitemap.xml')).toBeNull();
  });
});
```

```tsx
// src/components/language-switcher.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSwitcher } from './language-switcher';
// Test: clicking EN button push URL /en/...
// Mock useRouter từ next/navigation
```

Middleware integration (E2E only):
```ts
// e2e/middleware.spec.ts (Playwright, Phase 5)
test('redirects / to /vi', async ({ page }) => {
  const res = await page.goto('/');
  expect(page.url()).toContain('/vi');
});
```

### Step 2: Move docs/ files vào docs/vi/

```bash
mkdir -p docs/vi
git mv docs/claudekit-overview.md docs/vi/
git mv docs/engineer-kit-changes-2026-05-21.md docs/vi/
git mv docs/workflow-patterns-decision-matrices.md docs/vi/
git mv docs/engineer docs/vi/engineer
git mv docs/marketing docs/vi/marketing
git mv docs/workflows docs/vi/workflows
git mv docs/cli docs/vi/cli
mkdir -p docs/en
```

Lưu ý KHÔNG move `docs/plans/` (plans dir riêng cho ck CLI).

### Step 3: Create `src/middleware.ts`

**HIGH 2 fix**: tighten matcher → exclude `/api`, all static (`.*\\..*`), full `_next/*`. Single source of truth (matcher), delegate logic to pure function.

```ts
import { NextRequest, NextResponse } from 'next/server';
import { getRedirectTarget } from './lib/locale-routing';

export function middleware(req: NextRequest) {
  // Skip non-GET/HEAD requests — preserve CORS preflight, etc.
  if (req.method !== 'GET' && req.method !== 'HEAD') return;

  const target = getRedirectTarget(req.nextUrl.pathname);
  if (!target) return;

  const url = req.nextUrl.clone();
  url.pathname = target;
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Tightened matcher: exclude api, all _next/*, and any path with extension
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
```

Note (HIGH 2): matcher excludes:
- `/api/*` — API routes
- `/_next/*` — Next.js internals (static, image, data)
- `*.ext` — static assets (favicon, sitemap.xml, robots.txt, manifest.json)

Method guard prevents 308 redirect of OPTIONS/POST/etc.

### Step 4: Restructure app dir

```bash
mkdir -p src/app/\[locale\]
git mv src/app/page.tsx src/app/\[locale\]/page.tsx
```

Create `src/app/[locale]/layout.tsx`:

```tsx
import { LanguageProvider } from '@/i18n/language-context';
import type { Locale } from '@/types/workflow';

export function generateStaticParams() {
  return [{ locale: 'vi' }, { locale: 'en' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <LanguageProvider locale={locale}>{children}</LanguageProvider>;
}
```

Update root `src/app/layout.tsx` → remove LanguageProvider, keep HTML shell + globals.

Update root `src/app/page.tsx`:

```tsx
import { redirect } from 'next/navigation';
export default function RootPage() {
  redirect('/vi');
}
```

### Step 5: Refactor `src/i18n/language-context.tsx`

Đổi từ `useState + localStorage` sang đọc locale từ params (prop drilling từ layout). Locale switcher dùng `usePathname()` + `useRouter()`.

```tsx
// language-context.tsx — pseudocode
'use client';
export function LanguageProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={{ locale }}>{children}</LocaleContext.Provider>;
}
```

### Step 6: Update `language-switcher.tsx`

**HIGH 5 fix**: detect target locale availability TRƯỚC khi swap URL. Nếu page chỉ có ở source locale → confirm inline thay vì silently fallback.

```tsx
'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [confirming, setConfirming] = useState<'vi' | 'en' | null>(null);
  const [, startTransition] = useTransition();
  const current = pathname.split('/')[1] as 'vi' | 'en';

  async function switchTo(target: 'vi' | 'en') {
    if (target === current) return;
    const newPath = pathname.replace(/^\/(vi|en)/, `/${target}`);

    // For non-docs paths, just swap immediately
    if (!pathname.includes('/docs/')) {
      router.push(newPath);
      return;
    }

    // For docs paths, probe target locale existence via HEAD
    const probe = await fetch(newPath, { method: 'HEAD' });
    const hasTranslation = probe.headers.get('x-docs-fallback') !== 'true';

    if (hasTranslation) {
      router.push(newPath);
    } else {
      setConfirming(target); // Show inline confirm "Bản dịch chưa có. Vẫn chuyển?"
    }
  }

  function confirmSwitch() {
    if (!confirming) return;
    const newPath = pathname.replace(/^\/(vi|en)/, `/${confirming}`);
    startTransition(() => router.push(newPath));
    setConfirming(null);
  }

  return (
    <>
      <button onClick={() => switchTo('vi')} aria-pressed={current === 'vi'}>VI</button>
      <button onClick={() => switchTo('en')} aria-pressed={current === 'en'}>EN</button>
      {confirming && (
        <div role="dialog" className="absolute …">
          <p>Bản dịch chưa có. Vẫn chuyển sang {confirming.toUpperCase()}?</p>
          <button onClick={confirmSwitch}>Có</button>
          <button onClick={() => setConfirming(null)}>Không</button>
        </div>
      )}
    </>
  );
}
```

**Header `x-docs-fallback`** sẽ được set bởi docs page (Phase 4) khi serve fallback content. Allows switcher probe to detect translation existence.

Note: Probe adds 1 HEAD request per locale switch on docs pages. Acceptable trade-off vs confusion UX.

### Step 7: Audit + update ALL docs path references

**HIGH 6 fix**: không chỉ CLAUDE.md, audit toàn bộ codebase.

Find/replace trong `CLAUDE.md` (project root):
- `docs/engineer/` → `docs/vi/engineer/`
- `docs/marketing/` → `docs/vi/marketing/`
- `docs/workflows/` → `docs/vi/workflows/`
- `docs/cli/` → `docs/vi/cli/`
- `docs/claudekit-overview.md` → `docs/vi/claudekit-overview.md`
- `docs/engineer-kit-changes-2026-05-21.md` → `docs/vi/engineer-kit-changes-2026-05-21.md`
- `docs/workflow-patterns-decision-matrices.md` → `docs/vi/workflow-patterns-decision-matrices.md`

KHÔNG đổi `docs/plans/` paths.

**Audit step (mandatory)**:
```bash
# Find all internal docs path references EXCEPT external URLs + plans dir
rg -n 'docs/(engineer|marketing|workflows|cli|claudekit-overview|engineer-kit-changes|workflow-patterns)' \
  --type-add 'docs:*.md' --type docs \
  --glob '!docs/plans/**' \
  --glob '!docs/vi/**' \
  --glob '!docs/en/**' \
  | grep -v 'https://docs.claudekit.cc' \
  | grep -v 'docs.claudekit.cc'

# Also check shell scripts, configs
rg 'docs/(engineer|marketing|workflows|cli)' --type sh --type js --type ts --type json
```

Expected: zero hits sau cleanup. Nếu có hits, update từng file riêng (likely candidates: `docs/cli/cli-commands-reference.md:113`, `docs/claudekit-overview.md` internal links).

**Internal cross-link check**: docs files có thể có relative links `[link](../engineer/X.md)`:
```bash
rg -n '\]\(\.\./' docs/vi/ docs/en/
```
Hiện codebase verified zero hits. Add CI gate sau (LOW priority): cross-links phải dùng absolute `/docs/{locale}/...` paths.

### Step 8: Run tests + build

```bash
npm run test:run        # middleware + switcher tests pass
npm run build           # static generation OK
npm run dev             # smoke test: / → /vi, /vi loads dashboard, /en loads dashboard
```

## Success Criteria

- [ ] `/` HTTP 308 → `/vi` (verify với `curl -I http://localhost:3001`)
- [ ] `/vi` renders existing dashboard
- [ ] `/en` renders existing dashboard với EN content
- [ ] `/api/X` (sau khi có API route) KHÔNG bị redirect
- [ ] `/sitemap.xml`, `/favicon.ico` KHÔNG bị redirect
- [ ] OPTIONS request → KHÔNG redirect (verify với curl)
- [ ] Language switcher: switch khi page exists trong target locale
- [ ] Language switcher: confirm dialog khi page thiếu trong target locale
- [ ] All 32 md files trong `docs/vi/`
- [ ] `docs/en/` exists (empty)
- [ ] Audit grep zero hits sau Step 7
- [ ] `npm run build` exits 0
- [ ] Vitest `locale-routing` + switcher tests pass
- [ ] No broken imports/links

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| `LanguageProvider` prop drilling breaks deep components | Medium | Provide useLocale() hook, không touch deep components |
| Middleware redirect loop nếu match logic sai | High | Test cases bao gồm /vi (pass-through), /en (pass-through), / (redirect) |
| `params` Promise breaking change in Next 16 | High | Strictly `await params` trong layout/page |
| `git mv` mất history nếu file rename + content change cùng commit | Low | Commit move riêng (chỉ git mv, no content change) |

## Next phase

Phase 3: MDX pipeline + auto-discover loader.
