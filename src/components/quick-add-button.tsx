"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addItemToCart } from "@/lib/shopify/cart-actions";

export function QuickAddButton({
  handle,
  title,
  variantId,
  available,
  hasMultipleVariants,
}: {
  handle: string;
  title: string;
  variantId: string | null;
  available: boolean;
  hasMultipleVariants: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(false);
  const router = useRouter();

  const baseClasses =
    "block w-full border border-primary py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] transition-colors";

  if (!available) {
    return (
      <span className={`${baseClasses} cursor-not-allowed border-border text-muted-foreground`}>
        Sold out
      </span>
    );
  }

  // Products with options (size, shade, etc.) need the PDP for selection.
  if (hasMultipleVariants || !variantId) {
    return (
      <Link
        href={`/products/${handle}`}
        className={`${baseClasses} text-primary hover:bg-primary hover:text-primary-foreground`}
      >
        Select options
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        setError(false);
        startTransition(async () => {
          try {
            await addItemToCart(variantId, 1);
            toast.success(`Added ${title} to your bag`);
            router.refresh();
          } catch {
            setError(true);
            toast.error("Could not add this item to your bag");
          }
        });
      }}
      className={`${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60`}
    >
      {error ? "Try again" : isPending ? "Adding…" : "Add to cart"}
    </button>
  );
}
