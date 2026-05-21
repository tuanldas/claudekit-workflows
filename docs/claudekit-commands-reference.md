# ClaudeKit Commands & Skills Reference

Catalog đầy đủ các command/skill của ClaudeKit để tham khảo khi thiết kế workflow mới cho project này.

**Dùng để:** Khi cần thêm workflow mới vào `src/data/workflows.ts`, dùng tài liệu này để tra cứu command nào phù hợp.

---

## Quy ước Prefix

| Prefix | Số lượng | Mục đích |
|--------|---------|----------|
| `ck:` | ~80 | Development — plan, code, test, review, deploy, design, docs |
| `ckm:` | ~50 | Marketing — content, SEO, social, campaign, analytics |
| (không prefix) | ~15 | Plan reviews, design, understand utilities |

---

## 1. CORE WORKFLOW COMMANDS (ck:)

### Pipeline chính
| Command | Mục đích | Flags chính |
|---------|---------|-------------|
| `ck:bootstrap` | Tạo dự án mới A-Z | `--full`, `--fast`, `--auto`, `--parallel` |
| `ck:plan` | Lên kế hoạch tính năng | `--fast`, `--hard`, `--parallel`, `--two`, `validate`, `ci` |
| `ck:cook` | Trien khai code theo plan | `--fast`, `--auto`, `--parallel`, `--tdd`, `--no-test`, `--interactive` |
| `ck:fix` | Fix bug all-in-one | `--auto`, `--quick`, `--review`, `--parallel`, `--security` |
| `ck:test` | Chạy test suite | `--e2e`, `--coverage`, `--unit` |
| `ck:code-review` | Adversarial review | PR#, commit, `--pending`, `--security` |
| `ck:ship` | Test → review → version → PR | `--official`, `--beta`, `--skip-tests`, `--skip-review` |
| `ck:deploy` | Deploy lên 15+ platforms | (auto-detect) |
| `ck:devops` | Docker, K8s, CI/CD | |

### Thinking & Research
| Command | Mục đích |
|---------|---------|
| `ck:brainstorm` | Phân tích approaches với SAFE/RISK |
| `ck:ask` | 4 expert advisors |
| `ck:scout` | Tìm file trong codebase |
| `ck:debug` | Root cause analysis |
| `ck:sequential-thinking` | Suy luận tuần tự, branching |
| `ck:predict` | 5 personas debate (Architect, Security, Performance, UX, Operations) |
| `ck:scenario` | Generate edge cases (12 dimensions) |
| `ck:research` | Deep multi-source research |
| `ck:autoresearch` | Auto-research patterns |
| `ck:problem-solving` | Reframe khi stuck |

---

## 2. PLAN REVIEW COMMANDS (no prefix)

| Command | Vai trò | Modes |
|---------|---------|-------|
| `plan-ceo-review` | Challenge scope & strategy | SCOPE EXPANSION, SELECTIVE EXPANSION, HOLD SCOPE, SCOPE REDUCTION |
| `plan-design-review` | Chấm điểm UI/UX (0-10) | — |
| `plan-eng-review` | Lock architecture + edge cases | — |
| `plan-devex-review` | Audit DX (API, CLI, SDK) | DX EXPANSION, DX POLISH, DX TRIAGE |
| `autoplan` | Auto chạy 4 reviews trên (CEO → Design → Eng → DX) | — |
| `plan-tune` | Self-tune question sensitivity | — |

---

## 3. DESIGN COMMANDS (mix)

### Design system & exploration
| Command | Mục đích |
|---------|---------|
| `design-consultation` | Tạo DESIGN.md (font, color, spacing, motion) |
| `design-shotgun` | Generate nhiều visual variants |
| `design-html` | Finalize thành HTML/CSS production |
| `design-review` | Audit UI live site |
| `ck:stitch` | AI generate UI từ Google Stitch |
| `ck:ui-ux-pro-max` | Design intelligence (50+ styles, 161 palettes, 57 fonts) |

