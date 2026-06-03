import { serializedDiagramSchema } from "./schema";
import type { SerializedDiagram } from "./types";

export const LOCAL_STORAGE_KEY = "okta-ai-diagram:v1";

export function loadFromLocalStorage(): SerializedDiagram | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const result = serializedDiagramSchema.safeParse(parsed);
    if (!result.success) {
      console.warn(
        "[persistence] Stored diagram failed validation; clearing.",
        result.error.flatten(),
      );
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      return null;
    }
    return result.data as SerializedDiagram;
  } catch (err) {
    console.warn("[persistence] Failed to load diagram:", err);
    try {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // ignore
    }
    return null;
  }
}

export function saveToLocalStorage(diagram: SerializedDiagram): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(diagram));
  } catch (err) {
    console.warn("[persistence] Failed to save diagram:", err);
  }
}

export function clearStoredDiagram(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function parseImportedDiagram(text: string): SerializedDiagram {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Not valid JSON — could not parse the file.");
  }
  const result = serializedDiagramSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .slice(0, 3)
      .map((i) => `${i.path.join(".") || "root"}: ${i.message}`)
      .join(" | ");
    throw new Error(`Invalid diagram format — ${issues}`);
  }
  return result.data as SerializedDiagram;
}
