import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["ko", "en", "ja"],
  defaultLocale: "ko",
});

export type Locale = (typeof routing.locales)[number];

export const { Link, usePathname, useRouter, redirect } = createNavigation(routing);
