"use client";

import type { WorkflowLevel } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";
import { useLocale } from "@/i18n/language-context";

const levelClassNames: Record<WorkflowLevel, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-orange-100 text-orange-700",
  advanced: "bg-red-100 text-red-700",
};

interface LevelBadgeProps {
  level: WorkflowLevel;
}

export function LevelBadge({ level }: LevelBadgeProps) {
  const { locale } = useLocale();

  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${levelClassNames[level]}`}
    >
      {uiStrings.level[level][locale]}
    </span>
  );
}
