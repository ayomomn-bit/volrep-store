import { cookies } from "next/headers";
import { shopifyClient } from "@/lib/shopify/client";
import { CREATE_CART, GET_CART, CART_LINES_ADD, CART_LINES_UPDATE, CART_LINES_REMOVE } from "@/lib/shopify/queries";
import type { ShopifyImage, ShopifyMoney, ShopifySelectedOption } from "@/lib/shopify/products";

// Name of the cookie that persists the Shopify cart id across requests —
// shared between this file's getCurrentCart() (reads it) and
// cart-actions.ts's Server Actions (write it after cartCreate/cartLinesAdd).
export const CART_COOKIE_NAME = "volrep_cart_id";

export type CartLineMerchandise = {
  id: string;
  title: string;
  selectedOptions: ShopifySelectedOption[];
  image: ShopifyImage | null;
  price: ShopifyMoney;
  product: {
    title: string;
    handle: string;
  };
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: ShopifyMoney;
  };
  merchandise: CartLineMerchandise;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
  };
  lines: CartLine[];
};

export type CartLineInput = {
  merchandiseId: string;
  quantity: number;
};

export type CartLineUpdateInput = {
  id: string;
  quantity: number;
};

type RawCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: Cart["cost"];
  lines: { nodes: CartLine[] };
};

type CartMutationPayload = {
  cart: RawCart | null;
  userErrors: { field: string[] | null; message: string }[];
};

function mapCart(raw: RawCart): Cart {
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalQuantity: raw.totalQuantity,
    cost: raw.cost,
    lines: raw.lines.nodes,
  };
}

// Every mutation below shares this shape: GraphQL-level `errors`, then
// Shopify's own `userErrors` (invalid variant, unavailable merchandise,
// bad quantity, etc). Both are logged for debugging and collapsed to
// `null` for the caller — cart-actions.ts is the boundary that turns
// "null" into a friendly, customer-facing message, so no raw Shopify/
// GraphQL error text ever reaches the UI.
function resolveMutation(label: string, payload: CartMutationPayload | undefined): Cart | null {
  if (!payload) return null;

  if (payload.userErrors.length > 0) {
    console.error(`Shopify ${label} userErrors:`, payload.userErrors);
    return null;
  }

  return payload.cart ? mapCart(payload.cart) : null;
}

export async function createCart(lines: CartLineInput[] = []): Promise<Cart | null> {
  try {
    const { data, errors } = await shopifyClient.request(CREATE_CART, { variables: { lines } });

    if (errors) {
      console.error("Shopify createCart error:", errors);
      return null;
    }

    const payload = (data as { cartCreate: CartMutationPayload } | undefined)?.cartCreate;
    return resolveMutation("cartCreate", payload);
  } catch (error) {
    console.error("Shopify createCart request failed:", error);
    return null;
  }
}

export async function getCart(cartId: string): Promise<Cart | null> {
  try {
    const { data, errors } = await shopifyClient.request(GET_CART, { variables: { cartId } });

    if (errors) {
      console.error("Shopify getCart error:", errors);
      return null;
    }

    const raw = (data as { cart: RawCart | null } | undefined)?.cart;
    return raw ? mapCart(raw) : null;
  } catch (error) {
    console.error("Shopify getCart request failed:", error);
    return null;
  }
}

export async function addCartLines(cartId: string, lines: CartLineInput[]): Promise<Cart | null> {
  try {
    const { data, errors } = await shopifyClient.request(CART_LINES_ADD, { variables: { cartId, lines } });

    if (errors) {
      console.error("Shopify addCartLines error:", errors);
      return null;
    }

    const payload = (data as { cartLinesAdd: CartMutationPayload } | undefined)?.cartLinesAdd;
    return resolveMutation("cartLinesAdd", payload);
  } catch (error) {
    console.error("Shopify addCartLines request failed:", error);
    return null;
  }
}

export async function updateCartLines(cartId: string, lines: CartLineUpdateInput[]): Promise<Cart | null> {
  try {
    const { data, errors } = await shopifyClient.request(CART_LINES_UPDATE, { variables: { cartId, lines } });

    if (errors) {
      console.error("Shopify updateCartLines error:", errors);
      return null;
    }

    const payload = (data as { cartLinesUpdate: CartMutationPayload } | undefined)?.cartLinesUpdate;
    return resolveMutation("cartLinesUpdate", payload);
  } catch (error) {
    console.error("Shopify updateCartLines request failed:", error);
    return null;
  }
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<Cart | null> {
  try {
    const { data, errors } = await shopifyClient.request(CART_LINES_REMOVE, { variables: { cartId, lineIds } });

    if (errors) {
      console.error("Shopify removeCartLines error:", errors);
      return null;
    }

    const payload = (data as { cartLinesRemove: CartMutationPayload } | undefined)?.cartLinesRemove;
    return resolveMutation("cartLinesRemove", payload);
  } catch (error) {
    console.error("Shopify removeCartLines request failed:", error);
    return null;
  }
}

// Server-only: resolves the cart persisted in the request's cookies. A
// missing cookie (first-time visitor) and an expired/deleted cart id
// (Shopify carts do expire) are both treated as "no cart" rather than an
// error — getCart() already returns null for an invalid id.
export async function getCurrentCart(): Promise<Cart | null> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;
  if (!cartId) return null;
  return getCart(cartId);
}
