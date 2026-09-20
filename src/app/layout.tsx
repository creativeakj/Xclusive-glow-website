import type { Metadata } from "next";
import { Instrument_Serif, Work_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { WishlistProvider } from "@/components/wishlist-provider";
import { shopifyConfig } from "@/lib/shopify/env";
import { defaultDescription, siteName } from "@/lib/seo";
import {
  GoogleTagManagerNoScript,
  GoogleTagManagerScript,
} from "@/components/google-tag-manager";

const displayFont = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const bodyFont = Work_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const description = defaultDescription;

export const metadata: Metadata = {
  metadataBase: new URL(shopifyConfig.siteUrl),
  title: {
    default: `${siteName} | Luxury Beauty & Fashion`,
    template: `%s | ${siteName}`,
  },
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName,
    title: `${siteName} | Luxury Beauty & Fashion`,
    description,
    url: "/",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Luxury Beauty & Fashion`,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <GoogleTagManagerScript />
        <GoogleTagManagerNoScript />
        <ThemeProvider>
          <WishlistProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <Toaster />
          </WishlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
