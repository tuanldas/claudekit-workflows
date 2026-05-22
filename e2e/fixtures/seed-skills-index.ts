/**
 * Deterministic skill fixtures used by E2E tests. The directory layout under
 * `e2e/fixtures/skills` mirrors `~/.claude/skills/<group>/<id>/SKILL.md` so the
 * existing `build:skills` script can index it via the `SKILLS_DIR` env var.
 *
 * Playwright's globalSetup invokes the build with
 * `SKILLS_DIR=<absolute path to e2e/fixtures/skills>` before the dev server
 * starts — see `e2e/helpers/global-setup.ts`.
 */

import * as path from "node:path";

export const FIXTURE_SKILLS_DIR = path.join(__dirname, "skills");

export const FIXTURE_SKILL_IDS = [
  "ck-plan",
  "ck-cook",
  "ck-debug",
  "ck-fix",
  "copywriting",
  "design",
] as const;
