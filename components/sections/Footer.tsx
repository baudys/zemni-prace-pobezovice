import Image from "next/image";
import Link from "next/link";
import { site, unwrap } from "@/content/site";
import { Placeholder } from "@/components/ui/Placeholder";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t-2 border-komatsu-yellow bg-void pt-20 pb-16 md:mt-14 md:pt-24 md:pb-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-12 md:gap-10 md:px-8">
        <div className="md:col-span-4">
          <Image
            src="/brand/gts-logo-transparent.svg"
            alt="G.T.S. Poběžovice"
            width={120}
            height={52}
            className="h-12 w-auto"
          />
          <p className="mt-5 text-sm leading-relaxed text-white/55">
            Provozuje <Placeholder value={site.operator} />
          </p>
          <p className="mt-2 font-mono text-[11px] text-white/60">
            IČO: <Placeholder value={site.ico} /> · DIČ:{" "}
            <Placeholder value={site.dic} />
          </p>
          <p className="mt-4 text-sm text-white/45">
            <a
              href={site.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition hover:text-white"
            >
              gts-pobezovice.cz
            </a>
          </p>
        </div>

        <div className="md:col-span-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
            Kontakt
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <Placeholder value={site.contactPerson} />
            </li>
            <li>
              <a
                href={unwrap(site.phoneHref)}
                className="transition hover:text-white"
              >
                <Placeholder value={site.phone} />
              </a>
            </li>
            <li>
              <a
                href={site.emailHref}
                className="transition hover:text-white"
              >
                <Placeholder value={site.email} />
              </a>
            </li>
            <li className="pt-2 text-white/55">
              <Placeholder value={site.address} />
            </li>
            <li className="text-white/45">
              <Placeholder value={site.openingHours} />
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
            Rychlé odkazy
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#kontakt" className="transition hover:text-white">
                Poptávka
              </a>
            </li>
            <li>
              <Link
                href="/zasady-ochrany-osobnich-udaju"
                className="transition hover:text-white"
              >
                Zásady ochrany osobních údajů
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col gap-3 border-t border-line px-4 pt-8 text-sm text-white/45 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="text-white/60">
          Vytvořil{" "}
          <a
            href="https://www.baudys.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 underline underline-offset-4 transition hover:text-white"
          >
            Daniel Anthony Baudyš
          </a>
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
          © {year} <Placeholder value={site.name} />
        </p>
      </div>
    </footer>
  );
}
