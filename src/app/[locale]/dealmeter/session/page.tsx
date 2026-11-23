import { cache } from "react";
import type { Metadata } from "next";
import { TriangleAlert, SearchX, FolderOpen, CalendarDays, Skull, Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
  getSessions,
  parsePage,
  parseSearch,
  parseSessionKey,
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
  MetaRow,
  MetaItem,
  MatchCard,
  SessionBoard,
  listHref,
  sessionKey,
} from "../ui";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<SearchParams> };

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
  const key = parseSessionKey(q);
  return key && loadSession(key.team1, key.team2, key.from, key.to, parseSearch(q));
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
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

export default async function SessionPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const t = await getTranslations("dealmeter");
  const td = await getTranslations("duration");
  const q = await searchParams;
  const search = parseSearch(q);
  const page = parsePage(q);
  const backHref = listHref(search, page);

  let session;
  try {
    session = await load(q);
  } catch (e) {
    console.error("session fetch failed", e);
    return (
      <StatusMessage
        icon={TriangleAlert}
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

      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-10 mb-8 sm:mb-10">
        <h1 className="sr-only">
          {session.team_a} vs {session.team_b}
        </h1>
        <MetaRow>
          <MetaItem icon={FolderOpen}>{t("seriesCount", { count: session.match_count })}</MetaItem>
          <MetaItem icon={CalendarDays}>
            {formatTimeRange(session.started_at, session.ended_at, locale)}
          </MetaItem>
          <MetaItem icon={Clock}>{formatDuration(totalMs, td)}</MetaItem>
          <MetaItem icon={Skull}>
            {t("totalKills")} {session.team_a_kills} : {session.team_b_kills}
          </MetaItem>
        </MetaRow>
        <SessionBoard session={session} large />
      </section>

      <CardGrid>
        {session.games.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            origin={{ search, page, session: sessionKey(session) }}
            leftTeam={session.team_a}
          />
        ))}
      </CardGrid>
    </Page>
  );
}
