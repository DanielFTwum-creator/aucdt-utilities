import type { MetadataRoute } from "next";
import { FILMS, METHOD, SITE } from "@/lib/films";

// Generated from lib/films.ts so new films appear in the sitemap automatically.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", METHOD.href, ...FILMS.map((f) => f.href)];
  return routes.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
