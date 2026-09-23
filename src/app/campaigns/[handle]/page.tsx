import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product-grid";
import { ShopifyNotConfigured } from "@/components/shopify-not-configured";
import { getCollectionByHandle } from "@/lib/shopify/products";
import { isStorefrontConfigured } from "@/lib/shopify/env";
import { pageMetadata } from "@/lib/seo";

// Reusable campaign page: point it at any Shopify collection handle and it
// renders a promo hero + that collection's products. New campaign = new
// collection in Shopify, no code change needed.
export async function generateMetadata(
  props: PageProps<"/campaigns/[handle]">
): Promise<Metadata> {
  if (!isStorefrontConfigured) return {};
  const { handle } = await props.params;
  const collection = await getCollectionByHandle(handle);
  if (!collection) return {};

  return {
    ...pageMetadata({
      title: collection.title,
      description: collection.description || undefined,
      path: `/campaigns/${handle}`,
    }),
    // Same underlying collection as /collections/[handle] — canonicalize
    // there so search engines don't treat this as duplicate content. This
    // page exists for ad/social links, not organic search.
    alternates: { canonical: `/collections/${handle}` },
  };
}

export default async function CampaignPage(
  props: PageProps<"/campaigns/[handle]">
) {
  if (!isStorefrontConfigured) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <ShopifyNotConfigured feature="This campaign" />
      </div>
    );
  }

  const { handle } = await props.params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) notFound();

  return (
    <div>
      <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground">
        {collection.image ? (
          <Image
            src={collection.image.url}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-30"
          />
        ) : null}
        <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
          <p className="eyebrow text-accent">Limited time</p>
          <h1 className="mt-4 max-w-xl font-serif text-4xl leading-tight sm:text-5xl">
            {collection.title}
          </h1>
          {collection.description ? (
            <p className="mt-6 max-w-xl leading-7 text-primary-foreground/80">
              {collection.description}
            </p>
          ) : null}
          <Link
            href="#products"
            className="mt-8 inline-flex items-center bg-accent px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-accent-foreground hover:bg-accent/90"
          >
            Shop the campaign
          </Link>
        </div>
      </section>

      <div id="products" className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <ProductGrid products={collection.products} />
      </div>
    </div>
  );
}
