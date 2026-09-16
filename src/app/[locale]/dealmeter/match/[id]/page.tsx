import type { Metadata } from "next";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowLeft,
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
import { StatusMessage, type Translate } from "../../ui";
import { getTranslations } from "next-intl/server";
import {
  getMatch,
  getWinners,
  formatDuration,
  formatDate,
  getHeadUrl,
  type MatchPlayer,
  type MatchDetail,
} from "@/lib/api";
import Timeline from "./timeline";
import { Link, localeAlternates } from "@/i18n/routing";

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
  let match: MatchDetail | null = null;
  try {
    match = await getMatch(id);
  } catch {
    return { title: "Pray - Match" };
  }
  if (!match) notFound();
  const t = await getTranslations("dealmeter");
  const title = `Pray - ${match.team1_name} vs ${match.team2_name} (${match.team1_kills}:${match.team2_kills})`;
  return {
    title,
    description: t("description"),
    alternates: localeAlternates(`/dealmeter/match/${encodeURIComponent(match.id)}`, locale),
    openGraph: { title },
  };
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("dealmeter");
  const td = await getTranslations("duration");
  const tc = await getTranslations("classLabels");

  let match: MatchDetail | null = null;
  try {
    match = await getMatch(id);
  } catch (e) {
    console.error("match fetch failed", e);
    return (
      <StatusMessage icon={AlertTriangle} message={t("loadError")} backLabel={t("backToList")} />
    );
  }

  if (!match) notFound();

  const { team1Won, team2Won, draw } = getWinners(match);

  return (
    <main className="page-frame py-6 sm:py-8 font-sans">
      <Link
        href="/dealmeter"
        className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm mb-6 sm:mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("backToList")}
      </Link>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-10 mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-zinc-600 text-xs sm:text-sm tabular-nums tracking-wider mb-5 sm:mb-8">
          <span className="inline-flex items-center gap-1.5 max-w-full">
            <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="break-all">{match.id}</span>
          </span>
          <span className="text-zinc-800">|</span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {formatDate(match.ended_at, locale)}
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
              {team1Won && <Victory label={t("victory")} />}
              <span
                className={`text-lg sm:text-3xl font-bold truncate ${team1Won ? "text-white" : "text-zinc-500"}`}
              >
                {match.team1_name}
              </span>
            </div>
          </div>
          <div className="px-4 sm:px-12 flex flex-col items-center gap-1">
            <div className="flex items-baseline gap-2 sm:gap-5">
              <span
                className={`text-3xl sm:text-6xl font-black tabular-nums ${team1Won ? "text-cyan-400" : "text-zinc-600"}`}
              >
                {match.team1_kills}
              </span>
              <span className="text-zinc-700 text-base sm:text-xl font-bold">
                :
              </span>
              <span
                className={`text-3xl sm:text-6xl font-black tabular-nums ${team2Won ? "text-rose-400" : "text-zinc-600"}`}
              >
                {match.team2_kills}
              </span>
            </div>
            {draw && (
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500">
                {t("draw")}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2 sm:gap-3">
              <span
                className={`text-lg sm:text-3xl font-bold truncate ${team2Won ? "text-white" : "text-zinc-500"}`}
              >
                {match.team2_name}
              </span>
              {team2Won && <Victory label={t("victory")} flip />}
            </div>
          </div>
        </div>
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
    </main>
  );
}

function Victory({ label, flip }: { label: string; flip?: boolean }) {
  return (
    <span
      className={`shrink-0 inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-base font-black uppercase tracking-widest text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)] ${flip ? "flex-row-reverse" : ""}`}
    >
      <span className="sr-only sm:not-sr-only">{label}</span>
      <Trophy className="w-4 h-4 sm:w-6 sm:h-6" aria-hidden />
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div
        className={`px-4 sm:px-5 py-3 sm:py-4 border-b ${accentBorder} ${accentBg}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Shield className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${accentColor}`} />
            <span className={`text-base sm:text-lg font-bold truncate ${accentColor}`}>
              {teamName}
            </span>
            {isWinner && (
              <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded">
                <Trophy className="w-3 h-3" aria-hidden />
                {t("win")}
              </span>
            )}
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
