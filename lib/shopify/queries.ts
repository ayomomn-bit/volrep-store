export const GET_PRODUCT = `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
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