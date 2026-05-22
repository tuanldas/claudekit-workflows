"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Locale, WorkflowCategory } from "@/types/workflow";
import { categoryOrder } from "@/data/workflows";
import { uiStrings } from "@/i18n/translations";
import { normalizeCategory, categoryLabel } from "@/lib/category-utils";
import { useSidebarScroll } from "@/lib/use-sidebar-scroll";
import { SECTION_KEYS } from "@/lib/sidebar-scroll-storage";

function buildHref(locale: Locale, category: WorkflowCategory): string {
  if (category === "all") return `/${locale}/workflows`;
  return `/${locale}/workflows?category=${category}`;
}

export function SidebarWorkflowsNav({ locale }: { locale: Locale }) {
  const params = useSearchParams();
  const active = normalizeCategory(params?.get("category") ?? null);
  const scrollRef = useSidebarScroll<HTMLDivElement>(SECTION_KEYS.WORKFLOWS);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto px-2">
      <h3 className="mb-2 px-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
        {uiStrings.nav.workflows[locale]}
      </h3>
      <ul className="space-y-0.5">
        {categoryOrder.map((cat) => {
          const isActive = active === cat;
          return (
            <li key={cat}>
              <Link
                href={buildHref(locale, cat)}
                aria-current={isActive ? "page" : undefined}
                className={`block rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:outline-none ${
                  isActive
                    ? "bg-orange-50 text-orange-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {categoryLabel(cat, locale)}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
