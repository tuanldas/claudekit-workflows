# Engineer — Plan Review Skills

Skills review plan trước implementation. Có 4 lens chính (CEO/Design/Eng/DevEx) + autoplan + plan-tune.

---

## plan-ceo-review

**Purpose:** CEO/founder-mode plan review, rethink problem, challenge premises, expand/constrain scope theo mode.

**USE when:**
- Questioning plan ambition
- Explore if scope expand
- Founder-level thinking needed
- Evaluate tradeoffs

**DON'T use when:**
- Scope đã lock → dùng `plan-eng-review`
- Execute known plan
- Quick bug fixes

**4 Modes (BẮT BUỘC chọn 1 qua AskUserQuestion):**

| Mode | Mục đích | Output |
|------|---------|--------|
| **SCOPE EXPANSION** | Dream big. Tìm 10x version + platonic ideal, identify delight, asks user opt-in từng expansion individually | Expanded vision + CEO plan file |
| **SELECTIVE EXPANSION** | Hold core scope, cherry-pick adjacent expansions. Complexity check, MVP path, 5-8 expansion candidates cho user decisions | Curated expansions với user choices |
| **HOLD SCOPE** | Rigorous. Scope fixed. Bulletproof execution — catch failure modes, edge cases, observability, error paths. No silent reductions/expansions | Rigorous plan với failure modes |
| **SCOPE REDUCTION** | Ruthless cut. Minimum that ships value, separate "must ship together" từ "nice to ship together", defer rest | Minimal plan với deferred list |

**Critical rule:** Mọi scope change cần explicit opt-in qua AskUserQuestion. KHÔNG silently drift.

**Outputs:** Updated plan tại `~/.gstack/projects/$SLUG/ceo-plans/{date}-{feature-slug}.md`; includes Vision, 10x Check, Platonic Ideal (EXPANSION), Scope Decisions table, Accepted/Deferred/Skipped

**Hard gates:**
- Phải run 0A-0F (premise challenge, leverage mapping, dream state, alternatives, temporal interrogation, mode selection) trước review
- User approval cần qua implementation approach (0C-bis)
- Mode selection = MANDATORY AskUserQuestion

**Pitfalls:**
- Silent scope drift
- Chạy cả 4 modes (chỉ pick 1)
- Skip Step 0
- Treat EXPANSION & REDUCTION như equivalent in rigor

**Difference from similar:**
- plan-ceo-review = "WHAT should we build?"
- Khác `plan-eng-review` (HOW build), `plan-design-review` (UX/visual)

---

## plan-design-review

**Purpose:** Interactive designer-eye plan review, rate mỗi design dimension 0-10, explain what makes a 10, improve plan.

**USE when:**
- Review plans có UI/UX components TRƯỚC implementation
- Cần design critique trên interaction patterns, visual hierarchy, onboarding flow

**DON'T use when:**
- Audit live visual code → dùng `design-review`
- Purely engineering architecture
- No UI/visual scope

**Outputs:** Edits plan file với design improvements; có thể tạo design notes; rating scores per dimension

**Hard gates:** Đọc plan complete; chạy 7-10 design dimensions; AskUserQuestion cho major design changes

**Difference from similar:**
- Khác `plan-ceo-review` (scope), `plan-eng-review` (architecture), `design-html` (code generation)
- plan-design-review critiques *plan* — design decisions documented BEFORE code

---

## plan-eng-review

**Purpose:** Eng manager-mode plan review, lock in architecture + data flow + test coverage + edge cases TRƯỚC implementation.

**USE when:**
- Sắp code, có technical plan cần architecture validation
- Cần edge case discovery
- Lock test strategy trước viết code

**DON'T use when:**
- Plan purely conceptual
- Đã start implementation

**Outputs:** Updated plan với architecture diagrams, data flow, edge case map, test strategy, performance model

**Hard gates:** Đọc all code referenced; dual-voice (Claude + Codex) adversarial review cho high-risk; AskUserQuestion cho major architectural shifts

**Difference from similar:**
- Khác `plan-ceo-review` (scope/vision), `plan-design-review` (UX)
- plan-eng-review = pure technical — architecture, data models, test coverage, failure modes

---

## plan-devex-review

**Purpose:** Interactive DX plan review, trace developer journey, score 7 DX characteristics (Usable, Credible, Findable, Useful, Valuable, Accessible, Desirable).

**USE when:**
- Building/reviewing developer-facing products (APIs, CLIs, SDKs, libraries, platforms)
- DX audit trước launch
- Improve onboarding

