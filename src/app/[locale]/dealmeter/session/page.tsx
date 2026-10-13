import { cache } from "react";
import type { Metadata } from "next";
import { AlertTriangle, SearchX, FolderOpen, CalendarDays, Skull, Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
  getSessions,
  first,
  MAX_PAGE,
  formatDuration,
  formatTimeRange,
  type MatchSession,
  type SearchParams,
} from "@/lib/api";
import {
  Page,
  CardGrid,
  StatusMessage,
  BackLink,
  MatchCard,
  SessionBoard,
  listHref,
  sessionKey,
} from "../ui";

// Keyed by (teams, time window) rather than a stable ID, so never indexed.
const noindex = (title: string): Metadata => ({ title, robots: { index: false } });

// Primitive args so `cache` dedupes the generateMetadata and page calls.
const loadSession = cache(
  async (
    team1: string,
    team2: string,
    from: string,
    to: string,
    search: string,
  ): Promise<MatchSession | null> => {
    const { sessions } = await getSessions(1, 1, search, { team1, team2, from, to });
    return sessions[0] ?? null;
  },
);

function load(q: SearchParams) {
  const team1 = first(q.team1).trim().slice(0, 64);
  const team2 = first(q.team2).trim().slice(0, 64);
  const fromMs = Date.parse(first(q.from));
  const toMs = Date.parse(first(q.to));
  if (!team1 || !team2 || Number.isNaN(fromMs) || Number.isNaN(toMs) || fromMs > toMs) {
    return null;
  }
  // Re-serialized so the backend's ::timestamptz cast only ever sees ISO 8601.
  return loadSession(
    team1,
    team2,
    new Date(fromMs).toISOString(),
    new Date(toMs).toISOString(),
    first(q.search).trim().slice(0, 64),
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const q = await searchParams; // outside the try: Next signals dynamic rendering by throwing
  const t = await getTranslations("dealmeter");
  try {
    const s = await load(q);
    if (!s) return noindex(t("seriesTitle"));
    const title = `Pray - ${s.team_a} vs ${s.team_b} (${s.team_a_wins}:${s.team_b_wins})`;
    return { ...noindex(title), openGraph: { title } };
  } catch {
    return noindex(t("seriesTitle"));
  }
}

export default async function SessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  const t = await getTranslations("dealmeter");
  const td = await getTranslations("duration");
  const q = await searchParams;
  const search = first(q.search).trim().slice(0, 64);
  const page = Math.min(MAX_PAGE, Math.max(1, parseInt(first(q.page), 10) || 1));
  const backHref = listHref(search, page);

  let session;
  try {
    session = await load(q);
  } catch (e) {
    console.error("session fetch failed", e);
    return (
      <StatusMessage
        icon={AlertTriangle}
        message={t("loadError")}
        backLabel={t("backToList")}
        backHref={backHref}
      />
    );
  }
  if (!session) {
    return (
      <StatusMessage
        icon={SearchX}
        message={t("seriesNotFound")}
        backLabel={t("backToList")}
        backHref={backHref}
      />
    );
  }

  const totalMs = session.games.reduce((sum, g) => sum + (Number(g.duration_ms) || 0), 0);

  return (
    <Page>
      <div className="mb-6 sm:mb-8">
        <BackLink href={backHref} label={t("backToList")} />
      </div>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6 mb-8 sm:mb-10">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-zinc-500 tabular-nums mb-4">
          <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider text-zinc-300">
            <FolderOpen className="w-3.5 h-3.5" aria-hidden />
            {t("seriesCount", { count: session.match_count })}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="w-3 h-3" aria-hidden />
            {formatTimeRange(session.started_at, session.ended_at, locale)}
          </span>
        </div>
        <SessionBoard session={session} t={t} large />
        <div className="mt-4 pt-3 border-t border-zinc-800/70 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 tabular-nums">
          <span className="inline-flex items-center gap-1">
            <Skull className="w-3 h-3" aria-hidden />
            {t("totalKills")} {session.team_a_kills} : {session.team_b_kills}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" aria-hidden />
            {formatDuration(totalMs, td)}
          </span>
        </div>
      </section>

      <CardGrid>
        {session.games.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            locale={locale}
            origin={{ search, page, session: sessionKey(session) }}
            t={t}
          />
        ))}
      </CardGrid>
    </Page>
  );
}
