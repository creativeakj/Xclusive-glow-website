import "server-only";
import { shopifyConfig } from "./env";
import { getCustomerSession } from "./customer-session";

export class CustomerAccountApiError extends Error {
  constructor(
    message: string,
    public readonly errors?: unknown
  ) {
    super(message);
    this.name = "CustomerAccountApiError";
  }
}

/**
 * GraphQL request to Shopify's Customer Account API, scoped to the signed-in
 * customer. Returns null if there is no active customer session — callers
 * (account pages) are only reached once proxy.ts has confirmed a session.
 */
export async function customerAccountFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  const session = await getCustomerSession();
  if (!session) return null;

  const endpoint = `https://shopify.com/${shopifyConfig.shopId}/account/customer/api/${shopifyConfig.customerAccountApiVersion}/graphql`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: session.accessToken,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new CustomerAccountApiError(
      `Customer Account API request failed with status ${response.status}`
    );
  }

  const json = (await response.json()) as { data?: T; errors?: unknown };

  if (json.errors) {
    throw new CustomerAccountApiError(
      "Customer Account API returned errors",
      json.errors
    );
  }

  return json.data ?? null;
}
