// app/layout.tsx - UPDATED WITH CART PROVIDER
import type { Metadata, Viewport } from "next";
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
import { Toaster } from "sonner";

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
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400"],
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

export const metadata: Metadata = {
  metadataBase: new URL("https://geekcreations.com"),
  title: {
    default:
      "Geek Creations - Nigerian Geek Culture Store | Anime, Tech & Afro-Geek Merch",
    template: "%s | Geek Creations",
  },
  description:
    "Premium Nigerian print-on-demand store for nerds, artists & dreamers. Shop exclusive anime, tech, and Afro-geek designs on T-shirts, hoodies, mugs & more. Pay with crypto (USDC/SOL) or Naira.",
  keywords: [
    "Nigerian geek store",
    "anime merchandise Nigeria",
    "tech clothing Lagos",
    "Afro-geek fashion",
    "print on demand Nigeria",
    "custom T-shirts Lagos",
    "crypto payment store",
    "USDC payment Nigeria",
    "Solana payment",
    "geek culture Africa",
  ],
  authors: [{ name: "Geek Creations", url: "https://geekcreations.com" }],
  creator: "CodeOven Technologies",
  publisher: "Geek Creations",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://geekcreations.com",
    siteName: "Geek Creations",
    title: "Geek Creations - Nigerian Geek Culture Store",
    description:
      "Where Nigerian nerds, artists & dreamers turn wild ideas into wearable legends. Shop anime, tech & Afro-geek designs.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Geek Creations - Nigerian Geek Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Geek Creations - Nigerian Geek Culture Store",
    description:
      "Premium anime, tech & Afro-geek merch. Pay with crypto or Naira. Made in Nigeria.",
    images: ["/twitter-image.png"],
    creator: "@geekcreations",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  alternates: {
    canonical: "https://geekcreations.com",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data (JSON-LD) */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "Geek Creations",
              description:
                "Premium Nigerian print-on-demand store for geek culture",
              url: "https://geekcreations.com",
              logo: "https://geekcreations.com/logo.png",
              image: "https://geekcreations.com/og-image.png",
              priceRange: "₦5,000 - ₦50,000",
              address: {
                "@type": "PostalAddress",
                addressCountry: "NG",
                addressLocality: "Lagos",
              },
              paymentAccepted: ["Cash", "Credit Card", "Cryptocurrency"],
              currenciesAccepted: "NGN, USDC, SOL",
              openingHours: "Mo-Su 00:00-23:59",
              telephone: "+234-XXX-XXX-XXXX",
              email: "hello@geekcreations.com",
              sameAs: [
                "https://instagram.com/geekcreations",
                "https://twitter.com/geekcreations",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${poppins.variable} ${orbitron.variable} ${spaceMono.variable} ${overTheRainbow.variable} antialiased `}
      >
        <CartProvider>
          {children}
          <Toaster position="top-right" richColors />
        </CartProvider>
      </body>
    </html>
  );
}
