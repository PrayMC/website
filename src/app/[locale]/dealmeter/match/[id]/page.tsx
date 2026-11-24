import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import {
  TriangleAlert,
  CalendarDays,
  Clock,
  Skull,
  Swords,
  Sword,
  Target,
  HeartCrack,
  BowArrow,
  Shield,
  EighthNote,
  Hash,
  Zap,
  WandSparkles,
  Pickaxe,
  Ghost,
  Crosshair,
  FlaskConical,
  MapIcon,
  User,
  type LucideIcon,
} from "lucide-react";
import {
  getMatch,
  getWinners,
  parsePage,
  parseSearch,
  parseSessionKey,
  formatDuration,
  formatDate,
  formatTimeRange,
  getHeadUrl,
  type MatchPlayer,
  type SearchParams,
} from "@/lib/api";
import { localeAlternates, ogLocale } from "@/i18n/routing";
import {
  Page,
  StatusMessage,
  BackLink,
  MetaRow,
  MetaItem,
  resultTone,
  WinnerMark,
  listHref,
  sessionHref,
} from "../../ui";
import Timeline from "./timeline";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<SearchParams>;
};

const CLASSES: Record<string, { color: string; icon: LucideIcon }> = {
  Diamond: { color: "text-cyan-300", icon: Sword },
  Archer: { color: "text-green-400", icon: BowArrow },
  Bard: { color: "text-yellow-400", icon: EighthNote },
  Rogue: { color: "text-purple-400", icon: Zap },
  Mage: { color: "text-orange-400", icon: WandSparkles },
  Miner: { color: "text-stone-400", icon: Pickaxe },
  Ghost: { color: "text-zinc-400", icon: Ghost },
  Hunter: { color: "text-teal-400", icon: Crosshair },
};

// Opaque so scrolled stats pass under it; the edge line only shows where the table can scroll.
const STICKY = "sticky left-0 z-10 bg-zinc-900 max-sm:shadow-[1px_0_0_var(--color-zinc-800)]";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations("dealmeter");
  let match;
  try {
    match = await getMatch(id);
  } catch {
    return { title: t("matchTitle") };
  }
  if (!match) notFound();
  const title = `Pray - ${match.team1_name} vs ${match.team2_name} (${match.team1_kills}:${match.team2_kills})`;
  return {
    title,
    description: t("description"),
    alternates: localeAlternates(`/dealmeter/match/${encodeURIComponent(match.id)}`, locale),
    openGraph: { title, locale: ogLocale(locale) },
  };
}

