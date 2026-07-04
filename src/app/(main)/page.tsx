"use client";

import { Hero } from "@/components/home/hero";
import { DualEntrySection } from "@/components/home/dual-entry-section";
import { FeaturedCarousel } from "@/components/home/featured-carousel";
import { CategoryGrid } from "@/components/home/category-grid";
import { DesignGallery } from "@/components/home/design-gallery";
import { ProductsShowcase } from "@/components/home/products-showcase";
import { ProductionDemo } from "@/components/home/production-demo";
import { FeaturesSection } from "@/components/home/features-section";
import { StatsSection } from "@/components/home/stats-section";
import { Testimonials } from "@/components/home/testimonials";
import { CTASection } from "@/components/home/cta-section";
import { useTheme } from "@/lib/theme-context";

// Main App Component - Homepage Structure
export default function HomePage() {
  const { darkMode } = useTheme();

  return (
    <>
      {/* 1. Hero Banner - untouched */}
      <Hero darkMode={darkMode} />

      {/* 2. The fork: design-first vs product-first, equal weight */}
      <DualEntrySection />

      {/* 3. Hook - trending designs, works for either path */}
      <FeaturedCarousel />

      {/* 4. Product-first path */}
      <CategoryGrid />

      {/* 5. Design-first path - adjacent to CategoryGrid so both
             browsing entry points read as equal options */}
      <DesignGallery />

      {/* 6. Store Credibility Stats */}
      <StatsSection />

      {/* 7. Concrete purchasable items - bridges both paths to "buy now" */}
      <ProductsShowcase />

      {/* 8. Process trust-builder: design -> product -> shipped */}
      <ProductionDemo />

      {/* 9. Why buy from us */}
      <FeaturesSection />

      {/* 10. Social proof (customer reviews, not seller-success stories) */}
      <Testimonials />

      {/* 11. Closing Call-To-Action */}
      <CTASection />
    </>
  );
}
