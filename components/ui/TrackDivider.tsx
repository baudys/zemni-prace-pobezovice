"use client";

import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Chevron rubber-belt imprint (› › ›), two halves + center gap —
 * matches excavator tread reference, laid L→R across the section.
 */
const PITCH = 20;
const UNIT_H = 40;
const TOP = 2;
const BOTTOM = 38;
const MID = UNIT_H / 2;
const CENTER_GAP = 2.4;
const SKEW = 8.5;
const BAR = 10;

type Props = {
  className?: string;
  /** When true, omit excavator silhouette (e.g. footer track under truck). */
  hideMachine?: boolean;
  /** ScrollTrigger start/end overrides (truck sync). */
  scrubStart?: string;
  scrubEnd?: string;
};

function ExcavatorSilhouette({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
      aria-hidden
    >
      <rect x="5" y="3" width="8" height="7" rx="1" fill="currentColor" opacity="0.9" />
      <rect x="7" y="1" width="4" height="3" rx="0.5" fill="currentColor" />
      <path d="M13 5.5h5l-1.5 2H13V5.5Z" fill="currentColor" opacity="0.75" />
      <rect x="3" y="11" width="14" height="2.5" rx="0.5" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

function ChevronUnit({ x }: { x: number }) {
  const yTopInner = MID - CENTER_GAP / 2;
  const yBotInner = MID + CENTER_GAP / 2;
  const upper = [
    [x, TOP],
    [x + BAR, TOP],
    [x + BAR + SKEW, yTopInner],
    [x + SKEW, yTopInner],
  ]
    .map((p) => p.join(","))
    .join(" ");
  const lower = [
    [x + SKEW, yBotInner],
    [x + BAR + SKEW, yBotInner],
    [x + BAR, BOTTOM],
    [x, BOTTOM],
  ]
    .map((p) => p.join(","))
    .join(" ");

  return (
    <>
      <polygon points={upper} />
      <polygon points={lower} />
    </>
  );
}

export function TrackDivider({
  className = "",
  hideMachine = false,
  scrubStart = "top 85%",
  scrubEnd = "top 40%",
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const patternId = `track-chevron-${uid}`;

  useEffect(() => {
    const clip = clipRef.current;
    if (!clip) return;

    if (reduced) {
      gsap.set(clip, { clipPath: "inset(0 0% 0 0)" });
      if (machineRef.current) {
        gsap.set(machineRef.current, { left: "100%", xPercent: -100 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: scrubStart,
          end: scrubEnd,
          scrub: 0.6,
        },
      });

      tl.fromTo(
        clip,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", ease: "none" },
        0,
      );

      if (machineRef.current) {
        tl.fromTo(
          machineRef.current,
          { left: "0%", xPercent: 0 },
          { left: "100%", xPercent: -100, ease: "none" },
          0,
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reduced, scrubStart, scrubEnd]);

  return (
    <div
      ref={rootRef}
      className={`relative w-full overflow-hidden text-komatsu-yellow ${className}`}
      aria-hidden
    >
      <div className="relative h-7 w-full md:h-10">
        <div
          ref={clipRef}
          className="absolute inset-0"
          style={reduced ? undefined : { clipPath: "inset(0 100% 0 0)" }}
        >
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id={patternId}
                width={PITCH}
                height="100%"
                patternUnits="userSpaceOnUse"
                viewBox={`0 0 ${PITCH} ${UNIT_H}`}
                preserveAspectRatio="none"
              >
                <g fill="#f5b800" opacity="0.85">
                  <ChevronUnit x={1.5} />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>
        </div>

        {!hideMachine ? (
          <div
            ref={machineRef}
            className="pointer-events-none absolute top-1/2 hidden -translate-y-1/2 text-komatsu-yellow md:block"
            style={
              reduced
                ? { left: "100%", transform: "translate(-100%, -50%)" }
                : { left: "0%" }
            }
          >
            <ExcavatorSilhouette />
          </div>
        ) : null}
      </div>
    </div>
  );
}
