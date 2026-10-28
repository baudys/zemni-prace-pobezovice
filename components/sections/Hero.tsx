"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { track } from "@vercel/analytics";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { useLowEndDevice } from "@/components/motion/useLowEndDevice";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const lowEnd = useLowEndDevice();
  const [poster, setPoster] = useState("/hero/hero-poster.webp");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      setPoster(mq.matches ? "/hero/hero-poster-mobile.webp" : "/hero/hero-poster.webp");
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const saveData =
      "connection" in navigator &&
      Boolean(
        (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
          ?.saveData,
      );

    if (reduced || lowEnd || saveData) {
      video.removeAttribute("autoplay");
      video.pause();
      return;
    }

    const start = () => {
      void video.play().catch(() => undefined);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
  }, [reduced, lowEnd]);

  useEffect(() => {
    if (reduced || !rootRef.current || !textRef.current || !mediaRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(textRef.current, {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.fromTo(
        mediaRef.current,
        { scale: 1.02 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  const staticHero = reduced || lowEnd;

  return (
    <section
      ref={rootRef}
      id="hero"
      className="relative flex min-h-svh items-stretch overflow-hidden"
    >
      <div ref={mediaRef} className="absolute inset-0 origin-center">
        <video
          ref={videoRef}
          className="h-full w-full object-cover object-[center_bottom] md:scale-[0.98] md:object-[40%_85%]"
          muted
          playsInline
          loop
          preload="metadata"
          poster={poster}
          aria-hidden
        >
          {!staticHero ? (
            <>
              <source
                media="(max-width: 767px)"
                src="/hero/hero-loop-mobile.mp4"
                type="video/mp4"
              />
              <source src="/hero/hero-loop.webm" type="video/webm" />
              <source src="/hero/hero-loop.mp4" type="video/mp4" />
            </>
          ) : null}
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/55" />
      </div>

      <div
        ref={textRef}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-[38vh] pt-[14vh] text-center md:pb-[40vh] md:pt-[12vh]"
      >
        <h1 className="font-display text-4xl uppercase leading-[0.95] text-white drop-shadow-lg sm:text-6xl md:text-7xl lg:text-8xl">
          {site.hero.h1}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-white/90 md:text-xl">
          {site.hero.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            href="#kontakt"
            onClick={() => track("cta_click", { source: "hero" })}
          >
            {site.hero.cta}
          </Button>
          <a
            href="#cenik"
            className="text-sm font-medium text-white/85 underline-offset-4 hover:underline"
          >
            {site.hero.secondary}
          </a>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <a
          href="#v-akci"
          className="flex flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/70"
          aria-label="Dolů – scrollovat k animaci výkopu"
        >
          <span
            className={`block h-10 w-6 rounded-full border border-white/40 ${
              reduced ? "" : "animate-pulse"
            }`}
          >
            <span className="mx-auto mt-2 block h-2 w-1 rounded bg-komatsu-yellow" />
          </span>
          Dolů
        </a>
      </div>
    </section>
  );
}
