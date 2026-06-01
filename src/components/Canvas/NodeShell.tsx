"use client";

import { Handle, Position, useReactFlow } from "@xyflow/react";
import { X } from "lucide-react";
import { useState, type CSSProperties, type ReactNode } from "react";

const HANDLE_BASE_STYLE: CSSProperties = {
  width: 10,
  height: 10,
  background: "#94a3b8",
  border: "2px solid #f8fafc",
  transition: "opacity 120ms ease",
};

const POSITIONS: Position[] = [
  Position.Top,
  Position.Right,
  Position.Bottom,
  Position.Left,
];

interface NodeShellProps {
  nodeId: string;
  selected?: boolean;
  ariaLabel: string;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  onContextMenu?: (e: React.MouseEvent) => void;
}

/**
 * Wraps custom node content with handles, hover X delete, and consistent framing.
 */
export function NodeShell({
  nodeId,
  selected,
  ariaLabel,
  width,
  height,
  className,
  style,
  children,
  onContextMenu,
}: NodeShellProps) {
  const { setNodes, setEdges } = useReactFlow();
  const [hover, setHover] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((ns) => ns.filter((n) => n.id !== nodeId));
    setEdges((es) => es.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onContextMenu={onContextMenu}
      className={`relative ${className ?? ""}`.trim()}
      style={{
        width,
        height,
        ...style,
        outline: selected ? "2px solid #007DC1" : "none",
        outlineOffset: 2,
        borderRadius: 14,
      }}
    >
      {hover && (
        <button
          type="button"
          onClick={handleDelete}
          aria-label={`Remove ${ariaLabel}`}
          className="absolute -top-2 -right-2 z-10 grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-white shadow-md transition hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          <X size={12} strokeWidth={3} />
        </button>
      )}
      {children}
      {POSITIONS.map((pos) => (
        <Handle
          key={pos}
          id={pos}
          type="source"
          position={pos}
          style={{
            ...HANDLE_BASE_STYLE,
            opacity: hover || selected ? 1 : 0,
            pointerEvents: hover || selected ? "auto" : "none",
          }}
        />
      ))}
    </div>
  );
}
