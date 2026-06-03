import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["ko", "en", "ja"],
  defaultLocale: "ko",
});

export type Locale = (typeof routing.locales)[number];

export const dateLocaleMap: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
};

export const { Link, usePathname, useRouter } = createNavigation(routing);
