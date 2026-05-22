import type { Locale, WorkflowCategory } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";

export function categoryLabel(
  category: WorkflowCategory,
  locale: Locale,
): string {
  return uiStrings.categories[category][locale];
}

export function isWorkflowCategory(value: string): value is WorkflowCategory {
  return value in uiStrings.categories;
}

export function normalizeCategory(value: string | null): WorkflowCategory {
  if (!value || !isWorkflowCategory(value)) return "all";
  return value;
}
