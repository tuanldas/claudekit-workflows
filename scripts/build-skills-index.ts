import { promises as fs } from "node:fs";
import { existsSync } from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { glob } from "glob";
import matter from "gray-matter";

export interface Skill {
  id: string;
  name: string;
  description: string;
  tags: string[];
  group: string;
  plugin?: string;
  path: string;
  excerpt: string;
}

interface Options {
  skillsDir?: string;
  outputDir?: string;
}

interface BuildResult {
  skills: Skill[];
  warning?: string;
}

const EXCERPT_LIMIT = 300;

export async function buildSkillsIndex(
  opts: Options = {},
): Promise<BuildResult> {
  const skillsDir =
    opts.skillsDir ??
    process.env.SKILLS_DIR ??
    path.join(os.homedir(), ".claude/skills");
  const outputDir =
    opts.outputDir ?? path.join(process.cwd(), "src/data");
  const contentDir = path.join(outputDir, "skills-content");
  const indexPath = path.join(outputDir, "skills-index.json");

  if (!existsSync(skillsDir)) {
    const warning = `Skills directory ${skillsDir} does not exist — writing empty index`;
    console.warn("[build:skills]", warning);
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(indexPath, JSON.stringify([], null, 2));
    return { skills: [], warning };
  }

  const files = await glob("**/SKILL.md", {
    cwd: skillsDir,
    absolute: false,
    follow: false,
    nodir: true,
  });

  if (files.length === 0) {
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(indexPath, JSON.stringify([], null, 2));
    console.log(`[build:skills] No SKILL.md found in ${skillsDir}`);
    return { skills: [] };
  }

  await fs.mkdir(contentDir, { recursive: true });

  const skills: Skill[] = [];
  const seenIds = new Set<string>();
  let duplicates = 0;
  for (const rel of files) {
    const abs = path.join(skillsDir, rel);
    const skill = await parseSkill(abs, rel);
    if (!skill) continue;

    let { id } = skill;
    if (seenIds.has(id)) {
      duplicates++;
      id = `${skill.group}-${id}`;
      let suffix = 2;
      while (seenIds.has(id)) {
        id = `${skill.group}-${skill.id}-${suffix++}`;
      }
      skill.id = id;
    }
    seenIds.add(id);

    skills.push(skill);
    await fs.writeFile(
      path.join(contentDir, `${id}.md`),
      skill._content,
      "utf-8",
    );
    delete (skill as Skill & { _content?: string })._content;
  }

  skills.sort((a, b) =>
    `${a.group}/${a.name}`.localeCompare(`${b.group}/${b.name}`),
  );

  await fs.writeFile(indexPath, JSON.stringify(skills, null, 2));
  const dupNote = duplicates > 0 ? ` (${duplicates} id collisions deduplicated)` : "";
  console.log(
    `[build:skills] Indexed ${skills.length} skills from ${skillsDir}${dupNote}`,
  );
  return { skills };
}

interface ParsedSkill extends Skill {
  _content: string;
}

async function parseSkill(
  abs: string,
  rel: string,
): Promise<ParsedSkill | null> {
  let raw: string;
  try {
    raw = await fs.readFile(abs, "utf-8");
  } catch (err) {
    console.warn(`[build:skills] Failed to read ${rel}:`, err);
    return null;
  }

  let data: Record<string, unknown> = {};
  let content = raw;
  try {
    const parsed = matter(raw);
    data = parsed.data;
    content = parsed.content;
  } catch (err) {
    console.warn(`[build:skills] Bad frontmatter in ${rel}:`, err);
  }

  const segments = rel.split(path.sep);
  const folderName = segments[segments.length - 2] ?? "unknown";
  const group = segments.length > 1 ? segments[0] : "root";

  const id = folderName;
  const name = typeof data.name === "string" ? data.name : folderName;
  const description =
    typeof data.description === "string"
      ? data.description
      : extractFirstParagraph(content) ?? "";
  const tags = Array.isArray(data.tags)
    ? data.tags.filter((t): t is string => typeof t === "string")
    : [];
  const plugin = typeof data.plugin === "string" ? data.plugin : undefined;
  const excerpt = content
    .slice(0, EXCERPT_LIMIT)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, EXCERPT_LIMIT);

  return {
    id,
    name,
    description,
    tags,
    group,
    plugin,
    path: rel,
    excerpt,
    _content: content,
  };
}

function extractFirstParagraph(content: string): string | null {
  const stripped = content.replace(/^#+ .+\n+/gm, "").trim();
  if (!stripped) return null;
  const para = stripped.split(/\n\s*\n/)[0];
  return para ? para.replace(/\s+/g, " ").trim() : null;
}

const isMain = (() => {
  try {
    const argv1 = process.argv[1];
    if (!argv1) return false;
    return import.meta.url === new URL(`file://${argv1}`).href;
  } catch {
    return false;
  }
})();

if (isMain) {
  buildSkillsIndex().catch((err) => {
    console.error("[build:skills] failed:", err);
    process.exit(1);
  });
}
