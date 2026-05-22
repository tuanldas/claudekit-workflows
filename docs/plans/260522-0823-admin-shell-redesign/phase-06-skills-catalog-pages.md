---
phase: 6
title: "Skills catalog pages"
status: pending
priority: P2
effort: "1d"
dependencies: [1, 5]
---

# Phase 6: Skills catalog pages

## Overview

Build 2 routes: `/[locale]/skills` (catalog grid với group filter + search) và `/[locale]/skills/[id]` (skill detail render SKILL.md content qua MDX pipeline). Fill `SidebarSkillsNav` stub với grouped skill list. Reuse `mdx-compile.ts` từ docs cho consistent rendering.

## Requirements

**Functional:**
- `/[locale]/skills` — grid skill cards (name, group badge, description, tags)
- Group filter dropdown (engineer, marketing, ckm, etc.)
- Search box inline (kết hợp client-side filter)
- `/[locale]/skills/[id]` — render full SKILL.md content via MDX
- Skill detail có header (name, group, plugin badge, tags) + FloatingToc reuse
- `<SidebarSkillsNav>` render skills grouped (collapse groups, click skill → navigate)
- 404 nếu skill id không tồn tại
- Breadcrumb đúng: `Skills > {group} > {name}`

**Non-functional:**
- Skills grid load < 200ms cho 130+ items
- Skill detail render < 100ms (server-rendered)
- Sidebar skills nav scroll OK với 130+ items (virtual not needed dưới 200)

## Architecture

```
/[locale]/skills/page.tsx (server)
   ↓ loadSkills() → 130+ Skill[]
   ↓ render <SkillsCatalogContent skills={skills} />

SkillsCatalogContent (client)
  ├── group filter dropdown
  ├── search box (client-side filter)
  └── grid of <SkillCard />

/[locale]/skills/[id]/page.tsx (server)
   ↓ loadSkills() → find by id → if not found, notFound()
   ↓ loadSkillContent(id) → SKILL.md body
   ↓ compileMdx(body) → MDX JSX
   ↓ render <SkillDetailPage skill={skill} content={JSX} />

SkillDetailPage
  ├── <SkillHeader> (name, badges, tags)
  ├── article (MDX rendered content)
  └── FloatingToc (reused)

SidebarSkillsNav (shell sidebar)
  ├── search input (instant filter)
  └── grouped list (collapsible per group)
      └── <Link> to /[locale]/skills/[id], aria-current if active
```

## Related Code Files

**Create:**
- `src/app/[locale]/skills/page.tsx`
- `src/app/[locale]/skills/[id]/page.tsx`
- `src/components/skills/skills-catalog-content.tsx`
- `src/components/skills/skill-card.tsx`
- `src/components/skills/skill-detail-page.tsx`
- `src/components/skills/skill-header.tsx`
- `src/components/skills/skill-group-badge.tsx`
- `src/components/skills/skill-plugin-badge.tsx` — plugin badge (ck / gstack / anthropic-skills / etc.) <!-- Updated: Validation Session 1 - gstack included with badge -->
- Tests: `skill-card.test.tsx`, `skills-catalog-content.test.tsx`, `skill-detail-page.test.tsx`, `sidebar-skills-nav.test.tsx`

**Modify:**
- `src/components/shell/sidebar-skills-nav.tsx` — fill từ stub: server-fetch skills, render grouped list
- `src/app/[locale]/layout.tsx` — pass skills (or fetch inside SidebarSkillsNav server component pattern as phase 3)
- `src/lib/mdx-compile.ts` — verify accepts arbitrary content (no path-specific assumptions)
- `src/i18n/translations.ts` — add `skills.title`, `skills.searchPlaceholder`, `skills.groupFilter`, `skills.empty`, `skills.emptyCi` ("Skills sync not configured")

**Skill detail MVP scope (per Validation Session 1):**
- ✅ Copy button on code blocks (reuse existing `src/components/docs/code-block.tsx` via shared MDX components map)
- ❌ Internal link rewrite — deferred
- ❌ "Open in Claude" deep link — deferred
- ❌ "Edit on GitHub" link — deferred
- ✅ Plugin badge on `SkillCard` + `SkillHeader` (engineer / marketing / ck / gstack / anthropic-skills) <!-- Updated: Validation Session 1 - MVP scope locked -->

## Implementation Steps (TDD)

### Step 1 — Red: Tests

```tsx
// skill-card.test.tsx
const fixtureSkill: Skill = { id: 'ck-plan', name: 'ck-plan', description: 'Planning skill', tags: ['planning'], group: 'engineer', path: 'engineer/ck-plan/SKILL.md', excerpt: '...' };

it('renders skill name + group + description', () => {
  render(<SkillCard skill={fixtureSkill} locale="vi" />);
  expect(screen.getByText('ck-plan')).toBeInTheDocument();
  expect(screen.getByText('engineer')).toBeInTheDocument();
  expect(screen.getByText('Planning skill')).toBeInTheDocument();
});

it('links to skill detail', () => {
  render(<SkillCard skill={fixtureSkill} locale="vi" />);
  expect(screen.getByRole('link')).toHaveAttribute('href', '/vi/skills/ck-plan');
});
```

```tsx
// skills-catalog-content.test.tsx
it('filters by group', async () => {
  render(<SkillsCatalogContent skills={fixtureSkills} locale="vi" />);
  await userEvent.selectOptions(screen.getByLabelText(/group/i), 'engineer');
  expect(screen.getAllByRole('article')).toHaveLength(engineerCount);
});

it('filters by search query', async () => {
  render(<SkillsCatalogContent skills={fixtureSkills} locale="vi" />);
  await userEvent.type(screen.getByPlaceholderText(/search/i), 'plan');
  expect(screen.queryAllByRole('article').length).toBeLessThan(fixtureSkills.length);
});

it('shows empty state when no match', async () => {
  render(<SkillsCatalogContent skills={fixtureSkills} locale="vi" />);
  await userEvent.type(screen.getByPlaceholderText(/search/i), 'nonexistent-xyz');
  expect(screen.getByText(/no skills/i)).toBeInTheDocument();
});
```

