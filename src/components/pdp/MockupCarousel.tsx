"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { ProductImage } from "@/types";
import Image from "next/image";

const COLORS = {
  primary: "#401268",
  secondary: "#c5a3ff",
  background: "#f8f6f0",
  accentWarm: "#e2ae3d",
  accentBold: "#e21b35",
};

interface MockupCarouselProps {
  images: ProductImage[];
  productTitle: string;
  designImage?: string; // Optional design image to overlay on product mockup
  mockupUrl?: string; // Optional pre-generated POD mockup URL (takes precedence over designImage)
}

export default function MockupCarousel({
  images,
  productTitle,
  designImage,
  mockupUrl,
}: MockupCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (images.length === 0) {
    return (
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentIndex}-${designImage || "no-design"}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full cursor-zoom-in"
            onClick={() => setIsZoomed(true)}
          >
            {/* Use pre-generated mockup if available, otherwise overlay design */}
            {mockupUrl ? (
              <Image
                width={400}
                height={300}
                src={mockupUrl}
                alt={`${productTitle} with design`}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                {/* Product Mockup Base */}
                <Image
                  width={400}
                  height={300}
                  src={images[currentIndex].src}
                  alt={
                    images[currentIndex].alt ||
                    `${productTitle} - Image ${currentIndex + 1}`
                  }
                  className="w-full h-full object-cover"
                />
                {/* Design Overlay (if designImage provided) */}
                {designImage && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      width={400}
                      height={300}
                      src={designImage}
                      alt="Design overlay"
                      className="max-w-[80%] max-h-[80%] object-contain opacity-90 mix-blend-multiply"
                      style={{
                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg"
              style={{ color: COLORS.primary }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg"
              style={{ color: COLORS.primary }}
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Zoom Indicator */}
        <div className="absolute bottom-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-5 h-5" style={{ color: COLORS.primary }} />
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-semibold">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => goToImage(index)}
              className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === index
                  ? "border-opacity-100 scale-105"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
              style={{
                borderColor:
                  currentIndex === index ? COLORS.primary : "transparent",
              }}
            >
              <Image
                width={400}
                height={300}
                src={image.src}
                alt={image.alt || `Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Use pre-generated mockup if available, otherwise overlay design */}
              {mockupUrl ? (
                <Image
                  width={400}
                  height={300}
                  src={mockupUrl}
                  alt={`${productTitle} with design`}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <>
                  {/* Product Mockup Base */}
                  <Image
                    width={400}
                    height={300}
                    src={images[currentIndex].src}
                    alt={images[currentIndex].alt || productTitle}
                    className="max-w-full max-h-full object-contain"
                  />
                  {/* Design Overlay (if designImage provided) */}
                  {designImage && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        width={400}
                        height={300}
                        src={designImage}
                        alt="Design overlay"
                        className="max-w-[80%] max-h-[80%] object-contain opacity-90 mix-blend-multiply"
                        style={{
                          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </motion.div>
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition"
            >
              <ChevronLeft className="w-6 h-6 rotate-45" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
