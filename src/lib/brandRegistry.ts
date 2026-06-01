import type { ComponentDefinition } from "./types";

export const COMPONENT_REGISTRY: ComponentDefinition[] = [
  // Customer (config-driven; not listed in regular sidebar categories)
  {
    id: "customer",
    label: "Customer",
    category: "customer",
    fallbackMonogram: "C",
    color: "#475569",
    nodeType: "customer",
  },

  // Users
  {
    id: "user",
    label: "User",
    category: "users",
    lucideIcon: "user",
    fallbackMonogram: "U",
    color: "#0891B2",
    nodeType: "brand",
  },
  {
    id: "user-groups",
    label: "User Groups",
    category: "users",
    lucideIcon: "users",
    fallbackMonogram: "UG",
    color: "#0891B2",
    nodeType: "brand",
  },

  // AI Agents
  {
    id: "custom-agent",
    label: "Custom Agent",
    category: "ai-agents",
    fallbackMonogram: "CA",
    color: "#6366F1",
    nodeType: "brand",
  },
  {
    id: "claude",
    label: "Claude",
    category: "ai-agents",
    simpleIconsSlug: "claude",
    fallbackMonogram: "C",
    color: "#D97757",
    nodeType: "brand",
  },
  {
    id: "codex",
    label: "Codex",
    category: "ai-agents",
    fallbackMonogram: "Cx",
    color: "#1F2937",
    nodeType: "brand",
  },
  {
    id: "copilot",
    label: "Copilot",
    category: "ai-agents",
    simpleIconsSlug: "githubcopilot",
    fallbackMonogram: "Co",
    color: "#0D1117",
    nodeType: "brand",
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    category: "ai-agents",
    fallbackMonogram: "GPT",
    color: "#10A37F",
    nodeType: "brand",
  },

  // Resources
  {
    id: "mcp-server",
    label: "MCP Server",
    category: "resources",
    fallbackMonogram: "MCP",
    color: "#7C3AED",
    nodeType: "brand",
  },
  {
    id: "api",
    label: "API",
    category: "resources",
    fallbackMonogram: "API",
    color: "#0EA5E9",
    nodeType: "brand",
  },
  {
    id: "saas-app",
    label: "SaaS App",
    category: "resources",
    fallbackMonogram: "SaaS",
    color: "#F59E0B",
    nodeType: "brand",
  },

  // Okta Components
  {
    id: "mcp-bridge",
    label: "MCP Bridge",
    category: "okta-components",
    fallbackMonogram: "MCPB",
    color: "#007DC1",
    nodeType: "okta-component",
  },
  {
    id: "sts",
    label: "STS (Brokered Consent)",
    category: "okta-components",
    fallbackMonogram: "STS",
    color: "#007DC1",
    nodeType: "okta-component",
  },
  {
    id: "xaa",
    label: "Cross App Access (XAA)",
    category: "okta-components",
    fallbackMonogram: "XAA",
    color: "#007DC1",
    nodeType: "okta-component",
  },
  {
    id: "secrets",
    label: "Secrets",
    category: "okta-components",
    fallbackMonogram: "SEC",
    color: "#007DC1",
    nodeType: "okta-component",
  },
  {
    id: "service-accounts",
    label: "Service Accounts",
    category: "okta-components",
    fallbackMonogram: "SA",
    color: "#007DC1",
    nodeType: "okta-component",
  },
  {
    id: "api-access-management",
    label: "API Access Management",
    category: "okta-components",
    fallbackMonogram: "AAM",
    color: "#007DC1",
    nodeType: "okta-component",
  },
  {
    id: "opa",
    label: "Okta Privileged Access",
    category: "okta-components",
    fallbackMonogram: "OPA",
    color: "#007DC1",
    nodeType: "okta-component",
  },
  {
    id: "ispm",
    label: "Identity Security Posture Mgmt",
    category: "okta-components",
    fallbackMonogram: "ISPM",
    color: "#007DC1",
    nodeType: "okta-component",
  },
  {
    id: "discover",
    label: "Discover",
    category: "strategy",
    fallbackMonogram: "D",
    color: "#007DC1",
    nodeType: "okta-component",
  },
  {
    id: "onboard",
    label: "Onboard",
    category: "strategy",
    fallbackMonogram: "ON",
    color: "#007DC1",
    nodeType: "okta-component",
  },
  {
    id: "protect",
    label: "Protect",
    category: "strategy",
    fallbackMonogram: "PR",
    color: "#007DC1",
    nodeType: "okta-component",
  },
  {
    id: "governance",
    label: "Govern",
    category: "strategy",
    fallbackMonogram: "GOV",
    color: "#007DC1",
    nodeType: "okta-component",
  },
  {
    id: "agent-directory",
    label: "Agent Directory",
    category: "okta-components",
    fallbackMonogram: "AD",
    color: "#007DC1",
    nodeType: "okta-component",
  },
  {
    id: "audit",
    label: "Audit",
    category: "okta-components",
    fallbackMonogram: "AU",
    color: "#007DC1",
    nodeType: "okta-component",
  },
  {
    id: "authentication",
    label: "Authentication",
    category: "okta-components",
    fallbackMonogram: "AUTH",
    color: "#007DC1",
    nodeType: "okta-component",
  },

  // Singleton central node — filtered out of sidebar
  {
    id: "okta-logo",
    label: "Okta",
    category: "okta-logo",
    fallbackMonogram: "OKTA",
    color: "#007DC1",
    nodeType: "okta-logo",
  },
];

const BY_ID = new Map(COMPONENT_REGISTRY.map((c) => [c.id, c]));

export function getComponentDefinition(
  id: string,
): ComponentDefinition | undefined {
  return BY_ID.get(id);
}

export function getSidebarComponents(): ComponentDefinition[] {
  return COMPONENT_REGISTRY.filter(
    (c) => c.category !== "okta-logo" && c.category !== "customer",
  );
}
