---
phase: 5
title: "Skills index build pipeline"
status: pending
priority: P1
effort: "1d"
dependencies: []
---

# Phase 5: Skills index build pipeline

## Overview

Build-time script scan `~/.claude/skills/**/SKILL.md`, parse frontmatter + content, output `src/data/skills-index.json` (consumable by Next.js). Add `npm run build:skills` script + chain vào `npm run build`. Handle Vercel/CI scenario (folder không tồn tại) — gracefully fallback empty array với log warning. **NOT committed** vào git (gitignored) — production sẽ show empty skills catalog cho đến khi sync setup. <!-- Updated: Validation Session 1 -->

## Requirements

**Functional:**
- Script `scripts/build-skills-index.ts` glob `~/.claude/skills/**/SKILL.md`
- Parse frontmatter (gray-matter) — extract `name`, `description`, `tags`, `plugin`
- Fallback nếu frontmatter missing: `name` = folder name, `description` = first paragraph
- Output JSON: `src/data/skills-index.json` (array của Skill objects)
- Detect `SKILLS_DIR` env override (CI/local custom path)
- Nếu folder không tồn tại: log warning, output empty array, exit 0 (no fail build) — **chiến lược chính cho Vercel/CI** (no commit JSON to git) <!-- Updated: Validation Session 1 - skip-if-missing is primary strategy -->
- Group by parent folder (engineer/marketing/ckm/etc.)
- Track full SKILL.md content path để skill detail page có thể read

**Non-functional:**
- Script chạy < 2s trên 130+ skills
- Cache mtime-based: skip rebuild nếu source unchanged
- Output JSON < 500KB (compress nếu lớn hơn)

## Architecture

```
scripts/build-skills-index.ts
   ↓ env SKILLS_DIR (default: $HOME/.claude/skills)
   ↓ exists check → if false, log warn + write empty array → exit 0
   ↓ glob: ${SKILLS_DIR}/**/SKILL.md (max-depth 3)
   ↓ for each:
   │   - read file (utf8)
   │   - gray-matter(content) → frontmatter + body
   │   - extract group = path.dirname relative to SKILLS_DIR (first segment)
   │   - id = folder name (kebab-case)
   │   - body excerpt (first 300 chars) for search index
   ↓ sort by group + name
   ↓ write src/data/skills-index.json
   ↓ also write src/data/skills-content/{id}.md (full body for skill detail)
```

JSON shape:

```ts
// src/types/skill.ts
export interface Skill {
  id: string;
  name: string;
  description: string;
  tags: string[];
  group: string;          // "engineer", "marketing", "ckm", ...
  plugin?: string;        // "anthropic-skills", "ck", ...
  path: string;           // relative to SKILLS_DIR (for detail read)
  excerpt: string;        // first 300 chars of body
}
```

## Related Code Files

**Create:**
- `scripts/build-skills-index.ts`
- `src/types/skill.ts`
- `src/lib/skills-loader.ts` — read `skills-index.json` + `skills-content/{id}.md` at request time
- `src/data/skills-index.json` (generated; commit vào git)
- `src/data/skills-content/` (generated dir; commit vào git nếu < 500 files, else gitignore + CI rebuild)
- Tests: `scripts/build-skills-index.test.ts`, `src/lib/skills-loader.test.ts`

**Modify:**
- `package.json` — add scripts:
  - `"build:skills": "tsx scripts/build-skills-index.ts"`
  - Update `"build"`: `"npm run build:skills && npm run build:search && next build"`
  - **NO** `dev:skills` watch mode (per Validation Session 1 — manual rebuild only)
- `.gitignore` — add `src/data/skills-index.json` + `src/data/skills-content/` (NOT committed; production sẽ empty array nếu CI không setup skills sync) <!-- Updated: Validation Session 1 -->
- `scripts/build-search-index.ts` — extend để consume `skills-index.json` (add skills vào search corpus)

