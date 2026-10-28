"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import { TextureBackground } from "@/components/motion/TextureBackground";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function HowItWorks() {
  const pathRef = useRef<SVGPathElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !pathRef.current || !sectionRef.current) return;
    const path = pathRef.current;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 40%",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <TextureBackground
      id="jak-to-funguje"
      desktop="/textures/sand.webp"
      mobile="/textures/sand-mobile.webp"
      className="py-20 md:py-28"
    >
      <div ref={sectionRef} className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="font-display text-4xl uppercase md:text-6xl">Jak to funguje</h2>
        <p className="mt-3 max-w-2xl text-white/80">Tři kroky od poptávky po hotovou práci.</p>

        <div className="relative mt-12">
          <svg
            className="pointer-events-none absolute left-0 top-8 hidden h-[calc(100%-2rem)] w-full md:block"
            viewBox="0 0 1000 120"
            fill="none"
            aria-hidden
          >
            <path
              ref={pathRef}
              d="M40 60 C 200 10, 320 110, 500 60 S 820 10, 960 60"
              stroke="#F5B800"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="12 10"
            />
          </svg>

          <ol className="grid gap-6 md:grid-cols-3">
            {site.howItWorks.map((step) => (
              <li
                key={step.step}
                className="relative rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm"
              >
                <span className="font-display text-5xl text-brand-red">{step.step}</span>
                <h3 className="mt-2 font-display text-2xl uppercase">{step.title}</h3>
                <p className="mt-2 text-white/75">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </TextureBackground>
  );
}
