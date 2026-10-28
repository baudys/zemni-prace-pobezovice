import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline";

type Common = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
};

type ButtonAsButton = Common &
  ComponentPropsWithoutRef<"button"> & {
    href?: undefined;
  };

type ButtonAsLink = Common & {
  href: string;
  onClick?: ComponentPropsWithoutRef<"a">["onClick"];
  target?: string;
  rel?: string;
  "aria-label"?: string;
  type?: never;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-red text-white hover:bg-[#c40017] shadow-[0_10px_30px_rgba(225,1,27,0.35)]",
  ghost: "bg-transparent text-white hover:bg-white/10",
  outline: "border border-white/40 text-white hover:bg-white/10",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 font-display text-sm uppercase tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-komatsu-yellow disabled:opacity-50";

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { children, className = "", variant = "primary" } = props;
  const cls = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, onClick, target, rel, "aria-label": ariaLabel } = props;
    return (
      <Link
        href={href}
        className={cls}
        onClick={onClick}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  const { type = "button", ...rest } = props as ButtonAsButton;
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
