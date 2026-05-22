---
report: red-team
plan: 260521-1942-docs-renderer-i18n
date: 2026-05-21
reviewer: code-reviewer (hostile mode)
verdict: needs-revision
---

# Red-team review — docs-renderer-i18n plan

5-phase plan, 9-13h estimate. Reviewed against codebase state, real npm registry, Next.js 16.2.6 quirks, flexsearch 0.8 reality. Found **3 blockers**, **8 highs**, **6 mediums**, **3 lows**. Plan as written will burn 4-8h of trial-and-error on a single load-bearing question (Phase 3 MDX strategy), invalidate Phase 4 tests, and produce a broken `npm run dev` flow.

---

## BLOCKER 1 — Phase 3 punts the load-bearing decision (Approach A vs B)

**Location:** `phase-03-mdx-pipeline-auto-discover.md:351-360`, `:399`, `:407`.

**Evidence:** Plan declares "Approach B preferred — copy hoặc symlink build-time. Implementation chi tiết tùy smoke test Phase 3 đầu. Nếu Approach B vướng, fallback Approach A." This is two architectures with opposite trade-offs (file-based routing vs runtime compile via fork lib), differing by 2-4h, with all downstream phases assuming the output. Plan says "decide at smoke test" — i.e., do not decide.

**Failure scenarios:**
- Approach B (copy/symlink): file-based routing requires `.mdx` extension or `pageExtensions: ['md']`. Plan does set `pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx']` (good), but symlink during build vs copy has different watch-mode semantics. Copy = stale on edit; symlink = filesystem-dependent (Windows users in future, CI containers). Either way the docs `loadMdx()` fallback shim (Phase 3 Step 6) becomes redundant if file-based routing handles the file lookup, OR conflicts with `[...slug]` dynamic route, OR both. The whole `mdx-loader.ts` is dead code if Approach B works.
- Approach A (next-mdx-remote-client): research report (lines 13, 581-604) flags this as "Avoid" + "maintenance risk." Plan would import deprecated/abandoned API surface.
- "Compile MDX source — implementation chi tiết tùy @next/mdx setup" (`page.tsx` example line 343-347, marked `<MdxContent source={...}>`). This component **does not exist** in `@next/mdx` API. `@next/mdx` is a webpack/Turbopack loader, not a runtime compiler. There is no `<MdxContent source=>` to call. The whole rendering function is hand-waved.

**Attack:** Coder picks Approach B → discovers `[...slug]` dynamic route + file-based `.md` colocation conflict (only one can win per path) → 2h debugging → flips to Approach A → installs `next-mdx-remote-client` (not in tech stack table, not version-pinned) → discovers it doesn't ship Vitest test fixtures → 1h reading source → finally compiles. Real cost: **4-6h overrun** on a 3-4h phase.

**Fix:** Pick now. Recommended: **Approach C (not enumerated)** — keep `.md` in `docs/{locale}/`, use `next-mdx-remote` `compileMDX` (or `evaluate` from `@mdx-js/mdx` directly) at request-time inside a RSC, cached per slug. This is what Vercel docs, Nextra, Fumadocs all do. `@next/mdx` file-based routing is the wrong tool when source files live outside `src/app/`. Spec the exact API call (function signature, options object) in the plan before Phase 3 starts.

---

## BLOCKER 2 — `npm run dev` regenerates search index on every start

**Location:** `phase-05-search-and-translation-banner.md:189` — `"dev": "npm run build:search && next dev"`.

**Evidence:** Plan chains `build:search` (tsx script reading 32 md files, indexing with shiki-equivalent overhead via flexsearch encode 'advanced') into every `npm run dev`. Current dev startup is sub-2s (verified `next 16.2.6` + Turbopack default). After this change: cold dev start = N hundreds of ms for fs walk + flexsearch insert × 2 locales, even when user just edits CSS.

**Failure scenario:**
- Developer hits restart loop (typical: kill+restart 5-10x per hour during UI iteration). Each restart re-tokenizes 32 md files. With Vietnamese diacritic encoder ('advanced' does NFC + normalization), this is non-trivial CPU. Estimate +500-1500ms cold start per restart.
- Worse: hot-reload of `docs/**/*.md` content does NOT re-run `build:search` (script is bound to `dev` start, not file-watch). So edits to docs during dev still show stale search results in modal. User opens Cmd+K, sees old content, files bug "search not updating," wastes triage time.

**Attack:** New contributor onboarding: `npm install && npm run dev` → "why does dev take 4 seconds, the README claims fast Turbopack?" Friction baked into every developer.

