"use client";

import { Heart } from "lucide-react";
import { useWishlist, type WishlistItem } from "./wishlist-provider";

export function WishlistButton({ item }: { item: WishlistItem }) {
  const { isWishlisted, toggle } = useWishlist();
  const active = isWishlisted(item.id);

  return (
    <button
      type="button"
      aria-label={active ? `Remove ${item.title} from wishlist` : `Add ${item.title} to wishlist`}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        toggle(item);
      }}
      className="absolute left-3 top-3 z-20 grid size-9 place-items-center border border-border bg-background/90 text-foreground transition-colors hover:border-primary hover:text-primary"
    >
      <Heart className={active ? "size-4 fill-primary text-primary" : "size-4"} />
    </button>
  );
}
