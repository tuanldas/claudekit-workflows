import { promises as fs } from "node:fs";
import path from "node:path";
import { glob } from "glob";
import matter from "gray-matter";

const LOCALES = ["vi", "en"] as const;
type Locale = (typeof LOCALES)[number];

interface IndexableDoc {
  id: number;
  slug: string;
  title: string;
  searchable: string;
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

  const docs: IndexableDoc[] = [];

  for (let i = 0; i < files.length; i++) {
    const full = path.join(docsRoot, files[i]);
    const raw = await fs.readFile(full, "utf-8");
    const { content, data } = matter(raw);
    const slug = files[i].replace(/\.md$/, "");

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

    // Boost title via repetition
    const searchable = `${h1} ${h1} ${headings} ${body}`;
    docs.push({ id: i, slug, title: h1, searchable });
  }

  await writeOutput(locale, docs);
  console.log(`[search-index] ${locale}: ${docs.length} docs indexed`);
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
