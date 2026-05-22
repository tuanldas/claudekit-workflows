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
      className="hidden 2xl:fixed 2xl:top-20 2xl:right-8 2xl:block 2xl:max-h-[calc(100vh-6rem)] 2xl:w-56 2xl:overflow-y-auto"
    >
      <DocsToc />
    </aside>
  );
}
