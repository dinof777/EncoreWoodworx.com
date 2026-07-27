"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type BasketItem = {
  id: string;
  slug: string;
  title: string;
  priceLabel: string;
  imageUrl?: string | null;
  addedAt: string;
};

type Ctx = {
  items: BasketItem[];
  count: number;
  hydrated: boolean;
  add: (item: Omit<BasketItem, "addedAt">) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
};

const BasketContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "ew_basket_v1";

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      /* empty */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* empty */
    }
  }, [items, hydrated]);

  const add = useCallback((item: Omit<BasketItem, "addedAt">) => {
    setItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev
        : [...prev, { ...item, addedAt: new Date().toISOString() }],
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const has = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  const value = useMemo(
    () => ({ items, count: items.length, hydrated, add, remove, clear, has }),
    [items, hydrated, add, remove, clear, has],
  );

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket(): Ctx {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error("useBasket must be used inside <BasketProvider>");
  return ctx;
}
