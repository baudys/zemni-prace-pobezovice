# BRIEF – landing page „GTS Minibagr“ (pronájem minibagru s obsluhou a dopravou)

> Verze 2 (28. 10. 2026). Nahrazuje starší `brief-landing-page.md` – co z něj platí, je převzato sem.
> **Podklady jsou už připravené** ve složce `public/` tohoto balíčku (převedené, přejmenované, optimalizované). Agent je jen zkopíruje do kořene projektu.
> Všechny kontakty, ceny a čísla jsou **UKÁZKOVÁ DATA** – před spuštěním nahradit (viz kap. 8 a 9).

---

## 1. Cíl a zadání

Jednostránkový web pro **G.T.S. Poběžovice** – pronájem minibagru **Komatsu PC38MR s obsluhou**, doprava techniky vozem **MAN TGL 12.220 s plošinou MULTITEC** a dva **kontejnery 4,5 m** (plošinový/plato a suťový).

- **Hlavní konverze:** odeslaná poptávka (formulář) nebo klik na telefon.
- **Vedlejší cíl:** „wow“ dojem (scroll animace bagru, průlet do země, projíždějící nákladák), který odliší web od konkurence.
- **Služby:** zemní a výkopové práce · terénní úpravy · přeprava strojů · odvoz suti (+ přistavení kontejneru).
- **Cílovka:** soukromníci (stavba, zahrada, přípojky), menší stavební firmy, obce. Oblast **Domažlicko a okolí do 50 km od Poběžovic**.
- **Jazyk:** čeština.

## 2. Inspirace

- Obsah a struktura: https://www.kontejnery-protiva.cz/zemni-prace-minibagr/ · https://www.bezkompresetechnika.cz · https://www.minibagr.com
- Vzhled a scroll animace: https://www.cominvi.com.mx/ (canvas sekvence řízená scrollem, velká typografie, plynulé přechody), 3D/hloubkový pocit jako https://motionsites.ai
- Varování k výkonu: https://roughworks.ca/lamacraft/ (120 snímků = 53 MB) → my máme 121 snímků ≈ 7 MB desktop / 2,7 MB mobil.

## 3. Vizuální styl

- **Look CoMinVi:** fullscreen fotografie a canvas, velká tučná typografie přes obraz, hodně „vzduchu“, pomalé plynulé přechody (Lenis).
- **3D pocit (motionsites):** parallax vrstev (text / obraz / textura posouvat různou rychlostí), jemné naklopení karet podle kurzoru (max 4–6°, jen desktop + pointer: fine), hloubka pomocí stínů.
- **Pozadí sekcí = fotorealistické textury materiálů** (`public/textures/`): řez půdou → štěrk → suť/cihly → písek (viz mapování v kap. 4). Přes texturu tmavý gradient/overlay (cca `rgba(0,0,0,.55)`), aby text měl kontrast ≥ 4.5:1.
- **Barvy:**
  - `--brand-red: #E1011B` (G.T.S.) – **hlavní CTA** („Poptat bagr“), aktivní stavy, drobné akcenty.
  - `--komatsu-yellow: #F5B800` (orientačně) – jen sekundární akcent (čísla, výstražné šrafy), nesoupeřit s červenou.
  - černá `#111`, bílá, zemité tóny (hnědá `#5A3E2B`, písková `#C8A877`).
- **Opakující se prvky:** žluto-černé výstražné šrafy jako tenké oddělovače, otisk pásu jako scroll indikátor, „kóty“ u čísel ve specifikacích.
- **Typografie:** nadpisy tučný široký grotesk (např. *Archivo Expanded/Black* nebo *Barlow Condensed ExtraBold*), text *Inter*. Přes `next/font`, `display: swap`, s českou diakritikou (`latin-ext`).
- **Logo:** `public/brand/gts-logo.svg` (červené G.T.S., černý stín, bílý podklad) a `gts-logo-transparent.svg`. V hlavičce malé, v patičce „Provozuje G.T.S. Poběžovice“.
- **Mikrointerakce:** jemné, ne kýčovité. Vše musí respektovat `prefers-reduced-motion` (kap. 6.6).

## 4. Struktura stránky (sekce a obsah)

