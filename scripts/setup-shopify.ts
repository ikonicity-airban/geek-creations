// scripts/setup-shopify.ts
import * as fs from "fs";
import * as path from "path";

// Load environment variables from .env.local manually
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
}

const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

// Verify keys exist and are not placeholders
if (!shopifyDomain || shopifyDomain === "your-store-domain.myshopify.com") {
  console.error("❌ Error: SHOPIFY_STORE_DOMAIN is not configured in .env.local");
  process.exit(1);
}

if (!accessToken || accessToken.includes("[YOUR-ACCESS-TOKEN]")) {
  console.error("❌ Error: SHOPIFY_ACCESS_TOKEN is not configured in .env.local");
  process.exit(1);
}

console.log(`🔗 Connecting to Shopify store: ${shopifyDomain}...`);

async function shopifyQuery(query: string, variables: any = {}) {
  const response = await fetch(`https://${shopifyDomain}/admin/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": accessToken!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function main() {
  try {
    // 1. Create Metafield Definition
    console.log("🛠️  Creating custom.fulfillment_provider metafield definition...");
    const metafieldMutation = `
      mutation CreateMetafieldDefinition {
        metafieldDefinitionCreate(definition: {
          name: "Fulfillment Provider",
          namespace: "custom",
          key: "fulfillment_provider",
          description: "POD Provider for routing orders: printful, printify, or ikonshop",
          ownerType: PRODUCT,
          type: "single_line_text_field"
        }) {
          createdDefinition {
            id
            name
            key
            namespace
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const metafieldRes = await shopifyQuery(metafieldMutation);
    const errors = metafieldRes.data?.metafieldDefinitionCreate?.userErrors || [];
    
    if (errors.length > 0) {
      const alreadyExists = errors.some((e: any) => e.message.includes("taken") || e.message.includes("exists"));
      if (alreadyExists) {
        console.log("✅ custom.fulfillment_provider metafield definition already exists in Shopify.");
      } else {
        console.error("❌ Failed to create metafield definition:", errors);
      }
    } else {
      console.log("🎉 Successfully created custom.fulfillment_provider metafield definition!");
    }

    // 2. Setup Webhook Subscription
    const webhookUrl = process.argv[2];
    if (webhookUrl) {
      console.log(`📡 Setting up Webhook Subscription pointing to: ${webhookUrl}/api/webhook/order ...`);
      const webhookMutation = `
        mutation CreateWebhook($callbackUrl: URL!) {
          webhookSubscriptionCreate(topic: ORDERS_CREATE, webhookSubscription: {
            callbackUrl: $callbackUrl,
            format: JSON
          }) {
            webhookSubscription {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const webhookRes = await shopifyQuery(webhookMutation, {
        callbackUrl: `${webhookUrl.replace(/\/$/, "")}/api/webhook/order`,
      });

      const webhookErrors = webhookRes.data?.webhookSubscriptionCreate?.userErrors || [];
      if (webhookErrors.length > 0) {
        console.error("❌ Failed to create Webhook Subscription:", webhookErrors);
      } else {
        console.log("🎉 Webhook Subscription created successfully!");
        console.log("⚠️  Be sure to retrieve your Webhook Signing Secret from Shopify notifications dashboard to update SHOPIFY_WEBHOOK_SECRET in .env.local");
      }
    } else {
      console.log("\n💡 Note: You can also pass a public callback URL (e.g. from ngrok or vercel) as an argument to setup the webhook from the terminal!");
      console.log("   Example: bun run scripts/setup-shopify.ts https://your-domain.ngrok-free.app");
    }

    console.log("\n🚀 Shopify setup steps verified successfully!");
  } catch (error) {
    console.error("❌ Fatal setup error:", error);
    process.exit(1);
  }
}

main();
