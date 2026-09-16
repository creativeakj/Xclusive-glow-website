import type { Metadata } from "next";
import { ProductListingPage } from "@/components/product-listing-page";

export const metadata: Metadata = {
  title: "New Arrivals",
};

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
