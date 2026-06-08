import Image from "next/image";
import { Gamepad2, BarChart3 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import LocaleSwitcher from "./locale-switcher";

export default async function Navbar() {
  const t = await getTranslations("navbar");
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-zinc-800/60">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo-sm.png"
              alt="Pray"
              width={36}
              height={36}
              className="w-9 h-9 shrink-0"
            />
            <span className="text-lg font-extrabold text-[#b9d9fb]">Pray</span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/dealmeter"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
            >
              <BarChart3 className="w-4 h-4" aria-hidden />
              <span className="hidden sm:inline">{t("matchHistory")}</span>
              <span className="hidden sm:inline text-[9px] font-bold uppercase tracking-wider text-[#b9d9fb] bg-[#b9d9fb]/10 px-1.5 py-0.5 rounded">
                Beta
              </span>
            </Link>
            <a
              href="https://discord.gg/aTCD3aXPND"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("discord")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
            >
              <Gamepad2 className="w-4 h-4" aria-hidden />
              <span className="hidden sm:inline">{t("discord")}</span>
            </a>
            <LocaleSwitcher ariaLabel={t("localeSwitcherLabel")} />
          </div>
        </div>
      </div>
      <div className="h-px pray-gradient-border opacity-20" />
    </nav>
  );
}