**Fix:** Three options:
1. **Dev: skip search index entirely.** Search modal shows "Search unavailable in dev" or auto-falls-back to plain text scan. `"dev": "next dev"` only.
2. **Watch mode for build:search.** Add `tsx --watch scripts/build-search-index.ts` as separate script, document running it in second terminal if needed.
3. **Build index on-demand via API route.** `/api/search-index/[locale]` reads disk at request time, caches in-memory. No build step, fresh content always. Trade-off: slightly slower first search query.

Plan must pick one explicitly. Current state ships a UX regression for dev workflow.

---

## BLOCKER 3 — flexsearch version drift; plan assumes 0.7 API but installs 0.8.212

**Location:** `plan.md:46` ("flexsearch 0.7+"), `phase-05-search-and-translation-banner.md:150-180` (uses `FlexSearch.Document` with `.export(async callback)` API).

**Evidence:** Verified via `npm view flexsearch dist-tags` → latest is `0.8.212`. The 0.7.x line is no longer current. The research report (researcher-260521-1718-search-flexsearch-cmdk-report.md line 5, 23-39) was written when 0.7.31 was current and explicitly states: *"Document Index doesn't support export() yet (use flat index + metadata sidecar)"* + *"For your docs site: Use Flat Index (simpler) + separate metadata JSON"*. Plan **ignored this guidance** and uses `FlexSearch.Document` (research said "Don't").

**What 0.8 changed:**
- 0.8 introduced "Persistent Indexes" (IndexedDB, Redis, Postgres, etc.) — different backend model.
- 0.8 Document does support `export()`/`import()` but signatures differ from 0.7.
- ESM bundle path changed (`./dist/flexsearch.bundle.module.min.mjs`).
- TypeScript types for `Document.search()` return shape changed across patch versions.

**Failure scenarios:**
- Plan's `await index.export((key, data) => { exported[String(key)] = String(data); })` (line 163-165) treats export as accepting a callback returning to a closure variable. The 0.8 docs API explicitly says: *"You need to import every key! Otherwise, your index does not work."* — plus *"feature 'fastupdate' is automatically disabled on import"*. Plan's import loop (line 222-224) does `for (const [key, data] of Object.entries(exported))` then `index.import(key, data)` — works only if the key set is complete and serialization round-trips correctly. With 0.8 Document, the export emits multiple keyed parts (e.g., `title.cfg`, `title.map`, `content.ctx`); skipping any key breaks search silently — no error, just zero results.
- `enrich: false` (line 237) doesn't exist on `Document.search()` in 0.8 (it was on 0.7 Document API for store retrieval). 0.8 uses `pluck` and `merge` for result shaping.
- TypeScript types: `FlexSearch.Document<unknown>` (line 206, 218) — the type param semantics in 0.8 type defs are different. Plan imports look correct only against an unverified 0.7 type set.

**Attack:** Developer runs `npm install flexsearch` → gets 0.8.212 → copies plan code → TypeScript errors on Document type → bypasses with `as any` → runtime: `index.search()` returns shape `[{ field, result }]` (not the flat array Plan's `doSearch` assumes) → search modal shows "Không có kết quả" for every query → triaged as flexsearch bug, actually plan bug.

**Fix:**
1. Pin version explicitly: `flexsearch: "^0.8.0"` (current) OR `^0.7.31` (legacy, what research report tested).
2. Either:
   - **Lock to 0.7.x** and use Flat Index + sidecar (matches research report recommendation; safer).
   - **Lock to 0.8.x** and rewrite the export/import code against actual 0.8 Document API (`import { Document } from "flexsearch"`, ESM import path, callback shape verified against `doc/export-import.md`).
3. Add a "Phase 5 Step 0: Verify flexsearch version & API surface" check.

---

## HIGH 1 — Middleware unit test syntax does not work in Vitest happy-dom

**Location:** `phase-02-locale-restructure.md:84-109` — `new NextRequest('http://localhost/')` invoked from Vitest test.

**Evidence:** Verified via Next.js GitHub discussion #61859 + Vitest docs: happy-dom (like jsdom) lacks full `Request`/`Response`/`Headers`/`NextFetchEvent` Web API support that middleware depends on. `next/server` exports type-only symbols for some constructors. Plan's test:

```ts
import { NextRequest } from 'next/server';
import { middleware } from './middleware';
const req = new NextRequest('http://localhost/');
const res = await middleware(req);
expect(res?.status).toBe(308);
```

Several problems:
1. `NextRequest` constructor exists at runtime in Node but requires `Request` global. happy-dom 14+ has partial support; node 18+ has native `Request`. Plan's `vitest.config.ts` (phase 01) uses `environment: 'happy-dom'` — this is a happy-dom env, not Node, so behavior is environment-dependent.
2. `NextResponse.redirect(url, 308)` returns a `NextResponse` extending `Response`. The `.status` getter and `.headers.get('location')` work in Node 18+, but assertions like `expect(res?.headers.get('location')).toContain('/vi')` require Response API parity that happy-dom historically lacked (worked around in later versions but unstable).
3. Plan's matcher pattern excludes `_next/static|_next/image|favicon.ico` (line 162). The middleware function tested has `pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')` (line 146-150). These two filters are INCONSISTENT: matcher would still invoke middleware for `/_next/data/...`, `/api/foo`, and `/anything.json`. The inner guard catches them but test never verifies this.

**Failure scenarios:**
- Test passes locally on Node 24 (verified node 24.15.0 in environment) but fails in CI on Node 18 LTS due to `Request` shim differences.
- Test `expect(res).toBeUndefined()` (line 102) — `NextResponse.next()` returns a non-undefined response in middleware. Some plan logic paths return `undefined` (implicit), others return `NextResponse.redirect()`. Plan needs explicit `NextResponse.next()` vs early return decision; tests are ambiguous.

**Fix:**
1. Spec the test environment override: middleware tests use `// @vitest-environment node` directive (per file) instead of happy-dom.
2. Mock `next/server` properly OR test middleware logic as a pure function: refactor `middleware()` to delegate to `getRedirectTarget(pathname): string | null` and test the pure function. Then E2E test the integration via Playwright.
3. Reconcile matcher regex vs in-handler guards. Remove one — they overlap.

