# Engineer — Core Workflow Commands

Pipeline cốt lõi: planning, implementation, fixing, shipping. Dùng hàng ngày.

---

## ck:plan

**Purpose:** Tạo implementation plan với optional prompt enhancement, delegate sang sub-skills tùy mode.

**USE when:**
- Tạo plan cho feature/refactor/fix
- Cần research depth khác nhau
- Scope chưa rõ, cần phase breakdown

**DON'T use when:**
- Chỉ execute plan có sẵn → dùng `ck:cook`
- Discuss architecture → dùng `ck:ask` hoặc `ck:brainstorm`
- Trivial bug fix → dùng `ck:fix --quick`

**Subcommands/Flags:**
| Flag/Sub | Tác dụng |
|----------|---------|
| `fast` | Bỏ research phase, đi thẳng analyze + plan; accept scout context; KHÔNG research external |
| `hard` | Full research + deep analysis + thorough planning; consult external, evaluate tradeoffs, surface unresolved questions |
| `parallel` | Plan với phases parallel-executable; thêm phase ownership + dependency graph + multi-team coordination |
| `two` | Tạo 2 alternative plans với tradeoff comparison; user pick |
| `validate` | Validate plan có sẵn qua interview; challenge assumptions, identify gaps; KHÔNG tạo plan mới |
| `ci` | Analyze GitHub Actions logs → diagnose CI failures → fix plan; skip planning thường |
| `cro` | CRO plan cho content (specialized) |
| `archive` | Write journal entries, archive plans; delete plan files, save reflection |

**Modes:** FAST / HARD / PARALLEL / TWO / CI / ARCHIVE / VALIDATE / CRO

**Inputs:** Task description (natural language) hoặc subcommand
**Outputs:** Plan file tại `./plans/plan-[TIMESTAMP]-[SLUG].md` hoặc subcommand-specific output

**Hard gates:**
- KHÔNG implementation code
- Phải detect active vs suggested plan trước
- Plan naming theo pattern từ `## Naming` section

**Pitfalls:**
- Dùng `hard` cho task trivial → lãng phí tokens
- Không enhance prompt → vague plans
- Skip plan-detection → duplicate plans

**Difference from:**
- Plan = PLANNING-ONLY
- Khác `cook` (implement), `ask` (consult), `brainstorm` (explore options)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/plan

---

## ck:cook

**Purpose:** End-to-end implementation với auto workflow detection routing qua research→plan→code→test→review.

**USE when:**
- Execute plan đã biết
- Scope rõ, requirements clear
- Cần full pipeline với reviews

**DON'T use when:**
- Debug bug → dùng `ck:fix`
- Chưa có plan & scope chưa rõ → dùng `ck:plan` trước
- Design chưa quyết → dùng `ck:brainstorm`

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--interactive` | (default) User approval gates ở mỗi phase: research→plan→code→review→test→finalize |
| `--fast` | Bỏ research phase, jump scout→plan→code; GIỮ all review gates; trade research depth lấy speed |
| `--auto` | Auto-approve review gates nếu confidence ≥9.5 và 0 critical issues; GIỮ research+testing; bỏ human pause |
| `--parallel` | Multi-agent: spawn parallel fullstack-developer agents cho independent feature work |
| `--no-test` | Skip testing, surface unverified-tests risk qua AskUserQuestion |
| `--tdd` | Tests-first per phase: write tests for current behavior TRƯỚC refactor, verify pass sau |

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

**Pitfalls:**
- Skip scout→plan "save time" → lãng phí debug sau
- `--auto` có thể approve broken code nếu metrics bị gamed
- `--no-test` risk silent regressions

**Difference from:**
- Cook = IMPLEMENTATION-FOCUSED
- Khác `plan` (planning only), `fix` (bug only), `bootstrap` (greenfield)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/cook

---

## ck:fix

**Purpose:** Unified bug-fixing với structured root-cause diagnosis TRƯỚC mọi fix attempt, ngăn symptom-patching.

**USE when:**
- Có concrete error/failing test/UI bug
- Cần fix properly với prevention
- Đã reproduce được bug

**DON'T use when:**
- Optimize/refactor (không phải bug) → dùng `ck:cook`
- Architectural redesign → dùng `ck:brainstorm`
- Chưa có symptom rõ → dùng `ck:debug` investigation

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--auto` | (default) Autonomous, auto-approve nếu score ≥9.5 & 0 critical; MANDATORY code review vẫn enforce |
| `--review` | Human-in-the-loop, pause approve ở MỌI step; cho critical/production |
| `--quick` | Fast scout→diagnose→fix→review cho trivial (lint, type errors, one-file bugs); skip deep workflow |
| `--parallel` | Route sang parallel `fullstack-developer` agents per issue; 1 issue = 1 agent |
| `--security` | Apply security fixes pipeline (used with security-scan) |

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
- NO guessing: diagnosis fail 3+ lần → stop, question architecture
- NO silent patches: side effects → AskUserQuestion options

