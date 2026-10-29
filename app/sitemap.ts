import type { MetadataRoute } from "next";
import { allowSearchIndexing, siteOrigin } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  // Preview/dev / *.vercel.app — prázdný sitemap (spolu s robots disallow).
  if (!allowSearchIndexing()) {
    return [];
  }

  const base = siteOrigin();
  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/zasady-ochrany-osobnich-udaju`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
