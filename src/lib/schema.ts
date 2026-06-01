import { z } from "zod";

const categoryEnum = z.enum([
  "customer",
  "strategy",
  "users",
  "ai-agents",
  "resources",
  "okta-components",
  "okta-logo",
]);

const nodeDataSchema = z
  .object({
    componentId: z.string(),
    category: categoryEnum,
    label: z.string(),
  })
  .passthrough();

const edgeDataSchema = z
  .object({
    label: z.string().optional(),
  })
  .passthrough();

const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const nodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: positionSchema,
  data: nodeDataSchema,
});

const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().nullable().optional(),
  targetHandle: z.string().nullable().optional(),
  data: edgeDataSchema.optional(),
  label: z.string().optional(),
});

const visibilitySchema = z.object({
  customer: z.boolean().default(true),
  strategy: z.boolean().default(true),
  users: z.boolean().default(true),
  "ai-agents": z.boolean(),
  resources: z.boolean(),
  "okta-components": z.boolean(),
  "okta-logo": z.boolean(),
});

const customerSchema = z
  .object({
    name: z.string().optional(),
    logoDataUrl: z.string().optional(),
  })
  .optional();

export const serializedDiagramSchema = z.object({
  version: z.literal(1),
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
  visibility: visibilitySchema,
  customer: customerSchema,
});

export type SerializedDiagramParsed = z.infer<typeof serializedDiagramSchema>;
