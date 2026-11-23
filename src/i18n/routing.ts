import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["ko", "en", "ja", "zh"],
  defaultLocale: "ko",
});

export type Locale = (typeof routing.locales)[number];

export const { Link, usePathname, redirect } = createNavigation(routing);

export const SITE_URL = "https://kitmap.planetearth.kr";
export const DISCORD_INVITE = "https://discord.gg/aTCD3aXPND";

export const ogLocale = (locale: string) =>
  ({ ko: "ko_KR", en: "en_US", ja: "ja_JP", zh: "zh_CN" })[locale as Locale];

export function localeAlternates(path: string, locale: string) {
  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages: Object.fromEntries([
      ...routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
      ["x-default", `${SITE_URL}/${routing.defaultLocale}${path}`],
    ]),
  };
}