export default async function MatchDetailPage({ params, searchParams }: Props) {
  const { locale, id } = await params;
  const t = await getTranslations("dealmeter");
  const td = await getTranslations("duration");
  const { timeline, unknownPlayer, killEvent, showMore } = (
    (await getMessages()) as Record<string, Record<string, string>>
  ).dealmeter;
  const q = await searchParams;
  const origin = { search: parseSearch(q), page: parsePage(q) };
  const key = parseSessionKey(q);
  const back = key
    ? { href: sessionHref(key, origin), label: t("backToSeries") }
    : { href: listHref(origin.search, origin.page), label: t("backToList") };

  let match;
  try {
    match = await getMatch(id);
  } catch (e) {
    console.error("match fetch failed", e);
    return (
      <StatusMessage
        icon={TriangleAlert}
        message={t("loadError")}
        backLabel={back.label}
        backHref={back.href}
      />
    );
  }

  if (!match) notFound();

  const { team1Won, team2Won, draw } = getWinners(match);

  return (
    <Page>
      <div className="mb-6 sm:mb-8">
        <BackLink href={back.href} label={back.label} />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-10 mb-4 sm:mb-6">
        <h1 className="sr-only">
          {match.team1_name} vs {match.team2_name}
        </h1>
        <MetaRow>
          <MetaItem icon={Hash}>
            <span className="break-all">{match.id}</span>
          </MetaItem>
          <MetaItem icon={CalendarDays} title={formatDate(match.ended_at, locale)}>
            {formatTimeRange(match.started_at, match.ended_at, locale)}
          </MetaItem>
          <MetaItem icon={Clock}>{formatDuration(match.duration_ms, td)}</MetaItem>
          {match.world_name && <MetaItem icon={MapIcon}>{match.world_name}</MetaItem>}
        </MetaRow>

        {/* Below lg, one team per row (name, then score): side by side, the winner's name loses ~80px to the mark. */}
        <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 lg:flex">
          <div className="min-w-0 lg:flex-1 flex max-lg:flex-row-reverse items-center justify-end gap-2 sm:gap-3">
            {team1Won && <WinnerMark label={t("winner")} hero />}
            <span
              className={`text-lg sm:text-3xl font-bold truncate ${resultTone(team1Won, draw)}`}
            >
              {match.team1_name}
            </span>
          </div>
          <div className="contents lg:flex lg:px-12 lg:items-center lg:gap-5">
            <span
              className={`text-right text-3xl sm:text-6xl font-black tabular-nums ${scoreTone(team1Won, draw, "text-team-1")}`}
            >
              {match.team1_kills}
            </span>
            <span className="hidden lg:inline text-muted text-xl font-bold">:</span>
            <span
              className={`max-lg:row-start-2 max-lg:col-start-2 text-right text-3xl sm:text-6xl font-black tabular-nums ${scoreTone(team2Won, draw, "text-team-2")}`}
            >
              {match.team2_kills}
            </span>
          </div>
          <div className="max-lg:row-start-2 max-lg:col-start-1 min-w-0 lg:flex-1 flex items-center gap-2 sm:gap-3">
            <span
              className={`text-lg sm:text-3xl font-bold truncate ${resultTone(team2Won, draw)}`}
            >
              {match.team2_name}
            </span>
            {team2Won && <WinnerMark label={t("winner")} hero flip />}
          </div>
        </div>
        {draw && <span className="sr-only">{t("draw")}</span>}
      </div>

      <div className="grid grid-cols-1 min-[1100px]:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <TeamPanel
          teamName={match.team1_name}
          players={match.team1_players}
          won={team1Won}
          team={1}
        />
        <TeamPanel
          teamName={match.team2_name}
          players={match.team2_players}
          won={team2Won}
          team={2}
        />
      </div>

      {match.events.length > 0 && (
        <NextIntlClientProvider
          messages={{
            dealmeter: { timeline, unknownPlayer, killEvent, showMore },
          }}
        >
          <Timeline
            events={match.events}
            matchStart={match.started_at}
            sides={Object.fromEntries([
              ...match.team1_players.map((p) => [p.player_uuid, 1] as const),
              ...match.team2_players.map((p) => [p.player_uuid, 2] as const),
            ])}
          />
        </NextIntlClientProvider>
      )}
    </Page>
  );
}

const scoreTone = (won: boolean, draw: boolean, accent: string) =>
  won || draw ? accent : "text-muted";

