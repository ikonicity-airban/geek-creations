"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const ProductsShowcase = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products?limit=8");
        if (!res.ok) throw new Error("Failed to load products");
        const json = await res.json();
        setProducts(json.products || []);
      } catch (err) {
        console.error("[ProductsShowcase] Failed to load products", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <section
      className="py-32 overflow-hidden"
      style={{
        backgroundColor: "#f8f6f0",
        borderBottom: "10rem solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span
            className="inline-block px-4 py-2 rounded-full font-semibold text-sm mb-4"
            style={{ backgroundColor: "#e2ae3d", color: "#401268" }}
          >
            FEATURED PRODUCTS
          </span>
          <h2
            className="text-5xl md:text-6xl font-black mb-6"
            style={{ color: "#401268" }}
          >
            Shop Our Best Sellers
          </h2>
          <p className="text-xl" style={{ color: "rgba(64, 18, 104, 0.8)" }}>
            From apparel to home decor, we&apos;ve got you covered
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-8 bg-white animate-pulse"
                style={{ height: "300px" }}
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: "rgba(64, 18, 104, 0.8)" }}>
              No products available at the moment
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {products.map((product, i) => {
                const firstVariant = product.variants?.[0];
                const mainImage =
                  product.featuredImage ||
                  (product.images && product.images[0]?.src) ||
                  "/placeholder-product.jpg";

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <Link href={`/products/${product.handle}`}>
                      <div
                        className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all"
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid rgba(64, 18, 104, 0.1)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow =
                            "0 8px 24px rgba(64,18,104,0.15)";
                          e.currentTarget.style.borderColor = "#c5a3ff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(0,0,0,0.05)";
                          e.currentTarget.style.borderColor =
                            "rgba(64, 18, 104, 0.1)";
                        }}
                      >
                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                          <Image
                            src={mainImage}
                            alt={product.title}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {firstVariant?.compare_at_price && (
                            <div className="absolute top-3 right-3">
                              <span
                                className="px-3 py-1 rounded-full text-xs font-bold text-white"
                                style={{ backgroundColor: "#e21b35" }}
                              >
                                SALE
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <h4
                            className="font-bold text-sm mb-2 line-clamp-2"
                            style={{ color: "#401268" }}
                          >
                            {product.title}
                          </h4>
                          {firstVariant && (
                            <div className="flex items-center gap-2">
                              <p
                                className="text-xl font-black"
                                style={{ color: "#401268" }}
                              >
                                ₦{firstVariant.price.toLocaleString()}
                              </p>
                              {firstVariant.compare_at_price && (
                                <p className="text-sm line-through opacity-60">
                                  ₦
                                  {firstVariant.compare_at_price.toLocaleString()}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* View All Link */}
            <div className="text-center">
              <Link href="/collections/all">
                <button
                  className="px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-2 mx-auto"
                  style={{
                    backgroundColor: "#401268",
                    color: "#ffffff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#2d0d4a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#401268";
                  }}
                >
                  View All Products
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
