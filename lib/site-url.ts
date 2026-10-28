import { site, unwrap } from "@/content/site";

/** Produkce = pouze Vercel production. Preview/dev → noindex + VERCEL_URL. */
export function isProductionDeploy() {
  return process.env.VERCEL_ENV === "production";
}

export function siteOrigin() {
  if (isProductionDeploy()) {
    return `https://${unwrap(site.domain)}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
