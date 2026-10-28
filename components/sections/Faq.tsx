"use client";

import { useState } from "react";
import { site, unwrap } from "@/content/site";
import { Placeholder } from "@/components/ui/Placeholder";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#0f0f0f] py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <h2 className="font-display text-4xl uppercase md:text-6xl">FAQ</h2>
        <p className="mt-3 text-white/75">Nejčastější otázky před poptávkou.</p>

        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {site.faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-lg uppercase tracking-wide"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {item.q}
                    <span aria-hidden className="text-komatsu-yellow">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <div
                  className={`overflow-hidden pb-5 text-white/75 transition-[max-height] ${
                    isOpen ? "max-h-96" : "max-h-0 pb-0"
                  }`}
                >
                  {typeof item.a === "string" ? (
                    <p>{item.a}</p>
                  ) : (
                    <p>
                      <Placeholder value={item.a} />
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
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
