import "server-only";
import { cookies } from "next/headers";
import { getCart } from "./cart";
import { CART_COOKIE } from "./cart-constants";
import type { Cart } from "./types";

/**
 * Reads the current cart for display purposes (header badge, cart page).
 * Safe to call during rendering — never creates a cart or writes cookies.
 * Use the mutating actions in cart-actions.ts to create/modify a cart.
 */
export async function getCurrentCart(): Promise<Cart | null> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;
  if (!cartId) return null;
  return getCart(cartId);
}
