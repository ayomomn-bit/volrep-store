import type { ShopifyProductVariant } from "@/lib/shopify/products";

// Kept separate from products.ts, which imports the Shopify client (reads
// server-only env vars). ProductInfo is a Client Component and needs this
// function at runtime — importing any value export from products.ts would
// pull that server-only module into the client bundle and crash on load.
// The ShopifyProductVariant import above is type-only and erased at build
// time, so it doesn't have that problem.

// Resolves the variant matching every selected option, falling back to the
// product's first variant (mirrors Shopify's own "first available variant"
// convention) when the combination doesn't match — e.g. before any
// selection has been made.
export function findVariantBySelectedOptions(
  variants: ShopifyProductVariant[],
  selectedOptions: Record<string, string>,
): ShopifyProductVariant | null {
  const match = variants.find((variant) =>
    variant.selectedOptions.every((option) => selectedOptions[option.name] === option.value),
  );
  return match ?? variants[0] ?? null;
}
