---
phase: 8
title: "Mobile drawer responsive"
status: pending
priority: P2
effort: "0.5d"
dependencies: [1]
---

# Phase 8: Mobile drawer responsive

## Overview

Mobile UX (< `lg` / 1024px): sidebar ẩn, hamburger button trong topbar mở slide-over drawer chứa full sidebar content. Tap backdrop hoặc click nav item → close. Tái sử dụng pattern từ existing `src/components/docs/mobile-drawer.tsx` (Phase 4 plan cũ) nhưng generic hơn cho admin shell.

Deprecate `src/components/docs/mobile-nav.tsx` + `mobile-drawer.tsx` cũ (chỉ docs-specific) — shell mobile drawer replaces.

## Requirements

**Functional:**
- Mobile (< lg): sidebar `hidden`, hamburger button trong topbar
- Click hamburger → drawer slide-in từ trái, full sidebar content inside
- Backdrop overlay click → close
- Click nav item → close
- Swipe left (touch) → close
- Focus trap khi drawer open
- Esc close
- Drawer scroll independent

**Non-functional:**
- Animation 60fps (transform-based, no layout reflow)
- Drawer width 280px (slightly wider than desktop sidebar)
- Backdrop opacity 50%
- Touch targets ≥44px
- Body scroll lock when drawer open

## Architecture

```
<Topbar>
  {/* mobile only */}
  <button onClick={openDrawer} className="lg:hidden">
    <HamburgerIcon />
  </button>
  {/* desktop only - existing */}
</Topbar>

<MobileDrawer open={drawerOpen} onClose={closeDrawer}>
  {/* Same content as desktop sidebar */}
  <SidebarHeader />
  <SidebarWorkflowsNav />  ← context-aware reuse
  ...
</MobileDrawer>

Hook: useMobileDrawer() returns { open, openDrawer, closeDrawer }
Body scroll lock via document.body.style.overflow = 'hidden'
```

## Related Code Files

**Create:**
- `src/components/shell/mobile-drawer.tsx` — generic shell drawer (NOT docs-specific)
- `src/components/shell/mobile-drawer-context.tsx` — open state
- `src/components/shell/hamburger-button.tsx`
- `src/lib/body-scroll-lock.ts` — helper
- Tests: `mobile-drawer.test.tsx`, `hamburger-button.test.tsx`

**Modify:**
- `src/components/shell/topbar.tsx` — add hamburger (mobile only)
- `src/components/shell/admin-shell.tsx` — mount drawer
- `src/components/shell/sidebar.tsx` — render `lg:flex` only; drawer reuses children

**Delete (deprecate):**
- `src/components/docs/mobile-nav.tsx` (replaced by shell hamburger)
- `src/components/docs/mobile-drawer.tsx` (replaced by shell drawer)
- Remove references from `[locale]/docs/layout.tsx`

## Implementation Steps (TDD)

### Step 1 — Red: Tests

```tsx
// mobile-drawer.test.tsx
it('renders nothing when closed', () => {
  render(<MobileDrawer open={false} onClose={vi.fn()}>content</MobileDrawer>);
  expect(screen.queryByText('content')).not.toBeInTheDocument();
});

it('renders content when open', () => {
  render(<MobileDrawer open onClose={vi.fn()}>content</MobileDrawer>);
  expect(screen.getByText('content')).toBeInTheDocument();
});

it('calls onClose when backdrop clicked', async () => {
  const onClose = vi.fn();
  render(<MobileDrawer open onClose={onClose}>x</MobileDrawer>);
  await userEvent.click(screen.getByTestId('drawer-backdrop'));
  expect(onClose).toHaveBeenCalled();
});

it('calls onClose on Escape', async () => {
  const onClose = vi.fn();
  render(<MobileDrawer open onClose={onClose}>x</MobileDrawer>);
  await userEvent.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalled();
});

it('traps focus inside drawer', async () => {
  render(
    <MobileDrawer open onClose={vi.fn()}>
      <button>first</button><button>last</button>
    </MobileDrawer>
  );
  const first = screen.getByText('first');
  const last = screen.getByText('last');
  last.focus();
  await userEvent.tab(); // wraps to first
  expect(first).toHaveFocus();
});

it('locks body scroll when open', () => {
  const { rerender } = render(<MobileDrawer open={false} onClose={vi.fn()}>x</MobileDrawer>);
  expect(document.body.style.overflow).not.toBe('hidden');
  rerender(<MobileDrawer open onClose={vi.fn()}>x</MobileDrawer>);
  expect(document.body.style.overflow).toBe('hidden');
});
```

