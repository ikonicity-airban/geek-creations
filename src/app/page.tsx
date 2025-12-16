"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { StatsSection } from "@/components/stats-section";
import { FeaturesSection } from "@/components/features-section";
import { ProductsShowcase } from "@/components/products-showcase";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

// Main App Component - Community Website Structure
export default function GeeksCreationLanding() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#f8f6f0' }}>
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

      {/* Community Website Structure */}
      {/* 1. Hero Section - Community-focused messaging */}
      <HeroSection darkMode={darkMode} />
      
      {/* 2. Stats Section - Community metrics */}
      <StatsSection />
      
      {/* 3. Features Section - Community benefits */}
      <FeaturesSection />
      
      {/* 4. Products Showcase - Community gallery */}
      <ProductsShowcase />
      
      {/* 5. How It Works - Community process */}
      <HowItWorks />
      
      {/* 6. Testimonials - Community stories */}
      <Testimonials />
      
      {/* 7. CTA Section - Join community */}
      <CTASection />
      
      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
