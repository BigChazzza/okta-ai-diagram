"use client";

import { useEffect, useState } from "react";

export function useIsClient(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- canonical mount detection for SSR-safe rendering
    setMounted(true);
  }, []);
  return mounted;
}
