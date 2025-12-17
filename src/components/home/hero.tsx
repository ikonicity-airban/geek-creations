"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, ArrowRight, Grid3x3 } from "lucide-react";
import Link from "next/link";

export const Hero = ({ darkMode }: { darkMode: boolean }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: darkMode ? "#0f172a" : "#efefef", // Night-blue for dark, off-white for light
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(197,163,255,0.22)" }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl"
          style={{ 
            backgroundColor: darkMode 
              ? "rgba(226,174,61,0.15)" 
              : "rgba(226,174,61,0.1)" 
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          style={{ y, opacity }}
          className="text-center md:text-left"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6"
            style={{ color: darkMode ? '#f8f6f0' : '#401268' }}
          >
            Premium Geek Art
            <br />
            <span style={{ color: '#c5a3ff' }}>on Demand</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl mb-8"
            style={{ color: darkMode ? 'rgba(248, 246, 240, 0.9)' : 'rgba(64, 18, 104, 0.8)' }}
          >
            T-shirts • Hoodies • Mugs • Phone Cases • Posters
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <Link href="/collections/all">
              <button
                className="group relative px-10 py-5 rounded-xl font-bold text-lg shadow-2xl transition-all hover:scale-105 flex items-center justify-center"
                style={{
                  backgroundColor: '#401268',
                  color: '#ffffff',
                  borderRadius: '12px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d0d4a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#401268'}
              >
                <ShoppingBag className="inline-block w-6 h-6 mr-2" />
                Shop All Designs
                <ArrowRight className="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button
              className="px-10 py-5 border-2 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center"
              style={{
                borderColor: darkMode ? 'rgba(197, 163, 255, 0.5)' : '#401268',
                color: darkMode ? '#c5a3ff' : '#401268',
                borderRadius: '12px',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = darkMode 
                  ? 'rgba(197, 163, 255, 0.1)' 
                  : 'rgba(64, 18, 104, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Grid3x3 className="inline-block w-6 h-6 mr-2" />
              Browse Categories
            </button>
          </motion.div>
        </motion.div>

        {/* Printing Animation Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="relative"
        >
          <div
            className="w-full h-96 rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: darkMode 
                ? 'rgba(197, 163, 255, 0.1)' 
                : 'rgba(64, 18, 104, 0.05)',
              border: darkMode 
                ? '2px solid rgba(197, 163, 255, 0.2)' 
                : '2px solid rgba(64, 18, 104, 0.1)',
              borderRadius: '16px'
            }}
          >
            {/* Placeholder for printing animation GIF/SVG */}
            <div className="text-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 mx-auto mb-4"
                style={{
                  backgroundColor: '#401268',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ShoppingBag className="w-16 h-16" style={{ color: '#ffffff' }} />
              </motion.div>
              <p 
                className="text-sm"
                style={{ color: darkMode ? 'rgba(248, 246, 240, 0.7)' : 'rgba(64, 18, 104, 0.7)' }}
              >
                Printing Process Animation
              </p>
              <p 
                className="text-xs mt-2"
                style={{ color: darkMode ? 'rgba(248, 246, 240, 0.5)' : 'rgba(64, 18, 104, 0.5)' }}
              >
                (GIF/SVG placeholder)
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

