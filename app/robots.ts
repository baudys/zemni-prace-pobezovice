import type { MetadataRoute } from "next";
import { allowSearchIndexing, siteOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  // Preview, dev i produkce na *.vercel.app — Disallow vše.
  if (!allowSearchIndexing()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  const host = siteOrigin();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
