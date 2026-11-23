import { COLORS, OG_SIZE, renderCard } from "@/lib/og-card";
import { LOGO_SRC } from "@/lib/og-logo";

export const size = OG_SIZE;
export const alt = "Pray - PlanetEarth KITMAP";

export default function Image() {
  return renderCard({
    text: "PlanetEarth KITMAP",
    body: (
      <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
        <img src={LOGO_SRC} width={220} height={220} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 42 }}>
          <span style={{ fontSize: 132, fontWeight: 800, color: COLORS.brand, lineHeight: 1 }}>
            Pray
          </span>
          <span style={{ fontSize: 48, color: COLORS.muted }}>PlanetEarth KITMAP</span>
        </div>
      </div>
    ),
  });
}
