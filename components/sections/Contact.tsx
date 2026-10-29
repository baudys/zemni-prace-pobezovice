"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { track } from "@vercel/analytics";
import { formatCzk, site, unwrap } from "@/content/site";
import { Placeholder } from "@/components/ui/Placeholder";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { SuccessCheck } from "@/components/ui/SuccessCheck";
import { useQuote } from "@/components/quote/QuoteContext";
import {
  submitInquiry,
  type InquiryState,
  type InquiryValues,
} from "@/app/actions/inquiry";

const fieldBase =
  "mt-2 w-full border border-line border-b-transparent bg-transparent px-3 py-3 text-base leading-normal text-white outline-none transition [color-scheme:dark]";

/** Jednořádková pole — stejná výška u input i select (Safari/Chrome jinak select zploští). */
const controlClass = `${fieldBase} h-12`;
const selectClass = `${controlClass} appearance-none`;
const areaClass = fieldBase;

/** HTML pattern (flag `v`) — závorky a pomlčka escapované; min. 9 znaků. */
const PHONE_PATTERN = "[0-9 +\\(\\)\\-]{9,}";

function phoneDigitCount(value: string): number {
  return value.replace(/\D/g, "").length;
}

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
      values: {
        type: String(formData.get("type") ?? "vykop"),
        place: String(formData.get("place") ?? ""),
        term: String(formData.get("term") ?? ""),
        name: String(formData.get("name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        email: String(formData.get("email") ?? ""),
        note: String(formData.get("note") ?? ""),
        consent: formData.get("consent") === "on",
      },
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
  const values: InquiryValues | undefined = state.values;
  const showSuccess = state.ok;

  useEffect(() => {
    if (!state.ok) return;
    track("inquiry_submit", { ok: "true" });
    queueMicrotask(() => setNote(""));
  }, [state.ok]);

  useEffect(() => {
    if (!applied) return;
    queueMicrotask(() => {
      setNote((prev) => {
        const withoutOldQuote = prev
          .replace(/\n?\n?Odhad z konfigurátoru[\s\S]*$/m, "")
          .trim();
        return withoutOldQuote
          ? `${withoutOldQuote}\n\n${applied.noteText}`
          : applied.noteText;
      });
    });
  }, [applied]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const phoneInput = form.elements.namedItem("phone");
    if (phoneInput instanceof HTMLInputElement) {
      const digits = phoneDigitCount(phoneInput.value);
      if (digits < 9) {
        phoneInput.setCustomValidity(
          "Zadejte platné telefonní číslo (min. 9 číslic)",
        );
      } else {
        phoneInput.setCustomValidity("");
      }
    }
    if (!form.reportValidity()) return;
    const formData = new FormData(form);
    startTransition(() => {
      action(formData);
    });
  }

  return (
    <Section id="kontakt" tone="panel" className="!border-t-0">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeader title="Kontakt" />

          {applied ? (
            <div className="mt-10 border border-line bg-void/50 p-5">
              <div className="flex items-start justify-between gap-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
                  Váš odhad z ceníku
                </p>
                <button
                  type="button"
                  onClick={clearApplied}
                  className="cursor-pointer font-mono text-[11px] uppercase tracking-wide text-white/60 hover:text-white"
                >
                  Odebrat
                </button>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                {applied.lines.map((l) => (
                  <li key={l.id} className="flex justify-between gap-3">
                    <span>{l.label}</span>
                    <span className="tabular-nums text-white">
                      {formatCzk(l.amount)}
                    </span>
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
              <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">
                Telefon
              </dt>
              <dd>
                <a
                  href={phoneHref}
                  className="text-white hover:text-brand-red"
                  onClick={() => track("phone_click", { source: "contact" })}
                >
                  <Placeholder value={site.phone} />
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">
                E-mail
              </dt>
              <dd>
                <a
                  href={`mailto:${unwrap(site.email)}`}
                  className="hover:text-brand-red"
                >
                  <Placeholder value={site.email} />
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">
                Adresa
              </dt>
              <dd>
                <Placeholder value={site.address} />
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">
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

        {showSuccess ? (
          <div
            className="flex flex-col items-start justify-center gap-5 border border-line p-6 md:p-8"
            role="status"
            aria-live="polite"
          >
            <SuccessCheck className="text-komatsu-yellow" />
            <p className="font-display text-2xl uppercase text-white md:text-3xl">
              Díky, ozveme se do 24&nbsp;h
            </p>
            {state.message ? (
              <p className="text-sm text-white/60">
                {state.message.replace(
                  "1 pracovního dne",
                  unwrap(site.responseSla),
                )}
              </p>
            ) : null}
            <div className="mt-2 flex flex-wrap gap-3 text-sm">
              {state.mailto ? (
                <a href={state.mailto} className="underline underline-offset-4">
                  Otevřít e-mail (mailto)
                </a>
              ) : null}
              <a href={phoneHref} className="underline underline-offset-4">
                Raději zavolat
              </a>
            </div>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="space-y-5 border border-line p-6 md:p-8"
            noValidate={false}
          >
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
              <span className="field-focus-line relative mt-2 block">
                <select
                  name="type"
                  required
                  className={`${selectClass} mt-0 pr-10`}
                  defaultValue={values?.type ?? "vykop"}
                >
                  {site.inquiryTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <span
                  className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/55"
                  aria-hidden="true"
                >
                  ▾
                </span>
              </span>
            </label>

            <label className="block text-sm text-white/70">
              Místo (obec)*
              <span className="field-focus-line relative block">
                <input
                  name="place"
                  required
                  autoComplete="address-level2"
                  className={controlClass}
                  defaultValue={values?.place ?? ""}
                />
              </span>
            </label>

            <label className="block text-sm text-white/70">
              Termín (orientačně)
              <span className="field-focus-line relative block">
                <input
                  name="term"
                  type="date"
                  className={controlClass}
                  defaultValue={values?.term ?? ""}
                />
              </span>
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm text-white/70">
                Jméno*
                <span className="field-focus-line relative block">
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    className={controlClass}
                    defaultValue={values?.name ?? ""}
                  />
                </span>
              </label>
              <label className="block text-sm text-white/70">
                Telefon*
                <span className="field-focus-line relative block">
                  <input
                    name="phone"
                    required
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    pattern={PHONE_PATTERN}
                    title="Zadejte platné telefonní číslo (min. 9 číslic)"
                    className={controlClass}
                    defaultValue={values?.phone ?? ""}
                    onInput={(ev) => {
                      ev.currentTarget.setCustomValidity("");
                    }}
                  />
                </span>
              </label>
            </div>

            <label className="block text-sm text-white/70">
              E-mail
              <span className="field-focus-line relative block">
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={controlClass}
                  defaultValue={values?.email ?? ""}
                />
              </span>
            </label>

            <label className="block text-sm text-white/70">
              Poznámka
              <span className="field-focus-line relative block">
                <textarea
                  name="note"
                  rows={applied ? 7 : 4}
                  className={areaClass}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                name="consent"
                required
                className="mt-1 accent-brand-red"
                defaultChecked={values?.consent ?? false}
              />
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

            <Button
              type="submit"
              variant="primary"
              disabled={pending}
              className="w-full"
            >
              {pending ? "Odesílám…" : "Odeslat poptávku"}
            </Button>

            <div aria-live="polite" className="min-h-6 text-sm">
              {state.message && !state.ok ? (
                <p className="text-brand-red">{state.message}</p>
              ) : null}
              {!state.ok && state.message.includes("nepodařilo") ? (
                <div className="mt-3 flex flex-wrap gap-3">
                  <a
                    href={mailtoFallback}
                    className="underline underline-offset-4"
                  >
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
        )}
      </div>
    </Section>
  );
}
