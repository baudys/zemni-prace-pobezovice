import { site, unwrap } from "@/content/site";

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: unwrap(site.name),
    legalName: unwrap(site.operator),
    url: `https://${unwrap(site.domain)}`,
    telephone: unwrap(site.phone),
    email: unwrap(site.email),
    image: `https://${unwrap(site.domain)}/hero/hero-poster.webp`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Poběžovice",
      postalCode: "345 22",
      addressCountry: "CZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: site.geo.lat,
        longitude: site.geo.lng,
      },
      geoRadius: site.geo.radiusM,
    },
    priceRange: "$$",
    openingHours: unwrap(site.openingHours),
  };
}

export function faqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: site.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: unwrap(item.a),
      },
    })),
  };
}
