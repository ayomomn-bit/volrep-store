import { shopifyClient } from "@/lib/shopify/client";
import { GET_PRODUCT, GET_PRODUCTS } from "@/lib/shopify/queries";

export type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type ShopifyProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ShopifySelectedOption = {
  name: string;
  value: string;
};

export type ShopifyProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: ShopifySelectedOption[];
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  image: ShopifyImage | null;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  options: ShopifyProductOption[];
  variants: ShopifyProductVariant[];
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
};

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

type RawProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  images: { nodes: ShopifyImage[] };
  options: { id: string; name: string; optionValues: { name: string }[] }[];
  variants: {
    nodes: {
      id: string;
      title: string;
      availableForSale: boolean;
      selectedOptions: ShopifySelectedOption[];
      price: ShopifyMoney;
      compareAtPrice: ShopifyMoney | null;
      image: ShopifyImage | null;
    }[];
  };
  priceRange: { minVariantPrice: ShopifyMoney };
  compareAtPriceRange: { minVariantPrice: ShopifyMoney } | null;
};

function mapProduct(raw: RawProduct): ShopifyProduct {
  const price = raw.priceRange.minVariantPrice;
  const compareAtCandidate = raw.compareAtPriceRange?.minVariantPrice ?? null;
  // Only surface a "compare at" price when it's a genuine discount — some
  // catalogs carry a stale compareAtPrice equal to (or below) the current
  // price, which should render as a normal price, not a struck-through one.
  const compareAtPrice =
    compareAtCandidate && Number(compareAtCandidate.amount) > Number(price.amount) ? compareAtCandidate : null;

  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description,
    availableForSale: raw.availableForSale,
    featuredImage: raw.featuredImage,
    images: raw.images.nodes,
    options: raw.options.map((option) => ({
      id: option.id,
      name: option.name,
      values: option.optionValues.map((value) => value.name),
    })),
    variants: raw.variants.nodes,
    price,
    compareAtPrice,
  };
}

// Fetches everything the product page's component tree needs in one
// request. Returns null on a missing handle, a GraphQL error, or a request
// failure — page.tsx treats all three the same way (notFound()).
export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  try {
    const { data, errors } = await shopifyClient.request(GET_PRODUCT, {
      variables: { handle },
    });

    if (errors) {
      console.error("Shopify getProduct error:", errors);
      return null;
    }

    const raw = (data as { product: RawProduct | null } | undefined)?.product;
    return raw ? mapProduct(raw) : null;
  } catch (error) {
    console.error("Shopify getProduct request failed:", error);
    return null;
  }
}
