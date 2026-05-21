# Workflow Patterns & Decision Matrices

Quick decision guides để chọn command/workflow phù hợp khi thiết kế workflows mới.

---

## Decision Matrix 1: Plan Flag Selection

```
Task complexity → flag:
- Trivial (<30 min, 1 file)      → ck:plan --fast  hoặc skip plan, dùng ck:cook trực tiếp
- Standard (1-4 hours)            → ck:plan (default)
- Complex (1-2 days)              → ck:plan --hard
- Big architectural               → ck:plan --hard rồi autoplan
- Multi-team parallel             → ck:plan --parallel
- Unsure between approaches       → ck:plan --two
- CI failure analysis             → ck:plan ci
- Content/CRO planning            → ck:plan cro
- Archive complete                → ck:plan archive
```

## Decision Matrix 2: Cook Flag Selection

```
Confidence in scope:
- Cao + simple                    → ck:cook --fast --auto
- Cao + complex                   → ck:cook --auto
- Medium                          → ck:cook (--interactive default)
- Thấp / first time                → ck:cook --interactive
- Multi-phase parallel work       → ck:cook --parallel
- Refactor có tests cần bảo vệ    → ck:cook --tdd
- Bypass testing                  → ck:cook --no-test (caution!)
```

## Decision Matrix 3: Fix Flag Selection

```
Bug situation:
- Trivial (lint, type, 1 file)    → ck:fix --quick
- Production critical              → ck:fix --review
- Standard bug                     → ck:fix (--auto default)
- Multiple independent bugs       → ck:fix --parallel
- Security findings                → ck:fix --security
```

## Decision Matrix 4: Plan Review Selection

```
Concern → Review:
- "Có đúng thứ cần build không?"   → plan-ceo-review
- "UI/UX có ổn không?"             → plan-design-review
- "Architecture có lock không?"     → plan-eng-review
- "Developer-facing có OK không?"   → plan-devex-review
- "Muốn cả 4 nhanh"                → autoplan
```

## Decision Matrix 5: Fix vs Debug vs Cook

```
Situation:
- Có error/bug rõ, biết file       → ck:fix --quick
- Có bug, root cause chưa rõ       → ck:fix (full workflow)
- Cần investigate phức tạp         → ck:debug rồi ck:fix
- Critical production              → ck:fix --review
- Multiple independent bugs        → ck:fix --parallel
- Refactor (không phải bug)        → ck:cook
```

## Decision Matrix 6: Design Skill Selection

```
Goal:
- New project no design system    → design-consultation
- Have brand, explore options     → design-shotgun
- AI rapid prototype              → ck:stitch
- Approved design → vanilla HTML  → design-html
- Approved design → framework     → ck:frontend-design
- Audit live site                 → design-review
- Critique plan UI                → plan-design-review
- Design reference/guidelines     → ck:ui-ux-pro-max
```

## Decision Matrix 7: Codebase Understanding

```
Need:
- Quick file lookup              → ck:scout
- Understand patterns/architecture → ck:understand
- Semantic go-to-definition       → ck:gkg
- Knowledge graph query           → ck:graphify
- PR/diff analysis                → ck:understand-diff
- Full repo packed cho LLM        → ck:repomix
- Onboard new developer           → ck:understand-onboard
```

## Decision Matrix 8: Marketing Action

```
Want to:
- Write blog post                 → ckm:write:good
- Optimize existing copy CRO      → ckm:write:cro
- Email sequence                  → ckm:email flow
- Audit SEO                       → ckm:seo audit
- Keyword research                → ckm:seo keywords
- Compare competitors             → ckm:competitor analyze
- Create persona                  → ckm:persona create
- Plan strategy                   → ckm:marketing-planning
- Run campaign                    → ckm:campaign create
- Launch product                  → ckm:launch-strategy
- Track playbook                  → ckm:play
- Measure KPIs                    → ckm:analytics
- Create banner                   → ckm:banner-design
- Design logo                     → ckm:logo-design
- YouTube thumbnail               → ckm:youtube-thumbnail-design
```

---

## Common Workflow Patterns

### Pattern A: Feature Development (basic)
```
ck:brainstorm → ck:plan → ck:cook → ck:test → ck:code-review → ck:ship
```

### Pattern B: Full Pipeline với Reviews
```
ck:brainstorm
  ↓
ck:plan --hard
  ↓
autoplan (or individual reviews: plan-ceo → plan-design → plan-eng → plan-devex)
  ↓
design pipeline (design-consultation → design-shotgun → ck:frontend-design)
  ↓
ck:cook
  ↓
ck:ship
```

