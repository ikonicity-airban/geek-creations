"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Product } from "@/types";
import Image from "next/image";
import { Grid3x3, Rows3, SlidersHorizontal, Search } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { IconChevronRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center p-8 bg-card rounded-card border-hairline border-border shadow-card max-w-md mx-auto">
          <h2 className="text-3xl font-black mb-4 text-foreground">Collection Not Found</h2>
          <p className="mb-8 text-muted-foreground text-sm">
            {error || "This collection doesn't exist"}
          </p>
          <Button
            onClick={() => router.push("/collections")}
            className="w-full py-3 rounded-btn font-bold text-primary-foreground hover:opacity-90 transition-smooth"
          >
            Browse All Collections
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-16">
      {/* Hero Section with Collection Image */}
      {collection.image_url && (
        <div className="relative h-[35vh] min-h-[250px] overflow-hidden rounded-card border-hairline border-border mx-6 mb-12 shadow-card">
          <Image
            src={collection.image_url}
            alt={collection.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-indigo-ink/40 via-indigo-ink/75 to-indigo-ink/95" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              <nav className="mb-4 text-xs sm:text-sm">
                <ol className="flex flex-wrap items-center gap-1.5 text-white/70">
                  <li>
                    <button
                      onClick={() => router.push("/")}
                      className="hover:text-white transition-smooth"
                    >
                      Home
                    </button>
                  </li>
                  <li className="flex items-center">
                    <IconChevronRight className="w-3.5 h-3.5 text-white/40" />
                  </li>
                  <li>
                    <button
                      onClick={() => router.push("/collections")}
                      className="hover:text-white transition-smooth"
                    >
                      Collections
                    </button>
                  </li>
                  <li className="flex items-center">
                    <IconChevronRight className="w-3.5 h-3.5 text-white/40" />
                  </li>
                  <li className="text-white font-semibold">
                    {collection.title}
                  </li>
                </ol>
              </nav>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2">
                {collection.title}
              </h1>
              {collection.description && (
                <p className="text-sm sm:text-base text-white/80 max-w-2xl">
                  {collection.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="container-lg container-padding">
        {/* No Hero Image Fallback */}
        {!collection.image_url && (
          <div className="mb-12">
            <Breadcrumb
              className="mb-8"
              items={[
                { label: "Home", href: "/" },
                { label: "Collections", href: "/collections" },
                {
                  label: collection.title,
                  href: `/collections/${collection.handle}`,
                },
              ]}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge className="mb-4 bg-secondary/25 border-hairline border-border text-primary font-semibold text-xs px-3 py-1 rounded-full inline-flex tracking-wider uppercase">
                Collection
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 text-foreground">
                {collection.title}
              </h1>
              {collection.description && (
                <p className="max-w-3xl text-muted-foreground text-sm sm:text-base">
                  {collection.description}
                </p>
              )}
            </motion.div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-sm font-semibold text-muted-foreground">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-btn h-11 border-hairline border-border bg-card/60 backdrop-blur-xs text-foreground focus:ring-1 focus:ring-primary/20 transition-smooth placeholder:text-muted-foreground outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="pl-10 pr-8 py-2 rounded-btn h-11 border-hairline border-border bg-card/60 backdrop-blur-xs text-foreground focus:ring-1 focus:ring-primary/20 transition-smooth outline-none appearance-none cursor-pointer text-sm font-semibold"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="sm:flex rounded-btn border border-hairline border-border overflow-hidden bg-card/60 backdrop-blur-xs p-0.5 hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
                className={`p-2 h-9 w-9 rounded-btn flex items-center justify-center transition-smooth ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
                className={`p-2 h-9 w-9 rounded-btn flex items-center justify-center transition-smooth ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Rows3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Display */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-card border-hairline border-border p-8 max-w-md mx-auto shadow-card">
            <p className="text-lg text-muted-foreground mb-6">
              {searchQuery
                ? "No products match your search"
                : "No products found in this collection"}
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                router.push("/collections");
              }}
              className="w-full py-3 rounded-btn font-bold transition-smooth"
            >
              Browse Other Collections
            </Button>
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
                  transition={{ delay: index * 0.03 }}
                  className="h-full"
                >
                  <Link href={`/products/${product.handle}`}>
                    <div className="group relative rounded-card overflow-hidden cursor-pointer bg-card border-hairline border-border hover:border-primary shadow-card hover:shadow-card-hover transition-smooth h-full flex flex-col">
                      <div className="relative aspect-square overflow-hidden bg-muted/20 border-b border-hairline border-border/50">
                        <Image
                          src={mainImage}
                          alt={product.title}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {firstVariant?.compare_at_price && (
                          <div className="absolute top-3 right-3 z-10">
                            <span className="px-2.5 py-1 rounded-full text-2xs font-bold bg-destructive text-white shadow-sm uppercase tracking-wider">
                              SALE
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-sm sm:text-base mb-1.5 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                            {product.title}
                          </h4>
                          {product.vendor && (
                            <p className="text-xs text-muted-foreground mb-3">
                              By {product.vendor}
                            </p>
                          )}
                        </div>
                        {firstVariant && (
                          <div className="flex items-center gap-2 pt-2 border-t border-hairline border-border/30">
                            <p className="text-base sm:text-lg font-black text-accent">
                              ₦{firstVariant.price.toLocaleString()}
                            </p>
                            {firstVariant.compare_at_price && (
                              <p className="text-xs line-through opacity-60 text-muted-foreground">
                                ₦{firstVariant.compare_at_price.toLocaleString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link href={`/products/${product.handle}`}>
                    <div className="group flex flex-col sm:flex-row gap-6 rounded-card overflow-hidden cursor-pointer bg-card border-hairline border-border hover:border-primary shadow-card hover:shadow-card-hover transition-smooth p-4">
                      <div className="relative w-full sm:w-48 aspect-square sm:h-48 rounded-card overflow-hidden shrink-0 bg-muted/20 border border-hairline border-border/50">
                        <Image
                          src={mainImage}
                          alt={product.title}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {firstVariant?.compare_at_price && (
                          <div className="absolute top-3 right-3 z-10">
                            <span className="px-2.5 py-1 rounded-full text-2xs font-bold bg-destructive text-white shadow-sm uppercase tracking-wider">
                              SALE
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div>
                          <h3 className="font-bold text-xl md:text-2xl mb-2 text-foreground group-hover:text-primary transition-colors">
                            {product.title}
                          </h3>
                          {product.vendor && (
                            <p className="text-xs text-muted-foreground mb-3">
                              By {product.vendor}
                            </p>
                          )}
                          {product.description && (
                            <div
                              className="text-sm text-muted-foreground line-clamp-3 mb-4"
                              dangerouslySetInnerHTML={{
                                __html: product.description,
                              }}
                            />
                          )}
                        </div>
                        {firstVariant && (
                          <div className="flex items-center gap-3 pt-3 border-t border-hairline border-border/30">
                            <p className="text-xl md:text-2xl font-black text-accent">
                              ₦{firstVariant.price.toLocaleString()}
                            </p>
                            {firstVariant.compare_at_price && (
                              <p className="text-sm md:text-base line-through opacity-60 text-muted-foreground">
                                ₦{firstVariant.compare_at_price.toLocaleString()}
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
