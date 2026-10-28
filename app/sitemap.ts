import type { MetadataRoute } from "next";
import { site, unwrap } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${unwrap(site.domain)}`;
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