---

## HIGH 2 — Middleware matcher pattern leaks edge cases

**Location:** `phase-02-locale-restructure.md:162` — matcher `['/((?!_next/static|_next/image|favicon.ico).*)']`.

**Evidence:** Pattern excludes only 3 things. Misses:
- `/_next/data/*` — Next.js data requests (RSC, prefetch). Middleware will be invoked, then hit `pathname.startsWith('/_next')` guard and return undefined — wasteful but functionally OK. **However**: data requests for non-prefixed routes (`/_next/data/.../foo`) where `foo` resolved to a redirect, can hit edge cases in 308 handling and break RSC streaming.
- `/sitemap.xml`, `/robots.txt`, `/manifest.json` — all match `.includes('.')` guard, OK. But `/sitemap` (no extension) would redirect `/sitemap` → `/vi/sitemap` → 404. Plan never spec'd whether SEO files exist.
- `/api/*` — internal guard catches; matcher does NOT. So middleware runs for every API request, adds latency. Should be in matcher: `/((?!_next|api|favicon.ico|.*\\..*).*)` is more conservative.
- `OPTIONS` preflight requests — middleware runs on all methods. CORS preflight to `/vi/api/...` would 308 redirect, which violates CORS spec (preflight must return 200/204, not 3xx).
- `HEAD` requests — same.
- Trailing slash variants: `/vi/` vs `/vi`. `pathname.split('/')[1]` returns `'vi'` for both, OK. But `req.nextUrl.clone()` preserves the slash — output URL might be `/vi/` or `/vi`, inconsistent.
- Internationalized paths with encoded chars: `/%C3%BC` Punycode-ish edge cases never tested.

**Failure scenario:** Production with Vercel + edge runtime: middleware runs at edge, redirects to `/vi/api/X` for what should have been a direct API call. Frontend client gets 308 mid-request, breaks fetch logic.

**Fix:** Tighten matcher to `'/((?!api|_next|.*\\..*).*)'` and remove inner pathname guards (single source of truth). Add tests: OPTIONS, HEAD, `/api/foo`, `/_next/data/...`.

---

## HIGH 3 — Phase 4 TOC test couples to Phase 3 output structure but doesn't assert it

**Location:** `phase-04-docs-ui-shell.md:101-105`, `:215-235`.

**Evidence:** TOC test fakes `document.body.innerHTML = '<article><h2 id="a">...'`. Real implementation uses `document.querySelector('article')`. Phase 3 wraps content in `<article className="prose">` (line 343). If Phase 3 changes to `<main>` or `<div role="article">` (e.g., for accessibility refactor), TOC silently breaks because:
- `document.querySelector('article')` returns null
- Early `return` (line 221) sets no items
- Component renders nothing
- No test catches this — Phase 4 tests use fake DOM, Phase 3 tests don't include integration with TOC

Also: `IntersectionObserver` (line 229) — happy-dom support is **partial**. Tests at line 99-105 don't exercise the observer path at all (no scrolling simulation). If observer never fires, `activeId` stays `null` forever in production — no visible bug in test, but user sees no highlight.

