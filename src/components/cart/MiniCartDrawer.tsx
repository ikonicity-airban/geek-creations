"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";
import Image from "next/image";

const COLORS = {
  primary: "#401268",
  secondary: "#c5a3ff",
  background: "#f8f6f0",
  accentWarm: "#e2ae3d",
  accentBold: "#e21b35",
};

interface MiniCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MiniCartDrawer({
  isOpen,
  onClose,
}: MiniCartDrawerProps) {
  const { cart, removeFromCart, updateQuantity } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: `${COLORS.primary}20` }}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag
                  className="w-6 h-6"
                  style={{ color: COLORS.primary }}
                />
                <h2
                  className="text-2xl font-black"
                  style={{
                    color: COLORS.primary,
                    fontFamily: "Orbitron, sans-serif",
                  }}
                >
                  Cart ({cart.item_count})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <X className="w-6 h-6" style={{ color: COLORS.primary }} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag
                    className="w-16 h-16 mb-4 opacity-30"
                    style={{ color: COLORS.primary }}
                  />
                  <p
                    className="text-lg font-semibold mb-2"
                    style={{ color: COLORS.primary }}
                  >
                    Your cart is empty
                  </p>
                  <p className="text-sm opacity-70 mb-6">
                    Add some geek gear to get started!
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-lg font-bold text-white"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <motion.div
                      key={item.variant_id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 p-4 rounded-xl"
                      style={{ backgroundColor: `${COLORS.secondary}10` }}
                    >
                      {/* Image */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
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

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-bold text-sm mb-1 truncate"
                          style={{ color: COLORS.primary }}
                        >
                          {item.product_title}
                        </h3>
                        <p className="text-xs opacity-70 mb-2">
                          {item.variant_title}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.variant_id, item.quantity - 1)
                            }
                            className="p-1 rounded bg-white hover:bg-gray-50 transition"
                            style={{ color: COLORS.primary }}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span
                            className="text-sm font-bold w-6 text-center"
                            style={{ color: COLORS.primary }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.variant_id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.max_quantity}
                            className="p-1 rounded bg-white hover:bg-gray-50 transition disabled:opacity-50"
                            style={{ color: COLORS.primary }}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(item.variant_id)}
                          className="p-1 rounded hover:bg-white transition"
                          style={{ color: COLORS.accentBold }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <p
                          className="font-black text-sm"
                          style={{ color: COLORS.primary }}
                        >
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div
                className="p-6 border-t"
                style={{ borderColor: `${COLORS.primary}20` }}
              >
                {/* Subtotal */}
                <div className="flex justify-between mb-4">
                  <span
                    className="font-semibold"
                    style={{ color: COLORS.primary }}
                  >
                    Subtotal
                  </span>
                  <span
                    className="font-black text-xl"
                    style={{ color: COLORS.primary }}
                  >
                    ₦{cart.subtotal.toLocaleString()}
                  </span>
                </div>

                {/* Free Shipping Notice */}
                {cart.subtotal < 50000 && (
                  <div
                    className="p-3 rounded-lg mb-4 text-xs"
                    style={{
                      backgroundColor: `${COLORS.accentWarm}20`,
                      color: COLORS.primary,
                    }}
                  >
                    Add ₦{(50000 - cart.subtotal).toLocaleString()} more for
                    FREE shipping!
                  </div>
                )}

                {/* Checkout Button */}
                <Link href="/cart" onClick={onClose}>
                  <button
                    className="w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 mb-3"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    View Cart
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>

                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-lg font-semibold text-center"
                  style={{
                    backgroundColor: `${COLORS.secondary}20`,
                    color: COLORS.primary,
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
