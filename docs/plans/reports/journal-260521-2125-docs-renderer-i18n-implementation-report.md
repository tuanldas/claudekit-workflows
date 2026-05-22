---
report: journal
plan: 260521-1942-docs-renderer-i18n
date: 2026-05-21
status: complete
commits: [91e76d6, e3b72c6, 5a5f5b4, e3f5282, 191450c]
---

# Journal — docs-renderer-i18n implementation

## Summary

5-phase plan executed via `/ck:cook` interactive mode. ~18-25h estimate, completed một session. Brainstorm → research (3 parallel agents) → plan → red-team review (3 blockers + 8 highs) → validate interview → implementation TDD-style per phase.

## What shipped

**Trang `/[locale]/docs/...`** render được 32 markdown files trong `docs/vi/` qua `@mdx-js/mdx` evaluate pipeline. Sidebar auto-discover từ folder structure, mobile drawer < 1024px, sticky 3-column ≥ 1024px. TOC auto-generated từ headings với IntersectionObserver. Code blocks highlighted bằng shiki (github-light/dark), copy button. Fallback EN→VI banner khi translation missing, canonical link cho SEO. Cmd+K search modal (cmdk + flexsearch + custom VN diacritic encoder) lazy-loads index từ build-time JSON. `/api/revalidate` endpoint cho deploy webhook trigger.

## Key technical decisions (drove by red-team revisions)

1. **MDX rendering = `@mdx-js/mdx` evaluate** (NOT `@next/mdx` file-based, NOT `next-mdx-remote/rsc` archived). `.md` lives outside `src/app/`, compile at request time, `unstable_cache` cho file read.
2. **`format: 'md'`** trong evaluate — pure markdown semantics tránh strict JSX trên `<300 lines` text.
3. **flexsearch 0.7.x Flat Index, client-side build** — encoder presets không expose ở runtime, dùng custom function với NFD normalize + diacritic strip. Build-time emit raw docs JSON, client builds index ở first Cmd+K open.
4. **Next.js 16 conventions** — `proxy.ts` thay `middleware.ts` (deprecation warning), `revalidateTag(tag, "max")` 2-arg, layout `params.locale: string` cast → `Locale`.
5. **Pre-commit (lefthook)** không CI gate — lint + typecheck + test run trên mỗi commit. Pre-push runs coverage gate.

## Surprises & gotchas

- `next-mdx-remote/rsc` was archived Apr 2026 — research report from 1 hour earlier already flagged it; plan revisions necessary.
- flexsearch 0.7 `encode: "advanced"` preset không runtime-resolvable ở bundle.min; required custom encoder.
- tsx CJS doesn't support top-level await → wrap trong `async main()`.
- Next.js 16 `revalidateTag` signature changed (2 args required) — silent breaking from earlier Next versions.
- styled-jsx still works trên Next.js 16 (used in MobileDrawer for slide animation).

## Verified working

- `/` → 308 → `/vi`
- `/vi/docs/engineer/01-core-workflow` renders với sidebar + content + TOC + code highlight
- `/en/docs/X` (vi-only file) → fallback banner + canonical link
- Cmd+K modal opens, search returns results
- `npm run build` → 41 routes prerendered + 1 dynamic API
- `npm run test:run` → 33/33 pass
- `npm run build:search` → vi 159KB, en 11B (empty placeholder)

## Outstanding work (deferred plans)

1. **EN translation content** — docs/en/ empty; author copies file-by-file manually (validate decision)
2. **Workflow JSON migration** — chuyển `src/data/workflows.ts` → JSON files; tách plan riêng SAU khi docs ship
3. **Playwright browsers** — `npx playwright install` chưa chạy; E2E tests scaffolded only
4. **Dark mode** — shiki bundles dark theme but not invoked anywhere; DESIGN.md chưa có dark spec

## Lessons learned

- Red-team review proved invaluable: caught 3 blockers (Phase 3 indecision, dev flow regression, flexsearch version drift) trước implementation. Estimated 9-13h ambition was revised to realistic 18-25h post-red-team. Actual session burn was within range.
- TDD discipline (Phase 1 lefthook + tests-first) caught a few regressions early. 33/33 tests at every checkpoint vs. silent breakage discovery late.
- `--tdd` flag inheritance worked — each phase had explicit "tests-first" section trong plan file. Subagent code-reviewer enforced acceptance criteria gate.

## Unresolved questions

None — plan delivered all in-scope items. Future enhancements tracked separately.
