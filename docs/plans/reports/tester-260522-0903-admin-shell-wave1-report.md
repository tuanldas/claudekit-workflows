---
date: 2026-05-22
tester: tester
team: admin-shell-wave1
branch: main
head: 9e0762917b5d3ab485255adf106da772502eada5
plan: docs/plans/260522-0823-admin-shell-redesign/
verdict: PASS
---

# Wave 1 Verification Report — admin-shell-redesign

## Scope

Verify merged Wave 1 (Phase 1 admin shell skeleton + Phase 5 skills index pipeline) on `main`.

## Commits verified (7)

```
9e07629 Merge branch 'dev-2-skills-pipeline' into main
5b52aaa feat: workflows route placeholder (Phase 2 fills)        ← Phase 1
537daa7 feat: wire admin shell into locale layout                ← Phase 1
c6d8328 feat: admin shell skeleton (sidebar + topbar)            ← Phase 1
021b2f4 feat: locale-routing redirects bare locale to /workflows ← Phase 1
b0a19a9 feat: wire skills index into build chain                 ← Phase 5
e35e3c2 feat: skills loader for Next.js consumers                ← Phase 5
7c129eb feat: skills index build pipeline                        ← Phase 5
```

## Working tree

Clean. Only untracked plans/ + test-results/ (expected). No uncommitted modifications.

## Criteria results

| # | Criterion | Result | Notes |
|---|-----------|--------|-------|
| 1 | `npm run test:run` | PASS | 10 files, 62/62 tests pass, 894ms |
| 2 | `npm run lint` | PASS | 0 errors, 1 warning in coverage/ (generated artifact, ignorable) |
| 3 | `npx tsc --noEmit` | PASS | Clean, no output |
| 4 | `npm run build:skills` | PASS | 252 skills indexed, 50 collisions deduped, 0.45s (< 2s target) |
| 5 | `src/data/skills-index.json` exists + gitignored | PASS | 201,896 bytes; `.gitignore:20` matches |
| 6 | `npm run build` (full chain) | PASS | build:skills → build:search → next build; 43 static pages, compile 1928ms |
| 7 | Empty-fallback `SKILLS_DIR=/nonexistent npm run build:skills` | PASS | Wrote `[]`, warning printed, exit 0 |
| 8 | Smoke: `curl -I /` | PASS | 308 → `/vi` |
| 9 | Smoke: `curl -I /vi` | PASS | 308 → `/vi/workflows` |
| 10 | Smoke: `curl -I /en` | PASS | 308 → `/en/workflows` |
| 11 | Smoke: `/vi/workflows` renders shell | PASS | Sidebar+Topbar+placeholder text rendered (HTTP 200, 18,169 B) |
| 12 | Smoke: `/vi/docs/engineer/01-core-workflow` regression | PASS | h1="Engineer — Core Workflow Commands"; shell present (HTTP 200, 183,999 B) |

## Test breakdown (10 files)

Phase 1 (admin shell):
- `src/components/shell/sidebar.test.tsx`
- `src/components/shell/admin-shell.test.tsx`
- `src/components/shell/breadcrumb.test.tsx`
- `src/components/shell/locale-switcher.test.tsx`

Phase 5 (skills pipeline):
- `scripts/build-skills-index.test.ts`
- `src/lib/skills-loader.test.ts`

Pre-existing (regression):
- `src/lib/smoke.test.ts`
- `src/lib/mdx-loader.test.ts`
- `src/lib/locale-routing.test.ts`
- `src/lib/docs-tree.test.ts`

## Build outputs

- **Skills indexer**: 252 skills indexed from `~/.claude/skills`, 50 id collisions deduplicated
- **Search index**: vi=284 entries (252 skills), en=252 entries (252 skills)
- **Next build**: 43 static pages generated, 9 workers, 744ms generation, 1928ms compile
- **Routes wired**: `/`, `/[locale]`, `/[locale]/docs`, `/[locale]/docs/[...slug]`, `/[locale]/workflows`, `/api/revalidate`

## Empty-fallback verification (Vercel scenario)

Command: `SKILLS_DIR=/nonexistent npm run build:skills`
Output:
```
[build:skills] Skills directory /nonexistent does not exist — writing empty index
EXIT: 0
```
File written: `src/data/skills-index.json` = `[]` (2 bytes). Restored to full 201 KB after by re-running normal `build:skills`.

## Smoke test details

**Dev server**: `next dev` ran on **port 3000** (default), not 3001 — minor deviation from task spec but functional. Ready in 210ms.

Curl outputs (representative):

```
GET / →
HTTP/1.1 308 Permanent Redirect
location: /vi

GET /vi →
HTTP/1.1 308 Permanent Redirect
location: /vi/workflows

GET /en →
HTTP/1.1 308 Permanent Redirect
location: /en/workflows

GET /vi/workflows → HTTP/1.1 200; sidebar+topbar markup present
GET /vi/docs/engineer/01-core-workflow → HTTP/1.1 200; renders within shell
```

Shell markup observed in both pages:
- `<nav aria-label="Sidebar" class="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">`
- `<header role="banner" class="flex h-14 shrink-0 items-center gap-4 ...">`
- Breadcrumb `<nav aria-label="Breadcrumb">` with current page indicator
- VI/EN switcher buttons with aria-pressed states
- Search button (disabled placeholder for Phase 4) + theme toggle (disabled placeholder)

## Flakes / regressions / unexpected

None. All criteria green on first run.

Minor observations (non-blocking):
- Dev server picked port 3000 instead of 3001 — works because nothing else was bound. Spec said 3001 (likely assumed an existing process on 3000).
- Workflows page shows placeholder text `"Workflows page placeholder — Phase 2 fills with WorkflowPage."` — expected per commit `5b52aaa`.
- Search button + theme toggle in topbar are `disabled` — placeholders for later phases, expected.
- 50 skill-id collisions deduped is high — worth confirming dedup strategy is intentional (last-write-wins vs first-write-wins) in a follow-up, but not a Wave 1 blocker.
- Lint warning `coverage/block-navigation.js: Unused eslint-disable directive` — file is auto-generated by vitest coverage; consider adding `coverage/` to `.eslintignore` later.

## Performance

- Tests: 894ms total (62 tests)
- build:skills: 450ms (target < 2s)
- next build compile: 1.93s
- Static page generation: 744ms (43 pages, 9 workers)
- Dev ready: 210ms

## Verdict

**PASS** — Wave 1 ready for Wave 2 (Phase 2 workflows index UI + Phase 3 cmd/skill detail).

## Unresolved questions

1. 50 skill-id collisions during dedup — intentional shadowing strategy or symptom of upstream skill catalog naming drift? Not a blocker; flag for future audit.
2. Dev server port: spec says 3001, observed 3000 — should `package.json` `dev` script pin port via `next dev -p 3001` to match docs/conventions?
3. Lint warning in `coverage/` — add to `.eslintignore` in a follow-up housekeeping commit?

---

**Status:** DONE
**Summary:** Wave 1 verification PASS — 62/62 tests, lint clean, typecheck clean, build green, all 5 smoke routes pass, empty-fallback for skills works.
**Concerns/Blockers:** None blocking. 3 minor follow-ups listed under Unresolved questions.
