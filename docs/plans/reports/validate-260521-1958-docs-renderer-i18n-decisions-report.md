---
report: validate
plan: 260521-1942-docs-renderer-i18n
date: 2026-05-21
mode: --deep --tdd
status: complete
---

# Validate interview — docs-renderer-i18n plan

Post-red-team validation interview. Surfaces 4 architectural decisions not addressed by red-team blockers.

---

## Decisions

### 1. Cache invalidation strategy → Manual `/api/revalidate` route

**Implementation**: Phase 5 Step 7b adds `POST /api/revalidate` accepting `x-revalidate-token` header. Vercel deploy webhook calls endpoint với secret, triggers `revalidateTag('docs-mdx')` + `revalidateTag('docs-tree')`.

**Trade-off**: Manual setup of deploy hook trên Vercel dashboard. Trade-off vs auto file-mtime polling (rejected: per-request overhead).

### 2. EN content authoring → Manual file-by-file

**Implementation**: Author copy `docs/vi/X.md` → `docs/en/X.md`, dịch manual. Banner show "Translation coming soon" cho missing files. No automation.

**Trade-off**: Slower content velocity than AI-assisted, but quality higher + no LLM API cost. Defer AI tooling to separate plan nếu cần.

### 3. Coverage gate → Pre-commit hook (lefthook)

**Implementation**: Phase 1 Step 8 install `lefthook`, config `lefthook.yml`:
- Pre-commit: lint + typecheck + unit tests (fast)
- Pre-push: coverage threshold gate (slow)

**Trade-off**: Local enforcement only, không CI gate (Phase 1 NOT add GitHub Actions). User chose local-friendly approach.

### 4. Mobile responsive → Full mobile-first redesign

**Implementation**: Phase 4 scope expanded từ "best-effort" → "full mobile-first". Bumped effort 3-4h → 5-7h. Adds:
- `<MobileDrawer>` component (hamburger + slide-in animation)
- `<MobileNav>` component (top bar)
- Touch targets ≥44px (Apple HIG)
- Breakpoints: mobile <768px, tablet 768-1023px, desktop ≥1024px
- Mobile Lighthouse score ≥85 success criterion

---

## Total effort (post-validate)

| Phase | Original | Post-red-team | Post-validate |
|-------|----------|---------------|---------------|
| 1 TDD | 1-2h | 2-3h | **3-4h** (+lefthook) |
| 2 Locale | 1-2h | 2-3h | 2-3h |
| 3 MDX | 3-4h | 4-5h | 4-5h |
| 4 UI | 3-4h | 3-4h | **5-7h** (+mobile-first) |
| 5 Search | 2-3h | 3-5h | **4-6h** (+revalidate API) |
| **Total** | **9-13h** | **14-20h** | **18-25h** |

Original estimate 9-13h underestimated by ~2x. Realistic ship target: 3-4 dev days.

---

## Remaining unresolved questions

1. **Mermaid support** — current docs không có Mermaid; skip. Nếu sau cần: `@theguild/remark-mermaid` plugin.
2. **Cross-language search** — index vi/en separated (default). Cross-locale search defer plan riêng.
3. **Search analytics** — track popular queries cần backend; defer.
4. **Workflow JSON migration** — chuyển `src/data/workflows.ts` → JSON files; tách plan riêng SAU khi docs ship.
5. **Dark mode** — DESIGN.md chưa có; shiki configured cho dual theme nhưng never invoked. Either drop dark theme từ shiki config hoặc scope dark mode trong tương lai.

---

## Whole-plan consistency sweep

Verified zero stale references sau revisions:
- ❌ `@next/mdx` (only in "Removed" notes — OK)
- ❌ `next-mdx-remote/rsc` (only in "Removed" notes — OK)
- ❌ `useDeferredValue` (only in "HIGH 4 fix" annotation — OK)
- ❌ `FlexSearch.Document` (zero refs — OK)
- ❌ `MdxContent` component (zero refs — OK)
- ❌ Approach A/B indecision (only in "rejected" comparison — OK)
- ❌ `compileMDX` from `next-mdx-remote` (zero refs — OK)
- ✅ `@mdx-js/mdx evaluate` consistent across plan + phase files
- ✅ `flexsearch@^0.7.31` Flat Index pattern consistent
- ✅ `MDX_CONTENT_SELECTOR` constant referenced từ Phase 3 + Phase 4

**Verdict**: Plan ready for `/ck:cook`. Sub-12h ambition dropped — realistic 18-25h scope locked in.
