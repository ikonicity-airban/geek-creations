// lib/config.ts - Centralized configuration for all environment variables

/**
 * Application configuration
 * All environment variables are accessed through this config object
 */
export const CONFIG = {
  // App Information
  APP: {
    url: process.env.NEXT_PUBLIC_APP_URL || "https://geek-creations.vercel.app",
    editor: process.env.REACT_EDITOR || "cursor",
  },

  // Site Configuration
  SITE: {
    name: process.env.NEXT_PUBLIC_SITE_NAME || "Geek Creations",
    slogan: process.env.NEXT_PUBLIC_SITE_SLOGAN || "Create it. Shop it. Wear it",
    description:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
      "Premium Nigerian print-on-demand store for nerds, artists & dreamers.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://geek-creations.vercel.app",
    logoUrl: process.env.NEXT_PUBLIC_LOGO_URL || "/logo-christmas.png",
    faviconUrl: process.env.NEXT_PUBLIC_FAVICON_URL || "/favicon.ico",
    email: process.env.NEXT_PUBLIC_SITE_EMAIL || "noreply@geekcreations.com",
  },

  // Contact Information
  CONTACT: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@geekcreations.com",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+234 800 000 0000",
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@geekcreations.com",
  },

  // Social Media
  SOCIAL: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/geekcreations",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com/geekcreations",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/geekcreations",
    twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@geekcreations",
  },

  // Business Information
  BUSINESS: {
    address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || "123 Tech Street",
    city: process.env.NEXT_PUBLIC_BUSINESS_CITY || "Lagos",
    country: process.env.NEXT_PUBLIC_BUSINESS_COUNTRY || "Nigeria",
    priceRange: process.env.NEXT_PUBLIC_PRICE_RANGE || "₦5,000 - ₦50,000",
    currenciesAccepted: process.env.NEXT_PUBLIC_CURRENCIES_ACCEPTED || "NGN, USDC, SOL",
    openingHours: process.env.NEXT_PUBLIC_OPENING_HOURS || "Mo-Su 00:00-23:59",
    creatorName: process.env.NEXT_PUBLIC_CREATOR_NAME || "CodeOven Technologies",
  },

  // SEO & Metadata
  SEO: {
    title:
      process.env.NEXT_PUBLIC_META_TITLE ||
      "Geek Creations - Nigerian Geek Culture Store",
    description:
      process.env.NEXT_PUBLIC_META_DESCRIPTION ||
      "Premium Nigerian print-on-demand store for nerds, artists & dreamers.",
    keywords:
      process.env.NEXT_PUBLIC_META_KEYWORDS ||
      "Nigerian geek store, anime merchandise Nigeria, tech clothing Lagos",
    ogImage: process.env.NEXT_PUBLIC_OG_IMAGE || "/og-image.png",
    twitterImage: process.env.NEXT_PUBLIC_TWITTER_IMAGE || "/twitter-image.png",
    ogLocale: process.env.NEXT_PUBLIC_OG_LOCALE || "en_NG",
    googleVerification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
    yandexVerification: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || "",
  },

  // Theme Colors
  THEME: {
    primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#401268",
    secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR || "#c5a3ff",
    accentColor: process.env.NEXT_PUBLIC_ACCENT_COLOR || "#e2ae3d",
  },

  // Feature Flags
  FEATURES: {
    newsletter: process.env.NEXT_PUBLIC_ENABLE_NEWSLETTER === "true",
    blog: process.env.NEXT_PUBLIC_ENABLE_BLOG === "true",
    reviews: process.env.NEXT_PUBLIC_ENABLE_REVIEWS === "true",
  },

  // Database (Supabase)
  DATABASE: {
    url: process.env.DATABASE_URL || "",
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "",
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  },

  // Shopify
  SHOPIFY: {
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN || "",
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN || "",
    clientId: process.env.SHOPIFY_Client_ID || "",
    webhookSecret: process.env.SHOPIFY_WEBHOOK_SECRET || "",
    currencyCode: process.env.SHOPIFY_CURRENCY_CODE || "NGN",
  },

  // POD Providers
  POD: {
    printful: {
      apiKey: process.env.PRINTFUL_API_KEY || "",
    },
    printify: {
      apiKey: process.env.PRINTIFY_API_KEY || "",
      shopId: process.env.PRINTIFY_SHOP_ID || "",
    },
    ikonshop: {
      apiKey: process.env.IKONSHOP_API_KEY || "",
    },
  },

  // Payment Gateways
  PAYMENT: {
    provider: process.env.PAYMENT_PROVIDER || "paystack",
    paystack: {
      secretKey: process.env.PAYSTACK_SECRET_KEY || "",
      publicKey: process.env.PAYSTACK_PUBLIC_KEY || "",
    },
    flutterwave: {
      secretKey: process.env.FLUTTERWAVE_SECRET_KEY || "",
      publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY || "",
      encryptionKey: process.env.FLUTTERWAVE_ENCRYPTION_KEY || "",
    },
    monnify: {
      apiKey: process.env.MONIFY_API_KEY || "",
      secretKey: process.env.MONIFY_SECRET_KEY || "",
      walletAccountNumber: process.env.MONIFY_WALLET_ACCOUNT_NUMBER || "",
      businessCode: process.env.MONIFY_BUSINESS_CODE || "",
    },
  },

  // Email (EmailJS)
  EMAIL: {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "",
  },

  // Crypto Payment
  CRYPTO: {
    circle: {
      apiKey: process.env.CIRCLE_API_KEY || "",
    },
    solana: {
      rpcUrl: process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
    },
  },

  // Analytics
  ANALYTICS: {
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || "",
    facebookPixelId: process.env.FACEBOOK_PIXEL_ID || "",
  },

  // Cron & Security
  CRON: {
    secret: process.env.CRON_SECRET || "",
  },
} as const;