## Implementation Steps (TDD)

### Step 1 — Red: Tests

```ts
// scripts/build-skills-index.test.ts
import { buildSkillsIndex } from './build-skills-index';
import * as fs from 'node:fs';
import * as path from 'node:path';

const FIXTURE_DIR = path.join(__dirname, '__fixtures__/skills');

beforeAll(() => {
  fs.mkdirSync(`${FIXTURE_DIR}/engineer/test-skill`, { recursive: true });
  fs.writeFileSync(`${FIXTURE_DIR}/engineer/test-skill/SKILL.md`, `---
name: test-skill
description: A test skill
tags: [test, demo]
---
# Body content here`);
});

afterAll(() => fs.rmSync(FIXTURE_DIR, { recursive: true, force: true }));

it('discovers SKILL.md files', async () => {
  const result = await buildSkillsIndex({ skillsDir: FIXTURE_DIR });
  expect(result.skills).toHaveLength(1);
  expect(result.skills[0].id).toBe('test-skill');
  expect(result.skills[0].group).toBe('engineer');
});

it('parses frontmatter correctly', async () => {
  const result = await buildSkillsIndex({ skillsDir: FIXTURE_DIR });
  expect(result.skills[0]).toMatchObject({
    name: 'test-skill',
    description: 'A test skill',
    tags: ['test', 'demo'],
  });
});

it('returns empty array if dir not exists', async () => {
  const result = await buildSkillsIndex({ skillsDir: '/nonexistent/path' });
  expect(result.skills).toEqual([]);
  expect(result.warning).toContain('not exist');
});

it('falls back to folder name when frontmatter missing name', async () => {
  fs.mkdirSync(`${FIXTURE_DIR}/marketing/no-meta`, { recursive: true });
  fs.writeFileSync(`${FIXTURE_DIR}/marketing/no-meta/SKILL.md`, `# Just body, no frontmatter`);
  const result = await buildSkillsIndex({ skillsDir: FIXTURE_DIR });
  const noMeta = result.skills.find(s => s.id === 'no-meta');
  expect(noMeta?.name).toBe('no-meta');
});
```

```ts
// src/lib/skills-loader.test.ts
it('loads skills from JSON', async () => {
  const skills = await loadSkills();
  expect(Array.isArray(skills)).toBe(true);
});

it('loads single skill content by id', async () => {
  const content = await loadSkillContent('test-skill');
  expect(content).toContain('Body content');
});
```

### Step 2 — Green: Implement

```ts
// scripts/build-skills-index.ts
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { existsSync } from 'node:fs';
import { glob } from 'glob';
import matter from 'gray-matter';
import os from 'node:os';

interface Options {
  skillsDir?: string;
  outputDir?: string;
}

interface Skill {
  id: string;
  name: string;
  description: string;
  tags: string[];
  group: string;
  plugin?: string;
  path: string;
  excerpt: string;
}

export async function buildSkillsIndex(opts: Options = {}) {
  const skillsDir = opts.skillsDir ?? process.env.SKILLS_DIR ?? path.join(os.homedir(), '.claude/skills');
  const outputDir = opts.outputDir ?? path.join(process.cwd(), 'src/data');
  const contentDir = path.join(outputDir, 'skills-content');

  if (!existsSync(skillsDir)) {
    const warning = `Skills directory ${skillsDir} does not exist — writing empty index`;
    console.warn('[build:skills]', warning);
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(path.join(outputDir, 'skills-index.json'), JSON.stringify([], null, 2));
    return { skills: [], warning };
  }

  const files = await glob('**/SKILL.md', { cwd: skillsDir, absolute: false });
  const skills: Skill[] = [];
  await fs.mkdir(contentDir, { recursive: true });

  for (const rel of files) {
    const abs = path.join(skillsDir, rel);
    const raw = await fs.readFile(abs, 'utf-8');
    const { data, content } = matter(raw);
    const segments = rel.split(path.sep);
    const folderName = segments[segments.length - 2];
    const group = segments.length > 1 ? segments[0] : 'root';

    const id = folderName;
    const name = data.name ?? folderName;
    const description = data.description ?? extractFirstParagraph(content) ?? '';
    const tags = Array.isArray(data.tags) ? data.tags : [];
    const plugin = data.plugin;
    const excerpt = content.slice(0, 300).replace(/\n+/g, ' ').trim();

    skills.push({ id, name, description, tags, group, plugin, path: rel, excerpt });
    await fs.writeFile(path.join(contentDir, `${id}.md`), content);
  }

  skills.sort((a, b) => (a.group + a.name).localeCompare(b.group + b.name));
  await fs.writeFile(path.join(outputDir, 'skills-index.json'), JSON.stringify(skills, null, 2));
  console.log(`[build:skills] Indexed ${skills.length} skills from ${skillsDir}`);
  return { skills };
}

