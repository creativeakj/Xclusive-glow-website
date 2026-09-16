import "server-only";
import { isStorefrontConfigured, shopifyConfig } from "./env";
import type { ShopifyUserError } from "./types";

export class ShopifyStorefrontError extends Error {
  constructor(
    message: string,
    public readonly errors?: unknown
  ) {
    super(message);
    this.name = "ShopifyStorefrontError";
  }
}

type StorefrontFetchOptions = {
  /** Next.js cache tags for on-demand revalidation. */
  tags?: string[];
  /** Seconds to cache the response for. Omit for request-time data (e.g. cart). */
  revalidate?: number | false;
};

/**
 * Low-level GraphQL request to the Shopify Storefront API. Server-only —
 * the Storefront token must never reach the browser.
 */
export async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options: StorefrontFetchOptions = {}
): Promise<T> {
  if (!isStorefrontConfigured) {
    throw new ShopifyStorefrontError(
      "Shopify Storefront API is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_API_TOKEN."
    );
  }

  const endpoint = `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.storefrontApiVersion}/graphql.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Private access token (server-side use) — distinct from the public
      // token, which uses X-Shopify-Storefront-Access-Token instead.
      "Shopify-Storefront-Private-Token": shopifyConfig.storefrontApiToken!,
    },
    body: JSON.stringify({ query, variables }),
    ...(options.revalidate === false
      ? { cache: "no-store" as const }
      : { next: { revalidate: options.revalidate ?? 60, tags: options.tags } }),
  });

  if (!response.ok) {
    throw new ShopifyStorefrontError(
      `Shopify Storefront API request failed with status ${response.status}`
    );
  }

  const json = (await response.json()) as {
    data?: T;
    errors?: unknown;
  };

  if (json.errors) {
    throw new ShopifyStorefrontError(
      "Shopify Storefront API returned errors",
      json.errors
    );
  }

  if (!json.data) {
    throw new ShopifyStorefrontError("Shopify Storefront API returned no data");
  }

  return json.data;
}

export function throwOnUserErrors(
  userErrors: ShopifyUserError[] | undefined,
  context: string
): void {
  if (userErrors && userErrors.length > 0) {
    throw new ShopifyStorefrontError(
      `${context}: ${userErrors.map((e) => e.message).join("; ")}`
    );
  }
}
