---
name: ck-cook
description: Execute a plan phase-by-phase with the implementation pipeline
tags:
  - execution
  - core-workflow
  - implementation
---

# ck-cook

Drive end-to-end execution of a plan. Spawns implementers, testers, and reviewers in sequence. Honors phase ordering and file ownership rules.

## Inputs

- A plan directory from `ck-plan`
- Optional flags: `--fast`, `--phase`
