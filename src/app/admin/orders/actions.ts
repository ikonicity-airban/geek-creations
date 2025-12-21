"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import type {
  ExtendedOrder,
  OrderStats,
  FulfillmentProvider,
  FulfillmentResult,
} from "@/types/admin";

// Admin email validation helper
function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  return (
    email.endsWith("@geekcreations.com") ||
    email.endsWith("@codeoven.tech") ||
    email === "admin@geekscreation.com"
  );
}

// Check admin auth and get supabase client (with RLS)
async function getAuthenticatedClient() {
  const cookieStore = await cookies();
  const supabase = await createServerClient(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !isAdminEmail(session.user.email)) {
    redirect("/admin/login");
  }

  return supabase;
}

// Get admin client with service role for updates (bypasses RLS)
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Fetch Shopify order details
async function fetchShopifyOrder(
  shopifyOrderId: number
): Promise<any | null> {
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

  if (!shopifyDomain || !accessToken) {
    console.error("Shopify credentials not configured");
    return null;
  }

  try {
    const response = await fetch(
      `https://${shopifyDomain}/admin/api/2024-10/orders/${shopifyOrderId}.json`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch Shopify order ${shopifyOrderId}`);
      return null;
    }

    const data = await response.json();
    return data.order || null;
  } catch (error) {
    console.error("Error fetching Shopify order:", error);
    return null;
  }
}

// Extract shipping info from pod_response or fetch from Shopify
async function enrichOrderWithShipping(
  order: any
): Promise<ExtendedOrder> {
  let shippingCity: string | undefined;
  let shippingCountry: string | undefined;
  let shippingAddress: any = undefined;
  let items: any[] = [];

  // Try to extract from pod_response
  if (order.pod_response) {
    const podResponse = order.pod_response;
    if (podResponse.recipient) {
      shippingCity = podResponse.recipient.city;
      shippingCountry = podResponse.recipient.country;
      shippingAddress = podResponse.recipient;
    }
    if (podResponse.items) {
      items = podResponse.items;
    }
  }

  // If not in pod_response, fetch from Shopify
  if (!shippingCity || !shippingCountry) {
    const shopifyOrder = await fetchShopifyOrder(order.shopify_order_id);
    if (shopifyOrder?.shipping_address) {
      shippingCity = shopifyOrder.shipping_address.city;
      shippingCountry = shopifyOrder.shipping_address.country;
      shippingAddress = shopifyOrder.shipping_address;
    }
    if (shopifyOrder?.line_items && items.length === 0) {
      items = shopifyOrder.line_items.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        sku: item.sku,
        variant_id: item.variant_id,
        product_id: item.product_id,
        design_preview_url: item.properties?.find(
          (p: any) => p.name === "design_preview"
        )?.value,
      }));
    }
  }

  return {
    ...order,
    shipping_city: shippingCity,
    shipping_country: shippingCountry,
    shipping_address: shippingAddress,
    items,
  };
}

// Get all orders
export async function getOrders(): Promise<ExtendedOrder[]> {
  const supabase = await getAuthenticatedClient();

  const { data, error } = await supabase
    .from("orders_log")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  // Enrich orders with shipping info
  const enrichedOrders = await Promise.all(
    (data || []).map(enrichOrderWithShipping)
  );

  return enrichedOrders;
}

// Get order stats
export async function getOrderStats(): Promise<OrderStats> {
  const supabase = await getAuthenticatedClient();

  // Get all orders
  const { data: allOrders, error: allError } = await supabase
    .from("orders_log")
    .select("status, retail_price, created_at");

  if (allError) {
    console.error("Error fetching orders for stats:", allError);
    return { totalOrders: 0, pendingOrders: 0, revenueToday: 0 };
  }

  const totalOrders = allOrders?.length || 0;
  const pendingOrders =
    allOrders?.filter((o) => o.status === "pending").length || 0;

  // Calculate revenue today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const revenueToday =
    allOrders
      ?.filter((o) => {
        const orderDate = new Date(o.created_at);
        return orderDate >= today && o.retail_price;
      })
      .reduce((sum, o) => sum + parseFloat(o.retail_price || "0"), 0) || 0;

  return {
    totalOrders,
    pendingOrders,
    revenueToday,
  };
}

// Fulfill order with POD provider
async function fulfillWithPrintful(
  shopifyOrderId: number,
  shippingAddress: any,
  items: any[]
): Promise<any> {
  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) {
    throw new Error("PRINTFUL_API_KEY not configured");
  }

  const printfulOrder = {
    external_id: `geeks-${shopifyOrderId}`,
    recipient: {
      name: `${shippingAddress.first_name || ""} ${shippingAddress.last_name || ""}`.trim(),
      address1: shippingAddress.address1 || "",
      address2: shippingAddress.address2 || "",
      city: shippingAddress.city || "",
      state_code: shippingAddress.province || shippingAddress.state || "",
      country_code: shippingAddress.country || "",
      zip: shippingAddress.zip || shippingAddress.postal_code || "",
      phone: shippingAddress.phone || "",
      email: shippingAddress.email || "",
    },
    items: items.map((item: any) => ({
      sync_variant_id: parseInt(
        item.sku?.split("-")[1] || item.sync_variant_id || "0"
      ),
      quantity: item.quantity || 1,
      retail_price: item.price?.toString() || "0",
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

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Printful API error: ${error}`);
  }

  return response.json();
}

