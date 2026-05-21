# ClaudeKit Commands & Skills — Detailed Reference

Tài liệu chi tiết để ra **quyết định** khi thiết kế workflow: mỗi flag/mode → tác dụng cụ thể, khi nào dùng, trade-off, pitfalls.

**Format mỗi command:**
- **Purpose**: 1 câu mô tả chính xác
- **When to use vs not use**: khi nào dùng / không dùng
- **Flags & subcommands**: mỗi flag thay đổi behavior thế nào
- **Modes**: các modes (nếu có) với trigger và output
- **Inputs / Outputs**: user cung cấp gì, ra file/artifact gì
- **Hard gates**: must-haves
- **Pitfalls**: lỗi thường gặp
- **Difference**: khác biệt với commands tương tự

---

# PART 1: CORE WORKFLOW COMMANDS

## ck:plan

**Purpose:** Tạo implementation plan với optional prompt enhancement, delegate sang sub-skills tùy mode.

**When to use vs not use:**
- USE: tạo plan cho feature/refactor/fix; cần research depth khác nhau; scope chưa rõ
- DON'T: chỉ execute plan có sẵn (dùng `ck:cook`); discuss architecture (dùng `ck:ask` hoặc `ck:brainstorm`)

**Flags & subcommands:**
| Flag/Sub | Tác dụng |
|----------|---------|
| `fast` | Bỏ research phase, đi thẳng analyze + plan; accept scout context có sẵn; KHÔNG research external |
| `hard` | Full research + deep analysis + thorough planning; consult external, evaluate tradeoffs, surface unresolved questions |
| `parallel` | Plan với phases parallel-executable; thêm phase ownership + dependency graph + multi-team coordination |
| `two` | Tạo 2 alternative plans với tradeoff comparison; user pick |
| `validate` | Validate plan có sẵn qua interview; challenge assumptions, identify gaps; KHÔNG tạo plan mới |
| `ci` | Analyze GitHub Actions logs → diagnose CI failures → fix plan; skip planning thường |
| `cro` | CRO plan cho content (specialized) |
| `archive` | Write journal entries, archive plans; delete plan files, save reflection |

**Modes:** FAST, HARD, PARALLEL, TWO, CI, ARCHIVE — chọn theo subcommand

**Inputs:** Task description (natural language) hoặc subcommand
**Outputs:** Plan file tại `./plans/plan-[TIMESTAMP]-[SLUG].md` hoặc subcommand-specific output

**Hard gates:**
- KHÔNG implementation code
- Phải detect active vs suggested plan trước
- Plan naming theo pattern từ `## Naming` section

**Pitfalls:** Dùng `hard` cho task trivial → lãng phí tokens; không enhance prompt → vague plans; skip plan-detection → duplicate plans

**Difference from similar:** Plan = PLANNING-ONLY. Khác Cook (implement), Ask (consult), Brainstorm (explore options)

---

## ck:cook

**Purpose:** End-to-end implementation với auto workflow detection routing qua research→plan→code→test→review.

**When to use vs not use:**
- USE: execute plan đã biết; scope rõ; cần full pipeline với reviews
- DON'T: debug (dùng `ck:fix`); chưa có plan & scope chưa rõ (dùng `ck:plan` trước); design chưa quyết (dùng `ck:brainstorm`)

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--interactive` | (default) User approval gates ở mỗi phase: research→plan→code→review→test→finalize |
| `--fast` | Bỏ research phase, jump scout→plan→code; GIỮ all review gates; trade research depth lấy speed |
| `--auto` | Auto-approve review gates nếu confidence ≥9.5 và 0 critical issues; GIỮ research+testing; bỏ human pause |
| `--parallel` | Multi-agent: spawn parallel fullstack-developer agents cho independent feature work; cần multi-phase scope |
| `--no-test` | Skip testing, surface unverified-tests risk qua AskUserQuestion để user accept trade-off |
| `--tdd` | Tests-first per phase: write tests for current behavior TRƯỚC refactor, verify pass sau implementation |

**Modes:** INTERACTIVE / AUTO / FAST / PARALLEL / CODE (load plan có sẵn) / NO-TEST

**Inputs:** Task description HOẶC path to plan file (plan.md / phase-XX-*.md)
**Outputs:** Code changes; phase files `./plans/phase-[NUM]-[NAME].md`; Claude Tasks; journal entry

**Hard gates (NON-NEGOTIABLE):**
- MANDATORY scout BEFORE planning (trừ input là plan.md đã có scout)
- MANDATORY capture exact requirements trước khi code
- MANDATORY code review qua `code-reviewer` subagent
- MANDATORY testing phase (trừ `--no-test`)
- MANDATORY finalize: project-management, docs sync, git-manager, journal
- NO side-effect implementation: tests pass, contracts unchanged, blast-radius verified

**Pitfalls:** Skip scout→plan "save time" → lãng phí debug sau; `--auto` có thể approve broken code nếu metrics bị gamed; `--no-test` risk silent regressions

**Difference from similar:** Cook = IMPLEMENTATION-FOCUSED. Khác Plan (planning only), Fix (bug only), Bootstrap (greenfield)

---

## ck:fix

**Purpose:** Unified bug-fixing với structured root-cause diagnosis TRƯỚC mọi fix attempt, ngăn symptom-patching.

**When to use vs not use:**
- USE: có concrete error/failing test/UI bug; cần fix properly với prevention
- DON'T: chỉ optimize/refactor (dùng `ck:cook`); architectural redesign (dùng `ck:brainstorm`); chưa có symptom rõ (dùng `ck:debug` investigation)

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--auto` | (default) Autonomous, auto-approve nếu score ≥9.5 & 0 critical; MANDATORY code review vẫn enforce |
| `--review` | Human-in-the-loop, pause approve ở MỌI step (diagnose, fix, verify); cho critical/production |
| `--quick` | Fast scout→diagnose→fix→review cho trivial (lint, type errors, one-file bugs); skip deep workflow |
| `--parallel` | Route sang parallel `fullstack-developer` agents per issue; 1 issue = 1 agent; cần 2+ independent bugs |

**Modes:** AUTONOMOUS / HUMAN-IN-THE-LOOP / QUICK / PARALLEL

**Inputs:** Bug description / error / test failure + flag
**Outputs:** Fixed code; updated tests với prevention; root-cause report; code review

**Hard gates:**
- MANDATORY scout trước diagnosis
- MANDATORY exact root-cause với evidence
- MANDATORY 100% test pass sau fix (trừ `--quick`)
- MANDATORY side-effect verification
- MANDATORY code review
- MANDATORY prevention measures
- NO guessing: nếu diagnosis fail 3+ lần → stop, question architecture
- NO silent patches: side effects detected → AskUserQuestion options

**Pitfalls:** Jump to fix without diagnosis → repeated failures; "quick fix later" never happens; sau 2+ failed attempts phải question architecture

**Difference from similar:** Fix = DIAGNOSIS-FIRST. Khác Cook (feature), Debug (investigation only, no implementation)

---

## ck:bootstrap

**Purpose:** End-to-end new project scaffolding từ requirements → research → tech stack → design → planning → implementation.