**DON'T use when:**
- Consumer app (no dev audience)
- Product đã ship live → dùng `design-review`

**3 Modes (auto-detected, có thể override):**

| Mode | Khi nào | Output |
|------|---------|--------|
| **DX EXPANSION** | Competitive advantage. New products | Toàn bộ developer journey + benchmark competitors + magical moments + expand 7 touchpoints |
| **DX POLISH** | Plan scope đúng, refine all DX flows. Enhancements | Bulletproof mọi touchpoint, close gaps trong 7 characteristics |
| **DX TRIAGE** | Critical gaps only. Urgent ships | Focus Install + Hello World stages, flag scores <5 blocking adoption |

**Outputs:** Updated plan với developer journey traced, error handling mapped, upgrade path, 7-characteristic scores, fixes applied

**Hard gates:**
- Auto-detect product type + offer mode selection
- Trace full journey (Discover → Evaluate → Install → Hello World → Integrate → Debug → Upgrade → Scale → Migrate)
- Score 0-10 mỗi stage

**Pitfalls:** Chọn EXPANSION cho bug fix; miss error message quality; không test actual developer onboarding time

**Difference from similar:**
- Khác `plan-design-review` (visual UX), `plan-eng-review` (architecture)
- plan-devex-review = developer-specific: TTHW (time to hello world), migration safety, upgrade friction, escape hatches

---

## autoplan

**Purpose:** Auto-review pipeline đọc CEO + design + eng + DX skill files, chạy sequential với auto-decisions, surface taste decisions ở final gate.

**USE when:**
- Có rough plan, muốn full 4-lens review (scope, design, architecture, DX)
- Không muốn trả lời 15-30 intermediate questions

**DON'T use when:**
- Muốn hand-craft specific decisions
- Cần deep dialogue 1 dimension
- Plan incomplete

**Pipeline order (FIXED):**
1. **Phase 0 (all skills)**: Detect base branch, load context, preamble
2. **Phase 1 — CEO Review**: Mode auto-select. Scope expansions auto-approve nếu <1 day effort + trong blast radius. Taste decisions surface
3. **Phase 2 — Design Review**: Dimension scores auto-improve nếu fix <2 hour. Major pattern shifts surface
4. **Phase 3 — Eng Review**: Architecture auto-improve. Edge cases auto-map. Test strategy auto-fill. Risky changes surface
5. **Phase 4 — DX Review**: DX mode auto-select. Touchpoint gaps auto-fix nếu <1 day. Journey score auto-improve
6. **Taste Gate**: Tất cả surfaced decisions presented qua final AskUserQuestion

**6 Decision Principles (auto-apply):**
1. **Completeness**: Pick approach covering more edge cases
2. **Boil Lakes**: Fix everything trong blast radius (<1 day effort)
3. **Pragmatic**: Two options fix same → pick cleaner
4. **DRY**: Reuse existing, reject duplicates
5. **Explicit > Clever**: 10-line obvious > 200-line abstraction
6. **Bias toward action**: Flag concerns, don't block

**Hard gates:**
- KHÔNG invoke trong plan mode
- Final AskUserQuestion batch tất cả taste decisions

**Pitfalls:**
- Run trên incomplete plan
- Không đọc final taste gate (auto-approve without understanding)
- Expect autoplan produce hand-crafted taste

**Difference from similar:**
- Khác individual `plan-*-review` (1 dimension each)
- autoplan orchestrates 4 sequential với auto-decisions, trade interactivity lấy speed

---

## plan-tune

**Purpose:** Self-tuning question sensitivity + developer psychographic for gstack (observational v1).

**USE when:**
- Tuning which gstack questions you see
- Inspecting your developer profile
- Setting preferences

**DON'T use when:**
- You don't use gstack
- Prefer every question asked

**Subcommands:**
| Command | Action |
|---------|--------|
| `enable` / `disable` | Turn tuning on/off |
| `profile` | Show developer profile |
| `vibe` / `gap` | Analyze preference signals |
| `stats` / `review` | Review tuning history |

Free-form support: "show my profile", "stop asking about X", `tune: never-ask`

**Modes:** First-time setup (5 dimension questions); Preferences (never-ask / always-ask / ask-only-for-one-way)

**Hard gates:**
- One-way doors always override never-ask for safety
- User-origin gate (only inline `tune:` from user chat)

**Pitfalls:** Misinterpreting inferred vs declared profile; không confirming trước mutation

**Difference from similar:**
- Question tuning vs other gstack skills
- Global management vs inline tuning
