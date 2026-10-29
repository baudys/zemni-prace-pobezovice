"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { track } from "@vercel/analytics";
import { site, unwrap } from "@/content/site";
import { useLowEndDevice } from "@/components/motion/useLowEndDevice";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { AssetOrPlaceholder } from "@/components/ui/AssetOrPlaceholder";
import { Button } from "@/components/ui/Button";

/** Hold dig still + fade hero copy before scrubbing frames. */
const HERO_HOLD = 0.02;
/** Autoplay intro loop: first N dig frames, ping-pong until scroll. */
const IDLE_LOOP_FRAMES = 15;
/** Dig frames advanced per second while idle (ping-pong). */
const IDLE_FPS = 14;

const DIG_FIRST = "/seq/dig/0001.webp";
const DIG_FIRST_MOBILE = "/seq/dig-mobile/0001.webp";

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

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  cw: number,
  ch: number,
  iw: number,
  ih: number,
  focusX = 0.4,
  focusY = 0.55,
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

function heroOpacityFromProgress(progress: number): number {
  if (progress <= 0) return 1;
  if (progress >= HERO_HOLD) return 0;
  return 1 - progress / HERO_HOLD;
}

function frameProgressFromScroll(progress: number): number {
  if (progress <= HERO_HOLD) return 0;
  return (progress - HERO_HOLD) / (1 - HERO_HOLD);
}

const HERO_LINES = ["Pronájem minibagru", "s obsluhou"] as const;

function subscribeMobile(onChange: () => void) {
  const mq = window.matchMedia("(max-width: 767px)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getMobileSnapshot() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function useIsMobile() {
  return useSyncExternalStore(subscribeMobile, getMobileSnapshot, () => false);
}

function HeroCopy() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (reduced) {
      gsap.set(root.querySelectorAll("[data-hero]"), { clearProps: "all" });
      return;
    }

    const ctx = gsap.context(() => {
      const lines = root.querySelectorAll("[data-hero=line]");
      const rest = root.querySelectorAll("[data-hero=sub], [data-hero=cta]");
      gsap.set(lines, { opacity: 0, y: 40 });
      gsap.set(rest, { opacity: 0, y: 18 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(lines, { opacity: 1, y: 0, duration: 0.85, stagger: 0.11 })
        .to("[data-hero=sub]", { opacity: 1, y: 0, duration: 0.55 }, "-=0.35")
        .to("[data-hero=cta]", { opacity: 1, y: 0, duration: 0.5 }, "-=0.25");
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={rootRef}>
      <h1 className="font-display text-[clamp(1.75rem,5.5vw,4.5rem)] uppercase leading-[1.12] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.65)]">
        {HERO_LINES.map((line) => (
          <span key={line} data-hero="line" className="block whitespace-nowrap">
            {line}
          </span>
        ))}
      </h1>
      <p
        data-hero="sub"
        className="mt-5 max-w-none text-base text-white/95 drop-shadow-[0_1px_12px_rgba(0,0,0,0.7)] text-balance md:whitespace-nowrap md:text-lg"
      >
        {site.hero.subtitle}
      </p>
      <div
        data-hero="cta"
        className="relative z-10 mt-7 flex flex-wrap items-center justify-center gap-3 pointer-events-auto"
      >
        <Button
          href="#kontakt"
          onClick={() => track("cta_click", { source: "hero" })}
        >
          {site.hero.cta}
        </Button>
        <Button
          href="#cenik"
          variant="outline"
          className="border-white/55 bg-black/45 backdrop-blur-sm hover:border-white hover:bg-black/60"
        >
          {site.hero.secondary}
        </Button>
      </div>
    </div>
  );
}

const heroCopyLayout =
  "mx-auto flex w-full max-w-4xl flex-col items-center px-4 pt-[max(6.5rem,11vh)] text-center pb-[min(52vh,28rem)] md:pb-[min(54vh,32rem)]";

function StaticHero({ firstFrame }: { firstFrame: string }) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !mediaRef.current) return;
    const tween = gsap.fromTo(
      mediaRef.current,
      { scale: 1 },
      {
        scale: 1.06,
        duration: 16,
        ease: "none",
        transformOrigin: "40% 55%",
      },
    );
    return () => {
      tween.kill();
    };
  }, [reduced]);

  return (
    <section
      id="hero"
      className="relative flex min-h-svh items-stretch overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div ref={mediaRef} className="h-full w-full will-change-transform">
          <AssetOrPlaceholder
            src={firstFrame}
            alt=""
            className="h-full w-full object-cover object-[40%_55%]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-transparent" />
      </div>
      <div className={`relative z-10 ${heroCopyLayout}`}>
        <HeroCopy />
      </div>
    </section>
  );
}