**When to use vs not use:**
- USE: starting completely new project/full-stack app; cần tech stack decisions
- DON'T: thêm vào existing project (dùng `ck:cook`); chỉ cần architecture advice (dùng `ck:ask`)

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--full` | (default) Full interactive với ultrathink; user approval ở mọi major phase |
| `--auto` | Auto explicit opt-in; ultrathink, auto-approve trừ design phase |
| `--fast` | Quick mode, hard thinking, skip research phase, GIỮ cook review gates |
| `--parallel` | Multi-agent với ultrathink; chỉ design review gates, parallel phase execution |

**Modes:** FULL / AUTO / FAST / PARALLEL

**Inputs:** Requirements (natural language) + mode flag
**Outputs:** Git repo + tech stack doc + DESIGN.md + plan file + code + tests + onboarding doc + journal

**Hard gates:**
- MANDATORY git init (ask user nếu `--full`)
- MANDATORY `ck:plan` invocation
- MANDATORY `ck:cook` invocation
- MANDATORY tech stack research before planning
- MANDATORY design review phase (mọi modes)
- All docs vào `./docs`, plans vào `./plans`

**Pitfalls:** Skip tech stack validation → wrong tool; design skipped → UI rework; `--parallel` cần clear task ownership

**Difference from similar:** Bootstrap = GREENFIELD-ONLY. Khác Cook (extend existing), Plan (no scaffolding), Ask (architecture only)

---

## ck:ship

**Purpose:** Automated ship workflow: detect branch, merge base, run tests, create versioned PR, optional merge.

**When to use vs not use:**
- USE: feature/fix complete & tested, ready push main/dev
- DON'T: still implementing (`ck:cook`); chưa ready review (`ck:code-review` trước); ship từ main (chỉ ship từ feature branch)

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `official` | Target main/master; bump VERSION + CHANGELOG; PR against main |
| `beta` | Target dev/develop; PR against dev; lighter versioning |
| `--dry-run` | Preview WOULD happen, không execute |
| (no args) | Infer mode từ branch name (feature/*→official, dev/*→beta) |

**Inputs:** Optional mode flag hoặc infer từ branch
**Outputs:** Commit với VERSION + CHANGELOG; GitHub PR auto-generated; optional merge; linked issues

**Hard gates:**
- KHÔNG ship từ main/dev/master (fatal error)
- MANDATORY pre-flight: git status clean, target ≠ current
- MANDATORY test execution trước PR
- MANDATORY diff review (source..target)
- MANDATORY version/CHANGELOG update
- MANDATORY issue linking

**Pitfalls:** Ship từ main là fatal; uncommitted changes silent included; dry-run hide real merge conflicts

**Difference from similar:** Ship = MERGE-FINAL. Khác Cook (develop), Code-Review (audit), Plan (design)

---

## ck:test

**Purpose:** Comprehensive testing framework: unit/integration/e2e, coverage, build validation, QA reports.

**When to use vs not use:**
- USE: sau implement; coverage validation; UI/visual regression; pre-commit
- DON'T: debug failing test (dùng `ck:debug` trước); design test strategy (dùng `ck:ask`)

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `ui [url]` | UI tests qua browser automation: screenshots, responsive, accessibility, form, console errors; skip code tests |
| (default) | AskUserQuestion: code tests vs UI tests |
| `--coverage` | Include coverage report; uncovered lines, % per file |
| `--verbose` | Full output với stack traces |

**Modes:** CODE-TESTS / UI-TESTS / COVERAGE-ONLY

**Inputs:** Test context HOẶC ui [url]
**Outputs:** Test results; coverage report; failed test list; QA report

**Hard gates:**
- "NEVER IGNORE FAILING TESTS"
- All critical paths phải có coverage
- Test isolation, deterministic
- Coverage thresholds (80%+ recommended)
- Build validation trước tests

**Pitfalls:** Mock/stub fake passing → hide bugs; skip coverage → untested code ships; interdependent tests → flaky

**Difference from similar:** Test = TEST-EXECUTION. Khác Code-Review (audit), Fix (diagnose), Debug (investigate)

---

## ck:code-review

**Purpose:** Adversarial code review với red-team analysis, actively cố gắng break code, detect security holes & failure modes.

**When to use vs not use:**
- USE: sau implementation trước commit/merge; review PR/commit; security audit
- DON'T: pure debugging (`ck:debug`); style/formatting (linters); design phase

**Flags/Subcommands:**
| Input | Mode |
|-------|------|
| `#123` hoặc PR URL | Fetch full PR diff qua `gh pr diff`; PR mode |
| `abc1234` (7+ hex) | Review single commit qua `git show`; commit mode |
| `--pending` | Staged + unstaged changes qua `git diff`; pending mode |
| `codebase` | Deep full-codebase scan: patterns, security, coverage; deep audit |
| `codebase parallel` | Multi-reviewer parallel audit; split reviewers across modules |
| (no args) | AskUserQuestion |

**Modes:** PR / COMMIT / PENDING / CODEBASE / DEFAULT

**Outputs:** 3-stage review report (spec compliance → code quality → adversarial findings); issue list với severity; recommendations

**Hard gates:**
- Stage 1: Spec compliance (code có match requested?)
- Stage 2: Code quality (standards, patterns)
- Stage 3: Adversarial (always-on red-team)
- Evidence-before-claims: cite file:line cụ thể
- Brutal, honest, concise; technical correctness > social comfort

**Pitfalls:** Assume PR tested; performative feedback without evidence; allow warnings slip

**Difference from similar:** Code-Review = AUDIT. Khác Cook (build), Test (validate), Fix (solve)

---

## ck:scout

**Purpose:** Fast, token-efficient codebase discovery dùng parallel agents tìm files cho task.

**When to use vs not use:**
- USE: multi-directory feature start; cần file relationships; debug session start; "where is X"
- DON'T: đã có file paths; single-file change; full review (dùng `ck:code-review codebase`)

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `ext` | External Gemini/OpenCode CLI parallel; faster cho large repos; cần `gemini.model` trong `~/.claude/.ck.json` |
| (default) | Built-in Explore subagents parallel |

**Modes:** INTERNAL / EXTERNAL / PARALLEL

**Outputs:** Scout report: relevant files với descriptions; file count, LOC; unresolved questions; optional Claude Tasks

**Hard gates:**
- MANDATORY phân tích prompt trước spawn agents
- 3+ agents → MANDATORY Claude Task registration
- Timeout 3 min/agent
- MANDATORY project-organization invocation
- Codebase summary: 3-6 bullets max

**Pitfalls:** Quá nhiều agents → lãng phí tokens; không chia directories → overlap; skip task registration → mất coordination

**Difference from similar:** Scout = DISCOVERY. Khác Code-Review (audit), Debug (trace), Plan (design)

---

## ck:ask

**Purpose:** Technical consultation với 4 advisors (Systems Designer, Tech Strategist, Scalability Consultant, Risk Analyst).

**When to use vs not use:**
- USE: architectural decision; cần best-practice guidance; evaluate tech choices
- DON'T: ready implement (`ck:cook`); explore multiple options (`ck:brainstorm`); debug (`ck:debug`)

**Modes:** SINGLE-ADVISOR (basic) / MULTI-ADVISOR (cross-cutting) / AUTO-ROUTE

**Outputs:** Architecture analysis; design recommendations với rationale + alternatives; tech guidance pros/cons; implementation strategy phased; next actions

**Hard gates:**
- MANDATORY codebase scout trước answer (no architecture answers without understanding actual constraints)
- Must reference primary-workflow.md, development-rules.md, etc.
- Answer in 1 sentence each: output, criteria, scope, constraints, touchpoints
- NO implementation
- YAGNI, KISS, DRY

**Pitfalls:** Advice without scouting; over-engineering (violates YAGNI); not grounded in project patterns

**Difference from similar:** Ask = CONSULTATION-ONLY. Khác Cook (implement), Brainstorm (explore before design), Code-Review (audit)

---

## ck:brainstorm

**Purpose:** Solution exploration với rigorous requirements capture, design presentation, trade-off analysis TRƯỚC implementation decision.

**When to use vs not use:**
- USE: technical options unclear; multiple valid approaches; cần quyết architecture/approach
- DON'T: ready implement (`ck:cook`); chỉ cần expert advice (`ck:ask`); debug (`ck:debug`)

**Modes:** DISCOVERY (scout + clarifying questions) / DESIGN (2-3 viable solutions với pros/cons) / VALIDATION (explicit design approval)

**Outputs:** Design presentation 2-3 approaches; trade-off matrix; recommended với rationale; next steps

**Hard gates:**
- MANDATORY codebase scout TRƯỚC (trước MỌI clarifying question/option)
- MANDATORY exact requirements grounded in scout
- MANDATORY design presentation + user approval trước implementation (HARD-GATE)
- MANDATORY 2-3 alternatives, honest pros/cons (NOT single-solution)
- Questions grounded in scout findings (ví dụ: "Endpoint nên nằm src/api/users.ts (pattern hiện tại) hay new src/api/profile/?" NOT "Where should endpoints go?")
- YAGNI, KISS, DRY

**Pitfalls:** Propose designs without scouting; vague questions; skip alternatives; over-engineered; skip design approval

**Difference from similar:** Brainstorm = EXPLORATION-BEFORE-DESIGN. Khác Ask (consultant only), Cook (implement), Plan (planning focus)

---

## ck:debug

**Purpose:** Investigation-only root cause analysis, không implement fix.

**When to use vs not use:**
- USE: bug phức tạp, chưa biết root cause; cần evidence-based analysis
- DON'T: đã biết root cause (dùng `ck:fix`); just want investigation + fix combined (`ck:fix --review`)

**Outputs:** Root cause report với evidence; reproduction steps; recommended fix approaches (KHÔNG apply fix)

---

# PART 2: PLAN REVIEW COMMANDS

## plan-ceo-review