| # | Sekce (id) | Pozadí | Obsah |
|---|---|---|---|
| 0 | Hlavička (sticky) | průhledná → po scrollu tmavá s blur | logo, kotvy (Služby, Technika, Ceník, Oblast, FAQ, Kontakt), tel. číslo, malé CTA „Poptat bagr“ |
| 1 | **Hero** (`#hero`) | smyčka videa `hero-loop` | H1, podtitulek, červené CTA – viz 5.1 |
| 2 | **Scroll scéna** (`#v-akci`) | canvas sekvence dig → underground | 3 texty naskakují bokem – viz 5.2 |
| 3 | **Služby** (`#sluzby`) | `soil-cross-section` (navazuje na konec průletu do země) | 4 karty: Zemní a výkopové práce · Terénní úpravy · Přeprava strojů · Odvoz suti (+ kontejner). Ikona, 2–3 věty, odrážky typických prací |
| 4 | **Technika** (`#technika`) | `gravel` | 3 karty se specifikacemi: Komatsu PC38MR · MAN TGL 12.220 + MULTITEC · Kontejnery 4,5 m (plato a suťový). Animované počítadlo čísel |
| 5 | **Jak to funguje** (`#jak-to-funguje`) | tmavá / `sand` | 3 kroky: **1 Poptáte** (formulář/telefon, fotka místa) → **2 Naceníme a domluvíme termín** → **3 Přijedeme, uděláme, odvezeme**. Kroky propojené stopou pásu kreslenou podle scrollu (SVG `stroke-dashoffset`) |
| 6 | **Ceník** (`#cenik`) | `rubble-bricks` | ceny jako „kovové štítky“ (bez DPH velkým, s DPH menším), poznámka o orientačnosti – data z `content/site.ts` |
| 7 | **Oblast působnosti** (`#oblast`) | tmavá zemitá | stylizovaná mapa (vrstevnice) s kruhem 50 km od Poběžovic + textový seznam obcí (lokální SEO) – viz 5.5 |
| 8 | **Reference / fotky** (`#reference`) | `sand` | galerie (masonry / horizontální scroll na mobilu), lightbox. Zatím: reálná fotka MAN + Dreamina stills + placeholdery; připravit pro doplnění fotek z akcí |
| 9 | **FAQ** (`#faq`) | tmavá | akordeon, 8–10 otázek (kap. 8.4), Schema.org `FAQPage` |
| 10 | **Nákladák** (`#preprava`) | přechod do patičky (zemina/silnice) | MAN s bagrem přejede zleva doprava podle scrollu – viz 5.4 |
| 11 | **Kontakt + poptávka** (`#kontakt`) | tmavá | formulář + kontaktní údaje + tlačítko „Zavolat“ (`tel:`) – viz 6.7 |
| 12 | Patička | černá | logo G.T.S., IČO (placeholder), adresa, odkazy, © rok, „Ceny jsou orientační“, odkaz na zásady zpracování osobních údajů |

Pořadí 10 a 11 lze prohodit (nákladák těsně nad patičkou = „před footerem“) – **výchozí: nákladák mezi FAQ a kontaktem**, aby přejezd nebyl až za formulářem; pokud by působil rušivě, přesunout pod kontakt těsně před patičku (zadání: „před footerem“).

## 5. Animace (detailní specifikace)

Knihovny: **GSAP 3 + ScrollTrigger**, **Lenis** (smooth scroll, propojit s ScrollTrigger přes `lenis.on('scroll', ScrollTrigger.update)` a `gsap.ticker`). Vše inicializovat v client komponentách, cleanup v `useEffect`/`gsap.context().revert()`.

### 5.1 Hero (`HeroVideo`)
- Kompozice podle `assets-start/mockup-hero-stred.png`: **bagr dole uprostřed**, zabírá cca **1/3 výšky** obrazu, **horizont ~70 % výšky**; **nad ním na obloze** H1 + podtitulek + červené CTA **„Poptat bagr“** (kotva `#kontakt`). Sekundární textový odkaz „Ceník“.
- Pozadí: `<video autoplay muted loop playsinline preload="metadata" poster="/hero/hero-poster.webp">` se zdroji `hero-loop.webm` (VP9) a `hero-loop.mp4` (H.264); na mobilu (`max-width: 767px`) `hero-loop-mobile.mp4` + `hero-poster-mobile.webp`. `object-fit: cover`.
- Pozn.: ve zdrojovém videu stojí bagr mírně **vlevo od středu** (~40 % šířky) a je vyšší než 1/3 – použít `object-position` (např. `40% 100%`) a ověřit na 16:9, 4:3, 9:16; na mobilu na výšku je bagr oříznutý → poster/video zarovnat tak, aby bagr zůstal celý.
- Poster je zároveň **LCP prvek** → `<link rel="preload" as="image" href="/hero/hero-poster.webp" fetchpriority="high">` (mobil: media query na mobile variantu).
- Jemný parallax: text při scrollu odjíždí nahoru rychleji než video, video lehce zoom 1 → 1.05.
- Scroll indikátor dole: otisk pásu / šipka, pulzuje.
- Reduced motion / `navigator.connection.saveData`: video se nepouští, jen poster.
- Poster (`hero-poster.webp`) ≈ první snímek scroll scény (`seq/dig/0001.webp`) → přechod hero → scéna 1 je plynulý (video na konci hero může prolnout do canvasu).

