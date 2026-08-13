// Temporary navigation structure. The final information architecture
// (collections, advertorial hubs, informational pages, etc.) has not been
// defined yet — update this list as the site's IA is decided.
export type NavLink = {
  href: string;
  label: string;
};

// Primary desktop nav — kept short and destination-driven. "Recovery" and
// "Support" point at existing homepage sections (same anchors Footer uses)
// since standalone pages don't exist yet.
export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/products/volrep-prm", label: "Shop" },
  { href: "/#recovery-philosophy-heading", label: "Recovery" },
  { href: "/#faq-heading", label: "Support" },
];

// Mobile drawer nav — deliberately broader than the desktop bar (mirrors
// Footer's Shop/Support/Company groupings as a flat list). "About" and
// "Contact" have no destination yet, so they stay "#" until those pages
// exist, matching the placeholder convention already used in Footer.
export const DRAWER_LINKS: NavLink[] = [
  { href: "/products/volrep-prm", label: "Shop" },
  { href: "/#why-volrep-heading", label: "Technology" },
  { href: "/#recovery-philosophy-heading", label: "Recovery" },
  { href: "#", label: "About" },
  { href: "#", label: "Contact" },
  { href: "/#faq-heading", label: "FAQ" },
];
