"use client";

import { useState, type CSSProperties, type ImgHTMLAttributes } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  asBackground?: boolean;
  width?: number;
  height?: number;
  loading?: ImgHTMLAttributes<HTMLImageElement>["loading"];
};

export function AssetOrPlaceholder({
  src,
  alt,
  className = "",
  style,
  asBackground,
  width,
  height,
  loading = "lazy",
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
        width={width}
        height={height}
        loading={loading}
        decoding="async"
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
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      className={className}
      style={style}
      onError={() => setMissing(true)}
    />
  );
}
