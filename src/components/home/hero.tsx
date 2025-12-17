"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, ArrowRight, Grid3x3 } from "lucide-react";
import Link from "next/link";
import { BackgroundLines } from "@/components/ui/background-lines";

export const Hero = ({ darkMode }: { darkMode: boolean }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <BackgroundLines
      className="flex items-center justify-center w-full min-h-screen relative"
      darkMode={darkMode}
    >
      <div className="relative z-10 max-w-6xl mx-auto px-8 md:px-12 grid md:grid-cols-2 gap-8 items-center w-full">
        {/* Text Content */}
        <motion.div style={{ y, opacity }} className="text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter mb-4"
            style={{ color: darkMode ? "#f8f6f0" : "#401268" }}
          >
            Premium Geek Art
            <br />
            <span style={{ color: "#c5a3ff" }}>on Demand</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-base md:text-lg mb-6"
            style={{
              color: darkMode
                ? "rgba(248, 246, 240, 0.9)"
                : "rgba(64, 18, 104, 0.8)",
            }}
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
                className="group relative px-6 py-3 rounded-xl font-bold text-base shadow-2xl transition-all flex items-center justify-center"
                style={{
                  backgroundColor: "#401268",
                  color: "#ffffff",
                  borderRadius: "12px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2d0d4a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#401268")
                }
              >
                <ShoppingBag className="inline-block w-5 h-5 mr-2" />
                Shop All Designs
                <ArrowRight className="inline-block w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button
              className="px-6 py-3 border-2 rounded-xl font-bold text-base transition-all flex items-center justify-center"
              style={{
                borderColor: darkMode ? "rgba(207, 156, 4, 0.5)" : "#401268",
                color: darkMode ? "#c5a3ff" : "#401268",
                borderRadius: "12px",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = darkMode
                  ? "rgba(197, 163, 255, 0.1)"
                  : "rgba(64, 18, 104, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Grid3x3 className="inline-block w-5 h-5 mr-2" />
              Browse Categories
            </button>
          </motion.div>
        </motion.div>

        {/* Printing Animation Placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="relative"
        >
          <div
            className="w-full h-64 rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: darkMode
                ? "rgba(197, 163, 255, 0.1)"
                : "rgba(64, 18, 104, 0.05)",
              border: darkMode
                ? "2px solid rgba(197, 163, 255, 0.2)"
                : "2px solid rgba(64, 18, 104, 0.1)",
              borderRadius: "16px",
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
                className="w-24 h-24 mx-auto mb-4"
                style={{
                  backgroundColor: "#401268",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShoppingBag
                  className="w-12 h-12"
                  style={{ color: "#ffffff" }}
                />
              </motion.div>
              <p
                className="text-sm"
                style={{
                  color: darkMode
                    ? "rgba(248, 246, 240, 0.7)"
                    : "rgba(64, 18, 104, 0.7)",
                }}
              >
                Printing Process Animation
              </p>
              <p
                className="text-xs mt-2"
                style={{
                  color: darkMode
                    ? "rgba(248, 246, 240, 0.5)"
                    : "rgba(64, 18, 104, 0.5)",
                }}
              >
                (GIF/SVG placeholder)
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </BackgroundLines>
  );
};
