"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";

const AreaLeaflet = dynamic(
  () => import("./AreaLeaflet").then((mod) => mod.AreaLeaflet),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full place-items-center bg-void text-sm text-white/45">
        Načítám mapu…
      </div>
    ),
  },
);

type BoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type BoundaryState = {
  hasError: boolean;
};

class MapErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const mapFallback = (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/map/oblast.svg"
    alt="Schéma oblasti do 50 km od Poběžovic"
    className="h-full w-full object-contain bg-void p-2"
  />
);

/**
 * Interaktivní mapa dosahu. Tmavý XYZ podklad (Esri World Dark Gray).
 * Atribuce je v rohu mapy; při totálním výpadku tiles → SVG fallback.
 */
export function AreaMap() {
  return (
    <figure className="relative z-0 isolate m-0 flex h-[420px] flex-col overflow-hidden border border-line bg-void md:h-[520px]">
      <div className="relative min-h-0 flex-1">
        <MapErrorBoundary fallback={mapFallback}>
          <AreaLeaflet />
        </MapErrorBoundary>
      </div>
      <figcaption className="border-t border-line px-3 py-2 text-center font-mono text-[11px] tracking-wide text-white/45">
        okruh 10 / 25 / 50 km od Poběžovic
      </figcaption>
    </figure>
  );
}
