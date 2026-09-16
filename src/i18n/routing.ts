import type { Metadata } from "next";
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["ko", "en", "ja"],
  defaultLocale: "ko",
});

export type Locale = (typeof routing.locales)[number];

export const { Link, usePathname, useRouter, redirect } = createNavigation(routing);

export const SITE_URL = "https://kitmap.planetearth.kr";
export const DISCORD_INVITE = "https://discord.gg/aTCD3aXPND";

/** hreflang set for one path (e.g. "/dealmeter"), plus a self-canonical when `canonicalLocale` is given. */
export function localeAlternates(
  path: string,
  canonicalLocale?: string,
): NonNullable<Metadata["alternates"]> {
  return {
    ...(canonicalLocale && { canonical: `/${canonicalLocale}${path}` }),
    languages: Object.fromEntries([
      ...routing.locales.map((l) => [l, `/${l}${path}`]),
      ["x-default", `/${routing.defaultLocale}${path}`],
    ]),
  };
}
