"use client";

import type { WorkflowLevel } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";
import { useLocale } from "@/i18n/language-context";

const dotClass: Record<WorkflowLevel, string> = {
  beginner: "bg-success",
  intermediate: "bg-warning",
  advanced: "bg-accent",
};

interface LevelBadgeProps {
  level: WorkflowLevel;
}

/**
 * Dot + label badge — readable for colorblind users (shape + text, not color
 * alone). Replaces pill style to align with Linear/Vercel minimal aesthetic.
 */
export function LevelBadge({ level }: LevelBadgeProps) {
  const { locale } = useLocale();
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-foreground-muted">
      <span
        aria-hidden="true"
        className={`inline-block size-1.5 rounded-full ${dotClass[level]}`}
      />
      {uiStrings.level[level][locale]}
    </span>
  );
}
