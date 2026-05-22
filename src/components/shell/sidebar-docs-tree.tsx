import { DocsSidebar } from "@/components/docs/docs-sidebar";
import type { DocsTree } from "@/types/docs";
import type { Locale } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";

interface Props {
  locale: Locale;
  /** Tree fetched at shell level (server). When null, sidebar renders a stub. */
  tree: DocsTree | null;
}

export function SidebarDocsTree({ locale, tree }: Props) {
  if (!tree) {
    return (
      <div className="px-4 text-sm text-gray-500" aria-label="Docs nav stub">
        {uiStrings.nav.docsStub[locale]}
      </div>
    );
  }
  return (
    <div className="px-2">
      <DocsSidebar tree={tree} locale={locale} />
    </div>
  );
}
