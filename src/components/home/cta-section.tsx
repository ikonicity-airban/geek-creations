"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section
      className="py-32 relative overflow-hidden"
      style={{ backgroundColor: '#f8f6f0' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 16, repeat: Infinity }}
          className="absolute top-10 -right-10 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(197,163,255,0.25)' }}
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 14, repeat: Infinity }}
          className="absolute -bottom-10 -left-10 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(226,174,61,0.25)' }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-black mb-6" style={{ color: '#401268' }}>
            Create and sell custom products
          </h2>
          <p className="text-2xl mb-12 max-w-2xl mx-auto" style={{ color: 'rgba(64, 18, 104, 0.8)' }}>
            100% free to use • 1000+ products • Global delivery
          </p>
          <button
            className="group px-12 py-6 rounded-full font-bold text-xl shadow-2xl transition-all hover:scale-105"
            style={{
              backgroundColor: '#401268',
              color: '#ffffff',
              borderRadius: '12px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2d0d4a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#401268';
            }}
          >
            Get started for free
            <ArrowRight className="inline-block w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
          </button>
          <p className="mt-6" style={{ color: 'rgba(64, 18, 104, 0.7)' }}>
            No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  );
};
