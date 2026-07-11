import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://kitmap.planetearth.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/dealmeter"].flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      changeFrequency: path ? ("hourly" as const) : ("weekly" as const),
      priority: path ? 0.8 : 1,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${BASE_URL}/${l}${path}`]),
        ),
      },
    })),
  );
}