**Pitfalls:**
- Jump to fix without diagnosis → repeated failures
- "Quick fix later" never happens
- Sau 2+ failed attempts phải question architecture

**Difference from:**
- Fix = DIAGNOSIS-FIRST
- Khác `cook` (feature), `debug` (investigation only, no implementation)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/fix

---

## ck:bootstrap

**Purpose:** End-to-end new project scaffolding từ requirements → research → tech stack → design → planning → implementation.

**USE when:**
- Starting completely new project/full-stack app
- Cần tech stack decisions
- Want guided flow từ idea đến code

**DON'T use when:**
- Thêm vào existing project → dùng `ck:cook`
- Chỉ cần architecture advice → dùng `ck:ask`
- Explore options → dùng `ck:brainstorm`

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

**Pitfalls:**
- Skip tech stack validation → wrong tool
- Design skipped → UI rework
- `--parallel` cần clear task ownership

**Difference from:**
- Bootstrap = GREENFIELD-ONLY
- Khác `cook` (extend existing), `plan` (no scaffolding), `ask` (architecture only)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/bootstrap

---

## ck:ship

**Purpose:** Automated ship workflow: detect branch, merge base, run tests, create versioned PR, optional merge.

**USE when:**
- Feature/fix complete & tested
- Ready push main/dev

**DON'T use when:**
- Still implementing → `ck:cook`
- Chưa ready review → `ck:code-review` trước
- Ship từ main (chỉ ship từ feature branch)

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `official` | Target main/master; bump VERSION + CHANGELOG; PR against main |
| `beta` | Target dev/develop; PR against dev; lighter versioning |
| `--dry-run` | Preview WOULD happen, không execute |
| `--skip-tests` | Skip test suite (caution!) |
| `--skip-review` | Skip code review (caution!) |
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

**Pitfalls:**
- Ship từ main là fatal
- Uncommitted changes silent included
- Dry-run hide real merge conflicts

**Difference from:**
- Ship = MERGE-FINAL
- Khác `cook` (develop), `code-review` (audit), `plan` (design)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills (refer to `ship` section)

---

## ck:test

**Purpose:** Comprehensive testing framework: unit/integration/e2e, coverage, build validation, QA reports.

**USE when:**
- Sau implement
- Coverage validation
- UI/visual regression
- Pre-commit

**DON'T use when:**
- Debug failing test → dùng `ck:debug` trước
- Design test strategy → dùng `ck:ask`
- No test suite exists yet

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `ui [url]` | UI tests qua browser automation: screenshots, responsive, accessibility, form, console errors; skip code tests |
| (default) | AskUserQuestion: code tests vs UI tests |
| `--coverage` | Include coverage report; uncovered lines, % per file |
| `--verbose` | Full output với stack traces |
| `--e2e` | E2E tests only |

**Modes:** CODE-TESTS / UI-TESTS / COVERAGE-ONLY

**Inputs:** Test context HOẶC ui [url]
**Outputs:** Test results; coverage report; failed test list; QA report

