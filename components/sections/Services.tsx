"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import { Section, SectionHeader } from "@/components/ui/Section";
import { AssetOrPlaceholder } from "@/components/ui/AssetOrPlaceholder";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const PREVIEW_W = 240;
const PREVIEW_H = 160;

function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine;
}

export function Services() {
  const listRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const xTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

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

  useEffect(() => {
    const el = previewRef.current;
    if (!el || !finePointer || reduced) return;
    xTo.current = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    yTo.current = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
    gsap.set(el, { x: -9999, y: -9999, opacity: 0, scale: 0.9 });
    return () => {
      xTo.current = null;
      yTo.current = null;
    };
  }, [finePointer, reduced]);

  useEffect(() => {
    const el = previewRef.current;
    if (!el || !finePointer || reduced) return;
    if (activeId && previewSrc) {
      gsap.to(el, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else {
      gsap.to(el, {
        opacity: 0,
        scale: 0.9,
        duration: 0.25,
        ease: "power2.in",
        overwrite: "auto",
      });
    }
  }, [activeId, previewSrc, finePointer, reduced]);

  const onRowEnter = useCallback(
    (id: string, src: string, alt: string) => {
      if (!finePointer || reduced) return;
      setActiveId(id);
      setPreviewSrc({ src, alt });
    },
    [finePointer, reduced],
  );

  const onRowLeave = useCallback(() => {
    if (!finePointer || reduced) return;
    setActiveId(null);
  }, [finePointer, reduced]);

  const onRowMove = useCallback(
    (e: MouseEvent) => {
      if (!finePointer || reduced) return;
      const offsetX = 24;
      const offsetY = -PREVIEW_H / 2;
      xTo.current?.(e.clientX + offsetX);
      yTo.current?.(e.clientY + offsetY);
    },
    [finePointer, reduced],
  );

  return (
    <Section
      id="sluzby"
      tone="panel"
      className="!border-t-0 !pt-10 md:!pt-32"
    >
      <SectionHeader title="Služby">
        Od výkopu po odvoz materiálu – minibagr s obsluhou a vlastní dopravou.
      </SectionHeader>

      <div
        ref={listRef}
        className="mt-14 divide-y divide-line border-y border-line"
      >
        {site.services.map((s) => (
          <article
            key={s.id}
            className={`service-row group grid gap-4 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-start md:gap-10 md:py-10 ${
              finePointer && !reduced ? "cursor-default" : ""
            }`}
            onMouseEnter={() => onRowEnter(s.id, s.image, s.imageAlt)}
            onMouseLeave={onRowLeave}
            onMouseMove={onRowMove}
          >
            <div className="min-w-0">
              <h3
                className={`relative inline-block font-display text-2xl uppercase md:text-3xl ${
                  finePointer
                    ? "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-komatsu-yellow after:transition-transform after:duration-500 after:ease-out group-hover:after:scale-x-100"
                    : ""
                }`}
              >
                {s.title}
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-white/70">
              {s.bullets.map((b) => (
                <li key={b} className="flex gap-3">
                  <span
                    className="mt-2 h-px w-4 shrink-0 bg-komatsu-yellow/70"
                    aria-hidden
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {finePointer && !reduced ? (
        <div
          ref={previewRef}
          className="pointer-events-none fixed top-0 left-0 z-[90] hidden overflow-hidden border border-white/10 shadow-2xl md:block"
          style={{ width: PREVIEW_W, height: PREVIEW_H, opacity: 0 }}
          aria-hidden
        >
          {previewSrc ? (
            <AssetOrPlaceholder
              src={previewSrc.src}
              alt={previewSrc.alt}
              className="h-full w-full object-cover"
              width={PREVIEW_W}
              height={PREVIEW_H}
              loading="eager"
            />
          ) : null}
        </div>
      ) : null}
    </Section>
  );
}
