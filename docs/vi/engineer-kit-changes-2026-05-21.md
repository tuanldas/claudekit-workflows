# Engineer Kit Update — 2026-05-21

Tài liệu các thay đổi quan trọng từ Engineer Kit update gần đây.

---

## Pattern Changes (áp dụng nhiều skills)

### 1. Delegation Architecture Explicit

Các skills giờ explicitly delegate phases sang subagents/skills:
- `ck:cook`: Testing → spawn `tester`; Code-review → spawn `code-reviewer`; Finalize → invoke `/ck:project-management`
- `ck:fix`: Diagnosis → `ck:debug` + `ck:sequential-thinking`; Code-review mandatory
- `ck:ship`: Journal → `/ck:journal`; Docs → `/ck:docs update`
- `ck:scout`: Task registration explicit (skip if ≤2 agents, fallback TodoWrite)

### 2. Hard Gates với XML Tags

Thay vì prose, gates được mark explicitly:
- `<HARD-GATE>` — non-negotiable constraint
- `<HARD-GATE-SCOUT-FIRST>` — mandatory scout
- `<HARD-GATE-EXACT-REQUIREMENTS>` — 5-item requirement capture
- `<HARD-GATE-EXACT-ROOT-CAUSE>` — 6-item evidence-based diagnosis
- `<HARD-GATE-NO-SIDE-EFFECTS>` — verify 5 impact areas

### 3. Process Flows: Diagram-Authoritative

Cook, Fix, Brainstorm giờ có Mermaid flowcharts với explicit mandate:
> "This diagram is the authoritative workflow. If prose conflicts với diagram, follow the diagram."

### 4. Evidence-First Culture

- **code-review**: "Iron Law: NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE"
- **fix**: 3+ failed attempts → MUST question architecture
- **debug**: "NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST"
- **test**: "NEVER IGNORE FAILING TESTS"

Verification pattern: IDENTIFY command → RUN → READ → VERIFY → CLAIM

---

## Per-Skill Updates

### ck:cook (HIGH priority changes)

**NEW:**
- Finalize phase MANDATORY (project-management + docs + git + journal explicit)
- Testing/code-review delegated to subagents (not inline)
- Anti-rationalization table cho common excuses
- Diagram-authoritative workflow

**CHANGED:**
- Workflow steps formalized với hard-gate tags

---

### ck:fix (HIGH priority changes)

**NEW:**
- 6-step sequence: Mode → Scout → Diagnose → Assess complexity → Fix → Verify+Prevent → Finalize
- **Prevention gate** explicit step (regression tests, guards)
- Complexity assessment + task orchestration mandatory
- 6-item evidence requirement: symptom, repro, expected vs actual, cause, why-now, blast-radius

**CHANGED:**
- `ck:debug` integration explicit (mandatory for diagnosis)

---

### ck:brainstorm (HIGH priority changes)

**NEW:**
- Scope Assessment phase (detect multi-concern requests, decompose)
- Plan handoff explicit: offer `/ck:plan --tdd` vs default `/ck:plan`
- Exact requirements gate added

**CHANGED:**
- Scout-first hard-gate now formalized

---

### ck:code-review (HIGH priority changes)

**MAJOR REFACTOR:** Now meta-skill với 3 practices
- Practice 1: Receiving feedback với technical rigor (vs performative agreement)
- Practice 2: Requesting reviews via `code-reviewer` subagent
- Practice 3: Verification gates requiring evidence trước any status claims

**NEW:** "Iron Law" — NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE

---

### ck:ship (MEDIUM priority changes)

**NEW:**
- 12 steps (was 10)
- `--skip-journal` flag
- `--skip-docs` flag
- Journal/docs giờ dùng skills (not inline)
- Background tasks không block pipeline

---

### ck:test (MEDIUM)

**NEW:**
- Default AskUserQuestion (code tests vs UI tests)
- Skill orchestration với `ck:debug` và `sequential-thinking`
- Team mode documented

---

### ck:scout (MEDIUM)

**NEW:**
- Task management explicit
- Fallback to TodoWrite if Task tools unavailable
- `project-organization` invocation automatic
- Config-driven external mode (`gemini.model` trong `~/.claude/.ck.json`)

---

### ck:debug (MEDIUM)

**EXPANDED:**
- 10 techniques (was 4)
- System-level diagnostics added
- Performance analysis added
- Log analysis enhanced
- Task management added

---

### ck:ask (MEDIUM)

**FORMALIZED:**
- 4-advisor framework explicit
- 5-section output format
- Consultation-only framing reinforced

