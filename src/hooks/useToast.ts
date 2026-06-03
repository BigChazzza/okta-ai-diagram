"use client";

import { useCallback, useRef, useState } from "react";

export interface Toast {
  id: number;
  message: string;
  type: "error" | "info" | "success";
}

let seq = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (message: string, type: Toast["type"] = "info", durationMs = 5000) => {
      const id = ++seq;
      setToasts((ts) => [...ts, { id, message, type }]);
      const timer = setTimeout(() => dismiss(id), durationMs);
      timers.current.set(id, timer);
      return id;
    },
    [dismiss],
  );

  return { toasts, show, dismiss };
}
