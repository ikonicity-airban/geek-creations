"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type MockupImage = {
  id?: string;
  src: string;
  alt?: string;
};

interface MockupCarouselProps {
  images: MockupImage[];
  title?: string;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  showThumbnails?: boolean;
  showZoom?: boolean;
  className?: string;
  aspectRatio?: "square" | "4/3" | "16/9" | "auto";
}

export function MockupCarousel({
  images,
  title,
  autoScroll = false,
  autoScrollInterval = 5000,
  showThumbnails = true,
  showZoom = true,
  className,
  aspectRatio = "square",
}: MockupCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToImage = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoScroll || images.length <= 1 || isPaused || isZoomed) return;

    const interval = setInterval(() => {
      nextImage();
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [
    autoScroll,
    autoScrollInterval,
    images.length,
    isPaused,
    isZoomed,
    nextImage,
  ]);

  if (images.length === 0) {
    return (
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden bg-muted flex items-center justify-center",
          aspectRatio === "square" && "aspect-square",
          aspectRatio === "4/3" && "aspect-4/3",
          aspectRatio === "16/9" && "aspect-video",
          className
        )}
      >
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  const aspectClasses = {
    square: "aspect-square",
    "4/3": "aspect-4/3",
    "16/9": "aspect-video",
    auto: "",
  };

  return (
    <div className={cn("relative", className)}>
      {/* Main Image Container */}
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden bg-muted group",
          aspectClasses[aspectRatio]
        )}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "relative w-full h-full",
              showZoom && "cursor-zoom-in"
            )}
            onClick={() => showZoom && setIsZoomed(true)}
          >
            <Image
              fill
              src={images[currentIndex].src}
              alt={
                images[currentIndex].alt || title || `Image ${currentIndex + 1}`
              }
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background shadow-lg z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background shadow-lg z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </button>
          </>
        )}

        {/* Zoom Indicator */}
        {showZoom && (
          <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 p-2 rounded-full bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 px-2 sm:px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold z-10">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Auto-scroll Indicator */}
        {autoScroll && images.length > 1 && !isPaused && (
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 px-2 py-1 rounded-full bg-primary/80 backdrop-blur-sm text-primary-foreground text-xs font-semibold z-10">
            Auto
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {showThumbnails && images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 hide-scrollbar">
          {images.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => goToImage(index)}
              className={cn(
                "shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all",
                currentIndex === index
                  ? "border-primary scale-105 shadow-md"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image
                width={80}
                height={80}
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
        {isZoomed && showZoom && (
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
              <Image
                width={1200}
                height={1200}
                src={images[currentIndex].src}
                alt={
                  images[currentIndex].alt ||
                  title ||
                  `Zoomed image ${currentIndex + 1}`
                }
                className="max-w-full max-h-[90vh] object-contain"
              />
            </motion.div>
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition z-10"
              aria-label="Close zoom"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