### 5.2 Scroll scéna 1 + 2 (`ScrollSequence`)
- **Jedna připnutá sekce** (`pin: true`, `scrub: 0.5`, délka cca **400–500 vh** desktop, 300 vh mobil) s jedním `<canvas>` přes celý viewport.
- **Scéna 1 – „dig“**: `public/seq/dig/0001…0121.webp` – bagr zabírá lžící do hlíny.
- **Scéna 2 – „underground“**: `public/seq/underground/0001…0121.webp` – kamera sjede pod zem do textury půdy. **První snímek underground = poslední snímek dig** → při spojení snímek `underground/0001` přeskočit (celkem 241 unikátních snímků) – jeden spojitý průběh 0→1.
- Počty snímků NEhardcodovat – číst z `manifest.json` v každé složce (`{count,width,height,pattern,firstIndex}`).
- Kreslení: `drawImage` s výpočtem „cover“ (zachovat poměr, oříznout), `devicePixelRatio` max 2, překreslit při `resize`. Kreslit jen při změně indexu (rAF).
- **Načítání:** po hydrataci přednačíst prvních ~10 snímků dig (`<link rel=preload>` pro 0001), pak progresivně: nejdřív každý 4. snímek celé sekvence, potom zbytek (`requestIdleCallback`). Načítat až když je sekce blízko (IntersectionObserver, `rootMargin: 200%`). Dokud snímek chybí, kreslit nejbližší načtený. Dekódovat přes `img.decode()` / `createImageBitmap`.
- **Mobil** (šířka < 768 px): složky `seq/dig-mobile` a `seq/underground-mobile` (960×540).
- **Texty přes scénu** (fade/slide z boku podle progresu): 0–30 % „Výkopy a základy“, 30–60 % „Terénní úpravy“, 60–80 % „Stísněné prostory – šířka 1,74 m“; během underground (80–100 %) velký nápis „Jdeme do hloubky“ / „Až 3,45 m pod povrch*“ (*ověřit). Volitelně částice hlíny (canvas/CSS) při zabrání lžíce – jen desktop.
- Konec underground = textura půdy → navazuje sekce **Služby** s pozadím `soil-cross-section.webp` (bez viditelného švu; případně 10% crossfade).
- **Fallback** (reduced motion, `saveData`, `deviceMemory ≤ 2`, `hardwareConcurrency ≤ 4` na mobilu, nebo selhání načtení): žádný pin ani canvas – statický obrázek `hero/bucket-in-soil.webp` + texty pod sebou, pod tím `textures/soil-cross-section`.

### 5.3 Sekce s texturami
- Textura jako `background-image` přes `image-set()` / `<picture>` s `-mobile` variantou (1280 px), `background-size: cover`, lazy (mimo první obrazovku). Parallax pozadí max 10–15 % (vypnout při reduced motion).
- Mapování: Služby → `soil-cross-section` · Technika → `gravel` · Jak to funguje → `sand` (s tmavým overlayem) · Ceník → `rubble-bricks` · Reference → `sand`/`gravel`. **Chybí** textura „hlína shora (top-down soil)“ – zatím použít `soil-cross-section` nebo vygenerovat a doplnit `textures/soil-top.webp`.

### 5.4 Nákladák (`TruckDriveBy`)
- `public/truck/truck.webp` (průhledné pozadí, oříznuté okraje, 2000×1049, 218 KB; `truck.png` 2,5 MB jen jako fallback/zdroj). **Směr jízdy: doprava** – auto je natočené čelem doprava.
- Sekce cca 150–200 vh, uvnitř sticky pruh (silnice / textura štěrku). `translateX` z `-110 %` šířky auta (mimo obraz vlevo) do `+110vw` (mimo obraz vpravo) navázané na scroll (`scrub: true`). Lehké „hopkání“ ±2 px (sin) a prach (pár CSS/canvas částic za koly) – jen desktop.
- Šířka auta: desktop ~55–65vw, mobil ~120vw (projede i tak).
- Nad/pod pruhem text: „Bagr i kontejner přivezeme sami – vlastním MAN TGL 12.220.“
- Reduced motion: auto staticky uprostřed, bez pohybu.

