---
phase: 2
title: "Workflows page migration"
status: pending
priority: P1
effort: "0.5d"
dependencies: [1]
---

# Phase 2: Workflows page migration

## Overview

Move `WorkflowPage` từ `src/app/[locale]/page.tsx` (đã redirect ở Phase 1) qua route mới `src/app/[locale]/workflows/page.tsx`. Strip header riêng (đã có topbar shell). Fill `SidebarWorkflowsNav` với category list. Verify workflow detail (inline expand + ReactFlow) vẫn fit trong shell layout (~75% width).

## Requirements

**Functional:**
- Route `/[locale]/workflows` render grid 39 workflows (same as before)
- Search box + category filter giữ nguyên hành vi
- `<SidebarWorkflowsNav>` render list categories (categoryOrder) như links — click filter grid + update URL query `?category=advanced-pipelines`
- Inline expand detail card hoạt động đúng trong shell main area
- Workflow card click → expand + ReactFlow canvas render
- URL query state: `?category=...&q=search-term` (deeplinkable)

**Non-functional:**
- Grid render < 100ms trên 39 workflows
- Canvas ReactFlow fit `lg:col-span-9` (~75% screen, ≥ 800px usable width)
- Strip duplicate header (chỉ topbar)

## Architecture

```
/[locale]/workflows/page.tsx
   ↓ uses
WorkflowsPageContent (client)
  ├── SearchBar (in topbar trigger OR keep inline)
  ├── CategoryTabs (giữ above grid)
  ├── WorkflowDetail (inline expand)
  └── WorkflowCard grid

SidebarWorkflowsNav (in shell sidebar)
  ├── "All" link → ?category=all
  ├── Category links → ?category=<slug>
  └── Highlight active category
```

URL state sync: `useSearchParams` + `router.replace` (no history clutter).

## Related Code Files

**Create:**
- `src/app/[locale]/workflows/page.tsx` (wrapper)
- `src/components/workflows/workflows-page-content.tsx` (renamed từ workflow-page.tsx)
- Tests: `workflows-page-content.test.tsx`, `sidebar-workflows-nav.test.tsx`

**Modify:**
- `src/components/shell/sidebar-workflows-nav.tsx` — fill từ stub
- `src/components/workflow-page.tsx` — **DELETE** sau khi migrate (file cũ)
- `src/components/category-tabs.tsx` — extract category icon/label logic dùng chung với sidebar nav

**Delete:**
- `src/components/workflow-page.tsx` (replaced by workflows-page-content.tsx)
- Header section JSX (logo, app title, app subtitle) — moved to shell topbar

## Implementation Steps (TDD)

### Step 1 — Red: Tests

```tsx
// workflows-page-content.test.tsx
it('renders all workflows by default', () => {
  render(<WorkflowsPageContent />);
  expect(screen.getAllByRole('article')).toHaveLength(39);
});

it('filters by category from URL query', () => {
  mockSearchParams({ category: 'advanced-pipelines' });
  render(<WorkflowsPageContent />);
  // expect only advanced-pipelines workflows visible
});

it('updates URL when category changes', async () => {
  const replace = vi.fn();
  vi.mocked(useRouter).mockReturnValue({ replace } as any);
  render(<WorkflowsPageContent />);
  await userEvent.click(screen.getByText('Debugging & Fixes'));
  expect(replace).toHaveBeenCalledWith(expect.stringContaining('category=debugging-fixes'));
});

it('expands detail when card clicked', async () => {
  render(<WorkflowsPageContent />);
  await userEvent.click(screen.getAllByRole('article')[0]);
  expect(screen.getByRole('region', { name: /detail/i })).toBeInTheDocument();
});
```

```tsx
// sidebar-workflows-nav.test.tsx
it('renders all category links', () => {
  render(<SidebarWorkflowsNav locale="vi" />);
  categoryOrder.forEach(cat => {
    expect(screen.getByText(uiStrings.categories[cat].vi)).toBeInTheDocument();
  });
});

it('highlights active category from query', () => {
  mockSearchParams({ category: 'design-frontend' });
  render(<SidebarWorkflowsNav locale="vi" />);
  const link = screen.getByText(uiStrings.categories['design-frontend'].vi).closest('a');
  expect(link).toHaveAttribute('aria-current', 'page');
});
```

### Step 2 — Green: Implement

```tsx
// src/app/[locale]/workflows/page.tsx
import { WorkflowsPageContent } from '@/components/workflows/workflows-page-content';

export default function WorkflowsPage() {
  return <WorkflowsPageContent />;
}
```

Copy `workflow-page.tsx` logic vào `workflows-page-content.tsx`. Changes:
- Strip header `<header>` block (lines 38-75 trong file cũ)
- Replace `useState` cho `activeCategory` + `search` bằng `useSearchParams` + `router.replace`
- Container: drop `min-h-screen bg-gray-50` (shell có)
- Wrap content trong `max-w-7xl mx-auto px-6 py-8`

```tsx
// sidebar-workflows-nav.tsx
'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { categoryOrder } from '@/data/workflows';
import { uiStrings } from '@/i18n/translations';

export function SidebarWorkflowsNav({ locale }: { locale: Locale }) {
  const params = useSearchParams();
  const active = params.get('category') || 'all';
  return (
    <nav className="space-y-1 px-3 text-sm">
      <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-gray-400">
        {uiStrings.nav.categories[locale]}
      </h3>
      {categoryOrder.map((cat) => (
        <Link
          key={cat}
          href={`/${locale}/workflows?category=${cat}`}
          aria-current={active === cat ? 'page' : undefined}
          className={`block rounded px-2 py-1.5 ${
            active === cat ? 'bg-orange-50 font-medium text-orange-700' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          {uiStrings.categories[cat][locale]}
        </Link>
      ))}
    </nav>
  );
}
```

### Step 3 — Refactor

- Extract category label/icon helpers `src/lib/category-utils.ts` (shared CategoryTabs + SidebarNav)
- Delete `src/components/workflow-page.tsx` sau khi migration
- Update any imports pointing to old `workflow-page.tsx`
- Smoke test: visit `/vi/workflows?category=debugging-fixes&q=fix` → URL state sync

## Success Criteria

- [ ] `/vi/workflows` renders grid same as old `/vi` (visual regression)
- [ ] Sidebar shows category list, click → filter + URL update
- [ ] URL query state preserved on reload (`?category=X&q=Y`)
- [ ] Workflow card click → inline expand works
- [ ] ReactFlow canvas renders without overflow (measure: width ≥ 800px on `lg`)
- [ ] No duplicate header (shell topbar only)
- [ ] All tests pass
- [ ] Lint + type-check pass

## Risk Assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| ReactFlow canvas quá hẹp do shell sidebar chiếm 256px | Medium | Measure width trên `lg` (1024px - 256px - padding ≈ 700px). Fallback: nếu < 800px, show hint "scroll horizontal" hoặc swap sang slide-over |
| `useSearchParams` Suspense boundary required (Next.js 16) | High | Wrap WorkflowsPageContent với `<Suspense>` boundary |
| URL state collision với existing search-bar local state | Low | Replace local state với URL params; single source of truth |
| Existing tests cho `workflow-page.tsx` break | Medium | Update test imports + assertions trong cùng PR |

## Next phase

Phase 3: refactor docs layout (strip 3-col), wire docs tree vào shell sidebar, add floating TOC.
