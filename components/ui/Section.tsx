import type { ReactNode } from "react";

type Tone = "void" | "panel" | "deep";

const tones: Record<Tone, string> = {
  void: "bg-void",
  panel: "bg-panel",
  deep: "bg-deep",
};

type Props = {
  id?: string;
  tone?: Tone;
  children: ReactNode;
  className?: string;
};

export function Section({ id, tone = "void", children, className = "" }: Props) {
  return (
    <section
      id={id}
      className={`${tones[tone]} border-t border-line py-24 md:py-32 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">{children}</div>
    </section>
  );
}

type HeaderProps = {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  children,
  className = "",
}: HeaderProps) {
  return (
    <header className={`max-w-3xl ${className}`}>
      {eyebrow ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-4 font-display text-4xl uppercase leading-[1.08] tracking-tight text-white md:text-6xl lg:text-7xl">
        {title}
      </h2>
      {children ? (
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
          {children}
        </p>
      ) : null}
    </header>
  );
}
