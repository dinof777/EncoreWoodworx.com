"use client";

import { useState } from "react";
import { useSpamGuard, HoneypotField } from "./SpamGuardFields";

type Status = "idle" | "sending" | "ok" | "invalid" | "unavailable" | "error";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const guard = useSpamGuard();
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company: guard.honeypotValue(),
          elapsedMs: guard.elapsedMs(),
        }),
      });
      if (res.ok) {
        setStatus("ok");
        setEmail("");
        return;
      }
      // 503 means no list exists yet. Tell the truth instead of claiming a signup.
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setStatus(data?.error === "not_configured" ? "unavailable" : "error");
    } catch {
      setStatus("error");
    }
  }

  const message: Partial<Record<Status, { text: string; tone: string }>> = {
    ok: { text: "Thanks — you're on the list.", tone: "text-[color:var(--forest)]" },
    invalid: { text: "Please enter a valid email.", tone: "text-[color:var(--text-error)]" },
    unavailable: {
      text: "The makers list isn't open yet — check back soon.",
      tone: "text-[color:var(--muted)]",
    },
    error: {
      text: "Something went wrong. Please try again.",
      tone: "text-[color:var(--text-error)]",
    },
  };
  const note = message[status];

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
      <HoneypotField inputRef={guard.honeypotRef} />
      <input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status !== "idle") setStatus("idle");
        }}
        className="input flex-1"
        aria-label="Email address"
      />
      <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
        {status === "sending" ? "Signing up…" : "Sign Up"}
      </button>
      {note && (
        <p
          role="status"
          className={`sm:absolute sm:translate-y-14 text-sm ${note.tone}`}
        >
          {note.text}
        </p>
      )}
    </form>
  );
}
