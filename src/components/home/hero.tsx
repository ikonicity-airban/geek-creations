"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { BackgroundLines } from "@/components/ui/background-lines";
import { IconPhoto } from "@tabler/icons-react";

const COLORS = {
  primary: "#401268",
  secondary: "#c5a3ff",
  background: "#f8f6f0",
  accentWarm: "#e2ae3d",
  accentBold: "#e21b35",
};

export const Hero = ({ darkMode }: { darkMode: boolean }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 100]);
  const opacity = useTransform(scrollY, [0, 1000], [1, 0]);

  return (
    <BackgroundLines
      className="flex items-center justify-center w-full min-h-fit md:min-h-screen relative overflow-hidden"
      darkMode={darkMode}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center w-full py-12 md:py-0">
        {/* Text Content */}
        <motion.div
          style={{ y, opacity }}
          className="text-center md:text-left space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 rounded-full mb-4"
            style={{
              backgroundColor: darkMode
                ? "rgba(197, 163, 255, 0.15)"
                : "rgba(197, 163, 255, 0.2)",
              border: `1px solid ${
                darkMode ? "rgba(197, 163, 255, 0.3)" : "rgba(64, 18, 104, 0.2)"
              }`,
            }}
          >
            <span
              className="text-sm font-bold flex items-center gap-2"
              style={{ color: darkMode ? COLORS.secondary : COLORS.primary }}
            >
              <Sparkles className="w-4 h-4" />
              20+ Premium Designs Ready
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight"
            style={{
              color: darkMode ? COLORS.background : COLORS.primary,
              fontFamily: "Over the Rainbow, sans-serif",
            }}
          >
            Premium Geek Art
            <br />
            <span
              style={{
                fontSize: "smaller",
                fontFamily: "Orbitron, sans-serif",
                color: darkMode ? COLORS.accentWarm : COLORS.secondary,
                background: darkMode
                  ? "linear-gradient(135deg, #e2ae3d, #c5a3ff)"
                  : "linear-gradient(135deg, #c5a3ff, #401268)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Print on Demand
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl leading-relaxed max-w-xl"
            style={{
              color: darkMode
                ? "rgba(248, 246, 240, 0.85)"
                : "rgba(64, 18, 104, 0.75)",
            }}
          >
            Choose from curated designs or upload your own. We handle printing,
            shipping, and crypto payments.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3 text-sm font-semibold"
            style={{
              color: darkMode
                ? "rgba(248, 246, 240, 0.6)"
                : "rgba(64, 18, 104, 0.6)",
            }}
          >
            <span>🎨 T-Shirts</span>
            <span>•</span>
            <span>👕 Hoodies</span>
            <span>•</span>
            <span>☕ Mugs</span>
            <span>•</span>
            <span>📱 Phone Cases</span>
            <span>•</span>
            <span>🖼️ Posters</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link href="/designs" className="flex-1 ">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full  px-8 py-4 rounded-xl font-bold text-base shadow-xl transition-all flex items-center justify-center gap-2"
                style={{
                  backgroundColor: COLORS.primary,
                  color: "#ffffff",
                }}
              >
                <IconPhoto className="w-5 h-5" />
                Browse Designs
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link href="/collections/all" className="sm:flex-initial flex-1">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 border-2 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2"
                style={{
                  borderColor: darkMode ? COLORS.secondary : COLORS.primary,
                  color: darkMode ? COLORS.secondary : COLORS.primary,
                  backgroundColor: darkMode
                    ? "rgba(197, 163, 255, 0.05)"
                    : "rgba(64, 18, 104, 0.05)",
                }}
              >
                <ShoppingBag className="w-5 h-5" />
                Shop all products
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap items-center gap-6 pt-6 text-sm"
            style={{
              color: darkMode
                ? "rgba(248, 246, 240, 0.6)"
                : "rgba(64, 18, 104, 0.6)",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#10b981" }}
              />
              <span>Free Shipping ₦50k+</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#10b981" }}
              />
              <span>Crypto Accepted</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#10b981" }}
              />
              <span>7-Day Returns</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Print Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="relative w-full md:w-[70%] max-w-lg mx-auto"
        >
          <div
            className="relative w-full aspect-square rounded-3xl overflow-hidden"
            style={{
              background: darkMode
                ? "linear-gradient(135deg, rgba(197, 163, 255, 0.1), rgba(226, 174, 61, 0.05))"
                : "linear-gradient(135deg, rgba(64, 18, 104, 0.05), rgba(197, 163, 255, 0.1))",
              border: darkMode
                ? "2px solid rgba(197, 163, 255, 0.2)"
                : "2px solid rgba(64, 18, 104, 0.15)",
            }}
          >
            {/* Animated Mockup */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              {/* T-Shirt Mockup */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-full h-full"
              >
                {/* Main T-Shirt Shape */}
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: darkMode
                      ? "linear-gradient(135deg, #2d0d4a, #401268)"
                      : "linear-gradient(135deg, #401268, #c5a3ff)",
                    boxShadow: darkMode
                      ? "0 20px 60px rgba(197, 163, 255, 0.3)"
                      : "0 20px 60px rgba(64, 18, 104, 0.3)",
                  }}
                />

                {/* Print Area */}
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-[20%] rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "2px dashed rgba(64, 18, 104, 0.3)",
                  }}
                >
                  <div className="text-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <Sparkles
                        className="w-12 h-12 mx-auto mb-2"
                        style={{ color: COLORS.primary }}
                      />
                    </motion.div>
                    <p
                      className="text-xs font-bold"
                      style={{ color: COLORS.primary }}
                    >
                      Your Design Here
                    </p>
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    x: [0, 10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 0.5,
                  }}
                  className="absolute -top-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: COLORS.accentWarm,
                    boxShadow: "0 10px 30px rgba(226, 174, 61, 0.4)",
                  }}
                >
                  <span className="text-2xl">✨</span>
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 15, 0],
                    x: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    delay: 1,
                  }}
                  className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: COLORS.secondary,
                    boxShadow: "0 10px 30px rgba(197, 163, 255, 0.4)",
                  }}
                >
                  <span className="text-2xl">🎨</span>
                </motion.div>
              </motion.div>
            </div>

            {/* Process Steps */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS.secondary }}
                />
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-3 gap-4 mt-6"
          >
            {[
              { label: "Designs", value: "20+" },
              { label: "Products", value: "50+" },
              { label: "Delivery", value: "5-7d" },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-4 rounded-xl"
                style={{
                  backgroundColor: darkMode
                    ? "rgba(197, 163, 255, 0.1)"
                    : "rgba(64, 18, 104, 0.05)",
                  border: darkMode
                    ? "1px solid rgba(197, 163, 255, 0.2)"
                    : "1px solid rgba(64, 18, 104, 0.1)",
                }}
              >
                <p
                  className="text-2xl font-black"
                  style={{
                    color: darkMode ? COLORS.secondary : COLORS.primary,
                  }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{
                    color: darkMode
                      ? "rgba(248, 246, 240, 0.6)"
                      : "rgba(64, 18, 104, 0.6)",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </BackgroundLines>
  );
};
