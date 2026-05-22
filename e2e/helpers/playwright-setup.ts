/**
 * Shared E2E helpers. Currently exposes the absolute path to the deterministic
 * skills fixture so the Playwright `globalSetup` (and any spec that needs to
 * re-index) can wire the same `SKILLS_DIR` env var into the build step.
 */

import * as path from "node:path";

export const FIXTURE_SKILLS_DIR = path.resolve(
  __dirname,
  "..",
  "fixtures",
  "skills",
);

/** Workflows page URL used by most navigation specs. */
export const ROUTE_WORKFLOWS = "/vi/workflows";
export const ROUTE_DOCS_INDEX = "/vi/docs/engineer/01-core-workflow";
export const ROUTE_SKILLS = "/vi/skills";
/** Sample skill id present in the fixture set. */
export const FIXTURE_SKILL_ID = "ck-plan";
export const ROUTE_SKILL_DETAIL = `/vi/skills/${FIXTURE_SKILL_ID}`;
