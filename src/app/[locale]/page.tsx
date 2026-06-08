import type { Metadata } from "next";
import Image from "next/image";
import { BarChart3, Globe } from "lucide-react";
import { Link } from "@/i18n/routing";
import { setRequestLocale, getTranslations } from "next-intl/server";

const metaTitles: Record<string, string> = {
  ko: "Pray - PlanetEarth KITMAP",
  en: "Pray - PlanetEarth KITMAP",
  ja: "Pray - PlanetEarth KITMAP",
};

const metaDescriptions: Record<string, string> = {
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
  return {
    title: metaTitles[locale] || metaTitles.ko,
    description: metaDescriptions[locale] || metaDescriptions.ko,
    openGraph: {
      title: metaTitles[locale] || metaTitles.ko,
      description: metaDescriptions[locale] || metaDescriptions.ko,
      images: [{ url: "/logo-lg.png", width: 576, height: 576, alt: "Pray" }],
    },
    twitter: {
      card: "summary",
      title: metaTitles[locale] || metaTitles.ko,
      description: metaDescriptions[locale] || metaDescriptions.ko,
      images: ["/logo-lg.png"],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
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
          href="https://discord.gg/aTCD3aXPND"
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          }
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
