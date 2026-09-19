import { ProductListingPage } from "@/components/product-listing-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Best Sellers",
  description: "The icons our clients reach for again and again, from Xclusive Glow.",
  path: "/best-sellers",
});

export default function BestSellersPage() {
  return (
    <ProductListingPage
      title="Best Sellers"
      intro="The icons our clients reach for again and again."
      sortKey="BEST_SELLING"
    />
  );
}
