"use client";

import { useMemo, useState } from "react";
import { Price } from "./price";
import { AddToCartButton } from "./add-to-cart-button";
import type { Product, ProductVariant } from "@/lib/shopify/types";

function findVariant(
  variants: ProductVariant[],
  selected: Record<string, string>
): ProductVariant | null {
  return (
    variants.find((variant) =>
      variant.selectedOptions.every((opt) => selected[opt.name] === opt.value)
    ) ?? null
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const hasOptions = product.options.some((opt) => opt.values.length > 1);

  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const option of product.options) {
      const firstAvailable =
        product.variants.find((v) =>
          v.selectedOptions.some(
            (o) => o.name === option.name && v.availableForSale
          )
        ) ?? product.variants[0];
      const match = firstAvailable?.selectedOptions.find(
        (o) => o.name === option.name
      );
      if (match) initial[option.name] = match.value;
    }
    return initial;
  });

  const selectedVariant = useMemo(
    () => findVariant(product.variants, selected),
    [product.variants, selected]
  );

  const displayPrice = selectedVariant?.price ?? product.priceRange.minVariantPrice;
  const displayCompareAt = selectedVariant?.compareAtPrice ?? null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl text-foreground">{product.title}</h1>
        <Price amount={displayPrice} compareAtAmount={displayCompareAt} className="mt-2 text-lg" />
      </div>

      {hasOptions ? (
        <div className="flex flex-col gap-4">
          {product.options.map((option) => (
            <div key={option.id}>
              <p className="mb-2 text-sm font-medium text-foreground">{option.name}</p>
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const isSelected = selected[option.name] === value;
                  const candidate = { ...selected, [option.name]: value };
                  const variantForValue = findVariant(product.variants, candidate);
                  const isAvailable = variantForValue?.availableForSale ?? false;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setSelected((prev) => ({ ...prev, [option.name]: value }))
                      }
                      className={`border px-4 py-2 text-sm transition ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-foreground hover:border-primary"
                      } ${!isAvailable ? "opacity-40" : ""}`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <AddToCartButton
        variantId={selectedVariant?.id ?? null}
        available={selectedVariant?.availableForSale ?? false}
        title={product.title}
      />

      {product.descriptionHtml ? (
        <div
          className="max-w-none border-t border-border pt-6 text-sm leading-relaxed text-foreground [&_a]:underline [&_p]:mb-3"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      ) : null}
    </div>
  );
}
