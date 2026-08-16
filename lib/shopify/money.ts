import type { ShopifyMoney } from "@/lib/shopify/products";

// Same formatting recipe used by ProductPrice/ProductCard/FinalCTA
// (each currently defines its own local copy) — factored out here so new
// cart code has one canonical version to import instead of a fourth
// ad-hoc duplicate.
export function formatMoney({ amount, currencyCode }: ShopifyMoney): string | null {
  const value = Number(amount);
  if (Number.isNaN(value)) return null;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
