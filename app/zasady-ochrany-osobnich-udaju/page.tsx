import type { Metadata } from "next";
import Link from "next/link";
import { site, unwrap } from "@/content/site";
import { Placeholder } from "@/components/ui/Placeholder";

export const metadata: Metadata = {
  title: "Zásady zpracování osobních údajů",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-white/85">
      <Link href="/" className="text-sm text-komatsu-yellow underline">
        ← Zpět na úvod
      </Link>
      <h1 className="mt-6 font-display text-4xl uppercase text-white">
        Zásady zpracování osobních údajů
      </h1>
      <p className="mt-6">
        Správce: <Placeholder value={site.operator} />, IČO:{" "}
        <Placeholder value={site.ico} />, kontaktní e-mail:{" "}
        <Placeholder value={site.email} />.
      </p>
      <p className="mt-4">
        Osobní údaje z poptávkového formuláře (jméno, telefon, e-mail, obsah
        poptávky) zpracováváme za účelem vyřízení poptávky a související
        komunikace. Právním základem je plnění smlouvy / jednání o smlouvě a
        oprávněný zájem.
      </p>
      <p className="mt-4">
        Údaje neposkytujeme třetím stranám mimo nezbytné zpracovatele (např.
        e-mailová služba). Uchováváme je po dobu vyřízení poptávky a případné
        zákonné archivační lhůty.
      </p>
      <p className="mt-4">
        Máte právo na přístup, opravu, výmaz, omezení zpracování a stížnost u
        ÚOOÚ. Před spuštěním webu text doplní správce podle skutečného provozu a
        GDPR checklistu.
      </p>
      <p className="mt-8 text-sm text-white/50">
        {unwrap(site.name)} · {unwrap(site.domain)}
      </p>
    </main>
  );
}