### 5.5 Mapa oblasti
- Převzato ze starého briefu, upraveno na **50 km**: stylizovaná vrstevnicová mapa jako **statické SVG** (`public/map/oblast.svg`, cíl < 150 KB gzip) – střed **Poběžovice 49.5107 N, 12.8028 E**, kruh 50 km (+ vnitřní orientační kruhy 10/25 km), Poběžovice zvýrazněné. Západně/jižně ~15 km státní hranice s Bavorskem – německou část ztlumit (pokud se tam nejezdí – ověřit).
- Generování (volitelné, skript v buildu): DEM (Copernicus GLO-30/SRTM) → `gdal_contour -i 20` → GeoJSON → `mapshaper -simplify` → `d3-geo` (Mercator) → SVG. Atribuce „© OpenStreetMap contributors“. **Pokud to agent nestihne: jednoduché SVG s kruhem a body obcí (souřadnice níže) a TODO.**
- Animace: kruhy se „rozvlní“ od středu při vstupu do viewportu.
- Pod mapou seznam obcí jako text (SEO), větší města tučně: Poběžovice, Hostouň, Horšovský Týn, Bělá nad Radbuzou, **Domažlice**, Kdyně, Holýšov, Staňkov, Přimda, Bor, Stod, Stříbro, Tachov, Klatovy, Klenčí pod Čerchovem, Česká Kubice, Koloveč, Všeruby, Kout na Šumavě, Meclov, Mutěnín, Rybník, Trhanov, Blížejov…
- LocalBusiness schema: `areaServed` = `GeoCircle` (střed výše, `geoRadius: 50000`).

### 5.6 Další mikroanimace
- Karty služeb/techniky: vstup `y: 40 → 0, opacity 0 → 1`, stagger 0.08; hover = karta „vystoupí“ (translateZ/scale 1.02 + stín).
- Počítadla čísel (technika): z 0 na hodnotu při vstupu do viewportu.
- „Jak to funguje“: SVG stopa pásu se kreslí podle scrollu.

## 6. Technická specifikace

### 6.1 Stack
- **Next.js (App Router, TypeScript, `src/` nebo kořen – libovolné)**, **Tailwind CSS**, **GSAP + ScrollTrigger**, **Lenis**, ESLint. Package manager pnpm (nebo npm).
- Bez UI frameworku navíc; komponenty vlastní (případně shadcn/ui jen pro akordeon a formulář).
- Deploy: **Vercel** (preview deploy z větve; produkce až po schválení obsahu).

### 6.2 Struktura repozitáře
```
/
├─ app/
│  ├─ layout.tsx            # fonty, metadata, Lenis provider, JSON-LD
│  ├─ page.tsx              # skládá sekce
│  ├─ actions/inquiry.ts    # server action – STUB s TODO (viz 6.7)
│  ├─ zasady-ochrany-osobnich-udaju/page.tsx
│  ├─ sitemap.ts, robots.ts, opengraph-image.(tsx|png)
├─ components/
│  ├─ sections/ Hero, ScrollScene, Services, Fleet, HowItWorks, Pricing, Area, Gallery, Faq, TruckDriveBy, Contact, Footer
│  ├─ motion/  ScrollSequence.tsx, SmoothScroll.tsx (Lenis), useReducedMotion.ts, useLowEndDevice.ts
│  └─ ui/      Button, Card, PriceTag, Placeholder (vizuální značka ukázkových dat)
├─ content/
│  └─ site.ts               # VŠECHNA ukázková data na jednom místě (kap. 8)
├─ public/                  # ← zkopírovat z balíčku (kap. 7)
├─ scripts/
│  ├─ convert-frames.mjs    # JPG snímky → WebP sekvence + manifest (sharp)
│  └─ convert-stills.mjs    # Dreamina/WhatsApp/PNG → public/ (sharp)
└─ README.md                # jak spustit, jak vyměnit podklady, co nahradit před spuštěním
```

### 6.3 Konfigurace obsahu – `content/site.ts`
- Jediný zdroj pravdy pro: název, doménu, telefon, e-mail, IČO, adresu, provozní dobu, ceník, specifikace techniky, oblast, FAQ, texty sekcí.
- Každá ukázková hodnota označena `example: true` (nebo obalena helperem `ex("…")`) → komponenta `<Placeholder>` ji v **dev buildu** (a na preview, pokud `NEXT_PUBLIC_SHOW_PLACEHOLDERS=1`) vizuálně zvýrazní (žluté přerušované podtržení + tooltip „UKÁZKOVÁ DATA“). V produkci varování v konzoli buildu, pokud nějaká `example: true` zůstane.

