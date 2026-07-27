"use client";

import Image from "next/image";
import Link from "next/link";
import { useBasket } from "./BasketProvider";
import { BasketInquiryForm } from "./BasketInquiryForm";

export function BasketView() {
  const { items, remove, hydrated } = useBasket();

  if (!hydrated) {
    return (
      <div className="text-center py-16">
        <p className="text-[color:var(--muted)]">Loading your project…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 max-w-xl mx-auto">
        <h2 className="font-display text-3xl">Your project is empty.</h2>
        <p className="mt-4 text-[color:var(--muted)]">
          Browse the shop and add custom pieces — tables, desks, doors, anything that needs a
          conversation. We&apos;ll quote the whole project at once.
        </p>
        <Link href="/shop" className="btn btn-primary mt-8">
          Browse the shop →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-12 items-start">
      <div className="lg:col-span-7 space-y-4">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-3xl">
            {items.length} piece{items.length === 1 ? "" : "s"} in your project
          </h2>
        </div>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4"
          >
            <Link
              href={`/shop/${item.slug}`}
              className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0"
              style={{ background: "#e8dec9" }}
            >
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              )}
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                href={`/shop/${item.slug}`}
                className="font-display text-lg leading-tight hover:text-[color:var(--accent)] transition-colors line-clamp-2"
              >
                {item.title}
              </Link>
              <p className="mt-1 text-sm font-semibold text-[color:var(--accent-deep)]">
                {item.priceLabel}{" "}
                <span className="text-xs font-normal text-[color:var(--muted)]">
                  · starting price
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => remove(item.id)}
              aria-label={`Remove ${item.title}`}
              className="shrink-0 w-9 h-9 rounded-full border border-[color:var(--border)] hover:border-red-400 hover:text-red-700 transition-colors flex items-center justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
        <p className="mt-6 text-sm text-[color:var(--muted)]">
          Prices shown are starting points for each made-to-order piece. Final quote depends on
          wood species, dimensions, and finish — we&apos;ll confirm everything in our reply.
        </p>
      </div>

      <div className="lg:col-span-5 lg:sticky lg:top-28">
        <div className="rounded-3xl bg-[color:var(--surface)] border border-[color:var(--border)] p-7 md:p-8 shadow-sm">
          <p className="eyebrow">Send to the brothers</p>
          <h3 className="font-display text-2xl mt-2">Tell us about the project</h3>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            We typically reply within one business day.
          </p>
          <div className="mt-6">
            <BasketInquiryForm items={items} />
          </div>
        </div>
      </div>
    </div>
  );
}
