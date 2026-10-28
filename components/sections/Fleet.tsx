"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site, type SiteString } from "@/content/site";
import { Card } from "@/components/ui/Card";
import { Placeholder } from "@/components/ui/Placeholder";
import { AssetOrPlaceholder } from "@/components/ui/AssetOrPlaceholder";
import { TextureBackground } from "@/components/motion/TextureBackground";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

function SpecValue({
  value,
  unit,
  decimals,
}: {
  value: number | SiteString;
  unit: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (typeof value !== "number" || !ref.current) return;
    if (reduced) {
      ref.current.textContent = value.toFixed(decimals ?? 0);
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
          ref.current.textContent = obj.n.toFixed(decimals ?? 0);
        }
      },
    });
    return () => {
      tween.kill();
    };
  }, [value, decimals, reduced]);

  if (typeof value !== "number") {
    return (
      <span className="font-display text-2xl text-komatsu-yellow">
        <Placeholder value={value} /> {unit}
      </span>
    );
  }

  return (
    <span className="font-display text-2xl text-komatsu-yellow">
      <span ref={ref}>{reduced ? value.toFixed(decimals ?? 0) : "0"}</span>
      {unit ? ` ${unit}` : ""}
    </span>
  );
}

export function Fleet() {
  return (
    <TextureBackground
      id="technika"
      desktop="/textures/gravel.webp"
      mobile="/textures/gravel-mobile.webp"
      className="py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="font-display text-4xl uppercase md:text-6xl">Technika</h2>
        <p className="mt-3 max-w-2xl text-white/80">
          Minibagr, vlastní doprava a kontejnery – připraveno na zakázku.
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {site.fleet.map((item) => (
            <Card key={item.id} className="overflow-hidden !p-0">
              <AssetOrPlaceholder
                src={item.image}
                alt={item.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="font-display text-2xl uppercase">{item.title}</h3>
                <p className="mt-2 text-sm text-white/70">
                  {typeof item.blurb === "string" ? (
                    item.blurb
                  ) : (
                    <Placeholder value={item.blurb} />
                  )}
                </p>
                <dl className="mt-5 space-y-3 border-t border-white/10 pt-4">
                  {item.specs.map((spec) => (
                    <div key={spec.label} className="flex items-end justify-between gap-3">
                      <dt className="text-xs uppercase tracking-wide text-white/55">
                        {spec.label}
                        {"note" in spec && spec.note ? (
                          <span className="ml-1 text-komatsu-yellow">
                            (<Placeholder value={spec.note} />
                          </span>
                        ) : null}
                      </dt>
                      <dd className="text-right">
                        {typeof spec.value === "string" ? (
                          <span className="font-display text-lg text-komatsu-yellow">
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
                {"imageNote" in item ? (
                  <p className="mt-3 text-xs text-white/40">{item.imageNote}</p>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </TextureBackground>
  );
}
