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
  operator: ex("G.T.S. Poběžovice, spol. s r.o."),
  ico: ex("[IČO – DOPLNIT]"),
  dic: ex("[DIČ – DOPLNIT]"),
  phone: ex("+420 000 000 000"),
  phoneHref: ex("tel:+420000000000"),
  email: ex("poptavka@example.cz"),
  address: ex("Poběžovice, 345 22"),
  openingHours: ex("Po–Pá 7:00–17:00, So po domluvě"),
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
      "Férová cena předem",
    ],
    years: ex("[X let praxe]"),
    jobs: ex("[X zakázek]"),
  },
  nav: [
    { href: "#sluzby", label: "Služby" },
    { href: "#technika", label: "Technika" },
    { href: "#cenik", label: "Ceník" },
    { href: "#oblast", label: "Oblast" },
    { href: "#faq", label: "FAQ" },
    { href: "#kontakt", label: "Kontakt" },
  ],
  services: [
    {
      id: "vykopy",
      title: "Zemní a výkopové práce",
      text: "Základy, přípojky, jímky, bazény a výkopy přesně podle potřeby pozemku.",
      bullets: ["Základy a pasy", "Přípojky vody, kanalizace, elektro", "Jímky, ČOV, bazény"],
    },
    {
      id: "teren",
      title: "Terénní úpravy",
      text: "Srovnání, modelace a příprava pozemku před stavbou nebo zahradou.",
      bullets: ["Srovnání a modelace", "Příprava pozemku", "Drenáže a odvodnění"],
    },
    {
      id: "preprava",
      title: "Přeprava strojů",
      text: "Bagr i kontejner dovezeme vlastním MAN TGL 12.220 s plošinou MULTITEC.",
      bullets: ["Vlastní doprava", "Naložení a vyložení", "Domažlicko a okolí"],
    },
    {
      id: "sut",
      title: "Odvoz suti a kontejner",
      text: "Přistavíme plato nebo suťový kontejner 4,5 m a odvezeme materiál na skládku.",
      bullets: ["Kontejner ~5 m³", "Odvoz suti a zeminy", "Likvidace dle druhu"],
    },
  ],
  // Interní poznámky (nerenderovat na webu): bagr – fotka placeholder výrobce;
  // MAN – ověřit u Zbyňka současné naložení; kontejnery – ověřit objem; hloubka výkopu u stroje.
  fleet: [
    {
      id: "bagr",
      title: "Komatsu PC38MR-5",
      image: "/photos/placeholder/pc38mr-cutout.webp",
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
      image: "/photos/man-tgl-real.webp",
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
      image: "/photos/placeholder/kontejner-sutovy.webp",
      specs: [
        { label: "Počet", value: 2, unit: "ks", decimals: 0 },
        { label: "Objem", value: 5, unit: "m³", decimals: 0 },
        { label: "Typy", value: "plato + suťový", unit: "" },
        { label: "Max. náklad", value: ex("[t – doplnit]"), unit: "" },
      ],
      blurb: "Přistavení a odvoz na místě – suť i zemina bez hledání jiné firmy.",
    },
  ],
  howItWorks: [
    {
      step: 1,
      title: "Poptáte",
      text: "Formulář nebo telefon – ideálně s fotkou místa a krátkým popisem práce.",
    },
    {
      step: 2,
      title: "Naceníme a domluvíme termín",
      text: "Řekneme cenu předem a najdeme termín, který sedí oběma stranám.",
    },
    {
      step: 3,
      title: "Přijedeme, uděláme, odvezeme",
      text: "Dovezeme bagr (a kontejner), práci odvedeme a materiál odvezeme.",
    },
  ],
  pricing: [
    {
      id: "bagr-hodina",
      title: "Minibagr s obsluhou",
      amountExVat: 950,
      unit: "Kč/h",
      note: "stroj + strojník + palivo",
    },
    {
      id: "minimum",
      title: "Minimální zakázka",
      amountExVat: 3800,
      unit: "Kč",
      badge: "4 h",
    },
    {
      id: "doprava",
      title: "Doprava",
      amountExVat: 35,
      unit: "Kč/km",
      note: "včetně naložení; km tam i zpět",
    },
    {
      id: "kontejner",
      title: "Přistavení kontejneru 4,5 m",
      amountExVat: 1900,
      unit: "Kč",
      from: true,
      note: "plato / suťový, dle vzdálenosti",
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
    "Ceny jsou orientační, bez DPH. Přesnou cenu řekneme předem po krátkém telefonátu nebo fotce místa.",
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
    { start: 0.3, end: 0.6, title: "Terénní úpravy" },
    { start: 0.6, end: 0.8, title: "Stísněné prostory – šířka 1,74 m" },
    {
      start: 0.8,
      end: 1,
      title: "Jdeme do hloubky",
      subtitle: ex("Až 3,45 m pod povrch"),
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
      a: "Šířka 1,74 m (průjezd ~1,8 m), krátká záď. Nejste-li si jistí, pošlete fotku místa.",
    },
    {
      q: "Poškodí bagr trávník nebo dlažbu?",
      a: "Gumové pásy jsou šetrné; na citlivé povrchy lze položit ochranné desky.",
    },
    {
      q: "Kolik to stojí a jak se počítá doprava?",
      a: "Orientačně 950 Kč/h bez DPH (min. 4 h), doprava 35 Kč/km. Přesnou cenu řekneme předem.",
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
      a: "Co a kde, rozsah (délka, hloubka), přístup na pozemek, ideálně fotky.",
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
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
