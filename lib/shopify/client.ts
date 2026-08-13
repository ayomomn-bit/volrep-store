import { createStorefrontApiClient } from "@shopify/storefront-api-client";

const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;

if (!storeDomain) {
  throw new Error("Missing SHOPIFY_STORE_DOMAIN");
}

if (!privateToken) {
  throw new Error("Missing SHOPIFY_STOREFRONT_PRIVATE_TOKEN");
}

export const shopifyClient = createStorefrontApiClient({
  storeDomain,
  apiVersion: "2026-07",
  privateAccessToken: privateToken,
});