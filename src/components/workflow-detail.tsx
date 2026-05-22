"use client";

import type { Workflow } from "@/types/workflow";
import { useLocale } from "@/i18n/language-context";
import { uiStrings } from "@/i18n/translations";
import { LevelBadge } from "./level-badge";
import { WorkflowFlowCanvas } from "./workflow-flow-canvas";

interface WorkflowDetailProps {
  workflow: Workflow;
  onClose: () => void;
}

export function WorkflowDetail({ workflow, onClose }: WorkflowDetailProps) {
  const { locale } = useLocale();

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-accent bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left: info + implementation recipe */}
        <div className="border-b border-border lg:border-r lg:border-b-0">
          <div className="px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <LevelBadge level={workflow.level} />
                  <span className="font-mono text-xs text-foreground-subtle">
                    ~{workflow.duration}
                  </span>
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  {workflow.title[locale]}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">
                  {workflow.description[locale]}
                </p>
              </div>
              <CloseButton onClose={onClose} className="lg:hidden" />
            </div>

            <SectionLabel>{uiStrings.phasesHeader[locale]}</SectionLabel>

            <div className="flex flex-col">
              {workflow.phases.map((phase, phaseIdx) => (
                <div key={phaseIdx} className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    {phaseIdx < workflow.phases.length - 1 && (
                      <div className="w-px grow bg-border" />
                    )}
                  </div>

                  <div className="flex-1 pb-3">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {phase.name[locale]}
                      </span>
                      <span className="font-mono text-[10px] text-foreground-subtle">
                        {phase.duration}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {phase.steps.map((step, stepIdx) => (
                        <div key={stepIdx}>
                          <div className="flex items-start gap-1.5">
                            <code className="shrink-0 font-mono text-[11px] text-foreground">
                              {step.command}
                            </code>
                            {step.optional && (
                              <span className="shrink-0 rounded-[var(--radius-sm)] border border-border px-1.5 py-0.5 text-[10px] font-medium text-foreground-subtle">
                                {uiStrings.optionalBadge[locale]}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[11px] leading-relaxed text-foreground-muted">
                            {step.description[locale]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {workflow.tips && workflow.tips.length > 0 && (
              <div className="mt-4 border-t border-border pt-4">
                <SectionLabel>{uiStrings.tipsHeader[locale]}</SectionLabel>
                <ul className="flex flex-col gap-1.5">
                  {workflow.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs leading-relaxed text-foreground-muted"
                    >
                      <span
                        aria-hidden
                        className="mt-1 size-1 shrink-0 rounded-full bg-accent"
                      />
                      {tip[locale]}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {workflow.shortcut && (
              <div className="mt-4 border-t border-border pt-4">
                <SectionLabel>{uiStrings.shortcutHeader[locale]}</SectionLabel>
                <code className="font-mono text-xs text-foreground">
                  {workflow.shortcut[locale]}
                </code>
              </div>
            )}
          </div>
        </div>

        {/* Right: ReactFlow canvas */}
        <div className="relative bg-surface p-4">
          <CloseButton
            onClose={onClose}
            className="absolute top-3 right-3 z-10 hidden lg:flex"
          />
          <WorkflowFlowCanvas workflow={workflow} />
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-5 mb-3 text-[11px] font-semibold tracking-wider text-foreground-subtle uppercase">
      {children}
    </h3>
  );
}

function CloseButton({
  onClose,
  className = "",
}: {
  onClose: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClose}
      aria-label="Close"
      className={`inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-ring)] ${className}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path d="M5 5l10 10M15 5L5 15" />
      </svg>
    </button>
  );
}
