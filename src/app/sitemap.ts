import type { MetadataRoute } from "next";
import { routing, SITE_URL } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/dealmeter"].flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      changeFrequency: path ? ("hourly" as const) : ("weekly" as const),
      priority: path ? 0.8 : 1,
      alternates: {
        languages: Object.fromEntries([
          ...routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
          ["x-default", `${SITE_URL}/${routing.defaultLocale}${path}`],
        ]),
      },
    })),
  );
}
