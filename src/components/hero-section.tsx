"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Play,
} from "lucide-react";

export const HeroSection = ({ darkMode }: { darkMode: boolean }) => {
  console.log("🚀 ~ HeroSection ~ darkMode:", darkMode);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: darkMode 
          ? 'linear-gradient(90deg, #401268 0%, #c5a3ff 25%, #f8f6f0 50%, #e2ae3d 75%, #e21b35 100%)'
          : 'linear-gradient(90deg, #401268 0%, #c5a3ff 25%, #f8f6f0 50%, #e2ae3d 75%, #e21b35 100%)'
      }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.2)' }} />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-6 max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <Sparkles className="w-20 h-20 mx-auto mb-8" style={{ color: '#e2ae3d' }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-6"
          style={{ color: darkMode ? '#f8f6f0' : '#ffffff' }}
        >
          <span style={{ color: '#f8f6f0' }}>
            GEEKS
          </span>
          <br />
          <span style={{ color: '#c5a3ff' }}>
            CREATION
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-2xl md:text-3xl font-light max-w-3xl mx-auto mb-12"
          style={{ color: darkMode ? 'rgba(248, 246, 240, 0.9)' : 'rgba(255, 255, 255, 0.9)' }}
        >
          Nigeria's Premier Print-on-Demand Platform
          <br />
          <span className="text-xl" style={{ color: '#c5a3ff' }}>
            Where Artists, Nerds & Dreamers Build Legendary Brands
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <button 
            className="group relative px-10 py-5 rounded-full font-bold text-lg shadow-2xl transition-all hover:scale-105"
            style={{
              backgroundColor: '#401268',
              color: '#ffffff',
              borderRadius: '12px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d0d4a'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#401268'}
          >
            <ShoppingBag className="inline-block w-6 h-6 mr-2" />
            Start Selling Now
            <ArrowRight className="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            className="px-10 py-5 border-2 backdrop-blur-sm rounded-full font-bold text-lg transition-all hover:scale-105"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              borderRadius: '12px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Play className="inline-block w-6 h-6 mr-2" />
            Watch Demo
          </button>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-16"
        >
          <ArrowRight className="w-12 h-12 mx-auto rotate-90" style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
        </motion.div>
      </motion.div>
    </section>
  );
};
