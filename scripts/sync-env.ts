// scripts/sync-env.ts - Sync local environment variables to Supabase env_variables table
import { db, envVariables } from "../src/lib/db";
import * as fs from "fs";
import * as path from "path";

// Load environment variables from .env.local manually to avoid external dependencies
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  console.log("📝 Loading variables from .env.local...");
  const envContent = fs.readFileSync(envLocalPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const parts = trimmed.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, ""); // strip quotes
      process.env[key] = value;
    }
  });
} else {
  console.log("⚠️  No .env.local file found. Reading active shell environment.");
}

async function syncEnv() {
  console.log("🚀 Syncing env variables to Supabase...");

  const keysToSync = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
    "DATABASE_URL",
    "SHOPIFY_STORE_DOMAIN",
    "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
    "SHOPIFY_ADMIN_ACCESS_TOKEN",
    "PAYSTACK_SECRET_KEY",
    "PAYSTACK_PUBLIC_KEY",
  ];

  try {
    for (const key of keysToSync) {
      const value = process.env[key];
      if (!value) {
        console.log(`  ℹ️  ${key} is not set, skipping.`);
        continue;
      }

      console.log(`  🔄 Syncing ${key}...`);
      await db
        .insert(envVariables)
        .values({
          key,
          value,
          description: `System environment variable: ${key}`,
          isSecret: !key.startsWith("NEXT_PUBLIC_"),
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: envVariables.key,
          set: {
            value,
            updatedAt: new Date(),
          },
        });
    }

    console.log("✅ Env variables synced successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Syncing failed:", error);
    process.exit(1);
  }
}

syncEnv();
