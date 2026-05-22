import { unstable_cache } from "next/cache";
import { buildDocsTree } from "./docs-tree";
import type { Locale } from "@/types/workflow";

/**
 * Single shared cached docs tree builder. Both the docs layout and the
 * shell sidebar share this exact key so React/Next dedupes the work.
 */
export const getCachedDocsTree = unstable_cache(
  async (locale: Locale) => buildDocsTree(locale),
  ["docs-tree"],
  { tags: ["docs-tree"], revalidate: false },
);
