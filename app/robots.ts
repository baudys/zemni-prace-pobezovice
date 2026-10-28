import type { MetadataRoute } from "next";
import { isProductionDeploy, siteOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  if (!isProductionDeploy()) {
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