### 6.4 Výkon
- **Cíle: Lighthouse mobil Performance ≥ 85 (min. 80), desktop ≥ 90; LCP < 2,5 s (mobil, 4G), CLS < 0,1, TBT < 200 ms.**
- Hero poster preload + `fetchpriority="high"`; video `preload="metadata"`, start až po `load`.
- Sekvence: lazy (IntersectionObserver), progresivní načítání, max ~7–8 MB desktop / ~3 MB mobil na sekvenci (aktuální stav: dig 7,0 MB / 2,7 MB, underground 7,9 MB / 3,2 MB).
- Textury: `-mobile` varianty 1280 px (140–260 KB), desktop 2560 px (0,55–1 MB) jen na `min-width: 1280px`.
- Obrázky obsahu přes `next/image` (AVIF/WebP, `sizes`). Statické podklady v `public/` s dlouhým cache (`Cache-Control: public, max-age=31536000, immutable` přes `next.config` headers pro `/seq/*`, `/textures/*`, `/hero/*`, `/truck/*`).
- GSAP/Lenis načítat jen v client komponentách; žádné těžké knihovny v prvním chunku.

### 6.5 Mobil a slabá zařízení
- Breakpoint 768 px: mobile varianty videa, posteru, sekvencí a textur.
- „Low-end“ detekce (`useLowEndDevice`): `navigator.deviceMemory ≤ 2` || `hardwareConcurrency ≤ 4` (mobil) || `connection.saveData` || `effectiveType` ∈ {`2g`,`3g`} → **statické obrázky místo sekvence**, bez Lenis (nativní scroll), bez parallaxu.
- Testovat iOS Safari (video autoplay vyžaduje `muted playsinline`; pozor na `100vh` → `svh/dvh`) a Android Chrome.

### 6.6 Přístupnost a `prefers-reduced-motion`
- Při `reduce`: žádný Lenis, žádný pin/scrub, žádný autoplay videa (jen poster), nákladák statický, počítadla rovnou konečná hodnota, žádný parallax. Obsah sekcí plně dostupný.
- Sémantika: jeden `h1`, logické `h2`, `alt` texty česky, focus styly, kontrast ≥ 4.5:1 přes textury, formulář s `label`, chybové hlášky `aria-live`. Canvas `aria-hidden` + textový ekvivalent.

### 6.7 Poptávkový formulář
- Pole: Co potřebujete (výběr: výkop / terénní úpravy / přeprava stroje / odvoz suti + kontejner / jiné), Místo (obec), Termín (orientačně), Jméno, Telefon*, E-mail, Poznámka, souhlas se zpracováním (odkaz na zásady). Volitelně foto (zatím jen UI, upload TODO).
- Antispam: honeypot pole + časová kontrola (min. 3 s).
- **Odesílání bez konfigurace backendu:** server action `app/actions/inquiry.ts` = **STUB** – validace (zod), `console.log`, vrátí úspěch + `// TODO: napojit Resend/SMTP (env RESEND_API_KEY, INQUIRY_TO)`. Pokud env chybí, formulář nabídne **fallback `mailto:`** s předvyplněným předmětem a tělem z polí. Žádné reálné odesílání bez konfigurace.
- Po odeslání: potvrzení „Děkujeme, ozveme se nejpozději do …“ + tlačítko „Raději zavolat“.

### 6.8 SEO a měření
- `metadata`: title „Pronájem minibagru s obsluhou | Domažlicko | GTS Minibagr“, description, OG obrázek (z hero posteru + logo), `lang="cs"`, canonical na doménu z `site.ts`.
- JSON-LD: `LocalBusiness` (název, tel, adresa, `areaServed` GeoCircle 50 km, `priceRange`), `FAQPage`.
- `sitemap.ts`, `robots.ts`. Na preview `noindex`.
- Analytika: Vercel Analytics (nebo Plausible) – události `inquiry_submit`, `phone_click`, `cta_click`.

## 7. Podklady – hotová složka `public/` (už převedeno)

Vše je v `cursor-handoff/public/` → zkopírovat do kořene projektu jako `public/`. Zdroj: soubory od Daniela (Dreamina AI + reálná fotka), převedeno 28. 10. 2026 skripty ve `scripts/`.

