"use server";

import { z } from "zod";

const inquirySchema = z.object({
  type: z.enum(["vykop", "teren", "preprava", "sut", "jine"]),
  place: z.string().trim().min(2, "Zadejte obec / místo"),
  term: z.string().trim().optional(),
  name: z.string().trim().min(2, "Zadejte jméno"),
  phone: z.string().trim().min(9, "Zadejte telefon"),
  email: z.union([z.string().trim().email("Zadejte platný e-mail"), z.literal("")]),
  note: z.string().trim().optional(),
  consent: z.literal("on"),
  website: z.string().optional(), // honeypot
  startedAt: z.string(),
});

export type InquiryState = {
  ok: boolean;
  message: string;
  mailto?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const raw = {
    type: String(formData.get("type") ?? ""),
    place: String(formData.get("place") ?? ""),
    term: String(formData.get("term") ?? ""),
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    note: String(formData.get("note") ?? ""),
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
