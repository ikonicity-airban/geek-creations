// lib/payments/paystack.ts - Paystack payment integration
import crypto from "crypto";
import { CONFIG } from "../config";

type InitializeInput = {
  email: string;
  amountKobo: number; // amount in kobo (smallest currency unit)
  orderId: string | number;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
  channels?: string[]; // e.g., ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
};

export type PaystackInitResponse = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export type PaystackVerifyResponse = {
  status: "success" | "failed" | "abandoned";
  reference: string;
  amount: number;
  currency: string;
  channel: string;
  paid_at?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Initialize Paystack payment transaction
 */
export async function initializePaystackPayment(
  input: InitializeInput,
): Promise<PaystackInitResponse> {
  const secretKey = CONFIG.PAYMENT.paystack.secretKey;

  if (!secretKey) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }

  const reference = `psk_${input.orderId}_${Date.now()}`;

  const payload = {
    email: input.email,
    amount: input.amountKobo,
    reference,
    callback_url: input.callbackUrl || `${CONFIG.APP.url}/payment/verify`,
    metadata: {
      order_id: input.orderId,
      ...input.metadata,
    },
    channels: input.channels || ["card", "bank", "ussd", "bank_transfer"],
  };

  try {
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secretKey}`,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Paystack initialization failed: ${errorData.message || response.statusText}`,
      );
    }

    const data = await response.json();

    if (!data.status || !data.data) {
      throw new Error("Invalid response from Paystack API");
    }

    return {
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    };
  } catch (error) {
    console.error("Paystack initialization error:", error);
    throw error;
  }
}

/**
 * Verify Paystack payment transaction
 */
export async function verifyPaystackPayment(
  reference: string,
): Promise<PaystackVerifyResponse> {
  const secretKey = CONFIG.PAYMENT.paystack.secretKey;

  if (!secretKey) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Paystack verification failed: ${errorData.message || response.statusText}`,
      );
    }

    const data = await response.json();

    if (!data.status || !data.data) {
      throw new Error("Invalid verification response from Paystack");
    }

    const transactionData = data.data;

    return {
      status: transactionData.status,
      reference: transactionData.reference,
      amount: transactionData.amount / 100, // Convert from kobo to main currency
      currency: transactionData.currency,
      channel: transactionData.channel,
      paid_at: transactionData.paid_at,
      metadata: transactionData.metadata,
    };
  } catch (error) {
    console.error("Paystack verification error:", error);
    throw error;
  }
}

/**
 * Create refund for a Paystack transaction
 */
export async function refundPaystackPayment(
  reference: string,
  amountKobo?: number, // Optional: partial refund
): Promise<{ status: string; message: string }> {
  const secretKey = CONFIG.PAYMENT.paystack.secretKey;

  if (!secretKey) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }

  const payload: { transaction: string; amount?: number } = {
    transaction: reference,
  };

  if (amountKobo) {
    payload.amount = amountKobo;
  }

  try {
    const response = await fetch("https://api.paystack.co/refund", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Paystack refund failed: ${errorData.message || response.statusText}`,
      );
    }

    const data = await response.json();

    return {
      status: data.status ? "success" : "failed",
      message: data.message || "Refund processed",
    };
  } catch (error) {
    console.error("Paystack refund error:", error);
    throw error;
  }
}

/**
 * Verify Paystack webhook signature
 */
export function verifyPaystackWebhook(
  payload: string,
  signature: string,
): boolean {
  const secretKey = CONFIG.PAYMENT.paystack.secretKey;

  if (!secretKey) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }

  const hash = crypto
    .createHmac("sha512", secretKey)
    .update(payload)
    .digest("hex");

  return hash === signature;
}
