# Prompt pro Cursor agenta (zkopírovat celý blok níže)

> Postup: rozbal `gts-cursor-handoff.zip` do prázdné složky projektu (nebo zkopíruj obsah `cursor-handoff/` do kořene nového repa) a v Cursoru vlož tento prompt.

---

Postav landing page „GTS Minibagr“ (pronájem minibagru Komatsu PC38MR s obsluhou a dopravou, G.T.S. Poběžovice) podle **`BRIEF.md`** v kořeni – je to závazné zadání (sekce, animace, technika, ukázková data, akceptační kritéria). Přečti ho celý, než začneš. Texty webu česky.

**Postup:**
1. Založ projekt **Next.js (App Router, TypeScript) + Tailwind CSS + ESLint** v tomto adresáři (nepřepisuj `BRIEF.md`, `public/`, `scripts/`, `assets-start/`). Přidej `gsap` (ScrollTrigger), `lenis`, `zod`, `sharp` (dev). Struktura podle BRIEF kap. 6.2.
2. Složka **`public/` je už připravená** (hero video + poster, sekvence `seq/dig`, `seq/underground` + `-mobile` s `manifest.json`, textury, `truck/truck.webp`, logo, fotky) – nic nepřejmenovávej, čti počty snímků z `manifest.json`. Pokud nějaký soubor chybí, použij placeholder (zemitý gradient + popisek „PODKLAD CHYBÍ: cesta“), build nesmí spadnout.
3. Skripty `scripts/convert-frames.mjs` (JPG snímky → `0001.webp…` 1920×1080 cover-crop, q70, volitelně `--mobile 960`, zapisuje `manifest.json`) a `scripts/convert-stills.mjs` už existují – zachovej je, přidej do `package.json` skripty `frames:dig`, `frames:underground` (vstup z `raw/2`, `raw/3`) a `stills` (vstup `raw/`), složku `raw/` dej do `.gitignore`. Pokud skripty chybí, vytvoř je dle BRIEF kap. 7.
4. Všechna ukázková data (název, doména, IČO placeholder, telefon, e-mail, ceník, specifikace, FAQ, oblast) dej **jen do `content/site.ts`** s příznakem `example: true` a vizuálním zvýrazněním v dev/preview (BRIEF 6.3). IČO nevymýšlej.
5. Implementuj sekce a animace přesně podle BRIEF kap. 4–5: hero s video smyčkou a kompozicí dle `assets-start/mockup-hero-stred.png`; jedna připnutá canvas scéna dig → underground (přeskoč duplicitní první snímek underground), progresivní načítání; textury jako pozadí sekcí; nákladák jedoucí zleva doprava podle scrollu; mapa 50 km; FAQ s JSON-LD; formulář se **stub server action (TODO Resend) + fallback `mailto:`** – nic reálně neodesílej.
6. Dodrž `prefers-reduced-motion`, low-end/mobilní fallbacky (statické obrázky místo sekvence) a výkon (BRIEF 6.4–6.6). Nastav cache hlavičky pro `/seq`, `/textures`, `/hero`, `/truck`.
7. Napiš `README.md`: spuštění, výměna podkladů (skripty), seznam ukázkových dat k nahrazení (odkaz na BRIEF kap. 9).
8. Ověř: `pnpm build` (nebo npm) bez chyb, projdi stránku v prohlížeči na 1440 px a 375 px, s emulací `prefers-reduced-motion: reduce`, spusť Lighthouse (mobil) a porovnej s BRIEF kap. 10. Opravuj, dokud cíle neplní.
9. Commitni po logických krocích a na závěr udělej **preview deploy na Vercel** (`vercel deploy`, ne `--prod`), preview nastav `noindex`. Pošli mi preview URL, Lighthouse skóre, seznam toho, co nesplňuje akceptační kritéria, a co zůstává jako TODO / ukázková data.

Neptej se na drobnosti – rozhodni rozumně podle briefu a rozhodnutí zapiš do README (sekce „Rozhodnutí“). Pokud něco v briefu chybí zásadně (např. přístup k Vercelu), zastav se a napiš mi.
