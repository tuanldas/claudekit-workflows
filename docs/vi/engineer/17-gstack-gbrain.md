# Engineer — Gstack, GBrain & External Integrations

Skills thuộc gstack ecosystem + GBrain knowledge graph + external integrations.

---

## gstack (suite overview)

**gstack** = ecosystem of skills built on top of ClaudeKit. Skills with "(gstack)" tag belong to this ecosystem.

**Key gstack skills:**
- `gstack` — Fast headless browser cho QA testing
- `gstack-upgrade` — Upgrade gstack
- `open-gstack-browser` — Launch AI-controlled Chromium
- `careful`, `freeze`, `guard` — Safety guardrails
- `checkpoint`, `context-save`, `context-restore` — State management
- `canary`, `benchmark` — Monitoring
- `health`, `learn` — Code quality + learnings
- `setup-deploy`, `land-and-deploy` — Deployment
- `pair-agent` — Agent pairing
- `setup-browser-cookies` — Browser auth

---

## gstack

**Purpose:** Fast headless browser cho QA testing + site dogfooding.

**Capabilities:**
- Navigate pages
- Interact với elements
- Verify state
- Diff before/after
- Take annotated screenshots
- Test responsive layouts, forms, uploads, dialogs
- Capture bug evidence

**USE when:**
- Test a site
- Verify a deployment
- Dogfood user flow
- File bug với screenshots

---

## gstack-upgrade

**Purpose:** Upgrade gstack to latest version. Detects global vs vendored install, runs upgrade, shows what's new.

**USE when:**
- "Upgrade gstack", "update gstack", "get latest version"

**Voice triggers:** "upgrade the tools", "update the tools", "gee stack upgrade"

---

## open-gstack-browser

**Purpose:** Launch GStack Browser — AI-controlled Chromium với sidebar extension baked in. Opens visible browser window where you can watch every action real time.

**Capabilities:**
- Sidebar shows live activity feed + chat
- Anti-bot stealth built in
- Watch AI actions trong real time

**USE when:**
- "Open gstack browser", "launch browser"
- "Connect chrome", "open chrome"
- "Real browser", "launch chrome"
- "Side panel", "control my browser"

**Voice triggers:** "show me the browser"

---

## setup-browser-cookies

**Purpose:** Import cookies từ real Chromium browser into headless browse session. Opens interactive picker UI cho selecting cookie domains.

**USE when:**
- Before QA testing authenticated pages
- "Import cookies", "login to the site", "authenticate the browser"

---

## pair-agent

**Purpose:** Pair remote AI agent với your browser. One command generates setup key + prints instructions other agent can follow to connect.

**Works với:** OpenClaw, Hermes, Codex, Cursor, any agent that can make HTTP requests

**Scope:** Remote agent gets own tab với scoped access (read+write by default, admin on request)

**USE when:**
- "Pair agent", "connect agent"
- "Share browser", "remote browser"
- "Let another agent use my browser"
- "Give browser access"

**Voice triggers:** Speech-to-text aliases supported

---

## setup-gbrain

**Purpose:** Set up gbrain (local knowledge graph) cho coding agent. Install CLI, initialize local PGLite hoặc Supabase brain, register MCP, capture per-remote trust policy.

**Result:** One command from zero to "gbrain is running, and this agent can call it"

**USE when:**
- "Setup gbrain", "connect gbrain"
- "Start gbrain", "install gbrain"
- "Configure gbrain for this machine"

---

## sync-gbrain

**Purpose:** Keep gbrain current với this repo's code và refresh agent search guidance trong CLAUDE.md. Wraps gstack-gbrain-sync orchestrator với state probing, native code-surface registration, capability checks, verdict block.

**Re-runnable:** Idempotent

**USE when:**
- "Sync gbrain", "refresh gbrain"
- "Re-index this repo"
- "Gbrain search isn't finding things"

---

## ai-rules-setup

**Purpose:** AI Rules Setup cho cross-tool AI instruction compatibility.