### Implementation
| Command | Mục đích |
|---------|---------|
| `ck:frontend-design` | Replicate mockup/screenshot thành code |
| `ck:frontend-development` | Build React/TS components |
| `ck:ui-styling` | Tailwind CSS + shadcn/ui |
| `ck:react-best-practices` | React performance patterns |
| `ck:web-design-guidelines` | Audit accessibility & UX |
| `ck:web-frameworks` | Next.js, RSC, Turborepo |
| `ck:tanstack` | TanStack Start/Form/AI |
| `ck:mobile-development` | React Native, Flutter, SwiftUI |
| `ck:threejs` | 3D / WebGL |
| `ck:shader` | GLSL shaders |
| `ck:remotion` | Video programmatic |

---

## 4. BACKEND & INFRA (ck:)

| Command | Mục đích |
|---------|---------|
| `ck:backend-development` | NestJS, FastAPI, Django |
| `ck:better-auth` | OAuth, JWT, passkeys, sessions |
| `ck:payment-integration` | Stripe, Polar, SePay |
| `ck:databases` | Schema, queries, migrations (MongoDB, PostgreSQL, MySQL, SQLite) |
| `ck:shopify` | Shopify apps, Polaris, Liquid |

---

## 5. SECURITY (ck:)

| Command | Mục đích |
|---------|---------|
| `ck:security` | STRIDE/OWASP audit + auto-fix |
| `ck:security-scan` | Scan secrets, vulnerabilities |
| `ck:cti-expert` | OSINT / threat intel |

---

## 6. DOCS & DIAGRAMS (ck:)

| Command | Mục đích |
|---------|---------|
| `ck:docs` | Update project docs |
| `ck:docs-seeker` | Tìm docs library/framework (context7) |
| `ck:llms` | Generate llms.txt |
| `ck:mermaidjs-v11` | Mermaid v11 diagrams |
| `ck:tech-graph` | SVG architecture diagrams (7 styles, 10 templates) |
| `ck:mintlify` | Build docs site với Mintlify |
| `ck:markdown-novel-viewer` | Long-form docs reader |
| `ck:preview` | Visual explanations, slides, HTML |
| `ck:find-skills` | Tìm skill phù hợp |

---

## 7. FILES & OFFICE (ck:)

| Command | Mục đích |
|---------|---------|
| `ck:xlsx` | Tạo/edit Excel |
| `ck:pdf` | Tạo/edit PDF |
| `ck:docx` | Tạo/edit Word |
| `ck:pptx` | Tạo/edit PowerPoint |
| `ck:repomix` | Pack repo cho LLM context |

---

## 8. CODEBASE UNDERSTANDING (mix)

| Command | Mục đích |
|---------|---------|
| `understand` | Onboard repo mới |
| `understand-diff` | Phân tích git diff/PR |
| `understand-explain` | Giải thích code pattern |
| `understand-chat` | Chat về codebase |
| `understand-onboard` | Guide onboarding |
| `understand-dashboard` | Dashboard understanding |
| `ck:gkg` | Semantic go-to-definition (GitLab KG) |
| `ck:graphify` | Tree-sitter AST knowledge graph |

---

## 9. AI / LLM (ck:)

| Command | Mục đích |
|---------|---------|
| `ck:context-engineering` | Agent architecture, memory |
| `ck:ai-multimodal` | Image/audio/video analysis |
| `ck:ai-artist` | AI image generation (Imagen, Nano Banana) |
| `ck:google-adk-python` | Google ADK agents |
| `ck:agentize` | Convert code thành CLI + MCP server |

---

## 10. MCP (ck:)

| Command | Mục đích |
|---------|---------|
| `ck:mcp-builder` | Build MCP server |
| `ck:mcp-management` | Manage MCP integrations |
| `ck:use-mcp` | Discover & execute MCP tools |

---

## 11. TESTING & BROWSER (ck:)

