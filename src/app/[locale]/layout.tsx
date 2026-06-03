import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import Navbar from "../navbar";
import Footer from "../footer";
import "../globals.css";

const ogLocaleMap: Record<(typeof routing.locales)[number], string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const ogLocale = hasLocale(routing.locales, locale)
    ? ogLocaleMap[locale]
    : "ko_KR";
  return {
    alternates: {
      languages: Object.fromEntries([
        ...routing.locales.map((l) => [l, `/${l}`]),
        ["x-default", `/${routing.defaultLocale}`],
      ]),
    },
    openGraph: {
      locale: ogLocale,
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => ogLocaleMap[l]),
    },
  };
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

  setRequestLocale(locale);

  return (
    <html lang={locale} className="dark antialiased">
      <body className="min-h-dvh bg-[#0a0a0a] text-zinc-100 flex flex-col">
        <NextIntlClientProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
