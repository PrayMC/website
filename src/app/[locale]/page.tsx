import type { Metadata } from "next";
import Image from "next/image";
import DiscordIcon from "../discord-icon";
import { BarChart3, Globe } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link, DISCORD_INVITE, localeAlternates, type Locale } from "@/i18n/routing";

const META_TITLE = "Pray - PlanetEarth KITMAP";

const metaDescriptions: Record<Locale, string> = {
  ko: "PlanetEarth KITMAP 팀의 공식 사이트. 매치 기록과 전투 통계를 확인하세요.",
  en: "Official site for PlanetEarth KITMAP team Pray. View match history and battle statistics.",
  ja: "PlanetEarth KITMAP チーム Pray の公式サイト。マッチ履歴と戦闘統計を確認できます。",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const description = metaDescriptions[locale as Locale] ?? metaDescriptions.ko;
  return {
    title: META_TITLE,
    description,
    alternates: localeAlternates("", locale),
    openGraph: {
      title: META_TITLE,
      description,
      images: [{ url: "/logo-lg.png", width: 576, height: 576, alt: "Pray" }],
    },
    twitter: {
      card: "summary",
      title: META_TITLE,
      description,
      images: ["/logo-lg.png"],
    },
  };
}

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <main className="max-w-3xl mx-auto px-4 pt-20 sm:pt-28 pb-16">
      <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
        <Image
          src="/logo-lg.png"
          alt="Pray"
          width={576}
          height={576}
          className="w-44 h-44 sm:w-72 sm:h-72 mb-8"
          priority
        />
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6 text-[#b9d9fb]">
          Pray
        </h1>
        <p className="text-zinc-500 text-base">PlanetEarth KITMAP</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-zinc-800 rounded-xl overflow-hidden">
        <NavCard
          href="/dealmeter"
          icon={<BarChart3 className="w-5 h-5" />}
          title={t("matchHistory")}
          desc={t("matchHistoryDesc")}
        />
        <NavCard
          href={DISCORD_INVITE}
          icon={<DiscordIcon className="w-5 h-5" />}
          title={t("discord")}
          desc={t("discordDesc")}
          external
        />
        <NavCard
          href="https://planetearth.kr"
          icon={<Globe className="w-5 h-5" />}
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
  icon,
  title,
  desc,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  external?: boolean;
}) {
  const inner = (
    <div className="bg-zinc-900 p-5 flex items-center gap-3.5 hover:bg-zinc-800/80 transition-colors">
      <div className="text-zinc-400">{icon}</div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-zinc-200">{title}</div>
        <div className="text-xs text-zinc-500">{desc}</div>
      </div>
      <span className="ml-auto text-zinc-600 text-sm shrink-0">→</span>
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
