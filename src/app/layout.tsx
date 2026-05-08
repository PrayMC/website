import type { Metadata } from "next";
import Navbar from "./navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pray",
  description: "Pray - PlanetEarth KITMAP",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark antialiased">
      <body className="min-h-dvh bg-[#0a0a0a] text-zinc-100 flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-6 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0 text-zinc-500 text-sm">
        <p>
          Copyright 2022-{new Date().getFullYear()} 플래닛네트워크. All rights reserved.
        </p>
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4 text-center">
          <span>PlanetEarth is not affiliated with Mojang or Microsoft.</span>
          <span>Help : contact@planetearth.kr</span>
        </div>
      </div>
    </footer>
  );
}
