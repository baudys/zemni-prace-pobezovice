"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site, unwrap } from "@/content/site";
import { useLowEndDevice } from "@/components/motion/useLowEndDevice";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { AssetOrPlaceholder } from "@/components/ui/AssetOrPlaceholder";

gsap.registerPlugin(ScrollTrigger);

type Manifest = {
  count: number;
  width: number;
  height: number;
  pattern: string;
  firstIndex: number;
};

function framePath(base: string, index: number, pattern: string): string {
  const padded = String(index).padStart(4, "0");
  const file = pattern.replace("{0000}", padded);
  return `${base}/${file}`;
}

async function loadManifest(url: string): Promise<Manifest | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as Manifest;
  } catch {
    return null;
  }
}

/** Horizontal focus aligned with hero video (~40% from left). */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  cw: number,
  ch: number,
  iw: number,
  ih: number,
  focusX = 0.4,
  focusY = 0.5,
) {
  const scale = Math.max(cw / iw, ch / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = focusX * (cw - dw);
  const dy = focusY * (ch - dh);
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, dx, dy, dw, dh);
}

function nearestLoaded(
  frames: (HTMLImageElement | ImageBitmap | null)[],
  index: number,
): { img: HTMLImageElement | ImageBitmap; index: number } | null {
  if (frames[index]) return { img: frames[index]!, index };
  for (let d = 1; d < frames.length; d++) {
    if (index - d >= 0 && frames[index - d]) {
      return { img: frames[index - d]!, index: index - d };
    }
    if (index + d < frames.length && frames[index + d]) {
      return { img: frames[index + d]!, index: index + d };
    }
  }
  return null;
}

