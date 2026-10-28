"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useLowEndDevice } from "@/components/motion/useLowEndDevice";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const lowEnd = useLowEndDevice();

  useEffect(() => {
    if (reduced || lowEnd) {
      document.documentElement.classList.remove("lenis");
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      anchors: {
        offset: -88,
      },
    });

    document.documentElement.classList.add("lenis");

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
      document.documentElement.classList.remove("lenis");
    };
  }, [reduced, lowEnd]);

  return children;
}
