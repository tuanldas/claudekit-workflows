import type { WorkflowStep } from "@/types/workflow";

interface FlowStepsProps {
  steps: WorkflowStep[];
}

export function FlowSteps({ steps }: FlowStepsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      {steps.map((step, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-gray-700">
            {step.command}
          </code>
          {i < steps.length - 1 && (
            <span className="text-gray-300">&rarr;</span>
          )}
        </span>
      ))}
    </div>
  );
}
