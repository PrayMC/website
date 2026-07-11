const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/dealmeter";

export interface MatchSummary {
  id: string;
  team1_name: string;
  team2_name: string;
  team1_kills: number;
  team2_kills: number;
  winner_team: string | null;
  world_name: string | null;
  duration_ms: number | string;
  started_at: string;
  ended_at: string;
}

export interface MatchPlayer {
  id: number;
  match_id: string;
  player_uuid: string;
  player_name: string;
  team_name: string;
  class_name: string;
  kills: number;
  deaths: number;
  damage: number;
  melee_hits: number;
  bow_shots: number;
  archer_tags: number;
  splash_heal: number;
}

export interface MatchEventData {
  id: number;
  match_id: string;
  event_time: string;
  event_type: string;
  actor_uuid: string | null;
  actor_name: string | null;
  target_uuid: string | null;
  target_name: string | null;
  weapon: string | null;
}

export interface MatchDetail extends MatchSummary {
  team1_players: MatchPlayer[];
  team2_players: MatchPlayer[];
  events: MatchEventData[];
}

export interface MatchListResponse {
  matches: MatchSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getMatches(
  page = 1,
  limit = 20,
  search = "",
): Promise<MatchListResponse> {
  const searchQuery = search ? `&search=${encodeURIComponent(search)}` : "";
  const res = await fetch(`${API_BASE}/matches?page=${page}&limit=${limit}${searchQuery}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`Failed to fetch matches (${res.status})`);
  return res.json();
}

export async function getMatch(id: string): Promise<MatchDetail | null> {
  if (!/^[\w-]{1,64}$/.test(id)) return null;
  const res = await fetch(`${API_BASE}/matches/${encodeURIComponent(id)}`, {
    next: { revalidate: 30 },
  });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Failed to fetch match (${res.status})`);
  return res.json();
}

export function getWinners(match: MatchSummary) {
  const winner = match.winner_team?.toLowerCase();
  const team1Won = winner === match.team1_name.toLowerCase();
  const team2Won = !team1Won && winner === match.team2_name.toLowerCase();
  return { team1Won, team2Won, draw: !team1Won && !team2Won };
}

export function formatDuration(
  ms: number | string,
  t: (key: "hour" | "min" | "sec") => string,
) {
  const n = Number(ms);
  const total = Number.isFinite(n) && n > 0 ? Math.floor(n / 1000) : 0;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return `${h ? h + t("hour") : ""}${m}${t("min")}${total % 60}${t("sec")}`;
}

export function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleString(locale, {
    timeZone: "Asia/Seoul",
    timeZoneName: "short",
  });
}

export function getHeadUrl(playerUuid: string, size = 64) {
  return `https://api.mcheads.org/head/${encodeURIComponent(playerUuid.replace(/-/g, ""))}/${size}`;
}
