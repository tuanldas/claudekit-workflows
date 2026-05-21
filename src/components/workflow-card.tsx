"use client";

import type { Workflow } from "@/types/workflow";
import { useLocale } from "@/i18n/language-context";
import { LevelBadge } from "./level-badge";
import { FlowSteps } from "./flow-steps";

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
      className={`group w-full cursor-pointer touch-manipulation rounded-xl border p-5 text-left transition-colors transition-shadow focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:outline-none ${
        isSelected
          ? "border-orange-300 bg-orange-50 shadow-md"
          : "border-gray-200 bg-white hover:border-orange-200 hover:shadow-sm"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <LevelBadge level={workflow.level} />
        <span
          className="font-mono text-xs text-gray-400 tabular-nums"
          translate="no"
        >
          ~{workflow.duration}
        </span>
      </div>

      <h3
        className={`mb-1.5 text-base font-semibold text-balance ${
          isSelected ? "text-orange-700" : "text-gray-900"
        }`}
      >
        {workflow.title[locale]}
      </h3>

      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-500">
        {workflow.description[locale]}
      </p>

      <FlowSteps steps={workflow.steps} />
    </button>
  );
}
