/**
 * Posting a submission into a Google Form.
 *
 * Google does not document the `formResponse` endpoint, but it accepts a plain
 * urlencoded POST of `entry.<id>=value` pairs and is what every "submit to a Google
 * Form from your own UI" approach uses. We do it server-side, which matters: the
 * endpoint sends no CORS headers, so this is impossible from the browser but trivial
 * from a route handler.
 *
 * Because it is undocumented, treat a non-2xx as a real failure and surface it — the
 * caller must not tell a visitor "got it" when the submission did not land. Note that
 * Google silently ignores unknown `entry` ids and returns 200, so a 2xx proves the
 * request was accepted, not that every field mapped. The Sheet is the check for that.
 */

export type GoogleFormConfig = {
  /** The form's /formResponse endpoint. */
  action: string;
  /** Logical field name -> Google's opaque `entry.<id>`. */
  fields: Record<string, string>;
};

export type GoogleFormResult = { ok: true } | { ok: false; reason: string };

/** Turn a public /viewform URL into the /formResponse endpoint it posts to. */
export function formResponseUrl(viewformUrl: string): string {
  return viewformUrl.replace(/\/viewform.*$/, "/formResponse");
}

export async function submitToGoogleForm(
  config: GoogleFormConfig,
  values: Record<string, string | undefined>,
): Promise<GoogleFormResult> {
  const body = new URLSearchParams();
  for (const [key, entryId] of Object.entries(config.fields)) {
    const value = values[key];
    if (value != null && value !== "") body.set(entryId, value);
  }
  if ([...body.keys()].length === 0) return { ok: false, reason: "nothing to submit" };

  // Mirrors what the real form sends; Google is lenient but these keep it happy.
  body.set("fvv", "1");
  body.set("submit", "Submit");

  try {
    const res = await fetch(config.action, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, reason: `google responded ${res.status}` };
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    return { ok: false, reason: `request failed: ${message}` };
  }
}
