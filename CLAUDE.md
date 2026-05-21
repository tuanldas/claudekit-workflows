# ClaudeKit Workflows — Project Context

## Mục đích

Trang web tương tác hiển thị workflows của ClaudeKit (130+ skills, 13 agents, 15 official workflows) giúp user trực quan hóa và tra cứu commands. Lấy cảm hứng từ ClaudeKit Control Center (localhost:3457/workflows).

**Live URL:** http://localhost:3001 (dev server)
**GitHub:** https://github.com/tuanldas/claudekit-workflows

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | **Next.js 16** (App Router, Turbopack) | SEO, easy deploy Vercel |
| Language | **TypeScript** strict mode | Type safety |
| Styling | **Tailwind CSS v4** | Utility-first, fast |
| Flow viz | **@xyflow/react** (ReactFlow) | Pan/zoom/drag canvas |
| i18n | Context-based (custom) | VI mặc định, EN optional, no extra deps |

---

## Cấu trúc thư mục

```
src/
├── app/
│   ├── layout.tsx           ← LanguageProvider wrap, lang="vi"
│   ├── page.tsx             ← entry point (renders WorkflowPage)
│   └── globals.css          ← Tailwind imports
├── components/
│   ├── workflow-page.tsx    ← Main page container
│   ├── workflow-card.tsx    ← Grid card với level badge, duration, command chain
│   ├── workflow-detail.tsx  ← Inline expansion (2-cột: info + ReactFlow canvas)
│   ├── workflow-flow-canvas.tsx  ← ReactFlow setup, pan/zoom/drag
│   ├── category-tabs.tsx    ← Filter tabs (11 categories)
│   ├── search-bar.tsx       ← Search input
│   ├── language-switcher.tsx ← VI/EN toggle
│   ├── level-badge.tsx      ← Beginner/Intermediate/Advanced colored badges
│   └── flow-steps.tsx       ← Command chain với arrows trong card preview
├── data/
│   └── workflows.ts         ← Single source of truth: 39 workflows
├── i18n/
│   ├── translations.ts      ← UI strings VI/EN
│   └── language-context.tsx ← React Context + localStorage persistence
└── types/
    └── workflow.ts          ← TypeScript types (LocalizedString, Workflow, etc.)
```

---

## Quyết định quan trọng

### 1. i18n — Custom Context approach
- **KHÔNG dùng** next-intl / next-i18next (overkill cho 2 ngôn ngữ)
- **DÙNG** React Context + `localStorage` persistence
- **Default**: VI luôn (sửa trong `src/i18n/translations.ts`: `DEFAULT_LOCALE = "vi"`)
- **HTML lang**: `<html lang="vi">` cho SEO

### 2. Data structure — Localized strings inline
- Mỗi field text dạng `{ vi: string, en: string }` thay vì 2 file riêng
- Type `LocalizedString` trong `src/types/workflow.ts`
- **Lý do**: dễ maintain, ít duplicate, type-safe

### 3. Workflow ordering — Advanced first
- Array `workflows` trong `src/data/workflows.ts` xếp **Advanced Pipelines** lên đầu
- Category order trong `categoryOrder` cũng đặt `advanced-pipelines` ngay sau `all`
- **Lý do**: User muốn workflows nâng cao (chuỗi end-to-end) ưu tiên hiển thị

### 4. Detail panel — Inline expansion (not modal)
- Khi click card, expand inline ABOVE grid (giống ClaudeKit Control Center)
- **KHÔNG dùng modal popup** (đã thử, user reject)
- Layout 2 cột: info+phases bên trái, ReactFlow canvas bên phải

### 5. Canvas — ReactFlow với pan/zoom/drag
- Boxes có thể kéo thả riêng lẻ
- Pan toàn canvas
- Zoom controls
- Mỗi phase = 1 node với colored top border (cycling through phaseColors array)

---

## Cách thêm workflow mới

1. Mở `src/data/workflows.ts`
2. Thêm object vào array `workflows`, theo schema trong `src/types/workflow.ts`:
   ```ts
   {
     id: "kebab-case-unique",
     title: { vi: "...", en: "..." },
     description: { vi: "...", en: "..." },
     level: "beginner" | "intermediate" | "advanced",
     duration: "30 min" | "2-4 hrs" | "1-2 days",
     category: WorkflowCategory,
     steps: [{ command: "/ck:plan", label: { vi: "plan", en: "plan" } }],
     phases: [
       {
         name: { vi: "...", en: "..." },
         duration: "30 min",
         steps: [{
           command: "/ck:cook",
           description: { vi: "...", en: "..." },
           optional?: false,
           alternative?: { vi: "...", en: "..." },
         }],
       },
     ],
     tips?: [{ vi: "...", en: "..." }],
     shortcut?: { vi: "...", en: "..." },
   }
   ```
3. Nếu cần category mới, update 3 files:
   - `src/types/workflow.ts` → type `WorkflowCategory`
   - `src/data/workflows.ts` → `categoryOrder`
   - `src/i18n/translations.ts` → `uiStrings.categories`

