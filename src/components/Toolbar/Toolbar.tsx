"use client";

import { Download, Image as ImageIcon, LayoutDashboard, RotateCcw, Upload } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import type { Edge, Node } from "@xyflow/react";
import { Button } from "../ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { parseImportedDiagram } from "@/lib/persistence";
import type {
  CustomerConfig,
  DiagramEdgeData,
  DiagramNodeData,
  SerializedDiagram,
  VisibilityMap,
} from "@/lib/types";

interface ToolbarProps {
  nodes: Node<DiagramNodeData>[];
  edges: Edge<DiagramEdgeData>[];
  visibility: VisibilityMap;
  customer: CustomerConfig;
  onLoad: (diagram: SerializedDiagram) => void;
  onReset: () => void;
  onAutoLayout: () => void;
  onExportImage: (format: "png" | "svg") => void;
  onError: (msg: string) => void;
}

export function Toolbar({
  nodes,
  edges,
  visibility,
  customer,
  onLoad,
  onReset,
  onAutoLayout,
  onExportImage,
  onError,
}: ToolbarProps) {
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
      customer,
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
      onError(err instanceof Error ? err.message : "Could not parse the diagram file.");
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
      <div className="flex items-center">
        <Image
          src="/okta-logo.svg"
          alt="Okta"
          width={96}
          height={51}
          priority
          draggable={false}
          className="h-9 w-auto dark:invert"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onAutoLayout} variant="default" title="Auto-arrange nodes">
          <LayoutDashboard size={14} />
          <span className="hidden sm:inline">Auto Layout</span>
        </Button>
        <Button
          onClick={() => onExportImage("png")}
          variant="default"
          title="Export as PNG image"
        >
          <ImageIcon size={14} />
          <span className="hidden sm:inline">PNG</span>
        </Button>
        <Button
          onClick={() => onExportImage("svg")}
          variant="default"
          title="Export as SVG image"
        >
          <ImageIcon size={14} />
          <span className="hidden sm:inline">SVG</span>
        </Button>
        <Button onClick={handleImportClick} variant="default" title="Import JSON diagram">
          <Upload size={14} />
          <span className="hidden sm:inline">Import</span>
        </Button>
        <Button onClick={handleExport} variant="default" title="Export JSON diagram">
          <Download size={14} />
          <span className="hidden sm:inline">Export</span>
        </Button>
        <Button onClick={handleReset} variant="ghost" title="Reset diagram to defaults">
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
