# Brainstorm — Docs Renderer + i18n Design

**Date:** 2026-05-21
**Status:** Design approved, plan pending (user chose "plan sau")
**Related research:** [researcher-260521-1702-i18n-md-patterns-report.md](./researcher-260521-1702-i18n-md-patterns-report.md)

---

## Problem statement

Project có 32 file markdown trong `docs/` (engineer/marketing/workflows/cli) chứa thông tin commands của ClaudeKit. App hiện tại chỉ render workflow dashboard từ hardcoded TS data. Cần:

1. Trang `/docs` riêng render được toàn bộ md files
2. Hỗ trợ đa ngôn ngữ (vi default + en đang dịch dần)
3. Sau này migrate workflow data sang JSON config dễ thêm/sửa
4. **Cấu hình tối thiểu** — user reject manual navigation.json vì phức tạp

## Requirements (user-confirmed)

| # | Requirement | Decision |
|---|-------------|----------|
| 1 | Goal | Trang /docs riêng + workflow JSON migration tương lai |
| 2 | Workflow data structure | Mỗi workflow 1 file JSON riêng (src/data/workflows/{slug}.json) |
| 3 | Docs nav approach | Auto-discover folder + optional override |
| 4 | Render strategy | Build-time SSG với MDX |
| 5 | URL i18n | Path-based `/[locale]/docs/...` |
| 6 | MD i18n convention | Subdirectory `docs/{locale}/...` |
| 7 | Features | Code highlight + TOC + Search + Anchor links |
| 8 | Fallback strategy | Serve VI + banner "Bản dịch sắp có" |

## Approaches evaluated

### Round 1 — Sidebar config strategy

| Phương án | Config | Verdict |
|-----------|--------|---------|
| Manual `docs-navigation.json` | ~150 dòng | ❌ User reject "phức tạp" |
| Pure filename convention | 0 file | ❌ Section title không i18n được |
| Auto + frontmatter override | 0-N file | ✅ Initial pick |
| `_meta.json` per folder (Nextra) | 5+ file | ⚠️ Trung gian |

### Round 2 — Sau khi research industry patterns

Research confirm subdirectory thắng. 3 alternatives final:

| Phương án | Config | Effort | Trade-off |
|-----------|--------|--------|-----------|
| A. Fumadocs framework | ~50 dòng | 2-4h | Lock-in, style tách biệt dashboard |
| **B. Custom auto-discover** ✅ | 0-15 dòng | 8-12h | Tích hợp dashboard hoàn hảo, no lock-in |
| C. Nextra _meta.json (DIY) | ~150-200 dòng | 6-10h | Nhiều config hơn B |

**Final pick: B** vì user đã đầu tư UI custom (workflow dashboard), Fumadocs sẽ chia 2 hệ design.

## Final design

### Tech stack additions

```
next-mdx-remote/rsc      → Build-time SSG MDX trong RSC
gray-matter              → Parse frontmatter
remark-gfm               → GFM (tables, task lists)
rehype-slug              → Auto heading ids
rehype-autolink-headings → Anchor links
shiki                    → Build-time syntax highlight
flexsearch               → Client-side full-text search (~7KB)
```

### File structure

```
docs/
├── vi/                          # Move 32 file hiện tại vào đây
│   ├── claudekit-overview.md
│   ├── engineer/01-17.md
│   ├── marketing/01-09.md
│   ├── workflows/*.md
│   └── cli/cli-commands-reference.md
└── en/                          # Fill dần, fallback sang vi

src/
├── app/
│   ├── page.tsx                 # 308 → /vi
│   └── [locale]/
│       ├── layout.tsx
│       ├── page.tsx             # Dashboard
│       └── docs/
│           ├── layout.tsx       # Sidebar + content + TOC
│           ├── page.tsx         # Landing
│           └── [...slug]/page.tsx
├── components/docs/
│   ├── docs-sidebar.tsx
│   ├── docs-toc.tsx
│   ├── docs-search.tsx
│   ├── translation-banner.tsx
│   ├── mdx-components.tsx
│   └── code-block.tsx
├── lib/
│   ├── docs-tree.ts             # Glob → tree
│   ├── mdx-loader.ts            # Load với fallback
│   └── search-index.ts          # Build-time index
└── data/workflows/              # Future migration target
```

### Auto-discover convention

- **Section**: folder name → "Engineer" (capitalize); override qua optional `_section.json`
- **Page title**: H1 hoặc frontmatter `title:`
- **Order**: filename prefix `01-`, `02-` hoặc frontmatter `order:`
- **Sidebar label**: frontmatter `nav_title:` (optional)
- **Hide**: frontmatter `hidden: true`

### URL scheme

```
/                                    → 308 → /vi
/vi/docs/engineer/01-core-workflow
/en/docs/engineer/01-core-workflow   → fallback vi + banner nếu file en thiếu
```

### Fallback logic

```ts
async function loadMdx(locale, slug) {
  if (exists(`docs/${locale}/${slug}.md`))
    return { content, fallback: false };
  if (exists(`docs/vi/${slug}.md`))
    return { content, fallback: true, originalLocale: locale };
  notFound();
}
```

## Implementation phases

| # | Phase | Effort |
|---|-------|--------|
| 1 | Locale restructure (move app→[locale]; docs→docs/vi; root redirect) | 1-2h |
| 2 | MDX pipeline + auto-discover loader | 3-4h |
| 3 | Docs UI (sidebar + TOC + MDX components + code-block shiki) | 3-4h |
| 4 | Search (flexsearch + Cmd+K) + translation banner | 2-3h |
| 5 *(optional, tách plan riêng)* | Workflow JSON migration | 2-3h |

**Tổng phases 1-4: ~9-13h**

## Risks

1. **Next.js 16 + `next-mdx-remote/rsc` compat**: chưa có official confirm với Next 16 → Phase 2 smoke test trước, fallback `@next/mdx` nếu cần
2. **Move 32 file md** sẽ break references trong `CLAUDE.md` project root → update cùng PR
3. **Existing dashboard** route `/` đang public → 308 redirect giữ backward compat
4. **EN content chưa có** → fallback banner cần wording tốt, không gây UX kém

## Success criteria

- [ ] User truy cập `/vi/docs` thấy sidebar auto-generated, click page render đúng
- [ ] `/en/docs/...` với file thiếu fallback sang VI + show banner
- [ ] Search Cmd+K tìm xuyên cả 32 file
- [ ] Code block highlighted, headings có anchor copy được
- [ ] Add file md mới chỉ cần đặt đúng folder, không cần update config nào
- [ ] Existing dashboard `/` vẫn work, redirect /vi

## Next steps

1. User confirm sẵn sàng → invoke `/ck:plan` với report này làm input
2. Plan sẽ chia phase 1-4 thành tasks chi tiết
3. Phase 5 (workflow JSON migration) tách brainstorm/plan riêng sau khi docs renderer ship

## Unresolved questions

1. Timeline EN translation? (ảnh hưởng wording banner)
2. Có scaling thêm ngôn ngữ thứ 3? (URL pattern `[locale]` đã sẵn cho N langs)
3. Cmd+K shortcut có cần ngoài search bar UI?
4. Có cần integration với translation service (Crowdin/Lokalise)?
