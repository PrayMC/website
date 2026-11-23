import { OG_SIZE, brandCard } from "@/lib/og-card";

export const size = OG_SIZE;
export const alt = "Pray KITMAP - MAKE THEM PRAY.";

// Match list and series pages; match detail has its own card.
export default function Image() {
  return brandCard("KITMAP");
}
