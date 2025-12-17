"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/lib/cart-context";

const COLORS = {
  primary: "#401268",
  secondary: "#c5a3ff",
  background: "#f8f6f0",
  accentWarm: "#e2ae3d",
  accentBold: "#e21b35",
};

interface RelatedProductsProps {
  products: Product[];
  currentProductId: string;
}

export default function RelatedProducts({
  products,
  currentProductId,
}: RelatedProductsProps) {
  const { addToCart } = useCart();

  // Filter out current product and limit to 4
  const relatedProducts = products
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    const firstAvailableVariant = product.variants.find((v) => v.available);
    if (!firstAvailableVariant) return;

    const variantImage = firstAvailableVariant.image_id
      ? product.images.find((img) => img.id === firstAvailableVariant.image_id)
      : product.images[0];

    addToCart({
      variant_id: firstAvailableVariant.id,
      product_id: product.id,
      product_title: product.title,
      variant_title: firstAvailableVariant.title,
      price: firstAvailableVariant.price,
      image: variantImage?.src || product.images[0]?.src || "",
      sku: firstAvailableVariant.sku,
      max_quantity: firstAvailableVariant.inventory_quantity,
    });
  };

  return (
    <section className="py-12">
      <h2
        className="text-3xl font-black mb-8"
        style={{
          color: COLORS.primary,
          fontFamily: "Orbitron, sans-serif",
        }}
      >
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product, index) => {
          const firstVariant = product.variants[0];
          const mainImage = product.images[0];

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/products/${product.handle}`}
                className="group relative block rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(10px)",
                  border: `1px solid rgba(64, 18, 104, 0.1)`,
                  boxShadow: "0 4px 20px rgba(64, 18, 104, 0.1)",
                }}
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {mainImage && (
                    <img
                      src={mainImage.src}
                      alt={mainImage.alt || product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}

                  {/* Quick Actions */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      className="p-3 rounded-full bg-white/90 hover:bg-white transition"
                      style={{ color: COLORS.primary }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                    <button
                      className="p-3 rounded-full bg-white/90 hover:bg-white transition"
                      style={{ color: COLORS.accentBold }}
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3
                    className="text-lg font-bold mb-2 line-clamp-2"
                    style={{
                      color: COLORS.primary,
                      fontFamily: "Orbitron, sans-serif",
                    }}
                  >
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-black" style={{ color: COLORS.primary }}>
                        ₦{firstVariant?.price.toLocaleString() || "0"}
                      </p>
                      {firstVariant?.compare_at_price && (
                        <p className="text-sm line-through opacity-60">
                          ₦{firstVariant.compare_at_price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

