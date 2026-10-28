"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import { site, unwrap } from "@/content/site";
import { Placeholder } from "@/components/ui/Placeholder";
import { Button } from "@/components/ui/Button";
import {
  submitInquiry,
  type InquiryState,
} from "@/app/actions/inquiry";

const initial: InquiryState = { ok: false, message: "" };

export function Contact() {
  const [state, action, pending] = useActionState(submitInquiry, initial);
  const [startedAt] = useState(() => String(Date.now()));
  const phoneHref = unwrap(site.phoneHref);

  useEffect(() => {
    if (state.ok) track("inquiry_submit", { ok: "true" });
  }, [state.ok]);

  const claimPoints = useMemo(() => site.claim.points, []);

  return (
    <section id="kontakt" className="bg-[#0c0c0c] py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:px-6">
        <div>
          <h2 className="font-display text-4xl uppercase md:text-6xl">Kontakt</h2>
          <p className="mt-4 font-display text-xl text-komatsu-yellow md:text-2xl">
            {site.claim.title}
          </p>
          <ul className="mt-4 space-y-2 text-white/80">
            {claimPoints.map((p) => (
              <li key={p}>• {p}</li>
            ))}
          </ul>
          <dl className="mt-8 space-y-3 text-white/85">
            <div>
              <dt className="text-xs uppercase tracking-wide text-white/50">Telefon</dt>
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
              <dt className="text-xs uppercase tracking-wide text-white/50">E-mail</dt>
              <dd>
                <a href={`mailto:${unwrap(site.email)}`} className="hover:text-brand-red">
                  <Placeholder value={site.email} />
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-white/50">Adresa</dt>
              <dd>
                <Placeholder value={site.address} />
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-white/50">Provozní doba</dt>
              <dd>
                <Placeholder value={site.openingHours} />
              </dd>
            </div>
          </dl>
          <Button href={phoneHref} className="mt-8" onClick={() => track("phone_click", { source: "contact_cta" })}>
            Zavolat
          </Button>
        </div>

        <form action={action} className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6">
          <input type="hidden" name="startedAt" value={startedAt} />
          {/* honeypot */}
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

          <label className="block text-sm">
            Co potřebujete
            <select
              name="type"
              required
              className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2"
              defaultValue="vykop"
            >
              {site.inquiryTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            Místo (obec)
            <input
              name="place"
              required
              className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            Termín (orientačně)
            <input
              name="term"
              className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              Jméno
              <input
                name="name"
                required
                className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              Telefon*
              <input
                name="phone"
                required
                type="tel"
                className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2"
              />
            </label>
          </div>

          <label className="block text-sm">
            E-mail
            <input
              name="email"
              type="email"
              className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            Poznámka
            <textarea
              name="note"
              rows={4}
              className="mt-1 w-full rounded border border-white/20 bg-black/40 px-3 py-2"
            />
          </label>

          <label className="block text-sm text-white/50">
            Foto z místa (brzy)
            <input type="file" disabled className="mt-1 block w-full text-sm" />
          </label>

          <label className="flex items-start gap-2 text-sm text-white/80">
            <input type="checkbox" name="consent" required className="mt-1" />
            <span>
              Souhlasím se{" "}
              <a
                href="/zasady-ochrany-osobnich-udaju"
                className="underline underline-offset-2"
              >
                zpracováním osobních údajů
              </a>
              .
            </span>
          </label>

          <Button type="submit" disabled={pending} className="w-full">
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
                  <a
                    href={state.mailto}
                    className="underline underline-offset-2"
                  >
                    Otevřít e-mail (mailto)
                  </a>
                ) : null}
                <a href={phoneHref} className="underline underline-offset-2">
                  Raději zavolat
                </a>
              </div>
            ) : null}
            {state.fieldErrors ? (
              <ul className="mt-2 list-disc pl-5 text-brand-red">
                {Object.entries(state.fieldErrors).map(([k, errs]) =>
                  errs?.map((e) => (
                    <li key={`${k}-${e}`}>
                      {k}: {e}
                    </li>
                  )),
                )}
              </ul>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}
