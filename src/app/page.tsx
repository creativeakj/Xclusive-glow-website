import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Sparkles, Truck, Headphones } from "lucide-react";
import { ProductCarousel } from "@/components/product-carousel";
import { ShopifyNotConfigured } from "@/components/shopify-not-configured";
import { Newsletter } from "@/components/newsletter";
import { FaqSection } from "@/components/faq-section";
import { getCollections, getProducts } from "@/lib/shopify/products";
import { isStorefrontConfigured } from "@/lib/shopify/env";
import { DEPARTMENT_LINKS } from "@/lib/nav-links";

const DEPARTMENT_IMAGES: Record<string, string> = {
  beauty: "/images/beauty.jpg",
  women: "/images/women.jpg",
  men: "/images/men.jpg",
  kids: "/images/kids.jpg",
};

export default async function HomePage() {
  const [bestSellers, newArrivals, collections] = isStorefrontConfigured
    ? await Promise.all([
        getProducts({ first: 8, sortKey: "BEST_SELLING" }),
        getProducts({ first: 8, sortKey: "CREATED_AT", reverse: true }),
        getCollections(20),
      ])
    : [[], [], []];

  const collectionByHandle = new Map(collections.map((c) => [c.handle, c]));

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div>
          <p className="eyebrow">New season. New glow.</p>
          <h1 className="mt-5 max-w-xl font-serif text-5xl leading-[0.98] sm:text-6xl lg:text-[64px]">
            Luxury Beauty &amp; Fashion, Curated for You
          </h1>
          <p className="mt-6 max-w-md text-muted-foreground">
            Hand-picked beauty, fashion and lifestyle essentials for you and your family —
            quality you can feel from the first order.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/collections/beauty"
              className="bg-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary/90"
            >
              Shop Beauty
            </Link>
            <Link
              href="/shop"
              className="border border-border px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-foreground hover:border-primary hover:text-primary"
            >
              Shop Fashion
            </Link>
          </div>
          <p className="mt-5 text-xs uppercase tracking-[0.14em] text-muted-foreground">
            10% off your first order &middot; Free shipping on orders over $75
          </p>
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src="/images/hero.jpg"
            alt="Xclusive Glow"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Collections */}
      <section className="border-y border-border bg-card py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="eyebrow">Collections</p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Shop Our Collections</h2>
            </div>
            <Link href="/shop" className="eyebrow">
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
            {DEPARTMENT_LINKS.map((dept) => {
              const handle = dept.href.split("/").pop()!;
              return (
                <Link key={dept.href} href={dept.href} className="group relative aspect-[4/5] overflow-hidden bg-card">
                  <Image
                    src={DEPARTMENT_IMAGES[handle]}
                    alt={dept.label}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-background/90 p-4">
                    <p className="eyebrow">{dept.label}</p>
                    <p className="mt-1 text-sm">
                      {collectionByHandle.get(handle)?.title ?? "Shop now"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border px-4 py-8 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:px-8">
        {[
          { icon: Sparkles, title: "Curated Quality", caption: "Every piece hand-selected, never mass-dumped" },
          { icon: ShieldCheck, title: "Secure Payments", caption: "Protected checkout, every order" },
          { icon: Truck, title: "Free Shipping", caption: "On all orders over $75" },
          { icon: Headphones, title: "Client Care", caption: "Real answers from our support team" },
        ].map(({ icon: Icon, title, caption }) => (
          <div key={title} className="flex items-center gap-4 px-4 py-5">
            <Icon className="size-6 text-primary" />
            <div>
              <h3 className="font-serif text-lg">{title}</h3>
              <p className="text-xs text-muted-foreground">{caption}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Best sellers */}
      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-serif text-3xl sm:text-4xl">Our Best Sellers</h2>
            <Link href="/best-sellers" className="eyebrow">
              View all &rarr;
            </Link>
          </div>
          {isStorefrontConfigured ? (
            <ProductCarousel products={bestSellers} />
          ) : (
            <ShopifyNotConfigured feature="The product catalog" />
          )}
        </div>
      </section>

      {/* Promo banner */}
      <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground">
        <Image
          src="/images/campaign.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="relative mx-auto flex max-w-6xl items-center px-4 lg:px-8">
          <div className="max-w-xl">
            <p className="eyebrow text-accent">The campaign</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Elevate your <em className="text-accent not-italic">everyday</em>.
            </h2>
            <p className="mt-6 leading-7 text-primary-foreground/80">
              Discover pieces designed to be worn, gifted and kept for years.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex items-center bg-accent px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-accent-foreground hover:bg-accent/90"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-serif text-3xl sm:text-4xl">New Arrivals</h2>
            <Link href="/new-arrivals" className="eyebrow">
              View all &rarr;
            </Link>
          </div>
          {isStorefrontConfigured ? (
            <ProductCarousel products={newArrivals} />
          ) : (
            <ShopifyNotConfigured feature="The product catalog" />
          )}
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2 lg:px-8">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src="/images/story.jpg"
              alt="Our story"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">Our story</p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
              A maison built on <em className="text-primary not-italic">glow</em>.
            </h2>
            <p className="mt-6 max-w-xl leading-7 text-muted-foreground">
              Founded on the belief that luxury is a quiet practice, Xclusive Glow curates beauty
              and fashion worth keeping. Every piece is chosen with intention for confidence at
              every age.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center border border-border px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-foreground hover:border-primary hover:text-primary"
            >
              Read our story
            </Link>
          </div>
        </div>
      </section>

      <FaqSection />
      <Newsletter />
    </div>
  );
}
