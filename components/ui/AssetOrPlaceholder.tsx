"use client";

import { useState, type CSSProperties } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  asBackground?: boolean;
};

export function AssetOrPlaceholder({
  src,
  alt,
  className = "",
  style,
  asBackground,
}: Props) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-soil via-[#3a2818] to-ink p-4 text-center text-sm text-sand ${className}`}
        style={style}
        role="img"
        aria-label={`PODKLAD CHYBÍ: ${src}`}
      >
        PODKLAD CHYBÍ: {src}
      </div>
    );
  }

  if (asBackground) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        aria-hidden
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${className}`}
        style={style}
        onError={() => setMissing(true)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setMissing(true)}
    />
  );
}
