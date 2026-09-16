import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import Navbar from "../navbar";
import Footer from "../footer";
import "../globals.css";

// The CSP nonce is per request, so prerendered HTML would carry a stale one.
export const dynamic = "force-dynamic";

const ogLocaleMap: Record<Locale, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { openGraph: { locale: ogLocaleMap[locale as Locale] } };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale} className="dark antialiased">
      <body className="min-h-dvh bg-[#0a0a0a] text-zinc-100 flex flex-col">
        <NextIntlClientProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer year={new Date().getFullYear()} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
