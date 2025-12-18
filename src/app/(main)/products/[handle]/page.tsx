"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Zap, Sparkles, Ruler, Upload, X, Wand2 } from "lucide-react";
import { Product, Variant, Design } from "@/types";
import Image from "next/image";
import {
  mockProducts,
  collectionProductMap,
} from "@/lib/mock-data/collections";
import MockupCarousel from "@/components/pdp/MockupCarousel";
import VariantSelector from "@/components/pdp/VariantSelector";
import AddToCartButton from "@/components/pdp/AddToCartButton";
import RelatedProducts from "@/components/pdp/RelatedProducts";
import SizeChartModal from "@/components/pdp/SizeChartModal";
import MiniCartDrawer from "@/components/cart/MiniCartDrawer";

const COLORS = {
  primary: "#401268",
  secondary: "#c5a3ff",
  background: "#f8f6f0",
  accentWarm: "#e2ae3d",
  accentBold: "#e21b35",
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const handle = params.handle as string;

  // Get design ID from query param (design-first flow)
  const initialDesignId = searchParams.get("design");

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Design selector state
  const [allDesigns, setAllDesigns] = useState<Design[]>([]);
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(
    initialDesignId || null
  );
  const [uploadedDesignUrl, setUploadedDesignUrl] = useState<string | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [mockupUrl, setMockupUrl] = useState<string | null>(null);

  // Fetch designs
  useEffect(() => {
    async function loadDesigns() {
      try {
        const res = await fetch("/api/designs");
        const json = await res.json();
        const designs = json.data || [];
        setAllDesigns(designs);

        // If no design pre-selected, pick first available
        if (!initialDesignId && designs.length > 0) {
          setSelectedDesignId(designs[0].id);
        }
      } catch (err) {
        console.error("Failed to load designs:", err);
      }
    }
    loadDesigns();
  }, [initialDesignId]);

  // Fetch product data
  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      setError(null);

      try {
        // Try to fetch from local API first
        const res = await fetch(`/api/products/${handle}`);

        let productData: Product | null = null;

        if (res.ok) {
          const json = await res.json();
          productData = json.product;
        } else {
          // Fallback to mock data if API fails
          productData = mockProducts.find((p) => p.handle === handle) || null;
        }

        if (!productData) {
          setError("Product not found");
          return;
        }

        setProduct(productData);

        // Set initial variant
        const firstAvailableVariant =
          productData.variants.find((v) => v.available) ||
          productData.variants[0];
        setSelectedVariant(firstAvailableVariant);

        // Fetch related products (same collection)
        const related = getRelatedProducts(productData);
        setRelatedProducts(related);
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Failed to load product");
      } finally {
        setIsLoading(false);
      }
    }

    if (handle) {
      loadProduct();
    }
  }, [handle]);

  // Generate POD mockup preview
  const generateMockup = async (designImageUrl: string) => {
    if (!product || !selectedVariant) return;

    try {
      const res = await fetch("/api/mockups/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productType: product.product_type,
          variantId: selectedVariant.id,
          designImageUrl,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setMockupUrl(json.mockupUrl);
      }
    } catch (err) {
      console.error("Mockup generation error:", err);
      // Continue without mockup - fallback to overlay
    }
  };

  // Get related products from same collection
  const getRelatedProducts = (currentProduct: Product): Product[] => {
    // Find collections containing this product
    const productCollections: string[] = [];
    Object.entries(collectionProductMap).forEach(
      ([collectionHandle, productHandles]) => {
        if (productHandles.includes(currentProduct.handle)) {
          productCollections.push(collectionHandle);
        }
      }
    );

    if (productCollections.length === 0) {
      // Fallback: same product type
      return mockProducts
        .filter(
          (p) =>
            p.product_type === currentProduct.product_type &&
            p.id !== currentProduct.id
        )
        .slice(0, 4);
    }

    // Get products from first matching collection
    const collectionHandle = productCollections[0];
    const productHandles = collectionProductMap[collectionHandle] || [];

    return mockProducts
      .filter(
        (p) => productHandles.includes(p.handle) && p.id !== currentProduct.id
      )
      .slice(0, 4);
  };

  if (isLoading) {
    return null; // Next.js shows loading.tsx
  }

  if (error || !product) {
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
            Product Not Found
          </h1>
          <p className="mb-6 opacity-70">
            {error || "This product doesn't exist"}
          </p>
          <button
            onClick={() => router.push("/collections/all")}
            className="px-6 py-3 rounded-lg font-bold text-white"
            style={{ backgroundColor: COLORS.primary }}
          >
            Browse Collections
          </button>
        </div>
      </div>
    );
  }

  const maxQuantity = selectedVariant
    ? Math.min(selectedVariant.inventory_quantity, 10)
    : 1;

  return (
    <>
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
                  onClick={() => router.push("/collections/all")}
                  className="hover:opacity-100 transition"
                  style={{ color: COLORS.primary }}
                >
                  Shop
                </button>
              </li>
              <li>/</li>
              <li className="font-semibold" style={{ color: COLORS.primary }}>
                {product.title}
              </li>
            </ol>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-12 mb-16"
          >
            {/* Left: Image Gallery */}
            <div>
              <MockupCarousel
                images={product.images}
                productTitle={product.title}
                designImage={
                  mockupUrl ||
                  uploadedDesignUrl ||
                  (selectedDesignId
                    ? allDesigns.find((d) => d.id === selectedDesignId)
                        ?.imageUrl
                    : undefined)
                }
                mockupUrl={mockupUrl ?? undefined}
              />
            </div>

            {/* Right: Product Info */}
            <div className="space-y-6">
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: `${COLORS.secondary}20`,
                        color: COLORS.primary,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1
                className="text-4xl md:text-5xl font-black"
                style={{
                  color: COLORS.primary,
                  fontFamily: "Orbitron, sans-serif",
                }}
              >
                {product.title}
              </h1>

              {/* Vendor & Type */}
              <div className="flex items-center gap-4 text-sm opacity-70">
                {product.vendor && (
                  <span style={{ color: COLORS.primary }}>
                    By {product.vendor}
                  </span>
                )}
                {product.product_type && (
                  <span style={{ color: COLORS.primary }}>
                    • {product.product_type}
                  </span>
                )}
              </div>

              {/* Price */}
              {selectedVariant && (
                <div className="flex items-center gap-4">
                  <p
                    className="text-4xl font-black"
                    style={{ color: COLORS.primary }}
                  >
                    ₦{selectedVariant.price.toLocaleString()}
                  </p>
                  {selectedVariant.compare_at_price && (
                    <>
                      <p className="text-2xl line-through opacity-60">
                        ₦{selectedVariant.compare_at_price.toLocaleString()}
                      </p>
                      <span
                        className="px-3 py-1 rounded-full text-sm font-bold text-white"
                        style={{ backgroundColor: COLORS.accentBold }}
                      >
                        SALE
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Geek Score Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  backgroundColor: `${COLORS.secondary}20`,
                  color: COLORS.primary,
                }}
              >
                <Zap className="w-5 h-5" />
                <span className="font-bold">Geek Score: 9000+</span>
              </div>

              {/* Description */}
              {product.description && (
                <div
                  className="prose max-w-none"
                  style={{ color: COLORS.primary }}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}

              {/* Design Selector Carousel */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: COLORS.primary }}
                  >
                    Choose Your Design
                  </h2>
                  <Link
                    href={`/editor?product=${product.handle}`}
                    className="px-4 py-2 rounded-lg font-semibold text-white flex items-center gap-2 transition hover:opacity-90"
                    style={{ backgroundColor: COLORS.secondary }}
                  >
                    <Wand2 className="w-4 h-4" />
                    Customize
                  </Link>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {/* Upload Your Design Button */}
                  <label className="shrink-0 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setIsUploading(true);
                        try {
                          // Create FormData and upload
                          const formData = new FormData();
                          formData.append("file", file);
                          formData.append("productId", product.id);
                          formData.append("productType", product.product_type);

                          const res = await fetch("/api/designs/upload", {
                            method: "POST",
                            body: formData,
                          });

                          if (res.ok) {
                            const json = await res.json();
                            setUploadedDesignUrl(json.url);
                            setSelectedDesignId(null); // Clear selected design

                            // Generate mockup
                            await generateMockup(json.url);
                          } else {
                            alert("Failed to upload design. Please try again.");
                          }
                        } catch (err) {
                          console.error("Upload error:", err);
                          alert("Failed to upload design. Please try again.");
                        } finally {
                          setIsUploading(false);
                        }
                      }}
                    />
                    <div
                      className={`rounded-xl overflow-hidden border-4 transition-all ${
                        uploadedDesignUrl
                          ? "shadow-lg scale-105 border-purple-500"
                          : "border-dashed border-gray-300 hover:border-purple-400"
                      }`}
                      style={{
                        borderColor: uploadedDesignUrl
                          ? COLORS.secondary
                          : undefined,
                      }}
                    >
                      <div className="relative w-32 h-32 flex flex-col items-center justify-center bg-gray-50">
                        {uploadedDesignUrl ? (
                          <>
                            <div className="relative w-full h-full">
                              <Image
                                src={uploadedDesignUrl}
                                alt="Uploaded design"
                                fill
                                className="object-cover"
                                unoptimized // User-uploaded images may not be optimized
                              />
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setUploadedDesignUrl(null);
                                setMockupUrl(null);
                                if (allDesigns.length > 0) {
                                  setSelectedDesignId(allDesigns[0].id);
                                }
                              }}
                              className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <>
                            {isUploading ? (
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
                            ) : (
                              <>
                                <Upload
                                  className="w-8 h-8 mb-2"
                                  style={{ color: COLORS.primary }}
                                />
                                <span
                                  className="text-xs font-semibold px-2 text-center"
                                  style={{ color: COLORS.primary }}
                                >
                                  Upload Design
                                </span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </label>

                  {/* Design Library Items */}
                  {allDesigns.map((design) => (
                    <button
                      key={design.id}
                      onClick={() => {
                        setSelectedDesignId(design.id);
                        setUploadedDesignUrl(null); // Clear uploaded design
                        generateMockup(design.imageUrl);
                      }}
                      className={`shrink-0 rounded-xl overflow-hidden border-4 transition-all ${
                        selectedDesignId === design.id && !uploadedDesignUrl
                          ? "shadow-lg scale-105"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      style={{
                        borderColor:
                          selectedDesignId === design.id && !uploadedDesignUrl
                            ? COLORS.secondary
                            : "transparent",
                      }}
                    >
                      <div className="relative w-32 h-32">
                        <Image
                          src={design.thumbnailUrl || design.imageUrl}
                          alt={design.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p
                        className="text-center py-2 text-sm font-semibold px-2"
                        style={{ color: COLORS.primary }}
                      >
                        {design.title}
                      </p>
                    </button>
                  ))}
                </div>
                {(selectedDesignId || uploadedDesignUrl) && (
                  <p className="mt-4 text-sm opacity-70">
                    Selected:{" "}
                    {uploadedDesignUrl
                      ? "Your Uploaded Design"
                      : allDesigns.find((d) => d.id === selectedDesignId)
                          ?.title}
                  </p>
                )}
              </div>

              {/* Variant Selector */}
              <VariantSelector
                product={product}
                selectedVariant={selectedVariant}
                onVariantChange={setSelectedVariant}
              />

              {/* Quantity Selector */}
              <div>
                <label
                  className="block text-sm font-bold mb-3"
                  style={{ color: COLORS.primary }}
                >
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-lg font-bold transition-all hover:opacity-80"
                    style={{
                      backgroundColor: `${COLORS.primary}20`,
                      color: COLORS.primary,
                    }}
                  >
                    -
                  </button>
                  <span
                    className="text-xl font-bold w-12 text-center"
                    style={{ color: COLORS.primary }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(maxQuantity, quantity + 1))
                    }
                    disabled={quantity >= maxQuantity}
                    className="w-12 h-12 rounded-lg font-bold transition-all hover:opacity-80 disabled:opacity-40"
                    style={{
                      backgroundColor: `${COLORS.primary}20`,
                      color: COLORS.primary,
                    }}
                  >
                    +
                  </button>
                  {maxQuantity > 0 && (
                    <span className="text-sm opacity-70">
                      (Max: {maxQuantity})
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <AddToCartButton
                product={product}
                selectedVariant={selectedVariant}
                quantity={quantity}
                designId={selectedDesignId ?? undefined}
                uploadedDesignUrl={uploadedDesignUrl ?? undefined}
                mockupUrl={mockupUrl ?? undefined}
                onAddToCart={() => setIsMiniCartOpen(true)}
              />

              {/* Size Chart Button */}
              {(product.product_type?.toLowerCase().includes("shirt") ||
                product.product_type?.toLowerCase().includes("hoodie") ||
                product.product_type?.toLowerCase().includes("apparel")) && (
                <button
                  onClick={() => setIsSizeChartOpen(true)}
                  className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-80"
                  style={{
                    backgroundColor: `${COLORS.secondary}20`,
                    color: COLORS.primary,
                  }}
                >
                  <Ruler className="w-5 h-5" />
                  Size Chart
                </button>
              )}

              {/* Additional Info */}
              <div
                className="pt-6 border-t space-y-3"
                style={{ borderColor: `${COLORS.primary}20` }}
              >
                <div className="flex items-start gap-3">
                  <Sparkles
                    className="w-5 h-5 mt-0.5"
                    style={{ color: COLORS.accentWarm }}
                  />
                  <div>
                    <p
                      className="font-semibold"
                      style={{ color: COLORS.primary }}
                    >
                      Crypto Payments Accepted
                    </p>
                    <p className="text-sm opacity-70">USDC, SOL, and more</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap
                    className="w-5 h-5 mt-0.5"
                    style={{ color: COLORS.secondary }}
                  />
                  <div>
                    <p
                      className="font-semibold"
                      style={{ color: COLORS.primary }}
                    >
                      Fast Shipping
                    </p>
                    <p className="text-sm opacity-70">
                      Free shipping on orders over ₦50,000
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <RelatedProducts
              products={relatedProducts}
              currentProductId={product.id}
            />
          )}
        </div>

        {/* Size Chart Modal */}
        <SizeChartModal
          isOpen={isSizeChartOpen}
          onClose={() => setIsSizeChartOpen(false)}
          productType={product.product_type}
        />
      </div>

      {/* Mini Cart Drawer */}
      <MiniCartDrawer
        isOpen={isMiniCartOpen}
        onClose={() => setIsMiniCartOpen(false)}
      />
    </>
  );
}
