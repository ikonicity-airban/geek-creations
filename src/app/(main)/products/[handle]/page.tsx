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
import {
  MockupCarousel,
  type MockupImage,
} from "@/components/ui/mockup-carousel";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import VariantSelector from "@/components/pdp/VariantSelector";
import AddToCartButton from "@/components/pdp/AddToCartButton";
import RelatedProducts from "@/components/pdp/RelatedProducts";
import SizeChartModal from "@/components/pdp/SizeChartModal";
import MiniCartDrawer from "@/components/cart/MiniCartDrawer";
import { Button, buttonVariants } from "@/components/ui/button";
import { IconBabyBottle, IconFidgetSpinner } from "@tabler/icons-react";

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

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center p-8 bg-card rounded-card border-hairline border-border shadow-card max-w-md mx-auto space-y-6">
          <IconBabyBottle className="w-20 h-20 my-4 mx-auto opacity-50 text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="text-3xl font-black mb-4 text-foreground">Product Not Found</h3>
            <p className="mb-6 text-muted-foreground text-sm">
              {error || "This product doesn't exist"}
            </p>
          </div>
          <Button
            onClick={() => router.push("/collections/all")}
            className="w-full py-3 rounded-btn font-bold transition-smooth"
          >
            Browse Collections
          </Button>
        </div>
      </div>
    );
  }

  const maxQuantity = selectedVariant
    ? Math.min(selectedVariant.inventory_quantity, 10)
    : 1;

  return (
    <>
      <div className="min-h-screen bg-transparent pt-32 pb-16">
        <div className="container-lg container-padding">
          {/* Breadcrumb */}
          <Breadcrumb
            className="mb-8"
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/collections/all" },
              { label: product.title, href: `/products/${product.handle}` },
            ]}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16"
          >
            {/* Left: Image Gallery */}
            <div>
              {(() => {
                // Build images array: start with product images
                const carouselImages: MockupImage[] = product.images.map(
                  (img) => ({
                    id: img.id,
                    src: img.src,
                    alt: img.alt || product.title,
                  })
                );

                // If there's a mockup URL, add it to the beginning
                if (mockupUrl) {
                  carouselImages.unshift({
                    id: "mockup",
                    src: mockupUrl,
                    alt: `${product.title} with design`,
                  });
                }

                // If there's an uploaded design URL, add it as well
                if (uploadedDesignUrl && !mockupUrl) {
                  carouselImages.unshift({
                    id: "uploaded-design",
                    src: uploadedDesignUrl,
                    alt: `${product.title} with uploaded design`,
                  });
                }

                return (
                  <MockupCarousel
                    images={carouselImages}
                    title={product.title}
                    autoScroll={carouselImages.length > 1}
                    autoScrollInterval={5000}
                    showThumbnails={true}
                    showZoom={true}
                    aspectRatio="square"
                  />
                );
              })()}
            </div>

            {/* Right: Product Info */}
            <div className="space-y-6">
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-semibold text-accent bg-accent/10 border-hairline border-accent/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h3 className="text-2xl md:text-5xl font-black text-foreground">
                {product.title}
              </h3>

              {/* Vendor & Type */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground font-semibold">
                {product.vendor && <span>By {product.vendor}</span>}
                {product.product_type && <span>• {product.product_type}</span>}
              </div>

              {/* Price */}
              {selectedVariant && (
                <div className="flex items-center gap-4">
                  <p className="text-3xl md:text-4xl font-black text-accent">
                    ₦{selectedVariant.price.toLocaleString()}
                  </p>
                  {selectedVariant.compare_at_price && (
                    <>
                      <p className="text-xl line-through opacity-60 text-muted-foreground">
                        ₦{selectedVariant.compare_at_price.toLocaleString()}
                      </p>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-destructive text-white shadow-sm uppercase tracking-wider">
                        SALE
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Geek Score Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/25 border-hairline border-border text-primary">
                <Zap className="w-3.5 h-3.5" />
                <span className="font-bold text-xs uppercase tracking-wider">Geek Score: 9000+</span>
              </div>

              {/* Description */}
              {product.description && (
                <div
                  className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-none prose dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}

              {/* Design Selector Carousel */}
              <div className="mb-8 max-w-[90dvw]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base sm:text-lg font-bold text-foreground">
                    Choose Your Design
                  </h4>
                  <Link
                    href={`/editor?product=${product.handle}`}
                    className={buttonVariants({
                      variant: "outline",
                      className:
                        "flex items-center gap-1.5 transition-smooth text-xs rounded-btn border-hairline border-border hover:border-primary text-primary px-3 py-1.5 h-auto",
                    })}
                  >
                    <Wand2 className="w-3.5 h-3.5" />
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
                      className={`rounded-card overflow-hidden border-2 transition-smooth ${
                        uploadedDesignUrl
                          ? "shadow-card-hover border-accent scale-105 z-10 font-semibold"
                          : "border-dashed border-border hover:border-primary bg-card/60 hover:bg-card hover:scale-[1.02]"
                      }`}
                    >
                      <div className="relative w-28 h-28 flex flex-col items-center justify-center">
                        {uploadedDesignUrl ? (
                          <>
                            <div className="relative w-full h-full p-2 bg-muted/10">
                              <Image
                                src={uploadedDesignUrl}
                                alt="Uploaded design"
                                fill
                                className="object-contain"
                                unoptimized
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
                              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-destructive text-white hover:bg-destructive/90 transition-smooth shadow-sm"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <>
                            {isUploading ? (
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mb-1.5 text-muted-foreground" />
                                <span className="text-3xs font-semibold px-2 text-center uppercase tracking-wider text-muted-foreground">
                                  Upload
                                </span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </label>

                  {/* Design Library Items */}
                  {allDesigns.map((design) => {
                    const isSelected = selectedDesignId === design.id && !uploadedDesignUrl;
                    return (
                      <button
                        key={design.id}
                        onClick={() => {
                          setSelectedDesignId(design.id);
                          setUploadedDesignUrl(null); // Clear uploaded design
                          generateMockup(design.imageUrl);
                        }}
                        className={`shrink-0 rounded-card overflow-hidden border-2 transition-smooth flex flex-col items-center justify-center relative ${
                          isSelected
                            ? "shadow-card-hover border-primary scale-105 z-10 bg-card font-semibold"
                            : "border-border hover:border-primary/50 bg-card/60 opacity-80 hover:opacity-100 hover:scale-[1.02]"
                        }`}
                      >
                        <div className="relative w-28 h-20 bg-muted/10">
                          <Image
                            src={design.thumbnailUrl || design.imageUrl}
                            alt={design.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="w-28 py-1 border-t border-hairline border-border/30 bg-card/85 text-center">
                          <p className="text-3xs font-semibold px-1 truncate text-foreground">
                            {design.title}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {(selectedDesignId || uploadedDesignUrl) && (
                  <p className="mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Selected:{" "}
                    <span className="text-foreground normal-case">
                      {uploadedDesignUrl
                        ? "Your Uploaded Design"
                        : allDesigns.find((d) => d.id === selectedDesignId)
                            ?.title}
                    </span>
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
                <label className="block text-sm font-bold mb-2.5 text-foreground">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant={"outline"}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-btn border-hairline border-border font-bold hover:bg-muted transition-smooth"
                  >
                    -
                  </Button>
                  <span className="text-lg font-bold w-8 text-center text-foreground">
                    {quantity}
                  </span>
                  <Button
                    variant={"outline"}
                    onClick={() =>
                      setQuantity(Math.min(maxQuantity, quantity + 1))
                    }
                    disabled={quantity >= maxQuantity}
                    className="w-10 h-10 rounded-btn border-hairline border-border font-bold hover:bg-muted transition-smooth disabled:opacity-40"
                  >
                    +
                  </Button>
                  {maxQuantity > 0 && (
                    <span className="text-xs font-semibold text-muted-foreground">
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
                <Button
                  variant="outline"
                  onClick={() => setIsSizeChartOpen(true)}
                  className="w-full py-3 rounded-btn font-semibold flex items-center justify-center gap-2 border-hairline border-border hover:border-primary transition-smooth text-primary hover:bg-primary/5 h-11"
                >
                  <Ruler className="w-4 h-4" />
                  Size Chart
                </Button>
              )}

              {/* Additional Info */}
              <div
                className="pt-6 border-t border-hairline border-border/30 space-y-4 text-foreground"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 mt-1 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">Crypto Payments Accepted</p>
                    <p className="text-xs text-muted-foreground">USDC, SOL, and more</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-4 h-4 mt-1 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">Fast Shipping</p>
                    <p className="text-xs text-muted-foreground">
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
