# ClaudeKit — Overview & Index

Catalog đầy đủ ClaudeKit (130+ skills, 13+ agents, 15+ workflows) tổ chức theo category để tham khảo khi thiết kế workflow.

**Official docs:** https://docs.claudekit.cc/

---

## Cấu trúc Documentation

```
docs/
├── claudekit-overview.md           ← bạn đang ở đây
├── workflow-patterns.md            ← decision matrices, common chains
├── engineer-kit-changes-2026-05-21.md  ← LATEST: Engineer Kit update changelog
├── engineer/
│   ├── 01-core-workflow.md         ← plan, cook, fix, bootstrap, ship, test, code-review
│   ├── 02-thinking-tools.md        ← ask, brainstorm, predict, scenario, research, problem-solving
│   ├── 03-plan-reviews.md          ← plan-ceo/design/eng/devex/autoplan/tune
│   ├── 04-design.md                ← design-consultation/shotgun/html, frontend-design, stitch, ui-ux-pro-max
│   ├── 05-frontend.md              ← frontend-development, web-frameworks, ui-styling, react, threejs, etc.
│   ├── 06-backend-infra.md         ← backend-dev, databases, auth, payment, deploy, devops, security
│   ├── 07-mobile-media.md          ← mobile-development, ai-artist/multimodal, media-processing, browsers
│   ├── 08-docs-files.md            ← docs, docs-seeker, llms, mermaidjs, preview, files (xlsx/pdf/docx/pptx)
│   ├── 09-codebase-tools.md        ← understand-*, gkg, repomix, scout, web-testing
│   ├── 10-ai-mcp.md                ← context-engineering, ADK, MCP builder/management/use, agentize
│   ├── 11-coordination.md          ← team, worktree, git, journal, project-mgmt, utilities
│   ├── 12-agents.md                ← 13 engineer agents
│   ├── 13-safety-context.md        ← NEW: careful, freeze, guard, checkpoint, context-save/restore
│   ├── 14-qa-browser-testing.md    ← NEW: qa family, browse, scrape, canary, benchmark, health
│   ├── 15-claude-ai-tools.md       ← NEW: claude-api, claude-code, codex, humanizer, skillify
│   ├── 16-deployment-release.md    ← NEW: land-and-deploy, document-release, retro, make-pdf
│   └── 17-gstack-gbrain.md         ← NEW: gstack ecosystem, gbrain, pair-agent, cso, cti-expert, office-hours
├── marketing/
│   ├── 01-core.md                  ← init, hub, dashboard
│   ├── 02-content.md               ← write, copywriting, content-marketing, slides, creativity
│   ├── 03-seo-analytics.md         ← seo, analytics, competitor
│   ├── 04-email-social.md          ← email, social, video, youtube, elevenlabs
│   ├── 05-campaigns.md             ← campaign, funnel, launch, play, paid-ads, etc.
│   ├── 06-strategy.md              ← planning, research, psychology, pricing, persona, brand
│   ├── 07-conversion.md            ← form-cro, onboarding-cro, ab-test-setup
│   ├── 08-design.md                ← design, logo, banner, CIP, kit-builder
│   └── 09-agents.md                ← marketing agents
└── workflows/
    ├── engineering.md              ← 8 chính thức từ docs.claudekit.cc
    └── marketing.md                ← 7 chính thức từ docs.claudekit.cc
```

---

## Quy ước Prefix

| Prefix | Số lượng | Mục đích |
|--------|---------|----------|
| `ck:` | ~80 | Engineer skills — development, design, infra |
| `ckm:` | ~50 | Marketing skills — content, SEO, social, campaign |
| (no prefix) | ~10 | Standalone — plan reviews, design, understand utilities |

---

## Quick Decision Trees

### Build code feature
```
Simple bug fix       → ck:fix
Small feature        → ck:cook (skip plan)
Standard feature     → ck:plan → ck:cook → ck:ship
Complex feature      → ck:brainstorm → ck:plan --hard → autoplan → design → ck:cook → ck:ship
New project          → ck:bootstrap
```

### Marketing campaign
```
Single blog post     → ckm:write:good
Email sequence       → ckm:email flow
Full campaign        → ckm:marketing-research → ckm:persona → ckm:marketing-planning → ckm:campaign create
Product launch       → ckm:launch-strategy → ckm:campaign → ckm:analytics
```

### Need to understand existing code
```
Quick file lookup    → ck:scout
Understand patterns  → ck:understand
Architecture review  → ck:graphify hoặc ck:gkg
PR/diff analysis     → ck:understand-diff
Full repo context    → ck:repomix
```

### Design work
```
New project, no design system    → design-consultation
Have brand, explore options       → design-shotgun
Approved design, code vanilla     → design-html
Approved design, code framework   → ck:frontend-design
Audit live site                   → design-review
```

---

## Tổng số tài nguyên

| Loại | Số lượng |
|------|---------|
| Engineer Skills | 50+ |
| Marketing Skills (ckm:) | 50+ |
| Plan Review Skills | 6 |
| Design Skills | 7 |
| Engineer Agents | 13 |
| Marketing Agents | 16+ |
| Official Workflows | 15+ |
| CLI Commands | 9 |

---

## How to use this reference

1. **Tra cứu nhanh**: Đọc file theo category bạn cần
2. **Quyết định**: Xem decision trees ở trên hoặc `workflow-patterns.md`
3. **Detail từng skill**: Mỗi file category có format chuẩn — Purpose, USE when, DON'T use, Flags, Modes, Inputs/Outputs, Hard gates, Pitfalls, Difference from similar
4. **Cross-reference**: Mỗi skill có link tới docs.claudekit.cc gốc

## Format mỗi command

```markdown
## ck:[name]

**Purpose:** 1 câu mô tả chính xác
**USE when:** specific situations
**DON'T use when:** specific situations
**Subcommands/Flags:** mỗi flag thay đổi behavior thế nào
**Modes:** các modes nếu có
**Inputs/Outputs:** user cung cấp gì / files ra đâu
**Hard gates:** must-haves
**Pitfalls:** lỗi thường gặp
**Difference from:** vs commands tương tự
**Docs:** link tới official docs
```
