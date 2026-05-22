/**
 * Playwright globalSetup: bake deterministic skills index from the local
 * fixture tree so the dev server renders predictable cards (the catalog
 * otherwise depends on the developer's ~/.claude/skills directory).
 *
 * We invoke the existing `build:skills` script via tsx with an overridden
 * `SKILLS_DIR` env var — same code path as production builds.
 */

import { execFileSync } from "node:child_process";
import * as path from "node:path";

import { FIXTURE_SKILLS_DIR } from "./playwright-setup";

const REPO_ROOT = path.resolve(__dirname, "..", "..");

export default async function globalSetup(): Promise<void> {
  const tsx = path.join(REPO_ROOT, "node_modules", ".bin", "tsx");
  const script = path.join(REPO_ROOT, "scripts", "build-skills-index.ts");

  execFileSync(tsx, [script], {
    cwd: REPO_ROOT,
    env: { ...process.env, SKILLS_DIR: FIXTURE_SKILLS_DIR },
    stdio: "inherit",
  });
}
