"use client";

import type { WorkflowCategory } from "@/types/workflow";
import { categoryOrder } from "@/data/workflows";
import { useLocale } from "@/i18n/language-context";
import { categoryLabel } from "@/lib/category-utils";
import { cn } from "@/lib/cn";

interface CategoryTabsProps {
  active: WorkflowCategory;
  onChange: (category: WorkflowCategory) => void;
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  const { locale } = useLocale();

  return (
    <div className="flex flex-wrap gap-1.5">
      {categoryOrder.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          aria-pressed={active === cat}
          className={cn(
            "h-7 cursor-pointer touch-manipulation rounded-[var(--radius-sm)] border px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-ring)]",
            active === cat
              ? "border-accent-border bg-accent-subtle text-accent"
              : "border-border bg-background text-foreground-muted hover:border-border-strong hover:bg-surface-hover hover:text-foreground",
          )}
        >
          {categoryLabel(cat, locale)}
        </button>
      ))}
    </div>
  );
}
