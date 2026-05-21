# Engineer — Thinking & Research Tools

Skills cho exploration, analysis, decision-making TRƯỚC khi implement.

---

## ck:brainstorm

**Purpose:** Solution exploration với rigorous requirements capture, design presentation, trade-off analysis TRƯỚC implementation decision.

**USE when:**
- Technical options unclear
- Multiple valid approaches
- Cần quyết architecture/approach

**DON'T use when:**
- Ready implement → `ck:cook`
- Chỉ cần expert advice → `ck:ask`
- Debug → `ck:debug`

**Modes:** DISCOVERY (scout + clarifying questions) / DESIGN (2-3 viable solutions với pros/cons) / VALIDATION (explicit design approval)

**Outputs:** Design presentation 2-3 approaches; trade-off matrix; recommended với rationale; next steps

**Hard gates:**
- MANDATORY codebase scout TRƯỚC (trước MỌI clarifying question/option)
- MANDATORY exact requirements grounded in scout
- MANDATORY design presentation + user approval trước implementation (HARD-GATE)
- MANDATORY 2-3 alternatives, honest pros/cons (NOT single-solution)
- Questions grounded in scout (ví dụ: "Endpoint nên ở src/api/users.ts hay new src/api/profile/?" NOT "Where should endpoints go?")
- YAGNI, KISS, DRY

**Pitfalls:** Propose designs without scouting; vague questions; skip alternatives; over-engineered; skip design approval

**Difference from:**
- Brainstorm = EXPLORATION-BEFORE-DESIGN
- Khác `ask` (consultant only), `cook` (implement), `plan` (planning focus)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/brainstorm

---

## ck:ask

**Purpose:** Technical consultation với 4 advisors (Systems Designer, Tech Strategist, Scalability Consultant, Risk Analyst).

**USE when:**
- Architectural decision
- Cần best-practice guidance
- Evaluate tech choices

**DON'T use when:**
- Ready implement → `ck:cook`
- Explore multiple options → `ck:brainstorm`
- Debug → `ck:debug`

**Modes:** SINGLE-ADVISOR (basic) / MULTI-ADVISOR (cross-cutting) / AUTO-ROUTE

**Outputs:** Architecture analysis; design recommendations với rationale + alternatives; tech guidance pros/cons; implementation strategy phased; next actions

**Hard gates:**
- MANDATORY codebase scout trước answer
- Must reference primary-workflow.md, development-rules.md
- Answer in 1 sentence each: output, criteria, scope, constraints, touchpoints
- NO implementation
- YAGNI, KISS, DRY

**Pitfalls:** Advice without scouting; over-engineering (violates YAGNI); not grounded in project patterns

**Difference from:**
- Ask = CONSULTATION-ONLY
- Khác `cook` (implement), `brainstorm` (explore before design), `code-review` (audit)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/ask

---

## ck:predict

