# Engineer — 13 Specialist Agents

Specialized subagents spawned via Task tool cho specific roles. Khác với skills (workflows), agents are role-based assistants.

---

## 1. planner

**Purpose:** Research best practices, analyze codebase, generate step-by-step implementation plans với code examples, timelines, rollback procedures.

**Spawn when:**
- Trước major features hoặc architectural changes
- Technical decision-making
- Prior to large refactoring efforts
- Investigating CI/CD failures

**Produces:**
- Detailed implementation plans với phased steps
- Risk assessments + rollback procedures
- Timeline estimates + file ownership assignments
- Test matrices (happy paths + edge cases)
- Security checklists + success criteria

**Tools:** Codebase analysis, dependency mapping, research, data flow diagramming

**DON'T use:**
- Straightforward bug fixes
- Simple well-understood tasks
- Rapid prototyping over planning

**URL:** https://docs.claudekit.cc/docs/engineer/agents/planner

---

## 2. researcher

**Purpose:** Synthesize information từ multiple sources thành actionable intelligence cho evaluating technologies.

**Spawn when:**
- Evaluating new frameworks/libraries/tools
- Pre-implementation research
- Comparing multiple technical approaches
- Validating patterns across sources

**Produces:**
- Structured markdown reports (15+ pages)
- Executive summaries, security audits, performance analysis
- Implementation guides với code examples
- 15+ cited sources với action plans

**Tools:** SearchAPI MCP, parallel web search, YouTube analysis (VidCap + Gemini Vision), repo analysis (repomix, GitHub search)

**DON'T use:**
- Quick syntax lookups
- Single obvious solution scenarios
- Immediate implementation needed

**URL:** https://docs.claudekit.cc/docs/engineer/agents/researcher

---

## 3. brainstormer

**Purpose:** Technical advisor — challenge assumptions, debate approaches, brutally honest assessments TRƯỚC code is written.

**Spawn when:**
- Evaluating competing architectural approaches
- Before committing resources to complex decisions
- Validating requirements necessity
- Feasibility assessment

**Produces:**
- 3-5 viable solutions với pros/cons
- Quantified trade-offs (complexity/cost/performance/maintainability)
- Hidden assumptions identification
- Recommendation on simplest viable approach
- Decision summary documented

**Tools:** Analytical frameworks (YAGNI, KISS, DRY) applied contextually

**DON'T use:**
- Implementation planning (use Planner)
- Gathering research data (use Researcher)
- After decisions made and coded
- Tactical troubleshooting

**URL:** https://docs.claudekit.cc/docs/engineer/agents/brainstormer

---

## 4. tester

**Purpose:** Execute tests, validate implementations, ensure code quality với comprehensive coverage analysis targeting 80%+.

**Spawn when:**
- Pre-commit/pre-push validation
- Coverage gap identification
- PR reviews requiring verification
- CI/CD pipeline integration

**Produces:**
- Test execution results (pass/fail)
- Coverage reports (line, branch, function, statement)
- Build verification outputs
- JSON reports cho pipeline integration
- Failure root cause analysis

**Tools:** Jest, Vitest, pytest, cargo test, go test, Playwright, Cypress, Flutter, TypeScript

**DON'T use:**
- Code optimization advice unrelated to testing
- Static code analysis without test execution
- Complex runtime debugging
- Manual exploratory testing

**URL:** https://docs.claudekit.cc/docs/engineer/agents/tester

---

## 5. code-reviewer

**Purpose:** Production-grade security + quality audits với categorized findings BEFORE merge.

**Spawn when:**
- Pre-merge quality gates
- Security vulnerability detection
- Type safety validation
- Performance bottleneck analysis

**Produces:**
- Categorized issues (Critical/High/Medium/Low) với remediation
- OWASP compliance reports + vulnerability inventories
- Type safety violation locations + migration strategies
- Performance bottlenecks (N+1, memory leaks) với optimization
- Standards compliance checklists

**Tools:** OWASP Top 10, SQL injection/XSS/CSRF/secrets detection, TypeScript strict mode validation

**DON'T use:** Post-deployment incident response; real-time production monitoring

**URL:** https://docs.claudekit.cc/docs/engineer/agents/code-reviewer

---

## 6. code-simplifier

**Purpose:** Simplify + refine code cho clarity, consistency, maintainability while preserving all functionality.

**Spawn when:**
- After implementation passes tests, before code review
- Module has deep nesting hoặc over-engineered patterns
- Enforce project standards từ configuration files

**Produces:** Refactored code với improved readability (flattened conditionals, extracted helpers, clearer naming) while maintaining identical behavior

**Tools:** Analysis + rewriting, typecheck, linter, test suite execution

**DON'T use:**
- Don't alter business logic hoặc add features
- Don't apply to test files (read-only)
- Don't expect modifications outside recently changed files

**URL:** https://docs.claudekit.cc/docs/engineer/agents/code-simplifier

---

## 7. debugger

**Purpose:** Systematic root cause analysis cho production incidents, API failures, complex technical issues.

**Spawn when:**
- API endpoints 500 errors
- CI/CD pipeline failures
- Database connection issues
- Production incidents

**Produces:**
- Evidence-based root cause identification
- Incident timelines
- Eliminated hypotheses với reasoning
- Prevention strategies

**Tools:** Log parsing, database inspection (EXPLAIN ANALYZE), performance profiling, error tracing

**DON'T use:** Feature development; architectural design; non-urgent optimization

**URL:** https://docs.claudekit.cc/docs/engineer/agents/debugger

---

## 8. fullstack-developer