**Failure scenario:** Plan ships, user navigates to docs, scroll → no heading highlight ever. Bug never found in unit tests.

**Fix:**
1. Define stable contract between Phase 3 and Phase 4: `<article data-testid="docs-content">` or expose `MDX_CONTENT_SELECTOR` constant from a shared module.
2. Mock IntersectionObserver in `vitest.setup.ts` AND add integration test invoking the observer callback manually to verify `activeId` updates.
3. Fallback: replace IntersectionObserver with scroll-listener + `getBoundingClientRect()` — slower but happy-dom-testable.

---

## HIGH 4 — `useDeferredValue` is NOT a debounce

**Location:** `phase-05-search-and-translation-banner.md:264, 287-294` — plan claims "Debounced search input (150ms)" (line 28) and implements via `useDeferredValue(query)`.

**Evidence:** `useDeferredValue` is React's concurrent priority hint, not a debounce. It defers re-rendering of components that depend on the deferred value when a higher-priority update happens. It does NOT delay state updates by a fixed time. There is no "150ms" anywhere — the timing is React's scheduler's choice (could be 0ms, could be longer under pressure). Plan acceptance criterion *"Debounced search input (150ms)"* (line 28) is not met by this implementation.

Compare with research report (researcher-260521-1718-search-flexsearch-cmdk-report.md line 269-278): uses `setTimeout(..., 150)` with cleanup — actual 150ms debounce. Plan diverged from research silently.

**Failure scenario:** User types fast → every keystroke fires `flexsearch.search()` → fine for 32 docs (sub-10ms) but if docs grow to 200, search lags. More important: plan acceptance criterion is unverifiable as written.

**Fix:** Either:
1. Use the research report's `setTimeout` pattern with cleanup.
2. Remove "150ms" claim from acceptance criteria; just say "deferred via React concurrent mode."

Don't claim what you don't implement.

---

## HIGH 5 — `mdx-loader.ts` fallback semantics break locale switcher UX

**Location:** `phase-03-mdx-pipeline-auto-discover.md:286-304` (`loadMdx`), Phase 4 banner (`phase-04-docs-ui-shell.md:301-315`), language switcher (`phase-02-locale-restructure.md:218-235`).

**Evidence:** Compose three pieces:
1. User on `/vi/docs/X` (Vietnamese page exists).
2. Click EN button → switcher rewrites URL to `/en/docs/X`.
3. `loadMdx('en', 'X')` returns vi content with `fallback: true` (line 287: candidates for 'en' are `['en', 'vi']`).
4. Page renders **identical Vietnamese content** + banner "Translation coming soon. Showing Vietnamese version."

This is confusing UX: user clicked EN, got VI again, told "translation coming soon" for content they were just reading. Worse: SEO sees `/vi/docs/X` and `/en/docs/X` returning identical HTML → duplicate content penalty.

Also note: `candidates: Locale[] = locale === 'en' ? ['en', 'vi'] : ['vi']` — for `locale === 'vi'` when vi missing, never falls back to en. Asymmetric. If a doc has only EN translation (future state), `/vi/docs/X` returns 404 instead of EN with banner. Plan doesn't handle "VI translation missing but EN exists."

**Failure scenarios:**
- SEO: duplicate content. Search engines rank one and de-rank the other.
- UX: confused users.
- Future-proofing: when EN docs exist, vi-missing fallback chain doesn't exist.

**Fix:**
1. Symmetric fallback: both directions try other locale.
2. Add `<link rel="canonical" href="/vi/docs/X">` when serving fallback content, prevents duplicate content.
3. Locale switcher: detect if target locale exists for current slug BEFORE pushing route. If not, show banner inline ("Bản dịch sẽ sớm có. Vẫn ở VI?") with stay/proceed buttons — don't silently swap URL.
4. `generateStaticParams` (Phase 3 line 323-330) generates BOTH locales × all slugs. With fallback, EN routes that fall back to VI get statically generated as duplicates. Use `generateStaticParams()` to generate only routes where the file actually exists in that locale, and let the dynamic 404 handler trigger fallback.

---

## HIGH 6 — `CLAUDE.md` path update is incomplete

**Location:** `phase-02-locale-restructure.md:239-247` — only updates `docs/engineer/`, `docs/marketing/`, etc. in `CLAUDE.md`.

