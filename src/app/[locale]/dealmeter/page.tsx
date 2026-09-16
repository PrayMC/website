import type { Metadata } from "next";
import { Inbox, AlertTriangle, SearchX } from "lucide-react";
import { redirect, localeAlternates, type Locale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { getSessions, first, MAX_PAGE, type SearchParams } from "@/lib/api";
import {
  PAGE_SIZE,
  Page,
  CardGrid,
  SearchForm,
  StatusBody,
  StatusMessage,
  Pagination,
  MatchCard,
  SessionCard,
  listHref,
} from "./ui";

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

export default async function DealMeterPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  const t = await getTranslations("dealmeter");
  const query = await searchParams;
  const page = Math.min(MAX_PAGE, Math.max(1, parseInt(first(query.page), 10) || 1));
  const search = first(query.search).trim().slice(0, 64);

  let data;
  try {
    data = await getSessions(page, PAGE_SIZE, search);
  } catch (e) {
    console.error("sessions fetch failed", e);
    return <StatusMessage icon={AlertTriangle} message={t("loadError")} />;
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

  return (
    <Page>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
        <SearchForm
          action={`/${locale}/dealmeter`}
          search={search}
          placeholder={t("searchPlaceholder")}
        />
        <Pagination page={page} totalPages={totalPages} href={(p) => listHref(search, p)} t={t} />
      </div>

      {data.sessions.length === 0 ? (
        <StatusBody icon={SearchX} message={t("noResults")} />
      ) : (
        <CardGrid>
          {data.sessions.map((session) =>
            session.games.length === 1 ? (
              <MatchCard
                key={session.games[0].id}
                match={session.games[0]}
                locale={locale}
                origin={origin}
                t={t}
              />
            ) : (
              <SessionCard
                key={`${session.team_a}|${session.team_b}|${session.started_at}`}
                session={session}
                locale={locale}
                origin={origin}
                t={t}
              />
            ),
          )}
        </CardGrid>
      )}
    </Page>
  );
}
