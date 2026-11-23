import { Children, Fragment, type ReactNode } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Search,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  getWinners,
  formatTimeRange,
  MAX_QUERY_LENGTH,
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

interface Origin {
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
      className="inline-flex items-center gap-1.5 pointer-coarse:py-3 pointer-coarse:-my-3 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" aria-hidden />
      {label}
    </Link>
  );
}

// Same inline-flex box as BackLink, so its row gets the same (strut-padded) line height.
export function BackLinkSkeleton() {
  return (
    <span className="inline-flex items-center h-5">
      <span className="h-4 w-16 bg-zinc-800 rounded" />
    </span>
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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
        <input
          type="search"
          name="search"
          defaultValue={search}
          maxLength={MAX_QUERY_LENGTH}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full h-9 pointer-coarse:h-11 pl-9 pr-3 text-sm rounded-lg bg-transparent border border-zinc-800 text-zinc-200 placeholder:text-muted focus-visible:border-zinc-500 transition-colors"
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
  heading = false,
}: {
  icon: LucideIcon;
  message: string;
  backLabel?: string;
  backHref?: string;
  /** Set when the message is the whole page, so it becomes the page's h1. */
  heading?: boolean;
}) {
  const Message = heading ? "h1" : "p";
  return (
    <div className="flex flex-col items-center justify-center py-24 text-muted">
      <Icon className="w-12 h-12 mb-4 text-zinc-700" />
      <Message className="text-base">{message}</Message>
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
      <StatusBody {...props} heading />
    </Page>
  );
}

// A draw keeps both sides at zinc-300 so neither looks like the loser.
export const resultTone = (won: boolean, draw: boolean) =>
  draw ? "text-zinc-300" : won ? "text-white" : "text-muted";

export function MetaRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 sm:gap-2.5 text-muted text-xs sm:text-sm tabular-nums tracking-wider mb-5 sm:mb-8">
      {Children.toArray(children).map((item, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span className="hidden sm:inline text-zinc-800" aria-hidden>
              |
            </span>
          )}
          {item}
        </Fragment>
      ))}
    </div>
  );
}

export function MetaItem({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title?: string;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 max-w-full" title={title}>
      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden />
      {children}
    </span>
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
    "inline-flex items-center justify-center w-9 h-9 pointer-coarse:w-11 pointer-coarse:h-11 rounded-lg border border-zinc-800 text-zinc-400 transition-colors";
  if (!href)
    return (
      <span className={`${cls} opacity-30`} aria-hidden>
        {children}
      </span>
    );
  return (
    <Link
      href={href}
      aria-label={label}
      className={`${cls} hover:text-zinc-100 hover:border-zinc-600`}
    >
      {children}
    </Link>
  );
}

export function WinnerMark({
  label,
  hero,
  flip,
}: {
  label: string;
  hero?: boolean;
  flip?: boolean;
}) {
  return (
    <span
      className={`shrink-0 inline-flex items-center gap-1 sm:gap-2 font-black uppercase tracking-widest text-win ${
        hero ? "text-xs sm:text-base" : "text-[10px]"
      } ${flip ? "flex-row-reverse" : ""}`}
    >
      <span className={hero ? undefined : "sr-only"}>{label}</span>
      <Trophy className={hero ? "w-4 h-4 sm:w-6 sm:h-6" : "w-3.5 h-3.5"} aria-hidden />
    </span>
  );
}

function Scoreboard({
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
  const drawn = !wonA && !wonB;
  const name = (won: boolean) =>
    `min-w-0 truncate font-semibold ${large ? "text-base sm:text-lg" : "text-sm"} ${resultTone(won, drawn)}`;
  const score = (won: boolean) =>
    `font-bold tabular-nums leading-none ${large ? "text-4xl sm:text-5xl" : "text-2xl"} ${resultTone(won, drawn)}`;
  const mark = <WinnerMark label={t("winner")} />;
  // Under 20rem of its own width, one team per row: side by side, a name would get ~50px.
  return (
    <div className="@container">
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 @xs:flex @xs:gap-4">
        <div className="min-w-0 @xs:flex-1 flex items-center @xs:justify-end gap-2">
          <span className={name(wonA)}>{teamA}</span>
          {wonA && mark}
        </div>
        <div className="contents @xs:flex @xs:shrink-0 @xs:items-center @xs:gap-2">
          <span className={`text-right ${score(wonA)}`}>{scoreA}</span>
          <span
            className={`hidden @xs:inline text-muted font-bold ${large ? "text-2xl" : "text-base"}`}
          >
            :
          </span>
          <span className={`@max-xs:row-start-2 @max-xs:col-start-2 text-right ${score(wonB)}`}>
            {scoreB}
          </span>
        </div>
        <div className="@max-xs:row-start-2 @max-xs:col-start-1 min-w-0 @xs:flex-1 flex @max-xs:flex-row-reverse @max-xs:justify-end items-center gap-2">
          {wonB && mark}
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
        <p className="mt-4 pt-3 border-t border-zinc-800/70 text-xs text-muted tabular-nums truncate">
          {footer}
        </p>
      </Link>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="pt-4 motion-safe:animate-pulse">
      <div className="@container rounded-xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
        {/* Same 20rem switch as Scoreboard: stacked rows when narrow, one line when wide. */}
        <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 @xs:hidden">
          <div className="h-4 w-20 bg-zinc-800 rounded" />
          <div className="h-6 w-5 bg-zinc-800 rounded" />
          <div className="h-4 w-16 bg-zinc-800 rounded" />
          <div className="h-6 w-5 bg-zinc-800 rounded" />
        </div>
        <div className="hidden @xs:flex items-center gap-4">
          <div className="flex-1 flex justify-end">
            <div className="h-4 w-20 bg-zinc-800 rounded" />
          </div>
          <div className="h-6 w-14 bg-zinc-800 rounded" />
          <div className="flex-1">
            <div className="h-4 w-20 bg-zinc-800 rounded" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-zinc-800/70">
          <div className="h-3 my-0.5 w-28 bg-zinc-800 rounded" />
        </div>
      </div>
    </div>
  );
}

export function MatchCard({
  match,
  locale,
  origin,
  t,
  leftTeam,
}: {
  match: MatchSummary;
  locale: string;
  origin: Origin;
  t: Translate;
  /** In a series, the team to keep on the left so wins can be counted down a column. */
  leftTeam?: string;
}) {
  const { team1Won, team2Won } = getWinners(match);
  const sides = [
    { name: match.team1_name, kills: match.team1_kills, won: team1Won },
    { name: match.team2_name, kills: match.team2_kills, won: team2Won },
  ];
  if (leftTeam && match.team2_name.toLowerCase() === leftTeam.toLowerCase()) sides.reverse();
  const [a, b] = sides;
  return (
    <Card
      href={matchHref(match.id, origin)}
      board={
        <Scoreboard
          teamA={a.name}
          teamB={b.name}
          scoreA={a.kills}
          scoreB={b.kills}
          wonA={a.won}
          wonB={b.won}
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
