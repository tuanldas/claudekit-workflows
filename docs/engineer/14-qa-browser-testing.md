# Engineer — QA, Browser Testing & Performance

QA testing family + browser automation + performance benchmarking.

---

## QA Skills Hierarchy

```
qa-only          ← Report-only, no fixes
   ↓
qa               ← Standard: test + fix + commit + re-verify
   ↓
qa-full          ← Sub-command reference (check/audit/full/accept/regression/verify-issue)
   ↓
qa-pro-max       ← Comprehensive SaaS QA: tests, security, performance, automation
```

---

## qa

**Purpose:** Systematically QA test web application và fix bugs found. Runs QA testing, then iteratively fixes bugs trong source code, committing each fix atomically và re-verifying.

**USE when:**
- "QA", "test this site", "find bugs", "test and fix", "fix what's broken"

**Proactively suggest:**
- User says feature ready cho testing
- User asks "does this work?"

**3 Tiers:**
| Tier | Coverage |
|------|----------|
| **Quick** | Critical/high only |
| **Standard** | + Medium severity |
| **Exhaustive** | + Cosmetic issues |

**Produces:** Before/after health scores; fix evidence; commits cho each atomic fix

---

## qa-only

**Purpose:** Report-only QA — systematically tests web application và produces structured report (health score, screenshots, repro steps) WITHOUT fixing anything.

**USE when:**
- "Just report bugs", "qa report only", "test but don't fix"

**Difference from `qa`:** No fixes, no commits — just structured report

**Proactively suggest:** User wants bug report without code changes

---

## qa-full

**Purpose:** Internal reference cho qa-full sub-commands. KHÔNG gọi trực tiếp.

**Subcommands:**
| Sub | Action |
|-----|--------|
| `/qa-full:check` | Check |
| `/qa-full:audit` | Audit |
| `/qa-full:full` | Full QA |
| `/qa-full:accept` | Accept |
| `/qa-full:regression` | Regression test |
| `/qa-full:verify-issue` | Verify specific issue |

---

## qa-pro-max

**Purpose:** Comprehensive QA engineering skill cho SaaS teams. Full QA lifecycle: planning, design, automation, execution, reporting, CI/CD integration cho Next.js + NestJS + PostgreSQL stack.

**USE when:**
- "Test plan", "write tests", "generate test cases"
- "QA review", "test strategy", "regression plan"
- "API test", "security scan", "performance test"
- "Bug triage", "qa metrics", "test coverage"
- "Test automation"
- Any testing task beyond browser-based QA

**Covers:** Full QA lifecycle from planning → design → automation → execution → reporting → CI/CD integration

---

## browse

**Purpose:** Fast headless browser cho QA testing và site dogfooding. ~100ms per command.

**USE when:**
- Need to test a feature
- Verify a deployment
- Dogfood user flow
- File bug với evidence

**Triggers:** "open in browser", "test the site", "take a screenshot", "dogfood this"

**Capabilities:**
- Navigate any URL
- Interact với elements
- Verify page state
- Diff before/after actions
- Take annotated screenshots
- Check responsive layouts
- Test forms và uploads
- Handle dialogs
- Assert element states

**Difference from:**
- `browse` (gstack) = QA testing focus
- `agent-browser` = autonomous browsing với compact tokens
- `chrome-devtools` = detailed Puppeteer automation

---

## scrape

**Purpose:** Pull data từ web page. First call on new intent prototypes flow qua $B primitives, returns JSON. Subsequent calls on matching intent route to codified browser-skill và return ~200ms.

**USE when:**
- "Scrape", "get data from", "pull", "extract from", "what's on" a page

**Read-only:** For mutating flows (form fills, clicks, submissions), use `/automate`

**Companion:** `skillify` — codify successful scrape into permanent skill

---

## skillify

**Purpose:** Codify most recent successful `/scrape` flow thành permanent browser-skill on disk. Future `/scrape` calls với same intent run codified script trong ~200ms instead of re-driving page.

**USE when:**
- "Skillify", "codify", "save this scrape", "make this permanent"

**Process:**
1. Walks back through conversation
2. Synthesizes `script.ts` + `script.test.ts` + fixture
3. Runs test trong temp dir
4. Asks before committing

---

## canary

**Purpose:** Post-deploy canary monitoring. Watches live app cho console errors, performance regressions, page failures dùng browse daemon.

**USE when:**
- "Monitor deploy", "canary", "post-deploy check", "watch production", "verify deploy"

**Capabilities:**
- Periodic screenshots
- Compare against pre-deploy baselines
- Alert on anomalies

---

## benchmark

**Purpose:** Performance regression detection dùng browse daemon. Establishes baselines cho page load times, Core Web Vitals, resource sizes. Compares before/after on every PR. Tracks performance trends over time.

**USE when:**
- "Performance", "benchmark", "page speed", "lighthouse", "web vitals", "bundle size", "load time"

**Voice triggers:** "speed test", "check performance"

---

## benchmark-models

**Purpose:** Cross-model benchmark cho gstack skills. Runs same prompt through Claude, GPT (via Codex CLI), Gemini side-by-side — compares latency, tokens, cost, optionally quality qua LLM judge.

**USE when:**
- "Benchmark models", "compare models", "which model is best for X"
- "Cross-model comparison", "model shootout"

**Voice triggers:** Answers "which model is actually best for this skill?" với data instead of vibes

**Difference from:**
- `benchmark` = page performance
- `benchmark-models` = model comparison

---

## health

**Purpose:** Code quality dashboard. Wraps existing project tools (type checker, linter, test runner, dead code detector, shell linter), computes weighted composite 0-10 score, tracks trends over time.

**USE when:**
- "Health check", "code quality", "how healthy is the codebase"
- "Run all checks", "quality score"

---

## Quick Selection Matrix

```
Task → Skill:
- Just want bug report                → qa-only
- Test + fix + commit                  → qa
- SaaS comprehensive testing          → qa-pro-max
- Take a screenshot quickly           → browse
- Scrape data from website            → scrape (+ skillify cho repeat)
- Long autonomous browsing            → agent-browser
- Detailed Puppeteer automation       → chrome-devtools
- Monitor live deploy                 → canary
- Performance regression on PR        → benchmark
- Compare AI models                   → benchmark-models
- Code quality dashboard              → health
```

---

## Common QA Workflows

### Workflow: Pre-Deploy QA
```
1. qa Standard      ← test + fix bugs found
2. benchmark        ← verify no perf regression
3. ck:ship          ← create PR
4. land-and-deploy  ← merge + deploy
5. canary           ← monitor production health
```

### Workflow: Performance Optimization
```
1. benchmark        ← baseline
2. ck:debug         ← identify bottlenecks
3. ck:cook          ← implement fixes
4. benchmark        ← verify improvement
```

### Workflow: Scrape + Codify
```
1. scrape <url>     ← prototype với $B primitives
2. (success?)
3. skillify         ← codify thành permanent skill
4. scrape <url>     ← future runs ~200ms
```
