# Podklady – checklist pro Daniela

**Stav k 28. 10. 2026: vše převedeno a uloženo v `public/`. Nic dalšího dělat nemusíš** – níže je, co odkud je, a jak postupovat, až budou nové verze.

## Co je kde (hotovo ✅)

| Tvůj soubor | Kam šel | Stav |
|---|---|---|
| `1.mp4` (hero smyčka, lžíce se jemně hýbe) | `public/hero/hero-loop.mp4` (435 KB), `hero-loop.webm` (252 KB), `hero-loop-mobile.mp4` (101 KB) – bez zvuku, 30 fps | ✅ **snímky ze složky `1/` nejsou potřeba** (video se jen přehrává ve smyčce) |
| `2.mp4` + složka `2/` (121 snímků, bagr zabírá do hlíny) | `public/seq/dig/0001–0121.webp` (7,0 MB) + `seq/dig-mobile/` (2,7 MB) | ✅ |
| `3.mp4` + složka `3/` (121 snímků, kamera pod zem) | `public/seq/underground/0001–0121.webp` (7,9 MB) + `seq/underground-mobile/` (3,2 MB) | ✅ navazuje na poslední snímek `2/` |
| `dreamina-…-5171-…hero photograph` | `public/hero/hero-poster.webp` (+ `-mobile`) | ✅ |
| `dreamina-…-4045-…hero photograph` | – | ⚠ **je to stejný soubor jako 5171** (identický obsah) – pokud jsi chtěl alternativu (lžíce výš), pošli ji znovu |
| `dreamina-…-1827-Edit this image…` (lžíce v hlíně) | `public/hero/bucket-in-soil.webp` | ✅ (fallback scroll scény) |
| `dreamina-…-8972-…cross-section` | `public/textures/soil-cross-section.webp` (+ `-mobile`) | ✅ |
| `dreamina-…-9585-…texture` | `public/textures/gravel.webp` (+ `-mobile`) | ✅ |
| `dreamina-…-9412-…texture` | `public/textures/rubble-bricks.webp` (+ `-mobile`) | ✅ |
| `dreamina-…-9723-…texture` | `public/textures/sand.webp` (+ `-mobile`) | ✅ |
| `##Edit this image. Keep the white truck….png` | `public/truck/truck.webp` (218 KB, průhledné, oříznuté) + `truck.png` | ✅ čelem doprava |
| `WhatsApp Image 2026-10-28 at 10.59.11.jpeg` (reálný MAN) | `public/photos/man-tgl-real.webp` | ✅ sekce Technika |
| logo z `gts-bagr-podklady/` | `public/brand/gts-logo.svg`, `gts-logo-transparent.svg` | ✅ |

## Co ještě chybí / volitelně

- [ ] **Textura „hlína shora“ (top-down soil)** – nedodána. Uložit jako `public/textures/soil-top.webp` (2560×1440). Do té doby se použije řez půdou.
- [ ] **Alternativní hero** (pokud jsi ho chtěl) – viz ⚠ výše.
- [ ] Vlastní fotky bagru a kontejnerů od Zbyňka do sekce Reference/Technika (teď placeholdery výrobců v `public/photos/placeholder/` – na produkci NEPOUŽÍT).

## Až budou nové verze videí (postup)

1. **Snímky z videa (jen pro scroll scény, ne pro hero):** https://ezgif.com/video-to-jpg → nahraj MP4 → *Frame rate:* **24 FPS** (nebo „original“) → *Size:* **original** → *Convert* → **Download frames as ZIP**.
2. ZIP rozbal do projektu do `raw/2/` (dig) nebo `raw/3/` (underground). Názvy `ezgif-frame-001.jpg…` nevadí.
3. Spusť:
   ```
   node scripts/convert-frames.mjs --in raw/2 --out public/seq/dig --mobile 960
   node scripts/convert-frames.mjs --in raw/3 --out public/seq/underground --mobile 960
   ```
   Skript sjednotí rozměry na 1920×1080, uloží `0001.webp…`, mobilní sadu 960 px a `manifest.json` (počet snímků si web načte sám).
4. **Hero smyčka snímky nepotřebuje** – jen MP4. Převod:
   ```
   ffmpeg -i 1.mp4 -an -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30" -c:v libx264 -pix_fmt yuv420p -crf 26 -preset slow -movflags +faststart public/hero/hero-loop.mp4
   ffmpeg -i 1.mp4 -an -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30" -c:v libvpx-vp9 -crf 38 -b:v 0 public/hero/hero-loop.webm
   ffmpeg -i 1.mp4 -an -vf "scale=960:540:force_original_aspect_ratio=increase,crop=960:540,fps=30" -c:v libx264 -pix_fmt yuv420p -crf 27 -preset slow -movflags +faststart public/hero/hero-loop-mobile.mp4
   ```
5. Statické obrázky (Dreamina/WhatsApp/PNG nákladáku): dej je do `raw/` a spusť `node scripts/convert-stills.mjs raw` (mapuje podle čísla v názvu Dreamina souboru – při nových číslech uprav pole `JOBS` ve skriptu).

**Pravidla pro nové podklady:** 16:9, min. 1920×1080; poslední snímek dig = první snímek underground; hero smyčka začíná a končí stejným snímkem; nákladák PNG s průhledností, čelem doprava; nepoužívat fotky výrobců na produkci.
