/**
 * Jediný zdroj pravdy pro texty a kontakty.
 * Hodnoty s example: true jsou UKÁZKOVÁ DATA – nahradit před spuštěním (BRIEF kap. 8–9).
 */

export type ExampleString = {
  value: string;
  example: true;
};

export type SiteString = string | ExampleString;

export function ex(value: string): ExampleString {
  return { value, example: true };
}

export function unwrap(s: SiteString): string {
  return typeof s === "string" ? s : s.value;
}

export function isExample(s: SiteString): boolean {
  return typeof s !== "string" && s.example === true;
}

export function collectExamplePaths(
  obj: unknown,
  path = "site",
  out: string[] = [],
): string[] {
  if (obj && typeof obj === "object") {
    if ("example" in obj && (obj as ExampleString).example === true && "value" in obj) {
      out.push(path);
      return out;
    }
    for (const [k, v] of Object.entries(obj)) {
      collectExamplePaths(v, `${path}.${k}`, out);
    }
  }
  return out;
}

export const site = {
  name: ex("GTS Minibagr"),
  domain: ex("minibagr-gts.cz"),
  operator: "G.T.S. Poběžovice, spol. s r.o.",
  ico: "25921185",
  dic: "CZ25921185",
  phone: "+420 724 518 782",
  phoneHref: "tel:+420724518782",
  email: "svec@gts-pce.cz",
  emailHref: "mailto:svec@gts-pce.cz",
  address: "Žižkova 188, 345 22 Poběžovice",
  hqAddress: "Na Sadech 12, 252 25 Zbuzany",
  openingHours: "Po–Čt 7:00–16:30, Pá 7:00–11:00",
  companyUrl: "https://www.gts-pobezovice.cz",
  contactPerson: "Zbyněk Švec",
  areaLabel: "Domažlicko a okolí do 50 km od Poběžovic",
  geo: {
    lat: 49.5107,
    lng: 12.8028,
    radiusM: 50_000,
  },
  vatRate: 0.21,
  responseSla: ex("1 pracovního dne"),
  hero: {
    h1: "Pronájem minibagru s obsluhou",
    subtitle:
      "Zemní a výkopové práce, terénní úpravy, doprava i odvoz suti – Domažlicko a okolí.",
    cta: "Poptat bagr",
    secondary: "Ceník",
  },
  claim: {
    title: "Jedna firma, jeden telefon, hotová práce.",
    points: [
      "Strojník v ceně",
      "Vlastní doprava MAN",
      "Kontejner na suť hned na místě",
    ],
    years: ex("[X let praxe]"),
    jobs: ex("[X zakázek]"),
  },
  nav: [
    { href: "#sluzby", label: "Služby" },
    { href: "#technika", label: "Technika" },
    { href: "#oblast", label: "Oblast" },
    { href: "#faq", label: "FAQ" },
    { href: "#cenik", label: "Ceník" },
    { href: "#kontakt", label: "Kontakt" },
  ],
  services: [
    {
      id: "vykopy",
      title: "Zemní a výkopové práce",
      text: "Základy, přípojky, jímky, bazény a výkopy přesně podle potřeby pozemku.",
      bullets: ["Základy a pasy", "Přípojky vody, kanalizace, elektro", "Jímky, ČOV, bazény"],
      image: "/photos/placeholder/pc38mr-action.webp",
      imageAlt: "Komatsu PC38MR při výkopových pracích",
    },
    {
      id: "teren",
      title: "Terénní úpravy",
      text: "Srovnání, modelace a příprava pozemku před stavbou nebo zahradou.",
      bullets: ["Srovnání a modelace", "Příprava pozemku", "Drenáže a odvodnění"],
      image: "/photos/pc38mr-studio.webp",
      imageAlt: "Minibagr Komatsu PC38MR-5",
    },
    {
      id: "preprava",
      title: "Přeprava strojů",
      text: "Bagr i kontejner dovezeme vlastním MAN TGL 12.220 s plošinou MULTITEC.",
      bullets: ["Vlastní doprava", "Naložení a vyložení", "Domažlicko a okolí"],
      image: "/photos/man-tgl-real.webp",
      imageAlt: "MAN TGL 12.220 s plošinou MULTITEC",
    },
    {
      id: "sut",
      title: "Odvoz suti a kontejner",
      text: "Přistavíme plato nebo suťový kontejner 4,5 m (~5 m³) a odvezeme materiál na skládku.",
      bullets: ["Kontejner 4,5 m (~5 m³)", "Odvoz suti a zeminy", "Likvidace dle druhu"],
      image: "/photos/placeholder/kontejner-sutovy.webp",
      imageAlt: "Suťový kontejner 4,5 m",
    },
  ],
  // Interní poznámky (nerenderovat na webu): studio stills Dreamina (28. 10. 2026);
  // MAN – ověřit u Zbyňka současné naložení; kontejnery – délka 4,5 m / objem ~5 m³ dle BRIEF (ověřit u provozovatele).
  fleet: [
    {
      id: "bagr",
      title: "Komatsu PC38MR-5",
      image: "/photos/pc38mr-studio.webp",
      imageAlt: "Minibagr Komatsu PC38MR-5 ve studiu",
      specs: [
        { label: "Provozní hmotnost", value: 3.8, unit: "t", decimals: 1 },
        { label: "Šířka", value: 1.74, unit: "m", decimals: 2 },
        { label: "Hloubka výkopu", value: 3.45, unit: "m", decimals: 2 },
        { label: "Průjezd", value: "~1,8 m", unit: "" },
      ],
      blurb: "Krátká záď, gumové pásy – hodí se i ke zdi, plotu a do stísněných prostor.",
    },
    {
      id: "man",
      title: "MAN TGL 12.220 + MULTITEC",
      image: "/photos/man-tgl-studio.webp",
      imageAlt: "Nákladní auto MAN TGL s plošinou a minibagrem",
      specs: [
        { label: "Celková hmotnost", value: 12, unit: "t", decimals: 0 },
        { label: "Výkon", value: 220, unit: "k", decimals: 0 },
        { label: "Nosnost plošiny", value: ex("[t – doplnit]"), unit: "" },
      ],
      blurb: "Bagr i kontejner dovezeme vlastním MAN – naložení a vyložení v ceně dopravy.",
    },
    {
      id: "kontejnery",
      title: "Kontejnery 4,5 m",
      image: "/photos/kontejnery-studio.webp",
      imageAlt: "Kontejnery na suť – plato a suťový",
      specs: [
        { label: "Počet", value: 2, unit: "ks", decimals: 0 },
        { label: "Délka", value: 4.5, unit: "m", decimals: 1 },
        { label: "Objem", value: "~5 m³", unit: "" },
        { label: "Typy", value: "plato + suťový", unit: "" },
        { label: "Max. náklad", value: ex("[t – doplnit]"), unit: "" },
      ],
      blurb: "Délka 4,5 m, objem cca 5 m³ – plato i suťový. Přistavení a odvoz na místě.",
    },
  ],
  pricing: [
    {
      id: "bagr-hodina",
      title: "Minibagr s obsluhou",
      amountExVat: 1200,
      unit: "/h",
      note: "stroj + strojník + palivo",
      example: true as const,
    },
    {
      id: "minimum",
      title: "Minimální zakázka",
      amountExVat: 4800,
      unit: "",
      badge: "4 h",
      example: true as const,
    },
    {
      id: "doprava",
      title: "Doprava",
      amountExVat: 42,
      unit: "/km",
      note: "včetně naložení; km tam i zpět",
      example: true as const,
    },
    {
      id: "kontejner",
      title: "Přistavení kontejneru 4,5 m (~5 m³)",
      amountExVat: 2400,
      unit: "",
      from: true,
      note: "plato / suťový, dle vzdálenosti",
      example: true as const,
    },
    {
      id: "sut-odvoz",
      title: "Odvoz a likvidace suti / zeminy",
      amountExVat: null,
      unit: "",
      customLabel: "dle množství",
      note: "cena podle druhu a množství",
    },
  ],
  pricingDisclaimer:
    "Ceny jsou orientační, bez DPH. Přesnou cenu potvrdíme předem v odpovědi na poptávku.",
  towns: {
    bold: [
      "Poběžovice",
      "Domažlice",
      "Horšovský Týn",
      "Klatovy",
      "Tachov",
      "Stříbro",
    ],
    all: [
      "Poběžovice",
      "Hostouň",
      "Horšovský Týn",
      "Bělá nad Radbuzou",
      "Domažlice",
      "Kdyně",
      "Holýšov",
      "Staňkov",
      "Přimda",
      "Bor",
      "Stod",
      "Stříbro",
      "Tachov",
      "Klatovy",
      "Klenčí pod Čerchovem",
      "Česká Kubice",
      "Koloveč",
      "Všeruby",
      "Kout na Šumavě",
      "Meclov",
      "Mutěnín",
      "Rybník",
      "Trhanov",
      "Blížejov",
    ],
  },
  scrollTexts: [
    { start: 0, end: 0.3, title: "Výkopy a základy" },
    { start: 0.3, end: 0.58, title: "Terénní úpravy" },
    {
      start: 0.58,
      end: 0.84,
      title: "Stísněné prostory",
      subtitle: ex("1,74 m"),
      detail: "šířka stroje",
    },
    {
      start: 0.84,
      end: 1,
      title: "Jdeme do hloubky",
      subtitle: ex("3,45 m"),
      detail: "hloubka výkopu",
    },
  ],
  truckCopy: "Bagr i kontejner přivezeme sami – vlastním MAN TGL 12.220.",
  gallery: [
    {
      src: "/photos/man-tgl-real.webp",
      alt: "MAN TGL 12.220 s plošinou MULTITEC",
      example: false,
    },
    {
      src: "/photos/placeholder/pc38mr-action.webp",
      alt: "Komatsu PC38MR při práci (placeholder výrobce)",
      example: true,
    },
    {
      src: "/photos/placeholder/pc38mr-cutout.webp",
      alt: "Komatsu PC38MR (placeholder produkt)",
      example: true,
    },
    {
      src: "/photos/placeholder/kontejner-plato.webp",
      alt: "Kontejner plato 4,5 m (placeholder)",
      example: true,
    },
    {
      src: "/photos/placeholder/kontejner-sutovy.webp",
      alt: "Suťový kontejner 4,5 m (placeholder)",
      example: true,
    },
    {
      src: "/photos/placeholder/man-tgl-bok.webp",
      alt: "MAN TGL z boku (placeholder – souhlas G.T.S.)",
      example: true,
    },
  ],
  faq: [
    {
      q: "Je v ceně i obsluha bagru?",
      a: "Ano – stroj, zkušený strojník i palivo.",
    },
    {
      q: "Na jaké práce se minibagr hodí?",
      a: "Základy, přípojky (voda, kanalizace, elektro), bazény, jímky a ČOV, plotové základy, drenáže, srovnání a modelace terénu, příprava pozemku.",
    },
    {
      q: "Kam se bagr vejde?",
      a: "Šířka 1,74 m (průjezd ~1,8 m), krátká záď. Nejste-li si jistí, popište přístup v poptávce.",
    },
    {
      q: "Poškodí bagr trávník nebo dlažbu?",
      a: "Gumové pásy jsou šetrné; na citlivé povrchy lze položit ochranné desky.",
    },
    {
      q: "Kolik to stojí a jak se počítá doprava?",
      a: "Orientačně 1200 Kč/h bez DPH (min. 4 h), doprava 42 Kč/km. Přesnou cenu řekneme předem.",
    },
    {
      q: "Co s vykopanou zeminou a sutí?",
      a: "Přistavíme kontejner 4,5 m (~5 m³) a odvezeme na nejbližší recyklační skládku; cena podle množství.",
    },
    {
      q: "Potřebuji povolení na kontejner?",
      a: "Na vlastním pozemku ne; na chodníku/silnici je potřeba zábor od obce – poradíme.",
    },
    {
      q: "Co potřebujete k nacenění?",
      a: "Co a kde, rozsah (délka, hloubka) a přístup na pozemek – vše jde napsat do poptávky.",
    },
    {
      q: "Co když prší?",
      a: "Při běžném dešti pracujeme; při lijáku se domluvíme na posunu bez poplatku.",
    },
    {
      q: "Jak se platí?",
      a: ex("Převodem na fakturu po dokončení, příp. [hotově/kartou – doplnit]."),
    },
  ],
  inquiryTypes: [
    { value: "vykop", label: "Výkop" },
    { value: "teren", label: "Terénní úpravy" },
    { value: "preprava", label: "Přeprava stroje" },
    { value: "sut", label: "Odvoz suti + kontejner" },
    { value: "jine", label: "Jiné" },
  ],
  meta: {
    title: "Pronájem minibagru s obsluhou | Domažlicko | GTS Minibagr",
    description:
      "Pronájem minibagru Komatsu PC38MR s obsluhou a dopravou. Zemní práce, terénní úpravy a odvoz suti na Domažlicku do 50 km od Poběžovic.",
  },
} as const;

export type Site = typeof site;

export function withVat(amountExVat: number, vatRate = site.vatRate): number {
  return Math.round(amountExVat * (1 + vatRate) * 100) / 100;
}

export function formatCzk(amount: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}
