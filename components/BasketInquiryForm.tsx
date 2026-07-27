"use client";

import { useState } from "react";
import { useBasket, type BasketItem } from "./BasketProvider";

export function BasketInquiryForm({ items }: { items: BasketItem[] }) {
  const { clear } = useBasket();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message: notes,
          basket: items.map((i) => ({
            id: i.id,
            slug: i.slug,
            title: i.title,
            priceLabel: i.priceLabel,
          })),
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      clear();
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl bg-[color:var(--forest)]/10 border border-[color:var(--forest)]/30 p-8 text-center">
        <h3 className="font-display text-2xl text-[color:var(--forest)]">
          Got it — your project is on its way to the shop.
        </h3>
        <p className="mt-3 text-[color:var(--muted)]">
          I&apos;ll reply within one business day with options, a quote, and a timeline.
          Your basket has been cleared.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Your name</span>
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
        <span className="text-sm font-medium">
          Notes for the shop <span className="text-[color:var(--muted)]">(optional)</span>
        </span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          className="input mt-1.5 resize-y"
          placeholder="Wood species, dimensions, finish, timing — anything you already know."
        />
      </label>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending" || items.length === 0}
          className="btn btn-primary disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : `Send project (${items.length} item${items.length === 1 ? "" : "s"})`}
        </button>
        {status === "error" && (
          <p className="text-sm text-red-700">Something went wrong. Try again.</p>
        )}
      </div>
      <p className="text-xs text-[color:var(--muted)]">
        I&apos;ll reply with options and a quote. Final order goes through Etsy for secure
        checkout and buyer protection.
      </p>
    </form>
  );
}
