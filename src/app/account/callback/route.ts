import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForTokens } from "@/lib/shopify/customer-auth";
import { encryptSessionData } from "@/lib/session-crypto";
import {
  CUSTOMER_SESSION_COOKIE,
  customerSessionCookieOptions,
} from "@/lib/shopify/customer-session-shared";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get("oauth_state")?.value;
  const codeVerifier = cookieStore.get("oauth_code_verifier")?.value;
  const redirectTarget = cookieStore.get("oauth_redirect")?.value || "/account";

  cookieStore.delete("oauth_state");
  cookieStore.delete("oauth_code_verifier");
  cookieStore.delete("oauth_nonce");
  cookieStore.delete("oauth_redirect");

  if (!code || !state || !codeVerifier || state !== expectedState) {
    return NextResponse.redirect(
      new URL("/account/login?error=invalid_state", request.url)
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code, codeVerifier);
    cookieStore.set(
      CUSTOMER_SESSION_COOKIE,
      encryptSessionData({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        idToken: tokens.id_token,
        expiresAt: Date.now() + tokens.expires_in * 1000,
      }),
      customerSessionCookieOptions
    );
    return NextResponse.redirect(new URL(redirectTarget, request.url));
  } catch {
    return NextResponse.redirect(
      new URL("/account/login?error=auth_failed", request.url)
    );
  }
}
