"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { Zap, Sparkles, Ruler } from "lucide-react";
import { Product, Variant } from "@/types";
import { fetchProduct } from "@/lib/fetchProduct";
import MockupCarousel from "@/components/pdp/MockupCarousel";
import VariantSelector from "@/components/pdp/VariantSelector";
import AddToCartButton from "@/components/pdp/AddToCartButton";
import RelatedProducts from "@/components/pdp/RelatedProducts";
import SizeChartModal from "@/components/pdp/SizeChartModal";

// ========================================
// BRAND COLORS
// ========================================
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
  const handle = params.handle as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data
  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      setError(null);

      try {
        const productData = await fetchProduct(handle);

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

        // TODO: Fetch related products (same collection, tags, or category)
        // For now, using empty array
        setRelatedProducts([]);
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

  if (isLoading) {
    return null; // Next.js will show loading.tsx
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
            onClick={() => router.push("/collections")}
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
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${COLORS.background} 0%, #ffffff 100%)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
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
                  <p className="text-2xl line-through opacity-60">
                    ₦{selectedVariant.compare_at_price.toLocaleString()}
                  </p>
                )}
                {selectedVariant.compare_at_price && (
                  <span
                    className="px-3 py-1 rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: COLORS.accentBold }}
                  >
                    SALE
                  </span>
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
  );
}
