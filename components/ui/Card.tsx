import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Flat editorial surface — no tilt, blur, or heavy shadow. */
export function Card({ children, className = "" }: Props) {
  return (
    <div
      className={`border border-line bg-transparent p-6 transition-colors duration-200 hover:border-white/25 ${className}`}
    >
      {children}
    </div>
  );
}