---

## NEW SKILLS — Previously Undocumented (82 skills)

### ck-autoresearch Family (5 skills) — NEW

| Skill | Purpose |
|-------|---------|
| `ck:autoresearch` | Routes autonomous research loops to right variant (meta-framework từ Udit Goenka MIT) |
| `ck:loop` | Iterative optimization loop — N iterations against mechanical metric, auto-keep/discard |
| `ck:predict` | 5 expert personas debate trước implementation (covered earlier) |
| `ck:scenario` | 12-dimensional edge case generation (covered earlier) |
| `ck:security` | STRIDE + OWASP audit (covered earlier) |

---

### Safety & Context Family (8 skills) — NEW

| Skill | Purpose |
|-------|---------|
| `careful` | Safety guardrails — warns trước rm -rf, DROP TABLE, force-push, git reset --hard |
| `freeze` | Restrict file edits to specific directory (blocks Edit/Write outside path) |
| `unfreeze` | Clear freeze boundary |
| `guard` | Full safety mode (careful + freeze combined) — destructive warnings + directory-scoped edits |
| `checkpoint` | Save/resume working state checkpoints — git state, decisions, remaining work |
| `context-save` | Save context (git state, decisions) cho future session resume |
| `context-restore` | Restore most recently saved context |
| `plan-tune` | Self-tune question sensitivity + developer psychographic profile |

---

### QA Family (4 skills) — NEW

| Skill | Purpose |
|-------|---------|
| `qa` | Full QA loop: test + fix bugs + commit each atomically + re-verify (3 tiers: Quick/Standard/Exhaustive) |
| `qa-only` | Report-only QA — test + produce structured report (no fixes) |
| `qa-full` | Internal reference cho qa-full sub-commands (check, audit, full, accept, regression, verify-issue) |
| `qa-pro-max` | Comprehensive QA cho SaaS teams — test plan, write tests, regression, API, security, performance |

---

### Browser/Testing Family (5 skills) — NEW

| Skill | Purpose |
|-------|---------|
| `browse` | Fast headless browser cho QA testing (~100ms per command) |
| `scrape` | Pull data từ web page; first call prototypes, subsequent uses codified skill (~200ms) |
| `canary` | Post-deploy canary monitoring — watch live app cho console errors, performance regressions |
| `benchmark` | Performance regression detection qua browse daemon |
| `benchmark-models` | Cross-model benchmark (Claude vs GPT vs Gemini) cho gstack skills |

---

### AI/LLM Tools (5 skills) — NEW

| Skill | Purpose |
|-------|---------|
| `claude-api` | Build/debug/optimize Claude API + Anthropic SDK apps; includes prompt caching, model migration |
| `claude-code` | Claude Code installation, slash commands, hooks, plugins, IDE integration, CI/CD |
| `codex` | OpenAI Codex CLI wrapper — 3 modes (code review, challenge, consult) |
| `humanizer` | Remove signs of AI-generated writing (em dash overuse, AI vocabulary, vague attributions) |
| `skillify` | Codify recent successful /scrape flow thành permanent browser-skill |

---

### Codebase Understanding (3 NEW) — Đã có understand family

| Skill | Purpose |
|-------|---------|
| `health` | Code quality dashboard — type checker + linter + tests + dead code, weighted 0-10 score, trends |
| `learn` | Manage project learnings — review, search, prune, export across sessions |
| `devex-review` | Live DX audit — actually TEST developer experience qua browse, time TTHW, screenshot errors |

---

### Documentation & Release (4 skills) — NEW

| Skill | Purpose |
|-------|---------|
| `document-release` | Post-ship doc update — Diataxis framework, CHANGELOG polish, architecture diagram drift |
| `document-generate` | Generate missing docs từ scratch using Diataxis (tutorial/how-to/reference/explanation) |
| `retro` | Sprint retrospective từ git history — velocity, commits/day, file hotspots, churn |
| `make-pdf` | Markdown → publication-quality PDF với margins, page numbers, TOC, watermark |

---

### Deployment Family (4 skills) — NEW

| Skill | Purpose |
|-------|---------|
| `land-and-deploy` | Merge PR → wait CI + deploy → verify production health via canary |
| `setup-deploy` | Configure deployment settings cho land-and-deploy (auto-detect platform) |
| `landing-report` | Read-only queue dashboard cho workspace-aware ship (VERSION slots) |
| `review` | Pre-landing PR review — SQL safety, LLM trust boundary, conditional side effects |

---

