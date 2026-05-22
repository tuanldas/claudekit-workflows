"use client";

import type { WorkflowCategory } from "@/types/workflow";
import { categoryOrder } from "@/data/workflows";
import { useLocale } from "@/i18n/language-context";
import { categoryLabel } from "@/lib/category-utils";

interface CategoryTabsProps {
  active: WorkflowCategory;
  onChange: (category: WorkflowCategory) => void;
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  const { locale } = useLocale();

  return (
    <div className="flex flex-wrap gap-2">
      {categoryOrder.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          aria-pressed={active === cat}
          className={`touch-manipulation rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:outline-none ${
            active === cat
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {categoryLabel(cat, locale)}
        </button>
      ))}
    </div>
  );
}
