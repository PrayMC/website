import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, ogLocale } from "@/i18n/routing";
import Navbar from "../navbar";

// The CSP nonce is per request, so prerendered HTML would carry a stale one.
export const dynamic = "force-dynamic";

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  return { openGraph: { locale: ogLocale(locale) } };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const year = new Intl.DateTimeFormat("en", { timeZone: "Asia/Seoul", year: "numeric" }).format();

  return (
    <html lang={locale} className="dark antialiased">
      <body className="min-h-dvh flex flex-col">
        <NextIntlClientProvider messages={null}>
          <Navbar />
          <div className="flex-1">{children}</div>
          <footer className="border-t border-zinc-800 py-6 mt-8">
            <div className="page-frame flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0 text-muted text-sm">
              <p>Copyright 2022-{year} 플래닛네트워크. All rights reserved.</p>
              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4 text-center">
                <span>PlanetEarth is not affiliated with Mojang or Microsoft.</span>
                <span>Help: contact@planetearth.kr</span>
              </div>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
