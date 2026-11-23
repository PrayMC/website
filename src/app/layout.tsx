import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_URL } from "@/i18n/routing";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Pray",
  description: "Pray - PlanetEarth KITMAP",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
