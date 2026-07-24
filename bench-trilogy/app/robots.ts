import type { MetadataRoute } from "next";
import { SITE } from "@/lib/films";

// thebench.techbridge.edu.gh is the public production site, so this defaults to
// indexable. On any preview/staging deploy of the same code, set
// SEO_BLOCK_INDEX=true in that environment to keep it out of search.
export default function robots(): MetadataRoute.Robots {
  const blockIndex = process.env.SEO_BLOCK_INDEX === "true";
  if (blockIndex) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
