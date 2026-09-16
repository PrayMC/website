import type { Metadata } from "next";
import Image from "next/image";
import {
  AlertTriangle,
  CalendarDays,
  Clock,
  Skull,
  Trophy,
  Swords,
  Sword,
  Target,
  Heart,
  Crosshair,
  BowArrow,
  Shield,
  ShieldHalf,
  Hash,
  Zap,
  Flame,
  Pickaxe,
  Ghost,
  Droplets,
  Map as MapIcon,
  User,
  type LucideIcon,
} from "lucide-react";
import { notFound } from "next/navigation";
import {
  Page,
  StatusMessage,
  BackLink,
  listHref,
  sessionHref,
  type Translate,
} from "../../ui";
import { getTranslations } from "next-intl/server";
import {
  getMatch,
  getWinners,
  first,
  MAX_PAGE,
  formatDuration,
  formatDate,
  formatTimeRange,
  getHeadUrl,
  type MatchPlayer,
  type MatchDetail,
  type SearchParams,
} from "@/lib/api";
import Timeline from "./timeline";
import { localeAlternates } from "@/i18n/routing";

const CLASSES: Record<string, { color: string; icon: LucideIcon }> = {
  Diamond: { color: "text-cyan-300", icon: Sword },
  Archer: { color: "text-green-400", icon: BowArrow },
  Bard: { color: "text-yellow-400", icon: ShieldHalf },
  Rogue: { color: "text-purple-400", icon: Zap },
  Mage: { color: "text-orange-400", icon: Flame },
  Miner: { color: "text-stone-400", icon: Pickaxe },
  Ghost: { color: "text-zinc-400", icon: Ghost },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations("dealmeter");
  let match: MatchDetail | null = null;
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
    openGraph: { title },
  };
}

/** The series or list page the card was clicked from, re-validated before it becomes a link. */
function resolveBack(q: SearchParams, t: Translate) {
  const search = first(q.search).trim().slice(0, 64);
  const page = Math.min(MAX_PAGE, Math.max(1, parseInt(first(q.page), 10) || 1));
  const [team1, team2] = [first(q.team1).trim().slice(0, 64), first(q.team2).trim().slice(0, 64)];
  const [fromMs, toMs] = [Date.parse(first(q.from)), Date.parse(first(q.to))];
  const origin = { search, page };
  if (team1 && team2 && !Number.isNaN(fromMs) && !Number.isNaN(toMs) && fromMs <= toMs) {
    const key = {
      team1,
      team2,
      from: new Date(fromMs).toISOString(),
      to: new Date(toMs).toISOString(),
    };
    return { href: sessionHref(key, origin), label: t("backToSeries") };
  }
  return { href: listHref(search, page), label: t("backToList") };
}

