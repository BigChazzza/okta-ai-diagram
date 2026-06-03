"use client";

import { useCallback, useEffect } from "react";
import { ReactFlowProvider, useReactFlow } from "@xyflow/react";
import { toPng, toSvg } from "html-to-image";
import { DiagramCanvas } from "./Canvas/DiagramCanvas";
import { Sidebar } from "./Sidebar/Sidebar";
import { Toolbar } from "./Toolbar/Toolbar";
import { ToastStack } from "./ToastStack";
import { CustomerProvider } from "@/contexts/CustomerContext";
import { useDiagramState } from "@/hooks/useDiagramState";
import { useToast } from "@/hooks/useToast";
import { applyAutoLayout } from "@/lib/autoLayout";
import { parseImportedDiagram, clearStoredDiagram } from "@/lib/persistence";

interface DiagramAppProps {
  configUrl?: string;
}

// Separate inner component so useReactFlow is inside the provider
function DiagramInner({ configUrl }: DiagramAppProps) {
  const {
    nodes,
    edges,
    visibility,
    customer,
    hydrated,
    onNodesChange,
    onEdgesChange,
    setNodes,
    setEdges,
    setVisibility,
    setCustomer,
    loadDiagram,
    resetDiagram,
  } = useDiagramState();

  const { fitView } = useReactFlow();
  const { toasts, show: showToast, dismiss } = useToast();

  // Load from ?config=<url> after hydration
  useEffect(() => {
    if (!hydrated || !configUrl) return;
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(configUrl, { signal: controller.signal });
        if (!res.ok) {
          showToast(
            `Failed to fetch config URL (HTTP ${res.status}): ${configUrl}`,
            "error",
          );
          return;
        }
        const json = await res.text();
        const diagram = parseImportedDiagram(json);
        loadDiagram(diagram);
        setTimeout(() => fitView({ padding: 0.2 }), 100);
      } catch (err) {
        if ((err as { name?: string }).name === "AbortError") return;
        showToast(
          `Could not load config URL: ${err instanceof Error ? err.message : String(err)}`,
          "error",
        );
      }
    })();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, configUrl]);

  const handleAutoLayout = useCallback(() => {
    setNodes((current) => applyAutoLayout(current, edges));
    setTimeout(() => fitView({ padding: 0.2 }), 50);
  }, [edges, setNodes, fitView]);

  const handleExportImage = useCallback(
    async (format: "png" | "svg") => {
      const el = document.querySelector<HTMLElement>(".react-flow");
      if (!el) return;
      try {
        const stamp = new Date().toISOString().slice(0, 10);
        if (format === "png") {
          const url = await toPng(el, { pixelRatio: 2 });
          const a = document.createElement("a");
          a.href = url;
          a.download = `okta-ai-diagram-${stamp}.png`;
          a.click();
        } else {
          const url = await toSvg(el);
          const a = document.createElement("a");
          a.href = url;
          a.download = `okta-ai-diagram-${stamp}.svg`;
          a.click();
        }
      } catch (err) {
        showToast(
          `Image export failed: ${err instanceof Error ? err.message : String(err)}`,
          "error",
        );
      }
    },
    [showToast],
  );

  const handleReset = useCallback(() => {
    clearStoredDiagram();
    resetDiagram();
    setTimeout(() => fitView({ padding: 0.25 }), 50);
  }, [resetDiagram, fitView]);

  const handleError = useCallback(
    (msg: string) => showToast(msg, "error"),
    [showToast],
  );

  if (!hydrated) {
    return (
      <div className="grid h-screen w-screen place-items-center bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
        <div className="text-sm">Loading diagram…</div>
      </div>
    );
  }

  return (
    <CustomerProvider value={customer}>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-100 dark:bg-slate-950">
        <Toolbar
          nodes={nodes}
          edges={edges}
          visibility={visibility}
          customer={customer}
          onLoad={loadDiagram}
          onReset={handleReset}
          onAutoLayout={handleAutoLayout}
          onExportImage={handleExportImage}
          onError={handleError}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            nodes={nodes}
            visibility={visibility}
            customer={customer}
            onSetVisibility={setVisibility}
            onSetCustomer={setCustomer}
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
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </CustomerProvider>
  );
}

export default function DiagramApp(props: DiagramAppProps) {
  return (
    <ReactFlowProvider>
      <DiagramInner {...props} />
    </ReactFlowProvider>
  );
}
