import { db } from "../index";
import { siteSettings } from "../schema";
import { eq } from "drizzle-orm";

const initialSettings = [
  // Branding
  {
    key: "siteName",
    value: "Geeks Creation",
    type: "string",
    category: "branding",
    description: "The name of your store",
    isPublic: true,
  },
  {
    key: "siteSlogan",
    value: "Made by nerds. Worn by legends.",
    type: "string",
    category: "branding",
    description: "Your store's tagline or slogan",
    isPublic: true,
  },
  {
    key: "siteDescription",
    value:
      "Where Nigerian nerds, artists & dreamers turn wild ideas into wearable legends. Shop exclusive anime, tech, and Afro-geek designs.",
    type: "string",
    category: "branding",
    description: "Brief description of your store",
    isPublic: true,
  },
  {
    key: "logoUrl",
    value: "/logo.png",
    type: "string",
    category: "branding",
    description: "URL to your store logo",
    isPublic: true,
  },
  {
    key: "faviconUrl",
    value: "/favicon.ico",
    type: "string",
    category: "branding",
    description: "URL to your favicon",
    isPublic: true,
  },

  // Contact Information
  {
    key: "contactEmail",
    value: "hello@geekcreations.com",
    type: "string",
    category: "contact",
    description: "General contact email",
    isPublic: true,
  },
  {
    key: "supportEmail",
    value: "support@geekcreations.com",
    type: "string",
    category: "contact",
    description: "Customer support email",
    isPublic: true,
  },
  {
    key: "contactPhone",
    value: "+234 800 000 0000",
    type: "string",
    category: "contact",
    description: "Contact phone number",
    isPublic: true,
  },

  // Social Media
  {
    key: "instagramUrl",
    value: "https://instagram.com/geekcreations",
    type: "string",
    category: "social",
    description: "Instagram profile URL",
    isPublic: true,
  },
  {
    key: "twitterUrl",
    value: "https://twitter.com/geekcreations",
    type: "string",
    category: "social",
    description: "Twitter/X profile URL",
    isPublic: true,
  },
  {
    key: "facebookUrl",
    value: "https://facebook.com/geekcreations",
    type: "string",
    category: "social",
    description: "Facebook page URL",
    isPublic: true,
  },

  // Business Information
  {
    key: "businessAddress",
    value: "123 Tech Street",
    type: "string",
    category: "business",
    description: "Business street address",
    isPublic: true,
  },
  {
    key: "businessCity",
    value: "Lagos",
    type: "string",
    category: "business",
    description: "Business city",
    isPublic: true,
  },
  {
    key: "businessCountry",
    value: "Nigeria",
    type: "string",
    category: "business",
    description: "Business country",
    isPublic: true,
  },

  // SEO Settings
  {
    key: "metaTitle",
    value: "Geek Creations - Nigerian Geek Culture Store | Anime, Tech & Afro-Geek Merch",
    type: "string",
    category: "seo",
    description: "Default meta title for SEO",
    isPublic: true,
  },
  {
    key: "metaDescription",
    value:
      "Premium Nigerian print-on-demand store for nerds, artists & dreamers. Shop exclusive anime, tech, and Afro-geek designs on T-shirts, hoodies, mugs & more.",
    type: "string",
    category: "seo",
    description: "Default meta description for SEO",
    isPublic: true,
  },
  {
    key: "metaKeywords",
    value:
      "Nigerian geek store, anime merchandise Nigeria, tech clothing Lagos, Afro-geek fashion, print on demand Nigeria, custom T-shirts",
    type: "string",
    category: "seo",
    description: "SEO keywords",
    isPublic: true,
  },

  // Feature Flags
  {
    key: "enableNewsletter",
    value: "true",
    type: "boolean",
    category: "features",
    description: "Enable newsletter signup forms",
    isPublic: true,
  },
  {
    key: "enableBlog",
    value: "false",
    type: "boolean",
    category: "features",
    description: "Enable blog section",
    isPublic: true,
  },
  {
    key: "enableReviews",
    value: "true",
    type: "boolean",
    category: "features",
    description: "Enable product reviews",
    isPublic: true,
  },

  // Theme Colors (optional overrides)
  {
    key: "primaryColor",
    value: "#401268",
    type: "string",
    category: "theme",
    description: "Primary brand color",
    isPublic: true,
  },
  {
    key: "secondaryColor",
    value: "#c5a3ff",
    type: "string",
    category: "theme",
    description: "Secondary brand color",
    isPublic: true,
  },
  {
    key: "accentColor",
    value: "#e2ae3d",
    type: "string",
    category: "theme",
    description: "Accent color",
    isPublic: true,
  },
];

export async function seedSiteSettings() {
  console.log("🌐 Starting site settings seed...");

  try {
    for (const setting of initialSettings) {
      const existing = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, setting.key))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(siteSettings).values(setting);
        console.log(`  ✓ Added setting: ${setting.key}`);
      } else {
        console.log(`  ⚠ Setting ${setting.key} already exists, skipping...`);
      }
    }

    console.log("\n✅ Site settings seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding site settings:", error);
    throw error;
  }
}

// Run seed if executed directly
if (require.main === module) {
  seedSiteSettings()
    .then(() => {
      console.log("\n🎉 All done!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Seed failed:", error);
      process.exit(1);
    });
}
