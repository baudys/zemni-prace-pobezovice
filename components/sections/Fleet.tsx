"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site, unwrap, type SiteString } from "@/content/site";
import { Placeholder } from "@/components/ui/Placeholder";
import { AssetOrPlaceholder } from "@/components/ui/AssetOrPlaceholder";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { isPlaceholderPhotoPath, showPlaceholders } from "@/lib/placeholders";

gsap.registerPlugin(ScrollTrigger);

function formatSpecNumber(value: number, decimals?: number): string {
  const d = decimals ?? 0;
  return value.toLocaleString("cs-CZ", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

function SpecValue({
  value,
  unit,
  decimals,
  size = "lg",
}: {
  value: number | SiteString;
  unit: string;
  decimals?: number;
  size?: "lg" | "sm";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const display =
    size === "lg"
      ? "font-display text-2xl text-komatsu-yellow md:text-3xl"
      : "font-display text-lg text-komatsu-yellow";

  useEffect(() => {
    if (typeof value !== "number" || !ref.current) return;
    if (reduced) {
      ref.current.textContent = formatSpecNumber(value, decimals);
      return;
    }
    const obj = { n: 0 };
    const tween = gsap.to(obj, {
      n: value,
      duration: 1.4,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 90%",
        once: true,
      },
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = formatSpecNumber(obj.n, decimals);
        }
      },
    });
    return () => {
      tween.kill();
    };
  }, [value, decimals, reduced]);

  if (typeof value !== "number") {
    return (
      <span className={display}>
        <Placeholder value={value} /> {unit}
      </span>
    );
  }

  return (
    <span className={display}>
      <span ref={ref}>{reduced ? formatSpecNumber(value, decimals) : "0"}</span>
      {unit ? ` ${unit}` : ""}
    </span>
  );
}

export function Fleet() {
  const showEx = showPlaceholders();
  const bagr = site.fleet.find((f) => f.id === "bagr");
  const extras = site.fleet.filter((f) => f.id !== "bagr");

  if (!bagr) return null;

  return (
    <Section id="technika" tone="void">
      <SectionHeader title="Technika">
        Hlavní je minibagr Komatsu – doprava a kontejner jdou s ním.
      </SectionHeader>

      <article className="mt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-line">
            <AssetOrPlaceholder
              src={bagr.image}
              alt={bagr.imageAlt}
              fill
              sizes="(min-width: 1024px) 40vw, calc(100vw - 2rem)"
              className="object-cover"
              loading="lazy"
            />
            {showEx && isPlaceholderPhotoPath(bagr.image) ? (
              <span className="absolute right-3 top-3 border border-line bg-void/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-komatsu-yellow">
                ilustrační
              </span>
            ) : null}
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">
              Minibagr s obsluhou
            </p>
            <h3 className="mt-3 font-display text-4xl uppercase leading-[1.08] md:text-5xl">
              {bagr.title}
            </h3>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/65">
              {bagr.blurb}
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6">
              {bagr.specs.map((spec) => (
                <div key={spec.label}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
                    {spec.label}
                  </dt>
                  <dd className="mt-1">
                    {typeof spec.value === "string" ? (
                      <span className="font-display text-2xl text-komatsu-yellow md:text-3xl">
                        {spec.value}
                      </span>
                    ) : (
                      <SpecValue
                        value={spec.value}
                        unit={spec.unit}
                        decimals={"decimals" in spec ? spec.decimals : 0}
                      />
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </article>

      <div className="mt-16 border-t border-line pt-10">
        <ul className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {extras.map((item) => (
            <li key={item.id} className="flex items-start gap-5">
              <div className="relative aspect-[4/3] w-36 shrink-0 self-start overflow-hidden bg-void sm:w-44">
                <AssetOrPlaceholder
                  src={item.image}
                  alt={item.imageAlt}
                  width={1024}
                  height={768}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                {/* Inset ring — stejná 1px linka na retina, bez subpixel border+overflow. */}
                <span
                  className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
                  aria-hidden
                />
                {showEx && isPlaceholderPhotoPath(item.image) ? (
                  <span className="absolute right-1.5 top-1.5 border border-line bg-void/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-komatsu-yellow">
                    ilustr.
                  </span>
                ) : null}
              </div>
              <div className="min-w-0">
                <h4 className="font-display text-xl uppercase leading-tight">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {item.blurb}
                </p>
                <p className="mt-3 font-mono text-[11px] text-white/60">
                  {item.specs
                    .slice(0, 2)
                    .map((s) => {
                      const val =
                        typeof s.value === "number"
                          ? `${formatSpecNumber(s.value, "decimals" in s ? s.decimals : 0)}${s.unit ? `\u00a0${s.unit}` : ""}`
                          : unwrap(s.value);
                      return `${s.label.toLowerCase()} ${val}`.trim();
                    })
                    .join(" · ")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
