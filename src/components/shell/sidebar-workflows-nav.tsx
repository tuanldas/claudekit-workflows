"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Locale, WorkflowCategory } from "@/types/workflow";
import { categoryOrder } from "@/data/workflows";
import { uiStrings } from "@/i18n/translations";
import { normalizeCategory, categoryLabel } from "@/lib/category-utils";
import { useSidebarScroll } from "@/lib/use-sidebar-scroll";
import { SECTION_KEYS } from "@/lib/sidebar-scroll-storage";
import { cn } from "@/lib/cn";

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
      <h3 className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-foreground-subtle uppercase">
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
                className={cn(
                  "block rounded-[var(--radius-sm)] px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-ring)]",
                  isActive
                    ? "bg-accent-subtle font-medium text-accent"
                    : "text-foreground-muted hover:bg-surface-hover hover:text-foreground",
                )}
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
