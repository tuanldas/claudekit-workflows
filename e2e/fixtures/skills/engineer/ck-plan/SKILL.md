---
name: ck-plan
description: Plan implementation work with phased decomposition and review gates
tags:
  - planning
  - core-workflow
  - architecture
---

# ck-plan

Plan implementation work. Decomposes a feature into phases, surfaces unknowns, and produces an actionable spec the rest of the toolchain can execute. Phases capture sequencing, file ownership, and acceptance criteria.

## When to use

- Greenfield features touching 3+ files or layers
- Refactors with cross-cutting effects
- Any work where the scope is unclear

## Output

A plan directory with `plan.md` plus one `phase-XX-*.md` file per stage.
