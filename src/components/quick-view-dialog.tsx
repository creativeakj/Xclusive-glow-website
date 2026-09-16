"use client";

import Image from "next/image";
import { Eye } from "lucide-react";
import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductDetail } from "./product-detail";
import { getProductForQuickView } from "@/lib/shopify/product-actions";
import type { Product } from "@/lib/shopify/types";

export function QuickViewDialog({ handle, title }: { handle: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (next && !product) {
      startTransition(async () => {
        const result = await getProductForQuickView(handle);
        setProduct(result);
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <button
        type="button"
        aria-label={`Quick view ${title}`}
        onClick={(e) => {
          e.preventDefault();
          onOpenChange(true);
        }}
        className="absolute right-3 top-3 z-20 grid size-9 place-items-center border border-border bg-background/90 text-foreground opacity-0 transition-opacity hover:border-primary hover:text-primary group-hover:opacity-100 focus-visible:opacity-100"
      >
        <Eye className="size-4" />
      </button>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {isPending && !product ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="aspect-square animate-pulse bg-muted" />
            <div className="flex flex-col gap-3">
              <div className="h-7 w-2/3 animate-pulse bg-muted" />
              <div className="h-5 w-1/4 animate-pulse bg-muted" />
              <div className="mt-4 h-11 w-full animate-pulse bg-muted" />
            </div>
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="relative aspect-square w-full overflow-hidden bg-muted">
              {product.featuredImage ? (
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText || product.title}
                  fill
                  sizes="(min-width: 640px) 40vw, 90vw"
                  className="object-cover"
                />
              ) : null}
            </div>
            <ProductDetail product={product} />
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Could not load this product.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
