import { site, unwrap } from "@/content/site";

/** Vercel production environment (ne preview/dev). */
export function isProductionDeploy() {
  return process.env.VERCEL_ENV === "production";
}

function isVercelAppHost(url: string): boolean {
  try {
    return new URL(url).hostname.endsWith(".vercel.app");
  } catch {
    return url.includes(".vercel.app");
  }
}

/**
 * Veřejná origin URL pro canonical / OG / JSON-LD.
 * 1) NEXT_PUBLIC_SITE_URL — nastav na aktuální URL, dokud minibagr-gts.cz neběží
 * 2) produkce → site.domain
 * 3) preview → VERCEL_URL
 */
export function siteOrigin() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  if (isProductionDeploy()) {
    return `https://${unwrap(site.domain)}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

/**
 * Indexovat jen produkci na vlastní doméně.
 * Preview a *.vercel.app → noindex.
 */
export function allowSearchIndexing() {
  if (!isProductionDeploy()) return false;
  if (isVercelAppHost(siteOrigin())) return false;
  return true;
}