async function fulfillWithPrintify(
  shopifyOrderId: number,
  shippingAddress: any,
  items: any[]
): Promise<any> {
  const apiKey = process.env.PRINTIFY_API_KEY;
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (!apiKey || !shopId) {
    throw new Error("PRINTIFY_API_KEY or PRINTIFY_SHOP_ID not configured");
  }

  const printifyOrder = {
    external_id: `geeks-${shopifyOrderId}`,
    label: `Order #${shopifyOrderId}`,
    line_items: items.map((item: any) => ({
      product_id: item.sku?.split("-")[0] || item.product_id?.toString() || "",
      variant_id: item.variant_id || item.sync_variant_id || 0,
      quantity: item.quantity || 1,
    })),
    shipping_method: 1,
    send_shipping_notification: true,
    address_to: {
      first_name: shippingAddress.first_name || "",
      last_name: shippingAddress.last_name || "",
      email: shippingAddress.email || "",
      phone: shippingAddress.phone || "",
      country: shippingAddress.country || "",
      region: shippingAddress.province || shippingAddress.state || "",
      address1: shippingAddress.address1 || "",
      address2: shippingAddress.address2 || "",
      city: shippingAddress.city || "",
      zip: shippingAddress.zip || shippingAddress.postal_code || "",
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
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Printify API error: ${error}`);
  }

  return response.json();
}

// Fulfill single order
export async function fulfillOrder(
  orderId: number,
  provider: FulfillmentProvider
): Promise<FulfillmentResult> {
  const supabase = await getAuthenticatedClient();

  try {
    // Get order from database
    const { data: order, error: orderError } = await supabase
      .from("orders_log")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return {
        success: false,
        orderId,
        provider,
        error: "Order not found",
      };
    }

    // Handle local print (just update status, no API call)
    if (provider === "local_print") {
      const adminSupabase = getAdminClient();
      const { error: updateError } = await adminSupabase
        .from("orders_log")
        .update({
          fulfillment_provider: "local_print",
          status: "shipped",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (updateError) {
        return {
          success: false,
          orderId,
          provider,
          error: updateError.message,
        };
      }

      return {
        success: true,
        orderId,
        provider,
      };
    }

    // Get shipping address and items
    let shippingAddress: any = {};
    let items: any[] = [];

    // Try to get from pod_response
    if (order.pod_response) {
      const podResponse = order.pod_response;
      if (podResponse.recipient) {
        shippingAddress = podResponse.recipient;
      }
      if (podResponse.items) {
        items = podResponse.items;
      }
    }

    // Fetch from Shopify if needed
    if (!shippingAddress.city || items.length === 0) {
      const shopifyOrder = await fetchShopifyOrder(order.shopify_order_id);
      if (shopifyOrder) {
        shippingAddress = shopifyOrder.shipping_address || shippingAddress;
        items =
          shopifyOrder.line_items?.map((item: any) => ({
            sku: item.sku,
            variant_id: item.variant_id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            sync_variant_id: item.sku?.split("-")[1],
          })) || items;
      }
    }

    if (!shippingAddress.city || items.length === 0) {
      return {
        success: false,
        orderId,
        provider,
        error: "Missing shipping address or items",
      };
    }

    // Call appropriate POD API
    let result: any;
    let trackingNumber: string | undefined;

    if (provider === "printful") {
      result = await fulfillWithPrintful(
        order.shopify_order_id,
        shippingAddress,
        items
      );
      trackingNumber = result?.result?.tracking_number || result?.tracking;
    } else if (provider === "printify") {
      result = await fulfillWithPrintify(
        order.shopify_order_id,
        shippingAddress,
        items
      );
      trackingNumber = result?.tracking_number;
    } else {
      return {
        success: false,
        orderId,
        provider,
        error: "Unknown provider",
      };
    }

    // Update order in database (use service role to bypass RLS)
    const adminSupabase = getAdminClient();
    const updateData: any = {
      fulfillment_provider: provider,
      status: "shipped",
      pod_response: result,
      updated_at: new Date().toISOString(),
    };

    if (trackingNumber) {
      updateData.tracking_number = trackingNumber;
      updateData.shipped_at = new Date().toISOString();
    }

    const { error: updateError } = await adminSupabase
      .from("orders_log")
      .update(updateData)
      .eq("id", orderId);

    if (updateError) {
      console.error("Error updating order:", updateError);
      return {
        success: false,
        orderId,
        provider,
        error: "Fulfillment succeeded but database update failed",
      };
    }

    return {
      success: true,
      orderId,
      provider,
      trackingNumber,
    };
  } catch (error: any) {
    console.error("Error fulfilling order:", error);
    return {
      success: false,
      orderId,
      provider,
      error: error.message || "Unknown error",
    };
  }
}

// Bulk fulfill orders
export async function bulkFulfillOrders(
  orderIds: number[],
  provider: FulfillmentProvider
): Promise<FulfillmentResult[]> {
  const results: FulfillmentResult[] = [];

  for (const orderId of orderIds) {
    const result = await fulfillOrder(orderId, provider);
    results.push(result);
  }

  return results;
}

