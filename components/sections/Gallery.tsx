"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { AssetOrPlaceholder } from "@/components/ui/AssetOrPlaceholder";
import { TextureBackground } from "@/components/motion/TextureBackground";
import { showPlaceholders } from "@/lib/placeholders";

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

        <div className="mt-10 hidden columns-2 gap-4 md:block lg:columns-3">
          {site.gallery.map((item, i) => (
            <button
              key={item.src}
              type="button"
              className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-komatsu-yellow"
              onClick={() => setActive(i)}
            >
              <AssetOrPlaceholder
                src={item.src}
                alt={item.alt}
                className="w-full object-cover transition duration-300 hover:scale-[1.02]"
              />
              {item.example && showEx ? (
                <span className="mt-1 block text-left text-xs text-komatsu-yellow">
                  UKÁZKOVÁ DATA / placeholder
                </span>
              ) : null}
            </button>
          ))}
        </div>

        <div className="mt-8 flex gap-4 overflow-x-auto pb-2 md:hidden">
          {site.gallery.map((item, i) => (
            <button
              key={item.src}
              type="button"
              className="w-72 shrink-0 overflow-hidden rounded-lg"
              onClick={() => setActive(i)}
            >
              <AssetOrPlaceholder
                src={item.src}
                alt={item.alt}
                className="h-48 w-full object-cover"
              />
            </button>
          ))}
        </div>
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
          />
        </div>
      ) : null}
    </TextureBackground>
  );
}
