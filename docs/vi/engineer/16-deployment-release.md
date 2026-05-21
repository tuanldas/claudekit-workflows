# Engineer — Deployment, Release & Documentation Tools

Skills cho landing PRs, post-deploy monitoring, doc release, PDF generation.

---

## land-and-deploy

**Purpose:** Land + deploy workflow. Merges PR, waits cho CI và deploy, verifies production health via canary checks. Takes over sau `/ck:ship` creates PR.

**USE when:**
- "Merge", "land", "deploy"
- "Merge and verify"
- "Land it", "ship it to production"

**Workflow:**
1. Merge PR
2. Wait cho CI completion
3. Wait cho deploy completion
4. Verify production health (canary)

**Pair với:** `setup-deploy` (one-time config)

---

## setup-deploy

**Purpose:** Configure deployment settings cho `land-and-deploy`. Detects deploy platform (Fly.io, Render, Vercel, Netlify, Heroku, GitHub Actions, custom), production URL, health check endpoints.

**USE when:**
- "Setup deploy", "configure deployment"
- "Set up land-and-deploy"
- "How do I deploy with gstack"
- "Add deploy config"

**Writes config to:** CLAUDE.md (cho automatic future deploys)

---

## landing-report

**Purpose:** Read-only queue dashboard cho workspace-aware ship. Shows VERSION slots currently claimed by open PRs, sibling Conductor workspaces có WIP work, what slot `/ship` would pick next.

**USE when:**
- "Landing report"
- "What's in the queue"
- "Show me open PRs"
- "Which version do I claim next"

**Behavior:** No mutations — just snapshot

---

## review

**Purpose:** Pre-landing PR review. Analyzes diff against base branch cho SQL safety, LLM trust boundary violations, conditional side effects, structural issues.

**USE when:**
- "Review this PR", "code review"
- "Pre-landing review", "check my diff"

**Proactively suggest:** User about to merge hoặc land code changes

**Difference from:**
- `review` = pre-landing structural review
- `ck:code-review` = comprehensive adversarial review

---

## document-release

**Purpose:** Post-ship documentation update. Reads all project docs, cross-references diff, builds Diataxis coverage map (reference/how-to/tutorial/explanation), updates README/ARCHITECTURE/CONTRIBUTING/CLAUDE.md.

**USE when:**
- "Update the docs"
- "Sync documentation"
- "Post-ship docs"

**Capabilities:**
- Cross-references diff với existing docs
- Diataxis coverage map
- Updates README/ARCHITECTURE/CONTRIBUTING/CLAUDE.md
- Detects architecture diagram drift
- Polishes CHANGELOG voice với sell-test rubric
- Cleans up TODOs
- Optionally bumps VERSION
- Surfaces doc debt trong PR body

**Proactively suggest:** After shipping a feature

---

## document-generate

**Purpose:** Generate missing documentation từ scratch cho feature, module, hoặc entire project. Uses Diataxis framework.

**USE when:**
- "Write docs", "generate documentation"
- "Document this feature"
- "Create a tutorial"
- "Explain this module"

**Modes (Diataxis):**
- Tutorial
- How-to
- Reference
- Explanation

**Can be invoked:**
- Standalone
- Called by `document-release` when it finds coverage gaps

---

## retro

**Purpose:** Generate data-driven sprint retrospectives từ git history.

**USE when:**
- Sprint reviews
- Commit analysis
- Code-health indicators
- Team-velocity reporting
- Quarterly engineering reviews

**Works on:** Solo hoặc team repos

---

## make-pdf

**Purpose:** Turn markdown file into publication-quality PDF. Proper 1in margins, intelligent page breaks, page numbers, cover pages, running headers, curly quotes + em dashes, clickable TOC, diagonal DRAFT watermark.

**USE when:**
- "Make a PDF", "export to PDF"
- "Turn this markdown into a PDF"
- "Generate a document"

**Voice triggers:** "make this a pdf", "export to pdf"

**Note:** Not draft artifact — finished artifact

---

## Quick Selection Matrix

```
Stage → Skill:
- PR ready to land             → land-and-deploy
- One-time deploy config       → setup-deploy
- Check queue status           → landing-report
- Pre-landing diff check       → review
- Post-ship doc update         → document-release
- Generate missing docs        → document-generate
- Sprint retrospective         → retro
- Export markdown → PDF        → make-pdf
```

---

## Full Release Workflow

```
1. ck:cook              ← implement feature
2. ck:test              ← verify tests pass
3. ck:code-review       ← review trước ship
4. ck:ship              ← create PR
5. review               ← pre-landing diff check
6. land-and-deploy      ← merge + CI + deploy
7. canary               ← monitor production (covered in 14)
8. document-release     ← sync docs post-ship
9. retro                ← (end of sprint)
```

---

## Documentation Pipeline

```
1. document-generate    ← fill missing docs
2. ck:docs update       ← refresh existing
3. document-release     ← post-ship sync
4. ck:llms              ← generate llms.txt cho AI
5. make-pdf             ← export deliverables
```
