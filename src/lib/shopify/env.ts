const storefrontDomain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontToken = process.env.SHOPIFY_STOREFRONT_API_TOKEN;

export const shopifyConfig = {
  storeDomain: storefrontDomain,
  storefrontApiToken: storefrontToken,
  storefrontApiVersion: process.env.SHOPIFY_STOREFRONT_API_VERSION || "2026-07",
  shopId: process.env.SHOPIFY_SHOP_ID,
  customerAccountApiClientId: process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID,
  customerAccountApiVersion:
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_VERSION || "2026-07",
  customerAccountRedirectUri: process.env.SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI,
  /**
   * The store's dedicated Customer Account API auth domain, e.g.
   * https://account.your-store.com — shown as the Authorization/Token/
   * Logout endpoints on the Headless channel's Customer Account API page.
   * Not a fixed shopify.com/{shop_id} pattern — it's per-store.
   */
  customerAccountAuthBaseUrl: process.env.SHOPIFY_CUSTOMER_ACCOUNT_AUTH_BASE_URL,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

/** True once the minimum Storefront API configuration is present. */
export const isStorefrontConfigured = Boolean(
  storefrontDomain && storefrontToken
);

/** True once the minimum Customer Account API (OAuth) configuration is present. */
export const isCustomerAccountConfigured = Boolean(
  shopifyConfig.shopId &&
    shopifyConfig.customerAccountApiClientId &&
    shopifyConfig.customerAccountRedirectUri &&
    shopifyConfig.customerAccountAuthBaseUrl
);
