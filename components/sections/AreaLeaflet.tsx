"use client";

import { useEffect, useRef, useState } from "react";
import type { Circle, Map as LeafletMap, TileLayer } from "leaflet";
import gsap from "gsap";
import { formatCzk, site } from "@/content/site";
import {
  AREA_ORIGIN,
  AREA_RINGS_KM,
  areaCoordinates,
  type AreaPoint,
} from "@/content/area-places";
import { quoteRates } from "@/components/quote/QuoteContext";
import "leaflet/dist/leaflet.css";
import "./area-map.css";

function haversineKm(a: AreaPoint, b: AreaPoint): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function townTooltipHtml(
  name: string,
  origin: AreaPoint,
  point: AreaPoint,
): string {
  if (name === AREA_ORIGIN) {
    return `<span class="area-tip-rich">${name} · základna</span>`;
  }
  const km = Math.max(1, Math.round(haversineKm(origin, point)));
  const transport = km * 2 * quoteRates.kmRate;
  return `<span class="area-tip-rich">${name} · ${km}&nbsp;km · doprava cca ${formatCzk(transport)}</span>`;
}

const TILE_URL =
  "https://basemap.queeniemella.cc/tiles/countries/{z}/{x}/{y}.png";

const TILE_ATTRIBUTION =
  '© <a href="https://queeniemella.cc">queeniemella</a> | © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const LABEL_DIRECTION: Record<string, "left" | "right" | "top" | "bottom"> = {
  Poběžovice: "top",
  Tachov: "bottom",
  "Horšovský Týn": "right",
  /** bottom překrývalo tečku — vlevo s offsetem. */
  Domažlice: "left",
  Klatovy: "right",
  Stříbro: "left",
};

const LABEL_OFFSET: Record<string, [number, number]> = {
  Domažlice: [-10, 0],
  Poběžovice: [0, -6],
};

const TRANSPARENT_TILE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const TILE_ERROR_LIMIT = 6;

type LeafletNamespace = typeof import("leaflet");

function resolveLeaflet(mod: LeafletNamespace): LeafletNamespace {
  const withDefault = mod as LeafletNamespace & { default?: LeafletNamespace };
  const fromWindow =
    typeof window !== "undefined"
      ? (window as Window & { L?: LeafletNamespace }).L
      : undefined;
  const candidates = [withDefault.default, mod, fromWindow];
  for (const candidate of candidates) {
    if (candidate && typeof candidate.map === "function") return candidate;
  }
  throw new Error(`Leaflet export: ${Object.keys(mod).slice(0, 12).join(",")}`);
}

function MapSvgFallback() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/map/oblast.svg"
      alt="Schéma oblasti do 50 km od Poběžovic"
      className="absolute inset-0 h-full w-full object-contain bg-void p-2"
    />
  );
}

