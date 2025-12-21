import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/shopify";
import { initializePaystackPayment } from "@/lib/payments/paystack";
import { createSolanaPaymentRequest } from "@/lib/payments/solana-pay";
import { createClient } from "@supabase/supabase-js";
import { db } from "@/lib/db";
import { variants } from "@/lib/db/schema";
import { inArray, eq } from "drizzle-orm";
import type { CheckoutData, CartItem } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      shipping_address,
      billing_address,
      payment_method,
      crypto_currency,
      cart_items,
    }: CheckoutData & { cart_items: CartItem[] } = body;

    // Validate input
    if (!email || !shipping_address || !cart_items || cart_items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch Shopify variant IDs from database
    const variantIds = cart_items.map((item) => item.variant_id);
    const variantRows = await db
      .select({
        id: variants.id,
        shopifyVariantId: variants.shopifyVariantId,
      })
      .from(variants)
      .where(inArray(variants.id, variantIds));

    // Create a map for quick lookup
    const variantMap = new Map(
      variantRows.map((v) => [v.id, v.shopifyVariantId])
    );

    // Convert cart items to Shopify line items with proper variant IDs
    const lineItems = cart_items
      .map((item) => {
        const shopifyVariantId = variantMap.get(item.variant_id);
        if (!shopifyVariantId) {
          console.error(`Shopify variant ID not found for variant ${item.variant_id}`);
          return null;
        }
        return {
          variantId: `gid://shopify/ProductVariant/${shopifyVariantId}`,
          quantity: item.quantity,
        };
      })
      .filter((item): item is { variantId: string; quantity: number } => item !== null);

    if (lineItems.length === 0) {
      return NextResponse.json(
        { error: "No valid line items found" },
        { status: 400 }
      );
    }

    // Create order in Shopify
    let shopifyOrder;
    try {
      shopifyOrder = await createOrder({
        email,
        lineItems,
        shippingAddress: {
          firstName: shipping_address.first_name,
          lastName: shipping_address.last_name,
          address1: shipping_address.address1,
          address2: shipping_address.address2,
          city: shipping_address.city,
          province: shipping_address.province,
          country: shipping_address.country,
          zip: shipping_address.zip,
          phone: shipping_address.phone,
        },
        billingAddress: billing_address
          ? {
              firstName: billing_address.first_name,
              lastName: billing_address.last_name,
              address1: billing_address.address1,
              address2: billing_address.address2,
              city: billing_address.city,
              province: billing_address.province,
              country: billing_address.country,
              zip: billing_address.zip,
              phone: billing_address.phone,
            }
          : undefined,
        financialStatus: payment_method === "card" ? "pending" : "pending",
      });
    } catch (error) {
      console.error("Shopify order creation error:", error);
      // If Shopify order creation fails, we might want to still proceed
      // with payment and create order later, or return error
      return NextResponse.json(
        { error: `Failed to create order: ${error instanceof Error ? error.message : "Unknown error"}` },
        { status: 500 }
      );
    }

    // Calculate total amount (in kobo for Paystack, or in smallest unit for crypto)
    const totalAmount = cart_items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = totalAmount * 0.075; // 7.5% VAT
    const shipping = totalAmount >= 50000 ? 0 : 2500;
    const finalTotal = totalAmount + tax + shipping;

    // Handle payment based on method
    let paymentUrl: string | null = null;
    let paymentReference: string | null = null;

    if (payment_method === "card") {
      // Initialize Paystack payment
      try {
        const paystackResponse = await initializePaystackPayment({
          email,
          amountKobo: Math.round(finalTotal * 100), // Convert to kobo
          orderId: shopifyOrder.orderNumber || shopifyOrder.name,
          callbackUrl: `${req.nextUrl.origin}/checkout/success?order=${shopifyOrder.orderNumber || shopifyOrder.name}&email=${encodeURIComponent(email)}`,
        });
        paymentUrl = paystackResponse.authorization_url;
        paymentReference = paystackResponse.reference;
      } catch (error) {
        console.error("Paystack initialization error:", error);
        return NextResponse.json(
          { error: "Failed to initialize payment" },
          { status: 500 }
        );
      }
    } else if (payment_method === "crypto") {
      // Create Solana payment request
      try {
        const solanaResponse = await createSolanaPaymentRequest({
          amount: finalTotal,
          label: `Order #${shopifyOrder.orderNumber || shopifyOrder.name}`,
          orderId: shopifyOrder.orderNumber || shopifyOrder.name,
          memo: `Order ${shopifyOrder.orderNumber || shopifyOrder.name}`,
        });
        // For crypto payments, redirect to payment URL
        if (solanaResponse.url) {
          return NextResponse.json({
            success: true,
            order_id: shopifyOrder.id,
            order_number: shopifyOrder.orderNumber || shopifyOrder.name,
            payment_url: solanaResponse.url,
            payment_reference: solanaResponse.reference,
            requires_redirect: true,
          });
        }
        paymentUrl = solanaResponse.url;
        paymentReference = solanaResponse.reference;
      } catch (error) {
        console.error("Solana payment creation error:", error);
        return NextResponse.json(
          { error: "Failed to create crypto payment" },
          { status: 500 }
        );
      }
    } else if (payment_method === "bank_transfer") {
      // For bank transfer, we might generate a virtual account or just return success
      // For now, we'll treat it similar to card payment
      try {
        const paystackResponse = await initializePaystackPayment({
          email,
          amountKobo: Math.round(finalTotal * 100),
          orderId: shopifyOrder.orderNumber || shopifyOrder.name,
          callbackUrl: `${req.nextUrl.origin}/checkout/success?order=${shopifyOrder.orderNumber || shopifyOrder.name}&email=${encodeURIComponent(email)}`,
        });
        paymentUrl = paystackResponse.authorization_url;
        paymentReference = paystackResponse.reference;
      } catch (error) {
        console.error("Paystack bank transfer error:", error);
        return NextResponse.json(
          { error: "Failed to initialize bank transfer" },
          { status: 500 }
        );
      }
    }

    // Log payment transaction to database
    if (paymentReference) {
      try {
        // Extract Shopify order ID from the GID
        const shopifyOrderId = shopifyOrder.id.split("/").pop();
        
        await supabase.from("payment_transactions").insert({
          order_id: shopifyOrderId ? parseInt(shopifyOrderId) : null,
          payment_method: payment_method === "card" ? "paystack" : payment_method === "crypto" ? "solana" : "paystack",
          payment_provider: payment_method === "card" ? "paystack" : payment_method === "crypto" ? "solana" : "paystack",
          transaction_reference: paymentReference,
          amount: finalTotal.toString(),
          currency: payment_method === "crypto" ? (crypto_currency || "USDC") : "NGN",
          status: "pending",
          metadata: {
            shopify_order_id: shopifyOrder.id,
            shopify_order_number: shopifyOrder.orderNumber || shopifyOrder.name,
            email,
            payment_method,
            crypto_currency: crypto_currency || null,
          },
        });
      } catch (error) {
        console.error("Failed to log payment transaction:", error);
        // Don't fail the request if logging fails
      }
    }

    return NextResponse.json({
      success: true,
      order_id: shopifyOrder.id,
      order_number: shopifyOrder.orderNumber || shopifyOrder.name,
      payment_url: paymentUrl,
      payment_reference: paymentReference,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