function TeamPanel({
  teamName,
  players,
  won,
  team,
}: {
  teamName: string;
  players: MatchPlayer[];
  won: boolean;
  team: 1 | 2;
}) {
  const t = useTranslations("dealmeter");
  const [accentColor, accentBorder, accentBg] =
    team === 1
      ? ["text-team-1", "border-team-1/20", "bg-team-1/5"]
      : ["text-team-2", "border-team-2/20", "bg-team-2/5"];
  const totalDamage = players.reduce((sum, p) => sum + Math.round(p.damage), 0);
  const totalPots = players.reduce((sum, p) => sum + p.splash_heal, 0);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand">
      <div className={`px-4 sm:px-5 py-3 sm:py-4 border-b ${accentBorder} ${accentBg}`}>
        {/* Totals drop under the name only when both can't share a line (320px phones), so the name isn't cut. */}
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <Shield className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${accentColor}`} />
            <h2 className={`text-base sm:text-lg font-bold truncate ${accentColor}`}>{teamName}</h2>
            {won && <WinnerMark label={t("winner")} />}
          </div>
          <div className="ml-auto flex items-center gap-3 sm:gap-4 shrink-0 text-sm sm:text-base font-bold tabular-nums">
            <span className="flex items-center gap-1.5 text-zinc-100" title={t("damage")}>
              <Swords className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-60" />
              <span className="sr-only">{t("damage")} </span>
              {totalDamage.toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5 text-pink-400" title={t("totalPots")}>
              <FlaskConical className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-60" />
              <span className="sr-only">{t("totalPots")} </span>
              {totalPots.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Focusable so keyboards can scroll it (Safari won't); the panel draws the ring, as the sticky column covers this one's. */}
      <div
        className="overflow-x-auto focus-visible:outline-none"
        tabIndex={0}
        role="region"
        aria-label={teamName}
      >
        <table className="w-full min-w-[480px] table-fixed">
          <caption className="sr-only">{teamName}</caption>
          <colgroup>
            <col className="w-4/11" />
          </colgroup>
          <thead>
            {/* 10px, not 12: seven columns share a 480px table, and ja "ダメージ" only clears its neighbors at 10px. */}
            <tr className="text-[10px] text-muted border-b border-zinc-800/50">
              <StatHeader icon={User} label={t("player")} className={STICKY} />
              <StatHeader icon={Skull} label={t("kills")} />
              <StatHeader icon={HeartCrack} label={t("deaths")} />
              <StatHeader icon={Swords} label={t("damage")} />
              <StatHeader icon={Sword} label={t("hits")} />
              <StatHeader icon={BowArrow} label={t("bow")} />
              <StatHeader icon={Target} label={t("tag")} iconClassName="text-green-500/60" />
              <StatHeader icon={FlaskConical} label={t("heal")} iconClassName="text-pink-500/60" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {players.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-muted text-sm">
                  {t("noPlayers")}
                </td>
              </tr>
            ) : (
              players.map((p) => <PlayerRow key={p.id} player={p} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlayerRow({ player }: { player: MatchPlayer }) {
  const tc = useTranslations("classLabels");
  const known = Object.hasOwn(CLASSES, player.class_name);
  const cls = known ? CLASSES[player.class_name] : { color: "text-zinc-500", icon: User };
  const classLabel = known ? tc(player.class_name) : player.class_name;

  return (
    <tr className="group hover:bg-zinc-800/30 transition-colors">
      <th
        scope="row"
        className={`${STICKY} group-hover:bg-[color-mix(in_oklab,var(--color-zinc-800)_30%,var(--color-zinc-900))] transition-colors py-2.5 sm:py-3 pl-3 sm:pl-4 pr-2 text-left font-normal`}
      >
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="relative shrink-0">
            {/* Empty-alt image renders nothing on failure, revealing the icon behind it. */}
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-zinc-800 overflow-hidden">
              <User className="absolute inset-0 m-auto w-4 h-4 text-zinc-600" />
              <img
                src={getHeadUrl(player.player_uuid)}
                alt=""
                width={36}
                height={36}
                loading="lazy"
                decoding="async"
                className="relative w-full h-full"
              />
            </div>
            <div
              className="absolute -bottom-1 -right-1 sm:-bottom-1.5 sm:-right-1.5 w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center"
              title={classLabel}
            >
              <cls.icon
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${cls.color}`}
                aria-label={classLabel}
                role="img"
              />
            </div>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-zinc-200 truncate">
            {player.player_name}
          </span>
        </div>
      </th>
      <Cell value={player.kills} />
      <Cell value={player.deaths} />
      <Cell value={Math.round(player.damage)} />
      <Cell value={player.melee_hits} />
      <Cell value={player.bow_shots} />
      <Cell value={player.archer_tags} color="text-green-400" />
      <Cell value={Math.round(player.splash_heal)} color="text-pink-400" />
    </tr>
  );
}

function StatHeader({
  icon: Icon,
  label,
  className,
  iconClassName,
}: {
  icon: LucideIcon;
  label: string;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <th
      scope="col"
      className={`py-2 sm:py-2.5 font-semibold first:pl-3 sm:first:pl-4 last:pr-3 sm:last:pr-4 ${className ?? ""}`}
      title={label}
    >
      <div className="flex flex-col items-center gap-0.5">
        <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${iconClassName ?? ""}`} />
        <span className="leading-none">{label}</span>
      </div>
    </th>
  );
}

// Zeros recede so the numbers that happened stand out; only tags and pots keep a hue.
function Cell({ value, color = "text-zinc-300" }: { value: number; color?: string }) {
  return (
    <td
      className={`py-2.5 sm:py-3 last:pr-3 sm:last:pr-4 text-center text-xs sm:text-sm tabular-nums font-medium ${value === 0 ? "text-muted" : color}`}
    >
      {value}
    </td>
  );
}
