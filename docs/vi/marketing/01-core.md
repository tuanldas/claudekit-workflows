# Marketing — Core Skills

Core skills cho project setup, dashboard management, claude-code integration.

---

## ckm:init

**Purpose:** Initialize marketing projects qua structured interview, gathering client info, generating foundational documentation.

**USE when:**
- Starting new marketing projects
- Creating project documentation
- Setting up project structure

**Phases:**
1. Git setup
2. Quick evaluation
3. Marketing brief interview
4. Documentation generation
5. Git commit
6. Next steps

**Inputs/Outputs:** Client/product information → CLAUDE.md, README.md, PDR, marketing overview, roadmap documents

**Hard gates:** Complete all interview sections; verify existing docs before proceeding

**Pitfalls:** Skipping research phase; không validating assumptions với existing docs

**Docs:** https://docs.claudekit.cc/docs/marketing/skills/init

---

## ckm:hub

**Purpose:** Launches both Content Hub + Marketing Dashboard cho centralized campaign/content management.

**USE when:**
- Viewing all marketing assets
- Managing campaigns visually
- Editing content trong 1 place
- Accessing marketing dashboard

**DON'T use when:**
- Creating new content (use individual skills)

**Commands:**
- `/hub` - Start all services
- `/hub --scan` - Rescan assets folder
- `/hub --stop` - Stop servers

**Services started:**
- Content Hub: `http://localhost:3457/hub` (asset gallery + AI editor)
- Dashboard UI: `http://localhost:5173` (Vue frontend)
- Dashboard API: `http://localhost:3457/api/` (REST backend)

**Hard gates:** Node.js running; ports 3457 and 5173 available

**Pitfalls:** Không scanning after new assets; closing without proper shutdown; forgetting save edits

**Difference from:**
- `hub` = convenience launcher
- `dashboard` = just the app

---

## ckm:dashboard

**Purpose:** Launch và manage Marketing Dashboard web application cho campaign management, content library, asset organization, automation recipes.

**USE when:**
- Viewing campaign status
- Managing content library
- Organizing assets
- Running automation recipes
- Tracking campaign progress

**DON'T use when:**
- Creating new content (use specific skill)
- Only need reports → `analytics`

**Subcommands/Modes:**
| Command | Action |
|---------|--------|
| `dev` (default) | Development mode với HMR (hot reload) |
| `prod` | Production mode (requires build first) |
| `build` | Build for production |
| `stop` | Stop running servers |
| `check` | Check server status |

**URLs:**
- Development: Frontend `http://localhost:5173`, API `http://localhost:3457`
- Production: Application `http://localhost:3457`

**Dashboard features:**
- Campaign board (Kanban với drag-drop)
- Content library (grid với filters)
- Asset gallery (link to campaigns)
- Automation panel (recipe templates)

**Hard gates:** Node.js 18+; API key (set via Settings page)

**Pitfalls:**
- Forgetting build before prod mode
- Port conflicts
- Data persists trong local SQLite (use for testing)

---

## ckm:marketing-dashboard

**Purpose:** Local-first marketing command center cho managing campaigns, content, assets với Claude Code automation.

**USE when:**
- Tracking marketing campaigns
- Managing content library
- Monitoring KPIs
- Orchestrating marketing workflows

**Modes:** Development mode (Vue frontend + Hono API); Production mode (built frontend + API server)

**Architecture:** Vue 3 + Vite frontend, Hono Node.js backend, SQLite database, Claude Code CLI automation

**Status:** Foundation phase (Phase 1 complete); roadmap includes full CRUD, dashboard features, integrations

---

## ckm:claude-code

**Purpose:** Configuration, setup, troubleshooting Claude Code IDE environment và agent capabilities.

**USE when:**
- Installing Claude Code
- Configuring MCP servers
- Setting up CI/CD workflows
- Troubleshooting auth/performance

**Modes:** VS Code extension; JetBrains plugin; standalone CLI; enterprise deployment

**Hard gates:** Never expose secrets in config; enable sandboxing for untrusted code
