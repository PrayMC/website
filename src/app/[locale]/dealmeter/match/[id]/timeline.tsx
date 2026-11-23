"use client";

import { useState } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MatchEventData } from "@/lib/api";

const PAGE = 20;
const TEAM_TONE = { 1: "text-team-1", 2: "text-team-2" } as const;

export default function Timeline({
  events,
  matchStart,
  sides,
}: {
  events: MatchEventData[];
  matchStart: string;
  /** Player UUID to team number, so names wear their team's color like a game kill feed. */
  sides: Record<string, 1 | 2>;
}) {
  const t = useTranslations("dealmeter");
  const [visible, setVisible] = useState(PAGE);
  const unknown = t("unknownPlayer");
  const startMs = new Date(matchStart).getTime();
  const shown = events.slice(0, visible);
  const remaining = events.length - shown.length;
  const tone = (uuid: string | null) => (uuid && TEAM_TONE[sides[uuid]]) || "text-zinc-300";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6">
      <h2 className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 sm:mb-6">
        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden />
        {t("timeline")}
        <span className="text-muted font-normal normal-case">({events.length})</span>
      </h2>
      <div className="relative pl-5 sm:pl-6">
        <div className="absolute left-[9px] sm:left-[12px] -translate-x-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-zinc-700 via-zinc-800 to-transparent" />
        <ol className="space-y-2.5 sm:space-y-3">
          {shown.map((e) => {
            const sec =
              Math.max(0, Math.floor((new Date(e.event_time).getTime() - startMs) / 1000)) || 0;
            const timeStr = `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
            const actor = e.actor_name ?? unknown;
            const target = e.target_name ?? unknown;
            return (
              <li key={e.id} className="relative flex items-center gap-2.5 sm:gap-4">
                <div className="absolute -left-[15px] sm:-left-[17px] w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-zinc-700 border-2 border-zinc-900 z-10" />
                <span className="text-xs text-muted tabular-nums w-10 sm:w-12 shrink-0">
                  {timeStr}
                </span>
                <div className="flex-1 min-w-0 bg-zinc-800/50 border border-zinc-800 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3">
                  {/* The arrow shows who killed whom; screen readers get the sentence instead. */}
                  <span className="sr-only">
                    {t("killEvent", { actor, target })}
                    {e.weapon && ` (${e.weapon})`}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm flex-wrap"
                    aria-hidden
                  >
                    <strong className={tone(e.actor_uuid)}>{actor}</strong>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-500" />
                    <strong className={tone(e.target_uuid)}>{target}</strong>
                    {e.weapon && <span className="text-muted text-xs">({e.weapon})</span>}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setVisible((v) => v + PAGE)}
          className="mt-4 w-full py-2.5 pointer-coarse:py-3.5 text-xs text-muted hover:text-zinc-300 bg-zinc-800/40 hover:bg-zinc-800/60 rounded-lg transition-colors block text-center cursor-pointer"
        >
          {t("showMore", { remaining })}
        </button>
      )}
    </div>
  );
}
