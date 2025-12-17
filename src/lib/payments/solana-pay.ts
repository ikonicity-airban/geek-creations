type SolanaPaymentRequest = {
  amount: number;
  label: string;
  orderId: string | number;
  memo?: string;
};

export type SolanaPaymentLink = {
  url: string;
  reference: string;
};

export async function createSolanaPaymentRequest(input: SolanaPaymentRequest): Promise<SolanaPaymentLink> {
  const reference = `sol_${input.orderId}_${Date.now()}`;
  // Stub link: replace with real Solana Pay URL generation
  const url = `https://solana-pay-placeholder/${reference}?amount=${input.amount}&label=${encodeURIComponent(
    input.label
  )}`;
  return { url, reference };
}

export async function verifySolanaTransaction(signature: string) {
  // Stub verification: replace with cluster confirmation + reference check
  return {
    status: "pending",
    signature,
  };
}

