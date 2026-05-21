# Engineer — Safety Guardrails & Context Management

Skills bảo vệ khỏi destructive ops + manage session state across branches/sessions.

---

## careful

**Purpose:** Safety guardrails warning trước destructive commands (rm -rf, DROP TABLE, force-push, git reset --hard, kubectl delete).

**USE when:**
- Touching production
- Debugging live systems
- Working trong shared environment

**Triggers:** "be careful", "safety mode", "prod mode", "careful mode"

**Behavior:** User can override each warning. Doesn't block — just confirms.

**Difference from:**
- `careful` = warning-only
- `guard` = full safety (careful + freeze combined)

---

## freeze

**Purpose:** Restrict file edits to specific directory cho session. Blocks Edit/Write outside allowed path.

**USE when:**
- Debugging to prevent accidentally "fixing" unrelated code
- Want to scope changes to one module

**Triggers:** "freeze", "restrict edits", "only edit this folder", "lock down edits"

**Companion:** `unfreeze` (clear boundary)

---

## unfreeze

**Purpose:** Clear freeze boundary, allowing edits to all directories again.

**USE when:** Want to widen edit scope without ending session

**Triggers:** "unfreeze", "unlock edits", "remove freeze"

---

## guard

**Purpose:** Full safety mode — combines `careful` (destructive warnings) + `freeze` (directory-scoped edits).

**USE when:**
- Maximum safety needed
- Touching production
- Debugging live systems

**Triggers:** "guard mode", "full safety", "lock it down"

**Difference from:**
- `guard` = comprehensive (warnings + freeze)
- `careful` = warnings only
- `freeze` = directory restriction only

---

## checkpoint

**Purpose:** Save và resume working state checkpoints. Captures git state, decisions made, remaining work — pick up exactly where left off even across Conductor workspace handoffs.

**USE when:**
- Session ending
- Switching context
- Before long break

**Triggers:** "checkpoint", "save progress", "where was I", "resume", "what was I working on", "pick up where I left off"

**Proactively suggest:** When session ending hoặc switching context

---

## context-save

**Purpose:** Save working context — git state, decisions, remaining work — cho any future session.

**USE when:**
- "Save progress", "save state", "context save", "save my work"

**Pair với:** `context-restore` to resume

**Note:** Formerly `/checkpoint` — renamed because Claude Code treats `/checkpoint` as native rewind alias

---

## context-restore

**Purpose:** Restore working context saved earlier by context-save. Loads most recent saved state (across all branches by default).

**USE when:**
- "Resume", "restore context", "where was I", "pick up where I left off"

**Pair với:** `context-save`

---

## plan-tune

**Purpose:** Self-tuning question sensitivity + developer psychographic profile cho gstack (v1: observational).

**USE when:**
- Tuning which questions you see
- Inspecting developer profile
- Setting preferences

**Subcommands:**
- `enable` / `disable`
- `profile`, `vibe`, `gap`, `stats`, `review`

**Free-form:** "show my profile", "stop asking about X", `tune: never-ask`

**Modes:** First-time setup (5 dimension questions); Preferences (never-ask / always-ask / ask-only-for-one-way)

**Hard gates:**
- One-way doors always override never-ask cho safety
- User-origin gate (only inline `tune:` từ user chat)

---

## Quick Selection Matrix

```
Situation → Skill:
- Touching production code         → guard
- Debugging, không sửa lung tung   → freeze
- Trước rm -rf / git reset --hard  → careful
- End of session, save state       → checkpoint hoặc context-save
- Start new session, load state    → context-restore
- Tune question prompts            → plan-tune
```

---

## Why These Matter cho Workflow Design

Safety skills cần được consider:
1. **Production deployments**: Always pair với `guard`
2. **Long debugging sessions**: Use `freeze` to scope edits
3. **Multi-session features**: `checkpoint`/`context-save` cho handoffs
4. **Conductor workspaces**: `context-restore` để pick up cross-branch

**Anti-patterns:**
- Skip `careful` khi debug production → accidental destruction
- Skip `freeze` khi debug specific module → unintended changes elsewhere
- Skip `checkpoint` khi end session → lose decisions trees