```tsx
// skill-detail-page.test.tsx
it('renders skill header with name + tags', () => {
  render(<SkillDetailPage skill={fixtureSkill} content={<div>Body</div>} />);
  expect(screen.getByRole('heading', { name: 'ck-plan' })).toBeInTheDocument();
  expect(screen.getByText('Body')).toBeInTheDocument();
});

// integration test for page.tsx
it('returns 404 for unknown id', async () => {
  await expect(SkillDetailRoute({ params: Promise.resolve({ id: 'unknown' }) })).rejects.toThrow();
});
```

```tsx
// sidebar-skills-nav.test.tsx
it('groups skills by group', () => {
  render(<SidebarSkillsNav skills={fixtureSkills} locale="vi" />);
  expect(screen.getByText('engineer')).toBeInTheDocument();
  expect(screen.getByText('marketing')).toBeInTheDocument();
});

it('filters by inline search', async () => {
  render(<SidebarSkillsNav skills={fixtureSkills} locale="vi" />);
  await userEvent.type(screen.getByPlaceholderText(/filter/i), 'plan');
  expect(screen.getByText('ck-plan')).toBeInTheDocument();
});
```

### Step 2 — Green: Implement

```tsx
// src/app/[locale]/skills/page.tsx
import { loadSkills } from '@/lib/skills-loader';
import { SkillsCatalogContent } from '@/components/skills/skills-catalog-content';

export default async function SkillsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const skills = await loadSkills();
  return <SkillsCatalogContent skills={skills} locale={locale as Locale} />;
}
```

```tsx
// src/app/[locale]/skills/[id]/page.tsx
import { notFound } from 'next/navigation';
import { loadSkills, loadSkillContent } from '@/lib/skills-loader';
import { compileMdx } from '@/lib/mdx-compile';
import { SkillDetailPage } from '@/components/skills/skill-detail-page';

export default async function SkillDetailRoute({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const skills = await loadSkills();
  const skill = skills.find(s => s.id === id);
  if (!skill) notFound();
  const content = await loadSkillContent(id);
  if (!content) notFound();
  const { default: Content } = await compileMdx(content);
  return <SkillDetailPage skill={skill} content={<Content />} locale={locale as Locale} />;
}

export async function generateStaticParams() {
  const skills = await loadSkills();
  return skills.flatMap(s => [{ locale: 'vi', id: s.id }, { locale: 'en', id: s.id }]);
}
```

```tsx
// skill-card.tsx
import Link from 'next/link';
export function SkillCard({ skill, locale }: { skill: Skill; locale: Locale }) {
  return (
    <Link
      href={`/${locale}/skills/${skill.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-orange-300 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <article>
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{skill.name}</h3>
          <SkillGroupBadge group={skill.group} />
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 dark:text-gray-400">{skill.description}</p>
        {skill.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {skill.tags.slice(0, 3).map(t => (
              <span key={t} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">{t}</span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
```

```tsx
// sidebar-skills-nav.tsx (server: fetch + render)
import { loadSkills } from '@/lib/skills-loader';
import { SidebarSkillsNavClient } from './sidebar-skills-nav-client';

export async function SidebarSkillsNav({ locale }: { locale: Locale }) {
  const skills = await loadSkills();
  return <SidebarSkillsNavClient skills={skills} locale={locale} />;
}
```

Pass through same pattern như docs tree (Phase 3).

### Step 3 — Refactor

- Memoize group counts for filter dropdown
- Add empty state assets
- Verify Shiki code highlight works trong SKILL.md (since same MDX pipeline)
- Test 5-10 mẫu SKILL.md từ thực tế (`~/.claude/skills/ck-plan/SKILL.md`, `~/.claude/skills/copywriting/SKILL.md`, etc.) for edge cases

## Success Criteria

- [ ] `/vi/skills` renders catalog grid (130+ cards)
- [ ] Group filter narrows results
- [ ] Search input filters by name/description/tags
- [ ] Click skill card → navigate to detail
- [ ] `/vi/skills/ck-plan` renders SKILL.md content via MDX
- [ ] Skill detail có header (name, group, tags) + content
- [ ] Floating TOC works trên skill detail (reuse from Phase 3)
- [ ] `/vi/skills/nonexistent` returns 404
- [ ] Sidebar skills nav grouped + search filter works
- [ ] Sidebar highlights active skill (`aria-current`)
- [ ] Dark mode works trên cả 2 pages
- [ ] All tests pass

## Risk Assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| SKILL.md có pattern khác docs (no frontmatter, large code blocks) | Medium | Fallback frontmatter trong loader; cap content render với scroll; test 10 mẫu |
| 130+ skills load chậm SSR | Low | `unstable_cache` + JSON parse fast; consider edge runtime |
| `generateStaticParams` produces 260+ routes (130 × 2 locales) | Low | Build time acceptable (<30s); skip if quá nhiều |
| Mdx compile fail trên specific SKILL.md (invalid syntax) | High | Try/catch trong page.tsx; fallback "Could not render — view source" link |
| Search index trong sidebar nav re-runs each keystroke | Medium | Debounce 100ms hoặc useDeferredValue |
| SKILL.md có links sang ~/.claude paths → broken | Medium | Document limitation; Phase 7 might rewrite some links |

## Next phase

Phase 7: Command palette (Cmd+K) global search across Workflows/Docs/Skills.
