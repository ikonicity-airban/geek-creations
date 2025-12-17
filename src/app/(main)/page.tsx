"use client";

import { Hero } from "@/components/home/hero";
import { FeaturedCarousel } from "@/components/home/featured-carousel";
import { CategoryGrid } from "@/components/home/category-grid";
import { DesignGallery } from "@/components/home/design-gallery";
import { ProductionDemo } from "@/components/home/production-demo";
import { FeaturesSection } from "@/components/home/features-section";
import { useTheme } from "@/lib/theme-context";

// Main App Component - Homepage Structure
export default function HomePage() {
  const { darkMode } = useTheme();

  return (
    <>
      {/* Homepage Structure (Top → Bottom Flow) */}
      {/* 1. Hero Banner - Instant brand impact + CTA */}
      <Hero darkMode={darkMode} />
      
      {/* 2. Featured Designs Carousel - Hook visitors with best sellers */}
      <FeaturedCarousel />
      
      {/* 3. Category Grid - Easy navigation to product types (Bento Grid) */}
      <CategoryGrid />
      
      {/* 4. All Designs Gallery - Core browsing experience */}
      <DesignGallery />
      
      {/* 5. Production Demo - UI demonstration with animation */}
      <ProductionDemo />
      
      {/* 6. Why Choose Us / Features - Build trust */}
      <FeaturesSection />
      
    </>
  );
}
