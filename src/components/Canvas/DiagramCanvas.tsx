"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  type Connection,
  type Edge,
  type EdgeTypes,
  MarkerType,
  MiniMap,
  type Node,
  type NodeTypes,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  ReactFlow,
  addEdge,
  useReactFlow,
} from "@xyflow/react";
import { nanoid } from "nanoid";
import { BrandNode } from "./nodes/BrandNode";
import { OktaComponentNode } from "./nodes/OktaComponentNode";
import { OktaLogoNode } from "./nodes/OktaLogoNode";
import { LabeledEdge } from "./edges/LabeledEdge";
import { ContextMenu, type ContextMenuState } from "./ContextMenu";
import { getComponentDefinition } from "@/lib/brandRegistry";
import { DRAG_MIME } from "@/lib/dragMime";
import type {
  DiagramEdgeData,
  DiagramNodeData,
  VisibilityMap,
} from "@/lib/types";

const nodeTypes: NodeTypes = {
  brand: BrandNode,
  "okta-component": OktaComponentNode,
  "okta-logo": OktaLogoNode,
};

const edgeTypes: EdgeTypes = {
  labeled: LabeledEdge,
};

const defaultEdgeOptions = {
  type: "labeled",
  markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b", width: 18, height: 18 },
};

interface DiagramCanvasProps {
  nodes: Node<DiagramNodeData>[];
  edges: Edge<DiagramEdgeData>[];
  visibility: VisibilityMap;
  onNodesChange: OnNodesChange<Node<DiagramNodeData>>;
  onEdgesChange: OnEdgesChange<Edge<DiagramEdgeData>>;
  setNodes: React.Dispatch<React.SetStateAction<Node<DiagramNodeData>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge<DiagramEdgeData>[]>>;
}

export function DiagramCanvas({
  nodes,
  edges,
  visibility,
  onNodesChange,
  onEdgesChange,
  setNodes,
  setEdges,
}: DiagramCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [menu, setMenu] = useState<ContextMenuState | null>(null);

  const visibleNodes = useMemo(
    () =>
      nodes.map((n) => {
        const cat = (n.data as DiagramNodeData).category;
        return { ...n, hidden: !visibility[cat] };
      }),
    [nodes, visibility],
  );

  const hiddenNodeIds = useMemo(() => {
    const set = new Set<string>();
    visibleNodes.forEach((n) => {
      if (n.hidden) set.add(n.id);
    });
    return set;
  }, [visibleNodes]);

  const visibleEdges = useMemo(
    () =>
      edges.map((e) => ({
        ...e,
        hidden: hiddenNodeIds.has(e.source) || hiddenNodeIds.has(e.target),
      })),
    [edges, hiddenNodeIds],
  );

  const onConnect = useCallback<OnConnect>(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            id: `edge-${nanoid(8)}`,
            type: "labeled",
            markerEnd: defaultEdgeOptions.markerEnd,
          },
          eds,
        ),
      );
    },
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const componentId = event.dataTransfer.getData(DRAG_MIME);
      if (!componentId) return;
      const def = getComponentDefinition(componentId);
      if (!def || def.nodeType === "okta-logo") return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node<DiagramNodeData> = {
        id: `${def.id}-${nanoid(6)}`,
        type: def.nodeType,
        position,
        data: {
          componentId: def.id,
          category: def.category,
          label: def.label,
        },
      };
      setNodes((ns) => ns.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  const onNodeContextMenu = useCallback((e: React.MouseEvent, node: Node) => {
    e.preventDefault();
    setMenu({ type: "node", id: node.id, x: e.clientX, y: e.clientY });
  }, []);

  const onEdgeContextMenu = useCallback((e: React.MouseEvent, edge: Edge) => {
    e.preventDefault();
    setMenu({ type: "edge", id: edge.id, x: e.clientX, y: e.clientY });
  }, []);

  const onPaneClick = useCallback(() => setMenu(null), []);

  return (
    <div ref={wrapperRef} className="relative h-full w-full" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={visibleNodes}
        edges={visibleEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneClick={onPaneClick}
        fitView
        fitViewOptions={{ padding: 0.25, maxZoom: 1.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} />
        <Controls position="bottom-right" showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          position="bottom-left"
          nodeColor={(n) => {
            const def = getComponentDefinition((n.data as DiagramNodeData)?.componentId);
            return def?.color ?? "#94a3b8";
          }}
          className="rounded-lg !border-slate-300 dark:!border-slate-600"
        />
      </ReactFlow>
      <ContextMenu menu={menu} onClose={() => setMenu(null)} />
    </div>
  );
}
