// Full product detail for app/products/[handle] — everything ProductHero's
// subtree needs (gallery images, every option/variant for VariantPicker,
// and both the display price and the per-variant prices AddToCart/
// ProductPrice will switch between once variant selection is wired up).
export const GET_PRODUCT = `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      availableForSale
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 10) {
        nodes {
          url
          altText
          width
          height
        }
      }
      options {
        id
        name
        optionValues {
          name
        }
      }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

export const GET_PRODUCTS = `
  query GetProducts($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        id
        title
        handle
        productType
        tags
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

// Shop name, logo, policies, and both navigation menus in one request —
// these all render together in Header/Footer on every page, so one
// combined query (deduped per-request by getGlobalShopData's React cache())
// is cheaper than four separate round trips.
export const GET_GLOBAL_SHOP_DATA = `
  query GetGlobalShopData {
    shop {
      name
      brand {
        logo {
          image {
            url
            altText
          }
        }
      }
      privacyPolicy {
        title
        url
      }
      refundPolicy {
        title
        url
      }
      shippingPolicy {
        title
        url
      }
      termsOfService {
        title
        url
      }
    }
    mainMenu: menu(handle: "main-menu") {
      items {
        title
        url
      }
    }
    footerMenu: menu(handle: "footer") {
      items {
        title
        url
        items {
          title
          url
        }
      }
    }
  }
`;

// Shared shape for every cart read/mutation below, so cartCreate,
// cartLinesAdd, cartLinesUpdate, cartLinesRemove, and a plain cart lookup
// all return an identically-structured Cart and can share one mapper
// (lib/shopify/cart.ts's mapCart) instead of five slightly different ones.
const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
              width
              height
            }
            price {
              amount
              currencyCode
            }
            product {
              title
              handle
            }
          }
        }
      }
    }
  }
`;

export const CREATE_CART = `
  ${CART_FRAGMENT}
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const GET_CART = `
  ${CART_FRAGMENT}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
`;

export const CART_LINES_ADD = `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_UPDATE = `
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_REMOVE = `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Social links have no first-class field on Shop — this targets a
// Metaobject definition (handle-typed "social_link") that doesn't exist in
// this store yet. Returns an empty node list rather than an error when the
// definition is missing, which getSocialLinks() treats the same as "no data".
export const GET_SOCIAL_LINK_METAOBJECTS = `
  query GetSocialLinkMetaobjects($first: Int!) {
    metaobjects(type: "social_link", first: $first) {
      nodes {
        fields {
          key
          value
        }
      }
    }
  }
`;