// app/products/[handle]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Share2, Truck, Shield, Package, ChevronLeft, ChevronRight, Check } from 'lucide-react';
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

    addToCart({
      variant_id: selectedVariant.id,
      product_id: product.id,
      product_title: product.title,
      variant_title: selectedVariant.title,
      price: selectedVariant.price,
      image: product.images[currentImageIndex]?.src || '',
      sku: selectedVariant.sku,
      max_quantity: selectedVariant.inventory_quantity,
    }, quantity);

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
    sizes: [...new Set(product.variants.map(v => v.option1).filter(Boolean))],
    colors: [...new Set(product.variants.map(v => v.option2).filter(Boolean))],
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              GEEKS CREATION
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                {product.images && product.images[currentImageIndex] && (
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={product.images[currentImageIndex].src}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur p-2 rounded-full hover:bg-white dark:hover:bg-gray-800 transition"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur p-2 rounded-full hover:bg-white dark:hover:bg-gray-800 transition"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Grid */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                      idx === currentImageIndex
                        ? 'border-indigo-600'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={`${product.title} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-3 bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100">
                {product.product_type}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                {product.title}
              </h1>
              <div className="flex items-baseline gap-4 mb-6">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ₦{selectedVariant?.price.toLocaleString()}
                </p>
                {selectedVariant?.compare_at_price && (
                  <p className="text-xl text-gray-500 line-through">
                    ₦{selectedVariant.compare_at_price.toLocaleString()}
                  </p>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {variantOptions.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Size: {selectedVariant?.option1 || 'Select'}
                </label>
                <div className="flex flex-wrap gap-3">
                  {variantOptions.sizes.map((size) => {
                    const variant = product.variants.find(v => v.option1 === size);
                    const isSelected = selectedVariant?.option1 === size;
                    const isAvailable = variant && variant.inventory_quantity > 0;

                    return (
                      <button
                        key={size}
                        onClick={() => variant && setSelectedVariant(variant)}
                        disabled={!isAvailable}
                        className={`px-6 py-3 rounded-lg font-semibold transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-600 ring-offset-2'
                            : isAvailable
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center font-bold"
                >
                  −
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedVariant?.inventory_quantity || 1, quantity + 1))}
                  className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 h-14 text-lg"
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.inventory_quantity === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isInCart(selectedVariant?.id || '') ? 'Update Cart' : 'Add to Cart'}
              </Button>
              <Button size="lg" variant="outline" className="h-14">
                <Heart className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                <p className="text-xs font-semibold text-gray-900 dark:text-white">Free Shipping</p>
                <p className="text-xs text-gray-500">Orders ₦50k+</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                <p className="text-xs font-semibold text-gray-900 dark:text-white">7-Day Returns</p>
                <p className="text-xs text-gray-500">No questions</p>
              </div>
              <div className="text-center">
                <Package className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                <p className="text-xs font-semibold text-gray-900 dark:text-white">Premium Quality</p>
                <p className="text-xs text-gray-500">100% Cotton</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}