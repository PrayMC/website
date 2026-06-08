import type { Metadata } from "next";
import Image from "next/image";
import {
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
  Map,
  User,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  getMatch,
  formatDuration,
  getHeadUrl,
  CLASS_CONFIG,
  type MatchPlayer,
} from "@/lib/api";
import { dateLocaleMap, type Locale } from "@/i18n/routing";
import Timeline from "./timeline";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const match = await getMatch(id);
    const title = `${match.team1_name} vs ${match.team2_name} (${match.team1_kills}:${match.team2_kills}) - Pray`;
    return {
      title,
      openGraph: { title },
    };
  } catch {
    return { title: "Match - Pray" };
  }
}

export default async function MatchDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ events?: string }>;
}) {
  const { locale, id } = await params;
  const { events: eventsStr } = await searchParams;
  const visibleCount = Math.max(20, parseInt(eventsStr || "20", 10) || 20);
  setRequestLocale(locale);

  const t = await getTranslations("dealmeter");
  const td = await getTranslations("duration");
  const tc = await getTranslations("classLabels");
  const dl = dateLocaleMap[locale as Locale] || "ko-KR";
  const minLabel = td("min");
  const secLabel = td("sec");

  let match;
  try {
    match = await getMatch(id);
  } catch {
    return (
      <main className="max-w-6xl mx-auto px-4 py-24 text-center font-sans">
        <Shield className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
        <p className="text-zinc-500 text-lg">{t("matchNotFound")}</p>
        <Link
          href="/dealmeter"
          className="inline-flex items-center gap-1.5 text-[#b9d9fb] hover:text-[#d0e5fd] mt-4 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToList")}
        </Link>
      </main>
    );
  }

  const isTeam1Winner =
    match.winner_team?.toLowerCase() === match.team1_name.toLowerCase();
  const isTeam2Winner =
    match.winner_team?.toLowerCase() === match.team2_name.toLowerCase();

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 font-sans">
      <Link
        href="/dealmeter"
        className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm mb-6 sm:mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("list")}
      </Link>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-10 mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-zinc-600 text-xs sm:text-sm tabular-nums tracking-wider mb-5 sm:mb-8">
          <span className="inline-flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {match.id}
          </span>
          <span className="text-zinc-800">|</span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {new Date(match.ended_at).toLocaleString(dl, { timeZone: "Asia/Seoul" })}
          </span>
          <span className="text-zinc-800">|</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {formatDuration(match.duration_ms, minLabel, secLabel)}
          </span>
          {match.world_name && (
            <>
              <span className="text-zinc-800">|</span>
              <span className="inline-flex items-center gap-1.5">
                <Map className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {match.world_name}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center">
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-2 sm:gap-3">
              {isTeam1Winner && (
                <span className="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-base font-black uppercase tracking-widest text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                  <span className="hidden sm:inline">Victory</span>
                  <Trophy className="w-4 h-4 sm:w-6 sm:h-6" />
                </span>
              )}
              <span
                className={`text-lg sm:text-3xl font-bold truncate ${isTeam1Winner ? "text-white" : "text-zinc-500"}`}
              >
                {match.team1_name}
              </span>
            </div>
          </div>
          <div className="px-4 sm:px-12 flex items-baseline gap-2 sm:gap-5">
            <span
              className={`text-3xl sm:text-6xl font-black tabular-nums ${isTeam1Winner ? "text-cyan-400" : "text-zinc-600"}`}
            >
              {match.team1_kills}
            </span>
            <span className="text-zinc-700 text-base sm:text-xl font-bold">
              :
            </span>
            <span
              className={`text-3xl sm:text-6xl font-black tabular-nums ${isTeam2Winner ? "text-rose-400" : "text-zinc-600"}`}
            >
              {match.team2_kills}
            </span>
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 sm:gap-3">
              <span
                className={`text-lg sm:text-3xl font-bold truncate ${isTeam2Winner ? "text-white" : "text-zinc-500"}`}
              >
                {match.team2_name}
              </span>
              {isTeam2Winner && (
                <span className="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-base font-black uppercase tracking-widest text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                  <Trophy className="w-4 h-4 sm:w-6 sm:h-6" />
                  <span className="hidden sm:inline">Victory</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <TeamPanel
          teamName={match.team1_name}
          players={match.team1_players}
          isWinner={isTeam1Winner}
          accent="cyan"
          t={t}
          tc={tc}
        />
        <TeamPanel
          teamName={match.team2_name}
          players={match.team2_players}
          isWinner={isTeam2Winner}
          accent="rose"
          t={t}
          tc={tc}
        />
      </div>

      {match.events.length > 0 && (
        <Timeline
          events={match.events}
          matchStart={match.started_at}
          matchId={match.id}
          visibleCount={visibleCount}
        />
      )}
    </main>
  );
}

function WinBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded">
      <Trophy className="w-3 h-3" />
      WIN
    </span>
  );
}