```
public/
├─ brand/
│  ├─ gts-logo.svg                 # logo G.T.S. (červená #E1011B, černý stín, bílý podklad) – 8 KB
│  └─ gts-logo-transparent.svg     # varianta bez podkladu – 7 KB
├─ hero/
│  ├─ hero-loop.mp4                # H.264, 1920×1080, 30 fps, 3,57 s, bez zvuku, faststart – 435 KB
│  ├─ hero-loop.webm               # VP9, 1920×1080 – 252 KB
│  ├─ hero-loop-mobile.mp4         # H.264, 960×540 – 101 KB
│  ├─ hero-poster.webp             # 1920×1080 – 126 KB (= začátek smyčky, LCP)
│  ├─ hero-poster-mobile.webp      # 960×540 – 31 KB
│  └─ bucket-in-soil.webp          # 1920×1080 – 125 KB (still: lžíce v hlíně; fallback scroll scény)
├─ seq/
│  ├─ dig/0001.webp … 0121.webp               # 121 snímků 1920×1080, q70 – 7,0 MB + manifest.json
│  ├─ dig-mobile/0001.webp … 0121.webp        # 121 snímků 960×540 – 2,7 MB + manifest.json
│  ├─ underground/0001.webp … 0121.webp       # 121 snímků 1920×1080 – 7,9 MB + manifest.json
│  └─ underground-mobile/0001.webp … 0121.webp# 121 snímků 960×540 – 3,2 MB + manifest.json
├─ textures/
│  ├─ soil-cross-section.webp (+ -mobile)     # řez půdou – 769 / 187 KB
│  ├─ gravel.webp (+ -mobile)                 # štěrk/kameny – 1027 / 257 KB
│  ├─ rubble-bricks.webp (+ -mobile)          # betonová suť a cihly – 550 / 142 KB
│  └─ sand.webp (+ -mobile)                   # písek – 777 / 182 KB
│     (desktop 2560×1440, mobil 1280×720; CHYBÍ soil-top.webp = hlína shora)
├─ truck/
│  ├─ truck.webp                   # MAN + bagr na červené plošině, průhledné pozadí, čelem doprava, 2000×1049 – 218 KB
│  └─ truck.png                    # totéž PNG (fallback/zdroj) – 2,5 MB
└─ photos/
   ├─ man-tgl-real.webp            # REÁLNÁ fotka klientova MAN (WhatsApp) 1600×1200 – 213 KB → sekce Technika
   └─ placeholder/                 # ⚠ referenční fotky výrobců – NEPOUŽÍVAT NA PRODUKCI (README uvnitř)
      ├─ pc38mr-action.webp, pc38mr-cutout.webp   # Komatsu press/produkt
      ├─ kontejner-plato.webp, kontejner-sutovy.webp  # MULTITEC katalog
      └─ man-tgl-bok.webp          # z webu G.T.S. (po souhlasu OK)
```

- Formát `manifest.json`: `{"count":121,"width":1920,"height":1080,"pattern":"{0000}.webp","firstIndex":1,"quality":70}`.
- Zdroje: hero smyčka = `1.mp4` (ezgif snímky ze složky `1/` se nepoužívají), dig = snímky `2/` (z `2.mp4`), underground = snímky `3/` (z `3.mp4`). Snímky sjednoceny na 1920×1080 (cover-crop; `2/` měly 1928×1076).
- Seam ověřen: `dig/0121` ≈ `underground/0001`; `hero-poster` ≈ `dig/0001`.
- Pokud nějaký soubor chybí → komponenta použije neutrální placeholder (zemitý gradient + text „PODKLAD CHYBÍ: <cesta>“) a nespadne.
- Nové verze podkladů: `node scripts/convert-frames.mjs --in <složka JPG> --out public/seq/dig --mobile 960` (vytvoří i `dig-mobile`), resp. `node scripts/convert-stills.mjs <složka>`.
- Licence: Dreamina výstupy a WhatsApp fotka = klientovy. Fotky v `photos/placeholder/` a `assets-start/ZDROJE.md` jen pro vývoj.

## 8. UKÁZKOVÁ DATA (vše v `content/site.ts`, nahradit před spuštěním)

