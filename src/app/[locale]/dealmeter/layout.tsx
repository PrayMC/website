import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dealmeter");
  return {
    title: t("title"),
    description: "Pray - PlanetEarth KITMAP",
  };
}

export default function DealMeterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