/**
 * Helper functions for configuration
 */
export const ConfigHelpers = {
  /**
   * Check if running in production
   */
  isProduction: () => process.env.NODE_ENV === "production",

  /**
   * Check if running in development
   */
  isDevelopment: () => process.env.NODE_ENV === "development",

  /**
   * Check if Shopify is configured
   */
  isShopifyConfigured: () =>
    !!CONFIG.SHOPIFY.storeDomain && !!CONFIG.SHOPIFY.accessToken,

  /**
   * Check if Supabase is configured
   */
  isSupabaseConfigured: () =>
    !!CONFIG.DATABASE.supabaseUrl && !!CONFIG.DATABASE.supabaseAnonKey,

  /**
   * Check if EmailJS is configured
   */
  isEmailConfigured: () =>
    !!CONFIG.EMAIL.serviceId &&
    !!CONFIG.EMAIL.templateId &&
    !!CONFIG.EMAIL.publicKey,

  /**
   * Check if specific POD provider is configured
   */
  isPodConfigured: (provider: "printful" | "printify" | "ikonshop") => {
    switch (provider) {
      case "printful":
        return !!CONFIG.POD.printful.apiKey;
      case "printify":
        return !!CONFIG.POD.printify.apiKey && !!CONFIG.POD.printify.shopId;
      case "ikonshop":
        return !!CONFIG.POD.ikonshop.apiKey;
      default:
        return false;
    }
  },

  /**
   * Check if specific payment provider is configured
   */
  isPaymentConfigured: (provider: "paystack" | "flutterwave" | "monnify") => {
    switch (provider) {
      case "paystack":
        return (
          !!CONFIG.PAYMENT.paystack.secretKey &&
          !!CONFIG.PAYMENT.paystack.publicKey
        );
      case "flutterwave":
        return (
          !!CONFIG.PAYMENT.flutterwave.secretKey &&
          !!CONFIG.PAYMENT.flutterwave.publicKey
        );
      case "monnify":
        return (
          !!CONFIG.PAYMENT.monnify.apiKey &&
          !!CONFIG.PAYMENT.monnify.secretKey
        );
      default:
        return false;
    }
  },

  /**
   * Get active payment provider
   */
  getActivePaymentProvider: () => {
    const provider = CONFIG.PAYMENT.provider;
    if (
      provider === "flutterwave" &&
      ConfigHelpers.isPaymentConfigured("flutterwave")
    ) {
      return "flutterwave";
    }
    return "paystack"; // Default
  },

  /**
   * Get all configured POD providers
   */
  getConfiguredPodProviders: (): Array<"printful" | "printify" | "ikonshop"> => {
    const providers: Array<"printful" | "printify" | "ikonshop"> = [];
    if (ConfigHelpers.isPodConfigured("printful")) providers.push("printful");
    if (ConfigHelpers.isPodConfigured("printify")) providers.push("printify");
    if (ConfigHelpers.isPodConfigured("ikonshop")) providers.push("ikonshop");
    return providers;
  },

  /**
   * Validate required configuration for production
   */
  validateProductionConfig: () => {
    const errors: string[] = [];

    if (!ConfigHelpers.isShopifyConfigured()) {
      errors.push("Shopify configuration missing");
    }
    if (!ConfigHelpers.isSupabaseConfigured()) {
      errors.push("Supabase configuration missing");
    }
    if (!ConfigHelpers.isPaymentConfigured("paystack")) {
      errors.push("Payment gateway configuration missing");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
};

/**
 * Type exports
 */
export type Config = typeof CONFIG;
export type PaymentProvider = "paystack" | "flutterwave" | "monnify";
export type PodProvider = "printful" | "printify" | "ikonshop";
