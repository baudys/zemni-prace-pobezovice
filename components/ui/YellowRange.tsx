"use client";

import { useId } from "react";

type Props = {
  id?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  /** Formatted label shown above the thumb. */
  thumbLabel: string;
  "aria-valuetext"?: string;
  "aria-label"?: string;
};

export function YellowRange({
  id: idProp,
  min,
  max,
  step = 1,
  value,
  onChange,
  thumbLabel,
  "aria-valuetext": ariaValueText,
  "aria-label": ariaLabel,
}: Props) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const span = Math.max(1, max - min);
  const pct = ((value - min) / span) * 100;

  return (
    <div className="relative mt-8 pt-7">
      <div
        className="pointer-events-none absolute top-0 -translate-x-1/2 font-display text-sm text-komatsu-yellow tabular-nums"
        style={{ left: `${pct}%` }}
        aria-hidden
      >
        {thumbLabel}
      </div>
      <div className="relative h-2 w-full">
        <div className="absolute inset-0 rounded-full bg-white/10" />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-komatsu-yellow"
          style={{ width: `${pct}%` }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-valuetext={ariaValueText}
          aria-label={ariaLabel}
          className="yellow-range absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent"
        />
      </div>
    </div>
  );
}
