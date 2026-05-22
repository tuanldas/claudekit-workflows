import type { DocsTree } from "@/types/docs";
import type { Locale } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";
import { SidebarDocsTreeClient } from "./sidebar-docs-tree-client";

interface Props {
  locale: Locale;
  /** Tree fetched at shell level (server). When null, sidebar renders a stub. */
  tree: DocsTree | null;
}

export function SidebarDocsTree({ locale, tree }: Props) {
  if (!tree) {
    return (
      <div className="px-4 text-sm text-foreground-muted" aria-label="Docs nav stub">
        {uiStrings.nav.docsStub[locale]}
      </div>
    );
  }
  return <SidebarDocsTreeClient locale={locale} tree={tree} />;
}
