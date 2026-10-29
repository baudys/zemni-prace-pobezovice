"use client";

import { useId, useState } from "react";
import { site, unwrap } from "@/content/site";
import { Placeholder } from "@/components/ui/Placeholder";
import { Section, SectionHeader } from "@/components/ui/Section";

export function Faq() {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Section id="faq" tone="void" className="!border-t-0">
      <div className="mx-auto max-w-3xl">
        <SectionHeader title="FAQ">
          Nejčastější otázky před poptávkou.
        </SectionHeader>

        <div className="mt-12 divide-y divide-line border-y border-line">
          {site.faq.map((item, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-panel-${i}`;
            const buttonId = `${baseId}-btn-${i}`;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left font-display text-lg uppercase tracking-wide transition hover:text-komatsu-yellow"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {item.q}
                    <span aria-hidden className="font-mono text-komatsu-yellow">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className={`text-white/65 ${isOpen ? "pb-5" : "pb-0"}`}>
                      {typeof item.a === "string" ? (
                        <p>{item.a}</p>
                      ) : (
                        <p>
                          <Placeholder value={item.a} />
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: site.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: unwrap(item.a),
      },
    })),
  };
}