```tsx
// hamburger-button.test.tsx
it('only visible on mobile', () => {
  render(<HamburgerButton onClick={vi.fn()} />);
  expect(screen.getByRole('button')).toHaveClass('lg:hidden');
});

it('calls onClick when clicked', async () => {
  const onClick = vi.fn();
  render(<HamburgerButton onClick={onClick} />);
  await userEvent.click(screen.getByRole('button'));
  expect(onClick).toHaveBeenCalled();
});
```

### Step 2 — Green: Implement

```tsx
// mobile-drawer.tsx
'use client';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { lockBodyScroll, unlockBodyScroll } from '@/lib/body-scroll-lock';

export function MobileDrawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    lockBodyScroll();
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => { unlockBodyScroll(); window.removeEventListener('keydown', handler); };
  }, [open, onClose]);

  if (!open || typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 lg:hidden">
      <div data-testid="drawer-backdrop" className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className="absolute top-0 left-0 h-full w-[280px] overflow-y-auto bg-white shadow-xl dark:bg-gray-900"
      >
        {/* Focus trap implementation here */}
        {children}
      </aside>
    </div>,
    document.body,
  );
}
```

```tsx
// hamburger-button.tsx
'use client';
export function HamburgerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open navigation"
      className="rounded p-2 text-gray-500 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}
```

```ts
// body-scroll-lock.ts
let lockCount = 0;
let originalOverflow = '';

export function lockBodyScroll() {
  if (lockCount === 0) {
    originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount++;
}

export function unlockBodyScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) document.body.style.overflow = originalOverflow;
}
```

```tsx
// In AdminShell:
import { MobileDrawer } from './mobile-drawer';
import { HamburgerButton } from './hamburger-button';

export function AdminShell({ children, docsTree }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  // ...
  return (
    <>
      <Sidebar />
      <Topbar onMenuClick={() => setDrawerOpen(true)} />
      <main>{children}</main>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Sidebar /> {/* Same component, drawer mode */}
      </MobileDrawer>
    </>
  );
}
```

### Step 3 — Refactor + cleanup

- Delete `src/components/docs/mobile-nav.tsx` + `mobile-drawer.tsx`
- Remove imports from `[locale]/docs/layout.tsx`
- Add swipe-to-close (touchstart + touchmove + touchend) — optional, behind `// TODO Phase 8.5`
- Smooth animation: `transform: translateX(0)` from `-100%`, transition 200ms ease-out
- Auto-close drawer on route change (use `usePathname` effect)

## Success Criteria

- [ ] < lg (e.g., 375px): sidebar hidden, hamburger visible
- [ ] Click hamburger → drawer slides in 60fps
- [ ] Backdrop click → close
- [ ] Nav link click → drawer closes + navigate
- [ ] Esc → close
- [ ] Body scroll locked while open
- [ ] Focus trap works (Tab cycles within drawer)
- [ ] All touch targets ≥44px in drawer
- [ ] Reload preserves no broken state
- [ ] No layout shift on open/close
- [ ] All tests pass
- [ ] Deprecated docs mobile-nav/mobile-drawer removed
- [ ] Mobile Lighthouse Accessibility ≥ 95

## Risk Assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| createPortal SSR mismatch | Medium | Guard with `typeof window !== 'undefined'` or only render after mount |
| Body scroll lock conflicts với existing docs lock | Medium | Use lockCount pattern; remove docs locks during cleanup |
| Focus trap implementation buggy | Medium | Use simple impl with first/last focusable; or extract to `@headlessui/react` dialog |
| Animation flash on mount | Low | Use CSS transition with initial state in stylesheet |
| Swipe gesture conflicts với horizontal scroll content | Low | Defer swipe to optional polish phase |
| Drawer auto-close on nav breaks Cmd+K (also routes) | Low | Close drawer in router event listener, not link onClick |

## Next phase

Phase 9: sidebar scroll memory (sessionStorage).
