"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { formatCzk, site, withVat } from "@/content/site";

const HOURLY =
  site.pricing.find((p) => p.id === "bagr-hodina")?.amountExVat ?? 950;
const MIN_JOB =
  site.pricing.find((p) => p.id === "minimum")?.amountExVat ?? 3800;
const KM_RATE =
  site.pricing.find((p) => p.id === "doprava")?.amountExVat ?? 35;
const CONTAINER_FROM =
  site.pricing.find((p) => p.id === "kontejner")?.amountExVat ?? 1900;

export const MIN_HOURS = Math.max(1, Math.round(MIN_JOB / HOURLY));

export type QuoteInput = {
  hours: number;
  kmOneWay: number;
  container: boolean;
};

export type QuoteLine = {
  id: string;
  label: string;
  detail?: string;
  amount: number;
};

export type QuoteEstimate = QuoteInput & {
  lines: QuoteLine[];
  totalEx: number;
  totalInc: number;
  noteText: string;
};

type QuoteContextValue = {
  draft: QuoteInput;
  setDraft: (patch: Partial<QuoteInput>) => void;
  estimate: QuoteEstimate;
  /** Snapshot applied when user continues from ceník → kontakt. */
  applied: QuoteEstimate | null;
  applyToContact: () => QuoteEstimate;
  clearApplied: () => void;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function buildEstimate(input: QuoteInput): QuoteEstimate {
  const hours = Math.max(MIN_HOURS, input.hours);
  const kmOneWay = Math.max(0, input.kmOneWay);
  const machine = Math.max(MIN_JOB, hours * HOURLY);
  const transport = kmOneWay * 2 * KM_RATE;
  const lines: QuoteLine[] = [
    {
      id: "machine",
      label: "Minibagr s obsluhou",
      detail: `${hours} h × ${formatCzk(HOURLY)}/h${
        hours * HOURLY < MIN_JOB ? ` · min. ${formatCzk(MIN_JOB)}` : ""
      }`,
      amount: machine,
    },
    {
      id: "transport",
      label: "Doprava",
      detail: `${kmOneWay} km × 2 × ${formatCzk(KM_RATE)}/km`,
      amount: transport,
    },
  ];
  if (input.container) {
    lines.push({
      id: "container",
      label: "Přistavení kontejneru 4,5 m",
      detail: "od · dle vzdálenosti",
      amount: CONTAINER_FROM,
    });
  }
  const totalEx = lines.reduce((sum, l) => sum + l.amount, 0);
  const totalInc = withVat(totalEx);
  const noteText = [
    "Odhad z konfigurátoru (orientační, bez DPH):",
    ...lines.map(
      (l) =>
        `• ${l.label}: ${formatCzk(l.amount)}${l.detail ? ` (${l.detail})` : ""}`,
    ),
    `Celkem: ${formatCzk(totalEx)} bez DPH / ${formatCzk(totalInc)} s DPH`,
  ].join("\n");

  return {
    hours,
    kmOneWay,
    container: input.container,
    lines,
    totalEx,
    totalInc,
    noteText,
  };
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [draft, setDraftState] = useState<QuoteInput>({
    hours: MIN_HOURS,
    kmOneWay: 20,
    container: false,
  });
  const [applied, setApplied] = useState<QuoteEstimate | null>(null);

  const setDraft = useCallback((patch: Partial<QuoteInput>) => {
    setDraftState((prev) => ({ ...prev, ...patch }));
  }, []);

  const estimate = useMemo(() => buildEstimate(draft), [draft]);

  const applyToContact = useCallback(() => {
    const next = buildEstimate(draft);
    setApplied(next);
    return next;
  }, [draft]);

  const clearApplied = useCallback(() => setApplied(null), []);

  const value = useMemo(
    () => ({
      draft,
      setDraft,
      estimate,
      applied,
      applyToContact,
      clearApplied,
    }),
    [draft, setDraft, estimate, applied, applyToContact, clearApplied],
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote(): QuoteContextValue {
  const ctx = useContext(QuoteContext);
  if (!ctx) {
    throw new Error("useQuote must be used within QuoteProvider");
  }
  return ctx;
}

export const quoteRates = {
  hourly: HOURLY,
  minJob: MIN_JOB,
  kmRate: KM_RATE,
  containerFrom: CONTAINER_FROM,
  minHours: MIN_HOURS,
} as const;
