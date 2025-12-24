"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CONFIG } from "@/lib/config";

export interface SiteSettings {
  // Branding
  siteName: string;
  siteSlogan: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;

  // Contact
  contactEmail: string;
  contactPhone: string;
  supportEmail: string;

  // Social Media
  instagramUrl: string;
  twitterUrl: string;
  facebookUrl: string;

  // Business Info
  businessAddress: string;
  businessCity: string;
  businessCountry: string;

  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;

  // Features
  enableNewsletter: boolean;
  enableBlog: boolean;
  enableReviews: boolean;

  // Colors (optional - can override theme)
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(
  undefined,
);

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: CONFIG.SITE.name,
  siteSlogan: CONFIG.SITE.slogan,
  siteDescription: CONFIG.SITE.description,
  logoUrl: CONFIG.SITE.logoUrl,
  faviconUrl: CONFIG.SITE.faviconUrl,
  contactEmail: CONFIG.CONTACT.email,
  contactPhone: CONFIG.CONTACT.phone,
  supportEmail: CONFIG.CONTACT.supportEmail,
  instagramUrl: CONFIG.SOCIAL.instagram,
  twitterUrl: CONFIG.SOCIAL.twitter,
  facebookUrl: CONFIG.SOCIAL.facebook,
  businessAddress: CONFIG.BUSINESS.address,
  businessCity: CONFIG.BUSINESS.city,
  businessCountry: CONFIG.BUSINESS.country,
  metaTitle: CONFIG.SEO.title,
  metaDescription: CONFIG.SEO.description,
  metaKeywords: CONFIG.SEO.keywords,
  enableNewsletter: CONFIG.FEATURES.newsletter,
  enableBlog: CONFIG.FEATURES.blog,
  enableReviews: CONFIG.FEATURES.reviews,
  primaryColor: CONFIG.THEME.primaryColor,
  secondaryColor: CONFIG.THEME.secondaryColor,
  accentColor: CONFIG.THEME.accentColor,
};

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
        }
      }
    } catch (error) {
      console.error("Failed to fetch site settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings({ ...settings, ...data.settings });
        }
      }
    } catch (error) {
      console.error("Failed to update site settings:", error);
      throw error;
    }
  };

  const refreshSettings = async () => {
    setIsLoading(true);
    await fetchSettings();
  };

  const value: SiteSettingsContextType = {
    settings,
    isLoading,
    updateSettings,
    refreshSettings,
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useSiteSettings must be used within a SiteSettingsProvider",
    );
  }
  return context;
}
