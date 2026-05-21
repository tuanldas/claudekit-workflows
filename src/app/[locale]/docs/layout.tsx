import { unstable_cache } from "next/cache";
import { buildDocsTree } from "@/lib/docs-tree";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { DocsToc } from "@/components/docs/docs-toc";
import { MobileNav } from "@/components/docs/mobile-nav";
import type { Locale } from "@/types/workflow";

const getCachedDocsTree = unstable_cache(
  async (locale: Locale) => buildDocsTree(locale),
  ["docs-tree"],
  { tags: ["docs-tree"], revalidate: false },
);

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DocsLayout({ children, params }: Props) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const tree = await getCachedDocsTree(locale);
  const sidebar = <DocsSidebar tree={tree} locale={locale} />;

  return (
    <>
      <MobileNav sidebar={sidebar} />
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6 px-4 sm:px-6 lg:px-8">
        <aside className="sticky top-4 col-span-3 hidden h-[calc(100vh-2rem)] self-start overflow-y-auto py-8 lg:block">
          {sidebar}
        </aside>
        <main className="col-span-12 py-6 lg:col-span-7 lg:py-8">
          {children}
        </main>
        <aside className="sticky top-4 col-span-2 hidden h-[calc(100vh-2rem)] self-start overflow-y-auto py-8 lg:block">
          <DocsToc />
        </aside>
      </div>
    </>
  );
}
