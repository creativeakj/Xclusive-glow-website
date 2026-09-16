import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { buildLogoutUrl } from "@/lib/shopify/customer-auth";
import { decryptSessionData } from "@/lib/session-crypto";
import { shopifyConfig } from "@/lib/shopify/env";
import {
  CUSTOMER_SESSION_COOKIE,
  type CustomerSessionData,
} from "@/lib/shopify/customer-session-shared";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;
  const session = raw ? decryptSessionData<CustomerSessionData>(raw) : null;

  cookieStore.delete(CUSTOMER_SESSION_COOKIE);

  if (session?.idToken) {
    return NextResponse.redirect(
      buildLogoutUrl(session.idToken, shopifyConfig.siteUrl)
    );
  }

  return NextResponse.redirect(new URL("/", request.url));
}
