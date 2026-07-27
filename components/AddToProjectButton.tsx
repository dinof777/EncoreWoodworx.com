"use client";

import Link from "next/link";
import { useBasket } from "./BasketProvider";

type Props = {
  id: string;
  slug: string;
  title: string;
  priceLabel: string;
  imageUrl?: string | null;
  className?: string;
};

export function AddToProjectButton({
  id,
  slug,
  title,
  priceLabel,
  imageUrl,
  className = "",
}: Props) {
  const { add, remove, has, hydrated } = useBasket();
  const inBasket = hydrated && has(id);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <button
        type="button"
        onClick={() =>
          inBasket
            ? remove(id)
            : add({ id, slug, title, priceLabel, imageUrl })
        }
        className={`btn ${inBasket ? "btn-ghost" : "btn-primary"} w-full`}
      >
        {inBasket ? "✓ In your project — Remove" : "Add to Project"}
      </button>
      {inBasket && (
        <Link href="/basket" className="text-xs text-center text-[color:var(--accent-deep)] underline underline-offset-4">
          Review your project →
        </Link>
      )}
    </div>
  );
}
