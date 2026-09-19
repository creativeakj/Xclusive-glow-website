import type { Metadata } from "next";

export const siteName = "Xclusive Glow";
export const defaultDescription =
  "Shop curated luxury beauty, women's, men's and kids' fashion at Xclusive Glow.";

// Per-page metadata helper: Next.js shallow-merges metadata across segments,
// so a page that sets its own `openGraph` replaces the layout's entirely
// (see generate-metadata.md "Merging"). This keeps siteName/card defaults
// consistent everywhere that needs a canonical URL or OG tags of its own.
export function pageMetadata({
  title,
  description = defaultDescription,
  path,
}: {
  title: string;
  description?: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      siteName,
      title,
      description,
      url: path,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