### Gstack / GBrain (5 skills) — NEW

| Skill | Purpose |
|-------|---------|
| `gstack` | Fast headless browser cho QA testing + site dogfooding |
| `gstack-upgrade` | Upgrade gstack to latest version |
| `open-gstack-browser` | Launch GStack Browser — AI-controlled Chromium với sidebar extension |
| `setup-gbrain` | Set up gbrain (local knowledge graph) cho coding agent |
| `sync-gbrain` | Keep gbrain current với repo's code, refresh agent search guidance |
| `ai-rules-setup` | AI Rules Setup cho cross-tool compatibility |
| `setup-browser-cookies` | Import cookies từ real Chromium browser into headless browse session |

---

### Specialized Skills — NEW

| Skill | Purpose |
|-------|---------|
| `office-hours` | YC-style brainstorming — startup mode (6 forcing questions) hoặc builder mode |
| `brand-namer` | Name products/projects/brands với domain verification và conflict detection |
| `investigate` | Systematic debugging với 4 phases (Iron Law: no fixes without root cause) |
| `debugging` | Systematic debugging framework (root cause investigation before fixes) |
| `cso` | Chief Security Officer mode — daily vs comprehensive scans, trend tracking |
| `cti-expert` | Cyber Threat Intelligence + OSINT cases |
| `tanstack` | TanStack Start, Form, AI (đã documented) |
| `analytics` | Marketing analytics, KPI tracking, attribution analysis |
| `docs-project` | Internal reference cho docs-project sub-commands (prd, qa, ui, full) |
| `pair-agent` | Pair remote AI agent với browser (one-command setup, scoped access) |
| `find-skills` | Discover và install skills (covered earlier) |
| `coding-level` | Set coding experience level (covered earlier) |

---

### ck- Prefixed Versions

Some skills có cả `ck-` prefix versions:
- `ck-code-review` (alongside `code-review`)
- `ck-debug` (alongside `debug`)
- `ck-graphify` (alongside `graphify`)
- `ck-loop`, `ck-predict`, `ck-scenario`, `ck-security`, `ck-autoresearch`
- `ck-plan` (alongside `plan`)

Lý do: `ck-` prefix versions thường là gstack/marketing kit variants với slightly different invocations. Behavior tương đương các skills gốc.

---

## Updates Cần Áp Dụng vào Docs

### High Priority

1. **01-core-workflow.md** — Update cook/fix/ship với:
   - Finalize step explicit
   - Hard gate XML tags
   - Diagram-authoritative note
   - New flags

2. **02-thinking-tools.md** — Update brainstorm/ask/debug với:
   - Brainstorm: Scope Assessment phase
   - Ask: 4-advisor framework
   - Debug: 10 techniques

3. **Tạo file mới `13-safety-context.md`** — careful, freeze, guard, checkpoint, context-save/restore, plan-tune

4. **Tạo file mới `14-qa-testing.md`** — qa, qa-only, qa-full, qa-pro-max, browse, scrape, canary, benchmark

5. **Tạo file mới `15-claude-tools.md`** — claude-api, claude-code, codex, humanizer, skillify

6. **Tạo file mới `16-deployment-release.md`** — land-and-deploy, setup-deploy, landing-report, review, document-release, document-generate, retro, make-pdf

7. **Tạo file mới `17-gstack-gbrain.md`** — gstack, gstack-upgrade, open-gstack-browser, setup-gbrain, sync-gbrain, ai-rules-setup, setup-browser-cookies

### Medium Priority

- Update `09-codebase-tools.md` add health, learn, devex-review
- Update `12-agents.md` confirm agents còn match latest
- Update `claudekit-overview.md` reflect new structure

---

## Unresolved Questions

1. **Skill duplicates**: Một số skills có cả tên gốc lẫn `ck-` prefix (e.g., `code-review` vs `ck-code-review`). Phải document cả hai hay chỉ một? Likely chỉ document `ck-` prefix version vì đó là chính thức ClaudeKit invocation.

2. **gstack vs ClaudeKit**: Một số skills (`gstack`, `gstack-upgrade`, `pair-agent`, `careful`, etc.) thuộc gstack ecosystem. Có nên separate hay merge?

3. **anthropic-skills:**: Các skills prefix `anthropic-skills:` (docx, pdf, pptx, xlsx, humanizer, skill-creator, consolidate-memory, setup-cowork) là Anthropic stock skills. Document separately hay merge?

4. **product-management:**: Skills như `product-management:write-spec`, `product-management:competitive-brief` là plugin riêng. Document hay skip?
