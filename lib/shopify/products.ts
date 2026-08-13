import { shopifyClient } from "@/lib/shopify/client";
import { GET_PRODUCTS } from "@/lib/shopify/queries";

export type ShopifyProductSummary = {
  id: string;
  title: string;
  handle: string;
  productType: string;
  tags: string[];
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
};

export async function getProducts(first = 8): Promise<ShopifyProductSummary[]> {
  try {
    const { data, errors } = await shopifyClient.request(GET_PRODUCTS, {
      variables: { first },
    });

    if (errors) {
      console.error("Shopify getProducts error:", errors);
      return [];
    }

    const nodes = (data as { products: { nodes: ShopifyProductSummary[] } } | undefined)?.products?.nodes;
    return nodes ?? [];
  } catch (error) {
    console.error("Shopify getProducts request failed:", error);
    return [];
  }
}
