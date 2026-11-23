import type { MetadataRoute } from "next";
import { localeAlternates, routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/dealmeter"].flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localeAlternates(path, locale).canonical,
      changeFrequency: path ? ("hourly" as const) : ("weekly" as const),
      priority: path ? 0.8 : 1,
      alternates: { languages: localeAlternates(path, locale).languages },
    })),
  );
}