**Purpose:** 5 expert personas (Architect, Security, Performance, UX, Devil's Advocate) independently debate proposed change, identify conflicts, produce GO/CAUTION/STOP verdict.

**USE when:**
- Major feature, architecture change
- Risky refactor
- Competing technical approaches

**DON'T use when:**
- Trivial changes (`ck:debug` cho bugs)
- Already-decided work
- Dep bumps no API changes

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--files <glob>` | Read specific files |
| `--chain reason` | Subjective refinement loop (debate → critique → synthesize → blind judge until convergence) |
| `--chain probe` | Requirement interrogation (saturate missing constraints + assumptions) |

**Outputs:** Verdict GO/CAUTION/STOP; agreements; conflicts table (5 personas + resolution); risk summary; recommendations

**STOP triggers:** Unresolved auth bypass, design incompatibility, unacceptable latency, false assumptions

**Hard gates:**
- Read code nếu files provided (don't invent)
- Personas analyze independently TRƯỚC conflict phase
- Chain modes chỉ run nếu CAUTION với specific root cause

**Pitfalls:** Personas influence each other; weak recommendations without actionable steps; stop at CAUTION without chain mode

**Difference from:**
- Predict = architecture debate pre-implementation
- Khác `scenario` (edge cases), `plan` (step-by-step execution)

---

## ck:scenario

**Purpose:** Generate comprehensive edge cases & test scenarios decomposing features qua 12 dimensions (user types, input extremes, timing, scale, state, env, errors, auth, data, integration, compliance, business logic).

**USE when:**
- Before implementation (risk discovery)
- Designing APIs
- Pre-release coverage audit
- Test case generation

**DON'T use when:**
- Trivial single-line changes
- Stable tested code with no recent mods

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--iterations N` | Bounded loop — exactly N iterations, then stop |
| `--saturation` | Loop until 2 consecutive iterations no novel scenarios |
| `--domain <type>` | Domain hint (software, product, business, security, marketing) |
| `--focus <dim>` | Prioritize dimension (edge-cases, failures, security, scale) |
| `--format <type>` | Output (table, use-cases, test-scenarios, threat-scenarios) |

**Modes:** One-shot (default) / Iterative / Saturation

**Outputs:** Scenario table; `scenario-results.tsv` (iterative); coverage matrix + composite score

**Hard gates:**
- Read target file/description trước generate
- Classify mỗi scenario New/Variant/Duplicate/Out-of-scope
- Force dimension rotation sau 3 consecutive same-dimension
- Severity Critical>High>Medium>Low

**Pitfalls:** Duplicate scenarios; vague scenarios; forget dimension rotation

**Difference from:**
- Scenario = edge cases pre-implementation
- Khác `test` (test code post-scenario), `predict` (architecture debate)

---

## ck:research

**Purpose:** Conduct systematic technical research với multi-source gathering, analysis, comprehensive markdown report.

**USE when:**
- Evaluating tech stack
- Gathering requirements
- Researching best practices
- Security/performance deep dives

**DON'T use when:**
- Quick fact-checking
- Trivial decisions
- Implementation details only

**Modes:** WebSearch (default/fallback) / Gemini CLI (nếu enabled trong `~/.claude/.ck.json`)

**Outputs:** Research report markdown (methodology, key findings, recommendations, resources)

**Hard gates:**
- Define scope + evaluation criteria first
- **Max 5 research tool calls** (strict budget)
- WebSearch/Gemini must work
- Cross-reference sources
- All sources cited

**Pitfalls:** Exceed 5 calls; không check publication dates; miss conflicting info; fabricate missing details

**Difference from:**
- Research = deep tech research
- Khác `scout` (find files in codebase), `repomix` (package codebase)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/research

---

## ck:autoresearch

**Purpose:** Auto-research patterns for feature discovery — finds the right family member skill automatically.

**USE when:**
- Don't know which skill to use
- Want auto-routing to appropriate skill family

**DON'T use when:**
- Already know specific skill needed

---

## ck:problem-solving

**Purpose:** Systematic approaches for different "stuck-ness" patterns (complexity spirals, innovation blocks, scale uncertainty).

**USE when:**
- Multiple implementations competing
- Conventional solutions inadequate
- Same issue recurring
- Forced solutions
- Production uncertainty

**DON'T use when:**
- Issue is straightforward (just code it)

**Five techniques:** Simplification Cascades, Collision-Zone Thinking, Meta-Pattern Recognition, Inversion Exercise, Scale Game

**Modes:** Apply single technique or combine multiple

**Hard gates:** Match symptom to correct technique first via flowchart in "when-stuck.md"

**Pitfalls:** Applying wrong technique; not combining when needed; treating as checklist vs reasoning tool

**Difference from:**
- problem-solving = non-linear reframing
- Khác `sequential-thinking` (structured linear)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/problem-solving

---

## ck:sequential-thinking

**Purpose:** Structured problem-solving via numbered thought sequences với dynamic revision và hypothesis verification.

**USE when:**
- Complex multi-step problems
- Ambiguous scope
- Hypothesis-driven debugging
- Architecture decisions

**DON'T use when:**
- Routine coding (overhead not worth it)

**Markers:** `Thought N/M [REVISION]`, `[BRANCH A/B]`, `[HYPOTHESIS]`, `[VERIFICATION]`, `[FINAL]`

**Modes:** Explicit (visible markers) hoặc implicit (internal methodology)

**Hard gates:** Mark revisions when insights invalidate prior work; expand/contract count dynamically

**Pitfalls:** Treating as prescriptive checklist vs flexible methodology

**Difference from:**
- sequential-thinking = structured linear
- Khác `problem-solving` (non-linear reframing)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/sequential-thinking
