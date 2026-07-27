"use client";

import Link from "next/link";
import { useBasket } from "./BasketProvider";

export function BasketButton({ className = "" }: { className?: string }) {
  const { count, hydrated } = useBasket();
  const showBadge = hydrated && count > 0;

  return (
    <Link
      href="/basket"
      aria-label={`Project basket (${count})`}
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-[color:var(--border)] hover:border-[color:var(--accent)] hover:bg-[color:var(--accent)]/5 transition-colors ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7h18l-2 12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L3 7Z" />
        <path d="M8 7V5a4 4 0 0 1 8 0v2" />
      </svg>
      {showBadge && (
        <span
          aria-hidden
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[color:var(--accent)] text-[color:var(--surface)] text-[10px] font-bold flex items-center justify-center"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