**Evidence:** Verified via grep across codebase, `docs/` references exist in:
- `CLAUDE.md` (4 lines flagged by plan)
- `docs/cli/cli-commands-reference.md:113` — `./docs/` reference
- `docs/claudekit-overview.md:44` — `workflows/` (relative)
- All 16 engineer/*.md, 9 marketing/*.md files have **external URL references** (`https://docs.claudekit.cc/docs/engineer/skills/X`) — these are NOT internal paths, don't need updating. Plan correctly ignores them.

But plan misses:
1. Internal cross-references **between** docs files. Once moved to `docs/vi/`, any `[link](../engineer/01-X.md)` style relative link inside the docs themselves becomes broken (because content moved). Grep verifies the docs use external URLs, NOT relative paths — OK for now. But future contributors will add relative links assuming the `docs/engineer/` location.
2. README.md doesn't reference internal docs paths (verified). Safe.
3. Plan doesn't update `docs/cli/cli-commands-reference.md:113` reference to `./docs/`. This is a docs file referring to its own dir from a build script context. After move, this string is technically still correct (the root `docs/` exists), but its meaning shifts (referring to docs/vi or docs/ root?). Ambiguous.

**Failure scenario:** Future contributor reads `docs/vi/cli/cli-commands-reference.md`, sees "Project documentation in `./docs/`" — looks for files there, only finds locale subdirs. Friction.

**Fix:**
1. Audit all internal links in 32 md files (`grep -rn '\\](\\.\\./' docs/`). Even if zero hits today, add a CI check: relative links between docs must use `/docs/{locale}/...` absolute paths.
2. Add post-move sanity check task: "rg -l 'docs/(engineer|marketing|workflows|cli)/' --no-messages should return only docs/plans/ files and external URL docstrings."
3. Update `docs/cli/cli-commands-reference.md:113` to `./docs/vi/` or remove ambiguity.

---

## HIGH 7 — `generateStaticParams` x 2 locales explodes route count + builds duplicate content

**Location:** `phase-03-mdx-pipeline-auto-discover.md:323-330`, `phase-02-locale-restructure.md:179-181`.

**Evidence:** `[locale]/page.tsx` generates `[{ locale: 'vi' }, { locale: 'en' }]`. `[locale]/docs/[...slug]/page.tsx` (line 323-330) generates 2 × 32 = 64 routes statically. Since `docs/en/` starts empty (Phase 2: "mkdir -p docs/en"), `listAllSlugs('en')` returns `[]` and only 32 vi routes generated. OK so far.

But — `loadMdx('en', 'X')` falls back to vi for ANY slug that exists in vi. So a request to `/en/docs/engineer/01-core-workflow` should return content. But it was never generated! Next.js will either:
- 404 (because `generateStaticParams` didn't list it),
- OR fall to dynamic SSR (if `dynamicParams: true`, the default).

Plan does not specify `dynamicParams`. Next.js 16 default for App Router: `dynamicParams = true`, so unlisted params get rendered at request time. OK in development. In production with `output: 'export'` (static export) — typical for Vercel docs sites — `dynamicParams` is overridden to `false`, and EN fallback routes silently 404.

**Failure scenarios:**
- Vercel deploy with static export config → EN routes 404 entirely.
- Vercel deploy without static export → EN routes work but render-on-demand cost adds up, Vercel function invocations billed.

**Fix:**
1. Either: `listAllSlugs` returns vi slugs as the universe for EN too (forces all to generate). Then EN duplicates VI at build time. **Bad** — doubles build artifacts.
2. Or: set `dynamicParams = false` and accept EN routes 404 until EN content exists. **Honest** but breaks plan's stated fallback behavior.
3. Or: union of slugs across both locales, with fallback baked in at build. **Best** — generate `/en/docs/X` as a static page that contains the VI content + banner. Spec this explicitly.

Plan must clarify which deployment mode (static export vs serverful) and which `generateStaticParams` strategy. Currently underspec'd.

---

## HIGH 8 — Sidebar tree built fresh per request, no caching

**Location:** `phase-04-docs-ui-shell.md:140-141` — `const tree = await buildDocsTree(locale);` inside `DocsLayout` (server component, runs per request).

**Evidence:** `buildDocsTree()` (Phase 3 line 207-250) does fs glob + read N files + matter parse each. For each docs request, all 32 md files read. RSC caches deduplicate within a single render but NOT across requests.

For static export — fine, runs once at build. For SSR — re-reads 32 files per request. Latency: 32 × ~5ms read + matter parse + sort = ~150-300ms per docs page load just for sidebar.

**Failure scenario:** Self-hosted (Railway, Fly.io) without static export → docs page TTFB +200ms vs minimum. Mobile users on slow network feel it.

**Fix:**
1. Wrap `buildDocsTree` in `unstable_cache` (Next.js 16) with revalidate: false (or revalidate on docs/ change).
2. Or: compute tree at build time, serialize to `docs-tree.{locale}.json`, ship in bundle.
3. For static export: irrelevant, but plan must say "this codebase assumes static export OR you must add caching."

Add explicit success criterion: "Sidebar tree cached/precomputed; verify no disk reads on second docs page load."

---

## MEDIUM 1 — `@shikijs/rehype` plugin format inconsistency with Turbopack restriction

**Location:** `phase-03-mdx-pipeline-auto-discover.md:140-150`, research report line 524.

**Evidence:** Research report explicitly states (line 524): *"@shikijs/rehype cannot be a string (JS function). If using Turbopack dev (next dev --turbo), this may fail."* Plan claims (line 161): *"Turbopack chỉ accept string plugins (như above), không JS objects. Verified per research report."* — but plan's config (line 146-149) passes `'@shikijs/rehype'` as a STRING with a config object. That's the JS-object form (object literal in second array position). String + object IS the "JS object" form research warned about.

Confirmed via web search: Turbopack supports plugins via Rust loader, but plugin OPTIONS must be serializable JSON. Objects with `{themes: {light, dark}}` are serializable. Functions are not. Plan's config has no functions → should work with Turbopack.

But plan's risk table line 401 still says: *"Turbopack + JS-object plugin không work | High | Strictly dùng string plugin form"* — internally contradictory. Plan reasons in opposite directions in two places.

**Failure scenario:** Developer reads risk table → thinks shiki broken in dev → disables shiki → code blocks render unstyled in dev → debugging hours.

**Fix:** Reconcile. Either:
- Confirm: serializable options work in Turbopack 16.2+. Drop the warning.
- Or: actually disable shiki in dev (research report Workaround B, line 660-675) and document the unstyled-dev tradeoff prominently.

Pick one, stop hedging.

---

## MEDIUM 2 — Test fixture path resolution unreliable in Vitest

**Location:** `phase-03-mdx-pipeline-auto-discover.md:95, 100` — `buildDocsTree('vi', './tests/fixtures/docs')`.

**Evidence:** Path is `./tests/fixtures/docs` (relative). Vitest resolves relative paths from `process.cwd()`, which is the project root when run via `npm test`. OK locally. But:
- `vitest.config.ts` (phase 01 line 109) sets `resolve.alias '@'` but not `root`. Vitest default root is `process.cwd()`, fine.
- IDE test runner (VS Code Vitest extension) may set CWD differently.
- Plan doesn't actually create `tests/fixtures/docs/` directory — only mentions it conceptually (line 122: *"Fixture files at `tests/fixtures/docs/vi/engineer/01-test.md`, etc."*). No step actually creates these fixtures.

`buildDocsTree(locale, rootDir = path.join(process.cwd(), 'docs', locale))` (line 207-209) — default uses `process.cwd()`. Test passes `'./tests/fixtures/docs'`, but inside function, this is passed as `rootDir` directly — `path.join(rootDir, file)` (line 219). If `rootDir` starts with `./`, `path.join('./tests/fixtures/docs', 'engineer/01-test.md')` → `tests/fixtures/docs/engineer/01-test.md`. Resolves relative to CWD. Works if CWD = project root. **Fragile if not.**

Also: glob pattern `glob('**/*.md', { cwd: rootDir, ignore: ['_*.json', '_*'] })`. `cwd` accepts relative path, resolved from `process.cwd()` per `glob` docs. Same fragility.

