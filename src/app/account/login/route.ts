import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import {
  buildAuthorizeUrl,
  generateCodeChallenge,
  generateCodeVerifier,
  generateRandomToken,
} from "@/lib/shopify/customer-auth";
import { isCustomerAccountConfigured } from "@/lib/shopify/env";

const OAUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 10, // 10 minutes to complete login
};

export async function GET(request: NextRequest) {
  if (!isCustomerAccountConfigured) {
    return NextResponse.json(
      {
        error:
          "Shopify Customer Account API is not configured. Set SHOPIFY_SHOP_ID, SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID and SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI.",
      },
      { status: 500 }
    );
  }

  const redirectTarget = request.nextUrl.searchParams.get("redirect") || "/account";
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateRandomToken();
  const nonce = generateRandomToken();

  const cookieStore = await cookies();
  cookieStore.set("oauth_code_verifier", codeVerifier, OAUTH_COOKIE_OPTIONS);
  cookieStore.set("oauth_state", state, OAUTH_COOKIE_OPTIONS);
  cookieStore.set("oauth_nonce", nonce, OAUTH_COOKIE_OPTIONS);
  cookieStore.set("oauth_redirect", redirectTarget, OAUTH_COOKIE_OPTIONS);

  const authorizeUrl = buildAuthorizeUrl({ state, nonce, codeChallenge });
  return NextResponse.redirect(authorizeUrl);
}
