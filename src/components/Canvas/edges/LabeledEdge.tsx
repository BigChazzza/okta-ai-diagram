"use client";

import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
  useReactFlow,
} from "@xyflow/react";

const LABEL_BG = "#0f172a";

export function LabeledEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    label,
    selected,
    markerEnd,
    style,
  } = props;
  const { setEdges } = useReactFlow();

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
  });

  const editLabel = () => {
    const next = window.prompt("Label this connection:", typeof label === "string" ? label : "");
    if (next === null) return;
    const trimmed = next.trim();
    setEdges((edges) =>
      edges.map((e) =>
        e.id === id
          ? {
              ...e,
              label: trimmed.length ? trimmed : undefined,
              data: { ...(e.data ?? {}), label: trimmed.length ? trimmed : undefined },
            }
          : e,
      ),
    );
  };

  const stroke = selected ? "#007DC1" : "#64748b";

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke,
          strokeWidth: selected ? 2.5 : 1.75,
          ...style,
        }}
      />
      <EdgeLabelRenderer>
        <div
          onDoubleClick={editLabel}
          className="nodrag nopan absolute pointer-events-auto"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          {label ? (
            <span
              className="rounded-md px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm"
              style={{ background: LABEL_BG }}
            >
              {label}
            </span>
          ) : (
            <span className="rounded-md bg-white/60 px-1 py-0.5 text-[9px] text-slate-500 opacity-0 transition group-hover:opacity-100 hover:opacity-100 dark:bg-slate-900/60 dark:text-slate-400">
              dbl-click to label
            </span>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
