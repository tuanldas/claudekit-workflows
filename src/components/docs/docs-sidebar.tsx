import { DocsSidebarItem } from "./docs-sidebar-item";
import type { DocsTree } from "@/types/docs";
import type { Locale } from "@/types/workflow";

interface Props {
  tree: DocsTree;
  locale: Locale;
  /** Called khi user click 1 item; used by mobile drawer để close sau navigate. */
  onNavigate?: () => void;
}

export function DocsSidebar({ tree, locale, onNavigate }: Props) {
  if (tree.sections.length === 0) {
    return (
      <p className="px-3 py-2 text-sm text-foreground-muted">
        {locale === "vi" ? "Chưa có docs nào" : "No docs yet"}
      </p>
    );
  }

  return (
    <nav aria-label="Docs navigation" className="space-y-6 text-sm">
      {tree.sections.map((section) => (
        <section key={section.slug}>
          <h3 className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-foreground-subtle uppercase">
            {section.title[locale]}
          </h3>
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <DocsSidebarItem
                key={item.slug}
                slug={item.slug}
                navTitle={item.navTitle}
                locale={locale}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