| Command | Mục đích |
|---------|---------|
| `ck:web-testing` | Playwright/Vitest/k6 strategy |
| `ck:agent-browser` | Drive a live browser |
| `ck:chrome-devtools` | Chrome DevTools workflows |

---

## 12. UTILITIES (ck:)

| Command | Mục đích |
|---------|---------|
| `ck:git` | Git operations |
| `ck:worktree` | Git worktree isolation |
| `ck:kanban` | Kanban board |
| `ck:plans-kanban` | Plans dashboard |
| `ck:project-management` | Track progress, update plans |
| `ck:project-organization` | Files & directory organization |
| `ck:coding-level` | Set trình độ để điều chỉnh output |
| `ck:journal` | Ghi nhật ký kỹ thuật |
| `ck:watzup` | Session hand-off summary |
| `ck:team` | Multi-session Agent Teams |
| `ck:loop` | Chạy command lặp lại |
| `ck:show-off` | HTML showcase interactive |
| `ck:xia` | Port features từ source repos |
| `ck:copywriting` | Conversion copy |
| `ck:skill-creator` | Tạo Claude skills mới |
| `ck:template-skill` | Skill template |

---

## 13. MARKETING — Content & Copy (ckm:)

| Command | Mục đích | Subcommands |
|---------|---------|-------------|
| `ckm:write` | Viết content | `:blog`, `:cro`, `:fast`, `:good`, `:enhance`, `:publish`, `:formula`, `:audit`, `:blog:youtube` |
| `ckm:content-marketing` | Content strategy & editorial | — |
| `ckm:content-hub` | Asset gallery + AI editor | — |
| `ckm:claude-code` | Claude Code marketing | — |

---

## 14. MARKETING — SEO & Analytics (ckm:)

| Command | Mục đích |
|---------|---------|
| `ckm:seo` | Audit SEO, keywords, pSEO |
| `ckm:competitor` | Phân tích đối thủ |
| `ckm:analytics` | KPI, GA4, attribution |
| `ckm:analyze` | Analysis & reports |

---

## 15. MARKETING — Social & Email (ckm:)

| Command | Mục đích |
|---------|---------|
| `ckm:social` | Posts cho Twitter, LinkedIn, IG, TikTok |
| `ckm:email` | Email sequences + automation |
| `ckm:elevenlabs` | Voice/audio generation |

---

## 16. MARKETING — Campaign & Funnel (ckm:)

| Command | Mục đích | Subcommands |
|---------|---------|-------------|
| `ckm:campaign` | Campaign planning & execution | `create`, `status`, `analyze`, `email` |
| `ckm:funnel` | Funnel design & optimization | `design`, `analyze`, `optimize` |
| `ckm:launch-strategy` | Product launch planning | — |
| `ckm:paid-ads` | Google/Meta/LinkedIn ads | — |
| `ckm:ads-management` | Ad campaign management | — |
| `ckm:affiliate-marketing` | Affiliate programs | — |
| `ckm:referral-program-building` | Referral programs | — |
| `ckm:gamification-marketing` | Gamification | — |
| `ckm:free-tool-strategy` | Free tool marketing | — |

---

## 17. MARKETING — Brand & Strategy (ckm:)

| Command | Mục đích |
|---------|---------|
| `ckm:brand` | Brand identity & voice |
| `ckm:marketing-planning` | Strategic marketing plans |
| `ckm:marketing-psychology` | 70+ mental models |
| `ckm:marketing-research` | Market intelligence |
| `ckm:marketing-ideas` | 140 growth ideas |
| `ckm:persona` | Customer personas |
| `ckm:pricing-strategy` | Pricing optimization |
| `ckm:creativity` | Creativity frameworks |

---

## 18. MARKETING — CRO & Conversion (ckm:)

| Command | Mục đích |
|---------|---------|
| `ckm:form-cro` | Form optimization |
| `ckm:onboarding-cro` | Onboarding optimization |
| `ckm:ab-test-setup` | A/B test setup |

