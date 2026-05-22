---
phase: 7
title: "Command palette Cmd-K"
status: pending
priority: P2
effort: "1d"
dependencies: [2, 3, 6]
---

# Phase 7: Command palette Cmd-K

## Overview

Build global Cmd+K palette dùng `cmdk` library (đã có) + `flexsearch` (đã có). Index 3 sources: Workflows (39) + Docs pages + Skills (130+). Modal portal, grouped results (Workflows · Docs · Skills), Enter navigate. Track recent searches localStorage.

## Requirements

**Functional:**
- Cmd+K / Ctrl+K mở modal palette (anywhere in app)
- Esc đóng
- Search input auto-focus
- Search across 3 sources, group results
- Each result row: icon (workflow/doc/skill) + title + subtitle
- Arrow keys navigate, Enter selects → router.push
- Recent searches (top 5) hiển thị khi input empty
- Clear recent button
- Topbar trigger button cũng mở palette
- No conflict với Safari Cmd+K (clear console) — preventDefault chỉ khi app focused

**Non-functional:**
- Open < 50ms
- Search 200+ items < 100ms (flexsearch)
- Modal portal vào `document.body` (no z-index issues)
- Keyboard-only accessible

## Architecture

```
<CommandPalette>            ← global mount in AdminShell
  modal state via context CommandPaletteContext
  ├── search input (cmdk Input)
  ├── if !query: <RecentSearches />
  ├── if query:
  │   ├── <Group heading="Workflows">
  │   │   └── filtered workflows
  │   ├── <Group heading="Docs">
  │   │   └── filtered docs pages
  │   └── <Group heading="Skills">
  │       └── filtered skills
  └── footer hints (↑↓ nav, ↵ select, esc close)

Sources indexed via flexsearch.Document index:
  - Workflows: id, title.vi, title.en, description.vi, description.en
  - Docs: slug, title (frontmatter), excerpt
  - Skills: id, name, description, tags

Index built at build time via scripts/build-search-index.ts (extend existing)
Loaded client-side from /api/search-index.json (or static import)
```

## Related Code Files

**Create:**
- `src/components/shell/command-palette.tsx` — modal + cmdk
- `src/components/shell/command-palette-context.tsx` — open/close state, recent searches
- `src/components/shell/command-palette-trigger.tsx` — fill từ stub Phase 1
- `src/lib/use-command-palette-shortcut.ts` — global Cmd+K listener hook
- `src/lib/recent-searches.ts` — localStorage helper
- Tests: `command-palette.test.tsx`, `command-palette-context.test.tsx`, `recent-searches.test.ts`

**Modify:**
- `scripts/build-search-index.ts` — extend index: workflows + skills (currently docs-only)
- `src/lib/search-client.ts` — extend search across 3 corpora
- `src/components/shell/admin-shell.tsx` — mount `<CommandPalette />` (portal)
- `src/i18n/translations.ts` — add `palette.placeholder`, `palette.recent`, `palette.empty`, `palette.workflowsGroup`, `palette.docsGroup`, `palette.skillsGroup`

## Implementation Steps (TDD)

### Step 1 — Red: Tests

```tsx
// command-palette.test.tsx
it('opens on Cmd+K', async () => {
  render(<AppWithPalette />);
  await userEvent.keyboard('{Meta>}k{/Meta}');
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});

it('closes on Escape', async () => {
  render(<AppWithPalette />, { initialOpen: true });
  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

it('shows grouped results', async () => {
  render(<AppWithPalette />, { initialOpen: true });
  await userEvent.type(screen.getByRole('combobox'), 'plan');
  expect(screen.getByText('Workflows')).toBeInTheDocument();
  expect(screen.getByText('Docs')).toBeInTheDocument();
  expect(screen.getByText('Skills')).toBeInTheDocument();
});

it('navigates on Enter', async () => {
  const push = vi.fn();
  vi.mocked(useRouter).mockReturnValue({ push } as any);
  render(<AppWithPalette />, { initialOpen: true });
  await userEvent.type(screen.getByRole('combobox'), 'core');
  await userEvent.keyboard('{Enter}');
  expect(push).toHaveBeenCalled();
});

it('shows recent searches when query empty', () => {
  localStorage.setItem('claudekit-recent-searches', JSON.stringify(['plan', 'cook']));
  render(<AppWithPalette />, { initialOpen: true });
  expect(screen.getByText('plan')).toBeInTheDocument();
  expect(screen.getByText('cook')).toBeInTheDocument();
});

it('saves recent search on selection', async () => {
  render(<AppWithPalette />, { initialOpen: true });
  await userEvent.type(screen.getByRole('combobox'), 'core');
  await userEvent.keyboard('{Enter}');
  const recent = JSON.parse(localStorage.getItem('claudekit-recent-searches') || '[]');
  expect(recent[0]).toBe('core');
});
```

