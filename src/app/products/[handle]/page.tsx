import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { ShopifyNotConfigured } from "@/components/shopify-not-configured";
import { getProductByHandle } from "@/lib/shopify/products";
import { isStorefrontConfigured } from "@/lib/shopify/env";

export async function generateMetadata(
  props: PageProps<"/products/[handle]">
): Promise<Metadata> {
  if (!isStorefrontConfigured) return {};
  const { handle } = await props.params;
  const product = await getProductByHandle(handle);
  if (!product) return {};

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
  };
}

export default async function ProductPage(
  props: PageProps<"/products/[handle]">
) {
  if (!isStorefrontConfigured) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <ShopifyNotConfigured feature="This product page" />
      </div>
    );
  }

  const { handle } = await props.params;
  const product = await getProductByHandle(handle);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden bg-muted">
            {product.featuredImage ? (
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            ) : null}
          </div>
          {product.images.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((image, i) => (
                <div
                  key={image.url + i}
                  className="relative aspect-square overflow-hidden bg-muted"
                >
                  <Image
                    src={image.url}
                    alt={image.altText || product.title}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <ProductDetail product={product} />
      </div>
    </div>
  );
}
