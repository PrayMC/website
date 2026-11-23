import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["ko", "en", "ja", "zh"],
  defaultLocale: "ko",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

export const { Link, usePathname, redirect, getPathname } = createNavigation(routing);

export const SITE_URL = "https://kitmap.planetearth.kr";
export const DISCORD_INVITE = "https://discord.gg/aTCD3aXPND";

export const ogLocale = (locale: string) =>
  ({ ko: "ko_KR", en: "en_US", ja: "ja_JP", zh: "zh_CN" })[locale as Locale];

export function localeAlternates(path: string, locale: string) {
  const url = (l: string) =>
    `${SITE_URL}${getPathname({ locale: l as Locale, href: path || "/" })}`;
  return {
    canonical: url(locale),
    languages: Object.fromEntries([
      ...routing.locales.map((l) => [l, url(l)]),
      ["x-default", url(routing.defaultLocale)],
    ]),
  };
}
