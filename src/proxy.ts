import { NextResponse, type NextRequest } from "next/server";
import { decryptSessionData, encryptSessionData } from "@/lib/session-crypto";
import { refreshCustomerTokens } from "@/lib/shopify/customer-auth";
import {
  CUSTOMER_SESSION_COOKIE,
  customerSessionCookieOptions,
  type CustomerSessionData,
} from "@/lib/shopify/customer-session-shared";

const PUBLIC_ACCOUNT_PATHS = ["/account/login", "/account/callback", "/account/logout"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ACCOUNT_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const raw = request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value;
  const session = raw ? decryptSessionData<CustomerSessionData>(raw) : null;

  if (!session) {
    return redirectToLogin(request);
  }

  // Access token still valid (with a 60s safety margin) — continue as-is.
  if (Date.now() < session.expiresAt - 60_000) {
    return NextResponse.next();
  }

  try {
    const refreshed = await refreshCustomerTokens(session.refreshToken);
    const updated: CustomerSessionData = {
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token,
      idToken: refreshed.id_token,
      expiresAt: Date.now() + refreshed.expires_in * 1000,
    };
    const response = NextResponse.next();
    response.cookies.set(
      CUSTOMER_SESSION_COOKIE,
      encryptSessionData(updated),
      customerSessionCookieOptions
    );
    return response;
  } catch {
    const response = redirectToLogin(request);
    response.cookies.delete(CUSTOMER_SESSION_COOKIE);
    return response;
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/account/login", request.url);
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/account/:path*"],
};