### 8.1 Firma a kontakt
| Klíč | Ukázková hodnota | Pozn. |
|---|---|---|
| `name` | **GTS Minibagr** | pracovní název |
| `domain` | **minibagr-gts.cz** | **neověřeno** (dostupnost/registrace) |
| `operator` | G.T.S. Poběžovice, spol. s r.o. | ověřit, pod jakou firmou služba poběží |
| `ico` | **`[IČO – DOPLNIT]`** | **nevymýšlet** – placeholder text |
| `dic` | `[DIČ – DOPLNIT]` | plátcovství DPH ověřit |
| `phone` | **+420 000 000 000** (`tel:+420000000000`) | placeholder |
| `email` | **poptavka@example.cz** | placeholder |
| `address` | Poběžovice, 345 22 (sídlo/provozovna) | přesná adresa doplnit |
| `openingHours` | Po–Pá 7:00–17:00, So po domluvě | placeholder |
| `area` | Domažlicko a okolí do **50 km** od Poběžovic | střed 49.5107 N, 12.8028 E |

### 8.2 Ceník (ukázka)
| Položka | Bez DPH | S DPH 21 % | Poznámka |
|---|---|---|---|
| Minibagr Komatsu PC38MR **s obsluhou** | **950 Kč/h** | 1 149,50 Kč/h | stroj + strojník + palivo |
| Minimální zakázka | **4 h** (3 800 Kč) | 4 598 Kč | |
| Doprava (bagr na MAN TGL, kontejner) | **35 Kč/km** | 42,35 Kč/km | ověřit: km tam i zpět? naložení v ceně? |
| Přistavení kontejneru 4,5 m (plato / suťový, ~5 m³) | **od 1 900 Kč** | od 2 299 Kč | přistavení + odvoz, dle vzdálenosti |
| Odvoz a likvidace suti / zeminy | dle množství | | na nejbližší recyklační skládku, cena podle druhu a množství |

Texty u ceníku: „Ceny jsou orientační, bez DPH. Přesnou cenu řekneme předem po krátkém telefonátu nebo fotce místa.“ Na štítku „od 950 Kč/h“ velkým, „1 149,50 Kč s DPH“ menším. DPH výpočet v kódu (`vatRate: 0.21`), ne natvrdo.

Konkurence pro orientaci (ověřeno 28. 10. 2026, ze starého briefu): protiva 750 Kč/h + DPH; bagr-cb 750 Kč/h, 35 Kč/km; bezkompresetechnika 790 Kč/h vč. DPH, min. 3 h, 25 Kč/km; pronajem-minibagr 900 Kč/h, paušál dle pásem.

### 8.3 Technika (specifikace – ověřit u stroje G.T.S.)
| Stroj | Parametry (ukázka / dle výrobce) |
|---|---|
| **Komatsu PC38MR-5** | provozní hmotnost ~3,8 t · šířka 1,74 m (průjezd ~1,8 m) · hloubka výkopu až ~3,45 m (dlouhé rameno) · krátká záď (pracuje u zdi/plotu) · gumové pásy · lžíce `[šířky – doplnit]` |
| **MAN TGL 12.220 + plošina MULTITEC** | celková hmotnost 12 t · 220 k · přepraví bagr na plošině · nosnost plošiny `[t – doplnit]` · **bagr a kontejner veze zvlášť (neověřeno)** |
| **Kontejnery 4,5 m** | 2 ks: **plošinový (plato)** a **suťový** · objem ~**5 m³** (ověřit) · max. náklad `[t – doplnit]` |

### 8.4 FAQ (návrh – převzato ze starého briefu, upraveno)
1. **Je v ceně i obsluha bagru?** Ano – stroj, zkušený strojník i palivo.
2. **Na jaké práce se minibagr hodí?** Základy, přípojky (voda, kanalizace, elektro), bazény, jímky a ČOV, plotové základy, drenáže, srovnání a modelace terénu, příprava pozemku.
3. **Kam se bagr vejde?** Šířka 1,74 m (průjezd ~1,8 m), krátká záď. Nejste-li si jistí, pošlete fotku místa.
4. **Poškodí bagr trávník nebo dlažbu?** Gumové pásy jsou šetrné; na citlivé povrchy lze položit ochranné desky.
5. **Kolik to stojí a jak se počítá doprava?** Orientačně 950 Kč/h bez DPH (min. 4 h), doprava 35 Kč/km. Přesnou cenu řekneme předem.
6. **Co s vykopanou zeminou a sutí?** Přistavíme kontejner 4,5 m (~5 m³) a odvezeme na nejbližší recyklační skládku; cena podle množství.
7. **Potřebuji povolení na kontejner?** Na vlastním pozemku ne; na chodníku/silnici je potřeba zábor od obce – poradíme.
8. **Co potřebujete k nacenění?** Co a kde, rozsah (délka, hloubka), přístup na pozemek, ideálně fotky.
9. **Co když prší?** Při běžném dešti pracujeme; při lijáku se domluvíme na posunu bez poplatku.
10. **Jak se platí?** Převodem na fakturu po dokončení, příp. `[hotově/kartou – doplnit]`.

