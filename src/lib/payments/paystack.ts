type InitializeInput = {
  email: string;
  amountKobo: number; // amount in kobo
  orderId: string | number;
  callbackUrl?: string;
};

export type PaystackInitResponse = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export async function initializePaystackPayment(input: InitializeInput): Promise<PaystackInitResponse> {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY is missing");
  }

  // Stub for now: integrate Paystack REST when keys are present
  const reference = `psk_${input.orderId}_${Date.now()}`;
  return {
    authorization_url: input.callbackUrl || "",
    access_code: "mock_access_code",
    reference,
  };
}

export async function verifyPaystackPayment(reference: string) {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY is missing");
  }
  // Stub verification: replace with real Paystack verify call
  return {
    status: "success",
    reference,
    amount: null,
    currency: "NGN",
  };
}