export function AreaLeaflet() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [failed, setFailed] = useState(false);

  // Lazy init — až když se sekce blíží viewportu.
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(id);
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active || failed) return;
    const el = hostRef.current;
    if (!el) return;

    let map: LeafletMap | null = null;
    let tiles: TileLayer | null = null;
    let observer: ResizeObserver | null = null;
    let disposed = false;
    let tileErrors = 0;
    const ringProxies: Array<{ r: number }> = [];

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const bold = new Set<string>(site.towns.bold);

    void import("leaflet")
      .then((mod) => {
        if (disposed) return;
        const L = resolveLeaflet(mod);
        const origin = areaCoordinates[AREA_ORIGIN];
        if (!origin) throw new Error("Chybí souřadnice Poběžovic.");

        map = L.map(el, {
          center: [origin.lat, origin.lng],
          zoom: 9,
          scrollWheelZoom: false,
          dragging: !coarse,
          zoomControl: false,
          attributionControl: true,
          zoomSnap: 0.25,
          zoomDelta: 0.5,
          fadeAnimation: !reduced,
          zoomAnimation: !reduced,
          markerZoomAnimation: !reduced,
          minZoom: 8,
          maxZoom: 15,
        });

        map.attributionControl.setPosition("bottomleft");
        map.attributionControl.setPrefix(false);

        L.control
          .zoom({
            position: "topright",
            zoomInTitle: "Přiblížit",
            zoomOutTitle: "Oddálit",
          })
          .addTo(map);

        tiles = L.tileLayer(TILE_URL, {
          maxZoom: 20,
          attribution: TILE_ATTRIBUTION,
          errorTileUrl: TRANSPARENT_TILE,
        }).addTo(map);

        tiles.on("tileerror", () => {
          tileErrors += 1;
          if (tileErrors >= TILE_ERROR_LIMIT && !disposed) {
            setFailed(true);
          }
        });

        // Animate rings smallest→largest (10, 25, 50).
        const ringKmAsc = [...AREA_RINGS_KM].sort((a, b) => a - b);
        const ringCircles: Array<{ circle: Circle; target: number }> = [];
        let outer: Circle | null = null;

        for (const km of ringKmAsc) {
          const target = km * 1000;
          const circle = L.circle([origin.lat, origin.lng], {
            // Full radius first so fitBounds works; reset before tween.
            radius: target,
            color: "#f5b800",
            weight: km === 50 ? 2 : 1,
            opacity: km === 50 ? 0.95 : 0.5,
            fillColor: "#f5b800",
            fillOpacity: km === 50 ? 0.05 : 0.03,
            interactive: false,
          }).addTo(map);
          ringCircles.push({ circle, target });
          if (km === 50) outer = circle;
        }

        const ranked = [...site.towns.all].sort((a, b) => {
          const rank = (name: string) =>
            name === AREA_ORIGIN ? 2 : bold.has(name) ? 1 : 0;
          return rank(a) - rank(b);
        });

        for (const name of ranked) {
          const point = areaCoordinates[name];
          if (!point) continue;
          const isOrigin = name === AREA_ORIGIN;
          const isBold = bold.has(name);

          const marker = L.circleMarker([point.lat, point.lng], {
            radius: isOrigin ? 7 : isBold ? 5 : 4,
            color: isOrigin ? "#ffffff" : "#f5b800",
            weight: isOrigin ? 2 : 1,
            fillColor: isOrigin ? "#e1011b" : "#f5b800",
            fillOpacity: 1,
          }).addTo(map);

          // Origin: permanent short label. Others: hover (desktop) / tap (mobile).
          const html = townTooltipHtml(name, origin, point);
          marker.bindTooltip(html, {
            permanent: isOrigin && desktop,
            direction: LABEL_DIRECTION[name] ?? "top",
            className: isOrigin
              ? "area-tip area-tip-origin"
              : "area-tip area-tip-hover",
            opacity: 1,
            offset: LABEL_OFFSET[name] ?? [0, -8],
            sticky: false,
          });

          if (!isOrigin || !desktop) {
            marker.on(coarse ? "click" : "mouseover", () => {
              marker.openTooltip();
            });
            if (!coarse) {
              marker.on("mouseout", () => marker.closeTooltip());
            }
          }
        }

        const frame = map;
        const ring = outer;
        let fitted = false;
        const fitRing = () => {
          if (!ring || !frame.getContainer().isConnected) return;
          frame.invalidateSize();
          if (frame.getSize().x < 40) return;
          const bounds = ring.getBounds();
          frame.fitBounds(bounds, {
            paddingTopLeft: [28, 28],
            paddingBottomRight: [28, 36],
            animate: false,
          });
          frame.setMaxBounds(bounds.pad(0.55));
          frame.setMinZoom(Math.max(frame.getZoom() - 1, 8));
          fitted = true;
        };

        fitRing();

        if (!reduced && !disposed) {
          ringCircles.forEach(({ circle, target }, i) => {
            circle.setRadius(0);
            const proxy = { r: 0 };
            ringProxies.push(proxy);
            gsap.to(proxy, {
              r: target,
              duration: 0.85,
              delay: i * 0.15,
              ease: "power2.out",
              onUpdate: () => {
                if (!disposed) circle.setRadius(proxy.r);
              },
            });
          });
        }

        observer = new ResizeObserver(() => {
          const container = frame.getContainer();
          if (!container?.isConnected) return;
          try {
            frame.invalidateSize();
            if (!fitted) fitRing();
          } catch {
            // Mapa už je odpojená (strict mode / odchod ze stránky).
          }
        });
        observer.observe(el);
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });

    return () => {
      disposed = true;
      for (const p of ringProxies) gsap.killTweensOf(p);
      observer?.disconnect();
      tiles?.off("tileerror");
      map?.remove();
      map = null;
    };
  }, [active, failed]);

  if (failed) {
    return <MapSvgFallback />;
  }

  return (
    <div
      ref={hostRef}
      className="area-leaflet absolute inset-0"
      role="region"
      aria-label="Mapa oblasti do 50 km od Poběžovic. Žluté kružnice značí 10, 25 a 50 km."
    >
      {!active ? (
        <div className="grid h-full place-items-center bg-void text-sm text-white/45">
          Načítám mapu…
        </div>
      ) : null}
    </div>
  );
}
