import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://kitmap.planetearth.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = routing.locales;

  const staticPages = ["", "/dealmeter"];

  return staticPages.flatMap((path) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "/dealmeter" ? "always" as const : "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
  );
}
