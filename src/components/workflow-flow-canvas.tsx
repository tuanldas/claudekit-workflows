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

const phaseColors = [
  { border: "border-t-rose-500", bg: "bg-rose-50", text: "text-rose-700" },
  { border: "border-t-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
  {
    border: "border-t-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  { border: "border-t-sky-500", bg: "bg-sky-50", text: "text-sky-700" },
  {
    border: "border-t-violet-500",
    bg: "bg-violet-50",
    text: "text-violet-700",
  },
  { border: "border-t-pink-500", bg: "bg-pink-50", text: "text-pink-700" },
];

type PhaseNodeData = {
  title: string;
  command: string;
  colorIndex: number;
};

function PhaseNode({ data }: NodeProps) {
  const d = data as PhaseNodeData;
  const colors = phaseColors[d.colorIndex % phaseColors.length];

  return (
    <div
      className={`min-w-[180px] rounded-md border border-t-4 border-gray-200 bg-white px-3 py-2 shadow-sm ${colors.border}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-0 !bg-gray-300"
      />
      <div className="text-sm font-semibold text-gray-900">{d.title}</div>
      <code
        className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-mono ${colors.bg} ${colors.text}`}
      >
        {d.command}
      </code>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-0 !bg-gray-300"
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
      labelStyle: { fontSize: 10, fill: "#6b7280", fontWeight: 500 },
      labelBgStyle: { fill: "white" },
      labelBgPadding: [4, 2],
      style: { stroke: "#d1d5db", strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#d1d5db" },
    }));

    return { nodes, edges };
  }, [workflow, locale]);

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
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
        <Background gap={20} size={1} color="#e5e7eb" />
        <Controls
          showInteractive={false}
          className="!border-gray-200 !bg-white !shadow-sm"
        />
      </ReactFlow>
    </div>
  );
}
