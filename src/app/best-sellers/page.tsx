import type { Metadata } from "next";
import { ProductListingPage } from "@/components/product-listing-page";

export const metadata: Metadata = {
  title: "Best Sellers",
};

export default function BestSellersPage() {
  return (
    <ProductListingPage
      title="Best Sellers"
      intro="The icons our clients reach for again and again."
      sortKey="BEST_SELLING"
    />
  );
}
