"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { site, unwrap } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open
          ? "border-white/10 bg-void/90 backdrop-blur-md"
          : "border-transparent bg-transparent backdrop-blur-none"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link href="#hero" className="flex items-center gap-3" aria-label={unwrap(site.name)}>
          <Image
            src="/brand/gts-logo.svg"
            alt="G.T.S. Poběžovice"
            width={88}
            height={40}
            className="h-9 w-auto"
            priority
          />
          <span className="hidden font-display text-sm uppercase tracking-wide text-white sm:block">
            <Placeholder value={site.name} />
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Hlavní navigace">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-white/80 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <a
            href={unwrap(site.phoneHref)}
            className="hidden text-sm font-medium text-white md:inline"
            onClick={() => track("phone_click", { source: "header" })}
          >
            <Placeholder value={site.phone} />
          </a>
          <Button
            href="#kontakt"
            className="!px-3 !py-2 text-xs md:!px-4"
            onClick={() => track("cta_click", { source: "header" })}
          >
            Poptat bagr
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Zavřít menu" : "Otevřít menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Zavřít" : "Menu"}</span>
            <span className="relative block h-3.5 w-5" aria-hidden>
              <span
                className={`absolute left-0 top-0 block h-0.5 w-5 bg-white transition duration-200 ${
                  open ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[6px] block h-0.5 w-5 bg-white transition duration-200 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[12px] block h-0.5 w-5 bg-white transition duration-200 ${
                  open ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-white/10 bg-ink/95 px-4 py-4 lg:hidden"
        >
          <ul className="space-y-3">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block py-1 text-white"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href={unwrap(site.phoneHref)} className="block py-1 text-komatsu-yellow">
                <Placeholder value={site.phone} />
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
