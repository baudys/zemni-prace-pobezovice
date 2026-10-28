"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { AssetOrPlaceholder } from "@/components/ui/AssetOrPlaceholder";
import { TextureBackground } from "@/components/motion/TextureBackground";
import { isPlaceholderPhotoPath, showPlaceholders } from "@/lib/placeholders";

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const showEx = showPlaceholders();

  return (
    <TextureBackground
      id="reference"
      desktop="/textures/sand.webp"
      mobile="/textures/sand-mobile.webp"
      className="py-20 md:py-28"
      parallax={false}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="font-display text-4xl uppercase md:text-6xl">Reference / fotky</h2>
        <p className="mt-3 max-w-2xl text-white/80">
          Zatím ukázkové podklady – doplníme fotky z akcí.
        </p>

        <ul className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:snap-none md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-3">
          {site.gallery.map((item, i) => (
            <li
              key={item.src}
              className="w-72 shrink-0 snap-center md:w-auto md:shrink"
            >
              <button
                type="button"
                className="relative block w-full overflow-hidden rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-komatsu-yellow"
                onClick={() => setActive(i)}
              >
                <AssetOrPlaceholder
                  src={item.src}
                  alt={item.alt}
                  className="h-48 w-full object-cover transition duration-300 hover:scale-[1.02] md:h-auto md:min-h-[12rem]"
                  loading="lazy"
                />
                {showEx && (item.example || isPlaceholderPhotoPath(item.src)) ? (
                  <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-komatsu-yellow">
                    ilustrační
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {active !== null && site.gallery[active] ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Náhled fotky"
          onClick={() => setActive(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setActive(null);
          }}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded bg-white/10 px-3 py-2 text-sm"
            onClick={() => setActive(null)}
          >
            Zavřít
          </button>
          <AssetOrPlaceholder
            src={site.gallery[active].src}
            alt={site.gallery[active].alt}
            className="max-h-[85vh] max-w-5xl object-contain"
            loading="lazy"
          />
        </div>
      ) : null}
    </TextureBackground>
  );
}
