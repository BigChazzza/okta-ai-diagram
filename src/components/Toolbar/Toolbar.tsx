"use client";

import { Download, RotateCcw, Upload } from "lucide-react";
import { useRef } from "react";
import type { Edge, Node } from "@xyflow/react";
import { Button } from "../ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { parseImportedDiagram } from "@/lib/persistence";
import type {
  DiagramEdgeData,
  DiagramNodeData,
  SerializedDiagram,
  VisibilityMap,
} from "@/lib/types";

interface ToolbarProps {
  nodes: Node<DiagramNodeData>[];
  edges: Edge<DiagramEdgeData>[];
  visibility: VisibilityMap;
  onLoad: (diagram: SerializedDiagram) => void;
  onReset: () => void;
}

export function Toolbar({ nodes, edges, visibility, onLoad, onReset }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExport = () => {
    const payload: SerializedDiagram = {
      version: 1,
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type ?? "brand",
        position: n.position,
        data: n.data as DiagramNodeData,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle ?? undefined,
        targetHandle: e.targetHandle ?? undefined,
        data: e.data,
        label: typeof e.label === "string" ? e.label : undefined,
      })),
      visibility,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const stamp = new Date().toISOString().slice(0, 10);
    a.download = `okta-ai-diagram-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const diagram = parseImportedDiagram(text);
      onLoad(diagram);
    } catch (err) {
      window.alert(
        "Could not import this file:\n\n" +
          (err instanceof Error ? err.message : String(err)),
      );
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Reset the diagram? This will remove all components and put the Okta logo back at the center.",
      )
    ) {
      onReset();
    }
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-[#007DC1] text-[10px] font-bold text-white">
          OKTA
        </span>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            AI Architecture Diagram
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            Drag, connect, and label your story.
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={handleImportClick} variant="default">
          <Upload size={14} />
          <span className="hidden sm:inline">Import</span>
        </Button>
        <Button onClick={handleExport} variant="default">
          <Download size={14} />
          <span className="hidden sm:inline">Export</span>
        </Button>
        <Button onClick={handleReset} variant="ghost">
          <RotateCcw size={14} />
          <span className="hidden sm:inline">Reset</span>
        </Button>
        <ThemeToggle />
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </header>
  );
}
