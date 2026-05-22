---
phase: 9
title: "Sidebar scroll memory"
status: pending
priority: P3
effort: "0.5d"
dependencies: [3]
---

# Phase 9: Sidebar scroll memory

## Overview

Preserve sidebar scroll position khi navigate giữa pages trong cùng section (vd: docs → docs). Reset khi đổi section (docs → skills). Storage: `sessionStorage` (per-tab, no cross-tab pollution).

UX target: user scroll xuống item 50 trong docs tree, click một docs page, sau đó click page khác trong sidebar → sidebar vẫn ở vị trí cũ (không scroll back to top).

## Requirements

**Functional:**
- Each section (workflows/docs/skills) có scroll memory riêng
- Memory key: `sidebar-scroll:${sectionKey}` trong sessionStorage
- On nav-within-section: restore scroll
- On nav-between-sections: don't restore (let new section start fresh)
- Save scroll on scroll (debounced 200ms)
- Save scroll on unmount (final save)

**Non-functional:**
- Restore happens before paint (avoid scroll flash)
- Debounce save → no perf hit while scrolling
- Memory cleared on tab close (sessionStorage default)

## Architecture

```
useSidebarScroll(sectionKey: string)
   ↓ useRef<HTMLElement> attached to sidebar scroll container
   ↓ useLayoutEffect mount: read sessionStorage, set scrollTop
   ↓ scroll listener (debounced): save scrollTop
   ↓ unmount: save final scrollTop
   ↓ section change detection: reset key, new memory

Usage:
<SidebarDocsTree>
  const scrollRef = useSidebarScroll('docs');
  return <div ref={scrollRef} className="overflow-y-auto">...</div>
```

## Related Code Files

**Create:**
- `src/lib/use-sidebar-scroll.ts` — hook
- `src/lib/sidebar-scroll-storage.ts` — sessionStorage helpers (testable in isolation)
- Tests: `use-sidebar-scroll.test.tsx`, `sidebar-scroll-storage.test.ts`

**Modify:**
- `src/components/shell/sidebar-workflows-nav.tsx` — wrap scroll container with hook (key: 'workflows')
- `src/components/shell/sidebar-docs-tree.tsx` — wrap (key: 'docs')
- `src/components/shell/sidebar-skills-nav.tsx` — wrap (key: 'skills')

## Implementation Steps (TDD)

### Step 1 — Red: Tests

```ts
// sidebar-scroll-storage.test.ts
it('saves scroll position by key', () => {
  saveSidebarScroll('docs', 150);
  expect(sessionStorage.getItem('sidebar-scroll:docs')).toBe('150');
});

it('returns 0 when no stored value', () => {
  expect(getSidebarScroll('docs')).toBe(0);
});

it('returns stored value', () => {
  sessionStorage.setItem('sidebar-scroll:docs', '250');
  expect(getSidebarScroll('docs')).toBe(250);
});

it('handles invalid stored value', () => {
  sessionStorage.setItem('sidebar-scroll:docs', 'not-a-number');
  expect(getSidebarScroll('docs')).toBe(0);
});
```

```tsx
// use-sidebar-scroll.test.tsx
it('restores scroll on mount', () => {
  sessionStorage.setItem('sidebar-scroll:docs', '300');
  const { result } = renderHook(() => useSidebarScroll('docs'));
  const fakeEl = { scrollTop: 0, scrollHeight: 1000, clientHeight: 500 } as HTMLElement;
  act(() => { (result.current as any).current = fakeEl; });
  // After useLayoutEffect, scrollTop should be 300
  expect(fakeEl.scrollTop).toBe(300);
});

it('saves scroll on scroll event (debounced)', async () => {
  // simulate scroll
  // wait debounce
  // check sessionStorage
});

it('saves on unmount', () => {
  // mount, set scrollTop, unmount, check sessionStorage
});

it('uses different keys per section', () => {
  // mount with 'docs', set, unmount
  // mount with 'skills', verify starts fresh
});
```

### Step 2 — Green: Implement

```ts
// src/lib/sidebar-scroll-storage.ts
const PREFIX = 'sidebar-scroll';

export function saveSidebarScroll(key: string, position: number) {
  if (typeof sessionStorage === 'undefined') return;
  try { sessionStorage.setItem(`${PREFIX}:${key}`, String(position)); } catch {}
}

export function getSidebarScroll(key: string): number {
  if (typeof sessionStorage === 'undefined') return 0;
  const raw = sessionStorage.getItem(`${PREFIX}:${key}`);
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}
```

```ts
// src/lib/use-sidebar-scroll.ts
'use client';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { getSidebarScroll, saveSidebarScroll } from './sidebar-scroll-storage';

const DEBOUNCE_MS = 200;

export function useSidebarScroll(sectionKey: string) {
  const ref = useRef<HTMLElement | null>(null);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const saved = getSidebarScroll(sectionKey);
    if (saved > 0) el.scrollTop = saved;
  }, [sectionKey]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handler = () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => saveSidebarScroll(sectionKey, el.scrollTop), DEBOUNCE_MS);
    };

    el.addEventListener('scroll', handler, { passive: true });
    return () => {
      el.removeEventListener('scroll', handler);
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      // Final save
      saveSidebarScroll(sectionKey, el.scrollTop);
    };
  }, [sectionKey]);

  return ref;
}
```

Use in components:

```tsx
// sidebar-docs-tree-client.tsx
'use client';
import { useSidebarScroll } from '@/lib/use-sidebar-scroll';

export function SidebarDocsTreeClient({ tree, locale }: Props) {
  const scrollRef = useSidebarScroll('docs');
  return (
    <div ref={scrollRef as React.RefObject<HTMLDivElement>} className="overflow-y-auto">
      <DocsSidebar tree={tree} locale={locale} />
    </div>
  );
}
```

### Step 3 — Refactor

- Verify `useLayoutEffect` runs before paint (no scroll flash)
- Test with browser DevTools throttle to confirm no flash
- Document edge case: changing sectionKey mid-mount (should reset)

## Success Criteria

- [ ] Scroll docs sidebar to item 50, click docs page → return → scroll preserved
- [ ] Navigate docs → skills → docs: scroll restored for docs, skills starts fresh
- [ ] No scroll flash on page nav
- [ ] Reload tab: scroll memory cleared (sessionStorage)
- [ ] All tests pass
- [ ] No perf regression (debounce works)

## Risk Assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| `useLayoutEffect` runs after browser paint in some browsers | Low | Test on Chromium/Firefox/Safari; fall back to `useEffect` if flash visible |
| Storage quota exceeded | Very low | <100 bytes per key; ignore quota errors |
| Multiple instances of same sectionKey race (rare) | Low | Save uses element-bound ref; conflict-free |
| SSR sees `sessionStorage undefined` | Medium | Guard via `typeof sessionStorage === 'undefined'` in storage helpers |
| Section key collision với future expansions | Low | Centralize keys in constant (e.g. SECTION_KEYS = { WORKFLOWS: 'workflows', ... }) |
| Scroll memory wrong when sidebar content changes height | Low | sessionStorage stores scrollTop number; if content shrunk, browser clamps |

## Next phase

Phase 10: E2E + accessibility audit + final polish.
