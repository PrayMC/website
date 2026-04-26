"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Swords,
  Clock,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Hash,
  CalendarDays,
  Loader2,
  Inbox,
  Map,
} from "lucide-react";
import {
  getMatches,
  formatDuration,
  type MatchSummary,
  type MatchListResponse,
} from "@/lib/api";

export default function DealMeterPage() {
  const [data, setData] = useState<MatchListResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMatches(page, 5)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
        </div>
      )}

      {!loading && data && data.matches.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-600">
          <Inbox className="w-12 h-12 mb-4 text-zinc-700" />
          <p className="text-base">기록된 전투가 없습니다.</p>
        </div>
      )}

      {!loading && data && data.matches.length > 0 && (
        <>
          <div className="flex flex-col gap-4 sm:gap-6">
            {data.matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>

          {data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 text-sm rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/50 disabled:opacity-30 hover:bg-zinc-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                이전
              </button>
              <span className="text-sm text-zinc-500 tabular-nums min-w-[4rem] text-center">
                {page} / {data.pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(data.pagination.totalPages, p + 1))
                }
                disabled={page === data.pagination.totalPages}
                className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 text-sm rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/50 disabled:opacity-30 hover:bg-zinc-700 transition-colors"
              >
                다음
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

function MatchCard({ match }: { match: MatchSummary }) {
  const isTeam1Winner =
    match.winner_team?.toLowerCase() === match.team1_name.toLowerCase();
  const isTeam2Winner =
    match.winner_team?.toLowerCase() === match.team2_name.toLowerCase();
  const isDraw = !match.winner_team;

  return (
    <Link href={`/dealmeter/match/${match.id}`}>
      <div className="group relative bg-zinc-900 rounded-xl border border-zinc-800 p-5 sm:p-8 hover:border-zinc-700 transition-all hover:bg-zinc-900/80">
        <div className="flex items-center">
          <div className="flex-1 text-right pr-3 sm:pr-6">
            <div className="flex items-center justify-end gap-1.5 sm:gap-2">
              {isTeam1Winner && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-1.5 sm:px-2 py-0.5 rounded">
                  <Trophy className="w-3 h-3" />
                  <span className="hidden sm:inline">WIN</span>
                </span>
              )}
              <span className={`text-sm sm:text-lg font-bold truncate ${isTeam1Winner ? "text-white" : "text-zinc-400"}`}>
                {match.team1_name}
              </span>
            </div>
            <div className={`text-2xl sm:text-4xl font-black tabular-nums mt-1 sm:mt-1.5 ${isTeam1Winner ? "text-white" : "text-zinc-500"}`}>
              {match.team1_kills}
            </div>
          </div>

          <div className="flex flex-col items-center px-3 sm:px-6 shrink-0">
            <Swords className={`w-4 h-4 sm:w-5 sm:h-5 ${isDraw ? "text-zinc-600" : "text-zinc-700"}`} />
            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-zinc-600 mt-1.5 sm:mt-2 tabular-nums">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {formatDuration(match.duration_ms)}
            </span>
          </div>

          <div className="flex-1 text-left pl-3 sm:pl-6">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className={`text-sm sm:text-lg font-bold truncate ${isTeam2Winner ? "text-white" : "text-zinc-400"}`}>
                {match.team2_name}
              </span>
              {isTeam2Winner && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-1.5 sm:px-2 py-0.5 rounded">
                  <Trophy className="w-3 h-3" />
                  <span className="hidden sm:inline">WIN</span>
                </span>
              )}
            </div>
            <div className={`text-2xl sm:text-4xl font-black tabular-nums mt-1 sm:mt-1.5 ${isTeam2Winner ? "text-white" : "text-zinc-500"}`}>
              {match.team2_kills}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 sm:mt-4 pt-3 border-t border-zinc-800 gap-1.5 sm:gap-0">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-zinc-600 font-mono">
              <Hash className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {match.id}
            </span>
            {match.world_name && (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-zinc-600">
                <Map className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {match.world_name}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-zinc-600">
            <CalendarDays className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {new Date(match.ended_at).toLocaleString("ko-KR")}
          </span>
        </div>
      </div>
    </Link>
  );
}
