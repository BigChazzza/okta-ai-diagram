"use client";

import { Building2, Eye, EyeOff, ImageUp, Trash2 } from "lucide-react";
import { useRef } from "react";
import { DRAG_MIME } from "@/lib/dragMime";
import type { CustomerConfig } from "@/lib/types";

const MAX_LOGO_BYTES = 1_500_000; // 1.5 MB cap to stay well under localStorage budget

interface CustomerSectionProps {
  customer: CustomerConfig;
  onChange: (next: CustomerConfig) => void;
  visible: boolean;
  onToggleVisible: () => void;
  placedCount: number;
}

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0).toUpperCase()).join("") || "?";
}

export function CustomerSection({
  customer,
  onChange,
  visible,
  onToggleVisible,
  placedCount,
}: CustomerSectionProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const VisibilityIcon = visible ? Eye : EyeOff;
  const hasName = !!customer.name?.trim();

  const onPickFile = () => fileRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.alert("Please choose an image file (PNG, JPG, SVG, etc.).");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      window.alert(
        `Image is ${(file.size / 1_000_000).toFixed(2)} MB. Max is ${(
          MAX_LOGO_BYTES / 1_000_000
        ).toFixed(1)} MB to keep diagrams under localStorage limits.`,
      );
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    onChange({ ...customer, logoDataUrl: dataUrl });
  };

  const onClearLogo = () => onChange({ ...customer, logoDataUrl: undefined });

  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!hasName) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData(DRAG_MIME, "customer");
    e.dataTransfer.setData("text/plain", customer.name ?? "Customer");
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <section className="border-b border-slate-200 dark:border-slate-700">
      <header className="flex items-center gap-1 px-3 py-2">
        <span className="flex flex-1 items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Customer
          <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium normal-case text-slate-600 dark:bg-slate-700 dark:text-slate-200">
            {placedCount}
          </span>
        </span>
        <button
          type="button"
          onClick={onToggleVisible}
          aria-label={visible ? "Hide customer nodes" : "Show customer nodes"}
          aria-pressed={!visible}
          title={visible ? "Hide on canvas" : "Show on canvas"}
          className={`grid h-7 w-7 place-items-center rounded-md transition ${
            visible
              ? "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
          }`}
        >
          <VisibilityIcon size={14} />
        </button>
      </header>

      <div className="space-y-2 px-3 pb-3">
        <label className="block">
          <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Customer name
          </span>
          <input
            type="text"
            value={customer.name ?? ""}
            onChange={(e) => onChange({ ...customer, name: e.target.value })}
            placeholder="Acme Inc."
            className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-900"
          />
        </label>

        <div>
          <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Company logo
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPickFile}
              className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              <ImageUp size={13} />
              {customer.logoDataUrl ? "Replace" : "Upload"}
            </button>
            {customer.logoDataUrl && (
              <button
                type="button"
                onClick={onClearLogo}
                aria-label="Remove logo"
                title="Remove logo"
                className="grid h-8 w-8 place-items-center rounded-md border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 hover:text-rose-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFile}
          />
        </div>

        <div
          role="button"
          tabIndex={0}
          draggable={hasName}
          onDragStart={onDragStart}
          aria-disabled={!hasName}
          title={
            hasName
              ? `Drag onto canvas — ${customer.name}`
              : "Enter a customer name to enable drag"
          }
          className={`mt-1 flex items-center gap-3 rounded-lg border p-2 text-left shadow-sm transition ${
            hasName
              ? "cursor-grab border-slate-200 bg-white hover:border-slate-300 hover:shadow active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
              : "cursor-not-allowed border-dashed border-slate-200 bg-slate-50 opacity-70 dark:border-slate-700 dark:bg-slate-800/50"
          }`}
        >
          <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-md bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300">
            {customer.logoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={customer.logoDataUrl}
                alt=""
                className="h-full w-full object-contain"
                draggable={false}
              />
            ) : customer.name ? (
              <span className="text-xs font-bold">{getInitials(customer.name)}</span>
            ) : (
              <Building2 size={18} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-slate-700 dark:text-slate-100">
              {customer.name?.trim() || "(unnamed)"}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {hasName
                ? placedCount > 0
                  ? `${placedCount} on canvas`
                  : "Drag to canvas"
                : "Add a name to enable"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
