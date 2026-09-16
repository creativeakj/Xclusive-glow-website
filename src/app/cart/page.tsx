import Link from "next/link";
import type { Metadata } from "next";
import { CartLineItem } from "@/components/cart-line-item";
import { Price } from "@/components/price";
import { ShopifyNotConfigured } from "@/components/shopify-not-configured";
import { getCurrentCart } from "@/lib/shopify/cart-query";
import { isStorefrontConfigured } from "@/lib/shopify/env";

export const metadata: Metadata = {
  title: "Cart",
};

export default async function CartPage() {
  if (!isStorefrontConfigured) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <ShopifyNotConfigured feature="Your cart" />
      </div>
    );
  }

  const cart = await getCurrentCart();

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-foreground">Your cart is empty</h1>
        <Link
          href="/shop"
          className="mt-4 inline-flex items-center bg-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary/90"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 font-serif text-3xl text-foreground">Your cart</h1>

      <div className="divide-y divide-border border-y border-border">
        {cart.lines.map((line) => (
          <CartLineItem key={line.id} line={line} />
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <Price amount={cart.cost.subtotalAmount} className="font-medium" />
        </div>
        <p className="text-xs text-muted-foreground">
          Shipping and taxes calculated at checkout.
        </p>
        <a
          href={cart.checkoutUrl}
          className="mt-2 inline-flex items-center justify-center bg-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary/90"
        >
          Checkout
        </a>
      </div>
    </div>
  );
}
