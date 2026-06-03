import { NextResponse } from "next/server";
import { COMPONENT_REGISTRY } from "@/lib/brandRegistry";

const COMPONENTS = COMPONENT_REGISTRY.filter(
  (c) => c.category !== "okta-logo",
).map((c) => ({
  componentId: c.id,
  label: c.label,
  category: c.category,
  nodeType: c.nodeType,
}));

const SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Okta AI Diagram",
  description:
    "Schema for import/export JSON used by the Okta AI Architecture diagram tool.",
  version: 1,
  components: COMPONENTS,
  categories: [
    "strategy",
    "users",
    "ai-agents",
    "resources",
    "okta-components",
  ],
  nodeShape: {
    description: "Shape of each entry in the nodes array",
    fields: {
      id: "string — unique identifier for this node instance",
      type: "brand | okta-component | okta-logo | customer",
      position: { x: "number", y: "number" },
      data: {
        componentId: "string — must match a componentId from components[] above",
        category: "string — must match the category for the given componentId",
        label:
          "string — visible title on the node; if omitted defaults to the component label",
      },
    },
  },
  edgeShape: {
    description: "Shape of each entry in the edges array",
    fields: {
      id: "string — unique",
      source: "string — id of the source node",
      target: "string — id of the target node",
      sourceHandle:
        "top | right | bottom | left — which side of the source node the edge leaves from",
      targetHandle:
        "top | right | bottom | left — which side of the target node the edge arrives at",
      label: "string (optional) — text shown on the edge mid-point",
      type: "labeled (default — all edges use the custom labeled type)",
    },
  },
  customerShape: {
    description: "Optional customer branding. Supply any combination of fields.",
    fields: {
      name: "string — display name shown on customer nodes",
      logoDataUrl:
        "string — base64 data URL of the customer logo (data:image/png;base64,...)",
      logoUrl: "string — public URL of the customer logo image",
    },
  },
  visibilityShape: {
    description:
      "Map of category → boolean controlling canvas visibility. All default to true.",
    fields: {
      customer: "boolean",
      strategy: "boolean",
      users: "boolean",
      "ai-agents": "boolean",
      resources: "boolean",
      "okta-components": "boolean",
      "okta-logo": "boolean",
    },
  },
};

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(SCHEMA, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
