---
phase: 1
title: "Admin shell skeleton"
status: pending
priority: P1
effort: "0.5d"
dependencies: []
---

# Phase 1: Admin shell skeleton

## Overview

Tạo admin shell wrapper (sidebar + topbar persistent) ở `[locale]/layout.tsx`. Add route redirect `/[locale]` → `/[locale]/workflows`. Sidebar context-aware skeleton (3 sub-components, render theo pathname). Topbar có slot cho breadcrumb / theme / locale / search trigger (chưa wire palette).

Phase này chỉ tạo skeleton — không migrate workflows/docs content. Mục tiêu: shell render đúng, nav skeleton clickable, routes resolve.

## Requirements

**Functional:**
- `/` → 308 `/vi`, `/vi` → 308 `/vi/workflows`, `/en` → 308 `/en/workflows`
- `[locale]/layout.tsx` wrap children với `<AdminShell>` (sidebar + topbar + main slot)
- `<Sidebar>` detect pathname qua `usePathname()`, render đúng sub-nav:
  - `/[locale]/workflows*` → `<SidebarWorkflowsNav />`
  - `/[locale]/docs*` → `<SidebarDocsTree />` (stub, fill phase 3)
  - `/[locale]/skills*` → `<SidebarSkillsNav />` (stub, fill phase 6)
- `<Topbar>` chứa: logo (CK), breadcrumb (`Workflows`, `Docs > slug`, `Skills`), search trigger button (Cmd+K disabled, fill phase 7), `<LanguageSwitcher>`, `<ThemeToggle>` (disabled stub, fill phase 4)
- LocaleSwitcher swap pathname-relative (giữ sub-path khi đổi vi ↔ en)

**Non-functional:**
- Shell render < 50ms (RSC + client island chỉ cho stateful parts)
- Sidebar width fixed 16rem (256px); main area `flex-1`
- Topbar height fixed 56px (`h-14`)
- Layout `min-h-screen flex` (sidebar + main row)

## Architecture

```
<html lang={locale} className={theme}>
  <body>
    <LanguageProvider locale={locale}>
      <ThemeProvider>                     ← stub Phase 1, real Phase 4
        <AdminShell>
          <Sidebar>
            <SidebarHeader />             ← logo + app name
            <SidebarNav>
              {pathname.startsWith('/${locale}/workflows') && <SidebarWorkflowsNav />}
              {pathname.startsWith('/${locale}/docs')     && <SidebarDocsTree />}
              {pathname.startsWith('/${locale}/skills')   && <SidebarSkillsNav />}
            </SidebarNav>
          </Sidebar>
          <div className="flex-1 flex flex-col">
            <Topbar>
              <Breadcrumb />
              <TopbarActions>
                <CommandPaletteTrigger />  ← stub Phase 1
                <LanguageSwitcher />
                <ThemeToggle />             ← stub Phase 1
              </TopbarActions>
            </Topbar>
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </AdminShell>
      </ThemeProvider>
    </LanguageProvider>
  </body>
</html>
```

## Related Code Files

**Create:**
- `src/components/shell/admin-shell.tsx` (client — needs `usePathname`)
- `src/components/shell/sidebar.tsx`
- `src/components/shell/sidebar-header.tsx`
- `src/components/shell/sidebar-workflows-nav.tsx` (skeleton: link "All workflows")
- `src/components/shell/sidebar-docs-tree.tsx` (stub: render "Docs nav (Phase 3)")
- `src/components/shell/sidebar-skills-nav.tsx` (stub: render "Skills nav (Phase 6)")
- `src/components/shell/topbar.tsx`
- `src/components/shell/breadcrumb.tsx`
- `src/components/shell/command-palette-trigger.tsx` (stub: button disabled)
- `src/components/shell/theme-toggle.tsx` (stub: button disabled — Phase 4 wire)
- `src/components/shell/locale-switcher.tsx` (relocate từ `src/components/language-switcher.tsx` + add pathname-relative swap)
- `src/lib/theme-context.tsx` (stub: provider passthrough — Phase 4 implement)
- Tests: `admin-shell.test.tsx`, `sidebar.test.tsx`, `breadcrumb.test.tsx`, `locale-switcher.test.tsx`

