"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { formatCzk } from "@/content/site";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

type Props = {
  value: number;
  className?: string;
  /** Format as CZK currency (default) or plain number. */
  currency?: boolean;
};

export function CountUp({ value, className = "", currency = true }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const format = (n: number) =>
      currency ? formatCzk(n) : Math.round(n).toLocaleString("cs-CZ");

    if (reduced) {
      el.textContent = format(value);
      prev.current = value;
      return;
    }

    const from = prev.current;
    const obj = { n: from };
    const tween = gsap.to(obj, {
      n: value,
      duration: 0.4,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = format(obj.n);
      },
      onComplete: () => {
        el.textContent = format(value);
        prev.current = value;
      },
    });

    return () => {
      tween.kill();
    };
  }, [value, currency, reduced]);

  const initial = currency
    ? formatCzk(value)
    : Math.round(value).toLocaleString("cs-CZ");

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {initial}
    </span>
  );
}
