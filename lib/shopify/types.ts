// Shared types for the global brand/navigation data layer (lib/shopify/global.ts).
// Kept separate from lib/shopify/products.ts's types since those model
// catalog data, not shop-wide branding/navigation.

export type NavLink = {
  href: string;
  label: string;
};

// The Storefront API has no dedicated "logo" concept beyond Shop.brand,
// which most stores (including this one, currently) haven't uploaded a logo
// to. This discriminated union lets components render either case without
// caring where the image ultimately comes from — swapping the "image"
// branch's source to Shopify Files or a Metaobject later is a change to
// getShopLogo() only.
export type ShopLogo =
  | { type: "image"; url: string; altText: string | null }
  | { type: "text"; text: string };

export type FooterMenuColumn = {
  title: string;
  links: NavLink[];
};

export type ShopPolicyLink = {
  title: string;
  url: string;
};

export type ShopPolicies = {
  privacyPolicy: ShopPolicyLink | null;
  refundPolicy: ShopPolicyLink | null;
  shippingPolicy: ShopPolicyLink | null;
  termsOfService: ShopPolicyLink | null;
};

export type SocialPlatform = "instagram" | "tiktok" | "youtube";

export type SocialLink = {
  platform: SocialPlatform;
  href: string;
};

export type GlobalShopData = {
  shopName: string;
  logo: ShopLogo;
  mainMenu: NavLink[];
  drawerMenu: NavLink[];
  footerMenu: FooterMenuColumn[];
  policies: ShopPolicies;
  socialLinks: SocialLink[];
};