### Pattern C: Bug Fix (systematic)
```
ck:scout → ck:debug → ck:fix → ck:test → ck:ship
```
Hoặc all-in-one: `ck:fix`

### Pattern D: Design-First Frontend
```
design-consultation → design-shotgun → ck:plan --fast → ck:frontend-design → ck:cook → ck:ship
```

### Pattern E: Backend/API Full
```
ck:brainstorm → ck:plan → plan-eng-review → ck:cook → ck:ship
```

### Pattern F: Marketing Campaign Full
```
ckm:marketing-research → ckm:persona → ckm:marketing-planning →
ckm:funnel design → ckm:write:good → ckm:seo audit + keywords →
ckm:social → ckm:email flow → ckm:campaign create → ckm:analytics
```

### Pattern G: Product Launch
```
ck:brainstorm → office-hours → ck:bootstrap →
ckm:brand → ckm:launch-strategy → ckm:write:blog →
ckm:social → ckm:email flow → ckm:campaign create
```

### Pattern H: Codebase Understanding
```
ck:repomix → ck:understand → ck:gkg → ck:plan
```

### Pattern I: Security Audit
```
ck:security-scan → ck:security --red-team → ck:fix --security → ck:test
```

### Pattern J: Performance Optimization
```
ck:debug → ck:cook → ck:test (--coverage, --e2e) → ck:fix
```

---

## Speed Flags Universal Reference

| Flag | Apply to | Effect |
|------|---------|--------|
| `--fast` | plan, cook, bootstrap | Skip research, faster |
| `--hard` | plan | Deep research, detailed |
| `--auto` | cook, fix, bootstrap | Auto-approve, no questions |
| `--parallel` | plan, cook, bootstrap, fix | Multi-agent parallel |
| `--quick` | fix | Fastest fix, minimal workflow |
| `--tdd` | cook | Test-driven, tests first |
| `--no-test` | cook | Skip testing (caution!) |
| `--interactive` | cook | Confirm each step |
| `--review` | fix | Human-in-loop |

---

## When to Spawn Agents vs Use Skills

| Need | Use Skill | Use Agent |
|------|-----------|-----------|
| Reusable workflow | ✓ | |
| Specialized role/expert | | ✓ |
| Multi-step process | ✓ | |
| Parallel work, own context | | ✓ (via Task tool) |
| Save outputs to structured files | ✓ | |
| One-shot focused analysis | | ✓ |

**Agents thường được skills spawn:**
- `ck:cook` → tester, code-reviewer, journal-writer
- `ck:fix` → debugger, code-reviewer
- `ck:plan` → planner, researcher, brainstormer
- `ck:team` → multiple agents trong parallel sessions

---

## Workflow Selection by User Intent

| User says | Suggested workflow |
|-----------|-------------------|
| "Build a feature" | Pattern A hoặc B |
| "Fix a bug" | Pattern C |
| "Create landing page" | Pattern D |
| "Add an API" | Pattern E |
| "Launch a campaign" | Pattern F |
| "Launch a product" | Pattern G |
| "Onboard to new repo" | Pattern H |
| "Security audit" | Pattern I |
| "Optimize performance" | Pattern J |
| "Create blog post" | `ckm:write:good` |
| "Design from scratch" | `design-consultation` → `design-shotgun` |
| "Refactor code" | `/review` → `ck:plan` → `ck:cook` |
| "Deploy somewhere" | `ck:deploy` hoặc `ck:devops` |
| "Generate diagrams" | `ck:mermaidjs-v11` hoặc `ck:tech-graph` hoặc `excalidraw` |

---

## Anti-Patterns to Avoid

| Don't | Do instead |
|-------|-----------|
| Skip scout before plan | Always scout first cho non-trivial work |
| Skip tests to save time | Use `--no-test` only with explicit acceptance |
| Use `--auto` for production critical | Use `--review` for human-in-loop |
| Run autoplan on incomplete plan | Complete plan first, then autoplan |
| Manually invoke 4 reviews | Use autoplan if you want all 4 |
| Reproduce bug in head | Reproduce locally first before `ck:fix` |
| Generate design without context | Always provide brand context first |
| Launch campaign without tracking | Verify analytics setup before launch |
| Hardcode tech stack | Let bootstrap research options first |
| Ship from main branch | Always ship from feature/dev branch |
