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
    <div className="overflow-hidden rounded-xl border-2 border-orange-300 bg-white shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left: info + implementation recipe */}
        <div className="border-b border-gray-100 lg:border-r lg:border-b-0">
          <div className="px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <LevelBadge level={workflow.level} />
                  <span className="font-mono text-xs text-gray-400">
                    ~{workflow.duration}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {workflow.title[locale]}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {workflow.description[locale]}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 lg:hidden"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>

            <h3 className="mt-5 mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              {uiStrings.phasesHeader[locale]}
            </h3>

            <div className="flex flex-col">
              {workflow.phases.map((phase, phaseIdx) => (
                <div key={phaseIdx} className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-400" />
                    {phaseIdx < workflow.phases.length - 1 && (
                      <div className="w-px grow bg-gray-200" />
                    )}
                  </div>

                  <div className="flex-1 pb-3">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {phase.name[locale]}
                      </span>
                      <span className="font-mono text-[10px] text-gray-400">
                        {phase.duration}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {phase.steps.map((step, stepIdx) => (
                        <div key={stepIdx}>
                          <div className="flex items-start gap-1.5">
                            <code className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-mono text-gray-700">
                              {step.command}
                            </code>
                            {step.optional && (
                              <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                                {uiStrings.optionalBadge[locale]}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">
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
              <div className="mt-4 border-t border-gray-100 pt-4">
                <h3 className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  {uiStrings.tipsHeader[locale]}
                </h3>
                <ul className="flex flex-col gap-1">
                  {workflow.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-gray-600"
                    >
                      <span className="mt-0.5 shrink-0 text-orange-400">
                        &#9679;
                      </span>
                      {tip[locale]}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {workflow.shortcut && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <h3 className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  {uiStrings.shortcutHeader[locale]}
                </h3>
                <code className="text-xs text-gray-700">
                  {workflow.shortcut[locale]}
                </code>
              </div>
            )}
          </div>
        </div>

        {/* Right: ReactFlow canvas */}
        <div className="relative p-4">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 z-10 hidden rounded-lg bg-white/90 p-1.5 text-gray-400 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-gray-600 lg:block"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
          <WorkflowFlowCanvas workflow={workflow} />
        </div>
      </div>
    </div>
  );
}
