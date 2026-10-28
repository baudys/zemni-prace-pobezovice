#!/usr/bin/env node
/**
 * Jednorázový převod statických podkladů (Dreamina, WhatsApp, PNG nákladáku) do public/.
 * Použití: node scripts/convert-stills.mjs <složka se zdroji>
 * Mapování názvů je v poli JOBS – při nových verzích obrázků upravit "match".
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = process.argv[2];
if (!SRC) { console.error("Použití: node scripts/convert-stills.mjs <složka>"); process.exit(1); }
const OUT = "public";

const JOBS = [
  // hero
  { match: /5171-.*hero/i, out: "hero/hero-poster.webp", w: 1920, h: 1080, q: 75 },
  { match: /5171-.*hero/i, out: "hero/hero-poster-mobile.webp", w: 960, h: 540, q: 72 },
  { match: /1827-Edit/i, out: "hero/bucket-in-soil.webp", w: 1920, h: 1080, q: 75 },
  // textury (2560 šířka)
  { match: /8972-.*cross-section/i, out: "textures/soil-cross-section.webp", w: 2560, q: 68 },
  { match: /8972-.*cross-section/i, out: "textures/soil-cross-section-mobile.webp", w: 1280, q: 62 },
  { match: /9412-/i, out: "textures/rubble-bricks.webp", w: 2560, q: 68 },
  { match: /9412-/i, out: "textures/rubble-bricks-mobile.webp", w: 1280, q: 62 },
  { match: /9585-/i, out: "textures/gravel.webp", w: 2560, q: 68 },
  { match: /9585-/i, out: "textures/gravel-mobile.webp", w: 1280, q: 62 },
  { match: /9723-/i, out: "textures/sand.webp", w: 2560, q: 68 },
  { match: /9723-/i, out: "textures/sand-mobile.webp", w: 1280, q: 62 },
  // reálná fotka MAN (sekce Technika)
  { match: /^WhatsApp Image/i, out: "photos/man-tgl-real.webp", w: 1600, q: 78 },
];

const files = (await fs.readdir(SRC)).filter((f) => !f.startsWith("."));
for (const j of JOBS) {
  const f = files.find((x) => j.match.test(x));
  if (!f) { console.warn("NENALEZENO:", j.match, "->", j.out); continue; }
  const dst = path.join(OUT, j.out);
  await fs.mkdir(path.dirname(dst), { recursive: true });
  const r = sharp(path.join(SRC, f)).resize(j.w, j.h ?? null, { fit: "cover", position: "centre", withoutEnlargement: !j.h });
  const info = await r.webp({ quality: j.q, effort: 5 }).toFile(dst);
  console.log(`${dst} ${info.width}×${info.height} ${(info.size / 1024).toFixed(0)} KB  <- ${f}`);
}

// nákladák: PNG s alfou, oříznout průhledné okraje, PNG + WebP s alfou
const truck = files.find((x) => /white truck/i.test(x) && x.endsWith(".png"));
if (truck) {
  await fs.mkdir(path.join(OUT, "truck"), { recursive: true });
  const trimmed = await sharp(path.join(SRC, truck)).trim({ threshold: 1 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  const w = Math.min(meta.width, 2000);
  const a = await sharp(trimmed).resize(w).png({ compressionLevel: 9, palette: false }).toFile(path.join(OUT, "truck/truck.png"));
  const b = await sharp(trimmed).resize(w).webp({ quality: 80, alphaQuality: 90, effort: 6 }).toFile(path.join(OUT, "truck/truck.webp"));
  console.log(`truck: ${a.width}×${a.height} png ${(a.size / 1024).toFixed(0)} KB, webp ${(b.size / 1024).toFixed(0)} KB`);
} else console.warn("NENALEZENO: PNG nákladáku");
