"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Package,
  Mail,
  AlertTriangle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { sendOrderConfirmationEmailClient } from "@/lib/email";
import { useCart } from "@/lib/cart-context";

function CheckoutFeedbackContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  // Extract params directly instead of using state
  const orderIdParam = searchParams.get("order_id");
  const orderNameParam = searchParams.get("order_name");
  const emailParam = searchParams.get("email");
  const reference = searchParams.get("reference");
  const fulfillmentWarningParam = searchParams.get("fulfillment_warning");
  const errorParam = searchParams.get("error");
  const messageParam = searchParams.get("message");

  const orderName = orderNameParam;
  const orderId = orderIdParam;
  const email = emailParam;
  const fulfillmentWarning = fulfillmentWarningParam === "true";
  const error = errorParam;
  const errorMessage = messageParam ? decodeURIComponent(messageParam) : null;

  const isSuccess = !error && (orderName || orderId);
  const [emailSent, setEmailSent] = useState(false);

  // Log payment reference if present
  useEffect(() => {
    if (reference) {
      console.log("Payment reference:", reference);
    }
  }, [reference]);

  // Send confirmation email using EmailJS (only for successful orders)
  useEffect(() => {
    if (isSuccess && orderName && email && !emailSent) {
      console.log("Attempting to send order confirmation email...", {
        to_email: email,
        order_name: orderName,
        order_id: orderId,
      });

      sendOrderConfirmationEmailClient({
        to_email: email,
        order_name: orderName,
        order_id: orderId || orderName,
      })
        .then((result) => {
          if (result.success) {
            setEmailSent(true);
            console.log("Order confirmation email sent successfully!");
            toast.success("Confirmation email sent!");
          } else {
            console.error("Failed to send confirmation email:", result.error);
            console.error("Make sure EMAILJS environment variables are set:");
            console.error("- NEXT_PUBLIC_EMAILJS_SERVICE_ID");
            console.error("- NEXT_PUBLIC_EMAILJS_TEMPLATE_ID");
            console.error("- NEXT_PUBLIC_EMAILJS_PUBLIC_KEY");
            // Don't show error to user - email is optional
          }
        })
        .catch((error) => {
          console.error("Email sending exception:", error);
        });
    }
  }, [isSuccess, orderName, email, orderId, emailSent]);

  // Clear cart after successful payment
  useEffect(() => {
    if (isSuccess && orderName) {
      console.log("Payment successful - clearing cart");
      clearCart();
    }
  }, [isSuccess, orderName, clearCart]);

  // Render error/failure state
  if (!isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="pt-10" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-2xl p-12 shadow-xl border border-gray-200/70 dark:border-gray-700/70">
            <XCircle className="w-20 h-20 mx-auto mb-6 text-red-500" />
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
              Payment Failed
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              {error === "payment_verification_failed" &&
                "We couldn't verify your payment"}
              {error === "payment_not_verified" &&
                "Payment verification unsuccessful"}
              {error === "order_not_found" && "Order details not found"}
              {error === "draft_order_missing" && "Draft order is missing"}
              {error === "order_completion_failed" && "Order completion failed"}
              {error === "missing_payment_reference" &&
                "Payment reference is missing"}
              {error === "unexpected_error" && "An unexpected error occurred"}
              {!error && "Something went wrong with your payment"}
            </p>

            {errorMessage && (
              <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-800 dark:text-red-300">
                  {errorMessage}
                </p>
              </div>
            )}

            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <p className="font-semibold text-gray-900 dark:text-gray-200">
                  What Happened?
                </p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your payment could not be completed. Don&apos;t worry - no
                charges were made to your account. Please try again or contact
                support if the problem persists.
              </p>
            </div>

            <div className="space-y-4">
              <Link href="/checkout">
                <Button
                  size="lg"
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Again
                </Button>
              </Link>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/cart"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                >
                  View Cart
                </Link>
                <span className="text-gray-400">•</span>
                <Link
                  href="/contact"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                >
                  Contact Support
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

  // Render success state
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
          {orderName && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
              Order {orderName}
            </p>
          )}

          {email && (
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center gap-2">
              <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {emailSent
                  ? `A confirmation email has been sent to ${email}`
                  : `Confirmation email will be sent to ${email}`}
              </p>
            </div>
          )}

          {fulfillmentWarning && (
            <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <p className="font-semibold text-yellow-900 dark:text-yellow-200">
                  Fulfillment Notice
                </p>
              </div>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                Your payment was successful, but there was an issue with
                automatic fulfillment. Our team has been notified and will
                process your order manually within 24 hours.
              </p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <p className="font-semibold text-indigo-900 dark:text-indigo-200">
                  {"What's"} Next?
                </p>
              </div>
              <p className="text-sm text-indigo-800 dark:text-indigo-300">
                We&apos;re processing your order and will send you shipping
                updates via email. You&apos;ll receive tracking information once
                your order ships.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Link href="/collections/all">
              <Button
                size="lg"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
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

export default function CheckoutFeedbackPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-6 py-20">
          <div className="pt-10" />
          <div className="text-center">
            <div className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-2xl p-12 shadow-xl border border-gray-200/70 dark:border-gray-700/70">
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <CheckoutFeedbackContent />
    </Suspense>
  );
}
