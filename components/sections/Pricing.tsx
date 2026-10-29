"use client";

import { useId } from "react";
import { track } from "@vercel/analytics";
import { formatCzk, site } from "@/content/site";
import { landmarkForKm } from "@/content/map-towns";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { YellowRange } from "@/components/ui/YellowRange";
import {
  type ContainerMode,
  quoteRates,
  useQuote,
} from "@/components/quote/QuoteContext";

const KM_MAX = 60;

const CONTAINER_OPTIONS: ReadonlyArray<{
  value: ContainerMode;
  label: string;
}> = [
  { value: "none", label: "Bez kontejneru" },
  { value: "plato", label: "Plošinový" },
  { value: "sutovy", label: "Suťový" },
];

export function Pricing() {
  const hoursId = useId();
  const kmId = useId();
  const { draft, setDraft, estimate, applyToContact } = useQuote();
  const townHint = landmarkForKm(estimate.kmOneWay);

  function continueToContact() {
    applyToContact();
    track("quote_to_contact", { source: "pricing" });
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <Section id="cenik" tone="deep" className="!border-t-0">
      <SectionHeader title="Ceník">{site.pricingDisclaimer}</SectionHeader>

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <fieldset className="space-y-8 border-0 p-0">
          <legend className="sr-only">Parametry zakázky</legend>

          <div className="border-b border-line pb-8">
            <label
              htmlFor={hoursId}
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45"
            >
              Hodiny práce
            </label>
            <YellowRange
              id={hoursId}
              min={quoteRates.minHours}
              max={24}
              step={1}
              value={draft.hours}
              onChange={(hours) => setDraft({ hours })}
              thumbLabel={`${estimate.hours} h`}
              aria-valuetext={`${estimate.hours} hodin`}
            />
            <p className="mt-2 font-mono text-[11px] text-white/60">
              Minimum {quoteRates.minHours} h · {formatCzk(quoteRates.hourly)}/h
              bez DPH
            </p>
          </div>

          <div className="border-b border-line pb-8">
            <label
              htmlFor={kmId}
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45"
            >
              Vzdálenost (km jedním směrem)
            </label>
            <YellowRange
              id={kmId}
              min={0}
              max={KM_MAX}
              step={1}
              value={Math.min(KM_MAX, draft.kmOneWay)}
              onChange={(kmOneWay) => setDraft({ kmOneWay })}
              thumbLabel={`${estimate.kmOneWay} km`}
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
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
              Kontejner 4,5&nbsp;m (~5&nbsp;m³)
            </p>
            <div
              role="radiogroup"
              aria-label="Typ kontejneru"
              className="mt-4 flex flex-wrap gap-2"
            >
              {CONTAINER_OPTIONS.map((opt) => {
                const selected = draft.containerMode === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setDraft({ containerMode: opt.value })}
                    className={`cursor-pointer border px-4 py-2 font-display text-xs uppercase tracking-wide transition ${
                      selected
                        ? "border-komatsu-yellow bg-komatsu-yellow text-void"
                        : "border-line text-white/70 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-white/50">
              od {formatCzk(quoteRates.containerFrom)} · přistavení k zakázce.
              Odvoz a likvidace dle množství (není v odhadu).
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
                <p className="shrink-0 font-display text-lg text-white">
                  <CountUp value={line.amount} />
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
              Celkem bez DPH
            </p>
            <p className="mt-2 font-display text-4xl uppercase tracking-tight text-white md:text-5xl">
              <CountUp value={estimate.totalEx} />
            </p>
            <p className="mt-2 text-sm text-white/55">
              <CountUp value={estimate.totalInc} /> s DPH (
              {Math.round(site.vatRate * 100)} %)
            </p>
          </div>

          <Button type="button" className="mt-8 w-full" onClick={continueToContact}>
            Pokračovat k poptávce
          </Button>
          <p className="mt-4 text-xs leading-relaxed text-white/60">
            Odhad není závazná nabídka. Finální cenu potvrdíme předem v odpovědi
            na poptávku.
          </p>
        </aside>
      </div>
    </Section>
  );
}
