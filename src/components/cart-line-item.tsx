"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeCartItem, updateCartItemQuantity } from "@/lib/shopify/cart-actions";
import { Price } from "./price";
import type { CartLine } from "@/lib/shopify/types";

export function CartLineItem({ line }: { line: CartLine }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function setQuantity(quantity: number) {
    startTransition(async () => {
      await updateCartItemQuantity(line.id, quantity);
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      await removeCartItem(line.id);
      router.refresh();
    });
  }

  return (
    <div className={`flex gap-4 py-4 ${isPending ? "opacity-50" : ""}`}>
      <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-muted">
        {line.merchandise.image ? (
          <Image
            src={line.merchandise.image.url}
            alt={line.merchandise.image.altText || line.merchandise.product.title}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/products/${line.merchandise.product.handle}`}
            className="font-serif text-lg text-foreground"
          >
            {line.merchandise.product.title}
          </Link>
          {line.merchandise.selectedOptions.length > 0 ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {line.merchandise.selectedOptions
                .map((opt) => `${opt.name}: ${opt.value}`)
                .join(" · ")}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 border border-border">
            <button
              type="button"
              disabled={isPending}
              onClick={() => setQuantity(line.quantity - 1)}
              className="px-3 py-1 text-sm"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-6 text-center text-sm">{line.quantity}</span>
            <button
              type="button"
              disabled={isPending}
              onClick={() => setQuantity(line.quantity + 1)}
              className="px-3 py-1 text-sm"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <Price amount={line.cost.totalAmount} className="text-sm font-medium" />
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={remove}
          className="w-fit text-xs text-muted-foreground underline hover:text-primary"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
