"use client";

import dynamic from "next/dynamic";

const DiagramApp = dynamic(() => import("@/components/DiagramApp"), {
  ssr: false,
  loading: () => (
    <div className="grid h-screen w-screen place-items-center text-sm text-slate-500 dark:text-slate-400">
      Loading diagram…
    </div>
  ),
});

export default function Home() {
  return <DiagramApp />;
}
