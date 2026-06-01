"use client";

import { type NodeProps } from "@xyflow/react";
import { NodeShell } from "../NodeShell";
import { OktaIcon } from "@/components/OktaIcon";
import { getComponentDefinition } from "@/lib/brandRegistry";
import type { DiagramNodeData } from "@/lib/types";

const NODE_WIDTH = 196;
const NODE_HEIGHT = 72;

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
      className="flex items-center gap-2 rounded-xl border-2 border-solid bg-transparent px-3 shadow-sm"
      style={{ borderColor: color }}
    >
      <div className="grid h-9 w-9 shrink-0 place-items-center text-slate-900 dark:text-slate-100">
        <OktaIcon size={32} color="currentColor" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[9px] font-semibold uppercase tracking-wide text-[#007DC1]">
          Okta
        </div>
        <div className="truncate text-xs font-semibold leading-tight text-slate-800 dark:text-slate-100">
          {data.label}
        </div>
      </div>
    </NodeShell>
  );
}
