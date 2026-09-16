import { cache } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/dealmeter";
const TTL_SECONDS = 30;
const SEOUL = "Asia/Seoul";
// Same rule as the backend's route guard; the plugin generates 9-char alphanumeric IDs.
const MATCH_ID_RE = /^[A-Za-z0-9]{1,12}$/;
// Keeps the backend's OFFSET arithmetic away from bigint overflow.
export const MAX_PAGE = 100_000;

/** `?a=1&a=2` arrives as an array, so every param is read through `first()`. */
export type SearchParams = Record<string, string | string[] | undefined>;

export function first(v: SearchParams[string]): string {
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

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

/** Consecutive matches between the same two teams, grouped by time continuity. */
export interface MatchSession {
  team_a: string;
  team_b: string;
  match_count: number;
  team_a_wins: number;
  team_b_wins: number;
  team_a_kills: number;
  team_b_kills: number;
  started_at: string;
  ended_at: string;
  games: MatchSummary[];
}

export interface SessionListResponse {
  sessions: MatchSession[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
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

export interface SessionKey {
  team1: string;
  team2: string;
  from: string;
  to: string;
}

// OpenNext's default incremental cache is a no-op on Cloudflare, so `revalidate`
// does nothing there; use the Workers Cache API instead and fall back elsewhere.
async function cachedFetch(url: string): Promise<Response> {
  const init = { headers: { "User-Agent": "kitmap-website" } }; // the API's WAF rejects UA-less requests
  const cache = (globalThis as unknown as { caches?: { default?: Cache } }).caches?.default;
  if (!cache) return fetch(url, { ...init, next: { revalidate: TTL_SECONDS } });

  const key = new Request(url);
  const hit = await cache.match(key);
  if (hit) return hit;

  const res = await fetch(url, init);
  if (res.ok) {
    const copy = new Response(res.clone().body, res);
    copy.headers.set("Cache-Control", `public, max-age=${TTL_SECONDS}`);
    await cache.put(key, copy).catch((e) => console.error("cache.put failed", e));
  }
  return res;
}

export async function getSessions(
  page = 1,
  limit = 20,
  search = "",
  key?: SessionKey,
): Promise<SessionListResponse> {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) q.set("search", search);
  if (key) for (const [k, v] of Object.entries(key)) q.set(k, v);
  const res = await cachedFetch(`${API_BASE}/matches/sessions?${q}`);
  if (!res.ok) throw new Error(`Failed to fetch sessions (${res.status})`);
  const data: Partial<SessionListResponse> = await res.json();
  if (!Array.isArray(data.sessions) || typeof data.pagination?.totalPages !== "number") {
    throw new Error("Unexpected sessions response shape");
  }
  return data as SessionListResponse;
}

/** `cache` lets generateMetadata and the page share one fetch per request. */
export const getMatch = cache(async (id: string): Promise<MatchDetail | null> => {
  if (!MATCH_ID_RE.test(id)) return null;
  const res = await cachedFetch(`${API_BASE}/matches/${encodeURIComponent(id)}`);
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Failed to fetch match (${res.status})`);
  const data: Partial<MatchDetail> = await res.json();
  if (![data.team1_players, data.team2_players, data.events].every(Array.isArray)) {
    throw new Error("Unexpected match response shape");
  }
  return data as MatchDetail;
});

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
  return new Date(iso).toLocaleString(locale, { timeZone: SEOUL, timeZoneName: "short" });
}

function formatShortDate(iso: string, locale: string) {
  return new Date(iso).toLocaleString(locale, {
    timeZone: SEOUL,
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "9/14 13:09 – 15:02", or with both dates when the range crosses midnight. */
export function formatTimeRange(startIso: string, endIso: string, locale: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const day = (d: Date) => d.toLocaleDateString(locale, { timeZone: SEOUL });
  const time = (d: Date) =>
    d.toLocaleTimeString(locale, { timeZone: SEOUL, hour: "2-digit", minute: "2-digit" });
  const endLabel = day(start) === day(end) ? time(end) : formatShortDate(endIso, locale);
  return `${formatShortDate(startIso, locale)} – ${endLabel}`;
}

export function getHeadUrl(playerUuid: string, size = 64) {
  return `https://api.mcheads.org/head/${encodeURIComponent(playerUuid.replace(/-/g, ""))}/${size}`;
}
