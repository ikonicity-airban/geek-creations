// lib/payments/flutterwave.ts - Flutterwave payment integration
import { CONFIG } from "../config";

type InitializeInput = {
  email: string;
  amount: number; // amount in main currency unit (e.g., NGN, USD)
  currency: string; // e.g., 'NGN', 'USD', 'GHS', 'KES'
  orderId: string | number;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
  customer?: {
    name?: string;
    phone_number?: string;
  };
  payment_options?: string; // e.g., 'card,banktransfer,ussd,mobilemoney'
};

export type FlutterwaveInitResponse = {
  payment_url: string;
  tx_ref: string;
};

export type FlutterwaveVerifyResponse = {
  status: "success" | "failed" | "cancelled";
  tx_ref: string;
  flw_ref: string;
  amount: number;
  currency: string;
  charged_amount: number;
  payment_type: string;
  transaction_id: number;
  created_at?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Initialize Flutterwave payment transaction
 */
export async function initializeFlutterwavePayment(
  input: InitializeInput,
): Promise<FlutterwaveInitResponse> {
  const secretKey = CONFIG.PAYMENT.flutterwave.secretKey;
  const publicKey = CONFIG.PAYMENT.flutterwave.publicKey;

  if (!secretKey || !publicKey) {
    throw new Error(
      "FLUTTERWAVE_SECRET_KEY or FLUTTERWAVE_PUBLIC_KEY is not configured",
    );
  }

  const tx_ref = `flw_${input.orderId}_${Date.now()}`;

  const payload = {
    tx_ref,
    amount: input.amount,
    currency: input.currency,
    redirect_url: input.callbackUrl || `${CONFIG.APP.url}/payment/verify`,
    payment_options:
      input.payment_options || "card,banktransfer,ussd,mobilemoney",
    customer: {
      email: input.email,
      name: input.customer?.name || input.email.split("@")[0],
      phonenumber: input.customer?.phone_number || "",
    },
    customizations: {
      title: CONFIG.SITE.name,
      description: `Order #${input.orderId}`,
      logo: CONFIG.SITE.logoUrl,
    },
    meta: {
      order_id: input.orderId,
      ...input.metadata,
    },
  };

  try {
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
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
        `Flutterwave initialization failed: ${errorData.message || response.statusText}`,
      );
    }

    const data = await response.json();

    if (data.status !== "success" || !data.data) {
      throw new Error(
        `Flutterwave initialization failed: ${data.message || "Unknown error"}`,
      );
    }

    return {
      payment_url: data.data.link,
      tx_ref: tx_ref,
    };
  } catch (error) {
    console.error("Flutterwave initialization error:", error);
    throw error;
  }
}

/**
 * Verify Flutterwave payment transaction
 */
export async function verifyFlutterwavePayment(
  transactionId: string,
): Promise<FlutterwaveVerifyResponse> {
  const secretKey = CONFIG.PAYMENT.flutterwave.secretKey;

  if (!secretKey) {
    throw new Error("FLUTTERWAVE_SECRET_KEY is not configured");
  }

  try {
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
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
        `Flutterwave verification failed: ${errorData.message || response.statusText}`,
      );
    }

    const data = await response.json();

    if (data.status !== "success" || !data.data) {
      throw new Error(
        `Flutterwave verification failed: ${data.message || "Unknown error"}`,
      );
    }

    const transactionData = data.data;

    return {
      status: transactionData.status,
      tx_ref: transactionData.tx_ref,
      flw_ref: transactionData.flw_ref,
      amount: transactionData.amount,
      currency: transactionData.currency,
      charged_amount: transactionData.charged_amount,
      payment_type: transactionData.payment_type,
      transaction_id: transactionData.id,
      created_at: transactionData.created_at,
      metadata: transactionData.meta,
    };
  } catch (error) {
    console.error("Flutterwave verification error:", error);
    throw error;
  }
}

/**
 * Create refund for a Flutterwave transaction
 */
export async function refundFlutterwavePayment(
  transactionId: string,
  amount?: number, // Optional: partial refund
): Promise<{ status: string; message: string }> {
  const secretKey = CONFIG.PAYMENT.flutterwave.secretKey;

  if (!secretKey) {
    throw new Error("FLUTTERWAVE_SECRET_KEY is not configured");
  }

  const payload: { id: number; amount?: number } = {
    id: parseInt(transactionId),
  };

  if (amount) {
    payload.amount = amount;
  }

  try {
    const response = await fetch(
      "https://api.flutterwave.com/v3/transactions/refund",
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
        `Flutterwave refund failed: ${errorData.message || response.statusText}`,
      );
    }

    const data = await response.json();

    return {
      status: data.status === "success" ? "success" : "failed",
      message: data.message || "Refund processed",
    };
  } catch (error) {
    console.error("Flutterwave refund error:", error);
    throw error;
  }
}

/**
 * Verify Flutterwave webhook signature
 */
export function verifyFlutterwaveWebhook(
  payload: string,
  signature: string,
): boolean {
  const secretHash = CONFIG.PAYMENT.flutterwave.encryptionKey;

  if (!secretHash) {
    throw new Error("FLUTTERWAVE_SECRET_HASH is not configured");
  }

  return signature === secretHash;
}
