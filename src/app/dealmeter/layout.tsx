import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pray - 매치 기록",
  description: "Pray - PlanetEarth KITMAP",
};

export default function DealMeterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
