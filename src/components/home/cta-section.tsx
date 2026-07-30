"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";

export const CTASection = () => {
  return (
    <section
      className="py-32 relative overflow-hidden bg-cover bg-center bg-no-repeat transition-all duration-300 bg-[url('/img/brand-bg-light.png')] dark:bg-[url('/img/brand-bg-dark.png')]"
    >
      {/* Readability Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300 bg-[rgba(248,246,240,0.88)] dark:bg-[rgba(1,1,16,0.88)]"
      />

      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 16, repeat: Infinity }}
          className="absolute top-10 -right-10 w-80 h-80 rounded-full blur-3xl bg-[rgba(197,163,255,0.2)]"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 14, repeat: Infinity }}
          className="absolute -bottom-10 -left-10 w-80 h-80 rounded-full blur-3xl bg-[rgba(226,174,61,0.15)]"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            className="text-5xl md:text-7xl font-black mb-6 transition-colors duration-300 text-[#401268] dark:text-[#f8f6f0]"
          >
            Wear your favorite designs
          </h2>
          <p
            className="text-2xl mb-12 max-w-2xl mx-auto transition-colors duration-300 text-[rgba(64,18,104,0.8)] dark:text-[rgba(248,246,240,0.85)]"
          >
            Custom-printed, made to order, delivered across Nigeria
          </p>
          <Link href="/collections/all" className="inline-block">
            <button
              className="group px-12 py-6 font-bold text-xl shadow-2xl transition-all hover:scale-105 rounded-[12px] bg-[#401268] hover:bg-[#2d0d4a] dark:bg-[#c5a3ff] dark:hover:bg-[#b38eff] text-white dark:text-[#010110]"
            >
              Shop Now
              <ArrowRight className="inline-block w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

