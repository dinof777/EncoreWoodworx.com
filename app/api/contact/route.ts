import { NextResponse } from "next/server";
import { deliverIntake, renderBasket, INTAKE_NOT_CONFIGURED } from "@/lib/intake";

type BasketEntry = {
  id?: string;
  slug?: string;
  title?: string;
  priceLabel?: string;
};

type Payload = {
  name?: string;
  email?: string;
  message?: string;
  basket?: BasketEntry[];
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 200);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, 5000);
  const basket = Array.isArray(body.basket) ? body.basket.slice(0, 50) : [];

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  // A basket OR a written message satisfies the inquiry — empty inquiries are blocked.
  if (basket.length === 0 && (!message || message.length < 5)) {
    return NextResponse.json({ error: "Tell me a little about your project" }, { status: 400 });
  }

  const result = await deliverIntake({
    type: "project",
    name,
    email,
    message,
    basket: renderBasket(basket),
    source: basket.length > 0 ? "/basket" : "/contact",
  });

  if (!result.ok) {
    if (result.reason === INTAKE_NOT_CONFIGURED) {
      console.error("[contact] intake not configured — set APPS_SCRIPT_INTAKE_URL/SECRET");
    }
    // Never report success we did not achieve — the visitor would walk away believing
    // the inquiry was sent. Log enough to diagnose, and tell them to email directly.
    console.error("[contact] delivery failed", {
      reason: result.reason,
      email,
      basketCount: basket.length,
    });
    return NextResponse.json(
      { error: "Something went wrong sending that. Please email dinof777@gmail.com directly." },
      { status: 502 },
    );
  }

  console.log("[contact] inquiry delivered", {
    email,
    messageLength: message.length,
    basketCount: basket.length,
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: "POST { name, email, message }" });
}
