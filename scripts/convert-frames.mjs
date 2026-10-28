#!/usr/bin/env node
/**
 * Převod vyexportovaných snímků (JPG/PNG z ezgif apod.) na sekvenci WebP pro scroll animaci.
 *
 * Použití:
 *   node scripts/convert-frames.mjs --in <složka s JPG> --out public/seq/dig [--width 1920] [--height 1080] [--quality 70] [--mobile 960]
 *
 * - Snímky seřadí podle čísla v názvu (ezgif-frame-001.jpg, frame_12.png, ...).
 * - Každý ořízne/zvětší na přesně width×height (fit: cover, střed) => sjednocené rozměry.
 * - Uloží jako 0001.webp, 0002.webp, ... (4 číslice, od 1).
 * - Zapíše manifest.json { count, width, height, pattern, quality } – komponenta si z něj bere počet snímků.
 * - S --mobile N vytvoří vedle i <out>-mobile/ se šířkou N (výška dopočtena podle poměru).
 * - Před zápisem vyčistí cílovou složku od starých *.webp.
 * Závislost: sharp (npm i -D sharp)
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

function args() {
  const a = process.argv.slice(2);
  const o = { width: 1920, height: 1080, quality: 70, mobile: 0 };
  for (let i = 0; i < a.length; i += 2) {
    const k = a[i].replace(/^--/, "");
    o[k] = a[i + 1];
  }
  if (!o.in || !o.out) {
    console.error("Chybí --in a/nebo --out. Viz hlavička skriptu.");
    process.exit(1);
  }
  o.width = Number(o.width); o.height = Number(o.height);
  o.quality = Number(o.quality); o.mobile = Number(o.mobile);
  return o;
}

const num = (f) => { const m = f.match(/(\d+)(?!.*\d)/); return m ? Number(m[1]) : 0; };

async function convert(files, inDir, outDir, w, h, q) {
  await fs.mkdir(outDir, { recursive: true });
  for (const f of await fs.readdir(outDir)) if (f.endsWith(".webp")) await fs.unlink(path.join(outDir, f));
  let bytes = 0;
  for (let i = 0; i < files.length; i++) {
    const name = String(i + 1).padStart(4, "0") + ".webp";
    const info = await sharp(path.join(inDir, files[i]))
      .resize(w, h, { fit: "cover", position: "centre" })
      .webp({ quality: q, effort: 5 })
      .toFile(path.join(outDir, name));
    bytes += info.size;
  }
  const manifest = { count: files.length, width: w, height: h, pattern: "{0000}.webp", firstIndex: 1, quality: q };
  await fs.writeFile(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log(`${outDir}: ${files.length} snímků ${w}×${h}, ${(bytes / 1024 / 1024).toFixed(2)} MB`);
}

const o = args();
const files = (await fs.readdir(o.in))
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && !f.startsWith("."))
  .sort((a, b) => num(a) - num(b) || a.localeCompare(b));
if (!files.length) { console.error("Ve vstupní složce nejsou žádné snímky."); process.exit(1); }

await convert(files, o.in, o.out, o.width, o.height, o.quality);
if (o.mobile > 0) {
  const mh = Math.round((o.height / o.width) * o.mobile);
  await convert(files, o.in, o.out.replace(/\/$/, "") + "-mobile", o.mobile, mh, o.quality);
}
