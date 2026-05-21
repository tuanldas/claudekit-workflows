import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { glob } from "glob";
import type { Locale, LocalizedString } from "@/types/workflow";
import type { DocsItem, DocsSection, DocsTree } from "@/types/docs";

interface SectionMeta {
  title?: LocalizedString;
  order?: number;
}

const ROOT_SECTION_KEY = "_root";

/**
 * Auto-discover docs tree từ `docs/{locale}/` directory.
 * Top-level subfolders become sections; files directly in `docs/{locale}/`
 * are grouped under `_root` section.
 */
export async function buildDocsTree(
  locale: Locale,
  rootDir = path.join(process.cwd(), "docs", locale),
): Promise<DocsTree> {
  let files: string[];
  try {
    files = await glob("**/*.md", {
      cwd: rootDir,
      ignore: ["_*.json", "_*"],
      nodir: true,
    });
  } catch {
    return { sections: [] };
  }

  const sectionsMap = new Map<string, DocsSection>();

  for (const file of files) {
    const parts = file.split("/");
    const isRoot = parts.length === 1;
    const sectionKey = isRoot ? ROOT_SECTION_KEY : parts[0];
    const slug = file.replace(/\.md$/, "");

    const full = path.join(rootDir, file);
    let raw: string;
    try {
      raw = await fs.readFile(full, "utf-8");
    } catch {
      continue;
    }
    const { data: fm } = matter(raw);
    if (fm.hidden === true) continue;

    const filename = path.basename(file);
    const filenamePrefix = filename.match(/^(\d+)-/)?.[1];
    const order =
      typeof fm.order === "number"
        ? fm.order
        : filenamePrefix
          ? Number(filenamePrefix)
          : 999;

    const navTitle =
      (typeof fm.nav_title === "string" && fm.nav_title) ||
      (typeof fm.title === "string" && fm.title) ||
      titleFromSlug(slug);

    if (!sectionsMap.has(sectionKey)) {
      const meta = await readSectionMeta(rootDir, sectionKey);
      sectionsMap.set(sectionKey, {
        slug: sectionKey,
        title: meta?.title ?? defaultSectionTitle(sectionKey),
        order: meta?.order ?? 999,
        items: [],
      });
    }
    sectionsMap.get(sectionKey)!.items.push({
      slug,
      navTitle,
      order,
      hidden: false,
    });
  }

  const sections = Array.from(sectionsMap.values())
    .map((s) => ({
      ...s,
      items: [...s.items].sort((a, b) => a.order - b.order),
    }))
    .sort((a, b) => a.order - b.order);

  return { sections };
}

async function readSectionMeta(
  root: string,
  section: string,
): Promise<SectionMeta | null> {
  if (section === ROOT_SECTION_KEY) return null;
  const metaPath = path.join(root, section, "_section.json");
  try {
    const raw = await fs.readFile(metaPath, "utf-8");
    return JSON.parse(raw) as SectionMeta;
  } catch {
    return null;
  }
}

function defaultSectionTitle(slug: string): LocalizedString {
  if (slug === ROOT_SECTION_KEY) {
    return { vi: "Tổng quan", en: "Overview" };
  }
  const capitalized = slug[0].toUpperCase() + slug.slice(1);
  return { vi: capitalized, en: capitalized };
}

function titleFromSlug(slug: string): string {
  const last = slug.split("/").pop() ?? slug;
  return last
    .replace(/^\d+-/, "")
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export type { DocsTree, DocsSection, DocsItem };
