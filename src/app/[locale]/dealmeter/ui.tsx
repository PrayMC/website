import type { ReactNode } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Search, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  getWinners,
  formatTimeRange,
  type MatchSummary,
  type MatchSession,
  type SessionKey,
} from "@/lib/api";

export type Translate = (key: string, values?: Record<string, string | number>) => string;

export const PAGE_SIZE = 12;

export function Page({ children }: { children: ReactNode }) {
  return <main className="page-frame pt-8 sm:pt-10 pb-4 sm:pb-6">{children}</main>;
}

export function CardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">{children}</div>
  );
}

/** Where a card was clicked from, so the detail page's back link can return there. */
export interface Origin {
  search: string;
  page: number;
  session?: SessionKey;
}

function withOrigin(q: URLSearchParams, { search, page }: Origin) {
  if (search) q.set("search", search);
  if (page > 1) q.set("page", String(page));
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function listHref(search: string, page: number) {
  return `/dealmeter${withOrigin(new URLSearchParams(), { search, page })}`;
}

export function sessionHref(key: SessionKey, origin: Origin) {
  return `/dealmeter/session${withOrigin(new URLSearchParams({ ...key }), origin)}`;
}

function matchHref(id: string, origin: Origin) {
  const q = new URLSearchParams(origin.session ? { ...origin.session } : {});
  return `/dealmeter/match/${encodeURIComponent(id)}${withOrigin(q, origin)}`;
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" aria-hidden />
      {label}
    </Link>
  );
}

export function SearchForm({
  action,
  search,
  placeholder,
}: {
  action: string;
  search: string;
  placeholder: string;
}) {
  return (
    <form action={action} method="get" className="flex-1 min-w-0">
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" />
        <input
          type="search"
          name="search"
          defaultValue={search}
          maxLength={64}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full h-9 pl-9 pr-3 text-sm rounded-md bg-transparent border border-zinc-800 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
        />
      </div>
    </form>
  );
}

export function StatusBody({
  icon: Icon,
  message,
  backLabel,
  backHref = "/dealmeter",
}: {
  icon: LucideIcon;
  message: string;
  backLabel?: string;
  backHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-zinc-600">
      <Icon className="w-12 h-12 mb-4 text-zinc-700" />
      <p className="text-base">{message}</p>
      {backLabel && (
        <div className="mt-4">
          <BackLink href={backHref} label={backLabel} />
        </div>
      )}
    </div>
  );
}

export function StatusMessage(props: {
  icon: LucideIcon;
  message: string;
  backLabel?: string;
  backHref?: string;
}) {
  return (
    <Page>
      <StatusBody {...props} />
    </Page>
  );
}

export function Pagination({
  page,
  totalPages,
  href,
  t,
}: {
  page: number;
  totalPages: number;
  href: (p: number) => string;
  t: Translate;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-2 shrink-0">
      <PaginationLink href={page > 1 ? href(page - 1) : null} label={t("prev")}>
        <ChevronLeft className="w-4 h-4" />
      </PaginationLink>
      <span className="min-w-14 text-center text-sm text-zinc-400 tabular-nums">
        {page} / {totalPages}
      </span>
      <PaginationLink href={page < totalPages ? href(page + 1) : null} label={t("next")}>
        <ChevronRight className="w-4 h-4" />
      </PaginationLink>
    </div>
  );
}

function PaginationLink({
  href,
  label,
  children,
}: {
  href: string | null;
  label: string;
  children: ReactNode;
}) {
  const cls =
    "inline-flex items-center justify-center w-9 h-9 rounded-md border border-zinc-800 text-zinc-400 transition-colors";
  if (!href) return <span className={`${cls} opacity-30`}>{children}</span>;
  return (
    <Link href={href} aria-label={label} className={`${cls} hover:text-zinc-100 hover:border-zinc-600`}>
      {children}
    </Link>
  );
}

