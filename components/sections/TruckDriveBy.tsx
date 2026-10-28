"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AssetOrPlaceholder } from "@/components/ui/AssetOrPlaceholder";
import { Footer } from "@/components/sections/Footer";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
};

/**
 * Kontakt → MAN pás → footer.
 * Bez sticky (nepřekrývá formulář). MAN přijede zleva a zastaví se
 * před pravým okrajem během průchodu pásem.
 */
export function TruckDriveBy({ children }: Props) {
  const driveRef = useRef<HTMLElement>(null);
  const truckRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !driveRef.current || !truckRef.current) return;

    const truck = truckRef.current;
    const drive = driveRef.current;

    const ctx = gsap.context(() => {
      const startX = () => -truck.offsetWidth * 1.08;
      // Zastavit s rezervou před pravým okrajem (~10–12 % šířky viewportu).
      const endX = () =>
        Math.max(16, window.innerWidth - truck.offsetWidth - window.innerWidth * 0.1);

      gsap.fromTo(
        truck,
        { x: startX },
        {
          x: endX,
          ease: "none",
          scrollTrigger: {
            trigger: drive,
            // Start, až je pás v obraze; konec, až odjede nahoru — delší scrub.
            start: "top 80%",
            end: "bottom top",
            scrub: 0.55,
            invalidateOnRefresh: true,
          },
        },
      );
    }, drive);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div className="relative bg-panel">
      {children}
      <section
        ref={driveRef}
        id="preprava"
        className="relative overflow-hidden bg-panel"
        aria-label="Vlastní doprava MAN TGL"
      >
        <div className="relative h-48 w-full md:h-60">
          <div
            className="absolute inset-x-0 bottom-4 h-px bg-line md:bottom-5"
            aria-hidden
          />
          <div
            className="absolute inset-x-0 bottom-[0.85rem] h-0.5 bg-komatsu-yellow/45 md:bottom-[1.05rem]"
            aria-hidden
          />

          <div
            ref={truckRef}
            className={
              reduced
                ? "absolute bottom-4 left-1/2 w-[min(58vw,22rem)] -translate-x-1/2 md:bottom-5 md:w-[min(48vw,26rem)]"
                : "absolute bottom-4 left-0 w-[min(58vw,22rem)] will-change-transform md:bottom-5 md:w-[min(48vw,26rem)]"
            }
          >
            <AssetOrPlaceholder
              src="/truck/truck.webp"
              alt="MAN TGL s minibagrem na plošině"
              className="h-auto w-full select-none object-contain object-bottom"
              width={2000}
              height={1049}
              loading="lazy"
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
