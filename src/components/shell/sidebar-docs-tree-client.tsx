"use client";

import { DocsSidebar } from "@/components/docs/docs-sidebar";
import type { DocsTree } from "@/types/docs";
import type { Locale } from "@/types/workflow";
import { useSidebarScroll } from "@/lib/use-sidebar-scroll";
import { SECTION_KEYS } from "@/lib/sidebar-scroll-storage";

interface Props {
  locale: Locale;
  tree: DocsTree;
}

export function SidebarDocsTreeClient({ locale, tree }: Props) {
  const scrollRef = useSidebarScroll<HTMLDivElement>(SECTION_KEYS.DOCS);
  return (
    <div ref={scrollRef} className="h-full overflow-y-auto px-2">
      <DocsSidebar tree={tree} locale={locale} />
    </div>
  );
}
