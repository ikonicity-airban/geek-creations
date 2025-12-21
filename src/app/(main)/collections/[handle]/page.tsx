"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Product } from "@/types";
import Image from "next/image";
import {
  ChevronRight,
  Grid3x3,
  Rows3,
  SlidersHorizontal,
  Search,
} from "lucide-react";

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

type ViewMode = "grid" | "list";
type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

export default function CollectionPage() {
  const params = useParams();
  const router = useRouter();
  const handle = params.handle as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadCollection() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/collections/${handle}`);
        if (!res.ok) throw new Error("Failed to load collection");

        const json = await res.json();
        setCollection(json.collection);
        setProducts(json.products || []);
        setFilteredProducts(json.products || []);
      } catch (err) {
        console.error("Error loading collection:", err);
        setError("Failed to load collection");
      } finally {
        setIsLoading(false);
      }
    }

    if (handle) loadCollection();
  }, [handle]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        filtered.sort(
          (a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0)
        );
        break;
      case "price-desc":
        filtered.sort(
          (a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0)
        );
        break;
      case "newest":
        filtered.reverse();
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, sortBy]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.background }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4"
            style={{ borderColor: COLORS.primary }}
          />
          <p
            className="text-lg font-semibold"
            style={{ color: COLORS.primary }}
          >
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
            className="text-5xl font-black mb-4"
            style={{ color: COLORS.primary }}
          >
            Collection Not Found
          </h1>
          <p className="mb-8 text-lg opacity-70">
            {error || "This collection doesn't exist"}
          </p>
          <button
            onClick={() => router.push("/collections")}
            className="px-8 py-4 rounded-xl font-bold text-white text-lg hover:opacity-90 transition"
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
      {/* Hero Section with Collection Image */}
      {collection.image_url && (
        <div className="relative h-[40vh] overflow-hidden">
          <Image
            src={collection.image_url}
            alt={collection.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <nav className="mb-4 text-sm">
                <ol className="flex items-center gap-2 text-white/80">
                  <li>
                    <button
                      onClick={() => router.push("/")}
                      className="hover:text-white transition"
                    >
                      Home
                    </button>
                  </li>
                  <ChevronRight className="w-4 h-4" />
                  <li>
                    <button
                      onClick={() => router.push("/collections")}
                      className="hover:text-white transition"
                    >
                      Collections
                    </button>
                  </li>
                  <ChevronRight className="w-4 h-4" />
                  <li className="text-white font-semibold">
                    {collection.title}
                  </li>
                </ol>
              </nav>
              <h1
                className="text-5xl md:text-6xl font-black text-white mb-3"
                style={{ fontFamily: "Orbitron, sans-serif" }}
              >
                {collection.title}
              </h1>
              {collection.description && (
                <p className="text-xl text-white/90 max-w-3xl">
                  {collection.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* No Hero Image Fallback */}
        {!collection.image_url && (
          <>
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
                <ChevronRight
                  className="w-4 h-4"
                  style={{ color: COLORS.primary }}
                />
                <li>
                  <button
                    onClick={() => router.push("/collections")}
                    className="hover:opacity-100 transition"
                    style={{ color: COLORS.primary }}
                  >
                    Collections
                  </button>
                </li>
                <ChevronRight
                  className="w-4 h-4"
                  style={{ color: COLORS.primary }}
                />
                <li className="font-semibold" style={{ color: COLORS.primary }}>
                  {collection.title}
                </li>
              </ol>
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h1
                className="text-5xl md:text-6xl font-black mb-4"
                style={{
                  color: COLORS.primary,
                  fontFamily: "Orbitron, sans-serif",
                }}
              >
                {collection.title}
              </h1>
              {collection.description && (
                <p
                  className="text-xl mb-4 max-w-3xl"
                  style={{ color: "rgba(64, 18, 104, 0.8)" }}
                >
                  {collection.description}
                </p>
              )}
            </motion.div>
          </>
        )}

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            <p
              className="text-sm font-semibold"
              style={{ color: COLORS.primary }}
            >
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>

            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: COLORS.primary }}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border-2 outline-none transition"
                style={{
                  borderColor: `${COLORS.primary}40`,
                  color: COLORS.primary,
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <SlidersHorizontal
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: COLORS.primary }}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="pl-10 pr-8 py-2 rounded-lg border-2 outline-none appearance-none cursor-pointer transition"
                style={{
                  borderColor: `${COLORS.primary}40`,
                  color: COLORS.primary,
                }}
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* View Toggle */}
            <div
              className="flex rounded-lg border-2 overflow-hidden"
              style={{ borderColor: `${COLORS.primary}40` }}
            >
              <button
                onClick={() => setViewMode("grid")}
                className="p-2 transition"
                style={{
                  backgroundColor:
                    viewMode === "grid" ? COLORS.primary : "transparent",
                  color: viewMode === "grid" ? "#fff" : COLORS.primary,
                }}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className="p-2 transition"
                style={{
                  backgroundColor:
                    viewMode === "list" ? COLORS.primary : "transparent",
                  color: viewMode === "list" ? "#fff" : COLORS.primary,
                }}
              >
                <Rows3 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Display */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p
              className="text-xl mb-4"
              style={{ color: "rgba(64, 18, 104, 0.8)" }}
            >
              {searchQuery
                ? "No products match your search"
                : "No products found in this collection"}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                router.push("/collections");
              }}
              className="px-6 py-3 rounded-lg font-bold text-white"
              style={{ backgroundColor: COLORS.primary }}
            >
              Browse Other Collections
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-6"
            }
          >
            {filteredProducts.map((product, index) => {
              const firstVariant = product.variants?.[0];
              const mainImage =
                product.featuredImage ||
                product.images?.[0]?.src ||
                "/placeholder-product.jpg";

              return viewMode === "grid" ? (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                >
                  <Link href={`/products/${product.handle}`}>
                    <div
                      className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all h-full flex flex-col"
                      style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid rgba(64, 18, 104, 0.1)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 12px 32px rgba(64,18,104,0.2)";
                        e.currentTarget.style.borderColor = COLORS.secondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(0,0,0,0.05)";
                        e.currentTarget.style.borderColor =
                          "rgba(64, 18, 104, 0.1)";
                      }}
                    >
                      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        <Image
                          src={mainImage}
                          alt={product.title}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
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
                      <div className="p-4 flex-1 flex flex-col">
                        <h3
                          className="font-bold text-lg mb-2 line-clamp-2 flex-1"
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
              ) : (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link href={`/products/${product.handle}`}>
                    <div
                      className="group flex gap-6 rounded-2xl overflow-hidden cursor-pointer transition-all p-4"
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
                      <div className="relative w-48 h-48 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-gray-100 to-gray-200">
                        <Image
                          src={mainImage}
                          alt={product.title}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
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
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3
                            className="font-bold text-2xl mb-2"
                            style={{ color: COLORS.primary }}
                          >
                            {product.title}
                          </h3>
                          {product.description && (
                            <p
                              className="text-sm opacity-70 line-clamp-2 mb-3"
                              dangerouslySetInnerHTML={{
                                __html: product.description,
                              }}
                            />
                          )}
                          {product.vendor && (
                            <p
                              className="text-sm opacity-70 mb-2"
                              style={{ color: COLORS.primary }}
                            >
                              By {product.vendor}
                            </p>
                          )}
                        </div>
                        {firstVariant && (
                          <div className="flex items-center gap-3">
                            <p
                              className="text-2xl font-black"
                              style={{ color: COLORS.primary }}
                            >
                              ₦{firstVariant.price.toLocaleString()}
                            </p>
                            {firstVariant.compare_at_price && (
                              <p className="text-lg line-through opacity-60">
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
        )}
      </div>
    </div>
  );
}
