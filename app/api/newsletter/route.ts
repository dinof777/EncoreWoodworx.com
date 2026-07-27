import { NextResponse } from "next/server";
import { submitToGoogleForm } from "@/lib/google-form";
import { NEWSLETTER_FORM } from "@/lib/forms";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { email?: string };
  try {
    body = (await req.json()) as { email?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().slice(0, 200);
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  // No list exists yet. Say so plainly rather than accepting an address we would drop —
  // the previous version of this form told people they were subscribed and discarded it.
  if (!NEWSLETTER_FORM) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const result = await submitToGoogleForm(NEWSLETTER_FORM, { email });
  if (!result.ok) {
    console.error("[newsletter] delivery failed", { reason: result.reason });
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
