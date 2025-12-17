"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Filter,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { Product, Collection } from "@/types";

export default function CollectionPage({
  params,
}: {
  params: { handle: string };
}) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    fetchCollection();
  }, [params.handle]);

  const fetchCollection = async () => {
    try {
      const res = await fetch(`/api/collections/${params.handle}`);
      const data = await res.json();
      setCollection(data.collection);
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching collection:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product, variantId: string) => {
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) return;

    addToCart({
      variant_id: variantId,
      product_id: product.id,
      product_title: product.title,
      variant_title: variant.title,
      price: variant.price,
      image: product.images[0]?.src || "",
      sku: variant.sku,
      max_quantity: variant.inventory_quantity,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="pt-10" />
      {/* Collection Header */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/40">
              Collection
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              {collection?.title || "Collection"}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {collection?.description || "Explore our latest designs"}
            </p>
            <p className="mt-4 text-white/70">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Sort */}
      <section className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No products found in this collection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden"
                >
                  <Link href={`/products/${product.handle}`}>
                    <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0].src}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      {product.variants[0]?.compare_at_price && (
                        <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                          Sale
                        </Badge>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/products/${product.handle}`}>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-indigo-600">
                        {product.title}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ₦{product.variants[0]?.price.toLocaleString()}
                        </p>
                        {product.variants[0]?.compare_at_price && (
                          <p className="text-sm text-gray-500 line-through">
                            ₦
                            {product.variants[0].compare_at_price.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          handleAddToCart(product, product.variants[0]?.id)
                        }
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {isInCart(product.variants[0]?.id)
                          ? "In Cart"
                          : "Add to Cart"}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
