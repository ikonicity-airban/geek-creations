// app/api/webhook/order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { CONFIG } from "@/lib/config";

const supabase = createClient(
  CONFIG.DATABASE.supabaseUrl,
  CONFIG.DATABASE.supabaseServiceRoleKey,
);

interface ShopifyOrder {
  id: number;
  order_number: number;
  email: string;
  total_price: string;
  tags?: string;
  line_items: Array<{
    id: number;
    title: string;
    variant_id: number;
    quantity: number;
    price: string;
    sku: string;
  }>;
  shipping_address: {
    first_name: string;
    last_name: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    country: string;
    zip: string;
    phone: string;
  };
  customer: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

interface PrintfulItem {
  sync_variant_id: number;
  quantity: number;
  retail_price: string;
}

interface PrintifyItem {
  product_id: string;
  variant_id: number;
  quantity: number;
}

interface IkonshopItem {
  design_id: string;
  product_type: string;
  quantity: number;
  recipient: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    phone: string;
  };
}

// Verify Shopify webhook signature
function verifyShopifyWebhook(body: string, hmac: string): boolean {
  const secret = CONFIG.SHOPIFY.webhookSecret;
  const hash = crypto
    .createHmac("sha256", secret)
    .update(body, "utf8")
    .digest("base64");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmac));
}

// Fetch product metafield from Shopify
async function getProductMetafield(variantId: number): Promise<string | null> {
  const shopifyDomain = CONFIG.SHOPIFY.storeDomain;
  const accessToken = CONFIG.SHOPIFY.accessToken;

  try {
    // First get product ID from variant
    const variantResponse = await fetch(
      `https://${shopifyDomain}/admin/api/2024-10/variants/${variantId}.json`,
      {
        headers: { "X-Shopify-Access-Token": accessToken },
      },
    );
    const variantData = await variantResponse.json();
    const productId = variantData.variant?.product_id;

    if (!productId) return null;

    // Get product metafields
    const metafieldResponse = await fetch(
      `https://${shopifyDomain}/admin/api/2024-10/products/${productId}/metafields.json`,
      {
        headers: { "X-Shopify-Access-Token": accessToken },
      },
    );
    const metafieldData = await metafieldResponse.json();

    const fulfillmentField = metafieldData.metafields?.find(
      (m: { namespace: string; key: string; value: string }) =>
        m.namespace === "custom" && m.key === "fulfillment_provider",
    );

    return fulfillmentField?.value || null;
  } catch (error) {
    console.error("Error fetching metafield:", error);
    return null;
  }
}

// Printful fulfillment
async function fulfillWithPrintful(order: ShopifyOrder, items: PrintfulItem[]) {
  const apiKey = CONFIG.POD.printful.apiKey;

  const printfulOrder = {
    external_id: `geeks-${order.id}`,
    recipient: {
      name: `${order.shipping_address.first_name} ${order.shipping_address.last_name}`,
      address1: order.shipping_address.address1,
      address2: order.shipping_address.address2 || "",
      city: order.shipping_address.city,
      state_code: order.shipping_address.province,
      country_code: order.shipping_address.country,
      zip: order.shipping_address.zip,
      phone: order.shipping_address.phone,
      email: order.email,
    },
    items: items.map((item) => ({
      sync_variant_id: item.sync_variant_id,
      quantity: item.quantity,
      retail_price: item.retail_price,
    })),
  };

  const response = await fetch("https://api.printful.com/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(printfulOrder),
  });

  return response.json();
}

