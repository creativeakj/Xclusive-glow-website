import "server-only";
import { storefrontFetch } from "./storefront-client";
import { PRODUCT_FRAGMENT, PRODUCT_LIST_ITEM_FRAGMENT } from "./fragments";
import {
  normalizeProduct,
  normalizeProductListItem,
  type RawProduct,
  type RawProductListItem,
} from "./normalize";
import type { Collection, Product, ProductListItem } from "./types";

const GET_PRODUCTS_QUERY = /* GraphQL */ `
  query GetProducts($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
      nodes {
        ...ProductListItemFields
      }
    }
  }
  ${PRODUCT_LIST_ITEM_FRAGMENT}
`;

export async function getProducts(options?: {
  first?: number;
  sortKey?: "TITLE" | "PRICE" | "BEST_SELLING" | "CREATED_AT" | "RELEVANCE";
  reverse?: boolean;
  query?: string;
}): Promise<ProductListItem[]> {
  const data = await storefrontFetch<{
    products: { nodes: RawProductListItem[] };
  }>(
    GET_PRODUCTS_QUERY,
    {
      first: options?.first ?? 24,
      sortKey: options?.sortKey ?? "BEST_SELLING",
      reverse: options?.reverse ?? false,
      query: options?.query,
    },
    { tags: ["products"] }
  );

  return data.products.nodes.map(normalizeProductListItem);
}

const GET_PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export async function getProductByHandle(
  handle: string
): Promise<Product | null> {
  const data = await storefrontFetch<{ product: RawProduct | null }>(
    GET_PRODUCT_BY_HANDLE_QUERY,
    { handle },
    { tags: [`product-${handle}`] }
  );

  return data.product ? normalizeProduct(data.product) : null;
}

const GET_COLLECTION_BY_HANDLE_QUERY = /* GraphQL */ `
  query GetCollectionByHandle($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        url
        altText
        width
        height
      }
      products(first: $first) {
        nodes {
          ...ProductListItemFields
        }
      }
    }
  }
  ${PRODUCT_LIST_ITEM_FRAGMENT}
`;

type RawCollection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: Collection["image"];
  products: { nodes: Parameters<typeof normalizeProductListItem>[0][] };
};

export async function getCollectionByHandle(
  handle: string,
  first = 24
): Promise<Collection | null> {
  const data = await storefrontFetch<{ collection: RawCollection | null }>(
    GET_COLLECTION_BY_HANDLE_QUERY,
    { handle, first },
    { tags: [`collection-${handle}`] }
  );

  if (!data.collection) return null;

  return {
    id: data.collection.id,
    handle: data.collection.handle,
    title: data.collection.title,
    description: data.collection.description,
    image: data.collection.image ?? null,
    products: data.collection.products.nodes.map(normalizeProductListItem),
  };
}

const GET_COLLECTIONS_QUERY = /* GraphQL */ `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      nodes {
        id
        handle
        title
        description
        image {
          url
          altText
          width
          height
        }
      }
    }
  }
`;

export async function getCollections(
  first = 20
): Promise<Omit<Collection, "products">[]> {
  const data = await storefrontFetch<{
    collections: { nodes: Omit<Collection, "products">[] };
  }>(GET_COLLECTIONS_QUERY, { first }, { tags: ["collections"] });

  return data.collections.nodes;
}

const GET_PRODUCT_RECOMMENDATIONS_QUERY = /* GraphQL */ `
  query GetProductRecommendations(
    $productId: ID!
    $intent: ProductRecommendationIntent
  ) {
    productRecommendations(productId: $productId, intent: $intent) {
      ...ProductListItemFields
    }
  }
  ${PRODUCT_LIST_ITEM_FRAGMENT}
`;

// Shopify's own recommendation model (no extra infra needed) — RELATED
// favors similar products, COMPLEMENTARY favors "goes with this".
export async function getProductRecommendations(
  productId: string,
  intent: "RELATED" | "COMPLEMENTARY" = "RELATED"
): Promise<ProductListItem[]> {
  const data = await storefrontFetch<{
    productRecommendations: RawProductListItem[] | null;
  }>(
    GET_PRODUCT_RECOMMENDATIONS_QUERY,
    { productId, intent },
    { tags: [`product-recommendations-${productId}`] }
  );

  return (data.productRecommendations ?? []).map(normalizeProductListItem);
}
