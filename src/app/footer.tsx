"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// `year` is what the server rendered; the client swaps in its own after hydration.
export default function Footer({ year }: { year: number }) {
  const shown = useSyncExternalStore(subscribe, () => new Date().getFullYear(), () => year);
  return (
    <footer className="border-t border-zinc-800 py-6 mt-8">
      <div className="page-frame flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0 text-zinc-500 text-sm">
        <p>Copyright 2022-{shown} 플래닛네트워크. All rights reserved.</p>
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4 text-center">
          <span>PlanetEarth is not affiliated with Mojang or Microsoft.</span>
          <span>Help: contact@planetearth.kr</span>
        </div>
      </div>
    </footer>
  );
}
