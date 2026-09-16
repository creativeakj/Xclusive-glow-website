import { shopifyConfig } from "./env";

/**
 * OAuth 2.0 Authorization Code + PKCE flow against Shopify's Customer
 * Account API. The auth domain (SHOPIFY_CUSTOMER_ACCOUNT_AUTH_BASE_URL) is
 * per-store — e.g. https://account.your-store.com — not a fixed
 * shopify.com/{shop_id} pattern. Copy the exact Authorization/Token/Logout
 * endpoints from Shopify Admin's Headless channel > Customer Account API
 * page; this file assumes they share one base URL with the paths below,
 * which matched what Shopify generated when this was built, but re-verify
 * if auth starts failing.
 */

function authBaseUrl(): string {
  return shopifyConfig.customerAccountAuthBaseUrl!.replace(/\/+$/, "");
}

const SCOPE = "openid email customer-account-api:full";

export type TokenResponse = {
  access_token: string;
  id_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
};

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function generateCodeVerifier(): string {
  return base64UrlEncode(crypto.getRandomValues(new Uint8Array(32)));
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier)
  );
  return base64UrlEncode(new Uint8Array(digest));
}

export function generateRandomToken(): string {
  return base64UrlEncode(crypto.getRandomValues(new Uint8Array(16)));
}

export function buildAuthorizeUrl(params: {
  state: string;
  nonce: string;
  codeChallenge: string;
}): string {
  const url = new URL(`${authBaseUrl()}/authentication/oauth/authorize`);
  url.searchParams.set("client_id", shopifyConfig.customerAccountApiClientId!);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", shopifyConfig.customerAccountRedirectUri!);
  url.searchParams.set("scope", SCOPE);
  url.searchParams.set("state", params.state);
  url.searchParams.set("nonce", params.nonce);
  url.searchParams.set("code_challenge", params.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string
): Promise<TokenResponse> {
  const response = await fetch(`${authBaseUrl()}/authentication/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: shopifyConfig.customerAccountApiClientId!,
      redirect_uri: shopifyConfig.customerAccountRedirectUri!,
      code,
      code_verifier: codeVerifier,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to exchange authorization code (${response.status})`);
  }

  return response.json();
}

export async function refreshCustomerTokens(
  refreshToken: string
): Promise<TokenResponse> {
  const response = await fetch(`${authBaseUrl()}/authentication/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: shopifyConfig.customerAccountApiClientId!,
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh customer session (${response.status})`);
  }

  return response.json();
}

export function buildLogoutUrl(idToken: string, postLogoutRedirectUri: string): string {
  const url = new URL(`${authBaseUrl()}/authentication/logout`);
  url.searchParams.set("id_token_hint", idToken);
  url.searchParams.set("post_logout_redirect_uri", postLogoutRedirectUri);
  return url.toString();
}
