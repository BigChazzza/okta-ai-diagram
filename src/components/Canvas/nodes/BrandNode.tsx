"use client";

import { type NodeProps } from "@xyflow/react";
import { BrandLogo } from "../BrandLogo";
import { EditableLabel } from "../EditableLabel";
import { NodeShell } from "../NodeShell";
import { getComponentDefinition } from "@/lib/brandRegistry";
import type { DiagramNodeData } from "@/lib/types";

const NODE_WIDTH = 144;
const NODE_HEIGHT = 96;

export function BrandNode(props: NodeProps) {
  const { id, data, selected } = props as NodeProps & {
    data: DiagramNodeData;
  };
  const def = getComponentDefinition(data.componentId);
  const color = def?.color ?? "#475569";
  const slug = def?.simpleIconsSlug;
  const lucideIcon = def?.lucideIcon;
  const monogram = def?.fallbackMonogram ?? data.label.slice(0, 2).toUpperCase();

  return (
    <NodeShell
      nodeId={id}
      selected={selected}
      ariaLabel={data.label}
      width={NODE_WIDTH}
      height={NODE_HEIGHT}
      className="flex flex-col items-center justify-center gap-2 rounded-2xl border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
      style={{ borderColor: color }}
    >
      <div
        className="grid h-12 w-12 place-items-center rounded-xl"
        style={{ background: color }}
      >
        <BrandLogo
          slug={slug}
          lucideIcon={lucideIcon}
          fallbackMonogram={monogram}
          color="#FFFFFF"
        />
      </div>
      <EditableLabel
        nodeId={id}
        label={data.label}
        className="px-2 text-[11px] font-semibold leading-tight text-slate-700 dark:text-slate-100"
      />
    </NodeShell>
  );
}
