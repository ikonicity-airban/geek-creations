"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Product } from "@/types";
import Image from "next/image";

const COLORS = {
  primary: "#401268",
  secondary: "#c5a3ff",
  background: "#f8f6f0",
  accentWarm: "#e2ae3d",
  accentBold: "#e21b35",
};

interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  image_url: string | null;
  product_count: number;
}

export default function CollectionPage() {
  const params = useParams();
  const router = useRouter();
  const handle = params.handle as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch collection data
  useEffect(() => {
    async function loadCollection() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/collections/${handle}`);
        if (!res.ok) {
          throw new Error("Failed to load collection");
        }

        const json = await res.json();
        setCollection(json.collection);
        setProducts(json.products || []);
      } catch (err) {
        console.error("Error loading collection:", err);
        setError("Failed to load collection");
      } finally {
        setIsLoading(false);
      }
    }

    if (handle) {
      loadCollection();
    }
  }, [handle]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.background }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4" style={{ color: COLORS.primary }}>
            Loading collection...
          </p>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.background }}
      >
        <div className="text-center">
          <h1
            className="text-4xl font-black mb-4"
            style={{ color: COLORS.primary }}
          >
            Collection Not Found
          </h1>
          <p className="mb-6 opacity-70">
            {error || "This collection doesn't exist"}
          </p>
          <button
            onClick={() => router.push("/collections")}
            className="px-6 py-3 rounded-lg font-bold text-white"
            style={{ backgroundColor: COLORS.primary }}
          >
            Browse All Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${COLORS.background} 0%, #ffffff 100%)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 opacity-70">
            <li>
              <button
                onClick={() => router.push("/")}
                className="hover:opacity-100 transition"
                style={{ color: COLORS.primary }}
              >
                Home
              </button>
            </li>
            <li>/</li>
            <li>
              <button
                onClick={() => router.push("/collections")}
                className="hover:opacity-100 transition"
                style={{ color: COLORS.primary }}
              >
                Collections
              </button>
            </li>
            <li>/</li>
            <li className="font-semibold" style={{ color: COLORS.primary }}>
              {collection.title}
            </li>
          </ol>
        </nav>

        {/* Collection Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1
            className="text-4xl md:text-5xl font-black mb-4"
            style={{
              color: COLORS.primary,
              fontFamily: "Orbitron, sans-serif",
            }}
          >
            {collection.title}
          </h1>
          {collection.description && (
            <p
              className="text-lg mb-4 max-w-3xl"
              style={{ color: "rgba(64, 18, 104, 0.8)" }}
            >
              {collection.description}
            </p>
          )}
          <p className="text-sm" style={{ color: "rgba(64, 18, 104, 0.6)" }}>
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </motion.div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p
              className="text-xl mb-4"
              style={{ color: "rgba(64, 18, 104, 0.8)" }}
            >
              No products found in this collection
            </p>
            <button
              onClick={() => router.push("/collections")}
              className="px-6 py-3 rounded-lg font-bold text-white"
              style={{ backgroundColor: COLORS.primary }}
            >
              Browse Other Collections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => {
              const firstVariant = product.variants?.[0];
              const mainImage =
                product.featuredImage ||
                (product.images && product.images[0]?.src) ||
                "/placeholder-product.jpg";

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
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
                        e.currentTarget.style.borderColor = COLORS.secondary;
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
                        {mainImage && (
                          <Image
                            src={mainImage}
                            alt={product.title}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        )}
                        {firstVariant?.compare_at_price && (
                          <div className="absolute top-3 right-3">
                            <span
                              className="px-3 py-1 rounded-full text-xs font-bold text-white"
                              style={{ backgroundColor: COLORS.accentBold }}
                            >
                              SALE
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3
                          className="font-bold text-lg mb-2 line-clamp-2"
                          style={{ color: COLORS.primary }}
                        >
                          {product.title}
                        </h3>
                        {firstVariant && (
                          <div className="flex items-center gap-2">
                            <p
                              className="text-xl font-black"
                              style={{ color: COLORS.primary }}
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
                        {product.vendor && (
                          <p
                            className="text-sm mt-1 opacity-70"
                            style={{ color: COLORS.primary }}
                          >
                            By {product.vendor}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
