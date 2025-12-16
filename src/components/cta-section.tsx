"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section 
      className="py-32 relative overflow-hidden"
      style={{
        background: 'linear-gradient(90deg, #401268 0%, #c5a3ff 25%, #f8f6f0 50%, #e2ae3d 75%, #e21b35 100%)'
      }}
    >
      <div className="absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-black mb-6" style={{ color: '#ffffff' }}>
            Ready to Start Your
            <br />
            Geek Empire?
          </h2>
          <p className="text-2xl mb-12 max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Join 10,000+ Nigerian creators building profitable brands with zero
            risk
          </p>
          <button 
            className="group px-12 py-6 rounded-full font-bold text-xl shadow-2xl transition-all hover:scale-105"
            style={{
              backgroundColor: '#ffffff',
              color: '#401268',
              borderRadius: '12px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(255,255,255,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
            }}
          >
            Create Free Account
            <ArrowRight className="inline-block w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
          </button>
          <p className="mt-6" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            No credit card required • Free forever • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
};
