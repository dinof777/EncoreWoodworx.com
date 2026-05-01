import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Fraunces } from "next/font/google";
import "./globals.css";
import { PreviewSwitcher } from "@/components/PreviewSwitcher";

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
  title: "Encore Woodworx — Handcrafted Wooden Furnishings",
  description:
    "Five brothers, one shop. Bespoke epoxy tables, live-edge furniture, sliding barn doors, custom countertops and more — handcrafted for your home or business.",
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
        {children}
        <PreviewSwitcher />
      </body>
    </html>
  );
}
