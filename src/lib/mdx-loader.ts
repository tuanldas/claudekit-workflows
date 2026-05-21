import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { glob } from "glob";
import { LOCALES } from "./locale-routing";
import type { Locale } from "@/types/workflow";
import type { LoadedMdx } from "@/types/docs";

/**
 * Load MDX source for (locale, slug) với symmetric fallback:
 * - Try requested locale first
 * - Fall back to OTHER locale(s) nếu missing
 * - Returns null nếu cả 2 locale đều không có file
 */
export async function loadMdx(
  locale: Locale,
  slug: string,
): Promise<LoadedMdx | null> {
  const candidates: Locale[] = [
    locale,
    ...LOCALES.filter((l) => l !== locale),
  ];

  for (const candidate of candidates) {
    const filePath = path.join(process.cwd(), "docs", candidate, `${slug}.md`);
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      const parsed = matter(raw);
      return {
        source: parsed.content,
        frontmatter: parsed.data as Record<string, unknown>,
        fallback: candidate !== locale,
        originalLocale: locale,
        resolvedLocale: candidate,
      };
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * List all slugs (relative paths sans `.md`) for a locale. Returns empty array
 * when the locale dir doesn't exist or is empty.
 */
export async function listAllSlugs(locale: Locale): Promise<string[]> {
  const root = path.join(process.cwd(), "docs", locale);
  try {
    const files = await glob("**/*.md", {
      cwd: root,
      ignore: ["_*"],
      nodir: true,
    });
    return files.map((f) => f.replace(/\.md$/, ""));
  } catch {
    return [];
  }
}
