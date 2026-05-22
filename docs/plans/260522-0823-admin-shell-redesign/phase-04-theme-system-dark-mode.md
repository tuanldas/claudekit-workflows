---
phase: 4
title: "Theme system dark mode"
status: pending
priority: P2
effort: "1d"
dependencies: [1]
---

# Phase 4: Theme system dark mode

## Overview

Build theme system (light/dark/system) với CSS variables + Tailwind v4 `dark:` variants. No FOUC qua inline script trong `<head>`. Theme toggle component (3-state cycle) trong topbar. Persist `localStorage.theme`. Audit toàn bộ components để add dark variants.

## Requirements

**Functional:**
- 3 modes: `light`, `dark`, `system` (default `system`)
- `<ThemeToggle>` 3-state cycler: light → dark → system → light
- Persist `localStorage.theme` (key: `claudekit-theme`)
- `system` mode: respect `prefers-color-scheme` media query
- No FOUC: inline script set `<html class>` BEFORE React hydrate
- All shell components (sidebar, topbar, breadcrumb) support dark
- All workflow components support dark
- All docs components support dark (incl. Shiki theme swap nếu khả thi)
- Translation banner, code blocks, ReactFlow canvas: dark variants

**Non-functional:**
- Theme switch instant (no transition flash)
- No SSR/CSR mismatch
- Bundle increase < 2KB (lib only)

## Architecture

```
<html lang className={resolvedTheme}>   ← set by inline script BEFORE hydrate
  <head>
    <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
  </head>
  <body>
    <ThemeProvider initialTheme={fromCookie/localStorage}>
      <AdminShell>
        ...
        <ThemeToggle />   ← reads/writes theme via context
      </AdminShell>
    </ThemeProvider>
  </body>
</html>

ThemeContext:
- theme: 'light' | 'dark' | 'system'
- resolvedTheme: 'light' | 'dark' (computed from system if 'system')
- setTheme(theme): updates state + localStorage + html class
```

CSS structure (Tailwind v4 `@theme`):

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  --color-bg: theme(colors.gray.50);
  --color-bg-elevated: theme(colors.white);
  --color-text: theme(colors.gray.900);
  --color-text-muted: theme(colors.gray.500);
  --color-border: theme(colors.gray.200);
  --color-accent: theme(colors.orange.500);
}

.dark {
  --color-bg: theme(colors.gray.950);
  --color-bg-elevated: theme(colors.gray.900);
  --color-text: theme(colors.gray.100);
  --color-text-muted: theme(colors.gray.400);
  --color-border: theme(colors.gray.800);
  --color-accent: theme(colors.orange.400);
}

@variant dark (&:where(.dark, .dark *));
```

Components use `dark:` Tailwind variants. CSS vars used for canvas (ReactFlow), shiki theme swap.

## Related Code Files

**Create:**
- `src/lib/theme-context.tsx` — Provider + `useTheme()` hook (fill từ stub Phase 1)
- `src/lib/theme-init-script.ts` — exports stringified IIFE để inject `<head>`
- `src/components/shell/theme-toggle.tsx` — fill từ stub Phase 1
- Tests: `theme-context.test.tsx`, `theme-toggle.test.tsx`, `theme-init-script.test.ts`

**Modify:**
- `src/app/layout.tsx` (root) — inject inline script trong `<head>`
- `src/app/globals.css` — add CSS vars + dark mode block
- `src/components/shell/admin-shell.tsx` — dark variants
- `src/components/shell/sidebar.tsx` — dark variants
- `src/components/shell/topbar.tsx` — dark variants
- `src/components/workflow-card.tsx` — dark variants
- `src/components/workflow-detail.tsx` — dark variants
- `src/components/workflow-flow-canvas.tsx` — CSS vars for node bg/border
- `src/components/docs/docs-sidebar-item.tsx` — dark variants
- `src/components/docs/translation-banner.tsx` — dark variants
- `src/lib/mdx-compile.ts` — **REPLACE** single `theme: "github-light"` với `themes: { light: "github-light", dark: "github-dark" }` + `defaultColor: false`. Shiki sẽ emit CSS vars cho both themes, swap qua `.dark` class. <!-- Updated: Validation Session 1 - Shiki dual theme strategy -->
- `src/components/docs/code-block.tsx` — verify dark CSS vars applied (no change needed nếu Shiki dual theme works)
- `src/i18n/translations.ts` — add `theme.light`, `theme.dark`, `theme.system` labels

## Implementation Steps (TDD)

### Step 1 — Red: Tests

```tsx
// theme-context.test.tsx
it('defaults to system', () => {
  const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
  expect(result.current.theme).toBe('system');
});

it('persists to localStorage on change', async () => {
  const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
  act(() => result.current.setTheme('dark'));
  expect(localStorage.getItem('claudekit-theme')).toBe('dark');
});

it('resolves system to light or dark based on matchMedia', () => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() });
  const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
  expect(result.current.resolvedTheme).toBe('dark');
});