---

## 19. MARKETING — Dashboard & Storage (ckm:)

| Command | Mục đích |
|---------|---------|
| `ckm:hub` | Central entry (Content Hub + Dashboard) |
| `ckm:dashboard` | Marketing dashboard |
| `ckm:marketing-dashboard` | Local-first marketing command center |
| `ckm:storage` | Asset storage (R2) |
| `ckm:kit-builder` | Kit builder |
| `ckm:init` | Initialize marketing project |
| `ckm:assets-organizing` | Organize assets |

---

## 20. MARKETING — Design & Media (ckm:)

| Command | Mục đích |
|---------|---------|
| `ckm:design` | Brand design |
| `ckm:design-system` | Design system |
| `ckm:logo-design` | Logo design |
| `ckm:banner-design` | Banner design |
| `ckm:cip-design` | CIP design |
| `ckm:youtube-thumbnail-design` | YouTube thumbnails |
| `ckm:video` | Video production |
| `ckm:slides` | Presentation slides |
| `ckm:youtube` | YouTube content |
| `ckm:play` | Marketing playbook |
| `ckm:debugging` | Marketing debugging |

---

## Speed Flags (apply to ck:plan, ck:cook, ck:fix, ck:bootstrap)

| Flag | Tác dụng |
|------|---------|
| `--fast` | Bỏ research, làm nhanh |
| `--hard` | Research sâu, plan chi tiết |
| `--auto` | Tự động, không hỏi |
| `--parallel` | Multi-agent song song |
| `--quick` | Fix nhanh nhất (cho `ck:fix`) |
| `--tdd` | Test-driven development (cho `ck:cook`) |
| `--no-test` | Bỏ qua test (caution) |
| `--interactive` | Hỏi confirm từng bước |

---

## Patterns Thường Gặp

### Pattern A: Feature Development
```
ck:brainstorm → ck:plan → ck:cook → ck:test → ck:code-review → ck:ship
```

### Pattern B: Full Pipeline với Reviews
```
ck:brainstorm → ck:plan --hard → autoplan → design pipeline → ck:cook → ck:ship
```

### Pattern C: Bug Fix
```
ck:scout → ck:debug → ck:fix → ck:test → ck:ship
hoặc all-in-one: ck:fix
```

### Pattern D: Design-First
```
design-consultation → design-shotgun → ck:plan --fast → ck:frontend-design → ck:cook → ck:ship
```

### Pattern E: Marketing Campaign
```
ckm:marketing-research → ckm:persona → ckm:marketing-planning →
ckm:write → ckm:seo → ckm:social → ckm:email → ckm:campaign create → ckm:analytics
```

### Pattern F: Product Launch
```
ck:brainstorm → ck:bootstrap → ckm:brand → ckm:launch-strategy → ckm:campaign create
```

---

## Cách Thêm Workflow Mới Vào Project

1. Mở `src/data/workflows.ts`
2. Thêm object workflow mới vào array `workflows`, theo schema trong `src/types/workflow.ts`
3. Cấu trúc cần thiết:
   - `id`: unique kebab-case
   - `title`: `{vi, en}` localized
   - `description`: `{vi, en}` localized
   - `level`: `beginner` | `intermediate` | `advanced`
   - `duration`: string (ví dụ "30 min", "2-4 hrs")
   - `category`: 1 trong các category trong `categoryOrder`
   - `steps`: array `{command, label: {vi, en}}` — dùng cho card preview
   - `phases`: array chi tiết với `name`, `duration`, `steps[]`
   - `tips` (optional): array `{vi, en}`
   - `shortcut` (optional): `{vi, en}`
4. Nếu cần category mới, thêm vào:
   - `src/types/workflow.ts` (type `WorkflowCategory`)
   - `src/data/workflows.ts` (`categoryOrder`)
   - `src/i18n/translations.ts` (`uiStrings.categories`)
5. Lưu — Next.js auto-reload, workflow xuất hiện ngay
