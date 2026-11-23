import type { Metadata } from "next";
import { ArrowRight, ChartColumn, Globe } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link, DISCORD_INVITE, localeAlternates } from "@/i18n/routing";
import DiscordIcon from "../discord-icon";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("home");
  return {
    title: "Pray - PlanetEarth KITMAP",
    description: t("metaDescription"),
    alternates: localeAlternates("", locale),
    openGraph: {
      images: [{ url: "/logo-lg.png", width: 576, height: 576, alt: "Pray" }],
    },
    twitter: {
      card: "summary",
      images: ["/logo-lg.png"],
    },
  };
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const tn = await getTranslations("navbar");

  return (
    <main className="max-w-3xl mx-auto px-4 pt-20 sm:pt-28 pb-16">
      <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
        <img
          src="/logo-lg.webp"
          alt="Pray"
          width={576}
          height={576}
          decoding="async"
          className="w-44 h-44 sm:w-72 sm:h-72 mb-8 text-transparent"
        />
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6 text-brand">Pray</h1>
        <p className="text-muted text-base">PlanetEarth KITMAP</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-zinc-800 rounded-xl overflow-hidden">
        <NavCard
          href="/dealmeter"
          icon={ChartColumn}
          title={tn("matchHistory")}
          desc={t("matchHistoryDesc")}
        />
        <NavCard
          href={DISCORD_INVITE}
          icon={DiscordIcon}
          title={tn("discord")}
          desc={t("discordDesc")}
          external
        />
        <NavCard
          href="https://planetearth.kr"
          icon={Globe}
          title={t("planetearth")}
          desc={t("planetearthDesc")}
          external
        />
      </div>
    </main>
  );
}

function NavCard({
  href,
  icon: Icon,
  title,
  desc,
  external,
}: {
  href: string;
  icon: React.ComponentType<{ className: string }>;
  title: string;
  desc: string;
  external?: boolean;
}) {
  const inner = (
    <div className="bg-zinc-900 p-5 flex items-center gap-3.5 hover:bg-zinc-800/80 transition-colors">
      <div className="text-zinc-400">
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-zinc-200">{title}</div>
        <div className="text-xs text-muted">{desc}</div>
      </div>
      <ArrowRight className="ml-auto w-4 h-4 shrink-0 text-zinc-500" />
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return <Link href={href}>{inner}</Link>;
}
