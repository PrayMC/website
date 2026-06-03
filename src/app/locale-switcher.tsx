"use client";

import { Globe, ChevronDown } from "lucide-react";
import { useParams } from "next/navigation";
import { routing, usePathname, useRouter } from "@/i18n/routing";

const localeLabels: Record<(typeof routing.locales)[number], string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
};

export default function LocaleSwitcher({ ariaLabel }: { ariaLabel: string }) {
  const { locale: currentLocale } = useParams<{ locale: string }>();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="ml-1 pl-2 border-l border-zinc-800 flex items-center gap-1">
      <Globe className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
      <div className="relative flex items-center">
        <select
          value={currentLocale}
          onChange={(e) => router.replace(pathname, { locale: e.target.value })}
          className="appearance-none bg-transparent pl-1 pr-5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 cursor-pointer rounded-lg hover:bg-zinc-800/60 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500"
          aria-label={ariaLabel}
        >
          {routing.locales.map((loc) => (
            <option key={loc} value={loc} className="bg-zinc-900 text-zinc-100">
              {localeLabels[loc]}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-0 w-3 h-3 text-zinc-500 pointer-events-none" aria-hidden />
      </div>
    </div>
  );
}
