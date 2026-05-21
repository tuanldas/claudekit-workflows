# Engineer — Coordination, Utilities & Specialized Skills

Skills cho team work, git, journals, project management, plus specialized utilities.

---

## ck:team

**Purpose:** Orchestrate multiple independent Claude Code sessions (teammates) cho parallel multi-session workflows.

**USE when:**
- 3+ parallel independent workstreams
- Cross-layer (FE + BE + tests)
- Workers need discuss findings

**DON'T use when:**
- Single sequential task (use subagents via Agent tool)
- Tight token budget
- Focused one-person work

**Templates & flags:**
| Template | Flags |
|----------|-------|
| `ck:team research <topic>` | `--researchers N` (default 3); parallel researchers, synthesize report |
| `ck:team cook <plan>` | `--devs N`, `--plan-approval`, `--delegate`, `--worktree`; devs code worktrees, tester, lead merge |
| `ck:team review <scope>` | `--reviewers N` (default 3); focus security/performance/coverage, dedupe |
| `ck:team debug <issue>` | `--debuggers N` (default 3); test competing hypotheses, converge root cause |

**Hard gates:**
- **MUST run on CLI terminal** (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` trong settings.json, NOT VSCode extension)
- All teammates run Opus 4.6
- `TeamCreate` MUST succeed trước spawn (abort nếu tool unrecognized)
- CK Context Block trong mọi teammate spawn
- Teammates refer by NAME, never agent ID
- Messaging qua SendMessage
- Task ownership qua TaskUpdate (Claim → Complete → next)

**Pitfalls:**
- Run trong VSCode extension (isTTY check fails)
- Forget CK Context Block
- Planning without approval gate
- Không wait TaskCompleted events
- Merge branches wrong order

**Difference from:**
- `ck:team` = multi-session với messaging + task list
- Khác Agent tool (spawn single background subagent)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/team

---

## ck:worktree

**Purpose:** Create/inspect/manage isolated git worktrees cho parallel feature development, monorepo workflows, stale cleanup.

**USE when:**
- Parallel feature work
- Monorepo projects
- Isolating changes per developer

**DON'T use when:**
- Simple single-branch work

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
| `--no-prefix` | Skip prefix, exact branch name (cho Jira keys) |
| `--base <branch>` | Override auto-detected base |
| `--checkout-submodules` | Init submodules sau checkout |
| `--json` | JSON output |
| `--dry-run` | Preview |

**Auto-detected base:** dev → develop → main → master

**Outputs:** Isolated worktree `../<worktree-root>/<branch-name>/`; auto-install deps (bun/pnpm/yarn/npm/pip/cargo); `.env.example` → `.env`

**Pitfalls:**
- Không dùng `--no-prefix` cho Jira keys
- Forget submodules
- Wrong base branch
- Stale metadata (use `prune --dry-run` first)

**Difference from:**
- `worktree` = isolated dev branches
- Khác git branch (no isolation), `team` (uses worktrees automatically)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/worktree

---

## ck:git

**Purpose:** Git operations với conventional commits — staging, committing, pushing, PRs, merges; auto-splits by type/scope; security scans.

**USE when:**
- Commits, PRs
- Branch management
- Release git steps

**DON'T use when:**
- Code changes (git operations only)

**Operations:**
- `cm` - Stage + commit
- `cp` - Stage, commit, push
- `pr` - Create PR
- `merge` - Merge branches

**Splits on:** Different types (feat + fix), scopes (auth + payments), configs + code, FILES > 10

**Hard gates:**
- Git repo initialized
- No secrets in staging (scans cho api_key, token, password, credential)
- Branch protection awareness

**Pitfalls:** Committing secrets (scanned but user must fix); pushing before review; merge conflicts without resolution

**Difference from:**
- `ck:git` = enforces standards, conventional commits, security scans
- Khác Bash git commands

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/git

---

## ck:journal

**Purpose:** Write concise technical journal entries phân tích recent changes, decisions, impacts post-implementation.

**USE when:**
- Sau shipping features
- Implementing major changes
- Debugging complex issues

**DON'T use when:**
- Trivial changes
- Before implementation → `predict`
- Mid-session

**Outputs:** Journals tại `./docs/journals/<date>-<topic>.md`

**Hard gates:**
- Must run sau implementation (not before)
- Entries saved to `./docs/journals/`
- Use `ck:project-organization` to organize outputs

**Pitfalls:** Writing vague entries; too long (keep concise, impact-focused); missing context

---

## ck:project-management

**Purpose:** Synchronize ephemeral Claude Tasks với persistent plan files cho cross-session continuity.

**USE when:**
- Multi-session projects
- Tracking phase progress
- Coordinating documentation updates
- Bridging work across conversations

**DON'T use when:**
- Single-session work (use native Tasks only)

**Operations:**
- `hydrate` (load plan items as tasks)
- `track` (monitor state)
- `sync` (write back completions)
- `report` (generate status)

**Inputs/Outputs:** Plan files với YAML frontmatter → TaskCreate/TaskUpdate → sync back to checked `[x]` items

**Hard gates:**
- MANDATORY sync-back guard (check ALL phase files, backfill stale items, update YAML status)
- Plan.md MUST have status/priority/effort frontmatter

**Pitfalls:**
- Only marking current phase (missing full sync)
- Breaking acceptance criteria validation
- Ignoring dependencies

**Difference from:**
- `project-management` = tracking + sync
- Khác `plan` (planning), `cook` (execution)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/project-management

---

## ck:plans-kanban

**Purpose:** Visual dashboard cho viewing plan directories với progress tracking và timeline visualization.

**USE when:**
- Viewing multiple plans
- Checking phase status
- Navigating plan documentation
- Quick actions

**DON'T use when:**
- Only need command-line status (use TaskList)

**Flags:**
| Flag | Default |
|------|---------|
| `--dir <path>` | (required) |
| `--port <number>` | 3500 |
| `--host <addr>` | localhost |
| `--open` | Auto-open browser |
| `--background` | Run in background |
| `--stop` | Stop server |

**Modes:** Grid/kanban layouts, timeline view, activity heatmap

**Hard gates:** npm dependencies required (gray-matter); auto-port allocation 3500-3550

**Pitfalls:** Missing npm install; stale PID files in /tmp

**Difference from:**
- `plans-kanban` = kanban view
- Khác `markdown-novel-viewer` (reading)

---

## ck:kanban

**Purpose:** Visualize plan progress với dashboard showing task cards, phase status, timeline, activity heatmaps.

**Flags:**
- `/kanban` - Dashboard for ./docs/plans
- `/kanban [path]` - Specific directory
- `--stop` - Stop server

**Modes:** MVP (current), Worktree Integration (Phase 2), Full Orchestration (Phase 3)

**Hard gates:** Plans directory must exist; Node.js required; port available

**Pitfalls:** Starting multiple servers without stopping previous

---

## ck:watzup

**Purpose:** Summarize session changes — what shipped, what's in flight, what's next — từ git log và branch state.

**USE when:**
- End-of-session handoffs
- Progress tracking
- Teammate context transfers

**DON'T use when:**
- Implementation work
- Code modifications needed

**Hard gates:** Must be trong git repo với commit history

**Pitfalls:** Running before commits; expecting implementation (summary only)

---

## ck:find-skills

**Purpose:** Discover và install skills từ open agent skills ecosystem dùng npx skills.

**USE when:**
- User asks "how do I do X?"
- "Find a skill for X"
- Wants capability extensions

**Subcommands:**
- `npx skills find [query]` - Interactive search
- `npx skills add <package>` - Install skill
- `npx skills check` - Check updates
- `npx skills update` - Update all

**Hard gates:** npm/npx required; internet access cho skills.sh registry

**Pitfalls:** Không checking existing skills first

---

## ck:coding-level

**Purpose:** Calibrate response depth to coding experience level (ELI5 to God Mode) với auto-injected guidelines.

**Levels:**
- 0 = ELI5
- 1 = Junior (0-2y)
- 2 = Mid (3-5y)
- 3 = Senior (5-8y)
- 4 = Tech Lead (8-10y)
- 5 = God Mode (expert, default)

**Inputs/Outputs:** User provides level [0-5]; sets `~/.claude/.ck.json` codingLevel; subsequent sessions auto-inject guidelines

**Hard gates:** Config file must be writable

---

## ck:project-organization

**Purpose:** Organize outputs into consistent directory structure.

**Used by:** Most other skills (auto-invoked)

**Pattern:** kebab-case names; date prefixes; categorized folders

---

## ck:problem-solving, ck:sequential-thinking

→ See `02-thinking-tools.md`

---

## ck:skill-creator

**Purpose:** Transform procedural knowledge thành reusable, distributable AI skills Claude can auto-activate.

**USE when:**
- Encoding API integrations
- Company knowledge
- Reusable workflows
- Framework guides

**DON'T use when:**
- Skill is one-off solution
- Doesn't warrant ongoing maintenance

**Scripts:**
- `init_skill.py`, `package_skill.py`
- `run_eval.py`, `improve_description.py`
- `run_loop.py` (iterative optimization)
- `aggregate_benchmark.py`

**Modes:** Eval-driven iteration (test→grade→compare→optimize); single-pass hoặc 5-15 iteration loops

**Hard gates:**
- SKILL.md <300 lines
- Metadata <1024 chars
- "Pushy" descriptions trigger activation

**Pitfalls:**
- Undertriggering từ vague descriptions
- Weak accuracy scoring
- Security scope violations

**Difference from:**
- `skill-creator` = build new skills
- Khác `template-skill` (just template)

---

## ck:template-skill

**Purpose:** Stub skill cho new skill creation (minimal template).

**USE when:** Starting new skill from scratch
**DON'T use when:** You have existing skill structure

---

## ck:loop

**Purpose:** Chạy command hoặc skill lặp lại theo schedule.

**USE when:** Polling for state, recurring tasks, monitoring

**Docs:** Refer to local SKILL.md

---

## ck:show-off

**Purpose:** Build interactive self-contained HTML showcase cho repos.

**Features:**
- Multi-section layout với parallax
- Theme toggle
- Bilingual (VI/EN)
- Auto-screenshot
- Ratios: 16:9, 9:16, 1:1 (cho social platforms)

---

## ck:copywriting

**Purpose:** High-converting copy formulas, headline templates, email patterns, landing page structures, CTA optimization, style transfer.

**USE when:**
- Headlines, email campaigns
- Landing pages, social posts
- A/B variations
- Applying custom writing styles

**DON'T use when:**
- Non-copywriting (brand guidelines, content marketing separate)

**Formulas:** AIDA, PAS, BAB, 4Ps, 4Us, FAB

**Styles:** 50+ trong `assets/writing-styles/default.md`; extract từ multi-format files (MD, PDF, DOCX, images, video)

**Pitfalls:** Leading với feature not benefit; multiple CTAs per piece; vague claims; ignoring awareness level

---

## ck:cti-expert

**Purpose:** OSINT / Cyber Threat Intelligence investigation.

**USE when:** Security research, threat investigation, OSINT tasks
