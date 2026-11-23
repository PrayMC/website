import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getMatch, getWinners, formatDuration } from "@/lib/api";
import { fitFontSize } from "@/lib/og";
import { COLORS, OG_SIZE, renderCard } from "@/lib/og-card";

export const size = OG_SIZE;
export const alt = "Pray match result";

// Fixed name columns leave the score ~416px: "10 : 3" fits at 140px, "12 : 10" at 112px.
const NAME_WIDTH = 320;
// lucide Trophy, inlined: satori renders plain SVG, not lucide-react components.
const TROPHY = [
  "M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2",
  "M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2",
  "M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3",
  "M4 22h16",
  "M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",
  "M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3",
];

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const match = await getMatch((await params).id);
  if (!match) notFound();
  const { team1Won, team2Won, draw } = getWinners(match);
  const name = (won: boolean) => (draw ? COLORS.draw : won ? COLORS.foreground : COLORS.muted);
  const score = (won: boolean, accent: string) => (won || draw ? accent : COLORS.muted);
  const scoreSize = `${match.team1_kills}${match.team2_kills}`.length > 3 ? 112 : 140;
  // ja, like the site's date format: "2026/11/18 22:41".
  const ended = new Date(match.ended_at).toLocaleString("ja", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return renderCard({
    corner: match.world_name ?? undefined,
    footer: `${formatDuration(match.duration_ms, (k) => ({ hour: "h ", min: "m ", sec: "s" })[k])} · ${ended} KST`,
    // "…" for the ellipsis on names too long even at the minimum size.
    text: `${match.team1_name}${match.team2_name}${match.team1_kills}${match.team2_kills}:WINNERDRAW…`,
    body: (
      <div style={{ display: "flex", width: "100%", alignItems: "flex-end" }}>
        <Side align="flex-end" label={team1Won && <Winner />}>
          <Name color={name(team1Won)}>{match.team1_name}</Name>
        </Side>
        <Side align="center" label={draw && "DRAW"}>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <span style={{ fontSize: scoreSize, color: score(team1Won, COLORS.team1) }}>
              {match.team1_kills}
            </span>
            <span style={{ fontSize: 56, color: COLORS.muted }}>:</span>
            <span style={{ fontSize: scoreSize, color: score(team2Won, COLORS.team2) }}>
              {match.team2_kills}
            </span>
          </div>
        </Side>
        <Side align="flex-start" label={team2Won && <Winner />}>
          <Name color={name(team2Won)}>{match.team2_name}</Name>
        </Side>
      </div>
    ),
  });
}

/** A label row (winner / draw) over a value row; fixed heights keep names level with the score. */
function Side({
  align,
  label,
  children,
}: {
  align: string;
  label: ReactNode;
  children: ReactNode;
}) {
  const box = align === "center" ? { flex: 1 } : { width: NAME_WIDTH };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: align, minWidth: 0, ...box }}
    >
      <div
        style={{
          display: "flex",
          height: 48,
          alignItems: "center",
          gap: 12,
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: 6,
          color: label === "DRAW" ? COLORS.draw : COLORS.win,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          height: 190,
          alignItems: "center",
          fontWeight: 800,
          maxWidth: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Name({ color, children }: { color: string; children: string }) {
  return (
    <span
      style={{
        display: "block",
        fontSize: fitFontSize(children, NAME_WIDTH, 64, 32),
        color,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
    >
      {children}
    </span>
  );
}

function Winner() {
  return (
    <>
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        stroke={COLORS.win}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {TROPHY.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
      WINNER
    </>
  );
}