// Printify fulfillment
async function fulfillWithPrintify(order: ShopifyOrder, items: PrintifyItem[]) {
  const apiKey = CONFIG.POD.printify.apiKey;
  const shopId = CONFIG.POD.printify.shopId;

  const printifyOrder = {
    external_id: `geeks-${order.id}`,
    label: `Order #${order.order_number}`,
    line_items: items.map((item) => ({
      product_id: item.product_id,
      variant_id: item.variant_id,
      quantity: item.quantity,
    })),
    shipping_method: 1, // Standard shipping
    send_shipping_notification: true,
    address_to: {
      first_name: order.shipping_address.first_name,
      last_name: order.shipping_address.last_name,
      email: order.email,
      phone: order.shipping_address.phone,
      country: order.shipping_address.country,
      region: order.shipping_address.province,
      address1: order.shipping_address.address1,
      address2: order.shipping_address.address2 || "",
      city: order.shipping_address.city,
      zip: order.shipping_address.zip,
    },
  };

  const response = await fetch(
    `https://api.printify.com/v1/shops/${shopId}/orders.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(printifyOrder),
    },
  );

  return response.json();
}

// Ikonshop fulfillment (crypto orders)
async function fulfillWithIkonshop(order: ShopifyOrder, items: IkonshopItem[]) {
  const apiKey = CONFIG.POD.ikonshop.apiKey;

  const ikonshopOrder = {
    order_id: `geeks-${order.id}`,
    customer_email: order.email,
    items: items,
    payment_method: "crypto", // USDC or SOL
  };

  const response = await fetch("https://api.ikonshop.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ikonshopOrder),
  });

  return response.json();
}

// Log order to Supabase
async function logOrder(
  orderId: number,
  provider: string,
  status: string,
  response: unknown,
): Promise<void> {
  await supabase.from("orders_log").insert({
    shopify_order_id: orderId,
    fulfillment_provider: provider,
    status,
    pod_response: response,
    created_at: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const hmac = req.headers.get("x-shopify-hmac-sha256");

    if (!hmac || !verifyShopifyWebhook(rawBody, hmac)) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 },
      );
    }

    const order: ShopifyOrder = JSON.parse(rawBody);

    // Skip auto-fulfillment for manual review orders
    // Tags come as comma-separated string from Shopify webhook
    const orderTags = order.tags
      ? order.tags.split(",").map((t) => t.trim())
      : [];
    if (
      orderTags.includes("manual-review") ||
      orderTags.includes("pending-admin")
    ) {
      console.log(
        `⏭️ Skipping auto-fulfillment for order ${order.id} - manual review required`,
      );
      return NextResponse.json(
        { received: true, skipped: "manual-review" },
        { status: 200 },
      );
    }

    // Process fulfillment asynchronously
    Promise.resolve().then(async () => {
      try {
        for (const item of order.line_items) {
          const provider = await getProductMetafield(item.variant_id);

          if (!provider) {
            console.error(
              `No fulfillment provider for variant ${item.variant_id}`,
            );
            await logOrder(order.id, "unknown", "error", {
              error: "No fulfillment provider configured",
            });
            continue;
          }

          let result;
          switch (provider.toLowerCase()) {
            case "printful":
              result = await fulfillWithPrintful(order, [
                {
                  sync_variant_id: parseInt(item.sku.split("-")[1] || "0"),
                  quantity: item.quantity,
                  retail_price: item.price,
                },
              ]);
              break;

            case "printify":
              result = await fulfillWithPrintify(order, [
                {
                  product_id: item.sku.split("-")[0],
                  variant_id: item.variant_id,
                  quantity: item.quantity,
                },
              ]);
              break;

            case "ikonshop":
              result = await fulfillWithIkonshop(order, [
                {
                  design_id: item.sku,
                  product_type: item.title,
                  quantity: item.quantity,
                  recipient: {
                    name: `${order.shipping_address.first_name} ${order.shipping_address.last_name}`,
                    address: order.shipping_address.address1,
                    city: order.shipping_address.city,
                    state: order.shipping_address.province,
                    country: order.shipping_address.country,
                    postal_code: order.shipping_address.zip,
                    phone: order.shipping_address.phone,
                  },
                },
              ]);
              break;

            default:
              throw new Error(`Unknown provider: ${provider}`);
          }

          await logOrder(order.id, provider, "success", result);
          console.log(`✅ Order ${order.id} fulfilled via ${provider}`);
        }
      } catch (error) {
        console.error("Fulfillment error:", error);
        await logOrder(order.id, "error", "failed", { error: String(error) });
      }
    });

    // Return 200 immediately
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
