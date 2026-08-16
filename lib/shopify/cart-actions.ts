"use server";

import { cookies } from "next/headers";
import {
  CART_COOKIE_NAME,
  addCartLines,
  createCart,
  getCart,
  getCurrentCart,
  removeCartLines,
  updateCartLines,
  type Cart,
} from "@/lib/shopify/cart";

// Shopify carts are valid for roughly this long server-side; the cookie's
// own lifetime just needs to comfortably outlast that so "expired cart"
// is something getCart() reports (and callers recover from), not something
// caused by the cookie itself disappearing first.
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const GENERIC_ERROR = "Something went wrong. Please try again.";
const ADD_ERROR = "Unable to add this item right now. Please try again.";

export type CartActionResult = { success: true; cart: Cart } | { success: false; error: string };

async function persistCartId(cartId: string) {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE_NAME, cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
  });
}

// Read-only — lets Client Components (CartProvider's mount-time rehydrate)
// resolve the real Shopify cart without ever touching the private
// Storefront token themselves; only this action's return value crosses
// the server/client boundary.
export async function getCartAction(): Promise<Cart | null> {
  return getCurrentCart();
}

export async function addToCartAction(variantId: string, quantity: number): Promise<CartActionResult> {
  if (!variantId || !Number.isInteger(quantity) || quantity < 1) {
    return { success: false, error: ADD_ERROR };
  }

  const cookieStore = await cookies();
  const existingCartId = cookieStore.get(CART_COOKIE_NAME)?.value;

  let cart: Cart | null = null;

  if (existingCartId) {
    // The cookie can outlive the cart itself (Shopify carts expire) —
    // confirm it still resolves before trying to add lines to it, and
    // fall through to creating a fresh cart below when it doesn't.
    const existingCart = await getCart(existingCartId);
    if (existingCart) {
      cart = await addCartLines(existingCartId, [{ merchandiseId: variantId, quantity }]);
    }
  }

  if (!cart) {
    cart = await createCart([{ merchandiseId: variantId, quantity }]);
  }

  if (!cart) {
    return { success: false, error: ADD_ERROR };
  }

  await persistCartId(cart.id);
  return { success: true, cart };
}

export async function updateCartLineAction(lineId: string, quantity: number): Promise<CartActionResult> {
  if (quantity < 1) {
    return removeCartLineAction(lineId);
  }

  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;
  if (!cartId) return { success: false, error: GENERIC_ERROR };

  const cart = await updateCartLines(cartId, [{ id: lineId, quantity }]);
  if (!cart) return { success: false, error: GENERIC_ERROR };

  return { success: true, cart };
}

export async function removeCartLineAction(lineId: string): Promise<CartActionResult> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;
  if (!cartId) return { success: false, error: GENERIC_ERROR };

  const cart = await removeCartLines(cartId, [lineId]);
  if (!cart) return { success: false, error: GENERIC_ERROR };

  return { success: true, cart };
}
