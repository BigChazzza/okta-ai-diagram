"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type Edge,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import {
  DEFAULT_VISIBILITY,
  INITIAL_NODES,
} from "@/lib/initialState";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "@/lib/persistence";
import { getComponentDefinition } from "@/lib/brandRegistry";
import type {
  CustomerConfig,
  DiagramEdgeData,
  DiagramNodeData,
  SerializedDiagram,
  VisibilityMap,
} from "@/lib/types";

const SAVE_DEBOUNCE_MS = 250;

type DiagramNode = Node<DiagramNodeData>;
type DiagramEdge = Edge<DiagramEdgeData>;

function toRuntimeNode(serialized: SerializedDiagram["nodes"][number]): DiagramNode {
  // Re-sync category from the current registry so nodes saved before a
  // category restructure land under the correct visibility toggle.
  // Label is intentionally NOT overwritten — JSON-supplied labels (1.1) and
  // user renames (2.3) must survive round-trips through localStorage.
  const def = getComponentDefinition(serialized.data.componentId);
  const data = def
    ? { ...serialized.data, category: def.category }
    : serialized.data;
  return {
    id: serialized.id,
    type: serialized.type,
    position: serialized.position,
    data,
  };
}

function toRuntimeEdge(serialized: SerializedDiagram["edges"][number]): DiagramEdge {
  return {
    id: serialized.id,
    source: serialized.source,
    target: serialized.target,
    sourceHandle: serialized.sourceHandle ?? undefined,
    targetHandle: serialized.targetHandle ?? undefined,
    data: serialized.data,
    label: serialized.label,
    type: "labeled",
  };
}

function toSerialized(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  visibility: VisibilityMap,
  customer: CustomerConfig,
): SerializedDiagram {
  return {
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
}

export interface UseDiagramStateResult {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  visibility: VisibilityMap;
  customer: CustomerConfig;
  hydrated: boolean;
  setNodes: React.Dispatch<React.SetStateAction<DiagramNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<DiagramEdge[]>>;
  onNodesChange: OnNodesChange<DiagramNode>;
  onEdgesChange: OnEdgesChange<DiagramEdge>;
  setVisibility: React.Dispatch<React.SetStateAction<VisibilityMap>>;
  setCustomer: React.Dispatch<React.SetStateAction<CustomerConfig>>;
  loadDiagram: (diagram: SerializedDiagram) => void;
  resetDiagram: () => void;
}

export function useDiagramState(): UseDiagramStateResult {
  const [nodes, setNodes] = useState<DiagramNode[]>([]);
  const [edges, setEdges] = useState<DiagramEdge[]>([]);
  const [visibility, setVisibility] = useState<VisibilityMap>(DEFAULT_VISIBILITY);
  const [customer, setCustomer] = useState<CustomerConfig>({});
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  // Hydrate from localStorage exactly once after mount.
  // localStorage is an external system; reading it in an effect and seeding
  // React state is the documented pattern for SSR-safe persistence.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const stored = loadFromLocalStorage();
    if (stored) {
      setNodes(stored.nodes.map(toRuntimeNode));
      setEdges(stored.edges.map(toRuntimeEdge));
      setVisibility(stored.visibility);
      if (stored.customer) setCustomer(stored.customer);
    } else {
      setNodes(INITIAL_NODES.map(toRuntimeNode));
      setVisibility(DEFAULT_VISIBILITY);
    }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Debounced persistence
  useEffect(() => {
    if (!hydrated) return;
    const id = window.setTimeout(() => {
      saveToLocalStorage(toSerialized(nodes, edges, visibility, customer));
    }, SAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [nodes, edges, visibility, customer, hydrated]);

  const onNodesChange: OnNodesChange<DiagramNode> = useCallback((changes) => {
    setNodes((current) => applyNodeChanges(changes, current));
  }, []);

  const onEdgesChange: OnEdgesChange<DiagramEdge> = useCallback((changes) => {
    setEdges((current) => applyEdgeChanges(changes, current));
  }, []);

  const loadDiagram = useCallback((diagram: SerializedDiagram) => {
    setNodes(diagram.nodes.map(toRuntimeNode));
    setEdges(diagram.edges.map(toRuntimeEdge));
    setVisibility(diagram.visibility);
    setCustomer(diagram.customer ?? {});
  }, []);

  const resetDiagram = useCallback(() => {
    setNodes(INITIAL_NODES.map(toRuntimeNode));
    setEdges([]);
    setVisibility(DEFAULT_VISIBILITY);
    setCustomer({});
  }, []);

  return {
    nodes,
    edges,
    visibility,
    customer,
    hydrated,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    setVisibility,
    setCustomer,
    loadDiagram,
    resetDiagram,
  };
}
