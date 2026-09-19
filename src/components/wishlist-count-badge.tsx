"use client";

import { useWishlist } from "./wishlist-provider";

export function WishlistCountBadge() {
  const { items } = useWishlist();
  if (items.length === 0) return null;

  return (
    <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-primary text-[9px] text-primary-foreground">
      {items.length}
    </span>
  );
}
