import { ChartColumn } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link, DISCORD_INVITE } from "@/i18n/routing";
import DiscordIcon from "./discord-icon";
import LocaleSwitcher from "./locale-switcher";

const NAV_LINK =
  "flex items-center justify-center gap-1.5 px-3 py-1.5 pointer-coarse:min-h-11 pointer-coarse:min-w-11 text-xs font-medium rounded-lg transition-colors text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60";

export default async function Navbar() {
  const t = await getTranslations("navbar");
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-zinc-800/60">
      <div className="page-frame">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 pointer-coarse:min-h-11 group">
            <img
              src="/logo-sm.png"
              alt=""
              width={36}
              height={36}
              loading="lazy"
              decoding="async"
              className="w-9 h-9 shrink-0"
            />
            <span className="text-lg font-extrabold text-brand">Pray</span>
          </Link>

          <div className="flex items-center gap-1">
            <Link href="/dealmeter" aria-label={t("matchHistory")} className={NAV_LINK}>
              <ChartColumn className="w-4 h-4" />
              <span className="hidden sm:inline">{t("matchHistory")}</span>
            </Link>
            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("discord")}
              className={NAV_LINK}
            >
              <DiscordIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{t("discord")}</span>
            </a>
            <LocaleSwitcher label={t("localeSwitcherLabel")} />
          </div>
        </div>
      </div>
      <div className="h-px pray-gradient-border opacity-20" />
    </nav>
  );
}
