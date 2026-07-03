// lib/payments/index.ts - Modular payment service router

import {
  initializePaystackPayment,
  verifyPaystackPayment,
  refundPaystackPayment,
} from "./paystack";
import {
  initializeFlutterwavePayment,
  verifyFlutterwavePayment,
  refundFlutterwavePayment,
} from "./flutterwave";
import { CONFIG } from "../config";

export type PaymentProvider = "paystack" | "flutterwave" | "monnify";
export type PaymentMethod = "card" | "bank_transfer" | "crypto";

interface PaymentInitInput {
  email: string;
  amount: number; // In main currency unit (e.g., NGN, not kobo)
  currency: string;
  orderId: string | number;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
  customer?: {
    name?: string;
    phone_number?: string;
  };
}

interface PaymentInitResponse {
  payment_url: string;
  reference: string;
  provider: PaymentProvider;
}

interface PaymentVerifyResponse {
  status: "success" | "failed" | "cancelled" | "abandoned";
  reference: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  metadata?: Record<string, unknown>;
}

/**
 * Get the payment provider to use based on environment configuration
 */
export function getPaymentProvider(method: PaymentMethod): PaymentProvider {
  // Default to Paystack for NGN
  const configuredProvider = CONFIG.PAYMENT.provider as PaymentProvider;

  // For crypto, use Solana (handled separately)
  if (method === "crypto") {
    return "paystack"; // Fallback, crypto should be handled by solana-pay.ts
  }

  // Use configured provider or default to Paystack
  return configuredProvider || "paystack";
}

/**
 * Initialize payment with the appropriate provider
 */
export async function initializePayment(
  input: PaymentInitInput,
  method: PaymentMethod = "card",
): Promise<PaymentInitResponse> {
  const provider = getPaymentProvider(method);

  switch (provider) {
    case "paystack": {
      const result = await initializePaystackPayment({
        email: input.email,
        amountKobo: Math.round(input.amount * 100), // Convert to kobo
        orderId: input.orderId,
        callbackUrl: input.callbackUrl,
        metadata: input.metadata,
        channels:
          method === "bank_transfer"
            ? ["bank_transfer", "bank"]
            : ["card", "bank", "ussd", "bank_transfer"],
      });

      return {
        payment_url: result.authorization_url,
        reference: result.reference,
        provider: "paystack",
      };
    }

    case "flutterwave": {
      const result = await initializeFlutterwavePayment({
        email: input.email,
        amount: input.amount,
        currency: input.currency,
        orderId: input.orderId,
        callbackUrl: input.callbackUrl,
        metadata: input.metadata,
        customer: input.customer,
        payment_options:
          method === "bank_transfer"
            ? "banktransfer"
            : "card,banktransfer,ussd,mobilemoney",
      });

      return {
        payment_url: result.payment_url,
        reference: result.tx_ref,
        provider: "flutterwave",
      };
    }

    case "monnify": {
      // Placeholder for future Monnify integration
      throw new Error("Monnify integration not yet implemented");
    }

    default:
      throw new Error(`Unknown payment provider: ${provider}`);
  }
}

/**
 * Verify payment with the appropriate provider
 */
export async function verifyPayment(
  reference: string,
  provider: PaymentProvider,
): Promise<PaymentVerifyResponse> {
  switch (provider) {
    case "paystack": {
      const result = await verifyPaystackPayment(reference);
      return {
        status: result.status,
        reference: result.reference,
        amount: result.amount,
        currency: result.currency,
        provider: "paystack",
        metadata: result.metadata,
      };
    }

    case "flutterwave": {
      const result = await verifyFlutterwavePayment(reference);
      return {
        status: result.status,
        reference: result.tx_ref,
        amount: result.amount,
        currency: result.currency,
        provider: "flutterwave",
        metadata: result.metadata,
      };
    }

    case "monnify": {
      // Placeholder for future Monnify integration
      throw new Error("Monnify integration not yet implemented");
    }

    default:
      throw new Error(`Unknown payment provider: ${provider}`);
  }
}

/**
 * Refund payment with the appropriate provider
 */
export async function refundPayment(
  reference: string,
  provider: PaymentProvider,
  amount?: number,
): Promise<{ status: string; message: string }> {
  switch (provider) {
    case "paystack": {
      const amountKobo = amount ? Math.round(amount * 100) : undefined;
      return await refundPaystackPayment(reference, amountKobo);
    }

    case "flutterwave": {
      return await refundFlutterwavePayment(reference, amount);
    }

    case "monnify": {
      // Placeholder for future Monnify integration
      throw new Error("Monnify integration not yet implemented");
    }

    default:
      throw new Error(`Unknown payment provider: ${provider}`);
  }
}

/**
 * Detect payment provider from reference format
 */
export function detectProviderFromReference(
  reference: string,
): PaymentProvider {
  if (reference.startsWith("psk_")) return "paystack";
  if (reference.startsWith("flw_")) return "flutterwave";
  // Add more patterns as needed
  return "paystack"; // Default
}
