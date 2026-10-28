/**
 * Statická mapa oblasti — bez OSM tile CDN (Tile Usage Policy).
 * Popisky jen u hlavních měst; ostatní obce jsou tečky (title = tooltip).
 * Atribuce © OpenStreetMap contributors.
 */
export function AreaMap() {
  return (
    <figure className="area-map-shell relative z-0 isolate m-0 overflow-hidden border border-line bg-void">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/map/oblast.svg"
        alt="Mapa oblasti do 50 km od Poběžovic. Hlavní města: Poběžovice, Domažlice, Horšovský Týn, Tachov, Klatovy."
        width={800}
        height={800}
        className="aspect-square h-auto w-full object-contain object-center md:h-[480px] md:object-cover"
        loading="lazy"
        decoding="async"
      />
      <figcaption className="border-t border-line px-3 py-2 text-center font-mono text-[11px] tracking-wide text-white/45">
        <span className="sm:hidden">okruh 50 km</span>
        <span className="hidden sm:inline">okruh 50 km · 10 / 25 / 50</span>
        <span className="mt-1 block text-[10px] text-white/30">
          © OpenStreetMap contributors · stylizovaná mapa
        </span>
      </figcaption>
    </figure>
  );
}
