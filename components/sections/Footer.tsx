import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { Placeholder } from "@/components/ui/Placeholder";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:flex-row md:items-start md:justify-between md:px-6">
        <div>
          <Image
            src="/brand/gts-logo-transparent.svg"
            alt="G.T.S. Poběžovice"
            width={120}
            height={52}
            className="h-12 w-auto"
          />
          <p className="mt-4 text-sm text-white/70">
            Provozuje <Placeholder value={site.operator} />
          </p>
          <p className="mt-1 text-sm text-white/60">
            IČO: <Placeholder value={site.ico} /> · DIČ:{" "}
            <Placeholder value={site.dic} />
          </p>
          <p className="mt-1 text-sm text-white/60">
            <Placeholder value={site.address} />
          </p>
        </div>

        <div className="text-sm text-white/70">
          <p>Ceny jsou orientační.</p>
          <p className="mt-2">
            <Link
              href="/zasady-ochrany-osobnich-udaju"
              className="underline underline-offset-2 hover:text-white"
            >
              Zásady zpracování osobních údajů
            </Link>
          </p>
          <p className="mt-6 text-white/60">
            © {year} <Placeholder value={site.name} />
          </p>
        </div>
      </div>
    </footer>
  );
}