**Failure scenario:** Tests pass on author's machine, fail on contributor's machine (e.g., monorepo subdir).

**Fix:**
1. Use absolute paths in tests: `buildDocsTree('vi', path.resolve(__dirname, 'fixtures/docs/vi'))`.
2. Co-locate fixtures: `src/lib/__fixtures__/docs-tree/vi/engineer/01-test.md` (per research report line 287-294 recommendation).
3. Add explicit step: "Create fixture files at `<resolved path>`" with file content.

---

## MEDIUM 3 — Coverage targets are advisory, no CI gate

**Location:** `plan.md:97` — *"Vitest test suite pass (coverage ≥70% utilities, ≥50% UI)"*.

**Evidence:** Phase 1 `vitest.config.ts` (line 102-107) configures coverage reporter but no `coverage.thresholds.lines / functions / branches / statements`. No CI step enforces threshold. Coverage drops silently.

**Failure scenario:** Phase 4 ships with sidebar at 30% UI coverage (no Phase 4 spec'd to enforce). Bug in untested code path → escapes review.

**Fix:** Add to `vitest.config.ts`:
```ts
coverage: {
  ...,
  thresholds: {
    lines: 70,
    functions: 70,
    branches: 60,
    statements: 70,
    perFile: false,
  },
},
```
Add CI step running `npm run test:coverage` with non-zero exit on threshold miss.

---

## MEDIUM 4 — Playwright in tech stack but never used

**Location:** `plan.md:51` — `playwright | latest | E2E cho RSC flows`.

**Evidence:** Listed as dependency. Zero phases install or write Playwright tests. Phase 5 final task `npm start` smoke test is manual. RSC async flows (per research report line 175-218) need E2E because Vitest can't test them.

**Failure scenario:** Stack table promises E2E coverage; plan delivers none. Untested: middleware in production runtime (only unit-tested with mock), full SSR flow, search modal keyboard nav in real browser.

**Fix:** Either:
1. Remove Playwright from stack table.
2. Add Phase 6 (or extend Phase 5): install Playwright, write 3-5 E2E tests covering critical paths.

Currently plan claims coverage it doesn't ship.

---

## MEDIUM 5 — Public search-index JSON not in .gitignore

**Location:** `phase-05-search-and-translation-banner.md:58-59`, `.gitignore` (current state).

**Evidence:** Plan generates `public/search-index-{vi,en}.json` at build time. Current `.gitignore` does not exclude these files. If developer runs `npm run build` locally and commits, index files get into git history. Files will be 200-500KB each, bloat repo, conflict on every merge.

Conversely if they ARE gitignored: deploy needs to run `build:search` (which plan handles via `build` script chain). OK.

Plan doesn't decide.

**Failure scenario:** Developer commits `public/search-index-*.json` → 500KB diff on every doc edit → review noise → eventual purge with `git filter-repo`.

**Fix:** Add to `.gitignore`:
```
/public/search-index-*.json
```
Document in Phase 5 step list.

---

## MEDIUM 6 — XSS via heading text in `rehype-autolink-headings`

**Location:** `phase-03-mdx-pipeline-auto-discover.md:144` — `['rehype-autolink-headings', { behavior: 'append' }]`.

**Evidence:** `rehype-autolink-headings` appends an `<a href="#slug">` element with default content (often `#` or an SVG icon). Plugin uses `properties` and `content` options for the anchor. Default behavior `'append'` is safe — anchor href is derived from `id` via `rehype-slug`, which auto-slugifies heading text using GitHub-style slug (lowercase, hyphens, strip special chars). No raw HTML injection from heading text.

BUT: MDX allows JSX in headings. `# Hello <script>alert(1)</script>` becomes a heading with embedded JSX. `@next/mdx` compiles JSX, doesn't execute strings — safer than dynamic compile from user input. Since docs source files are **author-controlled** (committed to git), threat model is "trusted author writes docs," not "user uploads markdown." No XSS risk at current threat model.

Plan doesn't state threat model explicitly. If docs source becomes user-contributable later (community contributions, GitHub Issues to markdown sync, CMS integration), this assumption breaks silently.

**Failure scenario (future):** Docs site adds "edit on GitHub" → PR injects `<script>` in MD → reviewer approves cursorily → ships → XSS in docs.

**Fix:** Document threat model in plan: "Markdown sources are trusted, committed by authenticated contributors via PR. Any change to this assumption requires re-evaluation of MDX compile safety (e.g., switch to `next-mdx-remote` with `blockDangerousJS: true`)."

---

## LOW 1 — Plan dependency on `@vitejs/plugin-react` for Vitest, but project doesn't use Vite

**Location:** `phase-01-tdd-setup.md:93, 114`.

**Evidence:** Vitest uses Vite internally, so `@vitejs/plugin-react` is required for `.tsx` handling in tests. Plan correctly installs it (line 114: *"cài thêm `@vitejs/plugin-react` nếu chưa có"*). But also says: *"Plugin chỉ dùng cho Vitest, không Next; isolated"* (line 171, risk table) — accurate.

No bug, just confusion potential. Devs reading might assume project uses Vite for bundling. Note explicitly: "This plugin is consumed by Vitest only; Next.js continues to use Turbopack/Webpack."

**Fix:** Add comment in vitest.config.ts: `// Vitest needs this for React JSX transforms in tests; Next.js handles its own JSX via SWC.`

---

## LOW 2 — Banner text in Phase 4 hardcodes locale strings, no i18n integration

**Location:** `phase-04-docs-ui-shell.md:303-313`.

**Evidence:** Banner component has `if/else` on `originalLocale === 'en'` and hardcodes both messages inline. Project has `src/i18n/translations.ts` with `uiStrings` object pattern for all other UI strings. Banner messages break this convention.

**Failure scenario:** Future copy edit requires editing component file instead of central translation file. Inconsistent.

**Fix:** Move banner strings to `uiStrings.translationBanner = { vi: '...', en: '...' }`. Use `useLocale()` to pick.

---

## LOW 3 — `pageExtensions` includes `'md'` but project has zero `.md` files in `src/app/`

**Location:** `phase-03-mdx-pipeline-auto-discover.md:155` — `pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx']`.

**Evidence:** If Approach A (next-mdx-remote-client) is picked (plan's stated fallback), `.md` should NOT be a page extension. Only `.tsx` page files. Including `md` is dead config and confusing.

If Approach B (copy/symlink to `src/app/`) — yes, needed.

Tied to BLOCKER 1.

**Fix:** Pick approach, set `pageExtensions` accordingly.

---

## Behavioral checklist scan

- [x] Concurrency: N/A (RSC, single-thread per request) — but caching/race conditions flagged in HIGH 8 (sidebar rebuild).
- [x] Error boundaries: `loadMdx` returns `null` on miss, page calls `notFound()` — OK. `gray-matter` failure on malformed frontmatter silently returns empty `data` (Phase 3 risk table line 402: confirmed). Acceptable.
- [x] API contracts: BLOCKER 1 (MdxContent component doesn't exist), HIGH 4 (debounce contract violated), HIGH 7 (generateStaticParams contract underspec'd).
- [ ] Backwards compatibility: `/` → `/vi` 308 redirect is breaking change to any existing bookmark/share link. Vercel preserves redirect across deploys. **No explicit verification step.** Plan should add: "verify existing public URLs continue to work via redirect chain."
- [x] Input validation: middleware regex matcher leaks edge cases (HIGH 2).
- [x] Auth/authz: docs public, no auth needed. Fine.
- [x] N+1 / query efficiency: HIGH 8 — sidebar tree N reads per request.
- [x] Data leaks: search index in `public/` exposes content (already public). OK at current threat model (MEDIUM 6).
- [x] Fact-checked: plan paths verified against current codebase; versions verified against npm registry.

---

## Verdict

**NEEDS-REVISION.** Three blockers + eight highs invalidate a "ship as written" path. Critical issue is BLOCKER 1 (Approach A vs B indecision) — Phase 3 is impossible to start without deciding, and the wrong decision sprawls into Phase 4 sidebar test contract (HIGH 3), Phase 5 fallback logic (HIGH 5), and the `generateStaticParams` strategy (HIGH 7). All cascade. Pin this first, then re-validate Phase 5 against flexsearch 0.8 API (BLOCKER 3) and `npm run dev` flow (BLOCKER 2). The TDD discipline is good but tests as written (middleware, TOC) will fail or pass-for-wrong-reasons (HIGH 1, HIGH 3).

Estimated rework: 2-3h to revise plan, then 9-13h original estimate → realistic 14-20h total. Sub-12h ambition does not hold.

---

## Questions for user

1. **Deployment target**: static export (`next build` → `out/`) or serverful (Vercel, Railway)? Affects `dynamicParams`, fallback strategy, sidebar caching strategy. Spec'd nowhere in plan.
2. **MDX rendering approach**: pick one — (a) `next-mdx-remote-client` (research report says avoid), (b) copy/symlink to `src/app/`, or (c) my Approach C suggestion (compile at request time with caching). Plan currently picks both A and B.
3. **flexsearch version**: lock to 0.7.x (matches research report, Flat Index + sidecar, less power) or 0.8.x (current, Document + Persistent, more complexity)? Pick before Phase 5 starts.
4. **Threat model for docs source**: trusted authors only (current) or future-contributable (community PRs, CMS sync)? Affects MDX safety config (BLOCKER 6).
5. **Dev workflow tradeoff**: accept slower `npm run dev` (current plan), no search in dev, or background watcher? Pick one for BLOCKER 2.

---

## Unresolved questions (residual after fixes)

- Mobile responsive: plan says "best-effort, can skip." If skipped, what's the fallback? Sidebar overlap with content at 320px width?
- Dark mode mentioned as out-of-scope, but `shiki` themes config includes both `github-light` AND `github-dark`. Dark theme is generated but never invoked. Either drop dark theme or scope dark mode in.
- Search index per-locale: 2 files. If user types EN query while on VI page, current code searches VI index. Cross-locale search needs spec (research report unresolved question 1).
- Workflow JSON migration deferred to "later plan" — when? If never, why design fallback infra now?

**Status:** DONE_WITH_CONCERNS
**Summary:** Plan has 3 blockers (Phase 3 indecision, dev flow regression, flexsearch version drift), 8 highs (middleware tests broken, matcher leaks, TOC contract, debounce misimplemented, fallback UX, paths incomplete, generateStaticParams underspec'd, sidebar uncached), 6 mediums, 3 lows. Needs revision before Phase 1 starts.
