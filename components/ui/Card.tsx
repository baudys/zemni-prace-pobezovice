"use client";

import type { PointerEvent, ReactNode } from "react";
import { useRef } from "react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

type Props = {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
};

export function Card({ children, className = "", tilt = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (!tilt || reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) scale(1.02)`;
  }

  function onLeave() {
    if (!ref.current) return;
    ref.current.style.transform = "";
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`rounded-xl border border-white/10 bg-black/35 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-[2px] transition-transform duration-200 will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
