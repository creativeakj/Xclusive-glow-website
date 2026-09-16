import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product-grid";
import { ShopifyNotConfigured } from "@/components/shopify-not-configured";
import { getCollectionByHandle } from "@/lib/shopify/products";
import { isStorefrontConfigured } from "@/lib/shopify/env";

export async function generateMetadata(
  props: PageProps<"/collections/[handle]">
): Promise<Metadata> {
  if (!isStorefrontConfigured) return {};
  const { handle } = await props.params;
  const collection = await getCollectionByHandle(handle);
  if (!collection) return {};

  return {
    title: collection.title,
    description: collection.description,
  };
}

export default async function CollectionPage(
  props: PageProps<"/collections/[handle]">
) {
  if (!isStorefrontConfigured) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <ShopifyNotConfigured feature="This collection" />
      </div>
    );
  }

  const { handle } = await props.params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-foreground">{collection.title}</h1>
        {collection.description ? (
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {collection.description}
          </p>
        ) : null}
      </div>
      <ProductGrid products={collection.products} />
    </div>
  );
}
