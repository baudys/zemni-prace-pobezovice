"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function Area() {
  const wrapRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !wrapRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".area-ring-anim", {
        scale: 0.4,
        opacity: 0,
        duration: 1.1,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top 70%",
        },
      });
    }, wrapRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={wrapRef} id="oblast" className="bg-[#16110d] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="font-display text-4xl uppercase md:text-6xl">Oblast působnosti</h2>
        <p className="mt-3 max-w-2xl text-white/80">{site.areaLabel}</p>

        <div className="relative mt-10 grid items-center gap-10 lg:grid-cols-2">
          <div className="relative">
            {/* CSS rings overlay for animation even if SVG object loads statically */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="area-ring-anim absolute h-[22%] w-[22%] rounded-full border border-komatsu-yellow/40" />
              <span className="area-ring-anim absolute h-[45%] w-[45%] rounded-full border border-komatsu-yellow/55" />
              <span className="area-ring-anim absolute h-[78%] w-[78%] rounded-full border-2 border-komatsu-yellow/80" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/map/oblast.svg"
              alt="Mapa oblasti do 50 km od Poběžovic"
              className="w-full rounded-xl border border-white/10 bg-black/40"
              width={800}
              height={800}
              loading="lazy"
              decoding="async"
            />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-komatsu-yellow">
              Obce a města v dosahu
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/85">
              {site.towns.all.map((town, i) => {
                const bold = (site.towns.bold as readonly string[]).includes(town);
                return (
                  <span key={town}>
                    {bold ? <strong className="text-white">{town}</strong> : town}
                    {i < site.towns.all.length - 1 ? ", " : ""}
                  </span>
                );
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
