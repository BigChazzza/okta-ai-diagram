"use client";

import Image from "next/image";
import { type NodeProps } from "@xyflow/react";
import { NodeShell } from "../NodeShell";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 120;

export function OktaLogoNode(props: NodeProps) {
  const { id, selected } = props;

  return (
    <NodeShell
      nodeId={id}
      selected={selected}
      ariaLabel="Okta"
      width={NODE_WIDTH}
      height={NODE_HEIGHT}
      className="grid place-items-center rounded-2xl border-2 bg-white shadow-md dark:bg-slate-50"
      style={{ borderColor: "#007DC1" }}
    >
      <Image
        src="/okta-logo.svg"
        alt="Okta"
        width={140}
        height={48}
        priority
        draggable={false}
      />
    </NodeShell>
  );
}
