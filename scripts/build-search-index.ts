import { promises as fs } from "node:fs";
import { existsSync } from "node:fs";
import path from "node:path";
import { glob } from "glob";
import matter from "gray-matter";
import { workflows } from "../src/data/workflows";

const LOCALES = ["vi", "en"] as const;
type Locale = (typeof LOCALES)[number];

export type IndexableKind = "doc" | "skill" | "workflow";

interface IndexableDoc {
  id: number;
  slug: string;
  title: string;
  searchable: string;
  kind: IndexableKind;
  subtitle?: string;
  group?: string;
}

interface SkillRecord {
  id: string;
  name: string;
  description: string;
  tags: string[];
  group: string;
  path: string;
  excerpt: string;
}

async function buildIndex(locale: Locale) {
  const docsRoot = path.join(process.cwd(), "docs", locale);
  let files: string[];
  try {
    files = await glob("**/*.md", {
      cwd: docsRoot,
      ignore: ["_*"],
      nodir: true,
    });
  } catch {
    files = [];
  }

  const entries: IndexableDoc[] = [];
  let nextId = 0;

  for (const file of files) {
    const full = path.join(docsRoot, file);
    const raw = await fs.readFile(full, "utf-8");
    const { content, data } = matter(raw);
    const slug = file.replace(/\.md$/, "");

    const h1 =
      content.match(/^#\s+(.+)$/m)?.[1] ??
      (typeof data.title === "string" ? data.title : slug);

    const headings = (content.match(/^#{2,3}\s+(.+)$/gm) ?? [])
      .map((h) => h.replace(/^#+\s+/, ""))
      .join(" ");

    const body = content
      .replace(/```[\s\S]*?```/g, "")
      .replace(/[#*_`~]/g, "")
      .replace(/\s+/g, " ")
      .slice(0, 5000);

    const excerpt = body.slice(0, 140).trim();

    // Boost title via repetition.
    const searchable = `${h1} ${h1} ${headings} ${body}`;
    entries.push({
      id: nextId++,
      slug,
      title: h1,
      searchable,
      kind: "doc",
      subtitle: excerpt,
    });
  }

  const skills = await loadSkillsForSearch();
  for (const sk of skills) {
    const tagText = sk.tags.join(" ");
    const searchable = `${sk.name} ${sk.name} ${sk.description} ${tagText} ${sk.excerpt}`;
    entries.push({
      id: nextId++,
      slug: `skills/${sk.id}`,
      title: sk.name,
      searchable,
      kind: "skill",
      subtitle: sk.description.slice(0, 140),
      group: sk.group,
    });
  }

  for (const wf of workflows) {
    const title = wf.title[locale] || wf.title.vi;
    const description = wf.description[locale] || wf.description.vi;
    const commandList = wf.steps.map((s) => s.command).join(" ");
    const phaseNames = wf.phases
      .map((p) => p.name[locale] || p.name.vi)
      .join(" ");
    const searchable =
      `${title} ${title} ${wf.id} ${description} ${commandList} ${phaseNames}`.trim();
    entries.push({
      id: nextId++,
      slug: `workflows?selected=${wf.id}`,
      title,
      searchable,
      kind: "workflow",
      subtitle: description.slice(0, 140),
      group: wf.category,
    });
  }

  await writeOutput(locale, entries);
  const counts = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.kind] = (acc[e.kind] ?? 0) + 1;
    return acc;
  }, {});
  console.log(
    `[search-index] ${locale}: ${entries.length} entries (${
      counts.doc ?? 0
    } docs, ${counts.skill ?? 0} skills, ${counts.workflow ?? 0} workflows)`,
  );
}

async function loadSkillsForSearch(): Promise<SkillRecord[]> {
  const skillsIndexPath = path.join(
    process.cwd(),
    "src/data/skills-index.json",
  );
  if (!existsSync(skillsIndexPath)) {
    console.warn(
      "[search-index] skills-index.json missing — run build:skills first",
    );
    return [];
  }
  try {
    const raw = await fs.readFile(skillsIndexPath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SkillRecord[]) : [];
  } catch (err) {
    console.warn("[search-index] failed to read skills-index.json:", err);
    return [];
  }
}

async function writeOutput(locale: string, docs: IndexableDoc[]) {
  const outDir = path.join(process.cwd(), "public");
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(
    path.join(outDir, `search-index-${locale}.json`),
    JSON.stringify({ docs }),
  );
}

async function main() {
  for (const locale of LOCALES) {
    await buildIndex(locale);
  }
}

main().catch((err) => {
  console.error("[search-index] build failed:", err);
  process.exit(1);
});
