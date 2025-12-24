// app/api/payment/verify/route.ts - Payment verification endpoint
import { NextRequest, NextResponse } from "next/server";
import { detectProviderFromReference, verifyPayment } from "@/lib/payments";
import { completePaidOrder } from "@/lib/shopify";
import { createClient } from "@supabase/supabase-js";
import { CONFIG } from "@/lib/config";

export async function GET(request: NextRequest) {
  const supabase = createClient(
    CONFIG.DATABASE.supabaseUrl,
    CONFIG.DATABASE.supabaseServiceRoleKey,
  );

  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get("reference"); // Paystack
    const transaction_id = searchParams.get("transaction_id"); // Flutterwave
    const tx_ref = searchParams.get("tx_ref"); // Flutterwave
    const status = searchParams.get("status");

    if (!reference && !transaction_id && !tx_ref) {
      return NextResponse.redirect(
        new URL(
          "/checkout/success?error=missing_payment_reference",
          request.url,
        ),
      );
    }

    let paymentVerified = false;
    let orderId: number | null = null;
    let shopifyDraftOrderId: string | null = null;
    let paymentProvider: string | null = null;
    const paymentReference = reference || transaction_id || tx_ref!;

    // Detect provider and verify payment using modular service
    try {
      const provider = detectProviderFromReference(paymentReference);
      const verifyResult = await verifyPayment(paymentReference, provider);

      paymentProvider = provider;

      if (verifyResult.status === "success") {
        paymentVerified = true;
        orderId = verifyResult.metadata?.order_id as number;
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      return NextResponse.redirect(
        new URL(
          `/checkout/success?error=payment_verification_failed&message=${encodeURIComponent(error instanceof Error ? error.message : "Unknown error")}`,
          request.url,
        ),
      );
    }

    if (!paymentVerified || !orderId) {
      return NextResponse.redirect(
        new URL(
          `/checkout/success?error=payment_not_verified&status=${status}`,
          request.url,
        ),
      );
    }

    // Get order details from orders_log table
    const { data: orderData, error: orderError } = await supabase
      .from("orders_log")
      .select("*")
      .eq("payment_reference", paymentReference)
      .single();

    if (orderError || !orderData) {
      console.error("Order not found:", orderError);
      return NextResponse.redirect(
        new URL(`/checkout/success?error=order_not_found`, request.url),
      );
    }

    orderId = orderData.id;
    shopifyDraftOrderId = orderData.shopify_draft_order_id;

    // Check if already paid
    if (orderData.payment_status === "paid") {
      return NextResponse.redirect(
        new URL(
          `/checkout/success?order_id=${orderId}&order_number=${orderData.order_number}&already_paid=true`,
          request.url,
        ),
      );
    }

    if (!shopifyDraftOrderId) {
      return NextResponse.redirect(
        new URL(`/checkout/success?error=draft_order_missing`, request.url),
      );
    }

    // Complete the draft order in Shopify and mark as paid
    try {
      let completedOrderName = orderData.order_number || `Order-${orderId}`;
      let shopifyOrderId = null;

      // Try to complete in Shopify (may fail in dev mode due to order limits)
      try {
        const completedOrder = await completePaidOrder(
          shopifyDraftOrderId,
          paymentReference,
        );
        completedOrderName = completedOrder.orderName;
        shopifyOrderId = completedOrder.orderId.split("/").pop();
      } catch (shopifyError) {
        console.warn(
          "Shopify draft order completion failed (dev mode?):",
          shopifyError,
        );
        console.log(
          "Continuing with payment verification - order saved in database",
        );
      }

      // Update order in orders_log database (source of truth)
      const { error: updateError } = await supabase
        .from("orders_log")
        .update({
          shopify_order_id: shopifyOrderId,
          order_number: completedOrderName,
          payment_status: "paid",
          payment_provider: paymentProvider,
          payment_reference: paymentReference,
          paid_at: new Date().toISOString(),
          status: "paid",
          notes: shopifyOrderId
            ? `Payment verified via ${paymentProvider}. Awaiting admin fulfillment decision.`
            : `Payment verified via ${paymentProvider}. Shopify order creation skipped (dev mode). Awaiting admin fulfillment decision.`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (updateError) {
        console.error("Failed to update order in database:", updateError);
      }

      // Update payment transaction status
      await supabase
        .from("payment_transactions")
        .update({
          status: "success",
          updated_at: new Date().toISOString(),
        })
        .eq("transaction_reference", paymentReference);

      console.log("Order payment completed successfully:", {
        orderId,
        shopifyOrderId: shopifyOrderId || "N/A (dev mode)",
        orderName: completedOrderName,
        paymentProvider,
      });

      // Redirect to success page (NO fulfillment yet - admin will handle)
      return NextResponse.redirect(
        new URL(
          `/checkout/success?order_id=${orderId}&order_name=${completedOrderName}&email=${orderData.customer_email}`,
          request.url,
        ),
      );
    } catch (error) {
      console.error("Failed to complete order:", error);

      // Payment was verified but order completion failed
      // This requires manual intervention
      await supabase
        .from("orders_log")
        .update({
          status: "payment_verified_needs_review",
          payment_status: "verified",
          payment_provider: paymentProvider,
          payment_reference: paymentReference,
          notes: `Payment verified but order completion failed: ${error instanceof Error ? error.message : "Unknown error"}. Requires admin review.`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      return NextResponse.redirect(
        new URL(
          `/checkout/success?error=order_completion_failed&order_id=${orderId}`,
          request.url,
        ),
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.redirect(
      new URL(
        `/checkout/success?error=unexpected_error&message=${encodeURIComponent(error instanceof Error ? error.message : "Unknown error")}`,
        request.url,
      ),
    );
  }
}

export async function POST(request: NextRequest) {
  // Handle webhook callbacks from payment providers
  try {
    // This would be expanded to handle webhooks properly
    // For now, just acknowledge receipt
    return NextResponse.json(
      { message: "Webhook received - implement signature verification" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
