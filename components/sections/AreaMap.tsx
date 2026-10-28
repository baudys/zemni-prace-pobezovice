"use client";

import { useEffect, useRef } from "react";
import type { Circle, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { site } from "@/content/site";
import { mapRingsKm, mapTownLabel, mapTowns } from "@/content/map-towns";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

const YELLOW = "#f5b800";

export function AreaMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    let cancelled = false;
    let map: LeafletMap | null = null;
    let rings: Circle[] = [];
    let observer: IntersectionObserver | null = null;

    void import("leaflet").then((leaflet) => {
      if (cancelled || !containerRef.current) return;
      const L = leaflet.default;

      map = L.map(containerRef.current, {
        center: [site.geo.lat, site.geo.lng],
        zoom: 9,
        scrollWheelZoom: false,
        attributionControl: false,
        zoomControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      rings = mapRingsKm.map((km, i) => {
        const opacity = 0.35 + i * 0.2;
        return L.circle([site.geo.lat, site.geo.lng], {
          radius: reduced ? km * 1000 : 0,
          color: YELLOW,
          weight: i === mapRingsKm.length - 1 ? 2.5 : 1.5,
          opacity,
          fillColor: YELLOW,
          fillOpacity: i === 0 ? 0.06 : 0.02,
          interactive: false,
        }).addTo(map!);
      });

      for (const town of mapTowns) {
        if (town.hq) {
          const icon = L.divIcon({
            className: "area-map-hq",
            html: `<span class="area-map-hq__ring"></span><span class="area-map-hq__dot"></span>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });
          L.marker([town.lat, town.lng], { icon, interactive: false })
            .bindTooltip(town.name, {
              permanent: true,
              direction: "top",
              offset: [0, -14],
              className: "area-map-tooltip area-map-tooltip--hq",
            })
            .addTo(map);
          continue;
        }

        const icon = L.divIcon({
          className: "area-map-town",
          html: `<span class="area-map-town__dot"></span>`,
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        });
        L.marker([town.lat, town.lng], { icon, interactive: false })
          .bindTooltip(mapTownLabel(town), {
            permanent: true,
            direction: "right",
            offset: [8, 0],
            className: "area-map-tooltip",
          })
          .addTo(map);
      }

      const bounds = L.latLng(site.geo.lat, site.geo.lng).toBounds(
        site.geo.radiusM * 2.05,
      );
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 10 });

      if (!reduced) {
        observer = new IntersectionObserver(
          (entries) => {
            if (!entries.some((e) => e.isIntersecting)) return;
            observer?.disconnect();
            rings.forEach((circle, i) => {
              const target = mapRingsKm[i]! * 1000;
              const start = performance.now();
              const duration = 900 + i * 180;
              const tick = (now: number) => {
                const t = Math.min(1, (now - start) / duration);
                const eased = 1 - (1 - t) ** 3;
                circle.setRadius(target * eased);
                if (t < 1) requestAnimationFrame(tick);
              };
              requestAnimationFrame(tick);
            });
          },
          { threshold: 0.35 },
        );
        observer.observe(containerRef.current);
      }

      requestAnimationFrame(() => map?.invalidateSize());
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
      map?.remove();
      mapRef.current = null;
    };
  }, [reduced]);

  return (
    <div className="area-map-shell relative z-0 isolate overflow-hidden border border-line bg-void">
      <div
        ref={containerRef}
        className="area-map h-[min(72vw,420px)] w-full md:h-[480px]"
        role="img"
        aria-label="Mapa oblasti do 50 km od Poběžovic"
      />
      <p className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 text-center font-mono text-[11px] tracking-wide text-white/55">
        okruh 50 km · 10 / 25 / 50
      </p>
      <p className="sr-only">Podklad mapy © OpenStreetMap contributors</p>
    </div>
  );
}
