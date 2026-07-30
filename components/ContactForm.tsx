"use client";

import { useState } from "react";
import { useSpamGuard, HoneypotField } from "./SpamGuardFields";

export function ContactForm() {
  const [name, setName] = useState("");
  const guard = useSpamGuard();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          company: guard.honeypotValue(),
          elapsedMs: guard.elapsedMs(),
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <HoneypotField inputRef={guard.honeypotRef} />
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input mt-1.5"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">
            Email <span className="text-[color:var(--accent)]">*</span>
          </span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input mt-1.5"
            placeholder="you@example.com"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium">Tell me about your project</span>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          className="input mt-1.5 resize-y"
          placeholder="Wood species, dimensions, finish, budget, timing — whatever you have."
        />
      </label>
      <div className="flex items-center gap-4">
        <button type="submit" disabled={status === "sending"} className="btn btn-primary disabled:opacity-60">
          {status === "sending" ? "Sending…" : "Send Message"}
        </button>
        {status === "ok" && (
          <p className="text-sm text-[color:var(--forest)]">
            Got it — I&apos;ll be in touch shortly.
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-700">Something went wrong. Try again or email us directly.</p>
        )}
      </div>
      <p className="text-xs text-[color:var(--muted)]">
        Your details go straight to the shop and are never shared.
      </p>
    </form>
  );
}
