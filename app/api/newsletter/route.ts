import { NextResponse } from "next/server";
import { deliverIntake, intakeConfigured, INTAKE_NOT_CONFIGURED } from "@/lib/intake";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { email?: string; name?: string };
  try {
    body = (await req.json()) as { email?: string; name?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 200);
  const email = String(body.email ?? "").trim().slice(0, 200);
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  // Say so plainly rather than accepting an address we would drop — the previous version
  // of this form told people they were subscribed and discarded the address client-side.
  if (!intakeConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const result = await deliverIntake({ type: "newsletter", name, email, source: "/newsletter" });
  if (!result.ok) {
    if (result.reason === INTAKE_NOT_CONFIGURED) {
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }
    console.error("[newsletter] delivery failed", { reason: result.reason });
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
