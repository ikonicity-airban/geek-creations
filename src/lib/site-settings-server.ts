// lib/site-settings-server.ts - Server-side utility to fetch site settings
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export interface SiteSettingsServer {
  siteName: string;
  siteSlogan: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  contactPhone: string;
  supportEmail: string;
  instagramUrl: string;
  twitterUrl: string;
  facebookUrl: string;
  businessAddress: string;
  businessCity: string;
  businessCountry: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  enableNewsletter: boolean;
  enableBlog: boolean;
  enableReviews: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

const DEFAULT_SETTINGS: SiteSettingsServer = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Geeks Creation",
  siteSlogan:
    process.env.NEXT_PUBLIC_SITE_SLOGAN || "Made by nerds. Worn by legends.",
  siteDescription:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "Premium Nigerian print-on-demand store for nerds, artists & dreamers. Shop exclusive anime, tech, and Afro-geek designs on T-shirts, hoodies, mugs & more.",
  logoUrl: process.env.NEXT_PUBLIC_LOGO_URL || "/logo.png",
  faviconUrl: process.env.NEXT_PUBLIC_FAVICON_URL || "/favicon.ico",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@geekcreations.com",
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+234 800 000 0000",
  supportEmail:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@geekcreations.com",
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
    "https://instagram.com/geekcreations",
  twitterUrl:
    process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com/geekcreations",
  facebookUrl:
    process.env.NEXT_PUBLIC_FACEBOOK_URL ||
    "https://facebook.com/geekcreations",
  businessAddress:
    process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || "123 Tech Street",
  businessCity: process.env.NEXT_PUBLIC_BUSINESS_CITY || "Lagos",
  businessCountry: process.env.NEXT_PUBLIC_BUSINESS_COUNTRY || "Nigeria",
  metaTitle:
    process.env.NEXT_PUBLIC_META_TITLE ||
    "Geek Creations - Nigerian Geek Culture Store | Anime, Tech & Afro-Geek Merch",
  metaDescription:
    process.env.NEXT_PUBLIC_META_DESCRIPTION ||
    "Premium Nigerian print-on-demand store for nerds, artists & dreamers. Shop exclusive anime, tech, and Afro-geek designs on T-shirts, hoodies, mugs & more. Pay with crypto (USDC/SOL) or Naira.",
  metaKeywords:
    process.env.NEXT_PUBLIC_META_KEYWORDS ||
    "Nigerian geek store, anime merchandise Nigeria, tech clothing Lagos, Afro-geek fashion, print on demand Nigeria, custom T-shirts Lagos",
  enableNewsletter: process.env.NEXT_PUBLIC_ENABLE_NEWSLETTER !== "false",
  enableBlog: process.env.NEXT_PUBLIC_ENABLE_BLOG === "true",
  enableReviews: process.env.NEXT_PUBLIC_ENABLE_REVIEWS !== "false",
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#401268",
  secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR || "#c5a3ff",
  accentColor: process.env.NEXT_PUBLIC_ACCENT_COLOR || "#e2ae3d",
};

let cachedSettings: SiteSettingsServer | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getSiteSettings(): Promise<SiteSettingsServer> {
  // Return cached settings if still valid
  const now = Date.now();
  if (cachedSettings && now - cacheTimestamp < CACHE_DURATION) {
    return cachedSettings;
  }

  try {
    const allSettings = await db
      .select({
        key: siteSettings.key,
        value: siteSettings.value,
        type: siteSettings.type,
      })
      .from(siteSettings)
      .where(eq(siteSettings.isPublic, true));

    const settingsObject: Partial<SiteSettingsServer> = {};

    for (const setting of allSettings) {
      let value: unknown = setting.value || "";

      if (setting.type === "number") {
        value = parseFloat(setting.value || "0");
      } else if (setting.type === "boolean") {
        value = setting.value === "true";
      } else if (setting.type === "json") {
        try {
          value = JSON.parse(setting.value || "{}");
        } catch {
          value = {};
        }
      }

      const key = setting.key as keyof SiteSettingsServer;
      if (key in DEFAULT_SETTINGS) {
        (settingsObject as Record<string, unknown>)[key] = value;
      }
    }

    // Merge with defaults
    cachedSettings = { ...DEFAULT_SETTINGS, ...settingsObject };
    cacheTimestamp = now;

    return cachedSettings;
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    return DEFAULT_SETTINGS;
  }
}

// Invalidate cache (call this when settings are updated)
export function invalidateSiteSettingsCache() {
  cachedSettings = null;
  cacheTimestamp = 0;
}
