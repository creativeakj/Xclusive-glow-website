import Image from "next/image";
import Link from "next/link";
import { Price } from "./price";
import { QuickAddButton } from "./quick-add-button";
import { QuickViewDialog } from "./quick-view-dialog";
import type { ProductListItem } from "@/lib/shopify/types";

export function ProductCard({
  product,
  showQuickView = false,
}: {
  product: ProductListItem;
  showQuickView?: boolean;
}) {
  return (
    <article className="group">
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <Link href={`/products/${product.handle}`} className="absolute inset-0 z-10">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </Link>
        {showQuickView ? (
          <QuickViewDialog handle={product.handle} title={product.title} />
        ) : null}
      </div>
      <Link href={`/products/${product.handle}`} className="block">
        <h3 className="mt-4 font-serif text-lg text-foreground">{product.title}</h3>
        <Price
          amount={product.priceRange.minVariantPrice}
          className="mt-1 block text-sm text-muted-foreground"
        />
      </Link>
      <div className="mt-3">
        <QuickAddButton
          handle={product.handle}
          title={product.title}
          variantId={product.quickAddVariantId}
          available={product.quickAddAvailable}
          hasMultipleVariants={product.hasMultipleVariants}
        />
      </div>
    </article>
  );
}