export default async function MatchDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("dealmeter");
  const td = await getTranslations("duration");
  const tc = await getTranslations("classLabels");
  const back = resolveBack(await searchParams, t);

  let match: MatchDetail | null = null;
  try {
    match = await getMatch(id);
  } catch (e) {
    console.error("match fetch failed", e);
    return (
      <StatusMessage
        icon={AlertTriangle}
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
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-zinc-600 text-xs sm:text-sm tabular-nums tracking-wider mb-5 sm:mb-8">
          <span className="inline-flex items-center gap-1.5 max-w-full">
            <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="break-all">{match.id}</span>
          </span>
          <span className="text-zinc-800">|</span>
          <span className="inline-flex items-center gap-1.5" title={formatDate(match.ended_at, locale)}>
            <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {formatTimeRange(match.started_at, match.ended_at, locale)}
          </span>
          <span className="text-zinc-800">|</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {formatDuration(match.duration_ms, td)}
          </span>
          {match.world_name && (
            <>
              <span className="text-zinc-800">|</span>
              <span className="inline-flex items-center gap-1.5">
                <MapIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {match.world_name}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center">
          <div className="flex-1 min-w-0 text-right">
            <div className="flex items-center justify-end gap-2 sm:gap-3">
              {team1Won && <WinnerMark label={t("winner")} hero />}
              <span className={`text-lg sm:text-3xl font-bold truncate ${nameTone(team1Won, draw)}`}>
                {match.team1_name}
              </span>
            </div>
          </div>
          <div className="px-4 sm:px-12 flex items-baseline gap-2 sm:gap-5">
            <span
              className={`text-3xl sm:text-6xl font-black tabular-nums ${scoreTone(team1Won, draw, "text-cyan-400")}`}
            >
              {match.team1_kills}
            </span>
            <span className="text-zinc-700 text-base sm:text-xl font-bold">
              :
            </span>
            <span
              className={`text-3xl sm:text-6xl font-black tabular-nums ${scoreTone(team2Won, draw, "text-rose-400")}`}
            >
              {match.team2_kills}
            </span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className={`text-lg sm:text-3xl font-bold truncate ${nameTone(team2Won, draw)}`}>
                {match.team2_name}
              </span>
              {team2Won && <WinnerMark label={t("winner")} hero flip />}
            </div>
          </div>
        </div>
        {draw && <span className="sr-only">{t("draw")}</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <TeamPanel
          teamName={match.team1_name}
          players={match.team1_players}
          isWinner={team1Won}
          accent="cyan"
          t={t}
          tc={tc}
        />
        <TeamPanel
          teamName={match.team2_name}
          players={match.team2_players}
          isWinner={team2Won}
          accent="rose"
          t={t}
          tc={tc}
        />
      </div>

      {match.events.length > 0 && (
        <Timeline events={match.events} matchStart={match.started_at} />
      )}
    </Page>
  );
}

// Same tones as the card scoreboard, over the cyan/rose this page gives each team.
const nameTone = (won: boolean, draw: boolean) =>
  draw ? "text-zinc-300" : won ? "text-white" : "text-zinc-500";
const scoreTone = (won: boolean, draw: boolean, accent: string) =>
  won || draw ? accent : "text-zinc-500";

/** `hero` is the big mark over the scoreboard; the plain one badges a team panel. */
function WinnerMark({ label, hero, flip }: { label: string; hero?: boolean; flip?: boolean }) {
  return (
    <span
      className={`shrink-0 inline-flex items-center gap-1 sm:gap-2 font-black uppercase tracking-widest text-amber-400 ${
        hero ? "text-xs sm:text-base" : "text-[10px]"
      } ${flip ? "flex-row-reverse" : ""}`}
    >
      {/* Only the hero has room for the word, and only once it is past the phone breakpoint. */}
      <span className={hero ? "sr-only sm:not-sr-only" : "sr-only"}>{label}</span>
      <Trophy className={hero ? "w-4 h-4 sm:w-6 sm:h-6" : "w-3.5 h-3.5"} aria-hidden />
    </span>
  );
}

function TeamPanel({
  teamName,
  players,
  isWinner,
  accent,
  t,
  tc,
}: {
  teamName: string;
  players: MatchPlayer[];
  isWinner: boolean;
  accent: "cyan" | "rose";
  t: Translate;
  tc: Translate;
}) {
  const [accentColor, accentBorder, accentBg] =
    accent === "cyan"
      ? ["text-cyan-400", "border-cyan-500/20", "bg-cyan-500/5"]
      : ["text-rose-400", "border-rose-500/20", "bg-rose-500/5"];
  const totalDamage = players.reduce((sum, p) => sum + Math.round(p.damage), 0);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div
        className={`px-4 sm:px-5 py-3 sm:py-4 border-b ${accentBorder} ${accentBg}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Shield className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${accentColor}`} />
            <span className={`text-base sm:text-lg font-bold truncate ${accentColor}`}>
              {teamName}
            </span>
            {isWinner && <WinnerMark label={t("winner")} />}
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 shrink-0">
            <Swords className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-60" />
            <span className="text-sm sm:text-base font-bold tabular-nums">
              {totalDamage.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-[4fr_repeat(7,1fr)] gap-0.5 sm:gap-1 px-3 sm:px-4 py-2 sm:py-2.5 text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-600 font-semibold border-b border-zinc-800/50 min-w-[480px]">
          <StatHeader icon={User} label={t("player")} />
          <StatHeader icon={Skull} label={t("kills")} />
          <StatHeader icon={Heart} label={t("deaths")} />
          <StatHeader icon={Swords} label={t("damage")} />
          <StatHeader icon={Target} label={t("hits")} />
          <StatHeader icon={Crosshair} label={t("bow")} />
          <StatHeader icon={BowArrow} label={t("tag")} className="text-green-500/60" />
          <StatHeader icon={Droplets} label={t("heal")} className="text-pink-500/60" />
        </div>

        {players.length === 0 ? (
          <div className="px-5 py-12 text-center text-zinc-700 text-sm">
            {t("noPlayers")}
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50 min-w-[480px]">
            {players.map((p) => (
              <PlayerRow key={p.id} player={p} tc={tc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PlayerRow({ player, tc }: { player: MatchPlayer; tc: Translate }) {
  const known = Object.hasOwn(CLASSES, player.class_name);
  const cls = known ? CLASSES[player.class_name] : CLASSES.Diamond;
  const isArcher = player.class_name === "Archer";
  const classLabel = known ? tc(player.class_name) : player.class_name;

  return (
    <div className="grid grid-cols-[4fr_repeat(7,1fr)] gap-0.5 sm:gap-1 items-center px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-zinc-800/30 transition-colors">
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        <div className="relative shrink-0">
          {/* Empty-alt image renders nothing on failure, revealing the icon behind it. */}
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-zinc-800 overflow-hidden">
            <User className="absolute inset-0 m-auto w-4 h-4 text-zinc-600" aria-hidden />
            <Image
              src={getHeadUrl(player.player_uuid, 64)}
              alt=""
              width={36}
              height={36}
              loading="lazy"
              className="relative w-full h-full"
              unoptimized
            />
          </div>
          <div
            className="absolute -bottom-1 -right-1 sm:-bottom-1.5 sm:-right-1.5 w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center"
            title={classLabel}
          >
            <cls.icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${cls.color}`} aria-label={classLabel} role="img" />
          </div>
        </div>
        <span className="text-xs sm:text-sm font-semibold text-zinc-200 truncate">
          {player.player_name}
        </span>
      </div>
      <Cell value={player.kills} color={player.kills > 0 ? "text-emerald-400" : undefined} />
      <Cell value={player.deaths} color={player.deaths > 0 ? "text-red-400" : undefined} />
      <Cell value={Math.round(player.damage)} color="text-amber-400" />
      <Cell value={player.melee_hits} />
      <Cell value={player.bow_shots} />
      <Cell
        value={isArcher ? player.archer_tags : ""}
        color={isArcher && player.archer_tags > 0 ? "text-green-400" : undefined}
      />
      <Cell
        value={Math.round(player.splash_heal)}
        color={player.splash_heal > 0 ? "text-pink-400" : undefined}
      />
    </div>
  );
}

function StatHeader({
  icon: Icon,
  label,
  className,
}: {
  icon: LucideIcon;
  label: string;
  className?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5" title={label}>
      <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${className || ""}`} />
      <span className="leading-none normal-case">{label}</span>
    </div>
  );
}

function Cell({ value, color }: { value: number | string; color?: string }) {
  return (
    <div
      className={`text-center text-xs sm:text-sm tabular-nums font-medium ${color || "text-zinc-400"}`}
    >
      {value}
    </div>
  );
}
