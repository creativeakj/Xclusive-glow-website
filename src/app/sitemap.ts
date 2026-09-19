import type { MetadataRoute } from "next";
import { getCollections, getProducts } from "@/lib/shopify/products";
import { isStorefrontConfigured, shopifyConfig } from "@/lib/shopify/env";

const STATIC_ROUTES = [
  "",
  "/shop",
  "/new-arrivals",
  "/best-sellers",
  "/offers",
  "/about",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = shopifyConfig.siteUrl;

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.6,
  }));

  if (!isStorefrontConfigured) {
    return staticEntries;
  }

  const [products, collections] = await Promise.all([
    getProducts({ first: 250 }),
    getCollections(50),
  ]);

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/products/${product.handle}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const collectionEntries: MetadataRoute.Sitemap = collections.map((collection) => ({
    url: `${base}/collections/${collection.handle}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...collectionEntries, ...productEntries];
}
