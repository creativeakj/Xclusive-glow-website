"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  addCartLines,
  createCart,
  getCart,
  removeCartLines,
  updateCartLines,
} from "./cart";
import { CART_COOKIE, CART_COOKIE_MAX_AGE } from "./cart-constants";
import type { Cart } from "./types";

/**
 * Gets the cart for the current cookie, creating a new one if needed.
 * Only safe to call from within a Server Action (as done by the exported
 * mutations below) — writing the cartId cookie requires an Action context.
 */
async function getOrCreateCart(): Promise<Cart> {
  const cookieStore = await cookies();
  const existingCartId = cookieStore.get(CART_COOKIE)?.value;

  if (existingCartId) {
    const cart = await getCart(existingCartId);
    if (cart) return cart;
  }

  const cart = await createCart();
  cookieStore.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: CART_COOKIE_MAX_AGE,
    path: "/",
  });
  return cart;
}

export async function addItemToCart(
  merchandiseId: string,
  quantity: number = 1
): Promise<Cart> {
  const cart = await getOrCreateCart();
  const updated = await addCartLines(cart.id, [{ merchandiseId, quantity }]);
  revalidatePath("/", "layout");
  return updated;
}

export async function updateCartItemQuantity(
  lineId: string,
  quantity: number
): Promise<Cart> {
  const cart = await getOrCreateCart();

  if (quantity <= 0) {
    const updated = await removeCartLines(cart.id, [lineId]);
    revalidatePath("/", "layout");
    return updated;
  }

  const updated = await updateCartLines(cart.id, [{ id: lineId, quantity }]);
  revalidatePath("/", "layout");
  return updated;
}

export async function removeCartItem(lineId: string): Promise<Cart> {
  const cart = await getOrCreateCart();
  const updated = await removeCartLines(cart.id, [lineId]);
  revalidatePath("/", "layout");
  return updated;
}