**Hard gates:**
- "NEVER IGNORE FAILING TESTS"
- All critical paths phải có coverage
- Test isolation, deterministic
- Coverage thresholds (80%+ recommended)
- Build validation trước tests

**Pitfalls:**
- Mock/stub fake passing → hide bugs
- Skip coverage → untested code ships
- Interdependent tests → flaky

**Difference from:**
- Test = TEST-EXECUTION
- Khác `code-review` (audit), `fix` (diagnose), `debug` (investigate)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/test

---

## ck:code-review

**Purpose:** Adversarial code review với red-team analysis, actively cố gắng break code, detect security holes & failure modes.

**USE when:**
- Sau implementation trước commit/merge
- Review PR/commit
- Security audit
- Codebase audit

**DON'T use when:**
- Pure debugging → `ck:debug`
- Style/formatting → linters
- Design phase

**Flags/Subcommands:**
| Input | Mode |
|-------|------|
| `#123` hoặc PR URL | Fetch full PR diff qua `gh pr diff`; PR mode |
| `abc1234` (7+ hex) | Review single commit qua `git show`; commit mode |
| `--pending` | Staged + unstaged changes qua `git diff`; pending mode |
| `codebase` | Deep full-codebase scan: patterns, security, coverage; deep audit |
| `codebase parallel` | Multi-reviewer parallel audit; split reviewers across modules |
| `--security` | Deep security review |
| (no args) | AskUserQuestion |

**Modes:** PR / COMMIT / PENDING / CODEBASE / DEFAULT

**Outputs:** 3-stage review report (spec compliance → code quality → adversarial findings); issue list với severity; recommendations

**Hard gates:**
- Stage 1: Spec compliance (code có match requested?)
- Stage 2: Code quality (standards, patterns)
- Stage 3: Adversarial (always-on red-team)
- Evidence-before-claims: cite file:line cụ thể
- Brutal, honest, concise; technical correctness > social comfort

**Pitfalls:**
- Assume PR tested
- Performative feedback without evidence
- Allow warnings slip

**Difference from:**
- Code-Review = AUDIT
- Khác `cook` (build), `test` (validate), `fix` (solve)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/code-review

---

## ck:scout

**Purpose:** Fast, token-efficient codebase discovery dùng parallel agents tìm files cho task.

**USE when:**
- Multi-directory feature start
- Cần file relationships
- Debug session start
- "Where is X" lookups

**DON'T use when:**
- Đã có file paths
- Single-file change
- Full review → `ck:code-review codebase`

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

**Pitfalls:**
- Quá nhiều agents → lãng phí tokens
- Không chia directories → overlap
- Skip task registration → mất coordination

**Difference from:**
- Scout = DISCOVERY
- Khác `code-review` (audit), `debug` (trace), `plan` (design)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/scout

---

## ck:debug

**Purpose:** Investigation-only root cause analysis, không implement fix.

**USE when:**
- Bug phức tạp, chưa biết root cause
- Cần evidence-based analysis
- Trace through code paths

**DON'T use when:**
- Đã biết root cause → `ck:fix`
- Investigation + fix combined → `ck:fix --review`

**Outputs:** Root cause report với evidence; reproduction steps; recommended fix approaches (KHÔNG apply fix)

**Difference from:**
- Debug = INVESTIGATION-ONLY
- Khác `fix` (diagnose + apply), `scout` (find files)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/debug

---

## ck:CI

**Purpose:** Analyze CI/CD pipeline failures (GitHub Actions, GitLab CI) và đề xuất fix.

**USE when:**
- CI builds failing
- Test failures on CI nhưng pass locally
- Pipeline errors khó hiểu

**DON'T use when:**
- Local test failures → `ck:fix` hoặc `ck:debug`
- CI not yet configured → `ck:devops`

**Inputs:** Pipeline log URL hoặc workflow file
**Outputs:** Root cause analysis + fix plan

**Difference from:**
- `ck:plan ci` (planning mode) vs `ck:CI` (analysis mode)
