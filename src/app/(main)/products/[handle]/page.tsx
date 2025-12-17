'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  Package,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { Product, Variant } from '@/types';
import { toast } from 'sonner';

export default function ProductPage({ params }: { params: { handle: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.handle]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.handle}`);
      const data = await res.json();
      setProduct(data.product);
      setSelectedVariant(data.product.variants[0] || null);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    addToCart(
      {
        variant_id: selectedVariant.id,
        product_id: product.id,
        product_title: product.title,
        variant_title: selectedVariant.title,
        price: selectedVariant.price,
        image: product.images[currentImageIndex]?.src || '',
        sku: selectedVariant.sku,
        max_quantity: selectedVariant.inventory_quantity,
      },
      quantity,
    );

    toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`);
  };

  const nextImage = () => {
    if (product && product.images) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product && product.images) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Product Not Found
        </h1>
        <Link href="/collections/all">
          <Button>Browse All Products</Button>
        </Link>
      </div>
    );
  }

  // Group variants by option (e.g., Size, Color)
  const variantOptions = {
    sizes: [...new Set(product.variants.map((v) => v.option1).filter(Boolean))],
    colors: [...new Set(product.variants.map((v) => v.option2).filter(Boolean))],
  };

  return (
    <div className="min-h-screen">
      <div className="pt-10" />

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/70 dark:bg-gray-900/60 backdrop-blur border border-gray-200/70 dark:border-gray-800">
              {product.images && product.images[currentImageIndex] ? (
                <Image
                  src={product.images[currentImageIndex].src}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              {/* Navigation */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-900/70 backdrop-blur flex items-center justify-center border border-gray-200 dark:border-gray-800"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-900/70 backdrop-blur flex items-center justify-center border border-gray-200 dark:border-gray-800"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={`${img.src}-${idx}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border ${
                      idx === currentImageIndex
                        ? 'border-indigo-600'
                        : 'border-gray-200 dark:border-gray-800'
                    }`}
                    aria-label={`Select image ${idx + 1}`}
                  >
                    <Image src={img.src} alt={product.title} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between gap-6">
              <div>
                <Badge className="mb-3">New</Badge>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
                  {product.title}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" aria-label="Save">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" aria-label="Share">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.body_html ? product.body_html.replace(/<[^>]*>/g, '') : ' '}
            </p>

            {/* Price */}
            <div className="mt-6 flex items-end gap-3">
              <div className="text-3xl font-black text-gray-900 dark:text-white">
                ₦{selectedVariant?.price.toLocaleString()}
              </div>
              {selectedVariant?.compare_at_price && (
                <div className="text-lg text-gray-500 line-through">
                  ₦{selectedVariant.compare_at_price.toLocaleString()}
                </div>
              )}
            </div>

            {/* Variant Options */}
            <div className="mt-8 space-y-6">
              {variantOptions.sizes.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Size
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {variantOptions.sizes.map((size) => (
                      <button
                        key={String(size)}
                        onClick={() => {
                          const found = product.variants.find((v) => v.option1 === size);
                          if (found) setSelectedVariant(found);
                        }}
                        className={`px-4 py-2 rounded-lg border text-sm font-semibold ${
                          selectedVariant?.option1 === size
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 backdrop-blur text-gray-900 dark:text-white'
                        }`}
                      >
                        {String(size)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Quantity
                </p>
                <div className="inline-flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 backdrop-blur px-3 py-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                    aria-label="Decrease quantity"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                    aria-label="Increase quantity"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-8">
              <Button
                size="lg"
                className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-700"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isInCart(selectedVariant?.id) ? 'In Cart' : 'Add to Cart'}
              </Button>
              <AnimatePresence>
                {!!selectedVariant?.available && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="mt-3 text-sm text-green-700 dark:text-green-300 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" /> In stock and ready to ship
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Truck, title: 'Fast Delivery', desc: 'Nationwide shipping' },
                { icon: Shield, title: 'Secure Checkout', desc: 'SSL protected' },
                { icon: Package, title: 'Quality Print', desc: 'Premium materials' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-gray-200/70 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 backdrop-blur p-4"
                >
                  <item.icon className="w-5 h-5 text-indigo-600 mb-2" />
                  <p className="font-bold text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


