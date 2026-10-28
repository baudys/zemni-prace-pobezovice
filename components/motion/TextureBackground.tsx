"use client";

import type { CSSProperties, ReactNode } from "react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

type Props = {
  desktop: string;
  mobile: string;
  children: ReactNode;
  className?: string;
  id?: string;
  parallax?: boolean;
};

export function TextureBackground({
  desktop,
  mobile,
  children,
  className = "",
  id,
  parallax = true,
}: Props) {
  const reduced = useReducedMotion();

  const style = {
    backgroundImage: `url(${mobile})`,
    backgroundAttachment: parallax && !reduced ? "fixed" : "scroll",
    ["--bg-desktop" as string]: `url(${desktop})`,
  } as CSSProperties;

  return (
    <section
      id={id}
      className={`texture-section texture-bg-responsive ${className}`}
      style={style}
      data-desktop-bg={desktop}
    >
      {/* Desktop override via CSS using picture-like media - applied through inline media query class */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden bg-cover bg-center xl:block"
        style={{
          backgroundImage: `url(${desktop})`,
          backgroundAttachment: parallax && !reduced ? "fixed" : "scroll",
        }}
      />
      {children}
    </section>
  );
}