**Modify:**
- `src/app/[locale]/layout.tsx` — wrap với `<ThemeProvider>` + `<AdminShell>`
- `src/app/[locale]/page.tsx` — replace `<WorkflowPage />` với `redirect('/${locale}/workflows')`
- `src/proxy.ts` — extend `getRedirectTarget()` in `src/lib/locale-routing.ts` to add `/[locale]` → `/[locale]/workflows` rule (project uses custom `proxy` export + matcher config, NOT Next.js middleware convention) <!-- Updated: Validation Session 1 - middleware path corrected -->

- `src/i18n/translations.ts` — add `nav.workflows`, `nav.docs`, `nav.skills`, `topbar.searchPlaceholder`, `topbar.themeToggle`, `breadcrumb.home` strings

## Implementation Steps (TDD)

### Step 1 — Red: Write failing tests

```tsx
// src/components/shell/admin-shell.test.tsx
import { render, screen } from '@testing-library/react';
import { AdminShell } from './admin-shell';

vi.mock('next/navigation', () => ({
  usePathname: () => '/vi/workflows',
}));

it('renders sidebar + topbar + main slot', () => {
  render(<AdminShell><div>content</div></AdminShell>);
  expect(screen.getByRole('navigation', { name: /sidebar/i })).toBeInTheDocument();
  expect(screen.getByRole('banner')).toBeInTheDocument(); // topbar
  expect(screen.getByText('content')).toBeInTheDocument();
});
```

```tsx
// src/components/shell/sidebar.test.tsx
it('renders workflows nav when pathname starts with /vi/workflows', () => {
  vi.mocked(usePathname).mockReturnValue('/vi/workflows');
  render(<Sidebar locale="vi" />);
  expect(screen.getByText(/all workflows/i)).toBeInTheDocument();
});

it('renders docs tree stub when pathname starts with /vi/docs', () => {
  vi.mocked(usePathname).mockReturnValue('/vi/docs/engineer/01-core');
  render(<Sidebar locale="vi" />);
  expect(screen.getByText(/docs nav/i)).toBeInTheDocument();
});

it('renders skills nav stub when pathname starts with /vi/skills', () => {
  vi.mocked(usePathname).mockReturnValue('/vi/skills');
  render(<Sidebar locale="vi" />);
  expect(screen.getByText(/skills nav/i)).toBeInTheDocument();
});
```

```tsx
// src/components/shell/breadcrumb.test.tsx
it('renders "Workflows" for /vi/workflows', () => {
  vi.mocked(usePathname).mockReturnValue('/vi/workflows');
  render(<Breadcrumb locale="vi" />);
  expect(screen.getByText('Workflows')).toBeInTheDocument();
});

it('renders "Docs > engineer > 01-core" for nested docs path', () => {
  vi.mocked(usePathname).mockReturnValue('/vi/docs/engineer/01-core-workflow');
  render(<Breadcrumb locale="vi" />);
  expect(screen.getByText('Docs')).toBeInTheDocument();
  expect(screen.getByText('engineer')).toBeInTheDocument();
});
```

```tsx
// src/components/shell/locale-switcher.test.tsx
it('preserves sub-path when switching locale', async () => {
  vi.mocked(usePathname).mockReturnValue('/vi/docs/engineer/01-core');
  const push = vi.fn();
  vi.mocked(useRouter).mockReturnValue({ push } as any);
  render(<LocaleSwitcher currentLocale="vi" />);
  await userEvent.click(screen.getByRole('button', { name: /english/i }));
  expect(push).toHaveBeenCalledWith('/en/docs/engineer/01-core');
});
```

### Step 2 — Green: Implement components

Implement components để tests pass. Code skeleton:

```tsx
// admin-shell.tsx
'use client';
import { useLocale } from '@/i18n/language-context';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar locale={locale} />
      <div className="flex flex-1 flex-col">
        <Topbar locale={locale} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
```