**USE when:**
- Setting up AI rules cho project
- Cross-tool compatibility (Claude Code, Codex, Cursor)

---

## learn

**Purpose:** Manage project learnings. Review, search, prune, export what gstack has learned across sessions.

**USE when:**
- "What have we learned"
- "Show learnings"
- "Prune stale learnings"
- "Export learnings"

**Proactively suggest:** User asks về past patterns hoặc wonders "didn't we fix this before?"

---

## health

**Purpose:** Code quality dashboard. Wraps existing project tools (type checker, linter, test runner, dead code detector, shell linter), computes weighted composite 0-10 score, tracks trends over time.

**USE when:**
- "Health check", "code quality"
- "How healthy is the codebase"
- "Run all checks", "quality score"

---

## devex-review

**Purpose:** Live developer experience audit. Uses browse tool to actually TEST the developer experience.

**Capabilities:**
- Navigate docs
- Try getting started flow
- Time TTHW (Time To Hello World)
- Screenshot error messages
- Evaluate CLI help text
- Produce DX scorecard với evidence
- Compare against `/plan-devex-review` scores (the boomerang: plan said 3 min, reality says 8)

**USE when:**
- "Test the DX", "DX audit"
- "Developer experience test"
- "Try the onboarding"

**Proactively suggest:** After shipping developer-facing feature

---

## office-hours

**Purpose:** YC Office Hours — 2 modes cho founders/builders.

**2 Modes:**

**Startup mode:** 6 forcing questions exposing:
- Demand reality
- Status quo
- Desperate specificity
- Narrowest wedge
- Observation
- Future-fit

**Builder mode:** Design thinking brainstorming cho:
- Side projects
- Hackathons
- Learning
- Open source

**Output:** Saves design doc

**USE when:**
- "Brainstorm this"
- "I have an idea"
- "Help me think through this"
- "Office hours"
- "Is this worth building"

**Proactively invoke (do NOT answer directly):** When user describes new idea

---

## brand-namer

**Purpose:** Name products, projects, brands với domain verification và conflict detection.

**USE when:**
- "Project name", "brand name", "domain name"
- "What should I call"
- "Name ideas", "naming"
- Need help choosing between options

---

## cso

**Purpose:** Chief Security Officer mode. Infrastructure-first security audit beyond OWASP/STRIDE.

**Covers:**
- Secrets archaeology
- Dependency supply chain
- CI/CD pipeline security
- LLM/AI security
- Skill supply chain scanning
- OWASP Top 10
- STRIDE threat modeling
- Active verification

**2 Modes:**
- **Daily**: Zero-noise, 8/10 confidence gate
- **Comprehensive**: Monthly deep scan, 2/10 bar

**Features:** Trend tracking across audit runs

**USE when:**
- "Security audit", "threat model"
- "Pentest review", "OWASP", "CSO review"

**Voice triggers:** Supported

---

## cti-expert

**Purpose:** Analyze cyber threat intelligence và OSINT cases.

**USE when:**
- Exposure reviews
- Domain recon
- Breach checks
- Username/email/phone research
- Image forensics
- Blockchain tracing
- Darknet checks
- Cloud tenant recon
- Vulnerability lookup
- Threat modeling
- Structured reports

---

## Quick Selection Matrix

```
Need → Skill:
- Setup gstack ecosystem            → setup-gbrain + setup-deploy
- Upgrade gstack                    → gstack-upgrade
- AI-controlled browser visible     → open-gstack-browser
- QA testing site                   → gstack hoặc browse
- Login to authenticated site       → setup-browser-cookies first
- Connect external agent            → pair-agent
- Knowledge graph cho codebase      → setup-gbrain + sync-gbrain
- Cross-tool AI rules               → ai-rules-setup
- Review project learnings          → learn
- Code health dashboard             → health
- Test live DX                      → devex-review
- Brainstorm new idea (YC-style)    → office-hours
- Name product/brand                → brand-namer
- Security audit (infrastructure)   → cso
- OSINT / threat intel              → cti-expert
```
