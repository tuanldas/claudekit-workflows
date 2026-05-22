import type { WorkflowStep } from "@/types/workflow";

interface FlowStepsProps {
  steps: WorkflowStep[];
}

/**
 * Command chain rendered as mono text with arrow separators — no boxes.
 * Matches Linear/Vercel CLI affordance.
 */
export function FlowSteps({ steps }: FlowStepsProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-xs text-foreground-muted">
      {steps.map((step, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <code className="text-foreground">{step.command}</code>
          {i < steps.length - 1 && (
            <span aria-hidden className="text-foreground-subtle">
              &rarr;
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
