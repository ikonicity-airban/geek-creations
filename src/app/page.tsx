"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/home/hero";
import { FeaturedCarousel } from "@/components/home/featured-carousel";
import { CategoryGrid } from "@/components/home/category-grid";
import { DesignGallery } from "@/components/home/design-gallery";
import { ProductionDemo } from "@/components/home/production-demo";
import { FeaturesSection } from "@/components/home/features-section";
import { Footer } from "@/components/footer";

// Main App Component - Homepage Structure
export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#f8f6f0' }}>
      {/* Navbar */}
      <Navbar darkMode={darkMode} />

      {/* Dark Mode Toggle */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed top-6 right-6 z-50 p-4 rounded-full backdrop-blur-lg border transition-all"
        style={{
          backgroundColor: darkMode ? 'rgba(197, 163, 255, 0.1)' : 'rgba(64, 18, 104, 0.1)',
          borderColor: darkMode ? '#c5a3ff' : '#401268',
        }}
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? (
          <Sun className="w-6 h-6" style={{ color: '#e2ae3d' }} />
        ) : (
          <Moon className="w-6 h-6" style={{ color: '#401268' }} />
        )}
      </motion.button>

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
      
      {/* 7. Footer - Navigation + Legal */}
      <Footer />
    </div>
  );
}
