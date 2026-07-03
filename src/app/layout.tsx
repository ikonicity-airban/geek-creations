// app/layout.tsx - UPDATED WITH DYNAMIC METADATA
import type { Viewport } from "next";
import {
  Orbitron,
  Poppins,
  Space_Mono,
  Over_the_Rainbow,
  Roboto,
} from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { CartProvider } from "@/lib/cart-context";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import { Toaster } from "sonner";
import {
  generateSiteMetadata,
  generateStructuredData,
} from "@/lib/metadata-generator";

const poppins = Roboto({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
});

const overTheRainbow = Over_the_Rainbow({
  variable: "--font-over-the-rainbow",
  subsets: ["latin"],
  weight: ["400"],
  adjustFontFallback: false,
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f6f0" },
    { media: "(prefers-color-scheme: dark)", color: "#401268" },
  ],
};

// Generate metadata dynamically from site settings
export async function generateMetadata() {
  return await generateSiteMetadata();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch structured data for JSON-LD
  const structuredData = await generateStructuredData();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data (JSON-LD) - Dynamically generated */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${poppins.variable} ${orbitron.variable} ${spaceMono.variable} ${overTheRainbow.variable} antialiased `}
      >
        <SiteSettingsProvider>
          <SearchProvider>
            <LocaleProvider>
              <CartProvider>
                {children}
                <Toaster position="top-right" richColors />
              </CartProvider>
            </LocaleProvider>
          </SearchProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