type TranslationFn = (key: string) => string;

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
  t: TranslationFn;
  tc: TranslationFn;
}) {
  const accentColor = accent === "cyan" ? "text-cyan-400" : "text-rose-400";
  const accentBorder =
    accent === "cyan" ? "border-cyan-500/20" : "border-rose-500/20";
  const accentBg = accent === "cyan" ? "bg-cyan-500/5" : "bg-rose-500/5";
  const totalDamage = Math.round(
    players.reduce((sum, p) => sum + p.damage, 0),
  );

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div
        className={`px-4 sm:px-5 py-3 sm:py-4 border-b ${accentBorder} ${accentBg}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className={`w-4 h-4 sm:w-5 sm:h-5 ${accentColor}`} />
            <span className={`text-base sm:text-lg font-bold ${accentColor}`}>
              {teamName}
            </span>
            {isWinner && <WinBadge />}
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
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
          <StatHeader
            icon={BowArrow}
            label={t("tag")}
            className="text-green-500/60"
          />
          <StatHeader
            icon={Droplets}
            label={t("heal")}
            className="text-pink-500/60"
          />
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

const CLASS_ICONS: Record<string, LucideIcon> = {
  Sword,
  BowArrow,
  ShieldHalf,
  Zap,
  Flame,
  Pickaxe,
  Ghost,
};

function PlayerRow({
  player,
  tc,
}: {
  player: MatchPlayer;
  tc: TranslationFn;
}) {
  const cls = CLASS_CONFIG[player.class_name] || CLASS_CONFIG["Diamond"];
  const Icon = CLASS_ICONS[cls.icon] || Sword;
  const isArcher = player.class_name === "Archer";
  const classLabel = tc(player.class_name);

  return (
    <div className="grid grid-cols-[4fr_repeat(7,1fr)] gap-0.5 sm:gap-1 items-center px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-zinc-800/30 transition-colors">
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        <div className="relative shrink-0">
          <Image
            src={getHeadUrl(player.player_uuid, 64)}
            alt={player.player_name}
            width={36}
            height={36}
            loading="lazy"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-md"
            unoptimized
          />
          <div
            className="absolute -bottom-1 -right-1 sm:-bottom-1.5 sm:-right-1.5 w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center"
            title={classLabel}
          >
            <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${cls.color}`} />
          </div>
        </div>
        <span className="text-xs sm:text-sm font-semibold text-zinc-200 truncate">
          {player.player_name}
        </span>
      </div>
      <Cell
        value={player.kills}
        color={player.kills > 0 ? "text-emerald-400" : undefined}
      />
      <Cell
        value={player.deaths}
        color={player.deaths > 0 ? "text-red-400" : undefined}
      />
      <Cell value={Math.round(player.damage)} color="text-amber-400" />
      <Cell value={player.melee_hits} />
      <Cell value={player.bow_shots} />
      <Cell
        value={isArcher ? player.archer_tags : ""}
        color={
          isArcher && player.archer_tags > 0
            ? "text-green-400"
            : "text-transparent"
        }
      />
      <Cell
        value={player.splash_heal}
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

function Cell({
  value,
  color,
}: {
  value: number | string;
  color?: string;
}) {
  return (
    <div
      className={`text-center text-xs sm:text-sm tabular-nums font-medium ${color || "text-zinc-400"}`}
    >
      {value}
    </div>
  );
}
