export type CategoryKey =
  | "customer"
  | "strategy"
  | "ai-agents"
  | "resources"
  | "okta-components"
  | "okta-logo";

export type NodeKind = "brand" | "okta-component" | "okta-logo" | "customer";

export interface CustomerConfig {
  name?: string;
  logoDataUrl?: string;
}

export interface ComponentDefinition {
  id: string;
  label: string;
  category: CategoryKey;
  simpleIconsSlug?: string;
  fallbackMonogram: string;
  color: string;
  accentColor?: string;
  nodeType: NodeKind;
}

export interface DiagramNodeData {
  componentId: string;
  category: CategoryKey;
  label: string;
  [key: string]: unknown;
}

export interface DiagramEdgeData {
  label?: string;
  [key: string]: unknown;
}

export interface SerializedNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: DiagramNodeData;
}

export interface SerializedEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  data?: DiagramEdgeData;
  label?: string;
}

export type VisibilityMap = Record<CategoryKey, boolean>;

export interface SerializedDiagram {
  version: 1;
  nodes: SerializedNode[];
  edges: SerializedEdge[];
  visibility: VisibilityMap;
  customer?: CustomerConfig;
}