```ts
// recent-searches.test.ts
it('stores up to 5 most recent', () => {
  for (let i = 0; i < 7; i++) saveRecentSearch(`q${i}`);
  expect(getRecentSearches()).toHaveLength(5);
  expect(getRecentSearches()[0]).toBe('q6');
});

it('dedupes', () => {
  saveRecentSearch('a');
  saveRecentSearch('b');
  saveRecentSearch('a');
  expect(getRecentSearches()).toEqual(['a', 'b']);
});
```

### Step 2 — Green: Implement

```tsx
// command-palette.tsx
'use client';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useCommandPalette } from './command-palette-context';
import { useSearch } from '@/lib/search-client';

export function CommandPalette() {
  const { open, setOpen, query, setQuery } = useCommandPalette();
  const results = useSearch(query);
  const router = useRouter();

  if (!open) return null;

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Command Palette">
      <Command.Input
        value={query}
        onValueChange={setQuery}
        placeholder="Search workflows, docs, skills…"
      />
      <Command.List>
        {!query && <RecentSearches onSelect={setQuery} />}
        {query && (
          <>
            <Command.Group heading="Workflows">
              {results.workflows.map(w => (
                <Command.Item
                  key={w.id}
                  onSelect={() => { saveRecentSearch(query); router.push(`/${locale}/workflows?selected=${w.id}`); setOpen(false); }}
                >
                  {w.title}
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Group heading="Docs">{/* ... */}</Command.Group>
            <Command.Group heading="Skills">{/* ... */}</Command.Group>
            <Command.Empty>No results</Command.Empty>
          </>
        )}
      </Command.List>
      <div className="palette-footer">↑↓ nav · ↵ select · esc close</div>
    </Command.Dialog>
  );
}
```

```tsx
// command-palette-context.tsx
'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface Ctx { open: boolean; setOpen: (b: boolean) => void; query: string; setQuery: (s: string) => void; }
const CommandPaletteContext = createContext<Ctx | null>(null);

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return <CommandPaletteContext.Provider value={{ open, setOpen, query, setQuery }}>{children}</CommandPaletteContext.Provider>;
}

export const useCommandPalette = () => {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) throw new Error('useCommandPalette must be inside provider');
  return ctx;
};
```

```ts
// src/lib/recent-searches.ts
const KEY = 'claudekit-recent-searches';
const MAX = 5;

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function saveRecentSearch(query: string) {
  if (!query.trim()) return;
  const current = getRecentSearches().filter(q => q !== query);
  current.unshift(query);
  localStorage.setItem(KEY, JSON.stringify(current.slice(0, MAX)));
}

export function clearRecentSearches() {
  localStorage.removeItem(KEY);
}
```

Extend `scripts/build-search-index.ts` để index 3 corpora vào single flexsearch.Document.

### Step 3 — Refactor

- Add palette trigger button trong topbar (Phase 1 stub fill)
- Optimize: useDeferredValue cho query (smooth typing)
- Add icons per result type (workflow / doc / skill)
- Mobile palette: full-screen modal instead of centered
- Verify no SSR mismatch (palette client-only)

## Success Criteria

- [ ] Cmd+K mở palette anywhere
- [ ] Cmd+K trên Safari: app focused → mở palette, not browser console clear
- [ ] Esc close
- [ ] Search "plan" trả results từ cả 3 sources, grouped
- [ ] Enter on result navigate đúng URL
- [ ] Recent searches show khi empty, up to 5
- [ ] Topbar trigger button cũng mở palette
- [ ] Palette responsive mobile (full screen)
- [ ] All tests pass
- [ ] Search latency < 100ms

## Risk Assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| flexsearch index merge 3 corpora schema mismatch | Medium | Use Document index with shared `type` field; tag results by source |
| Cmd+K Safari console clear bypass | High | preventDefault on document only when no input focused; or use Cmd+/ alternative |
| Palette opens on text input fields | Medium | Check event.target trong handler — skip if input/textarea/contenteditable |
| Index file size > 1MB | Medium | Compress JSON; lazy-load on first open |
| SSR mismatch with localStorage recent searches | Medium | Render recent only after mounted (useEffect hydration guard) |
| cmdk styling clash with Tailwind | Low | Use unstyled cmdk, full Tailwind control |

## Next phase

Phase 8: mobile drawer (hamburger → slide-over).