it('applies html.dark class when resolved dark', () => {
  // ... test classList manipulation
});
```

```tsx
// theme-toggle.test.tsx
it('cycles light → dark → system → light on click', async () => {
  render(<ThemeToggle />, { wrapper: ThemeProvider });
  const btn = screen.getByRole('button', { name: /toggle theme/i });
  await userEvent.click(btn); // → dark
  expect(localStorage.getItem('claudekit-theme')).toBe('dark');
  await userEvent.click(btn); // → system
  expect(localStorage.getItem('claudekit-theme')).toBe('system');
  await userEvent.click(btn); // → light
  expect(localStorage.getItem('claudekit-theme')).toBe('light');
});

it('shows correct icon per mode', () => {
  // sun for light, moon for dark, monitor for system
});
```

```ts
// theme-init-script.test.ts
it('returns IIFE string that reads localStorage and sets class', () => {
  const script = getThemeInitScript();
  expect(script).toContain("localStorage.getItem('claudekit-theme')");
  expect(script).toContain("document.documentElement.classList.add");
});
```

### Step 2 — Green: Implement

```tsx
// src/lib/theme-context.tsx
'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (t: Theme) => void;
} | null>(null);

const STORAGE_KEY = 'claudekit-theme';

function getSystemTheme(): ResolvedTheme {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) || 'system';
    setThemeState(stored);
  }, []);

  useEffect(() => {
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    setResolvedTheme(resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        const next = e.matches ? 'dark' : 'light';
        setResolvedTheme(next);
        document.documentElement.classList.toggle('dark', next === 'dark');
      };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
  }, []);

  return <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}
```

```ts
// src/lib/theme-init-script.ts
export function getThemeInitScript() {
  return `
(function() {
  try {
    var t = localStorage.getItem('claudekit-theme') || 'system';
    var dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();`.trim();
}
```

```tsx
// src/app/layout.tsx (root)
import { getThemeInitScript } from '@/lib/theme-init-script';
export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// theme-toggle.tsx
'use client';
import { useTheme } from '@/lib/theme-context';
import { Sun, Moon, Monitor } from 'lucide-react'; // or inline SVGs

const cycle = { light: 'dark', dark: 'system', system: 'light' } as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  return (
    <button
      type="button"
      onClick={() => setTheme(cycle[theme])}
      aria-label={`Toggle theme (current: ${theme})`}
      className="rounded p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
```

### Step 2.5 — Shiki dual theme refactor (added per Validation Session 1)

Modify `src/lib/mdx-compile.ts`:

```ts
// Before
import rehypeShiki from '@shikijs/rehype';
// ...
.use(rehypeShiki, { theme: 'github-light' })

// After
.use(rehypeShiki, {
  themes: { light: 'github-light', dark: 'github-dark' },
  defaultColor: false,  // emit CSS vars instead of inline color
})
```

Add CSS to handle theme swap in `src/app/globals.css`:

```css
/* Shiki dual theme vars */
.shiki, .shiki span {
  color: var(--shiki-light);
  background-color: var(--shiki-light-bg);
}
.dark .shiki, .dark .shiki span {
  color: var(--shiki-dark);
  background-color: var(--shiki-dark-bg);
}
```

Test: render docs page với code block trên cả light + dark mode, verify token colors swap correctly.

### Step 3 — Refactor + Audit

Audit components để add `dark:` variants:
- Run script: `grep -rL "dark:" src/components/` để list components chưa có dark variants
- Replace `text-gray-900` → `text-gray-900 dark:text-gray-100`
- Replace `bg-white` → `bg-white dark:bg-gray-900`
- Replace `border-gray-200` → `border-gray-200 dark:border-gray-800`
- ReactFlow nodes: use CSS vars `var(--color-bg-elevated)` / `var(--color-border)`

## Success Criteria

- [ ] Theme toggle cycles 3 modes, persists localStorage
- [ ] Reload preserves theme (no FOUC: html class set before hydrate)
- [ ] `system` mode: change OS preference → app reflects within 100ms
- [ ] All shell, workflow, docs components render correctly trong dark mode
- [ ] ReactFlow canvas: nodes có dark bg/border
- [ ] Shiki code blocks: dual themes via CSS vars swap (`github-light` / `github-dark`), verified trên 3+ docs pages có code blocks <!-- Updated: Validation Session 1 - Shiki dual theme confirmed -->
- [ ] No SSR/CSR mismatch warning
- [ ] All tests pass
- [ ] Bundle size increase < 2KB

## Risk Assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| FOUC trên slow connection | High | Inline script (no network); test với DevTools throttle |
| SSR mismatch khi resolvedTheme khác giữa server và client | High | Server defaults `light`; client script sets actual before React hydrate; `useEffect` syncs |
| ReactFlow `attribution` overlay không dark | Low | Override với CSS targeting `.react-flow__attribution` |
| Shiki dual theme breaks existing code-block rendering | Low | Step 2.5 explicit migration với CSS var fallback; regression test trên 3+ docs pages có code blocks <!-- Updated: Validation Session 1 - dual theme task added --> |
| User script blocker disables inline `<script>` | Low | CSP-friendly: use `nonce` attribute nếu strict CSP |
| Lucide-react bundle nặng | Low | Inline SVGs hoặc dùng react-icons subset |

## Next phase

Phase 5: Skills index build pipeline (scan ~/.claude/skills/).
