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
            // Jízda, dokud je pás ve viewportu (footer omezuje scroll — nečekat bottom top).
            start: "top 90%",
            end: "top 20%",
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
        {/* Výška pásu ≈ kamion; kola sedí na žluté hraně footeru (bez spodní mezery). */}
        <div className="relative h-44 w-full md:h-56">
          <div
            ref={truckRef}
            className={
              reduced
                ? "absolute bottom-0 right-0 w-full max-w-full md:w-[min(48vw,26rem)] md:max-w-[26rem]"
                : "absolute bottom-0 left-0 w-[min(58vw,22rem)] will-change-transform md:w-[min(48vw,26rem)]"
            }
          >
            <AssetOrPlaceholder
              src="/truck/truck.webp"
              alt="MAN TGL s minibagrem na plošině"
              className="block h-auto w-full max-w-full select-none object-contain object-right"
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
