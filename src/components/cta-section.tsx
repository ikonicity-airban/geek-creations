"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-32 bg-linear-to-br from-purple-600 via-pink-600 to-orange-500 relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
            Ready to Start Your
            <br />
            Geek Empire?
          </h2>
          <p className="text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join 10,000+ Nigerian creators building profitable brands with zero
            risk
          </p>
          <button className="group px-12 py-6 bg-white text-purple-600 rounded-full font-bold text-xl shadow-2xl hover:shadow-white/50 transition-all hover:scale-105">
            Create Free Account
            <ArrowRight className="inline-block w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
          </button>
          <p className="mt-6 text-white/80">
            No credit card required • Free forever • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
};
