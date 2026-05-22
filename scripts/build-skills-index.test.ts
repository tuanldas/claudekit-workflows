import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { promises as fs } from "node:fs";
import * as fsSync from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { buildSkillsIndex } from "./build-skills-index";

const TMP_ROOT = path.join(os.tmpdir(), `skills-index-test-${process.pid}`);
const FIXTURE_DIR = path.join(TMP_ROOT, "skills");
const OUTPUT_DIR = path.join(TMP_ROOT, "out");

async function writeSkill(rel: string, body: string) {
  const full = path.join(FIXTURE_DIR, rel);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, body, "utf-8");
}

beforeAll(async () => {
  await fs.rm(TMP_ROOT, { recursive: true, force: true });
  await fs.mkdir(FIXTURE_DIR, { recursive: true });
});

afterAll(async () => {
  await fs.rm(TMP_ROOT, { recursive: true, force: true });
});

describe("buildSkillsIndex", () => {
  beforeEach(async () => {
    await fs.rm(FIXTURE_DIR, { recursive: true, force: true });
    await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
    await fs.mkdir(FIXTURE_DIR, { recursive: true });
  });

  it("discovers SKILL.md files and reports group from first path segment", async () => {
    await writeSkill(
      "engineer/test-skill/SKILL.md",
      `---\nname: test-skill\ndescription: A test skill\ntags: [test, demo]\n---\n# Body content here\n`,
    );

    const result = await buildSkillsIndex({
      skillsDir: FIXTURE_DIR,
      outputDir: OUTPUT_DIR,
    });

    expect(result.skills).toHaveLength(1);
    expect(result.skills[0].id).toBe("test-skill");
    expect(result.skills[0].group).toBe("engineer");
    expect(result.skills[0].path).toBe(
      path.join("engineer", "test-skill", "SKILL.md"),
    );
  });

  it("parses frontmatter (name, description, tags, plugin)", async () => {
    await writeSkill(
      "engineer/full-meta/SKILL.md",
      `---\nname: full-meta\ndescription: Has all fields\ntags:\n  - foo\n  - bar\nplugin: anthropic-skills\n---\nbody`,
    );

    const result = await buildSkillsIndex({
      skillsDir: FIXTURE_DIR,
      outputDir: OUTPUT_DIR,
    });

    expect(result.skills[0]).toMatchObject({
      name: "full-meta",
      description: "Has all fields",
      tags: ["foo", "bar"],
      plugin: "anthropic-skills",
    });
  });

  it("falls back to folder name when frontmatter is missing name", async () => {
    await writeSkill(
      "marketing/no-meta/SKILL.md",
      "# Just body, no frontmatter\n\nFirst paragraph here.\n",
    );

    const result = await buildSkillsIndex({
      skillsDir: FIXTURE_DIR,
      outputDir: OUTPUT_DIR,
    });

    const noMeta = result.skills.find((s) => s.id === "no-meta");
    expect(noMeta).toBeDefined();
    expect(noMeta?.name).toBe("no-meta");
    expect(noMeta?.description).toContain("First paragraph");
    expect(noMeta?.tags).toEqual([]);
  });

  it("returns empty array + warning when skillsDir does not exist", async () => {
    const result = await buildSkillsIndex({
      skillsDir: "/nonexistent/path-xyz",
      outputDir: OUTPUT_DIR,
    });

    expect(result.skills).toEqual([]);
    expect(result.warning).toBeDefined();
    expect(result.warning?.toLowerCase()).toContain("not exist");
  });

  it("writes skills-index.json with sorted output and skills-content/ files", async () => {
    await writeSkill(
      "engineer/zeta/SKILL.md",
      `---\nname: zeta\n---\nzeta body content`,
    );
    await writeSkill(
      "engineer/alpha/SKILL.md",
      `---\nname: alpha\n---\nalpha body content`,
    );

    await buildSkillsIndex({
      skillsDir: FIXTURE_DIR,
      outputDir: OUTPUT_DIR,
    });

    const jsonPath = path.join(OUTPUT_DIR, "skills-index.json");
    const raw = await fs.readFile(jsonPath, "utf-8");
    const parsed = JSON.parse(raw);

    expect(parsed).toHaveLength(2);
    expect(parsed[0].name).toBe("alpha");
    expect(parsed[1].name).toBe("zeta");

    const contentAlpha = await fs.readFile(
      path.join(OUTPUT_DIR, "skills-content", "alpha.md"),
      "utf-8",
    );
    expect(contentAlpha).toContain("alpha body content");
  });

  it("produces excerpt under 300 chars without newlines", async () => {
    const longBody = "para one. ".repeat(80);
    await writeSkill(
      "engineer/long-body/SKILL.md",
      `---\nname: long-body\n---\n${longBody}`,
    );

    const result = await buildSkillsIndex({
      skillsDir: FIXTURE_DIR,
      outputDir: OUTPUT_DIR,
    });

    expect(result.skills[0].excerpt.length).toBeLessThanOrEqual(300);
    expect(result.skills[0].excerpt).not.toMatch(/\n/);
  });

  it("skips empty-dir gracefully (no SKILL.md found)", async () => {
    await fs.mkdir(path.join(FIXTURE_DIR, "engineer"), { recursive: true });

    const result = await buildSkillsIndex({
      skillsDir: FIXTURE_DIR,
      outputDir: OUTPUT_DIR,
    });

    expect(result.skills).toEqual([]);
    expect(
      fsSync.existsSync(path.join(OUTPUT_DIR, "skills-index.json")),
    ).toBe(true);
  });

  it("handles invalid frontmatter gracefully (does not throw)", async () => {
    await writeSkill(
      "engineer/bad-yaml/SKILL.md",
      "---\nname: bad\n  invalid: [unclosed\n---\nbody",
    );
    await writeSkill(
      "engineer/good/SKILL.md",
      "---\nname: good\n---\nfine",
    );

    const result = await buildSkillsIndex({
      skillsDir: FIXTURE_DIR,
      outputDir: OUTPUT_DIR,
    });

    expect(result.skills.length).toBeGreaterThanOrEqual(1);
    const good = result.skills.find((s) => s.id === "good");
    expect(good).toBeDefined();
  });
});
