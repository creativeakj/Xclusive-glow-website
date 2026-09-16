/**
 * Department links point at Shopify collection handles. Create matching
 * collections in Shopify Admin (handles: beauty, women, men, kids) for
 * these to resolve — until then the collection page shows a clean 404.
 */
export const DEPARTMENT_LINKS = [
  { href: "/collections/beauty", label: "Beauty" },
  { href: "/collections/women", label: "Women" },
  { href: "/collections/men", label: "Men" },
  { href: "/collections/kids", label: "Kids" },
] as const;

export const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  ...DEPARTMENT_LINKS,
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/best-sellers", label: "Best Sellers" },
  { href: "/offers", label: "Offers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
