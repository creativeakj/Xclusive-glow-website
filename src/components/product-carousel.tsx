import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "./product-card";
import type { ProductListItem } from "@/lib/shopify/types";

export function ProductCarousel({ products }: { products: ProductListItem[] }) {
  if (products.length === 0) {
    return <p className="py-16 text-center text-sm text-muted-foreground">No products found.</p>;
  }

  return (
    <Carousel opts={{ align: "start" }}>
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id}>
            <ProductCard product={product} showQuickView />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-6 flex justify-end gap-2">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
}
