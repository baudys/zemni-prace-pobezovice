"use client";

import { useId } from "react";
import { track } from "@vercel/analytics";
import { formatCzk, site } from "@/content/site";
import { landmarkForKm } from "@/content/map-towns";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { quoteRates, useQuote } from "@/components/quote/QuoteContext";
import { showPlaceholders } from "@/lib/placeholders";

const KM_MAX = 60;

export function Pricing() {
  const hoursId = useId();
  const kmId = useId();
  const containerId = useId();
  const { draft, setDraft, estimate, applyToContact } = useQuote();
  const townHint = landmarkForKm(estimate.kmOneWay);
  const ratesAreExample =
    showPlaceholders() && site.pricing.some((p) => "example" in p && p.example);

  function continueToContact() {
    applyToContact();
    track("quote_to_contact", { source: "pricing" });
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <Section id="cenik" tone="deep">
      <SectionHeader title="Ceník">{site.pricingDisclaimer}</SectionHeader>
      {ratesAreExample ? (
        <p
          className="placeholder-mark mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-komatsu-yellow"
          title="UKÁZKOVÁ DATA – nahradit před spuštěním"
          data-example="true"
        >
          UKÁZKOVÁ DATA – sazby ověřit u provozovatele
        </p>
      ) : null}

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <fieldset className="space-y-8 border-0 p-0">
          <legend className="sr-only">Parametry zakázky</legend>

          <div className="border-b border-line pb-8">
            <div className="flex items-baseline justify-between gap-4">
              <label
                htmlFor={hoursId}
                className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45"
              >
                Hodiny práce
              </label>
              <span className="font-display text-2xl text-komatsu-yellow tabular-nums">
                {estimate.hours} h
              </span>
            </div>
            <input
              id={hoursId}
              type="range"
              min={quoteRates.minHours}
              max={24}
              step={1}
              value={draft.hours}
              onChange={(e) => setDraft({ hours: Number(e.target.value) })}
              className="mt-4 w-full accent-brand-red"
              aria-valuetext={`${estimate.hours} hodin`}
            />
            <p className="mt-2 font-mono text-[11px] text-white/60">
              Minimum {quoteRates.minHours} h · {formatCzk(quoteRates.hourly)}/h
              bez DPH
            </p>
          </div>

          <div className="border-b border-line pb-8">
            <div className="flex items-baseline justify-between gap-4">
              <label
                htmlFor={kmId}
                className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45"
              >
                Vzdálenost (km jedním směrem)
              </label>
              <span className="font-display text-2xl text-komatsu-yellow tabular-nums">
                {estimate.kmOneWay} km
              </span>
            </div>
            <input
              id={kmId}
              type="range"
              min={0}
              max={KM_MAX}
              step={1}
              value={Math.min(KM_MAX, draft.kmOneWay)}
              onChange={(e) => setDraft({ kmOneWay: Number(e.target.value) })}
              className="mt-4 w-full accent-brand-red"
              aria-valuetext={
                townHint
                  ? `${estimate.kmOneWay} kilometrů, např. ${townHint}`
                  : `${estimate.kmOneWay} kilometrů`
              }
            />
            <p className="mt-2 font-mono text-[11px] text-white/60">
              Počítáme tam i zpět · {formatCzk(quoteRates.kmRate)}/km
              {townHint ? (
                <>
                  {" "}
                  ·{" "}
                  <span className="text-komatsu-yellow">např. {townHint}</span>
                </>
              ) : null}
            </p>
          </div>

          <div>
            <label
              htmlFor={containerId}
              className="flex cursor-pointer items-start justify-between gap-6 border border-line px-4 py-4 transition hover:border-white/25"
            >
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
                  Příslušenství
                </span>
                <span className="mt-2 block font-display text-lg uppercase">
                  Kontejner 4,5&nbsp;m (~5&nbsp;m³)
                </span>
                <span className="mt-1 block text-sm text-white/55">
                  od {formatCzk(quoteRates.containerFrom)} · plato / suťový
                </span>
              </span>
              <input
                id={containerId}
                type="checkbox"
                checked={draft.container}
                onChange={(e) => setDraft({ container: e.target.checked })}
                className="mt-1 size-5 accent-brand-red"
              />
            </label>
            <p className="mt-4 text-sm text-white/50">
              Přistavení plato / suťového kontejneru k zakázce. Odvoz a likvidace
              dle množství (není v odhadu).
            </p>
          </div>
        </fieldset>

        <aside
          className="border border-line bg-void/60 p-6 md:p-8"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
            Orientační součet
          </p>

          <ul className="mt-6 space-y-4">
            {estimate.lines.map((line) => (
              <li
                key={line.id}
                className="flex items-start justify-between gap-4 border-b border-line/70 pb-4"
              >
                <div>
                  <p className="text-sm text-white/85">{line.label}</p>
                  {line.detail ? (
                    <p className="mt-1 font-mono text-[11px] text-white/60">
                      {line.detail}
                    </p>
                  ) : null}
                </div>
                <p className="shrink-0 font-display text-lg tabular-nums text-white">
                  {formatCzk(line.amount)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
              Celkem bez DPH
            </p>
            <p className="mt-2 font-display text-4xl uppercase tracking-tight text-white md:text-5xl">
              {formatCzk(estimate.totalEx)}
            </p>
            <p className="mt-2 text-sm text-white/55">
              {formatCzk(estimate.totalInc)} s DPH (
              {Math.round(site.vatRate * 100)} %)
            </p>
          </div>

          <Button type="button" className="mt-8 w-full" onClick={continueToContact}>
            Pokračovat k poptávce
          </Button>
          <p className="mt-4 text-xs leading-relaxed text-white/40">
            Odhad není závazná nabídka. Finální cenu potvrdíme předem v odpovědi
            na poptávku.
          </p>
        </aside>
      </div>
    </Section>
  );
}