**Purpose:** CEO/founder-mode plan review, rethink problem, challenge premises, expand/constrain scope theo mode.

**When to use vs not use:**
- USE: questioning plan ambition; explore if scope expand; founder-level thinking; evaluate tradeoffs
- DON'T: scope đã lock (dùng `plan-eng-review`); execute known plan; quick bug fixes

**4 Modes (BẮT BUỘC chọn 1 qua AskUserQuestion):**

| Mode | Mục đích | Output |
|------|---------|--------|
| **SCOPE EXPANSION** | Dream big. Tìm 10x version + platonic ideal, identify delight, asks user opt-in từng expansion individually | Expanded vision + CEO plan file |
| **SELECTIVE EXPANSION** | Hold core scope, cherry-pick adjacent expansions. Complexity check, identify MVP path, 5-8 expansion candidates cho user decisions | Curated expansions với user choices |
| **HOLD SCOPE** | Rigorous. Scope fixed. Bulletproof execution — catch failure modes, edge cases, observability, error paths. No silent reductions/expansions | Rigorous plan với failure modes |
| **SCOPE REDUCTION** | Ruthless cut. Minimum that ships value, separate "must ship together" từ "nice to ship together", defer rest | Minimal plan với deferred list |

**Critical rule:** Mọi scope change cần explicit opt-in qua AskUserQuestion. KHÔNG silently drift.

**Outputs:** Updated plan tại `~/.gstack/projects/$SLUG/ceo-plans/{date}-{feature-slug}.md`; includes Vision, 10x Check, Platonic Ideal (EXPANSION), Scope Decisions table, Accepted/Deferred/Skipped

**Hard gates:**
- Phải run 0A-0F (premise challenge, leverage mapping, dream state, alternatives, temporal interrogation, mode selection) trước review
- User approval cần qua implementation approach (0C-bis)
- Mode selection = MANDATORY AskUserQuestion

**Pitfalls:** Silent scope drift; chạy cả 4 modes (chỉ pick 1); skip Step 0; treat EXPANSION & REDUCTION như equivalent in rigor

**Difference from similar:** plan-ceo-review = "WHAT should we build?". Khác plan-eng-review (HOW build), plan-design-review (UX/visual)

---

## plan-design-review

**Purpose:** Interactive designer-eye plan review, rate mỗi design dimension 0-10, explain what makes a 10, improve plan.

**When to use vs not use:**
- USE: review plans có UI/UX components TRƯỚC implementation; cần design critique trên interaction patterns, visual hierarchy, onboarding flow
- DON'T: audit live visual code (dùng `design-review`); purely engineering architecture; no UI/visual scope

**Outputs:** Edits plan file với design improvements; có thể tạo design notes; rating scores per dimension

**Hard gates:** Đọc plan complete; chạy 7-10 design dimensions; AskUserQuestion cho major design changes

**Difference from similar:** Khác plan-ceo-review (scope), plan-eng-review (architecture), design-html (code generation). plan-design-review critiques *plan* — design decisions documented BEFORE code

---

## plan-eng-review

**Purpose:** Eng manager-mode plan review, lock in architecture + data flow + test coverage + edge cases TRƯỚC implementation.

**When to use vs not use:**
- USE: sắp code, có technical plan cần architecture validation; cần edge case discovery; lock test strategy trước viết code
- DON'T: plan purely conceptual; đã start implementation

**Outputs:** Updated plan với architecture diagrams, data flow, edge case map, test strategy, performance model

**Hard gates:** Đọc all code referenced; dual-voice (Claude + Codex) adversarial review cho high-risk; AskUserQuestion cho major architectural shifts

**Difference from similar:** Khác plan-ceo-review (scope/vision), plan-design-review (UX). plan-eng-review = pure technical — architecture, data models, test coverage, failure modes

---

## plan-devex-review

**Purpose:** Interactive DX plan review, trace developer journey, score 7 DX characteristics (Usable, Credible, Findable, Useful, Valuable, Accessible, Desirable).

**When to use vs not use:**
- USE: building/reviewing developer-facing products (APIs, CLIs, SDKs, libraries, platforms); DX audit trước launch; improve onboarding
- DON'T: consumer app (no dev audience); product đã ship live (dùng `design-review`)

**3 Modes (auto-detected, có thể override):**

| Mode | Khi nào | Output |
|------|---------|--------|
| **DX EXPANSION** | Competitive advantage. New products | Toàn bộ developer journey + benchmark competitors + magical moments + expand 7 touchpoints |
| **DX POLISH** | Plan scope đúng, refine all DX flows. Enhancements | Bulletproof mọi touchpoint, close gaps trong 7 characteristics |
| **DX TRIAGE** | Critical gaps only. Urgent ships | Focus Install + Hello World stages, flag scores <5 blocking adoption |

**Outputs:** Updated plan với developer journey traced, error handling mapped, upgrade path, 7-characteristic scores, fixes applied

**Hard gates:** Auto-detect product type + offer mode selection; trace full journey (Discover → Evaluate → Install → Hello World → Integrate → Debug → Upgrade → Scale → Migrate); score 0-10 mỗi stage

**Pitfalls:** Chọn EXPANSION cho bug fix; miss error message quality; không test actual developer onboarding time

**Difference from similar:** Khác plan-design-review (visual UX), plan-eng-review (architecture). plan-devex-review = developer-specific: TTHW (time to hello world), migration safety, upgrade friction, escape hatches

---

## autoplan

**Purpose:** Auto-review pipeline đọc CEO + design + eng + DX skill files, chạy sequential với auto-decisions, surface taste decisions ở final gate.

**When to use vs not use:**
- USE: có rough plan, muốn full 4-lens review (scope, design, architecture, DX) mà không trả lời 15-30 intermediate questions
- DON'T: muốn hand-craft specific decisions; cần deep dialogue 1 dimension; plan incomplete

**Pipeline order (FIXED):**
1. Phase 0 (all skills): Detect base branch, load context, preamble
2. **Phase 1 — CEO Review**: Mode auto-select. Scope expansions auto-approve nếu <1 day effort + trong blast radius. Taste decisions surface
3. **Phase 2 — Design Review**: Dimension scores auto-improve nếu fix <2 hour. Major pattern shifts surface
4. **Phase 3 — Eng Review**: Architecture auto-improve. Edge cases auto-map. Test strategy auto-fill. Risky changes surface
5. **Phase 4 — DX Review**: DX mode auto-select. Touchpoint gaps auto-fix nếu <1 day. Journey score auto-improve
6. **Taste Gate**: Tất cả surfaced decisions presented qua final AskUserQuestion

**6 Decision Principles (auto-apply):**
1. **Completeness**: Pick approach covering more edge cases
2. **Boil Lakes**: Fix everything trong blast radius (<1 day effort)
3. **Pragmatic**: Two options fix same → pick cleaner
4. **DRY**: Reuse existing, reject duplicates
5. **Explicit > Clever**: 10-line obvious > 200-line abstraction
6. **Bias toward action**: Flag concerns, don't block

**Hard gates:** KHÔNG invoke trong plan mode; final AskUserQuestion batch tất cả taste decisions

**Pitfalls:** Run trên incomplete plan; không đọc final taste gate (auto-approve without understanding); expect autoplan produce hand-crafted taste

**Difference from similar:** Khác individual `plan-*-review` (1 dimension each). autoplan orchestrates 4 sequential với auto-decisions, trade interactivity lấy speed

---

# PART 3: DESIGN COMMANDS

## Design Command Selection Matrix

| Goal | Use |
|------|-----|
| Tạo brand system từ đầu | `design-consultation` |
| Explore multiple design options | `design-shotgun` |
| Generate UI qua AI prompt | `ck:stitch` |
| Finalize design → vanilla HTML/CSS | `design-html` |
| Replicate screenshot/video → polished code | `ck:frontend-design` |
| Audit live visual code | `design-review` |
| Critique design trong plan (pre-implementation) | `plan-design-review` |
| Design guidance/rules reference | `ck:ui-ux-pro-max` |

---

## design-consultation

**Purpose:** Design complete design system từ scratch (aesthetic, typography, color, layout, spacing, motion); tạo DESIGN.md.

**When to use vs not use:**
- USE: new project no design system; cần brand/design guidelines; reusable component library
- DON'T: audit existing site (`design-review`); building variants of approved (`design-shotgun`); finalizing code (`design-html`)

