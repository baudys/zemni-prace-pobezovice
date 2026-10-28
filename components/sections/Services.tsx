"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import { Card } from "@/components/ui/Card";
import { TextureBackground } from "@/components/motion/TextureBackground";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function Services() {
  const listRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !listRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".service-card", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: listRef.current,
          start: "top 80%",
        },
      });
    }, listRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <TextureBackground
      id="sluzby"
      desktop="/textures/soil-cross-section.webp"
      mobile="/textures/soil-cross-section-mobile.webp"
      className="relative py-20 md:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-[#0a0a0a] to-transparent md:h-24"
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="hazard-stripe mb-8 max-w-xs" />
        <h2 className="font-display text-4xl uppercase md:text-6xl">Služby</h2>
        <p className="mt-3 max-w-2xl text-white/80">
          Od výkopu po odvoz suti – jedna firma, jeden telefon.
        </p>
        <div
          ref={listRef}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {site.services.map((s, i) => (
            <Card key={s.id} className="service-card">
              <div
                className="mb-3 font-display text-sm tracking-[0.25em] text-komatsu-yellow"
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-display text-xl uppercase">{s.title}</h3>
              <p className="mt-2 text-sm text-white/75">{s.text}</p>
              <ul className="mt-4 space-y-1 text-sm text-sand">
                {s.bullets.map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </TextureBackground>
  );
}
