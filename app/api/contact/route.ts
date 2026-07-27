import { NextResponse } from "next/server";

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

  const summary = basket
    .map((b, i) => `  ${i + 1}. ${String(b.title ?? "").slice(0, 200)} (${b.priceLabel ?? "—"})`)
    .join("\n");

  console.log("[contact] new inquiry", {
    name,
    email,
    messageLength: message.length,
    basketCount: basket.length,
    basket: summary || "(none)",
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: "POST { name, email, message }" });
}
