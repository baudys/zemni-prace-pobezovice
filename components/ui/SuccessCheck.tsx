"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

type Props = {
  className?: string;
};

/** Free DrawSVG substitute — stroke-dashoffset checkmark. */
export function SuccessCheck({ className = "" }: Props) {
  const pathRef = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);

    if (reduced) {
      path.style.strokeDashoffset = "0";
      return;
    }

    path.style.strokeDashoffset = String(length);
    const tween = gsap.to(path, {
      strokeDashoffset: 0,
      duration: 0.6,
      ease: "power2.out",
    });
    return () => {
      tween.kill();
    };
  }, [reduced]);

  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
    >
      <circle
        cx="24"
        cy="24"
        r="22"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.35"
      />
      <path
        ref={pathRef}
        d="M14 24.5 L21 31.5 L34 16.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
    </svg>
  );
}
