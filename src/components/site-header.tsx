import Link from "next/link";
import { Heart, ShoppingBag, User } from "lucide-react";
import { getCurrentCart } from "@/lib/shopify/cart-query";
import { MobileNav } from "./mobile-nav";
import { SearchForm } from "./search-form";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { WishlistCountBadge } from "./wishlist-count-badge";
import { NAV_LINKS } from "@/lib/nav-links";

export async function SiteHeader() {
  const cart = await getCurrentCart();
  const itemCount = cart?.totalQuantity ?? 0;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="hidden bg-primary py-2 text-center text-[10px] uppercase tracking-[0.16em] text-primary-foreground sm:block">
        Complimentary shipping on orders over $75 &middot; 10% off your first order &mdash; WELCOME10
      </div>

      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-5 px-4 lg:px-8">
        <Logo />

        <SearchForm className="hidden max-w-xl flex-1 lg:flex" />

        <div className="flex items-center gap-4">
          <Link href="/account" aria-label="My account" className="text-foreground hover:text-primary">
            <User className="size-5" />
          </Link>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative text-foreground hover:text-primary"
          >
            <Heart className="size-5" />
            <WishlistCountBadge />
          </Link>
          <Link href="/cart" aria-label={`Cart with ${itemCount} items`} className="relative text-foreground hover:text-primary">
            <ShoppingBag className="size-5" />
            {itemCount > 0 ? (
              <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-primary text-[9px] text-primary-foreground">
                {itemCount}
              </span>
            ) : null}
          </Link>
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
          <MobileNav />
        </div>
      </div>

      <nav className="hidden h-11 items-center justify-center gap-7 border-t border-border px-8 text-[10px] uppercase tracking-[0.18em] lg:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
