"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function Services() {
  const listRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !listRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".service-row", {
        y: 28,
        opacity: 0,
        duration: 0.65,
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
    <Section id="sluzby" tone="panel">
      <SectionHeader title="Služby">
        Od výkopu po odvoz materiálu – minibagr s obsluhou a vlastní dopravou.
      </SectionHeader>

      <div ref={listRef} className="mt-14 divide-y divide-line border-y border-line">
        {site.services.map((s) => (
          <article
            key={s.id}
            className="service-row grid gap-4 py-8 md:grid-cols-[1fr_1.1fr] md:items-start md:gap-10 md:py-10"
          >
            <h3 className="font-display text-2xl uppercase md:text-3xl">{s.title}</h3>
            <ul className="space-y-2 text-sm text-white/70">
              {s.bullets.map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-2 h-px w-4 shrink-0 bg-komatsu-yellow/70" aria-hidden />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
