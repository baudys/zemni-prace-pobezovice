import type { Metadata } from "next";
import { Archivo_Black, IBM_Plex_Mono, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SiteAtmosphere } from "@/components/motion/SiteAtmosphere";
import { site, unwrap, collectExamplePaths } from "@/content/site";
import { faqPageJsonLd, localBusinessJsonLd } from "@/lib/jsonld";
import "./globals.css";

const display = Archivo_Black({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  display: "swap",
});

const isProd = process.env.VERCEL_ENV === "production";
const domain = unwrap(site.domain);
const previewHost = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";
const metadataBase = new URL(isProd ? `https://${domain}` : previewHost);

export const metadata: Metadata = {
  metadataBase,
  title: site.meta.title,
  description: site.meta.description,
  ...(isProd
    ? {
        alternates: {
          canonical: `https://${domain}`,
        },
        openGraph: {
          title: site.meta.title,
          description: site.meta.description,
          locale: "cs_CZ",
          type: "website",
          url: `https://${domain}`,
          images: [{ url: "/hero/hero-poster.webp", width: 1920, height: 1080 }],
        },
        robots: { index: true, follow: true },
      }
    : {
        robots: { index: false, follow: false },
        openGraph: {
          title: site.meta.title,
          description: site.meta.description,
          locale: "cs_CZ",
          type: "website",
        },
      }),
};

if (process.env.NODE_ENV === "production") {
  const examples = collectExamplePaths(site);
  if (examples.length) {
    console.warn(
      `[GTS] Zbývá ${examples.length} ukázkových hodnot (example: true). Nahradit před spuštěním:`,
      examples.slice(0, 12).join(", "),
      examples.length > 12 ? "…" : "",
    );
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <link
          rel="preload"
          as="image"
          href="/seq/dig/0001.webp"
          fetchPriority="high"
          media="(min-width: 768px)"
        />
        <link
          rel="preload"
          as="image"
          href="/seq/dig-mobile/0001.webp"
          fetchPriority="high"
          media="(max-width: 767px)"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqPageJsonLd()),
          }}
        />
      </head>
      <body className="min-h-svh antialiased">
        <SiteAtmosphere />
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
