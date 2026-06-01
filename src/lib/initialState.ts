import type {
  SerializedDiagram,
  SerializedNode,
  VisibilityMap,
} from "./types";

export const OKTA_LOGO_NODE_ID = "okta-logo";

export const INITIAL_NODES: SerializedNode[] = [
  {
    id: OKTA_LOGO_NODE_ID,
    type: "okta-logo",
    position: { x: 480, y: 280 },
    data: {
      componentId: "okta-logo",
      category: "okta-logo",
      label: "Okta",
    },
  },
];

export const DEFAULT_VISIBILITY: VisibilityMap = {
  customer: true,
  strategy: true,
  "ai-agents": true,
  resources: true,
  "okta-components": true,
  "okta-logo": true,
};

export const INITIAL_DIAGRAM: SerializedDiagram = {
  version: 1,
  nodes: INITIAL_NODES,
  edges: [],
  visibility: DEFAULT_VISIBILITY,
};
