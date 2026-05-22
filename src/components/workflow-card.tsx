"use client";

import type { Workflow } from "@/types/workflow";
import { useLocale } from "@/i18n/language-context";
import { LevelBadge } from "./level-badge";
import { FlowSteps } from "./flow-steps";
import { cn } from "@/lib/cn";

interface WorkflowCardProps {
  workflow: Workflow;
  isSelected: boolean;
  onClick: () => void;
}

export function WorkflowCard({
  workflow,
  isSelected,
  onClick,
}: WorkflowCardProps) {
  const { locale } = useLocale();

  return (
    <button
      onClick={onClick}
      aria-pressed={isSelected}
      className={cn(
        "group w-full cursor-pointer touch-manipulation rounded-[var(--radius-lg)] border p-4 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isSelected
          ? "border-accent bg-accent-subtle"
          : "border-border bg-background hover:border-border-strong hover:bg-surface-hover",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <LevelBadge level={workflow.level} />
        <span
          className="font-mono text-micro tabular-nums text-foreground-subtle"
          translate="no"
        >
          ~{workflow.duration}
        </span>
      </div>

      <h3
        className={cn(
          "mb-1.5 text-h3 font-semibold tracking-tight text-balance",
          isSelected ? "text-accent" : "text-foreground",
        )}
      >
        {workflow.title[locale]}
      </h3>

      <p className="mb-4 line-clamp-3 text-caption leading-relaxed text-foreground-muted">
        {workflow.description[locale]}
      </p>

      <FlowSteps steps={workflow.steps} />
    </button>
  );
}
