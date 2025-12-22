"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, Sparkles, ArrowRight, Play } from "lucide-react";

export const HeroSection = ({ darkMode }: { darkMode: boolean }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section
      className="relative min-h-[80vh] sm:min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, #401268 0%, #c5a3ff 25%, #f8f6f0 50%, #e2ae3d 75%, #e21b35 100%)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: darkMode
            ? "rgba(64,18,104,0.4)"
            : "rgba(64,18,104,0.25)",
        }}
      />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-48 h-48 sm:w-96 sm:h-96 rounded-full blur-2xl sm:blur-3xl"
          style={{ backgroundColor: "rgba(197,163,255,0.22)" }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-48 h-48 sm:w-96 sm:h-96 rounded-full blur-2xl sm:blur-3xl"
          style={{ backgroundColor: "rgba(226,174,61,0.2)" }}
        />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center container-padding max-w-7xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <Sparkles
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-4 sm:mb-6 md:mb-8"
            style={{ color: "#e2ae3d" }}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter mb-4 sm:mb-5 md:mb-6"
          style={{ color: darkMode ? "#f8f6f0" : "#ffffff" }}
        >
          <span style={{ color: "#f8f6f0" }}>GEEKS</span>
          <br />
          <span style={{ color: "#c5a3ff" }}>CREATION</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-light max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 px-4"
          style={{
            color: darkMode
              ? "rgba(248, 246, 240, 0.9)"
              : "rgba(255, 255, 255, 0.9)",
          }}
        >
          Create and sell custom products with zero risk. 100% free to start,
          powered by local production and global delivery.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-14 md:mb-16"
        >
          <button
            className="group relative px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-btn font-bold text-sm sm:text-base md:text-lg shadow-card-elevated transition-smooth hover:scale-105 active:scale-95 w-full sm:w-auto max-w-xs sm:max-w-none"
            style={{
              backgroundColor: "#401268",
              color: "#ffffff",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2d0d4a")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#401268")
            }
          >
            <ShoppingBag className="inline-block w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2" />
            Start for Free
            <ArrowRight className="inline-block w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            className="px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 border border-hairline sm:border-2 backdrop-blur-sm rounded-btn font-bold text-sm sm:text-base md:text-lg transition-smooth hover:scale-105 active:scale-95 w-full sm:w-auto max-w-xs sm:max-w-none"
            style={{
              borderColor: "rgba(255, 255, 255, 0.3)",
              color: "#ffffff",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <Play className="inline-block w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2" />
            See How It Works
          </button>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-8 sm:mt-12 md:mt-16"
        >
          <ArrowRight
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto rotate-90"
            style={{ color: "rgba(255, 255, 255, 0.6)" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
