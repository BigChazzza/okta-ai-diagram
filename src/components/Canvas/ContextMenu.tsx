"use client";

import { useEffect, useRef } from "react";
import { useReactFlow } from "@xyflow/react";

export interface ContextMenuState {
  type: "node" | "edge";
  id: string;
  x: number;
  y: number;
}

interface ContextMenuProps {
  menu: ContextMenuState | null;
  onClose: () => void;
}

export function ContextMenu({ menu, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { setNodes, setEdges, getEdges } = useReactFlow();

  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("mousedown", close);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", onEsc);
    };
  }, [menu, onClose]);

  if (!menu) return null;

  const remove = () => {
    if (menu.type === "node") {
      setNodes((ns) => ns.filter((n) => n.id !== menu.id));
      setEdges((es) =>
        es.filter((e) => e.source !== menu.id && e.target !== menu.id),
      );
    } else {
      setEdges((es) => es.filter((e) => e.id !== menu.id));
    }
    onClose();
  };

  const renameEdge = () => {
    const edge = getEdges().find((e) => e.id === menu.id);
    if (!edge) return;
    const current = typeof edge.label === "string" ? edge.label : "";
    const next = window.prompt("Label this connection:", current);
    if (next === null) {
      onClose();
      return;
    }
    const trimmed = next.trim();
    setEdges((es) =>
      es.map((e) =>
        e.id === menu.id
          ? {
              ...e,
              label: trimmed.length ? trimmed : undefined,
              data: { ...(e.data ?? {}), label: trimmed.length ? trimmed : undefined },
            }
          : e,
      ),
    );
    onClose();
  };

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Context menu"
      style={{ left: menu.x, top: menu.y }}
      className="fixed z-50 min-w-[160px] overflow-hidden rounded-lg border border-slate-200 bg-white text-sm shadow-xl dark:border-slate-700 dark:bg-slate-800"
    >
      {menu.type === "edge" && (
        <button
          type="button"
          onClick={renameEdge}
          className="block w-full px-3 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          Edit label…
        </button>
      )}
      <button
        type="button"
        onClick={remove}
        className="block w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
      >
        Delete
      </button>
    </div>
  );
}
