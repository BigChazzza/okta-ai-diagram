"use client";

import { type NodeProps } from "@xyflow/react";
import { Building2 } from "lucide-react";
import { EditableLabel } from "../EditableLabel";
import { NodeShell } from "../NodeShell";
import { useCustomer } from "@/contexts/CustomerContext";

const NODE_WIDTH = 160;
const NODE_HEIGHT = 104;

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0).toUpperCase()).join("") || "?";
}

export function CustomerNode(props: NodeProps) {
  const { id, selected } = props;
  const customer = useCustomer();
  const displayName = customer.name?.trim() || "Customer";
  const logoSrc = customer.logoDataUrl ?? customer.logoUrl;

  return (
    <NodeShell
      nodeId={id}
      selected={selected}
      ariaLabel={displayName}
      width={NODE_WIDTH}
      height={NODE_HEIGHT}
      className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white shadow-sm dark:border-slate-600 dark:bg-slate-800"
    >
      <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300">
        {logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoSrc}
            alt={`${displayName} logo`}
            className="h-full w-full object-contain"
            draggable={false}
          />
        ) : customer.name ? (
          <span className="text-sm font-bold tracking-tight">
            {getInitials(customer.name)}
          </span>
        ) : (
          <Building2 size={22} />
        )}
      </div>
      <EditableLabel
        nodeId={id}
        label={displayName}
        className="max-w-[140px] px-2 text-[11px] font-semibold leading-tight text-slate-700 dark:text-slate-100"
      />
    </NodeShell>
  );
}
