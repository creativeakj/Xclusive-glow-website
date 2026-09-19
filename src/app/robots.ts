import type { MetadataRoute } from "next";
import { shopifyConfig } from "@/lib/shopify/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account/", "/cart", "/wishlist"],
    },
    sitemap: `${shopifyConfig.siteUrl}/sitemap.xml`,
  };
}
