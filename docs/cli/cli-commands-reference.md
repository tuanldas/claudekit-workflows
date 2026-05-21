# ClaudeKit CLI Commands

The `ck` CLI tool cho ClaudeKit installation, configuration, và maintenance.

**Docs:** https://docs.claudekit.cc/docs/cli

---

## ck new

**Purpose:** Create new project với ClaudeKit setup.

**USE when:** Starting fresh project và want ClaudeKit pre-configured

**URL:** https://docs.claudekit.cc/docs/cli/new

---

## ck init

**Purpose:** Initialize ClaudeKit trong existing project.

**USE when:**
- Adding ClaudeKit to existing project
- Setting up engineer hoặc marketing kit
- Configuring CLAUDE.md cho project

**URL:** https://docs.claudekit.cc/docs/cli/init

---

## ck update

**Purpose:** Update ClaudeKit to latest version.

**USE when:**
- New ClaudeKit version released
- Want latest skills/agents

**URL:** https://docs.claudekit.cc/docs/cli/update

---

## ck uninstall

**Purpose:** Remove ClaudeKit từ project hoặc system.

**USE when:** Removing ClaudeKit completely

**URL:** https://docs.claudekit.cc/docs/cli/uninstall

---

## ck doctor

**Purpose:** Diagnose ClaudeKit installation issues.

**USE when:**
- Skills không working
- Commands not recognized
- Environment issues

**URL:** https://docs.claudekit.cc/docs/cli/doctor

---

## ck versions

**Purpose:** List ClaudeKit versions installed/available.

**USE when:**
- Checking installed version
- Comparing với latest
- Rollback planning

**URL:** https://docs.claudekit.cc/docs/cli/versions

---

## ck migrate

**Purpose:** Migrate ClaudeKit configurations between versions.

**USE when:**
- Major version upgrades
- Breaking changes between versions

**URL:** https://docs.claudekit.cc/docs/cli/migrate

---

## CCS (ClaudeKit Command Shell)

**Purpose:** Interactive shell cho ClaudeKit commands.

**URL:** https://docs.claudekit.cc/docs/tools/ccs

---

## Configuration

**Files:**
- `~/.claude/CLAUDE.md` - Global Claude Code instructions
- `~/.claude/.ck.json` - ClaudeKit config (codingLevel, gemini.model, etc.)
- `~/.claude/.mcp.json` - MCP server configuration
- `~/.claude/secrets/` - API credentials (GSC, Stripe, etc.)
- `~/.claude/skills/` - Skills directory
- `~/.claude/rules/` - Workflow rules
- `~/.claude/teams/` - Team configurations (when using ck:team)

**Project-level:**
- `./CLAUDE.md` - Project-specific instructions
- `./docs/` - Project documentation
- `./plans/` - Plans directory (from ck:plan, ck:cook)
- `./assets/` - Marketing assets (from ckm:* skills)

**Docs:** https://docs.claudekit.cc/docs/cli/configuration

---

## Common Operations

### Installation
```bash
# Install ClaudeKit globally
npm install -g claudekit

# Or use npx
npx claudekit init
```

### Setup new project
```bash
ck new my-project
cd my-project
ck doctor  # Verify setup
```

### Add to existing project
```bash
cd existing-project
ck init   # Adds CLAUDE.md + skills
```

### Update everything
```bash
ck update            # Update ClaudeKit
npx skills update    # Update all installed skills
```

### Troubleshoot
```bash
ck doctor            # Run diagnostics
ck versions          # Check installed version
```

---

**Official docs:** https://docs.claudekit.cc/docs/cli
