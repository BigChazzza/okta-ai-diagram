import type { CategoryKey } from "./types";

export interface CategoryMeta {
  key: CategoryKey;
  label: string;
  description: string;
}

export const SIDEBAR_CATEGORIES: CategoryMeta[] = [
  {
    key: "ai-agents",
    label: "AI Agents",
    description: "Agents that act on behalf of a user",
  },
  {
    key: "resources",
    label: "Resources",
    description: "Targets agents need to access",
  },
  {
    key: "okta-components",
    label: "Okta Components",
    description: "Identity and access primitives",
  },
];

export const ALL_CATEGORIES: CategoryKey[] = [
  "ai-agents",
  "resources",
  "okta-components",
  "okta-logo",
];
