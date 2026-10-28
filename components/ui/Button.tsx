import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
  ReactNode,
} from "react";

type Variant = "primary" | "ghost" | "outline";

const variants: Record<Variant, string> = {
  primary: "bg-brand-red text-white hover:bg-[#c40017]",
  ghost: "bg-transparent text-white hover:bg-white/10",
  outline:
    "border border-line text-white hover:border-white/40 hover:bg-white/5",
};

const base =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-none px-5 py-3 font-display text-sm uppercase tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-komatsu-yellow disabled:opacity-50";

function buttonClass(variant: Variant = "primary", className = ""): string {
  return [base, variants[variant], className].filter(Boolean).join(" ");
}

type ButtonAsButton = {
  href?: undefined;
  children: ReactNode;
  className?: string;
  variant?: Variant;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

type ButtonAsLink = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: Variant;
  onClick?: ComponentPropsWithoutRef<"a">["onClick"];
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const className = buttonClass(props.variant, props.className);

  if (typeof props.href === "string") {
    const { href, children, onClick, target, rel, "aria-label": ariaLabel } =
      props;
    if (href.startsWith("#")) {
      return (
        <a
          href={href}
          className={className}
          onClick={onClick}
          target={target}
          rel={rel}
          aria-label={ariaLabel}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className={className}
        onClick={onClick}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  const { children, type = "button", disabled, onClick, form, name, value } =
    props;

  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
      form={form}
      name={name}
      value={value}
    >
      {children}
    </button>
  );
}
