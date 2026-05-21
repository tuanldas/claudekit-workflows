# Engineer — Claude/AI Development Tools

Skills cho build Claude apps, cross-model comparison, AI writing cleanup.

---

## claude-api

**Purpose:** Build, debug, optimize Claude API / Anthropic SDK apps. Apps built với this skill should include prompt caching. Handles migrating existing Claude API code between Claude model versions (4.5 → 4.6 → 4.7).

**USE when:**
- Code imports `anthropic` hoặc `@anthropic-ai/sdk`
- Building/debugging Claude API apps
- Adding/modifying Claude features: caching, thinking, compaction, tool use, batch, files, citations, memory
- Switching models (Opus/Sonnet/Haiku)
- Migrating retired models

**Features covered:**
- Prompt caching (mandatory)
- Extended thinking
- Compaction
- Tool use
- Batch API
- Files API
- Citations
- Memory
- Model migration

---

## claude-code

**Purpose:** Claude Code installation, configuration, troubleshooting.

**USE when:**
- Installing Claude Code (CLI, desktop, IDE)
- Configuring MCP servers
- Setting up hooks/plugins
- IDE integration (VS Code, JetBrains)
- CI/CD workflows
- Enterprise deployment (SSO, RBAC, sandboxing)
- Troubleshooting auth/performance
- Advanced features (extended thinking, caching, checkpointing)

---

## codex

**Purpose:** OpenAI Codex CLI wrapper — 3 modes cho second opinion từ "200 IQ autistic developer".

**3 Modes:**
| Mode | Action |
|------|--------|
| **Code review** | Independent diff review qua `codex review` với pass/fail gate |
| **Challenge** | Adversarial mode that tries to break your code |
| **Consult** | Ask codex anything với session continuity cho follow-ups |

**USE when:** "codex review", "codex challenge", "ask codex", "second opinion", "consult codex"

**Voice triggers:** "code x", "code ex", "get another opinion"

---

## humanizer

**Purpose:** Remove signs of AI-generated writing từ text. Based on Wikipedia's comprehensive "Signs of AI writing" guide.

**USE when:**
- Editing/reviewing text to sound more natural
- Polishing AI-generated content

**Detects và fixes:**
- Inflated symbolism
- Promotional language
- Superficial -ing analyses
- Vague attributions
- Em dash overuse
- Rule of three
- AI vocabulary words
- Passive voice
- Negative parallelisms
- Filler phrases

---

## skillify

**Purpose:** Codify most recent successful `/scrape` flow thành permanent browser-skill on disk.

**USE when:**
- "Skillify", "codify", "save this scrape", "make this permanent"

**Pair với:** `scrape` (covered in 14-qa-browser-testing.md)

**Process:**
1. Walk back through conversation
2. Synthesize `script.ts` + `script.test.ts` + fixture
3. Run test trong temp dir
4. Ask before committing

---

## ai-rules-setup

**Purpose:** Setup AI rules cho cross-tool compatibility.

**USE when:**
- Setting up AI rules cho project
- Cross-tool AI instruction compatibility (Claude Code, Codex, Cursor, etc.)

---

## Quick Selection Matrix

```
Need → Skill:
- Build Claude API app                → claude-api
- Setup Claude Code IDE/MCP/hooks     → claude-code
- Get second opinion từ GPT           → codex
- Make AI text sound human            → humanizer
- Codify scrape flow                  → skillify (use after scrape)
- Cross-tool AI rules setup           → ai-rules-setup
```

---

## Common Workflows

### Workflow: Build Claude App với Optimization
```
1. claude-api          ← scaffolding với prompt caching
2. ck:cook             ← implement features
3. claude-api          ← optimize (caching, batching)
4. benchmark-models    ← compare cost/quality across models
5. ck:ship             ← deploy
```

### Workflow: Get Multiple AI Opinions
```
1. ck:plan             ← Claude proposes plan
2. codex challenge     ← OpenAI tries to break it
3. ck:plan validate    ← Interview validation
4. autoplan            ← Full multi-review
```
