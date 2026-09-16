"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addItemToCart } from "@/lib/shopify/cart-actions";

export function AddToCartButton({
  variantId,
  available,
  title,
}: {
  variantId: string | null;
  available: boolean;
  title: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const disabled = !variantId || !available || isPending;

  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!variantId) return;
          setError(null);
          startTransition(async () => {
            try {
              await addItemToCart(variantId, 1);
              toast.success(`Added ${title} to your bag`);
              router.refresh();
            } catch {
              setError("Could not add this item to your cart. Please try again.");
              toast.error("Could not add this item to your bag");
            }
          });
        }}
        className="w-full bg-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
      >
        {!available
          ? "Sold out"
          : isPending
            ? "Adding…"
            : "Add to cart"}
      </button>
      {error ? <p className="mt-2 text-sm text-primary">{error}</p> : null}
    </div>
  );
}
