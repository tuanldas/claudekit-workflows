import type { Locale, LocalizedString } from "./workflow";

export interface DocsItem {
  /** Relative slug like "engineer/01-core-workflow" (no `.md`). */
  slug: string;
  /** Sidebar label, derived from frontmatter `nav_title` || `title` || H1 || filename. */
  navTitle: string;
  /** Sort order: frontmatter `order` ?? filename numeric prefix ?? 999. */
  order: number;
  /** Hidden items not rendered in sidebar but still routable. */
  hidden: boolean;
}

export interface DocsSection {
  /** Slug = top-level folder name (e.g. "engineer") OR "_root" for files directly in `docs/{locale}/`. */
  slug: string;
  /** Locale-aware section title. */
  title: LocalizedString;
  order: number;
  items: DocsItem[];
}

export interface DocsTree {
  sections: DocsSection[];
}

export interface LoadedMdx {
  /** Markdown body with frontmatter stripped. */
  source: string;
  /** Parsed frontmatter (or empty object). */
  frontmatter: Record<string, unknown>;
  /** True khi serve from non-requested locale. */
  fallback: boolean;
  /** The originally requested locale. */
  originalLocale: Locale;
  /** Locale that actually provided the file. */
  resolvedLocale: Locale;
}
