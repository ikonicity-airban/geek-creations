// lib/metadata-generator.ts - Dynamic metadata generation from site settings
import { Metadata } from "next";
import { getSiteSettings } from "./site-settings-server";

export async function generateSiteMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://geekcreations.com";
  const creatorName =
    process.env.NEXT_PUBLIC_CREATOR_NAME || "CodeOven Technologies";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.metaTitle,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.metaDescription,
    keywords: settings.metaKeywords.split(",").map((k) => k.trim()),
    authors: [{ name: settings.siteName, url: siteUrl }],
    creator: creatorName,
    publisher: settings.siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: process.env.NEXT_PUBLIC_OG_LOCALE || "en_NG",
      url: siteUrl,
      siteName: settings.siteName,
      title: settings.metaTitle,
      description: settings.siteDescription,
      images: [
        {
          url: process.env.NEXT_PUBLIC_OG_IMAGE || "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${settings.siteName} - Nigerian Geek Store`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.metaTitle,
      description: settings.metaDescription,
      images: [process.env.NEXT_PUBLIC_TWITTER_IMAGE || "/twitter-image.png"],
      creator: process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@geekcreations",
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
        { url: settings.faviconUrl || "/favicon.ico" },
        { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png" }],
    },
    alternates: {
      canonical: siteUrl,
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || "",
    },
  };
}

export async function generateStructuredData() {
  const settings = await getSiteSettings();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://geekcreations.com";
  const priceRange = process.env.NEXT_PUBLIC_PRICE_RANGE || "₦5,000 - ₦50,000";
  const currencies =
    process.env.NEXT_PUBLIC_CURRENCIES_ACCEPTED || "NGN, USDC, SOL";

  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: settings.siteName,
    description: settings.siteDescription,
    url: siteUrl,
    logo: `${siteUrl}${settings.logoUrl}`,
    image: `${siteUrl}${process.env.NEXT_PUBLIC_OG_IMAGE || "/og-image.png"}`,
    priceRange: priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.businessAddress,
      addressLocality: settings.businessCity,
      addressCountry: settings.businessCountry,
    },
    paymentAccepted: ["Cash", "Credit Card", "Cryptocurrency"],
    currenciesAccepted: currencies,
    openingHours: process.env.NEXT_PUBLIC_OPENING_HOURS || "Mo-Su 00:00-23:59",
    telephone: settings.contactPhone,
    email: settings.contactEmail,
    sameAs: [settings.instagramUrl, settings.twitterUrl, settings.facebookUrl],
  };
}
