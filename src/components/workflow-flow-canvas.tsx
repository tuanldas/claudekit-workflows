"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type { Workflow } from "@/types/workflow";
import { useLocale } from "@/i18n/language-context";

/**
 * Top-border colors cycled per phase to visually differentiate nodes. Kept as
 * a rainbow on purpose — each phase has a distinct hue — but tones are
 * desaturated so they sit harmoniously with the cinnabar accent system.
 */
const phaseTopColors = [
  "var(--color-accent)",
  "var(--color-warning)",
  "var(--color-success)",
  "#6366f1", // indigo
  "#a855f7", // violet
  "#ec4899", // pink
];

type PhaseNodeData = {
  title: string;
  command: string;
  colorIndex: number;
};

function PhaseNode({ data }: NodeProps) {
  const d = data as PhaseNodeData;
  const topColor = phaseTopColors[d.colorIndex % phaseTopColors.length];

  return (
    <div
      style={{ borderTopColor: topColor }}
      className="min-w-[180px] rounded-[var(--radius-md)] border border-t-[3px] border-border bg-background px-3 py-2 shadow-sm"
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!size-2 !border-0"
        style={{ background: "var(--color-foreground-subtle)" }}
      />
      <div className="text-sm font-semibold text-foreground">{d.title}</div>
      <code className="mt-1 inline-block font-mono text-[11px] text-foreground-muted">
        {d.command}
      </code>
      <Handle
        type="source"
        position={Position.Right}
        className="!size-2 !border-0"
        style={{ background: "var(--color-foreground-subtle)" }}
      />
    </div>
  );
}

const nodeTypes = { phase: PhaseNode };

interface WorkflowFlowCanvasProps {
  workflow: Workflow;
}

export function WorkflowFlowCanvas({ workflow }: WorkflowFlowCanvasProps) {
  const { locale } = useLocale();

  const { nodes, edges } = useMemo(() => {
    const nodeSpacing = 240;
    const nodes: Node[] = workflow.phases.map((phase, i) => ({
      id: `phase-${i}`,
      type: "phase",
      position: { x: i * nodeSpacing, y: 80 },
      data: {
        title: phase.name[locale],
        command: phase.steps[0]?.command ?? "",
        colorIndex: i,
      },
      draggable: true,
    }));

    const edges: Edge[] = workflow.phases.slice(0, -1).map((_, i) => ({
      id: `e-${i}`,
      source: `phase-${i}`,
      target: `phase-${i + 1}`,
      type: "smoothstep",
      animated: false,
      label: workflow.steps[i]?.label[locale] ?? "",
      labelStyle: {
        fontSize: 10,
        fill: "var(--color-foreground-muted)",
        fontWeight: 500,
      },
      labelBgStyle: { fill: "var(--color-background)" },
      labelBgPadding: [4, 2],
      style: {
        stroke: "var(--color-border-strong)",
        strokeWidth: 1.5,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "var(--color-border-strong)",
      },
    }));

    return { nodes, edges };
  }, [workflow, locale]);

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-[var(--radius-md)] border border-border bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.5}
        maxZoom={2}
      >
        <Background gap={20} size={1} color="var(--color-border)" />
        <Controls
          showInteractive={false}
          style={{
            background: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
          }}
        />
      </ReactFlow>
    </div>
  );
}
