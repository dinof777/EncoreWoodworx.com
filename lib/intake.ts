/**
 * Delivering form submissions to the Apps Script intake endpoint.
 *
 * The script lives in scripts/apps-script/Code.gs and is deployed from the Google Sheet it
 * writes to. It appends a row and emails a notification.
 *
 * Unlike the Google Form ids this replaced, the endpoint URL and shared secret ARE
 * credentials — anyone holding both can write rows into the Sheet and trigger mail — so
 * they come from the environment, never source.
 */

export type IntakeKind = "project" | "newsletter";

export type IntakePayload = {
  type: IntakeKind;
  name?: string;
  email: string;
  /** Project inquiries only: the visitor's written message. */
  message?: string;
  /** Project inquiries only: a rendered list of the pieces in their basket. */
  basket?: string;
  /** Which surface it came from, e.g. "/contact" or "/basket". */
  source?: string;
};

export type IntakeResult = { ok: true } | { ok: false; reason: string };

/** Missing configuration is reported distinctly so a route can answer 503 rather than 502. */
export const INTAKE_NOT_CONFIGURED = "not_configured";

export function intakeConfigured(): boolean {
  return Boolean(process.env.APPS_SCRIPT_INTAKE_URL && process.env.APPS_SCRIPT_INTAKE_SECRET);
}

export async function deliverIntake(payload: IntakePayload): Promise<IntakeResult> {
  const url = process.env.APPS_SCRIPT_INTAKE_URL;
  const secret = process.env.APPS_SCRIPT_INTAKE_SECRET;
  if (!url || !secret) return { ok: false, reason: INTAKE_NOT_CONFIGURED };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, secret }),
      // Apps Script answers with a 302 to script.googleusercontent.com; fetch follows it.
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });

    if (!res.ok) return { ok: false, reason: `intake responded ${res.status}` };

    // The script always returns JSON, and reports its own failures in the body — a 200
    // alone does not mean the row was written.
    const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!data?.ok) return { ok: false, reason: data?.error ?? "intake rejected the submission" };

    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    return { ok: false, reason: `request failed: ${message}` };
  }
}

export type BasketEntry = { title?: string; priceLabel?: string };

/** Render the project basket as the plain-text block that lands in the Sheet cell. */
export function renderBasket(basket: BasketEntry[]): string {
  return basket
    .map((b, i) => `${i + 1}. ${(b.title ?? "Untitled").slice(0, 200)} (${b.priceLabel ?? "—"})`)
    .join("\n");
}