function extractFirstParagraph(content: string): string | null {
  const match = content.match(/^(?:#+ .+\n+)?([^\n].+?)(?:\n\n|$)/);
  return match ? match[1].trim() : null;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildSkillsIndex().catch(err => { console.error(err); process.exit(1); });
}
```

```ts
// src/lib/skills-loader.ts
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { unstable_cache } from 'next/cache';
import type { Skill } from '@/types/skill';

export const loadSkills = unstable_cache(
  async (): Promise<Skill[]> => {
    const file = path.join(process.cwd(), 'src/data/skills-index.json');
    try {
      const raw = await fs.readFile(file, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },
  ['skills-index'],
  { revalidate: false, tags: ['skills'] },
);

export async function loadSkillContent(id: string): Promise<string | null> {
  const file = path.join(process.cwd(), 'src/data/skills-content', `${id}.md`);
  try {
    return await fs.readFile(file, 'utf-8');
  } catch {
    return null;
  }
}
```

### Step 3 — Refactor

- Add mtime cache: skip re-write nếu source mtime <= JSON mtime
- Update `scripts/build-search-index.ts` để merge skills vào search corpus
- Confirm `.gitignore` includes `src/data/skills-index.json` + `src/data/skills-content/`
- Verify `npm run build` chain works (Vercel = empty array, no fail)

## Success Criteria

- [ ] `npm run build:skills` scans local `~/.claude/skills/` → outputs `src/data/skills-index.json`
- [ ] JSON contains 100+ skills (verify count)
- [ ] Each entry has id, name, description, group, path
- [ ] Empty/missing dir → empty array, exit 0, warning logged
- [ ] `npm run build` chain works on Vercel (empty array fallback, no fail) <!-- Updated: Validation Session 1 -->
- [ ] All tests pass với fixture directory
- [ ] Script runs < 2s on 130+ files
- [ ] Production build (Vercel) success với empty skills array (no ~/.claude/skills/) <!-- Updated: Validation Session 1 -->

## Risk Assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| Vercel build không có `~/.claude/skills/` | Accepted | Skip-if-missing → empty array. Production skills catalog hiển thị empty state "Skills sync not configured" cho đến khi GitHub Action sync hoặc manual JSON push setup. <!-- Updated: Validation Session 1 - accepted strategy --> |
| `glob@13` API drift từ v8/v9 | Medium | Pin version; test với fixture |
| Frontmatter inconsistent across skills (some YAML invalid) | Medium | Try/catch matter, fallback graceful |
| `skills-content/` 130+ files inflate repo size | Medium | Measure (~150KB total likely OK); gitignore + CI rebuild nếu > 5MB |
| Plugin prefix `anthropic-skills:` không handle | Low | Detect in frontmatter, expose as `plugin` field; UI filter sau |
| Symlinks trong skills dir cause infinite recursion | Low | glob default `follow: false` |

## Next phase

Phase 6: Skills catalog pages (`/skills` grid + `/skills/[id]` detail).
