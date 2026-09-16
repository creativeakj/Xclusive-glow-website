import { ProductGrid } from "./product-grid";
import { ShopifyNotConfigured } from "./shopify-not-configured";
import { getProducts } from "@/lib/shopify/products";
import { isStorefrontConfigured } from "@/lib/shopify/env";

export async function ProductListingPage({
  title,
  intro,
  sortKey,
  reverse,
  query,
}: {
  title: string;
  intro?: string;
  sortKey?: "TITLE" | "PRICE" | "BEST_SELLING" | "CREATED_AT" | "RELEVANCE";
  reverse?: boolean;
  query?: string;
}) {
  const products = isStorefrontConfigured
    ? await getProducts({ first: 48, sortKey, reverse, query })
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8">
      <div className="mb-10">
        <h1 className="font-serif text-4xl">{title}</h1>
        {intro ? <p className="mt-3 max-w-xl text-muted-foreground">{intro}</p> : null}
      </div>
      {isStorefrontConfigured ? (
        <ProductGrid products={products} />
      ) : (
        <ShopifyNotConfigured feature="The product catalog" />
      )}
    </div>
  );
}
