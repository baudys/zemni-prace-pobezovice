"use server";

import { z } from "zod";

const phonePattern = /^[0-9 +()\-]{9,}$/;

function countPhoneDigits(value: string): number {
  return value.replace(/\D/g, "").length;
}

const inquirySchema = z.object({
  type: z.enum(["vykop", "teren", "preprava", "sut", "jine"]),
  place: z.string().trim().min(2, "Zadejte obec / místo"),
  term: z.string().trim().optional(),
  name: z.string().trim().min(2, "Zadejte jméno"),
  phone: z
    .string()
    .trim()
    .regex(phonePattern, "Zadejte platné telefonní číslo (min. 9 číslic)")
    .refine((v) => countPhoneDigits(v) >= 9, {
      message: "Zadejte platné telefonní číslo (min. 9 číslic)",
    }),
  email: z.union([z.string().trim().email("Zadejte platný e-mail"), z.literal("")]),
  note: z.string().trim().optional(),
  consent: z.literal("on"),
  website: z.string().optional(), // honeypot
  startedAt: z.string(),
});

export type InquiryValues = {
  type: string;
  place: string;
  term: string;
  name: string;
  phone: string;
  email: string;
  note: string;
  consent: boolean;
};

export type InquiryState = {
  ok: boolean;
  message: string;
  mailto?: string;
  fieldErrors?: Record<string, string[]>;
  /** Zachovaná pole po neúspěchu (form reset po server action). */
  values?: InquiryValues;
};

function valuesFromForm(formData: FormData): InquiryValues {
  return {
    type: String(formData.get("type") ?? "vykop"),
    place: String(formData.get("place") ?? ""),
    term: String(formData.get("term") ?? ""),
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    note: String(formData.get("note") ?? ""),
    consent: formData.get("consent") === "on",
  };
}

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const values = valuesFromForm(formData);
  const raw = {
    type: values.type,
    place: values.place,
    term: values.term,
    name: values.name,
    phone: values.phone,
    email: values.email,
    note: values.note,
    consent: formData.get("consent"),
    website: String(formData.get("website") ?? ""),
    startedAt: String(formData.get("startedAt") ?? ""),
  };

  // honeypot
  if (raw.website && raw.website.length > 0) {
    return { ok: true, message: "Děkujeme, ozveme se." };
  }

  const started = Number(raw.startedAt);
  if (!Number.isFinite(started) || Date.now() - started < 3000) {
    return {
      ok: false,
      message: "Zkuste formulář odeslat znovu za chvilku.",
      values,
    };
  }

  const parsed = inquirySchema.safeParse({
    ...raw,
    consent: raw.consent === "on" ? "on" : raw.consent,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Zkontrolujte prosím vyplněná pole.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      values,
    };
  }

  const data = parsed.data;

  // TODO: napojit Resend/SMTP (env RESEND_API_KEY, INQUIRY_TO)
  console.log("[inquiry stub]", {
    type: data.type,
    place: data.place,
    term: data.term,
    name: data.name,
    phone: data.phone,
    email: data.email,
    note: data.note,
  });

  const hasMailBackend = Boolean(process.env.RESEND_API_KEY && process.env.INQUIRY_TO);

  if (!hasMailBackend) {
    const to = process.env.INQUIRY_TO || "poptavka@example.cz";
    const subject = encodeURIComponent(`Poptávka minibagr – ${data.place}`);
    const body = encodeURIComponent(
      [
        `Typ: ${data.type}`,
        `Místo: ${data.place}`,
        `Termín: ${data.term || "—"}`,
        `Jméno: ${data.name}`,
        `Telefon: ${data.phone}`,
        `E-mail: ${data.email || "—"}`,
        "",
        data.note || "",
      ].join("\n"),
    );
    return {
      ok: true,
      message:
        "Děkujeme. Odesílání e-mailu zatím není napojené – můžete použít tlačítko mailto nebo zavolat.",
      mailto: `mailto:${to}?subject=${subject}&body=${body}`,
    };
  }

  return {
    ok: true,
    message: "Děkujeme, ozveme se nejpozději do 1 pracovního dne.",
  };
}
