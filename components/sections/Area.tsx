"use client";

import dynamic from "next/dynamic";
import { site } from "@/content/site";
import { Section, SectionHeader } from "@/components/ui/Section";

const AreaMap = dynamic(
  () => import("@/components/sections/AreaMap").then((m) => m.AreaMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[min(72vw,420px)] w-full animate-pulse border border-line bg-deep md:h-[480px]"
        aria-hidden
      />
    ),
  },
);

export function Area() {
  return (
    <Section id="oblast" tone="panel">
      <SectionHeader title="Oblast působnosti">
        {site.areaLabel}
      </SectionHeader>

      <div className="relative mt-14 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <AreaMap />

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-komatsu-yellow">
            Obce a města v dosahu
          </p>
          <p className="mt-5 text-base leading-relaxed text-white/70">
            {site.towns.all.map((town, i) => {
              const bold = (site.towns.bold as readonly string[]).includes(town);
              return (
                <span key={town}>
                  {bold ? <strong className="font-medium text-white">{town}</strong> : town}
                  {i < site.towns.all.length - 1 ? ", " : ""}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </Section>
  );
}
