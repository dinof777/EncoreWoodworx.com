"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
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
const EMPTY: BasketItem[] = [];

/**
 * localStorage is an external store, so it is read through useSyncExternalStore rather
 * than copied into state inside an effect. Two reasons beyond satisfying the
 * react-hooks/set-state-in-effect rule:
 *
 *  - The effect version rendered once with an empty basket and then again with the real
 *    one, which is the cascading render the rule exists to prevent.
 *  - Subscribing to the `storage` event means two open tabs stay in sync. Previously each
 *    tab kept its own copy and the last one to write silently won.
 *
 * getSnapshot must return a referentially stable value or React re-renders forever, so the
 * parsed array is cached against the raw string it came from.
 */
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedItems: BasketItem[] = EMPTY;

function readStorage(): BasketItem[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY; // Safari private mode, disabled storage, etc.
  }
  if (raw === cachedRaw) return cachedItems;
  let next: BasketItem[] = EMPTY;
  try {
    const parsed = JSON.parse(raw ?? "[]");
    if (Array.isArray(parsed)) next = parsed as BasketItem[];
  } catch {
    next = EMPTY;
  }
  cachedRaw = raw;
  cachedItems = next;
  return next;
}

function writeStorage(next: BasketItem[]): void {
  const raw = JSON.stringify(next);
  cachedRaw = raw;
  cachedItems = next;
  try {
    localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    /* keep the in-memory basket working even if persistence fails */
  }
  for (const l of listeners) l();
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  // Fires only in *other* tabs, which is exactly the cross-tab case.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

const serverSnapshot = (): BasketItem[] => EMPTY;

export function BasketProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, readStorage, serverSnapshot);
  // False during SSR and the first hydration pass, true once on the client — consumers use
  // it to avoid rendering a basket count that the server could not have known.
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const add = useCallback((item: Omit<BasketItem, "addedAt">) => {
    const current = readStorage();
    if (current.some((i) => i.id === item.id)) return;
    writeStorage([...current, { ...item, addedAt: new Date().toISOString() }]);
  }, []);

  const remove = useCallback((id: string) => {
    const current = readStorage();
    const next = current.filter((i) => i.id !== id);
    if (next.length !== current.length) writeStorage(next);
  }, []);

  const clear = useCallback(() => writeStorage([]), []);

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
