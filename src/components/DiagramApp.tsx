"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { DiagramCanvas } from "./Canvas/DiagramCanvas";
import { Sidebar } from "./Sidebar/Sidebar";
import { Toolbar } from "./Toolbar/Toolbar";
import { useDiagramState } from "@/hooks/useDiagramState";

export default function DiagramApp() {
  const {
    nodes,
    edges,
    visibility,
    hydrated,
    onNodesChange,
    onEdgesChange,
    setNodes,
    setEdges,
    setVisibility,
    loadDiagram,
    resetDiagram,
  } = useDiagramState();

  if (!hydrated) {
    return (
      <div className="grid h-screen w-screen place-items-center bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
        <div className="text-sm">Loading diagram…</div>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-100 dark:bg-slate-950">
        <Toolbar
          nodes={nodes}
          edges={edges}
          visibility={visibility}
          onLoad={loadDiagram}
          onReset={resetDiagram}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            nodes={nodes}
            visibility={visibility}
            onSetVisibility={setVisibility}
          />
          <main className="relative flex-1 bg-slate-50 dark:bg-slate-900">
            <DiagramCanvas
              nodes={nodes}
              edges={edges}
              visibility={visibility}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              setNodes={setNodes}
              setEdges={setEdges}
            />
          </main>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
