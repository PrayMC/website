import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ChevronLeft, ChevronRight, Inbox, Search, SearchX, TriangleAlert } from "lucide-react";
import { Link, redirect, localeAlternates, type Locale } from "@/i18n/routing";
import {
  getSessions,
  formatTimeRange,
  parsePage,
  parseSearch,
  MAX_QUERY_LENGTH,
  type SearchParams,
} from "@/lib/api";
import {
  PAGE_SIZE,
  Page,
  CardGrid,
  Card,
  StatusBody,
  StatusMessage,
  MatchCard,
  SessionBoard,
  listHref,
  sessionHref,
  sessionKey,
} from "../ui";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<SearchParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("dealmeter");
  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/dealmeter", locale),
  };
}

export default async function DealMeterPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const t = await getTranslations("dealmeter");
  const tn = await getTranslations("navbar");
  const q = await searchParams;
  const page = parsePage(q);
  const search = parseSearch(q);

  let data;
  try {
    data = await getSessions(page, PAGE_SIZE, search);
  } catch (e) {
    console.error("sessions fetch failed", e);
    return <StatusMessage icon={TriangleAlert} message={t("loadError")} />;
  }

  const { totalPages } = data.pagination;
  if (totalPages >= 1 && page > totalPages) {
    redirect({
      href: { pathname: "/dealmeter", query: { page: totalPages, ...(search && { search }) } },
      locale: locale as Locale,
    });
  }
  if (data.sessions.length === 0 && !search) {
    return <StatusMessage icon={Inbox} message={t("noMatches")} />;
  }

  const origin = { search, page };
  const prevHref = page > 1 ? listHref(search, page - 1) : null;
  const nextHref = page < totalPages ? listHref(search, page + 1) : null;

  return (
    <Page>
      <h1 className="sr-only">{tn("matchHistory")}</h1>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
        <form action={`/${locale}/dealmeter`} method="get" className="flex-1 min-w-0">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
            <input
              type="search"
              name="search"
              defaultValue={search}
              maxLength={MAX_QUERY_LENGTH}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
              className="w-full h-9 pointer-coarse:h-11 pl-9 pr-3 text-sm rounded-lg bg-transparent border border-zinc-800 text-zinc-200 placeholder:text-muted focus-visible:border-zinc-500 transition-colors"
            />
          </div>
        </form>
        {totalPages > 1 && (
          <div className="flex items-center gap-2 shrink-0">
            <PaginationLink href={prevHref} label={t("prev")} icon={ChevronLeft} />
            <span className="min-w-14 text-center text-sm text-zinc-400 tabular-nums">
              {page} / {totalPages}
            </span>
            <PaginationLink href={nextHref} label={t("next")} icon={ChevronRight} />
          </div>
        )}
      </div>

      {data.sessions.length === 0 ? (
        <StatusBody icon={SearchX} message={t("noResults")} backLabel={t("clearSearch")} />
      ) : (
        <CardGrid>
          {data.sessions.map((session) =>
            session.games.length === 1 ? (
              <MatchCard key={session.games[0].id} match={session.games[0]} origin={origin} />
            ) : (
              <Card
                key={`${session.team_a}|${session.team_b}|${session.started_at}`}
                href={sessionHref(sessionKey(session), origin)}
                tab={t("seriesCount", { count: session.match_count })}
                board={<SessionBoard session={session} />}
                footer={formatTimeRange(session.started_at, session.ended_at, locale)}
              />
            ),
          )}
        </CardGrid>
      )}
    </Page>
  );
}

function PaginationLink({
  href,
  label,
  icon: Icon,
}: {
  href: string | null;
  label: string;
  icon: React.ComponentType<{ className: string }>;
}) {
  const cls =
    "inline-flex items-center justify-center w-9 h-9 pointer-coarse:w-11 pointer-coarse:h-11 rounded-lg border border-zinc-800 text-zinc-400 transition-colors";
  if (!href)
    return (
      <span className={`${cls} opacity-30`} aria-hidden>
        <Icon className="w-4 h-4" />
      </span>
    );
  return (
    <Link
      href={href}
      aria-label={label}
      className={`${cls} hover:text-zinc-100 hover:border-zinc-600`}
    >
      <Icon className="w-4 h-4" />
    </Link>
  );
}
