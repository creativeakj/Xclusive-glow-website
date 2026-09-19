import { ProductListingPage } from "@/components/product-listing-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Shop",
  description: "Beauty, fashion and occasion pieces curated for your every glow.",
  path: "/shop",
});

export default async function ShopPage(props: PageProps<"/shop">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;

  return (
    <ProductListingPage
      title="The Collection"
      intro="Beauty, fashion and occasion pieces curated for your every glow."
      query={q}
      sortKey={q ? "RELEVANCE" : "BEST_SELLING"}
    />
  );
}