### 8.5 Texty – návrh
- H1: **Pronájem minibagru s obsluhou** · podtitulek: **Zemní a výkopové práce, terénní úpravy, doprava i odvoz suti – Domažlicko a okolí.** · CTA **Poptat bagr**.
- Claim pro „Proč my“ (může být v Kontaktu): *Jedna firma, jeden telefon, hotová práce.* Body: Strojník v ceně · Vlastní doprava MAN · Kontejner na suť hned na místě · Férová cena předem. Čísla `[X let praxe]`, `[X zakázek]` = placeholder.

## 9. K ověření se Zbyňkem před spuštěním (checklist)

- [ ] Název služby a **doména** (minibagr-gts.cz – volná? registrovat?)
- [ ] Pod jakou firmou/IČO/DIČ služba poběží; plátce DPH → ceny bez/s DPH
- [ ] Skutečný **telefon**, **e-mail pro poptávky**, adresa provozovny, provozní doba
- [ ] **Ceník**: 950 Kč/h, min. 4 h, doprava 35 Kč/km (tam i zpět? naložení?), kontejner od 1 900 Kč, nájem kontejneru za den?, sleva nad X h?
- [ ] **Suť**: která recyklační skládka, ceny za t/m³ podle druhu (čistá suť, zemina, směs)
- [ ] **Kontejnery**: přesný objem (~5 m³?), max. hmotnost nákladu, které druhy odpadu nebrat
- [ ] **MAN**: veze bagr a kontejner **zvlášť** (ne současně)? Nosnost plošiny
- [ ] **Bagr**: přesný model (PC38MR-5?), rameno (hloubka výkopu 3,45 m?), dostupné lžíce/nářadí (rypadlová, svahová, kladivo, vrták?)
- [ ] **Oblast**: 50 km od Poběžovic OK? Jezdí se i do Bavorska?
- [ ] Platba (faktura / hotově / karta), storno podmínky, zálohy
- [ ] Souhlas s použitím fotek z webu G.T.S. a WhatsApp fotky; dodat fotky z akcí do Reference
- [ ] Logo/barvy: červená G.T.S. jako hlavní CTA – OK? (firma má manuál jednotného vizuálu – vyžádat)
- [ ] GDPR: správce osobních údajů, text zásad, e-mail pro doručení poptávek (Resend / SMTP)
- [ ] Analytika (Vercel Analytics / Plausible) + cookie lišta, pokud bude potřeba

## 10. Akceptační kritéria (hotovo, když)

1. Všechny sekce z kap. 4 jsou na desktopu (1440, 1920) i mobilu (375, 414) funkční a bez horizontálního scrollu; testováno iOS Safari a Android Chrome.
2. **Lighthouse (mobil, preview URL): Performance ≥ 85 (tvrdé minimum 80), Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95; LCP < 2,5 s, CLS < 0,1.** Report přiložen (screenshot nebo JSON).
3. Hero: video se přehrává ve smyčce (muted, playsinline), poster je LCP a odpovídá kompozici mockupu (bagr dole, text + červené CTA nad ním).
4. Scroll scéna: dig → underground plynule bez škubání a bez viditelného švu, počty snímků z `manifest.json`, na mobilu mobile sady, na low-end statický fallback.
5. **`prefers-reduced-motion: reduce`**: žádný pin/scrub/Lenis/autoplay/parallax; všechen obsah čitelný (ověřeno v DevTools emulaci).
6. Nákladák projede zleva doprava navázaný na scroll, čelem doprava, bez seknutí; reduced motion = statický.
7. Všechny ukázkové hodnoty jsou jen v `content/site.ts`, v dev/preview zvýrazněné; README vypisuje, co nahradit.
8. Formulář: validace, honeypot, stub server action s TODO, fallback `mailto:`; nic se reálně neodesílá bez env.
9. JSON-LD `LocalBusiness` + `FAQPage` validní (Rich Results Test), sitemap + robots, preview `noindex`.
10. Chybějící podklad nerozbije build ani stránku (placeholder).
11. `pnpm build` bez chyb a TS/ESLint warningů; **preview deploy na Vercelu** funkční, URL předána.
