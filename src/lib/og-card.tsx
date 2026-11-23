import type { ReactNode } from "react";
import { ImageResponse } from "next/og";
import { loadFonts } from "./og";
import { LOGO_SRC } from "./og-logo";

export const OG_SIZE = { width: 1200, height: 630 };

// Hex of the globals.css tokens: satori can't parse oklch.
export const COLORS = {
  background: "#0a0a0a",
  foreground: "#ededed",
  brand: "#b9d9fb",
  muted: "#8b8b96",
  team1: "#ff6467",
  team2: "#51a2ff",
  win: "#ffb900",
  draw: "#d4d4d8",
};

// Header and footer rows share a height, so `body` stays centered on the card with or without a footer.
const ROW = 64;

/** `text`: every string inside `body`, so the font subset covers it. */
export async function renderCard({
  body,
  text,
  corner,
  footer,
}: {
  body: ReactNode;
  text: string;
  corner?: string;
  footer?: string;
}) {
  const fonts = await loadFonts(`Pray · KITMAP${text}${corner ?? ""}${footer ?? ""}`);
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "56px 72px",
        background: COLORS.background,
        color: COLORS.foreground,
        fontFamily: "Noto Sans KR",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: ROW,
          fontSize: 34,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={LOGO_SRC} width={60} height={60} alt="" style={{ marginRight: 16 }} />
          <span style={{ color: COLORS.brand, fontWeight: 800 }}>Pray</span>
          <span style={{ color: COLORS.muted, marginLeft: 12 }}>· KITMAP</span>
        </div>
        {corner && <span style={{ color: COLORS.muted }}>{corner}</span>}
      </div>
      <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
        {body}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          height: ROW,
          fontSize: 32,
          color: COLORS.muted,
        }}
      >
        {footer}
      </div>
    </div>,
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined },
  );
}