**Workflow:**
1. Product research (WebSearch + user confirmation)
2. Aesthetic direction selection (12+ options: minimalist, maximalist, retro, organic, luxury, playful, editorial, brutalist, art deco, industrial, soft)
3. Generate system (typography pairs, 10-20 palettes, spacing, shadow, motion)
4. Preview pages (rendered components)
5. Write DESIGN.md (tokens, usage, Do/Don't)

**Outputs:** DESIGN.md (project root); font+color preview pages; design tokens

**Hard gates:** DESIGN.md phải include: color tokens, typography scales (display/body/code), spacing scale, shadow, motion timing, component recipes; concrete rendered examples (buttons, forms, cards, alerts)

**Pitfalls:** Generic aesthetics (Inter, purple gradients); không show rendered preview; DESIGN.md quá vague

**Difference:** Khác `design-shotgun` (variants), `design-html` (code), `plan-design-review` (critique plan). design-consultation tạo *system* feed all downstream

---

## design-shotgun

**Purpose:** Generate multiple AI design variants, open comparison board, collect feedback, iterate.

**When to use vs not use:**
- USE: explore design options; xem feature có thể look thế nào; chưa quyết direction
- DON'T: design đã quyết & cần code (`design-html`); review completed live site (`design-review`)

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `variants --count N` | Generate N alternatives (default 3, max 8) |
| `compare --images a,b,c --serve` | Open comparison board browser |
| `iterate --feedback "..."` | Refine theo feedback |
| `approve <variant>` | Save as approved |

**Anti-convergence directive (HARD):** Mỗi variant phải *different* font family, color palette, layout approach. 2 variants similar → 1 failed, regenerate

**Outputs:** 3-8 design variant PNGs; comparison board HTML; `taste-profile.json` tracking approved/rejected

**Difference:** Khác `design-consultation` (create system), `design-html` (finalize code), `design-review` (audit). design-shotgun = pure exploration

---

## design-html

**Purpose:** Finalize design thành production-quality vanilla HTML/CSS, từ approved mockups, CEO plans, design reviews, hoặc fresh description.

**When to use vs not use:**
- USE: design approved & locked; cần polished HTML/CSS code; zero dependencies; có mockup replicate
- DON'T: still exploring (`design-shotgun`); cần framework (React/Vue/Svelte — dùng `ck:frontend-design`); cần brand system (`design-consultation`)

**Smart API routing:** Pretext patterns based on design type (landing page vs dashboard vs form-heavy)

**Outputs:** HTML file; CSS (inline/external); responsive, production-ready; 30KB overhead, zero deps

**Hard gates:** Production-ready day one; no placeholder; responsive; accessibility (alt text, semantic HTML); fast load (<100KB)

**Difference:** Khác `design-shotgun` (exploration), `ck:frontend-design` (React/Vue), `design-consultation` (system). design-html = final HTML output, zero deps

---

## ck:frontend-design

**Purpose:** Create polished frontend interfaces từ designs/screenshots/videos với exceptional aesthetic detail, no AI slop.

**When to use vs not use:**
- USE: replicating screenshot/video; building 3D/WebGL; cần production-grade UI avoiding generic AI aesthetics
- DON'T: starting from scratch no reference (`design-consultation`); quick prototyping (`design-shotgun`)

**Workflow selection (by input):**
| Input | Workflow |
|-------|----------|
| Screenshot | Replicate exactly |
| Video | Replicate with animations |
| 3D/WebGL request | Three.js immersive |
| Quick task | Rapid implementation |
| Complex/award-quality | Full immersive |

**Design dials (configurable):**
| Dial | Range | Low | High |
|------|-------|-----|------|
| DESIGN_VARIANCE | 1-10 (default 8) | Centered/symmetric | Asymmetric/masonry/fractional grid |
| MOTION_INTENSITY | 1-10 (default 6) | CSS hover only | Framer Motion/spring physics |
| VISUAL_DENSITY | 1-10 (default 4) | Whitespace/expensive | Cockpit/1px dividers/monospace |

**Anti-slop rules (HARD):** Pick extreme aesthetic; execute với precision; AVOID generic fonts (Inter, Roboto), purple gradients, cliched layouts

**Hard gates:** MANDATORY activate `ck:ui-ux-pro-max` FIRST cho design intelligence; use `ck:ai-multimodal` extract colors/fonts từ images; match source pixel-perfectly

**Difference:** Khác `design-html` (vanilla only), `design-shotgun` (exploration), `design-consultation` (system). ck:frontend-design = framework-agnostic polish-focused from reference

---

## ck:stitch

**Purpose:** AI design generation qua Google Stitch — generate UI từ text prompts, export Tailwind/HTML/DESIGN.md.

**Flags:** `generate` / `variants` / `export` / `quota check`

**Hard gates:** STITCH_API_KEY trong `~/.claude/.env`; free tier 400 credits/day + 15 redesign credits/day (reset UTC midnight)

**Difference:** Khác `design-shotgun` (Claude-driven), `design-consultation` (system), `design-html` (code). ck:stitch = Google Stitch API wrapper rapid AI generation

---

## ck:ui-ux-pro-max

**Purpose:** Design intelligence reference database — 50+ styles, 161 color palettes, 57 font pairings, 99 UX guidelines, 25 chart types.

**Rule categories (by priority):**
1. **Accessibility** (CRITICAL): Contrast 4.5:1, Alt text, Keyboard nav, ARIA
2. **Touch & Interaction** (CRITICAL): 44×44px min size, 8px+ spacing, Loading feedback
3. **Performance** (HIGH): WebP/AVIF, Lazy loading, CLS <0.1
4. **Style Selection** (HIGH): Match product type, Consistency, SVG icons
5. **Layout & Responsive** (HIGH): Mobile-first, Viewport meta
6. **Typography & Color** (MEDIUM): 16px base, 1.5 line-height
7. **Animation** (MEDIUM): 150-300ms duration
8. **Forms & Feedback** (MEDIUM): Visible labels, Error near field
9. **Navigation** (HIGH): Bottom nav ≤5, Deep linking
10. **Charts & Data** (LOW): Legends, Tooltips, Accessible colors

**Pitfalls:** Use only dominant palette; ignore accessibility (CRITICAL); generic Inter/Roboto

**Difference:** Khác `design-html` (code output), `design-shotgun` (variants), `ck:frontend-design` (React-specific). ck:ui-ux-pro-max = *reference* database, not workflow

---

## design-review

**Purpose:** Live site visual QA — find inconsistency, spacing, hierarchy, AI slop, slow interactions; fix trong source code.

**When to use vs not use:**
- USE: site live & có visual problems; polish appearance deployed code
- DON'T: audit plan (`plan-design-review`); explore variants (`design-shotgun`); create system (`design-consultation`)

**Workflow:** Screenshot live → identify issues → root cause to file:line → fix Edit tool → re-verify screenshot → commit atomically → repeat

**Pitfalls:** Fix without screenshot verification; batch unrelated fixes; miss responsive viewport (check mobile/tablet/desktop)

**Difference:** design-review = *maintenance* — improve existing deployed code

---

# PART 4: BACKEND & INFRA COMMANDS

## ck:deploy

**Purpose:** Auto-detect deployment target & deploy current project to cost-optimized platforms (Vercel, Netlify, Cloudflare, Railway, Fly.io, Render).

**When to use vs not use:**
- USE: deploying finished projects; cần platform-agnostic; muốn cost recommendations
- DON'T: advanced infrastructure (databases, DNS, SSL); CI/CD setup (`ck:devops`); scaling

**Platform priority (cost):** Free tier first (GitHub Pages → Cloudflare Pages → Vercel → Netlify) → Free backends (Railway → Render → Fly.io) → Pay-as-you-go

**Outputs:** `docs/deployment.md` (platform, URL, env vars, rollback)

**Difference:** ck:deploy = simple, single-platform, cost-optimized. ck:devops = advanced (Docker/K8s/CI/multi-region)

---

## ck:devops

**Purpose:** Deploy & manage cloud infrastructure: Cloudflare (Workers/R2/D1), Docker, GCP (Cloud Run/GKE), Kubernetes, GitOps, CI/CD.

**When to use vs not use:**
- USE: serverless functions; containers; Kubernetes; multi-region; GitOps; cloud security audits
- DON'T: simple static/SPA (`ck:deploy`); no infrastructure code

**Modes:** Cloudflare (Workers/Pages/R2/D1) / Docker (compose/registry) / GCP (Cloud Run/GKE/SQL) / K8s (kubectl/Helm)

**Hard gates:** Cloud auth (gcloud login, kubectl context); CLI installed (wrangler/docker/gcloud/kubectl); valid IaC/manifests

**Pitfalls:** Quên configure secrets; không set resource limits; missing RBAC/network policies in K8s

**Difference:** ck:deploy = single-platform cost-optimized. ck:devops = containerized, multi-region, enterprise-grade

---

## ck:databases

**Purpose:** Design schemas, write queries, optimize indexes, manage migrations cho MongoDB & PostgreSQL.

**Modes:** MongoDB (document) / PostgreSQL (relational) — auto-select

**Pitfalls:** N+1 queries MongoDB; missing indexes; over-normalize PostgreSQL; circular references MongoDB

**Difference:** ck:databases = schema + query focused. ck:devops = database infrastructure (cloud setup, backups, replication)

---

## ck:better-auth

**Purpose:** Add comprehensive auth (email/password, OAuth, 2FA, passkeys, organizations) với Better Auth TypeScript framework.

**Methods:** Email/Password, OAuth (GitHub, Google), Passkeys, Magic Link, Usernames

**Plugins:** twoFactor, passkey, magicLink, username, organization, rate limiting (built-in)

**Adapters:** Kysely, Drizzle, Prisma, Sequelize

**Hard gates:** Database integration (pick adapter); secret management OAuth keys; framework handler mount

**Pitfalls:** Forget BETTER_AUTH_SECRET; không run migrations; mix session+JWT; expose OAuth secrets client

**Difference:** ck:better-auth setup auth. ck:payment-integration handles payments post-auth. ck:security audits auth

---

## ck:payment-integration

**Purpose:** Integrate payments qua SePay (VietQR), Polar, Stripe, Paddle, Creem.io với checkout, subscriptions, webhooks, QR.

**Platforms:**
| Platform | Use case |
|----------|---------|
| **SePay** | VND payments, 44+ Vietnamese banks, VietQR, webhooks |
| **Polar** | MoR (Merchant of Record), subscriptions, automated benefits (GitHub/Discord) |
| **Stripe** | CheckoutSessions, Billing, Connect, Payment Element |
| **Paddle** | MoR, Retain (churn), global tax, overlay/inline |
| **Creem.io** | MoR, licensing, revenue splits, no-code storefronts |

**Hard gates:** PCI compliance (never handle raw card); webhook signature verification; idempotency retries; tax compliance

**Pitfalls:** Forget webhook verification; không handle subscription cancellation; missing refund flow; store unencrypted credentials

---

## ck:security

**Purpose:** STRIDE + OWASP threat-modeled security audit với optional red-team personas & iterative auto-fix.

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--red-team` | 4-persona iterative discovery (Security Adversary → Supply Chain → Insider → Infrastructure) |
| `--fix` | Apply fixes iteratively (Critical → High → Medium) |
| `--iterations N` | Bound fix/red-team loops |

**Modes:** Audit-only / Red-team / Fix / Red-team+Fix

**Outputs:** `security-audit-results.tsv` (findings với severity, file:line, persona); commits `security(fix-N): ...`

**Hard gates:** Scan files trước categorize (don't invent findings); red-team iterate 4 personas in order; fix run guard tests/lint sau each fix; mask all secret values

**Difference:** ck:security = threat-modeled (STRIDE, personas). ck:security-scan = lightweight pattern-based (secrets, deps, OWASP patterns). Use security trước major releases; scan cho quick checks

---

## ck:security-scan

**Purpose:** Lightweight scan cho hardcoded secrets, dependency vulnerabilities, OWASP code patterns (no external tools, Claude reasoning + shell).

**Flags:** `--secrets-only` / `--deps-only` / `--full` (default)

**Modes:** Secrets → Dependencies → Code patterns (sequential)

**Outputs:** Markdown report; optional save `plans/reports/security-scan-{date}.md`; redacted findings (first 4 + last 2 chars)

**Hard gates:** Check `.env` tracking (git ls-files); patterns từ `references/secret-patterns.md` (no invented regexes); deps audit dùng native tools (npm/pip/govulncheck)

**Pitfalls:** Output raw secret values; false positives (YOUR_API_KEY placeholder); miss `.env` exposure

**Difference:** scan = fast pattern-based pre-commit. security = comprehensive STRIDE pre-release

---

# PART 5: REASONING & RESEARCH

## ck:scenario

**Purpose:** Generate comprehensive edge cases & test scenarios decomposing features qua 12 dimensions (user types, input extremes, timing, scale, state, env, errors, auth, data, integration, compliance, business logic).

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--iterations N` | Bounded loop — exactly N iterations |
| `--saturation` | Loop until 2 consecutive iterations no novel scenarios |
| `--domain <type>` | Domain hint (software, product, business, security, marketing) |
| `--focus <dim>` | Prioritize dimension (edge-cases, failures, security, scale) |
| `--format <type>` | Output (table, use-cases, test-scenarios, threat-scenarios) |

**Modes:** One-shot / Iterative / Saturation

**Outputs:** Scenario table; `scenario-results.tsv` (iterative); coverage matrix + composite score

**Hard gates:** Read target file/description trước generate; classify mỗi scenario New/Variant/Duplicate/Out-of-scope; force dimension rotation sau 3 consecutive same-dimension; severity Critical>High>Medium>Low

**Pitfalls:** Duplicate scenarios; vague scenarios; forget dimension rotation; over-weight certain dimensions

**Difference:** ck:scenario = edge cases pre-implementation. ck:test = test code post-scenario. ck:predict = architecture debate

---

## ck:predict

**Purpose:** 5 expert personas (Architect, Security, Performance, UX, Devil's Advocate) independently debate proposed change, identify conflicts, produce GO/CAUTION/STOP verdict.

**When to use vs not use:**
- USE: major feature, architecture change, risky refactor, competing technical approaches
- DON'T: trivial changes (`ck:debug` cho bugs); already-decided; dep bumps no API changes

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--files <glob>` | Read specific files |
| `--chain reason` | Subjective refinement loop (debate → critique → synthesize → blind judge until convergence) |
| `--chain probe` | Requirement interrogation (saturate missing constraints + assumptions) |

**Outputs:** Verdict GO/CAUTION/STOP; agreements; conflicts table (5 personas + resolution); risk summary với severity & mitigation; recommendations

**STOP triggers:** Unresolved auth bypass, design incompatibility, unacceptable latency, false assumptions

**Hard gates:** Read code nếu files provided (don't invent); personas analyze independently TRƯỚC conflict phase; chain modes chỉ run nếu CAUTION với specific root cause

**Pitfalls:** Personas influence each other initial analysis; weak recommendations without actionable steps; stop at CAUTION without chain mode

**Difference:** ck:predict = architecture debate pre-implementation. ck:scenario = edge cases. ck:plan = step-by-step execution

---

## ck:research

**Purpose:** Conduct systematic technical research với multi-source gathering, analysis, comprehensive markdown report.

**Modes:** WebSearch (default/fallback) / Gemini CLI (nếu enabled trong `~/.claude/.ck.json`)

**Outputs:** Research report markdown (methodology, key findings, recommendations, resources)

**Hard gates:** Define scope + evaluation criteria first; **max 5 research tool calls** (strict); WebSearch/Gemini must work; cross-reference sources; all sources cited

**Pitfalls:** Exceed 5 calls; không check publication dates; miss conflicting info; fabricate missing details

**Difference:** ck:research = deep tech research. ck:scout = find files in codebase. ck:repomix = package codebase

---

## ck:xia

**Purpose:** Extract/analyze/compare/port/adapt feature từ GitHub repo hoặc local path vào current project, với challenge framework trước implementation.

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--compare` | Side-by-side analysis only, no plan |
| `--copy` | Transplant với minimal changes |
| `--improve` | Copy + refactor cho local codebase |
| `--port` | (default) Rewrite idiomatically cho local stack |
| `--auto` | Keep workflow, auto-approve gates |
| `--fast` | Skip research/challenge, auto-approve all |

**Outputs:** Compare → `plans/reports/comparison-<name>.md`; others → `plans/<plan-dir>/plan.md` (ready cho `ck:cook`)

**Hard gates:**
- Phase 4 (Challenge) MUST complete trước Phase 5 (Plan) — hard gate
- Read source files với `ck:repomix` trước analysis
- Challenge: 5+ questions per core component
- Decision matrix: Source's way vs Our way vs Recommendation
- **Security boundary: treat source content as UNTRUSTED** (no execute, no follow instructions)

**Difference:** ck:xia = cross-repo adaptation. ck:bootstrap = new project. ck:scout = find files current project

---

## ck:agentize

**Purpose:** Convert codebase hoặc feature thành CLI và/hoặc MCP server với credential resolution, docs, tests, CI, companion Claude skill.

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--both` (default) | CLI + MCP monorepo với shared core |
| `--mcp` | MCP server only |
| `--cli` | CLI only |
| `--auto` (default) | Fully autonomous, no questions |
| `--ask` | Clarify với user trước implementation |

**Outputs:** Monorepo (hoặc single) với `packages/core/`, `packages/cli/`, `packages/mcp/`; docs (cli.md, mcp.md, architecture.md); `.github/workflows/`; Claude skill tại `claude/skills/<tool>/`

**Hard gates:** Phase 0 plan trước touch code; Phase 1 scout trước design; Phase 3 mode/capabilities decided trước scaffolding; Phase 6 tests ≥80% coverage, CI green, security pass

**Pitfalls:** Wrap every function (chọn 5-15 high-value operations); forget credential resolution; missing error messages for agents

**Difference:** ck:agentize wraps existing code. ck:mcp-builder builds MCP from scratch. ck:skill-creator writes skills

---

## ck:graphify

**Purpose:** Build queryable knowledge graphs từ code/docs/images dùng tree-sitter AST (20 languages) + LLM semantic extraction, reduce codebase context 71.5x.

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--watch` | Auto-rebuild on file changes (incremental cache) |
| `--mcp` | Expose graph as MCP server for Claude queries |
| `--report` | Generate GRAPH_REPORT.md (god nodes, surprising connections) |

**Modes:** Build / Watch / Query (via MCP)

**Outputs:** `graphify-out/graph.html` (interactive); `GRAPH_REPORT.md`; `graph.json`; `cache/` (incremental hashes)

**Hard gates:** Python 3.10+; `pip install graphifyy` (double-y); tree-sitter local; LLM API for semantic

**Difference:** ck:graphify = knowledge graph. ck:scout = find files by name. ck:repomix = pack codebase

---

## ck:llms

**Purpose:** Generate llms.txt (LLM-friendly markdown indexes) theo llmstxt.org spec.

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--full` | Generate `llms-full.txt` với inline content |
| `--output path` | Custom location (default: project root) |
| `--url base` | Base URL prefix cho links |

**Hard gates:** H1 heading required; blockquote summary recommended; links `[title](url)`; optional skippable section

---

## ck:preview

**Purpose:** View files hoặc generate visual explanations, diagrams, slides, HTML visualizations.

**Generation modes (Markdown):**
| Flag | Output |
|------|--------|
| `--explain` | Visual explanation (ASCII + Mermaid + prose) |
| `--slides` | Presentation slides (1 concept/slide) |
| `--diagram` | Focused diagram (ASCII + Mermaid) |
| `--ascii` | Terminal-friendly ASCII only |

**Generation modes (HTML):**
| Flag | Output |
|------|--------|
| `--html --explain` | Self-contained HTML explanation |
| `--html --slides` | Magazine-quality slide deck |
| `--html --diagram` | HTML diagram với zoom |
| `--html --diff [ref]` | Visual diff review (git diff) |
| `--html --plan-review [plan-file]` | Plan vs codebase comparison |
| `--html --recap [timeframe]` | Project context snapshot |

**View modes:**
| Input | Action |
|-------|--------|
| `<file.md>` | View markdown novel-reader UI |
| `<directory/>` | Browse directory |
| `--stop` | Stop running server |

**Hard gates:** HTML mode MUST include light/dark theme toggle; `--html --ascii` unsupported

---

# PART 6: TEAM & COORDINATION

## ck:team

**Purpose:** Orchestrate multiple independent Claude Code sessions (teammates) cho parallel multi-session workflows.

**When to use vs not use:**
- USE: 3+ parallel independent workstreams; cross-layer (FE + BE + tests); workers need discuss findings
- DON'T: single sequential task (dùng subagents via Agent tool); tight token budget; focused one-person

**Templates & flags:**
| Template | Flags |
|----------|-------|
| `ck:team research <topic>` | `--researchers N` (default 3); 3+ researchers parallel angles, synthesize report |
| `ck:team cook <plan>` | `--devs N`, `--plan-approval`, `--delegate`, `--worktree`; N devs code worktrees, tester runs suite, lead merge |
| `ck:team review <scope>` | `--reviewers N` (default 3); reviewers focus security/performance/coverage, dedupe |
| `ck:team debug <issue>` | `--debuggers N` (default 3); debuggers test competing hypotheses, converge root cause |

**Outputs:** Research → synthesis report; Cook → merged branch + test results + docs impact; Review → deduplicated report; Debug → root cause report

**Hard gates:**
- **MUST run on CLI terminal** (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` trong settings.json, NOT VSCode extension)
- All teammates run Opus 4.6
- `TeamCreate` MUST succeed trước spawn (abort nếu tool unrecognized)
- CK Context Block trong mọi teammate spawn (work dir, reports, plans, branch, naming, commits)
- Teammates refer by NAME, never agent ID
- Messaging qua SendMessage
- Task ownership qua TaskUpdate (Claim → Complete → next)

**Pitfalls:** Run trong VSCode extension (isTTY check fails); forget CK Context Block; planning without approval gate (cook); không wait TaskCompleted events; merge branches wrong order

**Difference:** ck:team = multi-session với messaging + task list. Agent tool spawn single background subagent. Use team cho parallel với debate/synthesis; Agent cho sequential single-task

---

## ck:worktree

**Purpose:** Create/inspect/manage isolated git worktrees cho parallel feature development.

**Commands:**
| Command | Action |
|---------|--------|
| `create [project] <feature>` | Create worktree (monorepo: project + feature; standalone: feature only) |
| `remove <name-or-path>` | Remove worktree |
| `list` | List all worktrees |
| `status` | Health audit + base-branch divergence |
| `info` | Repo info (repoType, baseBranch, projects, worktreeRoot) |
| `prune` | Clean stale metadata (`--dry-run` preview) |

**Create flags:**
| Flag | Tác dụng |
|------|---------|
| `--prefix <type>` | Branch prefix (feat/fix/refactor/docs/test/chore/perf) |
| `--no-prefix` | Skip prefix, exact branch name (cho Jira keys, multi-segment) |
| `--base <branch>` | Override auto-detected base |
| `--checkout-submodules` | Init submodules sau checkout |
| `--json` | JSON output |
| `--dry-run` | Preview |

**Auto-detected base:** dev → develop → main → master

**Outputs:** Isolated worktree `../<worktree-root>/<branch-name>/`; auto-install deps (bun/pnpm/yarn/npm/pip/cargo); `.env.example` → `.env`

**Pitfalls:** Không dùng `--no-prefix` cho Jira keys; forget submodules; wrong base branch; stale metadata (use `prune --dry-run` first)

**Difference:** ck:worktree = isolated dev branches. git branch = local only. ck:team = uses worktrees parallel cook devs

---

## ck:journal

**Purpose:** Write concise technical journal entries phân tích recent changes post-implementation.

**Outputs:** Journals tại `./docs/journals/<date>-<topic>.md`

**Hard gates:** Run sau implementation (not before); use `ck:project-organization` to organize

---

## ck:repomix

**Purpose:** Pack entire repositories into AI-friendly files (XML/Markdown/JSON/plain text) cho context efficiency.

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--style <format>` | Output (xml default, markdown, json, plain) |
| `--include <patterns>` | Include patterns (comma-separated) |
| `--ignore <patterns>` | Additional ignore |
| `--no-gitignore` | Disable .gitignore rules |
| `--remove-comments` | Strip comments (20+ languages) |
| `-o <path>` | Custom output |
| `--copy` | Copy to clipboard |
| `--remote <owner/repo>` | Remote repo (no clone) |
| `--token-count-tree [N]` | Show token distribution hierarchical |
| `--init` | Create `repomix.config.json` |
| `--no-security-check` | Disable Secretlint |

**Hard gates:** Always review output trước share; `.repomixignore` cho sensitive; NEVER package `.env`; token limits (Claude ~200K, GPT-4 ~128K)

**Pitfalls:** Package với secrets; ignore token count; không include patterns (bloats với test files)

**Difference:** ck:repomix = full codebase pack. ck:graphify = queryable graph. ck:scout = quick file location

---

# PART 7: MARKETING COMMANDS (ckm:)

## ckm:write

**Purpose:** Multi-purpose content creation: blogs, CRO, email copy, publishing.

**Subcommands (ALL 9):**
| Sub | Khác biệt |
|-----|----------|
| `:audit` | Audit content quality vs copywriting + SEO + platform standards |
| `:blog` | SEO-optimized blog content |
| `:blog-youtube` | SEO blog article từ YouTube video |
| `:cro` | Analyze + optimize cho conversion |
| `:enhance` | Analyze issues + enhance |
| `:fast` | FAST mode (sacrifice polish cho speed) |
| `:good` | GOOD mode (longer, higher quality) |
| `:formula` | Generate dùng proven formulas (AIDA, PAS, BAB, etc.) |
| `:publish` | Audit + auto-fix + output publish-ready |

**Outputs:**
- Blogs → `assets/content/{date}-{slug}.md`
- CRO → `assets/content/{date}-{slug}-cro.md`
- Audit reports → `assets/reports/content/{date}-{audit}.md`
- Publish-ready → `assets/content/{date}-{slug}-publish.md`

**Pitfalls:** Fast mode sacrifices polish; không dùng formula mode cho brand-specific tone without context

**Difference:** ckm:write = long-form (blogs, content). ck:copywriting = short (taglines, ad copy). publish includes auto-fix; audit là analysis-only

---

## ckm:seo

**Purpose:** Technical SEO audits, keyword research with real volume data, on-page optimization, pSEO templates, Google Search Console integration.

**Subcommands:**
| Sub | Action |
|-----|--------|
| `:audit` | Technical SEO audit |
| `:keywords` | Keyword research & planning |
| `:pseo` | Programmatic SEO template generation |

**Scripts:** `gsc-auth.cjs`, `gsc-query.cjs`, `analyze-keywords.cjs`, `audit-core-web-vitals.cjs`, `generate-schema.cjs`

**Outputs:**
- Audit → `assets/reports/seo/{date}-{domain}-audit.md`
- Keywords → `assets/reports/seo/{date}-{topic}-keywords.md`
- CWV → `assets/reports/seo/{date}-{domain}-cwv.md`
- Schemas → `assets/seo/schemas/{page}-schema.json`

**Hard gates:** GSC credentials trong `~/.claude/secrets/google_client_secret.json` cho GSC features

**Pitfalls:** ReviewWeb.site API rate limits; GSC data lags 3-4 days; pSEO cần careful planning cho scale

---

## ckm:campaign

**Purpose:** End-to-end campaign planning, multi-channel coordination, budget, performance tracking, email management.

**Subcommands:**
| Sub | Action |
|-----|--------|
| `:create` | Create comprehensive digital marketing campaign |
| `:status` | Get campaign status |
| `:analyze` | Analyze campaign performance |
| `:email` | Email campaign management |

**Outputs:**
- Briefs → `assets/campaigns/{date}-{slug}/briefs/`
- Creatives → `assets/campaigns/{date}-{slug}/creatives/`
- Reports → `assets/campaigns/{date}-{slug}/reports/`
- Analysis → `assets/diagnostics/campaign-audits/{date}-{name}.md`

**Pitfalls:** Campaign creation without metrics; multi-channel không nghĩa all channels (focus 2-3 highest ROI)

**Difference:** Khác funnel (campaign = multi-channel coordinated push; funnel = sequential stages). Khác launch-strategy (campaign sustained; launch event-based)

---

## ckm:funnel

**Purpose:** Design & optimize marketing funnels across stages (traffic → checkout) với conversion metrics per stage.

**Actions:**
| Action | Tác dụng |
|--------|---------|
| `:design [type]` | Design new funnel (types: lead-magnet, webinar, product-launch, evergreen, tripwire) |
| `:analyze` | Analyze existing funnel |
| `:optimize` | Optimization recommendations |

**Outputs:**
- Designs → `assets/funnels/designs/{date}-{slug}-funnel.md`
- Audits → `assets/funnels/audits/{date}-{funnel}-audit.md`
- A/B tests → `assets/funnels/tests/{date}-{test-name}.md`

**Pitfalls:** Quá nhiều stages → friction; quên define metrics per stage → optimization impossible

**Difference:** Khác campaign (funnel = sequential journey; campaign = coordinated push). Khác form-cro (funnel = entire path; form-cro = single form)

---

## ckm:email

**Purpose:** Email content + automation flows + drip sequences + subject line optimization + deliverability.

**Subcommands:**
| Sub | Action |
|-----|--------|
| `:flow` | Generate complete email automation sequence |
| `:sequence` | Generate complete drip sequence với copy |

**Types:** newsletter, cold, followup, launch, nurture, welcome, winback

**Outputs:** Email copy → `assets/copy/emails/{date}-{type}-{slug}.md`

**Hard gates:** Clear audience; clear CTA; compliance (CAN-SPAM, GDPR)

**Pitfalls:** Too many emails → unsubscribes; spam-trigger subjects; missing value prop; CTA misaligned

---

## ckm:social

**Purpose:** Social media content + scheduling + platform-specific optimization.

**Platforms:** twitter/x, linkedin, instagram, tiktok, youtube, facebook, threads
**Content types:** post, thread, carousel, story, reel

**Subcommands:** `:schedule` (schedule posts)

**Outputs:** `assets/posts/{platform}/{date}-{slug}.md`

**Pitfalls:** Same content all platforms (must adapt); ignore character limits; overuse hashtags; wrong post times

---

## ckm:competitor

**Purpose:** Competitive analysis, content gap, SEO comparison, alternative/vs. page generation.

**Actions:**
| Action | Tác dụng |
|--------|---------|
| `:alternatives` | Create competitor comparison & alternative pages |
| `analyze [url]` | Analyze competitor website |
| `content [url]` | Content gap analysis |
| `seo [url]` | SEO comparison |
| `list` | List tracked competitors |

**Outputs:**
- Battlecards → `assets/sales/battlecards/{competitor}.md`
- Analysis → `reports/competitors/{date}-{name}.md`
- Alt/vs pages → organized by format

**Pitfalls:** Copy competitor messaging directly; không differentiate unique value; outdated data

---

## ckm:analytics

**Purpose:** Marketing KPI tracking, attribution, performance analysis, ROI, reporting dashboards.

**Capabilities:** KPI framework, attribution (multi-touch, first-touch, last-touch), campaign analysis, A/B test significance, report generation

**Outputs:**
- Reports → `assets/reports/analytics/{date}-{report-type}.md`
- Dashboards → `assets/dashboards/{date}-{type}.json`

**Hard gates:** GA4 service account credentials; clear conversion definition; proper UTM

**Pitfalls:** Attribution ≠ causation; mix metrics without normalizing; insufficient sample size A/B

---

## ckm:persona

**Purpose:** Customer persona creation, audience analysis, ICP management.

**Actions:** `:create`, `:analyze`, `:update [name]`, `:list`

**Outputs:** ICP Profiles → `assets/leads/icp-profiles/{persona}.md`

**Pitfalls:** Personas without customer research; too generic (affects everyone); not aligned với sales data; too many personas

---

## ckm:brand

**Purpose:** Brand identity, voice, visual standards, messaging frameworks, design token sync.

**Subcommands:** `:update` (update identity + sync to design systems)

**Scripts:** `inject-brand-context.cjs`, `sync-brand-to-tokens.cjs`, `validate-asset.cjs`, `extract-colors.cjs`

**Outputs:**
- Brand guidelines → `docs/brand-guidelines.md` (source of truth)
- Design tokens → `assets/design-tokens.json` + `.css`

**Hard gates:** Source document required cho sync; consistent color/font naming

---

## ckm:marketing-planning

**Purpose:** Detailed marketing strategies using RACE, SOSTAC, STP frameworks với market research integration.

**Workflow:** Market research → brand context → strategy design → plan creation → task breakdown

**Outputs:**
- Plans → `docs/docs/plans/{date}-campaign-name/plan.md`
- Research → `docs/docs/plans/{date}-campaign-name/research/`
- Briefs → `docs/docs/plans/{date}-campaign-name/reports/`

**Difference:** Khác marketing-research (planning = execution; research = discovery). Khác campaign (planning broader; campaign executes). Khác launch-strategy (planning full year+; launch event-focused)

---

## ckm:marketing-research

**Purpose:** Multi-source market research: trends, competitors, audience insights, campaign benchmarks.

**Phases:** Scope → systematic gathering → analysis → report

**Hard gates:** Clear scope; **max 5 research tool calls per task**

**Pitfalls:** Over-research without time limits; conflate correlation/causation; outdated sources

---

## ckm:marketing-psychology

**Purpose:** Apply 70+ psychological principles & mental models cho marketing decisions.

**Model categories:**
- Foundational thinking (First Principles, JTBD, Inversion, Pareto)
- Buyer psychology (Confirmation Bias, Mimetic Desire, Endowment Effect)
- Persuasion (Reciprocity, Scarcity, Authority, Social Proof)
- Pricing (Charm Pricing, Mental Accounting, Rule of 100)
- Design & delivery (AIDA, BJ Fogg, Nudge Theory)
- Growth models (Feedback Loops, Network Effects, Flywheel)

**Outputs:** Recommendations + model applications (no formal files)

---

## ckm:launch-strategy

**Purpose:** Plan phased product/feature launches using ORB framework với momentum tactics & Product Hunt guidance.

**5 phases:** Internal launch → Alpha → Beta → Early access → Full launch

**ORB channels:**
- **Owned**: Email, blog, community, website (compound, no algo risk)
- **Rented**: Social media, marketplaces, YouTube (fast, algo dependent)
- **Borrowed**: Podcasts, influencers, guest posts (credibility, audience)

**Outputs:** Launch plans → `assets/launches/{date}-{product}-plan.md`

**Pitfalls:** One-day launch no momentum building; ignore owned channels; Product Hunt without pre-work relationships

---

## ckm:paid-ads

**Purpose:** Paid advertising strategy, creative, targeting, optimization across Google/Meta/LinkedIn/Twitter/TikTok.

**Platform selection:**
| Platform | Use case |
|----------|---------|
| **Google Ads** | High-intent search, bottom-of-funnel conversions |
| **Meta** | Demand generation, visual products, retargeting |
| **LinkedIn** | B2B, decision-maker, higher CPCs |
| **Twitter/X** | Tech audiences, real-time, thought leadership |
| **TikTok** | Younger demographics, viral, brand awareness |

**Frameworks:** PAS, BAB, Social Proof Lead

**Outputs:** Campaign structure + ad copy + audience definitions → `assets/campaigns/paid-ads/{date}-{campaign}.md`

**Hard gates:** Conversion tracking set up; landing page final; budget defined; audience clear; platform compliance

**Pitfalls:** Launch without conversion tracking; spread budget too thin; change bids too frequently; ad fatigue

---

## ckm:form-cro

**Purpose:** Form optimization cho lead capture, demo requests, contact forms, checkout, surveys.

**Key principles:** Every field has cost; value > effort; reduce cognitive load

**Optimizations:** Field count/ordering (easy first, sensitive end); single vs multi-step (5+ fields → multi-step); error handling; CTA copy; trust elements; mobile (44px+ touch targets)

**Form types:**
| Type | Guidance |
|------|---------|
| Lead capture | Minimal fields, clear offer |
| Contact | Essential: email + message |
| Demo request | Name, email, company, use case |
| Quote/estimate | Multi-step recommended |
| Survey | Progress bar essential, skip logic |

**Outputs:** Audit reports → `assets/audits/forms/{date}-{form-name}.md` với issue/impact/fix/priority

**Pitfalls:** Too many fields upfront; confusing labels; no progress indicator multi-step; ignore mobile

---

## ckm:hub & ckm:dashboard

**ckm:hub:** Launches both Content Hub + Marketing Dashboard
- `/hub` start all services
- `/hub --scan` rescan assets
- `/hub --stop` stop servers
- URLs: Content Hub `localhost:3457/hub`, Dashboard UI `localhost:5173`, API `localhost:3457/api/`

**ckm:dashboard:** Manage just dashboard
- `dev` (default), `prod`, `build`, `stop`, `check`
- Features: Campaign board (Kanban drag-drop), Content library, Asset gallery, Automation panel

---

## ckm:video

**Purpose:** Video production: script writing, storyboard, AI generation (Veo 3.1), platform optimization, SEO.

**Subcommands:** `:create` (Veo 3.1), `:script-create`, `:storyboard-create`

**Types & specs:** Explainer, product demo, short-form, testimonial (platform-specific cho YouTube/TikTok/Instagram/LinkedIn)

**Outputs:**
- Scripts → `assets/video/{date}-{title}-script.md`
- Storyboards → `assets/video/{date}-{title}-storyboard.md`
- Generated → `assets/video/generated/{date}-{title}.mp4`

**Pitfalls:** Scripts without visual direction; ignore aspect ratios; weak hooks first 3 seconds

---

# PART 8: COMMON DECISION MATRICES

## Khi nào dùng Plan flag nào

```
Task complexity → flag:
- Trivial (<30 min, 1 file)      → ck:plan --fast  hoặc skip plan, dùng ck:cook trực tiếp
- Standard (1-4 hours)            → ck:plan (default)
- Complex (1-2 days)              → ck:plan --hard
- Big architectural               → ck:plan --hard rồi autoplan
- Multi-team parallel             → ck:plan --parallel
- Unsure between approaches       → ck:plan --two
```

## Khi nào dùng Cook flag nào

```
Confidence trong scope:
- Cao + simple                    → ck:cook --fast --auto
- Cao + complex                   → ck:cook --auto
- Medium                          → ck:cook (--interactive default)
- Thấp / first time                → ck:cook --interactive
- Multi-phase parallel work       → ck:cook --parallel
- Refactor có tests phải bảo vệ   → ck:cook --tdd
```

## Khi nào dùng Plan Review nào

```
Concern chính → Review:
- "Có đúng thứ cần build không?"   → plan-ceo-review
- "UI/UX có ổn không?"             → plan-design-review
- "Architecture có lock không?"     → plan-eng-review
- "Developer-facing có OK không?"   → plan-devex-review
- "Muốn cả 4 nhanh"                → autoplan
```

## Khi nào dùng Fix vs Debug vs Cook

```
Tình huống:
- Có error/bug rõ, biết file       → ck:fix --quick
- Có bug, root cause chưa rõ       → ck:fix (full workflow)
- Cần investigate phức tạp         → ck:debug rồi ck:fix
- Critical production              → ck:fix --review
- Multiple independent bugs        → ck:fix --parallel
- Refactor (không phải bug)        → ck:cook
```

## Marketing workflow chain

```
End-to-end campaign:
1. ckm:marketing-research      ← market intelligence
2. ckm:persona                 ← define ICP
3. ckm:marketing-planning      ← strategy
4. ckm:funnel design           ← user journey
5. ckm:write:good              ← content
6. ckm:seo audit + keywords    ← organic
7. ckm:social                  ← posts
8. ckm:email flow              ← nurture
9. ckm:campaign create         ← orchestrate
10. ckm:analytics              ← measure
```

## Design pipeline

```
From scratch:
design-consultation → design-shotgun → design-html (vanilla) hoặc ck:frontend-design (framework)

From mockup:
ck:frontend-design (direct)

Quick AI prototype:
ck:stitch generate → ck:frontend-design
```

---

# PART 9: GUIDE — Thêm Workflow Mới Vào Project

1. **Đọc** `claudekit-commands-reference.md` để chọn commands phù hợp
2. **Mở** `src/data/workflows.ts`
3. **Thêm object** vào array `workflows`:
   ```ts
   {
     id: "kebab-case-unique",
     title: { vi: "...", en: "..." },
     description: { vi: "...", en: "..." },
     level: "beginner" | "intermediate" | "advanced",
     duration: "30 min" | "2-4 hrs" | "1-2 days",
     category: "advanced-pipelines" | "getting-started" | etc.,
     steps: [
       { command: "/ck:plan", label: { vi: "plan", en: "plan" } },
       // ... preview chips on card
     ],
     phases: [
       {
         name: { vi: "Tư duy", en: "Thinking" },
         duration: "30 min",
         steps: [
           {
             command: "/ck:brainstorm",
             description: { vi: "...", en: "..." },
             optional?: false,
             alternative?: { vi: "...", en: "..." },
           },
         ],
       },
     ],
     tips?: [{ vi: "...", en: "..." }],
     shortcut?: { vi: "...", en: "..." },
   }
   ```
4. **Nếu cần category mới**, update 3 files:
   - `src/types/workflow.ts` (type `WorkflowCategory`)
   - `src/data/workflows.ts` (`categoryOrder`)
   - `src/i18n/translations.ts` (`uiStrings.categories`)
5. **Lưu** — Next.js auto-reload, workflow xuất hiện ngay

**Best practices khi viết workflow:**
- Mỗi phase duration realistic (đo từ thực tế hoặc estimate từ commands gốc)
- Tips phải actionable, không vague
- Optional steps phải có lý do rõ ràng
- Steps phải đúng thứ tự execution
- Mỗi step description giải thích "tại sao" không chỉ "làm gì"