---

## Reference Documentation

**Toàn bộ ClaudeKit commands/skills/agents** đã được catalog trong `docs/`:

```
docs/
├── claudekit-overview.md                       ← Index + decision trees
├── engineer-kit-changes-2026-05-21.md          ← Latest changelog
├── workflow-patterns-decision-matrices.md      ← 10 patterns + 10 matrices
├── engineer/                                   ← 17 files (~145KB)
│   ├── 01-core-workflow.md      plan/cook/fix/ship/test/code-review/scout/debug
│   ├── 02-thinking-tools.md     brainstorm/ask/predict/scenario/research
│   ├── 03-plan-reviews.md       4 plan reviews + autoplan + plan-tune
│   ├── 04-design.md             design pipeline
│   ├── 05-frontend.md           React/Next/UI/3D/Mobile
│   ├── 06-backend-infra.md      backend/auth/payment/deploy/security
│   ├── 07-mobile-media.md       AI artist/multimodal/media/browsers
│   ├── 08-docs-files.md         docs/llms/diagrams/office files
│   ├── 09-codebase-tools.md     understand-*/gkg/repomix/xia
│   ├── 10-ai-mcp.md             context-eng/ADK/MCP
│   ├── 11-coordination.md       team/worktree/git/journal/utilities
│   ├── 12-agents.md             13 specialist agents
│   ├── 13-safety-context.md     careful/freeze/guard/checkpoint
│   ├── 14-qa-browser-testing.md qa family/browse/scrape/benchmark/health
│   ├── 15-claude-ai-tools.md    claude-api/claude-code/codex/humanizer
│   ├── 16-deployment-release.md land-and-deploy/document-release/retro/make-pdf
│   └── 17-gstack-gbrain.md      gstack ecosystem/gbrain/pair-agent/cso/office-hours
├── marketing/                                  ← 9 files
└── workflows/                                  ← Official ClaudeKit workflows
```

**KHI THÊM WORKFLOW MỚI**, đọc trước:
- `docs/claudekit-overview.md` (decision trees để pick commands)
- `docs/engineer/0X-*.md` cho domain-specific commands
- `docs/workflows/engineering-workflows-reference.md` cho official patterns
- **docs.claudekit.cc** cho official documentation

---

## Development Commands

```bash
npm run dev        # Dev server (port 3001, auto if 3000 busy)
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint
```

---

## Deployment

- **Recommended**: Vercel (one-click deploy từ GitHub)
- **Alternative**: Cloudflare Pages, Netlify, Railway
- Build output: `out/` (Next.js static) hoặc serverless
- **Env vars**: None required (toàn bộ data trong code)

---

## Workflows quan trọng khi develop project này

### Thêm tính năng UI mới
```
1. /ck:brainstorm "tinh nang"
2. /ck:plan
3. /ck:cook
4. Test locally on http://localhost:3001
5. /ck:ship
```

### Update workflow data
```
1. Edit src/data/workflows.ts trực tiếp (không cần plan)
2. Save → Next.js HMR auto-reload
3. Verify visually
4. /ck:git cm
```

### Update ClaudeKit reference docs
```
1. Khi ClaudeKit update version
2. Read SKILL.md files trong ~/.claude/skills/
3. Cross-reference với docs.claudekit.cc
4. Update files trong docs/engineer/ hoặc docs/marketing/
5. Update docs/engineer-kit-changes-{date}.md với changelog
```

### Fix bug
```
/ck:fix "mô tả bug"     # all-in-one workflow
```

---

## Conventions

- **Files**: kebab-case (`workflow-card.tsx`, not `WorkflowCard.tsx`)
- **Components**: React functional, "use client" khi cần state/effects
- **Types**: PascalCase interfaces (`Workflow`, `WorkflowPhase`)
- **Commit messages**: Conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`)
- **NO emojis** trong code/files (trừ khi user explicitly request)
- **Vietnamese default** cho mọi UI strings + commit messages về i18n

---

## Known Issues / TODOs

- [ ] Engineer/marketing skill counts có thể outdated (refresh khi ClaudeKit upgrade)
- [ ] Dashboard hiện chỉ desktop-optimized; mobile responsive cần polish
- [ ] Search hiện đơn giản (string contains); có thể upgrade Fuse.js cho fuzzy search
- [ ] Chưa có dark mode (DESIGN.md chưa có)

---

## Unresolved Questions

1. Skills có cả `ck-` prefix (e.g., `ck-code-review`) và bare name (`code-review`) — document cả 2 hay chỉ 1?
2. gstack vs ClaudeKit skills tách riêng hay merge?
3. `anthropic-skills:` prefix và `product-management:` plugins có include?

---

## Memory & Context

- **User profile**: Saved tại `~/.claude/projects/-Users-admin-Desktop-Codes-tmp/memory/`
- **Key memory**: `user_claudekit-workflow-preference.md` (user prefers full end-to-end workflows với review gates)
- **Existing basic guide**: https://vividkit.dev/vi/guides/workflows (basic 30+ workflows, missing full pipelines — this project complements it)
