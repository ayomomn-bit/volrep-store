// Order tracking lookups. Deliberately separate from client.ts's
// shopifyClient: that client only ever holds the Storefront API's private
// token, which has no concept of "look up an arbitrary order by number" —
// the Storefront API only exposes orders through an authenticated
// customer's own accessToken (customerAccessTokenCreate + customer.orders),
// which this store doesn't have a login flow for yet. A number+email
// lookup like Track Order needs is an Admin API capability, so this talks
// to Admin API's GraphQL endpoint directly over fetch (no dedicated
// package installed for it, and none needed — it's one POST).
//
// SHOPIFY_ADMIN_API_TOKEN is intentionally NOT in .env.local yet. Until an
// Admin API custom app token is provisioned and set there, isConfigured()
// is false and every lookup short-circuits to "error" — never a fabricated
// result. This mirrors the USE_SHOPIFY_MAIN_MENU-style readiness gate in
// global.ts: the integration point is real and complete, just switched off
// until the credential exists.
const ADMIN_API_VERSION = "2026-07";

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

function getAdminEndpoint(): string | null {
  if (!STORE_DOMAIN || !ADMIN_API_TOKEN) return null;
  const host = STORE_DOMAIN.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `https://${host}/admin/api/${ADMIN_API_VERSION}/graphql.json`;
}

export function isOrderTrackingConfigured(): boolean {
  return getAdminEndpoint() !== null;
}

export type OrderTrackingFulfillment = {
  carrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
};

export type OrderTrackingInfo = {
  name: string;
  status: string;
  lineItems: { title: string; quantity: number }[];
  // null means "order found, nothing has shipped yet" — the UI shows the
  // "not available yet" message rather than an empty tracking section.
  fulfillment: OrderTrackingFulfillment | null;
};

export type TrackOrderResult =
  | { status: "found"; order: OrderTrackingInfo }
  | { status: "not_found" }
  | { status: "error" };

const ORDER_LOOKUP_QUERY = `
  query FindOrderForTracking($query: String!) {
    orders(first: 1, query: $query) {
      nodes {
        name
        email
        displayFulfillmentStatus
        lineItems(first: 20) {
          nodes {
            title
            quantity
          }
        }
        fulfillments(first: 5) {
          trackingInfo {
            number
            url
            company
          }
        }
      }
    }
  }
`;

type RawOrder = {
  name: string;
  email: string | null;
  displayFulfillmentStatus: string;
  lineItems: { nodes: { title: string; quantity: number }[] };
  fulfillments: {
    trackingInfo: { number: string | null; url: string | null; company: string | null }[];
  }[];
};

type RawResponse = {
  data?: { orders: { nodes: RawOrder[] } };
  errors?: unknown;
};

// "UNFULFILLED" / "PARTIALLY_FULFILLED" -> "Unfulfilled" / "Partially
// Fulfilled" — generic so it doesn't need updating if Shopify adds a new
// OrderDisplayFulfillmentStatus value.
function toDisplayStatus(raw: string): string {
  return raw
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

// Order number + email is what the UI collects, but the number alone is
// guessable/sequential — the email match below (not the search query) is
// the actual access check. A caller who gets the number right but the
// email wrong must see exactly the same "not_found" result as a caller who
// guessed a number that doesn't exist at all, so this never becomes an
// oracle for "does order #1002 exist".
export async function findOrderForTracking(orderNumber: string, email: string): Promise<TrackOrderResult> {
  const endpoint = getAdminEndpoint();
  if (!endpoint || !ADMIN_API_TOKEN) {
    return { status: "error" };
  }

  const normalizedNumber = orderNumber.startsWith("#") ? orderNumber : `#${orderNumber}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": ADMIN_API_TOKEN,
      },
      body: JSON.stringify({
        query: ORDER_LOOKUP_QUERY,
        variables: { query: `name:"${normalizedNumber}"` },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Shopify Admin order lookup failed:", response.status);
      return { status: "error" };
    }

    const { data, errors } = (await response.json()) as RawResponse;

    if (errors) {
      console.error("Shopify Admin order lookup error:", errors);
      return { status: "error" };
    }

    const rawOrder = data?.orders.nodes[0];

    if (!rawOrder || !rawOrder.email || rawOrder.email.toLowerCase() !== email.toLowerCase()) {
      return { status: "not_found" };
    }

    const trackingInfo = rawOrder.fulfillments.flatMap((f) => f.trackingInfo)[0];

    return {
      status: "found",
      order: {
        name: rawOrder.name,
        status: toDisplayStatus(rawOrder.displayFulfillmentStatus),
        lineItems: rawOrder.lineItems.nodes,
        fulfillment: trackingInfo
          ? {
              carrier: trackingInfo.company,
              trackingNumber: trackingInfo.number,
              trackingUrl: trackingInfo.url,
            }
          : null,
      },
    };
  } catch (error) {
    console.error("Shopify Admin order lookup request failed:", error);
    return { status: "error" };
  }
}
