"use client";

import { useMemo } from "react";
import type { Node } from "@xyflow/react";
import { CategorySection } from "./CategorySection";
import { CustomerSection } from "./CustomerSection";
import { getSidebarComponents } from "@/lib/brandRegistry";
import { SIDEBAR_CATEGORIES } from "@/lib/componentCategories";
import type {
  CategoryKey,
  CustomerConfig,
  DiagramNodeData,
  VisibilityMap,
} from "@/lib/types";

interface SidebarProps {
  nodes: Node<DiagramNodeData>[];
  visibility: VisibilityMap;
  customer: CustomerConfig;
  onSetVisibility: (next: VisibilityMap) => void;
  onSetCustomer: (next: CustomerConfig) => void;
}

export function Sidebar({
  nodes,
  visibility,
  customer,
  onSetVisibility,
  onSetCustomer,
}: SidebarProps) {
  const components = getSidebarComponents();

  const placedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    nodes.forEach((n) => {
      const id = (n.data as DiagramNodeData).componentId;
      counts[id] = (counts[id] ?? 0) + 1;
    });
    return counts;
  }, [nodes]);

  const customerPlaced = placedCounts["customer"] ?? 0;

  const toggleVisibility = (key: CategoryKey) => {
    onSetVisibility({ ...visibility, [key]: !visibility[key] });
  };

  return (
    <aside
      aria-label="Component palette"
      className="flex h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Components
        </h2>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Drag onto the canvas, then connect to Okta.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <CustomerSection
          customer={customer}
          onChange={onSetCustomer}
          visible={visibility.customer}
          onToggleVisible={() => toggleVisibility("customer")}
          placedCount={customerPlaced}
        />
        {SIDEBAR_CATEGORIES.map((meta) => (
          <CategorySection
            key={meta.key}
            meta={meta}
            components={components.filter((c) => c.category === meta.key)}
            visible={visibility[meta.key]}
            onToggleVisible={() => toggleVisibility(meta.key)}
            placedCounts={placedCounts}
          />
        ))}
      </div>
      <footer className="border-t border-slate-200 px-4 py-3 text-[10px] text-slate-400 dark:border-slate-700 dark:text-slate-500">
        Tip: double-click an arrow to label it.
      </footer>
    </aside>
  );
}