export function ScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroLayerRef = useRef<HTMLDivElement>(null);
  const stillRef = useRef<HTMLImageElement>(null);
  const textItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion();
  const lowEnd = useLowEndDevice();
  const [loadFailed, setLoadFailed] = useState(false);
  const isMobile = useIsMobile();
  const fallback = reduced || lowEnd || loadFailed;

  useEffect(() => {
    if (reduced || lowEnd) {
      return;
    }

    let cancelled = false;
    const frames: (HTMLImageElement | ImageBitmap | null)[] = [];
    let lastDrawn = -1;
    let lastTextIdx = -2;
    let lastPaintIdx = -1;
    let smoothProgress = 0;
    let pathsLen = 0;
    let digWidth = 1920;
    let digHeight = 1080;
    let paintFn: ((index: number, force?: boolean) => void) | null = null;
    let ready = false;
    let idlePos = 0;
    let idleDir = 1;
    let idleMax = IDLE_LOOP_FRAMES - 1;
    let scrollFrom = 0;
    let wasHolding = true;
    let lastTickTime = performance.now();

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

    const applyHeroLayers = (progress: number) => {
      const textOpacity = heroOpacityFromProgress(progress);
      if (heroLayerRef.current) {
        heroLayerRef.current.style.opacity = String(textOpacity);
        heroLayerRef.current.style.pointerEvents = textOpacity < 0.05 ? "none" : "auto";
        heroLayerRef.current.style.transform = `translate3d(0, ${(-1 + textOpacity) * 12}%, 0)`;
      }
    };

    const applyText = (frameProgress: number) => {
      let textIdx = -1;
      if (frameProgress > 0.02) {
        textIdx = site.scrollTexts.findIndex(
          (t) => frameProgress >= t.start && frameProgress < t.end,
        );
        // Poslední slide drží až do konce scény (včetně progress === 1).
        if (textIdx < 0 && frameProgress >= site.scrollTexts.at(-1)!.start) {
          textIdx = site.scrollTexts.length - 1;
        }
      }
      if (textIdx === lastTextIdx) return;
      lastTextIdx = textIdx;
      textItemsRef.current.forEach((el, i) => {
        if (!el) return;
        const on = i === textIdx;
        el.style.opacity = on ? "1" : "0";
        el.style.transform = on
          ? "translate3d(-50%,0,0)"
          : "translate3d(-50%,0.8rem,0)";
        el.setAttribute("aria-hidden", on ? "false" : "true");
      });
    };

    const readProgress = () => {
      const section = sectionRef.current;
      if (!section) return 0;
      const total = section.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      return Math.min(1, Math.max(0, -section.getBoundingClientRect().top / total));
    };

    const paintIndex = (idx: number) => {
      if (!paintFn || pathsLen < 1) return;
      const clamped = Math.min(pathsLen - 1, Math.max(0, idx));
      if (clamped !== lastPaintIdx) {
        lastPaintIdx = clamped;
        paintFn(clamped);
      }
    };

    const runIdle = (dt: number) => {
      if (idleMax > 0) {
        idlePos += idleDir * IDLE_FPS * dt;
        if (idlePos >= idleMax) {
          idlePos = idleMax;
          idleDir = -1;
        } else if (idlePos <= 0) {
          idlePos = 0;
          idleDir = 1;
        }
      }
      paintIndex(Math.round(idlePos));
      applyText(0);
    };

    const handoffToScroll = () => {
      if (!wasHolding) return;
      scrollFrom = Math.round(idlePos);
      wasHolding = false;
    };

    const applyScrollFrames = (progress: number) => {
      const frameProgress = frameProgressFromScroll(progress);
      const span = Math.max(1, pathsLen - 1 - scrollFrom);
      const idx = Math.min(
        pathsLen - 1,
        scrollFrom + Math.floor(frameProgress * span),
      );
      paintIndex(idx);
      applyText(frameProgress);
    };

    const onTick = () => {
      if (cancelled) return;
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastTickTime) / 1000);
      lastTickTime = now;
      // Raw progress decides idle vs scrub — never keep ping-ponging after scroll starts.
      const target = readProgress();

      if (target <= 0) {
        if (!wasHolding) {
          idlePos = scrollFrom;
          idleDir = 1;
        }
        wasHolding = true;
        smoothProgress = 0;
        applyHeroLayers(0);
        if (ready && paintFn && pathsLen > 0) runIdle(dt);
        return;
      }

      handoffToScroll();
      // Catch up instantly when scrolling down so frames track the wheel.
      if (target > smoothProgress) smoothProgress = target;
      else smoothProgress += (target - smoothProgress) * 0.28;
      if (Math.abs(target - smoothProgress) < 0.0008) smoothProgress = target;
      applyHeroLayers(smoothProgress);
      if (ready && paintFn && pathsLen > 0) applyScrollFrames(smoothProgress);
    };

    applyHeroLayers(0);
    applyText(0);
    gsap.ticker.add(onTick);
    window.addEventListener("scroll", onTick, { passive: true });

    async function setup() {
      const [digM, underM] = await Promise.all([
        loadManifest(`${digBase}/manifest.json`),
        loadManifest(`${underBase}/manifest.json`),
      ]);

      if (!digM || !underM || cancelled) {
        if (!cancelled) setLoadFailed(true);
        return;
      }

      digWidth = digM.width;
      digHeight = digM.height;

      const digPaths: string[] = [];
      for (let i = 0; i < digM.count; i++) {
        digPaths.push(framePath(digBase, digM.firstIndex + i, digM.pattern));
      }
      const underPaths: string[] = [];
      for (let i = 1; i < underM.count; i++) {
        underPaths.push(framePath(underBase, underM.firstIndex + i, underM.pattern));
      }
      const paths = [...digPaths, ...underPaths];
      pathsLen = paths.length;
      idleMax = Math.max(0, Math.min(IDLE_LOOP_FRAMES, digPaths.length) - 1);
      frames.length = paths.length;
      frames.fill(null);

      const canvas = canvasRef.current;
      const section = sectionRef.current;
      if (!canvas || !section) {
        if (!cancelled) setLoadFailed(true);
        return;
      }
      const ctx = canvas.getContext("2d", { alpha: false, colorSpace: "srgb" });
      if (!ctx) {
        if (!cancelled) setLoadFailed(true);
        return;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        // Reset after buffer resize (browsers drop these with canvas.width assign).
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        if (lastDrawn >= 0) paint(lastDrawn, true);
      };

      const paint = (index: number, force = false) => {
        if (!force && index === lastDrawn) return;
        const hit = nearestLoaded(frames, index);
        if (!hit) return;
        const iw =
          "naturalWidth" in hit.img
            ? hit.img.naturalWidth || digWidth
            : hit.img.width;
        const ih =
          "naturalHeight" in hit.img
            ? hit.img.naturalHeight || digHeight
            : hit.img.height;
        drawCover(ctx, hit.img, window.innerWidth, window.innerHeight, iw, ih);
        lastDrawn = index;
      };
      paintFn = paint;

      const loadAt = async (i: number) => {
        if (cancelled || frames[i]) return;
        const path = paths[i];
        if (!path) return;
        frames[i] = await loadImage(path);
        paint(lastDrawn >= 0 ? lastDrawn : 0, true);
      };

      resize();
      canvas.style.opacity = "1";
      window.addEventListener("resize", resize);

      const preloadFirst = Math.min(IDLE_LOOP_FRAMES + 2, digPaths.length);
      await loadAt(0);
      if (cancelled) return;
      paint(0, true);
      ready = true;
      if (stillRef.current) {
        stillRef.current.style.opacity = "0";
        stillRef.current.setAttribute("aria-hidden", "true");
      }
      lastTickTime = performance.now();
      paintIndex(Math.round(idlePos));

      void Promise.all(
        Array.from({ length: preloadFirst }, (_, i) => loadAt(i)),
      ).then(() => {
        if (!cancelled) paint(lastPaintIdx >= 0 ? lastPaintIdx : 0, true);
      });

      const everyFourth: number[] = [];
      for (let i = preloadFirst; i < paths.length; i += 4) everyFourth.push(i);
      void Promise.all(everyFourth.map((i) => loadAt(i)));

      const fillRest = async () => {
        for (let i = 0; i < paths.length; i++) {
          if (cancelled) return;
          if (!frames[i]) await loadAt(i);
          if (i % 8 === 0) {
            await new Promise<void>((r) => setTimeout(r, 0));
          }
        }
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
    void setup().then((c) => {
      cleanupInner = c;
    });

    return () => {
      cancelled = true;
      ready = false;
      gsap.ticker.remove(onTick);
      window.removeEventListener("scroll", onTick);
      cleanupInner?.();
      frames.forEach((f) => {
        if (f && "close" in f) f.close();
      });
    };
  }, [reduced, lowEnd, isMobile]);

  if (fallback) {
    return (
      <>
        <StaticHero firstFrame={DIG_FIRST} />
        <section id="v-akci" className="bg-ink">
          <div className="relative mx-auto max-w-6xl px-4 py-16">
            <AssetOrPlaceholder
              src="/hero/bucket-in-soil.webp"
              alt="Minibagr při výkopu"
              className="mb-8 w-full rounded-lg object-cover"
            />
            <ul className="space-y-10">
              {site.scrollTexts.map((t) => (
                <li key={t.title}>
                  <h2 className="font-display text-3xl uppercase tracking-tight text-white md:text-5xl">
                    {t.title}
                  </h2>
                  {"subtitle" in t && t.subtitle ? (
                    <p className="mt-2 font-display text-base uppercase tracking-wide text-white/60 md:text-lg">
                      <span className="text-komatsu-yellow">{unwrap(t.subtitle)}</span>
                      {"detail" in t && t.detail ? (
                        <span> · {t.detail}</span>
                      ) : null}
                    </p>
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
      </>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-[280vh] bg-ink md:h-[360vh]"
      aria-label="Úvod a animace výkopu řízená scrollem"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* LCP still — skryje se, jakmile canvas hraje idle smyčku dig 0001–0010. */}
        <div className="absolute inset-0 overflow-hidden">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet={DIG_FIRST_MOBILE}
              type="image/webp"
            />
            <img
              ref={stillRef}
              src={DIG_FIRST}
              alt=""
              width={1920}
              height={1080}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[40%_55%] transition-opacity duration-300"
            />
          </picture>
        </div>

        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full opacity-0"
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/55 via-black/15 to-transparent" />

        <div
          ref={heroLayerRef}
          className="absolute inset-0 z-20 flex flex-col will-change-[opacity,transform]"
        >
          <div className={heroCopyLayout}>
            <HeroCopy />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-[46%] z-10 -translate-y-full md:top-[48%]">
          <div className="relative mx-auto h-[11rem] w-full max-w-6xl px-4 text-center md:h-[13.5rem] md:px-8">
            {site.scrollTexts.map((t, i) => (
              <div
                key={t.title}
                ref={(el) => {
                  textItemsRef.current[i] = el;
                }}
                className="absolute left-1/2 top-0 w-full max-w-4xl opacity-0 transition-[opacity,transform] duration-500 ease-out"
                style={{ transform: "translate3d(-50%,0.8rem,0)" }}
                aria-hidden="true"
              >
                <h2 className="px-1 font-display text-[clamp(1.75rem,6vw,5.25rem)] uppercase leading-[1.05] tracking-tight text-balance text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.55)]">
                  {t.title}
                </h2>
                {"subtitle" in t && t.subtitle ? (
                  <p className="mt-3 px-1 font-display text-[clamp(1rem,2.4vw,1.85rem)] uppercase tracking-wide text-balance text-white/70">
                    <span className="text-komatsu-yellow">
                      {unwrap(t.subtitle)}
                    </span>
                    {"detail" in t && t.detail ? (
                      <span className="text-white/55"> · {t.detail}</span>
                    ) : null}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[12vh] bg-gradient-to-b from-transparent via-panel/50 to-panel"
          aria-hidden
        />
        <p className="sr-only">
          Animace ukazuje výkop minibagrem a průlet pod povrch půdy. Texty: výkopy a
          základy, terénní úpravy, stísněné prostory, hloubka výkopu.
        </p>
      </div>
      <div id="v-akci" className="sr-only" aria-hidden />
    </section>
  );
}
