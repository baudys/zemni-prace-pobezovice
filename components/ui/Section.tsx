"use client";

import {
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitElementIntoLines } from "@/components/motion/splitLines";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type Tone = "void" | "panel" | "deep";

const tones: Record<Tone, string> = {
  void: "bg-void",
  panel: "bg-panel",
  deep: "bg-deep",
};

type Props = {
  id?: string;
  tone?: Tone;
  children: ReactNode;
  className?: string;
};

export function Section({ id, tone = "void", children, className = "" }: Props) {
  return (
    <section
      id={id}
      className={`${tones[tone]} border-t border-line py-24 md:py-32 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">{children}</div>
    </section>
  );
}

type HeaderProps = {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  children,
  className = "",
}: HeaderProps) {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const titleEl = titleRef.current;
    const root = rootRef.current;
    if (!titleEl || !root) return;

    if (reduced) return;

    const lines = splitElementIntoLines(titleEl);
    if (lines.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(lines, { yPercent: 100 });
      if (eyebrowRef.current) {
        gsap.set(eyebrowRef.current, { opacity: 0 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          // Dřív než mid-viewport — jinak je H2 dlouho prázdný pod maskou.
          start: "top 95%",
          once: true,
        },
      });

      if (eyebrowRef.current) {
        tl.to(eyebrowRef.current, { opacity: 1, duration: 0.35, ease: "power2.out" }, 0);
      }

      tl.to(
        lines,
        {
          yPercent: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: "power3.out",
        },
        eyebrowRef.current ? 0.05 : 0,
      );
    }, root);

    return () => {
      ctx.revert();
      titleEl.textContent = title;
    };
  }, [title, reduced]);

  return (
    <header ref={rootRef} className={`max-w-3xl ${className}`}>
      {eyebrow ? (
        <p
          ref={eyebrowRef}
          className="text-sm text-white/45"
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        ref={titleRef}
        className="mt-4 font-display text-4xl uppercase leading-[1.08] tracking-tight text-white md:text-6xl lg:text-7xl"
      >
        {title}
      </h2>
      {children ? (
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
          {children}
        </p>
      ) : null}
    </header>
  );
}
