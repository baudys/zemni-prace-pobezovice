"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import { AssetOrPlaceholder } from "@/components/ui/AssetOrPlaceholder";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function TruckDriveBy() {
  const sectionRef = useRef<HTMLElement>(null);
  const truckRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !sectionRef.current || !truckRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        truckRef.current,
        { xPercent: -110, x: 0 },
        {
          xPercent: 0,
          x: () => window.innerWidth * 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      if (window.matchMedia("(pointer: fine)").matches) {
        gsap.to(truckRef.current, {
          y: "+=2",
          duration: 0.2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="preprava"
      className={
        reduced
          ? "relative min-h-svh overflow-hidden bg-gradient-to-b from-[#1a120e] via-[#22180f] to-[#0a0a0a]"
          : "relative h-[160vh] overflow-hidden bg-gradient-to-b from-[#1a120e] via-[#22180f] to-[#0a0a0a] md:h-[180vh]"
      }
    >
      <div
        className={
          reduced
            ? "flex min-h-svh flex-col justify-center py-12"
            : "sticky top-0 flex h-svh flex-col justify-center"
        }
      >
        <p className="mx-auto mb-8 max-w-3xl px-4 text-center font-display text-2xl uppercase text-white md:text-4xl">
          {site.truckCopy}
        </p>
        <div className="relative h-[40vw] min-h-[180px] w-full overflow-hidden">
          <div
            className="absolute inset-x-0 bottom-[18%] h-10 bg-[linear-gradient(90deg,#3a3a3a_0%,#555_50%,#3a3a3a_100%)]"
            aria-hidden
          />
          <div
            className="absolute inset-x-0 bottom-[14%] h-2 bg-komatsu-yellow/40"
            aria-hidden
          />
          <div
            ref={truckRef}
            className={
              reduced
                ? "absolute bottom-[16%] left-1/2 w-[90vw] -translate-x-1/2 md:w-[55vw]"
                : "absolute bottom-[16%] left-0 w-[120vw] md:w-[60vw]"
            }
          >
            <AssetOrPlaceholder
              src="/truck/truck.webp"
              alt="MAN TGL s minibagrem na plošině, směr jízdy doprava"
              className="h-auto w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
              width={2000}
              height={1049}
              loading="lazy"
            />
            {!reduced ? (
              <span
                className="pointer-events-none absolute bottom-[8%] left-[18%] h-3 w-16 rounded-full bg-sand/40 blur-sm"
                aria-hidden
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
