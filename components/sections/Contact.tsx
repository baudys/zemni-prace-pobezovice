"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import { formatCzk, site, unwrap } from "@/content/site";
import { Placeholder } from "@/components/ui/Placeholder";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useQuote } from "@/components/quote/QuoteContext";
import {
  submitInquiry,
  type InquiryState,
} from "@/app/actions/inquiry";

const fieldClass =
  "mt-2 w-full border border-line bg-transparent px-3 py-3 text-white outline-none transition focus:border-komatsu-yellow [color-scheme:dark]";

const initial: InquiryState = { ok: false, message: "" };

const fieldLabels: Record<string, string> = {
  place: "Místo",
  name: "Jméno",
  phone: "Telefon",
  email: "E-mail",
  type: "Typ poptávky",
  consent: "Souhlas",
};

async function safeSubmitInquiry(
  prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  try {
    return await submitInquiry(prev, formData);
  } catch {
    return {
      ok: false,
      message:
        "Odeslání se nepodařilo. Zkuste to znovu, použijte mailto níže nebo nám zavolejte.",
    };
  }
}

export function Contact() {
  const [state, action, pending] = useActionState(safeSubmitInquiry, initial);
  const [startedAt] = useState(() => String(Date.now()));
  const [note, setNote] = useState("");
  const { applied, clearApplied } = useQuote();
  const phoneHref = unwrap(site.phoneHref);
  const mailtoFallback = `mailto:${unwrap(site.email)}`;

  useEffect(() => {
    if (state.ok) track("inquiry_submit", { ok: "true" });
  }, [state.ok]);

  useEffect(() => {
    if (!applied) return;
    setNote((prev) => {
      const withoutOldQuote = prev
        .replace(/\n?\n?Odhad z konfigurátoru[\s\S]*$/m, "")
        .trim();
      return withoutOldQuote
        ? `${withoutOldQuote}\n\n${applied.noteText}`
        : applied.noteText;
    });
  }, [applied]);

  const claimPoints = useMemo(() => site.claim.points, []);

  return (
    <Section id="kontakt" tone="panel" className="!border-t-0">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeader title="Kontakt" />
          <ul className="mt-6 space-y-2 text-white/65">
            {claimPoints.map((p) => (
              <li key={p} className="flex gap-3">
                <span className="mt-2 h-px w-4 shrink-0 bg-komatsu-yellow/70" aria-hidden />
                <span>{p}</span>
              </li>
            ))}
          </ul>

          {applied ? (
            <div className="mt-10 border border-line bg-void/50 p-5">
              <div className="flex items-start justify-between gap-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
                  Váš odhad z ceníku
                </p>
                <button
                  type="button"
                  onClick={clearApplied}
                  className="cursor-pointer font-mono text-[11px] uppercase tracking-wide text-white/40 hover:text-white"
                >
                  Odebrat
                </button>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                {applied.lines.map((l) => (
                  <li key={l.id} className="flex justify-between gap-3">
                    <span>{l.label}</span>
                    <span className="tabular-nums text-white">{formatCzk(l.amount)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-display text-2xl text-komatsu-yellow">
                {formatCzk(applied.totalEx)}{" "}
                <span className="text-sm font-sans font-normal text-white/50">
                  bez DPH
                </span>
              </p>
            </div>
          ) : null}

          <dl className="mt-10 space-y-5 text-white/85">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">
                Telefon
              </dt>
              <dd>
                <a
                  href={phoneHref}
                  className="text-xl text-white hover:text-brand-red"
                  onClick={() => track("phone_click", { source: "contact" })}
                >
                  <Placeholder value={site.phone} />
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">
                E-mail
              </dt>
              <dd>
                <a href={`mailto:${unwrap(site.email)}`} className="hover:text-brand-red">
                  <Placeholder value={site.email} />
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">
                Adresa
              </dt>
              <dd>
                <Placeholder value={site.address} />
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">
                Provozní doba
              </dt>
              <dd>
                <Placeholder value={site.openingHours} />
              </dd>
            </div>
          </dl>
          <Button
            href={phoneHref}
            className="mt-8"
            onClick={() => track("phone_click", { source: "contact_cta" })}
          >
            Zavolat
          </Button>
        </div>

        <form action={action} className="space-y-5 border border-line p-6 md:p-8">
          <input type="hidden" name="startedAt" value={startedAt} />
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
            className="hidden"
            aria-hidden="true"
          />

          <h3 className="font-display text-2xl uppercase">Poptávka</h3>

          <label className="block text-sm text-white/70">
            Co potřebujete
            <select
              name="type"
              required
              className={fieldClass}
              defaultValue="vykop"
              key={applied ? `type-${applied.totalEx}` : "type-default"}
            >
              {site.inquiryTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-white/70">
            Místo (obec)*
            <input
              name="place"
              required
              autoComplete="address-level2"
              className={fieldClass}
            />
          </label>

          <label className="block text-sm text-white/70">
            Termín (orientačně)
            <input name="term" type="date" className={fieldClass} />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm text-white/70">
              Jméno*
              <input name="name" required autoComplete="name" className={fieldClass} />
            </label>
            <label className="block text-sm text-white/70">
              Telefon*
              <input
                name="phone"
                required
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                pattern="[\d\s+()-]{9,}"
                title="Zadejte platné telefonní číslo (min. 9 číslic)"
                className={fieldClass}
              />
            </label>
          </div>

          <label className="block text-sm text-white/70">
            E-mail
            <input name="email" type="email" autoComplete="email" className={fieldClass} />
          </label>

          <label className="block text-sm text-white/70">
            Poznámka
            <textarea
              name="note"
              rows={applied ? 7 : 4}
              className={fieldClass}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>

          <label className="flex cursor-pointer items-start gap-2 text-sm text-white/70">
            <input type="checkbox" name="consent" required className="mt-1 accent-brand-red" />
            <span>
              Souhlasím se{" "}
              <a
                href="/zasady-ochrany-osobnich-udaju"
                className="underline underline-offset-4"
              >
                zpracováním osobních údajů
              </a>
              *
            </span>
          </label>

          <Button type="submit" variant="primary" disabled={pending} className="w-full">
            {pending ? "Odesílám…" : "Odeslat poptávku"}
          </Button>

          <div aria-live="polite" className="min-h-6 text-sm">
            {state.message ? (
              <p className={state.ok ? "text-komatsu-yellow" : "text-brand-red"}>
                {state.message.replace(
                  "1 pracovního dne",
                  unwrap(site.responseSla),
                )}
              </p>
            ) : null}
            {state.ok ? (
              <div className="mt-3 flex flex-wrap gap-3">
                {state.mailto ? (
                  <a href={state.mailto} className="underline underline-offset-4">
                    Otevřít e-mail (mailto)
                  </a>
                ) : null}
                <a href={phoneHref} className="underline underline-offset-4">
                  Raději zavolat
                </a>
              </div>
            ) : null}
            {!state.ok && state.message.includes("nepodařilo") ? (
              <div className="mt-3 flex flex-wrap gap-3">
                <a href={mailtoFallback} className="underline underline-offset-4">
                  Napsat e-mailem
                </a>
                <a href={phoneHref} className="underline underline-offset-4">
                  Raději zavolat
                </a>
              </div>
            ) : null}
            {state.fieldErrors ? (
              <ul className="mt-2 list-disc pl-5 text-brand-red">
                {Object.entries(state.fieldErrors).map(([k, errs]) =>
                  errs?.map((e) => (
                    <li key={`${k}-${e}`}>
                      {fieldLabels[k] ?? k}: {e}
                    </li>
                  )),
                )}
              </ul>
            ) : null}
          </div>
        </form>
      </div>
    </Section>
  );
}
