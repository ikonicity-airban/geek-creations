// lib/pod.ts - Print on Demand integration utilities
import { CONFIG } from "./config";

export type PodProvider = "printful" | "printify" | "ikonshop" | "manual";

export interface PodOrderItem {
  product_id: string;
  variant_id?: string;
  quantity: number;
  name: string;
  sku?: string;
  retail_price?: string;
}

export interface PodShippingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state_code: string;
  country_code: string;
  zip: string;
  phone?: string;
  email?: string;
}

export interface PodOrderInput {
  provider: PodProvider;
  external_id: string; // Shopify order ID or reference
  recipient: PodShippingAddress;
  items: PodOrderItem[];
  retail_costs?: {
    currency: string;
    subtotal: string;
    shipping: string;
    tax: string;
    total: string;
  };
}

export interface PodOrderResponse {
  success: boolean;
  provider: PodProvider;
  pod_order_id?: string;
  external_id: string;
  status?: string;
  error?: string;
}

/**
 * Determine POD provider from product metadata
 */
export function getPodProvider(
  tags: string[],
  metafields?: Array<{ key: string; value: string }>
): PodProvider {
  // Check tags first
  if (tags.includes("printful")) return "printful";
  if (tags.includes("printify")) return "printify";
  if (tags.includes("ikonshop")) return "ikonshop";

  // Check metafields
  if (metafields) {
    const podField = metafields.find((m) => m.key === "pod_provider");
    if (podField?.value === "printful") return "printful";
    if (podField?.value === "printify") return "printify";
    if (podField?.value === "ikonshop") return "ikonshop";
  }

  return "manual";
}

/**
 * Create order on Printful
 */
async function createPrintfulOrder(
  input: PodOrderInput
): Promise<PodOrderResponse> {
  const apiKey = CONFIG.POD.printful.apiKey;

  if (!apiKey) {
    throw new Error("PRINTFUL_API_KEY is not configured");
  }

  try {
    const printfulPayload = {
      external_id: input.external_id,
      shipping: "STANDARD",
      recipient: {
        name: input.recipient.name,
        address1: input.recipient.address1,
        address2: input.recipient.address2 || "",
        city: input.recipient.city,
        state_code: input.recipient.state_code,
        country_code: input.recipient.country_code,
        zip: input.recipient.zip,
        phone: input.recipient.phone,
        email: input.recipient.email,
      },
      items: input.items.map((item) => ({
        sync_variant_id: item.variant_id
          ? parseInt(item.variant_id)
          : undefined,
        external_variant_id: item.variant_id,
        quantity: item.quantity,
        retail_price: item.retail_price,
        name: item.name,
      })),
      retail_costs: input.retail_costs,
    };

    const response = await fetch("https://api.printful.com/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(printfulPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Printful API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return {
      success: true,
      provider: "printful",
      pod_order_id: data.result?.id?.toString(),
      external_id: input.external_id,
      status: data.result?.status || "draft",
    };
  } catch (error) {
    console.error("Printful order creation failed:", error);
    return {
      success: false,
      provider: "printful",
      external_id: input.external_id,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Create order on Printify
 */
async function createPrintifyOrder(
  input: PodOrderInput
): Promise<PodOrderResponse> {
  const apiKey = CONFIG.POD.printify.apiKey;
  const shopId = CONFIG.POD.printify.shopId;

  if (!apiKey || !shopId) {
    throw new Error("PRINTIFY_API_KEY or PRINTIFY_SHOP_ID is not configured");
  }

  try {
    const printifyPayload = {
      external_id: input.external_id,
      label: input.external_id,
      line_items: input.items.map((item) => ({
        product_id: item.product_id,
        variant_id: item.variant_id ? parseInt(item.variant_id) : undefined,
        quantity: item.quantity,
        print_provider_id: undefined, // Auto-select
      })),
      shipping_method: 1, // Standard shipping
      address_to: {
        first_name: input.recipient.name.split(" ")[0] || input.recipient.name,
        last_name: input.recipient.name.split(" ").slice(1).join(" ") || "",
        email: input.recipient.email,
        phone: input.recipient.phone,
        country: input.recipient.country_code,
        region: input.recipient.state_code,
        address1: input.recipient.address1,
        address2: input.recipient.address2 || "",
        city: input.recipient.city,
        zip: input.recipient.zip,
      },
    };

    const response = await fetch(
      `https://api.printify.com/v1/shops/${shopId}/orders.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(printifyPayload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Printify API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return {
      success: true,
      provider: "printify",
      pod_order_id: data.id?.toString(),
      external_id: input.external_id,
      status: data.status || "pending",
    };
  } catch (error) {
    console.error("Printify order creation failed:", error);
    return {
      success: false,
      provider: "printify",
      external_id: input.external_id,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Create order on Ikonshop (Placeholder for future implementation)
 */
async function createIkonshopOrder(
  input: PodOrderInput
): Promise<PodOrderResponse> {
  console.log("🚀 ~ createIkonshopOrder ~ input:", input);
  const apiKey = CONFIG.POD.ikonshop.apiKey;

  if (!apiKey) {
    throw new Error("IKONSHOP_API_KEY is not configured");
  }

  // TODO: Implement Ikonshop API integration
  // Documentation: https://ikonshop.com/api-docs (placeholder)
  throw new Error("Ikonshop integration not yet implemented");
}

/**
 * Main function to fulfill a POD order
 */
export async function fulfillPodOrder(
  input: PodOrderInput
): Promise<PodOrderResponse> {
  if (input.provider === "printful") {
    return await createPrintfulOrder(input);
  } else if (input.provider === "printify") {
    return await createPrintifyOrder(input);
  } else if (input.provider === "ikonshop") {
    return await createIkonshopOrder(input);
  } else {
    // Manual fulfillment - no API call needed
    return {
      success: true,
      provider: "manual",
      external_id: input.external_id,
      status: "pending_manual_fulfillment",
    };
  }
}

/**
 * Get order status from POD provider
 */
export async function getPodOrderStatus(
  provider: PodProvider,
  podOrderId: string
): Promise<{ status: string; tracking?: string }> {
  if (provider === "printful") {
    const apiKey = CONFIG.POD.printful.apiKey;
    if (!apiKey) throw new Error("PRINTFUL_API_KEY not configured");

    const response = await fetch(
      `https://api.printful.com/orders/${podOrderId}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Printful status check failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      status: data.result?.status || "unknown",
      tracking: data.result?.shipments?.[0]?.tracking_number,
    };
  } else if (provider === "printify") {
    const apiKey = CONFIG.POD.printify.apiKey;
    const shopId = CONFIG.POD.printify.shopId;
    if (!apiKey || !shopId)
      throw new Error("PRINTIFY credentials not configured");

    const response = await fetch(
      `https://api.printify.com/v1/shops/${shopId}/orders/${podOrderId}.json`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Printify status check failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      status: data.status || "unknown",
      tracking: data.shipments?.[0]?.tracking_number,
    };
  } else if (provider === "ikonshop") {
    // TODO: Implement Ikonshop status check
    const apiKey = CONFIG.POD.ikonshop.apiKey;
    if (!apiKey) throw new Error("IKONSHOP_API_KEY not configured");

    // Placeholder - implement when Ikonshop API is available
    throw new Error("Ikonshop status check not yet implemented");
  }

  return { status: "manual" };
}
