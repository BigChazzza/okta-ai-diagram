"use client";

import { type NodeProps } from "@xyflow/react";
import { NodeShell } from "../NodeShell";
import { getComponentDefinition } from "@/lib/brandRegistry";
import type { DiagramNodeData } from "@/lib/types";

const NODE_WIDTH = 168;
const NODE_HEIGHT = 78;

export function OktaComponentNode(props: NodeProps) {
  const { id, data, selected } = props as NodeProps & {
    data: DiagramNodeData;
  };
  const def = getComponentDefinition(data.componentId);
  const color = def?.color ?? "#007DC1";

  return (
    <NodeShell
      nodeId={id}
      selected={selected}
      ariaLabel={data.label}
      width={NODE_WIDTH}
      height={NODE_HEIGHT}
      className="flex items-center justify-center rounded-xl border-2 border-dashed bg-sky-50 px-3 text-center shadow-sm dark:bg-slate-900"
      style={{ borderColor: color }}
    >
      <div className="flex flex-col items-center gap-1">
        <span
          className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white"
          style={{ background: color }}
        >
          Okta
        </span>
        <span className="text-xs font-semibold leading-tight text-slate-800 dark:text-slate-100">
          {data.label}
        </span>
      </div>
    </NodeShell>
  );
}
