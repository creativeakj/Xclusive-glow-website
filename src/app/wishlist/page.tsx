"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/components/wishlist-provider";
import { WishlistButton } from "@/components/wishlist-button";
import { Price } from "@/components/price";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8">
      <h1 className="mb-2 font-serif text-4xl text-foreground">Your Wishlist</h1>
      <p className="mb-10 text-sm text-muted-foreground">
        Saved on this device — sign in isn&apos;t required, but your list won&apos;t follow you
        to another browser or device.
      </p>

      {items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-muted-foreground">Nothing saved yet.</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center bg-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary/90"
          >
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <article key={item.id}>
              <div className="relative aspect-square w-full overflow-hidden bg-muted">
                <Link href={`/products/${item.handle}`} className="absolute inset-0 z-10">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover"
                    />
                  ) : null}
                </Link>
                <WishlistButton item={item} />
              </div>
              <Link href={`/products/${item.handle}`} className="block">
                <h3 className="mt-4 font-serif text-lg text-foreground">{item.title}</h3>
                <Price amount={item.price} className="mt-1 block text-sm text-muted-foreground" />
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