```tsx
// sidebar.tsx
'use client';
import { usePathname } from 'next/navigation';
import { SidebarHeader } from './sidebar-header';
import { SidebarWorkflowsNav } from './sidebar-workflows-nav';
import { SidebarDocsTree } from './sidebar-docs-tree';
import { SidebarSkillsNav } from './sidebar-skills-nav';
import type { Locale } from '@/types/workflow';

export function Sidebar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Sidebar" className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">
      <SidebarHeader locale={locale} />
      <div className="flex-1 overflow-y-auto py-4">
        {pathname.startsWith(`/${locale}/workflows`) && <SidebarWorkflowsNav locale={locale} />}
        {pathname.startsWith(`/${locale}/docs`)      && <SidebarDocsTree locale={locale} />}
        {pathname.startsWith(`/${locale}/skills`)    && <SidebarSkillsNav locale={locale} />}
      </div>
    </nav>
  );
}
```

```tsx
// topbar.tsx
'use client';
export function Topbar({ locale }: { locale: Locale }) {
  return (
    <header role="banner" className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <Breadcrumb locale={locale} />
      <div className="flex items-center gap-3">
        <CommandPaletteTrigger />
        <LocaleSwitcher currentLocale={locale} />
        <ThemeToggle />
      </div>
    </header>
  );
}
```

```tsx
// src/app/[locale]/page.tsx
import { redirect } from 'next/navigation';

export default async function LocaleRoot({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/workflows`);
}
```

```tsx
// src/app/[locale]/layout.tsx (modify)
import { ThemeProvider } from '@/lib/theme-context';
import { AdminShell } from '@/components/shell/admin-shell';
// ...existing
export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  return (
    <LanguageProvider locale={locale as Locale}>
      <ThemeProvider>
        <AdminShell>{children}</AdminShell>
      </ThemeProvider>
    </LanguageProvider>
  );
}
```

Add redirect rule in `src/lib/locale-routing.ts` → consumed by existing `proxy.ts`:

```ts
// src/lib/locale-routing.ts (extend getRedirectTarget)
export function getRedirectTarget(pathname: string): string | null {
  // Existing: / → /vi (default locale)
  if (pathname === '/') return `/${DEFAULT_LOCALE}`;
  // NEW: /vi or /en (no sub-path) → /[locale]/workflows
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 1 && LOCALES.includes(segments[0] as Locale)) {
    return `/${segments[0]}/workflows`;
  }
  return null;
}
```

`src/proxy.ts` is unchanged — it already wraps `getRedirectTarget()` + applies 308. <!-- Updated: Validation Session 1 - use existing proxy.ts pattern -->


### Step 3 — Refactor

- Extract `usePathnameStartsWith(prefix)` hook nếu cần share giữa Sidebar + Breadcrumb
- Verify type-check + lint pass (`npm run lint`)
- Smoke test: `npm run dev` → `/vi` → see shell với workflows link active

## Success Criteria

- [ ] `curl -I /` → 308 to `/vi`
- [ ] `curl -I /vi` → 308 to `/vi/workflows`
- [ ] `curl -I /en` → 308 to `/en/workflows`
- [ ] `/vi/workflows` renders shell (sidebar + topbar visible), main shows empty placeholder
- [ ] `/vi/docs/engineer/01-core-workflow` renders shell + docs page (regression OK)
- [ ] Sidebar nav changes content khi navigate giữa /workflows ↔ /docs ↔ /skills
- [ ] Breadcrumb đúng theo pathname
- [ ] LocaleSwitcher preserve sub-path (e.g., `/vi/docs/X` → click EN → `/en/docs/X`)
- [ ] All 4 component tests pass
- [ ] No regression: existing docs pages still render
- [ ] `npm run lint` + `npm run test:run` pass

## Risk Assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| `redirect()` từ `[locale]/page.tsx` infinite loop với proxy redirect | Medium | Test với fetch + `Location` header; use 308 only; proxy matcher excludes `_next` + static assets (existing config) |
| `usePathname()` undefined trên first SSR render | Low | Default `''` fallback trong components; tests mock |
| Sidebar lg-only ẩn mất nav trên < lg | High | Phase 8 add mobile drawer; Phase 1 add note "mobile WIP" |
| Existing `language-switcher.tsx` còn imported chỗ khác | Medium | Grep usage trước khi relocate; rename or alias re-export |

## Next phase

Phase 2: migrate `WorkflowPage` từ `[locale]/page.tsx` cũ qua `[locale]/workflows/page.tsx`, strip header (đã có topbar).
