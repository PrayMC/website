const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/dealmeter";

export interface MatchSummary {
  id: string;
  team1_name: string;
  team2_name: string;
  team1_kills: number;
  team2_kills: number;
  winner_team: string | null;
  world_name: string | null;
  duration_ms: number;
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

export type PvPClassName = "Diamond" | "Archer" | "Bard" | "Rogue" | "Mage" | "Miner" | "Ghost";

export const CLASS_CONFIG: Record<string, { color: string; icon: string }> = {
  Diamond:  { color: "text-cyan-300",   icon: "Sword" },
  Archer:   { color: "text-green-400",  icon: "BowArrow" },
  Bard:     { color: "text-yellow-400", icon: "ShieldHalf" },
  Rogue:    { color: "text-purple-400", icon: "Zap" },
  Mage:     { color: "text-orange-400", icon: "Flame" },
  Miner:    { color: "text-stone-400",  icon: "Pickaxe" },
  Ghost:    { color: "text-zinc-400",   icon: "Ghost" },
};

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

export async function getMatches(page = 1, limit = 20): Promise<MatchListResponse> {
  const res = await fetch(`${API_BASE}/matches?page=${page}&limit=${limit}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error("Failed to fetch matches");
  return res.json();
}

export async function getMatch(id: string): Promise<MatchDetail> {
  const res = await fetch(`${API_BASE}/matches/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch match");
  return res.json();
}

export function formatDuration(ms: number, minLabel = "분 ", secLabel = "초"): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}${minLabel}${seconds}${secLabel}`;
}

export function getHeadUrl(playerUuid: string, size = 64): string {
  const uuid = playerUuid.replace(/-/g, "");
  return `https://api.mcheads.org/head/${uuid}/${size}`;
}

