import type { Metadata } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { site, unwrap, collectExamplePaths } from "@/content/site";
import { faqPageJsonLd, localBusinessJsonLd } from "@/lib/jsonld";
import "./globals.css";

const display = Archivo_Black({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

const isProd = process.env.VERCEL_ENV === "production";
const domain = unwrap(site.domain);

export const metadata: Metadata = {
  metadataBase: new URL(`https://${domain}`),
  title: site.meta.title,
  description: site.meta.description,
  alternates: {
    canonical: `https://${domain}`,
  },
  robots: isProd
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    title: site.meta.title,
    description: site.meta.description,
    locale: "cs_CZ",
    type: "website",
    url: `https://${domain}`,
    images: [{ url: "/hero/hero-poster.webp", width: 1920, height: 1080 }],
  },
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
    <html lang="cs" className={`${display.variable} ${body.variable}`}>
      <head>
        <link
          rel="preload"
          as="image"
          href="/hero/hero-poster.webp"
          fetchPriority="high"
          media="(min-width: 768px)"
        />
        <link
          rel="preload"
          as="image"
          href="/hero/hero-poster-mobile.webp"
          fetchPriority="high"
          media="(max-width: 767px)"
        />
        <link rel="preload" as="image" href="/seq/dig/0001.webp" media="(min-width: 768px)" />
        <link
          rel="preload"
          as="image"
          href="/seq/dig-mobile/0001.webp"
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
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
