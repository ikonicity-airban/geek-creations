import { NextRequest, NextResponse } from "next/server";
import { createDraftOrder } from "@/lib/shopify";
import { initializePayment } from "@/lib/payments";
import { createSolanaPaymentRequest } from "@/lib/payments/solana-pay";
import { createClient } from "@supabase/supabase-js";
import type { CheckoutData, CartItem } from "@/types";
import { CONFIG } from "@/lib/config";

const SHOPIFY_CURRENCY_CODE = CONFIG.SHOPIFY.currencyCode.trim().toUpperCase();

const supabase = createClient(
  CONFIG.DATABASE.supabaseUrl,
  CONFIG.DATABASE.supabaseServiceRoleKey,
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
        { status: 400 },
      );
    }

    // Require a valid currency code to avoid Shopify "invalid money" errors
    if (!SHOPIFY_CURRENCY_CODE) {
      return NextResponse.json(
        {
          error:
            "Missing SHOPIFY_CURRENCY_CODE env. Set it to your store's primary currency (e.g., USD, EUR, GBP).",
        },
        { status: 500 },
      );
    }

    // Build custom line items for draft order (no Shopify variant required)
    const lineItems = cart_items.map((item) => {
      const custom = item as unknown as Record<string, unknown>;
      const productTitle =
        typeof custom.product_title === "string"
          ? custom.product_title
          : undefined;
      const designName =
        typeof custom.design_name === "string" ? custom.design_name : undefined;
      const designUrl =
        typeof custom.design_url === "string" ? custom.design_url : undefined;
      const productType =
        typeof custom.product_type === "string"
          ? custom.product_type
          : "Custom";
      const selectedOptions =
        custom.selected_options !== undefined ? custom.selected_options : null;

      return {
        title: `${productTitle || "Custom Merch"} - ${
          designName || "Custom Design"
        }`,
        originalUnitPrice: {
          amount: Number(item.price).toFixed(2),
          currencyCode: SHOPIFY_CURRENCY_CODE,
        },
        quantity: item.quantity,
        customAttributes: [
          { key: "design_url", value: designUrl || "" },
          { key: "product_type", value: productType },
          {
            key: "variant_options",
            value: selectedOptions ? JSON.stringify(selectedOptions) : "",
          },
        ],
      };
    });

    // Calculate total amount (in kobo for Paystack, or in smallest unit for crypto)
    const totalAmount = cart_items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tax = totalAmount * 0.075; // 7.5% VAT
    const shipping = totalAmount >= 50000 ? 0 : 2500;
    const finalTotal = totalAmount + tax + shipping;

    // Determine currency based on payment method
    const currency =
      payment_method === "crypto"
        ? crypto_currency || "USDC"
        : SHOPIFY_CURRENCY_CODE || "NGN";

    // Create draft order in Shopify for manual review/fulfillment
    let shopifyDraftOrder;
    try {
      shopifyDraftOrder = await createDraftOrder({
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
        financialStatus: "PENDING", // Always pending for manual review
        note: "MANUAL FULFILLMENT REQUIRED - Review in admin dashboard",
        tags: ["manual-review", "pending-admin"],
      });
      if (!shopifyDraftOrder) {
        throw new Error("Draft order creation returned no draft order");
      }
    } catch (error) {
      console.error("Shopify draft order creation error:", error);
      return NextResponse.json(
        {
          error: `Failed to create draft order: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        },
        { status: 500 },
      );
    }

    // Save order to Supabase orders_log table (main source of truth)
    let supabaseOrderId: string | null = null;
    try {
      // Format line items for storage
      const formattedLineItems = cart_items.map((item) => {
        const custom = item as unknown as Record<string, unknown>;
        return {
          id: item.variant_id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          product_title:
            typeof custom.product_title === "string"
              ? custom.product_title
              : item.product_title || "Custom Product",
          design_name:
            typeof custom.design_name === "string"
              ? custom.design_name
              : "Custom Design",
          design_url:
            typeof custom.design_url === "string" ? custom.design_url : null,
          product_type:
            typeof custom.product_type === "string"
              ? custom.product_type
              : "Custom",
          quantity: item.quantity,
          price: item.price,
          selected_options: custom.selected_options || null,
        };
      });

      const { data: orderData, error: insertError } = await supabase
        .from("orders_log")
        .insert({
          shopify_draft_order_id: shopifyDraftOrder.id,
          order_number: shopifyDraftOrder.name,
          customer_email: email,
          customer_phone: shipping_address.phone,
          shipping_address: shipping_address,
          billing_address: billing_address || shipping_address,
          line_items: formattedLineItems,
          total_price: finalTotal.toString(),
          subtotal: totalAmount.toString(),
          tax: tax.toString(),
          shipping_cost: shipping.toString(),
          currency: currency,
          payment_method: payment_method,
          payment_status: "pending",
          status: "pending_payment",
          fulfillment_provider: "manual",
          notes: "Order created via checkout - awaiting payment",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (!insertError && orderData) {
        supabaseOrderId = orderData.id.toString();
      } else {
        console.error("Failed to insert order to orders_log:", insertError);
      }
    } catch (error) {
      console.error("Failed to save order to Supabase:", error);
      // Log error but don't fail the request - Shopify order is already created
    }

    // Handle payment based on method
    let paymentUrl: string | null = null;
    let paymentReference: string | null = null;

    if (payment_method === "card" || payment_method === "bank_transfer") {
      // Use modular payment service
      try {
        const paymentResponse = await initializePayment(
          {
            email,
            amount: finalTotal,
            currency: currency as string,
            orderId: supabaseOrderId || shopifyDraftOrder.name,
            callbackUrl: `${req.nextUrl.origin}/api/payment/verify`,
            customer: {
              name: `${shipping_address.first_name} ${shipping_address.last_name}`,
              phone_number: shipping_address.phone,
            },
            metadata: {
              draft_order_id: shopifyDraftOrder.id,
              draft_order_name: shopifyDraftOrder.name,
            },
          },
          payment_method,
        );

        paymentUrl = paymentResponse.payment_url;
        paymentReference = paymentResponse.reference;
      } catch (error) {
        console.error("Payment initialization error:", error);
        return NextResponse.json(
          { error: "Failed to initialize payment" },
          { status: 500 },
        );
      }
    } else if (payment_method === "crypto") {
      // Create Solana payment request
      try {
        const solanaResponse = await createSolanaPaymentRequest({
          amount: finalTotal,
          label: `Draft ${shopifyDraftOrder.name}`,
          orderId: shopifyDraftOrder.name,
          memo: `Draft ${shopifyDraftOrder.name}`,
        });
        // For crypto payments, redirect to payment URL
        if (solanaResponse.url) {
          return NextResponse.json({
            success: true,
            draft_order_id: shopifyDraftOrder.id,
            draft_order_name: shopifyDraftOrder.name,
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
          { status: 500 },
        );
      }
    }

    // Log payment transaction to database
    if (paymentReference && supabaseOrderId) {
      try {
        const paymentProvider =
          payment_method === "crypto" ? "solana" : CONFIG.PAYMENT.provider;

        // Update orders_log with payment reference
        await supabase
          .from("orders_log")
          .update({
            payment_reference: paymentReference,
            payment_provider: paymentProvider,
          })
          .eq("id", supabaseOrderId);

        // Log to payment_transactions table
        await supabase.from("payment_transactions").insert({
          order_id: parseInt(supabaseOrderId),
          payment_method: payment_method,
          payment_provider: paymentProvider,
          transaction_reference: paymentReference,
          amount: finalTotal.toString(),
          currency: currency,
          status: "pending",
          metadata: {
            draft_order_id: shopifyDraftOrder.id,
            draft_order_name: shopifyDraftOrder.name,
            email,
            payment_method,
            crypto_currency: crypto_currency || null,
          },
          created_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Failed to log payment transaction:", error);
        // Don't fail the request if logging fails
      }
    }

    return NextResponse.json({
      success: true,
      order_id: supabaseOrderId,
      draft_order_id: shopifyDraftOrder.id,
      draft_order_name: shopifyDraftOrder.name,
      invoice_url: shopifyDraftOrder.invoiceUrl,
      payment_url: paymentUrl,
      payment_reference: paymentReference,
      total: finalTotal,
      currency: currency,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}
