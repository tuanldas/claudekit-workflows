# Engineer — AI/LLM & MCP Skills

Skills cho context engineering, agent building (Google ADK), MCP integration.

---

## ck:context-engineering

**Purpose:** Monitor context usage, optimize token consumption, design agent systems, implement memory strategies.

**USE when:**
- Context budget constraints
- Agent architecture design
- Multi-agent coordination
- Memory systems

**DON'T use when:**
- Single simple tasks

**Metrics:**
- Token utilization: 70% warning, 80% action
- Multi-agent cost: ~15x single agent
- Compaction target: 50-70% reduction

**Four-Bucket Strategy:**
1. **Write** (external scratchpads)
2. **Select** (retrieval/filtering)
3. **Compress** (summarization)
4. **Isolate** (sub-agents)

**Hard gates:** Understanding context window limits; awareness của U-shaped attention curve

**Pitfalls:**
- Exhaustive context over curated
- Critical info in middle positions
- Single agent for parallel tasks
- No compaction triggers

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/context-engineering

---

## ck:google-adk-python

**Purpose:** Build production AI agents với tool integration, multi-agent coordination, workflow automation qua code-first framework.

**USE when:**
- Building single/multi-agent systems
- Tool integration
- Workflow pipelines
- Vertex AI deployment

**DON'T use when:**
- Simple Claude API calls (native SDK sufficient)

**Agent types:**
- `LlmAgent` (dynamic)
- `SequentialAgent`
- `ParallelAgent`
- `LoopAgent`

**CLI:** `adk web`, `adk run`, `adk api_server`, `adk eval`

**Modes:** Code-first definition; Production App pattern với plugins

**Hard gates:**
- Agent convention: `root_agent` hoặc `app` variable trong agent.py
- Full type hints
- Pydantic validation

**Pitfalls:** Missing type hints; không using App pattern for production; state management complexity

**Difference from:**
- `google-adk-python` = multi-agent orchestration
- Khác Claude API (single agent)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/google-adk-python

---

## ck:mcp-builder

**Purpose:** Build MCP servers enabling LLMs to interact với external APIs và services qua model-friendly tool interfaces.

**USE when:**
- Creating integrations với external services
- Exposing APIs to AI agents
- Building workflow tools
- Designing agent-accessible integrations

**DON'T use when:**
- Cần quick script wrapper without proper tool design
- Don't have time for evaluation testing

**4 Phases:**
1. Research API + study MCP protocol
2. Implement tools trong Python/TypeScript
3. Review & refine code quality
4. Create 10 evaluations

**Modes:** Python (FastMCP + Pydantic) hoặc TypeScript (SDK + Zod)

**Outputs:** MCP server code + evaluation XML

**Hard gates:**
- Must follow agent-centric design (workflows not endpoints)
- Optimize for context limits
- Provide actionable error messages

**Pitfalls:**
- Simple endpoint wrapping instead of workflow thinking
- Data dumps instead of filtered outputs
- Missing evaluations before shipping

**Difference from:**
- `mcp-builder` = building servers
- Khác `mcp-management` (discovery/execution)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/mcp-builder

---

## ck:mcp-management

**Purpose:** Discover, analyze, và execute Model Context Protocol tools without polluting main context.

**USE when:**
- Need to list available MCP tools
- Select tools cho specific tasks
- Execute MCP calls programmatically
- Manage multiple MCP servers

**DON'T use when:**
- You already know exactly which tool to call → `use-mcp`

**Subcommands:**
- `list-tools` (save to `assets/tools.json`)
- `list-prompts`
- `list-resources`
- `call-tool <server> <tool> <json>`

**Modes:** Gemini CLI (primary auto-execution); direct scripts (secondary); mcp-manager subagent (fallback)

**Inputs/Outputs:** Task description → intelligently selected tools → JSON results

**Hard gates:**
- Config at `~/.claude/.mcp.json`
- `GEMINI.md` in project root cho structured responses

**Pitfalls:**
- Using `-p` flag (deprecated, skips MCP init)
- Không enforcing JSON-only responses
- Polluting main context

**Difference from:**
- `mcp-management` = manage servers
- Khác `mcp-builder` (build), `use-mcp` (direct execution)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/mcp-management

---

## ck:use-mcp

**Purpose:** Discover và execute MCP server tools qua Gemini CLI (LLM-driven, all tasks) hoặc direct scripts (deterministic, specific tool).

**USE when:**
- MCP integration needed
- Tool execution
- Capability discovery
- Two execution paths available

**DON'T use when:**
- Non-MCP tasks → `research`

**Two paths:**
- **Path 1**: Gemini CLI (default, stdin piping mandatory)
- **Path 2**: Direct Scripts
  - `npx tsx cli.ts list-tools` - Snapshot all tools
  - `npx tsx cli.ts call-tool <server> <tool> '<json>'` - Specific invocation

**Modes:** Gemini auto-execution (LLM picks tool) / Deterministic scripting (you specify tool) / LLM-driven catalog selection

**Hard gates:**
- MCP servers configured trong `~/.claude/.mcp.json`
- Gemini CLI hoặc direct SDK required
- Stdin piping mandatory cho Gemini (avoid `--prompt` flag)

**Pitfalls:**
- Using `--prompt` flag với Gemini (use stdin piping)
- Mixing two execution paths
- Forgetting GEMINI.md contract

**Difference from:**
- `use-mcp` = execute existing servers
- Khác `mcp-builder` (builds new)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/use-mcp

---

## ck:agentize

**Purpose:** Convert codebase hoặc feature thành CLI và/hoặc MCP server với credential resolution, docs, tests, CI, companion Claude skill.

**USE when:**
- Exposing existing code as reusable tool
- Want CLI + agent access

**DON'T use when:**
- Building server from scratch → `mcp-builder`
- Simple npm publish only

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--both` | (default) CLI + MCP monorepo với shared core |
| `--mcp` | MCP server only |
| `--cli` | CLI only |
| `--auto` | (default) Fully autonomous, no questions |
| `--ask` | Clarify với user trước implementation |

**Modes:** Output (`--both`/`--mcp`/`--cli`); Interaction (`--auto`/`--ask`)

**Outputs:**
- Monorepo (hoặc single package) với:
  - `packages/core/` — reusable logic
  - `packages/cli/` — CLI adapter
  - `packages/mcp/` — MCP server
- `docs/cli.md`, `docs/mcp.md`, `docs/architecture.md`
- `.github/workflows/ci.yml`, `release.yml`
- Claude skill at `claude/skills/<tool-name>/`

**Hard gates:**
- Phase 0: `project-management` must create plan trước touching code
- Phase 1: `scout` must run trước design (no invented behavior)
- Phase 3: Mode/capabilities must be decided trước scaffolding
- Phase 6: Tests ≥80% coverage, CI green, security pass required
- Non-root container user, healthcheck trong Docker, semver publishing

**Pitfalls:**
- Skipping scout (invented API surface)
- Wrapping every function (choose 5-15 high-value operations)
- Forgetting credential resolution (breaks usage)
- Missing error messages for agents
- Không publishing companion skill (loses discoverability)

**Difference from:**
- `agentize` = wraps existing code
- Khác `mcp-builder` (build from scratch), `skill-creator` (skills for existing tools)
