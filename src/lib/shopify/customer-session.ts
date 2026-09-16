import "server-only";
import { cookies } from "next/headers";
import { decryptSessionData } from "../session-crypto";
import {
  CUSTOMER_SESSION_COOKIE,
  type CustomerSessionData,
} from "./customer-session-shared";

/**
 * Reads the customer session for the current request. Token freshness is
 * guaranteed by proxy.ts, which refreshes (or clears) the session before
 * any /account route renders — this only ever reads the cookie.
 */
export async function getCustomerSession(): Promise<CustomerSessionData | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!raw) return null;
  return decryptSessionData<CustomerSessionData>(raw);
}
