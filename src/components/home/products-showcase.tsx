"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

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
    <section className="section-padding overflow-hidden bg-background">
      <div className="container-lg container-padding">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold text-xs sm:text-sm mb-3 sm:mb-4 bg-accent text-accent-foreground">
            FEATURED PRODUCTS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-5 md:mb-6 text-foreground">
            Shop Our Best Sellers
          </h2>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4 text-muted-foreground">
            From apparel to home decor, we&apos;ve got you covered
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-card p-6 sm:p-8 bg-white animate-pulse"
                style={{ height: "280px" }}
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm sm:text-base text-muted-foreground">
              No products available at the moment
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12">
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
                      <div className="group relative rounded-card overflow-hidden cursor-pointer transition-smooth border-hairline bg-card border-border shadow-card hover:shadow-card-hover">
                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
                          <Image
                            src={mainImage}
                            alt={product.title}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {firstVariant?.compare_at_price && (
                            <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                              <Badge variant="destructive">SALE</Badge>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-3 sm:p-4">
                          <h4 className="font-bold text-xs sm:text-sm mb-1.5 sm:mb-2 line-clamp-2 text-card-foreground">
                            {product.title}
                          </h4>
                          {firstVariant && (
                            <div className="flex items-center gap-2">
                              <p className="text-lg sm:text-xl font-black text-card-foreground group-hover:text-primary">
                                ₦{firstVariant.price.toLocaleString()}
                              </p>
                              {firstVariant.compare_at_price && (
                                <p className="text-xs sm:text-sm line-through opacity-60 dark:text-muted-foreground">
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
                <Button className="flex items-center gap-2 mx-auto hover:scale-105 active:scale-95 shadow-card hover:shadow-card-hover bg-primary text-primary-foreground hover:bg-primary/90">
                  View All Products
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
