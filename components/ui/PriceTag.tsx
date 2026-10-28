import { formatCzk, withVat, type SiteString } from "@/content/site";
import { Placeholder } from "@/components/ui/Placeholder";

type Props = {
  title: string;
  amountExVat: number | null;
  unit: string;
  note?: SiteString;
  from?: boolean;
  badge?: string;
  customLabel?: string;
};

export function PriceTag({
  title,
  amountExVat,
  unit,
  note,
  from,
  badge,
  customLabel,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-white/20 bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0d0d0d] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_30px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-komatsu-yellow via-white/40 to-brand-red" />
      {badge ? (
        <span className="mb-2 inline-block rounded bg-komatsu-yellow px-2 py-0.5 font-display text-xs text-ink">
          {badge}
        </span>
      ) : null}
      <h3 className="font-display text-lg uppercase tracking-wide text-white">{title}</h3>
      <div className="mt-3">
        {customLabel || amountExVat === null ? (
          <p className="font-display text-3xl text-komatsu-yellow">{customLabel}</p>
        ) : (
          <>
            <p className="font-display text-3xl md:text-4xl text-white">
              {from ? "od " : ""}
              {formatCzk(amountExVat)}{" "}
              <span className="text-xl text-white/70">{unit}</span>
            </p>
            <p className="mt-1 text-sm text-white/60">
              {formatCzk(withVat(amountExVat))} {unit} s DPH
            </p>
          </>
        )}
      </div>
      {note ? (
        <p className="mt-3 text-sm text-white/65">
          {typeof note === "string" ? note : <Placeholder value={note} />}
        </p>
      ) : null}
    </div>
  );
}
