"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/lib/cart-context";
import Image from "next/image";
import { Button } from "../ui/button";

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
      <h3 className="text-2xl md:text-3xl font-black mb-8">
        You Might Also Like
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
                className="group relative block rounded-2xl overflow-hidden bg-card border-border"
                style={{
                  backdropFilter: "blur(10px)",
                  border: `1px solid rgba(64, 18, 104, 0.1)`,
                  boxShadow: "0 4px 20px rgba(64, 18, 104, 0.1)",
                }}
              >
                {/* Image */}
                <div className="relative aspect-3/4 overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
                  {mainImage && (
                    <Image
                      width={400}
                      height={250}
                      src={mainImage.src}
                      alt={mainImage.alt || product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}

                  {/* Quick Actions */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      onClick={(e) => handleQuickAdd(e, product)}
                      className="p-3 rounded-full transition"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </Button>
                    <Button className="p-3 rounded-full transition">
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="md:text-lg font-bold mb-2 line-clamp-2 truncate">
                    {product.title}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-black text-accent">
                        ₦{firstVariant?.price.toLocaleString() || "0"}
                      </p>
                      {firstVariant?.compare_at_price && (
                        <p className="text-sm line-through opacity-50">
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
