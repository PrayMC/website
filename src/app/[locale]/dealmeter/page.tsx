import {
  Swords,
  Clock,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Hash,
  CalendarDays,
  Inbox,
  AlertTriangle,
  Map,
  type LucideIcon,
} from "lucide-react";
import { Link, redirect, type Locale } from "@/i18n/routing";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  getMatches,
  getWinners,
  formatDuration,
  formatDate,
  type MatchSummary,
} from "@/lib/api";

type Translate = (key: string) => string;

export default async function DealMeterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dealmeter");
  const td = await getTranslations("duration");
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10) || 1);

  let data;
  try {
    data = await getMatches(page, 5);
  } catch {
    return <StatusMessage icon={AlertTriangle} message={t("loadError")} />;
  }

  const { totalPages } = data.pagination;
  if (totalPages >= 1 && page > totalPages) {
    redirect({
      href: { pathname: "/dealmeter", query: { page: totalPages } },
      locale: locale as Locale,
    });
  }
  if (data.matches.length === 0) {
    return <StatusMessage icon={Inbox} message={t("noMatches")} />;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
      <div className="flex flex-col gap-4 sm:gap-6">
        {data.matches.map((match) => (
          <MatchCard key={match.id} match={match} locale={locale} t={t} td={td} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <PaginationLink href={page > 1 ? `/dealmeter?page=${page - 1}` : null}>
            <ChevronLeft className="w-4 h-4" />
            {t("prev")}
          </PaginationLink>
          <span className="text-sm text-zinc-500 tabular-nums min-w-[4rem] text-center">
            {page} / {totalPages}
          </span>
          <PaginationLink href={page < totalPages ? `/dealmeter?page=${page + 1}` : null}>
            {t("next")}
            <ChevronRight className="w-4 h-4" />
          </PaginationLink>
        </div>
      )}
    </main>
  );
}

function StatusMessage({ icon: Icon, message }: { icon: LucideIcon; message: string }) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
      <div className="flex flex-col items-center justify-center py-24 text-zinc-600">
        <Icon className="w-12 h-12 mb-4 text-zinc-700" />
        <p className="text-base">{message}</p>
      </div>
    </main>
  );
}

function PaginationLink({
  href,
  children,
}: {
  href: string | null;
  children: React.ReactNode;
}) {
  const cls =
    "flex items-center gap-1.5 px-4 sm:px-5 py-2.5 text-sm rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/50 transition-colors";
  if (!href) return <span className={`${cls} opacity-30`}>{children}</span>;
  return (
    <Link href={href} className={`${cls} hover:bg-zinc-700`}>
      {children}
    </Link>
  );
}

function MatchCard({
  match,
  locale,
  t,
  td,
}: {
  match: MatchSummary;
  locale: string;
  t: Translate;
  td: Translate;
}) {
  const { team1Won, team2Won, draw } = getWinners(match);
  const winBadge = (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-1.5 sm:px-2 py-0.5 rounded">
      <Trophy className="w-3 h-3" />
      <span className="hidden sm:inline">WIN</span>
    </span>
  );

  return (
    <Link href={`/dealmeter/match/${encodeURIComponent(match.id)}`}>
      <div className="group relative bg-zinc-900 rounded-xl border border-zinc-800 p-5 sm:p-8 hover:border-zinc-700 transition-all hover:bg-zinc-900/80">
        <div className="flex items-center">
          <div className="flex-1 text-right pr-3 sm:pr-6">
            <div className="flex items-center justify-end gap-1.5 sm:gap-2">
              {team1Won && winBadge}
              <span
                className={`text-sm sm:text-lg font-bold truncate ${team1Won ? "text-white" : "text-zinc-400"}`}
              >
                {match.team1_name}
              </span>
            </div>
            <div
              className={`text-2xl sm:text-4xl font-black tabular-nums mt-1 sm:mt-1.5 ${team1Won ? "text-white" : "text-zinc-500"}`}
            >
              {match.team1_kills}
            </div>
          </div>

          <div className="flex flex-col items-center px-3 sm:px-6 shrink-0">
            <Swords
              className={`w-4 h-4 sm:w-5 sm:h-5 ${draw ? "text-zinc-600" : "text-zinc-700"}`}
            />
            {draw && (
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">
                {t("draw")}
              </span>
            )}
            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-zinc-600 mt-1.5 sm:mt-2 tabular-nums">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {formatDuration(match.duration_ms, td)}
            </span>
          </div>

          <div className="flex-1 text-left pl-3 sm:pl-6">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span
                className={`text-sm sm:text-lg font-bold truncate ${team2Won ? "text-white" : "text-zinc-400"}`}
              >
                {match.team2_name}
              </span>
              {team2Won && winBadge}
            </div>
            <div
              className={`text-2xl sm:text-4xl font-black tabular-nums mt-1 sm:mt-1.5 ${team2Won ? "text-white" : "text-zinc-500"}`}
            >
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
            {formatDate(match.ended_at, locale)}
          </span>
        </div>
      </div>
    </Link>
  );
}
