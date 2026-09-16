import "server-only";
import { storefrontFetch, throwOnUserErrors } from "./storefront-client";
import { CART_FRAGMENT } from "./fragments";
import { normalizeCart, type RawCart } from "./normalize";
import type { Cart, ShopifyUserError } from "./types";

const CREATE_CART_MUTATION = /* GraphQL */ `
  mutation CreateCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export async function createCart(
  lines?: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const data = await storefrontFetch<{
    cartCreate: {
      cart: RawCart;
      userErrors: ShopifyUserError[];
    };
  }>(
    CREATE_CART_MUTATION,
    { lines },
    { revalidate: false }
  );

  throwOnUserErrors(data.cartCreate.userErrors, "Could not create cart");
  return normalizeCart(data.cartCreate.cart);
}

const GET_CART_QUERY = /* GraphQL */ `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await storefrontFetch<{ cart: RawCart | null }>(
    GET_CART_QUERY,
    { cartId },
    { revalidate: false }
  );

  return data.cart ? normalizeCart(data.cart) : null;
}

const ADD_CART_LINES_MUTATION = /* GraphQL */ `
  mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export async function addCartLines(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const data = await storefrontFetch<{
    cartLinesAdd: {
      cart: RawCart;
      userErrors: ShopifyUserError[];
    };
  }>(ADD_CART_LINES_MUTATION, { cartId, lines }, { revalidate: false });

  throwOnUserErrors(data.cartLinesAdd.userErrors, "Could not add item to cart");
  return normalizeCart(data.cartLinesAdd.cart);
}

const UPDATE_CART_LINES_MUTATION = /* GraphQL */ `
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<Cart> {
  const data = await storefrontFetch<{
    cartLinesUpdate: {
      cart: RawCart;
      userErrors: ShopifyUserError[];
    };
  }>(UPDATE_CART_LINES_MUTATION, { cartId, lines }, { revalidate: false });

  throwOnUserErrors(data.cartLinesUpdate.userErrors, "Could not update cart");
  return normalizeCart(data.cartLinesUpdate.cart);
}

const REMOVE_CART_LINES_MUTATION = /* GraphQL */ `
  mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export async function removeCartLines(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const data = await storefrontFetch<{
    cartLinesRemove: {
      cart: RawCart;
      userErrors: ShopifyUserError[];
    };
  }>(REMOVE_CART_LINES_MUTATION, { cartId, lineIds }, { revalidate: false });

  throwOnUserErrors(data.cartLinesRemove.userErrors, "Could not remove item from cart");
  return normalizeCart(data.cartLinesRemove.cart);
}
