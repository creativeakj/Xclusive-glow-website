import { ProductListingPage } from "@/components/product-listing-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "New Arrivals",
  description: "Freshly selected beauty and fashion pieces for the season ahead.",
  path: "/new-arrivals",
});

export default function NewArrivalsPage() {
  return (
    <ProductListingPage
      title="New Arrivals"
      intro="Freshly selected pieces for the season ahead."
      sortKey="CREATED_AT"
      reverse
    />
  );
}
