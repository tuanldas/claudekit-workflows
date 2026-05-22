import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { promises as fs } from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

const TMP_ROOT = path.join(os.tmpdir(), `skills-loader-test-${process.pid}`);
const DATA_DIR = path.join(TMP_ROOT, "src/data");
const CONTENT_DIR = path.join(DATA_DIR, "skills-content");

const cwdSpy = vi.spyOn(process, "cwd");

vi.mock("next/cache", () => ({
  unstable_cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
}));

beforeAll(async () => {
  await fs.rm(TMP_ROOT, { recursive: true, force: true });
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(CONTENT_DIR, { recursive: true });

  const sample = [
    {
      id: "alpha",
      name: "alpha",
      description: "alpha desc",
      tags: ["a"],
      group: "engineer",
      path: "engineer/alpha/SKILL.md",
      excerpt: "alpha excerpt",
    },
    {
      id: "beta",
      name: "beta",
      description: "beta desc",
      tags: [],
      group: "marketing",
      path: "marketing/beta/SKILL.md",
      excerpt: "beta excerpt",
    },
  ];
  await fs.writeFile(
    path.join(DATA_DIR, "skills-index.json"),
    JSON.stringify(sample),
  );
  await fs.writeFile(
    path.join(CONTENT_DIR, "alpha.md"),
    "# alpha\n\nBody content for alpha skill.",
  );

  cwdSpy.mockReturnValue(TMP_ROOT);
});

afterAll(async () => {
  cwdSpy.mockRestore();
  await fs.rm(TMP_ROOT, { recursive: true, force: true });
});

describe("skills-loader", () => {
  it("loads skills from JSON as array", async () => {
    const { loadSkills } = await import("./skills-loader");
    const skills = await loadSkills();
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.length).toBe(2);
    expect(skills[0].id).toBe("alpha");
  });

  it("loads single skill content by id", async () => {
    const { loadSkillContent } = await import("./skills-loader");
    const content = await loadSkillContent("alpha");
    expect(content).toContain("Body content");
  });

  it("returns null for unknown skill id", async () => {
    const { loadSkillContent } = await import("./skills-loader");
    const content = await loadSkillContent("does-not-exist");
    expect(content).toBeNull();
  });

  it("returns empty array when skills-index.json is missing", async () => {
    const altRoot = path.join(os.tmpdir(), `skills-loader-empty-${process.pid}`);
    await fs.mkdir(altRoot, { recursive: true });
    cwdSpy.mockReturnValueOnce(altRoot);
    const { loadSkills } = await import("./skills-loader");
    const skills = await loadSkills();
    expect(skills).toEqual([]);
    await fs.rm(altRoot, { recursive: true, force: true });
  });
});
