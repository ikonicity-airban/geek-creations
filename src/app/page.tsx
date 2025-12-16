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

// Main App Component
export default function GeeksCreationLanding() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <div className="relative">
      {/* Dark Mode Toggle */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed top-6 right-6 z-50 p-4 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? (
          <Sun className="w-6 h-6 text-yellow-400" />
        ) : (
          <Moon className="w-6 h-6 text-purple-600" />
        )}
      </motion.button>

      {/* All Sections */}
      <HeroSection darkMode={darkMode} />
      <StatsSection />
      <FeaturesSection />
      <ProductsShowcase />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}
