"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface FeaturedDesign {
  id: string;
  name: string;
  image: string;
  priceRange: string;
  handle: string;
}

export const FeaturedCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Mock data - replace with actual data from Supabase
  const featuredDesigns: FeaturedDesign[] = [
    {
      id: "1",
      name: "Anime Hero Tee",
      image: "/placeholder-design.jpg",
      priceRange: "₦5,000 - ₦8,000",
      handle: "anime-hero-tee"
    },
    {
      id: "2",
      name: "Tech Geek Hoodie",
      image: "/placeholder-design.jpg",
      priceRange: "₦12,000 - ₦15,000",
      handle: "tech-geek-hoodie"
    },
    {
      id: "3",
      name: "Afro-Futurism Mug",
      image: "/placeholder-design.jpg",
      priceRange: "₦3,500 - ₦4,500",
      handle: "afro-futurism-mug"
    },
    {
      id: "4",
      name: "Nigerian Pride Case",
      image: "/placeholder-design.jpg",
      priceRange: "₦4,000 - ₦6,000",
      handle: "nigerian-pride-case"
    },
    {
      id: "5",
      name: "Cyberpunk Poster",
      image: "/placeholder-design.jpg",
      priceRange: "₦2,500 - ₦3,500",
      handle: "cyberpunk-poster"
    },
    {
      id: "6",
      name: "Gaming Legend Tee",
      image: "/placeholder-design.jpg",
      priceRange: "₦5,500 - ₦8,500",
      handle: "gaming-legend-tee"
    },
  ];

  const visibleCount = 4;
  const maxIndex = Math.max(0, featuredDesigns.length - visibleCount);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="py-20" style={{ backgroundColor: '#f8f6f0' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: '#401268' }}>
            Featured Designs
          </h2>
          <p className="text-xl" style={{ color: 'rgba(64, 18, 104, 0.8)' }}>
            Our best sellers and trending designs
          </p>
        </motion.div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{
                x: `-${currentIndex * (100 / visibleCount)}%`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {featuredDesigns.map((design, index) => (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="flex-shrink-0"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <Link href={`/products/${design.handle}`}>
                    <div
                      className="rounded-2xl p-6 cursor-pointer transition-all"
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        border: '1px solid #e0e0e0'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(64,18,104,0.15)';
                        e.currentTarget.style.borderColor = '#c5a3ff';
                        e.currentTarget.style.borderWidth = '2px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                        e.currentTarget.style.borderColor = '#e0e0e0';
                        e.currentTarget.style.borderWidth = '1px';
                      }}
                    >
                      {/* Design Image Placeholder */}
                      <div
                        className="w-full h-64 rounded-xl mb-4 flex items-center justify-center"
                        style={{
                          backgroundColor: 'rgba(197, 163, 255, 0.1)',
                          border: '1px dashed rgba(197, 163, 255, 0.3)'
                        }}
                      >
                        <span style={{ color: '#c5a3ff' }}>Design Image</span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2" style={{ color: '#401268' }}>
                        {design.name}
                      </h3>
                      <p className="mb-4" style={{ color: 'rgba(64, 18, 104, 0.6)' }}>
                        {design.priceRange}
                      </p>
                      <div className="flex items-center" style={{ color: '#c5a3ff' }}>
                        <span className="text-sm font-semibold mr-2">View Products</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          {featuredDesigns.length > visibleCount && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: '#401268',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(64,18,104,0.3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d0d4a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#401268'}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: '#401268',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(64,18,104,0.3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d0d4a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#401268'}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