**Purpose:** Execute parallel-safe implementation phases across backend, frontend, infrastructure với strict file ownership enforcement.

**Spawn when:**
- Implementing phases từ `ck:plan --parallel`
- Simultaneous backend + frontend work without file conflicts
- Building full-stack features

**Produces:**
- Implemented code across backend (Node.js/Express), frontend (React), infrastructure
- Automated quality reports (type safety, tests, build)
- Phase completion reports tại `{active-plan}/reports/fullstack-dev-{YYMMDD}-phase-{XX}-{topic}.md`

**Tools:** TypeScript/Node.js, React, test runners, type checkers, file ownership tracking

**DON'T use:**
- Single-phase sequential-only work
- Projects requiring cross-file modifications outside ownership boundaries
- When dependent phases aren't complete

**URL:** https://docs.claudekit.cc/docs/engineer/agents/fullstack-developer

---

## 9. ui-ux-designer

**Purpose:** Research trending designs, create production-ready interfaces, ship conversion-optimized layouts với accessibility + responsiveness.

**Spawn when:**
- Building new digital products from scratch
- Recreating designs từ visual references
- Implementing interactive 3D experiences
- Establishing design systems

**Produces:**
- Fully functional HTML/CSS/JavaScript interfaces
- Three.js + WebGL experiences
- WCAG 2.1 AA compliant responsive designs
- Production-ready code (Lighthouse 90+)

**Tools:** Three.js, WebGL, CSS Grid/Flexbox, Vanilla JS, design research platforms (Dribbble, Behance, Awwwards)

**DON'T use:**
- Backend integration → Fullstack Developer
- Copywriting/messaging → Copywriter agent
- Complex code validation → Code Reviewer
- Existing component libraries → Scout skill

**URL:** https://docs.claudekit.cc/docs/engineer/agents/ui-ux-designer

---

## 10. git-manager

**Purpose:** Stage, commit, push code với professional conventional commits, security scanning, 81% cost reduction.

**Spawn when:**
- After implementing features/bug fixes
- Enforcing consistent commit formatting
- Before deployments (security scan)
- Following code reviews

**Produces:**
- Semantic commit messages (conventional format: type/scope/description)
- Security scan reports blocking commits với exposed secrets
- Push confirmations

**Tools:** Git operations, security scanning (API keys/passwords/tokens), Haiku model cho cost optimization, Gemini delegation cho complex changes

**DON'T use:**
- Initial repository setup
- Manual commit customization for compliance
- Advanced Git workflows (rebasing, cherry-picking)
- Team policy requires human review

**URL:** https://docs.claudekit.cc/docs/engineer/agents/git-manager

---

## 11. docs-manager

**Purpose:** Create, update, maintain technical documentation automatically sau code changes.

**Spawn when:**
- After implementing new features
- Setting up initial project documentation
- Generating codebase summaries
- Syncing docs với code changes

**Produces:**
- Complete documentation suites (PDRs, architecture, API references, guides)
- Codebase summaries qua Repomix integration
- Updated documentation reflecting code changes
- Validated code examples + verified paths

**Tools:** Repomix, Scout Agent, Git diff scanning

**DON'T use:**
- Placeholder markers ("TODO: update")
- Can't verify code examples
- Referenced paths/functions can't be confirmed
- Documentation contradicts other docs

**URL:** https://docs.claudekit.cc/docs/engineer/agents/docs-manager

---

## 12. project-manager

**Purpose:** Orchestrate progress tracking, cross-agent coordination, roadmap maintenance.

**Spawn when:**
- Weekly status reviews / milestone checks
- After feature completion (roadmap updates)
- Complex multi-agent workflows
- Sprint planning / velocity analysis
- Blocker escalation

**Produces:**
- Consolidated progress reports (velocity + quality metrics)
- Updated project roadmap
- Blocker documentation với unblock paths
- Feature completion verification
- Historical velocity analysis

**Tools:** Report collection từ `plans/reports/`, roadmap analysis, plan validation, delegation protocols

**DON'T use:**
- Code implementation → developer agents
- Direct documentation edits beyond roadmap
- Test execution
- Routine task tracking outside milestone scope

**URL:** https://docs.claudekit.cc/docs/engineer/agents/project-manager

---

## 13. journal-writer

**Purpose:** Document critical technical failures với honest analysis + emotional authenticity to build institutional knowledge và prevent recurrence.

**Spawn when:**
- Production outages exceeding 30 minutes
- Data loss incidents
- Critical bugs caught before release
- Repeated systemic failures

**Produces:**
- Root cause analysis without euphemism
- Technical details (error logs, code references, metrics)
- Decision documentation + rejected alternatives
- Emotional context + team impact
- Actionable next steps với ownership

**Tools:** Incident log analysis, timeline reconstruction, code review, metrics extraction

**DON'T use:**
- Minor bugs
- Successfully resolved issues requiring no systemic change
- Incidents without learning value

**URL:** https://docs.claudekit.cc/docs/engineer/agents/journal-writer

---

## Agent vs Skill Decision Matrix

| Need | Use |
|------|-----|
| Reusable workflow | Skill |
| Specialized role/expert | Agent |
| Multi-step process | Skill |
| Parallel work in own context | Agent (spawned via Task tool) |
| Save outputs to file structure | Skill |
| One-shot focused analysis | Agent |

**Agents thường được skills spawn:**
- `ck:cook` spawns: tester, code-reviewer, journal-writer
- `ck:fix` spawns: debugger, code-reviewer
- `ck:plan` spawns: planner, researcher, brainstormer
- `ck:team` spawns: multiple agents trong parallel sessions
