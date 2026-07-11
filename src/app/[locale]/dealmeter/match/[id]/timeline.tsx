import { Clock, Swords } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import type { MatchEventData } from "@/lib/api";

export default async function Timeline({
  events,
  matchStart,
  matchId,
  visibleCount,
}: {
  events: MatchEventData[];
  matchStart: string;
  matchId: string;
  visibleCount: number;
}) {
  const t = await getTranslations("dealmeter");
  const unknown = t("unknownPlayer");
  const startMs = new Date(matchStart).getTime();
  const remaining = events.length - visibleCount;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6">
      <h2 className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 sm:mb-6">
        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        {t("timeline")}
        <span className="text-zinc-600 font-normal normal-case">
          ({events.length})
        </span>
      </h2>
      <div className="relative pl-5 sm:pl-6">
        <div className="absolute left-[5px] sm:left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-zinc-700 via-zinc-800 to-transparent" />
        <div className="space-y-2.5 sm:space-y-3">
          {events.slice(0, visibleCount).map((e) => {
            const sec =
              Math.max(0, Math.floor((new Date(e.event_time).getTime() - startMs) / 1000)) || 0;
            const timeStr = `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
            return (
              <div key={e.id} className="relative flex items-center gap-2.5 sm:gap-4">
                <div className="absolute -left-[15px] sm:-left-[17px] w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-zinc-700 border-2 border-zinc-900 z-10" />
                <span className="text-[10px] sm:text-xs text-zinc-600 tabular-nums w-10 sm:w-12 shrink-0">
                  {timeStr}
                </span>
                <div className="flex-1 bg-zinc-800/50 border border-zinc-800 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm flex-wrap">
                    <strong className="text-emerald-400">
                      {e.actor_name ?? unknown}
                    </strong>
                    <Swords className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-600" aria-hidden />
                    <strong className="text-red-400">
                      {e.target_name ?? unknown}
                    </strong>
                    {e.weapon && (
                      <span className="text-zinc-600 text-[10px] sm:text-xs">
                        ({e.weapon})
                      </span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {remaining > 0 && (
        <Link
          href={`/dealmeter/match/${encodeURIComponent(matchId)}?events=${Math.min(visibleCount + 20, events.length)}`}
          scroll={false}
          className="mt-4 w-full py-2.5 text-xs text-zinc-500 hover:text-zinc-300 bg-zinc-800/40 hover:bg-zinc-800/60 rounded-lg transition-colors block text-center"
        >
          {t("showMore", { remaining })}
        </Link>
      )}
    </div>
  );
}