export function Scoreboard({
  teamA,
  teamB,
  scoreA,
  scoreB,
  wonA,
  wonB,
  t,
  large = false,
}: {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  wonA: boolean;
  wonB: boolean;
  t: Translate;
  large?: boolean;
}) {
  // No dot on either side is what marks a draw, so it needs no label and no card stands taller
  // than its row; zinc-300 keeps both sides level rather than dimming them as though both lost.
  const drawn = !wonA && !wonB;
  const tone = (won: boolean) => (drawn ? "text-zinc-300" : won ? "text-white" : "text-zinc-500");
  const name = (won: boolean) =>
    `min-w-0 truncate font-semibold ${large ? "text-base sm:text-lg" : "text-sm"} ${tone(won)}`;
  const score = (won: boolean) =>
    `font-bold tabular-nums leading-none ${large ? "text-4xl sm:text-5xl" : "text-2xl"} ${tone(won)}`;
  const dot = (
    <>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" aria-hidden />
      <span className="sr-only">{t("winner")}</span>
    </>
  );
  return (
    <div>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex-1 min-w-0 flex items-center justify-end gap-2">
          <span className={name(wonA)}>{teamA}</span>
          {wonA && dot}
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span className={score(wonA)}>{scoreA}</span>
          <span className={`text-zinc-700 font-bold ${large ? "text-2xl" : "text-base"}`}>:</span>
          <span className={score(wonB)}>{scoreB}</span>
        </div>
        <div className="flex-1 min-w-0 flex items-center gap-2">
          {wonB && dot}
          <span className={name(wonB)}>{teamB}</span>
        </div>
      </div>
      {drawn && <span className="sr-only">{t("draw")}</span>}
    </div>
  );
}

// `pt-4` reserves the folder-tab space on every card so grid rows stay aligned.
function Card({
  href,
  tab,
  board,
  footer,
}: {
  href: string;
  tab?: ReactNode;
  board: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="pt-4">
      <Link
        href={href}
        className="group relative block rounded-xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6 hover:border-zinc-700 transition-colors"
      >
        {tab && (
          <span className="absolute bottom-full translate-y-px left-4 h-4 px-2.5 flex items-center rounded-t-md border-x border-t border-zinc-800 bg-zinc-900 text-xs font-semibold leading-none text-zinc-400 tabular-nums group-hover:border-zinc-700 transition-colors">
            {tab}
          </span>
        )}
        {board}
        <p className="mt-4 pt-3 border-t border-zinc-800/70 text-xs text-zinc-500 tabular-nums truncate">
          {footer}
        </p>
      </Link>
    </div>
  );
}

export function MatchCard({
  match,
  locale,
  origin,
  t,
}: {
  match: MatchSummary;
  locale: string;
  origin: Origin;
  t: Translate;
}) {
  const { team1Won, team2Won } = getWinners(match);
  return (
    <Card
      href={matchHref(match.id, origin)}
      board={
        <Scoreboard
          teamA={match.team1_name}
          teamB={match.team2_name}
          scoreA={match.team1_kills}
          scoreB={match.team2_kills}
          wonA={team1Won}
          wonB={team2Won}
          t={t}
        />
      }
      footer={formatTimeRange(match.started_at, match.ended_at, locale)}
    />
  );
}

export function SessionBoard({
  session,
  t,
  large = false,
}: {
  session: MatchSession;
  t: Translate;
  large?: boolean;
}) {
  return (
    <Scoreboard
      teamA={session.team_a}
      teamB={session.team_b}
      scoreA={session.team_a_wins}
      scoreB={session.team_b_wins}
      wonA={session.team_a_wins > session.team_b_wins}
      wonB={session.team_b_wins > session.team_a_wins}
      t={t}
      large={large}
    />
  );
}

export function sessionKey(session: MatchSession): SessionKey {
  return {
    team1: session.team_a,
    team2: session.team_b,
    from: session.started_at,
    to: session.ended_at,
  };
}

export function SessionCard({
  session,
  locale,
  origin,
  t,
}: {
  session: MatchSession;
  locale: string;
  origin: Origin;
  t: Translate;
}) {
  return (
    <Card
      href={sessionHref(sessionKey(session), origin)}
      tab={t("seriesCount", { count: session.match_count })}
      board={<SessionBoard session={session} t={t} />}
      footer={formatTimeRange(session.started_at, session.ended_at, locale)}
    />
  );
}