export function ScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const lowEnd = useLowEndDevice();
  const [loadFailed, setLoadFailed] = useState(false);
  const [activeText, setActiveText] = useState(0);
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  }, []);
  const fallback = reduced || lowEnd || loadFailed;

  useEffect(() => {
    if (reduced || lowEnd) {
      return;
    }

    let cancelled = false;
    let st: ScrollTrigger | null = null;
    const frames: (HTMLImageElement | ImageBitmap | null)[] = [];
    let lastDrawn = -1;

    const digBase = isMobile ? "/seq/dig-mobile" : "/seq/dig";
    const underBase = isMobile ? "/seq/underground-mobile" : "/seq/underground";

    async function loadImage(src: string): Promise<HTMLImageElement | ImageBitmap | null> {
      try {
        const img = new Image();
        img.decoding = "async";
        img.src = src;
        await img.decode();
        if ("createImageBitmap" in window) {
          try {
            return await createImageBitmap(img);
          } catch {
            return img;
          }
        }
        return img;
      } catch {
        return null;
      }
    }

    const scheduleIdle = (fn: () => void) => {
      if ("requestIdleCallback" in window) {
        (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(
          fn,
        );
      } else {
        setTimeout(fn, 50);
      }
    };

    async function setup() {
      const [digM, underM] = await Promise.all([
        loadManifest(`${digBase}/manifest.json`),
        loadManifest(`${underBase}/manifest.json`),
      ]);

      if (!digM || !underM || cancelled) {
        setLoadFailed(true);
        return;
      }

      const digPaths: string[] = [];
      for (let i = 0; i < digM.count; i++) {
        digPaths.push(framePath(digBase, digM.firstIndex + i, digM.pattern));
      }
      const underPaths: string[] = [];
      for (let i = 1; i < underM.count; i++) {
        underPaths.push(framePath(underBase, underM.firstIndex + i, underM.pattern));
      }
      const paths = [...digPaths, ...underPaths];
      frames.length = paths.length;
      frames.fill(null);

      const canvas = canvasRef.current;
      const section = sectionRef.current;
      if (!canvas || !section) {
        setLoadFailed(true);
        return;
      }
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) {
        setLoadFailed(true);
        return;
      }

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (lastDrawn >= 0) paint(lastDrawn, true);
      };

      const paint = (index: number, force = false) => {
        if (!force && index === lastDrawn) return;
        const hit = nearestLoaded(frames, index);
        if (!hit) return;
        const iw =
          "naturalWidth" in hit.img
            ? hit.img.naturalWidth || digM.width
            : hit.img.width;
        const ih =
          "naturalHeight" in hit.img
            ? hit.img.naturalHeight || digM.height
            : hit.img.height;
        drawCover(ctx, hit.img, window.innerWidth, window.innerHeight, iw, ih);
        lastDrawn = index;
      };

      const loadAt = async (i: number) => {
        if (cancelled || frames[i]) return;
        const path = paths[i];
        if (!path) return;
        frames[i] = await loadImage(path);
        paint(lastDrawn >= 0 ? lastDrawn : 0, true);
      };

      resize();
      window.addEventListener("resize", resize);

      const pinDuration = isMobile ? "300%" : "450%";

      st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${pinDuration}`,
        pin: true,
        scrub: 0.5,
        refreshPriority: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const idx = Math.min(
            paths.length - 1,
            Math.floor(progress * (paths.length - 1)),
          );
          paint(idx);
          const textIdx = site.scrollTexts.findIndex(
            (t) => progress >= t.start && progress < t.end,
          );
          setActiveText(textIdx >= 0 ? textIdx : site.scrollTexts.length - 1);
        },
      });
      ScrollTrigger.refresh();

      const preloadFirst = Math.min(10, digPaths.length);
      void loadAt(0);
      void Promise.all(
        Array.from({ length: preloadFirst }, (_, i) => loadAt(i)),
      ).then(() => {
        if (!cancelled) {
          paint(0, true);
          ScrollTrigger.refresh();
        }
      });

      const everyFourth: number[] = [];
      for (let i = preloadFirst; i < paths.length; i += 4) everyFourth.push(i);
      void Promise.all(everyFourth.map((i) => loadAt(i))).then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });

      const fillRest = async () => {
        for (let i = 0; i < paths.length; i++) {
          if (cancelled) return;
          if (!frames[i]) await loadAt(i);
          if (i % 8 === 0) {
            await new Promise((r) => scheduleIdle(() => r(undefined)));
          }
        }
        if (!cancelled) ScrollTrigger.refresh();
      };

      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            void fillRest();
            io.disconnect();
          }
        },
        { rootMargin: "200%" },
      );
      io.observe(section);

      return () => {
        window.removeEventListener("resize", resize);
        io.disconnect();
      };
    }

    let cleanupInner: (() => void) | undefined;
    const startSetup = () => {
      void setup().then((c) => {
        cleanupInner = c;
      });
    };
    if (document.readyState === "complete") {
      scheduleIdle(startSetup);
    } else {
      window.addEventListener("load", () => scheduleIdle(startSetup), { once: true });
    }

    return () => {
      cancelled = true;
      st?.kill();
      cleanupInner?.();
      frames.forEach((f) => {
        if (f && "close" in f) f.close();
      });
    };
  }, [reduced, lowEnd, isMobile]);

  if (fallback) {
    return (
      <section id="v-akci" className="bg-ink">
        <div className="relative mx-auto max-w-6xl px-4 py-16">
          <AssetOrPlaceholder
            src="/hero/bucket-in-soil.webp"
            alt="Minibagr při výkopu"
            className="mb-8 w-full rounded-lg object-cover"
          />
          <ul className="space-y-6">
            {site.scrollTexts.map((t) => (
              <li key={t.title}>
                <h2 className="font-display text-3xl uppercase md:text-5xl">{t.title}</h2>
                {"subtitle" in t && t.subtitle ? (
                  <p className="mt-2 text-lg text-sand">{unwrap(t.subtitle)}</p>
                ) : null}
              </li>
            ))}
          </ul>
          <AssetOrPlaceholder
            src="/textures/soil-cross-section.webp"
            alt="Řez půdou"
            className="mt-10 w-full rounded-lg object-cover"
          />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="v-akci"
      className="relative h-svh overflow-hidden bg-ink"
      aria-label="Animace výkopu řízená scrollem"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
          {site.scrollTexts.map((t, i) => (
            <div
              key={t.title}
              className={`max-w-xl transition-all duration-500 ${
                i === activeText
                  ? "translate-x-0 opacity-100"
                  : "translate-x-8 opacity-0 absolute"
              }`}
            >
              <h2 className="font-display text-4xl uppercase leading-none text-white drop-shadow-lg md:text-7xl">
                {t.title}
              </h2>
              {"subtitle" in t && t.subtitle ? (
                <p className="mt-4 font-display text-xl text-komatsu-yellow md:text-3xl">
                  {unwrap(t.subtitle)}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[12vh] bg-gradient-to-b from-transparent via-[#0a0a0a]/40 to-[#0a0a0a]"
        aria-hidden
      />
      <p className="sr-only">
        Animace ukazuje výkop minibagrem a průlet pod povrch půdy. Texty: výkopy a
        základy, terénní úpravy, stísněné prostory, hloubka výkopu.
      </p>
    </section>
  );
}
