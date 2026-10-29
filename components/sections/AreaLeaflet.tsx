"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { site } from "@/content/site";
import {
  AREA_ORIGIN,
  AREA_RINGS_KM,
  areaCoordinates,
} from "@/content/area-places";
import "leaflet/dist/leaflet.css";
import "./area-map.css";

const TILE_URL =
  "https://basemap.queeniemella.cc/tiles/countries/{z}/{x}/{y}.png";

const TILE_ATTRIBUTION =
  '© <a href="https://queeniemella.cc">queeniemella</a> | © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const LABEL_DIRECTION: Record<string, "left" | "right" | "top" | "bottom"> = {
  Poběžovice: "top",
  Tachov: "bottom",
  "Horšovský Týn": "right",
  Domažlice: "bottom",
  Klatovy: "right",
  Stříbro: "left",
};

const TRANSPARENT_TILE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

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

export function AreaLeaflet() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    let map: LeafletMap | null = null;
    let observer: ResizeObserver | null = null;
    let disposed = false;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const showLabels = window.matchMedia("(min-width: 768px)").matches;
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

        L.tileLayer(TILE_URL, {
          maxZoom: 20,
          attribution: TILE_ATTRIBUTION,
          errorTileUrl: TRANSPARENT_TILE,
        }).addTo(map);

        const rings = [...AREA_RINGS_KM].sort((a, b) => b - a);
        let outer: L.Circle | null = null;
        for (const km of rings) {
          const circle = L.circle([origin.lat, origin.lng], {
            radius: km * 1000,
            color: "#f5b800",
            weight: km === 50 ? 2 : 1,
            opacity: km === 50 ? 0.95 : 0.5,
            fillColor: "#f5b800",
            fillOpacity: km === 50 ? 0.05 : 0.03,
            interactive: false,
          }).addTo(map);
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

          marker.bindTooltip(name, {
            permanent: showLabels && isBold,
            direction: LABEL_DIRECTION[name] ?? "right",
            className: isOrigin ? "area-tip area-tip-origin" : "area-tip",
            opacity: 1,
            offset: [0, isOrigin ? -4 : 0],
          });
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
      observer?.disconnect();
      map?.remove();
      map = null;
    };
  }, []);

  if (failed) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-void px-6 text-center text-sm text-white/60">
        Mapu se nepodařilo zobrazit.
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      className="area-leaflet absolute inset-0"
      role="region"
      aria-label="Mapa oblasti do 50 km od Poběžovic. Žluté kružnice značí 10, 25 a 50 km."
    />
  );
}
