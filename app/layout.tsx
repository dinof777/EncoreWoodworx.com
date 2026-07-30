import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Fraunces } from "next/font/google";
import "./globals.css";
import { PreviewSwitcher } from "@/components/PreviewSwitcher";
import { BasketProvider } from "@/components/BasketProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // florabrothers.com serves this same deployment, so Google sees two byte-identical
  // sites. metadataBase pins absolute URLs (OG images, and any per-page canonical) to the
  // real domain. NOT a blanket `alternates.canonical` here — set in a root layout it
  // applies "/" to every route, telling Google /services is a duplicate of the homepage.
  // The proper fix for the duplicate domain is a redirect; see SITE.md.
  metadataBase: new URL("https://encorewoodworx.com"),
  title: "Encore Woodworx — Handcrafted Wooden Furnishings",
  description:
    "One shop, one pair of hands. Bespoke epoxy tables, live-edge furniture, sliding barn doors, custom countertops and more — handcrafted for your home or business.",
  openGraph: {
    title: "Encore Woodworx — Handcrafted Wooden Furnishings",
    description:
      "Bespoke epoxy tables, live-edge furniture, sliding barn doors, custom countertops and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${cormorant.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <BasketProvider>
          {children}
          <PreviewSwitcher />
        </BasketProvider>
      </body>
    </html>
  );
}
