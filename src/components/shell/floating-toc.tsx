"use client";

import { DocsToc } from "@/components/docs/docs-toc";

/**
 * Right-side TOC floating overlay. Visible on 2xl (>=1536px), hidden below.
 * Wraps the existing DocsToc which extracts headings from the rendered MDX
 * article via MDX_CONTENT_SELECTOR.
 */
export function FloatingToc() {
  return (
    <aside
      role="complementary"
      aria-label="On this page"
      className="hidden min-[1700px]:fixed min-[1700px]:top-20 min-[1700px]:right-8 min-[1700px]:block min-[1700px]:max-h-[calc(100vh-6rem)] min-[1700px]:w-56 min-[1700px]:overflow-y-auto"
    >
      <DocsToc />
    </aside>
  );
}
