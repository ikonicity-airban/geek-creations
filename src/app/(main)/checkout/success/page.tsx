"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Package, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const order = searchParams.get("order");
    const emailParam = searchParams.get("email");
    const reference = searchParams.get("reference");

    if (order) {
      setOrderNumber(order);
    }
    if (emailParam) {
      setEmail(emailParam);
    }

    // If payment was successful via callback, we might want to verify it
    if (reference) {
      // Optionally verify payment here
      console.log("Payment reference:", reference);
    }
  }, [searchParams]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <div className="pt-10" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-2xl p-12 shadow-xl border border-gray-200/70 dark:border-gray-700/70">
          <CheckCircle2 className="w-20 h-20 mx-auto mb-6 text-green-500" />
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Thank you for your purchase
          </p>
          {orderNumber && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
              Order #{orderNumber}
            </p>
          )}

          {email && (
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center gap-2">
              <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A confirmation email has been sent to {email}
              </p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <p className="font-semibold text-indigo-900 dark:text-indigo-200">
                  What's Next?
                </p>
              </div>
              <p className="text-sm text-indigo-800 dark:text-indigo-300">
                We're processing your order and will send you shipping updates via email.
                You'll receive tracking information once your order ships.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Link href="/collections/all">
              <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700">
                Continue Shopping
              </Button>
            </Link>
            <div className="flex gap-4 justify-center">
              <Link
                href="/orders"
                className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
              >
                View Order Details
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                href="/"
                className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
