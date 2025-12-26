// app/cart/page.tsx
"use client";

import { motion } from "framer-motion";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShoppingCart as CartIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { IconShoppingBagPlus } from "@tabler/icons-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl min-h-[80vh] mx-auto px-6 py-20 text-center flex flex-col items-center justify-center">
        <div className="pt-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-full"
        >
          <IconShoppingBagPlus className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
          <h3 className="text-4xl font-black text-foreground mb-4">
            Your Cart is Empty
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Looks like you haven&#39;t added any items to your cart yet. Start
            shopping to find your perfect geek gear!
          </p>
          <Link href="/collections/all">
            <Button size="lg">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="pt-10" />

        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white">
            Shopping Cart
          </h1>
          <div className="flex items-center mt-2 gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <CartIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span>
              {cart.item_count} {cart.item_count === 1 ? "item" : "items"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item, index) => (
              <motion.div
                key={item.variant_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card backdrop-blur rounded-xl p-6 shadow-sm border border-border dark:border-border"
              >
                <div className="flex gap-6 flex-col sm:flex-row">
                  {/* Product Image */}
                  <div className="relative size-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.product_title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <Link href={`/products/${item.product_id}`}>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white hover:text-indigo-600 mb-1 wrap-break-word">
                        {item.product_title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {item.variant_title}
                    </p>

                    <div className="flex md:items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() =>
                            updateQuantity(item.variant_id, item.quantity - 1)
                          }
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon-sm"
                          variant="outline"
                          onClick={() =>
                            updateQuantity(item.variant_id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.max_quantity}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          ₦{item.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="outline"
                    onClick={() => removeFromCart(item.variant_id)}
                    className="text-gray-400 hover:text-red-500 transition shrink-0 absolute sm:relative max-sm:top-4 max-sm:right-4"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            ))}

            <Link href="/collections/all">
              <Button className="w-full">Continue Shopping</Button>
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card backdrop-blur rounded-xl p-6 shadow-lg border border-gray-200/70 dark:border-gray-700/70 sticky top-24"
            >
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    ₦{cart.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (7.5%)</span>
                  <span className="font-semibold">
                    ₦{cart.tax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {cart.shipping === 0 ? (
                      <span className="text-green-600 dark:text-green-400">
                        FREE
                      </span>
                    ) : (
                      `₦${cart.shipping.toLocaleString()}`
                    )}
                  </span>
                </div>

                {cart.subtotal < 50000 && cart.subtotal > 0 && (
                  <div className="p-3 bg-yellow-50/80 dark:bg-yellow-900/20 border border-yellow-200/80 dark:border-yellow-800 rounded-lg">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      Add ₦{(50000 - cart.subtotal).toLocaleString()} more to
                      get FREE shipping!
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200/80 dark:border-gray-700/80">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                      ₦{cart.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-base">
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Pay with Crypto, Card, or Bank Transfer</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>7-day return policy</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
