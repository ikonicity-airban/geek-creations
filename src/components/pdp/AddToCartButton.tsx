"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Product, Variant } from "@/types";

const COLORS = {
  primary: "#401268",
  secondary: "#c5a3ff",
  background: "#f8f6f0",
  accentWarm: "#e2ae3d",
  accentBold: "#e21b35",
};

interface AddToCartButtonProps {
  product: Product;
  selectedVariant: Variant | null;
  quantity?: number;
  className?: string;
}

export default function AddToCartButton({
  product,
  selectedVariant,
  quantity = 1,
  className = "",
}: AddToCartButtonProps) {
  const { addToCart, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedVariant.available) {
      return;
    }

    setIsAdding(true);

    try {
      // Find the image for this variant or use the first product image
      const variantImage = selectedVariant.image_id
        ? product.images.find((img) => img.id === selectedVariant.image_id)
        : product.images[0];

      addToCart(
        {
          variant_id: selectedVariant.id,
          product_id: product.id,
          product_title: product.title,
          variant_title: selectedVariant.title,
          price: selectedVariant.price,
          image: variantImage?.src || product.images[0]?.src || "",
          sku: selectedVariant.sku,
          max_quantity: selectedVariant.inventory_quantity,
        },
        quantity
      );

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const isDisabled =
    !selectedVariant ||
    !selectedVariant.available ||
    isAdding ||
    (selectedVariant.inventory_quantity > 0 &&
      quantity > selectedVariant.inventory_quantity);

  const isInCartAlready = selectedVariant ? isInCart(selectedVariant.id) : false;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all ${
        isDisabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
      } ${className}`}
      style={{ backgroundColor: COLORS.primary }}
    >
      {isAdding ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Adding...</span>
        </>
      ) : isSuccess ? (
        <>
          <Check className="w-5 h-5" />
          <span>Added to Cart!</span>
        </>
      ) : isInCartAlready ? (
        <>
          <Check className="w-5 h-5" />
          <span>In Cart - Add More</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          <span>
            Add to Cart - ₦
            {selectedVariant
              ? (selectedVariant.price * quantity).toLocaleString()
              : "0"}
          </span>
        </>
      )}
    </motion.button>
  );
}

