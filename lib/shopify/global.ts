import { cache } from "react";
import { shopifyClient } from "@/lib/shopify/client";
import { GET_GLOBAL_SHOP_DATA, GET_SOCIAL_LINK_METAOBJECTS } from "@/lib/shopify/queries";
import type {
  FooterMenuColumn,
  GlobalShopData,
  NavLink,
  ShopLogo,
  ShopPolicies,
  ShopPolicyLink,
  SocialLink,
  SocialPlatform,
} from "@/lib/shopify/types";

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;

// Shopify's menu API always returns absolute URLs (the shop's *.myshopify.com
// or primary domain). Internal links need to stay relative so Next.js's
// <Link> can client-side route them instead of forcing a full navigation
// to another host; genuinely external URLs pass through untouched.
function toRelativeHref(url: string): string {
  if (!STORE_DOMAIN) return url;
  try {
    const parsed = new URL(url);
    const storeHost = STORE_DOMAIN.replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (parsed.hostname === storeHost || parsed.hostname.endsWith(".myshopify.com")) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}` || "/";
    }
    return url;
  } catch {
    return url;
  }
}

// --- Fallback content ----------------------------------------------------
// The site's current, designed navigation. Used whenever Shopify has no
// data for a field (logo, social links, unset policies) and — for
// mainMenu/footerMenu specifically — whenever the content-ops gates below
// are off. This is what keeps production visuals unchanged while Shopify
// Admin content catches up to the site's intended IA.

const FALLBACK_SHOP_NAME = "Volrep";

const FALLBACK_MAIN_MENU: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/products/volrep-prm", label: "Shop" },
  { href: "/#recovery-philosophy-heading", label: "Recovery" },
  { href: "/#faq-heading", label: "Support" },
];

const FALLBACK_DRAWER_MENU: NavLink[] = [
  { href: "/products/volrep-prm", label: "Shop" },
  { href: "/#why-volrep-heading", label: "Technology" },
  { href: "/#recovery-philosophy-heading", label: "Recovery" },
  { href: "#", label: "About" },
  { href: "#", label: "Contact" },
  { href: "/#faq-heading", label: "FAQ" },
];

const FALLBACK_FOOTER_MENU: FooterMenuColumn[] = [
  {
    title: "Shop",
    links: [
      { href: "/products/volrep-prm", label: "Products" },
      { href: "/#why-volrep-heading", label: "Technology" },
      { href: "/#recovery-philosophy-heading", label: "Recovery" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns" },
      { href: "/#faq-heading", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#", label: "About" },
      { href: "#", label: "Journal" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

const FALLBACK_SOCIAL_LINKS: SocialLink[] = [
  { platform: "instagram", href: "#" },
  { platform: "tiktok", href: "#" },
  { platform: "youtube", href: "#" },
];

// --- Content-ops readiness gates ------------------------------------------
// Shopify Admin already exposes "main-menu" and "footer" menu handles, but
// their current content is placeholder — main-menu has "Home / Catalog /
// Contact" instead of this site's "Home / Shop / Recovery / Support", and
// footer has one flat "Search" item instead of grouped Shop/Support/Company
// columns. Flip these to true once Shopify Admin > Navigation has been
// updated to match the intended IA — the query already fetches the right
// shape (including nested items for footer columns), no other code changes
// needed.
const USE_SHOPIFY_MAIN_MENU = false;
const USE_SHOPIFY_FOOTER_MENU = false;

type RawGlobalShopData = {
  shop: {
    name: string;
    brand: { logo: { image: { url: string; altText: string | null } | null } | null } | null;
    privacyPolicy: ShopPolicyLink | null;
    refundPolicy: ShopPolicyLink | null;
    shippingPolicy: ShopPolicyLink | null;
    termsOfService: ShopPolicyLink | null;
  } | null;
  mainMenu: { items: { title: string; url: string }[] } | null;
  footerMenu: {
    items: { title: string; url: string; items: { title: string; url: string }[] }[];
  } | null;
};

// React's cache() dedupes this per request — Header and Footer both need
// shop/menu data, but that's one GraphQL round trip, not two.
const fetchRawGlobalShopData = cache(async (): Promise<RawGlobalShopData | null> => {
  try {
    const { data, errors } = await shopifyClient.request(GET_GLOBAL_SHOP_DATA);

    if (errors) {
      console.error("Shopify getGlobalShopData error:", errors);
      return null;
    }

    return (data as RawGlobalShopData | undefined) ?? null;
  } catch (error) {
    console.error("Shopify getGlobalShopData request failed:", error);
    return null;
  }
});

const fetchSocialLinkMetaobjects = cache(async (): Promise<SocialLink[]> => {
  try {
    const { data, errors } = await shopifyClient.request(GET_SOCIAL_LINK_METAOBJECTS, {
      variables: { first: 10 },
    });

    if (errors) {
      console.error("Shopify getSocialLinks error:", errors);
      return [];
    }

    const nodes = (
      data as { metaobjects: { nodes: { fields: { key: string; value: string }[] }[] } } | undefined
    )?.metaobjects?.nodes;
    if (!nodes?.length) return [];

    const links: SocialLink[] = [];
    for (const node of nodes) {
      const fields = Object.fromEntries(node.fields.map((field) => [field.key, field.value]));
      const platform = fields.platform as SocialPlatform | undefined;
      const href = fields.url;
      if (platform && href) links.push({ platform, href });
    }
    return links;
  } catch (error) {
    console.error("Shopify getSocialLinks request failed:", error);
    return [];
  }
});

export async function getShopName(): Promise<string> {
  const raw = await fetchRawGlobalShopData();
  return (raw?.shop?.name || FALLBACK_SHOP_NAME).toUpperCase();
}

export async function getShopLogo(): Promise<ShopLogo> {
  const raw = await fetchRawGlobalShopData();
  const image = raw?.shop?.brand?.logo?.image;

  if (image?.url) {
    return { type: "image", url: image.url, altText: image.altText };
  }

  // No logo image configured in Shopify (Files/Metaobjects can populate
  // brand.logo later without any component change) — render the wordmark.
  return { type: "text", text: await getShopName() };
}

export async function getMainMenu(): Promise<NavLink[]> {
  if (!USE_SHOPIFY_MAIN_MENU) return FALLBACK_MAIN_MENU;

  const raw = await fetchRawGlobalShopData();
  const items = raw?.mainMenu?.items;
  if (!items?.length) return FALLBACK_MAIN_MENU;

  return items.map((item) => ({ label: item.title, href: toRelativeHref(item.url) }));
}

export async function getDrawerMenu(): Promise<NavLink[]> {
  // The mobile drawer's link set is intentionally broader than the desktop
  // bar and has no Shopify menu handle of its own yet — it rides on
  // FALLBACK_DRAWER_MENU until a dedicated handle is introduced.
  return FALLBACK_DRAWER_MENU;
}

export async function getFooterMenu(): Promise<FooterMenuColumn[]> {
  if (USE_SHOPIFY_FOOTER_MENU) {
    const raw = await fetchRawGlobalShopData();
    const items = raw?.footerMenu?.items;
    if (items?.length) {
      return items.map((item) => ({
        title: item.title,
        links: item.items.map((link) => ({ label: link.title, href: toRelativeHref(link.url) })),
      }));
    }
  }

  // Privacy/Terms/Shipping/Returns now resolve to this site's own
  // first-party pages (app/privacy, app/terms, app/shipping, app/returns)
  // rather than Shopify's auto-generated hosted policy pages — so these
  // fallback links are authoritative and intentionally not overwritten by
  // live Shopify policy URLs the way they used to be.
  return FALLBACK_FOOTER_MENU;
}

export async function getShopPolicies(): Promise<ShopPolicies> {
  const raw = await fetchRawGlobalShopData();
  return {
    privacyPolicy: raw?.shop?.privacyPolicy ?? null,
    refundPolicy: raw?.shop?.refundPolicy ?? null,
    shippingPolicy: raw?.shop?.shippingPolicy ?? null,
    termsOfService: raw?.shop?.termsOfService ?? null,
  };
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const links = await fetchSocialLinkMetaobjects();
  return links.length ? links : FALLBACK_SOCIAL_LINKS;
}

export const getGlobalShopData = cache(async (): Promise<GlobalShopData> => {
  const [shopName, logo, mainMenu, drawerMenu, footerMenu, policies, socialLinks] = await Promise.all([
    getShopName(),
    getShopLogo(),
    getMainMenu(),
    getDrawerMenu(),
    getFooterMenu(),
    getShopPolicies(),
    getSocialLinks(),
  ]);

  return { shopName, logo, mainMenu, drawerMenu, footerMenu, policies, socialLinks };
});
