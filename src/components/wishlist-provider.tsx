"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Money } from "@/lib/shopify/types";

export type WishlistItem = {
  id: string;
  handle: string;
  title: string;
  image: string | null;
  price: Money;
};

type WishlistContextValue = {
  items: WishlistItem[];
  isWishlisted: (id: string) => boolean;
  toggle: (item: WishlistItem) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "xg-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Per-browser only — no backend/database in Phase 1 (see PRD).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // Ignore corrupt/unavailable storage — wishlist just starts empty.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable (private mode, quota) — fail silently.
    }
  }, [items, hydrated]);

  const toggle = useCallback((item: WishlistItem) => {
    setItems((prev) =>
      prev.some((existing) => existing.id === item.id)
        ? prev.filter((existing) => existing.id !== item.id)
        : [...prev, item]
    );
  }, []);

  const isWishlisted = useCallback(
    (id: string) => items.some((item) => item.id === id),
    [items]
  );

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
