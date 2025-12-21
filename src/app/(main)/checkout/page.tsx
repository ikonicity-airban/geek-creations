"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  CreditCard,
  Wallet,
  Building2,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { CheckoutData, ShippingAddress } from "@/types";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"info" | "payment" | "success">("info");
  const [orderId, setOrderId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CheckoutData>({
    email: "",
    shipping_address: {
      first_name: "",
      last_name: "",
      address1: "",
      address2: "",
      city: "",
      province: "",
      country: "Nigeria",
      zip: "",
      phone: "",
    },
    payment_method: "card",
    crypto_currency: undefined,
  });

  const [useBillingAddress, setUseBillingAddress] = useState(false);
  const [billingAddress, setBillingAddress] = useState<ShippingAddress>({
    first_name: "",
    last_name: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    country: "Nigeria",
    zip: "",
    phone: "",
  });

  useEffect(() => {
    // Check if cart is empty
    if (cart.items.length === 0 && step !== "success") {
      router.push("/cart");
      return;
    }

    // Try to get user session and pre-fill email
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setFormData((prev) => ({
          ...prev,
          email: session.user.email || "",
        }));
        if (session.user.user_metadata?.first_name) {
          setFormData((prev) => ({
            ...prev,
            shipping_address: {
              ...prev.shipping_address,
              first_name: session.user.user_metadata.first_name || "",
              last_name: session.user.user_metadata.last_name || "",
            },
          }));
        }
      } else {
        // If not logged in, redirect to signup
        router.push("/signup?redirect=/checkout");
      }
    };
    getUser();
  }, [cart.items.length, router, step, supabase]);

  const validateShippingInfo = (): boolean => {
    const addr = formData.shipping_address;
    if (
      !formData.email ||
      !addr.first_name ||
      !addr.last_name ||
      !addr.address1 ||
      !addr.city ||
      !addr.province ||
      !addr.country ||
      !addr.zip ||
      !addr.phone
    ) {
      setError("Please fill in all required shipping fields");
      return false;
    }
    return true;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShippingInfo()) {
      setError("");
      setStep("payment");
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          billing_address: useBillingAddress ? billingAddress : formData.shipping_address,
          cart_items: cart.items,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      // If payment method requires redirect (card, bank transfer, or crypto with URL)
      if (data.payment_url && (formData.payment_method === "card" || formData.payment_method === "bank_transfer" || (formData.payment_method === "crypto" && data.requires_redirect))) {
        window.location.href = data.payment_url;
        return;
      }

      // For other payment methods or if no redirect needed
      setOrderId(data.order_id || data.order_number);
      clearCart();
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during checkout");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section?: "shipping" | "billing"
  ) => {
    const { name, value } = e.target;

    if (section === "billing") {
      setBillingAddress((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === "email") {
      setFormData((prev) => ({ ...prev, email: value }));
    } else if (name === "payment_method") {
      setFormData((prev) => ({
        ...prev,
        payment_method: value as "card" | "crypto" | "bank_transfer",
        crypto_currency: value === "crypto" ? "USDC" : undefined,
      }));
    } else if (name === "crypto_currency") {
      setFormData((prev) => ({
        ...prev,
        crypto_currency: value as "USDC" | "SOL",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        shipping_address: {
          ...prev.shipping_address,
          [name]: value,
        },
      }));
    }
  };

  if (cart.items.length === 0 && step !== "success") {
    return null; // Will redirect
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="pt-10" />

      {step === "success" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-2xl p-12 shadow-xl border border-gray-200/70 dark:border-gray-700/70">
            <CheckCircle2 className="w-20 h-20 mx-auto mb-6 text-green-500" />
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              Thank you for your purchase
            </p>
            {orderId && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
                Order #{orderId}
              </p>
            )}
            <div className="space-y-4">
              <Link href="/collections/all">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                  Continue Shopping
                </Button>
              </Link>
              <div>
                <Link href="/orders" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
                  View Order Details
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-xl p-6 shadow-sm border border-gray-200/70 dark:border-gray-700/70"
            >
              {step === "info" ? (
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                      Shipping Information
                    </h2>
                    {error && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 mb-6">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                      </div>
                    )}

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        We'll send your order confirmation to this email
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name *
                        </label>
                        <Input
                          type="text"
                          name="first_name"
                          value={formData.shipping_address.first_name}
                          onChange={handleChange}
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name *
                        </label>
                        <Input
                          type="text"
                          name="last_name"
                          value={formData.shipping_address.last_name}
                          onChange={handleChange}
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address *
                      </label>
                      <Input
                        type="text"
                        name="address1"
                        value={formData.shipping_address.address1}
                        onChange={handleChange}
                        placeholder="123 Main Street"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Apartment, suite, etc. (optional)
                      </label>
                      <Input
                        type="text"
                        name="address2"
                        value={formData.shipping_address.address2}
                        onChange={handleChange}
                        placeholder="Apt 4B"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City *
                        </label>
                        <Input
                          type="text"
                          name="city"
                          value={formData.shipping_address.city}
                          onChange={handleChange}
                          placeholder="Lagos"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          State/Province *
                        </label>
                        <Input
                          type="text"
                          name="province"
                          value={formData.shipping_address.province}
                          onChange={handleChange}
                          placeholder="Lagos"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Country *
                        </label>
                        <select
                          name="country"
                          value={formData.shipping_address.country}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        >
                          <option value="Nigeria">Nigeria</option>
                          <option value="Ghana">Ghana</option>
                          <option value="Kenya">Kenya</option>
                          <option value="South Africa">South Africa</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          ZIP/Postal Code *
                        </label>
                        <Input
                          type="text"
                          name="zip"
                          value={formData.shipping_address.zip}
                          onChange={handleChange}
                          placeholder="100001"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.shipping_address.phone}
                        onChange={handleChange}
                        placeholder="+234 800 000 0000"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                      <input
                        type="checkbox"
                        id="useBilling"
                        checked={useBillingAddress}
                        onChange={(e) => setUseBillingAddress(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <label htmlFor="useBilling" className="text-sm text-gray-700 dark:text-gray-300">
                        Use different billing address
                      </label>
                    </div>

                    {useBillingAddress && (
                      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                          Billing Address
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              First Name *
                            </label>
                            <Input
                              type="text"
                              name="first_name"
                              value={billingAddress.first_name}
                              onChange={(e) => handleChange(e, "billing")}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Last Name *
                            </label>
                            <Input
                              type="text"
                              name="last_name"
                              value={billingAddress.last_name}
                              onChange={(e) => handleChange(e, "billing")}
                              required
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Address *
                          </label>
                          <Input
                            type="text"
                            name="address1"
                            value={billingAddress.address1}
                            onChange={(e) => handleChange(e, "billing")}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              City *
                            </label>
                            <Input
                              type="text"
                              name="city"
                              value={billingAddress.city}
                              onChange={(e) => handleChange(e, "billing")}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              ZIP Code *
                            </label>
                            <Input
                              type="text"
                              name="zip"
                              value={billingAddress.zip}
                              onChange={(e) => handleChange(e, "billing")}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      Continue to Payment
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <button
                      type="button"
                      onClick={() => setStep("info")}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Shipping
                    </button>

                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                      Payment Method
                    </h2>
                    {error && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 mb-6">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      <label className="flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-indigo-500 transition">
                        <input
                          type="radio"
                          name="payment_method"
                          value="card"
                          checked={formData.payment_method === "card"}
                          onChange={handleChange}
                          className="w-5 h-5"
                        />
                        <CreditCard className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            Credit/Debit Card
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Pay with Paystack (Visa, Mastercard, Verve)
                          </div>
                        </div>
                      </label>

                      <label className="flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-indigo-500 transition">
                        <input
                          type="radio"
                          name="payment_method"
                          value="crypto"
                          checked={formData.payment_method === "crypto"}
                          onChange={handleChange}
                          className="w-5 h-5"
                        />
                        <Wallet className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            Cryptocurrency
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Pay with USDC or SOL on Solana
                          </div>
                        </div>
                      </label>

                      {formData.payment_method === "crypto" && (
                        <div className="ml-12 mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Select Currency
                          </label>
                          <select
                            name="crypto_currency"
                            value={formData.crypto_currency || "USDC"}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="USDC">USDC (Solana)</option>
                            <option value="SOL">SOL (Solana)</option>
                          </select>
                        </div>
                      )}

                      <label className="flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-indigo-500 transition">
                        <input
                          type="radio"
                          name="payment_method"
                          value="bank_transfer"
                          checked={formData.payment_method === "bank_transfer"}
                          onChange={handleChange}
                          className="w-5 h-5"
                        />
                        <Building2 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            Bank Transfer
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Direct bank transfer (Paystack)
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-start gap-3">
                      <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your payment information is secure and encrypted. We never store your card details.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : `Complete Order - ₦${cart.total.toLocaleString()}`}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-xl p-6 shadow-lg border border-gray-200/70 dark:border-gray-700/70 sticky top-24"
            >
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.variant_id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.product_title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        {item.product_title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {item.variant_title} × {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pt-4 border-t border-gray-200/80 dark:border-gray-700/80">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold">₦{cart.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (7.5%)</span>
                  <span className="font-semibold">₦{cart.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {cart.shipping === 0 ? (
                      <span className="text-green-600 dark:text-green-400">FREE</span>
                    ) : (
                      `₦${cart.shipping.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-200/80 dark:border-gray-700/80">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                      ₦{cart.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
